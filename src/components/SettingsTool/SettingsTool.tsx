import { Box, FormGroup } from '@mui/material';
import React from 'react';

interface ISettingsToolProps {
  selected: HTMLElement;
}

export const SettingsTool: React.FC<ISettingsToolProps> = (props) => {
  return (
    <Box>
      <FormGroup sx={{ marginX: 2 }}></FormGroup>
    </Box>
  );
};
