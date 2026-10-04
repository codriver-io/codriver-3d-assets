import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { makeKit } from './hotel-de-ville-de-montreal-kit.js';
import { PLAN as P, L } from './hotel-de-ville-de-montreal-plan.js';
import { facade, centralPavilion, extension, campanile, chimneys } from './hotel-de-ville-de-montreal-parts.js';

// Hotel de Ville de Montreal (Perrault & Hutchison, 1872-78; rebuilt inside after the 1922 fire with an added storey and the
// slimmer campanile, 1923-26; rear block 1932-34; restored 2017-24): a grey-limestone Second Empire block of five parts on rue
// Notre-Dame with a pedimented central pavilion (portal, balcony, clock frontispiece), end pavilions under their own mansards,
// patinated copper roofs with dormers and two Renaissance chimneys, and a copper campanile; behind it the terrace block toward the
// Champ-de-Mars. Authored in building axes (see the kit) and rotated once onto east/up/south.

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = makeKit(b, near);
  const H = P.half, M = P.halfMid, R = L.roof;
  const front = k.frame(0, 0, 0), rear = k.frame(0, 0, Math.PI), right = k.frame(0, 0, Math.PI / 2), left = k.frame(0, 0, -Math.PI / 2);

  // Masses: the block, the four end pavilions, the rear central bay.
  k.gbox('stone', -M, M, 0, L.wallTop, P.wallR, P.wallF);
  for (const sg of [-1, 1]) {
    const s0 = sg > 0 ? P.penIn : -H, s1 = sg > 0 ? H : -P.penIn;
    k.gbox('stone', s0, s1, 0, L.wallTop, P.penFrontBack, P.penFront);
    k.gbox('stone', s0, s1, 0, L.wallTop, P.wallR, P.penRearFront);
  }
  k.gbox('stone', -P.rearHalf, P.rearHalf, 0, L.wallTop, P.rearBack, P.wallR + 0.5);

  // Rue Notre-Dame front: wings, end pavilions, central pavilion.
  const pav = { bay: 4.6, q: 0.8 };
  for (const sg of [-1, 1]) {
    facade(front, near, sg > 0 ? P.cenHalf : -P.penIn, sg > 0 ? P.penIn : -P.cenHalf, P.wallF, { bay: 3.9 });
    facade(front, near, sg > 0 ? P.penIn : -H, sg > 0 ? H : -P.penIn, P.penFront, { ...pav, cL: sg < 0, cR: sg > 0 });
  }
  centralPavilion(front, near);

  // End walls (right: a = -d, left: a = d): front pavilion side, recessed middle, rear pavilion side.
  const sideBay = { bay: 4.1, dbay: 4.1 };
  facade(right, near, -P.penFront, -P.penFrontBack, H, { ...sideBay, ...pav, bay: 4.1, cL: true });
  facade(right, near, -P.penFrontBack, -P.penRearFront, M, sideBay);
  facade(right, near, -P.penRearFront, -P.wallR, H, { ...sideBay, ...pav, bay: 4.1, cR: true, y0: P.ext.top });
  facade(left, near, P.penFrontBack, P.penFront, H, { ...sideBay, ...pav, bay: 4.1, cR: true });
  facade(left, near, P.penRearFront, P.penFrontBack, M, sideBay);
  facade(left, near, P.wallR, P.penRearFront, H, { ...sideBay, ...pav, bay: 4.1, cL: true });

  // Rear (toward the Champ-de-Mars, a = -s, e = -d): the terrace block hides the lowest storey, so rows start above it.
  const hi = { y0: P.ext.top, dormers: true };
  facade(rear, near, -H, -P.penIn, -P.wallR, { ...pav, ...hi, cL: true });
  facade(rear, near, -P.penIn, -P.rearHalf, -P.wallR, { bay: 3.9, ...hi });
  facade(rear, near, -P.rearHalf, P.rearHalf, -P.rearBack, { bay: 3.9, ...hi, dormers: false, cL: true, cR: true });
  facade(rear, near, P.rearHalf, P.penIn, -P.wallR, { bay: 3.9, ...hi });
  facade(rear, near, P.penIn, H, -P.wallR, { ...pav, ...hi, cR: true });
  rear.box('stone', -4.2, 4.2, 17.5, 21.8, 11.5, 15.3); // the big rear dormer-pavilion on the roof, with its three lit windows and pediment
  rear.pediment('stone', -4.6, 4.6, 21.8, 2.2, 11.5, 15.5);
  for (const c of [-2.6, 0, 2.6]) rear.arch('light', c, 18.4, 1.3, 2.6, 15.3 + 0.06);
  extension(k, rear, near);

  // Roofs: the mansard over the block (steep lower slope, shallow upper slope, flat cap) and a steeper one on each end pavilion.
  k.hip('roof', -M, M, P.wallR, P.wallF, [[R.y0, R.i0], [R.y1, R.i1], [R.y2, R.i2]]);
  for (const sg of [-1, 1]) {
    const s0 = sg > 0 ? P.penIn : -H, s1 = sg > 0 ? H : -P.penIn;
    for (const [d0, d1] of [[P.penFrontBack, P.penFront], [P.wallR, P.penRearFront]]) {
      const i2 = Math.min(4.2, Math.min(s1 - s0, d1 - d0) / 2 - 0.3);
      k.hip('roof', s0, s1, d0, d1, [[R.y0, R.i0], [25.0, i2]]);
    }
  }
  chimneys(k, near);
  campanile(k, near);
  return b.finish();
}
