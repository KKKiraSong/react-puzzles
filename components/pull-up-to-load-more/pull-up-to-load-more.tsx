import React, { useMemo, useRef, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import { throttle } from 'lodash';

import { PullUpToLoadMoreProps } from './interface';
import { PREFIX_CLS, SCROLL_THROTTLE_WAIT } from './constants';
import { inView } from './util';

const PullUpToLoadMore = ({
  children,
  indicator,
  threshold,
  scrollContainer,
  loadMore,
  className,
  style,
  contentClassName,
  contentStyle,
  indicatorClassName,
  indicatorStyle,
}: PullUpToLoadMoreProps) => {
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const indicatorElement = useMemo(() => {
    if (typeof indicator === 'undefined' || indicator === null) {
      return <div className={classnames(`${PREFIX_CLS}-indicator-null`)} />;
    }

    if (typeof indicator === 'string' || typeof indicator === 'number') {
      return (
        <p
          className={classnames(`${PREFIX_CLS}-indicator`, indicatorClassName)}
          style={indicatorStyle}
        >
          {indicator}
        </p>
      );
    }

    return indicator;
  }, [indicator]);

  // 防止一次滚动中重复执行滚动回调
  const inViewRef = useRef<boolean>(false);

  const scrollListener = useCallback(
    throttle(() => {
      if (
        indicatorRef.current &&
        !inViewRef.current &&
        inView(indicatorRef.current, threshold) &&
        loadMore
      ) {
        loadMore();
      }

      if (indicatorRef.current) {
        inViewRef.current = inView(indicatorRef.current, threshold);
      }
    }, SCROLL_THROTTLE_WAIT),
    [indicatorRef.current],
  );

  useEffect(() => {
    if (scrollContainer) {
      // 为防止重复添加监听，先移除已添加的滚动事件处理器
      scrollContainer.removeEventListener('scroll', scrollListener);

      scrollContainer.addEventListener('scroll', scrollListener);
    }
  }, [scrollContainer, scrollListener]);

  return (
    <div
      className={classnames(`${PREFIX_CLS}-wrapper`, className, {
        [`${PREFIX_CLS}-wrapper-tile`]: !!scrollContainer,
      })}
      style={style}
      onScroll={!scrollContainer ? scrollListener : undefined}
    >
      <div className={classnames(`${PREFIX_CLS}-content`, contentClassName)} style={contentStyle}>
        {children}
      </div>
      <div ref={indicatorRef}>{indicatorElement}</div>
    </div>
  );
};

export default PullUpToLoadMore;
