import { useState, useEffect } from 'react';

// CONTROLLER LOGIC
// Handles the logic for detecting scroll direction to drive UI state changes

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
      
      // Optimization: Only update state if direction changes and we have scrolled a bit
      if (direction !== scrollDirection && (scrollY - lastScrollY > 5 || scrollY - lastScrollY < -5)) {
        setScrollDirection(direction);
      }
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection); // clean up event listener
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    }
  }, [scrollDirection]);

  return scrollDirection;
};