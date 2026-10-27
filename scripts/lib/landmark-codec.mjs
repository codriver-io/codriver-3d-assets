// Order-preserving landmark codec. Unlike gltfpack, this retains custom vertex
// attributes and the vertex numbers stored by terrainOffsets / bankRows extras.
import { MeshoptEncoder } from 'meshoptimizer';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

export const LANDMARK_CODEC = 'codriver-meshopt-v2';
export async function exportLandmarkGLB(model, options = {}) {
  return compressLandmarkGLB(await new GLTFExporter().parseAsync(model, { ...options, binary: true }));
}
const SIZE = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 };
const WIDTH = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
const align = n => Math.ceil(n / 4) * 4;
const requireValue = (ok, message) => { if (!ok) throw new Error(`Landmark codec: ${message}`); };

export function readLandmarkGLB(input) {
  const bytes = Buffer.from(input);
  requireValue(bytes.length >= 28 && bytes.readUInt32LE(0) === 0x46546c67 && bytes.readUInt32LE(4) === 2 && bytes.readUInt32LE(8) === bytes.length, 'invalid GLB 2.0');
  const length = bytes.readUInt32LE(12), end = 20 + length;
  requireValue(bytes.readUInt32LE(16) === 0x4e4f534a && end + 8 <= bytes.length && bytes.readUInt32LE(end + 4) === 0x004e4942, 'expected JSON and BIN chunks');
  requireValue(end + 8 + bytes.readUInt32LE(end) === bytes.length, 'unexpected GLB chunks');
  return { json: JSON.parse(bytes.subarray(20, end)), bin: bytes.subarray(end + 8) };
}

function writeGLB(json, binary) {
  const text = Buffer.from(JSON.stringify(json)), data = Buffer.alloc(align(binary.length)); binary.copy(data);
  const header = Buffer.alloc(20), body = Buffer.alloc(align(text.length), 32), tail = Buffer.alloc(8); text.copy(body);
  header.writeUInt32LE(0x46546c67); header.writeUInt32LE(2, 4); header.writeUInt32LE(20 + body.length + 8 + data.length, 8);
  header.writeUInt32LE(body.length, 12); header.writeUInt32LE(0x4e4f534a, 16);
  tail.writeUInt32LE(data.length); tail.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, body, tail, data]);
}

function identity(node) {
  return (!node.matrix || node.matrix.every((n, i) => n === (i % 5 === 0 ? 1 : 0)))
    && (!node.translation || node.translation.every(n => n === 0))
    && (!node.scale || node.scale.every(n => n === 1))
    && (!node.rotation || node.rotation.every((n, i) => n === (i === 3 ? 1 : 0)));
}

