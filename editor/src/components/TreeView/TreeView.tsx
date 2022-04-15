import { DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import { Key } from 'antd/lib/table/interface';
import { DataNode } from 'antd/lib/tree';
import React, { useEffect, useRef, useState } from 'react';

import 'antd/dist/antd.css';
import { useForceRender } from '../hooks';

let treeMap = new Map<HTMLElement, any>();

function getNodeTree(el: HTMLElement, key: string = '0'): any {
  if (key === '0') {
    treeMap = new Map();
  }
  const children: any = [];
  const title = el.nodeName;
  const node = {
    title,
    key,
    domNode: el,
    children,
  };

  treeMap.set(el, node);

  for (let j = 0; j < el.children.length; j++) {
    children.push(getNodeTree(el.children[j] as HTMLElement, `${key}-${j}`));
  }

  return node;
}

interface IDataNode extends DataNode {
  domNode: HTMLElement;
}

interface ITreeViewProps {
  rootNode: HTMLBodyElement;
  selected: HTMLElement | null;
  onChangeSelected: (newSelected: HTMLElement) => void;
  onChangeHovered: (newHovered: HTMLElement) => void;
  onRightClick: (props: any) => void;
}

export const TreeView: React.FC<ITreeViewProps> = (props) => {
  const forceRender = useForceRender();
  const {
    rootNode,
    selected,
    onChangeSelected,
    onChangeHovered,
    onRightClick,
  } = props;
  const treeRef = useRef<any>();
  const [expandedKeys, setExpandedKeys] = useState<any>([]);

  useEffect(() => {
    const values = Array.from(treeMap.values());

    setExpandedKeys(values.map(({ key }) => key));
  }, []);
  useEffect(() => {
    if (!selected || !treeRef.current) {
      return;
    }

    const { key } = treeMap.get(selected);
    const parents = [];

    for (let i = key.length; i >= 0; i--) {
      if (key[i] === '-') {
        parents.push(key.slice(0, i));
      }
    }
    const set = new Set([...expandedKeys, ...parents]);

    treeRef.current.scrollTo({ key });
    setExpandedKeys(Array.from(set));
  }, [selected]);

  const onDrop = (info: any) => {
    const dropObj = info.node.domNode;
    const dragObj = info.dragNode.domNode;

    dragObj.remove();

    if (info.dropToGap) {
      dropObj.parentNode.insertBefore(dragObj, dropObj.nextSibling);
    } else {
      dropObj.insertBefore(dragObj, dropObj.firstChild);
    }

    forceRender();
  };

  const handleExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
  };

  const handleChangeSelected = (selectedKeys: Key[], { node }: any) => {
    const { domNode } = node as IDataNode;

    onChangeSelected(domNode);
  };

  const handleChangeHovered = ({ node }: any) => {
    const { domNode } = node as IDataNode;

    onChangeHovered(domNode);
  };

  const handleRightClick = ({ event, node }: any) => {
    const { clientX, clientY } = event as React.MouseEvent<Element, MouseEvent>;
    const { domNode } = node as IDataNode;

    onRightClick({ x: clientX, y: clientY, parentNode: domNode });
  };

  const domTree = [getNodeTree(rootNode)] as IDataNode[];
  const selectedKeys = selected ? [treeMap.get(selected).key] : [];

  return (
    <Tree
      ref={treeRef}
      selectedKeys={selectedKeys}
      expandedKeys={expandedKeys}
      onExpand={handleExpand}
      draggable
      showLine={{ showLeafIcon: false }}
      blockNode
      onDrop={onDrop}
      treeData={domTree}
      switcherIcon={<DownOutlined />}
      height={500}
      onSelect={handleChangeSelected}
      onMouseEnter={handleChangeHovered}
      onRightClick={handleRightClick}
    />
  );
};
