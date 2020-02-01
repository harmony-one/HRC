import { UPDATE, reducer } from '../util/redux-util'
import { getContract } from '../util/hmy-util'
import HRC721Crowdsale from '../build/contracts/HRC721Crowdsale.json'
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
        dispatch(updateProcessing(false))
    }).on('error', console.error)

    /********************************
    You won't see an update unless you refresh or call dispatch(getInventory())
    ********************************/
}


export const purchase = ({ index }) => async (dispatch, getState) => {
    dispatch(updateProcessing(true))
    
    const { items } = getState().crowdsaleReducer
    //const { hmy, hmyExt, active } = getState().harmonyReducer
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC721Crowdsale)
    //console.log(hmy, hmyExt, HRC20Crowdsale, contract)
    const tx = contract.methods.purchase(active.address, index).send({
        from: active.address,
        value: new hmy.utils.Unit(items[index].price).asEther().toWei(),
        gasLimit: '5000000',
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

export const getRaised = () => async (dispatch, getState) => {
    // const { hmy } = getState().harmonyReducer
    // const contract = await getContractInstance(hmy, HRC721Crowdsale)
    // const raised = await contract.methods.weiRaised().call({
    //     gasLimit: '210000',
    //     gasPrice: '100000',
    // })
    // const one = new hmy.utils.Unit(raised).asWei().toEther()
    // dispatch({ type: UPDATE, raised: one, minted: one * 1000 })
}
        


export const getInventory = () => async (dispatch, getState) => {
    
    //const { hmy, hmyExt, active } = getState().harmonyReducer
    const { hmy, contract, active } = await getContract(getState().harmonyReducer, HRC721Crowdsale)
    //console.log(hmy, hmyExt, HRC20Crowdsale, contract)
    const args = {
        gasLimit: '5000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    }
    let totalItems = await contract.methods.totalItems().call(args)
    totalItems = totalItems ? parseInt(totalItems.toNumber()) : 0
    console.log(totalItems)
    const items = []
    for (let i = 0; i < totalItems; i++) {
        const limit = parseInt(await contract.methods.getLimit(i).call(args), 16)
        const minted = parseInt(await contract.methods.getMinted(i).call(args), 16)
        let price = (await contract.methods.getPrice(i).call(args)).toString()
        price = new hmy.utils.Unit(price).asWei().toEther().toString()
        const url = await contract.methods.getUrl(i).call(args)
        items.push({
            limit, minted, price, url
        })
    }
    dispatch({type: UPDATE, items})
}

export const crowdsaleInit = () => async (dispatch, getState) => {
    // const { hmy } = getState().harmonyReducer
    // const crowdsale = await getContractInstance(hmy, HRC721Crowdsale)
    dispatch(getInventory())
    
    //args TokensPurchased event
    // const args = {
    //     fromBlock: '0x0',
    //     toBlock: 'latest',
    //     address: contract.options.address,
    //     topics: [Object.keys(contract.events)[1]]
    // }

    // // contract.events.TokensPurchased(args)
    // hmy.blockchain.logs(args, hmy.blockchain.messenger, hmy.blockchain.messenger.currentShard)
    //     .on('data', (logs) => {
    //         // console.log(logs)
    //         if (!logs) return
    //         if (logs.params && logs.params.result) logs = logs.params.result
    //         if (!logs.data) return
    //         const args = contract.abiCoder.decodeParameters(['uint256', 'uint256'], logs.data)
    //         const topics = logs.topics.map((topic, i) => {
    //             if (i === 0) return
    //             return contract.abiCoder.decodeParameters(['address'], topic)[0]
    //         }).filter((a) => !!a)
    //         // console.log(topics)
    //         const values = Object.keys(args).map((k) => new hmy.utils.Unit(args[k]).asWei().toEther())
    //         // console.log(values)
    //         const event = {
    //             one: values[0],
    //             hrc: values[1],
    //             purchaser: topics[0],
    //             beneficiary: topics[1],
    //         }
    //         const events = getState().crowdsaleReducer.events.slice()
    //         events.push(event)
    //         dispatch({type: UPDATE, events})
    //     })
}

//reducer
export const crowdsaleReducer = ((state) = {
    ...defaultState
}, action) => reducer(state, action)
