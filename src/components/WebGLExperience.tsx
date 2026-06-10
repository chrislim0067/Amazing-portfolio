import { useEffect, useRef } from 'react';
import { bootstrapExperience } from '@/lib/bootstrapExperience';
import { Loader, type LoaderHandle } from '@/components/Loader';

export function WebGLExperience() {
  const appRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<LoaderHandle>(null);

  useEffect(() => {
    const container = appRef.current;
    if (!container || container.dataset.experienceMounted === 'true') {
      return;
    }

    container.dataset.experienceMounted = 'true';

    let destroyExperience: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      destroyExperience = await bootstrapExperience({
        container,
        loaderAnchor: loaderRef.current?.getElement() ?? null,
        relativePath: '/',
      });

      if (cancelled) {
        destroyExperience?.();
        return;
      }

      await loaderRef.current?.hide();
    })();

    return () => {
      cancelled = true;
      destroyExperience?.();
    };
  }, []);

  return (
    <div id="app" ref={appRef}>
      <Loader ref={loaderRef} />
    </div>
  );
}
