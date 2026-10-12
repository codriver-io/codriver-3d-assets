// London Eye: complete 32-pod design, excluding temporary maintenance omissions.
export const SPEC = {
  id: 'london-eye', name: 'London Eye', kind: 'building', ready: true,
  origin: [-0.1196765, 51.5033416], height: 135, padM: 12,
  frontageBearing: 277.36, diameter: 120, hubHeight: 69,
  capsules: 32, capsuleRadius: 63.75, wheelBearing: 7.36,
  // Separate rigid tables avoid flattening the Thames below the suspended wheel.
  terrainPad: { datum: 'median', featherM: 3,
    rings: [[[-0.119164,51.503445],[-0.119055,51.503445],[-0.119055,51.503392],[-0.119164,51.503392]],
            [[-0.119206,51.503205],[-0.119097,51.503205],[-0.119097,51.503151],[-0.119206,51.503151]],
            [[-0.118636,51.503279],[-0.118547,51.503279],[-0.118547,51.503230],[-0.118636,51.503230]]],
    refs: [[-0.119110,51.503418],[-0.119151,51.503178],[-0.118590,51.503255]] },
};
export const WHEEL_ANGLE = (90 - SPEC.wheelBearing) * Math.PI / 180;
export const PALETTES = {
  light: { steel: '#e0e1db', cable: '#6d7477', glass: '#465961', concrete: '#aaa99d', deck: '#616966', light: '#e4ded0' },
  dark: { steel: '#8c979f', cable: '#586574', glass: '#263843', concrete: '#65717b', deck: '#384652', light: '#ce5972' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0 at South Bank foundation tables; no terrain, river level or Mercator stretch baked in.',
  attribution: 'Original procedural model for Codriver. Mapped placement and replacement outlines © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '135 m height and 32 pods sourced from operator/architect; 120 m rim from Wikipedia. Capsule shape, hub height, tube sizes and static capsule phase estimated from photographs. Complete 32-pod design shown; temporary maintenance omissions and sponsor graphics omitted. Rotation baked once from OSM outline controls. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
