# Museo Nacional de Costa Rica — Cuartel Bellavista

Original procedural exterior in its museum state, San José, Costa Rica, authored 2026-10-12. Former barracks occupied by the national museum since 1950, on Cuesta de Moras, above Plaza de la Democracia. The official museum identifies its main entrance as the west facade from the plaza. Model identity is carried by the long ochre courtyard wings, paired crenellated stair turrets, white cornices, split stair, weathered cylindrical east corner towers and modern butterfly-garden/ticket entrance.

## Sources and dimensions

- [Official visitor information](https://www.museocostarica.go.cr/visitar/) confirms location, west entrance and former barracks.
- [Official interactive plan](https://www.museocostarica.go.cr/visitar/plano-interactivo/) identifies the courtyard wings, south garden, ticket office, stone sphere and detached service buildings.
- [Museum history](https://en.wikipedia.org/wiki/Museo_Nacional_de_Costa_Rica): dossier identifies construction in 1917 and museum occupancy in 1950. No published architectural height was found; none is claimed.
- [OSM relation 4144800](https://www.openstreetmap.org/relation/4144800): geographic frame and three outer building rings, retrieved through the shared Overpass helper; outer ways **24857110, 1001217457, 1001217461**. Inner way 310174739 is a garden, not a provider extrusion. Adjacent Castillo Azul and the legislative complex are excluded.
- [Fachada del Museo Nacional de Costa Rica.JPG](https://commons.wikimedia.org/wiki/File:Fachada_del_Museo_Nacional_de_Costa_Rica.JPG), Fespinozalemistre, CC BY-SA 4.0: dossier photo 2, stair/front turret proportions.
- [Fachada Oeste Museo Nacional CRI 01 2020 4219.jpg](https://commons.wikimedia.org/wiki/File:Fachada_Oeste_Museo_Nacional_CRI_01_2020_4219.jpg), Mariordo (Mario Roberto Durán Ortiz), CC BY-SA 4.0: pale cornices, low roof, window rhythm, stair and lower drum.
- [Cuartel Bellavista este.jpg](https://commons.wikimedia.org/wiki/File:Cuartel_Bellavista_este.jpg), John Wolf, CC BY 2.0: preserved southeast stone tower and ochre return facade.

| Feature | Model / reference | Authority |
| --- | --- | --- |
| Origin | -84.07139, 9.93278 | Geographic anchor from dossier, inside museum |
| Main mapped envelope | roughly 62 × 110 m, annexes reach 37 m east of origin | OSM outer rings |
| East-wall skew | 3.11° east of north | OSM controls (-84.0713103,9.9324817) to (-84.0712713,9.9331894), checked against actual queried points |
| West frontage normal | 266.89° | Derived from east-wall bearing |
| Tallest paired turret crenellation | 14.6 m | Photo estimate, not surveyed |
| Stone east watchtowers | 14 m to crenels, 5.3 m shaft diameter | Photo estimate; mapped centres/radii constrain placement |
| Main terrace | +3.2 m above plaza-side stair foot | Authored structural estimate |
| Main facade | ~12.5 m cornice/roof base | Photo estimate |
| Courtyard | ~25 × 80 m | OSM inner garden ring, simplified rectangular interior |
| Glass butterfly wing | ~22 × 25 m, roof ridge 8.3 m | Official-plan massing estimate |
| Sphere enclosure | ~6 m diameter | Visual/plan estimate, deliberately not an asserted published dimension |

Metres, east/up/south. Rotation **is baked into vertices** using the mapped east-wall vector (4.28 m east / 78.78 m north). Runtime must not rotate again. y=0 is the rigid plaza-side stair foot. No DEM height, sea-level datum or latitude stretch is baked in. Mask rings are exact OSM outer members; the site base, internal garden and masks are distinct roles.

## Authoring and approximations

`src/peregrine/landmarks/top-cities/museo-nacional-de-costa-rica/geometry.js` builds independent walls with real recessed window apertures, an open courtyard, cylinders and annular open crenellated tower crowns. Compatible geometry is merged into eight named materials. Light/dark palettes have matching keys. Far retains both window rows and every turret merlon, reducing arc tessellation, fine frames and stair tread counts.

Near trims are displaced from wall planes; glass sits behind true openings. Courses are interrupted at the round turrets to avoid intersecting the cream caps. Roofs omit buried flat plates; the east/north roofs stop before the stone watchtowers. Invisible y=0 bottom faces are removed. These changes address the first depth-graph cycle findings rather than relying on dropped edges.

The glass pavilion uses an opaque, texture-free pane shell, metal mullions and small dark reflected-pane strips; its location and broad massing follow the official plan, but its pane layout is not surveyed. The ticket sphere is a closed stylised shell; no transparent interior is simulated. Fine bullet holes, masonry weathering, vegetation and interior exhibits are omitted. Stone spheres are original geometry. East service annexes are coarse original massing within their mapped rings. The neighboring plaza, roads and unrelated buildings are not modeled. Photographs and official-plan images remain in ignored scratch and are not embedded in source or exports.

## Export and verification

Build: `pnpm build:top-cities-landmarks museo-nacional-de-costa-rica --no-check`.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 29,025 | 8 | 1,345,992 | 1,314.4 |
| Far | 9,357 | 8 | 425,436 | 415.5 |

Both LOD bounds match exactly: east/up/south min (-51.8503, 0, -53.9793), max (39.1125, 14.6000, 57.6583) m. Geometry uses eight materials; GLBs contain normals and no textures, external resources, decoder extensions or free-standing bridgeLift attributes. Reported costs are measured default-scene counts and uncompressed bytes, not a device benchmark.

Judged `tmp/top-cities/shots/museo-nacional-de-costa-rica/final-reference-glb-sheet.jpg`, with west/southeast reference photographs alongside exported near and far, light and dark variants. It includes near overview/front/back/roof/entrance/close stair, far overview/front/back/roof, and both LODs in dark front/entrance views. The first procedural sheet is `museo-nacional-de-costa-rica-procedural-near-light-sheet.jpg` in the same directory. Individual images follow `museo-nacional-de-costa-rica-glb-{near|far}-{light|dark}-{view}.png`; only the documented view/theme combinations were captured.

Visual changes following the first sheet: changed the exposed gray stair cheeks to continuous ochre parapets, differentiated pavilion glazing from darker historic windows, refined the lower drum crenels, and reduced far arc tessellation while retaining every merlon. Geometric QA then removed buried roof plates, interrupted the cream cornices at turret intersections, shortened roofs around the stone towers, unified the entry canopy material and removed hidden grade bottoms. Decorative lettering was dropped because its unsupported spans did not improve recognition. Final review shows the stair/turret silhouette and both window rows persist in far; the pavilion and service annexes remain deliberate approximations.

- Six landmark tests pass in under one second: envelope/grade, open courtyard, watchtowers/crenels/doorway, continuous stairs, named masonry contact for all twelve structural rib/coping members with a deliberately shortened-end negative case, and GLB bounds/open courtyard/material round trip.
- Scoped registry run passes all museum cases and the six landmark tests; the combined run has one unrelated failure, `palacio-de-cibeles: footprint is a real polygon`, in another builder’s work. No shared source was changed to hide that failure.
- `node scripts/asset-catalog.mjs` passes: 266 entries / 508 GLB variants at time of check.
- Deterministic `qa-metrics.mjs --ids museo-nacional-de-costa-rica` reports **ok** for both LODs, including budgets, winding, window cadence, layered surfaces and member-end screening.
- `node scripts/landmark-depth-layers.mjs --ids museo-nacional-de-costa-rica` reports **zero dropped cycle edges**; its scoped `--check` passes. The only shared file regenerated is `src/peregrine/landmarks/depth-layers.js`.

Independent visual review and both-mode app evidence are still required by the lead; no inspector view is presented as runtime approval.

## Placement handoff

Cityscape: **not tested**, integration checked separately by the lead. Full 3D world: **not tested**, integration checked separately by the lead. No app server or runtime bundle was started in the shared tree. A bounded median terrain pad with internal ground references is declared instead of the default minimum-height disc. The +3.2 m terrace is structural geometry, not a DEM hill. The lead must check slope samples, both entrances, rigid footing, pad-edge lattice coverage, duplicate provider parts, shared runtime shading and reversible loading in both modes. Inspector evidence does not certify those cases or device performance. Independent reviewer approval remains pending.

Source MIT; original model CC BY 4.0. Geographic data © OpenStreetMap contributors, ODbL 1.0. Referenced photographs were used only for observation and retain their stated licenses.

## Independent review correction — 2026-10-12

Review nit fixed: butterfly pavilion shell now has separate opaque panes, thin metal mullions and restrained dark reflection strips using existing materials; roof ribs and masonry contacts retained. Mullions stop before cream support columns to avoid material cycles. No additional material draw or transparency; pavilion remains an estimated abstraction.

Inspected exported near/light and far/light contact sheets at `tmp/top-cities/shots/museo-nacional-de-costa-rica/review-fix1/museo-nacional-de-costa-rica-glb-{near|far}-light-sheet.jpg`. The palace used two look-fix iterations; the museum and Alamo used one. Existing palettes and geographic ownership are unchanged. The initial authoring verification above is historical; current exports are measured in the table above.

Current focused run: **25/25 pass** (16 landmark-specific tests and nine scoped registry cases for these three models). The requested combined registry run reports 476 passes / one unrelated failure: the concurrently authored High Museum near model exceeds its triangle budget. The three-model deterministic audit in `tmp/top-cities/palacio-de-cibeles/review-fix-metrics.json` reports **ok** for both LODs of each landmark. Scoped depth generation and `--check` pass with **zero material-cycle edges dropped**. The global catalog command and `pnpm assets:preview` were run and are blocked by the concurrently authored unregistered `/models/buildings/high-museum-of-art-far.glb`; only the owned records were edited.

The independent pre-fix review found visible footing and no provider intrusion in the supplied Cityscape and Full 3D world stills. **Post-fix Cityscape: not tested; post-fix Full 3D world: not tested**, pending the lead's app recapture and independent re-review. Still-image approval does not certify lifecycle, DEM refinement or hardware performance.
