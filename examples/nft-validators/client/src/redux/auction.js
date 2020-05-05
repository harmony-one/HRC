import { getReducer, getState } from '../util/redux-util-v2'
import { getContract } from '../util/hmy-util'
import HRC721Auction from '../build/contracts/HRC721Auction.json'
// import { approveHRC20 } from './hrc20'
import { updateProcessing, getBalances } from './harmony'

//state
const defaultState = {
    totalItems: 0,
    items: [],
    raised: 0,
    minted: 0,
    activeName: '',
    tokenContract: null,
    events: [],
    bids: {
        1: [] //item indexes
    },
    isOpen: false,
}
//reducer
const type = 'auctionReducer'
export const auctionReducer = getReducer(type, defaultState)
export const auctionState = getState(type)

/********************************
Hooks
********************************/

export const toggleAuction = ({ value }) => async (dispatch, getState) => {
    console.log('setting auction state', value)
    dispatch(updateProcessing(true))
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC721Auction)
    console.log(contract)
    const tx = contract.methods.toggleIsOpen(value).send({
        from: active.address,
        gasLimit: '2000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    }).on('transactionHash', function (hash) {
        console.log('hash', hash)
    }).on('receipt', function (receipt) {
        console.log('receipt', receipt)
    }).on('confirmation', async (confirmation) => {
        console.log('confirmation', confirmation)
        if (value && confirmation !== 'REJECTED') alert('Auction is Open')
        else alert('Auction is Closed')
        dispatch(getInventory())
        dispatch(updateProcessing(false))
    }).on('error', console.error)
}

export const setBidName = ({ Name }) => async (dispatch, getState) => {
    console.log('setting name', Name)
    dispatch(updateProcessing(true))
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC721Auction)
    const tx = contract.methods.setName(Name).send({
        from: active.address,
        gasLimit: '2000000',
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


export const makeBid = ({ index, amount }) => async (dispatch, getState) => {
    console.log('making bid for item', index, amount)
    dispatch(updateProcessing(true))
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC721Auction)
    const tx = contract.methods.makeBid(index).send({
        from: active.address,
        value: new hmy.utils.Unit(amount).asEther().toWei(), 
        gasLimit: '2000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    }).on('transactionHash', function (hash) {
        console.log('hash', hash)
    }).on('receipt', function (receipt) {
        console.log('receipt', receipt)
    }).on('confirmation', async (confirmationNumber, receipt) => {
        console.log('confirmationNumber', confirmationNumber, receipt)
        dispatch(getInventory())
        dispatch(updateProcessing(false))
    }).on('error', console.error)
}


export const addItem = ({ Limit, Price, Link }) => async (dispatch, getState) => {
    console.log(Limit, Price, Link)
     dispatch(updateProcessing(true))
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC721Auction)
    
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



/********************************
Update inventory (some of this should be cached locally, could be cloud as well)
********************************/


export const getInventory = () => async (dispatch, getState) => {
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC721Auction)
    const args = {
        gasLimit: '4000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    }

    const isOpen = await contract.methods.isOpen().call(args)
    dispatch({type, isOpen})

    const activeName = await contract.methods.getName(active.address).call(args)
    dispatch({type, activeName})

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
        
        //get all bids for item
        let totalBids = await contract.methods.totalBids(i).call(args)
        totalBids = totalBids ? parseInt(totalBids.toNumber()) : 0
        const bids = []
        for (let j = 0; j < totalBids; j++) {
            let amount = parseInt(await contract.methods.getBidAmount(i, j).call(args), 10)
            amount = new hmy.utils.Unit(amount).asWei().toEther().toString()
            let owner = await contract.methods.getBidOwnerName(i, j).call(args)
            if (owner.length === 0) owner = 'anonymous'
            bids.push({ index: j, amount, owner })
        }
        // if (bids.length === 0) {
        //     bids.push({ index: 0, amount: price, owner: 'House' })
        // }
        //update state
        items.push({
            index: i, limit, minted, price,
            url, isSoldOut: minted == limit,
            bids
        })
    }
    // console.log(items)
    dispatch({type: type, items})
}

export const auctionInit = () => async (dispatch, getState) => {
    dispatch(getInventory())
}



/********************************
Deprecated
********************************/
// export const buyTokenOnSale = ({ price, tokenId }) => async (dispatch, getState) => {
//     dispatch(updateProcessing(true))
//     const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC721Auction)
//     const amount = new hmy.utils.Unit(price).asEther().toWei()
//     console.log('approving transfer of', amount, 'USD tokens')
//     dispatch(approveHRC20({
//         address: contract.address,
//         amount,
//         callback: () => {
//             console.log('purchasing item tokenId', tokenId, 'for', amount, 'USD tokens')
//             const tx = contract.methods.buyTokenOnSale(tokenId, amount).send({
//                 from: active.address,
//                 gasLimit: '5000000',
//                 gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
//             }).on('transactionHash', function (hash) {
//                 console.log('hash', hash)
//             }).on('receipt', function (receipt) {
//                 console.log('receipt', receipt)
//             }).on('confirmation', async (confirmation) => {
//                 console.log('confirmation', confirmation)
//                 await dispatch(getMarket())
//                 await dispatch(getBalances())
//                 await dispatch(updateProcessing(false))
//             }).on('error', console.error)
//         }
//     }))
// }



// export const purchase = ({ index, price }) => async (dispatch, getState) => {
//     dispatch(updateProcessing(true))
//     const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC721Auction)
//     const amount = new hmy.utils.Unit(price).asEther().toWei()
//     console.log('approving transfer of', amount, 'USD tokens')
//     dispatch(approveHRC20({
//         address: contract.address,
//         amount,
//         callback: () => {
//             console.log('purchasing item', index, 'for', amount, 'USD tokens')
//             const tx = contract.methods.purchaseWithHRC20(amount, index).send({
//                 from: active.address,
//                 gasLimit: '5000000',
//                 gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
//             }).on('transactionHash', function (hash) {
//                 console.log('hash', hash)
//             }).on('receipt', function (receipt) {
//                 console.log('receipt', receipt)
//             }).on('confirmation', async (confirmation) => {
//                 console.log('confirmation', confirmation)
//                 await dispatch(getInventory())
//                 await dispatch(getBalances())
//                 await dispatch(updateProcessing(false))
//             }).on('error', console.error)
//         }
//     }))
// }