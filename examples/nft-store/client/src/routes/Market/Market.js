import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { setActive } from '../../redux/harmony'
import { getMarket } from '../../redux/hrc721'
import Inventory from '../../components/Inventory/Inventory'

import { route, gradient, bubble, button } from './Market.module.scss'

export default function Market(props) {

    const {
        harmonyState: { active, allowToggle },
        hrc721State: { balances, market  },
        hrc20State: { hrc20balances },
    } = props

    const dispatch = useDispatch()
    
    
    useEffect(() => {
        dispatch(getMarket())
    }, [active])

    if (!active) return null
    
    const hrc20balance = hrc20balances[active.name] || 0

    return (
        <div className={route}>

            {<section className={gradient}>
                <div className={bubble}>
                    <h2>{market.length > 0 ? 'NFTs for Sale by Owner' : 'No NFTs for Sale'}</h2>
                </div>
                <Inventory {...props} market={market} balance={active && balances && balances[active.name]} />
            </section>}
        </div>
    )
}