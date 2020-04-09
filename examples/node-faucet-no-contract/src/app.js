const express = require('express')
const path = require('path');
const shajs = require('sha.js')
const low = require('lowdb')
const fetch = require('node-fetch')
const { Mutex } = require('async-mutex')
const { initHarmony, transfer, toOneAddress } = require('./harmony')
const htmlPage = require('./index')

/********************************
Initialization
********************************/
const ONE = 1000000000000000000 // 1 ONE in atto
const queueMutex = new Mutex()
const fundMutex = new Mutex()
let addressMap = new Map()
let queue = []
const txFrequency = 15000 // 15 seconds in ms


/********************************
Database Initialization
********************************/
const FileSync = require('lowdb/adapters/FileAsync')
const adapter = new FileSync('db.json')
let db

/********************************
Config
********************************/
const config = require('../config')
const { url, port, timeLimit, txRate, recaptchaSecretKey, proxy, usageLimit } = config

/********************************
Express
********************************/
const app = express()
app.use(express.static('public'))
app.set('trust proxy', proxy)


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
app.post('/fund', express.json(), async (req, res) => {
	const initRes = await initHarmony(url)
	const { success, hmy } = initRes
	if (!success) {
		res.send(initRes)
		return
	}

	let {address, token} = req.body || {}
	if (!(address && token)) {
		res.send({
			success: false,
			message: "Missing address or reCAPTCHA token"
		})
		return
	}

	//Verify reCaptcha response token
	const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify`
	let recaptchaResponse = await fetch(recaptchaUrl, {
		method: 'POST',
		headers: {
			'Content-type': 'application/x-www-form-urlencoded'
		},
		body: `secret=${recaptchaSecretKey}&response=${token}`
	})
	recaptchaResponse = await recaptchaResponse.json()
	console.log(recaptchaResponse)
	if(!recaptchaResponse.success){
		res.send({
			success: false,
			message: `reCAPTCHA verification failed`
		})
		console.log(recaptchaResponse["error-codes"])
		return
	}

	//prepare args for contract call
	try {
		address = toOneAddress(hmy, address)
	} catch (error) {
		res.send({
			success: false,
			message: `Invalid ONE address ${address}`
		})
		console.error(error)
		return
	}
	console.log('bech32 address:', address)

	//Check if address has already been funded
	if( db.get('funded').find(x => x.address==address).get('time').value() > (Date.now() - timeLimit)){
		res.send({
			success: false,
			message: `This address has already been funded at ${new Date(db.get('funded').find(x => x.address==address).get('time').value()).toLocaleString()}`
		})
		return
	}
	
	let faucetBalance = await hmy.wallet.signer.getBalance()
	faucetBalance = faucetBalance.balance
	console.log('balance', faucetBalance)
	if(faucetBalance < (queue.length+1)*(parseInt(txRate) * ONE)) {
		res.send({
			success: false,
			message: `The faucet does not have enough funds`
		})
		return
	}
	

	//mutex needed for critical section involving queue
	const release = await queueMutex.acquire()
	//Check if this ip + user agent is already in queue
	try {
		if(queue.find((pending) => pending.key === req.ip) || (
			(db.get('ips').find({ip:req.ip}).get('useCount').value() || 0) >= usageLimit)
		){
			res.send({
				success: false,
				message: `Too many requests from your ip: current limit: ${usageLimit} use(s)`
			})
			return
		}
		//add address to queue
		queue.push({
			key: req.ip,
			address: address,
			created: Date.now()
		})
		//end of critical section
		res.send({
			success: true,
			message: `Your faucet request has been queued, ETA: ~${parseInt(queue.length*(txFrequency/1000))} seconds`
		})
	} catch (error) {
		console.error(error)
		res.send({
			success: false,
			message: 'An unexpected error has occurred!'
		})
		return
	} finally {
		release()
	}
})

//Logic to consume the queue. Runs every txFrequency ms, which should be larger than block time.
setInterval(async () => {
	let front

	//critical section, only allow one thread at a time to pop queue and perform transaction
	//prevents case where 2 transactions can be fired off at once
	const release = await fundMutex.acquire()
	try {
		do {
			front = queue.sort((a, b) => a.created - b.created).pop()
		//throw out addresses that have already been funded and ips that violate usage limit
		} while (front && (
			db.get('funded').find({address:front.address}).get('time') > (Date.now() - timeLimit) ||
			db.get('ips').find({ip:front.key}).get('useCount').value() > usageLimit
		));

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

		const useCount = db.get('ips').find({ip:front.key}).get('useCount').value() || 0

		//Get account balance before faucet call
		let accountBalance1 = (await hmy.blockchain.getBalance({ address:front.address }).catch((error) => {
			console.error(error)
		})).result
		accountBalance1 = new hmy.utils.Unit(accountBalance1).asWei().toEther()

		await transfer(front.address, txRate)
		//Get account balance after faucet call
		let accountBalance2 = (await hmy.blockchain.getBalance({ address:front.address }).catch((error) => {
			console.error(error)
		})).result
		accountBalance2 = new hmy.utils.Unit(accountBalance2).asWei().toEther()
		//If account balance changed, funding was successful
		if(accountBalance1 < accountBalance2){ 
			addressMap.set(front.address, Date.now())
			await db.get('funded').remove({address:front.address}).write()
				.then(()=>db.get('funded').push({address: front.address, time: Date.now()}).write())
				.then(()=>db.get('ips').remove({ip:front.key}).write())
				.then(()=>db.get('ips').push({ip: front.key, useCount: useCount+1}).write())
		}
		else {
			console.error(`Account has not been funded, readding ${front.address} to queue`)
			queue.push(front)
		}
	} catch(err) {
		console.error(err)
	} finally {
		//end of critical section
		release()
	}
}, txFrequency)

app.get('/balance', balance)

app.get('/', (req, res) => {
	res.setHeader('Content-type','text/html')
	res.send(htmlPage);
})


/********************************
Server Init
********************************/

low(adapter).then(database =>{
	db = database
	app.listen(port, () => console.log(`App listening on port ${port}!`))
})


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