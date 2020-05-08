import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { handleLoginWithMagicLink } from '../../redux/fortmatic'
import config from './../../../config'
// console.log(config)
const { ENV } = config

import { route, bubble, button, marginTop } from './SignIn.module.scss'

export default function Home(props) {

    const dispatch = useDispatch()

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