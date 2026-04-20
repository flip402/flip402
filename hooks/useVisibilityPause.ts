'use client';

import { useEffect, useState } from 'react';

/** Returns `true` while the tab is visible; flips to `false` when user switches away. */
export function useVisibilityPause(): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === 'visible');
    onChange();
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return visible;
}
