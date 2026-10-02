# La Grande Roue de Montréal

Open white observation wheel with paired trussed spokes, six splayed supports and 42 upright enclosed cabins.

Original procedural geometry authored 2026-09-27. Placement and outline © OpenStreetMap contributors (ODbL 1.0). Manufacturer and operator photographs used only for visual interpretation; no third-party mesh, image or texture is shipped.

60m overall height and 42 cabins are sourced; rim diameter 56.64m and plane are OSM-derived estimates. Member sizes, gondolas, hub and boarding deck are visual approximations. Flat plaza datum, static upright cabins, opaque glazing and restrained lighting. Cafés remain map geometry.

Models: CC BY 4.0. Procedural code: MIT. See [licensing](../../LICENSES.md) and [third-party notices](../../THIRD_PARTY_NOTICES.md).

## Geographic frame

Metres; +X east, +Y up, +Z south. Geographic origin: `[-73.548657525, 45.50847625]`. Heights are visual approximations.

## Build

`pnpm build:grande-roue`

Source: [`src/peregrine/landmarks/grande-roue-geometry.js`](../../src/peregrine/landmarks/grande-roue-geometry.js)

## References

- [Old Port · 60m height and 42 cabins](https://www.oldportofmontreal.com/activity/montreal-observation-wheel)
- [Operator · identity and opening](https://lagranderouedemontreal.com/about-us/)
- [Dutch Wheels · manufacturer and photo gallery](https://www.dutchwheels.com/en/portfolio/la-grande-roue-de-montreal)
- [OSM attraction footprint 1097403710](https://www.openstreetmap.org/way/1097403710)
- [OSM attribution and ODbL](https://www.openstreetmap.org/copyright)

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). rim tubes 0.52 m, spokes 0.28 m; boarding deck lowered so the lowest cabin clears it by about 0.11 m. Exported cost: near 19,666 triangles / 6 draws / 753,908 bytes; far 5,792 / 6 / 283,168.
