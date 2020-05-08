import web3 from 'web3'

import { getReducer, getState } from '../util/redux-util'

//harmony imports
import { getContract, waitForInjected, getExtAccount } from '../util/hmy-util'
import { Harmony, HarmonyExtension } from '@harmony-js/core'
import { ChainID, ChainType } from '@harmony-js/utils'

//import contract ABI
import NameService from '../build/contracts/NameService.json'

//from config.js
import config from '../../config'
const { net, url } = config


//default state
const defaultState = {
	hmy: null,
	account: null,
	initialized: false,
	nameFromChain: '',
}
const type = 'harmonyReducer'
export const harmonyReducer = getReducer(type, defaultState)
export const harmonyState = getState(type)
//functions
const weiToOne = (hmy, v) => Math.floor(new hmy.utils.Unit(v).asWei().toEther() * 10000) / 10000

export const init = () => async (dispatch, getState) => {
	

	// console.log(url)
    const hmy = new Harmony(url, {
        chainType: ChainType.Harmony,
        chainId: net,
    })
	dispatch({ type, hmy })

    // 0x7c41e0668b551f4f902cfaec05b5bdca68b124ce
    const account = hmy.wallet.addByPrivateKey('45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e')
    account.name = 'Alice'
    

	let balance = (await hmy.blockchain.getBalance({ address: account.address, shardID: 0 }).catch((err) => {
		console.log(err);
	}))
    account.balanceONE = weiToOne(hmy, balance ? balance.result : 0)


	dispatch({ type, account, hmy, initialized: true })
}


export const setAddressName = (name) => async (dispatch, getState) => {
	const { hmy, account } = getState().harmonyReducer
	const { contract } = getContract({ hmy }, NameService)

	name = web3.utils.asciiToHex(name).padEnd(66, '0')

	const tx = contract.methods.setName(name).send({
        from: account.address,
        gasLimit: '2000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    }).on('transactionHash', function (hash) {
        console.log('hash', hash)
    }).on('receipt', function (receipt) {
        console.log('receipt', receipt)
    }).on('confirmation', async (confirmation) => {
        console.log('confirmation', confirmation)
    }).on('error', console.error)
}


export const getNameByAddress = (address) => async (dispatch, getState) => {
	const { hmy, account } = getState().harmonyReducer
	const { contract } = getContract({ hmy }, NameService)

	const name = await contract.methods.getName(address).call({
        from: account.address,
        gasLimit: '2000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
	})
	const nameFromChain = web3.utils.hexToAscii(name)
	dispatch({ type, nameFromChain })
}