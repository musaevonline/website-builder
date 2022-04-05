import { Save as SaveIcon } from '@mui/icons-material';
import {
  Grid,
  TextField,
  Box,
  Checkbox,
  Tooltip,
  IconButton,
} from '@mui/material';
import { useRef } from 'react';

const PropField = (props) => {
  const { prop, value, onSave, toggleJSMode } = props;
  const tempValue = useRef(value)

  return (
    <Grid container>
      <Grid item xs={4}>
        <TextField
          value={prop[0] === '$' ? prop.slice(1) : prop}
          variant="standard"
          disabled
          fullWidth
          size="small"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          defaultValue={value}
          variant="standard"
          size="small"
          fullWidth
          onChange={e => tempValue.current = e.target.value}
        />
      </Grid>
      <Grid item xs={1}>
        <Tooltip title="JavaScript" placement="left" disableInteractive arrow>
          <Checkbox
            checked={prop[0] === '$'}
            size="small"
            sx={{ padding: '4px' }}
            onClick={() => toggleJSMode(prop)}
          />
        </Tooltip>
      </Grid>
      <Grid item xs={1}>
        <Tooltip title="Save" placement="right" disableInteractive arrow>
          <IconButton aria-label="delete" size="small" onClick={() => onSave(prop, tempValue.current)} sx={{paddingLeft: 0}}>
            <SaveIcon fontSize="14" />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export const PropsFields = ({ onSave, props, toggleJSMode }) => {
  const sortedProps = Object.entries(props).sort(([a], [b]) => {
    const keyA = a[0] === '$' ? a.slice(1) : a;
    const keyB = b[0] === '$' ? b.slice(1) : b;

    return keyA.localeCompare(keyB);
  })

  return (
    <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
      {sortedProps.map(([prop, value]) => (
        <PropField
          key={prop[0] === '$' ? prop.slice(1) : prop}
          prop={prop} 
          value={value} 
          onSave={onSave} 
          toggleJSMode={toggleJSMode}
        />
      ))}
    </Box>
  );
};
