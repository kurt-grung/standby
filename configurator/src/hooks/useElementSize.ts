import { useCallback, useEffect, useState } from 'react';

type Size = {
  width: number;
  height: number;
};

export function useElementSize<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  const ref = useCallback((next: T | null) => {
    setNode(next);
  }, []);

  useEffect(() => {
    if (!node) {
      setSize({ width: 0, height: 0 });
      return;
    }

    const measure = () => {
      setSize({ width: node.clientWidth, height: node.clientHeight });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => observer.disconnect();
  }, [node]);

  return { ref, ...size };
}
