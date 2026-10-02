// Scotiabank Saddledome, 555 Saddledome Rise SE, Stampede Park, Calgary, Alberta.
// Home of the Calgary Flames (NHL); opened 15 October 1983 as the Olympic Saddledome (1988 Winter Olympics ice
// hockey and figure skating); architects Graham McCourt Architects, structure Jan Bobrowski and Partners.
// Sourced: the 1983 saddle roof, a hyperbolic paraboloid whose edge ring lies on a 67.7 m radius sphere (about
// 135 m across, 122 m clear span), its centre 14 m below the higher and 6 m above the lower point of the edge
// ring, sixteen precast edge-ring elements 4.3 m wide, a 0.5-0.6 m thick shell; the venue's 89 ft (27.1 m)
// "maximum building height"; the mapped plan (OSM way 4397328: a 70.0 m radius circle plus the south-west
// entrance bulge). Estimated: every absolute height (the 27.1 m roof centre reads the 89 ft figure as the shell's
// middle, which puts the edge at 41.0 m high and 21.1 m low), the facade bands, piers, towers, colours.
// See docs/3d-calgary-scotiabank-saddledome.md.
export const SPEC = {
  id: 'scotiabank-saddledome', name: 'Scotiabank Saddledome', kind: 'building',
  ready: true, // true only once near/far GLBs are exported, verified and catalogued
  // Centre of the mapped arena circle (least-squares fit of the OSM way 4397328 main arc).
  origin: [-114.0519639, 51.0373999],
  height: 41, padM: 85,
  // Bearing of the centre of the south-east low side of the roof: the side with the "Scotiabank Saddledome"
  // lettering and the roof loop, facing Stampede Park. The roof is high toward the north-east and south-west
  // ends (bearings 61 and 241) and dips toward the south-east and north-west (151 and 331).
  frontageBearing: 151,
};
export const PALETTES = {
  light: {
    roof: '#dfe2de', seam: '#bbc0bb', glow: '#cf5a30', concrete: '#aaa79e', pier: '#c1bfb6', dark: '#4b5159',
    light: '#566670', red: '#c4503d', yellow: '#dcae17', sign: '#cc2b22',
  },
  dark: {
    roof: '#929ba3', seam: '#7a838c', glow: '#ff7a3d', concrete: '#5c6168', pier: '#70757b', dark: '#262c33',
    light: '#f0b565', red: '#7e3a33', yellow: '#7d6620', sign: '#ff5648',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap (the Stampede Park plaza round the arena); no absolute altitude. The roof centre is placed at 27.1 m (the venue\'s 89 ft maximum building height) over this grade.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'The plan (a 70 m circle plus the south-west entrance bulge) comes from OpenStreetMap; the saddle geometry (67.7 m edge-ring sphere, 14 m and 6 m centre offsets, 4.3 m ring) is published. The absolute heights (edge 41 m high and 21 m low), the high-axis bearing (61/241 degrees, read from the mapped bulge and five photographs), the facade bands and piers, the end towers (the yellow stair towers climb to the underside of the roof ring), the north-east end, the roof loop, the eight thin seam strips on the roof (stand-ins for the panel joints of the roof, along its two principal directions) and the lettering are estimates from photographs. The BMO Centre, the parkade and the Stampede grounds are separate buildings and are not modelled.',
};
