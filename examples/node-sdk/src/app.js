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
const sender = harmony.wallet.addByPrivateKey(privateKey)
/********************************
Express
********************************/
const app = express()
//example: localhost:3000/example?to=&value=1
app.get('/transfer', async (req, res) => {
    const to = req.query.to
	const value = new hmy.utils.Unit(req.query.value).asEther().toWei();
	//prepare transaction
	const tx = hmy.transactions.newTx({
        to,
        value,
        gasLimit: '21000',
        shardID: 0,
        toShardID: 0,
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    });
    const signedTX = await hmy.wallet.signTransaction(tx);
    signedTX.observed().on('transactionHash', (txHash) => {
        console.log('--- txHash ---', txHash)
    })
    .on('receipt', (receipt) => {
		console.log('--- receipt ---', receipt)
		res.send({ success: true, receipt })
    }).on('error', console.error)
    const [sentTX, txHash] = await signedTX.sendTransaction()
    // const confirmedTX = await sentTX.confirm(txHash)
})
app.get('/getBalance', (req, res) => {

	res.send({ success: true, message: 'Harmony JS SDK NodeJS API Demo' })
})
app.get('/', (req, res) => {
	res.send({
		success: true,
		message: 'Harmony JS SDK NodeJS API Demo',
		commands: [
			'/getBalance',
			'/transfer'
		]
	})
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))