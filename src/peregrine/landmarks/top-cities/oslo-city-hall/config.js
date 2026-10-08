// Oslo City Hall (Oslo rådhus), Rådhusplassen 1. Arnstein Arneberg and Magnus
// Poulsson, inaugurated 15 May 1950. See docs/3d-top-cities-oslo-city-hall.md.
import { BEARING_V } from './oslo-city-hall-plan.js';

export const SPEC = {
  id: 'oslo-city-hall', name: 'Oslo City Hall', kind: 'building',
  ready: true,
  origin: [10.73358, 59.91176], // Wikipedia / OSM name node, 59°54′42.35″N 10°44′0.90″E
  height: 66, // east tower, Oslo Byleksikon and Wikipedia
  padM: 120,
  frontageBearing: BEARING_V + 180, // harbour facade looks toward the fjord, ~204.9°
};
export const PALETTES = {
  light: {
    brick: '#5a2e26', stone: '#c8c2b6', copper: '#4d7362', glass: '#2b323b',
    glow: '#f3ead6', brass: '#a68642',
  },
  dark: {
    brick: '#3e241e', stone: '#8d8980', copper: '#3a5648', glass: '#14181e',
    glow: '#ffe6ac', brass: '#e2be6e',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude. Rådhusplassen and the north courtyard are taken as one level.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'East tower 66 m, west tower 63 m, the 8.6 m south clock and the 5 m astronomical clock are sourced. The harbour block is a 27 m brick parapet with a flat roof set behind it; the loggia bands and the storey grid are estimated from photographs. OSM tags a 0.3 m gable on the wing and calls the west tower about 20 levels.',
};
