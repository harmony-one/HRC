
//generic reducer for updating state
export const getReducer = (type, defaultState) => {
	return (state = defaultState, action) => {
		if (action.type !== type) return state
		delete action.type
		return { ...state, ...action }
	}
}
//generic function for returning state based on keys found in defaultState
export const getState = (type) => ({ [type]: { ...state } }) => state