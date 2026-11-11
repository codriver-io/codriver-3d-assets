# Tour de la Miotte — Belfort

Reconstructed 1947 square stone watchtower, narrow slit openings, projecting corbel crown and open parapet.

## Sources and rights

- [Identity and documented history](https://fr.wikipedia.org/wiki/La_Miotte)
- [Mapped provider footprint / part, ODbL](https://www.openstreetmap.org/way/37666782)
- [2.jpg | Fichier:2016-04 Tour de la Miotte circumpolar 08.jpg | 0x010C | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:2016-04_Tour_de_la_Miotte_circumpolar_08.jpg)
- [3.jpg | Fichier:2013-Fort de la Miotte 06.JPG | Bourgeois.A | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:2013-Fort_de_la_Miotte_06.JPG)

Photos are local comparison only, no images or textures ship. Original code/docs MIT, model CC BY 4.0, OSM-derived geography ODbL 1.0. No contributor agreement accepted or invented.

## Frame and dimensions

Origin `[6.87398155,47.648225350000004]`, metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior footing; no hill, terrain or scene elevation is baked in. Rotation `0.3632496944473095` radians is baked once from OSM controls `[6.8739596,47.6482016]` → `[6.8740213,47.6482174]`. Host must not rotate again. Exact replacement ownership: 37666782; neighbouring structures excluded.

| Feature | Model | Basis |
| --- | ---: | --- |
| Stone tower / mast | 13 / 14.8 m | Published tower height 13 m; mast estimated |
| Footprint | about 4.95 × 3.77 m | Mapped OSM way 37666782 |
| Cornice / slit / parapet sizes | see source | Photo estimates |

Models the current tower only, excluding the surrounding fort and hill. Published 13 m tower height refers to masonry; flagstaff adds an estimated 1.8 m. No national flag, lettering or wall plaques. Two useful exterior references: 2016 night view by 0x010C (CC BY-SA 4.0), 2013 day view by Bourgeois.A (CC BY-SA 3.0); unrelated landscape, historical engraving and distant town images rejected.

## Evidence and limitations

Exported near/far geometry, footprint plan and night view inspected against the verified exterior photographs. Two look-fix rounds: reduced crown contrast, corrected inward wall extrusion to keep the base inside the mapped ring, and widened the sheet framing for the complete mast; corbel crown, narrow slits and open parapet survive far. Small masonry courses, flag and surrounding fort omitted; the crown overhangs the ground ring by about 0.25 m.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 2784 | 4 | 55332 |
| far | 1776 | 4 | 38848 |

Deterministic QA: no remaining flags; metrics at `tmp/france-northeast/tour-de-la-miotte/metrics.json`. Exported contact sheet: `tmp/france-northeast/sheets-final/tour-de-la-miotte.jpg`. Red footprint top view and exported far/night evidence: `tmp/france-northeast/shots/tour-de-la-miotte/`. Focused identity/geometry and registry conformance tests, asset catalog and depth-layer checks pass. Self-review only; independent review remains pending.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot run. Independent review and app placement, terrain pad selection, provider replacement, DEM contacts, lifecycle and hardware verification remain later integration work.

Frontage metadata: 159.1873° clockwise from north, toward the modelled local +Z principal face. The mapped rotation is already baked; this bearing is descriptive and must not be applied as a second rotation.
