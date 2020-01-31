
import React from 'react'
import { useDispatch } from 'react-redux'
import { updateDialogState } from './../../redux/harmony'
import { purchase } from './../../redux/crowdsale'
import { setSell, buyTokenOnSale } from './../../redux/hrc721'
import Form from './../../components/Form/Form'

import { inventory, image, stats, button } from './Inventory.module.scss'


const RenderItem = ({item, id, byline}) => {
    console.log(item, id)
    return <div>
    <div className={image}>
        <img src={item.url} alt="dog" />
        <p>Price: {item.price}</p>
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
        crowdsaleState,
    } = props
    let { items } = crowdsaleState

    const dispatch = useDispatch()

    if (market) items = market

    return (
    <div className={inventory}>
        {
            items.map((item, index) => {
                if (wallet && balance && balance[index] === undefined) return null

                
                return wallet ?
                        balance[index].map(({tokenId, salePrice}) => {
                        return <div key={tokenId}>
                            <RenderItem {...{ 
                                item,
                                id: 'Token ID: ' + tokenId,
                                byline: salePrice !== '0' ? `Selling for: ${salePrice} ONE` : `Not for Sale`
                            }} />
                            <div className={button}>
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
                        })
                    :

                    //handles both store and market cases

                    <div key={index}>
                        <RenderItem {...{ item, id: market ? 'TokenId: ' + item.tokenId : 'Item # ' + (index+1),
                            byline: market ? null : `${item.minted} / ${item.limit} sold`
                        }} />
                        <div className={button}>
                            <button onClick={() => {

                                if (market) {
                                    dispatch(buyTokenOnSale(item))
                                } else {
                                    dispatch(purchase({ index }))
                                }

                            }}>{market ? 'Buy from Seller' : 'Purchase'}</button>
                        </div>
                    </div>
            })
        }
    </div>
    )
} 
