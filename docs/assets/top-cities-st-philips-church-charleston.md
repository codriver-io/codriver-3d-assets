# St. Philip’s Church, Charleston

Original procedural permanent exterior at Church Street: tan stucco nave, three Tuscan porticoes and Edward Brickell White’s octagonal steeple. The [parish booklet](https://cpmfiles1.com/stphilipschurchsc.org/2022-churchhistory-booklet-2.pdf) dates the completed present building to 1838; the [NPS nomination](https://npgallery.nps.gov/NRHP/GetAsset/NHLS/73001695_text) dates construction of the body to 1835–36 and spire to 1848–50. The model represents the present restored exterior, excluding temporary equipment.

## Sources and dimensions

| Feature | Model metres | Basis |
| --- | ---: | --- |
| Overall mapped outline | 49.7 long, 27.1 across side porticoes | Sourced from OSM way 173699967 |
| Nave/vestibule width | 20.8 | Sourced mapped width, regularized |
| Highest point | 56 | Estimated: unsurveyed OSM part 1434394841 height tag, calibrated stage ratios from photo; no published surveyed total found |
| Nave eave / ridge | 12.4 / 17.5 | Estimated; mapped main height 16 m and roof tags differ |
| Square tower / first tapered octagon | 22.55 / 26.5 | Estimated from photo; square part tagged 22 m |
| Louvre / clock / open belfry cornices | 33.85 / 39.9 / 45.65 | Estimated photographic proportions |
| Long needle and vane | 45.65–56 | Estimated, brown eight-sided spire |
| Porticoes | Four columns each; 10.6 m capitals | Sourced count (NPS tetrastyle); dimensions estimated |

Reference-only photos: [west elevation](https://commons.wikimedia.org/wiki/File:St-philips-episcopal-charleston-sc1.jpg) and [clock detail](https://commons.wikimedia.org/wiki/File:St-philips-episcopal-charleston-sc2.jpg), Brian Stansberry, **CC BY 3.0**, both file-page licences and descriptions checked. First photo downloaded locally; second download was rate limited. Both depict this Charleston church; the square oculus base, tan octagons and dark long spire distinguish it from St. Michael’s. No photo pixels, logos, lettering or third-party geometry ship.

## Frame, ownership and foundation

Origin `[-79.929218,32.779012]`; local metres +X east, +Y up, +Z south, pavement y=0. The authoring nave follows +X east toward the apse. +2.86° yaw is baked once; frontage is 267.14° west into Church Street. South-wall controls `[-79.9293074,32.7789186]` and `[-79.9289914,32.778932]` establish the bearing. Host placement must not repeat the rotation or distort the rigid body over terrain.

OSM 0.6 map API extract, 2026-11-09: church 173699967, square tower 1389398214, steeple 1434394841, portico/roof parts 1434394842–1434394845. All exact rings and ids retained in footprint.js. Geographic data © OpenStreetMap contributors, ODbL 1.0. Churchyard, parish house, parking, streets and adjacent offices remain outside ownership. A bounded church-ring median foundation with 2 m feather is handoff metadata; no terrain elevation, sea-level datum or Mercator scale is baked into exports.

## Model and omissions

One high tier of six individual arched nave windows per flank, semicircular east apse, west porch projecting into the street, opposed north/south porticoes, square tower with four oculi, tapered lower transition, louvred octagon, four clock dials, genuinely open upper belfry, and long weathered brown needle. Far retains the complete portico/steeple silhouette and all negative space; it drops louvre blades and reduces arc/column samples. Clock dials partition the dark surface into gold tick/hand shapes rather than layering faces. Five merged materials, muted buff stone and grey-brown roof.

Rear fenestration, apse roof, cornices and capital profiles are estimates. Fine stone joints, roof ornament/oculi, exact gilded vane, interior, cemetery, gates, lettering and neighbouring buildings are omitted. No close-range conservation fidelity is claimed. Rebuild through `node scripts/build-top-cities-landmarks.mjs st-philips-church-charleston`, using the shared quantized meshopt exporter.

Cityscape: **not tested**. Full 3D world: **not tested**. Standalone viewer checks establish asset appearance only.

## Export costs and evidence

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 9484 | 5 | 127520 |
| far | 4791 | 5 | 71956 |

Final metrics `tmp/charleston-3/philip-metrics.json`: no flags, zero back-face hits and layered/coplanar area, no below-grade or unsupported members. Two visual rounds inspected, with final exported sheet `tmp/charleston-3/sheets/final/st-philips-church-charleston.jpg`; padded framing retains the whole tower and ground in overview tiles. Final fix sharpens the pediment normals and partitions the roof/vestibule joint. The three porticoes, high single window tier, oculi, open belfry and long needle remain in both LODs. Independent coordinator review pending.

