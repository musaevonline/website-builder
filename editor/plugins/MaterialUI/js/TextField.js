import React from "react";
import ReactDOM from "react-dom";
import { TextField } from "@mui/material";
import { Provider, useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit'

const SCRIPT = document.currentScript
const SCRIPT_ID = SCRIPT.getAttribute('id')
const TEMPLATE = window.TEMPLATES[SCRIPT_ID]

const {reducer, actions} = createSlice({
    name: SCRIPT_ID,
    initialState: {
      onChange: undefined
    },
    reducers: {
      onChange: (state, action) => {
        state.onChange = action.payload
      }
    }
})

window.STORE.injectReducer(SCRIPT_ID, reducer)
window.ACTIONS[SCRIPT_ID] = actions

const App = () => {
    const onChange = eval(useSelector(state => state[SCRIPT_ID].onChange))
    return <TextField label="Hello world" onChange={onChange}/>
}

ReactDOM.render((
    <Provider store={window.STORE}>
        <App />
    </Provider>
), TEMPLATE);
