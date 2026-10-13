export const SPEC = {
  id: 'jackson-street-bridge-atlanta', name: 'Jackson Street Bridge', kind: 'bridge', ready: true,
  origin: [-84.37431035,33.7601681], height: 14.7, padM: 135, frontageBearing: 179,
  rangeM: 3200, nearM: 1500,
};
export const PALETTES = {
  light: { concrete: '#bdbdb4', fascia: '#a6aaa3', asphalt: '#555d63', rail: '#acb4b2', yellow: '#ccad52', paint: '#dddcd1', lamp: '#e9e0bd' },
  dark: { concrete: '#69747c', fascia: '#535f68', asphalt: '#303c47', rail: '#84929b', yellow: '#91885d', paint: '#afb8bc', lamp: '#d5bb80' },
};
export const MANIFEST = {
 elevationDatum: 'Local flat grade y=0; 6 m Cityscape span clearance is estimated. World deck independently interpolates sampled abutment datums, with supports meeting local DEM.',
 attribution: 'Original procedural geometry; alignment and outline © OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright',
 note: 'Atlanta concrete overpass over Freedom Parkway, not the Newark swing bridge. OSM span/width measured; rail, girders, lights and clearance estimated. Pre-reconfiguration two-lane layout; 2025/26 parklet work not asserted complete.',
};
