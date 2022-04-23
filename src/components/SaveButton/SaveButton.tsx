import { Save as SaveIcon } from '@mui/icons-material';
import { Fab, FabProps } from '@mui/material';
import 'highlight.js/styles/github.css';
import { html_beautify as htmlBeautify } from 'js-beautify';
import React, { MouseEventHandler } from 'react';

interface ISaveButtonProps extends FabProps {
  virtualDOM: Document;
}

export const SaveButton: React.FC<ISaveButtonProps> = (props) => {
  const { virtualDOM, ...rest } = props;
  const onSave: MouseEventHandler = () => {
    const virtualDOMClone = virtualDOM.cloneNode(true) as Document;

    virtualDOMClone.querySelectorAll('[uuid]').forEach((el: any) => {
      el.removeAttribute('uuid');
    });

    const exportedCode = `<!DOCTYPE html>${virtualDOMClone.documentElement.outerHTML}`;

    const html = htmlBeautify(exportedCode, {
      wrap_line_length: 120,
      max_preserve_newlines: 0,
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
