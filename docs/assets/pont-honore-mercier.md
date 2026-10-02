# Pont Honoré-Mercier

Paired river deck trusses and steel arches, a shared high Seaway through-truss and branching concrete approach viaducts.

Original procedural geometry authored 2026-09-27. Current directional roads and bridge footprints © OpenStreetMap contributors (ODbL 1.0). Primary JCCBI/Québec photos studied; no image, captured mesh or texture redistributed.

Vertical datum, steel sections, pier spacing and Seaway span are visual approximations. Current bridge only; proposed replacement and adjacent railway excluded. Complete near/far models are inspection exports; runtime loads only the four partitions.

Models: CC BY 4.0. Procedural code: MIT. See [licensing](../../LICENSES.md) and [third-party notices](../../THIRD_PARTY_NOTICES.md).

## Geographic frame

Metres; +X east, +Y up, +Z south. Geographic origin: `[-73.65852, 45.41025]`. Heights are visual approximations.

## Build

`pnpm build:pont-honore-mercier`

Source: [`src/peregrine/landmarks/pont-honore-mercier-geometry.js`](../../src/peregrine/landmarks/pont-honore-mercier-geometry.js)

## References

- [JCCBI current technical data](https://www.jacquescartierchamplain.ca/en/structures/honore-mercier-bridge/about/)
- [JCCBI history and main arch dimension](https://www.jacquescartierchamplain.ca/en/structures/honore-mercier-bridge/history/)
- [Québec current structures, July 2026 and aerial photograph](https://www.quebec.ca/transports/infrastructures-projets/projets/projets-routiers/montreal/pont-honore-mercier)
- [OSM attribution](https://www.openstreetmap.org/copyright)

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). far runtime partitions total 26.1 k triangles / 10 draws / 1.0 MB (stone merged into concrete, open-prism truss members); no near concrete is coplanar with pavement. Exported cost: near 73,608 triangles / 38 draws / 3,074,408 bytes; far 26,134 / 10 / 1,022,732.
