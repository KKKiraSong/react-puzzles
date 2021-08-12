import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import Portal from './portal';
import { PopupProps, Position, PositionMap } from './interface';
import { PREFIX_CLS, ANIMATION_PREFIX_CLS, DEFAULT_ANIMATION_DURATION } from './constants';
import { PostionEnum } from './enum';

const Popup = ({
  node,
  children,
  visible,
  wrapperClassName,
  wrapperStyle,
  maskClassName,
  maskStyle,
  contentClassName,
  contentStyle,
  position = PostionEnum.CENTER as Position,
  mask = true,
  maskClosable = false,
  destroyOnClose = false,
  onClose = () => {},
  duration = DEFAULT_ANIMATION_DURATION,
}: PopupProps) => {
  const firstRenderingRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.setProperty('--animation-duration', `${duration}ms`);
    }
  }, [wrapperRef.current]);

  if (!firstRenderingRef.current && !visible) {
    // 为了在节点上挂载动画时间(CSS变量)而渲染wrapper
    return (
      <Portal node={node}>
        <div className={`${PREFIX_CLS}-wrapper`} ref={wrapperRef} />
      </Portal>
    );
  }
  if (!firstRenderingRef.current) {
    firstRenderingRef.current = true;
  }

  const closePopup = () => {
    if (maskClosable) {
      onClose();
    }
  };

  return (
    <Portal node={node}>
      <div
        className={classnames(
          `${PREFIX_CLS}-wrapper`,
          {
            [`${PREFIX_CLS}-wrapper__${position}`]: position === PostionEnum.CENTER,
          },
          wrapperClassName,
        )}
        style={wrapperStyle}
        ref={wrapperRef}
      >
        <CSSTransition
          classNames={`${ANIMATION_PREFIX_CLS}-fade`}
          in={visible}
          timeout={duration}
          appear
          unmountOnExit={destroyOnClose}
        >
          <div
            className={classnames(
              `${PREFIX_CLS}-mask`,
              {
                [`${PREFIX_CLS}-mask__visible`]: mask,
              },
              maskClassName,
            )}
            style={maskStyle}
            onClick={closePopup}
          />
        </CSSTransition>
        <CSSTransition
          classNames={
            position === PostionEnum.CENTER
              ? `${ANIMATION_PREFIX_CLS}-fade`
              : `${ANIMATION_PREFIX_CLS}-${position}-slide`
          }
          in={visible}
          timeout={duration}
          appear
          unmountOnExit={destroyOnClose}
        >
          <div
            className={classnames(
              `${PREFIX_CLS}-content`,
              `${PREFIX_CLS}-content__${position}`,
              contentClassName,
            )}
            style={contentStyle}
          >
            {children}
          </div>
        </CSSTransition>
      </div>
    </Portal>
  );
};

export default Popup;
