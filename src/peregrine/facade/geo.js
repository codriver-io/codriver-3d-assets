// Coordinate primitives + the Mapbox value types app.js expects back from the
// facade. Kept deliberately small: app.js only ever reads .lng/.lat off a
// LngLat, the four getters off a LngLatBounds, and .x/.y/.dist() off a Point.

export const EARTH_R = 6378137;                    // three-tile's projection radius
export const MERC_WORLD = 2 * Math.PI * EARTH_R;   // 40 075 016.686 m

// Mercator metres per CSS pixel at a given Mapbox zoom.
//
// Mapbox defines zoom so the world is 512 CSS px wide at z0, and three-tile's
// world units are mercator metres, so the two relate by a single constant with
// NO cos(latitude) term: the latitude stretch is already baked into both
// sides. This is what lets ZOOM_TABLE, getZoomOffset() and
// DENSITY_ZOOM_OFFSET carry over from the Mapbox renderer untouched.
export const MERC_M_PER_PX_Z0 = MERC_WORLD / 512;  // 78 271.5170

export function mercMetresPerPixel(zoom) {
  return MERC_M_PER_PX_Z0 / Math.pow(2, zoom);
}

// Inverse: what zoom puts `mpp` mercator metres in a CSS pixel.
export function zoomForMercMetresPerPixel(mpp) {
  return Math.log2(MERC_M_PER_PX_Z0 / mpp);
}

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const MAX_LAT = 85.051129;

export function lngToMercX(lng) { return EARTH_R * lng * D2R; }
export function latToMercY(lat) {
  const c = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat));
  return EARTH_R * Math.log(Math.tan(Math.PI / 4 + (c * D2R) / 2));
}
export function mercXToLng(x) { return (x / EARTH_R) * R2D; }
export function mercYToLat(y) {
  return (2 * Math.atan(Math.exp(y / EARTH_R)) - Math.PI / 2) * R2D;
}

// Real ground metres per mercator metre at a latitude. Mercator stretches by
// 1/cos(lat), so anything authored in true metres (a building height, a model)
// must be multiplied by 1/cos(lat) to sit correctly in this world.
export function mercStretch(lat) {
  const c = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat));
  return 1 / Math.cos(c * D2R);
}

// ---- slippy-map tile helpers ------------------------------------------------
//
// These lived as private copies in buildings.js, trees.js and traffic.js:
// three identical implementations of the same six lines, about to become five
// as the ground and road layers arrive. They belong next to the projection
// they are derived from.

/** Fractional tile x/y for a position, floored to the containing tile. */
export function lngLatToTile(lng, lat, z) {
  const n = Math.pow(2, z);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latR = (Math.max(-MAX_LAT, Math.min(MAX_LAT, lat)) * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latR) + 1 / Math.cos(latR)) / Math.PI) / 2) * n);
  return [x, y];
}

/** [lng, lat] of a tile's north-west corner. Geometry is emitted relative to it. */
export function tileNorthWest(x, y, z) {
  const n = Math.pow(2, z);
  const lng = (x / n) * 360 - 180;
  const latR = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
  return [lng, (latR * 180) / Math.PI];
}

/** Width of one tile at zoom `z`, in mercator metres. */
export function tileSizeMetres(z) { return MERC_WORLD / Math.pow(2, z); }

export class LngLat {
  constructor(lng, lat) { this.lng = lng; this.lat = lat; }
  toArray() { return [this.lng, this.lat]; }
  wrap() { return new LngLat(((this.lng + 180) % 360 + 360) % 360 - 180, this.lat); }
  static convert(v) {
    if (v instanceof LngLat) return v;
    if (Array.isArray(v)) return new LngLat(v[0], v[1]);
    if (v && typeof v === 'object') return new LngLat(v.lng ?? v.lon, v.lat);
    return null;
  }
}

export class LngLatBounds {
  constructor(sw, ne) { this._sw = LngLat.convert(sw); this._ne = LngLat.convert(ne); }
  getWest()  { return this._sw.lng; }
  getSouth() { return this._sw.lat; }
  getEast()  { return this._ne.lng; }
  getNorth() { return this._ne.lat; }
  getSouthWest() { return this._sw; }
  getNorthEast() { return this._ne; }
  getCenter() { return new LngLat((this._sw.lng + this._ne.lng) / 2, (this._sw.lat + this._ne.lat) / 2); }
  toArray() { return [this._sw.toArray(), this._ne.toArray()]; }
  static convert(v) {
    if (v instanceof LngLatBounds) return v;
    // [[w,s],[e,n]] or [w,s,e,n]
    if (Array.isArray(v) && v.length === 2) return new LngLatBounds(v[0], v[1]);
    if (Array.isArray(v) && v.length === 4) return new LngLatBounds([v[0], v[1]], [v[2], v[3]]);
    return null;
  }
}

// app.js:2236 does `touchStartPoint.dist(e.point) > 8`, so dist() is contract.
export class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  dist(p) { const dx = this.x - p.x, dy = this.y - p.y; return Math.sqrt(dx * dx + dy * dy); }
  sub(p) { return new Point(this.x - p.x, this.y - p.y); }
  mag() { return Math.sqrt(this.x * this.x + this.y * this.y); }
}

// Shortest signed angular difference a -> b, in degrees, in (-180, 180].
// Same helper (and same reason) as nav/src/geo.js: without it a bearing ease
// from 359 to 1 spins the long way round.
export function angleDelta(a, b) {
  let d = (b - a) % 360;
  if (d > 180) d -= 360;
  if (d <= -180) d += 360;
  return d;
}

export function wrapDeg(d) { return ((d % 360) + 360) % 360; }
