# Cathédrale Notre-Dame-de-l'Assomption de Clermont-Ferrand

Original procedural permanent exterior, 2026-11-10.

## Identity and evidence

Dark volcanic-stone Gothic cathedral with unequal twin western needle spires, true pierced bell stages and pointed windows, an eight-and-a-half-metre rose, sixteen open flying buttresses, polygonal choir and the smaller Bayette bell tower.

- [Cathedral official dimensions: 96.10 m spires, 99 m length, 8.50 m roses, 50.70 m Bayette](https://www.cathedrale-catholique-clermont.fr/la-cathedrale/la-cathedrale-en-chiffres/)
- [City heritage route: volcanic-stone cathedral and nineteenth-century western completion](https://clermont-ferrand.fr/sites/default/files/mep_parcours_patrimoinev2_20182019.pdf)
- [Detailed height distinction: northern 96.10 m, southern 95.50 m](https://fr.wikipedia.org/wiki/Cath%C3%A9drale_Notre-Dame-de-l%27Assomption_de_Clermont)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/67517840)
- [Fichier:Clermont-Ferrand (63) Cathédrale Notre-Dame-de-l'Assomption - Tour de la Bayette.jpg — Arisu789 — CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Clermont-Ferrand_(63)_Cath%C3%A9drale_Notre-Dame-de-l%27Assomption_-_Tour_de_la_Bayette.jpg)
- [File:Cathédrale Notre-Dame-de-l'Assomption de Clermont-Ferrand 04.jpg — John Samuel — CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Cath%C3%A9drale_Notre-Dame-de-l%27Assomption_de_Clermont-Ferrand_04.jpg)
- [File:Clermont-Ferrand-Cathedral-0016.jpg — Source: User:Fabien1309Derivative: User:MathKnight — CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Clermont-Ferrand-Cathedral-0016.jpg)

Reference images are comparison-only and retained under ignored `tmp/france-southeast/cathedrale-clermont-ferrand/refs/`; no photograph, traced mesh, logo or lettering ships. Photos selected: 3, 9, 12. Historical photographs are used only where the permanent exterior is unchanged; temporary scaffolding, event fit-outs and unrelated pictures are excluded.

## Frame and dimensions

Origin: [3.0858214, 45.7787336]. Local y=0 is the rigid exterior foundation plane; +X east, +Y up, +Z south, real metres. Rotation -0.04297508 radians is baked once using mapped controls [[3.0854674,45.7785395],[3.0856808,45.7785331]] (way 67517840). No terrain or Mercator stretch is authored. OSM ways 67517840 define the provider replacement envelope, not an arbitrary bounding rectangle; nearby roads and buildings are not owned.

| Element | Dimension | Evidence |
| --- | --- | --- |
| North / south western tips | 96.10 / 95.50 m | Published distinction; official site rounds both to 96.10 m |
| Bayette tip | 50.70 m | Cathedral official dimensions |
| Rose diameter | 8.50 m | Cathedral official dimensions |
| Body roof / aisles | Approximately 40 / 14.3 m eaves | Roof estimated; aisle height published |
| Mapped body / published total | Approximately 90 / 99 m | See interpretation below |

## Modeling choices and limits

Published 99 m length and 32.7 m transept width are not identical to the OSM outer building polygon, which includes chapels and buttress projections and is approximately 90 × 44 m in the local frame. The mapped body is retained and the western access stair extends the full model close to 99 m; that interpretation is an estimate, not a surveyed reconciliation. Roof ridge 40 m, western tower subdivisions and Bayette placement within the mapped north transept are photo-derived estimates. The official site rounds both spires to 96.10 m; the documented 95.50 m southern tip is retained. No statues, stained-glass artwork, text, neighbouring buildings or terrain are reproduced. Rigid y=0 is the exterior foundation/contact plane, not altitude.



Both LODs keep the identifying silhouette, major openings and facade rhythm. Foundations are rigid, not terrain-draped; any modeled ground surface is at least 0.10 m above the local datum. No app terrain certification is implied.

## Reproduction and QA

- Build: `pnpm build:top-cities-landmarks cathedrale-clermont-ferrand`.
- Focused test: `node --test src/peregrine/landmarks/top-cities/cathedrale-clermont-ferrand/cathedrale-clermont-ferrand.test.js`.
- Metrics: `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids cathedrale-clermont-ferrand --out tmp/france-southeast/cathedrale-clermont-ferrand/metrics.json`.
- Exported reference contact sheet: `tmp/france-southeast/sheets/cathedrale-clermont-ferrand.jpg`.
- Red mapped-footprint top view: `tmp/france-southeast/shots/cathedrale-clermont-ferrand/`.
- Depth: `node scripts/landmark-depth-layers.mjs --ids cathedrale-clermont-ferrand --check`.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 18251 | 4 | 316620 |
| far | 11387 | 4 | 207416 |

Author self-review: identifying features, proportions, palette, near/far openings and foundation contact inspected against the credited exterior references; red-ring mapped plan checked. Deterministic metrics: zero remaining flags; depth graph: no unresolved cycles. Focused structural tests and exported round-trip conformance pass. Model readiness: ready. Independent review is pending; author self-review is not an independent verdict.

**Cityscape: not tested. Full 3D world: not tested.** No app server was started. DEM/pad boundaries, provider lifecycle, live shared shading and hardware performance remain unverified.


## Independent-review correction, 2026-11-11

Moved both main spire springings to y=55 m and narrowed their octagonal bases to 8.20 m (approximately 8.34 m including ribs), keeping the 96.10/95.50 m tips; height/base ratios are 5.01/4.94 before thin ribs. Every bell-stage facade now has three genuine open pointed lancets separated by two 0.40 m masonry mullions. The sixteen flying-buttress openings remain intact in both LODs.

These photographic authoring targets are estimates, not surveyed dimensions. Re-exported both LODs; focused structural tests, deterministic metrics (zero remaining flags) and depth check pass. Fresh contact sheet: `tmp/batch/fixes/sheets/cathedrale-clermont-ferrand.jpg`. Author compared the corresponding SW and NE near/far faces: silhouette, openings, window/arcade rows and structural contacts are retained without blank replacement facades. Independent re-review remains pending; **Cityscape: not tested; Full 3D world: not tested**.

