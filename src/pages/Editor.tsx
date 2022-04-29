import { Grid, Box, Menu, MenuItem, Typography, Divider } from '@mui/material';
import getXPath from 'get-xpath';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import NestedMenuItem from '../NestedMenuItem';
import { DomTree } from '../components/DomTree';
import { PropsFields } from '../components/PropsFields';
import { SaveButton } from '../components/SaveButton';
import { SettingsTool } from '../components/SettingsTool';
import { StyleFields } from '../components/StyleFields';
import { useForceRender } from '../components/hooks';
import '../App.css';

const NestedMenuItem2: any = NestedMenuItem;

export interface IWindow extends Window {
  STORE: any;
}
export const EMPTY_ELEMENT = document.createElement('div');

export const Editor = () => {
  const { page } = useParams();
  const selected = useRef<HTMLElement | null>(null);
  const hovered = useRef<HTMLElement | null>(null);
  const draggable = useRef<HTMLElement | null>(null);
  const counter = useRef(0);
  const virtualDOM = useRef<Document | null>(null);
  const [contextMenu, setContextMenu] = useState<any>({ current: null });
  const [plugins, setPlugins] = useState<any[]>([]);

  const iframe = useRef<any>();
  const getDocument = () => iframe?.current?.contentDocument;
  const getWindow = (): IWindow => iframe?.current?.contentWindow;
  const getMirror = (element: HTMLElement) => {
    if (!virtualDOM.current) {
      return EMPTY_ELEMENT;
    }

    const mirror = virtualDOM.current.querySelector(
      `[uuid="${element.getAttribute('uuid')}"]`
    ) as HTMLElement;

    return mirror || EMPTY_ELEMENT;
  };
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
    getMirror(selected.current).style[name] = value;

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
        getMirror(draggable.current).style.left = cx + movementX / 2 + 'px';
        getMirror(draggable.current).style.top = cy + movementY / 2 + 'px';
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

    const pageDocumentPromise = fetch('/test.html')
      .then((res) => res.text())
      .then((page) => {
        const parser = new DOMParser();

        return parser.parseFromString(page, 'text/html');
      });

    /** IFRAME LOADED HANDLER */
    getWindow().addEventListener('DOMContentLoaded', async (event) => {
      const target = event.target as Document;

      getWindow().STORE = {};
      target.body.oncontextmenu = handleContextMenu;

      virtualDOM.current = await pageDocumentPromise;

      virtualDOM.current.querySelectorAll('*').forEach((node) => {
        const xPath = getXPath(node);
        const targetNode = target.evaluate(
          xPath,
          target,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue as HTMLElement;

        const uuid = String(counter.current++);

        node.setAttribute('uuid', uuid);
        targetNode?.setAttribute('uuid', uuid);
      });
      virtualDOM.current.body.querySelectorAll('*').forEach((node) => {
        const targetNode = target.querySelector(
          `[uuid="${node.getAttribute('uuid')}"]`
        ) as HTMLElement;

        if (!targetNode) {
          return;
        }
        targetNode.setAttribute('editable', 'true');

        if (targetNode.firstChild?.nodeName === '#text') {
          targetNode.setAttribute('contenteditable', 'true');
        }

        const elStyles = getWindow().getComputedStyle(targetNode);

        if (elStyles.position === 'static') {
          targetNode.style.position = 'relative';

          if (getMirror(targetNode)) {
            getMirror(targetNode).style.position = 'relative';
          }
        }
      });

      const vendorsScript = target.head.querySelector(
        'script[src="/plugins/vendors.js"]'
      );

      if (!vendorsScript) {
        const vendors = target.createElement('script');

        vendors.setAttribute('src', '/plugins/vendors.js');
        vendors.setAttribute('defer', 'true');
        target.head.appendChild(vendors);
        getMirror(target.head)?.appendChild(vendors.cloneNode(true));
      }

      const styleElement = target.createElement('style');

      styleElement.type = 'text/css';
      styleElement.innerHTML = `
        .hovered {
          outline: #82ffff solid 2px !important;
        }
        .selected {
          outline: #82c7ff solid 2px !important;
        }
      `;
      target.head.appendChild(styleElement);
      forceRender();
    });

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

      root.setAttribute('uuid', counter.current++ + '');
      root.setAttribute('editable', 'true');
      root.setAttribute('contenteditable', 'true');

      root.querySelectorAll<HTMLElement>('*').forEach((node) => {
        node.setAttribute('uuid', counter.current++ + '');
        node.setAttribute('editable', 'true');
        node.setAttribute('contenteditable', 'true');
      });

      if (parentNode) {
        root.style.position = 'relative';
        parentNode.appendChild(root);
        getMirror(parentNode)?.appendChild(root.cloneNode(true));
      } else {
        const x = mouseX - iframe.current?.offsetLeft;
        const y = mouseY - iframe.current?.offsetTop + getWindow().scrollY;

        root.style.position = 'absolute';
        root.style.left = x + 'px';
        root.style.top = y + 'px';
        getDocument().body.appendChild(root);
        getMirror(getDocument().body)?.appendChild(root.cloneNode(true));
      }

      template = root;
    }

    if (scriptSrc) {
      const el = document.createElement('script');

      el.setAttribute('src', scriptSrc);
      el.setAttribute('defer', 'true');
      el.setAttribute('id', id);
      el.setAttribute('uuid', counter.current++ + '');

      if (template) {
        template.setAttribute('script-id', id);
        getMirror(template)?.setAttribute('script-id', id);
      }
      getDocument().head.appendChild(el);
      getMirror(getDocument().head)?.appendChild(el.cloneNode(true));
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
      {virtualDOM.current && (
        <SaveButton
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          virtualDOM={virtualDOM.current}
          getWindow={getWindow}
        />
      )}
    </Grid>
  );
};
