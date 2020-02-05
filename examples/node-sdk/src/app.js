const express = require('express')
// import or require Harmony class
const { Harmony } = require('@harmony-js/core')
// import or require settings
const { ChainType } = require('@harmony-js/utils')
// import or require simutlated keystore (optional)
const { importKey } = require('./simulated-keystore')
/********************************
Config
********************************/
const config = require('../config')
const { ENV, url, net, port, privateKey } = config

/********************************
Harmony
********************************/
const createHmy = (url) => new Harmony(url,
	{
		chainType: ChainType.Harmony,
		chainId: net,
	},
)

async function setSharding(hmy){
	const res = await hmy.blockchain.getShardingStructure();
	hmy.shardingStructures(res.result);
}


/********************************
Wallet Setup
********************************/
function setDefaultWallets(hmy){
// add privateKey to wallet
// localnet: one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7
// testnet: one1w7lu05adqfhv8slx0aq8lgzglk5vrnwvf5f740
const alice = hmy.wallet.addByPrivateKey(privateKey)
	hmy.wallet.setSigner(alice.address)
//one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65
const bob = hmy.wallet.addByMnemonic('surge welcome lion goose gate consider taste injury health march debris kick')
console.log('alice', alice.bech32Address)
console.log('bob', bob.bech32Address)
}

/********************************
Express
********************************/
const app = express()

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

/********************************
Get balance
********************************/
// localhost:3000/balance?address=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65
app.get('/balance', async (req, res) => {
	const {address} = req.query
	if (!address) {
		res.send({success: false, message: 'missing address query param e.g. localhost:3000/transfer?to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1'})
	}

	//create base harmony instance
	let hmy = createHmy(url)
	let balances = []
	let err = false

	//get shard information for the network
	const shards = (await hmy.blockchain.getShardingStructure()).result

	//get balance for each shard
	for(let i = 0; i < shards.length; i++){
		const shard = shards[i]

		//create new harmony instance for each shard
		hmy = createHmy(shard.http)

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
	
})

/********************************
Get Examples
********************************/
app.get('/', (req, res) => {
	res.send({
		success: true,
		message: 'Harmony JS SDK NodeJS API Demo',
		examples: [
			'localhost:3000/transfer?to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1',
			'localhost:3000/balance?address=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65',
			'localhost:3000/transfer?from=one1w7lu05adqfhv8slx0aq8lgzglk5vrnwvf5f740&to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1'
		]
	})
})

app.listen(port, () => console.log(`App listening on port ${port}!`))