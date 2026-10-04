// Rijksmuseum, Museumstraat 1. Building axes, metres: +u along the north facade from
// the west tower toward the east tower, +v toward Museumplein (south), +y up.
// The two north-tower centroids (OSM ways 749429998 and 749429999) are 30.84 m
// apart on a bearing of 129.32°, so the Stadhouderskade facade faces 39.32°.
// Rotation is baked here; the layer does not rotate the model again.
//
// +u/+v are orthonormal in east/up/south (the same mercator metres shot.mjs uses).

export const ORIGIN = [4.8851455, 52.3600098];

// Unit axes in (east, south). det = 1, so a CCW loop in (u, v) stays CCW in (x, z).
const UX = 0.773607, UZ = 0.633665, VX = -0.633665, VZ = 0.773607;

export const FRONTAGE_BEARING = 39.32;

/** Building (u, y, v) → model metres (east, up, south) about the footprint centroid. */
export function toWorld(u, y, v) {
  return [u * UX + v * VX, y, u * UZ + v * VZ];
}

/** Inverse of the horizontal part of toWorld. */
export function uvOf(x, z) {
  return [x * UX + z * UZ, x * VX + z * VZ];
}

// 3DBAG (tagged on the tower parts, 2025) measures 54 m to the top. The 1885
// delivery figure is 52.90 m (nl.wikipedia.org/wiki/Rijksmuseumgebouw). The vane
// is inside the 54 m, not above it. Gallery ridges are the tagged 27 m
// (roof:height 8 on a 27 m part → wall 19). Corner pavilions 38, south turrets 43.
export const H = {
  tower: 54,
  towerWall: 34, // 54 − pyramidal roof:height 20
  corner: 38,
  cornerWall: 26, // 38 − roof:height 12
  turret: 43,
  turretWall: 31, // 43 − roof:height 12
  gallery: 27,
  wall: 19,
  bay: 32, // north link between the towers, and the south central part
  bayWall: 24,
  // Opening is half the bay between the towers (~20 m). Crown = spring + radius.
  spring: 1.15,
  crown: 6.25,
  plinth: 4.15,
  court: 17.2, // 2013 atrium glass, below the slate ridges
};

// Passage axis is the midpoint of the gap between the north towers.
// The central bay runs about u −3.95 to 16.25. The opening is half of that.
export const ARCH = {
  u0: 1.10,
  u1: 11.30, // width 10.20, radius 5.10, crown = 1.15 + 5.10
  mid: 6.20,
  north: -42.55, // outer face of the Stadhouderskade portal
  south: 26.95, // outer face of the Museumplein portal
};

export const TOWER = {
  // Fronts sit just behind the archivolt. The mapped tower parts reach about
  // a metre further north; that sliver would mask the arch from the street.
  west: { u0: -14.7, u1: -3.9, v0: -42.35, v1: -32.45 },
  east: { u0: 16.22, u1: 26.92, v0: -42.35, v1: -32.32 },
};
