import { Typography } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';

import { useMyStore } from '../../useMyStore';

const SCRIPT = document.currentScript;
const SCRIPT_ID = SCRIPT.getAttribute('id');
const TEMPLATE = document.querySelector(`[script-id="${SCRIPT_ID}"]`);

const App = () => {
  const { text } = useMyStore(SCRIPT_ID, { text: 'Hello' });

  return <Typography>{text}</Typography>;
};

ReactDOM.render(<App />, TEMPLATE);
