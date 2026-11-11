# nhow Amsterdam RAI

nhow RAI’s three 60-degree rotated triangular hotel volumes, deep cantilevered corners, recessed restaurant bands and fine silver facade fins.

Version: exterior standing on 2026-11-10, Amsterdam, Netherlands. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

| Measure | Value | Basis |
| --- | --- | --- |
| Overall height | 91 m | Published / OSM |
| Lower volume | y7–35 m | OSM 806837639 |
| Middle volume | y38.5–59.5 m | OSM 806837638 |
| Upper volume | y63–87.5 m | OSM 806837637 |
| Roof screen | y88–91 m | OSM 806837636 |

Origin 4.8909418,52.33843153; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation 0 radians is baked from the two mapped control points [[4.8904845,52.3385719],[4.8913428,52.3385985]]; the host must not rotate again. Footprints replace only OSM ways 1468614335, 806837636, 806837637, 806837638, 806837639. 91 m overall height and three shifting triangular volumes are published by the facade fabricator and structural-engineering project case. OSM supplies the exact triangle bearings and stacked levels: 7–35, 38.5–59.5 and 63–87.5 m, plus the 88–91 m roof screen. A recessed shared central core joins the volumes to grade in both LODs. Window/fins pitch is a photo estimate; underground parking, terrace furniture and logos are excluded.

## Sources and rights

- [Landmark identity and architectural context](https://nl.wikipedia.org/wiki/Nhow_Amsterdam_RAI)
- [OSM mapped footprint](https://www.openstreetmap.org/way/1468614335)
- [OSM mapped footprint](https://www.openstreetmap.org/way/806837636)
- [OSM mapped footprint](https://www.openstreetmap.org/way/806837637)
- [OSM mapped footprint](https://www.openstreetmap.org/way/806837638)
- [OSM mapped footprint](https://www.openstreetmap.org/way/806837639)
- [Facade fabricator: 91 m and triangular glass volumes](https://www.rollecate.nl/projecten/rai-hotel-amsterdam)
- [SCIA / Van Rossum: 91 m tower and structural cantilevers](https://www.scia.net/en/user-stories/nhow-rai-hotel-amsterdam)
- [Bestand:Nhow Amsterdam RAI.jpg — DFK2021 (Dmitry Feichtner-Kozlov) — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Nhow_Amsterdam_RAI.jpg)
- [Bestand:NHOW Hotel Amsterdam RAI (1).jpg — Ceescamel — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:NHOW_Hotel_Amsterdam_RAI_(1).jpg)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/nhow-amsterdam-rai.jpg`; mapped overhead: `tmp/benelux/nhow-amsterdam-rai/qa/nhow-amsterdam-rai-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/nhow-amsterdam-rai/dark/nhow-amsterdam-rai-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. Exact mapped triangles preserve the three rotated volumes and their deep cantilevered corners. Only the visible recessed support bands are tessellated; hidden core facade grids were removed, reducing near cost from 20,904 to 15,408 triangles. Both exterior reference photos show the completed facade; the construction photo was excluded from the used reference list.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 15408 | 3 | 177776 |
| far | 5484 | 3 | 69792 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.
