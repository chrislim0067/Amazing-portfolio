/** Minimal typing for the legacy Svelte WebGL component. */
export interface LegacySvelteComponent {
  ready: Promise<unknown>;
  $destroy: () => void;
  $on: (event: string, callback: () => void) => void;
}

export interface LegacySvelteConstructor {
  new (options: {
    target: HTMLElement;
    props?: {
      interactionNode?: HTMLElement;
      relativePath?: string;
    };
    anchor?: HTMLElement;
  }): LegacySvelteComponent;
}

declare module '*.js' {
  const value: unknown;
  export default value;
}
