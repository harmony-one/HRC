import {reducer} from '../util/redux-util'
import HarmonyERC20 from '../build/contracts/HarmonyERC20.json'

//state
const defaultState = {
    tags: [],
    encrypted: [],
    revisions: [],
    chat: [],
    decrypted: '',
}
const contractKeys = Object.keys(defaultState)
export const contractState = ({ contractReducer: { ...keys } }) => {
    Object.keys(keys).forEach((k) => {
        if (!contractKeys.includes(k)) delete keys[k]
    })
    return keys
}
/********************************
Functions / Actions
********************************/
export const loadContracts = () => async (dispatch, getState) => {
    const { Harmony } = require('@harmony-js/core');
    const { ChainID, ChainType } = require('@harmony-js/utils');

    const address = `one1spshr72utf6rwxseaz339j09ed8p6f8ke370zj`
    const harmony = new Harmony(`ws://localhost:9800`, {
        chainType: ChainType.Harmony, 
        chainId: ChainID.HmyTestnet,
    })
    console.log(harmony)
    harmony.blockchain
    .getBalance({
        address,
    })
    .then((res) => {
        console.log(new harmony.utils.Unit(res.result).asWei().toEther());
    })
    .catch((err) => {
        console.log(err);
    })

    const sender = harmony.wallet.addByMnemonic('surge welcome lion goose gate consider taste injury health march debris kick')
    console.log(sender)
    harmony.wallet.setSigner(sender.address);

    const contract = await harmony.contracts.createContract(HarmonyERC20.abi, HarmonyERC20.networks[2].address)
    console.log(contract)
    const balance = await contract.methods.balanceOf(harmony.wallet.accounts[0]).call({
        gasLimit: '210000',
        gasPrice: '100000',
    })
    console.log(balance.toString())

    contract.events.Transfer({
        fromBlock: 0
    }, function(error, event){ console.log(event); })
}

//reducer
export const contractReducer = (state = {
    ...defaultState
}, action) => reducer(state, action)
