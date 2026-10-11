# Habitat 67

Three stepped concrete housing pyramids with interlocking L-paired modules, terraces, open cores and elevated pedestrian streets.

Original procedural exterior authored 2026-09-28 from primary architectural and structural references. OSM building outline © OpenStreetMap contributors (ODbL 1.0). No third-party mesh or texture.

Explicit 354-module composition approximates the researched zigzag footprint, three pyramids and two lower saddles; not apartment-accurate. Grounded flat-map plaza; no surveyed terrain or elevation. Software checks do not measure Tesla hardware.

Models: CC BY 4.0. Procedural code: MIT. See [licensing](../../LICENSES.md) and [third-party notices](../../THIRD_PARTY_NOTICES.md).

## Geographic frame

Metres; +X east, +Y up, +Z south. Geographic origin: `[-73.54368, 45.4999]`. Heights are visual approximations.

## Build

`pnpm build:habitat-67`

Source: [`src/peregrine/landmarks/habitat-67-geometry.js`](../../src/peregrine/landmarks/habitat-67-geometry.js)

## References

- [Habitat 67 Heritage Foundation](https://habitat67foundation.com/project)
- [Safdie Architects · project and photos](https://www.safdiearchitects.com/projects/habitat-67)
- [Komocki · original engineering paper](https://doi.org/10.15554/pcij.02011967.67.70)
- [Québec heritage inventory](https://www.patrimoine-culturel.gouv.qc.ca/detail.do?id=98890&methode=consulter&type=bien)
- [OSM building outline · way 440195613](https://www.openstreetmap.org/way/440195613)

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). modules are face-culled shells with eight opening patterns on a 14.0 m course pitch, terraces have green patches and conifers; far uses one dark band per wall. Exported cost: near 18,530 triangles / 6 draws / 1,011,700 bytes; far 8,014 / 4 / 437,604.
