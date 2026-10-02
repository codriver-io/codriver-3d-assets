# Pont Neuf

**ID:** `paris-pont-neuf` · **status:** ready export · **creator:** Codriver, original procedural geometry commissioned in 2026 with AI assistance. This is a visual approximation, not a survey.

## References and dimensions

The City of Paris records twelve arches and 238 m total length. The 275.1 m mapped centerline includes bank endpoints. Seven and five arches occupy separately aligned arms about Île de la Cité; pier bays are simplified. [Primary reference](https://cdn.paris.fr/paris/2021/07/01/1f538bf9fe017da085a9ec31544c4a86.pdf). [Mapped feature and geographic credit](https://www.openstreetmap.org/copyright). Source images are linked references only; no photograph, map tile, third-party mesh or texture is included.

- Origin: `[2.34145, 48.8573]` [longitude, latitude].
- Mapped bridge centerline: `[[2.3405456, 48.8562229], [2.3410051, 48.8567498], [2.3414203, 48.8572051], [2.3423794, 48.8583786]]` [longitude, latitude]. Derived from the named OSM crossing ways below; abutment footprint and transverse width remain estimates.
- Mapped centerline length including island/approach connections: 275.1 m; cited structural or secondary length: 238 m. These measure different endpoints.
- Modeled width: 21 m; deck above local support datum: 7.8 m. Unpublished pier, rail, parapet, sculpture and crown sizes are visual estimates.
- Local frame: metres, +X east / +Y up / +Z south. `y=0` is a local conceptual support datum. No DEM, sea-level height, Mercator scale or moving scene datum is baked in.

Current mapped crossing ways checked 29 September 2026: [way 20326518](https://www.openstreetmap.org/way/20326518), [way 683347676](https://www.openstreetmap.org/way/683347676), [way 683347674](https://www.openstreetmap.org/way/683347674), [way 557297166](https://www.openstreetmap.org/way/557297166), [way 53574163](https://www.openstreetmap.org/way/53574163).

### Photo comparison

[Visual reference photograph](https://commons.wikimedia.org/wiki/File:Pont_Neuf_-_Paris_-_France.jpg). The reference photograph shows heavy masonry arch faces and projecting piers. The model retains twelve arches in two differently aligned arms and projecting pier bays, with simpler stonework and parapets. The linked photo remains with its source and is not distributed with this library.

## Build and cost

Editable source: [paris-bridges-geometry.js](../../src/peregrine/landmarks/paris-bridges-geometry.js). Run `pnpm build:paris-bridges` and `pnpm models:license`; both near/far GLBs are deterministic from the source and their license metadata is stamped. Metrics below are measured after stamping.

| LOD | Bytes | Triangles | Mesh draws |
| --- | ---: | ---: | ---: |
| Near | 2,579,704 | 53,576 | 6 |
| Far | 410,072 | 10,424 | 5 |

## Inspection and placement

[Overview](/asset-preview.html?asset=paris-pont-neuf&view=overview) | [Structure / underside](/asset-preview.html?asset=paris-pont-neuf&view=structure) | [Support](/asset-preview.html?asset=paris-pont-neuf&view=piers) | [Deck](/asset-preview.html?asset=paris-pont-neuf&view=drive)

The bridge host must fit the deck to both bank approaches and sample each support footprint locally. Do not bend the deck over the riverbed. Road/rail/footway ownership must come from current map access tags, and road paint must come from the host's accepted HD road surface. Cityscape: **not tested in the host app**. Full 3D world: **not tested in the host app**. The library inspector tests exports only.

### Captured inspector evidence

- [Near GLB overview](../images/paris-pont-neuf-overview-glb-near-day.png)
- [Near procedural support view](../images/paris-pont-neuf-piers-procedural-near-day.png)
- [Far GLB night overview](../images/paris-pont-neuf-overview-glb-far-night.png)

## Rights

Procedural code and this documentation: MIT. Original GLB models: CC BY 4.0, © 2026 9570-6198 Québec inc. (Codriver). Geographic coordinates are derived from open mapping: © OpenStreetMap contributors, ODbL 1.0. This Codriver-commissioned work has no fabricated outside-contributor CLA signature.

## Street-level revision — 29 September 2026

Full-width masonry vaults, cutwaters, semicircular refuges, dressed arch rings and lamps; five/seven arch split retained.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

Current revision: [near GLB facade/support](../screenshots/paris-refinement/paris-pont-neuf.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-pont-neuf-roof-or-structure.png).

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). island has dressed-stone retaining walls and a Henri IV equestrian group on a pedestal; ramp piers follow the deck, removing the pale band across the roadway. Exported cost: near 53,576 triangles / 6 draws / 2,579,704 bytes; far 10,424 / 5 / 410,072.
