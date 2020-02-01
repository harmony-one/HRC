import React, {useState} from 'react'
import { navigate } from "@reach/router"
import { useDispatch } from 'react-redux'
import { setActive } from './../../redux/harmony'
import { root, menu, menuOpen } from './Header.module.scss'
import config from '../../../config'
const { ENV, } = config

export default function Header({history, harmonyState: { network }}) {
	const dispatch = useDispatch()

    const [isMenuOpen, setMenuOpen] = useState(false)

    return (
        <div>
            <div className={[menu, isMenuOpen ? menuOpen : ''].join(' ')}>
                <div onClick={() => setMenuOpen(false)}></div>
                <div>
                    <i className={"fas fa-times"} onClick={() => setMenuOpen(false)}></i>
                    <section>
                        { ENV === 'local' &&

<p onClick={() => {
    navigate('/')
    dispatch(setActive('minter'))
    setMenuOpen(false)
}}>Alice</p>


                        }
                        <p onClick={() => {
                            navigate('/')
                            dispatch(setActive('account'))
                            setMenuOpen(false)
                        }}>My Account</p>
                        <p onClick={() => {
                            navigate('/create')
                            dispatch(setActive('account'))
                            setMenuOpen(false)
                        }}>Create</p>
                        <p onClick={() => {
                            navigate('/store')
                            setMenuOpen(false)
                        }}>Store</p>
                        <p onClick={() => {
                            navigate('/market')
                            setMenuOpen(false)
                        }}>Market</p>
                    </section>
                </div>
            </div>
            <div className={root}>
                <p>HRC721 Doggy Demo Dapp</p>
                <i className={"fas fa-bars"} onClick={() => setMenuOpen(true)}></i>
            </div>
        </div>
    )
}