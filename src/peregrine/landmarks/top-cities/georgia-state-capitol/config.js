import { FOOTPRINTS } from './footprint.js';

// Dome anchor. Architectural +X faces southeast, +Z southwest.
// OSM straight wall bearing ~33.5 degrees; rotation baked into every vertex.
export const SPEC = {
  id: 'georgia-state-capitol', name: 'Georgia State Capitol', kind: 'building',
  ready: true,
  origin: [-84.38813, 33.74905],
  height: 72.34, padM: 65,
  frontageBearing: 303.5, rotationDeg: -33.5,
  terrainPad: {
    rings: [FOOTPRINTS[0]],
    refs: [[-84.38813,33.74905],[-84.38829,33.74923],[-84.3879,33.74926],[-84.38829,33.74878]],
    datum: 'median', featherM: 9,
  },
};

// `lamp` keeps the floodlit gold ribs readable in the runtime's unlit shading path.
export const PALETTES = {
  light: { stone: '#ded8c9', roof: '#89928f', light: '#354653', lamp: '#d8c27b', gold: '#b7a15d' },
  dark: { stone: '#a4aaa8', roof: '#485559', light: '#e5bf83', lamp: '#e3cf89', gold: '#c5af69' },
};

export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0 at the west approach. No altitude, DEM or latitude stretch is baked in; median terrain pad is placement metadata only.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'State visitor brochures give 237 ft 4 in (72.34 m), a 75 ft (22.86 m) dome and six west Corinthian columns. Brochures disagree on statue height (15 versus 22 ft); the original robed silhouette uses 15 ft plus pedestal. Envelope follows OSM, not the brochure maximum dimensions. Intermediate stage heights, bays, relief and roof profiles are photographic estimates.',
};
