import React from "react";
import ReactDOM from "react-dom";
import { TextField } from "@mui/material";

const currentScript = document.currentScript;
const el = document.createElement("div");
window.attachToEditor(el, currentScript);
document.body.appendChild(el);

ReactDOM.render(<TextField />, el);
