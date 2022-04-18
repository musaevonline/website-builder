import { Grid, Box, Menu, MenuItem, Typography, Divider } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import NestedMenuItem from '../NestedMenuItem';
import { DomTree } from '../components/DomTree';
import { PropsFields } from '../components/PropsFields';
import { SettingsTool } from '../components/SettingsTool';
import { StyleFields } from '../components/StyleFields';
import { useForceRender } from '../components/hooks';
import '../App.css';

const NestedMenuItem2: any = NestedMenuItem;

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    TEMPLATES: any;
    STORE: any;
  }
}

export const Editor = () => {
  const { page } = useParams();
  const selected = useRef<HTMLElement | null>(null);
  const hovered = useRef<HTMLElement | null>(null);
  const draggable = useRef<HTMLElement | null>(null);
  const [contextMenu, setContextMenu] = useState<any>({ current: null });
  const [plugins, setPlugins] = useState<any[]>([]);

  const iframe = useRef<any>();
  const getDocument = () => iframe?.current?.contentDocument;
  const getWindow = () => iframe?.current?.contentWindow;

  const handleContextMenu = (event: any) => {
    event.preventDefault();
    setContextMenu({
      current: {
        mouseX: event.clientX + iframe.current?.offsetLeft,
        mouseY: event.clientY + iframe.current?.offsetTop,
      },
    });
  };

  const forceRender = useForceRender();
  const addStyleToSelected = ({ name, value }: any) => {
    if (
      !selected.current ||
      (selected.current && !getComputedStyle(selected.current)[name])
    ) {
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
    forceRender();

    return !!getComputedStyle(selected.current)[name];
  };

  useEffect(() => {
    if (!iframe) {
      return;
    }

    getWindow().onmousedown = (e: any) => {
      const firstDraggableElement = e.path.find(
        (el: any) =>
          el.hasAttribute &&
          el.hasAttribute('editable') &&
          el.style &&
          (el.style.position === 'absolute' || el.style.position === 'relative')
      );

      if (firstDraggableElement) {
        draggable.current = firstDraggableElement;
      }

      const firstEditableElement = e.path.find(
        (c: any) => c.hasAttribute && c.hasAttribute('editable')
      );

      if (firstEditableElement) {
        if (selected.current) {
          selected.current.classList.remove('selected');
        }
        selected.current = firstEditableElement;
        selected.current?.classList.add('selected');
      } else if (selected.current) {
        selected.current.classList.remove('selected');
        selected.current = null;
      }
    };
    getWindow().onmouseup = () => {
      if (draggable.current) {
        draggable.current.classList.remove('hovered');
      }
      draggable.current = null;
      forceRender();
    };
    getWindow().onmouseout = function (e: any) {
      const from = e.relatedTarget || e.toElement;

      if (!from || from.nodeName === 'HTML') {
        if (hovered.current) {
          hovered.current.classList.remove('hovered');
          hovered.current = null;
        }
      }
    };
    getWindow().onmousemove = (e: any) => {
      if (draggable.current) {
        e.preventDefault();
        const { movementX, movementY } = e;

        const cx = +draggable.current.style.left.replace('px', '');
        const cy = +draggable.current.style.top.replace('px', '');

        draggable.current.style.left = cx + movementX / 2 + 'px';
        draggable.current.style.top = cy + movementY / 2 + 'px';
      }

      const firstEditableElement = e.path.find(
        (c: any) => c.hasAttribute && c.hasAttribute('editable')
      );

      if (firstEditableElement) {
        if (hovered.current) {
          hovered.current.classList.remove('hovered');
        }
        hovered.current = firstEditableElement;
        hovered.current?.classList.add('hovered');
      } else if (hovered.current) {
        hovered.current.classList.remove('hovered');
        hovered.current = null;
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
      getDocument()
        .body.querySelectorAll('*')
        .forEach((el: HTMLElement) => {
          const elStyles = getWindow().getComputedStyle(el);

          if (elStyles.position === 'static') {
            el.style.position = 'relative';
          }
        });

      const styleElement = getDocument().createElement('style');

      styleElement.type = 'text/css';
      styleElement.innerHTML = `
        .hovered {
          outline: #82ffff solid 2px !important;
        }
        .selected {
          outline: #82c7ff solid 2px !important;
        }
      `;
      getDocument().head.appendChild(styleElement);
      forceRender();
    };

    fetch('/editor/plugins.json')
      .then((res) => res.json())
      .then((plugins) => setPlugins(plugins));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const { mouseX, mouseY, parentNode } = contextMenu.current;
      const parser = new DOMParser();

      const rootNode = parser
        .parseFromString(html, 'text/html')
        .getRootNode() as Document;
      const root = rootNode.body.firstElementChild as HTMLElement;

      root.setAttribute('editable', 'true');

      if (parentNode) {
        root.style.position = 'relative';
        parentNode.appendChild(root);
      } else {
        const x = mouseX - iframe.current?.offsetLeft;
        const y = mouseY - iframe.current?.offsetTop + getWindow().scrollY;

        root.style.position = 'absolute';
        root.style.left = x + 'px';
        root.style.top = y + 'px';
        getDocument().body.appendChild(root);
      }

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
      .trim()
      .split(';')
      .filter((style: any) => style)
      .map((style: any) => {
        const [name, value] = style.split(':');

        return { name: name.trim(), value: value.trim() };
      });

  const pluginProps =
    selectedScriptID && iframe.current.contentWindow?.STORE?.[selectedScriptID];
  const onSave = (prop: any, value: any) => {
    pluginProps[prop] = value;
    forceRender();

    return true;
  };
  const toggleJSMode = (key: any) => {
    const value = pluginProps[key];

    if (key[0] === '$') {
      pluginProps[key.slice(1)] = value;
    } else {
      pluginProps['$' + key] = value;
    }
    delete pluginProps[key];
    forceRender();
  };

  const handleChangeSelected = (newSelected: HTMLElement) => {
    if (selected.current) {
      selected.current.classList.remove('selected');
    }

    selected.current = newSelected;
    selected.current?.classList.add('selected');
    selected.current.scrollIntoView({ behavior: 'smooth' });
    forceRender();
  };

  const handleChangeHovered = (newHovered: HTMLElement) => {
    if (hovered.current) {
      hovered.current.classList.remove('hovered');
    }

    hovered.current = newHovered;
    hovered.current?.classList.add('hovered');
  };
  const rootNode = getDocument()?.body;

  const handleRightClick = ({ x, y, parentNode }: any) => {
    setContextMenu({
      current: {
        mouseX: x,
        mouseY: y,
        parentNode,
      },
    });
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid item xs={3} sx={{ padding: 1, paddingLeft: 0 }}>
        <Box
          height="100vh"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            overflowY: 'auto',
          }}
        >
          {rootNode && (
            <DomTree
              rootNode={rootNode}
              selected={selected.current}
              onChangeSelected={handleChangeSelected}
              onChangeHovered={handleChangeHovered}
              onRightClick={handleRightClick}
            />
          )}
          {selected.current && <SettingsTool selected={selected.current} />}
          <StyleFields styles={styles || []} onAddStyle={addStyleToSelected} />
          {selectedScriptID && (
            <>
              <Typography>ID: {selectedScriptID}</Typography>
              <Divider />
            </>
          )}
          <Box sx={{ maxHeight: 500, overflowY: 'auto', flexShrink: 0 }}>
            <PropsFields
              props={pluginProps || []}
              onSave={onSave}
              toggleJSMode={toggleJSMode}
            />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={9} sx={{ overflow: 'auto' }}>
        <iframe
          src={`/${page}`}
          width="100%"
          height="100%"
          ref={iframe}
          title="main"
          id="main"
          style={{ minWidth: 1000 }}
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
                left: contextMenu.current.mouseX,
              }
            : undefined
        }
      >
        <NestedMenuItem2 label="Insert" parentMenuOpen={!!contextMenu.current}>
          {Object.entries(plugins).map(([pluginName, plugin]) => (
            <MenuItem key={pluginName} onClick={() => newPlugin(plugin)}>
              {pluginName}
            </MenuItem>
          ))}
        </NestedMenuItem2>
      </Menu>
    </Grid>
  );
};
