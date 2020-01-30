
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Input from './../Input/Input'
import { root, bubble, marginTop, center, breakAll } from './Form.module.scss'

export default function Form(props) {

    const {
        active, addressType, addresses,
        submit, title, subtitle = '', amountLabel,
    } = props


    const dispatch = useDispatch()

    const [toAddress, setToAddress] = useState('')
    const [inputValues, setInputValues] = useState({})
    const [resetInput, setResetInput] = useState(null)
    const handleInputChange = (name, val) => setInputValues({ ...inputValues, [name]: val })

    useEffect(() => {
        setResetInput(Math.random().toString())
    }, [active])

    return (
        <div className={root}>
            <h2 className={marginTop}>{title}</h2>
            <div className={bubble}>
                {subtitle && <p>{subtitle}</p>}
                <Input
                    name="amount"
                    type="number"
                    placeholder={amountLabel || "amount"}
                    reset={resetInput}
                    onChange={handleInputChange}
                />
                {addressType && addresses &&
                    <div>
                        <Input
                            name="address"
                            type="text"
                            placeholder="to"
                            value={toAddress}
                            reset={resetInput}
                            onChange={handleInputChange}
                        />
                        {
                            //addresses.filter((a) => a !== active[addressType]).map((a) => (
                            addresses.map((a) => (
                                <p
                                    name="address"
                                    key={a}
                                    className={breakAll}
                                    onClick={() => {
                                        setToAddress(a)
                                        setTimeout(() => setToAddress(''), 25)
                                    }}
                                >{a}</p>
                            ))
                        }
                    </div>
                }
            </div>
            <div className={center}>
                <button onClick={() => setResetInput(Math.random().toString())}>Clear</button>
                <button onClick={() => {
                    dispatch(submit(inputValues))
                    setInputValues({})
                    setResetInput(Math.random().toString())
                }}>Send</button>
            </div>


        </div>
    )
}


