import { DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import { Key } from 'antd/lib/table/interface';
import { DataNode } from 'antd/lib/tree';
import React, { useEffect, useRef, useState } from 'react';

import 'antd/dist/antd.css';
import { useForceRender } from '../hooks';

export interface IDataNode extends DataNode {
  domNode: HTMLElement;
  key: string;
}

function getDataNodeTree(
  el: HTMLElement,
  key: string = '0',
  dataNodeTreeAsMap?: Map<HTMLElement, IDataNode>
): { dataNodeTree: IDataNode; dataNodeTreeAsMap: Map<HTMLElement, IDataNode> } {
  if (!dataNodeTreeAsMap) {
    dataNodeTreeAsMap = new Map();
  }

  const children: IDataNode[] = [];
  const title = el.nodeName;
  const dataNodeTree = {
    title,
    key,
    domNode: el,
    children,
  };

  dataNodeTreeAsMap.set(el, dataNodeTree);

  for (let j = 0; j < el.children.length; j++) {
    const { dataNodeTree: childDataNodeTree } = getDataNodeTree(
      el.children[j] as HTMLElement,
      `${key}-${j}`,
      dataNodeTreeAsMap
    );

    children.push(childDataNodeTree);
  }

  return { dataNodeTree, dataNodeTreeAsMap };
}
export interface IDomTreeProps {
  rootNode: HTMLBodyElement;
  selected: HTMLElement | null;
  onChangeSelected: (newSelected: HTMLElement) => void;
  onChangeHovered: (newHovered: HTMLElement) => void;
  onRightClick: ({
    x,
    y,
    parentNode,
  }: {
    x: number;
    y: number;
    parentNode: HTMLElement;
  }) => void;
}

export const DomTree: React.FC<IDomTreeProps> = (props) => {
  const {
    rootNode,
    selected,
    onChangeSelected,
    onChangeHovered,
    onRightClick,
  } = props;

  const forceRender = useForceRender();

  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const treeRef = useRef<any>();
  const dataNodeTreeAsMapRef = useRef<Map<HTMLElement, IDataNode>>();

  useEffect(() => {
    if (!dataNodeTreeAsMapRef.current) {
      return;
    }
    const values = Array.from(dataNodeTreeAsMapRef.current.values());

    setExpandedKeys(values.map(({ key }) => key));
  }, []);

  useEffect(() => {
    if (!selected || !dataNodeTreeAsMapRef.current || !treeRef.current) {
      return;
    }
    const selectedDataNode = dataNodeTreeAsMapRef.current.get(selected);

    if (!selectedDataNode) {
      return;
    }
    const { key } = selectedDataNode;
    const parents = [];

    for (let i = key.length; i >= 0; i--) {
      if (key[i] === '-') {
        parents.push(key.slice(0, i));
      }
    }
    const set = new Set([...expandedKeys, ...parents]);

    treeRef.current.scrollTo({ key });
    setExpandedKeys(Array.from(set));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleDrop = (info: any) => {
    const { dropToGap } = info as { dropToGap: boolean };
    const { node, dragNode } = info;
    const { domNode: dropNode } = node as IDataNode;
    const { domNode: draggableNode } = dragNode as IDataNode;

    draggableNode.remove();

    if (dropToGap) {
      dropNode?.parentNode?.insertBefore(draggableNode, dropNode.nextSibling);
    } else {
      dropNode.insertBefore(draggableNode, dropNode.firstChild);
    }

    forceRender();
  };

  const handleExpand = (expandedKeys: Key[]) => {
    setExpandedKeys(expandedKeys);
  };

  const handleChangeSelected = (
    selectedKeys: Key[],
    { node: dataNode }: any
  ) => {
    const { domNode } = dataNode as IDataNode;

    onChangeSelected(domNode);
  };

  const handleChangeHovered = ({ node: dataNode }: any) => {
    const { domNode } = dataNode as IDataNode;

    onChangeHovered(domNode);
  };

  const handleRightClick = ({ event, node: dataNode }: any) => {
    const { clientX, clientY } = event as React.MouseEvent<Element, MouseEvent>;
    const { domNode } = dataNode as IDataNode;

    onRightClick({ x: clientX, y: clientY, parentNode: domNode });
  };

  const { dataNodeTree, dataNodeTreeAsMap } = getDataNodeTree(rootNode);

  dataNodeTreeAsMapRef.current = dataNodeTreeAsMap;
  const { key } =
    (selected && dataNodeTreeAsMapRef.current.get(selected)) || {};
  const selectedKeys = key ? [key] : [];

  return (
    <Tree
      treeData={[dataNodeTree]}
      selectedKeys={selectedKeys}
      expandedKeys={expandedKeys}
      ref={treeRef}
      draggable
      height={500}
      blockNode
      showLine={{ showLeafIcon: false }}
      switcherIcon={<DownOutlined />}
      onDrop={handleDrop}
      onExpand={handleExpand}
      onSelect={handleChangeSelected}
      onMouseEnter={handleChangeHovered}
      onRightClick={handleRightClick}
    />
  );
};
