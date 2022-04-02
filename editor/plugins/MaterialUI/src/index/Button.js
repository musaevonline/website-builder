import React from 'react'
import ReactDOM from 'react-dom';
import { Button } from '@mui/material'

const SCRIPT = document.currentScript
const scriptID = SCRIPT.getAttribute('id')
const {x, y} = window.scripts[scriptID]

const el = document.createElement("div");

el.style.position = 'absolute'
el.style.left = x + 'px'
el.style.top = y + 'px'
el.setAttribute('editable', 'true');
el.setAttribute('script-id', scriptID);

document.body.appendChild(el);

ReactDOM.render(<Button variant="contained">OK</Button>, el)
