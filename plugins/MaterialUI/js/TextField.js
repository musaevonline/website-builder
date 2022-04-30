import { TextField as MaterialTextField } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';

import { useMyStore } from '../../useMyStore';

const SCRIPT = document.currentScript;
const SCRIPT_ID = SCRIPT.getAttribute('id');
const TEMPLATE = document.querySelector(`[script-id="${SCRIPT_ID}"]`);

const INITIAL_STATE = {
  autoComplete: undefined,
  $autoFocus: false,
  $children: undefined,
  $classes: undefined,
  color: 'primary',
  defaultValue: undefined,
  $disabled: false,
  $error: false,
  $FormHelperTextProps: undefined,
  $fullWidth: false,
  helperText: undefined,
  $InputLabelProps: undefined,
  $inputProps: undefined,
  $InputProps: undefined,
  label: undefined,
  $maxRows: undefined,
  $minRows: undefined,
  $multiline: false,
  name: undefined,
  $onBlur: undefined,
  $onChange: undefined,
  $onFocus: undefined,
  placeholder: undefined,
  $required: false,
  $rows: undefined,
  $select: false,
  $SelectProps: undefined,
  size: undefined,
  $sx: undefined,
  type: undefined,
  value: undefined,
  variant: 'outlined',
};

const TextField = () => {
  const state = useMyStore(SCRIPT_ID, INITIAL_STATE);

  return <MaterialTextField {...state} />;
};

ReactDOM.render(<TextField />, TEMPLATE);
