import React from 'react';

export type PullUpToLoadMoreProps = React.PropsWithChildren<{
  scrollContainer?: HTMLElement | null;
  indicator?: React.ReactElement | string | number | null;
  threshold?: number;
  loadMore?: Function;
  className?: string;
  style?: React.CSSProperties;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  indicatorClassName?: string;
  indicatorStyle?: React.CSSProperties;
}>;
