import React from 'react'

import { transferHRC, transferONE } from './../../redux/contract'
import Form from './../../components/Form/Form'
import { route, gradient, bubble } from './Home.module.scss'

export default function Home(props) {

    const {
        contractState: { processing, active, addresses, bech32Addresses }
    } = props

    return (
        <div className={route}>

            { processing &&
            <div>
                Processing
            </div>
            }
           

            <section className={gradient}>
                <h2>Balances</h2>
                {active &&
                    <div className={bubble}>
                        <h3>{active.name}</h3>
                        <p>ONE: {active.balanceONE}</p>
                        <p>HRC: {active.balanceHRC}</p>
                    </div>
                }

                {/* <h2 className={marginTop}>Buy HRC Tokens</h2>
                { active &&
                    <div className={bubble}>
                        <h3>Amount</h3>
                        <Input />
                    </div>
                }
                <div className={center}>
                    <button>Send Transaction</button>
                </div> */}

                <Form
                    {...{
                        active,
                        addressType: 'address',
                        title: 'Transfer HRC',
                        addresses,
                        submit: transferHRC
                    }}
                />

                <Form
                    {...{
                        active,
                        addressType: 'bech32Address',
                        title: 'Transfer ONE',
                        addresses: bech32Addresses,
                        submit: transferONE
                    }}
                />

            </section>
        </div>
    )
}