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