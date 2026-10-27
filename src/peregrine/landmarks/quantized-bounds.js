// World-space Box3 already includes the dequantization parent. A float GLB
// keeps the caller's tolerance. A meshopt GLB may move each corner by the
// grid's 3D diagonal, which is maxPositionErrorM * sqrt(3).
import { Box3, Float32BufferAttribute, Matrix4, Vector3 } from 'three';
import { modelPosition } from './model-frame.js';

// Test/inspection copies only. Runtime geometry keeps its compact GPU buffers.
export function authoredPosition(mesh) {
  const p = modelPosition(mesh), array = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) { array[i * 3] = p.getX(i); array[i * 3 + 1] = p.getY(i); array[i * 3 + 2] = p.getZ(i); }
  return new Float32BufferAttribute(array, 3);
}

export function authoredBounds(mesh) {
  const p = modelPosition(mesh), box = new Box3(), point = new Vector3();
  for (let i = 0; i < p.count; i++) box.expandByPoint(point.set(p.getX(i), p.getY(i), p.getZ(i)));
  return box;
}

// Geometry-local metres, before the original authored root rotation. Some
// architectural checks deliberately undo geographic placement themselves.
export function meshLocalPosition(mesh) {
  if (mesh.matrixAutoUpdate) mesh.updateMatrix();
  const matrix = new Matrix4().copy(mesh.matrix);
  for (let parent = mesh.parent; parent?.userData.codriverQuantization; parent = parent.parent) {
    if (parent.matrixAutoUpdate) parent.updateMatrix();
    matrix.premultiply(parent.matrix);
  }
  const p = mesh.geometry.attributes.position, array = new Float32Array(p.count * 3), v = new Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(matrix); v.toArray(array, i * 3); }
  return new Float32BufferAttribute(array, 3);
}

export function landmarkQuantizationDiagonalM(root) {
  let error = 0;
  const visit = (node) => {
    if (!node) return;
    const own = node.userData?.landmarkQuantizationErrorM;
    if (typeof own === 'number' && own > error) error = own;
    if (typeof node.traverse === 'function') {
      node.traverse((child) => {
        const value = child.userData?.landmarkQuantizationErrorM;
        if (typeof value === 'number' && value > error) error = value;
      });
    }
  };
  if (Array.isArray(root)) for (const item of root) visit(item);
  else visit(root);
  return error * Math.sqrt(3);
}

/** True when two world boxes agree within max(baseTolerance, quantization diagonal). */
export function boundsWithinLandmarkError(actual, expected, loaded, baseTolerance = 1e-3) {
  const error = landmarkQuantizationDiagonalM(loaded);
  const tolerance = error > 0 ? Math.max(baseTolerance, error + 1e-4) : baseTolerance;
  return actual.min.distanceTo(expected.min) <= tolerance
    && actual.max.distanceTo(expected.max) <= tolerance;
}
