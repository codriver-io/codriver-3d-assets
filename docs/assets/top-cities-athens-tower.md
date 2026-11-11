# Athens Tower — Athens

Athens Tower’s unequal103m and65m office blocks: six strong pale vertical bays on the tall slab, a bent lower tower, dark recessed curtain walls, three-storey base and the mapped first-floor link.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Athens_Towers)
- [OSM way/1430053643](https://www.openstreetmap.org/way/1430053643)
- [OSM way/132795202](https://www.openstreetmap.org/way/132795202)
- [Original architect Vikelas:unequal towers,zigzag low block,three-storey base and first-floor link](https://vikelas.gr/work/tower-of-athens)
- [CVU/CTBUH:main103m architectural height and28floors; antennas excluded from this measure](https://www.skyscrapercenter.com/building/athens-tower-1/5033)
- [CVU/CTBUH:lower tower65m](https://www.skyscrapercenter.com/building/athens-tower-2/5161)
- [Official Athens visitor guide:modern architecture and the unequal glass/metal pair](https://www.thisisathens.org/arts-entertainment/urban-culture/modern-architecture-timeline)
- [File:Athina Lykavittos Athens Tower.jpg — Andrzej Otrębski; CC-BY-SA-3.0; comparison only](https://en.wikipedia.org/wiki/File:Athina_Lykavittos_Athens_Tower.jpg)
- [File:Athens Tower as seen from street level.jpg — Dimitris Kamaras; CC-BY-2.0; comparison only](https://en.wikipedia.org/wiki/File:Athens_Tower_as_seen_from_street_level.jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Main /lower architectural roof |103 /65 | CVU/CTBUH measured-building database |
| Main /lower floors |28 /15 | CVU; counting of mezzanine/base levels differs in published descriptions |
| Three-storey podium top |11.8 | Architect identifies3storeys; exterior estimate |
| Main upper slab plan |20.4×42.9 | Inferred inside mapped L-shaped podium, exterior calibrated |
| Main rooftop technical tip |112 |9m above roof, photo estimate; not the architectural building height |
| Mapped first-floor connector |10.7span×2.43width | Matching OSM endpoint/control nodes on both podiums |

Origin: [23.76071,37.9845]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw 25.352511945044316 degrees is baked from the controls [[23.7605159,37.9848027],[23.7607261,37.9848812]]; the host must not rotate again. Footprint ownership: 1430053643, 132795202. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Architect Ioannis Vikelas explicitly describes two unequal towers, a zig-zag lower volume, three-storey base and first-floor communication. The source photos confirm six major bays on the main long face, continuous pale perimeter piers and fine vertical metal mullions around blue-grey glazing. Main103m and lower65m architectural heights follow CVU; a Wikipedia claim of under100m without antennas is not adopted, since CVU explicitly excludes technical antennas from architectural height. Visible rooftop radio equipment is separately estimated up to112m. Upper main footprint is inferred from the mapped podium recesses; the lower tower keeps its mapped bent outline rather than becoming a rectangular slab. Floor counts may vary with mezzanine treatment; facade rhythm is calibrated to the exterior and grouped at far. The two ground pads stay separate, with an elevated enclosed first-floor link at the mapped2.43m corridor. No plaza paving, flags, signage, bank marks or rooftop lettering are included.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 7386 | 6 | 134792 |
| far | 4888 | 6 | 96860 |

Metrics: `tmp/batch/athens-tower/metrics.json`, no flags. Contact sheet: `tmp/batch/final/athens-tower.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/athens-tower/athens-tower-procedural-near-light-top.png`. One reference-led refinement enlarged the three-storey base glazing and cut both mapped first-floor access doorways so the elevated link remains open into the two bases. Both architectural roof heights, all six long-face bays, zigzag lower plan, native floor bearings excluding the link, aluminum mullion feet/heads and every mast brace/leg contact pass; final light contact sheet, red-ring plan and exported full-twins view inspected. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.
