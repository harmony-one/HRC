import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { setActive } from './../../redux/harmony'
import { root, menu, menuOpen } from './Header.module.scss'

export default function Header(props) {
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
                            dispatch(setActive('minter'))
                            setMenuOpen(false)
                        }}>Minter</p>
                        <p onClick={() => {
                            dispatch(setActive('account'))
                            setMenuOpen(false)
                        }}>My Account</p>
                    </section>
                </div>
            </div>
            <div className={root}>
                <p>HRC 20</p>
                <i className={"fas fa-bars"} onClick={() => setMenuOpen(true)}></i>
            </div>
        </div>
    )
}