import { UPDATE, reducer } from '../util/redux-util'
import { waitForInjected, getExtAccount } from '../util/hmy-util'
import { Harmony, HarmonyExtension } from '@harmony-js/core'
import { ChainID, ChainType } from '@harmony-js/utils'
import { getTokens } from './hrc721'
import { getRaised } from './crowdsale'
//state
const defaultState = {
    harmony: null,
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

/********************************
This is only enabled for localnet hmy e.g. Alice's account
********************************/
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
    const { hmy, hmyExt } = state
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
    const { hmy, hmyExt } = getState().harmonyReducer
    if (!hmy) {
        console.log('call loadContracts first')
        return
    }
    let result
    if (account.isExt) {
        result = (await hmyExt.blockchain.getBalance({ address: account.address }).catch((err) => {
            console.log(err);
        })).result
    } else {
        result = (await hmy.blockchain.getBalance({ address: account.address }).catch((err) => {
            console.log(err);
        })).result
    }
    account.balanceONE = new hmy.utils.Unit(result).asWei().toEther()

    dispatch({ type: UPDATE, [account.name]: account })
}
export const getBalances = (account) => async (dispatch, getState) => {
    dispatch(getBalanceONE(account))
    dispatch(getTokens(account))
    dispatch(getRaised(account))
}

export const harmonyInit = () => async (dispatch) => {

    // const url = `ws://localhost:9800`
    const url = `http://127.0.0.1:9500`
    const hmy = new Harmony(url, {
        chainType: ChainType.Harmony,
        chainId: ChainID.HmyTestnet,
    })
    dispatch({ type: UPDATE, hmy })

    // console.log(hmy.wallet)

    // 0x7c41e0668b551f4f902cfaec05b5bdca68b124ce
    const minter = hmy.wallet.addByPrivateKey('45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e')
    minter.name = 'Alice'
    /********************************
    Testing Math Wallet
    ********************************/
    const harmony = await waitForInjected()
    const hmyExt = new HarmonyExtension(harmony, {
        chainId: hmy.chainId
    });
    dispatch({ type: UPDATE, hmyExt })


    const account = await getExtAccount(hmyExt)
    account.name = 'Bob'
    console.log(account)

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
