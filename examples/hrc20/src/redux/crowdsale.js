import { UPDATE, reducer } from '../util/redux-util'
import HRC20Crowdsale from '../build/contracts/HRC20Crowdsale.json'
import {updateProcessing, getBalances} from './harmony'

//state
const defaultState = {
    tokenContract: null,
}
const crowdsaleKeys = Object.keys(defaultState)
export const crowdsaleState = ({ crowdsaleReducer: { ...keys } }) => {
    Object.keys(keys).forEach((k) => {
        if (!crowdsaleKeys.includes(k)) delete keys[k]
    })
    return keys
}
const getContractInstance = (hmy, artifact) => {
    return hmy.contracts.createContract(artifact.abi, artifact.networks[2].address)
}
export const purchaseHRC = ({ amount }) => async (dispatch, getState) => {
    dispatch(updateProcessing(true))
    dispatch({ type: UPDATE })
    const { hmy, active } = getState().harmonyReducer
    if (!hmy) {
        console.log('call loadContracts first')
        return
    }
    const contract = await getContractInstance(hmy, HRC20Crowdsale)
    const tx = contract.methods.buyTokens(active.address).send({
        from: active.address,
        value: new hmy.utils.Unit(amount).asEther().toWei(),
        gasLimit: '1000000',
        gasPrice: new hmy.utils.Unit('10').asGwei().toWei(),
    }).on('transactionHash', function(hash){
        console.log('hash', hash)
    }).on('receipt', function(receipt){
        console.log('receipt', receipt)
    }).on('confirmation', function(confirmationNumber, receipt){
        console.log('confirmationNumber', confirmationNumber, receipt)
        dispatch(getBalances(active))
        dispatch(updateProcessing(false))
    }).on('error', console.error)
}

export const getBalanceHRC = (account) => async (dispatch, getState) => {
    const { hmy } = getState().harmonyReducer
    if (!hmy) {
        console.log('call loadContracts first')
        return
    }
    const contract = await getContractInstance(hmy, HRC20Crowdsale)
    console.log(contract)
}

//reducer
export const crowdsaleReducer = ((state) = {
    ...defaultState
}, action) => reducer(state, action)
