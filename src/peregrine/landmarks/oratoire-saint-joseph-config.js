import site from './oratoire-saint-joseph-site.js';
import { lngToMercX, latToMercY, mercStretch, mercXToLng, mercYToLat } from '../facade/geo.js';

export const ORATOIRE = {
  id: 'oratoire-saint-joseph', name: 'Oratoire Saint-Joseph', origin: site.origin,
  length: 105, width: 65, domeDiameter: 39, floor: 24, heightAboveFloor: 97,
  // Rotation from the mapped central stair axis, front bearing 304.7 degrees.
  rotation: 55.3 * Math.PI / 180,
};
export const ORATOIRE_PALETTES = {
  light: { stone: '#c1bbae', trim: '#d9d1bf', copper: '#678e7d', rib: '#405e57', glass: '#394c50', earth: '#737864', wood: '#8a5a47' },
  dark: { stone: '#7b8993', trim: '#a7b2b6', copper: '#477c73', rib: '#304c4c', glass: '#b0a07b', earth: '#424f49', wood: '#664c44' },
};
export const ORATOIRE_STRETCH = mercStretch(ORATOIRE.origin[1]);
export const ORATOIRE_MERC = [lngToMercX(ORATOIRE.origin[0]), -latToMercY(ORATOIRE.origin[1])];
const c = Math.cos(ORATOIRE.rotation), s = Math.sin(ORATOIRE.rotation);
export const oratoirePoint = (u, y, v) => [c * u + s * v, y, -s * u + c * v];
export function oratoireLocal(lng, lat) {
  const x = (lngToMercX(lng) - ORATOIRE_MERC[0]) / ORATOIRE_STRETCH;
  const z = (-latToMercY(lat) - ORATOIRE_MERC[1]) / ORATOIRE_STRETCH;
  return [c * x - s * z, s * x + c * z];
}
export const ORATOIRE_FOOTPRINT = site.ways.find(w => w.id === 235293860).points.map(p => oratoireLocal(...p));
// Only the mapped basilica/crypt footprint, never the terraces or a site-wide box.
// Small boundary tolerance accommodates provider quantisation; all face vertices
// must pass. Shared road-mask state composes with the other Montreal landmarks.
export function oratoireOwns(u, v, tolerance = 1.2) {
  let hit = false;
  for (let i = 0, j = ORATOIRE_FOOTPRINT.length - 1; i < ORATOIRE_FOOTPRINT.length; j = i++) {
    const [ax, az] = ORATOIRE_FOOTPRINT[j], [bx, bz] = ORATOIRE_FOOTPRINT[i];
    const dx = bx - ax, dz = bz - az, len = dx * dx + dz * dz;
    const t = len ? Math.max(0, Math.min(1, ((u - ax) * dx + (v - az) * dz) / len)) : 0;
    if (Math.hypot(u - ax - dx * t, v - az - dz * t) <= tolerance) return true;
    if ((az > v) !== (bz > v) && u < dx * (v - az) / (bz - az) + ax) hit = !hit;
  }
  return hit;
}

// Only Full 3D world uses these bounded site levels; Cityscape keeps authored grade.
const siteRing = (u0, u1, v0, v1) => [[u0,v0],[u1,v0],[u1,v1],[u0,v1]].map(([u,v]) => {
  const [x,,z] = oratoirePoint(u,0,v);
  return [mercXToLng(ORATOIRE_MERC[0] + x * ORATOIRE_STRETCH), mercYToLat(-ORATOIRE_MERC[1] - z * ORATOIRE_STRETCH)];
});
ORATOIRE.terrainPad = {
  rings: [siteRing(-19,25,-202,-188)],
  refs: siteRing(-4,10,-199,-193), datum: 'median', featherM: 12,
  // TIN cells span ~27 real metres here. Each grade starts uphill of the
  // matching stair's low end, and the wider rings hold every adjacent node
  // below the rigid treads. The authored stone landings define the exact
  // walking datums; the ground grades deliberately trail them underneath.
  terraces: [
    { ring: siteRing(-49,55,-220,-177), offsetM: -0.6, featherM: 12 },
    { ring: siteRing(-49,55,-177,-143), offsetM: 1.4, featherM: 12 },
    { ring: siteRing(-49,55,-143,-122), offsetM: 3.4, featherM: 12 },
    { ring: siteRing(-49,55,-122,-110), offsetM: 5.9, featherM: 12 },
    { ring: siteRing(-55,59,-110,-98), offsetM: 7.4, featherM: 12 },
    { ring: siteRing(-47,53,-98,-72), offsetM: 14.4, featherM: 12 },
    { ring: siteRing(-50,56,-72,-25), offsetM: 19.2, featherM: 18 },
    { ring: site.ways.find(w => w.id === 235293860).points.filter(p => oratoireLocal(...p)[1] > -25), offsetM: 24, featherM: 26 },
  ],
};
