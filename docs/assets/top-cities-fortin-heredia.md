# El Fortín — Heredia

Heredia’s small Fortín: curved-cornice square stone base, cylindrical brick loophole drum and octagonal clover-window crown with the modern open roof guard.

## Sources and rights

- [Article: identity and architectural context](https://es.wikipedia.org/wiki/Fortín_de_Heredia)
- [OSM way/194486604](https://www.openstreetmap.org/way/194486604)
- [ICT:13m tower, square stone base, four alternating drum loophole rows and octagonal clover crown](https://www.ict.go.cr/es/root-documentos-no-apagar/brochures-1/brochures-para-el-turista/caminatas/2368-caminata-por-heredia-1/file.html)
- [Municipality historical book:13.24m alternative](https://www.heredia.go.cr/sites/default/files/libro_historia_del_canton_de_heredia.pdf)
- [National heritage guide:current tower with blue roof guard](https://www.patrimonio.go.cr/biblioteca_digital/publicaciones/2011/circuito_heredia.pdf)
- [File:Fortin de Heredia.jpg — Rquesada; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Fortin_de_Heredia.jpg)
- [File:Fortín de Heredia.jpg — Victor Quirós A; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Fort%C3%ADn_de_Heredia.jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Masonry height |13 | ICT heritage brochure; municipality history13.24 differs by24cm |
| Square base / cylindrical drum /octagon |6 /5 /2 | Heritage description |
| Base width / drum diameter |8.8 /6.8 | Photo estimate, not mapped building outline |
| Modern rooftop guard |.9 | Photo estimate;13.9m model total |

Origin: [-84.117084,9.999245]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw 177.29088754630888 degrees is baked from the controls [[-84.1171035,9.9992093],[-84.1171003,9.9992759]]; the host must not rotate again. Footprint ownership: 194486604. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Mapped alignment is the north–south western boundary of Parque El Fortín, OSMway194486604; this is NOT claimed as the tower footprint. A bounded authored8.8m square is placed at the published tower coordinate and aligned to those two real park control points. A nearby round OSMbuilding463534763 is the amphitheatre, and survey point13853504346 lies near it; neither is misidentified as this tower. Absolute placement is approximate within a few metres and must be checked in the later app pass. The13m heritage masonry height and13.24m municipal figure are both documented, with13m adopted as an estimate. The modern roof guard is modeled separately above that datum. Four alternating loophole rows, flared pale embrasures and octagonal clover openings remain geometric. Historic photos without modern roof guard are excluded from current-state comparison; surface weathering is represented only by muted colours, not texture or excessive bricks. No busts, flags, letters, garden or unrelated park structures are included.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 4586 | 5 | 113872 |
| far | 3160 | 5 | 81388 |

Metrics: `tmp/batch/fortin-heredia/metrics.json`, no flags. Contact sheet: `tmp/batch/final/fortin-heredia.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/fortin-heredia/fortin-heredia-procedural-near-light-top.png`. One visual refinement rounded the loopholes, closed the masonry shoulders beneath the curved cornice and aligned the octagonal rooftop floor to its walls. Current-state exterior references7and2 confirm the modern roof guard; earlier unguarded versions are excluded. The mapped park alignment and bounded estimated tower footprint are distinguished explicitly, with absolute app placement still untested. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

## Independent-review follow-up

Replaced the eight diamond-like crown cutouts with actual four-semicircle quatrefoils: 0.84m outer flared reveals, 0.80m clear apertures, 0.20-0.21m lobe radii, six arc segments per lobe near and four far. New rays check all four open lobe tips, concave masonry waists, opening envelopes and the supported modern guard in both LODs. Masonry remains 13m high; costs are 4586 near / 3160 far triangles after slight lower-loophole and cornice tessellation savings.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/fortin-heredia.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.
