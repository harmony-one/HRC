import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { handleLoginWithMagicLink } from '../../redux/fortmatic'
import config from './../../../config'
// console.log(config)
const { ENV } = config

import { route, bubble, button, marginTop } from './SignIn.module.scss'

export default function Home(props) {

    const {
        harmonyState: { active, isSignedIn, accountLocked, hmyExt }
    } = props

    console.log(isSignedIn, )

    const dispatch = useDispatch()

    return (
        <div className={route}>
            <section>
                <div className={bubble}>
                    <h3>Welcome!</h3>
                    {
                        !hmyExt && <p>
                            No Harmony compatible extension was detected.<br />
                            Click <a href="https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc" target="_blank">here</a> to install Math Wallet from the Google Chrome Store.
                        </p>
                    }
                    {
                        hmyExt && accountLocked && <div>
                            <p>Your Math Wallet is locked.</p>
                            <ol>
                                <li>Unlock your Math Wallet using your password</li>
                                <li>Connect to the Harmony Mainnet by clicking "Switch Network"</li>
                                <li>Reload the page</li>
                                <li>When Math Wallet pops up again, select your account</li>
                            </ol>
                        </div>
                    }
                </div>
            </section>
        </div>
    )

    /********************************
    Enable this for fortmatic login
    ********************************/

    return (
        <div className={route}>
            <section>
                <div className={bubble}>
                    <h3>Welcome!</h3>
                    <p>Enter your email used with Fortmatic to sign in!</p>
                    <input type="text" id="user-email" placeholder="Enter your email!" />
                    <button 
                        className={[button, marginTop].join(' ')}
                        onClick={() => dispatch(handleLoginWithMagicLink(document.querySelector('#user-email').value))}
                    >
                        Login
                    </button>
                </div>
            </section>
        </div>
    )
}