import { UPDATE, reducer } from '../util/redux-util'
import { getContractInstance } from '../util/hmy-util'
import HRC20Crowdsale from '../build/contracts/HRC20Crowdsale.json'
import { updateProcessing, getBalances } from './harmony'
import { ChainID, ChainType } from '@harmony-js/utils'

//state
const defaultState = {
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
export const purchaseHRC = ({ amount }) => async (dispatch, getState) => {
    dispatch(updateProcessing(true))
    dispatch({ type: UPDATE })
    const { hmy, hmyExt, active } = getState().harmonyReducer
    if (!hmy) {
        console.log('call loadContracts first')
        return
    }
    const contract = await getContractInstance(active.isExt ? hmyExt : hmy, HRC20Crowdsale)

    const tx = contract.methods.buyTokens(active.address).send({
        from: active.address,
        value: new hmy.utils.Unit(amount).asEther().toWei(),
        gasLimit: '1000000',
        gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
    }).on('transactionHash', function (hash) {
        console.log('hash', hash)
    }).on('receipt', function (receipt) {
        console.log('receipt', receipt)
    }).on('confirmation', async (confirmationNumber, receipt) => {
        console.log('confirmationNumber', confirmationNumber, receipt)
        dispatch(getBalances(active))
        dispatch(updateProcessing(false))
    }).on('error', console.error)
}

export const getRaised = () => async (dispatch, getState) => {
    const { hmy } = getState().harmonyReducer
    const contract = await getContractInstance(hmy, HRC20Crowdsale)
    const raised = await contract.methods.weiRaised().call({
        gasLimit: '210000',
        gasPrice: '100000',
    })
    const one = new hmy.utils.Unit(raised).asWei().toEther()
    dispatch({ type: UPDATE, raised: one, minted: one * 1000 })

}

export const crowdsaleInit = () => async (dispatch, getState) => {
    const { hmy } = getState().harmonyReducer
    const contract = await getContractInstance(hmy, HRC20Crowdsale)
    //args TokensPurchased event
    const args = {
        fromBlock: '0x0',
        toBlock: 'latest',
        address: contract.options.address,
        topics: [Object.keys(contract.events)[1]]
    }

    // contract.events.TokensPurchased(args)
    hmy.blockchain.logs(args, hmy.blockchain.messenger, hmy.blockchain.messenger.currentShard)
        .on('data', (logs) => {
            // console.log(logs)
            if (!logs) return
            if (logs.params && logs.params.result) logs = logs.params.result
            if (!logs.data) return
            const args = contract.abiCoder.decodeParameters(['uint256', 'uint256'], logs.data)
            const topics = logs.topics.map((topic, i) => {
                if (i === 0) return
                return contract.abiCoder.decodeParameters(['address'], topic)[0]
            }).filter((a) => !!a)
            // console.log(topics)
            const values = Object.keys(args).map((k) => new hmy.utils.Unit(args[k]).asWei().toEther())
            // console.log(values)
            const event = {
                one: values[0],
                hrc: values[1],
                purchaser: topics[0],
                beneficiary: topics[1],
            }
            const events = getState().crowdsaleReducer.events.slice()
            events.push(event)
            dispatch({type: UPDATE, events})
        })
}

//reducer
export const crowdsaleReducer = ((state) = {
    ...defaultState
}, action) => reducer(state, action)
