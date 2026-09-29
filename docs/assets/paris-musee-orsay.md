# Musée d’Orsay (`paris-musee-orsay`)

## Provenance and geometry

Original procedural geometry commissioned for Codriver on 2026-09-29, authored as MIT source; exported models are CC BY 4.0, © 2026 9570-6198 Québec inc. (Codriver). Geographic placement uses OpenStreetMap contributors’ data, ODbL 1.0 ([notice](https://www.openstreetmap.org/copyright)). Institutional pages and photographs informed visual interpretation; no third-party mesh, image or texture is in the output.

- Primary source: [Musée d’Orsay institution](https://www.musee-orsay.fr/en/node/385/architecture).
- Visual comparison: [exterior / aerial reference](https://www.musee-orsay.fr/fr/oeuvres/projet-de-gare-sur-le-quai-dorsay-elevation-du-pavillon-central-de-la-facade-cote-seine-58010). The image is linked as reference only and is not redistributed.
- The museum identifies the building as Victor Laloux’s former Orsay station, begun in 1898 and opened in 1900. The modeled 218 × 86 m envelope and roof heights are estimates, pending a surveyed plan.
- The long axis runs east-west along the Seine. Stone side ranges flank a glass and iron vaulted train hall, with end pavilions and river-facing clock bays. Clock hands are static.

## Local frame and export

Origin `[longitude, latitude]`: `[2.32575, 48.86]`. Local `x` east, `y` up, `z` south, in real metres. `y=0` means the entrance plaza plane, not sea level. There is no baked DEM, terrain exaggeration, scene datum or Mercator scaling. The host must select one rigid foundation datum and handle the edge transition.

Run `pnpm build:paris-palaces` to generate both variants deterministically from [`paris-palaces-geometry.js`](../../src/peregrine/landmarks/paris-palaces-geometry.js). The GLB JSON chunk carries license and source metadata. Metrics below are for the exported default scenes after license stamping.

| Detail | Cost |
| --- | --- |
| Near | 1,740,068 bytes · 31,542 triangles · 7 draws |
| Far | 515,180 bytes · 9,130 triangles · 7 draws |

Inspect [near, facade](/asset-preview.html?asset=paris-musee-orsay&view=facade), [far, roof](/asset-preview.html?asset=paris-musee-orsay&detail=far&view=roof), and [catalog](/asset-catalog.html?asset=paris-musee-orsay). The source selector in the inspector compares procedural geometry with the exported GLB.

## Inspection evidence

- [Near exported GLB, overview](../images/paris-musee-orsay-near.png)
- [Far exported GLB, roof](../images/paris-musee-orsay-far-roof.png)
- [Near procedural source, facade at night](../images/paris-musee-orsay-source-night.png)

These are local Chromium/SwiftShader inspection captures, not images of the driving app. The source and GLB matched from the same authored geometry and their bounds were checked after round trip. A linked institutional/photo reference above informed the corresponding silhouette.

## Placement status

Cityscape: **not tested in the public library**; app integration is assessed separately. Full 3D world: **not tested in the public library**; the library viewer has no terrain sampler. No Tesla hardware cost is claimed. The model is exterior only.

## Street-level revision — 29 September 2026

138 x 40 x 32 m hall guide, lower vault, mansards, dormers and vertically oriented river-facing clock dials.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

Current revision: [near GLB facade/support](../screenshots/paris-refinement/paris-musee-orsay.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-musee-orsay-roof-or-structure.png).
