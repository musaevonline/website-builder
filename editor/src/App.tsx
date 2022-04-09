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

const insertAfter = (referenceNode: any, newNode: any) => {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

function App() {
  const selected = useRef<HTMLElement | null>(null);
  const hovered = useRef<any>(null);
  const [contextMenu, setContextMenu] = useState<any>({ current: null });
  const iframe = useRef<any>();
  const getDocument = () => iframe.current.contentDocument;
  const getWindow = () => iframe.current.contentWindow;

  const getOffsetBetween = (el1: HTMLElement | 0, el2: HTMLElement | 0) => {
    type TRect = Pick<DOMRect, 'x' | 'y'>;
    const rect1: TRect = { x: 0, y: 0 };
    const rect2: TRect = { x: 0, y: 0 };

    if (el1 !== 0) {
      const clientRect = el1.getBoundingClientRect();

      rect1.x = clientRect.x + getWindow().scrollX;
      rect1.y = clientRect.y + getWindow().scrollY;
    }

    if (el2 !== 0) {
      const clientRect = el2.getBoundingClientRect();

      rect2.x = clientRect.x + getWindow().scrollX;
      rect2.y = clientRect.y + getWindow().scrollY;
    }

    return {
      offsetX: rect1.x - rect2.x,
      offsetY: rect1.y - rect2.y,
    };
  };

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
    forceUpdate();

    return !!getComputedStyle(selected.current)[name];
  };

  const onMakeDraggable = () => {
    if (!selected.current) {
      return;
    }
    let selectedElementStyles = getComputedStyle(selected.current);
    const selectedElementPosition = getOffsetBetween(selected.current, 0);
    const newElement = getDocument().createElement('div');

    newElement.style.width = selectedElementStyles.width;
    newElement.style.height = selectedElementStyles.height;
    newElement.style.margin = selectedElementStyles.margin;
    newElement.style.flexShrink = '0';

    selected.current.style.width = selectedElementStyles.width;
    selected.current.style.height = selectedElementStyles.height;

    insertAfter(selected.current, newElement);
    selected.current.style.position = 'absolute';
    selectedElementStyles = getComputedStyle(selected.current);
    const marginX = +selectedElementStyles.marginLeft.replace('px', '') || 0;
    const marginY = +selectedElementStyles.marginTop.replace('px', '') || 0;

    selected.current.style.left =
      selectedElementPosition.offsetX - marginX + 'px';
    selected.current.style.top =
      selectedElementPosition.offsetY - marginY + 'px';

    forceUpdate();
  };

  useEffect(() => {
    if (!iframe) {
      return;
    }

    let draggingElementInfo: any = null;

    getWindow().onmousedown = (e: any) => {
      const fistEditableElement = e.path.find(
        (c: any) => c.hasAttribute && c.hasAttribute('editable')
      );
      const fistEditableElementWithAbsolute = e.path.find(
        (c: any) =>
          c.hasAttribute &&
          c.hasAttribute('editable') &&
          c.style &&
          c.style.position === 'absolute'
      );

      if (fistEditableElementWithAbsolute) {
        const nextAbsoluteElement = e.path.find(
          (c: HTMLElement) =>
            c !== fistEditableElementWithAbsolute &&
            c.style &&
            c.style.position === 'absolute'
        );
        const fistEditableElementWithAbsoluteOffset = getOffsetBetween(
          e.target,
          fistEditableElementWithAbsolute
        );
        const nextAbsoluteElementPosition =
          nextAbsoluteElement && getOffsetBetween(nextAbsoluteElement, 0);
        const targetOffset = {
          offsetX: e.offsetX,
          offsetY: e.offsetY,
        };

        draggingElementInfo = {
          fistEditableElementWithAbsolute,
          fistEditableElementWithAbsoluteOffset,
          nextAbsoluteElementPosition,
          targetOffset,
        };
      }

      if (fistEditableElement) {
        if (selected.current) {
          selected.current.classList.remove('selected');
        }
        fistEditableElement.classList.add('selected');
        selected.current = fistEditableElement;
      } else if (selected.current) {
        selected.current.classList.remove('selected');
        selected.current = null;
      }
    };
    getWindow().onmouseup = () => {
      const scriptID =
        selected.current && selected.current.getAttribute('script-id');

      if (scriptID) {
        const script = getDocument().getElementById(scriptID);

        if (script && selected.current) {
          script.style.left = selected.current.offsetLeft + 'px';
          script.style.top = selected.current.offsetTop + 'px';
        }
      }

      if (draggingElementInfo?.fistEditableElementWithAbsolute) {
        draggingElementInfo.fistEditableElementWithAbsolute.classList.remove(
          'hovered'
        );
      }
      draggingElementInfo = null;
      forceUpdate();
    };
    getWindow().onmouseout = function (e: any) {
      const from = e.relatedTarget || e.toElement;

      if (!from || from.nodeName === 'HTML') {
        if (hovered.current) {
          hovered.current.classList.remove('hovered');
          hovered.current = null;
        }

        if (draggingElementInfo?.fistEditableElementWithAbsolute) {
          draggingElementInfo.fistEditableElementWithAbsolute.classList.remove(
            'hovered'
          );
        }
      }
    };
    getWindow().onmousemove = (e: any) => {
      const {
        fistEditableElementWithAbsolute: draggableElement,
        fistEditableElementWithAbsoluteOffset: draggableElementOffset = {},
        nextAbsoluteElementPosition,
        targetOffset,
      } = draggingElementInfo || {};
      const maintarget = e.path.find(
        (c: any) => c.hasAttribute && c.hasAttribute('editable')
      );

      if (maintarget) {
        if (hovered.current) {
          hovered.current.classList.remove('hovered');
        }
        maintarget.classList.add('hovered');
        hovered.current = maintarget;
      } else if (hovered.current) {
        hovered.current.classList.remove('hovered');
        hovered.current = null;
      }

      if (draggableElement) {
        e.preventDefault();
        const { pageX, pageY, movementX, movementY } = e;

        if (draggableElement.style.position === 'relative') {
          const cx = +draggableElement.style.left.replace('px', '');
          const cy = +draggableElement.style.top.replace('px', '');

          draggableElement.style.left = cx + movementX + 'px';
          draggableElement.style.top = cy + movementY + 'px';
        } else if (draggableElement) {
          const {
            offsetX: firstEditableOffsetX = 0,
            offsetY: firstEditableOffsetY = 0,
          } = draggableElementOffset;
          const { offsetX: targetOffsetX, offsetY: targetOffsetY } =
            targetOffset;
          const marginX =
            +getComputedStyle(draggableElement).marginLeft.replace('px', '') ||
            0;
          const marginY =
            +getComputedStyle(draggableElement).marginTop.replace('px', '') ||
            0;

          draggableElement.classList.add('hovered');

          if (nextAbsoluteElementPosition) {
            const {
              offsetX: firstAbsoluteOffsetX,
              offsetY: firstAbsoluteOffsetY,
            } = nextAbsoluteElementPosition;

            draggableElement.style.left =
              pageX - firstAbsoluteOffsetX - targetOffsetX - marginX + 'px';
            draggableElement.style.top =
              pageY - firstAbsoluteOffsetY - targetOffsetY - marginY + 'px';
          } else {
            draggableElement.style.left =
              pageX - firstEditableOffsetX - targetOffsetX - marginX + 'px';
            draggableElement.style.top =
              pageY - firstEditableOffsetY - targetOffsetY - marginY + 'px';
          }
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
      .trim()
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
          <StyleFields
            styles={styles || []}
            onAddStyle={addStyleToSelected}
            onMakeDraggable={onMakeDraggable}
          />
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
