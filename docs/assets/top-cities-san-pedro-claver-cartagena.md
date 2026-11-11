# Iglesia de San Pedro Claver — Cartagena

San Pedro Claver’s warm-stone church, paired open bell towers with dark domes/green lantern roofs, red rose windows and portal, central clock scroll, and the large pale French ribbed cupola with circular oculi behind the nave.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Iglesia_de_San_Pedro_Claver,_Cartagena)
- [OSM way/955128421](https://www.openstreetmap.org/way/955128421)
- [Sanctuary:consolidation of Gastón Lelarge twentieth-century steel/concrete cupola, architectural identity preserved](https://sanpedroclaver.co/consolidan-cupula-de-la-iglesia-san-pedro-claver/)
- [2015 conservation report:11.2m dome diameter and44m total height](https://www.eluniversal.com.co/cartagena/2015/10/16/se-inician-obras-de-reparacion-de-la-cupula-de-la-iglesia-san-pedro-claver/)
- [2026 conservation update:interior maintenance above30m](https://caracol.com.co/2026/04/02/etcar-adelanta-reparacion-de-la-cupula-de-la-iglesia-de-san-pedro/)
- [Jesuit sanctuary operator identity](https://jesuitas.co/obras/parroquia-san-pedro-claver/)
- [File:Iglesia de San Pedro Claver, Cartagena 05.jpg — Bernard Gagnon; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Iglesia_de_San_Pedro_Claver,_Cartagena_05.jpg)
- [File:Iglesia de San Pedro Claver, Cartagena 01.jpg — Bernard Gagnon; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Iglesia_de_San_Pedro_Claver,_Cartagena_01.jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Mapped church plan |about56.6×27.8 | OSM955128421 |
| Main cupola diameter /total height |11.2 /44 |2015 conservation report; adopted approximate exterior dimensions |
| Twin tower top |35.5 | Photo estimate |
| Facade/nave ridge |21.3 /23.4 | Photo estimate |
| Large cupola drum/top/lantern |22.7–28.25 /38 /41.5 | Photo-calibrated estimate |
| Dome centre behind facade |AuthZ−15.4 | Mapped long-side control breaks and exterior alignment |

Origin: [-75.551214175,10.421775575000002]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw 91.15077775784188 degrees is baked from the controls [[-75.5509553,10.4216566],[-75.5509604,10.4219063]]; the host must not rotate again. Footprint ownership: 955128421. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Only the church inside its mapped footprint is authored, not the adjacent cloister museum or neighboring terraces. Modern references2and3 establish the present pale Gastón Lelarge cupola; historical stereograph1without that cupola is rejected,4is an interior reliquary. The sanctuary confirms a twentieth-century Lelarge cupola and preservation of its architectural identity; sources disagree on exact1910/1921 chronology, which is not a modeled dimension. The11.2m diameter and44m total come from a conservation report, not an original measured drawing, and are adopted estimates; all other elevations are explicit photo estimates. Actual paired belfry arches, drum windows, dome oculi and portal recesses remain geometric. Original simplified radial rose tracery and a small robed figure suggest facade detail without tracing copyrighted sculpture or stained glass. Pale cupola ribs, circular white oculus rims, twin weathered dark caps and green lantern hips distinguish the skyline in both LODs. No plaza furniture, signage, banners, roof solar devices or paving is included.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 12052 | 8 | 169940 |
| far | 5866 | 8 | 113348 |

Metrics: `tmp/batch/san-pedro-claver-cartagena/metrics.json`, no flags. Contact sheet: `tmp/batch/final/san-pedro-claver-cartagena.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/san-pedro-claver-cartagena/san-pedro-claver-cartagena-procedural-near-light-top.png`. One reference-led refinement rounded the French cupola shoulders and removed a lower band that crossed the red facade roses. Eight real oculi with adjacent white annuli, both paired belfries, recessed rose/portal and the clock scroll survive far; baluster/rail/bell/cross named contacts and negative controls pass. Final contact sheet, red-ring plan and exported full-facade/cupola close views were inspected. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

## Independent-review follow-up

Far keeps all eight drum openings/oculi, the rounded cupola, twin open belfries and separate nave/facade window rows, removing only opaque-glazing concealed faces and slightly simplifying curved tessellation. Near geometry is unchanged. The optional additional sculptural figures and deeper cornice relief were deferred: adding unreferenced tiny carving during this weight pass would not improve the already accepted silhouette.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/san-pedro-claver-cartagena.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.
