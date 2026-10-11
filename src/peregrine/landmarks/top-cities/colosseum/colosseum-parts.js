// Procedural Colosseum. Elliptical travertine drum, three arched orders and an attic on the
// north outer wall (bays 0–36), the south outer wall lost, exposing the inner arcade, brick
// radial cavea and an open hypogeum. Real metres, +x east, +y up, +z south.
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  OUTER_A, OUTER_B, ARENA_A, ARENA_B, HEIGHT, BAYS, LEVELS, ATTIC_Y, CROWN_Y0, CROWN_PROJ,
  STEP_OUT, STEP_MID, WALL_T, WALL2, WALL2_T, WALL3, WALL3_T,
  ellipse, ellipseNormal, ellipseTangent, bay, standing, innerCrown, uv, STANDING_TO,
} from './colosseum-plan.js';

function mesh() { return { pos: [], idx: [] }; }

function addTri(mesh, a, b, c, hint) {
  const abx = b[0] - a[0], aby = b[1] - a[1], abz = b[2] - a[2];
  const acx = c[0] - a[0], acy = c[1] - a[1], acz = c[2] - a[2];
  const nx = aby * acz - abz * acy, ny = abz * acx - abx * acz, nz = abx * acy - aby * acx;
  if (nx * nx + ny * ny + nz * nz < 1e-8) return;
  if (hint && nx * hint[0] + ny * hint[1] + nz * hint[2] < 0) { const t = b; b = c; c = t; }
  const i = mesh.pos.length / 3;
  mesh.pos.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
  mesh.idx.push(i, i + 1, i + 2);
}

function addQuad(mesh, a, b, c, d, hint) {
  const abx = b[0] - a[0], aby = b[1] - a[1], abz = b[2] - a[2];
  const acx = c[0] - a[0], acy = c[1] - a[1], acz = c[2] - a[2];
  let nx = aby * acz - abz * acy, ny = abz * acx - abx * acz, nz = abx * acy - aby * acx;
  if (nx * nx + ny * ny + nz * nz < 1e-8) {
    const adx=d[0]-a[0], ady=d[1]-a[1], adz=d[2]-a[2];
    nx=acy*adz-acz*ady; ny=acz*adx-acx*adz; nz=acx*ady-acy*adx;
    if (nx*nx+ny*ny+nz*nz < 1e-8) return;
  }
  if (hint && nx * hint[0] + ny * hint[1] + nz * hint[2] < 0) { const t = b; b = d; d = t; }
  const i = mesh.pos.length / 3;
  mesh.pos.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2], d[0], d[1], d[2]);
  const area = (u,v,w) => Math.hypot(
    (v[1]-u[1])*(w[2]-u[2])-(v[2]-u[2])*(w[1]-u[1]),
    (v[2]-u[2])*(w[0]-u[0])-(v[0]-u[0])*(w[2]-u[2]),
    (v[0]-u[0])*(w[1]-u[1])-(v[1]-u[1])*(w[0]-u[0]));
  if (area(a,b,c)>1e-8) mesh.idx.push(i,i+1,i+2);
  if (area(a,c,d)>1e-8) mesh.idx.push(i,i+2,i+3);
}

function toGeom(mesh) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(mesh.pos, 3));
  g.setIndex(new THREE.BufferAttribute(new Uint32Array(mesh.idx), 1));
  g.computeVertexNormals();
  // Weld only identical positions AND normals: retain crisp edges, reduce exported bytes.
  const compact = mergeVertices(g, 1e-4); g.dispose();
  return compact;
}

function P(a, b, t, inset, y) {
  const [x, z] = ellipse(a, b, t);
  const n = ellipseNormal(a, b, t);
  return [x - n[0] * inset, y, z - n[1] * inset];
}
function nOut(a, b, t) {
  const n = ellipseNormal(a, b, t);
  return [n[0], 0, n[1]];
}
function nIn(a, b, t) {
  const n = nOut(a, b, t);
  return [-n[0], 0, -n[2]];
}

function panel(mesh, a, b, inset, tA, tB, yA, yB, out) {
  if (Math.abs(yB - yA) < 0.02 || Math.abs(tB - tA) < 1e-5) return;
  const hint = out ? nOut(a, b, (tA + tB) / 2) : nIn(a, b, (tA + tB) / 2);
  addQuad(mesh, P(a, b, tA, inset, yA), P(a, b, tB, inset, yA), P(a, b, tB, inset, yB), P(a, b, tA, inset, yB), hint);
}

