import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { setActive } from '../../redux/harmony'

import Inventory from './../../components/Inventory/Inventory'
import config from '../../../config'
const {ENV} = config

import { route, bubble, button } from './Home.module.scss'

export default function Home(props) {

    const {
        harmonyState: { active, },
        hrc721State: { balances },
    } = props

    const dispatch = useDispatch()

    return (
        <div className={route}>



            <section>
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




            {active && balances[active.name] && Object.keys(balances[active.name]).length > 0 &&
                <section>
                    <h2>Items</h2>
                    <Inventory {...props}
                        balance={active && balances && balances[active.name]}
                        wallet={true}
                    />
                </section>
            }
        </div>
    )
}