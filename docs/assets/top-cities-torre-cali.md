# Torre de Cali — Cali

Torre de Cali’s tall grooved silver-and-glass shaft, mapped stepped piers and recessed vertical slots, with the distinctive lattice communications equipment retained above its flat roof.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Cali_Tower)
- [OSM way/308976770](https://www.openstreetmap.org/way/308976770)
- [Council on Vertical Urbanism/CTBUH:183m,44floors; also183m tip entry, incompatible with other published antenna totals](https://www.skyscrapercenter.com/building/id/2212)
- [Material supplier account:185.5m building,211m inclusive antennas; lower-confidence total retained as estimate](https://blog.laminasyaceros.com/blog/la-torre-de-cali)
- [Hotel operator: identity and current exterior](https://www.hoteltorredecali.com/)
- [File:Torre de Cali 1.jpg — Aleko; CC BY 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Torre_de_Cali_1.jpg)
- [File:Torre de Cali 3.jpg — Luism199; Public domain; comparison only](https://commons.wikimedia.org/wiki/File:Torre_de_Cali_3.jpg)
- [File:Torre de Cali - Feria de Cali 2014.jpg — CalinkaPF; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Torre_de_Cali_-_Feria_de_Cali_2014.jpg)
- [File:Torre de Cali - Palmeras.jpg — CalinkaPF; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Torre_de_Cali_-_Palmeras.jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Main roof |183 | CTBUH/CVU architectural height adopted as approximate roof datum |
| Roof alternatives |185.5 OSM /186 often published | Conflicting heights explicitly unresolved |
| Main antenna tip |211 | Frequently published total and visual estimate for current rooftop equipment; CVU also reports183m to tip, conflict unresolved |
| Tallest lattice equipment |28 above roof | Photo-calibrated estimate |
| Main floors |44 | CVU; OSM45 alternative |
| Mapped stepped plan |about38 ×35 | OSM308976770 |

Origin: [-76.5286199,3.4584488]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw 30.74800465670123 degrees is baked from the controls [[-76.5287514,3.4585582],[-76.5286416,3.4586234]]; the host must not rotate again. Footprint ownership: 308976770. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

The source photos5/6 establish the permanent fluted mirror-glass shaft;8/9 establish the rooftop lattice masts and dishes. Wrong-city photo1, painted mural2 and photo4 taken FROM the roof are excluded. Roof183m follows the measured-building database, but185.5/186m and211m inclusive-antenna figures appear elsewhere; the antenna model is a documented visual estimate, not a resolved survey, and the CVU183m to-tip entry conflicts with the visible equipment and published211m total. The actual OSM tower centroid corrects the Wikipedia anchor by roughly70m. Short mapped facade returns remain pale vertical piers and deep grooves; long faces retain thin horizontal glass subdivisions, with coarser modules at far. Three lattice masts and a representative dish are estimates from current external photos. No rooftop adverts, hotel signs, antennas on neighboring roofs or skyline textures are copied.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 19048 | 5 | 321960 |
| far | 5320 | 5 | 193976 |

Metrics: `tmp/batch/torre-cali/metrics.json`, no flags. Contact sheet: `tmp/batch/final/torre-cali.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/torre-cali/torre-cali-procedural-near-light-top.png`. One reference-led refinement restored broad pale central spines between the mirror-glass strips. Far discards hidden inner wall caps behind opaque glazing while retaining the mapped grooves, grouped window rhythm, all three lattice masts and dish. Actual roof/leg/brace/dish contacts and shortened-rung negative probes pass; complete exported tower and rooftop close views inspected, with height conflicts documented as estimates. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

## Independent-review follow-up

Narrowed the broad central pale spines from about 3.25m to 2.0m by widening the paired glazing bays, improving the darker facade hierarchy while retaining every horizontal joint. Far removes only glazing-concealed inward wall faces/reveal tubes; all separate window rows, mapped grooves, rooftop masts and the dish remain. Near appearance changes in the requested pale-pier/glass proportions; mast and bearing geometry is unchanged.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/torre-cali.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.
