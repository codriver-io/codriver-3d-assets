import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Group, Mesh, MeshStandardMaterial, BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { compressLandmarkGLB, validateLandmarkConversion, readLandmarkGLB, LANDMARK_CODEC } from './lib/landmark-codec.mjs';
import { sceneMemory } from '../src/peregrine/facade/memory-account.js';

globalThis.FileReader ??= class { readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); }); } };
const decode = async bytes => (await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length), '')).scene;
const meshes = scene => { const found = []; scene.updateMatrixWorld(true); scene.traverse(o => { if (o.isMesh) found.push(o); }); return found; };
async function fixture() {
  const root = new Group(); root.name = 'authored root'; root.rotation.y = 0.7; root.userData.provenance = 'test';
  const material = new MeshStandardMaterial(); material.name = 'paint';
  for (let part = 0; part < 2; part++) {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute([0, 2, 0, 100, 2, 0, 0, 2, 300, 100, 2, 300], 3));
    g.setAttribute('normal', new Float32BufferAttribute([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], 3));
    g.setAttribute('bridgeLift', new Float32BufferAttribute([0, .25, .5, 1], 1));
    g.setAttribute('bridgeBase', new Float32BufferAttribute([-1, -1, 10, 10], 1));
    g.setIndex([2, 1, 0, 2, 3, 1]);
    const mesh = new Mesh(g, material); mesh.name = `named_${part}`;
    mesh.userData = { terrainOffsets: [[1, 2, 20]], bankRows: [{ first: 0, nx: 1, nz: 0 }] }; root.add(mesh);
  }
  return Buffer.from(await new GLTFExporter().parseAsync(root, { binary: true }));
}

test('landmark codec preserves vertices, indices, attributes, extras and coplanarity while quantizing GPU buffers', async () => {
  const original = await fixture(), encoded = await compressLandmarkGLB(original);
  await validateLandmarkConversion(original, encoded);
  const before = await decode(original), after = await decode(encoded), oldMeshes = meshes(before), newMeshes = meshes(after);
  const json = readLandmarkGLB(encoded).json, error = json.asset.extras.quantization.maxPositionErrorM;
  assert.equal(json.asset.extras.landmarkCodec, LANDMARK_CODEC);
  assert.deepEqual(json.extensionsRequired, ['KHR_mesh_quantization', 'EXT_meshopt_compression']);
  assert.equal(newMeshes.length, oldMeshes.length);
  for (let m = 0; m < oldMeshes.length; m++) {
    const old = oldMeshes[m], next = newMeshes[m];
    assert.equal(next.name, old.name); assert.equal(next.material.name, 'paint');
    assert.deepEqual(next.userData.terrainOffsets, old.userData.terrainOffsets);
    assert.deepEqual(next.userData.bankRows, old.userData.bankRows);
    assert.deepEqual([...next.geometry.index.array], [...old.geometry.index.array]);
    for (const key of ['_bridgelift', '_bridgebase']) assert.deepEqual([...next.geometry.attributes[key].array], [...old.geometry.attributes[key].array]);
    const pos = next.geometry.attributes.position, normal = next.geometry.attributes.normal;
    assert.ok(pos.array instanceof Int16Array); assert.equal(pos.normalized, true);
    assert.ok(normal.array instanceof Int8Array); assert.equal(normal.normalized, true);
    const source = next.geometry.attributes._codriver_position;
    assert.ok(source.array instanceof Float32Array);
    for (let i = 0; i < pos.count; i++) {
      const a = new Vector3().fromBufferAttribute(old.geometry.attributes.position, i).applyMatrix4(old.matrixWorld);
      const b = new Vector3().fromBufferAttribute(pos, i).applyMatrix4(next.matrixWorld);
      assert.ok(a.distanceTo(b) <= Math.sqrt(3) * error + 1e-6, `vertex ${i} retains world position`);
      assert.equal(pos.getY(i), newMeshes[1 - m].geometry.attributes.position.getY(i), 'coincident planes use one shared grid');
      assert.equal(normal.getY(i), 1);
      for (let k = 0; k < 3; k++) assert.equal(source.getComponent(i, k), old.geometry.attributes.position.getComponent(i, k), 'exact CPU authoring input survives compression');
    }
    next.geometry.deleteAttribute('_codriver_position');
  }
  assert.ok(sceneMemory(after).geometryBytes < sceneMemory(before).geometryBytes);
  assert.deepEqual(await compressLandmarkGLB(encoded), encoded, 'repeat conversion is a no-op');
});

