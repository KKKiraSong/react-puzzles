import React from 'react';

export type PortalProps = React.PropsWithChildren<{
  node?: HTMLElement;
}>;

export type Position = 'top' | 'right' | 'bottom' | 'left' | 'center';
export type PositionMap = Record<Position, string>;

export type PopupProps = React.PropsWithChildren<{
  node?: HTMLElement;
  visible: boolean;
  position?: Position;
  duration?: number;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  maskClassName?: string;
  maskStyle?: React.CSSProperties;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  mask?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  onClose?: () => void;
  afterClose?: () => void;
}>;
