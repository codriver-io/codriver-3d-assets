# Morton H. Meyerson Symphony Center — Dallas

I. M. Pei’s 1989 Meyerson Symphony Center: limestone shoebox hall rotated within a curved conoid glass lobby, monumental open limestone entry portal and low rear service wing.

## Sources and rights

- [Official building facts: conoid windows and concert hall](https://meyerson.dallasculture.org/about/the-building/)
- [I. M. Pei’s original statement: sweeping glass canopy](https://meyerson.dallasculture.org/about/statement-by-i-m-pei/)
- [2026 architecture award: hall rotated 26° from street grid](https://magazine.texasarchitects.org/2026/10/22/morton-h-meyerson-symphony-center-receives-25-year-award/)
- [Exterior portal — Praefcke, CC BY 3.0](https://commons.wikimedia.org/wiki/File:Dallas_Meyerson_Center_02.jpg)
- [Exterior curved glazing — Praefcke, CC BY 3.0](https://commons.wikimedia.org/wiki/File:Dallas_Meyerson_Center_03.jpg)
- [OSM geometry: API map fallback after queued Overpass failed](https://api.openstreetmap.org/api/0.6/map?bbox=-96.80098786331911,32.787791715415025,-96.79628613668089,32.79174428458498)
- [OSM way 28544900](https://www.openstreetmap.org/way/28544900)

Andreas Praefcke, Dallas Meyerson Center 02 and Dallas Meyerson Center 03, both CC BY 3.0: two verified exterior angles showing the portal, upper limestone hall and sloping curved glazing. Dallas Meyerson Center plaque was rejected as a plaque and was not a geometric reference.

OSM API map fallback was used after three cached/queued Overpass endpoints returned fetch errors, 504 or timeout. Raw map and normalized dossier are kept under ignored `tmp/texas-georgia/meyerson-symphony-center/`. Source and docs MIT; original model CC BY 4.0. No contributor or license acceptance performed.

## Frame and dimensions

Origin `[-96.798637,32.789768]`, real metres, east/up/south. Local y=0 is a rigid exterior foundation plane, with no terrain or latitude scaling baked in. OSM controls [-96.7993875,32.7897981] and [-96.7986326,32.7903957] establish the street-grid skew, approximately 45°. Main hall has a further 26° rotation within the site. Both rotations are baked once. Lower lobby follows the mapped ring; the entry portal projects into its open forecourt and is not represented as extra provider ownership.

| Feature | Metres | Basis |
| --- | ---: | --- |
| Overall plan | about 102 × 93 | OSM envelope |
| Hall height / width / length | 35 / 37 / 55 | Photo estimates, no published exterior height found |
| Glass spring / upper rim | 5 / 24 | Photo estimates |
| Portal top / clear height | 27.5 / 24.5 | Photo estimates |
| Hall rotation within site | 26° | Texas Architect, 2026 |

## Approximation and ownership

I. M. Pei’s 1989 Meyerson Symphony Center: limestone shoebox hall rotated within a curved conoid glass lobby, monumental open limestone entry portal and low rear service wing. Dimensions beyond published height and OSM plan are photo estimates. Cityscape: not tested. Full 3D world: not tested. Provider ownership is limited to OSM ways 28544900; surrounding buildings, roads and site landscaping excluded.

## Verification

Review revision, 2026-11-10: Fitted the complete available Praefcke exterior photograph (CC BY 3.0) into the reference tile so the upper-hall apex and entrance portal are no longer cropped by the sheet tool. Retained the accepted shoebox roof and curved glazing; the source photograph itself still cuts off the far right edge, so it does not establish a roof-slope error or surveyed proportions. A wider complete exterior remains an optional reference improvement.

Standalone visual self-review passed; ready for independent re-review. Cityscape: not tested. Full 3D world: not tested. Independent asset review and app integration remain separate gates.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3390 | 4 | 49260 |
| far | 1752 | 4 | 30492 |

One new exported contact sheet inspected: `tmp/batch/fixes/sheets/meyerson-symphony-center.jpg`. Reference images are fitted without cropping. Metrics: `tmp/batch/fixes/meyerson-symphony-center-metrics.json`; no flags. Asset-specific tests and depth check passed.
