
import React from 'react'
import { useDispatch } from 'react-redux'
import { purchase } from './../../redux/crowdsale'

import { inventory, image, stats, button } from './Inventory.module.scss'

export default function Inventory(props) {

    const {
        filter, balance,
        crowdsaleState: { items }
    } = props

    const dispatch = useDispatch()

    return (
    <div className={inventory}>
        {
            items.map((item, index) => {
                if (filter && balance && balance[index] === undefined) return null
                return <div key={index}>
                    <div>
                        <div className={image}>
                            <img src={item.url} alt="dog" />
                            <p>Price: {item.price}</p>
                            <p>Item {index+1}</p>
                        </div>
                        <div className={stats}>
                            <p>{item.minted} / {item.limit} sold</p>
                            {balance && <p>balance: {balance[index] || '0'}</p>}
                        </div>
                    </div>
                    {!filter && <div className={button}>
                        <button onClick={() => dispatch(purchase({ index }))}>Purchase</button>
                    </div>}
                </div>
            })
        }
    </div>
    )
} 
