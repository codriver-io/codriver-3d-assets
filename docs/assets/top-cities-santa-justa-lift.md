# Santa Justa Lift — Lisbon

Original procedural exterior of the Santa Justa Lift: slender six-tier Neo-Gothic iron shaft, pointed lancet openings and bracing, projecting lower balcony, machinery house, open upper observation crown, and the mapped covered pedestrian bridge to its masonry terminal support.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Santa_Justa_Lift)
- [OSM way/115238861](https://www.openstreetmap.org/way/115238861)
- [OSM way/446066424](https://www.openstreetmap.org/way/446066424)
- [OSM way/75860318](https://www.openstreetmap.org/way/75860318)
- [Carris operator — Santa Justa Lift](https://www.carris.pt/en/travel/carreiras/54e-santa-justa-lift/)
- [Portugal heritage inventory — national monument](https://imovel.patrimoniocultural.gov.pt/detalhes.php?code=70141)
- [OSM covered pedestrian bridge alignment](https://www.openstreetmap.org/way/446066424)
- [File:Santa Justa Lift observation deck.jpg — Dicklyon; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Santa_Justa_Lift_observation_deck.jpg)
- [File:Elevador de Santa Justa from Rua de Santa Justa.jpg — Dicklyon; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Elevador_de_Santa_Justa_from_Rua_de_Santa_Justa.jpg)
- [File:At Praça de D. Pedro IV P1000848.JPG — deror_avi; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:At_Pra%C3%A7a_de_D._Pedro_IV_P1000848.JPG)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Upper guard/crown | about 45 | OSM and published tower height |
| Tower replacement plan | about 15 × 8.5 | OSM 115238861, including projected upper footprint |
| Covered footbridge | about 23 | Exact OSM 446066424 alignment |
| Pedestrian deck | 32.5 | Estimate from published lift travel and exterior proportions |
| Main exposed shaft | 32 | Photo estimate |
| Terminal wall/support | 3.2 × 5 plan, 35.8 high | Authored bounded estimate; foundation extended to the lowest local datum |

Origin: [-9.139375,38.712118]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw 16.350078473632795 degrees is baked from the controls [[-9.1394721,38.7121346],[-9.1393061,38.7121726]]; the host must not rotate again. Footprint ownership: 115238861, 446066424, 75860318. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Current iron exterior and complete covered bridge only. Neighbouring Carmo buildings, extended hilltop paths/stairs, flags, lettering, passengers, moving cabins and lift machinery are omitted. The masonry terminal follows the mapped bridge endpoint, with a conservative rigid buried foundation extended to local y=0 as prescribed for sloping sites; the real hillside should hide its lower wall in world mode, which is not tested. Only the tower base receives a flatten pad; no corridor or hillside flattening is requested. Main tower ring is OSM; narrow bridge projection and bounded terminal support footprints are authored from mapped alignment, not claims of additional building ways. Road layer is null: this is an elevator with a pedestrian connection, not a road bridge. Gothic opening sizes, deck/room levels, tracery and terminal details are photo estimates.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 6985 | 6 | 125480 |
| far | 4864 | 6 | 93668 |

Metrics: `tmp/batch/santa-justa-lift/metrics.json`, no flags. Contact sheet: `tmp/batch/final/santa-justa-lift.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/santa-justa-lift/santa-justa-lift-procedural-near-light-top.png`. Pointed iron shaft openings and covered bridge remain open in both LODs; mapped terminal bearing is an estimated rigid masonry foundation extending below the hillside, whose DEM burial still needs app verification. Material contacts have zero dropped depth edges. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.
