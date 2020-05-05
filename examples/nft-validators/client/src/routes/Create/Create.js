import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { setActive } from '../../redux/harmony'

import { addItem } from '../../redux/auction'
import Form from '../../components/Form/Form'

import { route, bubble, button } from './Create.module.scss'


export default function Home(props) {

    const {
        harmonyState: { active, allowToggle },
        hrc721State: { balances },
    } = props

    const [link, setLink] = useState(null)

    const dispatch = useDispatch()
    
    if (!active) return null

    return (
        <div className={route}>


            <section>
                {active &&
                    <div className={bubble}>
                        <h3>{active.name}</h3>
                        <p>ONE: {active.balanceONE}</p>
                        { allowToggle &&
                            <button 
                                onClick={() => dispatch(setActive(active.name === 'Alice' ? 'account' : 'minter'))}
                                className={button}
                            >Toggle User</button>
                        }
                    </div>
                }
            </section>



            { active &&
            <section>
                <Form
                    {...{
                        active,
                        title: 'Add Item',
                        fields: [
                            { label: 'Limit', type: 'number'},
                            { label: 'Price', type: 'number'},
                            { label: 'Link', type: 'text', onChange: (val) => setLink(val)},
                        ],
                        lowerContent:link && <img style={{ width: '100%' }} src={link} onError={() => setLink(null)} />,
                        submit: addItem
                    }}
                />

            </section>
            }

            

        </div>
    )
}