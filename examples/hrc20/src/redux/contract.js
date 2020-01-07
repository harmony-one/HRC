import { UPDATE, reducer } from '../util/redux-util'
import HarmonyMintable from '../build/contracts/HarmonyMintable.json'
import HRC20Crowdsale from '../build/contracts/HRC20Crowdsale.json'

//state
const defaultState = {
    hmy: null,
    active: null,
    minter: null,
    account: null,
    bech32Addresses: [],
    addresses: [],
    tokenContract: null,
    saleContract: null,
    processing: false,
}
const contractKeys = Object.keys(defaultState)
export const contractState = ({ contractReducer: { ...keys } }) => {
    Object.keys(keys).forEach((k) => {
        if (!contractKeys.includes(k)) delete keys[k]
    })
    return keys
}

const getContractInstance = (hmy, artifact) => {
    console.log(artifact.networks)
    return hmy.contracts.createContract(artifact.abi, artifact.networks[2].address)
}
/********************************
Functions / Actions
********************************/
export const transferONE = ({ amount, address }) => async (dispatch, getState) => {
    dispatch({ type: UPDATE, processing: true })
    const { hmy } = getState().contractReducer
    if (!hmy) {
        console.log('call loadContracts first')
        return
    }
    console.log(amount, address)
    const tx = hmy.transactions.newTx({
        to: address,
        value: new hmy.utils.Unit(amount).asEther().toWei(),
        gasLimit: '210000',
        shardID: 0,
        toShardID: 0,
        gasPrice: new hmy.utils.Unit('10').asGwei().toWei(),
    });
    const signedTX = await hmy.wallet.signTransaction(tx);
    signedTX.observed().on('transactionHash', (txHash) => {
        console.log('--- txHash ---', txHash);
    })
    .on('receipt', (receipt) => {
        console.log('--- receipt ---', receipt);
    })
    .on('cxReceipt', (receipt) => {
        console.log('--- cxReceipt ---', receipt);
        const { active } = getState().contractReducer
        dispatch(getBalances(active))
        dispatch({ type: UPDATE, processing: false })
    }).on('error', console.error)
    const [sentTX, txHash] = await signedTX.sendTransaction();
    const confirmedTX = await sentTX.confirm(txHash);
    console.log(confirmedTX)
}

export const transferHRC = ({ amount, address }) => async (dispatch, getState) => {
    dispatch({ type: UPDATE, processing: true })
    const { hmy, active } = getState().contractReducer
    if (!hmy) {
        console.log('call loadContracts first')
        return
    }
    console.log(amount, address)
    const contract = await getContractInstance(hmy, HarmonyMintable)
    const tx = contract.methods.transfer(address, parseInt(amount)).send({
        from: active.address,
        gasLimit: '1000000',
        gasPrice: new hmy.utils.Unit('10').asGwei().toWei(),
    }).on('transactionHash', function(hash){
        console.log(hash)
    }).on('receipt', function(receipt){
        console.log(receipt)
    }).on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt)
        const { active } = getState().contractReducer
        dispatch(getBalances(active))
        dispatch({ type: UPDATE, processing: false })
    }).on('error', console.error)
}
export const setActive = (which) => async (dispatch, getState) => {
    const state = getState().contractReducer
    const active = state[which]
    if (!active) return
    const { hmy } = state
    if (!hmy) {
        console.log('call loadContracts first')
        return
    }
    hmy.wallet.setSigner(active.address);
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
    const { hmy } = getState().contractReducer
    if (!hmy) {
        console.log('call loadContracts first')
        return
    }
    const contract = await getContractInstance(hmy, HarmonyMintable)
    const balance = await contract.methods.balanceOf(account.address).call({
        gasLimit: '210000',
        gasPrice: '100000',
    })

    console.log(account, contract, balance)
    
    account.balanceHRC = balance.toString()
    dispatch({ type: UPDATE, [account.name]: account })
}
export const loadContracts = () => async (dispatch) => {

    console.log(window.harmony)
    
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
    dispatch({ type: UPDATE,
        minter, account,
        addresses: [account.address, minter.address],
        bech32Addresses: [account.bech32Address, minter.bech32Address],
    })
    dispatch(setActive('account'))
    dispatch(setActive('minter'))
}

//reducer
export const contractReducer = (state = {
    ...defaultState
}, action) => reducer(state, action)
