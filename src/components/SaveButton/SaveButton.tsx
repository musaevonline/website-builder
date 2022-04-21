import { Save as SaveIcon } from '@mui/icons-material';
import { Fab, FabProps } from '@mui/material';
import 'highlight.js/styles/github.css';
import { html_beautify as htmlBeautify } from 'js-beautify';
import React, { MouseEventHandler } from 'react';

interface ISaveButtonProps extends FabProps {
  getDocument: any;
}

export const SaveButton: React.FC<ISaveButtonProps> = (props) => {
  const { getDocument, ...rest } = props;
  const onSave: MouseEventHandler = () => {
    const parser = getDocument().createElement('html');

    parser.innerHTML = getDocument().documentElement.outerHTML;
    parser
      .querySelectorAll(':not([exportable])')
      .forEach((el: any) => el.remove());
    parser
      .querySelectorAll('[exportable]')
      .forEach((el: any) => el.removeAttribute('exportable'));
    parser
      .querySelectorAll('[editable]')
      .forEach((el: any) => el.removeAttribute('editable'));
    parser
      .querySelectorAll('[contenteditable]')
      .forEach((el: any) => el.removeAttribute('contenteditable'));
    parser
      .querySelectorAll('.selected')
      .forEach((el: any) => el.classList.remove('selected'));
    parser
      .querySelectorAll('.hovered')
      .forEach((el: any) => el.classList.remove('hovered'));

    const exportedCode = `<!DOCTYPE html>${parser.innerHTML}`;

    const html = htmlBeautify(exportedCode, {
      wrap_line_length: 120,
    });

    fetch('http://localhost:3000/editor/save', {
      method: 'POST',
      body: JSON.stringify({ html }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return (
    <Fab color="primary" onClick={onSave} {...rest}>
      <SaveIcon />
    </Fab>
  );
};
