import { combineReducers } from 'redux';
// import { hrc20Reducer } from './hrc20';
import { hrc721Reducer } from './hrc721';
import { harmonyReducer } from './harmony';
import { auctionReducer } from './auction';
import { fortmaticReducer } from './fortmatic';

export default combineReducers({
    // hrc20Reducer,
    hrc721Reducer,
    harmonyReducer,
    auctionReducer,
    fortmaticReducer,
});