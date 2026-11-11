# Collégiale Saint-André de Grenoble

Original procedural permanent exterior, 2026-11-10.

## Identity and evidence

Medieval collegiate church with a square stone bell tower, paired open belfry arches, a long pierced octagonal spire and four corner pinnacles.

- [Grenoble heritage: Saint-André](https://www.grenoble-patrimoine.fr/element/86/595-eglise-collegiale-saint-andre.htm)
- [Grenoble tourism: 56 m bell tower and its finial](https://www.grenoble-tourisme.com/fr/decouvrir/culture-et-histoire/histoire-et-secrets-les-details-qui-content/un-taureau-sur-le-clocher/)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/32622734)
- [Fichier:Collégiale Saint-André de Grenoble - 2012.jpg — English : This photo has been taken by Matthieu Riegler (User:Kyro) and released under the licenses stated below. You ar — CC BY 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Coll%C3%A9giale_Saint-Andr%C3%A9_de_Grenoble_-_2012.jpg)
- [Fichier:Place Saint Andre - Grenoble.JPG — Milky — CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Place_Saint_Andre_-_Grenoble.JPG)

Reference images are comparison-only and retained under ignored `tmp/france-southeast/collegiale-saint-andre-grenoble/refs/`; no photograph, traced mesh, logo or lettering ships. Photos selected: 2, 4. Historical photographs are used only where the permanent exterior is unchanged; temporary scaffolding, event fit-outs and unrelated pictures are excluded.

## Frame and dimensions

Origin: [5.7278831, 45.19280655]. Local y=0 is the rigid exterior foundation plane; +X east, +Y up, +Z south, real metres. Rotation -0.21929478 radians is baked once using mapped controls [[5.7277271,45.1929217],[5.7282428,45.1928407]] (way 32622734). No terrain or Mercator stretch is authored. OSM ways 32622734 define the provider replacement envelope, not an arbitrary bounding rectangle; nearby roads and buildings are not owned.

| Element | Dimension | Evidence |
| --- | --- | --- |
| Bell tower and spire | 56 m overall | Grenoble tourism |
| Nave ridge | approximately 23 m | Exterior-photo estimate |
| Geographic plan | OSM 32622734 | Nave, chapels and offset western tower |

## Modeling choices and limits

The published 56 m is used as overall height; intermediate cornices, nave ridge and lancet sizes are photo-calibrated estimates. Sculpture and lettering are omitted.



Both LODs keep the identifying silhouette, major openings and facade rhythm. Foundations are rigid, not terrain-draped; any modeled ground surface is at least 0.10 m above the local datum. No app terrain certification is implied.

## Reproduction and QA

- Build: `pnpm build:top-cities-landmarks collegiale-saint-andre-grenoble`.
- Focused test: `node --test src/peregrine/landmarks/top-cities/collegiale-saint-andre-grenoble/collegiale-saint-andre-grenoble.test.js`.
- Metrics: `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids collegiale-saint-andre-grenoble --out tmp/france-southeast/collegiale-saint-andre-grenoble/metrics.json`.
- Exported reference contact sheet: `tmp/france-southeast/sheets/collegiale-saint-andre-grenoble.jpg`.
- Red mapped-footprint top view: `tmp/france-southeast/shots/collegiale-saint-andre-grenoble/`.
- Depth: `node scripts/landmark-depth-layers.mjs --ids collegiale-saint-andre-grenoble --check`.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 6463 | 6 | 124684 |
| far | 4059 | 6 | 84484 |

Author self-review: identifying features, proportions, palette, near/far openings and foundation contact inspected against the credited exterior references; red-ring mapped plan checked. Deterministic metrics: zero remaining flags; depth graph: no unresolved cycles. Focused structural tests and exported round-trip conformance pass. Model readiness: ready. Independent review is pending; author self-review is not an independent verdict.

**Cityscape: not tested. Full 3D world: not tested.** No app server was started. DEM/pad boundaries, provider lifecycle, live shared shading and hardware performance remain unverified.


## Independent-review correction, 2026-11-11

Added the mapped plaza-side projecting 9 m gabled bay to 23 m, a plain 2 m circular clock face, its tall recessed window and the adjacent pale-stone arched portal frame; the 56 m spire and four pinnacles remain in both LODs, with no lettering.

These photographic authoring targets are estimates, not surveyed dimensions. Re-exported both LODs; focused structural tests, deterministic metrics (zero remaining flags) and depth check pass. Fresh contact sheet: `tmp/batch/fixes/sheets/collegiale-saint-andre-grenoble.jpg`. Author compared the corresponding SW and NE near/far faces: silhouette, openings, window/arcade rows and structural contacts are retained without blank replacement facades. Independent re-review remains pending; **Cityscape: not tested; Full 3D world: not tested**.

