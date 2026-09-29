# Pont de Bir-Hakeim

**ID:** `paris-pont-bir-hakeim` · **status:** ready export · **creator:** Codriver, original procedural geometry commissioned in 2026 with AI assistance. This is a visual approximation, not a survey.

## References and dimensions

The French heritage registry describes two unequal parts separated by a monumental portico at Île aux Cygnes. 237 m is a secondary published total; the 237.8 m mapped centerline includes bank approach points. Upper Métro track, steel supports and road/pedestrian split are modeled separately. [Primary reference](https://pop.culture.gouv.fr/notice/merimee/PA00086658). [Mapped feature and geographic credit](https://www.openstreetmap.org/copyright). Source images are linked references only; no photograph, map tile, third-party mesh or texture is included.

- Origin: `[2.28758, 48.85567]` [longitude, latitude].
- Mapped bridge centerline: `[[2.2866942, 48.8565888], [2.2876375, 48.8555794], [2.2884719, 48.854803]]` [longitude, latitude]. Derived from the named OSM crossing ways below; abutment footprint and transverse width remain estimates.
- Mapped centerline length including island/approach connections: 237.8 m; cited structural or secondary length: 237 m. These measure different endpoints.
- Modeled width: 25 m; deck above local support datum: 7.2 m. Unpublished pier, rail, parapet, sculpture and crown sizes are visual estimates.
- Local frame: metres, +X east / +Y up / +Z south. `y=0` is a local conceptual support datum. No DEM, sea-level height, Mercator scale or moving scene datum is baked in.

Current mapped crossing ways checked 29 September 2026: [way 172948769](https://www.openstreetmap.org/way/172948769), [way 699874629](https://www.openstreetmap.org/way/699874629), [way 1410449420](https://www.openstreetmap.org/way/1410449420).

### Photo comparison

[Visual reference photograph](https://commons.wikimedia.org/wiki/File:Pont_de_Bir-Hakeim_and_view_on_the_16th_Arrondissement_of_Paris_140124_1.jpg). The reference photograph shows the elevated Métro viaduct above an open roadway and a repeated iron support rhythm. The model separates those levels and keeps the island portico open; wrought ornament and train infrastructure are simplified. The linked photo remains with its source and is not distributed with this library.

## Build and cost

Editable source: [paris-bridges-geometry.js](../../src/peregrine/landmarks/paris-bridges-geometry.js). Run `pnpm build:paris-bridges` and `pnpm models:license`; both near/far GLBs are deterministic from the source and their license metadata is stamped. Metrics below are measured after stamping.

| LOD | Bytes | Triangles | Mesh draws |
| --- | ---: | ---: | ---: |
| Near | 4,339,040 | 76,784 | 7 |
| Far | 1,472,104 | 27,204 | 6 |

## Inspection and placement

[Overview](/asset-preview.html?asset=paris-pont-bir-hakeim&view=overview) | [Structure / underside](/asset-preview.html?asset=paris-pont-bir-hakeim&view=structure) | [Support](/asset-preview.html?asset=paris-pont-bir-hakeim&view=piers) | [Deck](/asset-preview.html?asset=paris-pont-bir-hakeim&view=drive)

The bridge host must fit the deck to both bank approaches and sample each support footprint locally. Do not bend the deck over the riverbed. Road/rail/footway ownership must come from current map access tags, and road paint must come from the host's accepted HD road surface. Cityscape: **not tested in the host app**. Full 3D world: **not tested in the host app**. The library inspector tests exports only.

### Captured inspector evidence

- [Near GLB overview](../images/paris-pont-bir-hakeim-overview-glb-near-day.png)
- [Near procedural support view](../images/paris-pont-bir-hakeim-piers-procedural-near-day.png)
- [Far GLB night overview](../images/paris-pont-bir-hakeim-overview-glb-far-night.png)

## Rights

Procedural code and this documentation: MIT. Original GLB models: CC BY 4.0, © 2026 9570-6198 Québec inc. (Codriver). Geographic coordinates are derived from open mapping: © OpenStreetMap contributors, ODbL 1.0. This Codriver-commissioned work has no fabricated outside-contributor CLA signature.

## Street-level revision — 29 September 2026

Three unequal spans per arm, open steel arches, full-width river piers, repeated curved Métro brackets; posts moved out of vehicle lanes.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

Current revision: [near GLB facade/support](../screenshots/paris-refinement/paris-pont-bir-hakeim.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-pont-bir-hakeim-roof-or-structure.png).
