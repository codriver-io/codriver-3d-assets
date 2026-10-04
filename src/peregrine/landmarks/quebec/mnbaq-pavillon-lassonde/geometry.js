import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { F, B, PLAN, Y } from './mnbaq-pavillon-lassonde-site.js';
import { Soup, Face } from './mnbaq-pavillon-lassonde-mesh.js';

const { nwEnd, hall, v1Start, v3End, v2End, seEnd, sw, wall, v3Width, v2Ne, v1Ne, conA } = PLAN;

// The stair's hung glazed prism: from its low end on the south-east (a = 67.35, the mapped jog in the plan) it climbs from the plaza (0.4 m) 17 m, at
// about 34 degrees, to the south-east end of the top box (a = 42.5), as the diagonal glass tube does in the photographs; 4.4 m tall, 5.0 m wide
// (0.3 m of it outside the mapped south-west line, within the layer's 0.8 m tolerance once the frames are added, and 0.2 m buried in the middle volume's wall so the two never share a plane).
const STAIR = { aLow: v2End, aHigh: v3End, yLow: 0.4, rise: 17.0, h: 4.4, depth: 4.7, out: 0.3 };
const stairBottom = (a) => STAIR.yLow + STAIR.rise * (STAIR.aLow - a) / (STAIR.aLow - STAIR.aHigh);

