import { UPDATE, reducer } from '../util/redux-util'
import HarmonyMintable from '../build/contracts/HRC721.json'
import HRC721Crowdsale from '../build/contracts/HRC721Crowdsale.json'
import {getBalances, updateProcessing, updateDialogState} from './harmony'
import { getContract, oneToHexAddress } from '../util/hmy-util'


//state
const defaultState = {
    tokenContract: null,
    market: [],
    balances: {}
}
const hrc721Keys = Object.keys(defaultState)
export const hrc721State = ({ hrc721Reducer: { ...keys } }) => {
    Object.keys(keys).forEach((k) => {
        if (!hrc721Keys.includes(k)) delete keys[k]
    })
    return keys
}

export const getMarket = (account) => async(dispatch, getState) => {

    const { hmy, contract: hrc721, active } = await getContract(getState().harmonyReducer, HarmonyMintable)
    const { contract: hrc721Crowdsale } = await getContract(getState().harmonyReducer, HRC721Crowdsale)
    if (!hmy) {
        return
    }

    const args = {
        gasLimit: '5000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    }

    const market = []
    const tokens = (await hrc721.methods.totalSupply().call({...args})).toNumber()
    
    for (let i = 0; i < tokens; i++) {
        const tokenId = i+1
        let price = (await hrc721.methods.getSalePrice(tokenId).call({...args})).toString()
        if (price !== '0') {
            price = new hmy.utils.Unit(price).asWei().toEther().toString()
            const url = (await hrc721Crowdsale.methods.getTokenData(tokenId).call({...args}))
            market.push({ price, url, tokenId })
        }
    }
    console.log(market)
    dispatch({type: UPDATE, market })
}


export const setSell = ({ tokenId, amount }) => async (dispatch, getState) => {
    dispatch(updateProcessing(true))
    dispatch(updateDialogState({ open: false }))
    // const { items } = getState().crowdsaleReducer
    //const { hmy, hmyExt, active } = getState().harmonyReducer
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HarmonyMintable)
    //console.log(hmy, hmyExt, HRC20Crowdsale, contract)
    const tx = contract.methods.setSale(tokenId, new hmy.utils.Unit(amount).asEther().toWei()).send({
        from: active.address,
        gasLimit: '5000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    }).on('transactionHash', function (hash) {
        console.log('hash', hash)
    }).on('receipt', function (receipt) {
        console.log('receipt', receipt)
    }).on('confirmation', async (confirmationNumber, receipt) => {
        console.log('confirmationNumber', confirmationNumber, receipt)
        dispatch(getTokens())
        dispatch(updateProcessing(false))
    }).on('error', console.error)
}


export const buyTokenOnSale = ({ price, tokenId }) => async (dispatch, getState) => {
    dispatch(updateProcessing(true))
    //const { hmy, hmyExt, active } = getState().harmonyReducer
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HarmonyMintable)
    //console.log(hmy, hmyExt, HRC20Crowdsale, contract)
    const tx = contract.methods.buyTokenOnSale(tokenId).send({
        from: active.address,
        value: new hmy.utils.Unit(price).asEther().toWei(),
        gasLimit: '5000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    }).on('transactionHash', function (hash) {
        console.log('hash', hash)
    }).on('receipt', function (receipt) {
        console.log('receipt', receipt)
    }).on('confirmation', async (confirmationNumber, receipt) => {
        console.log('confirmationNumber', confirmationNumber, receipt)
        dispatch(getMarket())
        dispatch(updateProcessing(false))
    }).on('error', console.error)
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
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    })).toNumber()
    const balance = {}
    for (let i = 0; i < tokens; i++) {
        const tokenId = (await hrc721.methods.tokenOfOwnerByIndex(account.address, i).call({
            gasLimit: '210000',
            gasPrice: '100000',
        })).toNumber()
        const itemIndex = (await hrc721.methods.getItemIndex(tokenId).call({
            gasLimit: '210000',
            gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
        })).toNumber()
        let salePrice = (await hrc721.methods.getSalePrice(tokenId).call({
            gasLimit: '210000',
            gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
        })).toString()
        salePrice = new hmy.utils.Unit(salePrice).asWei().toEther().toString()

        if (balance[itemIndex] !== undefined) {
            balance[itemIndex].push({tokenId, salePrice})
        } else {
            balance[itemIndex] = [{tokenId, salePrice}]
        }
    }
    balances = { ...balances, [account.name]: balance }
    dispatch({type: UPDATE, balances })
}


//reducer
export const hrc721Reducer = (state = {
    ...defaultState
}, action) => reducer(state, action)
