import React from 'react';

const SCRIPT = document.currentScript;
const SCRIPT_ID = SCRIPT.getAttribute('id');

let COUNTER = 0;

// eslint-disable-next-line no-import-assign
React.useId = () => `${SCRIPT_ID}-${COUNTER++}`;