/**
 * Pavillon Pierre-Lassonde in metres (+X east, +Y up, +Z south, origin = centroid of the OSM outline, rotation baked: the long axis runs
 * 139.3 degrees). Authoring only (exporter, inspector, tests). Three stacked glass volumes, each smaller than the one that carries it and shifted
 * toward Grande Allée: the 50 x 54 m first volume (ground-floor glazing and a pale translucent band, a terrace roof), the 46 x 36 m second volume
 * and, above the street end, the 42.5 x 25 m top box in diffuser glass with its truss, cantilevered 21 m over the entrance plaza above a 12.5 m
 * glazed hall; the glazed stair hung on the south-west side; terraced green roofs; the gold lantern on the top box. far keeps the same
 * silhouette and negative space (cantilever, recessed ground floor, stair, terraces) with plain walls and no mullions or trusses.
 */
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const soups = new Map();
  const s = (mat) => { if (!soups.has(mat)) soups.set(mat, new Soup()); return soups.get(mat); };
  const face = (p, q, n) => new Face(F, p, q, n);
  const dB = (k) => [-B[0] * k, 0, -B[1] * k]; // k metres toward the south-west (outward from the stair's south-west face)

  // Vertical bands on a wall: [y0, y1, material]. `light` is the lit interior seen through the clear glass: the same dark glass by day, warm at night.
  const CON = near ? 'concrete' : 'frit'; // far folds the concrete into the pale frit to stay at seven draws
  function skin(f, t0, t1, list, { post = 0, y0 = null, y1 = null, rails = [] } = {}) {
    const bands = list;
    for (const [ya, yb, m] of bands) s(m).panel(f, t0, t1, ya, yb);
    if (!near) return;
    const lo = y0 ?? bands[0][0], hi = y1 ?? bands[bands.length - 1][1];
    if (post) {
      const n = Math.max(1, Math.round((t1 - t0) / post));
      for (let k = 0; k <= n; k++) s('steel').mullion(f, t0 + (t1 - t0) * k / n, lo, hi, 0.14, 0.1);
    }
    for (const y of rails) s('steel').rail(f, t0, t1, y, 0.22, 0.1);
  }

  // Bands of the exposed walls. Ground floor 0-5 clear glass; first volume 5-8.5 pale translucent panels; the second volume's glow strip.
  const HALL = [[0, 1.0, 'glass'], [1.0, 5.0, 'light'], [5.0, 5.9, 'glass'], [5.9, 10.6, 'light'], [10.6, 12.4, 'glass'], [12.4, Y.v2, 'frit']];
  const GLAZED = [[0, 0.9, 'glass'], [0.9, 4.5, 'light'], [4.5, Y.podium, 'glass']];
  const PODIUM = [...GLAZED, [Y.podium, Y.v1, 'frit']];
  const V2UP = [[Y.v1, 9.6, 'frit'], [9.6, 12.0, 'glow'], [12.0, Y.v2, 'frit']];
  const V2FULL = [...GLAZED, [Y.podium, 9.6, 'frit'], [9.6, 12.0, 'glow'], [12.0, Y.v2, 'frit']];

  // ---------------------------------------------------------------- the ground-to-roof walls of the first and second volumes
  const hallSW = face([hall, wall], [v1Start, wall], [0, -1]);
  skin(hallSW, 0, hallSW.len, HALL, { post: 2.5 });
  const sw2 = face([v1Start, wall], [v2End, wall], [0, -1]);
  skin(sw2, 0, sw2.len, V2FULL, { post: 3.2, rails: [Y.podium] });
  const sw3 = face([v2End, wall], [seEnd, wall], [0, -1]);
  skin(sw3, 0, sw3.len, PODIUM, { post: 3.1, rails: [Y.podium] });
  const seWall = face([seEnd, wall], [seEnd, v1Ne], [1, 0]);
  skin(seWall, 0, seWall.len, PODIUM, { post: 3.1, rails: [Y.podium] });
  const neWall = face([v1Start, v1Ne], [seEnd, v1Ne], [0, 1]);
  skin(neWall, 0, neWall.len, PODIUM, { post: 3.1, rails: [Y.podium] });
  const nwWall1 = face([v1Start, v2Ne], [v1Start, v1Ne], [-1, 0]);
  skin(nwWall1, 0, nwWall1.len, PODIUM, { post: 3.1, rails: [Y.podium] });
  const hallNE = face([conA, v2Ne], [v1Start, v2Ne], [0, 1]);
  skin(hallNE, 0, hallNE.len, V2FULL, { post: 3.3, rails: [Y.podium] });
  const v2NE = face([v1Start, v2Ne], [v2End, v2Ne], [0, 1]);
  skin(v2NE, 0, v2NE.len, V2UP, { post: 3.3 });
  const v2SE = face([v2End, wall], [v2End, v2Ne], [1, 0]);
  skin(v2SE, 0, v2SE.len, V2UP, { post: 3.3 });

  // The street end of the lower block: the glazed Grand Hall (26.5 m x 12.5 m in the source, 20.8 m of glass on the mapped line), and
  // the white concrete wall beside it, which stands 0.3 m inside the presbytery's mapped wall.
  const hallNW = face([hall, wall], [hall, v3Width], [-1, 0]);
  skin(hallNW, 0, hallNW.len, HALL, { post: 2.6 });
  const conWall = face([conA, v3Width], [conA, v2Ne], [-1, 0]);
  s(CON).panel(conWall, 0, conWall.len, 0, Y.v2);
  const conStep = face([hall, v3Width], [conA, v3Width], [0, 1]);
  s(CON).panel(conStep, 0, conStep.len, 0, Y.v2);

  // ---------------------------------------------------------------- the top box, cantilevered over the plaza
  // Diffuser glass fields between frit spandrels, vertical joints, and the truss: full-height braces that alternate direction by bay.
  const y3 = Y.v2, y3t = Y.v3;
  const TOP_ROWS = [[y3, 14.3, 'frit'], [14.3, 19.2, 'glow'], [19.2, 20.6, 'frit'], [20.6, 25.7, 'glow'], [25.7, y3t, 'frit']];
  function topSkin(f, bayLen) {
    for (const [ya, yb, m] of TOP_ROWS) s(m).panel(f, 0, f.len, ya, yb);
    if (!near) return;
    const n = Math.max(2, Math.round(f.len / 2.1));
    for (let i = 1; i < n; i++) for (const [ya, yb, m] of TOP_ROWS) if (m === 'glow') s('steel').mullion(f, f.len * i / n, ya, yb, 0.07, 0.08);
    const bays = Math.max(2, Math.round(f.len / bayLen));
    for (let k = 0; k < bays; k++) {
      const t0 = f.len * k / bays, t1 = f.len * (k + 1) / bays;
      if (k % 2) s('steel').brace(f, t0, y3t - 0.4, t1, y3 + 0.4, 0.26, 0.14); else s('steel').brace(f, t0, y3 + 0.4, t1, y3t - 0.4, 0.26, 0.14);
    }
  }
  topSkin(face([nwEnd, sw], [nwEnd, v3Width], [-1, 0]), 12.65); // the street end, 25.3 m wide
  topSkin(face([nwEnd, sw], [v3End, sw], [0, -1]), 10.6);         // the south-west side
  topSkin(face([nwEnd, v3Width], [v3End, v3Width], [0, 1]), 10.6); // the north-east side
  topSkin(face([v3End, sw], [v3End, v3Width], [1, 0]), 12.65);    // the south-east end
  // Soffit: the underside of the 21 m cantilever and of its 4.5 m overhang along the south-west side.
  s('soffit').flat(F, [nwEnd, hall], [sw, v3Width], y3, false);
  s('soffit').flat(F, [hall, v3End], [sw, wall], y3, false);
  s(CON).flat(F, [nwEnd, v3End], [sw, v3Width], y3t, true);
  if (near) for (const a0 of [5, 11, 17]) { // the skylight monitors over the Inuit art galleries
    s('glass').box(F, [a0, a0 + 3], [4.2, 21.1], [y3t, y3t + 0.8], ['bottom', 'top']);
    s('glow').flat(F, [a0, a0 + 3], [4.2, 21.1], y3t + 0.8, true);
  }
  // The gold lantern on the south-east end of the top box (the warm box above the pale glass in the photographs).
  s('gold').box(F, [30, 41], [5.5, 20.5], [y3t, Y.lantern], ['bottom']);

  // ---------------------------------------------------------------- terraces and parapets
  const P = 0.3, PH = 0.9;
  const parapet = ([a0, a1], [b0, b1], y0) => s(CON).box(F, [a0, a1], [b0, b1], [y0, y0 + PH], ['bottom']);
  // first roof (8.5 m): the south-east terrace and the north-east terrace round the second volume
  s('green').flat(F, [v2End, seEnd - P], [wall + P, v1Ne - P], Y.v1, true);
  s('green').flat(F, [v1Start + P, v2End], [v2Ne, v1Ne - P], Y.v1, true);
  parapet([seEnd - P, seEnd], [wall, v1Ne], Y.v1);
  parapet([v1Start, seEnd - P], [v1Ne - P, v1Ne], Y.v1);
  parapet([v2End, seEnd - P], [wall, wall + P], Y.v1);
  parapet([v1Start, v1Start + P], [v2Ne, v1Ne - P], Y.v1);
  // second roof (13 m): round the top box
  s('green').flat(F, [v3End, v2End - P], [wall, v2Ne - P], Y.v2, true);
  s('green').flat(F, [conA + P, v3End], [v3Width, v2Ne - P], Y.v2, true);
  parapet([v2End - P, v2End], [wall, v2Ne], Y.v2);
  parapet([conA, v2End - P], [v2Ne - P, v2Ne], Y.v2);
  parapet([conA, conA + P], [v3Width, v2Ne - P], Y.v2);

  // ---------------------------------------------------------------- the glazed stair hung on the south-west wall
  {
    const { aLow, aHigh, depth, h } = STAIR, bo = sw - STAIR.out, yb = stairBottom, yt = (a) => yb(a) + h;
    s('glass').quad(F(aLow, yb(aLow), bo), F(aHigh, yb(aHigh), bo), F(aHigh, yt(aHigh), bo), F(aLow, yt(aLow), bo), F((aLow + aHigh) / 2, (yb(aLow) + yt(aHigh)) / 2, bo - 10)); // side
    s('glass').quad(F(aLow, yt(aLow), bo), F(aHigh, yt(aHigh), bo), F(aHigh, yt(aHigh), depth), F(aLow, yt(aLow), depth), F((aLow + aHigh) / 2, yt(aLow) + 10, depth / 2)); // sloped roof
    s('soffit').quad(F(aLow, yb(aLow), bo), F(aHigh, yb(aHigh), bo), F(aHigh, yb(aHigh), depth), F(aLow, yb(aLow), depth), F((aLow + aHigh) / 2, yb(aLow) - 10, depth / 2)); // underside
    s('glass').quad(F(aLow, yb(aLow), bo), F(aLow, yt(aLow), bo), F(aLow, yt(aLow), depth), F(aLow, yb(aLow), depth), F(aLow + 10, yb(aLow) + h / 2, depth / 2)); // low end
    s('frit').quad(F(aHigh, yb(aHigh), bo), F(aHigh, yt(aHigh), bo), F(aHigh, yt(aHigh), sw), F(aHigh, yb(aHigh), sw), F(aHigh + 10, (yb(aHigh) + yt(aHigh)) / 2, bo)); // the strip of the high end that stands outside the top box's south-west face
    s('frit').quad(F(aLow, yb(aLow), depth), F(aHigh, yb(aHigh), depth), F(aHigh, yt(aHigh), depth), F(aLow, yt(aLow), depth), F((aLow + aHigh) / 2, yb(aLow) + h / 2, depth + 10)); // north-east side
    if (near) {
      const N = 16, w = 0.09, out = dB(0.1), up = [0, 0.1, 0];
      for (let k = 0; k <= N; k++) { // white frames across the side and over the roof
        const a = aLow + (aHigh - aLow) * k / N, a0 = Math.max(aHigh, a - w), a1 = Math.min(aLow, a + w);
        s('frit').slat([F(a0, yb(a0), bo), F(a1, yb(a1), bo), F(a1, yt(a1), bo), F(a0, yt(a0), bo)], out, [1, 3]);
        s('frit').slat([F(a0, yt(a0), bo), F(a1, yt(a1), bo), F(a1, yt(a1), depth), F(a0, yt(a0), depth)], up, [1, 3]);
      }
      for (const f of [0.34, 0.67]) { // rails along the side
        s('frit').slat([F(aLow, yb(aLow) + f * h - 0.07, bo), F(aHigh, yb(aHigh) + f * h - 0.07, bo), F(aHigh, yb(aHigh) + f * h + 0.07, bo), F(aLow, yb(aLow) + f * h + 0.07, bo)], out, [0, 2]);
      }
    }
  }

  for (const [mat, soup] of soups) if (!soup.empty) b.put(soup.geometry(), mat);
  return b.finish();
}
