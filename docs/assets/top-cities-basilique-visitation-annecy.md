# Basilique de la Visitation d'Annecy

Original procedural permanent exterior, 2026-11-10.

## Identity and evidence

Limestone neo-Romano-Byzantine basilica with a huge genuinely recessed arched tower-porch, stepped buttress shoulders, pierced octagonal belfry, patterned tapering spire and bronze cross; long tiled nave and polygonal apse.

- [Monastery history by Christian Regat: tower total height 72 m, limestone and neo-Romano-Byzantine architecture](https://visitationannecy.org/wp-content/uploads/La-Visitation-a-Annecy-christian-regat.pdf)
- [Official Annecy tourism: 72 m concrete-structure tower-porch](https://www.lac-annecy.com/webzine/sites-du-patrimoine-a-ne-pas-manquer/)
- [Mapped multipolygon, joined at shared endpoints without inventing vertices](https://www.openstreetmap.org/relation/21373069)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/112145208)
- [File:Basilique de la Visitation - 207.jpg — Another one of my pictures: This photograph was taken by Medium69 (William Crochot) and released under the license state — CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Basilique_de_la_Visitation_-_207.jpg)
- [File:Basilique de la Visitation @ Annecy (50937882288).jpg — Guilhem Vellut from Annecy, France — CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Basilique_de_la_Visitation_@_Annecy_(50937882288).jpg)

Reference images are comparison-only and retained under ignored `tmp/france-southeast/basilique-visitation-annecy/refs/`; no photograph, traced mesh, logo or lettering ships. Photos selected: 7, 13. Historical photographs are used only where the permanent exterior is unchanged; temporary scaffolding, event fit-outs and unrelated pictures are excluded.

## Frame and dimensions

Origin: [6.1276263, 45.8925466]. Local y=0 is the rigid exterior foundation plane; +X east, +Y up, +Z south, real metres. Rotation 0.18514764 radians is baked once using mapped controls [[6.1272486,45.892596],[6.1278623,45.892676]] (way 112145208). No terrain or Mercator stretch is authored. OSM ways 112145208 define the provider replacement envelope, not an arbitrary bounding rectangle; nearby roads and buildings are not owned.

| Element | Dimension | Evidence |
| --- | --- | --- |
| Overall tip | 72 m | Monastery history states total tower height |
| Nave ridge | 26 m | Architectural estimate consistent with exterior photographs |
| Porch arch / belfry | 30 / 36–49 m | Photo-derived division of total height |
| Bronze cross assembly | 7 m, including stem below exposed tip | Published cross dimension; exposed projection estimated |

## Modeling choices and limits

Sources disagree whether 72 m includes a separately described 7 m bronze cross. This model adopts the monastery history's explicit 72 m total rather than an unverified 79 m total; the 7 m cross assembly spans y=65–72 with its lower stem within the spire cap and exposed projection 3 m, estimated from photographs. Spire y=49–69 and nave ridge 26 m are estimated proportions. Outer ways 112145208 and 1557620926 are stitched at their shared endpoints from relation 21373069. Neighbouring monastery and steep terrain are excluded; y=0 is the rigid local entrance foundation plane, not a surveyed elevation.



Both LODs keep the identifying silhouette, major openings and facade rhythm. Foundations are rigid, not terrain-draped; any modeled ground surface is at least 0.10 m above the local datum. No app terrain certification is implied.

## Reproduction and QA

- Build: `pnpm build:top-cities-landmarks basilique-visitation-annecy`.
- Focused test: `node --test src/peregrine/landmarks/top-cities/basilique-visitation-annecy/basilique-visitation-annecy.test.js`.
- Metrics: `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids basilique-visitation-annecy --out tmp/france-southeast/basilique-visitation-annecy/metrics.json`.
- Exported reference contact sheet: `tmp/france-southeast/sheets/basilique-visitation-annecy.jpg`.
- Red mapped-footprint top view: `tmp/france-southeast/shots/basilique-visitation-annecy/`.
- Depth: `node scripts/landmark-depth-layers.mjs --ids basilique-visitation-annecy --check`.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 11174 | 4 | 198552 |
| far | 6494 | 4 | 124380 |

Author self-review: identifying features, proportions, palette, near/far openings and foundation contact inspected against the credited exterior references; red-ring mapped plan checked. Deterministic metrics: zero remaining flags; depth graph: no unresolved cycles. Focused structural tests and exported round-trip conformance pass. Model readiness: ready. Independent review is pending; author self-review is not an independent verdict.

**Cityscape: not tested. Full 3D world: not tested.** No app server was started. DEM/pad boundaries, provider lifecycle, live shared shading and hardware performance remain unverified.


## Independent-review correction, 2026-11-11

Added eight small masonry gables, connected roof returns and projecting eaves at the octagonal belfry-to-spire transition (approximately y=48.8–50.4 m), identically in near and far. The existing 13 m belfry, 20 m spire, cross assembly and adopted 72 m total remain unchanged.

These photographic authoring targets are estimates, not surveyed dimensions. Re-exported both LODs; focused structural tests, deterministic metrics (zero remaining flags) and depth check pass. Fresh contact sheet: `tmp/batch/fixes/sheets/basilique-visitation-annecy.jpg`. Author compared the corresponding SW and NE near/far faces: silhouette, openings, window/arcade rows and structural contacts are retained without blank replacement facades. Independent re-review remains pending; **Cityscape: not tested; Full 3D world: not tested**.

