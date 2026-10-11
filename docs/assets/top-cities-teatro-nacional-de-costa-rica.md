# Teatro Nacional de Costa Rica — San José

Original procedural exterior of the historic national theatre at Calle 3 Manuel María Gutiérrez, by the Plaza de la Cultura. Stable ID: `teatro-nacional-de-costa-rica`. This is the surviving 1897 building, including its red metal roofs and rear stage house; the forecourt, perimeter fence, temporary contemporary entrance sculpture, vegetation, interiors and neighbouring Vargas Calvo theatre are excluded. Contract: [top-cities landmarks](../top-cities-landmarks.md).

## Sources and rights

Consulted 2026-10-05:

- [Official theatre, Antecedentes](https://www.teatronacional.go.cr/Seccion/101/antecedentes): inauguration in 1897 and construction in 1890–1897. The supplied English Wikipedia summary incorrectly makes the construction start and completion both 1897; this model does not rely on that start date.
- [National Theatre of Costa Rica](https://en.wikipedia.org/wiki/National_Theatre_of_Costa_Rica): identity, neoclassical exterior, opening on 21 October 1897. Architectural details were judged from photographs rather than derived from an interior capacity figure.
- [OpenStreetMap way 24857113](https://www.openstreetmap.org/way/24857113): `building=yes`, `building:levels=2`, the sole mapped envelope replaced by this model. Supplied `osm.json` was checked against a single query through `.agents/skills/build-3d-city/scripts/overpass.mjs`; saved at `tmp/top-cities/teatro-nacional-de-costa-rica/footprint-query.json`. No mapped height or roof-height tag is present. The other buildings in the dossier are excluded.
- [Costa Rica-Teatro Nacional.JPG](https://commons.wikimedia.org/wiki/File:Costa_Rica-Teatro_Nacional.JPG), Andres Alvarez, CC BY-SA 3.0: nine upper arches, central three dark openings, balcony, lower rustication, pediment and rooftop statues. Licence checked on the Commons file page.
- [Teatro Nacional at Night.JPG](https://commons.wikimedia.org/wiki/File:Teatro_Nacional_at_Night.JPG), Andreas C. Vogt, CC BY-SA 4.0: warm cornice/arch floodlighting and darker walls. Licence checked on the Commons file page.
- [Official TNCR elevated exterior](https://teatronacional.go.cr/Comunicados/detalle/119/teatro-nacional-de-costa-rica-estreno-sitio-web), attached image `34-6458_fronton_tncr2014.png`: red front hip, auditorium ridge, four long roof ventilators and the tall curved rear crown with three small round apertures. Photographer and reuse licence unspecified: retained only as reference in ignored scratch, never redistributed or embedded in the asset.

The source, model, relief and simplified figures are original procedural work. No scanned or traced mesh and no image texture is used. All references remain under ignored `tmp/top-cities/teatro-nacional-de-costa-rica/refs/`; the dossier's interior photograph was not used to author exterior geometry. Geographic data is independently credited to OpenStreetMap contributors under [ODbL 1.0](https://www.openstreetmap.org/copyright).

## Frame and dimensions

Metres, **+X east, +Y up, +Z south**, rigid local base at **y=0**. Origin `[-84.07697215, 9.93315805]` is the mapped diagonal midpoint (within millimetres of the outline centroid). Architectural u runs across the short west front, v toward the entrance. A **−96.3°** Y rotation is baked into the source vertices and GLBs; the host must not rotate again. The façade normal faces bearing **263.7°**. Control points: front north `[-84.0772856, 9.9333388]`, front south `[-84.0773181, 9.9330490]`; the eastward long edge is the south-front point to `[-84.0766587, 9.9329773]`. The mapped front is slightly west of true west, rather than an assumed cardinal grid.

| Feature | Metres | Evidence |
| --- | --- | --- |
| Mapped outer plan | 72.74 deep × 32.46 wide, about 2361 m² | OSM coordinates, not a survey |
| Authored walls | 70.8 deep × 31.2 wide | inset within OSM envelope; estimated wall thickness |
| Side/front wing cornice | 14.3 | photo estimate |
| Central frieze / pediment apex | 15.56 / 18.05 | photo estimate |
| Auditorium roof ridge | 19.0 | photo estimate |
| Rear stage crown | 26.0, near ribs to 26.105 | photo estimate, no published absolute height found |
| Central upper arches | 2.95 wide × 6.55 high | photo estimate |
| Wing upper arches | 1.82 wide × 5.98 high | photo estimate |
| Entrance recess | roughly 3 m, three 2.96 m doorways | estimated; actual geometry holes, not black painted rectangles |
| Balcony | 15.3 wide, to v=36.03 | photo estimate, remains within mapped envelope |
| Rooftop allegories | approximately 2.4–3.6 tall including plinth/wings | stylised photo estimate |

No altitude, DEM datum, Mercator stretch or terrain deformation is baked into the GLBs. `padM=41` covers the footprint's roughly 40 m half-diagonal. The central-city site appears approximately level in the references; no >2 m footprint relief was established. Full 3D world needs independent DEM/entrance sampling before its default pad can be approved.

## Authored features and LOD

`src/peregrine/landmarks/top-cities/teatro-nacional-de-costa-rica/` owns config, mapped footprint, views, generator, an independent small parts module and focused tests. Build:

```sh
pnpm build:top-cities-landmarks teatro-nacional-de-costa-rica --no-check
node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/teatro-nacional-de-costa-rica/teatro-nacional-de-costa-rica.test.js
node scripts/asset-catalog.mjs
```

Both LODs retain the three physically recessed entrance doors and their piers, three central upper arches and six flanking shutter arches, paired engaged columns, open balcony balustrade, two ground-level niche figures, triangular pediment and three supported allegories (central winged Fame), red front hip, long auditorium roof, raised stage barrel with oculi, four roof ventilators, side/rear windows and geographic orientation. Near adds fanlight spokes, shutter slats, cap volutes/leaves, ashlar divisions, roof seams/ribs, a wreath relief and original geometric **TEATRO NACIONAL** inscription. Far reduces curve segments, balusters and secondary windows, while retaining every major roof mass and entrance recess.

Eight merged material draws in either LOD: `stone` warm walls, `rustication` darker ground storey, `trim` pale carved stone, `roof` red metal (also reddish timber door infill), `iron` dark openings/door grids/inscription, `glass` muted shutters/glazing, `light` selected floodlit arches and capitals, `sculpture` pale statues. Light/dark palettes have the same keys. The night palette dims walls, shutters and roofs; the selected `light` geometry becomes warm and unshaded in the renderer. This approximates floodlit masonry, rather than lighting every shutter as an occupied room.

## Visual evidence and verification

Scratch evidence: `tmp/top-cities/shots/teatro-nacional-de-costa-rica/`. The first procedural near/light contact sheet was opened and compared to the supplied `refs-sheet.jpg` and official elevated photo `refs/4.png`. It showed the recognisable nine-arch façade and supported figures but excessive curve/secondary shutter detail. Arch topology was corrected so the inner ring does not touch its outer boundary, secondary shutter slats were removed, and subsequent QA found window/ashlar and sill overlaps. Window panes and trims were separated, shader-facing shutter slats changed to simple offset quads, and end rustication blocks were clipped to the mapped envelope after the strict containment test caught their small overshoot.

Final exported inspection: `exported-reference-contact-sheet.jpg` places the reference front, night and elevated views beside the exported GLBs. It includes near/light front, back, above, entrance, detail and top, near/dark front/back, far/light front/back/roof, and far/dark front/back/overview. The near/far, light/dark `*-sheet.jpg` files also remain beside the individual labelled PNGs. All were rendered through the repository `shot.mjs`, with red OSM ring overlay in plan and no model textures. These are local inspection tools, not staging pages.

The landmark tests check mapped plan dimensions, the estimated 26 m rear crown and lower auditorium roof, zero minimum Y, three recessed doors versus solid piers, the central black arches versus flanking shutter panes, supported rooftop sculpture geometry, every source vertex inside the actual mapped replacement ring, a cheaper far LOD with matching bounds, and GLB/source bounds, normal attributes, triangle counts and removal of `bridgeLift`. Tests complete in under one second locally.

The requested two-file test command passed **117/117 tests**, including all three Teatro conformance checks and its six dedicated tests. The global catalog check passed on retry: **164 entries / 296 GLB variants valid**; its earlier failure was another worker's absent St Peter's Basilica document, and no other landmark files were edited.

Deterministic exported QA is saved at `tmp/top-cities/teatro-nacional-de-costa-rica/qa-metrics.json`: no budget or silhouette issues, **zero coplanar pairs**, zero back-face hits (391 intersecting sweep rays), no geometry below grade and no removable bridge attributes. Final measured costs are recorded in the exported manifest and below; actual Tesla performance is unmeasured. The coordinator's independent visual review remains pending.

| Exported default scene | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 31,624 | 8 | 1,262,336 | 1,233 |
| Far | 7,620 | 8 | 303,624 | 297 |

After opening the final combined contact sheet, the front's three central dark arches and six flanking shutters, the red stage crown, the supported silhouettes, the grade contacts and the near/far roof envelope read consistently in both palettes. The dark front deliberately lights only selected masonry; it does not reproduce the full spatial spread of the real floodlights. The simplified relief and estimated rear elevations are the principal fidelity limitations.

## Limits and integration status

All heights are estimates; the mapped plan is the only measured dimension source. The stage-house vertical scale/profile is judged from one elevated image. Side and rear window rhythm is estimated because the dossier chiefly shows the front. Figures are simplified garment/head/arm/wing silhouettes and relief is an abstract wreath, not a detailed sculpture reproduction. No interior, site planting, forecourt fence or contemporary entrance object is included. Lettering and roof seams vanish in far LOD. The geometry is suitable for streamed street/map viewing, not conservation documentation.

| Mode / check | Status |
| --- | --- |
| Cityscape | **Not tested yet, integration is checked separately.** |
| Full 3D world | **Not tested yet, integration is checked separately.** Rigid grade base; pad/DEM and entrance levels need app validation. |
| Provider replacement/lifecycle, failure restoration, regional zoom, terrain arrival/reanchor | Not tested in app; shared runtime files were not changed. |
| Exported near/far geometry, palette, bounds, footprint, local inspector | Verified locally; independent review pending. |

Catalog: `prototypes/assets3d/catalog.d/teatro-nacional-de-costa-rica.json`. Runtime models and measured manifest: `public/models/buildings/teatro-nacional-de-costa-rica-{near,far}.glb` and `teatro-nacional-de-costa-rica.json`.
