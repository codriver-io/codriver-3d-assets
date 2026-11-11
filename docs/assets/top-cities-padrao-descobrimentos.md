# Padrão dos Descobrimentos — Lisbon

Original procedural exterior of the Padrão dos Descobrimentos: a 52 m central sail/mast with two curved flanking sail fins, a rising pointed caravel hull, two processions of sixteen robed human figures, and a larger leading Henry holding a miniature caravel.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Padrão_dos_Descobrimentos)
- [OSM way/152327819](https://www.openstreetmap.org/way/152327819)
- [OSM way/259346570](https://www.openstreetmap.org/way/259346570)
- [Monument operator — identity and permanent monument](https://padraodosdescobrimentos.pt/en/monument-to-the-discoveries/)
- [Portugal national tourism — 52 m, Henry and 32 followers](https://www.visitportugal.com/en/node/136340)
- [Lisbon municipality — two ramps with 32 monumental figures](https://www.lisboa.pt/pontos-de-interesse/detalhe/padrao-dos-descobrimentos)
- [File:56 Meter hoch ist das Denkmal der Entdeckungen in Lissabon. 03.jpg — Holger Uwe Schmitt; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:56_Meter_hoch_ist_das_Denkmal_der_Entdeckungen_in_Lissabon._03.jpg)
- [File:Padrão Descobrimentos April 2009-3c.jpg — Alvesgaspar; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Padr%C3%A3o_Descobrimentos_April_2009-3c.jpg)
- [File:Pedro Nunes April 2009-1a.jpg — Alvesgaspar; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Pedro_Nunes_April_2009-1a.jpg)
- [File:Padrão Descobrimentos May 2010-2.jpg — Alvesgaspar; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Padr%C3%A3o_Descobrimentos_May_2010-2.jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres/count | Basis |
| --- | ---: | --- |
| Highest terrace | 52 | OSM viewpoint part and Portugal national tourism |
| Site envelope | about 22 × 46 | Mapped main outline |
| High central fin | about 3.5 × 20 plan | Mapped lookout outline |
| Procession | 32 people + leading Henry | Operator/city and Portugal national tourism |
| Figures | about 5–9 | Photo estimates; simplified carved groups |
| Sail curves, hull ramp and minor relief | See generator | Photo estimates |

Origin: [-9.2057,38.6936]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw 13.858545894551341 degrees is baked from the controls [[-9.2056475,38.6935207],[-9.2057031,38.6936966]]; the host must not rotate again. Footprint ownership: 152327819, 259346570. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Permanent 1960 monument, not the temporary 1940 exhibition construction. The upper 52 m mast footprint and river-facing bearing are mapped. Two lower curved fins and rising hull profile are original map-scale approximations from exterior photos. Both sixteen-person flanks, distinct robed bodies, neck/head contacts and the leading Henry with a small caravel remain in both LODs. Fine facial likeness, heraldic shield/inscriptions, pavement wind rose/map mosaic, river surface and interiors are omitted. Official 52 m is adopted; the 56 m in one photograph’s filename is not treated as a measurement. No imported sculpture mesh, photo tracing, image texture or lettering.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 19303 | 3 | 173836 |
| far | 5923 | 3 | 81712 |

Metrics: `tmp/batch/padrao-descobrimentos/metrics.json`, no flags. Contact sheet: `tmp/batch/final/padrao-descobrimentos.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/padrao-descobrimentos/padrao-descobrimentos-procedural-near-light-top.png`. One look-fix round broadened the carved cloaks, varied standing/kneeling heights and gestures, and retained books/armillary rings to avoid a uniform fence of figures. Both sixteen-person processions and the larger Henry with supported miniature caravel remain in far. All figure feet meet the continuously rising hull in geometry tests; the 52 m central fin follows the mapped upper outline. Reference photos 1/2 and carving details 3/4 were checked. Near/far material, winding and depth metrics are clean; figures intentionally use stylized low-poly likenesses. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

## Independent-review follow-up

Far sculpture now uses simpler closed limb sections, five-sided heads/cloaks and four-sided body/neck sections, while retaining all 33 distinct planted figures, their procession poses, the sail edges, hull and Henry miniature caravel. Near source geometry is unchanged. Opposite near/far tiles retain both complete processions rather than an opaque substitute slab.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/padrao-descobrimentos.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.
