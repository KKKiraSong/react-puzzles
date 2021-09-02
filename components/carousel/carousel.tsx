import React, { useRef, useEffect, useState, useImperativeHandle } from 'react';
import { useMount } from 'react-use';
import classnames from 'classnames';

import Track from './track';
import { CarouselProps, CarouselRef } from './interface';
import { PREFIX_CLS } from './constants';
import { didCarouselPropsChange, getWidth, getHeight } from './util';

const Carousel = React.forwardRef<CarouselRef, CarouselProps>(
  ({ className, style, ...props }: CarouselProps, ref: React.ForwardedRef<CarouselRef>) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const propsRef = useRef<CarouselProps>({ ...props, className, style });

    const [carouselWrapperWidth, setCarouselWrapperWidth] = useState<number>(0);
    const [carouselWrapperHeight, setCarouselWrapperHeight] = useState<number>(0);

    const { children, vertical } = props;

    useMount(() => {
      if (!vertical) {
        setCarouselWrapperWidth(getWidth(wrapperRef.current));
      } else {
        setCarouselWrapperHeight(getHeight(wrapperRef.current));
      }
    });

    useEffect(() => {
      if (didCarouselPropsChange(propsRef.current, { ...props, className, style })) {
        if (!vertical) {
          setCarouselWrapperWidth(getWidth(wrapperRef.current));
        } else {
          setCarouselWrapperHeight(getHeight(wrapperRef.current));
        }
      }
    });

    const renderChildren = () => {
      // 过滤空child
      const validChildren = React.Children.toArray(children).filter(child => {
        if (typeof child === 'string') {
          return !!child.trim();
        }

        return !!child;
      });

      return validChildren;
    };

    return (
      <div
        className={classnames(`${PREFIX_CLS}-wrapper`, className)}
        style={style}
        ref={wrapperRef}
      >
        <Track
          slideWidth={carouselWrapperWidth}
          slideHeight={carouselWrapperHeight}
          {...props}
          ref={ref}
        >
          {renderChildren()}
        </Track>
      </div>
    );
  },
);

export default Carousel;
