import { getReducer, getState, UPDATE } from '../util/redux-util'
import HRC20 from '../build/contracts/HRC20.json'
import { getContract, oneToHexAddress } from '../util/hmy-util'
import { updateProcessing, getBalances } from './harmony'
//default state
const defaultState = {
	tokenContract: null,
    hrc20balances: {}
}
export const hrc20Reducer = getReducer(defaultState)
export const hrc20State = getState('hrc20Reducer', defaultState)
//functions

export const approveHRC20 = ({ address, amount, callback }) => async (dispatch, getState) => {
    dispatch(updateProcessing(true))
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC20)
    // validate and clean args
    amount = new hmy.utils.Unit(amount).asEther().toWei()
    address = oneToHexAddress(hmy, address)
    const tx = contract.methods.approve(address, amount).send({
        from: active.address,
        gasLimit: '5000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    }).on('transactionHash', function (hash) {
        console.log('hash', hash)
    }).on('receipt', function (receipt) {
        console.log('receipt', receipt)
    }).on('confirmation', async (confirmation, receipt) => {
        console.log('confirmation', confirmation, receipt)
        if (callback) callback()
        else {
            dispatch(updateProcessing(false))
        }
    }).on('error', console.error)
}


export const transferHRC20 = ({ amount, address }) => async (dispatch, getState) => {
    dispatch(updateProcessing(true))
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC20)
    // validate and clean args
    amount = new hmy.utils.Unit(amount).asEther().toWei()
    address = oneToHexAddress(hmy, address)
    // 
    const tx = contract.methods.transfer(address, amount).send({
        from: active.address,
        gasLimit: '5000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    }).on('transactionHash', function (hash) {
        console.log('hash', hash)
    }).on('receipt', function (receipt) {
        console.log('receipt', receipt)
    }).on('confirmation', async (confirmationNumber, receipt) => {
        console.log('confirmationNumber', confirmationNumber, receipt)
        dispatch(getBalances())
        dispatch(updateProcessing(false))
    }).on('error', console.error)
}


export const balanceOf = (account) => async (dispatch, getState) => {
    const { hmy, contract: hrc20, active } = await getContract(getState().harmonyReducer, HRC20)
    if (!hmy) {
        return
    }
    // console.log(account)
    let tokens = await hrc20.methods.balanceOf(account.address).call({
        gasLimit: '5000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    })
    //convert decimals
    tokens = new hmy.utils.Unit(tokens ? tokens.toString() : '0').asWei().toEther()
    const { hrc20balances } = getState().hrc20Reducer
    hrc20balances[account.name] = tokens.toString()
    dispatch({ type: UPDATE, hrc20balances })
}