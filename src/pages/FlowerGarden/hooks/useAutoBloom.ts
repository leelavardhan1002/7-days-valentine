import { useEffect } from 'react';

export function useAutoBloom(enabled: boolean, onPlant: (x: number, y: number) => void) {
  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => {
      onPlant(Math.random(), Math.random());
    }, 600);

    return () => clearInterval(id);
  }, [enabled, onPlant]);
}
