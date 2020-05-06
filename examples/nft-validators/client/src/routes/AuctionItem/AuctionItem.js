import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'

import { updateDialogState } from './../../redux/harmony'
import { makeBid, getItem } from './../../redux/auction'
import Form from './../../components/Form/Form'

import { route, bubble, itemClass, image, stats, bidButton } from './Mod.module.scss'
import { navigate } from '@reach/router'

export default function AuctionItem(props) {

    const {
        id,
        harmonyState: { active },
        auctionState: { items, isOpen },
    } = props

    const dispatch = useDispatch()
    
    const itemIndex = parseInt(id) - 1

    useEffect(() => {
        dispatch(getItem(itemIndex, true))
    }, [])


    const item = items[itemIndex]
    const { index, url, isSoldOut, bids } = item

    return <div className={route}>

        { !isOpen &&
            <section>
                <div className={bubble}>
                    <p>The Auction is Closed</p>
                </div>
            </section>
        }
        

        
        <div className={itemClass}>

            <div className={bidButton}>
                <button onClick={() => navigate('/auction')}>Back to Auction</button>
            </div>
            { isOpen && !isSoldOut &&
                <div className={bidButton}>
                    <button onClick={() => dispatch(updateDialogState({
                        open: true,
                        content: <Form
                            {...{
                                active,
                                title: 'Bid Amount',
                                submit: ({amount}) => {
                                    dispatch(updateDialogState({ open: false }))
                                    return makeBid({
                                        index,
                                        amount,
                                    })
                                }
                            }}
                        />
                    }))}>Bid on This</button>
                </div>
            }
            
            {
                bids.length > 0 ?
                <div className={stats}>
                    {
                        bids.map(({ index, amount, owner }) => <p key={index}>
                            bid {index + 1}: <span>{amount} ONE</span> by <span>{owner}</span>
                        </p>)
                    }
                </div>
                :
                !isSoldOut && <div className={stats}>
                    <p>No Bids!</p>
                </div>
            }

            <div className={[image].join(' ')}>
                <img src={url} alt="auction item image" />
                <p style={{opacity: isSoldOut ? 0 : 1}}>current price {bids.length > 0 ? bids[bids.length -1].amount : '0'}</p>
                <p>ID {index + 1}</p>
            </div>
            
        </div>
    </div>
}