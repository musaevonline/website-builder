import React from 'react'
import ReactDOM from 'react-dom';
import { Button } from '@mui/material'
import { Provider, useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit'

const SCRIPT = document.currentScript
const SCRIPT_ID = SCRIPT.getAttribute('id')
const TEMPLATE = window.TEMPLATES[SCRIPT_ID]

const {reducer, actions} = createSlice({
    name: SCRIPT_ID,
    initialState: {
      label: 'OK',
      onClick: undefined,
    },
    reducers: {
      label: (state, action) => {
        state.label = action.payload
      },
      onClick: (state, action) => {
        state.onClick = action.payload
      }
    }
})

window.STORE.injectReducer(SCRIPT_ID, reducer)
window.ACTIONS[SCRIPT_ID] = actions

const App = () => {
    const label = useSelector(state => state[SCRIPT_ID].label)
    const onClick = eval(useSelector(state => state[SCRIPT_ID].onClick))
    return <Button variant="contained" onClick={onClick}>{label}</Button>
}

ReactDOM.render((
    <Provider store={window.STORE}>
        <App />
    </Provider>
), TEMPLATE)
