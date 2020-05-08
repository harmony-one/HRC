import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { setActive } from '../../redux/harmony'
import { getInventory    } from '../../redux/crowdsale'
import Inventory from '../../components/Inventory/Inventory'

import { route, gradient, bubble, button } from './Store.module.scss'

export default function Store(props) {

    const {
        harmonyState: { active, allowToggle },
        crowdsaleState: { items  },
        hrc721State: { balances  },
        hrc20State: { hrc20balances },
    } = props

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getInventory())
    }, [active])
    
    if (!active) return null

    const hrc20balance = hrc20balances[active.name] || 0

    return (
        <div className={route}>

            <section>
                <div className={bubble}>
                    <h2>{items.length === 0 ? 'No NFTs for Sale' : 'NFTs for Sale'}</h2>
                </div>
            </section>

            <section className={gradient}>
                <Inventory {...props} balance={active && balances && balances[active.name]} />
            </section>
        </div>
    )
}