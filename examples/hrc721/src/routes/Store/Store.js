import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { setActive } from '../../redux/harmony'
import { getInventory    } from '../../redux/crowdsale'
import Inventory from '../../components/Inventory/Inventory'

import { route, gradient, bubble, button } from './Store.module.scss'
import config from '../../../config'
const {ENV} = config

export default function Store(props) {

    const {
        harmonyState: { active,  },
        hrc721State: { balances  },
    } = props

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getInventory())
    }, [active])

    return (
        <div className={route}>


            <section>
                <h2>Current User</h2>
                {active &&
                    <div className={bubble}>
                        <h3>{active.name}</h3>
                        <p>ONE: {active.balanceONE}</p>
                        { ENV === 'local' &&
                            <button 
                                onClick={() => dispatch(setActive(active.name === 'Alice' ? 'account' : 'minter'))}
                                className={button}
                            >Toggle User</button>
                        }
                    </div>
                }
            </section>


            <section className={gradient}>
                <h2>Items</h2>
                <Inventory {...props} balance={active && balances && balances[active.name]} />
            </section>
        </div>
    )
}