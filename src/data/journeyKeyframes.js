// Target 3D-world state at each section of the page. The persistent world
// lerps between these as the visitor scrolls, using measured section
// boundaries (see useSectionOffsets) as the timeline.
export const journeyStates = {
  top: { position: [0, 0.25, 0], scale: 0.48, emissive: 0.28, light: 1.0, sparkle: 0.55 },
  about: { position: [2.1, -0.4, -1.5], scale: 0.32, emissive: 0.12, light: 0.4, sparkle: 0.25 },
  services: { position: [-2.1, 0.55, -1.5], scale: 0.3, emissive: 0.1, light: 0.35, sparkle: 0.2 },
  showreel: { position: [0, 0.15, -0.8], scale: 0.45, emissive: 0.22, light: 0.7, sparkle: 0.45 },
  work: { position: [2.2, 0.65, -1.5], scale: 0.28, emissive: 0.1, light: 0.3, sparkle: 0.2 },
  experience: { position: [-2.1, -0.55, -1.5], scale: 0.26, emissive: 0.08, light: 0.28, sparkle: 0.15 },
  contact: { position: [0, 0, 0], scale: 0.55, emissive: 0.26, light: 0.95, sparkle: 0.6 },
};
