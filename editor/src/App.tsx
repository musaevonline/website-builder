import { Grid, Box, Menu, MenuItem, Typography, Divider } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import React, { useReducer } from 'react';
import { v4 as uuid } from 'uuid';

import NestedMenuItem from './NestedMenuItem';
import { PropsFields } from './components/PropsFields';
import { StyleFields } from './components/StyleFields';
import './App.css';

const NestedMenuItem2: any = NestedMenuItem;

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    TEMPLATES: any;
    STORE: any;
    PLUGINS: any;
  }
}

const useForceUpdate = () => {
  const [, forceRender] = useReducer((s) => s + 1, 0);

  return forceRender;
};

function App() {
  const selected = useRef<any>(null);
  const hovered = useRef<any>(null);
  const [contextMenu, setContextMenu] = useState<any>({ current: null });
  const iframe = useRef<any>();
  const getDocument = () => iframe.current.contentDocument;
  const getWindow = () => iframe.current.contentWindow;

  const handleContextMenu = (event: any) => {
    event.preventDefault();
    setContextMenu({
      current: {
        mouseX: event.clientX,
        mouseY: event.clientY,
      },
    });
  };

  const forceUpdate = useForceUpdate();
  const addStyleToSelected = ({ name, value }: any) => {
    if (!selected && !getComputedStyle(selected)[name]) {
      return;
    }
    selected.current.style[name] = value;
    const scriptID = selected.current.getAttribute('script-id');

    if (scriptID) {
      const script = getDocument()?.getElementById(scriptID);

      if (script) {
        script.style[name] = value;
      }
    }
    forceUpdate();

    return !!getComputedStyle(selected.current)[name];
  };

  useEffect(() => {
    if (!iframe) {
      return;
    }

    let el: any = null;

    getWindow().onmousedown = (e: any) => {
      const { target, offsetX, offsetY } = e;
      const maintarget = e.path.find(
        (c: any) => c.hasAttribute && c.hasAttribute('editable')
      );

      if (maintarget) {
        el = {
          target: maintarget,
          offsetX,
          offsetY,
        };

        if (selected.current) {
          selected.current.classList.remove('selected');
        }
        maintarget.classList.add('selected');
        selected.current = maintarget;
      } else if (selected.current && target === getDocument().body) {
        selected.current.classList.remove('selected');
        selected.current = null;
      }
    };
    getWindow().onmouseup = () => {
      const scriptID =
        selected.current && selected.current.getAttribute('script-id');

      if (scriptID) {
        const script = getDocument().getElementById(scriptID);

        if (script) {
          script.style.left = selected.current.offsetLeft + 'px';
          script.style.top = selected.current.offsetTop + 'px';
        }
      }
      el = null;
      forceUpdate();
    };
    getWindow().onmousemove = (e: any) => {
      const { target, offsetX, offsetY } = el || {};
      const maintarget = e.path.find(
        (c: any) => c.hasAttribute && c.hasAttribute('editable')
      );

      if (maintarget) {
        if (hovered.current) {
          hovered.current.classList.remove('hovered');
        }
        maintarget.classList.add('hovered');
        hovered.current = maintarget;
      } else if (hovered.current && target === getDocument().body) {
        hovered.current.classList.remove('hovered');
        hovered.current = null;
      }

      if (target) {
        e.preventDefault();
        const { pageX, pageY, movementX, movementY } = e;

        if (target.style.position === 'relative') {
          const cx = +target.style.left.replace('px', '');
          const cy = +target.style.top.replace('px', '');

          target.style.left = cx + movementX + 'px';
          target.style.top = cy + movementY + 'px';
        } else if (target.parentElement.style.position === 'absolute') {
          target.style.left =
            pageX -
            offsetX -
            target.parentElement.getBoundingClientRect().x -
            getWindow().scrollX +
            'px';
          target.style.top =
            pageY -
            offsetY -
            target.parentElement.getBoundingClientRect().y -
            getWindow().scrollY +
            'px';
        } else {
          target.style.left = pageX - offsetX + 'px';
          target.style.top = pageY - offsetY + 'px';
        }
      }
    };

    /** IFRAME LOADED HANDLER */
    iframe.current.onload = () => {
      getDocument().body.oncontextmenu = handleContextMenu;
      getDocument()
        .body.querySelectorAll('*')
        .forEach(function (node: any) {
          node.setAttribute('editable', 'true');
          node.setAttribute('exportable', 'true');
        });

      const vendors = getDocument().createElement('script');

      vendors.setAttribute('src', '/plugins/vendors.js');
      vendors.setAttribute('exportable', 'true');
      vendors.setAttribute('defer', 'true');
      getDocument().head.appendChild(vendors);
      getWindow().TEMPLATES = {};
      getWindow().STORE = {};
    };
  }, []);

  const newPlugin = async (plugin: any) => {
    if (!iframe) {
      return;
    }
    const { script: scriptSrc, template: templateSrc } = plugin;
    let template = null;
    const id = uuid();

    if (templateSrc) {
      const html = await fetch(templateSrc).then((res) => res.text());
      const { mouseX, mouseY } = contextMenu.current;
      const x = mouseX - getDocument().body.offsetLeft;
      const y = mouseY + getWindow().scrollY;
      const parser = new DOMParser();

      const rootNode = parser
        .parseFromString(html, 'text/html')
        .getRootNode() as Document;
      const root = rootNode.body.firstElementChild as HTMLElement;

      root.setAttribute('editable', 'true');
      root.style.position = 'absolute';
      root.style.left = x + 'px';
      root.style.top = y + 'px';
      getDocument().body.appendChild(root);
      template = root;
    }

    if (scriptSrc) {
      const el = document.createElement('script');

      el.setAttribute('src', scriptSrc);
      el.setAttribute('defer', 'true');
      el.setAttribute('id', id);
      el.setAttribute('exportable', 'true');
      template?.setAttribute('script-id', id);
      getWindow().TEMPLATES[id] = template;
      getDocument().head.appendChild(el);
    }
    setContextMenu({ current: null });
  };

  const selectedStyles =
    selected.current && selected.current.getAttribute('style');
  const selectedScriptID =
    selected.current && selected.current.getAttribute('script-id');
  const styles =
    selectedStyles &&
    selectedStyles
      .split(';')
      .filter((style: any) => style)
      .map((style: any) => {
        const [name, value] = style.split(':');

        return { name: name.trim(), value: value.trim() };
      });

  const props =
    selectedScriptID && iframe.current.contentWindow?.STORE?.[selectedScriptID];
  const onSave = (prop: any, value: any) => {
    props[prop] = value;
    forceUpdate();

    return true;
  };
  const toggleJSMode = (key: any) => {
    const value = props[key];

    if (key[0] === '$') {
      props[key.slice(1)] = value;
    } else {
      props['$' + key] = value;
    }
    delete props[key];
    forceUpdate();
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid item xs={3} sx={{ padding: 1, paddingLeft: 0 }}>
        <Box
          height="100vh"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <StyleFields onAddStyle={addStyleToSelected} styles={styles || []} />
          {selectedScriptID && (
            <>
              <Typography>ID: {selectedScriptID}</Typography>
              <Divider />
            </>
          )}
          <PropsFields
            props={props || []}
            onSave={onSave}
            toggleJSMode={toggleJSMode}
          />
        </Box>
      </Grid>
      <Grid item xs={9}>
        <iframe
          src="/site/index.html"
          width="100%"
          height="100%"
          ref={iframe}
          title="main"
          id="main"
        ></iframe>
      </Grid>
      <Menu
        open={!!contextMenu.current}
        onClose={() => setContextMenu({ current: null })}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({ current: null });
        }}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu.current !== null
            ? {
                top: contextMenu.current.mouseY,
                left: contextMenu.current.mouseX + iframe.current?.offsetLeft,
              }
            : undefined
        }
      >
        <NestedMenuItem2 label="Insert" parentMenuOpen={!!contextMenu.current}>
          {Object.entries(window.PLUGINS).map(([pluginName, plugin]) => (
            <MenuItem key={pluginName} onClick={() => newPlugin(plugin)}>
              {pluginName}
            </MenuItem>
          ))}
        </NestedMenuItem2>
      </Menu>
    </Grid>
  );
}

export default App;
