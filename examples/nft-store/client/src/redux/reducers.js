import { combineReducers } from 'redux';
import { hrc20Reducer } from './hrc20';
import { hrc721Reducer } from './hrc721';
import { harmonyReducer } from './harmony';
import { crowdsaleReducer } from './crowdsale';

export default combineReducers({
    hrc20Reducer,
    hrc721Reducer,
    harmonyReducer,
    crowdsaleReducer,
});