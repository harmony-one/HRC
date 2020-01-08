import { UPDATE, reducer } from '../util/redux-util'
import { Harmony } from '@harmony-js/core'
import { ChainID, ChainType } from '@harmony-js/utils'
import { getBalanceHRC } from './hrc20'
//state
const defaultState = {
    hmy: null,
    active: null,
    minter: null,
    account: null,
    bech32Addresses: [],
    addresses: [],
    processing: false,
}
const harmonyKeys = Object.keys(defaultState)
export const harmonyState = ({ harmonyReducer: { ...keys } }) => {
    Object.keys(keys).forEach((k) => {
        if (!harmonyKeys.includes(k)) delete keys[k]
    })
    return keys
}
/********************************
Functions / Actions
********************************/

export const updateProcessing = (processing) => async (dispatch) => {
    dispatch({ type: UPDATE, processing })
}

export const transferONE = ({ amount, address }) => async (dispatch, getState) => {
    dispatch(updateProcessing(true))
    const { hmy } = getState().harmonyReducer
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
        const { active } = getState().harmonyReducer
        dispatch(getBalances(active))
        dispatch(updateProcessing(false))
    }).on('error', console.error)
    const [sentTX, txHash] = await signedTX.sendTransaction();
    const confirmedTX = await sentTX.confirm(txHash);
    console.log(confirmedTX)
}

export const setActive = (which) => async (dispatch, getState) => {
    const state = getState().harmonyReducer
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
export const getBalanceONE = (account) => async (dispatch, getState) => {
    const { hmy } = getState().harmonyReducer
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
export const getBalances = (account) => async (dispatch, getState) => {
    dispatch(getBalanceONE(account))
    dispatch(getBalanceHRC(account))
}

export const harmonyInit = () => async (dispatch) => {
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
export const harmonyReducer = (state = {
    ...defaultState
}, action) => reducer(state, action)
