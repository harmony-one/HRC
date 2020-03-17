import { getReducer, getState, UPDATE } from '../util/redux-util'
import HRC20 from '../build/contracts/HRC20.json'
import { getContract, oneToHexAddress } from '../util/hmy-util'
//default state
const defaultState = {
	tokenContract: null,
    balances: {}
}
export const appReducer = getReducer(defaultState)
export const appState = getState('appReducer', defaultState)
//functions
export const balanceOf = (account) => async (dispatch, getState) => {
    const { hmy, contract: hrc20, active } = await getContract(getState().harmonyReducer, HRC20)
    if (!hmy) {
        return
    }
    console.log(account)
    let tokens = await hrc20.methods.balanceOf(account.address).call({
        gasLimit: '5000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    })
    tokens = tokens ? tokens.toString() : '0'
    console.log(tokens)
}