import React from 'react';

export type PortalProps = React.PropsWithChildren<{
  node?: HTMLElement;
}>;

export type Position = 'top' | 'right' | 'bottom' | 'left' | 'center';
export type PositionMap = Record<Position, string>;

export type PopupProps = React.PropsWithChildren<{
  node?: HTMLElement;
  visible: boolean;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  maskClassName?: string;
  maskStyle?: React.CSSProperties;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  position?: Position;
  mask?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  onClose?: () => void;
  duration?: number;
}>;
