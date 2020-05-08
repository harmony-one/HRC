import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'
import { navigate } from '@reach/router'

import { init, setAddressName, getNameByAddress } from '../../redux/harmony'
import { setDialog } from '../../redux/app'
import { root, logoutButton } from './Mod.module.scss'

export default function Home(props) {

	const {
		harmonyState: { initialized, account, nameFromChain },
	} = props

	const [name, setName] = useState('')

	const dispatch = useDispatch()
	
	useEffect(() => {
		dispatch(init())
	}, [])

	console.log('harmonyState', initialized)

	return (
		<div className={root}>
			
			<h2>Home</h2>

			<input placeholder={'Choose Name'} value={name} onChange={(e) => setName(e.target.value)} />
			<button onClick={() => dispatch(setAddressName(name))}>Set Name</button>

			<button onClick={() => dispatch(getNameByAddress(account.address))}>Get Name</button>
			
			<p>nameFromChain: {nameFromChain}</p>
		</div>
	)
}