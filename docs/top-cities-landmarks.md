# Top-cities landmarks

Original procedural models of landmarks and architectural road bridges in the cities where Codriver is driven most, beyond the Paris, Toronto, Montréal, Québec, San Francisco and Calgary sets. Forty are planned; each one is published here as soon as it passes review, as a high-detail (`near`) and a low-detail (`far`) self-contained GLB. Code and generators are MIT, models are CC BY 4.0, and mapped footprints and alignments come from OpenStreetMap (ODbL 1.0).

Build the released models: `pnpm build:top-cities-landmarks` (one or more ids, or `--all`). Each landmark has its own documentation page in [docs/assets](assets/), named `top-cities-<id>.md`.

## The collection (41 released)

| id | Landmark | City | Kind |
| --- | --- | --- | --- |
| `tower-bridge` | Tower Bridge | London | bridge, road-fitted |
| `palace-of-westminster` | Palace of Westminster and Elizabeth Tower | London | building |
| `st-pauls-cathedral` | St Paul's Cathedral | London | building |
| `the-shard` | The Shard | London | building |
| `rijksmuseum` | Rijksmuseum | Amsterdam | building |
| `amsterdam-centraal` | Amsterdam Centraal station | Amsterdam | building |
| `eye-filmmuseum` | EYE Filmmuseum | Amsterdam | building |
| `palacio-real-de-madrid` | Palacio Real de Madrid | Madrid | building |
| `puerta-de-alcala` | Puerta de Alcalá | Madrid | building |
| `puerta-de-europa` | Puerta de Europa (KIO Towers) | Madrid | building |
| `reunion-tower` | Reunion Tower | Dallas | building |
| `bank-of-america-plaza-dallas` | Bank of America Plaza | Dallas | building |
| `margaret-hunt-hill-bridge` | Margaret Hunt Hill Bridge | Dallas | bridge, road-fitted |
| `margaret-mcdermott-bridge` | Margaret McDermott Bridge | Dallas | bridge, road-fitted |
| `washington-monument` | Washington Monument | Washington | building |
| `united-states-capitol` | United States Capitol | Washington | building |
| `lincoln-memorial` | Lincoln Memorial | Washington | building |
| `arlington-memorial-bridge` | Arlington Memorial Bridge | Washington | bridge, road-fitted |
| `edificio-coltejer` | Edificio Coltejer | Medellín | building |
| `catedral-metropolitana-de-medellin` | Catedral Metropolitana de Medellín | Medellín | building |
| `palacio-de-la-cultura-medellin` | Palacio de la Cultura Rafael Uribe Uribe | Medellín | building |
| `old-orange-county-courthouse` | Old Orange County Courthouse | Santa Ana | building |
| `christ-cathedral` | Christ Cathedral | Garden Grove | building |
| `mission-inn` | Mission Inn | Riverside | building |
| `palace-of-the-parliament` | Palace of the Parliament | Bucharest | building |
| `arcul-de-triumf` | Arcul de Triumf | Bucharest | building |
| `romanian-athenaeum` | Romanian Athenaeum | Bucharest | building |
| `colosseum` | Colosseum | Rome | building |
| `altare-della-patria` | Altare della Patria | Rome | building |
| `st-peters-basilica` | St. Peter's Basilica | Rome | building |
| `teatro-nacional-de-costa-rica` | Teatro Nacional de Costa Rica | San José | building |
| `catedral-metropolitana-san-jose` | Catedral Metropolitana de San José | San José | building |
| `basilique-de-fourviere` | Basilique Notre-Dame de Fourvière | Lyon | building |
| `tour-part-dieu` | Tour Part-Dieu (le Crayon) | Lyon | building |
| `musee-des-confluences` | Musée des Confluences | Lyon | building |
| `gratte-ciel-villeurbanne` | Gratte-Ciel de Villeurbanne | Villeurbanne | building |
| `torre-colpatria` | Torre Colpatria | Bogotá | building |
| `catedral-primada-de-colombia` | Catedral Primada de Colombia | Bogotá | building |
| `liberty-memorial` | Liberty Memorial (National WWI Museum) | Kansas City | building |
| `christopher-s-bond-bridge` | Christopher S. Bond Bridge | Kansas City | bridge, road-fitted |
| `lions-gate-bridge` | Lions Gate Bridge | Vancouver | bridge, road-fitted |

## A landmark is a folder

`src/peregrine/landmarks/top-cities/<id>/` holds the landmark's generator (`config.js`, `footprint.js`, `geometry.js`, `views.js` and helpers); `top-cities/registry.js` and `authoring.js` list them. Folders of landmarks not yet released are stubs.

## Frame

Real metres, **+X east, +Y up, +Z south**, around the `origin`. Local `y = 0` is the structure's base on flat ground; no terrain, sea level or map projection is baked in. The real orientation is already part of the geometry, so a host must not rotate the model again. Hills are not modelled: a host with terrain places each building rigidly on its own foundation (the manifests carry an explicit terrain pad where the ground varies). Road bridges document their deck profile: on flat ground each deck rises from its approach roads to its height over the river.

## Budgets

Every model stays within: buildings near ≤ 60 000 triangles / 14 draws / 2.5 MB and far ≤ 12 000 / 8 / 500 KB; bridges near ≤ 120 000 / 40 / 4.5 MB and far ≤ 30 000 / 10 / 1.2 MB. The far model keeps the near silhouette (within 5 % on every axis). Materials are untextured and named, so a host can recolour them for a night theme; `glow`, `light`, `lamp` and `sign` are meant to be drawn unlit.

## Provenance

Original procedural geometry. Footprints, alignments and orientations come from OpenStreetMap; dimensions from published sources where they exist, otherwise estimated from photographs used only for local comparison. Each landmark's documentation separates sourced from estimated values and lists its approximations. No scan, third-party mesh, photograph or texture is included.
