import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'

import { route, gradient, bubble, button } from './Auction.module.scss'

import { Gallery } from './Gallery'

export default function Auction(props) {

    const {
        harmonyState: { active },
        auctionState: { items, isOpen },
        hrc721State: { balances },
    } = props

    const dispatch = useDispatch()
    
    useEffect(() => {
        // dispatch(getMarket())
    }, [active])

    if (!active) return null
    

    return (
        <div className={route}>

            <section>
                <div className={bubble}>
                    <h2>Validator Auction</h2>
                    <p>{isOpen ? 'The Auction is Open' : 'The Auction is Closed'}</p>
                </div>
            </section>

            <section className={gradient}>
                <Gallery items={items} dispatch={dispatch} active={active} />
            </section>
        </div>
    )
}