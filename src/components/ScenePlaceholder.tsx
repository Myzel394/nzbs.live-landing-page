// Stand-in for a scene (canvas or SVG) until its step is built. Keeps the scene's text alternative.
export function ScenePlaceholder({ scene, label }: { scene: string; label?: string }) {
  return label ? (
    <div data-scene={scene} role="img" aria-label={label} />
  ) : (
    <div data-scene={scene} aria-hidden="true" />
  );
}
