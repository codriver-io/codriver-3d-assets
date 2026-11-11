# Aviva Stadium — Dublin

Aviva Stadium: asymmetric wavy polycarbonate/glass bowl, dramatically low north end, raised east/west roof, open field aperture, green seating and a horseshoe truss on two north supports.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/Aviva_Stadium)
- [Populous: asymmetric rising/falling form and two-column horseshoe truss](https://populous.com/showcases/aviva-stadium)
- [Sisk:50 m exterior, curved horseshoe truss and cladding](https://sisk.com/what-we-do/projects/aviva-stadium-dublin)
- [Irish Rugby:47.65 m above pitch](https://www.irishrugby.ie/2010/05/14/aviva-stadium-a-numbers-game)
- [OSM building multipolygon3357396, distinct from larger stadium site](https://www.openstreetmap.org/relation/3357396)
- [OSM provider footprint / building part 249663148](https://www.openstreetmap.org/way/249663148)
- [OSM provider footprint / building part 249663147](https://www.openstreetmap.org/way/249663147)
- [OSM provider footprint / building part 228122478](https://www.openstreetmap.org/way/228122478)
- [File:Dublin aviva stadium.jpg — Arne Müseler; CC BY-SA 3.0 de; comparison only](https://commons.wikimedia.org/wiki/File:Dublin_aviva_stadium.jpg)
- [File:Aviva Stadium and Dublin City at Dusk.jpg — David Kernan; CC BY 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Aviva_Stadium_and_Dublin_City_at_Dusk.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/aviva-stadium/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-6.2320609,53.3329542,-6.2245391,53.3374458.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Maximum roof | approximately50 m | Contractor exterior height; IRFU47.65 m above pitch is a different datum |
| Low north / south crown | approximately12 /35 m | Photo-calibrated asymmetric envelope |
| Roof/aperture plans | Exact OSM relation rings | Outer249663148 and inner249663147 |
| Horseshoe structure | 2 north support columns | Architect; section sizes estimated |
| Football field | 68 ×105 m | Texture-free field configuration; mapped grass pitch includes larger runoff |

Origin `[-6.228267125,53.335193425]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Mapped pitch left edge [-6.2291336,53.3356603] to [-6.2286077,53.3345268] and right edge [-6.2279266,53.33586] to [-6.2274006,53.3347266] determine the baked north-northwest axis, about15.45 degrees west of north. The origin is the pitch-corner average. Roof and aperture use the actual building multipolygon rather than the larger leisure/site boundary128521419.

## Model and foundation

The complete curved shell rolls from a low recessed foundation through the shingled facade into the broad roof, keeping the strong north dip and unequal end heights. Glazing, shingle panels and fine frame divisions share edges. An original horseshoe truss under the roof opening terminates on two explicitly grounded north columns; every chord/web/column contact is pinned in both LODs with detached negative controls. Green stepped seats follow the lower north stand, with a68×105 m football field and adjacent runoff at y0.16 m, no layered paint. Far keeps the curve, dip, aperture, truss and green bowl. Site buildings, railway, plaza, logos, seat lettering and neighbouring roofs are excluded.

The50 m exterior envelope follows Sisk, while Irish Rugby’s47.65 m is measured above pitch; these figures are not treated as the same surveyed datum. Detailed height distribution, skin roll, louvre/grid spacing, steel sections, support positions and seat rows are photo-calibrated estimates. Exact mapped outer/inner plans and pitch control edges establish geographic scale and orientation. Photos1 and7 show the completed stadium; construction photos3 and8–10 and interior event photos are rejected as primary exterior references.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 38700 | 8 | 565592 |
| far | 5976 | 8 | 111780 |

Deterministic QA: `tmp/batch/aviva-stadium-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/aviva-stadium.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/aviva-stadium/aviva-stadium-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/aviva-stadium/aviva-stadium-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Self-review: two looks. The final shingle/grid divisions have more contrast against the muted cladding, while the continuous rolled shell, pronounced north dip and asymmetrical roof levels are retained. The physical roof underside closes the shell above the horseshoe truss; every named steel end meets a separate support, the two column footings touch y0, and the field is open through the full aperture in both LODs.

Independent-review revision: Far envelope retains 72 angular sectors for separated translucent bays, with eight skin bands and three seating tiers. Hidden truss end caps and roof-soffit subdivisions are removed; the low north end, full horseshoe truss, open pitch and support contacts remain. Near GLB is byte-identical.

Far cost: 9216 → 5976 triangles; near GLB byte-identical. Fresh exported contact sheet: `tmp/batch/revision/sheets/aviva-stadium.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.
