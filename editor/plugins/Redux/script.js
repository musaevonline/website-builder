import {createStore} from 'redux'

const reducer = () => {
    return {
        test: '123 test'
    }
}

window.STORE = createStore(reducer)