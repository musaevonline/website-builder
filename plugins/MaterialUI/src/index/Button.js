import React from 'react'
import ReactDOM from 'react-dom';
import { Button } from '@mui/material'

const currentScript = document.currentScript;
const el = document.createElement("div");
window.attachToEditor(el, currentScript);
document.body.appendChild(el);

ReactDOM.render(<Button variant="contained">OK</Button>, el)
