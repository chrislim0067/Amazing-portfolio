import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import '@/styles/loader.css';

export interface LoaderHandle {
  getElement: () => HTMLDivElement | null;
  hide: () => Promise<void>;
}

export const Loader = forwardRef<LoaderHandle>(function Loader(_, ref) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useImperativeHandle(ref, () => ({
    getElement: () => loaderRef.current,
    hide: () =>
      new Promise<void>((resolve) => {
        const el = loaderRef.current;
        if (!el || !visible) {
          resolve();
          return;
        }

        const onEnd = () => {
          el.removeEventListener('animationend', onEnd);
          setVisible(false);
          resolve();
        };

        setExiting(true);
        el.addEventListener('animationend', onEnd);
      }),
  }));

  if (!visible) {
    return null;
  }

  return (
    <div id="loader" ref={loaderRef} className={exiting ? 'loader-exit' : undefined}>
      <div className="ascii" />
    </div>
  );
});
