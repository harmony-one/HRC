import { UPDATE, reducer } from '../util/redux-util'
import HarmonyERC20 from '../build/contracts/HarmonyERC20.json'



//state
const defaultState = {
    hmy: null,
    active: null,
    minter: null,
    account: null,
    contract: null,
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
export const setActive = (which) => async (dispatch, getState) => {
    const state = getState().contractReducer
    const active = state[which]
    if (!active) return
    dispatch({ type: UPDATE, active })
    dispatch(getBalances(active))
}
export const getBalances = (account) => async (dispatch, getState) => {
    dispatch(getBalanceONE(account))
    dispatch(getBalanceHRC(account))
}
export const getBalanceONE = (account) => async (dispatch, getState) => {
    const { hmy } = getState().contractReducer
    if (!hmy) {
        console.log('call loadContracts first')
        return
    }
    const { result } = await hmy.blockchain.getBalance({ address: account.address }).catch((err) => {
        console.log(err);
    })
    account.balanceONE = new hmy.utils.Unit(result).asWei().toEther()
    dispatch({ type: UPDATE, [account.name]: account })
}
export const getBalanceHRC = (account) => async (dispatch, getState) => {
    const { contract } = getState().contractReducer
    if (!contract) {
        console.log('call loadContracts first')
        return
    }
    account.balanceHRC = (await contract.methods.balanceOf(account.address).call({
        gasLimit: '210000',
        gasPrice: '100000',
    })).toString()
    dispatch({ type: UPDATE, [account.name]: account })
}
export const loadContracts = () => async (dispatch) => {
    const { Harmony } = require('@harmony-js/core');
    const { ChainID, ChainType } = require('@harmony-js/utils');

    const hmy = new Harmony(`ws://localhost:9800`, {
        chainType: ChainType.Harmony,
        chainId: ChainID.HmyTestnet,
    })
    dispatch({ type: UPDATE, hmy })
    // console.log(hmy.wallet)

    // 0x7c41e0668b551f4f902cfaec05b5bdca68b124ce
    const minter = hmy.wallet.addByPrivateKey('45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e')
    minter.name = 'Minter'
    // 0xea877e7412c313cd177959600e655f8ba8c28b40
    const account = hmy.wallet.addByMnemonic('surge welcome lion goose gate consider taste injury health march debris kick')
    account.name = 'My Account'
    dispatch({ type: UPDATE, minter, account })
    hmy.wallet.setSigner(minter.address);
    //get contract
    const contract = await hmy.contracts.createContract(HarmonyERC20.abi, HarmonyERC20.networks[2].address)

    // const tx = contract.methods.transfer(account.address, 20000).send({
    //     from: account.address,
    //     gasLimit: '1000000',
    //     gasPrice: '500000',
    // }).on('transactionHash', function(hash){
    //     console.log(hash)
    //     // debug in your harmony localnet root dir
    //     // example: grep -rIn 0x35021f0e981f89fc24bbe46eb6ed26150beaf4e54f18c65a7068f4f21a841968.
    // }).on('receipt', function(receipt){
    //     console.log(receipt)
    // }).on('confirmation', function(confirmationNumber, receipt){
    //     console.log(confirmationNumber, receipt)
    // }).on('error', console.error);

    dispatch({ type: UPDATE, contract, active: account })
    dispatch(getBalanceONE(minter))
    dispatch(getBalanceONE(account))
    dispatch(getBalanceHRC(minter))
    dispatch(getBalanceHRC(account))

    return

    console.log(sender)

    console.log(contract)
    const balanceHRC = await contract.methods.balanceOf(harmony.wallet.accounts[0]).call({
        gasLimit: '210000',
        gasPrice: '100000',
    })
    console.log(balanceHRC.toString())

    contract.events.Transfer({
        fromBlock: 0
    }, function (error, event) { console.log(event); })
}

//reducer
export const contractReducer = (state = {
    ...defaultState
}, action) => reducer(state, action)
