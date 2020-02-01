import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'

import { transferONE,  } from './../../redux/harmony'
import { getTokens } from './../../redux/hrc721'
import { addItem } from './../../redux/crowdsale'
import Form from './../../components/Form/Form'
import Inventory from './../../components/Inventory/Inventory'

import { route, gradient, bubble, marginTop, processingCover, } from './Home.module.scss'
import LoadingGIF from '../../img/loading.gif'

export default function Home(props) {

    const {
        harmonyState: { processing, active, bech32Addresses },
        hrc721State: { balances },
    } = props

    const dispatch = useDispatch()

    return (
        <div className={route}>

            {processing &&
                <div className={processingCover}>
                    <img src={LoadingGIF} />
                </div>
            }


            <section>
                <h2>Balances</h2>
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
                        title: 'Add Item',
                        fields: [
                            { label: 'Limit', type: 'number'},
                            { label: 'Price', type: 'number'},
                            { label: 'Link', type: 'text'},
                        ],
                        submit: addItem
                    }}
                />
            </section>
            }

            
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