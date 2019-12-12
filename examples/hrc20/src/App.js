import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { loadContracts } from './redux/contract'
import Home from './routes/Home/Home'


export default function App() {

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(loadContracts())
	}, [])

	return (<Home />)
}