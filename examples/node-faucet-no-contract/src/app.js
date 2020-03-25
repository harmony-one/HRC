const express = require('express')
const path = require('path');
const shajs = require('sha.js')
const db = require('diskdb')
const { Mutex } = require('async-mutex')
const { initHarmony, transfer } = require('./harmony')

/********************************
Initialization
********************************/
const ONE = 1000000000000000000 // 1 ONE in atto
const mutex = new Mutex()
let addressMap = new Map()
let queue = []
const txFrequency = 15000 // 15 seconds in ms


/********************************
Database Initialization
********************************/
db.connect('./', ['funded'])

/********************************
Config
********************************/
const config = require('../config')
const { url, port, timeLimit, txRate } = config

/********************************
Express
********************************/
const app = express()
app.use(express.static('public'))


/********************************
Expose Contract Address
********************************/
app.get('/exposeAddress', async (req, res) => {
	const initRes = await initHarmony(url)
	const { success, hmy } = initRes
	if (!success) {
		res.send(initRes)
		return
	}
	const faucetAddress = hmy.wallet.signer.bech32Address
	res.send({
		success: faucetAddress ? "true" : "false",
		faucetAddress
	})
})

/********************************
Fund Account
********************************/
//e.g.
// http://localhost:3000/fund?address=one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7// -> 0x7c41e0668b551f4f902cfaec05b5bdca68b124ce
app.get('/fund', async (req, res) => {
	const initRes = await initHarmony(url)
	const { success, hmy } = initRes
	if (!success) {
		res.send(initRes)
		return
	}

	let {address} = req.query

	//prepare args for contract call
	if(! hmy.utils.isValidAddress(address)){
		res.send({
			success: false,
			message: `Invalid ONE address ${address}`
		})
		console.error(`Invalid ONE address ${address}`)
		return
	}
	console.log('bech32 address:', address)

	//Check if address has already been funded
	if( db.funded.findOne({address}) && 
		db.funded.findOne({address}).time > (Date.now() - timeLimit)){
		res.send({
			success: false,
			message: `This address has already been funded at ${new Date(db.funded.findOne({address}).time).toLocaleString()}`
		})
		return
	}
	
	let faucetBalance = await hmy.wallet.signer.getBalance()
	faucetBalance = faucetBalance.balance
	console.log('balance', faucetBalance)
	if(faucetBalance < (queue.length+1)*(txRate)) {
		res.send({
			success: false,
			message: `The faucet does not have enough funds`
		})
		return
	}
	

	//mutex needed for critical section involving queue
	const release = await mutex.acquire()
	//Check if this ip + user agent is already in queue
	if(queue.find((pending)=> pending.key === shajs('sha256').update(req.ip + req.get('user-agent')).digest('hex'))){
		res.send({
			success: false,
			message: 'Too many requests from your ip, please try again later'
		})
		release()
		return
	}
	//add address to queue
	queue.push({
		key: shajs('sha256').update(req.ip + req.get('user-agent')).digest('hex'),
		address: address,
		created: Date.now()
	})
	//end of critical section
	release()
	res.send({
		success: true,
		message: `Your faucet request has been queued, ETA: ~${queue.length*15} seconds`
	})
})

//Logic to consume the queue. Runs every txFrequency ms, which should be larger than block time.
setInterval(async () => {
	let front
	let fundedAddress
	//throw out addresses that have already been funded
	do {
		front = queue.sort((a, b) => a.created - b.created).pop()
	} while (front && 
		db.funded.findOne({address: front.address}) && 
		db.funded.findOne({address: front.address}).time > (Date.now() - timeLimit));

	if(!front) {
		console.log(new Date().toISOString(), "  queue is empty.")
		return
	}

	const initRes = await initHarmony(url)
	const { success, hmy } = initRes
	if (!success) {
		console.error(`Could not initialize Harmony instance`)
		return
	}

	//Get account balance before faucet call
	let accountBalance1 = (await hmy.blockchain.getBalance({ address:front.address }).catch((error) => {
		console.error(error)
	})).result
	accountBalance1 = new hmy.utils.Unit(accountBalance1).asWei().toEther()

	try {
		await transfer(front.address, txRate)
		//Get account balance after faucet call
		let accountBalance2 = (await hmy.blockchain.getBalance({ address:front.address }).catch((error) => {
			console.error(error)
		})).result
		accountBalance2 = new hmy.utils.Unit(accountBalance2).asWei().toEther()
		//If account balance changed, funding was successful
		if(accountBalance1 < accountBalance2){ 
			addressMap.set(front.address, Date.now())
			db.funded.update({address: front.address}, {address: front.address, time: Date.now()}, {upsert: true})
		}
		else console.error('Account has not been funded')
	} catch(err) {
		console.error(err)
	}
}, txFrequency)

app.get('/balance', balance)

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(port, () => console.log(`App listening on port ${port}!`))


/********************************
Helpers
********************************/
/********************************
Get balances
********************************/
// localhost:3000/balance?address=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65
async function balance(req, res) {
	const {address} = req.query
	if (!address) {
		res.send({success: false, message: 'missing address query param e.g. localhost:3000/transfer?to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1'})
	}

	const initRes = await initHarmony(url)
	const { success, hmy } = initRes
	if (!success) {
		res.send(initRes)
		return
	}

	let balances = []
	let err = false

	//get shard information for the network
	const shards = (await hmy.blockchain.getShardingStructure()).result

	//get balance for each shard
	for(let i = 0; i < shards.length; i++){
		const shard = shards[i]

		const initRes = await initHarmony(shard.http)
		const { success, hmy } = initRes
		if (!success) {
			res.send(initRes)
			return
		}

		//rpc call
		const result = (await hmy.blockchain.getBalance({ address }).catch((error) => {
			res.send({success: false, error })
			err = true
		})).result
		if (err) break
		if (result) {
			balances.push({ "shard": shard.shardID, balance: new hmy.utils.Unit(result).asWei().toEther()})
		}
	}
	if(!err) res.send({success: true, balances: balances})
	
}