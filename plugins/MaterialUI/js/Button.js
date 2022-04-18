import React from "react";
import ReactDOM from "react-dom";
import { Button } from "@mui/material";
import { useMyStore } from "../../useMyStore";

const SCRIPT = document.currentScript
const SCRIPT_ID = SCRIPT.getAttribute('id')
const TEMPLATE = window.TEMPLATES[SCRIPT_ID]

const App = () => {
    const { onClick, label } = useMyStore(SCRIPT_ID, { onClick: undefined, label: 'OK' })
    return <Button variant="contained" onClick={eval(onClick)}>{label}</Button>
}

ReactDOM.render((<App />), TEMPLATE);
