
import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { root } from './Input.module.scss'

export default function Input(props) {
	const dispatch = useDispatch()

    const [isMenuOpen, setMenuOpen] = useState(false)

    return (
        <div className={root}>
            <div contentEditable={true} suppressContentEditableWarning={true}>0</div>
        </div>
    )
}
