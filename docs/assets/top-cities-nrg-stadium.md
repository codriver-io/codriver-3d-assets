# Reliant Stadium (formerly NRG Stadium) — Houston

Reliant Stadium, returned to that name in August 2026: broad glazed flanks, four monumental corner towers, two long open triangular roof trusses and two white barrel-curved sliding roof panels shown partially open over an articulated football bowl. Stable asset id nrg-stadium preserves registration continuity; no signs, banners or logos.

## Sources and rights

- [Current operator: Reliant name restored August 2026](https://www.houstontexans.com/stadium/)
- [Structural engineer: first operable-roof NFL stadium](https://www.walterpmoore.com/projects/nrg-stadium)
- [Roof manufacturer: 152 by 117 m membrane and replacement work](https://www.taiyokogyo.co.jp/en/news/74460/)
- [Rodeo operator archival publication: 265 ft highest point](https://www.rodeohouston.com/wp-content/uploads/2023/08/2001-Winter.pdf)
- [Completed aerial exterior — US CBP, public domain](https://commons.wikimedia.org/wiki/File:NRG_Stadium,_Houston,_Texas,_United_States.jpg)
- [Completed ground exterior — VOA News B Allen, public domain](https://commons.wikimedia.org/wiki/File:NRG_Stadium_SBLI_Outside.jpg)
- [OSM geometry: API map fallback after queued Overpass failed](https://api.openstreetmap.org/api/0.6/map?bbox=-95.41310815435172,29.68274593541502,-95.40855850564829,29.68669850458498)
- [OSM way 119422708](https://www.openstreetmap.org/way/119422708)

US Customs and Border Protection aerial exterior and VOA News/B Allen ground exterior inspected, both US federal public-domain images per Commons metadata. The Super Bowl interior is structural context only. The permanent roof and facade geometry matches the current operator/roof-manufacturer description; repair scaffolding, storm damage, event graphics and changed naming signage are excluded. No imagery redistributed.

OSM API map fallback was used after three cached/queued Overpass endpoints returned fetch errors, 504 or timeout. Raw map and normalized dossier are kept under ignored `tmp/texas-georgia/nrg-stadium/`. Source and docs MIT; original model CC BY 4.0. No contributor or license acceptance performed.

## Frame and dimensions

Origin `[-95.4108,29.68486]`, real metres, east/up/south. Local y=0 is a rigid exterior foundation plane, with no terrain or latitude scaling baked in. North-end controls [-95.4113732,29.6860323] to [-95.4102838,29.6860559] establish +1.4 degrees Y. Long field axis is local Z. The exact OSM ring governs exterior wall placement; roof rail overhang and corner towers are photo estimates. y=0 is exterior foundation grade; this standalone asset does not reproduce the real below-grade playing-field excavation or surrounding topography.

Rodeo operator’s archival publication reports 265 ft = 80.772 m from ground to highest point, used here. OSM says 79.25 m; another report says 292 ft above the playing field, which may use the lower field datum. These are not conflated. Roof manufacturer gives approximately 152 by 117 m: model uses two 76 m panels spanning 117 m, each parked 38 m off centre for a deliberate partially open state. Facade cornice 62 m and bowl decks 1–48 m are estimates.

## Approximation and ownership

Reliant Stadium, returned to that name in August 2026: broad glazed flanks, four monumental corner towers, two long open triangular roof trusses and two white barrel-curved sliding roof panels shown partially open over an articulated football bowl. Stable asset id nrg-stadium preserves registration continuity; no signs, banners or logos. Dimensions beyond published height and OSM plan are photo estimates. Cityscape: not tested. Full 3D world: not tested. Provider ownership is limited to OSM ways 119422708; surrounding buildings, roads and site landscaping excluded.

## Verification

Exported both LODs; deterministic QA: no flags. Visual self-review: passed. Cityscape: not tested. Full 3D world: not tested. Independent asset review and app integration remain separate gates.


| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 35304 | 8 | 440808 |
| far | 9300 | 8 | 139916 |

Contact sheet inspected: `tmp/batch/sheets-final/nrg-stadium.jpg`. Metrics: `tmp/batch/reliant-metrics.json`. Top view checked against mapped footprint rings; exported far/dark sheet checked where recorded in batch state. Asset-specific tests, registry conformance, catalog validation and depth check passed. QA issues: [].
