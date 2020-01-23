import { UPDATE, reducer } from '../util/redux-util'
import { Harmony } from '@harmony-js/core'
import { ChainID, ChainType } from '@harmony-js/utils'
import { getTokens } from './hrc721'
import { getRaised } from './crowdsale'
//state
const defaultState = {
    harmony: null,
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


    /********************************
    Testing Math Wallet
    ********************************/
    let harmony

    await new Promise((resolve) => {
        const check = () => {
            if (!window.harmony) setTimeout(check, 250)
            else {
                harmony = window.harmony
                resolve()
            }
        }
        check()
    })
    const test = await harmony.getAccount()
    console.log(harmony)
    console.log(hmy)
    console.log(hmy.wallet)

    const tx = hmy.transactions.newTx({
        to: address,
        value: new hmy.utils.Unit(amount).asEther().toWei(),
        gasLimit: '210000',
        shardID: 0,
        toShardID: 0,
        gasPrice: new hmy.utils.Unit('10').asGwei().toWei(),
    });

    console.log(tx)

    console.log(harmony.signTransaction)
    const testSign = await harmony.signTransaction(tx);
    console.log(testSign)

    // const signedTX = await hmy.wallet.signTransaction(tx);
    // signedTX.observed().on('transactionHash', (txHash) => {
    //     console.log('--- txHash ---', txHash);
    // })
    // .on('receipt', (receipt) => {
    //     console.log('--- receipt ---', receipt);
    //     const { active } = getState().harmonyReducer
    //     dispatch(getBalances(active))
    //     dispatch(updateProcessing(false))
    // }).on('error', console.error)
    // const [sentTX, txHash] = await signedTX.sendTransaction();
    // const confirmedTX = await sentTX.confirm(txHash);
    // console.log(confirmedTX)
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
    dispatch(getTokens(account))
    dispatch(getRaised(account))
}

export const harmonyInit = () => async (dispatch) => {

    const url = `ws://localhost:9800`
    const hmy = new Harmony(url, {
        chainType: ChainType.Harmony,
        chainId: ChainID.HmyTestnet,
    })
    dispatch({ type: UPDATE, hmy })
    // console.log(hmy.wallet)

    // 0x7c41e0668b551f4f902cfaec05b5bdca68b124ce
    const minter = hmy.wallet.addByPrivateKey('45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e')
    minter.name = 'Alice'
    // 0xea877e7412c313cd177959600e655f8ba8c28b40
    const account = hmy.wallet.addByMnemonic('surge welcome lion goose gate consider taste injury health march debris kick')
    account.name = 'Bob'
    dispatch({ type: UPDATE,
        minter, account,
        addresses: [account.address, minter.address],
        bech32Addresses: [account.bech32Address, minter.bech32Address],
    })
    dispatch(setActive('account'))
    dispatch(setActive('minter'))

    dispatch(transferONE({ amount: 1, account: account.address }))
}

//reducer
export const harmonyReducer = (state = {
    ...defaultState
}, action) => reducer(state, action)
