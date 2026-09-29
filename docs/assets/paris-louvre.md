# Palais du Louvre (`paris-louvre`)

## Provenance and geometry

Original procedural geometry commissioned for Codriver on 2026-09-29, authored as MIT source; exported models are CC BY 4.0, © 2026 9570-6198 Québec inc. (Codriver). Geographic placement uses OpenStreetMap contributors’ data, ODbL 1.0 ([notice](https://www.openstreetmap.org/copyright)). Institutional pages and photographs informed visual interpretation; no third-party mesh, image or texture is in the output.

- Primary source: [Palais du Louvre institution](https://presse.louvre.fr/le-musee-du-louvre-1063000201419/?lang=fr).
- Visual comparison: [exterior / aerial reference](https://imagesdefense.gouv.fr/fr/paris-1er-le-palais-du-louvre-d-ouest-en-est.html). The image is linked as reference only and is not redistributed.
- The Louvre press office reports 3,000 m of facade across the full palace, including courts. The submitted model scopes the historic palace wings, includes the modern entrance pyramid, and measures about 602 × 238 m from generated bounds. The latter is an authored estimate, not a survey.
- Long north and south wings, east Cour Carrée ranges and Pavillon Sully. Cour Napoléon stays open around the pyramid and the eastern Cour Carrée remains open. Pavilion heights, roof pitches and facade rhythm are visual estimates.

## Local frame and export

Origin `[longitude, latitude]`: `[2.3335, 48.86124]`. Local `x` east, `y` up, `z` south, in real metres. `y=0` means the entrance plaza plane, not sea level. There is no baked DEM, terrain exaggeration, scene datum or Mercator scaling. The host must select one rigid foundation datum and handle the edge transition.

Run `pnpm build:paris-palaces` to generate both variants deterministically from [`paris-palaces-geometry.js`](../../src/peregrine/landmarks/paris-palaces-geometry.js). The GLB JSON chunk carries license and source metadata. Metrics below are for the exported default scenes after license stamping.

| Detail | Cost |
| --- | --- |
| Near | 8,397,548 bytes · 155,885 triangles · 8 draws |
| Far | 2,459,088 bytes · 44,059 triangles · 8 draws |

Inspect [near, facade](/asset-preview.html?asset=paris-louvre&view=facade), [far, roof](/asset-preview.html?asset=paris-louvre&detail=far&view=roof), and [catalog](/asset-catalog.html?asset=paris-louvre). The source selector in the inspector compares procedural geometry with the exported GLB.

## Inspection evidence

- [Near exported GLB, overview](../images/paris-louvre-near.png)
- [Far exported GLB, roof](../images/paris-louvre-far-roof.png)
- [Near procedural source, facade at night](../images/paris-louvre-source-night.png)

These are local Chromium/SwiftShader inspection captures, not images of the driving app. The source and GLB matched from the same authored geometry and their bounds were checked after round trip. A linked institutional/photo reference above informed the corresponding silhouette.

## Placement status

Cityscape: **not tested in the public library**; app integration is assessed separately. Full 3D world: **not tested in the public library**; the library viewer has no terrain sampler. No Tesla hardware cost is claimed. The model is exterior only.

## Street-level revision — 29 September 2026

Mansard pavilions, Sully roof and clock, articulated street/court bays, dormers and eastern paired colonnade; pyramid included in the second pass.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

First refinement: [near GLB facade/support](../screenshots/paris-refinement/paris-louvre.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-louvre-roof-or-structure.png).


## Second architectural pass

Second pass: projecting courtyard pavilions, articulated dormers and west-facing Sully detail; includes a 35 m square, 21 m high entrance pyramid with transparent diamond glazing. Pyramid location (170, 0) follows the schematic court frame and needs surveyed geographic alignment.

See [references and validation](../paris-second-pass.md).

Current second pass: [near GLB façade](../screenshots/paris-second-pass/paris-louvre.png) · [near GLB roof](../screenshots/paris-second-pass/paris-louvre-roof.png).

Rendering fixes: see the [window, niche and roof-support corrections](../paris-rendering-fixes.md).
