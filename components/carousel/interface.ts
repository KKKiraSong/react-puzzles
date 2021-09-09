import React from 'react';

type CarousePropsWithoutChildren = {
  infinite?: boolean;
  threshold?: number;
  duration?: number;
  vertical?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  className?: string;
  style?: React.CSSProperties;
  beforeChange?: (from: number, to: number) => void;
  afterChange?: (current: number) => void;
};
export type CarouselProps = React.PropsWithChildren<CarousePropsWithoutChildren>;

export type TrackProps = React.PropsWithChildren<
  {
    slideWidth?: number;
    slideHeight?: number;
  } & Pick<
    CarousePropsWithoutChildren,
    Exclude<keyof CarousePropsWithoutChildren, 'className' | 'style'>
  >
>;

export interface SlideChangeOption {
  message: 'index' | 'next' | 'prev';
  index?: number;
}

export interface CarouselRef {
  next?: () => void;
  prev?: () => void;
  goTo?: (slideNumber: number) => void;
}

export interface TrackRef extends CarouselRef {}
