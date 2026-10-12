import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { triangles, meshesOf, layeredFaces, LAYER_GAP, windowFacades, windowRhythm, memberEnds } from './qa-metrics.mjs';
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
