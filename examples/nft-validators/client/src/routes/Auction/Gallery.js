import React from 'react'
import { updateDialogState } from './../../redux/harmony'
import { makeBid } from './../../redux/auction'
import Form from './../../components/Form/Form'

import { inventory, image, stats, bidButton } from './Gallery.module.scss'

/********************************
@todo break out into /components
********************************/
export const Gallery = ({items, dispatch, active}) => <div className={inventory}>
    {
        items.map((item) => <Item key={item.index} item={item} dispatch={dispatch} active={active} />)
    }
</div>

/********************************
@todo break out into /components
********************************/
export const Item = ({ item: { index, url, isSoldOut, bids }, dispatch, active }) => {
    
    return <div>
        <div className={[image].join(' ')}>
            <img src={url} alt="auction item image" />
            <p>current price {bids.length > 0 ? bids[bids.length -1].amount : '0'}</p>
            <p>ID {index + 1}</p>
        </div>
        {
            bids.length > 0 ?
            <div className={stats}>
                {
                    bids.reverse().map(({ index, amount, owner }) => <p key={index}>
                        bid {index + 1}: <span>{amount} ONE</span> by <span>{owner}</span>
                    </p>)
                }
            </div>
            :
            <div className={stats}>
                <p>No Bids!</p>
            </div>
        }
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
    </div>
}

