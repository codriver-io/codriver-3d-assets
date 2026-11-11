# Gare do Oriente — Lisbon

Original procedural Gare do Oriente with its 60 branching steel tree canopies, eight elevated railway tracks, open concrete arcades, axial gallery and seven sweeping glazed bus-terminal wings.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Gare_do_Oriente)
- [OSM way/1437052582](https://www.openstreetmap.org/way/1437052582)
- [Architect: five rows of twinned arches, 260 by 78 m, 56-foot tree grid](https://prod.calatrava.com/projects/oriente-station-lisboa.html)
- [Material supplier construction account: sixty trees and 238 by 68 m canopy](https://cdnmedia.mapei.com/docs/projects-documents/en-14e543b6-64e9-4710-9c0b-f0ba6dc43c91.pdf.pdf?sfvrsn=d2531c5b_8)
- [Concrete supplier: four rows of metal trees](https://www.secil-group.com/en/secil/what-we-do/reference-works%20/gare-do-oriente)
- [File:Façada do Gare do Oriente.jpg — Chergata; CC BY 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Fa%C3%A7ada_do_Gare_do_Oriente.jpg)
- [File:Gare do Oriente 0529.jpg — W.Rebel; CC BY 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Gare_do_Oriente_0529.jpg)
- [File:2023 (challenge No. 3 - old unpublished pics ) - Day 151 - Gare do Oriente roof, Lisbon, Portugal 2020 (52939852050).jpg — Forbes Johnston from Winchester, UK; CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:2023_(challenge_No._3_-_old_unpublished_pics_)_-_Day_151_-_Gare_do_Oriente_roof,_Lisbon,_Portugal_2020_(52939852050).jpg)
- [File:Gare do Oriente (12914354233).jpg — Francisco Restivo from Porto, Portugal; CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Gare_do_Oriente_(12914354233).jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Value | Basis |
| --- | ---: | --- |
| Main platform structure | 260 × 78 m | Calatrava project: 853 × 256 feet |
| Rail canopy | 238 × 68 m | Mapei project account; four by fifteen 17 m tree cells |
| Tree grid | 17 m, 60 columns | Architect 56-foot grid; Mapei sixty trees |
| Platform grade | 12.4 m | Photo-calibrated local estimate, not sea-level altitude |
| Highest glass corners | 35 m | Photo-calibrated estimate; publications quote ambiguous 28 m canopy height |

Origin: [-9.09907265,38.767820575]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw -4.053541121689953 degrees is baked from the controls [[-9.0994313,38.7689571],[-9.0985119,38.7689063]]; the host must not rotate again. Footprint ownership: 1437052582. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Main station, western bus canopy and axial gallery are owned by mapped way 1437052582. Basement parking is not modeled or claimed. Total height and lower platform datum are estimates because sources do not establish a common local vertical datum; the 28 m published canopy dimension is not treated as a surveyed total height. Both LODs retain all sixty trees and real open arches. Roof glass is opaque muted green-grey without logos; secondary glazing details, rail rolling stock, shops and interiors are omitted. Ground slabs are at least 0.10 m above grade. No road surface is provided; bus-lane and terrain integration is not tested.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 36804 | 6 | 566280 |
| far | 6496 | 6 | 113780 |

Metrics: `tmp/batch/gare-oriente/metrics.json`, no flags. Contact sheet: `tmp/batch/final/gare-oriente.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/gare-oriente/gare-oriente-procedural-near-light-top.png`. The folded roof,60 trees, platform voids and seven bus wings were inspected against current station exteriors. Secondary far ribs are removed while all60 trunks and four primary branches per trunk survive; named trunk/platform and crown/glass contact probes pass. Broader axial gallery and bus roofs remain simplified estimates. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

## Independent-review follow-up

Refitted the bus fingers to six mapped full-length centres plus the short rounded western termination; every grounded western support is now tested within 1m of the unchanged owned OSM ring in both LODs, with a negative control at the former outlier. All 60 train trees, 100 open rail arches, eight tracks and supported continuous galleries remain. Far drops from 11044 to 6496 triangles using coarser arch curves, triangular beam sections and umbrella facets; retaining all 60 branching trees and the 100 actual arch openings justifies the remaining 496 above the soft 6000 target. Near geometry changes only in bus-terminal fit, not train-hall detail.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/gare-oriente.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.

## Independent-review follow-up

Extended the independent footprint audit to ALL exported grounded concrete supports, in both LODs, rather than only the western bus footings. Trimmed only the rail-arcade end cheeks to the mapped 254m ground length beneath the unchanged260m platform, and tapered the eastern entry tail/pier positions to the owned map outline. All 100 actual rail arches, 60 trees, train roof and 6496-triangle far budget remain; the stronger unit test now checks every grounded concrete vertex against the unchanged ring. The fresh geographic GLB audit is tmp/batch/followup/footprints-all.json.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/gare-oriente.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.
