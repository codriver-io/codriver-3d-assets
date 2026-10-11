import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { kit, toLocal } from './catedral-metropolitana-san-jose-kit.js';

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const k = kit(b, near), { box, put, lathe, bar, frame } = k;
  // Complete cathedral provider envelope, excluding the open west porch; no Curia ownership.
  const outline = FOOTPRINTS[0].slice(0, -1).map(toLocal);
  outline[0][1] = 39; outline[17][1] = 39;
  k.plan('stone', outline, 0, 10.8);
  const roofOutline = outline.map(v => [...v]);
  roofOutline[0][1] = 33.5; roofOutline[17][1] = 33.5;
  k.plan('roof', roofOutline, 10.8, 11.15);
  k.wedge('roof', -5.5, 12.5, -31.5, 35.1, 11.15, 14.4);
  k.wedge('roof', -24.65, -10.15, -36.2, -11.3, 11.15, 12.3);
  for (const [a, c] of [[-9.5, -5.5], [12.5, 17.1]]) k.wedge('roof', a, c, -11.5, 35, 11.2, 11.8);
  // Arched nave windows, engaged pilasters and the long three-step cornice.
  for (const [x, yaw] of [[-10.05, -Math.PI / 2], [17.5, Math.PI / 2]]) {
    const f = frame(x, 14, yaw);
    f.box('shade', -25.8, 24.9, 0.35, 0.85, 0.01, 0.16);
    for (const [y, h, d] of [[10.15, 0.3, 0.22], [10.6, 0.28, 0.35], [11, 0.25, 0.48]]) f.box('trim', -25.8, 24.9, y, y + h, 0.02, d);
    for (let s = -21; s <= 21; s += 6) {
      f.arch('glow', s, 2.8, 2.65, 5.2, 0.08);
      f.archTrim('trim', s, 2.8, 2.65, 5.2, 0.18, 0.14);
      f.box('trim', s - 1.5, s + 1.5, 2.6, 2.82, 0.04, 0.28);
      f.box('trim', s - 0.055, s + 0.055, 2.85, 6.6, 0.13, 0.24);
      f.box('trim', s - 1.22, s + 1.22, 4.6, 4.71, 0.13, 0.24);
      if (near) for (const j of [-0.62, 0.62]) f.box('bronze', s + j - 0.025, s + j + 0.025, 2.85, 6.6, 0.13, 0.2);
      const p = s + 3;
      f.box('trim', p - 0.26, p + 0.26, 1.05, 9.65, 0.03, 0.23);
      f.box('trim', p - 0.43, p + 0.43, 9.65, 10.02, 0.03, 0.36);
      if (near) for (const t of [-0.13, 0, 0.13]) f.box('shade', p + t - 0.018, p + t + 0.018, 1.6, 9.25, 0.24, 0.3);
    }
  }
  const rear = frame(-3.5, -36.9, Math.PI);
  for (const s of [-16, -10, -4, 2, 8, 14]) {
    rear.arch('glow', s, 2.5, 2.1, 4.8, 0.08);
    rear.archTrim('trim', s, 2.5, 2.1, 4.8, 0.19, 0.14);
  }
  rear.box('trim', -20, 20, 10.5, 10.85, 0.02, 0.24);
  const wing = frame(-25.05, -23.5, -Math.PI / 2);
  for (const s of [-9, -3, 3, 9]) {
    wing.arch('glow', s, 2.5, 2.1, 4.8, 0.08);
    wing.archTrim('trim', s, 2.5, 2.1, 4.8, 0.19, 0.14);
    wing.box('trim', s + 2.7, s + 3.15, 0.6, 10.1, 0.02, 0.25);
  }
  wing.box('trim', -12.5, 12.5, 10.5, 10.85, 0.02, 0.3);
  // Broad raised stair inside the mapped porch. The columns stand in genuine negative space.
  for (let i = 0; i < 5; i++) box('shade', 3.5, (i + 1) * 0.12, 42.1 - i * 0.25, 25.6, (i + 1) * 0.24, 5.65 - i * 0.5);
  box('trim', 3.5, 1.26, 42, 25.7, 0.12, 5.5);
  box('stone', 3.5, 15.5, 36.35, 25.8, 9.4, 5.3);
  const front = frame(3.5, 39.02, 0);
  for (const s of [-8.6, 0, 8.6]) {
    front.arch('glass', s, 1.33, s === 0 ? 3.4 : 2.7, 6.5, 0.1);
    front.archTrim('trim', s, 1.33, s === 0 ? 3.4 : 2.7, 6.5, 0.22, 0.18);
    front.box('bronze', s - 0.06, s + 0.06, 1.4, 6.2, 0.15, 0.21);
    if (near) for (const dx of [-0.75, 0.75]) for (const yy of [2.3, 4.2]) front.box('bronze', s + dx - 0.5, s + dx + 0.5, yy, yy + 1.2, 0.16, 0.22);
  }
  for (const x of [-8.1, -3.46, 1.18, 5.82, 10.46, 15.1]) {
    box('trim', x, 1.62, 43.45, 1.3, 0.6, 1.3);
    lathe('trim', x, 43.45, [[0.58, 1.92], [0.66, 2.02], [0.65, 2.12], [0.54, 2.23], [0.52, 2.35]], near ? 24 : 8);
    k.flutedColumn(x, 43.45, 2.35, 10.3, 0.51, 0.43);
    lathe('trim', x, 43.45, [[0.43, 10.3], [0.5, 10.4], [0.58, 10.52], [0.6, 10.75]], near ? 24 : 8);
    box('trim', x, 10.89, 43.45, 1.34, 0.28, 1.34);
    if (near) for (const side of [-1, 1]) put(new THREE.TorusGeometry(0.17, 0.065, 6, 14).translate(x + side * 0.46, 10.61, 44.02), 'trim');
  }
  for (const [y, h, w, d, mat] of [[11.36, 0.66, 26.3, 5.6, 'trim'], [11.94, 0.48, 26.6, 5.9, 'stone'], [12.43, 0.5, 26.8, 6.05, 'trim'], [12.79, 0.22, 27, 6.15, 'trim']]) box(mat, 3.5, y, 42, w, h, d);
  k.pediment('stone', 3.5, 44.94, 9.4, 12.92, 1.85, 0.36);
  bar('trim', [-1.3, 12.94, 45.15], [3.5, 14.9, 45.15], 0.18);
  bar('trim', [3.5, 14.9, 45.15], [8.3, 12.94, 45.15], 0.18);
  for (const x of [-8.2, -4.3, -0.4, 7.4, 11.3, 15.2]) urn(x, 13, 44.48, 0.8);
  for (const [y, h, d] of [[14.2, 0.3, 0.34], [18.75, 0.45, 0.5], [19.5, 0.58, 0.75], [20.05, 0.24, 0.6]]) front.box('trim', -13.2, 13.2, y, y + h, 0.03, d);
  for (const s of [-12.3, -6.4, 0, 6.4, 12.3]) {
    front.box('trim', s - 0.25, s + 0.25, 13.4, 18.7, 0.03, 0.25);
    front.box('trim', s - 0.4, s + 0.4, 18.4, 18.75, 0.03, 0.4);
    if (near) for (const y of [14.7, 16.15]) front.box('shade', s - 0.14, s + 0.14, y, y + 0.4, 0.26, 0.36);
  }
  // Central clock attic and shallow pediment behind the twin belfries.
  box('stone', 3.5, 23, 36.85, 13.2, 5.5, 4.6);
  const attic = frame(3.5, 39.18, 0);
  for (const s of [-6.05, -4.95, 4.95, 6.05]) attic.box('trim', s - 0.23, s + 0.23, 20.4, 25.7, 0.02, 0.28);
  attic.box('trim', -6.9, 6.9, 25.6, 26.1, 0.02, 0.48);
  // Broken crest: two outer triangular shoulders and the curved central hood seen in the references.
  for (const x of [-1.65, 8.65]) k.pediment('stone', x, 39.6, 3.5, 26.1, 1.35, 1.1);
  const crest = new THREE.Shape([new THREE.Vector2(0.4, 26.1), new THREE.Vector2(6.6, 26.1), new THREE.Vector2(6.6, 27.1)]);
  crest.quadraticCurveTo(3.5, 29.05, 0.4, 27.1); crest.lineTo(0.4, 26.1);
  put(new THREE.ExtrudeGeometry(crest, { depth: 0.8, bevelEnabled: false, curveSegments: near ? 12 : 6 }).translate(0, 0, 38.8), 'stone');
  const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0.25, 27.15, 39.72), new THREE.Vector3(3.5, 29.18, 39.72), new THREE.Vector3(6.75, 27.15, 39.72));
  put(new THREE.TubeGeometry(curve, near ? 16 : 8, 0.12, near ? 6 : 4, false), 'trim');
  for (const x of [-1.65, 8.65]) {
    bar('trim', [x - 1.75, 26.15, 39.8], [x, 27.55, 39.8], 0.2);
    bar('trim', [x, 27.55, 39.8], [x + 1.75, 26.15, 39.8], 0.2);
  }
  clock(3.5, 23.1, 39.5, 1.1);
  k.cross(3.5, 28.4, 39, 1.7, 0.11);
  // Four genuinely perforated walls per belfry, with suspended bells and stepped cornices.
  for (const x of [-5.8, 12.8]) {
    box('stone', x, 20.7, 35.7, 6.1, 1.2, 6.1);
    for (const yaw of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
      const f = frame(x + Math.sin(yaw) * 3.04, 35.7 + Math.cos(yaw) * 3.04, yaw);
      f.openWall('stone', 6.1, 21.3, 29, 2.65, 22.15, 6, 0.55);
      f.archTrim('trim', 0, 22.15, 2.65, 6, 0.17, 0.16);
      for (const s of [-2.57, 2.57]) {
        f.box('trim', s - 0.22, s + 0.22, 21.5, 28.6, 0.01, 0.2);
        f.box('trim', s - 0.37, s + 0.37, 28.5, 28.85, 0.01, 0.32);
        if (near) for (const t of [-0.1, 0.1]) f.box('shade', s + t - 0.024, s + t + 0.024, 22, 28.1, 0.21, 0.27);
      }
    }
    bar('bronze', [x - 2.7, 27.3, 35.7], [x + 2.7, 27.3, 35.7], 0.17);
    bar('bronze', [x, 25.2, 35.7], [x, 27.3, 35.7], 0.13);
    lathe('bronze', x, 35.7, [[0.77, 24.5], [0.78, 24.65], [0.5, 24.9], [0.29, 25.5], [0, 25.65]], near ? 16 : 8);
    for (const [y, h, w] of [[29.18, 0.36, 6.45], [29.58, 0.44, 6.9], [30.03, 0.3, 6.65]]) box('trim', x, y, 35.7, w, h, w);
    for (const dx of [-2.65, 0, 2.65]) for (const dz of [-2.65, 2.65]) box('stone', x + dx, 30.45, 35.7 + dz, 0.46, 0.55, 0.46);
    lathe('stone', x, 35.7, [[2.15, 30.18], [2.15, 31], [2.28, 31.13]], near ? 16 : 8);
    if (near) for (let i = 0; i < 16; i++) {
      const a = i * Math.PI / 8, f = frame(x + 2.17 * Math.sin(a), 35.7 + 2.17 * Math.cos(a), a);
      f.box('glass', -0.14, 0.14, 30.44, 30.85, 0, 0.035);
    }
    dome(x, 35.7, 2.25, 31.13, 1.45);
    k.cross(x, 32.58, 35.7, 1.92, 0.12);
  }
  // Side cupolas stand at the mapped chapel projections. Their detailed heights are estimates.
  for (const x of [-10.25, 18.1]) {
    box('stone', x, 5.7, 6.7, 8, 11.4, 7);
    box('trim', x, 11.6, 6.7, 8.1, 0.4, 7.1);
    lathe('stone', x, 6.7, [[3.45, 11.8], [3.45, 16.45], [3.62, 16.7]], near ? 24 : 12);
    for (let i = 0; i < (near ? 12 : 8); i++) {
      const a = i * Math.PI * 2 / (near ? 12 : 8), f = frame(x + Math.sin(a) * 3.48, 6.7 + Math.cos(a) * 3.48, a);
      f.arch('glass', 0, 12.6, 0.83, 3.25, 0.08);
      if (near) f.archTrim('trim', 0, 12.6, 0.83, 3.25, 0.13, 0.14);
    }
    dome(x, 6.7, 3.6, 16.7, 3);
    k.cross(x, 19.7, 6.7, 1.2, 0.1);
    const yaw = x < 0 ? -Math.PI / 2 : Math.PI / 2;
    const f = frame(x + (x < 0 ? -4.08 : 4.08), 6.7, yaw);
    f.arch('glass', 0, 0.7, 2.3, 6.3, 0.08);
    f.archTrim('trim', 0, 0.7, 2.3, 6.3, 0.22, 0.16);
    for (const s of [-2.7, 2.7]) {
      f.box('trim', s - 0.34, s + 0.34, 0.3, 9.6, 0.03, 0.3);
      f.box('trim', s - 0.5, s + 0.5, 9.3, 9.7, 0.03, 0.4);
    }
    f.box('trim', -3.2, 3.2, 9.7, 10.35, 0.02, 0.4);
    // Shallow side-entrance pediment in the facade frame.
    const shape = new THREE.Shape([new THREE.Vector2(-3.2, 10.35), new THREE.Vector2(3.2, 10.35), new THREE.Vector2(0, 11.7)]);
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: false });
    g.applyMatrix4(new THREE.Matrix4().makeRotationY(yaw).setPosition(x + (x < 0 ? -4.1 : 4.1), 0, 6.7)); put(g, 'trim');
  }
  if (near) for (let z = -30; z < 33; z += 3.5) {
    bar('shade', [-5.5, 11.25, z], [3.5, 14.45, z], 0.045);
    bar('shade', [3.5, 14.45, z], [12.5, 11.25, z], 0.045);
  }
  return b.finish();

  function urn(x, y, z, h) {
    box('trim', x, y + 0.12, z, 0.5, 0.24, 0.5);
    lathe('trim', x, z, [[0.16, y + 0.24], [0.14, y + 0.38], [0.27, y + h * 0.8], [0.22, y + h], [0.09, y + h + 0.09]], near ? 12 : 6);
  }
  function dome(x, z, radius, y, rise) {
    const profile = [[radius, y]], n = near ? 8 : 4;
    for (let i = 1; i <= n; i++) { const a = i * Math.PI / 2 / n; profile.push([i === n ? 0 : radius * Math.cos(a), y + rise * Math.sin(a)]); }
    lathe('copper', x, z, profile, near ? 32 : 12);
    if (near) for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      for (let j = 0; j < 8; j++) {
        const p = q => [x + (radius + 0.035) * Math.cos(q) * Math.sin(a), y + (rise + 0.035) * Math.sin(q), z + (radius + 0.035) * Math.cos(q) * Math.cos(a)];
        bar('copper', p(j * Math.PI / 16), p((j + 1) * Math.PI / 16), 0.065);
      }
    }
  }
  function clock(x, y, z, radius) {
    put(new THREE.CircleGeometry(radius, near ? 32 : 12).translate(x, y, z), 'trim');
    put(new THREE.TorusGeometry(radius, 0.1, 6, near ? 32 : 12).translate(x, y, z + 0.09), 'shade');
    bar('glass', [x, y, z + 0.14], [x - 0.13, y + 0.72, z + 0.14], 0.085);
    bar('glass', [x, y, z + 0.14], [x + 0.5, y + 0.16, z + 0.14], 0.08);
    if (near) for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      bar('glass', [x + Math.sin(a) * 0.78, y + Math.cos(a) * 0.78, z + 0.14], [x + Math.sin(a) * 0.9, y + Math.cos(a) * 0.9, z + 0.14], 0.04);
    }
  }
}
