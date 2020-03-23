import { UPDATE, reducer } from '../util/redux-util'
import { getContract } from '../util/hmy-util'
import HRC721Crowdsale from '../build/contracts/HRC721Crowdsale.json'
import { approveHRC20 } from './hrc20'
import { getMarket } from './hrc721'
import { updateProcessing, getBalances } from './harmony'

//state
const defaultState = {
    totalItems: 0,
    items: [],
    raised: 0,
    minted: 0,
    tokenContract: null,
    events: [],
}
const crowdsaleKeys = Object.keys(defaultState)
export const crowdsaleState = ({ crowdsaleReducer: { ...keys } }) => {
    Object.keys(keys).forEach((k) => {
        if (!crowdsaleKeys.includes(k)) delete keys[k]
    })
    return keys
}

/********************************
Hooks
********************************/

export const buyTokenOnSale = ({ price, tokenId }) => async (dispatch, getState) => {
    dispatch(updateProcessing(true))
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC721Crowdsale)
    const amount = new hmy.utils.Unit(price).asEther().toWei()
    console.log('approving transfer of', amount, 'USD tokens')
    dispatch(approveHRC20({
        address: contract.address,
        amount,
        callback: () => {
            console.log('purchasing item tokenId', tokenId, 'for', amount, 'USD tokens')
            const tx = contract.methods.buyTokenOnSale(tokenId, amount).send({
                from: active.address,
                gasLimit: '5000000',
                gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
            }).on('transactionHash', function (hash) {
                console.log('hash', hash)
            }).on('receipt', function (receipt) {
                console.log('receipt', receipt)
            }).on('confirmation', async (confirmation) => {
                console.log('confirmation', confirmation)
                dispatch(getMarket())
                dispatch(getBalances())
                dispatch(updateProcessing(false))
            }).on('error', console.error)
        }
    }))
}



export const purchase = ({ index, price }) => async (dispatch, getState) => {
    dispatch(updateProcessing(true))
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC721Crowdsale)
    const amount = new hmy.utils.Unit(price).asEther().toWei()
    console.log('approving transfer of', amount, 'USD tokens')
    dispatch(approveHRC20({
        address: contract.address,
        amount,
        callback: () => {
            console.log('purchasing item', index, 'for', amount, 'USD tokens')
            const tx = contract.methods.purchaseWithHRC20(amount, index).send({
                from: active.address,
                gasLimit: '5000000',
                gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
            }).on('transactionHash', function (hash) {
                console.log('hash', hash)
            }).on('receipt', function (receipt) {
                console.log('receipt', receipt)
            }).on('confirmation', async (confirmation) => {
                console.log('confirmation', confirmation)
                dispatch(getInventory())
                dispatch(updateProcessing(false))
            }).on('error', console.error)
        }
    }))
}



export const addItem = ({ Limit, Price, Link }) => async (dispatch, getState) => {

    console.log(Limit, Price, Link)

     dispatch(updateProcessing(true))
    
    //const { hmy, hmyExt, active } = getState().harmonyReducer
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC721Crowdsale)
    //console.log(hmy, hmyExt, HRC20Crowdsale, contract)
    
    Limit = parseInt(Limit)
    Limit = Limit > 0 ? Limit : 1
    Price = parseInt(Price)
    Price = Price > 0 ? Price : 0
    Price = new hmy.utils.Unit(Price).asEther().toWei()

    const tx = contract.methods.addItem(Limit, Price, Link).send({
        from: active.address,
        gasLimit: '5000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    }).on('transactionHash', function (hash) {
        console.log('hash', hash)
    }).on('receipt', function (receipt) {
        console.log('receipt', receipt)
    }).on('confirmation', async (confirmationNumber, receipt) => {
        console.log('confirmationNumber', confirmationNumber, receipt)
        dispatch(getInventory())
        dispatch(getBalances())
        dispatch(updateProcessing(false))
    }).on('error', console.error)

    /********************************
    You won't see an update unless you refresh or call dispatch(getInventory())
    ********************************/
}


export const getInventory = () => async (dispatch, getState) => {

    //const { hmy, hmyExt, active } = getState().harmonyReducer
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC721Crowdsale)
    // console.log(HRC721Crowdsale)
    // console.log(contract)
    // console.log(hmy)
    //console.log(hmy, hmyExt, HRC20Crowdsale, contract)
    const args = {
        gasLimit: '4000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    }
    let totalItems = await contract.methods.totalItems().call(args)
    totalItems = totalItems ? parseInt(totalItems.toNumber()) : 0
    // console.log(totalItems)
    const items = []
    for (let i = 0; i < totalItems; i++) {
        const limit = parseInt(await contract.methods.getLimit(i).call(args), 10)
        const minted = parseInt(await contract.methods.getMinted(i).call(args), 10)
        let price = (await contract.methods.getPrice(i).call(args)).toString()
        price = new hmy.utils.Unit(price).asWei().toEther().toString()
        const url = await contract.methods.getUrl(i).call(args)

        items.push({
            index: i, limit, minted, price, url, isSoldOut: minted == limit
        })
    }
    // console.log(items)
    dispatch({type: UPDATE, items})
}

export const crowdsaleInit = () => async (dispatch, getState) => {
    // const { hmy } = getState().harmonyReducer
    // const crowdsale = await getContractInstance(hmy, HRC721Crowdsale)
    dispatch(getInventory())
    
}

//reducer
export const crowdsaleReducer = ((state) = {
    ...defaultState
}, action) => reducer(state, action)
