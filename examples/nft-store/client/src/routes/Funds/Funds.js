import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { setActive } from '../../redux/harmony'

import { transferONE,  } from '../../redux/harmony'
import Form from '../../components/Form/Form'

import { route, bubble, button } from './Funds.module.scss'
import config from '../../../config'
const {ENV} = config

export default function Home(props) {

    const {
        harmonyState: { active, bech32Addresses },
        hrc721State: { balances },
    } = props

    const [link, setLink] = useState(null)

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


            
            { active && 
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
            }

        </div>
    )
}