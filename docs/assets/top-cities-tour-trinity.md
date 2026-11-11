# Tour Trinity — Courbevoie

Two unequal blue-glass office wings with a taller pale external lift core and repeated gold-toned terrace bays.

## Sources and rights

- [Cro&Co:2020 Trinity,140 m,three joined volumes and external lift core; Luc Boegly exterior photos ARR](https://croandco.archi/projets/tour-trinity)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Tour_Trinity)
- [OSM way 758211633: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/758211633)
- [Reference photograph: File:La Défense depuis l'Arc de Triomphe Janvier 2023.jpg — Arthur Weidmann — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:La_D%C3%A9fense_depuis_l%27Arc_de_Triomphe_Janvier_2023.jpg)
- [Reference photograph: Completed Trinity exterior 1 — Luc Boegly; ©Cro&Co as credited — All rights reserved; comparison only](https://croandco.archi/thumbs/projets/tour-trinity/tour_trinity_cro-co_photo_luc_boegly-058-1000x1060.jpg)
- [Reference photograph: Completed Trinity exterior 2 — Luc Boegly; ©Cro&Co as credited — All rights reserved; comparison only](https://croandco.archi/thumbs/projets/tour-trinity/tour_trinity_cro-co_photo_luc_boegly-219-1-1000x1320.jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/tour-trinity/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Plaza to core top | 140 | Primary architect and district source; selected envelope estimate |
| Alternative heights | 151 /157.2 | OSM/secondary sources,datum unresolved |
| Main/low wings | 134 /106 | Photo estimate,32/25-storey composition |
| Core terrace cadence | 7.8 near /15.6 far | Photo estimate |

Origin `[2.2411088, 48.89290716]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

The mapped envelope is partitioned into two unequal wings and an external core, with roof ledges at three elevations. Taller shafts omit faces hidden by their neighbours. The pale lift-core grid and repeated muted gold-toned bays distinguish the tower; far retains them as separate panes. Five construction-era photos were rejected. Two completed exterior images from the architect, photographed by Luc Boegly, are all rights reserved and used only for comparison, with URLs and credits recorded. Important placement handoff: local y=0 is the elevated public plaza; the seven-lane underpass and supporting urban slab are excluded. Later app verification must keep that road opening and choose the rigid datum correctly; this asset does not fit or replace any road.

Completed2020 Trinity. Primary architect and district source140 m; OSM151 m and secondary157.2 m use unresolved datums:140 m above the public plaza is the selected envelope estimate. Two unequal glazed wings, taller external lift core and repeated terraces retained. Public plaza y=0; underlying road slab/underpass, landscaping and interiors excluded and require separate app fitting. No road layer authored.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 14074 | 5 | 234264 |
| far | 3700 | 5 | 70456 |

Deterministic metrics: `tmp/france/tour-trinity/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/tour-trinity.jpg`. Mapped orientation/top check: `tmp/france/shots/tour-trinity/tour-trinity-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.


Second look: recessed the external lift-core glazing1.5 m behind its double-height pale frames, with closed floor,soffit and jamb reveals. This restores the visible ladder-like core depth in both LODs without floating balcony slabs.
