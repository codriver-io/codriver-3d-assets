# Maison Carrée de Nîmes

Original procedural permanent exterior, 2026-11-10.

## Identity and evidence

Raised Roman temple with six free-standing front Corinthian columns, a deep open pronaos, thirty fluted free/engaged shafts, a single broad access stair and triangular pediments.

- [City of Nîmes: hexastyle Corinthian temple](https://www.nimes.fr/que-faire-a-nimes/patrimoine/les-monuments-romains/la-maison-carree)
- [Official monument: rounded dimensions 26 × 15 × 17 m](https://www.arenes-nimes.com/histoire-de-la-maison-carree/)
- [Architectural dimensions 26.42 × 13.54 m and 2.85 m podium](https://en.wikipedia.org/wiki/Maison_carr%C3%A9e)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/249003371)
- [Fichier:Maison carrée 01.jpg — Rémih — CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Maison_carr%C3%A9e_01.jpg)
- [Fichier:Maison Carrée de Nîmes Septembre 2023.jpg — ErwanAF — CC0; comparison only](https://commons.wikimedia.org/wiki/File:Maison_Carr%C3%A9e_de_N%C3%AEmes_Septembre_2023.jpg)

Reference images are comparison-only and retained under ignored `tmp/france-southeast/maison-carree-nimes/refs/`; no photograph, traced mesh, logo or lettering ships. Photos selected: 2, 6. Historical photographs are used only where the permanent exterior is unchanged; temporary scaffolding, event fit-outs and unrelated pictures are excluded.

## Frame and dimensions

Origin: [4.3561318, 43.8381914]. Local y=0 is the rigid exterior foundation plane; +X east, +Y up, +Z south, real metres. Rotation -1.36385255 radians is baked once using mapped controls [[4.3559998,43.8383176],[4.3560813,43.8380376]] (way 249003371). No terrain or Mercator stretch is authored. OSM ways 249003371 define the provider replacement envelope, not an arbitrary bounding rectangle; nearby roads and buildings are not owned.

| Element | Dimension | Evidence |
| --- | --- | --- |
| Main temple | 26.42 × 13.54 m | Architectural body dimensions |
| Podium | 2.85 m | Architectural description |
| Overall height | approximately 17 m | Official site and OSM |
| Colonnade | Six across front; thirty total | Hexastyle pseudo-peripteral arrangement |

## Modeling choices and limits

Official rounded width of 15 m includes a broader envelope than the 13.54 m architectural body; the model uses the narrower body and wider cornice. Published 17 and 17.1 m heights are rounded to 17 m. The mapped northern stair projection is retained. Capitals are simplified leaf-like profiles, not traced ornament; no lettering.



Both LODs keep the identifying silhouette, major openings and facade rhythm. Foundations are rigid, not terrain-draped; any modeled ground surface is at least 0.10 m above the local datum. No app terrain certification is implied.

## Reproduction and QA

- Build: `pnpm build:top-cities-landmarks maison-carree-nimes`.
- Focused test: `node --test src/peregrine/landmarks/top-cities/maison-carree-nimes/maison-carree-nimes.test.js`.
- Metrics: `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids maison-carree-nimes --out tmp/france-southeast/maison-carree-nimes/metrics.json`.
- Exported reference contact sheet: `tmp/france-southeast/sheets/maison-carree-nimes.jpg`.
- Red mapped-footprint top view: `tmp/france-southeast/shots/maison-carree-nimes/`.
- Depth: `node scripts/landmark-depth-layers.mjs --ids maison-carree-nimes --check`.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 7864 | 3 | 91356 |
| far | 3784 | 3 | 50648 |

Author self-review: identifying features, proportions, palette, near/far openings and foundation contact inspected against the credited exterior references; red-ring mapped plan checked. Deterministic metrics: zero remaining flags; depth graph: no unresolved cycles. Focused structural tests and exported round-trip conformance pass. Model readiness: ready. Independent review is pending; author self-review is not an independent verdict.

**Cityscape: not tested. Full 3D world: not tested.** No app server was started. DEM/pad boundaries, provider lifecycle, live shared shading and hardware performance remain unverified.


## Independent-review correction, 2026-11-11

Reduced weight only to 7,864 near / 3,784 far triangles: shafts now use 12 / 8 radial segments, near fluting and leaf capitals are coarser, and far merges two capital lifts into one. All thirty original column centers, the six-column frontage, podium, stairs, pediments and deep open portico remain unchanged.

These photographic authoring targets are estimates, not surveyed dimensions. Re-exported both LODs; focused structural tests, deterministic metrics (zero remaining flags) and depth check pass. Fresh contact sheet: `tmp/batch/fixes/sheets/maison-carree-nimes.jpg`. Author compared the corresponding SW and NE near/far faces: silhouette, openings, window/arcade rows and structural contacts are retained without blank replacement facades. Independent re-review remains pending; **Cityscape: not tested; Full 3D world: not tested**.

