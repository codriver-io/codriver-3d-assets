# Tour La Marseillaise — Marseille

Jean Nouvel tower with blue-white-ochre-red deep sunshade lattice, recessed glass skin and an open rooftop garden cage.

## Sources and rights

- [Architect:135 m31-storey tower,facade and rooftop-garden photographs](https://www.jeannouvel.com/en/projects/la-marseillaise/)
- [VINCI:3820 ultra-high-performance concrete sunshade panels,30 hues,2018 inauguration](https://www.vinci.com/newsroom/actualites/la-tour-la-marseillaise-haute-en-couleur)
- [Identity and published dimensions](https://fr.wikipedia.org/wiki/Tour_La_Marseillaise)
- [OSM way 613859001: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/613859001)
- [Reference photograph: Completed east facade and brise-soleil — Jérôme Cabanel / Ateliers Jean Nouvel — All rights reserved; comparison-only](https://www.jeannouvel.com/en/projects/la-marseillaise/)
- [Reference photograph: North facade from port; published architect exterior — Michèle Clavel / Ateliers Jean Nouvel — All rights reserved; no general licence verified; comparison-only](https://www.jeannouvel.com/en/projects/la-marseillaise/)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/tour-la-marseillaise/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Overall open cage | 135 | Architect/operator |
| Storeys | 31 | Architect;OSM32 counted differently |
| Glazed roof | 126 | Photo estimate |
| Skin setback | 1.3 | Photo estimate;constant1.3 m mitered plan inset |
| Near sunshade bay | 3.2 | Photo grouping estimate,not all3820 panels |
| Planted roof level | 126 | Authored matching roof |

Origin `[5.3671292, 43.31310404]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

The literal mapped ground ring fixes geographic bearing,including its small entrance notch. An inset glazed tower sits behind actual deep coloured precast-style fins;no coloured window decals are laid over walls. Structural floor bands reach every fin and the recessed glass skin. A135 m open skeletal rooftop cage surrounds a126 m roof and simplified trees with trunks on that roof. Far retains real upper openings,distinct blue/cream/ochre-red groups,skin depth and coarser separate glazing.31 facade courses follow the architect,while mapped32 levels are documented as a counting discrepancy. Colours are muted from the primary facade photographs;the exact30 hue map and3820 individual panels are grouped for road-distance performance. The Commons photo explicitly labelled construction was rejected;architect facade and port-view photographs show the completed architectural cladding/cage version,with neighbouring port cranes excluded. No marks,lettering,building logos or surrounding waterfront surfaces.

135 m/31 storeys architect; OSM32 levels counted differently. Glass roof126 m,upper cage135 m,3.2 m near bays and1.3 m skin setback are photo estimates. No signage,street,port crane or adjacent buildings. Mapped polygon has a small south entrance notch,retained in both LODs.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 25528 | 8 | 471924 |
| far | 7404 | 8 | 150960 |

Deterministic metrics: `tmp/france/tour-la-marseillaise/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/tour-la-marseillaise.jpg`. Mapped orientation/top check: `tmp/france/shots/tour-la-marseillaise/tour-la-marseillaise-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.


## Independent review follow-up — 2026-11-10

Reassigned the existing blue, cream and muted red screen fins by facade position and height, so the red field boundary moves across 72 percent of the principal long-face width through five or more height zones. Neutral floor bands preserve separate rows and the 126–135 m open planted cage. No added triangles or draws; far remains eight draws.

Fresh exported comparison: `tmp/france/fixes/sheets/tour-la-marseillaise.jpg`; deterministic metrics `tmp/france/fixes/tour-la-marseillaise-metrics.json` have no unresolved flags. Focused identity/conformance tests and depth check passed; no dropped cycle edges. Builder compared the new sheet to its reference; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.