test('semantic validator rejects changed material names and custom attachment values', async () => {
  const original = await fixture(), encoded = await compressLandmarkGLB(original);
  const renamed = Buffer.from(encoded), marker = renamed.indexOf(Buffer.from('"name":"paint"'));
  assert.ok(marker >= 0); renamed.write('faint', marker + 8);
  await assert.rejects(validateLandmarkConversion(original, renamed), /materials\/names\/extras changed/);
  const altered = Buffer.from(original), json = readLandmarkGLB(original).json;
  const accessor = json.accessors[json.meshes[0].primitives[0].attributes._BRIDGELIFT];
  const offset = 28 + altered.readUInt32LE(12) + (json.bufferViews[accessor.bufferView].byteOffset || 0) + (accessor.byteOffset || 0);
  altered.writeFloatLE(0.75, offset);
  await assert.rejects(validateLandmarkConversion(altered, encoded), /_BRIDGELIFT vertex\/index 0 changed/);
});

test('real bridge preserves custom attachment attributes and exact index order', async () => {
  const path = new URL('../public/models/landmarks/pont-jacques-cartier-far.glb', import.meta.url);
  const original = await readFile(path), encoded = await compressLandmarkGLB(original);
  const before = meshes(await decode(original)), after = meshes(await decode(encoded));
  assert.equal(after.length, before.length);
  for (let m = 0; m < before.length; m++) {
    assert.equal(after[m].name, before[m].name);
    assert.deepEqual(after[m].geometry.index.array, before[m].geometry.index.array);
    for (const key of ['_bridgelift', '_bridgebase']) assert.deepEqual(after[m].geometry.attributes[key].array, before[m].geometry.attributes[key].array);
  }
});

test('codec rejects unsupported transformed mesh leaves before changing source bytes', async () => {
  const mesh = new Mesh(new BufferGeometry(), new MeshStandardMaterial());
  mesh.geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 0, 1], 3));
  mesh.geometry.computeVertexNormals(); mesh.position.y = 3;
  const bytes = Buffer.from(await new GLTFExporter().parseAsync(mesh, { binary: true })), copy = Buffer.from(bytes);
  await assert.rejects(compressLandmarkGLB(bytes), /identity leaves/);
  assert.deepEqual(bytes, copy);
});

// Unlike a generic GLTFLoader, the shared loader removes the exact authoring
// stream before Three can upload every geometry attribute to a GPU buffer.
test('shared loader strips CPU authoring attributes and keeps exact metre-space access for legacy and packed scenes', async () => {
  const { createLandmarkGLTFLoader } = await import('../src/peregrine/landmarks/landmark-loader.js');
  const { modelPosition } = await import('../src/peregrine/landmarks/model-frame.js');
  const original = await fixture();
  const load = async bytes => (await createLandmarkGLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length), '')).scene;
  const before = await load(original), encoded = await load(await compressLandmarkGLB(original));
  const a = meshes(before), b = meshes(encoded);
  for (let m=0;m<a.length;m++) {
    assert.equal(b[m].geometry.attributes._codriver_position, undefined);
    const p=modelPosition(a[m]),q=modelPosition(b[m]);
    for(let i=0;i<p.count;i++)for(const method of ['getX','getY','getZ']) assert.equal(q[method](i),p[method](i));
  }
  assert.ok(sceneMemory(encoded).geometryBytes < sceneMemory(before).geometryBytes);
});
