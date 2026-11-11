# Stade Pierre-Mauroy — Villeneuve-d’Ascq

2012 stadium with a rounded rectangular translucent tube shell, continuous vertical rib rhythm, rectangular retractable roof opening, two roof tracks and an inset bowl.

## Sources and rights

- [Identity and documented history](https://fr.wikipedia.org/wiki/Stade_Pierre-Mauroy)
- [Mapped provider footprint / part, ODbL](https://www.openstreetmap.org/way/151494291)
- [Mapped provider footprint / part, ODbL](https://www.openstreetmap.org/way/178547373)
- [7.jpg | File:Lille Stadion Pierre Mauroy (160430783).jpeg | Dronepicr | CC-BY-3.0](https://en.wikipedia.org/wiki/File:Lille_Stadion_Pierre_Mauroy_(160430783).jpeg)
- [8.jpg | Valode & Pistre project exterior, © project photographers; all rights reserved, comparison only](https://v-p.com/wp-content/uploads/2023/05/Grand-Stade-de-Lille_1-couv-scaled-e1701880280205.jpg)
- [9.jpg | Valode & Pistre project comparison, © project photographers; all rights reserved, comparison only](https://v-p.com/wp-content/uploads/2023/05/Grand-Stade-de-Lille_3-scaled-e1701880258286.jpg)

Photos are local comparison only, no images or textures ship. Original code/docs MIT, model CC BY 4.0, OSM-derived geography ODbL 1.0. No contributor agreement accepted or invented.

## Frame and dimensions

Origin `[3.130508,50.611911]`, metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior footing; no hill, terrain or scene elevation is baked in. Rotation `0.2515163942207968` radians is baked once from OSM controls `[3.1295743,50.6127853]` → `[3.1306457,50.61296]`. Host must not rotate again. Exact replacement ownership: 151494291, 178547373; neighbouring structures excluded.

| Feature | Model | Basis |
| --- | ---: | --- |
| Envelope / roof maximum | 41 m | OSM height tag; detailed shell profile estimated |
| Outer envelope and opening | Mapped rings | OSM ways 151494291 / 178547373, relation 17493118 |
| Roof mega-beam length | 205 m published | Operator construction history; simplified tracks follow model opening |
| Field | 105 × 68 m | Standard match field, estimated visible inset |

Open-roof configuration, all original texture-free geometry. Current completed shell checked against Dronepicr UEFA 2016 exterior (CC BY 3.0) and Valode & Pistre completed night exterior (all rights reserved; comparison only), with their facade interior photograph for tube rhythm. Construction and event/interior photos rejected as exterior evidence. No branding, names, sponsors, advertising, stadium screens or parking/plaza surfaces modelled. Bowl seating bands are simplified, not individual seats; ground field lies 0.2 m above local grade.

## Evidence and limitations

Exported near/far geometry, footprint plan and night view inspected against the verified exterior photographs. Two visual fix rounds: aligned field and roof tracks to the measured opening bearing and shortened the simplified tracks onto the fixed annulus. Geometry screening also corrected the roof-hole winding and removed tiny shell notches. All four member ends pass contact tests excluding the tracks themselves, with extended free-end negative controls; shell rib rhythm, open roof, bowl and grade-safe field survive far.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 11416 | 6 | 204008 |
| far | 6664 | 6 | 127908 |

Deterministic QA: no remaining flags; metrics at `tmp/france-northeast/stade-pierre-mauroy/metrics.json`. Exported contact sheet: `tmp/france-northeast/sheets/stade-pierre-mauroy.jpg`. Red footprint top view and exported far/night evidence: `tmp/france-northeast/shots/stade-pierre-mauroy/`. Focused identity/geometry and registry conformance tests, asset catalog and depth-layer checks pass. Self-review only; independent review remains pending.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot run. Independent review and app placement, terrain pad selection, provider replacement, DEM contacts, lifecycle and hardware verification remain later integration work.

The two displayed roof tracks are simplified 187 m members, seated on the fixed annulus at all four ends and tested with the members excluded from the support mesh; deliberately extended free ends fail. The operator’s 205 m mega-beam figure is contextual and does not claim these simplified tracks have that exact full structural span.

Frontage metadata: 165.5892° clockwise from north, toward the modelled local +Z principal face. The mapped rotation is already baked; this bearing is descriptive and must not be applied as a second rotation.
