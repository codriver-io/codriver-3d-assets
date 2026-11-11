# Tour Saint-Gobain — Courbevoie

Silver-blue rectangular tower with a smaller crystalline top lantern and sloping entrance showroom cube.

## Sources and rights

- [Valode & Pistre: Saint-Gobain Tower, rhombohedron crystals,44 floors,170 m](https://v-p.com/en/projet/tour-saint-gobain/)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Tour_Saint-Gobain)
- [OSM way 1069791336: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/1069791336)
- [OSM way 1069791337: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/1069791337)
- [Reference photograph: File:Tour Saint-Gobain.jpg — McSyl — CC0](https://en.wikipedia.org/wiki/File:Tour_Saint-Gobain.jpg)
- [Reference photograph: File:La Défense depuis l'Arc de Triomphe Janvier 2023.jpg — Arthur Weidmann — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:La_D%C3%A9fense_depuis_l%27Arc_de_Triomphe_Janvier_2023.jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/tour-saint-gobain/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Total envelope | 178 | OSM/CTBUH; estimate pending datum reconciliation |
| Architect height | 170 | Published; separate measurement |
| Main ribboned body | 154 | Photo estimate |
| Upper crystal | 24 high,6 roof fall | Photo estimate |
| Showroom roof | 20–27 | Photo estimate |

Origin `[2.24932984, 48.8897171]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

Three separately readable mapped volumes distinguish the tower: a horizontal-ribboned office body, a reduced and slightly offset crystalline head, and a sloping ground-level showroom. Four construction-era photos were rejected; only the completed McSyl exterior and2023 skyline are used. The head stands on the main roof and the showroom reaches grade. Curtain-wall glass and frame are adjoining tiles, with coarser separate panes in far. The rhombohedron faces are simplified and glass reflections use muted solid colours.

Completed 2019/2020 three-crystal composition. OSM/CTBUH gives178 m; architect describes170 m and manufacturer165 m:178 m is an envelope estimate, with datum differences unresolved. Main body154 m, upper crystal24 m, showroom sloping20–27 m are photo estimates. Crown scale/offset, fine horizontal ribbons and glass reflections simplified. No branding, interiors, paving or terrain.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 15722 | 5 | 252208 |
| far | 4120 | 5 | 75108 |

Deterministic metrics: `tmp/france/tour-saint-gobain/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/tour-saint-gobain.jpg`. Mapped orientation/top check: `tmp/france/shots/tour-saint-gobain/tour-saint-gobain-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.


Second look: retained the repeated darker garden bays visible on the completed facade; these are separate window-row surfaces rather than a full-height dark stripe. Their depth and planting are represented by subdued shade, not modeled interiors.
