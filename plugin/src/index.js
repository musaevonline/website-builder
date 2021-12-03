import { TextField } from '@mui/material';
import { TimePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import React from 'react'
import ReactDOM from 'react-dom';

var currentScript = document.currentScript;
(async () => {
    const god = currentScript
    // const [React, ReactDOM] = await Promise.all([
    //     window.import('https://unpkg.com/react@17/umd/react.production.min.js', 'React'),
    //     window.import('https://unpkg.com/react-dom@17/umd/react-dom.production.min.js', 'ReactDOM'),
    // ])
    const [x, y, id] = [god.getAttribute('x'), god.getAttribute('y'), god.getAttribute('id')]
    const el = document.createElement("div");
    el.style = god.getAttribute('style');
    el.setAttribute('editable', 'true');
    el.setAttribute('script-id', id);
    document.body.appendChild(el);
    console.log(TextField.render)

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
        )
    }
    ReactDOM.render(<Component />, el)
})()