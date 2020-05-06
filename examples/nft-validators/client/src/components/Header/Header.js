import React, {useEffect, useState} from 'react'
import { navigate, useLocation } from "@reach/router"
import { useDispatch } from 'react-redux'
import { fortmaticSignOut } from '../../redux/fortmatic'
import { setActive } from '../../redux/harmony'
import { toggleAuction, distribute, withdraw } from '../../redux/auction'
import AvatarImage from '../../img/avatar.png'

import { root, menu, menuOpen, avatar, button } from './Header.module.scss'

const admins = [
    '0x7c41e0668b551f4f902cfaec05b5bdca68b124ce',
    '0xdfdd951ed9d9eee1ced6bcf5b398b56db1723cfa'
]
    

const titles = {
    home: 'Validator NFT Auction',
    // '/signin': 'Please Sign In',
    '/funds': 'Manage Funds 🤑',
    '/create': 'Make Your Own NFT 🤗',
    '/auction': 'Validator NFT Auction',
    // '/store': 'Purchase NFTs 😍',
    // '/market': 'P2P Market 🤗',
}

export default function Header({
    history,
    harmonyState: { network, active, allowToggle },
    auctionState: { activeName, isOpen, funds },
    // hrc20State: { hrc20balances },
}) {

	const dispatch = useDispatch()

    const [isMenuOpen, setMenuOpen] = useState(false)
    const [location, setLocation] = useState(window.location.pathname)

    useEffect(() => {
        setLocation(window.location.pathname)
    })

    const goTo = (where) => {
        navigate(where)
        setLocation(where)
    }

    if (!active) return null

    // const hrc20balance = hrc20balances[active.name] || 0

    return (
        <div>
            <div className={[menu, isMenuOpen ? menuOpen : ''].join(' ')}>
                <div onClick={() => setMenuOpen(false)}></div>
                <div>
                    <h3>{ activeName && activeName.length > 0 ? activeName : 'anonymous' }</h3>
                    <i className={"fas fa-times"} onClick={() => setMenuOpen(false)}></i>

                    {
                        active && 
                        <div className={avatar}>
                            <img src={AvatarImage} />
                        </div>
                    }

                    {active && 
                        <section>
                            { allowToggle &&
                                <button 
                                    onClick={() => dispatch(setActive(active.name === 'Alice' ? 'account' : 'minter'))}
                                    className={button}
                                >Toggle User</button>
                            }
                            
                            <p><b>ONE:</b>&nbsp;{active.balanceONE}</p>
                            {/* <p><b>USD:</b>&nbsp;{hrc20balance}</p> */}
                            
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
                            goTo('/auction')
                            setMenuOpen(false)
                        }}><i className="fas fa-store fa-lg"></i><span>Auction</span></p>
                        {/* <p onClick={async () => {
                            await dispatch(fortmaticSignOut())
                            setMenuOpen(false)
                            goTo('/signin')
                        }}><i className="fas fa-sign-out-alt"></i><span>SignOut</span></p> */}
                        {
                            admins.includes(active.address) && <>
                                <p>Admin Only</p>
                                { 
                                    !isOpen ?
                                    <>
                                        <p>Raised: {funds}</p>
                                        <p onClick={async () => {
                                            await dispatch(toggleAuction({ value: true }))
                                        }}><i className="fas fa-check"></i><span>Open Auction</span></p>
                                        <p onClick={async () => {
                                            await dispatch(distribute())
                                        }}><i className="fas fa-user"></i><span>Distribute NFTs</span></p>
                                        <p onClick={async () => {
                                            await dispatch(withdraw())
                                        }}><i className="fas fa-coins"></i><span>Withdraw Funds</span></p>
                                    </>
                                    :
                                    <>
                                        <p onClick={async () => {
                                            await dispatch(toggleAuction({ value: false }))
                                        }}><i className="fas fa-times"></i><span>Close Auction</span></p>
                                    </>
                                }
                               
                                
                            </>
                        }
                    </section>
                </div>
            </div>
            <div className={root}>
                <p>{titles[location] || titles.home}</p>
                {/* <p><b>ONE:</b>&nbsp;{active.balanceONE}</p> */}
                <i className={"fas fa-bars"} onClick={() => setMenuOpen(true)}></i>
            </div>
        </div>
    )
}