import { UPDATE, reducer } from '../util/redux-util'
import { getContract } from '../util/hmy-util'
import HarmonyMintable from '../build/contracts/HarmonyMintable.json'
import {getBalances, updateProcessing} from './harmony'

//state
const defaultState = {
    tokenContract: null,
}
const hrc20Keys = Object.keys(defaultState)
export const hrc20State = ({ hrc20Reducer: { ...keys } }) => {
    Object.keys(keys).forEach((k) => {
        if (!hrc20Keys.includes(k)) delete keys[k]
    })
    return keys
}
export const transferHRC = ({ amount, address }) => async (dispatch, getState) => {
    dispatch(updateProcessing(true))
    dispatch({ type: UPDATE })
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HarmonyMintable)
    const tx = contract.methods.transfer(address, new hmy.utils.Unit(amount).asEther().toWei()).send({
        from: active.address,
        gasLimit: '1000000',
        gasPrice: new hmy.utils.Unit('10').asGwei().toWei(),
    }).on('transactionHash', function(hash){
        console.log(hash)
    }).on('receipt', function(receipt){
        console.log(receipt)
    }).on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt)
        dispatch(getBalances(active))
        dispatch(updateProcessing(false))
    }).on('error', console.error)
}

export const getBalanceHRC = (account) => async (dispatch, getState) => {
    const { hmy, contract } = await getContract(getState().harmonyReducer, HarmonyMintable)
    const balance = await contract.methods.balanceOf(account.address).call({
        gasLimit: '2100000',
        gasPrice: '1000000000',
    })
    if (balance === null) {
        console.log('contracts not deployed, use ./deploy.sh')
        return
    }
    account.balanceHRC = new hmy.utils.Unit(balance).asWei().toEther()
    dispatch({ type: UPDATE, [account.name]: account })
}

//reducer
export const hrc20Reducer = (state = {
    ...defaultState
}, action) => reducer(state, action)
