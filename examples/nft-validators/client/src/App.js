import React, { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Router, navigate } from "@reach/router"

import { auctionState } from './redux/auction'
// import { hrc20State } from './redux/hrc20'
import { hrc721State } from './redux/hrc721'
import { fortmaticState, checkFortmaticLogin } from './redux/fortmatic'
import { harmonyInit, harmonyState } from './redux/harmony'
import Header from './components/Header/Header'
import Dialog from './components/Dialog/Dialog'
import Home from './routes/Home/Home'
import SignIn from './routes/SignIn/SignIn'
import Funds from './routes/Funds/Funds'
import Create from './routes/Create/Create'
import Auction from './routes/Auction/Auction'
// import Store from './routes/Store/Store'
// import Market from './routes/Market/Market'
import LoadingGIF from './img/loading.gif'

import { processingCover, } from './App.module.scss'

export default connect(
	(state) => ({
		harmonyState: harmonyState(state),
		// hrc20State: hrc20State(state),
		hrc721State: hrc721State(state),
		auctionState: auctionState(state),
		fortmaticState: fortmaticState(state),
	})
)(function App(props) {

	const dispatch = useDispatch()

	const {processing, active} = props.harmonyState
	const { isLoggedIn } = props.fortmaticState

	useEffect(() => {
		(async() => {
			await dispatch(harmonyInit())
			const loginCheck = await dispatch(checkFortmaticLogin())
			if (!loginCheck) {
				if (window.location.pathname.indexOf('signin') === -1) {
					navigate('/signin')
				}
			} else if (window.location.pathname.length > 1) window.location = '/'
		})()
	}, [])
	
	return (
		<div>

			{processing &&
                <div className={processingCover}>
                    <img src={LoadingGIF} />
                </div>
            }

			<Header {...props} />
			<Dialog {...props} />
			<Router>
				<Home {...props} path="/" />
				<SignIn {...props} path="/signin" />
				<Funds {...props} path="/funds" />
				<Create {...props} path="/create" />
				<Auction {...props} path="/auction" />
				{/* <Store {...props} path="/store" />
				<Market {...props} path="/market" /> */}
			</Router>
		</div>
	)
})