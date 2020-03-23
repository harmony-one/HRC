import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { setActive } from '../../redux/harmony'
import { getMarket } from '../../redux/hrc721'
import Inventory from '../../components/Inventory/Inventory'

import { route, gradient, bubble, button } from './Market.module.scss'
import config from '../../../config'
const {ENV} = config

export default function Market(props) {

    const {
        harmonyState: { active,  },
        hrc721State: { balances, market  },
        hrc20State: { hrc20balances },
    } = props

    const dispatch = useDispatch()

    const hrc20balance = hrc20balances[active.name] || 0

    useEffect(() => {
        dispatch(getMarket())
    }, [active])

    return (
        <div className={route}>


            <section>
                {active &&
                    <div className={bubble}>
                        <h3>{active.name}</h3>
                        <p>ONE: {active.balanceONE}</p>
                        <p>USD: {hrc20balance}</p>
                        { ENV === 'local' &&
                            <button 
                                onClick={() => dispatch(setActive(active.name === 'Alice' ? 'account' : 'minter'))}
                                className={button}
                            >Toggle User</button>
                        }
                    </div>
                }
            </section>


            {<section className={gradient}>
                <h2>{market.length > 0 ? 'Tokens for Sale' : 'No Tokens for Sale'}</h2>
                <Inventory {...props} market={market} balance={active && balances && balances[active.name]} />
            </section>}
        </div>
    )
}