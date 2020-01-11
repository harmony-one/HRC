import React, {useState} from 'react'
import { navigate } from "@reach/router"
import { useDispatch } from 'react-redux'
import { setActive } from './../../redux/harmony'
import { root, menu, menuOpen } from './Header.module.scss'

export default function Header({history}) {
	const dispatch = useDispatch()

    const [isMenuOpen, setMenuOpen] = useState(false)

    return (
        <div>
            <div className={[menu, isMenuOpen ? menuOpen : ''].join(' ')}>
                <div onClick={() => setMenuOpen(false)}></div>
                <div>
                    <i className={"fas fa-times"} onClick={() => setMenuOpen(false)}></i>
                    <section>
                        <p onClick={() => {
                            navigate('/')
                            dispatch(setActive('minter'))
                            setMenuOpen(false)
                        }}>Alice</p>
                        <p onClick={() => {
                            navigate('/')
                            dispatch(setActive('account'))
                            setMenuOpen(false)
                        }}>Bob</p>
                        <p onClick={() => {
                            navigate('/sale')
                            setMenuOpen(false)
                        }}>Sale Stats</p>
                    </section>
                </div>
            </div>
            <div className={root}>
                <p>HRC20 Crowdsale</p>
                <i className={"fas fa-bars"} onClick={() => setMenuOpen(true)}></i>
            </div>
        </div>
    )
}