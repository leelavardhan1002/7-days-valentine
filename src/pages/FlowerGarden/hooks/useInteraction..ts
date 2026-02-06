import { useEffect } from 'react';

export function useInteraction(onPlant: (x: number, y: number) => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      onPlant(e.pageX / innerWidth, e.pageY / innerHeight);
    };

    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [onPlant]);
}
