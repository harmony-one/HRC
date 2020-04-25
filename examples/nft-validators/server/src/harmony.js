
const { Harmony } = require('@harmony-js/core')
// import or require settings
const { ChainType } = require('@harmony-js/utils')
// import or require simutlated keystore (optional)
const { importKey } = require('./simulated-keystore')
/********************************
Config
********************************/
const config = require('./../config')
const { net, url, privateKey } = config
/********************************
Harmony Setup
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

const initHarmony = exports.initHarmony = async (url, from) => {
    //prepare Harmony instance
    const hmy = createHmy(url)
    await setSharding(hmy)
    if (from) {
        const pkey = importKey(from)
        if(pkey) {
            hmy.wallet.addByPrivateKey(pkey)
            hmy.wallet.setSigner(hmy.crypto.getAddress(from).basicHex)
        } else {
            return {success: false, message: `account ${from} not in keystore`}
        }
    } else {
        setDefaultWallets(hmy)
	}
    return {success: true, hmy}
}


exports.toWei = (hmy, amount) => new hmy.utils.Unit(amount).asEther().toWei()

/********************************
Get balances
********************************/
// localhost:3000/balance?address=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65
exports.balance = async function balance(req, res) {
	const {address} = req.query
	if (!address) {
		res.send({success: false, message: 'missing address query param e.g. localhost:3000/transfer?to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1'})
	}
	const balances = await getBalance(address)
	if(!err) res.send({success: true, balances: balances})
}

exports.getBalance = async (address) => {
	const initRes = await initHarmony(url) //from config
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
	return balances
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
exports.transfer = async function transfer(req, res) {
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
