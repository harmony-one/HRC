//generic event type for updating state
export const UPDATE = 'UPDATE_STATE'
//generic reducer for updating state
export const reducer = (state, action) => {
	//console.log(action)
	const { type } = action
	switch (type) {
		case UPDATE:
			const a = { ...action }
			delete a.type
			return { ...state, ...a }
		default:
			return state
	}
}

//generic reducer for updating state
export const getReducer = (defaultState) => (state = defaultState, action) => {
	const { type } = action
	switch (type) {
		case UPDATE:
			const a = { ...action }
			delete a.type
			return { ...state, ...a }
		default:
			return state
	}
}
//generic function for returning state based on keys found in defaultState
export const getState = (reducerName, defaultState) => {
	const stateKeys = Object.keys(defaultState)
	return ({ [reducerName]: { ...keys } }) => {
		Object.keys(keys).forEach((k) => {
			if (!stateKeys.includes(k)) delete keys[k]
		})
		return keys
	}
}