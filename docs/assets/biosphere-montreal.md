# Biosphère de Montréal

An open geodesic double shell around the museum pavilion, with no acrylic skin.

Original procedural geometry authored 2026-09-27 from public structural/photo references; mapped frame © OpenStreetMap contributors (ODbL 1.0). No captured mesh, third-party texture or simulator asset is shipped.

Visual approximation, not surveyed. Museum volumes and geodesic frequencies are simplified.

Models: CC BY 4.0. Procedural code: MIT. See [licensing](../../LICENSES.md) and [third-party notices](../../THIRD_PARTY_NOTICES.md).

## Geographic frame

Metres; +X east, +Y up, +Z south. Geographic origin: `[-73.53142625, 45.51409285]`. Heights are visual approximations.

## Build

`pnpm build:montreal-landmarks`

Source: [`src/peregrine/landmarks/biosphere-geometry.js`](../../src/peregrine/landmarks/biosphere-geometry.js)

## References

- [Espace pour la vie · the Biosphère](https://m.espacepourlavie.ca/en/about-biosphere)
- [Mapped alignment / footprint · OpenStreetMap](https://www.openstreetmap.org/copyright)

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). Exported cost: near 53,724 triangles / 6 draws / 1,654,788 bytes; far 10,722 / 6 / 336,568.
