import { useEffect, useRef, useCallback } from 'react';

export default function useMoveable(moveContainerRef, { onMove, onStartMove, onEndMove }) {
  const shiftRef = useRef({
    x: 0,
    y: 0,
  });

  const handleMove = useCallback(e => {
    const parentRect = moveContainerRef.current.offsetParent.getBoundingClientRect();
    const top = e.clientY - parentRect.top - shiftRef.current.y;
    const left = e.clientX - parentRect.left - shiftRef.current.x;

    onMove({
      top: `${(top / parentRect.height) * 100}%`,
      left: `${(left / parentRect.width) * 100}%`,
    });
  }, []);

  const handleStartMove = useCallback(e => {
    shiftRef.current = {
      x: e.offsetX,
      y: e.offsetY,
    };

    window.addEventListener('mousemove', handleMove);
    if (onStartMove) onStartMove();
  }, []);

  useEffect(() => {
    const el = moveContainerRef.current;

    if (el) {
      el.addEventListener('mousedown', handleStartMove);
      el.addEventListener('dragstart', () => false);
    }

    const handleEndMove = () => {
      window.removeEventListener('mousemove', handleMove);
      if (onEndMove) onEndMove();
    };
    window.addEventListener('mouseup', handleEndMove);

    // fix on move

    return () => {
      if (el) {
        el.removeEventListener('mousedown', handleStartMove);
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleEndMove);
      }
    };
  }, []);

  return [];
}
