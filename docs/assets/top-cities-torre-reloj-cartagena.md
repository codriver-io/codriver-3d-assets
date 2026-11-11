# Torre del Reloj — Cartagena

Cartagena’s Puerta del Reloj: three true barrel-vault gate passages, exposed stone outer portal and ochre inner wall, four-face clock stage, louvered octagonal lantern and long slender pale-edged spire.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Puerta_del_Reloj)
- [OSM way/955128419](https://www.openstreetmap.org/way/955128419)
- [Cartagena municipality: gateway over30m and permanent new lighting](https://cartagena.gov.co/noticias/torre-reloj-plazas-paz-coches-aduana-estrenan-sistema-iluminacion)
- [Municipality2026: clock mechanism maintenance and preservation of this city icon](https://www.cartagena.gov.co/noticias/inician-obras-mantenimiento-anual-maquinaria-reloj-torre-reloj-cartagena)
- [Municipality/ETCAR: maintenance of Boca del Puente gateway below clock](https://www.cartagena.gov.co/noticias/fortificaciones-cartagena-el-corregimiento-bocachica-reciben-mantenimiento-escuela-taller-cartagena-indias)
- [File:Puerta del Reloj, Cartagena 02.jpg — Bernard Gagnon; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Puerta_del_Reloj,_Cartagena_02.jpg)
- [File:024 Torre del Reloj Cartagena Colombia.JPG — David Shankbone; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:024_Torre_del_Reloj_Cartagena_Colombia.JPG)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Mapped gate envelope |54.1×15.6 | OSM955128419 |
| Wall top /outer ornamental portal |6.6 /12.3 | Exterior photo estimate |
| Clock /lantern top |19.1 /23.5 | Photo-calibrated estimate |
| Spire/finial top |29.7 /31.5 | Municipality says over30m; adopted approximate total |
| Three arch widths |4.4 /5.3 /4.4 | Photo estimate |
| Clock diameter |2.25 | Photo estimate |

Origin: [-75.54921895,10.4230397]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw 54.9757406252979 degrees is baked from the controls [[-75.5494189,10.422881],[-75.5491355,10.4232787]]; the host must not rotate again. Footprint ownership: 955128419. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Photo1 faces the exposed-stone outer gateway, whereas photo2 shows the ochre-plastered inner face: these are two sides of the SAME current building, not alternative paint schemes. The OSM gate rectangle fixes length, depth and geographic bearing. Three arches are cut all the way through the15.6m-deep gate, retaining real barrel vaults and solid separating piers. The stone Baroque outer pediment and simpler yellow rear pediment are original simplified geometry. The octagonal clock body, pointed white shutters, lantern crown triangles and thin spire remain in both LODs. All vertical dimensions are estimates; the municipality reports only over30m rather than a survey, so31.5m is adopted with that uncertainty. No neighboring yellow houses, plaza statue, paving, signs, clock numerals or compass letters are included. Clock dials have abstract ticks/hands without lettering. No source photo textures are shipped.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 6384 | 6 | 95372 |
| far | 3768 | 6 | 63996 |

Metrics: `tmp/batch/torre-reloj-cartagena/metrics.json`, no flags. Contact sheet: `tmp/batch/final/torre-reloj-cartagena.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/torre-reloj-cartagena/torre-reloj-cartagena-procedural-near-light-top.png`. One reference-led refinement made the clock base span the mapped gate depth and added the white rear chevron as integral adjacent colour regions. All three barrel passages, four real dials, pointed shutters, slender pale-edged spire and supported finial survive far. Every shutter end is checked against the masonry reveal and a shortened slat misses it; stone outer/ochre inner faces and a complete exported exterior view were inspected. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

## Independent-review follow-up

Added a shallow supported moulding following the actual central curved stone pediment contour, strengthening its reading below the clock without changing the three full-depth tunnels, four clock faces, shutters or slender spire. Near and far both gain the contour relief; no lettering or broad facade plane was added.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/torre-reloj-cartagena.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.
