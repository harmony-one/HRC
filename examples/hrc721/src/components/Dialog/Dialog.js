import React, {useState} from 'react'
import { navigate } from "@reach/router"
import { useDispatch } from 'react-redux'
import { updateDialogState } from '../../redux/harmony'
import { dialog, dialogOpen } from './Dialog.module.scss'

export default function Dialog({
    history,
    harmonyState: { dialogState = {}, },
}) {
    const dispatch = useDispatch()

    return (
        <div>
            <div className={[dialog, dialogState.open ? dialogOpen : ''].join(' ')}>
                <div onClick={() => dispatch(updateDialogState({ open: false }))}></div>
                <div>
                    <section>
                        {
                            dialogState.content
                        }
                    </section>
                </div>
            </div>
        </div>
    )
}