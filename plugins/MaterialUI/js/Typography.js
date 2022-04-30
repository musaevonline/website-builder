import { Typography as MaterialTypography } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';

import { useMyStore } from '../../useMyStore';

const SCRIPT = document.currentScript;
const SCRIPT_ID = SCRIPT.getAttribute('id');
const TEMPLATE = document.querySelector(`[script-id="${SCRIPT_ID}"]`);

const INITIAL_STATE = {
  align: 'inherit',
  $children: undefined,
  $classes: undefined,
  $gutterBottom: false,
  $noWrap: false,
  $paragraph: false,
  $sx: undefined,
  variant: undefined,
  $variantMapping: undefined,
};

const Typography = () => {
  const state = useMyStore(SCRIPT_ID, INITIAL_STATE);

  return <MaterialTypography {...state} />;
};

ReactDOM.render(<Typography />, TEMPLATE);
