import React from "react";
import ReactDOM from "react-dom";
import { TextField } from "@mui/material";
import { TimePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
const currentScript = document.currentScript;

const el = document.createElement("div");
window.attachToEditor(el, currentScript);
document.body.appendChild(el);

const Component = () => {
  const [value, setValue] = React.useState(null);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label="Basic example"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};
ReactDOM.render(<Component />, el);
