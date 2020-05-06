import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { setActive } from '../../redux/harmony'

import { transferONE,  } from '../../redux/harmony'
// import { transferHRC20,  } from '../../redux/hrc20'
import Form from '../../components/Form/Form'

import { route, bubble, button } from './Funds.module.scss'

export default function Home(props) {

    const {
        harmonyState: { active, bech32Addresses, allowToggle },
        // hrc20State: { hrc20balances },
        auctionState: { activeName },
    } = props

    const [link, setLink] = useState(null)

    const dispatch = useDispatch()
    
    if (!active) return null

    // const hrc20balance = hrc20balances[active.name] || 0

    return (
        <div className={route}>


            <section>
                {active &&
                    <div className={bubble}>
                        <h3>{ activeName && activeName.length > 0 ? activeName : 'anonymous' }</h3>
                        <p>ONE: {active.balanceONE}</p>
                        {/* <p>USD: {hrc20balance}</p> */}
                        { allowToggle &&
                            <button 
                                onClick={() => dispatch(setActive(active.name === 'Alice' ? 'account' : 'minter'))}
                                className={button}
                            >Toggle User</button>
                        }
                    </div>
                }
            </section>


            
            { active && 
            <div>
                {/* <section>
                    <Form
                        {...{
                            active,
                            title: 'Transfer USD',
                            addressType: 'bech32Address',
                            addresses: bech32Addresses,
                            submit: transferHRC20
                        }}
                    />
                </section> */}
                <section>
                    <Form
                        {...{
                            active,
                            title: 'Transfer ONE',
                            addressType: 'bech32Address',
                            addresses: bech32Addresses,
                            submit: transferONE
                        }}
                    />
                </section>
            </div>
            }

        </div>
    )
}