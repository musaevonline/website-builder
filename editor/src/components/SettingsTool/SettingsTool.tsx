import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import React, { ChangeEventHandler } from 'react';

import { useForceRender } from '../hooks';

interface ISettingsToolProps {
  selected: HTMLElement;
}

export const SettingsTool: React.FC<ISettingsToolProps> = (props) => {
  const { selected } = props;
  const forceRender = useForceRender();

  const setExportable: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.checked) {
      selected.setAttribute('exportable', 'true');
    } else {
      selected.removeAttribute('exportable');
    }
    forceRender();
  };

  const setContentEditable: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.checked) {
      selected.setAttribute('contenteditable', 'true');
    } else {
      selected.removeAttribute('contenteditable');
    }
    forceRender();
  };

  const exportable = selected.hasAttribute('exportable') || false;
  const contentEditable = selected.hasAttribute('contenteditable') || false;

  return (
    <Box>
      <FormGroup sx={{ marginX: 2 }}>
        <FormControlLabel
          control={<Checkbox sx={{ padding: 0 }} onChange={setExportable} />}
          label="Exportable"
          checked={exportable}
        />
        <FormControlLabel
          control={
            <Checkbox sx={{ padding: 0 }} onChange={setContentEditable} />
          }
          label="Content Editable"
          checked={contentEditable}
        />
      </FormGroup>
    </Box>
  );
};
