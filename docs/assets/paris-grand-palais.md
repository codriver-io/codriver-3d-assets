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
| Near | 1,096,828 bytes · 27,902 triangles · 6 draws |
| Far | 258,416 bytes · 6,314 triangles · 6 draws |

Inspect [near, facade](/asset-preview.html?asset=paris-grand-palais&view=facade), [far, roof](/asset-preview.html?asset=paris-grand-palais&detail=far&view=roof), and [catalog](/asset-catalog.html?asset=paris-grand-palais). The source selector in the inspector compares procedural geometry with the exported GLB.

## Inspection evidence

- [Near exported GLB, overview](../images/paris-grand-palais-near.png)
- [Far exported GLB, roof](../images/paris-grand-palais-far-roof.png)
- [Near procedural source, facade at night](../images/paris-grand-palais-source-night.png)

These are local Chromium/SwiftShader inspection captures, not images of the driving app. The source and GLB matched from the same authored geometry and their bounds were checked after round trip. A linked institutional/photo reference above informed the corresponding silhouette.

## Placement status

Cityscape: **not tested in the public library**; app integration is assessed separately. Full 3D world: **not tested in the public library**; the library viewer has no terrain sampler. No Tesla hardware cost is claimed. The model is exterior only.

## Street-level revision — 29 September 2026

Lower glazed nave with transverse ribs and longitudinal bars, raised crossing, side colonnades and entrance orders.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

First refinement: [near GLB facade/support](../screenshots/paris-refinement/paris-grand-palais.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-grand-palais-roof-or-structure.png).


## Second architectural pass

Second pass: intersecting glazed vaults, rounded nave ends, fine glazing bars, paired truss ribs, raised ridge lanterns and a flattened cupola with radial and concentric framing. The glass roof uses tinted opaque glazing for predictable rendering; interiors are not modeled.

See [references and validation](../paris-second-pass.md).

Current second pass: [near GLB façade](../screenshots/paris-second-pass/paris-grand-palais.png) · [near GLB roof](../screenshots/paris-second-pass/paris-grand-palais-roof.png).


## Geographic registration revision

The source and GLBs now include the mapped origin, facade bearing and documented horizontal fit. Heights remain unchanged; the host must apply only geographic scale and its ground datum. See [Paris registration](../paris/placement.md) for reference coordinates, partial-palace scope and approximation limits. Host Cityscape and Full 3D world were checked in the desktop renderer with live map data; this is not vehicle-hardware or authenticated-session evidence.

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). vault lattice kept sparse (major ribs about every 8 m, 13 m far, no fine transverse bars); columns, windows and balustrade are simple shafts, framed quads and parapets. Exported cost: near 27,902 triangles / 6 draws / 1,096,828 bytes; far 6,314 / 6 / 258,416.
