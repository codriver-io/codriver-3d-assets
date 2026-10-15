import { TOWER, DOME, H } from './tarrant-county-courthouse-plan.js';

// Clock tower over the centre of the main block, and the copper dome on the east wing.
export function buildTower(k) {
  const { near, box, bar, cylinder, lathe, window, disc, column } = k;
  const { x: tx, z: tz } = TOWER, y0 = H.central - .3;
  const gap = .14, faces = [[0, 1], [Math.PI / 2, 0], [Math.PI, -1], [-Math.PI / 2, 0]];
  // Shaft: granite, arched windows on each face, cornice and balcony.
  const sw = 11;
  box('stone', tx, (y0 + 38) / 2, tz, sw, 38 - y0, sw);
  for (const [a] of faces) {
    const nx = Math.sin(a), nz = Math.cos(a), cx = tx + nx * (sw / 2 + gap), cz = tz + nz * (sw / 2 + gap);
    const px = Math.cos(a), pz = -Math.sin(a);
    for (const o of near ? [-2.6, 2.6] : [-2.6, 2.6]) window('glass', cx + px * o, 29.5, cz + pz * o, 1.8, 5.2, a, true);
    if (near) for (const o of [-2.6, 2.6]) bar('trim', [cx + px * (o - 1.15) + nx * .12, 29.4, cz + pz * (o - 1.15) + nz * .12], [cx + px * (o + 1.15) + nx * .12, 29.4, cz + pz * (o + 1.15) + nz * .12], .25, .45);
  }
  box('trim', tx, 38.15, tz, 12.6, .9, 12.6);
  box('trim', tx, 38.75, tz, 13.6, .5, 13.6);
  // balustrade round the balcony
  const bh = 39.2 + .35, r = 6.8;
  for (const s of [-1, 1]) {
    bar('trim', [tx - r, bh + .35, tz + s * r], [tx + r, bh + .35, tz + s * r], .3, .3);
    bar('trim', [tx + s * r, bh + .35, tz - r], [tx + s * r, bh + .35, tz + r], .3, .3);
    if (near) for (let i = 0; i <= 8; i++) {
      const o = -r + i * (2 * r) / 8;
      box('trim', tx + o, bh - .05, tz + s * r, .24, .7, .24);
      if (i && i < 8) box('trim', tx + s * r, bh - .05, tz + o, .24, .7, .24);
    }
  }
  // Belfry: corner piers with a tall arched opening on each face.
  const bw = 8.4, b0 = 39.0, b1 = 44.6;
  box('stone', tx, (b0 + b1) / 2, tz, bw, b1 - b0, bw);
  for (const [a] of faces) {
    const nx = Math.sin(a), nz = Math.cos(a), cx = tx + nx * (bw / 2 + gap), cz = tz + nz * (bw / 2 + gap);
    window('glass', cx, 40.1, cz, 3.6, 3.9, a, true);
    // corner piers stand proud of the face on either side of the opening
    for (const o of [-1, 1]) { const px = Math.cos(a) * o * (bw / 2 - .25), pz = -Math.sin(a) * o * (bw / 2 - .25); box('trim', tx + nx * (bw / 2) + px, 41.9, tz + nz * (bw / 2) + pz, .7, 5.6, .7); }
  }
  box('trim', tx, 44.8, tz, 9.8, .8, 9.8);
  // Clock stage: an octagon (chamfered corners) with a lit face and a small pediment over it on each side.
  const ap = 3.8, c0 = 45.2, c1 = 49.4, R = ap / Math.cos(Math.PI / 8); // apothem, base, top, circumradius
  const oct = (r, y0, y1, mat) => k.polygon(mat, [...Array(8)].map((_, i) => { const t = Math.PI / 8 + i * Math.PI / 4; return [tx + Math.sin(t) * r, tz + Math.cos(t) * r]; }), y0, y1);
  oct(R, c0, c1, 'stone');
  for (const [a] of faces) {
    const nx = Math.sin(a), nz = Math.cos(a), px = Math.cos(a), pz = -Math.sin(a);
    disc('trim', tx + nx * (ap + .07), 47.3, tz + nz * (ap + .07), 1.75, a);
    disc('glow', tx + nx * (ap + .17), 47.3, tz + nz * (ap + .17), 1.4, a);
    // pediment over the dial: raking trim bars up to an apex that clears the cornice
    bar('trim', [tx + nx * (ap + .14) - px * 1.9, 48.7, tz + nz * (ap + .14) - pz * 1.9], [tx + nx * (ap + .14), 49.7, tz + nz * (ap + .14)], .34, .4);
    bar('trim', [tx + nx * (ap + .14), 49.7, tz + nz * (ap + .14)], [tx + nx * (ap + .14) + px * 1.9, 48.7, tz + nz * (ap + .14) + pz * 1.9], .34, .4);
    if (near) { // hands at ten past ten, proud of the lit face
      const cx = tx + nx * (ap + .28), cz = tz + nz * (ap + .28);
      bar('dome', [cx, 47.3, cz], [cx - px * .7, 47.3 + .95, cz - pz * .7], .14, .1);
      bar('dome', [cx, 47.3, cz], [cx + px * .9, 47.3 + .95, cz + pz * .9], .1, .1);
    }
  }
  oct(R + .5, c1, c1 + .6, 'trim');
  // Tall faceted ogee dome on a short drum, then the lantern with its own small cap and the finial.
  const d0 = c1 + .6, n8 = 8;
  oct(R - .15, d0, d0 + 1.0, 'stone');
  lathe('dome', [[0.01, d0 + 1.0], [R + .05, d0 + 1.0], [R + .3, d0 + 1.9], [R + .15, d0 + 3.2], [R - .55, d0 + 4.4], [R - 1.6, d0 + 5.4], [1.5, d0 + 6.0], [1.2, d0 + 6.3], [.01, d0 + 6.3]], n8, tx, tz);
  const l0 = d0 + 6.0; // lantern: eight-sided stone with arched openings
  k.cylinder('stone', tx, tz, 1.25, l0, l0 + 1.5, 1.2, near ? 8 : 6);
  if (near) for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; window('glass', tx + Math.sin(a) * 1.3, l0 + .3, tz + Math.cos(a) * 1.3, .7, 1.1, a, true); }
  lathe('dome', [[0.01, l0 + 1.5], [1.5, l0 + 1.5], [1.15, l0 + 1.85], [.5, l0 + 2.25], [.01, l0 + 2.4]], near ? 12 : 8, tx, tz);
  cylinder('trim', tx, tz, .1, l0 + 2.3, H.tower, .05, near ? 5 : 3);

  // East-wing dome: a ribbed copper shell on a windowed drum, with a lantern and its own small dome.
  const { x: dx, z: dz } = DOME, base = 24.0;
  cylinder('stone', dx, dz, 5.1, base - .3, base + 1.3, 5.1, near ? 20 : 10);
  cylinder('trim', dx, dz, 5.4, base + 1.2, base + 1.7, 5.4, near ? 20 : 10);
  if (near) for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; window('glass', dx + Math.sin(a) * 5.17, base + .1, dz + Math.cos(a) * 5.17, 1.2, 1.0, a); }
  const shell = [[0.01, base + 1.7], [5.2, base + 1.7], [5.3, base + 2.6], [4.9, base + 4.6], [4.0, base + 6.6], [2.8, base + 8.2], [1.7, base + 9.3], [1.2, base + 9.8], [.01, base + 10.0]];
  lathe('copper', shell, near ? 24 : 12, dx, dz);
  if (near) for (let i = 0; i < 12; i++) { // twelve ribs follow the shell, 12 cm proud
    const a = (i + .5) * Math.PI / 6, sa = Math.sin(a), ca = Math.cos(a);
    for (let j = 1; j < shell.length - 2; j++) {
      const [r0, y0] = shell[j], [r1, y1] = shell[j + 1];
      bar('trim', [dx + sa * (r0 + .12), y0, dz + ca * (r0 + .12)], [dx + sa * (r1 + .12), y1, dz + ca * (r1 + .12)], .16, .22);
    }
  }
  cylinder('stone', dx, dz, 1.3, base + 9.6, base + 12.4, 1.2, near ? 10 : 6);
  if (near) for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; window('glass', dx + Math.sin(a) * 1.35, base + 10.2, dz + Math.cos(a) * 1.35, .8, 1.5, a, true); }
  lathe('copper', [[0.01, base + 12.4], [1.7, base + 12.4], [1.4, base + 12.9], [.6, base + 13.6], [.01, base + 13.9]], near ? 12 : 8, dx, dz);
  cylinder('trim', dx, dz, .09, base + 13.8, base + 15.4, .04, near ? 5 : 3);
}
