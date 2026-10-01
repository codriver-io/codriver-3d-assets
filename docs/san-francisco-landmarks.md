# San Francisco landmarks

Twenty-five original procedural models of the San Francisco Bay Area's best-known bridges and buildings, each exported as a high-detail (`near`) and a low-detail (`far`) self-contained GLB. Code and generators are MIT, models are CC BY 4.0, and mapped footprints and alignments come from OpenStreetMap (ODbL 1.0). Browse them in the [library](https://codriver-3d-assets.pages.dev/?city=San+Francisco#library).

Build every model: `pnpm build:san-francisco-landmarks` (one or more ids, or all). Each landmark has its own documentation page in [docs/assets](assets/), named `san-francisco-<id>.md`.

## The collection

| id | Landmark | Kind |
| --- | --- | --- |
| `golden-gate-bridge` | Golden Gate Bridge | bridge |
| `bay-bridge-west-span` | Bay Bridge, West Span (twin suspension spans, double deck) | bridge |
| `bay-bridge-east-span` | Bay Bridge, East Span (self-anchored suspension span and skyway) | bridge |
| `lefty-odoul-bridge` | Lefty O'Doul Bridge (Third Street bascule, superstructure) | bridge |
| `transamerica-pyramid` | Transamerica Pyramid | building |
| `salesforce-tower` | Salesforce Tower | building |
| `555-california-street` | 555 California Street | building |
| `columbus-tower` | Columbus Tower (Sentinel Building) | building |
| `ferry-building` | Ferry Building | building |
| `sfmoma` | San Francisco Museum of Modern Art | building |
| `san-francisco-city-hall` | San Francisco City Hall | building |
| `coit-tower` | Coit Tower | building |
| `sutro-tower` | Sutro Tower | building |
| `grace-cathedral` | Grace Cathedral | building |
| `cathedral-of-saint-mary` | Cathedral of Saint Mary of the Assumption | building |
| `painted-ladies` | Painted Ladies (Postcard Row, 710–720 Steiner) | building |
| `palace-of-fine-arts` | Palace of Fine Arts | building |
| `ghirardelli-square` | Ghirardelli Square | building |
| `alcatraz-island` | Alcatraz Island (cellhouse, lighthouse, water tower) | building |
| `oracle-park` | Oracle Park | building |
| `chase-center` | Chase Center | building |
| `conservatory-of-flowers` | Conservatory of Flowers | building |
| `de-young-museum` | de Young Museum | building |
| `california-academy-of-sciences` | California Academy of Sciences | building |
| `legion-of-honor` | California Palace of the Legion of Honor | building |

## A landmark is a folder

`src/peregrine/landmarks/san-francisco/<id>/` holds one landmark:

| File | Purpose |
| --- | --- |
| `config.js` | `SPEC` (id, name, kind, `[longitude, latitude]` origin, height, terrain pad radius, frontage bearing), light and dark `PALETTES` (material name → colour, same names in both), and `MANIFEST` text (elevation datum, attribution, what is estimated) |
| `footprint.js` | the OpenStreetMap outlines the model stands in, as `[longitude, latitude]` rings, and their OSM ids |
| `geometry.js` | `create({ detail })` returns a Three.js group for `'near'` or `'far'` |
| `views.js` | inspector cameras `{ name: [eye, target] }` in the model's metres |

`registry.js` and `authoring.js` list the folders. Exports are `public/models/{buildings,bridges}/<id>-near.glb`, `<id>-far.glb` and the `<id>.json` manifest with measured triangles, draw calls and bytes.

## Frame

Real metres, **+X east, +Y up, +Z south**, around the `origin`. Local `y = 0` is the structure's base on flat ground; no terrain, sea level or map projection is baked in. The real orientation is already part of the geometry, so a host must not rotate the model again. Hills (Telegraph Hill under Coit Tower, Mount Sutro, Nob Hill, Alcatraz's rock) are not modelled: a host with terrain places each building rigidly on its own foundation. Bridges document their deck profile; on flat ground the deck rises from the approach roads to its published height.

## Budgets

Every model stays within: buildings near ≤ 60 000 triangles / 14 draws / 2.5 MB and far ≤ 12 000 / 8 / 500 KB; bridges near ≤ 120 000 / 40 / 4.5 MB and far ≤ 30 000 / 10 / 1.2 MB. The far model keeps the near silhouette (within 5 % on every axis). Materials are untextured and named, so a host can recolour them for a night theme; `glow`, `light`, `lamp` and `sign` are meant to be drawn unlit.

## Provenance

Original procedural geometry. Footprints, alignments and orientations come from OpenStreetMap; dimensions from published sources where they exist, otherwise estimated from photographs used only for local comparison. Each landmark's documentation separates sourced from estimated values and lists its approximations. No scan, third-party mesh, photograph or texture is included.
