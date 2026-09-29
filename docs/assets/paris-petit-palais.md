# Petit Palais (`paris-petit-palais`)

## Provenance and geometry

Original procedural geometry commissioned for Codriver on 2026-09-29, authored as MIT source; exported models are CC BY 4.0, © 2026 9570-6198 Québec inc. (Codriver). Geographic placement uses OpenStreetMap contributors’ data, ODbL 1.0 ([notice](https://www.openstreetmap.org/copyright)). Institutional pages and photographs informed visual interpretation; no third-party mesh, image or texture is in the output.

- Primary source: [Petit Palais institution](https://parismusees.paris.fr/en/node/5829).
- Visual comparison: [exterior / aerial reference](https://www.petitpalais.paris.fr/professionnels/tournage-et-prise-de-vue). The image is linked as reference only and is not redistributed.
- Paris Musées publishes a 125 m facade length. The authoring front is 125 m; the roughly 104 m width and roof heights are estimated from the architectural plan and photographs.
- The entrance opens west toward Avenue Winston Churchill. The colonnaded front, central arch and dome, side galleries and garden court are separate from the Grand Palais asset. The garden is an open void.

## Local frame and export

Origin `[longitude, latitude]`: `[2.31454, 48.86603]`. Local `x` east, `y` up, `z` south, in real metres. `y=0` means the entrance plaza plane, not sea level. There is no baked DEM, terrain exaggeration, scene datum or Mercator scaling. The host must select one rigid foundation datum and handle the edge transition.

Run `pnpm build:paris-palaces` to generate both variants deterministically from [`paris-palaces-geometry.js`](../../src/peregrine/landmarks/paris-palaces-geometry.js). The GLB JSON chunk carries license and source metadata. Metrics below are for the exported default scenes after license stamping.

| Detail | Cost |
| --- | --- |
| Near | 705,468 bytes · 16,354 triangles · 7 draws |
| Far | 280,384 bytes · 6,286 triangles · 6 draws |

Inspect [near, facade](/asset-preview.html?asset=paris-petit-palais&view=facade), [far, roof](/asset-preview.html?asset=paris-petit-palais&detail=far&view=roof), and [catalog](/asset-catalog.html?asset=paris-petit-palais). The source selector in the inspector compares procedural geometry with the exported GLB.

## Inspection evidence

- [Near exported GLB, overview](../images/paris-petit-palais-near.png)
- [Far exported GLB, roof](../images/paris-petit-palais-far-roof.png)
- [Near procedural source, facade at night](../images/paris-petit-palais-source-night.png)

These are local Chromium/SwiftShader inspection captures, not images of the driving app. The source and GLB matched from the same authored geometry and their bounds were checked after round trip. A linked institutional/photo reference above informed the corresponding silhouette.

## Placement status

Cityscape: **not tested in the public library**; app integration is assessed separately. Full 3D world: **not tested in the public library**; the library viewer has no terrain sampler. No Tesla hardware cost is claimed. The model is exterior only.

## Street-level revision — 29 September 2026

West-facing arch and gilded gate, façade columns and bays, shallow ribbed entrance dome, retained garden void.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

Current revision: [near GLB facade/support](../screenshots/paris-refinement/paris-petit-palais.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-petit-palais-roof-or-structure.png).
