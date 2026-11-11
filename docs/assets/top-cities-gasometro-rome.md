# Gasometro Ostiense — Rome

Original procedural exterior of the surviving Ostiense gas-holder frame: twenty open steel stanchions, five giant X-braced tiers, circumferential lattice rings, low annular base and a supported internal access gantry. The removed gas-storage cylinder is not reconstructed.

## Sources and rights

- [Article: identity and architectural context](https://it.wikipedia.org/wiki/Gazometro_di_Roma)
- [OSM way/26840361](https://www.openstreetmap.org/way/26840361)
- [Lighting supplier installation report — existing approximately 90 m steel cylinder](https://www.prolights.it/news/726/PROLIGHTS-illumina-il-Gazometro-di-Roma)
- [File:Roma Gazometro.jpg — Gidipa; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Roma_Gazometro.jpg)
- [File:Roma Gazometro Ostiense.jpg — Blackcat; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Roma_Gazometro_Ostiense.jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres/count | Basis |
| --- | ---: | --- |
| Main frame rim | 89.1 | OSM height=89,10; published descriptions about 89–90 m |
| Main outer diameter | about 63 | OSM diameter=63; mapped ring about 62.5 m |
| Export including raised access platform | 93.1 | Estimated 4 m projection above tagged rim; total is not a survey |
| Main stanchions / brace tiers | 20 / 5 | Photo-count approximation |
| Low surviving base | 3.2 | Photo estimate |

Origin: [12.474697952631582,41.8695270631579]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw -134.98584868139775 degrees is baked from the controls [[12.47443,41.8697265],[12.4745316,41.8697807]]; the host must not rotate again. Footprint ownership: 26840361. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Open present-day steel frame only, not an intact industrial gas tank. Original triangulated X bracing and lattice ring rhythm are retained in both LODs; far drops fine band web members but keeps all primary bays. Main frame rim follows mapped 89.1 m. The access platform appears above the rim in both exterior references; adopted overall 93.1 m includes an explicitly estimated 4 m projection and is not silently presented as a published height. Column sections, bracing counts and internal access geometry are photo estimates. No industrial plant, nearby smaller gas holders, paving, graffiti, signage or texture is included. Bounded OSM API map recovery follows failed serialized dossier Overpass attempts; geographic coordinates are original OSM data.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 11872 | 5 | 186652 |
| far | 5976 | 4 | 97940 |

Metrics: `tmp/batch/gasometro-rome/metrics.json`, no flags. Contact sheet: `tmp/batch/final/gasometro-rome.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/gasometro-rome/gasometro-rome-procedural-near-light-top.png`. One visual correction widened the supported upper access platform to match the reference. Near/far keep all twenty stanchions, five X-braced tiers and open cylindrical void. Every primary brace/ring node and gantry guard end is tested against its named column; near Warren web ends are tested against the separate ring mesh, with free-end negative controls. Footings meet local grade. Mapped outline and baked azimuth align in the red-ring plan; no depth cycles or QA flags remain. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

## Independent-review follow-up

Far lightening only: reduced annular foundation tessellation from 40 to 24 segments and grouped internal access landings at 8.5m instead of 6.8m. The open cylinder, all 20 columns, five X-braced tiers, main/double ring rhythm, top gantry and bearing contacts remain. Near geometry is unchanged.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/gasometro-rome.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.