function cap(mesh, a, b, t, inset0, inset1, y0, y1, hint) {
  if (y1 - y0 < 0.02) return;
  addQuad(mesh,
    P(a, b, t, inset0, y0), P(a, b, t, inset1, y0), P(a, b, t, inset1, y1), P(a, b, t, inset0, y1), hint);
}

// Solid elliptical band, one flat facet per bay, no openings. Top follows yAt(i).
function solidRing(mesh, a, b, inset, thick, y0, yAt, from, to, stride = 1) {
  for (let i = from; i <= to; i += stride) {
    const q = bay(i); q.t1 = bay(Math.min(to, i + stride - 1)).t1;
    const y1 = yAt(i);
    panel(mesh, a, b, inset, q.t0, q.t1, y0, y1, true);
    panel(mesh, a, b, inset + thick, q.t0, q.t1, y0, y1, false);
    addQuad(mesh, P(a, b, q.t0, inset, y1), P(a, b, q.t1, inset, y1), P(a, b, q.t1, inset + thick, y1), P(a, b, q.t0, inset + thick, y1), [0, 1, 0]);
    if (i > from) {
      const prev = yAt(i - stride);
      if (Math.abs(prev - y1) > 0.05) {
        const yLo = Math.min(prev, y1), yHi = Math.max(prev, y1);
        const tg = ellipseTangent(a, b, q.t0);
        const hint = prev > y1 ? [tg[0], 0, tg[1]] : [-tg[0], 0, -tg[1]];
        cap(mesh, a, b, q.t0, inset, inset + thick, yLo, yHi, hint);
      }
    }
  }
}

function cornice(mesh, a, b, t0, t1, y0, y1, proj) {
  panel(mesh, a, b, -proj, t0, t1, y0, y1, true);
  addQuad(mesh, P(a, b, t0, 0, y0), P(a, b, t1, 0, y0), P(a, b, t1, -proj, y0), P(a, b, t0, -proj, y0), [0, -1, 0]);
  addQuad(mesh, P(a, b, t0, -proj, y1), P(a, b, t1, -proj, y1), P(a, b, t1, 0, y1), P(a, b, t0, 0, y1), [0, 1, 0]);
}

// One bay of an arcade: piers, semicircular arch, intrados and reveals. Wall face stops at the crown.
function arcadeBay(mesh, a, b, inset, thick, q, level, segs) {
  const y0 = level.y0, crown = level.crown;
  const rise = q.spanHalfY ?? level.span / 2;
  const spring = crown - rise;
  const tOf = (phi) => q.tC - (q.tR - q.tC) * Math.cos(phi);
  const yOf = (phi) => spring + rise * Math.sin(phi);
  panel(mesh, a, b, inset, q.t0, q.tL, y0, crown, true);
  panel(mesh, a, b, inset, q.tR, q.t1, y0, crown, true);
  panel(mesh, a, b, inset + thick, q.t0, q.tL, y0, crown, false);
  panel(mesh, a, b, inset + thick, q.tR, q.t1, y0, crown, false);
  const tgL = ellipseTangent(a, b, q.tL), tgR = ellipseTangent(a, b, q.tR);
  cap(mesh, a, b, q.tL, inset, inset + thick, y0, spring, [tgL[0], 0, tgL[1]]);
  cap(mesh, a, b, q.tR, inset, inset + thick, y0, spring, [-tgR[0], 0, -tgR[1]]);
  for (let s = 0; s < segs; s++) {
    const p0 = (s / segs) * Math.PI, p1 = ((s + 1) / segs) * Math.PI;
    const tA = tOf(p0), tB = tOf(p1), yA = yOf(p0), yB = yOf(p1);
    const hintO = nOut(a, b, (tA + tB) / 2);
    addQuad(mesh, P(a, b, tA, inset, yA), P(a, b, tB, inset, yB), P(a, b, tB, inset, crown), P(a, b, tA, inset, crown), hintO);
    addQuad(mesh, P(a, b, tA, inset + thick, yA), P(a, b, tB, inset + thick, yB), P(a, b, tB, inset + thick, crown), P(a, b, tA, inset + thick, crown), [-hintO[0], 0, -hintO[2]]);
    const midT = (tA + tB) / 2, midY = (yA + yB) / 2;
    const on = P(a, b, midT, inset + thick / 2, midY);
    const center = P(a, b, q.tC, inset + thick / 2, spring);
    addQuad(mesh,
      P(a, b, tA, inset, yA), P(a, b, tB, inset, yB), P(a, b, tB, inset + thick, yB), P(a, b, tA, inset + thick, yA),
      [center[0] - on[0], center[1] - on[1], center[2] - on[2]]);
  }
}

