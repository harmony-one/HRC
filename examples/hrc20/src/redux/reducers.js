import { combineReducers } from 'redux';
import { hrc20Reducer } from './hrc20';
import { harmonyReducer } from './harmony';

export default combineReducers({
    hrc20Reducer,
    harmonyReducer,
});