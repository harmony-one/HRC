const express = require('express')
// import or require Harmony class
const { Harmony } = require('@harmony-js/core')
// import or require settings
const { ChainType } = require('@harmony-js/utils')
/********************************
Config
********************************/
const config = require('../config')
const { ENV, url, net, port, privateKey } = config
/********************************
Harmony
********************************/
const hmy = new Harmony(url,
	{
		chainType: ChainType.Harmony,
		chainId: net,
	},
)
// add privateKey to wallet
//one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7
const alice = hmy.wallet.addByPrivateKey(privateKey)
//one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65
const bob = hmy.wallet.addByMnemonic('surge welcome lion goose gate consider taste injury health march debris kick')
console.log('alice', alice.bech32Address)
console.log('bob', bob.bech32Address)
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
app.get('/transfer', async (req, res) => {
    const {to, value} = req.query
	if (!to || !value) {
		res.send({success: false, message: 'missing to or value query params e.g. localhost:3000/transfer?to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1'})
		return
	}
	console.log(to, value)
	//prevent accidental re-entry if transaction is in flight
	if (transfers[to]) return
	transfers[to] = true
	//prepare transaction
	const tx = hmy.transactions.newTx({
        to,
        value: new hmy.utils.Unit(value).asEther().toWei(),
        gasLimit: '21000',
        shardID: 0,
        toShardID: 0,
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    });
    const signedTX = await hmy.wallet.signTransaction(tx);
    signedTX.observed().on('transactionHash', (txHash) => {
        console.log('--- txHash ---', txHash)
    }).on('receipt', (receipt) => {
		// console.log('--- receipt ---', receipt)
		transfers[to] = false //can send again
		res.send({ success: true, receipt })
    }).on('error', console.error)
    const [sentTX, txHash] = await signedTX.sendTransaction()
    const confirmedTX = await sentTX.confirm(txHash)
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
	//rpc call
	const result = (await hmy.blockchain.getBalance({ address }).catch((error) => {
		res.send({success: false, error })
	})).result
	if (result) {
		res.send({success: true, balance: new hmy.utils.Unit(result).asWei().toEther()})
	}
})
app.get('/', (req, res) => {
	res.send({
		success: true,
		message: 'Harmony JS SDK NodeJS API Demo',
		examples: [
			'localhost:3000/transfer?to=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&value=1',
			'localhost:3000/balance?address=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65'
		]
	})
})
app.listen(port, () => console.log(`App listening on port ${port}!`))