function halfColumn(mesh, a, b, t, y0, y1, radius, segs) {
  const n = ellipseNormal(a, b, t), tg = ellipseTangent(a, b, t);
  const [x, z] = ellipse(a, b, t);
  const cx = x + n[0] * 0.18, cz = z + n[1] * 0.18;
  const band = (yLo, yHi, rad) => {
    const row = (y) => {
      const pts = [];
      for (let i = 0; i <= segs; i++) {
        const ang = -Math.PI / 2 + (Math.PI * i) / segs;
        const dx = n[0] * Math.cos(ang) + tg[0] * Math.sin(ang);
        const dz = n[1] * Math.cos(ang) + tg[1] * Math.sin(ang);
        pts.push([cx + dx * rad, y, cz + dz * rad]);
      }
      return pts;
    };
    const lo = row(yLo), hi = row(yHi);
    for (let i = 0; i < segs; i++) addQuad(mesh, lo[i], lo[i + 1], hi[i + 1], hi[i], [n[0], 0.12, n[1]]);
    for (let i = 1; i < segs; i++) addTri(mesh, hi[0], hi[i], hi[i + 1], [0, 1, 0]);
  };
  band(y0, y0 + 0.28, radius * 1.28);
  band(y0 + 0.28, y1 - 0.55, radius);
  band(y1 - 0.55, y1 - 0.12, radius * 1.34);
}

function rectWindow(stone, voidMesh, a, b, q, y0, y1, span, depth) {
  const speed = Math.hypot(-a * Math.sin(q.tC), b * Math.cos(q.tC));
  const half = (span / 2) / speed;
  const tL = q.tC - half, tR = q.tC + half;
  const top = CROWN_Y0;
  panel(stone, a, b, 0, q.t0, tL, ATTIC_Y, top, true);
  panel(stone, a, b, 0, tR, q.t1, ATTIC_Y, top, true);
  panel(stone, a, b, 0, tL, tR, ATTIC_Y, y0, true);
  panel(stone, a, b, 0, tL, tR, y1, top, true);
  const tg = ellipseTangent(a, b, q.tC);
  cap(stone, a, b, tL, 0, depth, y0, y1, [tg[0], 0, tg[1]]);
  cap(stone, a, b, tR, 0, depth, y0, y1, [-tg[0], 0, -tg[1]]);
  addQuad(stone, P(a, b, tL, 0, y1), P(a, b, tR, 0, y1), P(a, b, tR, depth, y1), P(a, b, tL, depth, y1), [0, -1, 0]);
  addQuad(stone, P(a, b, tL, depth, y0), P(a, b, tR, depth, y0), P(a, b, tR, 0, y0), P(a, b, tL, 0, y0), [0, 1, 0]);
  addQuad(voidMesh, P(a, b, tL, depth, y0), P(a, b, tR, depth, y0), P(a, b, tR, depth, y1), P(a, b, tL, depth, y1), nOut(a, b, q.tC));
}

function corbel(mesh, a, b, t, y, reach) {
  const n = ellipseNormal(a, b, t), tg = ellipseTangent(a, b, t);
  const [x, z] = ellipse(a, b, t);
  const w = 0.48, h = 1.15;
  const o = (s, inset, yy) => [x + tg[0] * s - n[0] * inset, yy, z + tg[1] * s - n[1] * inset];
  addQuad(mesh, o(-w, 0, y), o(w, 0, y), o(w, -reach, y + h * 0.42), o(-w, -reach, y + h * 0.42), [n[0], 0.2, n[1]]);
  addQuad(mesh, o(-w, -reach, y + h * 0.42), o(w, -reach, y + h * 0.42), o(w, 0, y + h), o(-w, 0, y + h), [0, 1, 0]);
  addTri(mesh, o(-w, 0, y), o(-w, -reach, y + h * 0.42), o(-w, 0, y + h), [-tg[0], 0, -tg[1]]);
  addTri(mesh, o(w, 0, y), o(w, 0, y + h), o(w, -reach, y + h * 0.42), [tg[0], 0, tg[1]]);
}

