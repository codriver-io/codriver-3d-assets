# Margot and Bill Winspear Opera House — Dallas

2009 Foster + Partners Winspear Opera House: burgundy oval drum, 60-foot glazed lobby, open slatted Grand Portico and sixteen mapped slender columns.

## Sources and rights

- [Official opera: 60 ft signature facade and sunshade canopy](https://dallasopera.org/about/winspear/)
- [Structural engineer: 60 ft glass lobby and red drum](https://www.thorntontomasetti.com/project/winspear-opera-house)
- [Architectural Record: 463 × 378 ft canopy](https://www.architecturalrecord.com/articles/8212-margot-and-bill-winspear-opera-house-by-foster-partners)
- [Completed exterior — Praefcke, CC BY 3.0](https://commons.wikimedia.org/wiki/File:Winspear_Opera_House_01.jpg)
- [Completed canopy connection detail — Praefcke, CC BY 3.0](https://commons.wikimedia.org/wiki/File:Winspear_Opera_House_22.jpg)
- [Original steel under construction — Mabel, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Dallas_-_Winspear_Opera_House_under_construction_02.jpg)
- [OSM geometry: API map fallback after queued Overpass failed](https://api.openstreetmap.org/api/0.6/map?bbox=-96.80027189117901,32.78884571541502,-96.795570108821,32.792798284584975)
- [OSM way 179918603](https://www.openstreetmap.org/way/179918603)
- [OSM way 312168249](https://www.openstreetmap.org/way/312168249)
- [OSM way 1414653500](https://www.openstreetmap.org/way/1414653500)
- [OSM way 1414653501](https://www.openstreetmap.org/way/1414653501)
- [OSM way 1414653502](https://www.openstreetmap.org/way/1414653502)
- [OSM way 1414653503](https://www.openstreetmap.org/way/1414653503)
- [OSM way 1414653504](https://www.openstreetmap.org/way/1414653504)
- [OSM way 1414653505](https://www.openstreetmap.org/way/1414653505)
- [OSM way 1414653506](https://www.openstreetmap.org/way/1414653506)
- [OSM way 1414653507](https://www.openstreetmap.org/way/1414653507)
- [OSM way 1414653508](https://www.openstreetmap.org/way/1414653508)
- [OSM way 1414653509](https://www.openstreetmap.org/way/1414653509)
- [OSM way 1414653510](https://www.openstreetmap.org/way/1414653510)
- [OSM way 1414653511](https://www.openstreetmap.org/way/1414653511)
- [OSM way 1414653512](https://www.openstreetmap.org/way/1414653512)
- [OSM way 1414653513](https://www.openstreetmap.org/way/1414653513)
- [OSM way 1414653514](https://www.openstreetmap.org/way/1414653514)
- [OSM way 1414653515](https://www.openstreetmap.org/way/1414653515)

Andreas Praefcke, Winspear Opera House 01 and Winspear Opera House 22, CC BY 3.0: verified completed exterior and canopy connection detail. Joe Mabel under-construction 02, CC BY-SA 3.0, used only to understand original steel connections, not as evidence of the finished facade. No construction machinery modeled.

OSM API map fallback was used after three cached/queued Overpass endpoints returned fetch errors, 504 or timeout. Raw map and normalized dossier are kept under ignored `tmp/texas-georgia/winspear-opera-house/`. Source and docs MIT; original model CC BY 4.0. No contributor or license acceptance performed.

## Frame and dimensions

Origin `[-96.797921,32.790822]`, real metres, east/up/south. Local y=0 is a rigid exterior foundation plane, with no terrain or latitude scaling baked in. Mapped canopy controls [-96.7989997,32.7909572] and [-96.7980347,32.7901206] establish the approximately 45° grid rotation. Main lobby uses its actual hexagonal OSM plan. Drum is oval and rotated -30° within that frame. All orientation is baked once. Tiny individual column rings lie entirely within canopy way 312168249, which owns their complete provider envelope; all sixteen IDs are explicitly listed.

| Feature | Metres | Basis |
| --- | ---: | --- |
| Glass lobby | 18.288 (60 ft) | Official operator and structural engineer |
| Canopy plan | about 118 × 142 | OSM; published 115.2 × 141.1 m is a nominal envelope |
| Canopy top / underside | 20 / 19.2 | Photo estimate; sources describe roughly 60–63 ft columns |
| Red drum / radii | 32 / 23 × 40 | Photo estimates |
| Column centers | 16 mapped points | OSM building-part rings |

OSM canopy and column heights (10 / 9 m) conflict with operator and engineer’s 60-foot lobby. The model uses the published 18.288 m lobby and estimated 19.2–20 m canopy, with this disagreement explicit.

## Approximation and ownership

2009 Foster + Partners Winspear Opera House: burgundy oval drum, 60-foot glazed lobby, open slatted Grand Portico and sixteen mapped slender columns. Dimensions beyond published height and OSM plan are photo estimates. Cityscape: not tested. Full 3D world: not tested. Provider ownership is limited to OSM ways 179918603, 312168249, 1414653500, 1414653501, 1414653502, 1414653503, 1414653504, 1414653505, 1414653506, 1414653507, 1414653508, 1414653509, 1414653510, 1414653511, 1414653512, 1414653513, 1414653514, 1414653515; surrounding buildings, roads and site landscaping excluded.

## Verification

Exported both LODs; deterministic QA: no flags. Visual self-review: passed. Cityscape: not tested. Full 3D world: not tested. Independent asset review and app integration remain separate gates.

Additional completed exterior checked: [Winspear Exterior.JPG](https://commons.wikimedia.org/wiki/File:Winspear_Exterior.JPG), Kayedavi, public domain. Shows the present glazed lobby, burgundy drum and open canopy from the plaza; comparison-only, not redistributed.


| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3020 | 5 | 47984 |
| far | 1308 | 5 | 27664 |

Contact sheet inspected: `tmp/batch/sheets/winspear-opera-house.jpg`. Metrics: `tmp/batch/winspear-metrics.json`. Top view checked against mapped footprint rings; exported far/dark sheet checked where recorded in batch state. Asset-specific tests, registry conformance, catalog validation and depth check passed. QA issues: [].
