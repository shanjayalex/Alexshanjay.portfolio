// Mutable, non-reactive store for overall page scroll progress (0..1).
// Read inside R3F useFrame loops — deliberately NOT React state, so the
// persistent 3D world can react to every scroll tick without re-rendering.
export const scrollState = {
  progress: 0,
};
