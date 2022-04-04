import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import { Button } from '@mui/material'
import { Provider, useSelector } from 'react-redux';

const SCRIPT = document.currentScript
const SCRIPT_ID = SCRIPT.getAttribute('id')
const { template } = window.SCRIPTS[SCRIPT_ID]

const App = () => {
    const [test, setTest] = useState()
    window.SCRIPTS[SCRIPT_ID].onChange = (test) => {
        setTest(test)
    }
    return <Button variant="contained">{test}</Button>
}

ReactDOM.render((
    <Provider store={window.STORE}>
        <App />
    </Provider>
), template)
