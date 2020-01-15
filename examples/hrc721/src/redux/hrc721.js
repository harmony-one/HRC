import { UPDATE, reducer } from '../util/redux-util'
import HarmonyMintable from '../build/contracts/HRC721.json'
import {getBalances, updateProcessing} from './harmony'

//state
const defaultState = {
    tokenContract: null,
}
const hrc721Keys = Object.keys(defaultState)
export const hrc721State = ({ hrc721Reducer: { ...keys } }) => {
    Object.keys(keys).forEach((k) => {
        if (!hrc721Keys.includes(k)) delete keys[k]
    })
    return keys
}
const getContractInstance = (hmy, artifact) => {
    return hmy.contracts.createContract(artifact.abi, artifact.networks[2].address)
}
export const transferHRC = ({ amount, address }) => async (dispatch, getState) => {
    dispatch(updateProcessing(true))
    dispatch({ type: UPDATE })
    const { hmy, active } = getState().harmonyReducer
    if (!hmy) {
        console.log('call loadContracts first')
        return
    }
    console.log(amount, address)
    const contract = await getContractInstance(hmy, HarmonyMintable)
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
    const { hmy } = getState().harmonyReducer
    if (!hmy) {
        console.log('call loadContracts first')
        return
    }
    const contract = await getContractInstance(hmy, HarmonyMintable)
    const balance = await contract.methods.balanceOf(account.address).call({
        gasLimit: '210000',
        gasPrice: '100000',
    })
    if (balance === null) {
        console.log('contracts not deployed, use ./deploy.sh')
        return
    }
    account.balanceHRC = new hmy.utils.Unit(balance).asWei().toEther()
    dispatch({ type: UPDATE, [account.name]: account })
}

//reducer
export const hrc721Reducer = (state = {
    ...defaultState
}, action) => reducer(state, action)
