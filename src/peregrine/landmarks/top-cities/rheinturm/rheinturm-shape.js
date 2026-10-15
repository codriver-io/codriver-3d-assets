// Rheinturm, Düsseldorf: the dimensions and profiles the mesh, the tests and the doc all read.
// Real metres, +X east, +Y up (0 = flat-map grade), +Z south, about the tower axis (config.js
// SPEC.origin, the centroid of OSM way 161648930). A point at compass bearing b (deg, clockwise
// from north), radius r is (r sin b, y, -r cos b).
//
// Provenance: S published (Wikipedia / the Lichtzeitpegel article), M mapped (OSM building parts),
// E estimated from the dossier photographs. See docs/3d-top-cities-rheinturm.md.

export const TIP = 240.5;       // S: mast tip since the 2004 DVB-T aerial (234.2 m before it)
export const DECK = 168;        // S: observation deck
export const PUBLIC = 172.5;    // S: Wikipedia's figure for the public tower, under the technical brim

// The shaft is a round concrete tube. OSM's foot ring (way 161648952) is an irregular ~22 m
// polygon whose inscribed radius about the axis is 9.35 m, so the foot stays inside it.
// The neck is held to the 140–160 m part (inscribed 6.92 m). The flare is concave (E):
// photographs show most of the slimness reached by mid-height.
export const SHAFT = {
  rFoot: 9.12,   // M: inside the 9.35 m inscribed foot ring
  rNeck: 6.82,   // M: inside the 6.92 m inscribed ring of the shaft under the pod
  hNeck: 152,    // E: where the inverted cone takes over
  exponent: 1.7, // E
};
export const shaftRadius = (h) => {
  const t = Math.min(1, Math.max(0, h / SHAFT.hNeck));
  return SHAFT.rNeck + (SHAFT.rFoot - SHAFT.rNeck) * Math.pow(1 - t, SHAFT.exponent);
};

// Plinth, a few centimetres proud of the shaft and still inside the foot ring (M/E).
export const PLINTH = { extra: 0.16, h: 1.7, join: 2.6 };

// Inverted-cone underside of the pod, then the two glazed storeys, then the roof brim.
// The brim is the widest part and stays inside way 161648930 (inscribed 17.68 m). E, with
// the 168 m deck and the 172.5 m public line fixed on the published figures.
export const POD = {
  trumpet: [[6.82, 152], [7.6, 156], [9.1, 159.2], [11.2, 162], [13.6, 164.2], [15.6, 165.6], [16.55, 166.15]],
  // Lower storey: revolving restaurant. Upper: observation, the 168 m deck between them.
  restaurant: [[16.35, 166.05], [16.85, 168.05]],
  band: [[17.05, 168.12], [17.05, 168.95]], // proud floor line at the published deck
  observation: [[16.7, 169.05], [16.15, 172.45]],
  shoulder: [[15.95, 172.5], [14.7, 174.3], [13.9, 175.3]], // 172.5 is the public concrete line
  // Roof brim. OSM draws this disc at 174.5–179.4 m, mean radius ~19 m; the inscribed
  // radius is 17.68, so the modelled brim is 17.25 (E, inside the ring).
  brim: [[13.9, 175.45], [17.25, 175.95], [17.25, 177.2], [16.55, 177.6], [5.2, 178.55], [3.2, 179.3]],
  floors: [166.45, 168.55], // E: restaurant floor and observation floor, meeting the concrete
  groove: 0.18,            // E: vertical panel joints on the cone (photographs from below)
};

