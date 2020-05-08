import React from 'react'

import { inventory, soldOut, image, stats, bidButton } from './Gallery.module.scss'
import { navigate } from '@reach/router'

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
    
    return <div className={isSoldOut ? soldOut : ''}>
        <div className={[image].join(' ')}>
            <img src={url} alt="auction item image" onClick={isSoldOut ? () => {} : () => navigate('/token/' + (index + 1))} />
            <p style={{opacity:0}}>current price {bids.length > 0 ? bids[bids.length -1].amount : '0'}</p>
            <p>ID {index + 1}</p>
        </div>
        {
            bids.length > 0 ?
            <div className={stats}>
                {
                    bids.slice(0, 1).map(({ index, amount, owner }) => <p key={index}>
                        last bid: <span>{amount} ONE</span> by <span>{owner}</span>
                    </p>)
                }
            </div>
            :
            <div className={stats}>
                <p>{isSoldOut ? 'Sold Out!' : 'No Bids!'}</p>
            </div>
        }
        {!isSoldOut &&
            <div className={bidButton}>
                <button onClick={() => navigate('/token/' + (index + 1))}>More</button>
            </div>
        }
    </div>
}

