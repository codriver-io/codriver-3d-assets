# Mondriaan Tower

Amstel office tower with asymmetric pale vertical end walls, a dark glazed gridded shaft, stepped side slabs and a raised pale crown.

Version: exterior standing on 2026-11-10, Amsterdam, Netherlands. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

| Measure | Value | Basis |
| --- | --- | --- |
| Overall height | 120 m | Published identity; crown allowance estimated |
| Main shaft | 117 m | OSM part 754399956 |
| Step heights | 115, 104, 98, 93, 90 m | OSM parts |

Origin 4.9174,52.344025; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation 0 radians is baked from the two mapped control points [[4.9178216,52.344033],[4.917747,52.3440153]]; the host must not rotate again. Footprints replace only OSM ways 279842059, 754399954, 754399955, 754399956, 754399957, 754399958, 754399959, 754399960, 754399961. Published 120 m overall height; OSM central part is 117 m and adjoining slabs 115, 104, 98, 93 and 90 m. A 3 m crown allowance reconciles the roof to the published height and is an estimate. OSM lower wings are retained; no neighbouring towers or railway structures are owned. Separate window cells survive far LOD; glass and masonry are tiled in the same facade plane.

## Sources and rights

- [Landmark identity and architectural context](https://en.wikipedia.org/wiki/Mondriaan_Tower)
- [OSM mapped footprint](https://www.openstreetmap.org/way/279842059)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399954)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399955)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399956)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399957)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399958)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399959)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399960)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399961)
- [File:Rotterdam-Skyline (cropped).jpg — acediscovery — CC BY 4.0](https://commons.wikimedia.org/wiki/File:Rotterdam-Skyline_(cropped).jpg)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/mondriaan-tower.jpg`; mapped overhead: `tmp/benelux/mondriaan-tower/qa/mondriaan-tower-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/mondriaan-tower/dark/mondriaan-tower-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. Compared the two exterior tower photographs: retained the asymmetric slab tops and pale frame around the dark windows; omitted the photographed logo and freestanding sign. The plan follows the mapped lower wings and both LODs keep the 120 m crown.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 23462 | 3 | 275984 |
| far | 7888 | 3 | 102028 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.