function pilaster(mesh, a, b, t, y0, y1) {
  const speed = Math.hypot(-a * Math.sin(t), b * Math.cos(t));
  const h = 0.62 / speed;
  const proj = 0.38;
  panel(mesh, a, b, -proj, t - h, t + h, y0, y1, true);
  const tgL = ellipseTangent(a, b, t - h), tgR = ellipseTangent(a, b, t + h);
  cap(mesh, a, b, t - h, -proj, 0, y0, y1, [-tgL[0], 0, -tgL[1]]);
  cap(mesh, a, b, t + h, -proj, 0, y0, y1, [tgR[0], 0, tgR[1]]);
}

function steps(mesh, detail) {
  for (let i = 0; i < BAYS; i++) {
    const q = bay(i);
    const base = standing(i) ? 0 : WALL3;
    if (detail === 'far') {
      // One tread. The outer riser stays at STEP_OUT so the footprint bounds match the near model.
      panel(mesh, OUTER_A, OUTER_B, base - STEP_OUT, q.t0, q.t1, base, 0.42, true);
      addQuad(mesh,
        P(OUTER_A, OUTER_B, q.t0, base - STEP_OUT, 0.42), P(OUTER_A, OUTER_B, q.t1, base - STEP_OUT, 0.42),
        P(OUTER_A, OUTER_B, q.t1, base, 0.42), P(OUTER_A, OUTER_B, q.t0, base, 0.42), [0, 1, 0]);
      continue;
    }
    // Lower tread and riser, then the upper step the piers stand on.
    panel(mesh, OUTER_A, OUTER_B, base - STEP_OUT, q.t0, q.t1, 0, 0.22, true);
    addQuad(mesh,
      P(OUTER_A, OUTER_B, q.t0, base - STEP_OUT, 0.22), P(OUTER_A, OUTER_B, q.t1, base - STEP_OUT, 0.22),
      P(OUTER_A, OUTER_B, q.t1, base - STEP_MID, 0.22), P(OUTER_A, OUTER_B, q.t0, base - STEP_MID, 0.22), [0, 1, 0]);
    panel(mesh, OUTER_A, OUTER_B, base - STEP_MID, q.t0, q.t1, 0.22, 0.42, true);
    addQuad(mesh,
      P(OUTER_A, OUTER_B, q.t0, base - STEP_MID, 0.42), P(OUTER_A, OUTER_B, q.t1, base - STEP_MID, 0.42),
      P(OUTER_A, OUTER_B, q.t1, base, 0.42), P(OUTER_A, OUTER_B, q.t0, base, 0.42), [0, 1, 0]);
  }
}

