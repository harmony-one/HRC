import React, {useEffect, useState} from 'react'
import { navigate, useLocation } from "@reach/router"
import { useDispatch } from 'react-redux'
import { fortmaticSignOut } from '../../redux/fortmatic'
import ImageMatt from '../../img/matt.jpg'
import ImageMatt2 from '../../img/matt2.jpg'

import { root, menu, menuOpen, avatar } from './Header.module.scss'

const images = {
    'mattdlockyer@gmail.com': ImageMatt,
    'matt@harmony.one': ImageMatt2,
}

const titles = {
    home: 'My NFTs 🥰',
    // '/signin': 'Please Sign In',
    '/funds': 'Manage Funds 🤑',
    '/create': 'Make Your Own NFT',
    '/store': 'Purchase NFTs 😍',
    '/market': 'P2P Market 🤗',
}

export default function Header({
    history,
    harmonyState: { network, active, allowToggle },
    hrc20State: { hrc20balances },
}) {

	const dispatch = useDispatch()

    const [isMenuOpen, setMenuOpen] = useState(false)
    const [location, setLocation] = useState('/')

    useEffect(() => {
        setLocation(window.location.pathname)
    })

    const goTo = (where) => {
        navigate(where)
        setLocation(where)
    }

    if (!active) return null

    const hrc20balance = hrc20balances[active.name] || 0

    return (
        <div>
            <div className={[menu, isMenuOpen ? menuOpen : ''].join(' ')}>
                <div onClick={() => setMenuOpen(false)}></div>
                <div>
                    { active && <h3>{active.name}</h3>}
                    <i className={"fas fa-times"} onClick={() => setMenuOpen(false)}></i>


                    {
                        active && 
                        <div className={avatar}>
                            <img src={images[active.name]} />
                        </div>
                    }

                    {active && 
                        <section>
                            <p><b>ONE:</b>&nbsp;{active.balanceONE}</p>
                            <p><b>USD:</b>&nbsp;{hrc20balance}</p>
                            { allowToggle &&
                                <button 
                                    onClick={() => dispatch(setActive(active.name === 'Alice' ? 'account' : 'minter'))}
                                    className={button}
                                >Toggle User</button>
                            }
                        </section>
                    }

                    
                    <section>
                        <p onClick={() => {
                            goTo('/')
                            setMenuOpen(false)
                        }}><i className="far fa-user-circle fa-lg"></i><span>Account</span></p>
                        <p onClick={() => {
                            goTo('/funds')
                            setMenuOpen(false)
                        }}><i className="fas fa-coins fa-lg"></i><span>Funds</span></p>
                        {/* <p onClick={() => {
                            goTo('/create')
                            setMenuOpen(false)
                        }}><i className="fab fa-creative-commons fa-lg"></i><span>Create</span></p> */}
                        <p onClick={() => {
                            goTo('/store')
                            setMenuOpen(false)
                        }}><i className="fas fa-store fa-lg"></i><span>Store</span></p>
                        <p onClick={() => {
                            goTo('/market')
                            setMenuOpen(false)
                        }}><i className="fas fa-users"></i><span>Market</span></p>
                        <p onClick={async () => {
                            await dispatch(fortmaticSignOut())
                            setMenuOpen(false)
                            goTo('/signin')
                        }}><i className="fas fa-sign-out-alt"></i><span>SignOut</span></p>
                    </section>
                </div>
            </div>
            <div className={root}>
                <p>{titles[location] || titles.home}</p>
                <i className={"fas fa-bars"} onClick={() => setMenuOpen(true)}></i>
            </div>
        </div>
    )
}