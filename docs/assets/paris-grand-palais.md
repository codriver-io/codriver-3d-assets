# Grand Palais (`paris-grand-palais`)

## Provenance and geometry

Original procedural geometry commissioned for Codriver on 2026-09-29, authored as MIT source; exported models are CC BY 4.0, © 2026 9570-6198 Québec inc. (Codriver). Geographic placement uses OpenStreetMap contributors’ data, ODbL 1.0 ([notice](https://www.openstreetmap.org/copyright)). Institutional pages and photographs informed visual interpretation; no third-party mesh, image or texture is in the output.

- Primary source: [Grand Palais institution](https://www.grandpalais.fr/sites/default/files/2025-02/BROCHURE-LOCATION-GRAND-PALAIS-24-25.pdf).
- Visual comparison: [exterior / aerial reference](https://www.cegelec-tertiaireidf.com/references/le-grand-palais-paris/). The image is linked as reference only and is not redistributed.
- The Grand Palais technical brochure gives its nave as 200 m long, approximately 50 m wide and 45 m below the dome. The authoring envelope is approximately 144 × 202 m; glass vault and crossing dimensions outside that published nave measurement are estimates.
- Glazed barrel vault, crossing dome, repeated iron ribs and stone street facade. The roof uses economical opaque translucent color, with no photo or custom texture.

## Local frame and export

Origin `[longitude, latitude]`: `[2.31253, 48.86612]`. Local `x` east, `y` up, `z` south, in real metres. `y=0` means the entrance plaza plane, not sea level. There is no baked DEM, terrain exaggeration, scene datum or Mercator scaling. The host must select one rigid foundation datum and handle the edge transition.

Run `pnpm build:paris-palaces` to generate both variants deterministically from [`paris-palaces-geometry.js`](../../src/peregrine/landmarks/paris-palaces-geometry.js). The GLB JSON chunk carries license and source metadata. Metrics below are for the exported default scenes after license stamping.

| Detail | Cost |
| --- | --- |
| Near | 382,644 bytes · 8,072 triangles · 5 draws |
| Far | 94,608 bytes · 1,916 triangles · 4 draws |

Inspect [near, facade](/asset-preview.html?asset=paris-grand-palais&view=facade), [far, roof](/asset-preview.html?asset=paris-grand-palais&detail=far&view=roof), and [catalog](/asset-catalog.html?asset=paris-grand-palais). The source selector in the inspector compares procedural geometry with the exported GLB.

## Inspection evidence

- [Near exported GLB, overview](../images/paris-grand-palais-near.png)
- [Far exported GLB, roof](../images/paris-grand-palais-far-roof.png)
- [Near procedural source, facade at night](../images/paris-grand-palais-source-night.png)

These are local Chromium/SwiftShader inspection captures, not images of the driving app. The source and GLB matched from the same authored geometry and their bounds were checked after round trip. A linked institutional/photo reference above informed the corresponding silhouette.

## Placement status

Cityscape: **not tested in the public library**; app integration is assessed separately. Full 3D world: **not tested in the public library**; the library viewer has no terrain sampler. No Tesla hardware cost is claimed. The model is exterior only.
