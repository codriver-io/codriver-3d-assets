# Concertgebouw, Amsterdam

Original procedural model of the Royal Concertgebouw, opened 11 April 1888, with the 1985–1988 glass side wing by Pi de Bruijn. Adolf Leonard van Gendt designed the historic hall. The driver-facing identity is the pale classical pediment and four columns against red brick, with the gilded lyre above the main roof gable. This model includes the oval recital hall and modern side pavilion.

Sources: [official history](https://www.concertgebouw.nl/en/our-history/history), [official renovation history](https://www.concertgebouw.nl/en/our-history/renovation-facelift), [dossier facts](https://en.wikipedia.org/wiki/Concertgebouw,_Amsterdam), [OSM outline](https://www.openstreetmap.org/way/46696080). See the catalog record for all photograph titles, authors and licence links. Commons photos are reference-only in ignored tmp; none are exported or committed.

| Dimension | Value | Basis |
| --- | ---: | --- |
| Main hall interior | 44 × 28 × 17 m | Dossier/Wikipedia; interior dimensions, not an exterior envelope |
| Main roof footprint | 45.7 × 28.1 m | Mapped way 754269611 |
| Main roof ridge / pitch | 24 / 8 m | OSM height / roof:height |
| Lower wings | 14 m | OSM 754269603 |
| Corner parts | 25 m | OSM 754269606–609; modeled steep roof and crest at 24.8 m |
| Oval hall roof | 24 m | OSM 754269604 |
| Glass side wing | 56.4 × 10.6 m; 14 m high | OSM 754276797; modeled ridge 13.9 m |
| Front pediment | 18.8 m wide; apex 21.45 m | Photograph estimate; projection tagged height 21 m |
| Column shafts | 8.08 m; 1.52 m maximum diameter, tapering to 1.32 m | Photograph estimate; fluted profile |
| Gold lyre tip | Approximately 27 m | Photograph estimate, not a published height |

Frame: origin [4.87904, 52.3562], real metres, +X east/+Y up/+Z south, local y=0 flat grade. In authoring axes u points to the Museumplein façade, v toward the glass pavilion. The main mapped roof edge runs from [4.8787535, 52.3563360] to [4.8793704, 52.3564994] (see the dossier for exact points); its bearing is approximately 67°. A 23° Y rotation is baked into the mesh exactly once. No Mercator scale, scene datum or terrain elevation is baked.

Ownership: way 46696080 and all 12 mapped building:parts, including both 5 m side projections and the pavilion. The rear tail within the outline is a low service range; neighbouring houses stay provider-owned. The portico's outer moulding and pediment rake overhang the mapped central risalit by at most 1.994 m, and eaves/window profiles project about 0.6 m; these are bounded architectural overhangs, not expanded road or neighbour masks.

Seven merged materials: subdued brown-red brick, warm stone, charcoal roof, cool opaque glass, grey metal, gold and light windows. Day/night palettes use the same names; night windows are warm and self-lit. The far model keeps each important silhouette and separate window bays, simplifying columns, sculpture and glazing ribs.

The model uses exact mapped polygon extrusion for the wings and oval rear hall, pitched roofs, four steep truncated hip roofs with dormers and cresting, four fluted column shafts with layered bases and coarse volute capitals, three arched front doors, and a sculpted tympanum represented by grouped human silhouettes. The lyre has an open bowl, curled arms, crossbar and five strings. Fine Corinthian carvings, full sculpture anatomy, banners, façade lettering and interiors are omitted. The rear service roof is an estimate; no aerial reference was available in the dossier.

## Verification

Initial procedural contact sheet: tmp/top-cities/shots/concertgebouw/concertgebouw-procedural-near-light-sheet.jpg. Compared against tmp/top-cities/concertgebouw/refs-sheet.jpg. The first pass showed oversized pale slabs from solid cornice boxes: changed to perimeter mouldings. It also showed a blank rear lower range: added individual rear bays, and removed historical side windows hidden by the modern pavilion. The brick was subdued after comparison with the daylight front photograph.

Final exported evidence judged: `tmp/top-cities/shots/concertgebouw/concertgebouw-final-contact.jpg`, a 4×4 sheet with the daylight/night front, historic side and glass-pavilion references in row 1; near/far exported front and back in row 2; near/far roof, lyre detail and street entrance in row 3; and near/far dark front, dark pavilion and dark far overview in row 4. Also produced `concertgebouw-glb-{near,far}-{light,dark}-sheet.jpg` in the same directory. The pediment, open lyre, corner roofs and column/window cadence remain visible in both LODs. The modeled pavilion uses opaque cool glass rather than a transparent interior; sculpture anatomy and side mouldings remain simplified.

After the visual correction, deterministic depth QA identified shared ground-facing bottoms and an overlapping historic wall beneath the glass pavilion. Removed grade bottoms, partitioned the original side range, and separated the low service roof top from its wall top. The regenerated depth table drops **zero** edges. Deterministic QA reports no issues: zero coplanar overlaps, zero unresolved layered faces after depth ranks, 0% outside-in back-face hits, no removable bridgeLift bytes, no far silhouette loss. Its generic window detector sees pavilion glass rather than the self-lit heritage bays, so focused raycasts explicitly pin those bays.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near, before review | 7,220 | 7 | 399,424 | 390.1 |
| Near, fixed | 8,213 | 7 | 457,680 | 447.0 |
| Far, before review | 3,876 | 7 | 234,700 | 229.2 |
| Far, fixed | 4,861 | 7 | 295,784 | 288.9 |

Focused tests cover OSM part ownership, height and orientation, column shafts, arch glazing, separated front and side bays, open lyre negative space, cornice/pavilion contacts against named supporting geometry with detached-end controls, silhouette and all vertex containment (maximum architectural overhang 1.994 m). Original build commands passed: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/concertgebouw/concertgebouw.test.js` (614 tests, zero failures); `node scripts/asset-catalog.mjs` (336 entries / 628 variants); `pnpm assets:preview`; `node scripts/landmark-depth-layers.mjs --ids concertgebouw --check`; and the selected deterministic `qa-metrics.mjs` report in `tmp/top-cities/concertgebouw/qa-metrics.json`. A transient missing tour-montparnasse document occurred during early depth generation, then resolved before final checks. No shared source edit was needed beyond the authorized generated depth table; the lead should regenerate all IDs when committing the batch.

Cityscape: **not tested yet**. Full 3D world: **not tested yet**. Integration is checked separately by the lead; no app server or deployment was started. Terrain arrival/refinement, actual provider replacement, lifecycle and Tesla performance remain unverified.

## Independent-review correction, b10a

The reviewer rated recognisability 3/5 and requested stronger classical columns and articulated stonework. The fix moves the shafts forward, increases their diameter, adds geometric fluting, layered bases and coarse volute capitals, and deepens the entablature and solid pediment. The portico backing is now pale stone with actual cut-outs around the three arched portals and upper bays. Wings gain pale rusticated ground-storey courses, alternating stone pilaster/quoins and substantial window jambs/sills. Far retains these features with coarser fluting and separate openings; no full-height window stripes. The supported open golden lyre above the main gable remains unchanged because its shape and support passed review.

Exactly two look-fix rounds were used. Current exported evidence judged: `tmp/top-cities/concertgebouw/concertgebouw-review-fix-contact.jpg`, with the four dossier references above near/far fronts and entrances, overview, rear, roof, lyre, and night fronts/entrance/pavilion. Individual near/far light/dark export sheets are under `tmp/top-cities/shots/concertgebouw/review-fix-final/`. Comparison showed that the first correction still left a red portico backing; the second pass added the cut-out stone backing and wing pilasters. The new maximum 1.994 m pediment/cornice projection is a measured architectural overhang; provider ownership remains the original complete mapped outline and all 12 parts, since the review found clean replacement and base contact.

Current focused tests pin shaft width and at least 0.8 m relief over the inset bays, bases/capital support contacts with a detached-end control, stone lower storey/pilasters, separate lower windows, pediment/rake contact, and the pre-existing silhouette/lyre/footprint checks. Current deterministic metrics are `tmp/top-cities/concertgebouw/review-fix-metrics.json`: no issues in either LOD; depth regeneration drops zero material-cycle edges. Near and far exports remain below their triangle/draw/byte budgets. Fine Corinthian carving, lettering, banners and anatomy remain simplified or omitted. Fresh Cityscape and Full 3D world app shots and independent re-review are the lead's remaining gates; current asset sheets do not certify either integration mode.

Current completion checks passed: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/concertgebouw/concertgebouw.test.js` (629 tests, zero failures), `node scripts/asset-catalog.mjs` (336 entries / 656 GLB variants), `pnpm assets:preview`, and `node scripts/landmark-depth-layers.mjs --ids concertgebouw --check`; generated cycle report is empty.
