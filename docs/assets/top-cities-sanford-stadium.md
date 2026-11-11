# Sanford Stadium — Athens

Dooley Field at Sanford Stadium: open asymmetrical football bowl, continuous lower seating, separate upper sideline decks and a taller north third tier, long south SkySuites, southwest two-level 2024 press box, west scoreboard and planted field-edge hedges. No roof over the field, signs, painted names or logos.

## Sources and rights

- [UGA operator: completed 2024 south-side project and two press-box levels](https://georgiadogs.com/news/2024/9/6/general-uga-dedicates-sanford-stadium-renovations)
- [Completed 2024 press-box exterior photo, Field Street Forum](https://www.fieldstforum.com/2024/09/07/uga-football-uga-dedicates-sanford-stadium-renovations/)
- [2025 south bowl exterior — BullDawg2021, CC BY 4.0](https://commons.wikimedia.org/wiki/File:Sanford_Stadium_south_view.jpg)
- [2025 bowl exterior — BullDawg2021, CC BY 4.0](https://commons.wikimedia.org/wiki/File:Sanford_Stadium,_August_2025.jpg)
- [2025 opposite-end exterior — TarheelBornBred, CC0](https://commons.wikimedia.org/wiki/File:UGA_vs._Marshall_at_Sanford_Stadium,_2025.jpg)
- [OSM geometry: API map fallback after queued Overpass failed](https://api.openstreetmap.org/api/0.6/map?bbox=-83.37574631297971,33.94782649541502,-83.37098146702027,33.951779064584976)
- [OSM way 598413258](https://www.openstreetmap.org/way/598413258)
- [OSM way 187020126](https://www.openstreetmap.org/way/187020126)

Completed 2025 open-air stadium exteriors by BullDawg2021 (CC BY 4.0) and TarheelBornBred (CC0) were inspected. September 2024 completed press-box photograph on Field Street Forum has no named photo creator or reuse license: treated all-rights-reserved comparison-only; no third-party geometry or pixels copied. The 2022 group portrait and historic postcard are context only, not current configuration references. Construction and proposed renderings excluded.

OSM API map fallback was used after three cached/queued Overpass endpoints returned fetch errors, 504 or timeout. Raw map and normalized dossier are kept under ignored `tmp/texas-georgia/sanford-stadium/`. Source and docs MIT; original model CC BY 4.0. No contributor or license acceptance performed.

## Frame and dimensions

Origin `[-83.37336389,33.94980278]`, real metres, east/up/south. Local y=0 is a rigid exterior foundation plane, with no terrain or latitude scaling baked in. Mapped Dooley Field corners [-83.3737836,33.9502158] to [-83.3727122,33.9497877] establish -25.8 degrees Y. Football axis is local X; north stands at negative Z, south stands at positive Z, west scoreboard at negative X. Rigid y=0 is stadium foundation grade, with field at +0.15 m; actual Athens valley topography and approaches are not baked into geometry.

Mapped playing surface about 109.9 by 49.2 m, matching a 120-yard by 53.33-yard football field. Lower bowl 216 by 168 m, decks 24/45/63 m, south suite crown 61 m, new southwest press-box crown 55 m, north lighting top 75 m are photo estimates; no authoritative exterior crown height located. Tier setbacks and rounded corners are simplified against the mapped stadium envelope. The completed southeast service concourse and southwest press-box outline were corrected against the 2025-10-15 USDA NAIP orthophoto; the former 8 m rectangular overhang estimate and omitted projection are superseded by measured controls. Empty seats are predominantly muted gray; red denotes fascia and small chair sections, never crowds.

## Completed aerial controls (review revision)

[USDA NAIP raster 24637](https://apps.geo.fpac.usda.gov/geo-imagery/rest/services/naip/conus_naip/ImageServer/24637), tile `m_3308306_nw_17_030_20251015`, acquired **2025-10-15**, 0.30 m GSD, is a completed current orthophoto. Federal government imagery is public domain; the ignored copy and measurement overlays are under `tmp/batch/fixes/sanford-naip*`. No aerial pixels or traced decoration are shipped. The commercial Vantor view used during source discovery is all-rights-reserved comparison-only and is superseded for final controls.

The aerial is registered to the two mapped Dooley Field controls stated above. `controls.js` records the current outline, rounded independent measurements and height basis. Both LODs retain the exact OSM southeast perimeter vertices from longitude -83.3727655 to -83.3721577, latitude 33.9486044 to 33.9492601, and meet the independent rounded aerial controls within **2 m relative to that frame**. This is model-to-control agreement, not surveyed absolute geolocation; NAIP mapping accuracy and topographic integration remain separate limits.

The southeast projection is an **open service/concourse deck**, with three low service units visible in the aerial, rather than an invented tall annex. Its service wall is 7.8 m plus a 0.20 m deck, roofed units reach 11.4 m (about 3.4 m above the deck, estimated from roof/shadow proportions). These are height estimates. The curved southwest press-box roof runs approximately local X=-91.2 to -25.2 m, Z=72.0 to 107.7 m; its end lift core follows the mapped step. Its founded core and two upper glazed levels reach 39 / 53.5 m, with a 55 m lift tower, still exterior-photo height estimates. The old south-suite block is shortened to join the measured press-box addition without duplicate overlapping facades. The football field and all paint remain at +0.15 m; the bowl stays open.

## Approximation and ownership

Dooley Field at Sanford Stadium: open asymmetrical football bowl, continuous lower seating, separate upper sideline decks and a taller north third tier, long south SkySuites, southwest two-level 2024 press box, west scoreboard and planted field-edge hedges. No roof over the field, signs, painted names or logos. Dimensions beyond published height and OSM plan are photo estimates. Cityscape: not tested. Full 3D world: not tested. Provider ownership is limited to OSM ways 598413258, 187020126; surrounding buildings, roads and site landscaping excluded.

## Verification

Review revision, 2026-11-10: Added the completed southeast open service/concourse mass and three low roofed service units from the 2025-10-15 USDA NAIP aerial. Both LOD perimeters meet independent rounded controls within 2 m relative to the mapped field frame; replaced the former estimated southwest press-box rectangle with the measured curved outline and joined lift core. The single fresh aerial/contact sheet and footprint top view pass self-review; the open field and +0.15 m playing surfaces are preserved. New serviceConcourse and pressBox inspection views expose both corrections.

Standalone visual self-review passed; ready for independent re-review. Cityscape: not tested. Full 3D world: not tested. Independent asset review and app integration remain separate gates.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 30997 | 8 | 373220 |
| far | 10711 | 8 | 149436 |

One new exported contact sheet inspected: `tmp/batch/fixes/sheets/sanford-stadium.jpg`. Reference images are fitted without cropping. Metrics: `tmp/batch/fixes/sanford-stadium-metrics.json`; no flags. Asset-specific tests and depth check passed.
