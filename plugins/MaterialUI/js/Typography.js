import React from "react";
import ReactDOM from "react-dom";
import { Typography } from "@mui/material";
import { useMyStore } from "../../useMyStore";

const SCRIPT = document.currentScript
const SCRIPT_ID = SCRIPT.getAttribute('id')
const TEMPLATE = window.TEMPLATES[SCRIPT_ID]

const App = () => {
    const { text } = useMyStore(SCRIPT_ID, { text: 'Hello' })
    return <Typography>{text}</Typography>
}

ReactDOM.render((<App />), TEMPLATE);
