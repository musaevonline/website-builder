import { TextField } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';

import { useMyStore } from '../../useMyStore';

const SCRIPT = document.currentScript;
const SCRIPT_ID = SCRIPT.getAttribute('id');
const TEMPLATE = document.querySelector(`[script-id="${SCRIPT_ID}"]`);

const INITIAL_STATE = {
  autoComplete: undefined,
  autoFocus: false,
  children: undefined,
  className: undefined,
  color: 'primary',
  defaultValue: undefined,
  disabled: false,
  error: false,
  FormHelperTextProps: undefined,
  fullWidth: false,
  helperText: undefined,
  InputLabelProps: undefined,
  inputProps: undefined,
  InputProps: undefined,
  inputRef: undefined,
  label: undefined,
  maxRows: undefined,
  minRows: undefined,
  multiline: false,
  name: undefined,
  onBlur: undefined,
  onChange: undefined,
  onFocus: undefined,
  placeholder: undefined,
  $required: false,
  rows: undefined,
  select: false,
  SelectProps: undefined,
  type: undefined,
  value: undefined,
  variant: 'outlined',
};

const App = () => {
  const state = useMyStore(SCRIPT_ID, INITIAL_STATE);

  return <TextField {...state} />;
};

ReactDOM.render(<App />, TEMPLATE);
