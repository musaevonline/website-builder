import React from "react";
import ReactDOM from "react-dom";
import { Typography } from "@mui/material";
import { Provider, useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit'

const SCRIPT = document.currentScript
const SCRIPT_ID = SCRIPT.getAttribute('id')
const TEMPLATE = window.TEMPLATES[SCRIPT_ID]

const {reducer, actions} = createSlice({
    name: SCRIPT_ID,
    initialState: {
      text: 'Hello world'
    },
    reducers: {
      text: (state, action) => {
        state.text = action.payload
      }
    }
})

window.STORE.injectReducer(SCRIPT_ID, reducer)
window.ACTIONS[SCRIPT_ID] = actions

const App = () => {
    const text = useSelector(state => state[SCRIPT_ID].text)
    return <Typography>{text}</Typography>
}

ReactDOM.render((
    <Provider store={window.STORE}>
        <App />
    </Provider>
), TEMPLATE);
