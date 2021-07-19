import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { PortalProps } from './interface';

const inBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const Portal = ({ node, children }: PortalProps) => {
  const defaultNodeRef = useRef<HTMLElement | null>(null);

  useEffect(
    () => () => {
      if (defaultNodeRef.current) {
        document.body.removeChild(defaultNodeRef.current);
      }
    },
    [],
  );

  if (!inBrowser) {
    return null;
  }

  if (!node && !defaultNodeRef.current) {
    const defaultNode = document.createElement('div');
    defaultNodeRef.current = defaultNode;
    document.body.appendChild(defaultNode);
  }

  return ReactDOM.createPortal(children, (node || defaultNodeRef.current)!);
};

Portal.propTypes = {
  node: inBrowser ? PropTypes.instanceOf(HTMLElement) : PropTypes.any,
  children: PropTypes.node,
};

export default Portal;
