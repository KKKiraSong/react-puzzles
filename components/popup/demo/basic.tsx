import React, { useRef, useState, useEffect } from 'react';
import Popup from '../popup';
import '../style/index.less';
import './basic.less';

export default () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);

  useEffect(() => setPortal(containerRef.current), [containerRef.current]);
  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '375px',
        height: '812px',
        background: 'lightblue',
      }}
    >
      <Popup node={portal} wrapperClassName="basic-wrapper"></Popup>
    </div>
  );
};
