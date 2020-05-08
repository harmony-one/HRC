
import { combineReducers } from 'redux';
import { appReducer } from './app';
import { harmonyReducer } from './harmony';

export default combineReducers({
	appReducer,
	harmonyReducer,
});
