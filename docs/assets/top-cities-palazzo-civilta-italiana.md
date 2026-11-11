# Palazzo della Civiltà Italiana — Rome

Original procedural exterior of the Palazzo della Civiltà Italiana: a travertine cube with exactly six tiers of nine open round arches on each face, deep shaded galleries, recessed glazing and simplified human allegory statues at the ground arcade.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Palazzo_della_Civiltà_Italiana)
- [OSM relation/1559654](https://www.openstreetmap.org/relation/1559654)
- [OSM way/23959043](https://www.openstreetmap.org/way/23959043)
- [Architectural project sheet — 60 m, travertine and original design](https://cdn.archilovers.com/projects/f702093d-865c-4b8a-8141-79ac257b21bb.pdf)
- [OSM relation including outer and inner member ways](https://www.openstreetmap.org/relation/1559654)
- [File:Palazzo della Civiltà Italiana sud-ovest.jpg — Patrickhlauke; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Palazzo_della_Civilt%C3%A0_Italiana_sud-ovest.jpg)
- [File:Palazzo della Civiltà Italiana, viewed from the North, Rome, Italy.jpg — Julian Lupyan; CC0; comparison only](https://commons.wikimedia.org/wiki/File:Palazzo_della_Civilt%C3%A0_Italiana,_viewed_from_the_North,_Rome,_Italy.jpg)
- [File:Square colosseum - Flickr - batintherain.jpg — batintherain from Pesaro, Italy; CC BY-SA 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Square_colosseum_-_Flickr_-_batintherain.jpg)
- [File:Palazzo della civiltà del lavoro (EUR, Rome) (5904657870).jpg — dalbera from Paris, France; CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Palazzo_della_civilt%C3%A0_del_lavoro_(EUR,_Rome)_(5904657870).jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres/count | Basis |
| --- | ---: | --- |
| Cube height above upper entrance grade | 54 | Photo-calibrated estimate; published 60 m and OSM 68 m conflict; differing datums are only a possible explanation |
| Mapped cube side | about 52 | OSM outer way 23959043; descriptions round to 53 |
| Arcades | 6 × 9 on each face | Photographs and published descriptions |
| Arcade clear opening | 3.4 × 6.8 | Estimated from photos |
| Base above local grade | 0.6 | Estimated shallow upper entrance landing |

Origin: [12.465321475,41.8367058]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw -20.85599645059215 degrees is baked from the controls [[12.4651386,41.8370007],[12.4657213,41.8368353]]; the host must not rotate again. Footprint ownership: relation/1559654, way/23959043. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

The six-by-nine open arcades are real geometric holes in both LODs. Inner glazing is recessed well behind the galleries; floor slabs meet the wall piers. Sculptures inside the ground arcade are grouped human figures. Lettering, branding, terrace Dioscuri, broad downhill stair terraces, landscape and interiors are omitted. Published cube height about 60 m and OSM height=68 disagree; different sloping-site and plinth datums may explain this (inference, not surveyed); 54 m above the upper entrance datum is a photo-calibrated cube-height estimate, not a survey; the published 60 m and mapped 68 m are retained as conflicting whole-building/site figures. Mapped inner way 110401782 defines the approximately 9.7 × 16.3 m open lightwell, including its stone attic linings. OSM relation fetched with the OSM single-object full API to recover missing member rings.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 19202 | 2 | 295388 |
| far | 5834 | 2 | 133104 |

Metrics: `tmp/batch/palazzo-civilta-italiana/metrics.json`, no flags. Contact sheet: `tmp/batch/final/palazzo-civilta-italiana.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/palazzo-civilta-italiana/palazzo-civilta-italiana-procedural-near-light-top.png`. One visual correction calibrated the cube and upper parapet to the photos, preserving all 216 arches and the ground sculptures. Explicit enlarged QA bounds keep the whole silhouette in both overview tiles; street and closer-west tiles intentionally show facade detail. Red-ring plan aligns with the mapped skew. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

Follow-up plan review corrected the lightwell to mapped inner way [110401782](https://www.openstreetmap.org/way/110401782), approximately 9.7 × 16.3 m, with roof-contact regression rays outside and inside the opening.

## Independent-review follow-up

Far retains all 216 actual arcade openings, galleries, the mapped lightwell, recessed core and ground statues. Weight savings remove inward wall caps occluded by the core, simplify arch curves within the existing envelopes, and use lower tessellation on small statue heads/limbs; only buried leg-end caps are omitted. Every opening and the lightwell negative tests pass; near geometry is unchanged.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/palazzo-civilta-italiana.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.
