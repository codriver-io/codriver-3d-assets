# Tbilisi TV Tower — Tbilisi

Current Tbilisi TV tower: white tubular core, two splayed red lattice legs, open triangular bracing, a lower maintenance platform, upper flared equipment pod and striped mast with the 2017 tip addition.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Tbilisi_TV_Broadcasting_Tower)
- [Mapped way/437940450; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/437940450)
- [Mapped way/437940448; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/437940448)
- [Mapped way/437940449; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/437940449)
- [Mapped way/1021675581; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/1021675581)
- [Mapped way/1218304162; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/1218304162)
- [Mapped way/1218304159; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/1218304159)
- [Mapped way/1218304163; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/1218304163)
- [Mapped way/1218304164; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/1218304164)
- [Current TV tower operator exterior, uploaded 2023 | Georgian TV and Radio Center publisher; photographer not credited | All rights reserved; no reuse license stated; comparison only](https://tvrcenter.ge/wp-content/uploads/2023/01/c60b3d62627d02b9e2ddf7ae868a5ff2.jpg)
- [Georgian National Tourism Administration current TV tower exterior 2 | GNTA publisher; photographer not identified | All rights reserved; no reuse license stated; comparison only](https://storage.georgia.travel/images/tbilisi-tv-tower-tbilisis-satelevizio-andza-2.webp)
- [File:Teleandza.Tbilisi.jpg | Ninuc10 | CC BY 4.0](https://commons.wikimedia.org/wiki/File:Teleandza.Tbilisi.jpg)
- [Tower operator: 1974 commissioning, 274.5 m plus 2017 3.5 m addition](https://tvrcenter.ge/isotiria-thbilisis-satelevizio-koshki/)
- [Official Georgia Travel: modern tower, 2017 antenna, red-white markings](https://georgia.travel/tbilisi-television-tower-tv-tower)
- [Lighting designer: programmable tower lighting (night colours vary)](https://www.griven.com/en/essentials/projects/tbilisi-tv-tower)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/tbilisi-tv-tower/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Current height | 278 | Operator: former 274.5 m plus 3.5 m added in 2017 |
| Upper equipment pod | 137–155 | Mapped part 1021675581; estimates pending survey |
| Lower maintenance level | 70 | Mapped structural parts |
| Main feet and shaft anchor | Mapped control points in generator | OSM component geometry |
| Pipe diameters, bracing rhythm, platform thickness | See generator | Photo estimates |

Operator states the current structure opened in November 1974, following construction begun in 1972, and grew from 274.5 to 278 m on 2017-06-03. OSM and many secondary pages retain 274.5 m; the modern antenna addition is included. Pod and maintenance levels follow mapped component tags; pipe sizes, bracing layout and roof details are visual estimates. Three rigid footings share local y=0; hillside placement and footing offsets require later app validation, with no 719.2 m site elevation baked into the asset. Night uses a neutral floodlit frame; the real installation changes colours by program.

## Frame and ownership

Origin `[44.7849547, 41.695816050000005]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[44.7849193, 41.695942], [44.7846702, 41.6960999]]`; rotationY `2.437722297978543` radians. Exact provider ways: `[437940448, 437940449, 437940450, 1021675581, 1021675582, 1218304159, 1218304160, 1218304161, 1218304162, 1218304163, 1218304164]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. Owns the mapped tower and its two low service blocks. Two 1.3-metre authored footing rings are added around the mapped leg endpoint controls to cover the foundation contacts. Adjacent park buildings and roads are excluded.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

Two inclined tubular legs converge beneath the upper pod and are connected to the white core by open triangular rings and diagonal braces. Every brace and leg has a named support contact test excluding that member, plus a shortened-end negative control. The 70 m maintenance platform, 137–155 m flared pod, ground service roofs and modern striped mast survive far; far drops alternate secondary diagonals. Official operator/GNTA photos are comparison-only under their reserved rights; the dated Commons exterior is January 2025. Unrelated Sioni imagery, postage art and views from the tower were rejected. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 2912 | 7 | 45088 |
| far | 1644 | 7 | 32420 |

Deterministic QA: no flags (`tmp/central-east/tbilisi-tv-tower/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/tbilisi-tv-tower.jpg`; source top over red OSM rings: `tmp/central-east/shots/tbilisi-tv-tower/`. Open splayed legs, lower platform, upper pod, striped mast, support contacts and operator blocks were inspected against the current official/2025 photos. One palette adjustment brightened the night frame to a neutral floodlit program. The automatic top view had tall-mast parallax; a second roof view directly above the shaft fixes that camera artifact and confirms mapped foot controls. No open visual defect observed.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.
