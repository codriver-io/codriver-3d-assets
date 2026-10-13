// Present-day Ukrainian Baroque exterior and separate Sophia Square bell tower.
import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'saint-sophia-cathedral-kyiv', name: 'Saint Sophia Cathedral', kind: 'building',
  ready: true, origin: [30.5144, 50.4528], height: 76, padM: 1,
  frontageBearing: 59.5, yaw: 36 * Math.PI / 180,
  terrainPad: { rings: [FOOTPRINTS[0], FOOTPRINTS.find(r=>r.some(([x])=>x>30.515))], datum: 'median', featherM: 5,
    refs: [[30.5142,50.4529],[30.51527,50.45286]] },
};
export const PALETTES = {
  light: { stone: '#e8e5db', roof: '#477456', gold: '#c5a24c', blue: '#94b6bf', glass: '#30474e', brick: '#936247', base: '#666257' },
  dark: { stone: '#a4aaa9', roof: '#2e5144', gold: '#9c854b', blue: '#536f7d', glass: '#3d535c', brick: '#624c43', base: '#3e454b' },
};
export const MANIFEST = {
  elevationDatum: 'Local rigid flat grade y=0; cathedral and detached tower share an unsurveyed precinct datum. No DEM or absolute altitude baked in.',
  attribution: 'Original procedural geometry for Codriver. Mapped outlines © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '76 m bell tower from published description; cathedral central cross 32 m and secondary cross 25.5 m from OSM tags. Thirteen stylized domes, carvings and roofs photo-calibrated; two small peripheral caps estimated. Rotation baked once. Cityscape and Full 3D world not tested yet; integration checked separately.',
};
