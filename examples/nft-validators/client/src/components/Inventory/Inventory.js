
import React from 'react'
import { useDispatch } from 'react-redux'
import { updateDialogState } from './../../redux/harmony'
import { purchase, buyTokenOnSale } from './../../redux/auction'
import { setSell } from './../../redux/hrc721'
import Form from './../../components/Form/Form'

import { inventory, image, stats, purchaseButton, soldOut } from './Inventory.module.scss'


const RenderItem = ({item, hidePrice, id, byline, isSoldOut = false}) => {
    return <div>
    <div className={[image, isSoldOut ? soldOut : ''].join(' ')}>
        <img src={item.url} alt="dog" />
        
        {hidePrice ? <p style={{opacity: 0}}></p> : <p>Price: {item.price}</p> }
        <p>{id}</p>
    </div>
    <div className={stats}>
        {byline && <p>{byline}</p>}
    </div>
</div>
}

export default function Inventory(props) {

    const {
        wallet, balance, market,
        harmonyState: { active },
        auctionState,
    } = props
    let { items } = auctionState

    const dispatch = useDispatch()

    if (market) items = market
    if (!wallet) items.sort((a, b) => a.isSoldOut - b.isSoldOut)
    else items = items
        .map((item) => ({ item, balance: balance[item.index] || [] }))
        .reduce((acc, {item, balance}) => {
            acc.push(...balance.map((b) => ({...item, ...b})))
            return acc
        }, [])
        .sort((a, b) => b.tokenId - a.tokenId)

    if (items.length === 0) return null

    return (
    <div className={inventory}>
        {
            items.map((item) => {
                const {index, isSoldOut, tokenId, salePrice} = item

                return wallet ?
                    <div key={tokenId + '' + index}>
                        <RenderItem {...{ 
                            item,
                            hidePrice: true,
                            id: 'Token ID: ' + tokenId,
                            byline: salePrice !== '0' ? `Selling for: ${salePrice} ONE` : `Not for Sale`
                        }} />
                        <div className={purchaseButton}>
                            <button onClick={() => dispatch(updateDialogState({
                                open: true,
                                content: <Form
                                    {...{
                                        active,
                                        title: 'Sell Your Token',
                                        submit: ({amount}) => setSell({
                                            amount,
                                            tokenId
                                        })
                                    }}
                                />
                            }))}>{
                                salePrice !== '0' ? 'Update Sale' : 'Sell Token'
                            }</button>
                        </div>
                    </div>
                    :

                    //handles both store and market cases

                    <div key={item.tokenId + '' + index}>
                        <RenderItem {...{ item, id: market ? 'TokenId: ' + item.tokenId : 'Item # ' + (index+1),
                            byline: market ? null : isSoldOut ? 'Sold Out!' : `${item.minted} / ${item.limit} sold`,
                            isSoldOut
                        }} />
                        {!isSoldOut &&
                        
                        <div className={purchaseButton}>
                            <button onClick={() => {
                                if (market) {
                                    dispatch(buyTokenOnSale(item))
                                } else {
                                    dispatch(purchase(item))
                                }

                            }}>{market ? 'Buy from Seller' : 'Purchase'}</button>
                        </div>
                        }
                    </div>
            })
        }
    </div>
    )
} 
