import "./App.css";
import { useEffect, useRef, useState } from "react";
import React from "react";
import {
  Grid,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import NestedMenuItem from "./NestedMenuItem";
import { Tree } from "antd";
import "antd/lib/tree/style/css";
import { v4 as uuid } from "uuid";
import StyleField from "./components/StyleFiels";

const useForceUpdate = () => {
  const [value, setValue] = useState();
  return () => setValue(!value);
};

function App() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    console.log(event);
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };


  const getEditorDocument = () => document.querySelector("#main").contentDocument;
  const getEditorWindow = () => document.querySelector("#main").contentWindow;

  const forceUpdate = useForceUpdate();
  const addStyleToSelected = ({ name, value }) => {
    if (!selected && !getComputedStyle(selected)[name]) return;
    selected.style[name] = value;
    const scriptID = selected.getAttribute("script-id");
    if (scriptID) {
      const script = getEditorDocument().getElementById(scriptID);
      script.style[name] = value;
    }
    forceUpdate();
    return !!getComputedStyle(selected)[name];
  };

  useEffect(() => {
    getEditorDocument().body.oncontextmenu = handleContextMenu;
    let el = null;
    getEditorWindow().onmousedown = (e) => {
      const { target, offsetX, offsetY } = e;
      const maintarget = e.path.find(
        (c) => c.hasAttribute && c.hasAttribute("editable")
      );
      if (maintarget) {
        el = {
          target: maintarget,
          offsetX,
          offsetY,
        };
        if (selected) {
          selected.classList.remove("selected");
        }
        maintarget.classList.add("selected");
        setSelected(maintarget);
      } else if (selected && target === getEditorDocument().body) {
        selected.classList.remove("selected");
        setSelected(null);
      }
    };
    getEditorWindow().onmouseup = () => {
      const scriptID = selected && selected.getAttribute("script-id");
      if (scriptID) {
        const script = getEditorDocument().getElementById(scriptID);
        script.style.left = selected.offsetLeft + "px";
        script.style.top = selected.offsetTop + "px";
      }
      el = null;
      forceUpdate();
    };
    getEditorWindow().onmousemove = (e) => {
      const { target, offsetX, offsetY } = el || {};
      const maintarget = e.path.find(
        (c) => c.hasAttribute && c.hasAttribute("editable")
      );
      if (maintarget) {
        if (hovered) {
          hovered.classList.remove("hovered");
        }
        maintarget.classList.add("hovered");
        setHovered(maintarget);
      } else if (hovered && target === getEditorDocument().body) {
        hovered.classList.remove("hovered");
        setHovered(null);
      }

      if (target) {
        e.preventDefault();
        const { pageX, pageY, movementX, movementY } = e;
        if (target.style.position === "relative") {
          const cx = +target.style.left.replace('px', '')
          const cy = +target.style.top.replace('px', '')
          target.style.left = cx + movementX + 'px'
          target.style.top = cy + movementY + 'px'
        } else if (target.parentElement.style.position === "absolute") {
          target.style.left =
            pageX -
            offsetX -
            target.parentElement.getBoundingClientRect().x -
            getEditorWindow().scrollX +
            "px";
          target.style.top =
            pageY -
            offsetY -
            target.parentElement.getBoundingClientRect().y -
            getEditorWindow().scrollY +
            "px";
        } else {
          target.style.left = pageX - offsetX + "px";
          target.style.top = pageY - offsetY + "px";
        }
      }
    };

    /** IFRAME LOADED HANDLER */
    document.querySelector("#main").onload = () => {
      getEditorDocument()
        .body.querySelectorAll("*")
        .forEach(function (node) {
          node.setAttribute("editable", "true");
          node.setAttribute("exportable", "true");
        });

      const vendors = getEditorDocument().createElement('script')
      vendors.setAttribute('src', '/plugins/vendors.js')
      vendors.setAttribute('exportable', 'true')
      vendors.setAttribute('defer', 'true')
      getEditorDocument().head.appendChild(vendors)
      getEditorWindow().SCRIPTS = {}
    };
  }, [forceUpdate, selected, hovered]);

  const newPlugin = async (plugin, initId) => {
    const { script: scriptSrc, template: templateSrc } = plugin
    let template = null;
    if (templateSrc) {
      const html = await fetch(templateSrc).then(res => res.text())
      const { mouseX, mouseY } = contextMenu;
      const x = mouseX - getEditorDocument().body.offsetLeft;
      const y = mouseY + getEditorWindow().scrollY;
      const parser = new DOMParser()
      const root = parser.parseFromString(html, 'text/html')
        .getRootNode().body.firstElementChild
      root.setAttribute('editable', 'true');
      root.style.position = 'absolute'
      root.style.left = x + 'px'
      root.style.top = y + 'px'
      getEditorDocument().body.appendChild(root);
      template = root;
    }
    if (scriptSrc) {
      const id = initId || uuid()
      const el = document.createElement("script");
      el.setAttribute("src", scriptSrc);
      el.setAttribute("defer", "true");
      el.setAttribute("id", id);
      el.setAttribute("exportable", "true");
      getEditorWindow().SCRIPTS[id] = {
        template,
        reset() {
          el.remove();
          if (template) {
            template.remove()
          }
          newPlugin(plugin, id)
        }
      }
      getEditorDocument().head.appendChild(el);
    }
    setContextMenu(null);
  };

  const main = useRef();

  const styles =
  selected &&
  selected
    .getAttribute("style") &&
  selected
    .getAttribute("style")
    .split(";")
    .filter((style) => style)
    .map((style) => {
      const [name, value] = style.split(":");
      return { name: name.trim(), value: value.trim() };
    });

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid item xs={3}>
        <Box
          height="50vh"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <StyleField
            onAddStyle={addStyleToSelected}
            styles={styles || []}
          ></StyleField>
        </Box>
      </Grid>
      <Grid item xs={9}>
        <iframe
          src="/site/index.html"
          width="100%"
          height="100%"
          ref={main}
          title="main"
          id="main"
        ></iframe>
      </Grid>
      <Menu
        open={!!contextMenu}
        onClose={() => setContextMenu(null)}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu(null);
        }}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? {
                top: contextMenu.mouseY,
                left:
                  contextMenu.mouseX +
                  document.querySelector("#main").offsetLeft,
              }
            : undefined
        }
      >
        <NestedMenuItem label="Insert" parentMenuOpen={!!contextMenu}>
          {Object.entries(window.plugins).map(([pluginName, plugin]) => (
            <MenuItem key={pluginName} onClick={() => newPlugin(plugin)}>
              {pluginName}
            </MenuItem>
          ))}
        </NestedMenuItem>
      </Menu>
    </Grid>
  );
}

export default App;