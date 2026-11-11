import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { triangles, meshesOf, layeredFaces, LAYER_GAP, windowFacades, windowRhythm, memberEnds, backfaceSweep, extrasBytes, shadingSkew, gradeFaces, farOverhang } from './qa-metrics.mjs';
function box(scene, name, size, pos, angle = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(...size), new THREE.MeshBasicMaterial());
  m.material.name = name; m.position.set(...pos); m.rotation.z = angle; scene.add(m); return m;
}
const ts = s => triangles(meshesOf(s));
function windows({ columns = 8, rows = 8, height = 1.5, width = 1.2, wall = true } = {}) {
  const s = new THREE.Group();
  if (wall) box(s, 'stone', [32, 32, 2], [0, 16, 0]);
  for (let x = 0; x < columns; x++) for (let y = 0; y < rows; y++) box(s, 'glass', [width, height, 0.05], [x * 3 - 10, y * 3 + 3, 1.2]);
  return windowFacades(ts(s));
}
test('coarser separate windows retain rhythm; stripes, bands and blank walls are located', () => {
  const n = windows();
  assert.equal(windowRhythm(n, windows({ columns: 4, rows: 4 })).facades, 0);
  assert.ok(windowRhythm(n, windows({ columns: 8, rows: 1, height: 24 })).flags.some(f => f.reasons.includes('tall window stripes')));
  assert.ok(windowRhythm(n, windows({ columns: 1, rows: 4, width: 24 })).flags.some(f => f.reasons.includes('wide window bands')));
  assert.ok(windowRhythm(n, windows({ columns: 0 })).flags.some(f => f.reasons.includes('window coverage lost')));
  assert.equal(windowRhythm(windows({ columns: 1, rows: 1 }), windows({ columns: 0 })).facades, 0);
});
test('merged cable mesh: support, free tail, diagonal member and grade exemption', () => {
  const s = new THREE.Group();
  box(s, 'cable', [0.1, 10, 0.1], [0, 10, 0]);
  box(s, 'concrete', [2, 1, 2], [0, 5, 0]);
  let r = memberEnds(ts(s));
  assert.equal(r.tested, 1); assert.equal(r.ends, 1); assert.deepEqual(r.flags[0].at, [0, 15, 0]);
  box(s, 'concrete', [2, 1, 2], [0, 15, 0]);
  assert.equal(memberEnds(ts(s)).ends, 0);
  const d = new THREE.Group(); box(d, 'hanger', [0.1, 10, 0.1], [0, 15, 0], Math.PI / 4);
  assert.equal(memberEnds(ts(d)).ends, 2);
  const ground = new THREE.Group(); box(ground, 'rail', [10, 0.1, 0.1], [0, 0.1, 0]);
  assert.equal(memberEnds(ts(ground)).ends, 0);
  // Merged geometry still contains two disconnected members of one material.
  const merged = new THREE.Group(), a = new THREE.BoxGeometry(.1, 10, .1).toNonIndexed(), b = a.clone().translate(4, 0, 0);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([...a.attributes.position.array, ...b.attributes.position.array], 3));
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial()); m.material.name = 'cable'; m.position.y = 10; merged.add(m);
  assert.equal(memberEnds(ts(merged)).tested, 2); assert.equal(memberEnds(ts(merged)).ends, 4);
});
test('layer gaps differ by LOD; material ranks exempt ordered layers', () => {
  const s = new THREE.Group(); box(s, 'stone', [10, 10, 1], [0, 5, 0]); box(s, 'glass', [2, 2, .05], [0, 5, .6]);
  const t = ts(s); assert.ok(layeredFaces(t, LAYER_GAP.near).faces > 0);
  assert.equal(layeredFaces(t, LAYER_GAP.near, { glass: 1 }).faces, 0);
  s.children[1].position.z = .825;
  assert.equal(layeredFaces(ts(s), LAYER_GAP.near).faces, 0);
  assert.ok(layeredFaces(ts(s), LAYER_GAP.far).faces > 0);
});
test('grouped material faces are measured with their actual material', () => {
  const s = new THREE.Group(), stone = new THREE.MeshBasicMaterial(), glass = stone.clone(); stone.name = 'stone'; glass.name = 'glass';
  const g = new THREE.BoxGeometry(2, 2, 2); s.add(new THREE.Mesh(g, [stone, glass, stone, glass, stone, glass]));
  assert.equal(ts(s).filter(t => t.mat === 'glass').length, 6);
});
test('back-face sweep finds an open box from outside and locates the hit', () => {
  const closed = new THREE.Group(); box(closed, 'stone', [10, 10, 10], [0, 5, 0]);
  assert.equal(backfaceSweep(closed, new THREE.Box3().setFromObject(closed)).back, 0);
  const open = new THREE.Group(), g = new THREE.BoxGeometry(10, 10, 10);
  g.setIndex([...g.index.array].filter((_, i) => i < 12 || i >= 18)); // drop the top (+y) face
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial()); m.material.name = 'stone'; m.position.y = 5; open.add(m);
  const r = backfaceSweep(open, new THREE.Box3().setFromObject(open));
  assert.ok(r.back > 0 && r.at[0].material === 'stone');
});
test('GLB extras: QA data in node extras is counted, license metadata is not', () => {
  const contacts = Array.from({ length: 400 }, (_, i) => [i, i * 2, i * 3]);
  const r = extrasBytes({ asset: { extras: { license: 'CC-BY-4.0'.repeat(500) } }, nodes: [{ extras: { contacts } }, { name: 'plain' }] });
  assert.ok(r.bytes > 4096); assert.equal(r.top[0].key, 'contacts');
  assert.equal(extrasBytes({ asset: { extras: { license: 'x'.repeat(9000) } }, nodes: [{}] }).bytes, 0);
});
test('shading skew: slopes sharing vertices with a hidden bottom are skewed, split slopes are not', () => {
  // A pyramid roof whose base corners are shared by the four slopes and a downward bottom.
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([-5, 0, -5, 5, 0, -5, 5, 0, 5, -5, 0, 5, 0, 4, 0], 3));
  g.setIndex([0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0, 0, 1, 2, 0, 2, 3]); g.computeVertexNormals();
  const s = new THREE.Group(), m = new THREE.Mesh(g, new THREE.MeshBasicMaterial()); m.material.name = 'roof'; s.add(m);
  assert.ok(shadingSkew(ts(s)).top[0].areaM2 > 10);
  const flat = g.toNonIndexed(); flat.computeVertexNormals(); m.geometry = flat;
  assert.equal(shadingSkew(ts(s)).areaM2, 0);
});
test('faces on host grade: an up-facing plane within 5 cm of y=0 is flagged, a raised or downward one is not', () => {
  const plane = (y, up = true, name = 'moat') => { const s = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial()); m.material.name = name; m.rotation.x = up ? -Math.PI / 2 : Math.PI / 2; m.position.y = y; s.add(m); return s; };
  assert.equal(gradeFaces(ts(plane(0.02))).areaM2, 100);
  assert.equal(gradeFaces(ts(plane(0.15))).areaM2, 0);
  assert.equal(gradeFaces(ts(plane(0, false))).areaM2, 0);
  assert.equal(gradeFaces(ts(plane(0, true, 'asphalt'))).areaM2, 0); // host-fitted pavement
});
test('far faces bridging ground the near model leaves open are measured', () => {
  const near = new THREE.Group(); box(near, 'stone', [40, 10, 10], [0, 5, -15]); box(near, 'stone', [10, 10, 40], [-15, 5, 0]);
  const same = new THREE.Group(); box(same, 'stone', [40, 10, 10], [0, 5, -15]); box(same, 'stone', [10, 10, 40], [-15, 5, 0]);
  const hull = new THREE.Group(); box(hull, 'roof', [40, 10, 40], [0, 5, 0]);
  assert.equal(farOverhang(ts(near), ts(same)).areaM2, 0);
  const r = farOverhang(ts(near), ts(hull));
  assert.ok(r.areaM2 > 700 && r.areaM2 < 900, String(r.areaM2)); // the 30 x 30 m notch, less a cell of tolerance
  assert.equal(r.top[0].material, 'roof');
});
