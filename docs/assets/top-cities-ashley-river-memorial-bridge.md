# Ashley River Memorial Bridge — Charleston, South Carolina

Current 1926 southbound US 17 crossing, with its closed double-leaf bascule and four lantern-topped tender houses. The adjacent T. Allen Legare Bridge is a separate structure and is excluded.

## Sources and dimensions

The [City/SCDOT centennial announcement](https://www.charleston-sc.gov/m/NewsFlash/Home/Detail/1757) establishes the 1926 memorial structure; [SCDOT maintenance notice](https://www.scdot.org/inside/SCDOTPress/2023/Post3390.html) confirms the southbound crossing. No primary dimensional drawing was available during this build, so mapped horizontal measurements are distinguished from photo estimates; secondary 1733 ft / 101 ft leaf descriptions are not silently treated as surveys. The model uses the current mapped river crossing.

| Feature | Value | Basis |
| --- | ---: | --- |
| End-to-end deck | 528.10 m | Sourced, measured from OSM road endpoints |
| Width | 14.1 m including walks | Sourced, OSM outline, rounded |
| Alignment | bearing 61.396° eastward | Sourced, two mapped endpoint controls |
| Mapped movable roadway segment | 43.22 m | Sourced, way 480966843; not hinge-to-hinge structural span |
| Hinge/pier centres | local x −72.8 and −19.5 m, 53.3 m apart | Sourced positions from OSM bridge-outline projections; interpretation as hinge piers estimated |
| Approach pier stations | about 19–31 m spacing | Sourced, mapped outline projections |
| Deck height | 7 m at bascule, roughly 4.8 m at east end | Estimated from photographs; no tide/survey datum |
| Tender houses | 5.2 × 4.7 m, cornice 12.75 m, roof tip 17.9 m | Estimated from photographs |
| Lantern | eight columns, open 13.1–15.25 m | Estimated proportions; count from photographs |
| Highest mast | 19.9 m | Estimated |
| Arch soffits, pile jackets, railing and fender sections | Estimated | Simplified photo-derived construction |

Photographs, both **ProfReader, CC BY-SA 4.0**, file pages checked 2026-11-09: [Ashley River Memorial Bridge](https://commons.wikimedia.org/wiki/File:Ashley_River_Memorial_Bridge.jpg) and [Ashley River Memorial Bridge, Charleston, South Carolina](https://commons.wikimedia.org/wiki/File:Ashley_River_Memorial_Bridge,_Charleston,_South_Carolina.jpg). Their four Mediterranean Revival lantern houses, narrow bascule and concrete arches establish the correct 1926 structure. The temporary maintenance tarp in these 2015 photos is excluded. Local comparison images are not committed.

## Frame and foundations

Origin `[-79.96106825,32.7834928]`, local metres east/up/south. Controls `[-79.9635453,32.7823572]` and `[-79.9585912,32.7846284]`; rotation +0.499229901 radians baked once. `y=0` is the visual waterline. No terrain, tide elevation or Mercator scale is baked in. The entire bridge is a reusable rigid visual asset, with named deck-height function and pier stations for host fitting; no road runtime layer or navigation certification.

[OSM outline 1499776962](https://www.openstreetmap.org/way/1499776962); roadway ways **117153920, 480966843, 480966842**; footway ways **489958699, 1499776963–1499776967**. `FOOTPRINTS` retains the detailed mapped bridge boundary including later pier projections. © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright). Host ownership must exclude Legare and its approaches. Concrete piers and fender piles reach y=0; approach end decks require host road connections. Tender houses must stay rigid.

## Geometry and omissions

Both LODs retain open shallow arch soffits, four separately windowed tender houses, eight-column open lanterns and tapered pale roofs. Steel bascule leaves meet at the channel centre with a narrow seam; end bearings rest on the main pier blocks. Concrete pier jackets and extra piles describe the visible reinforced substructure. Far coarsens arches and balustrades while preserving each major pier and house.

No moving mechanisms, bascule animation, stairs, detailed electrical gear, coats of arms, text, adjacent bridge or roadway beyond the mapped structure. Original procedural geometry, no imported meshes or textures. Window holes are actual wall apertures with recessed dark panes; dark strips are not substituted for openings.

## Verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 23558 | 8 | 311984 |
| far | 13210 | 7 | 189264 |

Mechanical QA: no flags. Exported near/far contact sheet inspected against both reference photographs: four lantern houses, shallow arches and the single bascule retained. One refinement removed hidden support/roof faces and stopped balustrades at house walls. Evidence: `tmp/landmark-qa/final/ashley-river-memorial-bridge.jpg`; metrics: `tmp/landmark-qa/ashley-river-memorial-bridge-metrics.json`. Padded camera bounds are used so the long bridge fits the oblique tiles.

Cityscape: **not tested**. Full 3D world: **not tested**. Human contributor/product permission remains a maintainer process; the agent accepted no legal terms.
