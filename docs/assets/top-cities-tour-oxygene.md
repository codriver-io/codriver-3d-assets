# Tour Oxygène — Lyon

115 m rounded triangular glass tower with a pale leaf crown and an inward-tapering seven-storey foot.

## Sources and rights

- [Architect Arte Charpentier:2010 tower115 m](https://www.arte-charpentier.com/fr/projets/tour-oxygene-lyon-part-dieu/)
- [Structural engineer Khephren:115 m28 floors and7 lower cantilever levels](https://khephren.fr/wp-content/uploads/2025/04/250412-Plaquette-KHE-1.pdf)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Tour_Oxygène)
- [OSM way 19716830: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/19716830)
- [Reference photograph: File:TourOxygène.jpg — Axtoche2002 — CC0](https://en.wikipedia.org/wiki/File:TourOxyg%C3%A8ne.jpg)
- [Reference photograph: File:Tour Oxygène Février 2026.jpg — Ezéchiel Péquay — CC0](https://commons.wikimedia.org/wiki/File:Tour_Oxyg%C3%A8ne_F%C3%A9vrier_2026.jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/tour-oxygene/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Tower crest | 115 | Architect and engineer |
| Office levels | 28 | Engineer |
| Inclined lower levels | 7 | Engineer; modeled28 m approximate |
| Glass roof | 110 | Photo estimate |
| Base width factor | 0.8 | Photo estimate |
| Crown shell thickness | 0.65 | Photo estimate |

Origin `[4.85711077, 45.76223853]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

The mapped rounded triangular envelope supplies geographic orientation and its unusual curved corners. The first seven storeys contract toward the ground,with three continuous pale facade seams following that bend.28 fine horizontal courses and real separate glass panes wrap the near model;far uses14 courses with the same inward foot. The pale curved leaf crown is a closed shallow shell,not an opaque box,and three posts meet the upper shaft. Its115 m crest is explicit. The2008 foundation image was rejected; completed2026 and skyline exteriors establish the present shaft and crown. Connected shopping centre and neighbouring Part-Dieu tower are excluded. Height is published;curvature,base taper and crown thickness are estimates.

115 m/28 floors confirmed by architect and structural engineer. Tower-only scope,excluding connected commercial centre. Top mapped plan anchors rounded envelope; base contracts to80% and upper crown/core levels are photo estimates. Seven lower levels evoke the inclined concrete support system without reproducing interior engineering.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 12729 | 4 | 209664 |
| far | 3081 | 4 | 61768 |

Deterministic metrics: `tmp/france/tour-oxygene/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/tour-oxygene.jpg`. Mapped orientation/top check: `tmp/france/shots/tour-oxygene/tour-oxygene-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.

