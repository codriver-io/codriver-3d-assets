# London Eye — original procedural model

The complete 32-capsule Millennium Wheel on London's South Bank, by Marks Barfield, opened in 2000. This is the enduring configuration rather than a date-specific temporary capsule maintenance omission. Source date: 2026-10-12. Original texture-free Three.js model; no imported mesh, traced mesh, scan or retained third-party runtime imagery.

## Sources and dimensions

| Feature | Value | Evidence |
| --- | --- | --- |
| Overall landmark height | 135 m; mesh top 135.08/135.12 m including thin hoops | [Operator](https://www.londoneye.com/about-us/), [architect](https://marksbarfield.com/projects/london-eye/) |
| Wheel diameter | 120 m structural outer chord | [Wikipedia](https://en.wikipedia.org/wiki/London_Eye); tube envelope 120.54 m |
| Capsules | 32 outside rim, upright | [Operator anniversary](https://www.londoneye.com/25th-anniversary/) |
| Hub datum | 69 m | Photo-estimated, OSM spindle part 1133007230 at 68–70 m |
| Capsule envelope | 4.3 m across wheel × 4.5 m high × 8 m along axle | Photo-estimated; long axis parallel to spindle |
| Capsule centre radius | 63.75 m | Estimated to reproduce height and exterior rim mounting |
| A-frame footings | ±13.5 m along rim, 38 m landward | Mapped/photo-estimated |
| Backstay anchor | 76 m landward of wheel centre | OSM way 335716202 |
| Rim tube radii / spoke cable radii | 0.27 / 0.045 m near, 0.07 m far | Slight cable exaggeration for visibility; [Ingenia](https://www.ingenia.org.uk/articles/the-wheel-the-british-airways-london-eye) gives 70 mm diameter |
| Main / rotation cables; perimeter chords | 64 / 16; 64 chords | Same primary engineering account |

Dossier reference sheet: `tmp/top-cities/london-eye/refs-sheet.jpg`. Studied the river overview, frontal wheel, aerial support arrangement and capsule closeup; photo titles, authors, licences and source links are recorded in the catalog. Gregg M. Erickson (CC BY 3.0), Diego Delso (CC BY-SA 4.0), Colin Smith (CC BY-SA 2.0), Mattsjc (CC BY-SA 4.0), Khamtran (CC BY-SA 3.0), LA(PHOT) Paul A'Barrow (OGL v1.0). Photos stay in ignored scratch and are not in GLBs or committed files.

## Geographic frame and ownership

Origin `[-0.1196765, 51.5033416]`, the centre of wheel outline [204068874](https://www.openstreetmap.org/way/204068874). Real metres, east/up/south, rigid local foundation grade y=0. No latitude stretch, sea level or DEM baked into reusable meshes. Outline controls `[-0.1198608,51.5027451]` and `[-0.1196135,51.5039478]` give 7.36° from north for the wheel plane. Rotation is baked once; local capsule axle/landward axis points east-southeast. The western/river face bearing is 277.36°.

Four parent masks cover the wheel/capsule hull, the low service/loading building 153273222, A-frame/spindle outline 1133007198 and detached backstay anchor 335716202. `OSM_WAYS` enumerates all 441 mapped outline/part ways in these modeled assemblies, including every tiny capsule, frame wedge and service roof in the dossier; tiny wedges are consolidated into real parent mask rings. Adjacent ice cream/ticket/bakery kiosks and County Hall relation 1789966 remain provider-owned. The main mask is a hull of the wheel's parts and parent outline, including overhanging capsule extents. Source tests compare the actual model with this geographic envelope.

Three compact terrain datum tables cover the two land-side leg foundations and the backstay anchor. The suspended river-side wheel is not a terrain-flattening disk. DEM/table/pier/service landing contacts require separate app validation; this file makes no terrain approval claim.

## Geometry and materials

Two land-side inclined tubular legs meet a long cantilever spindle. Paired backstay cables terminate in the independent mapped concrete anchor. A thin triangular rim comprises two outer hoops, an inner hoop and open ties/diagonals. All 64 radial cable members end on a hub flange and inner rim; 16 slightly inclined rotation cables join the hub to the outer rim, eight per face, following the primary engineering account. All 32 upright capsules sit outside the rim on paired mounting brackets. Capsules retain separate glass and steel belly surfaces in both LODs, with three section hoops and a horizontal sill near, and two section hoops far. Muted white steel, grey cables, slate blue-grey opaque glass, concrete and low grey service deck are calibrated to the photographs. Both LODs have off-white self-lit outer rim tubes in daylight and a subdued pink illumination at night; near adds small rim lamp heads. Night lighting is a representative static colour, not a reproduction of timed event lighting.

Opaque capsule glass avoids sorting and separate transparent draws; there is no modeled passenger interior, branding, glass reflection texture or animation. The static pod phase and regular spoke layout are estimates. Small mechanical drive and service buildings are simplified low masses. Far keeps every capsule, both support legs, both stays, all spokes and the open rim; it reduces curved tessellation and rim diagonal count.

## Costs and verification

| Export | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| near | 32,728 | 6 | 998,788 | 975.4 |
| far | 11,824 | 6 | 420,956 | 411.1 |

Export: `pnpm build:top-cities-landmarks london-eye --no-check`. Component metadata used for endpoint tests is non-enumerable, so it does not inflate GLB extras. Standard GLB materials, finite normals, indexed geometry, no textures and no removable bridge attributes.

Visual evidence and final check results are recorded below. Cityscape **not tested yet** and Full 3D world **not tested yet**; app integration, provider replacement, shared runtime shading, lifecycle/DEM arrival, terrain contacts and independent review are checked separately by the lead. No app server, deployment or git write command was run by this builder.

## Evidence inspected and resulting corrections

Viewed `tmp/top-cities/shots/london-eye/london-eye-final-comparison.jpg`, with the reference photos next to all four exported near/far light/dark contact sheets, including overview, front/facade, opposite/back, above/roof, street-level and close capsule/rim detail. Also inspected `london-eye-glb-near-light-top.png` for north/south orientation, the one-sided frame and mapped anchor, and `london-eye-procedural-near-light-sheet.jpg` for source/export agreement. All these files are under `tmp/top-cities/shots/london-eye/`. The reference sheet was read directly before authoring.

First inspection showed excessive curved tessellation and a uniform spoke layout. Reduced hoop/sphere tessellation while retaining pods, rim openings and capsule belts; corrected the main/rotation cable counts and alternating flange attachments using Ingenia; gave far glazing enough facets to preserve all bearing directions in the window-coverage check. Final night inspection showed insufficiently lit outer rims; changed the two outer hoops to the self-lit material in both LODs, then rerendered all four final exported sheets and looked at the fresh comparison. The wheel, external upright pods and land-side cantilever remain legible in both LODs. Exact drive machinery, capsule interiors and event lighting remain approximations; independent app review is still required.

Focused source tests verify actual mesh height, rim diameter, upright capsules, one-sided legs, an unobstructed mid-radius opening, the mapped ownership envelope and near/far bounds. Every cable, leg, rim tie/diagonal/cross-member and capsule mount has named supports; actual mesh cap centres are measured against named support triangles, excluding the member itself, in both LODs. An intentionally shortened spoke proves loss of support is detected. Endpoint allowances reflect embedding inside solid supports, not arbitrary scene proximity.

Final deterministic GLB QA: `tmp/top-cities/london-eye/qa-metrics.json` has **zero issues**, no layered/coplanar overlaps, zero back-face hits (60 intersecting sweep rays), no removable attributes, no unsupported member candidates, preserved window coverage and preserved bounds. Depth generation/check reports **zero dropped cycle edges**. `pnpm assets:preview` completed into the ignored local catalog and `node scripts/asset-catalog.mjs` passed (266 entries, 500 GLB variants). Final conformance output is `tmp/top-cities/london-eye/conformance.log`; London Eye-specific tests and its registry/GLB checks pass. Shared checks initially failed on other builders' unfinished Cologne/People's Salvation cathedral documentation and a People's Salvation footprint, which this builder did not edit.

The final required unfiltered two-file conformance run completed with **410 passing tests and one failure belonging to `peoples-salvation-cathedral`: its footprint fails the existing >4 m² polygon assertion**. All ten London Eye-specific/registry/GLB tests pass when selected by name; its source tests alone finish in about 0.3 s. This shared failure remains for the owning builder; no shared source fix was made. The generated depth table is the sole permitted shared-file change.

## Independent review fix — 2026-10-12

Review nit: glazing shifted from teal to slate blue-grey for stronger separation from pale steel bellies and ribs; near hoops slightly raised and far retains two section hoops per pod. All 32 upright capsules, spokes, one-sided legs and support contacts retained.

Judged the exported `tmp/top-cities/shots/london-eye/review-fix/london-eye-glb-near-light-sheet.jpg` and `far-night-comparison.jpg` (far daylight plus near/far night); underlying four sheets are in the same directory. These show facade/roof/detail and opposite views as applicable. One visual inspection round was sufficient after deterministic budget and layer corrections. Geometry metrics for all three fix assets are in `tmp/top-cities/peoples-salvation-cathedral/review-metrics.json`: zero issues, no dropped depth cycle edges.

Cityscape and Full 3D world were verified only in the supplied pre-fix b3 captures by review b3a; post-fix app recapture and independent re-review remain with the lead. The preceding original-build statements describe the original builder handoff, not approval of these revisions. No provider ownership expansion was required by the review; exact existing ids/rings are retained.

Required final tests: all 28 landmark-specific tests and nine owned conformance checks passed; the complete top-cities run had 442 passes and one unrelated `washington-dc-temple` footprint-polygon failure. Catalog validation retry passed (286 entries / 520 GLB variants). Final results and before/after costs: `tmp/top-cities/peoples-salvation-cathedral/REVIEW-FIX-REPORT.md`; unfiltered focused output is in `review-tests.log` in that folder. Shared preview generation remains the lead’s responsibility under the worker-only output boundary.
