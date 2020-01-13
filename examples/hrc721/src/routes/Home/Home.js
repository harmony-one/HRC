import React from 'react'

import { transferONE } from './../../redux/harmony'
import { transferHRC } from './../../redux/hrc20'
import { purchaseHRC } from './../../redux/crowdsale'
import Form from './../../components/Form/Form'
import { route, gradient, bubble, marginTop, processingCover } from './Home.module.scss'
import LoadingGIF from '../../img/loading.gif'

export default function Home(props) {

    const {
        harmonyState: { processing, active, addresses, bech32Addresses },
        crowdsaleState: { raised }
    } = props

    return (
        <div className={route}>

            {processing &&
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


                <Form
                    {...{
                        active,
                        title: 'Contribute ONE',
                        subtitle: <span>Purchase HRC20 tokens by contributing to our crowdsale<br/>Rate:<br/>1 ONE = 1000 HRC</span>,
                        amountLabel: 'Amount in ONE',
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