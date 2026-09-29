# Palais Garnier (`paris-palais-garnier`)

## Provenance and geometry

Original procedural geometry commissioned for Codriver on 2026-09-29, authored as MIT source; exported models are CC BY 4.0, © 2026 9570-6198 Québec inc. (Codriver). Geographic placement uses OpenStreetMap contributors’ data, ODbL 1.0 ([notice](https://www.openstreetmap.org/copyright)). Institutional pages and photographs informed visual interpretation; no third-party mesh, image or texture is in the output.

- Primary source: [Palais Garnier institution](https://www.operadeparis.fr/apropos/theatres-et-ateliers/palais-garnier).
- Visual comparison: [exterior / aerial reference](https://www.operadeparis.fr/apropos/theatres-et-ateliers/palais-garnier). The image is linked as reference only and is not redistributed.
- The authored footprint is about 108 × 155 m, with a fly tower around 66 m above local ground. These are modeled estimates; the Paris Opera institutional page confirms the building and its major rooms but does not publish a surveyed exterior size.
- The Place de l’Opéra frontage faces south. The central auditorium dome, side pavilions, north fly tower, roof figures and colonnade are separate masses. Sculptures and ornament are simplified.

## Local frame and export

Origin `[longitude, latitude]`: `[2.33164, 48.87203]`. Local `x` east, `y` up, `z` south, in real metres. `y=0` means the entrance plaza plane, not sea level. There is no baked DEM, terrain exaggeration, scene datum or Mercator scaling. The host must select one rigid foundation datum and handle the edge transition.

Run `pnpm build:paris-palaces` to generate both variants deterministically from [`paris-palaces-geometry.js`](../../src/peregrine/landmarks/paris-palaces-geometry.js). The GLB JSON chunk carries license and source metadata. Metrics below are for the exported default scenes after license stamping.

| Detail | Cost |
| --- | --- |
| Near | 1,713,248 bytes · 33,580 triangles · 7 draws |
| Far | 609,328 bytes · 11,800 triangles · 7 draws |

Inspect [near, facade](/asset-preview.html?asset=paris-palais-garnier&view=facade), [far, roof](/asset-preview.html?asset=paris-palais-garnier&detail=far&view=roof), and [catalog](/asset-catalog.html?asset=paris-palais-garnier). The source selector in the inspector compares procedural geometry with the exported GLB.

## Inspection evidence

- [Near exported GLB, overview](../images/paris-palais-garnier-near.png)
- [Far exported GLB, roof](../images/paris-palais-garnier-far-roof.png)
- [Near procedural source, facade at night](../images/paris-palais-garnier-source-night.png)

These are local Chromium/SwiftShader inspection captures, not images of the driving app. The source and GLB matched from the same authored geometry and their bounds were checked after round trip. A linked institutional/photo reference above informed the corresponding silhouette.

## Placement status

Cityscape: **not tested in the public library**; app integration is assessed separately. Full 3D world: **not tested in the public library**; the library viewer has no terrain sampler. No Tesla hardware cost is claimed. The model is exterior only.

## Street-level revision — 29 September 2026

Seven entrance bays, paired upper columns, loggia, rounded side pavilions, ribbed cupola and differentiated fly tower.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

Current revision: [near GLB facade/support](../screenshots/paris-refinement/paris-palais-garnier.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-palais-garnier-roof-or-structure.png).
