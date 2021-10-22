import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useImperativeHandle,
} from 'react';
import classnames from 'classnames';
import { throttle } from 'lodash';

import { TrackProps, TrackRef, SlideChangeOption } from './interface';
import {
  PREFIX_CLS,
  DEFAULT_DURATION,
  SLIDE_RATE_OUT_OF_BOUNDS,
  TOUCH_MOVE_THROTTLE_WAIT,
} from './constants';

const Track = React.forwardRef<TrackRef, TrackProps>(
  (
    {
      children,
      slideWidth = 0,
      slideHeight = 0,
      infinite = true,
      duration = DEFAULT_DURATION,
      threshold = 0,
      vertical = false,
      autoplay = false,
      autoplayInterval = 2000,
      beforeChange,
      afterChange,
    }: TrackProps,
    ref: React.ForwardedRef<any>,
  ) => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [animationFlag, setAnimationFlag] = useState<boolean>(false); // 是否需要动效
    const [animationPaused, setAnimationPaused] = useState<boolean>(true); // 动画是否处于暂停状态

    const trackRef = useRef<HTMLDivElement | null>(null);
    const touchPointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const autoplayTimerRef = useRef<NodeJS.Timer>();
    const prevSlideRef = useRef<number>(0);

    const renderSlides = useCallback(() => {
      const slides: React.ReactElement[] = [];
      const preClone: React.ReactElement[] = [];
      const postClone: React.ReactElement[] = [];

      // 预加载逻辑
      React.Children.forEach(children, (child, i) => {
        slides.push(
          <div
            key={i}
            data-index={i}
            style={{
              flexShrink: 0,
              width: slideWidth ? `${slideWidth}px` : '100%',
              height: slideHeight ? `${slideHeight}px` : 'auto',
              transform: 'translate3d(0, 0, 0)', // 启用GPU加速slide渲染，解决iOS中平移动画slide闪烁问题
            }}
          >
            {child}
          </div>,
        );

        if (infinite && React.Children.count(children) !== 1) {
          i === React.Children.count(children) - 1 &&
            preClone.push(React.cloneElement(slides[i], { key: -1, 'data-index': -1 }));

          postClone.push(
            React.cloneElement(slides[i], {
              key: i + React.Children.count(children),
              'data-index': i + React.Children.count(children),
            }),
          );
        }
      });

      return preClone.concat(slides, postClone);
    }, [slideWidth, slideHeight, children, React.Children.count(children), infinite]);

    const preCloneLength = useMemo(() => {
      if (!infinite || React.Children.count(children) <= 1) {
        return 0;
      }

      return 1;
    }, [infinite, React.Children.count(children)]);

    const postCloneLength = useMemo(() => {
      if (!infinite || React.Children.count(children) <= 1) {
        return 0;
      }

      return React.Children.count(children);
    }, [infinite, React.Children.count(children)]);

    const changeSlide = useCallback(
      ({ message, index }: SlideChangeOption) => {
        if (!animationPaused || React.Children.count(children) <= 1) {
          return;
        }

        let targetSlide = currentSlide;
        switch (message) {
          case 'index':
            targetSlide = index || 0;
            break;

          case 'prev':
            if (infinite || targetSlide - 1 >= 0) {
              targetSlide -= 1;
            }

            break;

          case 'next':
            if (infinite || targetSlide + 1 <= React.Children.count(children) - 1) {
              targetSlide += 1;
            }

            break;

          default:
            break;
        }

        if (targetSlide !== currentSlide) {
          duration > 0 && !animationFlag && setAnimationFlag(true);
          duration > 0 && setAnimationPaused(false);

          beforeChange &&
            beforeChange(
              currentSlide,
              (targetSlide + React.Children.count(children)) % React.Children.count(children),
            );

          if (duration <= 0) {
            setCurrentSlide(
              (targetSlide + React.Children.count(children)) % React.Children.count(children),
            );
          } else {
            setCurrentSlide(targetSlide);
          }
        }
      },
      [animationPaused, currentSlide, React.Children.count(children), infinite, duration],
    );

    const trackTranslate: number | string = useMemo(() => {
      if ((!vertical && slideWidth) || (vertical && slideHeight)) {
        // 加载完成后，slide轨道平移计算
        // 竖直按slide高度计算，水平按slide宽度计算
        if (!infinite || React.Children.count(children) <= 1) {
          return -(vertical ? slideHeight : slideWidth) * currentSlide;
        } else {
          return -(vertical ? slideHeight : slideWidth) * (currentSlide + 1);
        }
      } else {
        // 加载完成前，slide宽度样式按100%计算
        if (!infinite || React.Children.count(children) <= 1) {
          return 0;
        } else {
          return '-100%';
        }
      }
    }, [vertical, slideWidth, slideHeight, infinite, React.Children.count(children), currentSlide]);

    const trackStyle = useMemo(() => {
      let width, height;

      if (!vertical) {
        height = 'auto';
        if (slideWidth) {
          width = `${
            (preCloneLength + React.Children.count(children) + postCloneLength) * slideWidth
          }px`;
        } else {
          width = '100%';
        }

        return {
          width,
          height,
          transform:
            typeof trackTranslate === 'number'
              ? `translate3d(${trackTranslate}px, 0, 0)`
              : `translate3d(${trackTranslate}, 0, 0)`,
        };
      }

      width = '100%';
      if (slideHeight) {
        height = `${
          (preCloneLength + React.Children.count(children) + postCloneLength) * slideHeight
        }px`;
      } else {
        height = `100%`;
      }
      return {
        width,
        height,
        transform:
          typeof trackTranslate === 'number'
            ? `translate3d(0, ${trackTranslate}px, 0)`
            : `translate3d(0, ${trackTranslate}, 0)`,
      };
    }, [vertical, slideWidth, slideHeight, infinite, React.Children.count(children), currentSlide]);

    const slideOutOfBounds = useCallback(
      (slideDistance: number) => {
        if (infinite) {
          return false;
        }

        if (currentSlide === React.Children.count(children) - 1 && slideDistance < 0) {
          return true;
        }

        if (currentSlide === 0 && slideDistance > 0) {
          return true;
        }

        return false;
      },
      [infinite, currentSlide, React.Children.count(children)],
    );

    const touchStart = useCallback(
      (e: React.TouchEvent) => {
        // 如果正处于切换动画，阻止滑动操作
        if (!animationPaused) {
          return;
        }

        if (autoplay && autoplayTimerRef.current) {
          clearInterval(autoplayTimerRef.current);
        }

        touchPointRef.current.x = e.touches[0].pageX;
        touchPointRef.current.y = e.touches[0].pageY;
      },
      [animationPaused, autoplay, autoplayTimerRef.current],
    );

    const touchMove = useCallback(
      throttle((e: React.TouchEvent) => {
        // 如果正处于切换动画，阻止滑动操作
        if (!animationPaused) {
          return;
        }

        if (trackRef.current && typeof trackTranslate === 'number') {
          const slideDistance = vertical
            ? e.touches[0].pageY - touchPointRef.current.y
            : e.touches[0].pageX - touchPointRef.current.x;
          const slideRate = slideOutOfBounds(slideDistance) ? SLIDE_RATE_OUT_OF_BOUNDS : 1;

          if (!vertical) {
            trackRef.current.style.transform = `translate3d(${
              trackTranslate + slideRate * slideDistance
            }px, 0, 0)`;
          } else {
            trackRef.current.style.transform = `translate3d(0, ${
              trackTranslate + slideRate * slideDistance
            }px, 0)`;
          }
        }
      }, TOUCH_MOVE_THROTTLE_WAIT),
      [animationPaused, trackTranslate, touchPointRef.current.x, touchPointRef.current.y],
    );

    const touchEnd = useCallback(
      (e: React.TouchEvent) => {
        const validThreshhold = Math.min(Math.max(0, threshold), 1);
        const slideDistance = vertical
          ? e.changedTouches[0].pageY - touchPointRef.current.y
          : e.changedTouches[0].pageX - touchPointRef.current.x;

        // 根据滑动距离判断是否切换下一张
        if (
          slideOutOfBounds(slideDistance) ||
          Math.abs(slideDistance) < validThreshhold * (!vertical ? slideWidth : slideHeight)
        ) {
          if (!trackRef.current) {
            return;
          }

          duration > 0 && setAnimationPaused(false);
          setAnimationFlag(true);
          trackRef.current.style.transform = !vertical
            ? `translate3d(${trackTranslate}px, 0, 0)`
            : `translate3d(0, ${trackTranslate}px, 0)`;
        } else {
          changeSlide({ message: slideDistance < 0 ? 'next' : 'prev' });
        }
      },
      [threshold, trackTranslate, animationPaused, duration],
    );

    const transitionEnd = useCallback(() => {
      // 在禁用动画、动画状态为暂停的情况下，将slide切换到对应的非clone部分
      duration > 0 && setAnimationPaused(true);
      setAnimationFlag(false);

      if (currentSlide > React.Children.count(children) - 1 || currentSlide < 0) {
        setCurrentSlide(
          (currentSlide + React.Children.count(children)) % React.Children.count(children),
        );
      } else {
        // 有过渡动画，且切换slide后，仍处于非clone区间的，在此（动画结束后）执行afterChange
        // 无过渡动画的，在currentSlide发生变化后直接执行afterChange
        // 切换slide后，处于clone区间的，不执行afterChange
        afterChange && afterChange(currentSlide);
      }
    }, [currentSlide, afterChange, React.Children.count(children), duration]);

    useEffect(() => {
      if (!autoplay) {
        return;
      }

      if (typeof autoplayTimerRef.current !== 'undefined') {
        clearInterval(autoplayTimerRef.current);
      }

      autoplayTimerRef.current = setInterval(
        () => changeSlide({ message: 'next' }),
        autoplayInterval,
      );

      return () => {
        if (typeof autoplayTimerRef.current !== 'undefined') {
          clearInterval(autoplayTimerRef.current);
        }
      };
    }, [autoplay, currentSlide, animationPaused]);

    useEffect(() => {
      if (trackRef.current) {
        // CSS变量设置动画时间，如果小于0，则取0
        trackRef.current.style.setProperty('--animation-duration', `${Math.max(0, duration)}ms`);
      }
    }, [trackRef.current]);

    useEffect(() => {
      // 仅切换slide后，处于非clone区间的，在此（changeSlide发生变化后）执行afterChange
      // 另需要满足以下条件之一
      // a.无过渡动画
      // b.上一帧slide处于clone区间
      // 有过渡动画并且上一帧也在非clone区间的，在过渡动画执行完后执行afterChange
      if (
        (duration <= 0 ||
          prevSlideRef.current < 0 ||
          prevSlideRef.current > React.Children.count(children) - 1) &&
        0 <= currentSlide &&
        currentSlide <= React.Children.count(children) - 1 &&
        afterChange
      ) {
        afterChange(currentSlide);
      }

      prevSlideRef.current = currentSlide;
    }, [currentSlide]);

    useImperativeHandle<TrackRef, {}>(
      ref,
      () => {
        return {
          next: () => changeSlide({ message: 'next' }),
          prev: () => changeSlide({ message: 'prev' }),
          goTo: (slideNumber: number) => changeSlide({ message: 'index', index: slideNumber }),
        };
      },
      [animationPaused, currentSlide, React.Children.count(children), infinite],
    );

    return (
      <div
        ref={trackRef}
        className={classnames(`${PREFIX_CLS}-track`, {
          [`${PREFIX_CLS}-track-vertical`]: vertical,
          [`${PREFIX_CLS}-track-animation`]: animationFlag,
        })}
        style={trackStyle}
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
        onTransitionEnd={transitionEnd}
      >
        {renderSlides()}
      </div>
    );
  },
);

export default Track;
