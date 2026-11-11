# RAI Elicium

RAI Elicium’s continuous silver folded outline, narrow 46 m office tower and rounded hovering glazed ballroom on slender grounded columns.

Version: exterior standing on 2026-11-10, Amsterdam, Netherlands. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

| Measure | Value | Basis |
| --- | --- | --- |
| Tower | 46 m | OSM 806950197 (47 m published alternative) |
| Ballroom underside | 4.5 m | Model estimate; architect says 5 m |
| Main combined plan | about 71 × 55 m | OSM outline |
| Office / ballroom depths | 54 m | Mapped / rounded approximation |

Origin 4.88977496,52.34131054; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation -0.083801716502667 radians is baked from the two mapped control points [[4.8904968,52.3415274],[4.8904317,52.3410539]]; the host must not rotate again. Footprints replace only OSM ways 43783760, 806950194, 806950195, 806950196, 806950197, 1239732905. The architect documents the hovering foyer five metres above street grade and a seven-storey office stack. OSM gives the highest part 46 m; other publications say 47 m, retained as an uncertainty. The frame corners, connection curvature and column sizes are estimates from two specific exterior photos. The mapped 4-degree heading is baked into the export; adjacent RAI halls and their arched roofs are excluded. The blue LED contour, lettering and banners are omitted.

## Sources and rights

- [Landmark identity and architectural context](https://en.wikipedia.org/wiki/Amsterdam_RAI_Exhibition_and_Convention_Centre)
- [OSM mapped footprint](https://www.openstreetmap.org/way/43783760)
- [OSM mapped footprint](https://www.openstreetmap.org/way/806950194)
- [OSM mapped footprint](https://www.openstreetmap.org/way/806950195)
- [OSM mapped footprint](https://www.openstreetmap.org/way/806950196)
- [OSM mapped footprint](https://www.openstreetmap.org/way/806950197)
- [OSM mapped footprint](https://www.openstreetmap.org/way/1239732905)
- [Architect Benthem Crouwel: hovering foyer and continuous flowing line](https://www.benthemcrouwel.com/projects/rai-elicium)
- [File:RAI Elicium - A brighter place - panoramio.jpg — Hänsel und Gretel — CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:RAI_Elicium_-_A_brighter_place_-_panoramio.jpg)
- [File:RAI Elicium.jpg — Choinowski — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:RAI_Elicium.jpg)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/rai-elicium.jpg`; mapped overhead: `tmp/benelux/rai-elicium/qa/rai-elicium-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/rai-elicium/dark/rai-elicium-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. The specific Elicium photos established the rounded folded silver frame and hovering ballroom; photographs of other RAI halls were removed from the used sources. The frame is hollow closed geometry with inset glazing and real columns to grade. A base/frame overlap found by deterministic checks was removed before the first visual review; both LODs retain the rounded profile.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 2864 | 4 | 45820 |
| far | 1384 | 4 | 28524 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.