/** Quantize and encode a self-contained static landmark, without reordering anything. */
export async function compressLandmarkGLB(input) {
  const { json: gltf, bin } = readLandmarkGLB(input);
  if (gltf.asset?.extras?.landmarkCodec === LANDMARK_CODEC) return Buffer.from(input);
  requireValue(!gltf.extensionsUsed?.includes('EXT_meshopt_compression') && !gltf.extensionsUsed?.includes('KHR_mesh_quantization'), 'input already uses another geometry codec');
  requireValue(gltf.buffers?.length === 1 && !gltf.buffers[0].uri && gltf.buffers[0].byteLength <= bin.length, 'requires one embedded buffer');
  requireValue(!gltf.animations?.length && !gltf.skins?.length && !gltf.images?.length, 'animated, skinned or textured input is unsupported');
  requireValue(!(gltf.extensionsRequired || []).length, 'unknown required extension');
  // Station/lateral projection has piecewise boundaries. Even a centimetre of
  // position error can choose another segment and move a fitted bridge by far
  // more. Retain exact authoring inputs on CPU; the runtime removes this
  // attribute before any GPU upload.
  const exactSource = (gltf.nodes || []).some(node => node.extras?.terrainOffsets || node.extras?.bankRows)
    || (gltf.meshes || []).some(mesh => mesh.primitives.some(p => p.attributes._BRIDGELIFT != null));
  const sourceAccessors = new Map();
  if (exactSource) for (const mesh of gltf.meshes || []) for (const primitive of mesh.primitives) {
    requireValue(primitive.attributes._CODRIVER_POSITION == null, 'reserved _CODRIVER_POSITION attribute');
    const original = primitive.attributes.POSITION;
    if (!sourceAccessors.has(original)) {
      sourceAccessors.set(original, gltf.accessors.length);
      gltf.accessors.push(structuredClone(gltf.accessors[original]));
    }
    primitive.attributes._CODRIVER_POSITION = sourceAccessors.get(original);
  }
  const semantics = new Map();
  const use = (index, semantic) => {
    requireValue(Number.isInteger(index) && gltf.accessors[index], `missing ${semantic} accessor`);
    const previous = semantics.get(index);
    requireValue(!previous || previous === semantic, 'accessor shared by incompatible semantics');
    semantics.set(index, semantic);
  };
  for (const mesh of gltf.meshes || []) for (const p of mesh.primitives) {
    requireValue(!p.targets?.length && (p.mode ?? 4) === 4 && !p.extensions, 'requires ordinary static triangles');
    requireValue(p.attributes.POSITION != null && p.attributes.NORMAL != null, 'position and normal required');
    for (const [semantic, index] of Object.entries(p.attributes)) use(index, semantic);
    if (p.indices != null) use(p.indices, 'indices');
  }
  requireValue(semantics.size > 0 && semantics.size === gltf.accessors.length, 'unreferenced or unsupported accessors');
  for (const node of gltf.nodes || []) {
    requireValue(node.skin == null && !node.weights && !node.extensions, 'unsupported node extension, weights or skin');
    if (node.mesh != null) requireValue(identity(node) && !node.children?.length, 'mesh nodes must be identity leaves; ancestor transforms are preserved');
  }
  const originalViews = gltf.bufferViews;
  const accessorBytes = (a) => {
    const v = originalViews[a.bufferView], size = SIZE[a.componentType], width = WIDTH[a.type];
    requireValue(!a.sparse && v && v.buffer === 0 && !v.extensions && size && width && Number.isInteger(a.count) && a.count > 0, 'unsupported accessor');
    const stride = v.byteStride || size * width, start = (v.byteOffset || 0) + (a.byteOffset || 0);
    requireValue(start + (a.count - 1) * stride + size * width <= (v.byteOffset || 0) + v.byteLength && start + (a.count - 1) * stride + size * width <= bin.length, 'accessor outside buffer view');
    return { size, width, stride, start };
  };
  // All current assets use one metric mesh frame, optionally below a rotated
  // authoring root. One grid for every primitive keeps coincident faces equal.
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (const [index, semantic] of semantics) if (semantic === 'POSITION') {
    const a = gltf.accessors[index], data = accessorBytes(a);
    requireValue(a.componentType === 5126 && a.type === 'VEC3' && !a.normalized, 'positions must be float VEC3');
    for (let i = 0; i < a.count; i++) for (let k = 0; k < 3; k++) {
      const value = bin.readFloatLE(data.start + i * data.stride + k * 4);
      requireValue(Number.isFinite(value), 'nonfinite position'); min[k] = Math.min(min[k], value); max[k] = Math.max(max[k], value);
    }
  }
  const center = min.map((n, k) => (n + max[k]) / 2), half = Math.max(...max.map((n, k) => (n - min[k]) / 2));
  const scale = half + Math.max(32, half * 0.1);
  await MeshoptEncoder.ready;
  const compressed = [], views = []; let offset = 0, decodedOffset = 0;
  for (let index = 0; index < gltf.accessors.length; index++) {
    const a = gltf.accessors[index], semantic = semantics.get(index), data = accessorBytes(a);
    const position = semantic === 'POSITION', normal = semantic === 'NORMAL', indices = semantic === 'indices';
    if (normal) requireValue(a.componentType === 5126 && a.type === 'VEC3' && !a.normalized, 'normals must be float VEC3');
    if (indices) requireValue(a.type === 'SCALAR' && [5123, 5125].includes(a.componentType), 'indices must be unsigned short/int');
    const stride = position ? 8 : normal ? 4 : indices ? data.size : align(data.width * data.size);
    requireValue(stride <= 256, 'vertex stride too large');
    const raw = Buffer.alloc(a.count * stride), qmin = [Infinity, Infinity, Infinity], qmax = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < a.count; i++) {
      if (position || normal) for (let k = 0; k < 3; k++) {
        const value = bin.readFloatLE(data.start + i * data.stride + k * 4);
        requireValue(Number.isFinite(value), 'nonfinite normal');
        const q = position ? Math.round((value - center[k]) / scale * 32767) : Math.round(Math.max(-1, Math.min(1, value)) * 127);
        if (position) raw.writeInt16LE(q, i * stride + k * 2); else raw.writeInt8(q, i * stride + k);
        qmin[k] = Math.min(qmin[k], q); qmax[k] = Math.max(qmax[k], q);
      } else bin.copy(raw, i * stride, data.start + i * data.stride, data.start + i * data.stride + data.width * data.size);
    }
    // INDICES preserves exact index order; TRIANGLES may cyclically rotate it.
    const mode = indices ? 'INDICES' : 'ATTRIBUTES';
    const encoded = Buffer.from(MeshoptEncoder.encodeGltfBuffer(raw, a.count, stride, mode));
    const view = { buffer: 1, byteOffset: decodedOffset, byteLength: raw.length, ...(indices ? { target: 34963 } : { target: 34962, byteStride: stride }),
      extensions: { EXT_meshopt_compression: { buffer: 0, byteOffset: offset, byteLength: encoded.length, byteStride: stride, count: a.count, mode, filter: 'NONE' } } };
    views.push(view); compressed.push(encoded, Buffer.alloc(align(encoded.length) - encoded.length)); offset += align(encoded.length);
    decodedOffset = align(decodedOffset + raw.length);
    a.bufferView = index; a.byteOffset = 0;
    if (position || normal) { a.componentType = position ? 5122 : 5120; a.normalized = true; if (position || a.min) a.min = qmin; if (position || a.max) a.max = qmax; }
  }
  // Insert an unnamed transform parent. The original mesh, its name, extras,
  // index in nodes, and its exact vertex numbering remain untouched.
  const wrappers = new Map();
  const originalNodes = gltf.nodes.length;
  for (let index = 0; index < originalNodes; index++) if (gltf.nodes[index].mesh != null) {
    wrappers.set(index, gltf.nodes.length);
    gltf.nodes.push({ translation: center, scale: [scale, scale, scale], children: [index], extras: { codriverQuantization: true } });
  }
  for (let index = 0; index < originalNodes; index++) if (gltf.nodes[index].children) gltf.nodes[index].children = gltf.nodes[index].children.map(n => wrappers.get(n) ?? n);
  for (const scene of gltf.scenes) scene.nodes = (scene.nodes || []).map(n => wrappers.get(n) ?? n);
  gltf.bufferViews = views;
  gltf.buffers = [{ byteLength: offset }, { byteLength: decodedOffset, extensions: { EXT_meshopt_compression: { fallback: true } } }];
  gltf.extensionsUsed = [...new Set([...(gltf.extensionsUsed || []), 'KHR_mesh_quantization', 'EXT_meshopt_compression'])];
  gltf.extensionsRequired = ['KHR_mesh_quantization', 'EXT_meshopt_compression'];
  gltf.asset.extras = { ...gltf.asset.extras, landmarkCodec: LANDMARK_CODEC, quantization: { center, scale, positionBits: 16, normalBits: 8, maxPositionErrorM: scale / 32767 / 2, vertexOrder: 'preserved', exactSource } };
  return writeGLB(gltf, Buffer.concat(compressed));
}

