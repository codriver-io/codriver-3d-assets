# Oratoire Saint-Joseph

Copper dome and octagonal drum above the stone basilica, open colonnade, crypt terrace and monumental approach stairs.

Authored 2026-09-27 from primary dimensions, reference photos and OSM footprint. Original procedural geometry, no copied mesh or photo textures. Placement © OpenStreetMap contributors, ODbL. Reference photographs are not redistributed.

Original procedural model; local hillside compressed to 24 m at basilica floor with solid foundations. Vehicle roads are unchanged. Fine sculpture, interior, surrounding annexes and modern reception complex are omitted.

Models: CC BY 4.0. Procedural code: MIT. See [licensing](../../LICENSES.md) and [third-party notices](../../THIRD_PARTY_NOTICES.md).

## Geographic frame

Metres; +X east, +Y up, +Z south. Geographic origin: `[-73.6165115625, 45.49188]`. Heights are visual approximations.

## Build

`pnpm build:oratoire-saint-joseph`

Source: [`src/peregrine/landmarks/oratoire-saint-joseph-geometry.js`](../../src/peregrine/landmarks/oratoire-saint-joseph-geometry.js)

## References

- [Montréal landscape and access history](https://montroyal.montreal.ca/paysage-oratoire-saint-joseph-mont-royal)
- [Oratory must-sees](https://saint-joseph.org/en/the-staples/)
- [Oratory basilica dimensions and datums](https://saint-joseph.org/en/incontournable/the-basilica/)
- [OSM basilica relation 6275154](https://www.openstreetmap.org/relation/6275154)
- [OSM mapped dome](https://www.openstreetmap.org/way/132499529)

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). portico has an entablature and an attic with the great arch under the front pediment; turret roofs are reddish-brown copper; aisle windows and buttresses sit on the walls. Exported cost: near 8,483 triangles / 7 draws / 414,308 bytes; far 4,191 / 7 / 225,252.
