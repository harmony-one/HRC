import React from 'react'

import { route, gradient, bubble, marginTop, center } from './Home.module.scss'
import Input from './../../components/Input/Input'

export default function Home(props) {

    const {
        contractState: { active }
    } = props

    return (
        <div className={route}>

            <section>
                <h2>Harmony HRC20 Crowdsale</h2>
            </section>

            <section className={gradient}>
                <h2>Balances</h2>
                { active &&
                    <div className={bubble}>
                        <h3>{active.name}</h3>
                        <p>{active.balanceONE}</p>
                        <p>{active.balanceHRC}</p>
                    </div>
                }
                <h2 className={marginTop}>Buy HRC Tokens</h2>
                { active &&
                    <div className={bubble}>
                        <h3>Amount</h3>
                        <Input />
                    </div>
                }
                <div className={center}>
                    <button>Send Transaction</button>
                </div>
            </section>
        </div>
    )
}