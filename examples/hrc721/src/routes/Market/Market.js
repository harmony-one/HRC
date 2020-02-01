import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { setActive } from '../../redux/harmony'
import { getMarket } from '../../redux/hrc721'
import Inventory from '../../components/Inventory/Inventory'

import { route, gradient, bubble, processingCover, button } from './Market.module.scss'
import LoadingGIF from '../../img/loading.gif'

export default function Market(props) {

    const {
        harmonyState: { processing, active,  },
        hrc721State: { balances, market  },
    } = props

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getMarket())
    }, [active])

    return (
        <div className={route}>


            {processing &&
                <div className={processingCover}>
                    <img src={LoadingGIF} />
                </div>
            }


            <section>
                <h2>Current User</h2>
                {active &&
                    <div className={bubble}>
                        <h3>{active.name}</h3>
                        <p>ONE: {active.balanceONE}</p>
                        <button 
                            onClick={() => dispatch(setActive(active.name === 'Alice' ? 'account' : 'minter'))}
                            className={button}
                        >Toggle User</button>
                    </div>
                }
            </section>


            <section className={gradient}>
                <h2>Items</h2>
                <Inventory {...props} market={market} balance={active && balances && balances[active.name]} />
            </section>
        </div>
    )
}