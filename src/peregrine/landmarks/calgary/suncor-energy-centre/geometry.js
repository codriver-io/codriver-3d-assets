import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { Meshes } from './suncor-energy-centre-mesh.js';
import { wall, polyEdges, pointInPoly, insetPoly, officeRows } from './suncor-energy-centre-facade.js';
import { WEST, EAST, BLOCK, WING, FLOOR, roofPlane } from './suncor-energy-centre-site.js';

const RECESS = 0.15; // the glass plane sits this far behind the granite
let serial = 0;      // a fresh tag per wall so lit windows do not repeat between walls

// One tower: granite walls with recessed glass, cut by the sloped roof, the foot hidden where the low block abuts.
function tower(M, near, T) {
  const roof = roofPlane(T.poly, T.top), inner = insetPoly(T.poly, RECESS), edges = polyEdges(T.poly);
  const rows = [{ sill: 0.55, head: T.lobby - 1.3, lit: 0.55 }, ...officeRows(T.lobby, FLOOR, T.floors, near)];
  edges.forEach((e, i) => {
    const mid = [(e.a[0] + e.b[0]) / 2 + e.n[0] * 0.3, (e.a[1] + e.b[1]) / 2 + e.n[1] * 0.3];
    const abuts = pointInPoly(mid, BLOCK.poly);
    wall(M, near, { a: e.a, b: e.b, n: e.n, inA: inner[i], inB: inner[(i + 1) % inner.length], topAt: roof.y, rows, yLo: abuts ? BLOCK.top : 0, tag: ++serial });
  });
  M.get('roof').plane(T.poly, roof.y, roof.normal);
}

// A flat-roofed low volume: walls with rows of windows, skipping edges that another volume hides.
function volume(M, near, V, others, rows, lit) {
  const inner = insetPoly(V.poly, RECESS), edges = polyEdges(V.poly), topAt = () => V.top;
  edges.forEach((e, i) => {
    const mid = [(e.a[0] + e.b[0]) / 2 + e.n[0] * 0.3, (e.a[1] + e.b[1]) / 2 + e.n[1] * 0.3];
    let yLo = 0;
    for (const o of others) if (pointInPoly(mid, o.poly)) yLo = Math.max(yLo, o.top ?? 0);
    if (yLo >= V.top - 0.5) return; // hidden by a volume as tall as this one
    wall(M, near, { a: e.a, b: e.b, n: e.n, inA: inner[i], inB: inner[(i + 1) % inner.length], topAt, rows, yLo, lit, tag: ++serial });
  });
  M.get('roof').plane(V.poly, () => V.top, [0, 1, 0]);
}

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  serial = 0;
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail), M = new Meshes();
  tower(M, near, WEST); tower(M, near, EAST);
  const floor = BLOCK.top / BLOCK.floors;
  volume(M, near, BLOCK, [WING, { poly: WEST.poly, top: Infinity }, { poly: EAST.poly, top: Infinity }],
    officeRows(0, floor, BLOCK.floors, near, { sill: 0.7, win: 2.3 }), 0.2);
  volume(M, near, WING, [BLOCK], [{ sill: 0.6, head: 4.9, lit: 0.4 }], 0.4);
  for (const [name, faces] of M) b.put(faces.toGeometry(), name, 0);
  const root = b.finish();
  root.traverse((o) => { if (o.isMesh) o.geometry.deleteAttribute('bridgeLift'); }); // buildings carry no road contract
  root.userData.elevationDatum = 'Y=0 is local flat-map grade, not sea level. Below-grade levels and the plazas are not modelled.';
  return root;
}
