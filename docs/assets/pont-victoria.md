# Pont Victoria

Repeated through-trusses around two rail tracks, narrow outer road decks, stone icebreaker piers and the lock lift towers.

Original procedural geometry authored 2026-09-27 from public structural/photo references; mapped frame © OpenStreetMap contributors (ODbL 1.0). No captured mesh, third-party texture or simulator asset is shipped.

Visual approximation, not surveyed. Deck heights are adapted to the flat map; fine fabrication details are simplified. Lift span shown lowered; the separate rail diversion is outside this road bridge model.

Models: CC BY 4.0. Procedural code: MIT. See [licensing](../../LICENSES.md) and [third-party notices](../../THIRD_PARTY_NOTICES.md).

## Geographic frame

Metres; +X east, +Y up, +Z south. Geographic origin: `[-73.5298, 45.4915]`. Heights are visual approximations.

## Build

`pnpm build:montreal-landmarks`

Source: [`src/peregrine/landmarks/montreal-bridges-geometry.js`](../../src/peregrine/landmarks/montreal-bridges-geometry.js)

## References

- [Québec heritage inventory](https://www.patrimoine-culturel.gouv.qc.ca/detail.do?id=190922&methode=consulter&type=bien)
- [Mapped alignment / footprint · OpenStreetMap](https://www.openstreetmap.org/copyright)

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). far drops parapet and track rails and sub-pixel bracing; near removes hidden and coplanar slab, bed and pier-top faces; alignment, profile and deck heights unchanged. Exported cost: near 56,988 triangles / 29 draws / 3,086,900 bytes; far 10,298 / 4 / 547,568.
