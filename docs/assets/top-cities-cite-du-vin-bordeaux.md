# Cité du Vin — Bordeaux

Broad curved golden vessel flowing into a leaning,twisting glass-and-metal neck with an open finned55 m crown.

## Sources and rights

- [VINCI constructor:55 m tower and toroidal lower volume,2016 completion](https://www.vinci.com/newsroom/actualites/inauguration-de-la-cite-du-vin-bordeaux)
- [French environmental authority:BIM for curved55 m glass envelope](https://www.nouvelle-aquitaine.developpement-durable.gouv.fr/IMG/pdf/cite_vin_bordeaux.pdf)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Cité_du_Vin)
- [OSM way 421965158: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/421965158)
- [Reference photograph: File:RB 20210821 Bordeaux.jpg — Monster4711 — CC-BY-SA-4.0](https://en.wikipedia.org/wiki/File:RB_20210821_Bordeaux.jpg)
- [Reference photograph: File:Cite du vin Bordeaux 2017 (37500642606).jpg — Oli Lynch — Public domain photograph/CC0 metadata; protected architecture not cleared; comparison-only](https://en.wikipedia.org/wiki/File:Cite_du_vin_Bordeaux_2017_(37500642606).jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/cite-du-vin-bordeaux/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Finned crest | 55 | Constructor and published documentation |
| Ground envelope | about79×72 | OSM geographic plan |
| Broad low bowl | 16–19 | Photo estimate |
| Neck centre | 14 east /18 north | Local metre photo/plan estimate |
| Tilted enclosed roof | about50.5 | Photo estimate |
| Roof blades near/far | 96/32 groups | Grouped visible cadence;not all original128 spines |

Origin `[-0.55004855, 44.862365]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

A continuous editable loft starts on a foot inset4 percent from the mapped perimeter and expands into a broad rounded golden bowl before flowing toward the northeast into a narrow glass/gold neck. Monotone smooth station centres,radii,leans and progressive48-degree twist are explicit source parameters;all are photo-calibrated estimates,while55 m overall is published. Every mapped footprint vertex is retained in the near section-angle set; far uses every second control point plus regular angular samples, with two geographic control directions baked once. A broad gold ribbon and larger dark-glass fields,silver facets are adjoining skin partitions. Each warped parent panel is split into two planar triangles before material subdivision,avoiding curtain-wall overlap. The top is a real tilted closed roof below a ring of separate,open crown blades;their bases touch the roof edge and their tips reach55 m. Far retains the low body-to-neck ratio,lean,twist,material fields and32 distinct upper openings. The2021 bank view and2017 close exterior show the completed form;interiors and unrelated fine detail rejected. Oli Lynch photograph is PD/CC0 metadata on English Wikipedia,not Commons;French architectural rights are not separately cleared,and all photos are comparison-only. No third-party mesh,textures,boardwalk,terrain or water.

55 m published tower;OSM full rounded ground envelope79×72 m. Northeast neck centre[12,-17]at30 m, transitioning to[9,-20]at the roof, in local metres and smooth loft station radii/leans are photo estimates. Broad low bulb peaks around18–20 m;roofabout50.5 m,crown fins55 m. Original procedural skin,not a traced mesh. No boardwalk,paving,river,cranes or neighbouring housing.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 21478 | 5 | 371996 |
| far | 5195 | 5 | 103108 |

Deterministic metrics: `tmp/france/cite-du-vin-bordeaux/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/cite-du-vin-bordeaux.jpg`. Mapped orientation/top check: `tmp/france/shots/cite-du-vin-bordeaux/cite-du-vin-bordeaux-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.


## Independent review follow-up — 2026-11-10

Refit the lower loft as a continuously rolled asymmetric swollen vessel flowing into the leaning neck, removing the broad annular shelf and the waist/re-expansion. Neck widths at 30 and 40 m now differ by under 15 percent; kept the mapped approximately 79 by 72 m body and 55 m crest, with the gold ribbon continuous into the low body. Reduced near/far triangles to 21478/5195; thin partitioned horizontal seams and matching base-glazing samples preserve far window rhythm. Far bytes increase slightly because the required separated curved panels need additional seam vertices, while total geometry is substantially lighter.

Fresh exported comparison: `tmp/france/fixes/sheets/cite-du-vin-bordeaux.jpg`; deterministic metrics `tmp/france/fixes/cite-du-vin-bordeaux-metrics.json` have no unresolved flags. Focused identity/conformance tests and depth check passed; no dropped cycle edges. Builder compared the new sheet to its reference; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.