/** Verify semantic preservation against the original, including opaque extras
 * and every custom component. This runs before CLI promotion of any candidate. */
export async function validateLandmarkConversion(beforeBytes, afterBytes) {
  const before = readLandmarkGLB(beforeBytes), after = readLandmarkGLB(afterBytes);
  const original = before.json, encoded = after.json;
  requireValue(encoded.asset?.extras?.landmarkCodec === LANDMARK_CODEC, 'missing codec stamp');
  if (original.asset?.extras?.landmarkCodec === LANDMARK_CODEC) {
    requireValue(Buffer.from(beforeBytes).equals(Buffer.from(afterBytes)), 'already encoded bytes changed');
    return;
  }
  const same = (a, b, what) => requireValue(JSON.stringify(a) === JSON.stringify(b), `${what} changed`);
  const exactSource = original.nodes.some(node => node.extras?.terrainOffsets || node.extras?.bankRows)
    || original.meshes.some(mesh => mesh.primitives.some(p => p.attributes._BRIDGELIFT != null));
  same(!!exactSource, encoded.asset.extras.quantization.exactSource, 'exact CPU source policy');
  const encodedMeshes = structuredClone(encoded.meshes), sourceAccessors = new Map();
  for (let mesh = 0; mesh < encodedMeshes.length; mesh++) for (let primitive = 0; primitive < encodedMeshes[mesh].primitives.length; primitive++) {
    const attributes = encodedMeshes[mesh].primitives[primitive].attributes;
    requireValue((attributes._CODRIVER_POSITION != null) === !!exactSource, 'missing or unexpected exact CPU position');
    if (attributes._CODRIVER_POSITION != null) {
      sourceAccessors.set(attributes._CODRIVER_POSITION, original.meshes[mesh].primitives[primitive].attributes.POSITION);
      delete attributes._CODRIVER_POSITION;
    }
  }
  same(original.meshes, encodedMeshes, 'mesh names/primitives/material assignments');
  same(original.materials, encoded.materials, 'materials/names/extras');
  for (const [key, value] of Object.entries(original.asset)) {
    if (key === 'extras') for (const [name, extra] of Object.entries(value)) same(extra, encoded.asset.extras[name], `asset extra ${name}`);
    else same(value, encoded.asset[key], `asset ${key}`);
  }
  const unwrapped = index => index >= original.nodes.length ? encoded.nodes[index].children?.[0] : index;
  for (let i = 0; i < original.nodes.length; i++) {
    const node = { ...encoded.nodes[i] };
    if (node.children) node.children = node.children.map(unwrapped);
    same(original.nodes[i], node, `node ${i} name/extras/transform/children`);
  }
  same(original.scenes, encoded.scenes.map(scene => ({ ...scene, nodes: scene.nodes.map(unwrapped) })), 'scenes');
  const semantics = new Map();
  for (const mesh of original.meshes) for (const primitive of mesh.primitives) {
    for (const [name, index] of Object.entries(primitive.attributes)) semantics.set(index, name);
    if (primitive.indices != null) semantics.set(primitive.indices, 'indices');
  }
  same(original.accessors.length + sourceAccessors.size, encoded.accessors.length, 'accessor count');
  await MeshoptDecoder.ready;
  const grid = encoded.asset.extras.quantization;
  for (let i = 0; i < encoded.accessors.length; i++) {
    const sourceIndex = sourceAccessors.get(i), a = original.accessors[sourceIndex ?? i], b = encoded.accessors[i];
    const semantic = sourceIndex == null ? semantics.get(i) : '_CODRIVER_POSITION', v = original.bufferViews[a.bufferView];
    same(a.count, b.count, `${semantic} count`); same(a.type, b.type, `${semantic} shape`);
    const packed = encoded.bufferViews[b.bufferView].extensions.EXT_meshopt_compression;
    const decoded = Buffer.alloc(packed.count * packed.byteStride);
    MeshoptDecoder.decodeGltfBuffer(decoded, packed.count, packed.byteStride, after.bin.subarray(packed.byteOffset, packed.byteOffset + packed.byteLength), packed.mode, packed.filter);
    const width = WIDTH[a.type], size = SIZE[a.componentType], stride = v.byteStride || width * size, start = (v.byteOffset || 0) + (a.byteOffset || 0);
    if (semantic === 'POSITION' || semantic === 'NORMAL') {
      for (let vertex = 0; vertex < a.count; vertex++) for (let k = 0; k < width; k++) {
        const value = before.bin.readFloatLE(start + vertex * stride + k * 4);
        const restored = semantic === 'POSITION' ? decoded.readInt16LE(vertex * packed.byteStride + k * 2) / 32767 * grid.scale + grid.center[k] : decoded.readInt8(vertex * packed.byteStride + k) / 127;
        const tolerance = semantic === 'POSITION' ? grid.maxPositionErrorM + 1e-7 : 1 / 254 + 1e-6;
        requireValue(Math.abs(restored - value) <= tolerance, `${semantic} ${vertex}/${k} exceeds quantization error`);
      }
    } else {
      same(a.componentType, b.componentType, `${semantic} component type`); same(a.normalized, b.normalized, `${semantic} normalization`);
      for (let vertex = 0; vertex < a.count; vertex++) {
        const source = before.bin.subarray(start + vertex * stride, start + vertex * stride + width * size);
        const dest = decoded.subarray(vertex * packed.byteStride, vertex * packed.byteStride + width * size);
        requireValue(source.equals(dest), `${semantic} vertex/index ${vertex} changed`);
      }
    }
    for (const [key, value] of Object.entries(a)) if (!['bufferView', 'byteOffset', 'componentType', 'normalized', 'min', 'max'].includes(key)) same(value, b[key], `${semantic} accessor ${key}`);
  }
}
