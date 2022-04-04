import { createStore, combineReducers } from 'redux'

const store = createStore(createReducer(), {})

store.asyncReducers = {}

function createReducer(asyncReducers) {
    return combineReducers({
      root: (state = {}) => state,
      ...asyncReducers
    })
}

store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer
    store.replaceReducer(createReducer(store.asyncReducers))
}

window.STORE = store;