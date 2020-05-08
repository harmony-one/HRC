import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { setDialog } from '../../redux/app'
import { dialog, marginTop } from '../../theme/Theme.module.scss'

export default function Dialog(props) {

    const {
        title = 'Dialog',
		content = null,
		prompt = null,
		label = '',
		button1,
		button2,
		callback,
    } = props

    const dispatch = useDispatch()

	const [input, setInput] = useState('')
	
	const complete = (ok) => {
		if (callback) {
			callback({ ok, input })
		}
		dispatch(setDialog(null))
	}

	return (
		<div className={dialog}>
			<h2>{title}</h2>
            { content && <div>{content}</div>}
			{
				prompt &&
				<input 
					autoFocus
					className={marginTop}
					placeholder={label} type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)} 
					onKeyDown={({ key }) => {
						if (key === 'Enter') {
							complete(1)
						}
					}}
				/>
			}
			<div className={marginTop}>
				<button 
					onClick={() => complete(1)
				}>{ button1 || 'OK' }</button>
				{ button2 !== null &&
					<button onClick={() => complete(0)}>{ button2 || 'Close' }</button>
				}
			</div>
		</div>
	)
}