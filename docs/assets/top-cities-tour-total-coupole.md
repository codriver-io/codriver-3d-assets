# Tour Total Coupole — Courbevoie / Paris La Défense

The 1985 completed glass office ensemble: three taller polygonal shafts and two shorter front volumes create its organ-pipe skyline. The mapped chamfered corners and subdued curtain-wall rhythm survive far LOD.

## Sources and rights

- [Paris La Défense: Total Coupole](https://www.parisladefense.com/fr/territoire/tours-batiments/total-coupole), checked 2026-11-10: 179 m, 48 floors, five-scale polygonal tubular arrangement.
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Tour_Total)
- [OSM way 229142774: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/229142774)
- [OSM way 229142779: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/229142779)
- [OSM way 82486191: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/82486191)
- [OSM way 229142777: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/229142777)
- [OSM way 229142778: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/229142778)
- [OSM way 229142776: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/229142776)
- [OSM way 229142763: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/229142763)
- [Reference photograph: File:La Défense depuis l'Arc de Triomphe Janvier 2023.jpg — Arthur Weidmann — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:La_D%C3%A9fense_depuis_l%27Arc_de_Triomphe_Janvier_2023.jpg)
- [Reference photograph: File:Tour-Total.jpg — I Tangopaso (talk)) created this photograph. — PD](https://en.wikipedia.org/wiki/File:Tour-Total.jpg)

The Tangopaso exterior is public domain (Commons metadata `PD`); the 2023 Arthur Weidmann skyline is CC BY-SA 4.0. Both show the completed structure and are comparison-only. OSM relation 3071549/full supplies the joined envelope and its exact seven outer ways. No photo, texture, logo or lettering is shipped. Original models CC BY 4.0, source/docs MIT; OSM credit ODbL 1.0.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Tallest crown | 187 | Reconciled envelope estimate: Wikipedia/OSM 187, district operator 179 |
| Flanking shafts | 165 / 175 | Photo estimate |
| Lower entrance volumes | 65 / 75 | Photo estimate |
| Eastern low volume | 28 | Photo estimate |
| Curtain-wall storey pitch | 3.8 near / 7.6 far | Estimate |

Origin `[2.2434718476190474, 48.892753330952374]`. +X east, +Y up, +Z south; local y=0 is rigid exterior grade. Full geometry is rotated from the literal mapped outline, using controls `[2.2436589, 48.8927884]` and `[2.2437012, 48.8928355]`. The 26° working frame is derived from long mapped edges; it is baked into source and exports once. No terrain elevation or Mercator stretch is included. Seven joined relation outer ways define replacement; adjoining CNIT, Areva and neighbouring volumes are excluded.

## Modeling and limitations

The mapped envelope is partitioned into shafts at separate roof elevations, with real chamfers and a low front mass. Glass/frame tiles adjoin instead of layering. Far coarsens separate window panes and retains every shaft, podium and stepped crown. Glass reflections are muted solid colours. The source disagreement in total height is explicit; crown and lower-volume heights are estimates rather than surveyed dimensions. No paving or invented site slab, interior, lettering or neighbouring structures.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 19100 | 3 | 304592 |
| far | 5448 | 3 | 94512 |

Deterministic metrics: `tmp/france/tour-total-coupole/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/tour-total-coupole.jpg`. Mapped orientation/top check: `tmp/france/shots/tour-total-coupole/tour-total-coupole-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.

