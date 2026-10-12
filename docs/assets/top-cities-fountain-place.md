# Fountain Place, Dallas

Original procedural model of the 1986 office tower at 1445 Ross Avenue, by Henry N. Cobb / Pei Cobb Freed & Partners. The neighbouring AMLI tower is a different building. Source folder: `src/peregrine/landmarks/top-cities/fountain-place/`; contract: [top-cities landmarks](../top-cities-landmarks.md).

## Sources and dimensions

| Feature | Model | Evidence |
| --- | --- | --- |
| Structural height | 219.5 m | [Wikipedia](https://en.wikipedia.org/wiki/Fountain_Place) infobox (rounded 220 m in prose) |
| Completion / floors | 1986 / architect calls it 60 storeys | [Architect project](https://www.pcf-p.com/projects/fountain-place-originally-allied-bank-tower/); Wikipedia infobox says 63 |
| Double-square prism | Diagonal roof/base band | Architect description and published Tower plans / Tower section |
| Base carving | 18.288 m (60 feet) high | Architect: half the tower volume carved away up to sixty feet |
| Envelope | 58.7 × 62.5 m | Dossier OSM outline measures roughly 59.3 × 63.4 m; slight inset keeps panel vertices inside mapped ring |
| Anchor | -96.802544, 32.784797 | Centre of OSM way 73213058, rather than approximate article coordinate |
| Orientation | Side edges 135° / 45° | OSM control points [-96.8020815,32.7848082] and [-96.8023216,32.7846081] establish the southeast edge; opposite edge confirms |
| Shoulder / low facet | 160 / 46 m | Dossier roof parts: height=160, roof:height=114; interpreted and fitted against photographs, not a survey |
| Crown ridge | 31.25 m, NW/SE | Estimated from architect upper-floor plans and section, not default OSM roof-direction inference |
| Panel grid | Near 2.15 × 3.45 m; far 6.45 × 6.9 m | Estimated efficient modules, not exact real mullion/floor count |

Photograph titles, authors and licences are in the catalog record and dossier `refs/SOURCES.txt`. Six Commons dossier photos were inspected on `tmp/top-cities/fountain-place/refs-sheet.jpg`. Two additional architect drawings (Tower plans / Tower section, © Pei Cobb Freed & Partners) are reference-only, under ignored `tmp/top-cities/fountain-place/refs/`; they are not redistributed. No downloaded mesh, scan, photograph or texture ships.

## Geometry and materials

A convex central lobby half-footprint grows into the full square envelope over the carved base height. Two long sloping wing facets descend from the 160 m shoulder to opposite low corners. Above the shoulder a short gable ridge and triangular end facets produce the asymmetric crystal silhouette. Every face is planar with its own normal: far retains all crown, wing and base planes.

The curtain wall is a tiled shell of glass panes, horizontal joints and vertical joints. Adjacent polygons partition each plane; there is no underlying facade box, coplanar pane overlay or layer-dependent window sheet. Four merged materials: subdued green `glass`, slightly lighter sloped `facet`, green-grey `mullion`, and sparse `office` panes (identical shaded green by day, muted brighter green at night). Grid rows remain distinct in far.

The local frame is east/up/south, metres, y=0 at lobby grade. Rotation is baked once via u/v to east/south. All vertices remain inside the mapped tower footprint. Replacement rings list way 73213058 and all five parts 1491062886–1491062889 and 1493186371; nearby garage, hotel, AMLI tower and garden are unowned. No outdoor garden mesh extends the building footprint. A 48 m rigid pad encloses the model; no terrain baked into exports.

## Verification and limits

Initial source sheet exposed an excessively broad ridge from southwest and distracting day-lit panes. Architect plans/section established upper floors narrowing across the other axis; rebuilt crown with short ridge and triangular gable ends, and dimmed day-lit panes. A subsequent top check found a faulty text replacement had left the crown incomplete; the crown block was rewritten before export. Final exported sheets and metrics are recorded below.

Base carving uses planar glazed soffits rather than the exact recessed lobby/column assembly. Garden fountains, trees, entrance doors, interior, mechanical fixtures and tiny corner lobby parts are omitted. Width inset and panel pitch are modelling estimates. Night pane pattern is illustrative, not a occupancy survey. Cityscape: **not tested**, integration checked separately. Full 3D world: **not tested**, integration checked separately. The lead owns app/provider/mode/DEM and hardware validation; readiness verifies source/export only.

## Exported evidence, 2026-10-12

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 25,102 | 4 | 1,360,148 | 1,328 |
| far | 4,724 | 4 | 259,712 | 254 |

Judged `tmp/top-cities/shots/fountain-place/export-reference-sheet.jpg`: two reference photos alongside exported near/far, light/dark profiles. Also inspected exported `fountain-place-glb-{near,far}-{light,dark}-sheet.jpg`, containing overview/back, crown from above, entrance and near detail; exported `fountain-place-glb-near-light-top.png` confirms mapped rotation/envelope. Crown is now closed, and the southwest profile reads as a pointed crystal; the side view retains the wider roof/ridge and long lower facet. Far deliberately coarsens the window grid and night-only pane scatter. Glass has a flat stylized tint rather than photographic reflections; lit-pane scatter remains illustrative.

Measured `tmp/top-cities/fountain-place/metrics.json`: no issues; 0 layered faces near/far, 0 coplanar overlaps, 0% back-facing hits in 352 intersecting sweep rays, no removable bridgeLift attributes, identical LOD bounds, minY=0, top=219.5. Depth table generated for this id, check passed, zero dropped cycle edges. Ten landmark tests cover published height, crown ridge/roof planes, opposite carved corners, grade support, every-vertex mapped containment, outward shell rays, far pane grid and GLB/source bounds; 10/10 pass in about 0.5 s.

Combined acceptance command ran 470 tests: 467 passed, 3 failed, all belonging to the concurrently authored `tower-of-london` (catalog readiness mismatch, 61,883 triangles above its near cap, missing manifest field in its record). Fountain Place's three registry conformance checks passed alongside its ten custom tests. Catalog validation, `pnpm assets:check` and `pnpm assets:preview` were attempted and retried; they remain blocked by the other builder's missing `docs/3d-top-cities-marine-building.md`. Earlier catalog lookup also found an unregistered in-progress Cartago basilica export. No other builder files were changed to resolve these shared failures. Depth-layers check still passes for Fountain Place using the tool's per-id fallback. The lead should regenerate all depth ids at commit time and rerun catalog/preview once the batch settles.

## Independent-review corrections, 2026-10-12

Review fix: daytime office panes use the same colour and normal shading as glass (office material rather than reserved unshaded light); muted facet tint leaves the crystal planes to normals. Night retains brighter office panes; far keeps separate mullion rows. Source/export verified; revised Cityscape and Full 3D world app captures (2026-10-12) show the grounded base without provider overlap, and an independent re-review passed it.

Judged exported near/far light/dark sheets under `tmp/top-cities/shots/fountain-place/review-fix2/`; near sheets include facade/detail and the initial round includes roof/opposite or rear views. Museum and statue changes passed after one look round; Fountain Place needed a second round because matching colours alone still left bright unshaded daytime patches. Exported QA reports no material cycles, layered/coplanar flags, back-face hits or unsupported-member flags for these three assets. The 28 focused landmark tests and all 475 registry conformance tests pass; catalog validation and assets:check pass (286 entries / 560 variants), and assets:preview generated the local catalog. Updated app Cityscape and Full 3D world captures (2026-10-12) were visually verified and passed independent re-review; these exported sheets alone do not certify terrain placement.
