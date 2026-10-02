import * as THREE from 'three';
import { TOWER, Y } from './calgary-city-hall-plan.js';
import { column, edgeFrame, openingFrame, openingPanel, prismRing, rectFrame, rectRing, solidFromFaces, wallBox } from './calgary-city-hall-solids.js';

// The clock tower: a 12.8 m base block with the round-arched entrance, a stepped shaft with three window tiers, a belt
// course, the clock stage with four dials and round corner columns, a cornice with four corner cupolas, and a steep tile
// pyramid with a finial. Height to the finial 32.7 m ("more than 32 m / 100 ft", City of Calgary).
// `ctx` supplies the shared drawing helpers of geometry.js: near, put (building frame), at(frame) (wall-local), strips, quoins.
export const TOWER_STAGES = { baseTop: Y.baseTop, shaftTop: Y.shaftTop, stageTop: Y.stageTop, dial: Y.dial, apex: Y.apex, finial: Y.finial };

export function buildTower(ctx) {
  const { near, put, at, strips, quoins } = ctx;
  const { cu, cv, half, stage, base } = TOWER;
  const box = (m, u0, u1, y0, y1, v0, v1, bottom = false) => {
    const g = new THREE.BoxGeometry(u1 - u0, y1 - y0, v1 - v0); g.translate((u0 + u1) / 2, (y0 + y1) / 2, (v0 + v1) / 2);
    if (!bottom) { const p = g.attributes.position, n = g.attributes.normal, idx = g.index, keep = []; for (let i = 0; i < idx.count; i += 3) { const a = idx.getX(i); if (n.getY(a) < -0.5) continue; keep.push(idx.getX(i), idx.getX(i + 1), idx.getX(i + 2)); } g.setIndex(keep); void p; }
    put(g, m);
  };

  // ---- masses ---------------------------------------------------------------------------------------------------
  box('stone', base.u0, base.u1, 0, 7.6, base.v0, base.v1);
  put(prismRing(rectRing(base.u0 - 0.3, base.u1 + 0.3, base.v0 - 1.6, -13.5), 0, Y.plinth), 'stone'); // plinth and porch platform (1.6 m deep) of the base block
  put(prismRing(rectRing(base.u0 - 0.35, base.u1 + 0.35, base.v0 - 0.35, -12.0), 7.3, Y.baseTop, { bottom: true }), 'trim'); // belt course / weathered shoulder
  box('stone', cu - half, cu + half, 7.6, 21.9, cv - half, cv + half);
  put(prismRing(rectRing(cu - 4.6, cu + 4.6, cv - 4.6, cv + 4.6), Y.shaftTop, Y.stageBottom, { bottom: true }), 'trim');
  box('stone', cu - stage, cu + stage, 22.0, 26.4, cv - stage, cv + stage);
  put(prismRing(rectRing(cu - 4.5, cu + 4.5, cv - 4.5, cv + 4.5), Y.stageTop, Y.corniceTop, { bottom: true }), 'trim');
  // steep pyramid, base 5 m square on the cornice, apex 32.0 m
  const apex = [cu, Y.apex, cv], bs = 2.5, e = [[cu - bs, Y.corniceTop - 0.2, cv - bs], [cu + bs, Y.corniceTop - 0.2, cv - bs], [cu + bs, Y.corniceTop - 0.2, cv + bs], [cu - bs, Y.corniceTop - 0.2, cv + bs]];
  { // the eave sits 0.2 m inside the cornice top so the pyramid and the cornice never share a plane
    const pos = []; for (let i = 0; i < 4; i++) { const a = e[i], c = e[(i + 1) % 4]; const f = [a, c, apex]; const nrm = new THREE.Vector3().crossVectors(new THREE.Vector3(...c).sub(new THREE.Vector3(...a)), new THREE.Vector3(...apex).sub(new THREE.Vector3(...a))); const out = new THREE.Vector3((a[0] + c[0]) / 2 - cu, 0.2, (a[2] + c[2]) / 2 - cv); if (nrm.dot(out) < 0) f.reverse(); pos.push(...f.flat()); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); put(g, 'roof');
  }
  { const g = new THREE.ConeGeometry(0.16, Y.finial - Y.apex + 0.3, near ? 6 : 4); g.translate(cu, (Y.apex - 0.3 + Y.finial) / 2, cv); put(g, 'trim'); }
  // round corner columns of the clock stage and the four cupolas on the cornice
  for (const [du, dv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const u = cu + du * 4.0, v = cv + dv * 4.0;
    put(column(u, v, 22.4, 26.5, 0.5, 0.5, near ? 8 : 5), 'stone');
    put(column(u, v, Y.corniceTop - 0.1, 27.9, 0.5, 0.5, near ? 8 : 5), 'trim');
    put(column(u, v, 27.9, 29.2, 0.62, 0.02, near ? 8 : 5, { capBottom: false }), 'roof');
  }

  // ---- faces ----------------------------------------------------------------------------------------------------
  const shaft = rectRing(cu - half, cu + half, cv - half, cv + half), stageRing = rectRing(cu - stage, cu + stage, cv - stage, cv + stage);
  const faces = ['N', 'E', 'S', 'W'];
  const dialAt = (f, M) => {
    const lampSeg = near ? 28 : 12, c = at(M);
    const disc = new THREE.CircleGeometry(Y.dialR, lampSeg); disc.translate(stage, Y.dial, 0.1); c(disc, 'lamp');
    const ring = new THREE.RingGeometry(Y.dialR, Y.dialR + 0.3, lampSeg); ring.translate(stage, Y.dial, 0.2); c(ring, 'trim');
    if (!near) return;
    for (let k = 0; k < 12; k++) { // hour ticks
      const a = (k * Math.PI) / 6, big = k % 3 === 0, g = new THREE.PlaneGeometry(big ? 0.13 : 0.08, big ? 0.34 : 0.22);
      g.rotateZ(-a); g.translate(stage + Math.sin(a) * 1.18, Y.dial + Math.cos(a) * 1.18, 0.14); c(g, 'glass');
    }
    [[1.2, 0.1, (2 * Math.PI) / 12 * 2, 0.17], [0.8, 0.15, (Math.PI * 2) * (10 + 10 / 60) / 12, 0.15]].forEach(([len, w, ang, d]) => { // hands at ten past ten
      const g = new THREE.PlaneGeometry(w, len); g.translate(0, len / 2, 0); g.rotateZ(-ang); g.translate(stage, Y.dial, d); c(g, 'glass');
    });
    void f;
  };
  const stageFrames = stageRing.map((A, i) => edgeFrame(A, stageRing[(i + 1) % 4]));
  stageFrames.forEach((fr, i) => {
    dialAt(faces[i], fr.M);
    // round window in the tile roof face, tilted to the 64 degree pitch
    const c = at(fr.M), tilt = Math.atan2(2.5, 5.2);
    const oc = new THREE.CircleGeometry(0.42, near ? 12 : 6); oc.rotateX(-tilt); oc.translate(stage, 28.15, -(stage - 1.86) + 0.12); c(oc, 'glass');
    if (near) { const orr = new THREE.RingGeometry(0.42, 0.62, 12); orr.rotateX(-tilt); orr.translate(stage, 28.15, -(stage - 1.86) + 0.2); c(orr, 'trim'); }
  });

  // shaft faces: coursing, quoins and three window tiers
  const sFrames = shaft.map((A, i) => edgeFrame(A, shaft[(i + 1) % 4]));
  sFrames.forEach((fr, i) => {
    const c = at(fr.M), front = i === 0, L = fr.L, mid = L / 2, pitch = 2.5;
    if (near) { strips(fr, front ? 8.1 : 12.5, 21.4); quoins(fr, front ? 8.1 : 12.6, 21.3, { both: true }); }
    const tier = (y0, h, w, kind) => {
      for (const k of [-1, 0, 1]) {
        const s = mid + k * pitch;
        if (!near) { c(kind === 'arch' ? openingPanel(s, y0, w, h, 0.1, 2) : new THREE.PlaneGeometry(w, h).translate(s, y0 + h / 2, 0.1), 'glass'); continue; }
        c(kind === 'arch' ? openingPanel(s, y0, w, h, 0.12, 5) : new THREE.PlaneGeometry(w, h).translate(s, y0 + h / 2, 0.12), 'glass');
        c(kind === 'arch' ? openingFrame(s, y0, w, h, 0.3, 0.3, 5) : rectFrame(s, y0, w, h, 0.25, 0.3), 'trim');
        if (kind === 'rect') c(wallBox(s - w / 2 - 0.35, s + w / 2 + 0.35, y0 - 0.25, y0, 0, 0.36, 'fudlr'), 'trim');
        if (kind === 'rect' && h > 2.5) c(wallBox(s - w / 2, s + w / 2, y0 + h * 0.55, y0 + h * 0.55 + 0.09, 0.12, 0.2, 'fud'), 'trim'); // transom
      }
    };
    if (front) { tier(8.4, 3.4, 1.15, 'rect'); tier(14.1, 1.9, 1.15, 'rect'); }
    tier(18.0, 2.2, 1.15, 'arch');
  });

  // entrance on the front of the base block: a round arch on four red granite columns, dark doors, a stair and lamps
  const front = edgeFrame([base.u0, base.v0], [base.u1, base.v0]), c = at(front.M), sc = (base.u1 - cu), W = 4.4, sp = Y.plinth, crown = 4.6;
  if (near) { strips(front, 1.95, 7.0, { skip: [[sc - 3.1, sc + 3.1]] }); quoins(front, 1.7, 7.0, { both: true }); }
  c(openingPanel(sc, sp, W, crown, 0.12, near ? 10 : 4), 'glass');
  c(openingFrame(sc, sp, W, crown, 0.65, 0.45, near ? 10 : 4), 'trim');
  if (near) {
    for (const s of [sc - 1.1, sc, sc + 1.1]) c(wallBox(s - 0.05, s + 0.05, sp, sp + 2.45, 0.14, 0.2, 'flr'), 'trim'); // door mullions
    c(wallBox(sc - W / 2, sc + W / 2, sp + 2.4, sp + 2.5, 0.14, 0.2, 'fu'), 'trim'); // transom
    c(wallBox(sc - 0.3, sc + 0.3, 6.4, 7.3, 0.4, 0.58, 'fulr'), 'trim'); // carved shield over the keystone
    for (const side of [-1, 1]) {
      for (const off of [2.5, 3.15]) { // the four red granite columns
        const g = new THREE.CylinderGeometry(0.25, 0.25, 2.1, 8, 1, true); g.translate(sc + side * off, sp + 0.15 + 1.05, 0.95); c(g, 'granite');
      }
      c(wallBox(sc + side * 2.8 - 0.75, sc + side * 2.8 + 0.75, 3.65, 4.05, 0.45, 1.45, 'fudlr'), 'trim'); // capitals
      c(wallBox(sc + side * 2.8 - 0.75, sc + side * 2.8 + 0.75, sp, sp + 0.15, 0.45, 1.45, 'fulr'), 'trim'); // bases
    }
  }
  if (!near) for (const side of [-1, 1]) c(wallBox(sc + side * 2.8 - 0.75, sc + side * 2.8 + 0.75, sp, 4.05, 0.45, 1.45, 'fulr'), 'granite');
  // stair: seven steps below the porch platform, sloping cheeks and two globe lamps
  const stairW = 2.95, v0 = base.v0 - 1.6;
  const cheek = (u0, u1) => solidFromFaces([
    [[u0, 2.0, v0 + 0.2], [u1, 2.0, v0 + 0.2], [u1, 0.9, v0 - 2.1], [u0, 0.9, v0 - 2.1]],
    [[u0, 0, v0 - 2.1], [u1, 0, v0 - 2.1], [u1, 0.9, v0 - 2.1], [u0, 0.9, v0 - 2.1]],
    [[u0, 0, v0 + 0.2], [u0, 0, v0 - 2.1], [u0, 0.9, v0 - 2.1], [u0, 2.0, v0 + 0.2]],
    [[u1, 0, v0 + 0.2], [u1, 0, v0 - 2.1], [u1, 0.9, v0 - 2.1], [u1, 2.0, v0 + 0.2]],
  ], [(u0 + u1) / 2, 0.3, v0 - 0.5]);
  if (near) {
    for (let j = 1; j <= 7; j++) box('stone', cu - stairW, cu + stairW, 0, 0.2 * j, v0 - 0.3 * (8 - j), v0 - 0.3 * (7 - j));
  } else {
    box('stone', cu - stairW, cu + stairW, 0, 0.6, v0 - 2.1, v0 - 1.0);
    box('stone', cu - stairW, cu + stairW, 0, 1.4, v0 - 1.0, v0);
  }
  for (const side of [-1, 1]) {
    const ua = cu + side * stairW, ub = cu + side * (stairW + 0.5);
    put(cheek(Math.min(ua, ub), Math.max(ua, ub)), 'stone');
    if (!near) continue;
    const lu = cu + side * (stairW + 0.25);
    put(column(lu, v0 - 0.1, 1.8, 3.0, 0.06, 0.06, 5), 'glass');
    const g = new THREE.SphereGeometry(0.28, 8, 6); g.translate(lu, 3.25, v0 - 0.1); put(g, 'lamp');
  }
}
