import { BufferGeometry, Float32BufferAttribute, Matrix4 } from 'three';

// CPU readers work in the authored metre frame. The renderer keeps the integer
// attribute and glTF node transform. Never override BufferAttribute getters:
// three's bounds, raycasts and renderer must see the actual stored local frame.
const frames = new WeakMap();
const identity = new Matrix4();

export function prepareModelFrames(model) {
  function visit(node, parent, authoringParent) {
    if (node.matrixAutoUpdate) node.updateMatrix();
    const matrix = parent.clone().multiply(node.matrix);
    const authoring = node.userData.codriverQuantization ? authoringParent : authoringParent.clone().multiply(node.matrix);
    if (node.isMesh && !frames.has(node)) {
      // Lossless authoring coordinates protect discontinuous CPU decisions at
      // alignment knots, lane edges and bank toes. Strip them BEFORE rendering:
      // even unused custom attributes would otherwise be uploaded by three.
      const source = node.geometry.attributes._codriver_position;
      if (source) node.geometry.deleteAttribute('_codriver_position');
      createFrame(node, matrix, source, authoring);
    }
    for (const child of node.children) visit(child, matrix, authoring);
  }
  visit(model, identity, identity);
  return model;
}

function limits(attribute) {
  const Type = attribute.array.constructor;
  if (Type === Float32Array || Type === Float64Array) return null;
  if (attribute.normalized) return Type === Int8Array || Type === Int16Array ? [-1, 1] : [0, 1];
  if (Type === Int8Array) return [-128, 127];
  if (Type === Uint8Array) return [0, 255];
  if (Type === Int16Array) return [-32768, 32767];
  if (Type === Uint16Array) return [0, 65535];
  throw new Error('Unsupported landmark position component type');
}

function createFrame(mesh, matrix, authoring = null, authoringMatrix = matrix) {
  const frame = { matrix, inverse: matrix.clone().invert(), authoring, working: null };
  const attribute = () => mesh.geometry.attributes.position;
  const get = (i, k) => {
    if (frame.working) return frame.working[i * 3 + k];
    const a = frame.authoring || attribute(), e = (frame.authoring ? authoringMatrix : frame.matrix).elements;
    return e[k] * a.getX(i) + e[k + 4] * a.getY(i) + e[k + 8] * a.getZ(i) + e[k + 12];
  };
  frame.position = {
    get count() { return attribute().count; },
    get version() { const a = attribute(); return a.isInterleavedBufferAttribute ? a.data.version : a.version; },
    getX: i => get(i, 0), getY: i => get(i, 1), getZ: i => get(i, 2),
    setX(i, x) { return this.setXYZ(i, x, get(i, 1), get(i, 2)); },
    setY(i, y) { return this.setXYZ(i, get(i, 0), y, get(i, 2)); },
    setZ(i, z) { return this.setXYZ(i, get(i, 0), get(i, 1), z); },
    setXYZ(i, x, y, z) {
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) throw new Error('Non-finite landmark position');
      if (!frame.working) {
        const data = new Float32Array(attribute().count * 3);
        for (let j = 0; j < attribute().count; j++) for (let k = 0; k < 3; k++) data[j * 3 + k] = get(j, k);
        frame.working = data;
        frame.authoring = null; // the immutable bridge source has already been saved
      }
      frame.working.set([x, y, z], i * 3);
      return this;
    },
    set needsUpdate(value) { attribute().needsUpdate = value; },
  };
  frames.set(mesh, frame);
  return frame;
}

export function modelPosition(mesh) {
  // Procedural fixtures and uncompressed legacy models use the same API.
  if (!frames.has(mesh)) prepareModelFrames(mesh);
  return frames.get(mesh).position;
}

/** A lane child uses its parent's geometry coordinates and model frame. */
export function inheritModelFrame(parent, child) {
  modelPosition(parent);
  const frame = createFrame(child, frames.get(parent).matrix.clone());
  // compact lane vertices already carry their exact immutable metre source
  if (child.geometry.userData.champlainSource) frame.working = child.geometry.userData.champlainSource.positions.slice();
}

export function finishModelEdit(mesh, recomputeNormals = false) {
  const g = mesh.geometry, frame = frames.get(mesh), a = g.attributes.position;
  let local = a;
  if (frame?.working) {
    // Stage the entire fit on the CPU. Later specialized fits read the ideal
    // result, not repeatedly rounded GPU values. These floats are never added
    // to the live geometry or uploaded.
    const data = new Float32Array(a.count * 3), e = frame.inverse.elements;
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < a.count; i++) {
      const x = frame.working[i * 3], y = frame.working[i * 3 + 1], z = frame.working[i * 3 + 2];
      for (let k = 0; k < 3; k++) {
        const v = e[k] * x + e[k + 4] * y + e[k + 8] * z + e[k + 12];
        data[i * 3 + k] = v; min[k] = Math.min(min[k], v); max[k] = Math.max(max[k], v);
      }
    }
    const range = limits(a);
    if (range && (Math.min(...min) < range[0] || Math.max(...max) > range[1])) {
      // Extreme terrain can exceed the export's headroom. Grow the compact
      // domain; never wrap/clamp coordinates or switch to a float GPU buffer.
      const [lo, hi] = range, mid = (lo + hi) / 2;
      const scale = Math.max(...max.map((v, k) => v - min[k]), 1e-6) / (hi - lo) * 1.1;
      const offset = min.map((v, k) => (v + max[k]) / 2 - mid * scale);
      for (let i = 0; i < data.length; i++) data[i] = (data[i] - offset[i % 3]) / scale;
      const adjustment = new Matrix4().makeScale(scale, scale, scale).setPosition(...offset);
      if (mesh.matrixAutoUpdate) mesh.updateMatrix();
      mesh.matrix.multiply(adjustment);
      mesh.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
      // A lane child inherits this node: preserve its already fitted position.
      const inverse = adjustment.clone().invert();
      for (const child of mesh.children) {
        if (child.matrixAutoUpdate) child.updateMatrix();
        child.matrix.premultiply(inverse);
        child.matrix.decompose(child.position, child.quaternion, child.scale);
      }
      frame.matrix.multiply(adjustment); frame.inverse.copy(frame.matrix).invert();
      mesh.updateMatrixWorld(true);
    }
    local = new Float32BufferAttribute(data, 3);
    for (let i = 0; i < a.count; i++) a.setXYZ(i, data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
  }
  a.needsUpdate = true;
  if (recomputeNormals) {
    // Calculate from the ideal CPU fit: quantization can collapse tiny faces.
    // Accumulating face areas directly in Int8 also overflows before normalize.
    const scratch = new BufferGeometry();
    scratch.setAttribute('position', local); scratch.setIndex(g.index);
    scratch.computeVertexNormals();
    const normal = scratch.attributes.normal, packed = g.attributes.normal;
    if (packed) {
      for (let i = 0; i < normal.count; i++) packed.setXYZ(i, normal.getX(i), normal.getY(i), normal.getZ(i));
      packed.needsUpdate = true;
    } else g.setAttribute('normal', normal);
  }
  g.computeBoundingBox(); g.computeBoundingSphere();
}
