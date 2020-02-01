import React, { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Router } from "@reach/router"

import { crowdsaleInit, crowdsaleState } from './redux/crowdsale'
import { hrc721State } from './redux/hrc721'
import { harmonyInit, harmonyState } from './redux/harmony'
import Header from './components/Header/Header'
import Dialog from './components/Dialog/Dialog'
import Home from './routes/Home/Home'
import Store from './routes/Store/Store'
import Create from './routes/Create/Create'
import Market from './routes/Market/Market'
import LoadingGIF from './img/loading.gif'

import { processingCover, } from './App.module.scss'

export default connect(
	(state) => ({
		harmonyState: harmonyState(state),
		hrc721State: hrc721State(state),
		crowdsaleState: crowdsaleState(state),
	})
)(function App(props) {

	const dispatch = useDispatch()

	const {processing} = props.harmonyState

	useEffect(() => {
		dispatch(harmonyInit())
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
				<Create {...props} path="/create" />
				<Store {...props} path="/store" />
				<Market {...props} path="/market" />
			</Router>
		</div>
	)
})