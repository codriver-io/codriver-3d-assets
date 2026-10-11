import { readFile, realpath } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { validateSceneManifest } from './scene-manifest.js';
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');

/** Reject GLBs that would fetch external geometry or textures after download. */
export function inspectSceneGlb(bytes) {
  if (bytes.length < 20 || bytes.readUInt32LE(0) !== 0x46546c67 || bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length) throw new Error('Invalid GLB');
  const length = bytes.readUInt32LE(12);
  if (bytes.readUInt32LE(16) !== 0x4e4f534a || 20 + length > bytes.length) throw new Error('Invalid GLB JSON chunk');
  const gltf = JSON.parse(bytes.subarray(20, 20 + length).toString('utf8'));
  if ([...(gltf.buffers || []), ...(gltf.images || [])].some(v => v.uri)) throw new Error('External GLB dependency');
  let triangles = 0, meshes = 0;
  const walk = (index, ancestors = new Set()) => {
    const node = gltf.nodes?.[index];
    if (!node || ancestors.has(index)) throw new Error('Missing or cyclic scene node');
    if (node.mesh != null) {
      const mesh = gltf.meshes?.[node.mesh]; if (!mesh) throw new Error('Missing scene mesh'); meshes++;
      for (const p of mesh.primitives) {
        if ((p.mode ?? 4) !== 4) throw new Error('Scene presets require triangle primitives');
        const count = gltf.accessors?.[p.indices ?? p.attributes?.POSITION]?.count;
        if (!Number.isSafeInteger(count) || count % 3) throw new Error('Invalid scene primitive');
        triangles += count / 3;
      }
    }
    const next = new Set(ancestors).add(index); for (const child of node.children || []) walk(child, next);
  };
  const scene = gltf.scenes?.[gltf.scene ?? 0]; if (!scene) throw new Error('GLB has no default scene');
  for (const node of scene.nodes || []) walk(node);
  if (!triangles) throw new Error('Empty scene GLB');
  return { meshes, triangles };
}

export async function verifyScenePackage(directory) {
  const root = await realpath(directory), manifest = JSON.parse(await readFile(resolve(root, 'scene.json')));
  validateSceneManifest(manifest);
  const geometry = {};
  for (const [name, hash] of Object.entries(manifest.files)) {
    const path = await realpath(resolve(root, name));
    if (!path.startsWith(root + sep)) throw new Error('Package file outside scene');
    const bytes = await readFile(path);
    if (digest(bytes) !== hash) throw new Error(`Hash mismatch: ${name}`);
    if (name.endsWith('.glb')) geometry[name] = inspectSceneGlb(bytes);
  }
  return { verifiedFiles: Object.keys(manifest.files).length, frame: manifest.frame, modes: ['cityscape', 'world'], geometry,
    app: manifest.validation.app };
}