function outerWall(stone, voids, detail) {
  const segs = detail === 'near' ? 8 : 3;
  const colSegs = detail === 'near' ? 6 : 0;
  for (let i = 0; i < BAYS; i++) {
    const q = bay(i);
    q.spanHalfY = (q.tR - q.tC) * Math.hypot(-OUTER_A * Math.sin(q.tC), OUTER_B * Math.cos(q.tC));
    if (!standing(i)) continue;
    for (const level of LEVELS) arcadeBay(stone, OUTER_A, OUTER_B, 0, WALL_T, q, level, segs);
    for (const level of LEVELS) {
      if (detail === 'near') cornice(stone, OUTER_A, OUTER_B, q.t0, q.t1, level.crown, level.ent1, level.proj);
      else panel(stone, OUTER_A, OUTER_B, 0, q.t0, q.t1, level.crown, level.ent1, true);
      panel(stone, OUTER_A, OUTER_B, 0, q.t0, q.t1, level.ent1, level.ped1, true);
      panel(stone, OUTER_A, OUTER_B, WALL_T, q.t0, q.t1, level.crown, level.ped1, false);
    }
    // Attic pier wall with one rectangular window per bay, and the crowning cornice.
    if (i % 2 === 0) rectWindow(stone, voids, OUTER_A, OUTER_B, q, ATTIC_Y + 4.6, ATTIC_Y + 8.7, 2.15, 0.9);
    else panel(stone, OUTER_A, OUTER_B, 0, q.t0, q.t1, ATTIC_Y, CROWN_Y0, true);
    panel(stone, OUTER_A, OUTER_B, WALL_T, q.t0, q.t1, ATTIC_Y, CROWN_Y0, false);
    cornice(stone, OUTER_A, OUTER_B, q.t0, q.t1, CROWN_Y0, HEIGHT, CROWN_PROJ);
    panel(stone, OUTER_A, OUTER_B, WALL_T, q.t0, q.t1, CROWN_Y0, HEIGHT, false);
    addQuad(stone,P(OUTER_A,OUTER_B,q.t0,0,HEIGHT),P(OUTER_A,OUTER_B,q.t1,0,HEIGHT),P(OUTER_A,OUTER_B,q.t1,WALL_T,HEIGHT),P(OUTER_A,OUTER_B,q.t0,WALL_T,HEIGHT),[0,1,0]);
    // Attic pilaster on every pier. A string course ties them under the windows.
    if (detail === 'near') pilaster(stone, OUTER_A, OUTER_B, q.t0, ATTIC_Y + 0.35, CROWN_Y0 - 0.15);
    if (detail === 'near') cornice(stone, OUTER_A, OUTER_B, q.t0, q.t1, ATTIC_Y + 4.15, ATTIC_Y + 4.55, 0.28);
    if (colSegs) {
      for (const level of LEVELS) halfColumn(stone, OUTER_A, OUTER_B, q.t0, level.y0 + 0.08, level.crown - 0.02, 0.46, colSegs);
    }
    if (detail === 'near') {
      const speed = Math.hypot(-OUTER_A * Math.sin(q.tC), OUTER_B * Math.cos(q.tC));
      const off = 1.6 / speed;
      corbel(stone, OUTER_A, OUTER_B, q.tC, CROWN_Y0 - 1.35, 0.82);
      corbel(stone, OUTER_A, OUTER_B, q.tC - off, CROWN_Y0 - 1.35, 0.82);
      corbel(stone, OUTER_A, OUTER_B, q.tC + off, CROWN_Y0 - 1.35, 0.82);
    }
  }
  // Sheer broken ends of the standing drum, including each cornice's projection.
  const tStart = bay(0).t0, tEnd = bay(36).t1;
  const tgS = ellipseTangent(OUTER_A, OUTER_B, tStart);
  const tgE = ellipseTangent(OUTER_A, OUTER_B, tEnd);
  cap(stone, OUTER_A, OUTER_B, tStart, 0, WALL_T, 0.42, HEIGHT, [-tgS[0], 0, -tgS[1]]);
  cap(stone, OUTER_A, OUTER_B, tEnd, 0, WALL_T, 0.42, HEIGHT, [tgE[0], 0, tgE[1]]);
  for (const level of LEVELS) {
    cap(stone, OUTER_A, OUTER_B, tStart, -level.proj, 0, level.crown, level.ent1, [-tgS[0], 0, -tgS[1]]);
    cap(stone, OUTER_A, OUTER_B, tEnd, -level.proj, 0, level.crown, level.ent1, [tgE[0], 0, tgE[1]]);
  }
  cap(stone, OUTER_A, OUTER_B, tStart, -CROWN_PROJ, 0, CROWN_Y0, HEIGHT, [-tgS[0], 0, -tgS[1]]);
  cap(stone, OUTER_A, OUTER_B, tEnd, -CROWN_PROJ, 0, CROWN_Y0, HEIGHT, [tgE[0], 0, tgE[1]]);
  // Close the last standing bay's outer pilaster twin on the west broken pier.
  if (colSegs) {
    for (const level of LEVELS) halfColumn(stone, OUTER_A, OUTER_B, tEnd, level.y0 + 0.15, level.crown - 0.02, 0.42, colSegs);
  }
}

// Upper surviving wall, with small rectangular vents rather than a featureless drum.
function upperBrick(brick, q, y0, y1) {
  const a = OUTER_A, b = OUTER_B, inset = standing(q.i) ? WALL2 : WALL3, thick = WALL2_T;
  const w = 0.011, lo = q.tC - w, hi = q.tC + w;
  const bottom = Math.max(y0 + 0.5, y1 - 3.9), top = y1 - 1.4;
  if (top < bottom + 0.7 || q.i % 2) {
    panel(brick, a, b, inset, q.t0, q.t1, y0, y1, true);
    panel(brick, a, b, inset + thick, q.t0, q.t1, y0, y1, false);
    return;
  }
  for (const depth of [inset, inset + thick]) {
    const outward = depth === inset;
    panel(brick, a, b, depth, q.t0, lo, y0, y1, outward);
    panel(brick, a, b, depth, hi, q.t1, y0, y1, outward);
    panel(brick, a, b, depth, lo, hi, y0, bottom, outward);
    panel(brick, a, b, depth, lo, hi, top, y1, outward);
  }
  const tg = ellipseTangent(a, b, q.tC);
  cap(brick, a, b, lo, inset, inset + thick, bottom, top, [tg[0], 0, tg[1]]);
  cap(brick, a, b, hi, inset, inset + thick, bottom, top, [-tg[0], 0, -tg[1]]);
  for (const y of [bottom, top]) addQuad(brick, P(a,b,lo,inset,y), P(a,b,hi,inset,y), P(a,b,hi,inset+thick,y), P(a,b,lo,inset+thick,y), [0,y===bottom?1:-1,0]);
}

