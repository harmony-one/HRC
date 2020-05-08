import React, { Suspense, lazy } from 'react'
import { connect } from 'react-redux'
import { Router, navigate } from "@reach/router"
import { appState } from './redux/app'
import { harmonyState } from './redux/harmony'
//components
import Dialog from './components/Dialog/Dialog'
//image and style
import LoadingGif from './img/loading-bubble.gif'
import { overlay } from './theme/Theme.module.scss'
//routes
const Home = lazy(() => import('./routes/Home/Home'))
const About = lazy(() => import('./routes/About/About'))
//loading component
const Loading = () => <div className={overlay}>
	<img src={LoadingGif} />
</div>
//bring in both states here
//can also use connect in route components when data is specific to those routes
export default connect(
	(state) => ({
		appState: appState(state),
		harmonyState: harmonyState(state),
	})
)(function App(props) {

	const {
		appState: { dialog, loading },
		harmonyState: { initialized },
	} = props

	return (
		<div>
			{ loading && <Loading />}
			{ dialog && <div className={overlay}>
				<Dialog {...dialog} />
			</div>}
			
			<Suspense fallback={<Loading />}>
				<Router>
					<Home {...props} path="/" />
					<About {...props} path="/about" />
				</Router>
			</Suspense>
		</div>
	)
})