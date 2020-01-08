import React, { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Router } from "@reach/router"

import { hrc20Init, hrc20State } from './redux/hrc20'
import { harmonyInit, harmonyState } from './redux/harmony'
import Header from './components/Header/Header'
import Home from './routes/Home/Home'

export default connect(
	(state) => ({
		harmonyState: harmonyState(state),
		hrc20State: hrc20State(state),
	})
)(function App(props) {

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(harmonyInit())
	}, [])

	return (
		<div>
			<Header {...props} />
			<Router>
				<Home {...props} path="/" />
			</Router>
		</div>
	)
})