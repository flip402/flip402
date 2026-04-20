'use client';

import { useEffect, useState } from 'react';

/**
 * Returns `true` if the viewport is below `breakpoint` px wide.
 * SSR-safe: returns `false` until hydration, so desktop visuals render first.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [breakpoint]);

  return isMobile;
}
