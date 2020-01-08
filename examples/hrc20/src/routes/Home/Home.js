import React from 'react'

import { transferONE } from './../../redux/harmony'
import { transferHRC } from './../../redux/hrc20'
import { purchaseHRC } from './../../redux/crowdsale'
import Form from './../../components/Form/Form'
import { route, gradient, bubble, processingCover } from './Home.module.scss'
import LoadingGIF from '../../img/loading.gif'

export default function Home(props) {

    const {
        harmonyState: { processing, active, addresses, bech32Addresses }
    } = props

    return (
        <div className={route}>

            { processing &&
                <div className={processingCover}>
                    <img src={LoadingGIF} />
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
                        title: 'Purchase HRC',
                        submit: purchaseHRC
                    }}
                />


                <Form
                    {...{
                        active,
                        addressType: 'address',
                        title: 'Transfer HRC',
                        addresses: addresses,
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