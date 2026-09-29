# Pont de la Concorde

**ID:** `paris-pont-concorde` · **status:** ready export · **creator:** Codriver, original procedural geometry commissioned in 2026 with AI assistance. This is a visual approximation, not a survey.

## References and dimensions

The Paris planning heritage document describes five shallow arches with 25–31 m spans and a flattened deck; 153 m length and 34 m width are secondary published figures. The 155.2 m mapped centerline includes bank ends. [Primary reference](https://regles-urbanisme.paris.fr/plu-bioclimatique/servlet/plugins/document/resource?id=447&id_attribute=93&working_content=true). [Mapped feature and geographic credit](https://www.openstreetmap.org/copyright). Source images are linked references only; no photograph, map tile, third-party mesh or texture is included.

- Origin: `[2.3196, 48.86338]` [longitude, latitude].
- Mapped bridge centerline: `[[2.3191283, 48.862748], [2.3196122, 48.8634034], [2.3200548, 48.8640023]]` [longitude, latitude]. Derived from the named OSM crossing ways below; abutment footprint and transverse width remain estimates.
- Mapped centerline length including island/approach connections: 155.2 m; cited structural or secondary length: 153 m. These measure different endpoints.
- Modeled width: 34 m; deck above local support datum: 7.2 m. Unpublished pier, rail, parapet, sculpture and crown sizes are visual estimates.
- Local frame: metres, +X east / +Y up / +Z south. `y=0` is a local conceptual support datum. No DEM, sea-level height, Mercator scale or moving scene datum is baked in.

Current mapped crossing ways checked 29 September 2026: [way 139093031](https://www.openstreetmap.org/way/139093031).

### Photo comparison

[Visual reference photograph](https://commons.wikimedia.org/wiki/File:Pont_de_la_Concorde_Palais_Bourbon_Paris.jpg). The reference photograph shows substantial masonry piers, shallow arches and a broad parapet. The model keeps the five arch silhouette, while voussoirs, balusters and pier detailing are simplified. The linked photo remains with its source and is not distributed with this library.

## Build and cost

Editable source: [paris-bridges-geometry.js](../../src/peregrine/landmarks/paris-bridges-geometry.js). Run `pnpm build:paris-bridges` and `pnpm models:license`; both near/far GLBs are deterministic from the source and their license metadata is stamped. Metrics below are measured after stamping.

| LOD | Bytes | Triangles | Mesh draws |
| --- | ---: | ---: | ---: |
| Near | 834,772 | 18,042 | 6 |
| Far | 164,624 | 3,692 | 5 |

## Inspection and placement

[Overview](/asset-preview.html?asset=paris-pont-concorde&view=overview) | [Structure / underside](/asset-preview.html?asset=paris-pont-concorde&view=structure) | [Support](/asset-preview.html?asset=paris-pont-concorde&view=piers) | [Deck](/asset-preview.html?asset=paris-pont-concorde&view=drive)

The bridge host must fit the deck to both bank approaches and sample each support footprint locally. Do not bend the deck over the riverbed. Road/rail/footway ownership must come from current map access tags, and road paint must come from the host's accepted HD road surface. Cityscape: **not tested in the host app**. Full 3D world: **not tested in the host app**. The library inspector tests exports only.

### Captured inspector evidence

- [Near GLB overview](../images/paris-pont-concorde-overview-glb-near-day.png)
- [Near procedural support view](../images/paris-pont-concorde-piers-procedural-near-day.png)
- [Far GLB night overview](../images/paris-pont-concorde-overview-glb-far-night.png)

## Rights

Procedural code and this documentation: MIT. Original GLB models: CC BY 4.0, © 2026 9570-6198 Québec inc. (Codriver). Geographic coordinates are derived from open mapping: © OpenStreetMap contributors, ODbL 1.0. This Codriver-commissioned work has no fabricated outside-contributor CLA signature.

## Street-level revision — 29 September 2026

Five regularly distributed shallow vaults independent of alignment nodes, full-width piers, parapets and lamps.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

Current revision: [near GLB facade/support](../screenshots/paris-refinement/paris-pont-concorde.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-pont-concorde-roof-or-structure.png).
