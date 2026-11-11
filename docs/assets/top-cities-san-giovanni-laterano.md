# Archbasilica of Saint John Lateran — Rome

Original procedural current exterior of the Lateran basilica: Galilei’s five-bay monumental white facade, fifteen seven-metre rooftop human figures, long gabled nave, northern two-storey loggia with twin bell spires, chapel dome and the mapped cloister complex.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Archbasilica_of_Saint_John_Lateran)
- [OSM relation/36444](https://www.openstreetmap.org/relation/36444)
- [OSM way/1002990290](https://www.openstreetmap.org/way/1002990290)
- [OSM way/25468169](https://www.openstreetmap.org/way/25468169)
- [OSM way/662048272](https://www.openstreetmap.org/way/662048272)
- [Basilica official — current facade and loggias](https://www.basilicasangiovanni.va/it/san-giovanni-in-laterano/basilica/facciata-e-logge.html)
- [Vatican basilica — seven metre rooftop statues](https://press.vatican.va/various/basiliche/san_giovanni/it/basilica/facciata_ori.htm)
- [Italian national tourism — fifteen 7 m statues and 130 m interior](https://www.italia.it/en/lazio/rome/basilica-of-saint-john-lateran)
- [File:San Giovanni in Laterano 2021.jpg — NikonZ7II; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:San_Giovanni_in_Laterano_2021.jpg)
- [File:San Giovanni in Laterano (Rome) - Exterior 2013.jpg — Szilas; Public domain; comparison only](https://commons.wikimedia.org/wiki/File:San_Giovanni_in_Laterano_(Rome)_-_Exterior_2013.jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres/count | Basis |
| --- | ---: | --- |
| Main basilica length | about 146 mapped / 140 published | OSM church envelope versus conventional architectural length |
| Main facade width | about 65 | Mapped eastern frontage |
| Facade saints | 15 figures, 7 m each | Vatican basilica and Italian national tourism |
| Main entablature | 31.8 | Photo estimate |
| Highest statue/cross | 48.8 | Photo estimate |
| Northern loggia spires | 47 | Photo estimate; not a survey |

Origin: [12.505592,41.8858502]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw 12.5 degrees is baked from the controls [[12.505402,41.886105],[12.5057398,41.8861608]]; the host must not rotate again. Footprint ownership: relation/36444, 1002990290, 25468169, 662048272. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

The ownership envelope is the basilica relation only; adjoining Lateran Palace, detached baptistery, obelisk and Scala Santa are excluded. Open arcaded east and north facades have real cutouts in both LODs. Fifteen statues use planted legs, robed bodies, heads and articulated arms. Nave, lower aisles, cloister courts and chapel roof masses are simplified to map-scale architecture; individual reliefs, mosaic/inscription detail, interior artwork and lettering are omitted. Saint heights are sourced at 7 m; other vertical stage heights and dome/spire dimensions are explicit photo estimates. Rigid local y=0 has no baked hill. Relation member geometry recovered from the OSM full API after the serialized Overpass dossier attempts timed out.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 16031 | 6 | 204508 |
| far | 5862 | 6 | 120816 |

Metrics: `tmp/batch/san-giovanni-laterano/metrics.json`, no flags. Contact sheet: `tmp/batch/final/san-giovanni-laterano.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/san-giovanni-laterano/san-giovanni-laterano-procedural-near-light-top.png`. One look-fix round added recessed upper-arcade glazing and real lower-wing fenestration, which also survives far. Both actual facade photos were checked; the historical photograph was excluded. Fifteen planted human figures and both bell spires remain in proportion. The mapped outline and two open cloister courts align in plan. Reliefs and subsidiary roof trim remain simplified. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

Final contact correction: each saint has a neck joining its robe and head, tested by a horizontal ray through the former gap in both LODs. Main facade exported close view: `tmp/landmarks/shots/san-giovanni-laterano/san-giovanni-laterano-glb-near-light-main-facade.png`; the five tall openings, colossal columns and supported figures are visible directly.

## Independent-review follow-up

Strengthened the front loggia cornice thickness and projecting upper cornice without adding wall windows. Far keeps all fifteen grouped robed figures, five entrance bays, north loggia, spires and cloister while simplifying only head/cap curves, arch tessellation and glazing-concealed inward faces/reveal tubes. Near changes only in the requested cornice articulation; no rear facade was removed.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/san-giovanni-laterano.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.
