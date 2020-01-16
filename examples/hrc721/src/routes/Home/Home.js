import React from 'react'

import { transferONE } from './../../redux/harmony'
import { transferHRC } from './../../redux/hrc721'
import { purchaseHRC } from './../../redux/crowdsale'
import Form from './../../components/Form/Form'
import { route, gradient, bubble, marginTop, processingCover, inventory, image, button } from './Home.module.scss'
import LoadingGIF from '../../img/loading.gif'

export default function Home(props) {

    const {
        harmonyState: { processing, active, addresses, bech32Addresses },
        crowdsaleState: { items }
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
                    </div>
                }
            </section>

            <section className={gradient}>
                <h2>Items</h2>
                <div className={inventory}>
                {
                    items.map((item, i) => 
                        <div key={i}>
                            <div>
                                <div className={image}>
                                    <img src={item.url} alt="dog" />
                                </div>
                                <p>{item.minted} / {item.limit} sold</p>
                            </div>
                            <div className={button}>
                                <button onClick={() => console.log(i)}>Purchase</button>
                            </div>
                        </div>
                    )
                }
                </div>
            </section>
        </div>
    )
}