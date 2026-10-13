import { FOOTPRINTS } from './footprint.js';
// The 2011 stadium in La Sabana, not the demolished 1924 ground.
export const SPEC = {
  id: 'estadio-nacional-costa-rica', name: 'Estadio Nacional de Costa Rica', kind: 'building',
  ready: true, origin: [-84.10772, 9.93675], height: 52.6, padM: 165,
  frontageBearing: 180, bowlWidth: 214, bowlLength: 268,
  terrainPad: { rings: [FOOTPRINTS[0]], refs: [[-84.10772, 9.93675], [-84.10852, 9.93675], [-84.10683, 9.93675], [-84.10772, 9.93789], [-84.10772, 9.93558]], datum: 'median', featherM: 14 },
};
export const PALETTES = {
  light: { concrete: '#c4c1b5', white: '#e4e4da', steel: '#afb8b8', glass: '#435458', red: '#a84b50', blue: '#507395', grass: '#658564', track: '#ab725d' },
  dark: { concrete: '#62727c', white: '#a0b4bf', steel: '#7c99ab', glass: '#223844', red: '#603e4d', blue: '#36596d', grass: '#334e49', track: '#635355' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 at La Sabana stadium grade; rigid model, no altitude, DEM or Mercator stretch baked in.',
  attribution: 'Original procedural geometry for Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '2011 open stadium: twin crescent canopies, white louvred oval envelope and exposed steel arch trusses. 52.6 m crest from OSM roof tags. Roof plans and entrance/arch-foot rings from OSM; roof curvature, bowl tiers, cladding rhythm and structural diameters are photo estimates. Geographic roof plans are baked directly in east/up/south; no second host rotation. Cityscape and Full 3D world not tested yet; integration is checked separately.',
};
