import { Rating as MaterialRating } from '@mui/material';
import * as React from 'react';
import ReactDOM from 'react-dom';

import { useMyStore } from '../../useMyStore';

const SCRIPT = document.currentScript;
const SCRIPT_ID = SCRIPT.getAttribute('id');
const TEMPLATE = document.querySelector(`[script-id="${SCRIPT_ID}"]`);

const INITIAL_STATE = {
  $classes: undefined,
  $defaultValue: undefined,
  $disabled: false,
  $emptyIcon: undefined,
  emptyLabelText: 'Empty',
  $getLabelText: undefined,
  $highlightSelectedOnly: false,
  $icon: undefined,
  $IconContainerComponent: undefined,
  $max: 5,
  name: undefined,
  $onChange: undefined,
  $onChangeActive: undefined,
  $precision: 1,
  $readOnly: false,
  size: 'medium',
  $sx: undefined,
  $value: undefined,
};

const Rating = () => {
  const state = useMyStore(SCRIPT_ID, INITIAL_STATE);

  return <MaterialRating {...state} />;
};

ReactDOM.render(<Rating />, TEMPLATE);
