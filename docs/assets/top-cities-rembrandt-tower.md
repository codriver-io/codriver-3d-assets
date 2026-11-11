# Rembrandt Tower

Amstel skyline tower with a pale gridded shaft, four stepped corner shoulders, a smaller crown and a 15-metre mast.

Version: exterior standing on 2026-11-10, Amsterdam, Netherlands. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

| Measure | Value | Basis |
| --- | --- | --- |
| Roof / tip | 135 / 150 m | Published tower identity; upper OSM machinery tags disagree |
| Footprint | about 48 × 48 m | OSM way 44451577 |
| Main setbacks | 22, 35, 108, 119, 130 m | Mapped OSM parts |

Origin 4.917058,52.345125; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation 0 radians is baked from the two mapped control points [[4.9175123,52.3449991],[4.9168502,52.344846]]; the host must not rotate again. Footprints replace only OSM ways 44451577, 754399963, 754399964, 754399965, 754399966, 754399967, 754399968, 754399969, 754399970, 754399971, 754399972, 754399973. OSM supplies the rotated footprint and eight occupied massing parts. Roof 135 m and tip 150 m are published; OSM upper machinery heights of 140/143 m are replaced by the published 135 m roof and a seated mast to 150 m. Lower setbacks and glazing pitch are estimated from exterior photographs; no surrounding plazas or neighbouring Breitner/Mondriaan buildings are owned.

## Sources and rights

- [Landmark identity and architectural context](https://en.wikipedia.org/wiki/Rembrandt_Tower)
- [OSM mapped footprint](https://www.openstreetmap.org/way/44451577)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399963)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399964)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399965)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399966)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399967)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399968)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399969)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399970)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399971)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399972)
- [OSM mapped footprint](https://www.openstreetmap.org/way/754399973)
- [File:Rembrandttoren in 2019 (1).jpg — Ceescamel — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Rembrandttoren_in_2019_(1).jpg)
- [File:Rembrandttoren in 2021.jpg — Choinowski — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Rembrandttoren_in_2021.jpg)
- [File:Rembrandt toren vanuit het noordwesten.jpg — S Sepp — CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Rembrandt_toren_vanuit_het_noordwesten.jpg)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/rembrandt-tower.jpg`; mapped overhead: `tmp/benelux/rembrandt-tower/qa/rembrandt-tower-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/rembrandt-tower/dark/rembrandt-tower-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. The first automatic contact sheet clipped the tall tower; bounds were expanded for the final sheet. Far facade density was reduced from 14,904 to 8,888 triangles while retaining all mapped setbacks, crown and mast. The full footprint sits within the mapped primary ring; subdued stone and grey-blue glazing are estimated from the exterior photographs.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 23828 | 4 | 281108 |
| far | 8888 | 4 | 112900 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.
