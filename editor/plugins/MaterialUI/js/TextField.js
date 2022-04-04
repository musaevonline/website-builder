import React from "react";
import ReactDOM from "react-dom";
import { TextField } from "@mui/material";
import { useMyStore } from "../../useMyStore";

const SCRIPT = document.currentScript
const SCRIPT_ID = SCRIPT.getAttribute('id')
const TEMPLATE = window.TEMPLATES[SCRIPT_ID]

const App = () => {
    const { onChange } = useMyStore(SCRIPT_ID, { onChange: undefined })
    return <TextField label="Hello world" onChange={eval(onChange)} />
}

ReactDOM.render((<App />), TEMPLATE);
