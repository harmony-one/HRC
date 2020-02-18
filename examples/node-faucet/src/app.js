const express = require('express')
const path = require('path');
// import or require simutlated keystore (optional)
const { importKey } = require('./simulated-keystore')
const { initHarmony } = require('./harmony')
/********************************
Contract Helpers
********************************/
const {
	getContractInstance,
	txContractMethod,
	callContractMethod,
	oneToHexAddress
} = require('./contract')
const FaucetJSON = require('../build/contracts/Faucet.json')
/********************************
Config
********************************/
const config = require('../config')
const { url, port } = config

/********************************
Express
********************************/
const app = express()


//e.g.
// http://localhost:3000/fund?address=one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7// -> 0x7c41e0668b551f4f902cfaec05b5bdca68b124ce
app.get('/fund', async (req, res) => {
	const initRes = await initHarmony(url)
	const { success, hmy } = initRes
	if (!success) {
		res.send(initRes)
		return
	}
	/********************************
	@todo check make sure address works and amount is valid
	********************************/
	let {address} = req.query
	//prepare args for contract call
	address = oneToHexAddress(hmy, address)
	console.log('hex address:', address)
	const faucet = getContractInstance(hmy, FaucetJSON)
	//get faucet balance
	const faucetBalance = await callContractMethod(faucet, 'getBalance')
	console.log('faucet balance:', faucetBalance.toString())
	//call method
	const { hash, receipt, error} = await txContractMethod(faucet, 'fund', address)
	
	if (error) {
		res.send({
			success: !error,
			hash,
			receipt,
		})
		return
	}
	await balance(req, res)
})

app.get('/balance', balance)

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(port, () => console.log(`App listening on port ${port}!`))


/********************************
Helpers
********************************/


/********************************
Get balance
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
//example:
// localhost:3000/transfer?to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1
// localhost:3000/transfer?from=one1w7lu05adqfhv8slx0aq8lgzglk5vrnwvf5f740&to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1
// localhost:3000/transfer?to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1&fromshard=0&toshard=1
app.get('/transfer', async (req, res) => {
    const {to, from, toshard, fromshard, value} = req.query

	if (!to || !value) {
		res.send({success: false, message: 'missing to or value query params e.g. localhost:3000/transfer?to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1'})
		return
	}
	const hmy = createHmy(url)

	await setSharding(hmy);
	//defaults to shard 0
	const toShard = !toshard ? 0x0 : '0x' + toshard
	const fromShard = !fromshard ? 0x0 : '0x' + fromshard
	console.log(to, value)
	//checks for from argument and attempts to set address as signer
	//will fail if key isn't in keystore
	if (from) {
		const pkey = importKey(from)
		if(pkey) {
			hmy.wallet.addByPrivateKey(pkey)
			hmy.wallet.setSigner(hmy.crypto.getAddress(from).basicHex)
		}
		else {
			res.send({success: false, message: `account ${from} not in keystore`})
			return
		}
	} else {
		//no from argument found:
		//initialize default wallets and set signer to default if from argument isn't used
		setDefaultWallets(hmy)
	}
	//prevent accidental re-entry if transaction is in flight
	if (transfers[to]) return
	transfers[to] = true
	//prepare transaction
	const tx = hmy.transactions.newTx({
        to,
        value: new hmy.utils.Unit(value).asEther().toWei(),
        gasLimit: '21000',
        shardID: fromShard,
        toShardID: toShard,
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    });
    const signedTX = await hmy.wallet.signTransaction(tx);
    signedTX.observed().on('transactionHash', (txHash) => {
        console.log('--- txHash ---', txHash)
    }).on('receipt', (receipt) => {
		// console.log('--- receipt ---', receipt)
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
})