import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Box3, Vector3, Raycaster } from 'three';
import { create } from './geometry.js';
import { createLandmarkGLTFLoader } from '../../landmark-loader.js';

for (const detail of ['near', 'far']) test(`${detail}: source and export retain a tall, all-sided pineapple above the bowl`, async () => {
  const bytes = await readFile(`public/models/buildings/pineapple-fountain-charleston-${detail}.glb`);
  const exported = (await createLandmarkGLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')).scene;
  for (const root of [create({ detail }), exported]) {
    root.updateMatrixWorld(true);
    const fruit = new Box3(), surfaces = [];
    let triangles = 0;
    root.traverse(o => {
      if (!o.isMesh) return;
      triangles += (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3;
      if (o.material.name === 'fruit') fruit.union(new Box3().setFromObject(o));
      if (['fruit', 'bronze'].includes(o.material.name)) surfaces.push(o);
    });
    const size = fruit.getSize(new Vector3());
    assert.ok(size.x >= 1.9 && size.x <= 2.06, `fruit width ${size.x}`);
    assert.ok(size.y >= 1.7 && size.y / size.x >= .8, `ovoid ratio ${size.y / size.x}`);
    assert.ok(fruit.max.y - 2.18 >= 1.6, 'fruit must stand clear above the upper bowl lip');
    assert.ok(Math.abs(new Box3().setFromObject(root).max.y - .14 - 5) < .02, 'crown about 5 m above basin water');
    assert.ok(triangles < (detail === 'near' ? 10000 : 3500));
    for (const y of [2.5, 3, 3.5]) for (let i = 0; i < 16; i++) {
      // Sample off the radial seam vertices to avoid exact-edge ray roundoff.
      const a = (i + .173) * Math.PI / 8, origin = new Vector3(3 * Math.sin(a), y, 3 * Math.cos(a));
      const direction = new Vector3(-Math.sin(a), 0, -Math.cos(a));
      const hit = new Raycaster(origin, direction, 0, 5).intersectObjects(surfaces, false)[0];
      assert.ok(hit, `missing fruit skin at height ${y}, bearing ${i}`);
      const radius = Math.hypot(hit.point.x, hit.point.z);
      assert.ok(radius > .6 && radius < 1.06, `fruit surface radius ${radius}`);
    }
  }
});
