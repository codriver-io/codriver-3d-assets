# Place Ville Marie + L’Anneau

Cruciform aluminium tower, recessed roof crown and beacon above skylit banking halls, with L’Anneau at the Cathcart / McGill College entrance.

Original procedural geometry authored 2026-09-27. Mapped base way 108457145 and ring node 11191781037 © OpenStreetMap contributors (ODbL 1.0). Primary architectural photographs/plans used for proportion studies only; no captured mesh or third-party texture shipped.

Y=0 flat-map grade; compact supported plaza, no sea-level lift. Tower envelope 188.1 m; beacon reaches 191.1 m. Facade bays, skylights, crown and ring tube/clearance are visual estimates. Surrounding PVM towers remain untouched. Tesla hardware cost unmeasured.

Models: CC BY 4.0. Procedural code: MIT. See [licensing](../../LICENSES.md) and [third-party notices](../../THIRD_PARTY_NOTICES.md).

## Geographic frame

Metres; +X east, +Y up, +Z south. Geographic origin: `[-73.5686328, 45.50158465]`. Heights are visual approximations.

## Build

`pnpm build:place-ville-marie`

Source: [`src/peregrine/landmarks/place-ville-marie-geometry.js`](../../src/peregrine/landmarks/place-ville-marie-geometry.js)

## References

- [Tourisme Montréal](https://www.mtl.org/fr/quoi-faire/culture-arts-patrimoine/place-ville-marie)
- [Tower architect · Pei Cobb Freed & Partners](https://www.pcf-p.com/projects/place-ville-marie/)
- [Tower engineer · NCK](https://nck.ca/realisations/place-ville-marie-1-pvm-tour-principale/)
- [Building owner · history and rooftop beacon](https://placevillemarie.com/fr/Histoire)
- [Ring architect · CCxA](https://ccxa.ca/en/projects/the-ring/)
- [Ring constructor · JCB](https://www.jcb.ca/en/project/the-ring-at-place-ville-marie)
- [Mapped banking hall base](https://www.openstreetmap.org/way/108457145)
- [Mapped L’Anneau](https://www.openstreetmap.org/node/11191781037)

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). near glass and spandrels are blue-grey with fewer, smaller, muted window dots; far folds plaza and skylights into the pale concrete and the ring into aluminium. Exported cost: near 10,562 triangles / 10 draws / 427,336 bytes; far 4,724 / 6 / 238,236.