// Stepped aerial mast above the brim (E from photographs; the tip height is published).
// White shaft, a small equipment saucer, a narrower white stage, an orange-red top
// third, a white band and a red beacon.
export const MAST = {
  neck: [[3.2, 179.3], [2.35, 183.5], [2.15, 186.2]],
  platform: [[2.15, 186.2], [6.15, 186.75], [6.15, 187.85], [1.85, 188.35]],
  lower: [[1.62, 188.35], [1.45, 208]],
  step: [[1.45, 208], [1.78, 208.45], [1.78, 209.7], [1.15, 210.2]],
  mid: [[1.15, 210.2], [0.98, 222.5]],
  red: [[0.98, 222.5], [0.82, 233.4]],
  tip: [[0.62, 233.4], [0.4, 238.4]],
  beacon: [[0.55, 238.4], [0.62, 239.3], [0.28, 240.15], [0.02, TIP]],
  // Four red obstruction lamps on the saucer rim (E, night photographs).
  rimLamps: { r: 5.85, y: 188.15, radius: 0.38, bearings: [40, 130, 220, 310] },
};

// Lichtzeitpegel (Horst H. Baumann, 1981): 62 portholes in ONE vertical column on the
// Rhine side, 2.5 m apart (S). Numbered from the bottom, as on de.wikipedia.org/wiki/Lichtzeitpegel.
// Lamps 27–28 and 44–45 are the red aviation lights at about 80 m and 120 m; the column
// is placed so lamp 44/45 centres on 120 m (y = 11.25 + (n-1)*2.5 → n=44.5 at 120.0).
// The sculpture shows 16:56:39, the time in the reference photograph: each digit is the
// count of lit lamps in that group, lit from the top of the group.
export const CLOCK = {
  bearing: 270, // the Rhine is west of the tower
  y0: 11.25,
  step: 2.5,
  count: 62,
  radius: 0.4,
  gap: 0.12,   // inner face stays this far proud of the concrete
  depth: 0.16,
};
export const lampY = (n) => CLOCK.y0 + (n - 1) * CLOCK.step;

export const SHOW = { h: 16, m: 56, s: 39 };

function litFromTop(n, lo, hi, digit) {
  return digit > 0 && n > hi - digit && n >= lo && n <= hi;
}

/** 'glow' (white time lamp), 'light' (red aviation lamp) or 'dark' (unlit porthole). */
export function lampMaterial(n) {
  if (n === 27 || n === 28 || n === 44 || n === 45) return 'light';
  const hT = Math.floor(SHOW.h / 10), hU = SHOW.h % 10;
  const mT = Math.floor(SHOW.m / 10), mU = SHOW.m % 10;
  const sT = Math.floor(SHOW.s / 10), sU = SHOW.s % 10;
  if (litFromTop(n, 56, 57, hT)) return 'glow';
  if (litFromTop(n, 46, 54, hU)) return 'glow';
  if (litFromTop(n, 39, 43, mT)) return 'glow';
  if (litFromTop(n, 29, 37, mU)) return 'glow';
  if (litFromTop(n, 22, 26, sT)) return 'glow';
  if (litFromTop(n, 12, 20, sU)) return 'glow';
  return 'dark';
}

// Concrete skin the portholes mount on (plinth, shaft, then the cone).
export function skinRadius(y) {
  if (y <= PLINTH.h) return shaftRadius(PLINTH.join) + PLINTH.extra;
  if (y <= SHAFT.hNeck) return shaftRadius(y);
  const t = POD.trumpet;
  if (y <= t[0][1]) return t[0][0];
  if (y >= t[t.length - 1][1]) return t[t.length - 1][0];
  for (let i = 0; i < t.length - 1; i++) {
    const [r0, h0] = t[i], [r1, h1] = t[i + 1];
    if (y <= h1) return r0 + (r1 - r0) * (y - h0) / (h1 - h0);
  }
  return t[t.length - 1][0];
}

// Horizontal pour joints, sat in the 1.5 m gaps between portholes (E).
export const JOINTS = [22.5, 47.5, 72.5, 97.5, 122.5, 142.5];

// East door, toward the Landtag plaza (E). Kept inside the foot ring.
export const DOOR = { bearing: 90, width: 2.5, height: 3.15, sill: 0.15, thick: 0.14, proud: 0.1 };
