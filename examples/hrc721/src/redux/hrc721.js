import { UPDATE, reducer } from '../util/redux-util'
import HarmonyMintable from '../build/contracts/HRC721.json'
import {getBalances, updateProcessing} from './harmony'
import { getContract, oneToHexAddress } from '../util/hmy-util'

//state
const defaultState = {
    tokenContract: null,
    balances: {}
}
const hrc721Keys = Object.keys(defaultState)
export const hrc721State = ({ hrc721Reducer: { ...keys } }) => {
    Object.keys(keys).forEach((k) => {
        if (!hrc721Keys.includes(k)) delete keys[k]
    })
    return keys
}

export const getTokens = (account) => async (dispatch, getState) => {
    // const { hmy } = getState().harmonyReducer
    let { balances } = getState().hrc721Reducer
    
    // const hrc721 = await getContractInstance(hmy, HarmonyMintable)


    const { hmy, contract: hrc721, active } = await getContract(getState().harmonyReducer, HarmonyMintable)
    if (!hmy) {
        return
    }

    const tokens = (await hrc721.methods.balanceOf(account.address).call({
        gasLimit: '210000',
        gasPrice: '100000',
    })).toNumber()
    const balance = {}
    for (let i = 0; i < tokens; i++) {
        const tokenId = (await hrc721.methods.tokenOfOwnerByIndex(account.address, i).call({
            gasLimit: '210000',
            gasPrice: '100000',
        })).toNumber()
        const tokenIndex = (await hrc721.methods.getItemIndex(tokenId).call({
            gasLimit: '210000',
            gasPrice: '100000',
        })).toNumber()
        if (balance[tokenIndex] !== undefined) {
            balance[tokenIndex]++
        } else {
            balance[tokenIndex] = 1
        }
    }
    balances = { ...balances, [account.name]: balance }
    dispatch({type: UPDATE, balances })
}


//reducer
export const hrc721Reducer = (state = {
    ...defaultState
}, action) => reducer(state, action)
