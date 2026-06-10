export interface BootstrapOptions {
  container: HTMLElement;
  loaderAnchor?: HTMLElement | null;
  interactionNode?: HTMLElement;
  relativePath?: string;
}

/**
 * Boots the legacy Svelte + Three.js experience inside a React-managed container.
 * Legacy bundles live in src/legacy so Vite can serve them as ES modules.
 */
export async function bootstrapExperience({
  container,
  loaderAnchor,
  interactionNode,
  relativePath = '/',
}: BootstrapOptions): Promise<() => void> {
  await import('@/legacy/index-2eb69c09.js');

  const { default: App3D } = await import('@/legacy/App3D-f554a111.js');

  const instance = new App3D({
    target: container,
    props: {
      interactionNode,
      relativePath,
    },
    ...(loaderAnchor ? { anchor: loaderAnchor } : {}),
  });

  await instance.ready;

  return () => {
    instance.$destroy();
  };
}
