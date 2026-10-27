/**
 * What the scene costs the GPU, in bytes, for the memory budget
 * (basemap/memory-budget.js). Every vertex buffer and every texture is
 * counted once, however many meshes and geometries share it: attributes,
 * index, and an instanced mesh's per-instance matrices and colours; a texture
 * by its image size, a third more when it carries mipmaps.
 *
 * Buffers, not geometries: a tile's buildings are split into 3x3 chunks and
 * the far ring's roads into 4x4, each its own geometry over the SAME vertex
 * attributes (basemap-tiles.js#_chunkedBuilding / _chunkedRoad). Counting per
 * geometry charged them once per chunk, 4-10 times the real figure on the
 * Linux harness (ADR-0051).
 *
 * Duck-typed (no three import), so it runs on plain objects in tests. A walk
 * of the whole scene graph: called every few seconds, never per frame.
 */

/**
 * An attribute's bytes the first time its GPU buffer is seen, else 0. three
 * uploads one buffer per attribute object, or per InterleavedBuffer for the
 * attributes interleaved in it; so that is the key, not the array (two
 * attribute objects over one array are two uploads).
 */
function attrBytes(a, seen) {
  const arr = a && a.array;
  if (!arr || !arr.byteLength) return 0;
  const key = a.isInterleavedBufferAttribute && a.data ? a.data : a;
  if (seen.has(key)) return 0;
  seen.add(key);
  return arr.byteLength;
}

function textureBytes(t) {
  if (!t || !t.isTexture) return 0;
  const img = t.image;
  if (!img) return 0;
  let bytes = 0;
  if (img.data && img.data.byteLength) bytes = img.data.byteLength;
  else if (img.width > 0 && img.height > 0) bytes = img.width * img.height * 4;
  if (t.generateMipmaps !== false && t.mipmaps !== undefined && bytes) bytes = Math.round(bytes * 4 / 3);
  return bytes;
}

const TEXTURE_SLOTS = ['map', 'alphaMap', 'normalMap', 'emissiveMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'envMap', 'lightMap', 'bumpMap'];

/**
 * @param {{ traverse: (fn: (o: object) => void) => void }} root
 * @returns {{ geometryBytes: number, textureBytes: number, geometries: number, textures: number }}
 */
export function sceneMemory(root) {
  const geoms = new Set();
  const buffers = new Set();
  const texs = new Set();
  let geometryBytes = 0;
  let texBytes = 0;
  const addTexture = (t) => {
    if (!t || !t.isTexture || texs.has(t)) return;
    texs.add(t);
    texBytes += textureBytes(t);
  };
  const addMaterial = (m) => {
    if (!m) return;
    for (const k of TEXTURE_SLOTS) addTexture(m[k]);
    const u = m.uniforms;
    if (u) for (const k in u) { const v = u[k] && u[k].value; if (v && v.isTexture) addTexture(v); }
  };
  if (!root || typeof root.traverse !== 'function') return { geometryBytes: 0, textureBytes: 0, geometries: 0, textures: 0 };
  root.traverse((o) => {
    const g = o.geometry;
    if (g && !geoms.has(g)) {
      geoms.add(g);
      const attrs = g.attributes || {};
      for (const k in attrs) geometryBytes += attrBytes(attrs[k], buffers);
      geometryBytes += attrBytes(g.index, buffers);
    }
    // Per-instance buffers belong to the mesh, not its geometry.
    geometryBytes += attrBytes(o.instanceMatrix, buffers) + attrBytes(o.instanceColor, buffers);
    const mat = o.material;
    if (Array.isArray(mat)) mat.forEach(addMaterial); else addMaterial(mat);
  });
  return { geometryBytes, textureBytes: texBytes, geometries: geoms.size, textures: texs.size };
}