function southInnerBay(brick, i, segs) {
  const q = bay(i), inset = WALL3;
  q.spanHalfY = (q.tR - q.tC) * Math.hypot(-OUTER_A * Math.sin(q.tC), OUTER_B * Math.cos(q.tC)) * 0.86;
  const yTop = innerCrown(i);
  const levels = yTop > LEVELS[2].crown + 1 ? LEVELS : LEVELS.slice(0, 2);
  for (const level of levels) arcadeBay(brick, OUTER_A, OUTER_B, inset, WALL2_T, q, level, segs);
  for (let k = 0; k < levels.length - 1; k++) {
    panel(brick, OUTER_A, OUTER_B, inset, q.t0, q.t1, levels[k].crown, levels[k + 1].y0, true);
    panel(brick, OUTER_A, OUTER_B, inset + WALL2_T, q.t0, q.t1, levels[k].crown, levels[k + 1].y0, false);
  }
  const solidFrom = levels[levels.length - 1].crown;
  upperBrick(brick, q, solidFrom, yTop);
  addQuad(brick,
    P(OUTER_A, OUTER_B, q.t0, inset, yTop), P(OUTER_A, OUTER_B, q.t1, inset, yTop),
    P(OUTER_A, OUTER_B, q.t1, inset + WALL2_T, yTop), P(OUTER_A, OUTER_B, q.t0, inset + WALL2_T, yTop), [0, 1, 0]);
}

