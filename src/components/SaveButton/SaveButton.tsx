import { Save as SaveIcon } from '@mui/icons-material';
import { Fab, FabProps } from '@mui/material';
import 'highlight.js/styles/github.css';
import { html_beautify as htmlBeautify } from 'js-beautify';
import React, { MouseEventHandler } from 'react';
import serializer from 'serialize-javascript';

import { IWindow } from '../../pages/Editor';
interface ISaveButtonProps extends FabProps {
  virtualDOM: Document;
  getWindow: () => IWindow;
  page: string;
}

export const SaveButton: React.FC<ISaveButtonProps> = (props) => {
  const { virtualDOM, getWindow, page, ...rest } = props;
  const onSave: MouseEventHandler = () => {
    const virtualDOMClone = virtualDOM.cloneNode(true) as Document;

    virtualDOMClone.querySelectorAll('[uuid]').forEach((el) => {
      el.removeAttribute('uuid');
    });
    virtualDOMClone.querySelectorAll('script[name="state"]').forEach((el) => {
      el.remove();
    });

    const scriptElement = virtualDOMClone.createElement('script');
    const currentState = serializer(getWindow().STORE);

    scriptElement.setAttribute('name', 'state');
    scriptElement.innerText = `window.STORE = ${currentState}`;
    virtualDOMClone.head.appendChild(scriptElement);

    const exportedCode = `<!DOCTYPE html>${virtualDOMClone.documentElement.outerHTML}`;
    const html = htmlBeautify(exportedCode, {
      wrap_line_length: 120,
      max_preserve_newlines: 0,
    });

    fetch('/editor/save', {
      method: 'POST',
      body: JSON.stringify({ html, page }),
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
