# Iglesia de La Merced — San José

Neo-Gothic La Merced church with its distinctive single cream tower, three pointed-arch tiers, clock gable and long muted red spire, above a mapped cruciform nave.

## Sources and rights

- [Article: identity and architectural context](https://es.wikipedia.org/wiki/Iglesia_de_Nuestra_Señora_de_La_Merced_(San_José))
- [OSM way/264040525](https://www.openstreetmap.org/way/264040525)
- [Costa Rica Tourism Board: neogothic tower, pointed windows,15m central and9m side naves](https://www.ict.go.cr/es/root-documentos-no-apagar/brochures-1/brochures-para-el-turista/caminatas/2365-caminata-san-jos%C3%A9/file.html)
- [Tourism research compilation:27m tower, endpoint unspecified](https://www.pasosonline.org/Publicados/pasosoedita/TurEspiritual2.pdf)
- [File:Iglesia de la Merced, San José, Costa Rica.jpg — Rodtico21; CC BY-SA 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Iglesia_de_la_Merced,_San_Jos%C3%A9,_Costa_Rica.jpg)
- [File:Iglesia la Merced, San José, Costa Rica.jpg — Pequeño mar; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Iglesia_la_Merced,_San_Jos%C3%A9,_Costa_Rica.jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Mapped cruciform plan | 39.7 cross width ×63.9 length | OSM264040525 |
| Central nave ridge / side aisle roof | 15 /9 | ICT tourism brochure gives nave heights; adopted approximate exterior ridges |
| Tower masonry / clock gable |25 /29 | Photo-calibrated estimate; published27m tower figure may use a different endpoint |
| Spire and cross total |41.8 | Photo-calibrated estimate, not surveyed |
| Mapped projecting tower width |5.6 | OSM front projection |

Origin: [-84.08374645,9.93334275]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw -99.1513269366857 degrees is baked from the controls [[-84.0840043,9.9334554],[-84.084027,9.9333166]]; the host must not rotate again. Footprint ownership: 264040525. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

The distant park exterior sets the tower proportions, while the close modern front photo identifies paired lower pointed lights, single upper open belfry, clock gable and red tiled spire. Overall41.8m is an estimate because no reliable surveyed total including the spire was found; a tourism research compilation calls the tower27m, plausibly the masonry/clock region but the datum is unconfirmed. Both LODs preserve the pointed openings, clock hands, corner pinnacles and full long spire. Nave and transept roof planes follow the mapped cross; unseen rear details are simplified. Small Gothic crockets are reduced at far. No stained-glass artwork, lettering or church marks are copied.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 5717 | 6 | 107444 |
| far | 3219 | 6 | 68200 |

Metrics: `tmp/batch/iglesia-merced-san-jose/metrics.json`, no flags. Contact sheet: `tmp/batch/final/iglesia-merced-san-jose.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/iglesia-merced-san-jose/iglesia-merced-san-jose-procedural-near-light-top.png`. Pointed paired/single bell tiers, clock gable and full long spire are retained in both LODs. Named spire-to-cross bearing and a shortened-member negative control pass; supplemental exported facade framing includes the complete cross and tower. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.
