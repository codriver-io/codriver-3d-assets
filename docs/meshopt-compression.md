# Compact landmark exports

Runtime GLBs use **EXT_meshopt_compression** and **KHR_mesh_quantization**. A loader must support both extensions. Original authoring generators remain editable Float32 geometry in local metres; encoded positions require their glTF node transforms to recover those metres.

## Reproduce

`meshoptimizer` is pinned to **0.22.0**. All 21 exporter recipes call `exportLandmarkGLB` in `scripts/lib/landmark-codec.mjs`. The codec is `codriver-meshopt-v2`, shared with the Codriver app. It uses `MeshoptEncoder.encodeGltfBuffer` with the `ATTRIBUTES` and `INDICES` modes and `NONE` filter. It does not simplify geometry, merge meshes/materials, reorder vertices/indices, strip names/extras, or alter custom attachment attributes.

```sh
pnpm install --frozen-lockfile
# Measure and validate all registered variants; leave public models untouched:
node scripts/compress-landmarks.mjs --all --out tmp/meshopt-all
# Promote only the validated, hash-matching snapshots and update manifests:
node scripts/compress-landmarks.mjs --apply tmp/meshopt-all
# Measure/repack the offline scene archives and update their hashes:
node scripts/compress-scene-models.mjs --write
pnpm build
pnpm check
PORT=4257 pnpm dev
pnpm test:browser http://localhost:4257
node scripts/meshopt-library-qa.mjs http://localhost:4257
# Offline scene QA additionally takes the extracted original archive as input:
node scripts/meshopt-scene-qa.mjs http://localhost:4257 tmp/scenes-original
```

A single generator, for example `pnpm build:champlain`, produces the same compact format directly. `pnpm models:build` regenerates the complete collection and applies license metadata. Conversion is idempotent for this codec. `--apply` verifies each input/candidate hash and semantic conversion before modifying any public model.

The compact normal is signed normalized Int8, padded to a four-byte stride. The position is signed normalized Int16, padded to an eight-byte stride. Each asset shares one uniform position grid: the original bounds centre, largest half-span, plus the greater of 32 metres or 10% headroom. The exact scale, offset and maximum error are recorded under `asset.extras.quantization`. Original model transforms remain present; unnamed `codriverQuantization` parents carry dequantization. The resulting world bounds and vertices retain the recorded quantization tolerance.

`gltfpack -cc -kn -km -ke` was deliberately not used: it can discard custom attachment attributes, reorder vertices referenced by metadata, and change which node owns extras. The order-preserving codec retains `_BRIDGELIFT`, `_BRIDGEBASE`, `_LANDINGBLEND`, `_PIERTOP`, `terrainOffsets`, `bankRows`, names, materials, provenance and licensing.

## Load and inspect

The two public inspectors use `src/peregrine/landmarks/landmark-loader.js`, a normal Three.js GLTFLoader configured with `three/examples/jsm/libs/meshopt_decoder.module.js`. It also calls `prepareModelFrames` before rendering. Legacy uncompressed GLBs work with the same loader.

Assets with exact deformation inputs carry a compressed Float32 `_CODRIVER_POSITION` stream. It is **CPU-only**. The shared loader removes this geometry attribute before rendering and retains it privately for metric readers. Three.js uploads even otherwise unused geometry attributes, so a generic loader that leaves this stream attached forfeits part of the GPU-memory benefit. Consumers showing fixed geometry may remove `_codriver_position` immediately after decoding; consumers fitting geometry must use the shared frame helper instead of discarding it.

CPU readers use `modelPosition(mesh)` for authored model metres, and finish any mutation with `finishModelEdit(mesh, recomputeNormals)`. Integer normalized `geometry.attributes.position` values and geometry-local bounds are not metres. Keep immutable source inputs for repeated terrain fitting. Avoid accumulating normals directly into Int8 attributes; the helper computes them on CPU floats and repacks. `meshLocalPosition` in `quantized-bounds.js` supports inspection checks that explicitly work before the authored root rotation.

Download consumers must use a meshopt-capable glTF engine or decode/re-export to their preferred format. Compression does not bake a terrain datum into reusable assets. The separately packaged scene presets retain their own documented frame and terrain inputs.

## Validation and evidence

Every conversion exhaustively checks decoded indices, vertex order, custom attributes, node names/materials/extras and all position/normal values against the source. Position comparisons use the recorded grid tolerance; exact authoring streams and attachment metadata must match exactly. Memory numbers count each actual Three.js attribute/interleaved buffer once after CPU streams are removed, matching the app's scene-memory accounting.

The repository check rejects uncompressed exports or stale manifest byte/triangle/draw counts. Unit tests cover source metadata, topology, deliberate corruption, transformed-node rejection, float compatibility, exact metric readers and CPU-stream removal. The GLB architecture tests still inspect Paris openings, winding and facade separation after decoding.

`meshopt-library-qa.mjs` produces paired raw/encoded six-landmark screenshots in near/far, day/night, overview/support views (Cambie uses its unobstructed facade preset) at 1254×784 CSS pixels and DPR 1.53. This is **standalone viewer parity**. It does not establish navigation, HD-road ownership, terrain foundations, Tesla hardware memory, or app integration of these library model versions. Cityscape: not tested here. Full 3D world: not tested here. The app collection has its own separate integration evidence.
