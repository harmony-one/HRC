const express = require('express')
// import or require Harmony class
const { Harmony } = require('@harmony-js/core')
// import or require settings
const { ChainType } = require('@harmony-js/utils')
// import or require simutlated keystore (optional)
const { importKey } = require('./simulated-keystore')
const {
	getContractInstance,
	txContractMethod,
	callContractMethod,
	oneToHexAddress
} = require('./contract-api')
/********************************
Config
********************************/
const config = require('../config')
const { ENV, url, net, port, privateKey, privateKey2 } = config
/********************************
Contract Imports
********************************/
const DAO = require('../build/contracts/DAO.json')
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
// localnet: one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7
// testnet: one1w7lu05adqfhv8slx0aq8lgzglk5vrnwvf5f740
const alice = hmy.wallet.addByPrivateKey(privateKey)
const leo = hmy.wallet.addByPrivateKey(privateKey2)
//one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65
const bob = hmy.wallet.addByMnemonic('surge welcome lion goose gate consider taste injury health march debris kick')
console.log('alice', alice.bech32Address)
console.log('leo', leo.bech32Address)
console.log('bob', bob.bech32Address)
/********************************
Express
********************************/
const app = express()

/********************************
Contract methods
********************************/
/********************************
giveRightToVote
********************************/
//example: localhost:4000/giveRightToVote?voter=one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7
app.get('/giveRightToVote', async (req, res) => {
   let {voter} = req.query
	//prepare args
	console.log("voter", voter)
   voter = oneToHexAddress(hmy, voter)
	//get instance
   const dao = getContractInstance(hmy, DAO)
	//call method
	const { hash, receipt, error} = await txContractMethod(dao, 'giveRightToVote', voter)
	res.send({
		success: !error,
		hash,
		receipt,
	})
})

/********************************
vote
********************************/
//example: localhost:4000/vote?voter=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&proposal=1
app.get('/vote', async (req, res) => {
   let {voter, proposal} = req.query
	//prepare args
	console.log("voter", voter)
	console.log("proposal", proposal)
   voter = oneToHexAddress(hmy, voter)
	//get instance
   const dao = getContractInstance(hmy, DAO)
   hmy.wallet.setSigner(hmy.crypto.getAddress(voter).basicHex)
	//call method
	const { hash, receipt, error} = await txContractMethod(dao, 'vote', proposal)
	res.send({
		success: !error,
		hash,
		receipt,
	})
})

/********************************
winnerName
********************************/
//example: localhost:4000/winnerName
app.get('/winnerName', async (req, res) => {
	//get instance
   const dao = getContractInstance(hmy, DAO)
	//call method
	let winner = await txContractMethod(dao, 'winnerName')
	if (winner === null) {
		res.send({
			success: false,
			message: 'winner is null',
		})
		return
	}
	res.send({
		success: true,
		winner,
	})
})

/********************************
winningProposal
********************************/
//example: localhost:4000/winningProposal
app.get('/winningProposal', async (req, res) => {
	//get instance
   const dao = getContractInstance(hmy, DAO)
	//call method
	let proposal = await txContractMethod(dao, 'winningProposal')
	if (proposal === null) {
		res.send({
			success: false,
			message: 'winning Proposal is null',
		})
		return
	}
	res.send({
		success: true,
		proposal,
	})
})

/********************************
Get Examples
********************************/
app.get('/', (req, res) => {
	res.send({
		success: true,
		message: 'Harmony JS SDK NodeJS API Demo',
		examples: [
			'localhost:4000/giveRightToVote?voter=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65',
			'localhost:4000/vote?voter=one1a2rhuaqjcvfu69met9sque2l3w5v9z6qcdcz65&proposal=2',
			'localhost:4000/winnerName',
			'localhost:4000/winningProposal',
		]
	})
})

app.listen(port, () => console.log(`App listening on port ${port}!`))
