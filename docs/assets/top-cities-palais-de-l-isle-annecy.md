# Palais de l'Isle d'Annecy

Original procedural permanent exterior, 2026-11-10.

## Identity and evidence

Boat-prow triangular prison chapel with a steep red-brown pyramidal roof, projecting latrine oriel and conical cap, rear square keep and irregular courtyard wings; no water or neighbouring buildings.

- [Annecy museums: restoration of masonry and flat-tile roofs, 2016–2017](https://musees.annecy.fr/api/fileadmin/mediatheque_musees/Les_3_lieux/Le-Palais-de-l-ile-en-chantier-Restauration-2016-1.pdf)
- [Official heritage visitor guide: triangular chapel, keep and courtyard](https://musees.annecy.fr/fileadmin/mediatheque_musees/Les_3_lieux/Depliant-Palais-de-l-Ile-d-Annecy-FR-1.pdf)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/37205550)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/37205553)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/1283040655)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/1283040660)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/1391795385)
- [Fichier:Palais de l'Isle in Annecy 11.jpg — Tournasol7 — CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Palais_de_l%27Isle_in_Annecy_11.jpg)
- [Fichier:Palais de l'Isle - Annecy 6-9-2017 10-19-19.JPG — Paul Hermans — CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Palais_de_l%27Isle_-_Annecy_6-9-2017_10-19-19.JPG)

Reference images are comparison-only and retained under ignored `tmp/france-southeast/palais-de-l-isle-annecy/refs/`; no photograph, traced mesh, logo or lettering ships. Photos selected: 1, 2. Historical photographs are used only where the permanent exterior is unchanged; temporary scaffolding, event fit-outs and unrelated pictures are excluded.

## Frame and dimensions

Origin: [6.1271201, 45.8985763]. Local y=0 is the rigid exterior foundation plane; +X east, +Y up, +Z south, real metres. Rotation -0.05392873 radians is baked once using mapped controls [[6.1268111,45.8986693],[6.1270347,45.8986609]] (way 37205550). No terrain or Mercator stretch is authored. OSM ways 37205550, 37205553, 1283040655, 1283040660, 1391795385 define the provider replacement envelope, not an arbitrary bounding rectangle; nearby roads and buildings are not owned.

| Element | Dimension | Evidence |
| --- | --- | --- |
| Chapel eaves / pyramidal apex | 9 / 17 m | Photo-derived estimates |
| Oriel tip including finial | 18.5 m | Photo-derived estimate |
| Keep roof | 14.5 m | Photo-derived estimate |
| Footprint | Five mapped building/roof parts | OSM geometry |

## Modeling choices and limits

No surveyed height was located: 9 m chapel eaves, 17 m roof and 18.5 m oriel finial are explicitly photographic estimates, not published heights. The 2017 restored exterior is used; dossier image 3 is a different courtyard and was rejected. Rigid foundation y=0 is the visible island masonry contact plane, not water level; no canal, paving decal or terrain is included.



Both LODs keep the identifying silhouette, major openings and facade rhythm. Foundations are rigid, not terrain-draped; any modeled ground surface is at least 0.10 m above the local datum. No app terrain certification is implied.

## Reproduction and QA

- Build: `pnpm build:top-cities-landmarks palais-de-l-isle-annecy`.
- Focused test: `node --test src/peregrine/landmarks/top-cities/palais-de-l-isle-annecy/palais-de-l-isle-annecy.test.js`.
- Metrics: `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids palais-de-l-isle-annecy --out tmp/france-southeast/palais-de-l-isle-annecy/metrics.json`.
- Exported reference contact sheet: `tmp/france-southeast/sheets/palais-de-l-isle-annecy.jpg`.
- Red mapped-footprint top view: `tmp/france-southeast/shots/palais-de-l-isle-annecy/`.
- Depth: `node scripts/landmark-depth-layers.mjs --ids palais-de-l-isle-annecy --check`.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3437 | 4 | 66824 |
| far | 2285 | 4 | 49132 |

Author self-review: identifying features, proportions, palette, near/far openings and foundation contact inspected against the credited exterior references; red-ring mapped plan checked. Deterministic metrics: zero remaining flags; depth graph: no unresolved cycles. Focused structural tests and exported round-trip conformance pass. Model readiness: ready. Independent review is pending; author self-review is not an independent verdict.

**Cityscape: not tested. Full 3D world: not tested.** No app server was started. DEM/pad boundaries, provider lifecycle, live shared shading and hardware performance remain unverified.


## Independent-review correction, 2026-11-11

Closed both long sides of the connecting slab with continuous 0.40 m thick masonry parapets rising 1.35 m above the y=0.20 m deck (top y=1.55 m), from the rear wings to the pointed chapel in both LODs; the courtyard remains genuinely open.

These photographic authoring targets are estimates, not surveyed dimensions. Re-exported both LODs; focused structural tests, deterministic metrics (zero remaining flags) and depth check pass. Fresh contact sheet: `tmp/batch/fixes/sheets/palais-de-l-isle-annecy.jpg`. Author compared the corresponding SW and NE near/far faces: silhouette, openings, window/arcade rows and structural contacts are retained without blank replacement facades. Independent re-review remains pending; **Cityscape: not tested; Full 3D world: not tested**.

