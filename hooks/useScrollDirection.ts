import { useState, useEffect } from 'react';

export enum ScrollDirection {
  UP = 'up',
  DOWN = 'down',
}

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection | null>(null);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? ScrollDirection.DOWN : ScrollDirection.UP;
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 5) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection]);

  return scrollDirection;
};