function innerWalls(brick, detail) {
  const segs = detail === 'near' ? 5 : 3;
  if (detail === 'far') {
    // The far drum keeps the outer arches. Behind the standing half a solid brick wall
    // stops the eye, cheaper than a second run of 37 arches. The quarried south half
    // still shows its two inner orders, which are the facade on that side.
    solidRing(brick, OUTER_A, OUTER_B, WALL2, WALL2_T, 0.42, innerCrown, 0, STANDING_TO, 2);
    const tS = bay(0).t0, tE = bay(STANDING_TO).t1;
    const tgS = ellipseTangent(OUTER_A, OUTER_B, tS), tgE = ellipseTangent(OUTER_A, OUTER_B, tE);
    cap(brick, OUTER_A, OUTER_B, tS, WALL2, WALL2 + WALL2_T, 0.42, innerCrown(0), [-tgS[0], 0, -tgS[1]]);
    cap(brick, OUTER_A, OUTER_B, tE, WALL2, WALL2 + WALL2_T, 0.42, innerCrown(STANDING_TO), [tgE[0], 0, tgE[1]]);
    for (let i = STANDING_TO + 1; i < BAYS; i++) southInnerBay(brick, i, segs);
    solidRing(brick, OUTER_A, OUTER_B, 24, 1.35, 0.42, () => 15.2, 0, BAYS - 1, detail === 'far' ? 4 : 1);
    solidRing(brick, ARENA_A, ARENA_B, -2.15, 2.15, 0.15, () => 6.3, 0, BAYS - 1, detail === 'far' ? 4 : 1);
    return;
  }
  // Surviving inner facade: two or three arcade orders, then a pierced band (tall behind the
  // intact facade, broken and lower on the quarried south side).
  for (let i = 0; i < BAYS; i++) {
    const q = bay(i), inset = standing(i) ? WALL2 : WALL3;
    q.spanHalfY = (q.tR - q.tC) * Math.hypot(-OUTER_A * Math.sin(q.tC), OUTER_B * Math.cos(q.tC)) * 0.86;
    const yTop = innerCrown(i);
    const levels = yTop > LEVELS[2].crown + 1 ? LEVELS : LEVELS.slice(0, 2);
    for (const level of levels) arcadeBay(brick, OUTER_A, OUTER_B, inset, WALL2_T, q, level, segs);
    for (let k = 0; k < levels.length - 1; k++) {
      panel(brick, OUTER_A, OUTER_B, inset, q.t0, q.t1, levels[k].crown, levels[k + 1].y0, true);
      panel(brick, OUTER_A, OUTER_B, inset + WALL2_T, q.t0, q.t1, levels[k].crown, levels[k + 1].y0, false);
    }
    const solidFrom = levels[levels.length - 1].crown;
    upperBrick(brick, q, solidFrom, yTop);
    addQuad(brick,
      P(OUTER_A, OUTER_B, q.t0, inset, yTop), P(OUTER_A, OUTER_B, q.t1, inset, yTop),
      P(OUTER_A, OUTER_B, q.t1, inset + WALL2_T, yTop), P(OUTER_A, OUTER_B, q.t0, inset + WALL2_T, yTop), [0, 1, 0]);
  }
  // Third wall: solid, so a view through the arcades ends on brick rather than the far sky.
  // Tall enough to close the third-order arches. Above it the outer attic is solid.
  solidRing(brick, OUTER_A, OUTER_B, WALL3, WALL3_T, 0.42,
    i => 29.5 + 1.7 * Math.sin(i * 1.15), 0, STANDING_TO);
  solidRing(brick, OUTER_A, OUTER_B, 23, WALL3_T, 0.42,
    i => 18.5 + 2 * Math.sin(i * 0.91), STANDING_TO+1, BAYS-1);
  // Cavea terraces and the arena podium, stepping down toward the sand.
  solidRing(brick, OUTER_A, OUTER_B, 24, 1.35, 0.42, () => 15.2, 0, BAYS - 1, detail === 'far' ? 4 : 1);
  solidRing(brick, OUTER_A, OUTER_B, 33.5, 1.2, 0.42, () => 10.4, 0, BAYS - 1);
  // Podium: inner face on the arena ellipse, thickness outward.
  solidRing(brick, ARENA_A, ARENA_B, -2.15, 2.15, 0.15, () => 6.3, 0, BAYS - 1, detail === 'far' ? 4 : 1);
  // Radial ribs under the missing seats. Every other bay near, every fourth far.
  const step = detail === 'near' ? 2 : 4;
  for (let i = 0; i < BAYS; i += step) {
    const t = bay(i).tC;
    const tg = ellipseTangent(OUTER_A, OUTER_B, t);
    const thick = 0.32;
    const inset0 = 17.4, inset1 = 44;
    const yOb = 7.2, yOt = 16.2, yIb = 6.3, yIt = 8.4;
    const at = (inset, y, s) => {
      const p = P(OUTER_A, OUTER_B, t, inset, y);
      return [p[0] + tg[0] * s, y, p[2] + tg[1] * s];
    };
    const hintL = [-tg[0], 0, -tg[1]], hintR = [tg[0], 0, tg[1]];
    addQuad(brick, at(inset0, yOb, -thick), at(inset1, yIb, -thick), at(inset1, yIt, -thick), at(inset0, yOt, -thick), hintL);
    addQuad(brick, at(inset0, yOb, thick), at(inset0, yOt, thick), at(inset1, yIt, thick), at(inset1, yIb, thick), hintR);
    addQuad(brick, at(inset0, yOt, -thick), at(inset0, yOt, thick), at(inset1, yIt, thick), at(inset1, yIt, -thick), [0, 1, 0]);
  }
}

