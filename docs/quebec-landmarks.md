# Québec landmarks

Twenty original procedural models of the province of Québec's most visited landmarks and its road bridges (beyond the Montréal set already in the library), each exported as a high-detail (`near`) and a low-detail (`far`) self-contained GLB. Code and generators are MIT, models are CC BY 4.0, and mapped footprints and alignments come from OpenStreetMap (ODbL 1.0). Browse them in the [library](https://3d-assets.codriver.io/?city=Qu%C3%A9bec#library).

Build every model: `pnpm build:quebec-landmarks` (one or more ids, or all). Each landmark has its own documentation page in [docs/assets](assets/), named `quebec-<id>.md`.

## The collection

| id | Landmark | City | Kind |
| --- | --- | --- | --- |
| `chateau-frontenac` | Château Frontenac | Québec | building |
| `casino-de-montreal` | Casino de Montréal | Montréal | building |
| `centre-bell` | Centre Bell | Montréal | building |
| `canadian-museum-of-history` | Canadian Museum of History | Gatineau | building |
| `basilique-sainte-anne-de-beaupre` | Basilique Sainte-Anne-de-Beaupré | Sainte-Anne-de-Beaupré | building |
| `marche-bonsecours` | Marché Bonsecours | Montréal | building |
| `hotel-de-ville-de-montreal` | Hôtel de Ville de Montréal | Montréal | building |
| `hotel-du-parlement` | Hôtel du Parlement | Québec | building |
| `notre-dame-de-quebec` | Basilique-cathédrale Notre-Dame de Québec | Québec | building |
| `edifice-marie-guyart` | Édifice Marie-Guyart | Québec | building |
| `marie-reine-du-monde` | Cathédrale Marie-Reine-du-Monde | Montréal | building |
| `notre-dame-du-cap` | Basilique Notre-Dame-du-Cap | Trois-Rivières | building |
| `biodome-de-montreal` | Biodôme de Montréal | Montréal | building |
| `mnbaq-pavillon-lassonde` | Pavillon Pierre-Lassonde (MNBAQ) | Québec | building |
| `gare-du-palais` | Gare du Palais | Québec | building |
| `pont-pierre-laporte` | Pont Pierre-Laporte | Québec–Lévis | bridge |
| `pont-papineau-leblanc` | Pont Papineau-Leblanc | Montréal–Laval | bridge |
| `pont-laviolette` | Pont Laviolette | Trois-Rivières–Bécancour | bridge |
| `pont-de-quebec` | Pont de Québec | Québec–Lévis | bridge |
| `pont-dubuc` | Pont Dubuc | Saguenay | bridge |

## A landmark is a folder

`src/peregrine/landmarks/quebec/<id>/` holds one landmark:

| File | Purpose |
| --- | --- |
| `config.js` | `SPEC` (id, name, kind, `[longitude, latitude]` origin, height, terrain pad radius, frontage bearing), light and dark `PALETTES` (material name → colour, same names in both), and `MANIFEST` text (elevation datum, attribution, what is estimated) |
| `footprint.js` | the OpenStreetMap outlines the model stands in, as `[longitude, latitude]` rings, and their OSM ids |
| `geometry.js` | `create({ detail })` returns a Three.js group for `'near'` or `'far'` |
| `views.js` | inspector cameras `{ name: [eye, target] }` in the model's metres |

`registry.js` and `authoring.js` list the folders. Exports are `public/models/{buildings,bridges}/<id>-near.glb`, `<id>-far.glb` and the `<id>.json` manifest with measured triangles, draw calls and bytes.

## Frame

Real metres, **+X east, +Y up, +Z south**, around the `origin`. Local `y = 0` is the structure's base on flat ground; no terrain, sea level or map projection is baked in. The real orientation is already part of the geometry, so a host must not rotate the model again. Several sites stand on relief (the Château Frontenac and the Hôtel du Parlement on the Cap Diamant promontory, riverbank basilicas); hills are not modelled: a host with terrain places each building rigidly on its own foundation (the manifests carry an explicit terrain pad where the ground varies). The five road bridges document their deck profile: on flat ground each deck rises from its approach roads to its height over the river, clear of the nearest junctions.

## Budgets

Every model stays within: buildings near ≤ 60 000 triangles / 14 draws / 2.5 MB and far ≤ 12 000 / 8 / 500 KB; bridges near ≤ 120 000 / 40 / 4.5 MB and far ≤ 30 000 / 10 / 1.2 MB. The far model keeps the near silhouette (within 5 % on every axis). Materials are untextured and named, so a host can recolour them for a night theme; `glow`, `light`, `lamp` and `sign` are meant to be drawn unlit.

## Provenance

Original procedural geometry. Footprints, alignments and orientations come from OpenStreetMap; dimensions from published sources where they exist, otherwise estimated from photographs used only for local comparison. Each landmark's documentation separates sourced from estimated values and lists its approximations. No scan, third-party mesh, photograph or texture is included.
