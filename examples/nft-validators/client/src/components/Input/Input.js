
import React, {useEffect, useState} from 'react'
import { root } from './Input.module.scss'

export default function Input(props) {

    const {
        value: propValue,
        reset,
        name,
        type,
        placeholder,
        onChange
    } = props

    const [val, setVal] = useState('')

    const updateValue = (value) => {
        setVal(value)
        if (onChange) onChange(name, value)
    }
    
    useEffect(() => {
        if (propValue && propValue.length > 0 && propValue !== val) updateValue(propValue)
    }, [propValue])

    useEffect(() => {
        if (reset) updateValue('')
    }, [reset])

    return (
        <div className={root}>
            <input
                value={val}
                type={type}
                placeholder={placeholder}
                onChange={(e) => updateValue(e.target.value)}
            />
        </div>
    )
}
