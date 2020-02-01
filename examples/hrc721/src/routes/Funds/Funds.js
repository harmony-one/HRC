import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'

import { transferONE,  } from '../../redux/harmony'
import { getTokens } from '../../redux/hrc721'
import { addItem } from '../../redux/crowdsale'
import Form from '../../components/Form/Form'
import Inventory from '../../components/Inventory/Inventory'

import { route, gradient, bubble, marginTop,  } from './Funds.module.scss'
import LoadingGIF from '../../img/loading.gif'

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