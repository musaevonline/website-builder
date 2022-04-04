import React from "react";
import ReactDOM from "react-dom";
import { TextField } from "@mui/material";
import { TimePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

const SCRIPT = document.currentScript
const SCRIPT_ID = SCRIPT.getAttribute('id')
const TEMPLATE = window.TEMPLATES[SCRIPT_ID]

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
ReactDOM.render(<Component />, TEMPLATE);
