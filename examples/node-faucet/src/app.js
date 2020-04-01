const express = require('express')
const path = require('path');
const shajs = require('sha.js')
const { Mutex } = require('async-mutex')
// import or require simutlated keystore (optional)
const { importKey } = require('./simulated-keystore')
const { initHarmony } = require('./harmony')
/********************************
Contract Helpers
********************************/
const {
	getContractInstance,
	getContractAddress,
	txContractMethod,
	callContractMethod,
	oneToHexAddress,
	hexToOneAddress
} = require('./contract')
const FaucetJSON = require('../build/contracts/Faucet.json')

/********************************
Initialization
********************************/
const ONE = 1000000000000000000 // 1 ONE in atto
const mutex = new Mutex()
let addressMap = new Map()
let queue = []
const txFrequency = 15000 // 15 seconds in ms

/********************************
Config
********************************/
const config = require('../config')
const { url, port, timeLimit, txRate, proxy } = config

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
	const faucetAddress = hexToOneAddress(hmy, getContractAddress(FaucetJSON))
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
	console.log('bech32 address:', address)
	address = oneToHexAddress(hmy, address)
	console.log('hex address:', address)

	//Check if address has already been funded
	if(addressMap.has(address) && addressMap.get(address) > (Date.now() - timeLimit)){
		res.send({
			success: false,
			message: `This address has already been funded at ${new Date(addressMap.get(address)).toLocaleString()}`
		})
		return
	}
	//Check if faucet has enough funds to complete transaction
	const faucetAddress = hexToOneAddress(hmy, getContractAddress(FaucetJSON))
	let faucetBalance = (await hmy.blockchain.getBalance({ address:faucetAddress }).catch((error) => {
		res.send({success: false, message: "Could not connect to Harmony"})
		err = true
	})).result
	faucetBalance = new hmy.utils.Unit(faucetBalance).asWei().toEther()
	console.log('balance', faucetBalance)
	if(faucetBalance < (queue.length+1)*(txRate/ONE)) {
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

setInterval(async () => {
	let front
	//throw out addresses that have already been funded
	do {
		front = queue.sort((a, b) => a.created - b.created).pop()
	} while (front && addressMap.has(front.address) && addressMap.get(front.address) > (Date.now() - timeLimit));

	if(!front) {
		console.log(new Date().toISOString(), "  queue is empty.")
		return
	}

	const initRes = await initHarmony(url)
	const { success, hmy } = initRes
	if (!success) {
		res.send(initRes)
		return
	}

	//Get account balance before faucet call
	let accountBalance1 = (await hmy.blockchain.getBalance({ address:front.address }).catch((error) => {
		res.send({success: false, message: "Could not connect to Harmony"})
	})).result
	accountBalance1 = new hmy.utils.Unit(accountBalance1).asWei().toEther()

	const faucet = getContractInstance(hmy, FaucetJSON)
	const faucetBalance = await callContractMethod(faucet, 'getBalance')
	console.log('faucet balance:', faucetBalance.toString())
	try {
		const { hash, receipt, error} = await txContractMethod(faucet, 'fund', front.address)
		if (error) {
			console.error(error)
			return
		}
		//Get account balance after faucet call
		let accountBalance2 = (await hmy.blockchain.getBalance({ address:front.address }).catch((error) => {
			res.send({success: false, message: "Could not connect to Harmony"})
		})).result
		accountBalance2 = new hmy.utils.Unit(accountBalance2).asWei().toEther()
		//If account balance changed, funding was successful
		if(accountBalance1 < accountBalance2) addressMap.set(front.address, Date.now())
		else console.error('Account has not been funded')
	} catch(err) {
		console.error(err)
	}
}, txFrequency)


/********************************
Add funds using endpoint
********************************/
// app.get('/addfunds', async (req, res) => {
// 	const initRes = await initHarmony(url)
// 	const { success, hmy } = initRes
// 	if (!success) {
// 		res.send(initRes)
// 		return
// 	}
// 	/********************************
// 	@todo check make sure address works and amount is valid
// 	********************************/
// 	let {amount} = req.query
// 	const faucet = hexToOneAddress(hmy, getContractAddress(FaucetJSON))
// 	console.log('\n\nFunding Faucet:', faucet, amount)
// 	await transfer({query: { to: faucet, value: amount}}, res)
// })

//example:
// localhost:3000/transfer?to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1
// localhost:3000/transfer?from=one1w7lu05adqfhv8slx0aq8lgzglk5vrnwvf5f740&to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1
// localhost:3000/transfer?to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1&fromshard=0&toshard=1


// app.get('/transfer', transfer)

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

/********************************
ONE Transfers
********************************/

/********************************
Transfer
********************************/
let transfers = {
	address: true
}
async function transfer(req, res) {
    const {to, from, toshard, fromshard, value} = req.query

	if (!to || !value) {
		res.send({success: false, message: 'missing to or value query params e.g. localhost:3000/transfer?to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1'})
		return
	}
	
	const initRes = await initHarmony(url)
	const { success, hmy } = initRes
	if (!success) {
		res.send(initRes)
		return
	}

	const toShard = !toshard ? 0x0 : '0x' + toshard
	const fromShard = !fromshard ? 0x0 : '0x' + fromshard
	console.log(to, value)
	
	//prevent accidental re-entry if transaction is in flight
	if (transfers[to]) return
	transfers[to] = true
	//prepare transaction
	const tx = hmy.transactions.newTx({
        to,
        value: new hmy.utils.Unit(value).asEther().toWei(),
        gasLimit: '1000000',
        shardID: fromShard,
        toShardID: toShard,
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    });
    const signedTX = await hmy.wallet.signTransaction(tx);
    signedTX.observed().on('transactionHash', (txHash) => {
        console.log('--- txHash ---', txHash)
    }).on('receipt', (receipt) => {
		console.log('--- receipt ---', receipt)
		transfers[to] = false //can send again
		res.send({ success: true, receipt })
    }).on('error', (error) => {
		console.error(error)
		res.send({ success: false })
	})
    const [sentTX, txHash] = await signedTX.sendTransaction()
    try {
		await sentTX.confirm(txHash)
	}
	catch (error){
		res.send({ success: false })
	}
}
