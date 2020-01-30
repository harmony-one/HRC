import { UPDATE, reducer } from '../util/redux-util'
import { waitForInjected, getExtAccount } from '../util/hmy-util'
import { Harmony, HarmonyExtension } from '@harmony-js/core'
import { ChainID, ChainType } from '@harmony-js/utils'
import { getBalanceHRC } from './hrc20'
import { getRaised } from './crowdsale'

import config from '../../config'
const { ENV, network } = config
//state
const defaultState = {
    network,
    hmy: null,
    hmyExt: null,
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
    const { hmy, hmyExt, active } = getState().harmonyReducer
    if (!hmy) {
        console.log('call loadContracts first')
        return
    }
    console.log(amount, address)

    const harmony = active.isExt ? hmyExt : hmy
    const tx = harmony.transactions.newTx({
        to: address,
        value: new hmy.utils.Unit(amount).asEther().toWei(),
        gasLimit: '210000',
        shardID: 0,
        toShardID: 0,
        gasPrice: new hmy.utils.Unit('10').asGwei().toWei(),
    });
    const signedTX = await harmony.wallet.signTransaction(tx);
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
    if (!active.isExt) {
        hmy.wallet.setSigner(active.address)
    }
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
    dispatch(getRaised(account))
}

export const harmonyInit = () => async (dispatch) => {

    const url = config[ENV + 'Url']

    const hmy = new Harmony(url, {
        chainType: ChainType.Harmony,
        chainId: ChainID.HmyMainnet,
    })
    dispatch({ type: UPDATE, hmy })

    const harmony = await waitForInjected(2)
    let hmyExt
    if (harmony) {
        hmyExt = new HarmonyExtension(harmony, {
            chainId: 1
        });
        dispatch({ type: UPDATE, hmyExt })
    }

    // 0x7c41e0668b551f4f902cfaec05b5bdca68b124ce
    const minter = hmy.wallet.addByPrivateKey('45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e')
    minter.name = 'Alice'
    // 0xea877e7412c313cd177959600e655f8ba8c28b40
    let account
    if (!hmyExt) {
        account = hmy.wallet.addByMnemonic('surge welcome lion goose gate consider taste injury health march debris kick')
        account.name = 'Bob'
    } else {
        account = await getExtAccount(hmyExt)
        account.name = 'Bob'
    }

    const addresses = [account.address, minter.address]
    const bech32Addresses = [account.bech32Address, minter.bech32Address]

    if (network) {
        addresses.pop()
        bech32Addresses.pop()
    }
    dispatch({ type: UPDATE,
        minter, account,
        addresses,
        bech32Addresses
    })

    dispatch(setActive('account'))
    if (!network) {
        console.log("setting minter")
        dispatch(setActive('minter'))
    }
}

//reducer
export const harmonyReducer = (state = {
    ...defaultState
}, action) => reducer(state, action)
