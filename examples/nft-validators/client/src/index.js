import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import reducers from './redux/reducers'

const store = createStore(reducers, applyMiddleware(thunk))

import App from './App'

// import './theme/Theme.module.scss'

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
