import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

function useTopResizing(
  isLocking,
  containerRef,
  resizeContainerRef,
  resizeRef,
  { onResize, onStartResize, onEndResize }
) {
  // resizeTop
  const startResizing = useCallback(e => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const clientRect = resizeContainerRef.current.getBoundingClientRect();

    const top = Math.max(0, e.clientY - containerRect.top);
    const left = Math.max(0, clientRect.left - containerRect.left); // Math.max(0, e.clientX - containerRect.left);

    const { width } = clientRect; // fix width  // Math.max(0, e.clientX - clientRect.left);
    const height = Math.max(0, clientRect.bottom - e.clientY); // fix

    onResize({
      top,
      left,
      width,
      height,
    });
  }, []);

  const stopResizing = useCallback(() => {
    window.removeEventListener('mousemove', startResizing);
    window.removeEventListener('mouseup', stopResizing);

    onEndResize();
  });

  const handleTopMouseDown = useCallback(() => {
    if (isLocking) return;

    window.addEventListener('mousemove', startResizing);
    window.addEventListener('mouseup', stopResizing);

    onStartResize();
  }, []);

  useEffect(() => {
    resizeRef.current.addEventListener('mousedown', handleTopMouseDown);
    return () => {
      window.removeEventListener('mousemove', startResizing);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, []);
}

function useTopLeftResizing(
  isLocking,
  containerRef,
  resizeContainerRef,
  resizeRef,
  { onResize, onStartResize, onEndResize }
) {
  // resizeTop
  const startResizing = useCallback(e => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const clientRect = resizeContainerRef.current.getBoundingClientRect();

    const top = Math.max(0, e.clientY - containerRect.top);
    const left = Math.max(0, e.clientX - containerRect.left); // Math.max(0, clientRect.left - containerRect.left); // Math.max(0, e.clientX - containerRect.left);

    const width = Math.max(0, clientRect.right - e.clientX); // fix width  // Math.max(0, e.clientX - clientRect.left);
    const height = Math.max(0, clientRect.bottom - e.clientY); // fix

    onResize({
      top,
      left,
      width,
      height,
    });
  }, []);

  const stopResizing = useCallback(() => {
    window.removeEventListener('mousemove', startResizing);
    window.removeEventListener('mouseup', stopResizing);

    onEndResize();
  });

  const handleTopMouseDown = useCallback(() => {
    if (isLocking) return;

    window.addEventListener('mousemove', startResizing);
    window.addEventListener('mouseup', stopResizing);

    onStartResize();
  }, []);

  useEffect(() => {
    resizeRef.current.addEventListener('mousedown', handleTopMouseDown);
    return () => {
      window.removeEventListener('mousemove', startResizing);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, []);
}

function useTopRightResizing(
  isLocking,
  containerRef,
  resizeContainerRef,
  resizeRef,
  { onResize, onStartResize, onEndResize }
) {
  // resizeTop
  const startResizing = useCallback(e => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const clientRect = resizeContainerRef.current.getBoundingClientRect();

    const top = Math.max(0, e.clientY - containerRect.top);
    const left = clientRect.left - containerRect.left;

    const width = Math.max(0, e.clientX - clientRect.left); // fix width  // Math.max(0, e.clientX - clientRect.left);
    const height = Math.max(0, clientRect.bottom - e.clientY); // fix

    onResize({
      top,
      left,
      width,
      height,
    });
  }, []);

  const stopResizing = useCallback(() => {
    window.removeEventListener('mousemove', startResizing);
    window.removeEventListener('mouseup', stopResizing);

    onEndResize();
  });

  const handleTopMouseDown = useCallback(() => {
    if (isLocking) return;

    window.addEventListener('mousemove', startResizing);
    window.addEventListener('mouseup', stopResizing);

    onStartResize();
  }, []);

  useEffect(() => {
    resizeRef.current.addEventListener('mousedown', handleTopMouseDown);
    return () => {
      window.removeEventListener('mousemove', startResizing);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, []);
}

function useLeftResizing(
  isLocking,
  containerRef,
  resizeContainerRef,
  resizeRef,
  { onResize, onStartResize, onEndResize }
) {
  // resizeTop
  const startResizing = useCallback(e => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const clientRect = resizeContainerRef.current.getBoundingClientRect();

    const top = clientRect.top - containerRect.top;
    const left = Math.max(0, e.clientX - containerRect.left);
    const width = Math.max(0, clientRect.right - e.clientX); // fix width  // Math.max(0, e.clientX - clientRect.left);

    onResize({
      top,
      left,
      width,
    });
  }, []);

  const stopResizing = useCallback(() => {
    window.removeEventListener('mousemove', startResizing);
    window.removeEventListener('mouseup', stopResizing);

    onEndResize();
  });

  const handleTopMouseDown = useCallback(() => {
    if (isLocking) return;

    window.addEventListener('mousemove', startResizing);
    window.addEventListener('mouseup', stopResizing);

    onStartResize();
  }, []);

  useEffect(() => {
    resizeRef.current.addEventListener('mousedown', handleTopMouseDown);
    return () => {
      window.removeEventListener('mousemove', startResizing);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, []);
}

function useRightResizing(
  isLocking,
  containerRef,
  resizeContainerRef,
  resizeRef,
  { onResize, onStartResize, onEndResize }
) {
  // resizeTop
  const startResizing = useCallback(e => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const clientRect = resizeContainerRef.current.getBoundingClientRect();
    const width = Math.max(0, e.clientX - clientRect.left);
    const { height } = clientRect; // Math.max(0, e.clientY - clientRect.top);
    const top = clientRect.top - containerRect.top;
    const left = clientRect.left - containerRect.left;

    onResize({
      top,
      left,
      width,
      height,
    });
  }, []);

  const stopResizing = useCallback(() => {
    window.removeEventListener('mousemove', startResizing);
    window.removeEventListener('mouseup', stopResizing);
    onEndResize();
  });

  const handleMouseDown = useCallback(() => {
    if (isLocking) return;

    window.addEventListener('mousemove', startResizing);
    window.addEventListener('mouseup', stopResizing);

    onStartResize();
  }, []);

  useEffect(() => {
    resizeRef.current.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousemove', startResizing);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, []);
}

function useBottomResizing(
  isLocking,
  containerRef,
  resizeContainerRef,
  resizeRef,
  { onResize, onStartResize, onEndResize }
) {
  // resizeTop
  const startResizing = useCallback(e => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const clientRect = resizeContainerRef.current.getBoundingClientRect();
    const { width } = clientRect; // Math.max(0, e.clientX - clientRect.left);
    const height = Math.max(0, e.clientY - clientRect.top);
    const top = clientRect.top - containerRect.top;
    const left = clientRect.left - containerRect.left;

    onResize({
      top,
      left,
      width,
      height,
    });
  }, []);

  const stopResizing = useCallback(() => {
    window.removeEventListener('mousemove', startResizing);
    window.removeEventListener('mouseup', stopResizing);
    onEndResize();
  });

  const handleMouseDown = useCallback(() => {
    if (isLocking) return;

    window.addEventListener('mousemove', startResizing);
    window.addEventListener('mouseup', stopResizing);

    onStartResize();
  }, []);

  useEffect(() => {
    resizeRef.current.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousemove', startResizing);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, []);
}

function useBottomLeftResizing(
  isLocking,
  containerRef,
  resizeContainerRef,
  resizeRef,
  { onResize, onStartResize, onEndResize }
) {
  // resizeTop
  const startResizing = useCallback(e => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const clientRect = resizeContainerRef.current.getBoundingClientRect();

    const width = Math.max(0, clientRect.right - e.clientX);
    const height = Math.max(0, e.clientY - clientRect.top);
    const left = Math.max(0, e.clientX - containerRect.left);
    const top = clientRect.top - containerRect.top;

    onResize({
      top,
      left,
      width,
      height,
    });
  }, []);

  const stopResizing = useCallback(() => {
    window.removeEventListener('mousemove', startResizing);
    window.removeEventListener('mouseup', stopResizing);
    onEndResize();
  });

  const handleMouseDown = useCallback(() => {
    if (isLocking) return;

    window.addEventListener('mousemove', startResizing);
    window.addEventListener('mouseup', stopResizing);

    onStartResize();
  }, []);

  useEffect(() => {
    resizeRef.current.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousemove', startResizing);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, []);
}

function useBottomRightResizing(
  isLocking,
  containerRef,
  resizeContainerRef,
  resizeRef,
  { onResize, onStartResize, onEndResize }
) {
  // resizeTop
  const startResizing = useCallback(e => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const clientRect = resizeContainerRef.current.getBoundingClientRect();
    const width = Math.max(0, e.clientX - clientRect.left);
    const height = Math.max(0, e.clientY - clientRect.top);
    const top = clientRect.top - containerRect.top;
    const left = clientRect.left - containerRect.left;

    onResize({
      top,
      left,
      width,
      height,
    });
  }, []);

  const stopResizing = useCallback(() => {
    window.removeEventListener('mousemove', startResizing);
    window.removeEventListener('mouseup', stopResizing);
    onEndResize();
  });

  const handleMouseDown = useCallback(() => {
    if (isLocking) return;

    window.addEventListener('mousemove', startResizing);
    window.addEventListener('mouseup', stopResizing);

    onStartResize();
  }, []);

  useEffect(() => {
    resizeRef.current.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousemove', startResizing);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, []);
}

export default function Resizeable({
  containerRef,
  lockTop,
  lockLeft,
  lockBottom,
  lockRight,
  children,
  onResize,
  onStartResize,
  onEndResize,
}) {
  const [resizing, setResizing] = useState(false);
  const resizeContainerRef = useRef();

  const resizeTopLeftRef = useRef();
  const resizeTopRef = useRef();
  const resizeTopRightRef = useRef();
  const resizeLeftRef = useRef();
  const resizeRightRef = useRef();
  const resizeBottomLeftRef = useRef();
  const resizeBottomRef = useRef();
  const resizeBottomRightRef = useRef();

  const events = useMemo(
    () => ({
      onResize,
      onStartResize: () => {
        setResizing(true);
        if (onStartResize) {
          onStartResize();
        }
      },
      onEndResize: () => {
        console.log('--------------frz--------------');
        console.log(onEndResize);
        console.log('----------------------------');
        setResizing(false);
        if (onEndResize) {
          onEndResize();
        }
      },
    }),
    []
  );

  useTopResizing(lockTop, containerRef, resizeContainerRef, resizeTopRef, events);
  useTopLeftResizing(
    lockTop && lockLeft,
    containerRef,
    resizeContainerRef,
    resizeTopLeftRef,
    events
  );
  useTopRightResizing(
    lockTop && lockRight,
    containerRef,
    resizeContainerRef,
    resizeTopRightRef,
    events
  );

  useLeftResizing(lockLeft, containerRef, resizeContainerRef, resizeLeftRef, events);
  useRightResizing(lockRight, containerRef, resizeContainerRef, resizeRightRef, events);

  useBottomResizing(lockBottom, containerRef, resizeContainerRef, resizeBottomRef, events);
  useBottomLeftResizing(
    lockBottom && lockLeft,
    containerRef,
    resizeContainerRef,
    resizeBottomLeftRef,
    events
  );
  useBottomRightResizing(
    lockBottom && lockRight,
    containerRef,
    resizeContainerRef,
    resizeBottomRightRef,
    events
  );

  return (
    <div className={styles.container} ref={resizeContainerRef}>
      <div className={styles.content}>{children}</div>

      {resizing && <div className={styles.resizing} />}

      <div className={styles.resizeTop} ref={resizeTopRef} />
      <div className={styles.resizeLeft} ref={resizeLeftRef} />
      <div className={styles.resizeBottom} ref={resizeBottomRef} />
      <div className={styles.resizeRight} ref={resizeRightRef} />
      <div className={styles.resizeTopLeft} ref={resizeTopLeftRef} />
      <div className={styles.resizeTopRight} ref={resizeTopRightRef} />
      <div className={styles.resizeBottomLeft} ref={resizeBottomLeftRef} />
      <div className={styles.resizeBottomRight} ref={resizeBottomRightRef} />
    </div>
  );
}

Resizeable.propTypes = {
  onResize: PropTypes.func,
  onStartResize: PropTypes.func,
  onEndResize: PropTypes.func,
  lockTop: PropTypes.bool,
  lockLeft: PropTypes.bool,
  lockBottom: PropTypes.bool,
  lockRight: PropTypes.bool,
};
Resizeable.defaultProps = {
  onResize: () => {},
  onStartResize: () => {},
  onEndResize: () => {},

  lockTop: false,
  lockLeft: false,
  lockBottom: false,
  lockRight: false,
};