function hypogeum(mesh, floor, detail) {
  const au = 40.2, av = 24.6;
  const y0 = 0.16, y1 = 3.35, th = 0.5;
  const gapU = 3.6, gapV = 2.7;
  const vStep = detail === 'near' ? 3.35 : 6.7;
  const uStep = detail === 'near' ? 3.9 : 7.8;
  const inside = (u, v) => (u / au) ** 2 + (v / av) ** 2 < 1;
  const box = (u0, v0, u1, v1) => {
    if (u1 - u0 < 0.4 || v1 - v0 < 0.4) return;
    const c = [(u0 + u1) / 2, (v0 + v1) / 2];
    if (!inside(c[0], c[1])) return;
    const p = (u, v, y) => uv(u, v, y);
    const uHat = uv(1, 0, 0), vHat = uv(0, 1, 0);
    const pts = [
      p(u0, v0, y0), p(u1, v0, y0), p(u1, v1, y0), p(u0, v1, y0),
      p(u0, v0, y1), p(u1, v0, y1), p(u1, v1, y1), p(u0, v1, y1),
    ];
    addQuad(mesh, pts[4], pts[5], pts[6], pts[7], [0, 1, 0]);
    addQuad(mesh, pts[0], pts[1], pts[5], pts[4], [-vHat[0], 0, -vHat[2]]);
    addQuad(mesh, pts[2], pts[3], pts[7], pts[6], [vHat[0], 0, vHat[2]]);
    addQuad(mesh, pts[3], pts[0], pts[4], pts[7], [-uHat[0], 0, -uHat[2]]);
    addQuad(mesh, pts[1], pts[2], pts[6], pts[5], [uHat[0], 0, uHat[2]]);
  };
  for (let v = -av + 1.2; v < av - 1; v += vStep) {
    if (Math.abs(v) < gapV) continue;
    const half = au * Math.sqrt(Math.max(0, 1 - (v / av) ** 2)) - 0.8;
    box(-half, v - th / 2, -gapU, v + th / 2);
    box(gapU, v - th / 2, half, v + th / 2);
  }
  for (let u = -au + 1.4; detail === 'near' && u < au - 1; u += uStep) {
    if (Math.abs(u) < gapU) continue;
    const half = av * Math.sqrt(Math.max(0, 1 - (u / au) ** 2)) - 0.6;
    const cross = [];
    for (let v = -av + 1.2; v < av - 1; v += vStep) if (Math.abs(v) >= gapV && Math.abs(u) < au * Math.sqrt(Math.max(0, 1 - (v / av) ** 2)) - 0.8) cross.push(v);
    for (const [lo, hi] of [[-half, -gapV], [gapV, half]]) {
      let start = lo;
      for (const v of cross.filter(v => v > lo && v < hi)) {
        box(u - th / 2, start, u + th / 2, v - th / 2);
        start = v + th / 2;
      }
      box(u - th / 2, start, u + th / 2, hi);
    }
  }
  // Dark floor of the arena so the passages read as pits.
  const c = [0, 0.12, 0], nSeg = detail === 'near' ? 48 : 28;
  const fu = ARENA_A - 0.15, fv = ARENA_B - 0.15;
  for (let i = 0; i < nSeg; i++) {
    const t0 = (i / nSeg) * Math.PI * 2, t1 = ((i + 1) / nSeg) * Math.PI * 2;
    const [x0, z0] = ellipse(fu, fv, t0), [x1, z1] = ellipse(fu, fv, t1);
    addTri(floor, c, [x0, 0.12, z0], [x1, 0.12, z1], [0, 1, 0]);
  }
}

// Close height changes between neighboring bays, including the circular wrap seam.
function closeRuinTops(brick,detail) {
  const top=i=>innerCrown(detail==='far' && standing(i)?i-i%2:i);
  for(let i=0;i<BAYS;i++){
    const before=top((i+BAYS-1)%BAYS),after=top(i),t=bay(i).t0,tg=ellipseTangent(OUTER_A,OUTER_B,t);
    if(Math.abs(before-after)>0.01) cap(brick,OUTER_A,OUTER_B,t,standing(i)?WALL2:WALL3,(standing(i)?WALL2:WALL3)+WALL2_T,Math.min(before,after),Math.max(before,after),before>after?[tg[0],0,tg[1]]:[-tg[0],0,-tg[1]]);
  }
}

// Nineteenth-century eastern brick buttress, a broad triangular support touching the shell.
function eastButtress(brick) {
  const t=bay(1).t0, n=ellipseNormal(OUTER_A,OUTER_B,t), tg=ellipseTangent(OUTER_A,OUTER_B,t);
  const at=(s,d,y)=>{const p=P(OUTER_A,OUTER_B,t,d,y);return [p[0]+tg[0]*s,y,p[2]+tg[1]*s];};
  const a=at(0,0,0.42),b=at(-6,9.5,0.42),c=at(0,0,HEIGHT-0.15);
  const d=at(0,3.1,0.42),e=at(-6,12.6,0.42),f=at(0,3.1,HEIGHT-0.15);
  addTri(brick,a,b,c,[n[0],0,n[1]]);addTri(brick,d,f,e,[-n[0],0,-n[1]]);
  addQuad(brick,b,e,f,c,[-tg[0],0.3,-tg[1]]);
}

export function buildColosseum(detail) {
  const stone = mesh(), brick = mesh(), hypo = mesh(), voids = mesh();
  steps(stone, detail);
  outerWall(stone, voids, detail);
  innerWalls(brick, detail);
  eastButtress(brick);
  closeRuinTops(brick,detail);
  hypogeum(hypo, voids, detail);
  return [
    { material: 'travertine', geometry: toGeom(stone) },
    { material: 'brick', geometry: toGeom(brick) },
    { material: 'hypogeum', geometry: toGeom(hypo) },
    { material: 'void', geometry: toGeom(voids) },
  ];
}
