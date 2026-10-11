# Calgary landmarks

Fifteen original procedural models of Calgary's best-known towers, civic buildings and bridges, each exported as a high-detail (`near`) and a low-detail (`far`) self-contained GLB. Code and generators are MIT, models are CC BY 4.0, and mapped footprints and alignments come from OpenStreetMap (ODbL 1.0). Browse them in the [library](https://3d-assets.codriver.io/?city=Calgary#library).

Build every model: `pnpm build:calgary-landmarks` (one or more ids, or all). Each landmark has its own documentation page in [docs/assets](assets/), named `calgary-<id>.md`.

## The collection

| id | Landmark | Kind |
| --- | --- | --- |
| `calgary-tower` | Calgary Tower | building |
| `the-bow` | The Bow | building |
| `brookfield-place-calgary` | Brookfield Place | building |
| `telus-sky` | Telus Sky | building |
| `suncor-energy-centre` | Suncor Energy Centre (west and east towers) | building |
| `bankers-hall` | Bankers Hall (east and west towers) | building |
| `scotiabank-saddledome` | Scotiabank Saddledome | building |
| `calgary-central-library` | Calgary Central Library | building |
| `studio-bell` | Studio Bell, National Music Centre | building |
| `calgary-city-hall` | Calgary City Hall (Old City Hall, 1911) | building |
| `fairmont-palliser` | Fairmont Palliser Hotel | building |
| `canada-olympic-park` | Canada Olympic Park ski jumps | building |
| `calgary-peace-bridge` | Peace Bridge (pedestrian) | bridge |
| `centre-street-bridge` | Centre Street Bridge (double deck) | bridge |
| `reconciliation-bridge` | Reconciliation Bridge (Parker through truss) | bridge |

## A landmark is a folder

`src/peregrine/landmarks/calgary/<id>/` holds one landmark:

| File | Purpose |
| --- | --- |
| `config.js` | `SPEC` (id, name, kind, `[longitude, latitude]` origin, height, terrain pad radius, frontage bearing), light and dark `PALETTES` (material name → colour, same names in both), and `MANIFEST` text (elevation datum, attribution, what is estimated) |
| `footprint.js` | the OpenStreetMap outlines the model stands in, as `[longitude, latitude]` rings, and their OSM ids |
| `geometry.js` | `create({ detail })` returns a Three.js group for `'near'` or `'far'` |
| `views.js` | inspector cameras `{ name: [eye, target] }` in the model's metres |

`registry.js` and `authoring.js` list the folders. Exports are `public/models/{buildings,bridges}/<id>-near.glb`, `<id>-far.glb` and the `<id>.json` manifest with measured triangles, draw calls and bytes.

## Frame

Real metres, **+X east, +Y up, +Z south**, around the `origin`. Local `y = 0` is the structure's base on flat ground; no terrain, sea level or map projection is baked in. The real orientation is already part of the geometry, so a host must not rotate the model again. Downtown Calgary is nearly flat; the Canada Olympic Park ski jumps stand on the Paskapoo Slopes. Hills are not modelled: a host with terrain places each structure rigidly on its own foundation (the ski jumps' `y = 0` is their lowest take-off, and every support reaches it, so on terrain the hill hides the lower supports). The Centre Street and Reconciliation bridges document their deck profile (on flat ground the Centre Street upper deck rises from the approach roads to its height over the lower deck); the Peace Bridge is a free-standing span at path level.

## Budgets

Every model stays within: buildings near ≤ 60 000 triangles / 14 draws / 2.5 MB and far ≤ 12 000 / 8 / 500 KB; bridges near ≤ 120 000 / 40 / 4.5 MB and far ≤ 30 000 / 10 / 1.2 MB. The far model keeps the near silhouette (within 5 % on every axis). Materials are untextured and named, so a host can recolour them for a night theme; `glow`, `light`, `lamp` and `sign` are meant to be drawn unlit.

## Provenance

Original procedural geometry. Footprints, alignments and orientations come from OpenStreetMap; dimensions from published sources where they exist, otherwise estimated from photographs used only for local comparison. Each landmark's documentation separates sourced from estimated values and lists its approximations. No scan, third-party mesh, photograph or texture is included.
