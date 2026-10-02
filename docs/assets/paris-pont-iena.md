# Pont d’Iéna

**ID:** `paris-pont-iena` · **status:** ready export · **creator:** Codriver, original procedural geometry commissioned in 2026 with AI assistance. This is a visual approximation, not a survey.

## References and dimensions

The City of Paris says the bridge is closed to cars and returned to pedestrians. Five masonry arches and a 155 m structural length are historical/secondary figures; the 155.8 m mapped centerline includes approach points. No vehicle route is authored. [Primary reference](https://www.paris.fr/pages/paris-se-transforme-ce-qui-a-change-en-2024-dans-le-16e-arrondissement-30217). [Mapped feature and geographic credit](https://www.openstreetmap.org/copyright). Source images are linked references only; no photograph, map tile, third-party mesh or texture is included.

- Origin: `[2.292, 48.85972]` [longitude, latitude].
- Mapped bridge centerline: `[[2.2911862, 48.8602128], [2.2924859, 48.8593666], [2.2926935, 48.8592248]]` [longitude, latitude]. Derived from the named OSM crossing ways below; abutment footprint and transverse width remain estimates.
- Mapped centerline length including island/approach connections: 155.8 m; cited structural or secondary length: 155 m. These measure different endpoints.
- Modeled width: 35 m; deck above local support datum: 7.5 m. Unpublished pier, rail, parapet, sculpture and crown sizes are visual estimates.
- Local frame: metres, +X east / +Y up / +Z south. `y=0` is a local conceptual support datum. No DEM, sea-level height, Mercator scale or moving scene datum is baked in.

Current mapped crossing ways checked 29 September 2026: [way 1187856769](https://www.openstreetmap.org/way/1187856769). Pont d’Iéna is tagged `highway=footway`; it has no car route.

### Photo comparison

[Visual reference photograph](https://commons.wikimedia.org/wiki/File:Le_pont_d%27I%C3%A9na_et_la_tour_Eiffel_-_A21558S.jpg). The historic reference photograph shows the five arch rhythm and Eiffel-side approach. The model keeps the broad masonry crossing and no vehicle markings; current pedestrian access comes from the City and mapped footway, not the historic photo. The linked photo remains with its source and is not distributed with this library.

## Build and cost

Editable source: [paris-bridges-geometry.js](../../src/peregrine/landmarks/paris-bridges-geometry.js). Run `pnpm build:paris-bridges` and `pnpm models:license`; both near/far GLBs are deterministic from the source and their license metadata is stamped. Metrics below are measured after stamping.

| LOD | Bytes | Triangles | Mesh draws |
| --- | ---: | ---: | ---: |
| Near | 935,572 | 20,676 | 4 |
| Far | 151,204 | 4,440 | 4 |

## Inspection and placement

[Overview](/asset-preview.html?asset=paris-pont-iena&view=overview) | [Structure / underside](/asset-preview.html?asset=paris-pont-iena&view=structure) | [Support](/asset-preview.html?asset=paris-pont-iena&view=piers) | [Deck](/asset-preview.html?asset=paris-pont-iena&view=drive)

The bridge host must fit the deck to both bank approaches and sample each support footprint locally. Do not bend the deck over the riverbed. Road/rail/footway ownership must come from current map access tags, and road paint must come from the host's accepted HD road surface. Cityscape: **not tested in the host app**. Full 3D world: **not tested in the host app**. The library inspector tests exports only.

### Captured inspector evidence

- [Near GLB overview](../images/paris-pont-iena-overview-glb-near-day.png)
- [Near procedural support view](../images/paris-pont-iena-piers-procedural-near-day.png)
- [Far GLB night overview](../images/paris-pont-iena-overview-glb-far-night.png)

## Rights

Procedural code and this documentation: MIT. Original GLB models: CC BY 4.0, © 2026 9570-6198 Québec inc. (Codriver). Geographic coordinates are derived from open mapping: © OpenStreetMap contributors, ODbL 1.0. This Codriver-commissioned work has no fabricated outside-contributor CLA signature.

## Street-level revision — 29 September 2026

Five regularly distributed masonry vaults independent of alignment nodes, rounded cutwaters and stylized eagle reliefs.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

Current revision: [near GLB facade/support](../screenshots/paris-refinement/paris-pont-iena.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-pont-iena-roof-or-structure.png).

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). four equestrian groups on end plinths (original blocky silhouettes); continuous stone parapet with coping; far end slabs no longer show stone through the paving. Exported cost: near 20,676 triangles / 4 draws / 935,572 bytes; far 4,440 / 4 / 151,204.
