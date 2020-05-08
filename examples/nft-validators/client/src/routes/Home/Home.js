import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { navigate } from "@reach/router"
import { setBidName } from '../../redux/auction'

import Form from '../../components/Form/Form'
import Inventory from './../../components/Inventory/Inventory'

import { route, bubble, button } from './Home.module.scss'

export default function Home(props) {

    const {
        harmonyState: { active, allowToggle, isSignedIn },
        hrc721State: { balances },
        auctionState: { activeName, isOpen },
    } = props
    
    const [name, setName] = useState(null)

    const dispatch = useDispatch()

    if (!active) return null

    return (
        <div className={route}>

            <section>
                <div className={bubble}>
                    <h3>{ isOpen ? 'The Auction is Open!' : 'The Auction is Closed'}</h3>
                    { isOpen && <button
                        className={button}
                        onClick={() => navigate('/auction')}
                    >Go To Auction</button>}
                </div>
            </section>

            {
                isSignedIn ? 

                <section>
                    <div className={bubble}>
                        <h3>Current Name: {activeName && activeName.length > 0 ? activeName : 'anonymous'}</h3>
                        <Form
                            {...{
                                inline: true,
                                active,
                                title: 'Update Your Name',
                                fields: [
                                    { label: 'Name', type: 'text', onChange: (val) => setName(val)},
                                ],
                                submit: setBidName
                            }}
                        />
                    </div>
                </section>
                :
                <section>
                    <div className={bubble}>
                        <p>You are not signed in, but you can still go to the auction if it is open.</p>
                        <button
                            className={button}
                            onClick={() => navigate('/signin')}
                        >Sign In</button>
                    </div>
                </section>
            }

            

            {isSignedIn && active && balances[active.address] && Object.keys(balances[active.address]).length === 0 &&
                <section>
                    <div className={bubble}>
                        <h2>No Items!</h2>
                    </div>
                </section>
            }

            {active && balances[active.address] && Object.keys(balances[active.address]).length > 0 &&
                <section>
                    <div style={{marginBottom:16}} className={bubble}>
                        <h2>My Items</h2>
                    </div>
                    <Inventory {...props}
                        balance={active && balances && balances[active.address]}
                        wallet={true}
                    />
                </section>
            }
        </div>
    )
}