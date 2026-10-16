// Permanent exterior, without temporary restoration works.
import { FOOTPRINTS } from './footprint.js';
const flamePad=Array.from({length:12},(_,i)=>{
  const a=i*Math.PI/6;
  return [-75.69870183+Math.sin(a)*5/(111319.49079327358*Math.cos(45.423728125*Math.PI/180)),45.423728125+Math.cos(a)*5/111319.49079327358];
});
export const SPEC = {
  id: 'parliament-hill-centre-block', name: 'Parliament Hill Centre Block & Peace Tower', kind: 'building',
  ready: true, origin: [-75.699635021875, 45.42479299375], height: 92.2, padM: 140,
  frontageBearing: 149.0967933347,
  // Bounded plateau and fountain pads avoid sampling the river escarpment with a disc.
  // References are the front wing footings and entrance, pending DEM/app verification.
  terrainPad: { rings:[...FOOTPRINTS,flamePad], refs:[[-75.70034655,45.42457784],[-75.69960873,45.42476216],[-75.69902867,45.42513148]], datum:'median', featherM:8 },
};
export const PALETTES = {
  light: { stone:'#a49a80', trim:'#c4b99f', foundation:'#77776c', copper:'#476b5e', slate:'#575650', glass:'#344346', light:'#cfd2bf', red:'#a82b29' },
  dark: { stone:'#514f46', trim:'#7c7767', foundation:'#353d3c', copper:'#365b53', slate:'#343b3b', glass:'#756847', light:'#f4dca0', red:'#7f302a' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local grade y=0; bounded mapped-building and 5 m fountain pads, median of three front-footing references, 8 m feather. No absolute altitude, DEM height or Mercator stretch baked in; terrain integration not tested.',
  attribution: 'Original procedural mesh, Codriver 2026. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Permanent Centre Block exterior and Library, excluding temporary restoration works. Official Peace Tower height 92.2 m; OSM building parts, estimated window cadence, carvings and roof profiles. Rotation baked once. Both placement modes not tested yet, integration is checked separately.',
};
