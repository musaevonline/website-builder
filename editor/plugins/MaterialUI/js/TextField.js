import React from "react";
import ReactDOM from "react-dom";
import { TextField } from "@mui/material";

const SCRIPT = document.currentScript
const SCRIPT_ID = SCRIPT.getAttribute('id')
const { template } = window.SCRIPTS[SCRIPT_ID]

ReactDOM.render(<TextField label="Hello world"/>, template);
