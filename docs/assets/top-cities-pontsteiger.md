# Pontsteiger

Pontsteiger’s 90 m open gateway, six-bay exposed white truss, two towers and horizontal U-shaped apartment block above four glazed pavilions.

Version: exterior standing on 2026-11-10, Amsterdam, Netherlands. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

| Measure | Value | Basis |
| --- | --- | --- |
| Height / open gateway underside | 90 / 60 m | Published sources; underside differs from 58 m OSM |
| Low U body | y6–25 m | OSM 995816138 |
| Tower heads | 60 m | OSM 995816139/140 |
| Gateway clear width | about 46 m | Mapped estimate; structural source says over 50 m |

Origin 4.886223625,52.3936575; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation -0.8697135185016641 radians is baked from the two mapped control points [[4.88625,52.3937912],[4.8864456,52.3936498]]; the host must not rotate again. Footprints replace only OSM ways 501744462, 995816138, 995816139, 995816140, 995816141. Published height 90 m and free opening 60 m are retained. OSM bridge body begins at 58 m; the authored underside is 60 m to match the published architectural opening and contacts the 60 m tower heads. The mapped clear horizontal gap is about 46 m, while the engineer describes a structural span over 50 m; these are different measurements and the model does not enlarge the map footprint to force agreement. Balcony bays, ground pavilions, 7.65 m truss height and column spacing are photo estimates. Source main outline is relation 13123696 outer way 501744462; inner courtyard and surrounding quays/water remain open. Two additional authored truss-face strips cover the frame projection beyond the OSM facade edges. No road layer applies to this inhabited building span.

## Sources and rights

- [Landmark identity and architectural context](https://nl.wikipedia.org/wiki/Pontsteigergebouw)
- [OSM mapped footprint](https://www.openstreetmap.org/way/501744462)
- [OSM mapped footprint](https://www.openstreetmap.org/way/995816138)
- [OSM mapped footprint](https://www.openstreetmap.org/way/995816139)
- [OSM mapped footprint](https://www.openstreetmap.org/way/995816140)
- [OSM mapped footprint](https://www.openstreetmap.org/way/995816141)
- [Structural engineer Van Rossum: two 90 m towers and span over 50 m](https://www.vanrossumbv.nl/projecten/pontsteiger/)
- [Acoustic engineer: 60 m free opening](https://cauberghuygen.nl/project/pontsteiger/)
- [Building materials project: horizontal U over four pavilions](https://www.saint-gobain-gypsum-trophy.com/past-event/digital-edition-2021/past-projects/residential-building-pontsteiger/)
- [Bestand:Pontsteiger in 2022.jpg — Choinowski — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Pontsteiger_in_2022.jpg)
- [Bestand:2020 Gebouw Pontsteiger mei 2020 (10).jpg — Ceescamel — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:2020_Gebouw_Pontsteiger_mei_2020_(10).jpg)
- [Bestand:2020 Gebouw Pontsteiger mei 2020 (01).jpg — Ceescamel — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:2020_Gebouw_Pontsteiger_mei_2020_(01).jpg)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/pontsteiger.jpg`; mapped overhead: `tmp/benelux/pontsteiger/qa/pontsteiger-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/pontsteiger/dark/pontsteiger-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. The completed exterior and underside photos established the open gateway and exposed six-bay truss. Both LODs preserve the gateway and courtyard voids, grounded columns and four pavilions. Tests check every diagonal endpoint against the named chord mesh, pier-head contacts excluding the upper body, and a deliberately shortened free-end case. Mapped rings were retained, with two small authored strips covering the estimated exposed frame projection.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 16756 | 6 | 209564 |
| far | 7314 | 6 | 100448 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.
