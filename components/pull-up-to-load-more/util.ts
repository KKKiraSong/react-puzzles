export const inView = (el: HTMLElement, threshold?: number) => {
  const { top, bottom } = el.getBoundingClientRect();

  return (
    (top > 0 && top < window.innerHeight - (threshold || 0)) ||
    (bottom > 0 && bottom < window.innerHeight - (threshold || 0)) ||
    (top <= 0 && bottom >= window.innerHeight - (threshold || 0))
  );
};
