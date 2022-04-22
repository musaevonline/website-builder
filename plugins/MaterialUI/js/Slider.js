import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import ReactDOM from 'react-dom';

const SCRIPT = document.currentScript;
const SCRIPT_ID = SCRIPT.getAttribute('id');
const TEMPLATE = document.querySelector(`[script-id="${SCRIPT_ID}"]`);

export default function ContinuousSlider() {
  const [value, setValue] = React.useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 200 }}>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <Slider aria-label="Volume" value={value} onChange={handleChange} />
      </Stack>
      <Slider disabled defaultValue={30} aria-label="Disabled slider" />
    </Box>
  );
}

ReactDOM.render(<ContinuousSlider />, TEMPLATE);
