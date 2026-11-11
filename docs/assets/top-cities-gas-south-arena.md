# Gas South Arena — Duluth

Operating Gas South Arena hull: broad grey hipped arena roof with two raised triangular roof ribs, curved glazed lobby, red-brown entrance piers and a pale sweeping canopy. Adjacent convention center, parking decks and future project renderings excluded.

## Sources and rights

- [Operator: September 2026 groundbreaking, completion expected early 2028](https://www.gassouthdistrict.com/news/detail/gas-south-arena-groundbreaking-ceremony)
- [Operating arena exterior — A1139530, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Gas_south_Arena_Outside.png)
- [USGS / NASA World Wind aerial — public domain](https://commons.wikimedia.org/wiki/File:ArenaatGwinnettCenterSat.png)
- [Official arena](https://www.gassouthdistrict.com/venues/detail/arena)
- [OSM geometry: API map fallback after queued Overpass failed](https://api.openstreetmap.org/api/0.6/map?bbox=-84.09655025833227,33.989412605415026,-84.09178308166774,33.99336517458498)
- [OSM way 271144315](https://www.openstreetmap.org/way/271144315)

A1139530, Gas south Arena Outside.png, CC BY-SA 4.0: December 2025 exterior of the operating curved glazed entrance. Betp / USGS through NASA World Wind, ArenaatGwinnettCenterSat.png, public domain: roof plan and original permanent hull, not later landscaping. Commons source and public-domain basis checked explicitly. Performer and wrestling photographs were rejected. Operator September 2026 release establishes groundbreaking and projected early-2028 completion; no proposed 2028 design is represented as completed.

OSM API map fallback was used after three cached/queued Overpass endpoints returned fetch errors, 504 or timeout. Raw map and normalized dossier are kept under ignored `tmp/texas-georgia/gas-south-arena/`. Source and docs MIT; original model CC BY 4.0. No contributor or license acceptance performed.

## Frame and dimensions

Origin `[-84.09416667,33.99138889]`, real metres, east/up/south. Local y=0 is a rigid exterior foundation plane, with no terrain or latitude scaling baked in. Mapped controls [-84.0944837,33.9907973] and [-84.0948349,33.9913133] establish the roughly 30° grid rotation. The full current OSM way is converted directly into the model; rotation +30° Y is baked once. Curved lobby follows the mapped outer arc. The neighboring convention/theater venues are not owned.

| Feature | Metres | Basis |
| --- | ---: | --- |
| Complete arena envelope | about 161 × 149 | OSM in facade frame |
| Lobby / canopy top | 18.1 / 18.5 | Photo estimates |
| Main roof shoulder / raised crown | 23 / 29 | Photo estimates |
| Two roof ribs / overall top | 31.5 | Photo estimate, no published exterior height located |

Version: existing operating exterior pictured December 2025 and mapped in 2026. The operator began a phased renovation in September 2026 and expects completion early 2028. Proposed expanded entrance, new roof treatment, parking deck and temporary construction are not claimed as completed; recheck this asset when that project changes the permanent exterior.

## Approximation and ownership

Operating Gas South Arena hull: broad grey hipped arena roof with two raised triangular roof ribs, curved glazed lobby, red-brown entrance piers and a pale sweeping canopy. Adjacent convention center, parking decks and future project renderings excluded. Dimensions beyond published height and OSM plan are photo estimates. Cityscape: not tested. Full 3D world: not tested. Provider ownership is limited to OSM ways 271144315; surrounding buildings, roads and site landscaping excluded.

## Verification

Exported both LODs; deterministic QA: no flags. Visual self-review: passed. Cityscape: not tested. Full 3D world: not tested. Independent asset review and app integration remain separate gates.

## Current exterior cross-check

[Official operator-linked September 3 2026 exterior photo](https://drive.google.com/file/d/1Z9zZIqs9TcAqq0nQ_3jTeWVhFX5GlPfr/view), **John Awtrey / Awtrey Media Group** (credit required by the official press-kit folder). No redistribution licence is supplied; treated as **all rights reserved**, comparison only. Viewed locally as `tmp/texas-georgia/gas-south-arena/refs/3.jpg`: confirms the existing curved canopy, red-brick piers and glass lobby at groundbreaking. Construction equipment, fencing and temporary earthworks are excluded. This current source confirms the permanent hull rather than treating the proposed 2028 rendering as built.


| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3896 | 5 | 54768 |
| far | 1798 | 5 | 31916 |

Contact sheet inspected: `tmp/batch/sheets-round2/gas-south-arena.jpg`. Metrics: `tmp/batch/gas-south-metrics.json`. Top view checked against mapped footprint rings; exported far/dark sheet checked where recorded in batch state. Asset-specific tests, registry conformance, catalog validation and depth check passed. QA issues: [].
