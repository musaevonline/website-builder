import { Button as MaterialButton } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';

import { useMyStore } from '../../useMyStore';

const SCRIPT = document.currentScript;
const SCRIPT_ID = SCRIPT.getAttribute('id');
const TEMPLATE = document.querySelector(`[script-id="${SCRIPT_ID}"]`);

const INITIAL_STATE = {
  $children: undefined,
  $classes: undefined,
  color: 'primary',
  $disabled: false,
  $disableElevation: false,
  $disableFocusRipple: false,
  $endIcon: undefined,
  $fullWidth: false,
  href: undefined,
  size: undefined,
  $startIcon: undefined,
  $sx: undefined,
  variant: 'contained',
};

const Button = () => {
  const state = useMyStore(SCRIPT_ID, INITIAL_STATE);

  return <MaterialButton {...state} />;
};

ReactDOM.render(<Button />, TEMPLATE);
