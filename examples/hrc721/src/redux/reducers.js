import { combineReducers } from 'redux';
import { hrc721Reducer } from './hrc721';
import { harmonyReducer } from './harmony';
import { crowdsaleReducer } from './crowdsale';

export default combineReducers({
    hrc721Reducer,
    harmonyReducer,
    crowdsaleReducer,
});