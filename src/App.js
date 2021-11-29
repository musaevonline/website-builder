import "./App.css";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { Grid, Box, TextField, Button, Fab, Modal, Menu, MenuItem, Autocomplete } from "@mui/material";
import NestedMenuItem from "./NestedMenuItem"
import { Tree } from "antd";
import styled from "styled-components";
import "antd/lib/tree/style/css";
import { Formik, Form, Field } from 'formik';
import { Save as SaveIcon } from '@mui/icons-material';
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/github.css';
import { html_beautify as htmlBeautify } from 'js-beautify'
import { cssStyles } from './styles'

hljs.registerLanguage('xml', xml);

const ExportButton = styled(Fab)({
  position: 'fixed',
  right: 10,
  bottom: 10,
})

const ModalBox = styled.pre({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  height: '80vh',
  overflowY: 'auto',
  background: 'white',
  boxShadow: 24,
  padding: 40,
})

function StyleField({ onAddStyle, styles }) {
  const onSubmit = (values, { resetForm }) => {
    console.log(values)
    if (onAddStyle(values)) {
      resetForm()
    }
  }
  return (
    <Formik initialValues={{ name: '', value: '' }} onSubmit={onSubmit}>
      {({ setFieldValue }) => (
        <Form>
          {styles.map(({ name, value }) => (
            <Grid container key={name}>
              <Grid item xs={6}>
                {name}
              </Grid>
              <Grid item xs={6}>
                {value}
              </Grid>
            </Grid>
          ))}
          <Grid container>
            <Grid item xs={6}>
              <Field name="name" as={Autocomplete} options={cssStyles} disableClearable freeSolo
                renderInput={(params) => <TextField {...params} label="Style" variant="standard"/>}
                onChange={(e, value) => setFieldValue("name", value)}
                 />
            </Grid>
            <Grid item xs={6}>
              <Field name="value" as={TextField} variant="standard" label="Value" />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" width="100%">Add</Button>
        </Form>
      )}
    </Formik>
  )
}

const useForceUpdate = () => {
  const [value, setValue] = useState()
  return () => setValue(!value)
}

function App() {
  const [selected, setSelected] = useState(null)
  const [exportedCode, setExportedCode] = useState(null)
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const forceUpdate = useForceUpdate()
  const addStyleToSelected = ({ name, value }) => {
    if (!selected && !getComputedStyle(selected)[name]) return;
    selected.style[name] = value;
    forceUpdate()
    return !!getComputedStyle(selected)[name];
  }

  const exportCode = () => {
    setExportedCode(hljs.highlight(
      htmlBeautify(document.querySelector('#main').innerHTML, {
        wrap_line_length: 120
      }),
      { language: 'xml' }).value
    )
  }
  useEffect(() => {
    document.querySelector('#main').oncontextmenu = handleContextMenu;
    let el = null
    window.onmousedown = (e) => {
      const { target, offsetX, offsetY } = e;
      console.log(target)
      el = {
        target,
        offsetX,
        offsetY,
      }

      if (target.hasAttribute('editable')) {
        if (selected) {
          selected.style.outline = 'none';
          selected.style.border = '1px solid black';
        }
        setSelected(target)
        target.style.outline = '#82c7ff solid 1px'
        target.style.border = '1px solid #3aa7ff'
      } else if (selected && target === document.querySelector('#main')) {
        if (selected.nodeName === 'SPAN') {
          selected.style.outline = 'none';
          selected.style.border = 'none';
        } else if (selected.nodeName === 'DIV') {
          selected.style.outline = 'none';
          selected.style.border = '1px solid black';
        }
        setSelected(null)
      }
    };
    window.onmouseup = () => {
      el = null
      forceUpdate()
    };
    window.onmousemove = (e) => {
      const { target, offsetX, offsetY } = el || {};
      if (target && target.hasAttribute('editable')) {
        e.preventDefault();
        const { pageX, pageY } = e;
        target.style.left = pageX - document.querySelector('#main').offsetLeft - offsetX + 'px'
        target.style.top = pageY - offsetY + 'px'
      }
    }
  }, [forceUpdate, selected])
  const styles = selected && selected.getAttribute('style')
    .split(';').filter(style => style).map(style => {
      const [name, value] = style.split(':')
      return { name: name.trim(), value: value.trim() }
    })
  const newDiv = () => {
    const { mouseX, mouseY } = contextMenu
    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.width = "300px";
    el.style.height = "300px";
    el.style.border = "1px solid black";
    el.style.left = `${mouseX - main.current.offsetLeft}px`;
    el.style.top = `${mouseY}px`;
    el.setAttribute('editable', 'true');
    main.current.appendChild(el);
    setContextMenu(null)
  }

  const newSpan = () => {
    const { mouseX, mouseY } = contextMenu
    const el = document.createElement("span");
    el.style.position = "absolute";
    el.style.left = `${mouseX - main.current.offsetLeft}px`;
    el.style.top = `${mouseY}px`;
    el.style.userSelect = 'none';
    el.innerText = 'Hello, world'
    el.setAttribute('editable', 'true');
    el.setAttribute('contenteditable', 'true');
    main.current.appendChild(el);
    setContextMenu(null)
  }

  const main = useRef();
  return (
    <Grid container>
      <Grid item xs={3}>
        <Box height="50vh" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <StyleField onAddStyle={addStyleToSelected} styles={styles || []}></StyleField>
        </Box>
      </Grid>
      <Grid item xs={9}>
        <Box style={{ position: "relative" }} height="100vh" ref={main} id="main"></Box>
      </Grid>
      <ExportButton color="primary" onClick={exportCode}>
        <SaveIcon />
      </ExportButton>
      <Modal
        open={!!exportedCode}
        onClose={() => setExportedCode(false)}
      >
        <ModalBox dangerouslySetInnerHTML={{ __html: exportedCode }} />
      </Modal>
      <Menu
        open={!!contextMenu}
        onClose={() => setContextMenu(null)}
        onContextMenu={e => { e.preventDefault(); setContextMenu(null) }}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <NestedMenuItem label="Insert" parentMenuOpen={!!contextMenu}>
          <MenuItem onClick={newDiv}>Block</MenuItem>
          <MenuItem onClick={newSpan}>Text</MenuItem>
        </NestedMenuItem>
      </Menu>
    </Grid >
  );
}

export default App;

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || "0";
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

class Demo extends React.Component {
  state = {
    gData,
    expandedKeys: ["0-0", "0-0-0", "0-0-0-0"],
  };

  onDragEnter = (info) => {
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  onDrop = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...this.state.gData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    this.setState({
      gData: data,
    });
  };

  render() {
    return (
      <Tree
        draggable
        blockNode
        onDrop={this.onDrop}
        treeData={this.state.gData}
      />
    );
  }
}
