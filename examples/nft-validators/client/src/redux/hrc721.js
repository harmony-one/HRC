
import { getReducer, getState } from '../util/redux-util-v2'
import HRC721 from '../build/contracts/HRC721.json'
import { getContract } from '../util/hmy-util'

//state
const defaultState = {
    tokenContract: null,
    market: [],
    balances: {}
}
//reducer
const type = 'hrc721Reducer'
export const hrc721Reducer = getReducer(type, defaultState)
export const hrc721State = getState(type)


export const getTokens = (account) => async (dispatch, getState) => {
    // const { hmy } = getState().harmonyReducer
    let { balances } = getState().hrc721Reducer
    
    // const hrc721 = await getContractInstance(hmy, HRC721)

    dispatch({type, balances: {} })

    const { hmy, contract: hrc721, active } = await getContract(getState().harmonyReducer, HRC721)
    if (!hmy) {
        return
    }
    let tokens = await hrc721.methods.balanceOf(account.address).call({
        gasLimit: '5000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    })
    tokens = tokens ? tokens.toNumber() : 0


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
    balances = { ...balances, [account.address]: balance }
    dispatch({type, balances })
}



/********************************
Not used in this app
********************************/


// export const getMarket = (account) => async(dispatch, getState) => {

//     const { hmy, contract: hrc721, active } = await getContract(getState().harmonyReducer, HRC721)
//     const { contract: hrc721Crowdsale } = await getContract(getState().harmonyReducer, HRC721Crowdsale)
//     if (!hmy) {
//         return
//     }

//     const args = {
//         gasLimit: '5000000',
//         gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
//     }

//     const market = []
//     let tokens = await hrc721.methods.totalSupply().call(args)
//     tokens = tokens ? tokens.toNumber() : 0

//     for (let i = 0; i < tokens; i++) {
//         const tokenId = i+1
//         let price = (await hrc721.methods.getSalePrice(tokenId).call({...args})).toString()
//         if (price !== '0') {
//             price = new hmy.utils.Unit(price).asWei().toEther().toString()
//             const url = (await hrc721Crowdsale.methods.getTokenData(tokenId).call({...args}))
//             market.push({ price, url, tokenId })
//         }
//     }
//     // console.log(market)
//     dispatch({type, market })
// }


// export const setSell = ({ tokenId, amount }) => async (dispatch, getState) => {
//     dispatch(updateProcessing(true))
//     dispatch(updateDialogState({ open: false }))
//     const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC721)
//     const { contract: crowdsale } = await getContract(getState().harmonyReducer, HRC721Crowdsale)
//     // clean args
//     amount = new hmy.utils.Unit(amount).asEther().toWei()
//     const tx = contract.methods.setSale(tokenId, amount, crowdsale.address).send({
//         from: active.address,
//         gasLimit: '5000000',
//         gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
//     }).on('transactionHash', function (hash) {
//         console.log('hash', hash)
//     }).on('receipt', function (receipt) {
//         console.log('receipt', receipt)
//     }).on('confirmation', async (confirmationNumber, receipt) => {
//         console.log('confirmationNumber', confirmationNumber, receipt)
//         dispatch(getBalances())
//         dispatch(updateProcessing(false))
//     }).on('error', console.error)
// }