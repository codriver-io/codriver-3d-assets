// California Academy of Sciences, 55 Music Concourse Drive, Golden Gate Park, San Francisco.
// Renzo Piano Building Workshop with Stantec (Chong Partners), opened 27 September 2008.
// Sourced: 2.5 acre (about 10,100 m2) living roof of seven hills planted with 1.7 million
// natives, 35 ft (10.7 m) roof height over grade (OSM height=11; modelled at 10.8 m), two 90 ft (27 m) spheres
// (Morrison Planetarium and the rainforest) under the two largest hills, a 22 x 30 m glazed
// piazza roof, a 3,500 sq ft railed terrace, round roof vents on the hills, a perimeter canopy
// of glass-glass photovoltaic laminate (60,000 cells) on slender steel columns. The mapped
// outline (OSM way 28695389) gives the 161 x 103 m plan and its orientation.
// Estimated: hill positions and profiles, the canopy depth, wall heights, facade glazing.
// See docs/3d-san-francisco-california-academy-of-sciences.md.
export const SPEC = {
  id: 'california-academy-of-sciences', name: 'California Academy of Sciences', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Area centroid of the mapped outline.
  origin: [-122.466091, 37.769828],
  height: 27.4, // crown of the rainforest glass dome over grade
  padM: 100,
  // Bearing (clockwise from north) the entrance faces: north-west, across the Music Concourse.
  frontageBearing: 318.1,
};
export const PALETTES = {
  light: {
    green: '#6f7638', glass: '#7391a0', glow: '#8aa5b0', pv: '#6f8aa8', white: '#e7e9e4',
    stone: '#c5b99f', sign: '#d8472b',
  },
  dark: {
    green: '#4b5230', glass: '#40606f', glow: '#ffd08a', pv: '#33465c', white: '#98a1a6',
    stone: '#7a7872', sign: '#ff6a4a',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the Music Concourse entrance level); no absolute altitude. The roof edge stands 10.8 m over it (published 35 ft = 10.7 m; OSM height 11).',
  attribution: 'Original procedural mesh. Mapped footprint (OSM way 28695389) © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Plan size and axes come from OpenStreetMap; the north-west entrance side (318 degrees) is chosen from photographs, not encoded by OSM; the 35 ft roof, 2.5 acre green roof, 27 m domes and 22 x 30 m piazza are published. The hill positions and profiles, the 11.9 m canopy depth, wall heights, glazing pattern, vent count and the terrace position are estimates from photographs.',
};
