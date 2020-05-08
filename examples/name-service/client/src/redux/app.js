import { getReducer, getState } from '../util/redux-util'
//default state
const defaultState = {
	mounted: false,
	loading: false,
	dialog: null,
}
const type = 'appReducer'
export const appReducer = getReducer(type, defaultState)
export const appState = getState(type)
//functions
export const mount = (val) => async (dispatch, getState) => {
	console.log('APP MOUNT')
	dispatch({ type, mounted: val })
}
export const setLoading = (loading) => async (dispatch, getState) => {
	dispatch({ type, loading })
}
export const setDialog = (dialog) => async (dispatch, getState) => {
	if (dialog) {
		return new Promise((resolve) => {
			dispatch({ type, dialog })
			dialog.callback = (...args) => resolve(...args)
		})
	} else {
		dispatch({ type, dialog: null })
	}
}