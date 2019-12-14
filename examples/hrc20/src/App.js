import React, { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Router } from "@reach/router"

import { contractState, loadContracts } from './redux/contract'
import Header from './components/Header/Header'
import Home from './routes/Home/Home'


export default connect(
	(state) => ({
		contractState: contractState(state),
	})
)(function App(props) {

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(loadContracts())
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