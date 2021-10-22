import { Children } from 'react';
import { CarouselProps } from './interface';

export const compareObjectDeep = (
  source: { [k: string]: any },
  target: { [k: string]: any },
): boolean => {
  const sourceKeys = Object.keys(source);
  const targetKeys = Object.keys(target);
  if (
    targetKeys.length !== sourceKeys.length ||
    !!targetKeys.find(targetKey => !sourceKeys.find(sourceKey => sourceKey === targetKey))
  ) {
    return false;
  }
  for (let key of targetKeys) {
    if (typeof target[key] !== typeof source[key]) {
      return false;
    }

    if (typeof target[key] === 'function') {
      continue;
    }

    if (typeof target[key] === 'object') {
      return compareObjectDeep(source[key], target[key]);
    }

    return source[key] === target[key];
  }

  return true;
};

export const didCarouselPropsChange = (prevProps: CarouselProps, currentProps: CarouselProps) => {
  const { children: prevChildren, ...prevRest } = prevProps;
  const { children: currentChildren, ...currentRest } = currentProps;

  if (Children.count(prevChildren) !== Children.count(currentChildren)) {
    return true;
  }

  return !compareObjectDeep(prevRest, currentRest);
};

export const getWidth = (element?: HTMLElement | null) => {
  return (element && element.offsetWidth) || 0;
};

export const getHeight = (element?: HTMLElement | null) => {
  return (element && element.offsetHeight) || 0;
};
