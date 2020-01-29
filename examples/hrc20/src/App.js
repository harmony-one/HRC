import React, { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Router } from "@reach/router"

import { crowdsaleInit, crowdsaleState } from './redux/crowdsale'
import { hrc20State } from './redux/hrc20'
import { harmonyInit, harmonyState } from './redux/harmony'
import Header from './components/Header/Header'
import Home from './routes/Home/Home'
import Sale from './routes/Sale/Sale'

export default connect(
	(state) => ({
		harmonyState: harmonyState(state),
		hrc20State: hrc20State(state),
		crowdsaleState: crowdsaleState(state),
	})
)(function App(props) {

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(harmonyInit())
		dispatch(crowdsaleInit())
	}, [])

	if (!props.harmonyState.active) return null


	return (
		<div>
			<Header {...props} />
			<Router>
				<Home {...props} path="/" />
				<Sale {...props} path="/sale" />
			</Router>
		</div>
	)
})