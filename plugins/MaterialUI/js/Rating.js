import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import * as React from 'react';
import ReactDOM from 'react-dom';

const SCRIPT = document.currentScript;
const SCRIPT_ID = SCRIPT.getAttribute('id');
const TEMPLATE = document.querySelector(`[script-id="${SCRIPT_ID}"]`);

export default function BasicRating() {
  const [value, setValue] = React.useState(2);

  return (
    <Box
      sx={{
        '& > legend': { mt: 2 },
      }}
    >
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
    </Box>
  );
}

ReactDOM.render(<BasicRating />, TEMPLATE);
