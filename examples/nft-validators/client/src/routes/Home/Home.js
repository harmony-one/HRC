import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { navigate } from "@reach/router"
import { setBidName } from '../../redux/auction'

import Form from '../../components/Form/Form'
import Inventory from './../../components/Inventory/Inventory'

import { route, bubble, button } from './Home.module.scss'

export default function Home(props) {

    const {
        harmonyState: { active, allowToggle },
        hrc721State: { balances },
        auctionState: { activeName },
    } = props
    
    const [name, setName] = useState(null)

    const dispatch = useDispatch()

    if (!active) return null

    return (
        <div className={route}>

            <section>
                <div className={bubble}>
                    <h2>Current Name:</h2>
                    <p>{activeName.length > 0 ? activeName : 'anonymous'}</p>
                    <Form
                        {...{
                            inline: true,
                            active,
                            title: 'Set Your Name',
                            fields: [
                                { label: 'Name', type: 'text', onChange: (val) => setName(val)},
                            ],
                            submit: setBidName
                        }}
                    />
                </div>
            </section>

            {active && balances[active.name] && Object.keys(balances[active.name]).length === 0 &&
                <section>
                    <div className={bubble}>
                        <h2>No Items!</h2>
                        <p>Bid on an NFT</p>
                        <button 
                            className={button}
                            onClick={() => navigate('/auction')}
                        >Auction</button>
                    </div>
                </section>
            }

            {active && balances[active.name] && Object.keys(balances[active.name]).length > 0 &&
                <section>
                    <Inventory {...props}
                        balance={active && balances && balances[active.name]}
                        wallet={true}
                    />
                </section>
            }
        </div>
    )
}