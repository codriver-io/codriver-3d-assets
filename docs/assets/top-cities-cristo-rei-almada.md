# Cristo Rei — Almada

Original procedural exterior of Cristo Rei in Almada: four tapering concrete pylons with enormous rounded arch voids, the elevated platform, and a full robed Christ figure with outstretched 28 m arms, articulated hands, joined head/neck and broad draped sleeves.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Sanctuary_of_Christ_the_King)
- [OSM way/87891338](https://www.openstreetmap.org/way/87891338)
- [Sanctuary official exterior — full dimensions, 82 + 28 m, 25 m base and 28 m finger span](https://cristorei.pt/o-santuario/o-monumento/exterior/)
- [Almada municipality — four tapering pylons and robed statue](https://www.cm-almada.pt/monumento-ao-cristo-rei)
- [Portugal national tourism — 110 m overall](https://www.visitportugal.com/en/node/135199)
- [File:Cristo Rei (Almada) 59.jpg — Kent Wang; CC BY 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Cristo_Rei_(Almada)_59.jpg)
- [File:Statue of Sacred Heart of Jesus Christ, Almada, Portugal, 20250604 1926 9508.jpg — Jakub Hałun; CC BY 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Statue_of_Sacred_Heart_of_Jesus_Christ,_Almada,_Portugal,_20250604_1926_9508.jpg)
- [File:Statue of Sacred Heart of Jesus Christ, Almada, Portugal, 20250604 1923 9481.jpg — Jakub Hałun; CC BY 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Statue_of_Sacred_Heart_of_Jesus_Christ,_Almada,_Portugal,_20250604_1923_9481.jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Overall height | 110 | Official sanctuary: 82 m pedestal + 28 m image |
| Pedestal | 82 | Official sanctuary |
| Statue / fingertip span | 28 / 28 | Official sanctuary |
| Head height | 4.05 | Official sanctuary |
| Sleeve height | about 5 | Official sanctuary |
| Square base | 25 | Official sanctuary and mapped footprint |
| Open arch / taper stages | See generator | Photo estimates |

Origin: [-9.171337325,38.6786030375]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw 180.72305188915064 degrees is baked from the controls [[-9.1714813,38.6787119],[-9.1713392,38.6787133]]; the host must not rotate again. Footprint ownership: 87891338. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Current monument exterior, with open arches in both LODs. Primary sanctuary dimensions override the stale OSM height=103; overall 110 m follows the operator, with the discrepancy documented. Four pylons taper uniformly to the upper platform; the statue remains rigid and retains feet, a flowing robe, wide sleeves, wrists/hands and a contacting neck/head. Minor facial detail, sculptural panel reliefs, small evangelist sculptures at grade, interior chapel, grounds, inscriptions, branding and the hill are omitted. Statue front follows the north-facing principal pedestal axis toward Lisbon; mapped near east-west controls fix the square base yaw, with 180 degrees selecting that face. The base ring is mapped; a narrow supplemental arm-overhang ring is authored from the published 28 m fingertip span and claims no additional OSM way. No terrain or river elevation is baked.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 1540 | 3 | 30164 |
| far | 940 | 3 | 22248 |

Metrics: `tmp/batch/cristo-rei-almada/metrics.json`, no flags. Contact sheet: `tmp/batch/final/cristo-rei-almada.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/cristo-rei-almada/cristo-rei-almada-procedural-near-light-top.png`. The official 82+28 m proportions and 28 m fingertip span pass geometry tests in both LODs. Modern exterior photos 4, 7 and 8 establish the current structure; bridge, shrine-panel and chapel-interior images were rejected. Two review adjustments improved full-height framing and the joined head profile; minor facial/heart carving is omitted. Close statue GLB view: tmp/landmarks/shots/cristo-rei-almada/cristo-rei-almada-glb-near-light-statue.png. Four open arches, robe, broad sleeves and supported hands remain in far; zero QA flags or depth cycles. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.
