# Cathédrale Sainte-Cécile d’Albi

Original procedural exterior of the present cathedral at Place Sainte-Cécile, Albi, France. Asset `cathedrale-sainte-cecile-albi`. The cathedral nave, tower, attached north sacristy, south baldaquin and southeast Dominique-de-Florence gate are included. The Palais de la Berbie and Pont Vieux are excluded. No photo, texture, scan or third-party mesh is shipped.

## Identity, sources and dimensions

From a road at 100 m the tall narrow lancets, tightly spaced round buttresses, battered brick socle and contrasting open limestone porch identify the building. At 800 m the single long fortress hull, high stepped west tower and small east chevet turret retain that identity. The current roofline omits the removed nineteenth-century balustrade and its taller array of little towers; the historic dossier side photograph is used for overall rhythm rather than that obsolete detail.

| Feature | Value | Basis |
| --- | --- | --- |
| Length / width | 113 m / 35 m | [Albi Tourisme](https://www.albi-tourisme.fr/decouvrir-albi/patrimoine-unesco/la-cathedrale-sainte-cecile/). Wikipedia gives 113.5 m length. Model hull length about 113.4 m; mapped side buttress envelope about 32.2 m. The published 35 m is not forced onto the narrower cadastral ring |
| Bell tower | 78 m | Albi Tourisme and OSM main way 260816263 |
| Nave / roof | 40 m eaves, 44 m ridge | OSM roof part 260816459, height 44, min_height 40, roof:height 4 |
| Tower stages | Lower square 41 m; octagonal sections to 58, 66, 78 m | OSM parts 260816290, 260816473, 260816283, 260816279; individual corner turrets step through 58/66/72/77 m |
| Nave type / buttresses | Single nave, no transept, rounded buttresses; east apse | [French Ministry of Culture survey](https://www.culture.gouv.fr/content/download/182716/pdf_file/Duo_cathedrales_Occitanie_2017_09.pdf), Albi entry |
| South porch | Floor 3 m above local foundation grade; arcades about 13 m, ornament to 20 m | Floor from OSM stair/porch parts; tracery heights and proportions estimated from Thérèse Gaigé’s porch photograph |
| Sacristy / chevet turret | Sacristy ridge 25 m; chevet turret tip 55 m | OSM 260816289 and 260816479 |
| Fine detail | Narrow lancets 1.2 × 15 m; side buttress spacing 6.7 m; sparse mortar course relief | Estimated from photographs and mapped roof/body lengths. No interior survey |

References are fully attributed in `prototypes/assets3d/catalog.d/cathedrale-sainte-cecile-albi.json`. Dossier images: Krzysztof Golik and Didier Descouens (CC BY-SA 4.0), Guiguilacagouille and GO69 (CC BY-SA 3.0), unknown historic photographer (public domain). Added only one necessary detail angle: [Partie supérieure du baldaquin](https://commons.wikimedia.org/wiki/File:Partie_sup%C3%A9rieure_du_baldaquin.jpg), Thérèse Gaigé, CC BY-SA 4.0. References remain in ignored scratch, without retaining any photographic material in the model.

## Geographic frame and ownership

Real metres, +X east, +Y up, +Z south; anchor `[2.14256, 43.92853]` lies on the mapped cathedral site. The west tower is centred at approximately `[-47.15, 6.5]` in x/z, chevet centred at `[41,6.5]`. OSM roof control points `[-39.93,-3.33]` and `[41.45,-3.31]` yield a nave bearing 89.986° and south frontage 179.986°. Geometry rotates by −0.0141° around its nave axis before export; the runtime applies no additional rotation.

One complete replacement ring is OSM way 260816263, including the sacristy, porch, southeast gate and stairs. The associated cathedral Simple 3D part IDs are enumerated in `OSM_WAYS`; their rings fit in the cathedral outline. Unrelated neighbouring buildings are excluded. An all-vertex containment test allows the provider’s 0.8 m ownership slack for small geometric trim.

The existing dossier supplied full geometry. A fresh single-way query through the required shared Overpass helper timed out; the saved dossier is used without another endpoint or independent bulk request. Local y=0 is the foundation grade. The brick socle and south stair create authored entry levels; no DEM or absolute altitude is baked in. A bounded `terrainPad` uses the cathedral ring and median samples along its nave because the river-side slope makes the default lowest-sample disc unsuitable. Exact southeast ground/stair grades require integration review; no terrain verification is claimed.

Cityscape and Full 3D world: **not tested yet, integration is checked separately**. Nearby road and building preservation, coarse-to-fine DEM arrival, pad edges, late/failed loading and lifecycle behavior remain integration tasks.

## Geometry and materials

Editable source: `geometry.js` and `cathedrale-sainte-cecile-albi-kit.js`. Export with `pnpm build:top-cities-landmarks cathedrale-sainte-cecile-albi --no-check`.

Seven merged named materials in each LOD: warm brick, slightly lighter trim, dark brick joint relief, muted tile roof, dark recesses, pale limestone porch, and dim glass (`glow`, warm at night). No UVs, textures, unused attachment attributes or extensions. Lower west stages have broad blind round arches; upper stages have paired belfry windows. Cornices, half-round buttresses, narrow lancets and battered foundation give the body its fortress rhythm. Near includes sparse horizontal brick relief, corbel voids, mullions and tower louvres; buttresses are a slightly lighter brick tone than the nave walls. Far reduces radial segments, relief and narrow framing while retaining the turret silhouette, tower tiers, open porch and gate.

The revised limestone baldaquin has solid piers, three thick open arcades, upper spandrels, a gabled screen with relief tracery and an attached rib web; upper side tracery remains pierced. Carved figures are abstract pin/crocket geometry; the flamboyant sculpture, real irregular profiles and interlocking vault details are simplified. Interiors, frescoes, literal brick tessellation and historic roof ornament are omitted. The cathedral sacristy is simplified to its mapped main mass.

## Verification

Focused tests pin the 78 m tower, 44 m roof, hull length, grade, rounded buttress contacts, visible narrow lancets, upper belfry recesses, the pale porch columns and its genuinely open side passage, complete footprint containment, and far silhouette/cost reduction. The generic top-cities conformance test checks the GLB/source round trip, metrics, palettes and catalog.

Visual evidence and final measured costs are recorded below after export review. Runtime hardware performance and application integration remain untested.

### Initial measured exports and judged contact sheet (superseded by review correction below)

| Variant | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 40088 | 7 | 1772700 | 1731.2 |
| far | 8862 | 7 | 455048 | 444.4 |

Both variants fit all building budgets. Near/far box faces differ by under 0.5 m; the tower remains 78 m and the nave ridge 44 m. `qa-metrics.json` reports zero back-face hits, zero removable bytes, grade at 0 m and no coplanar-overlap issue.

Judged one initial procedural sheet and the final exported comparison sheet, with reference photographs alongside the models:

- `tmp/top-cities/shots/cathedrale-sainte-cecile-albi/cathedrale-sainte-cecile-albi-procedural-near-light-sheet.jpg`: first massing, front/back/above/street/porch; prompted lighter repeated geometry, a full-height front camera, and retained open porch tracery.
- `tmp/top-cities/shots/cathedrale-sainte-cecile-albi/exported-reference-contact-sheet.jpg`: reference side, chevet, west tower and porch; complete exported near/far light/dark sheets (overview, facade, back, east, west, roof, detail, street) and exported plan with red footprint. The current rounded buttress caps, 78 m west silhouette, single-nave proportions and pale open south porch read consistently across both LODs.
- Constituent sheets: `cathedrale-sainte-cecile-albi-glb-near-light-sheet.jpg`, `cathedrale-sainte-cecile-albi-glb-far-light-sheet.jpg`, `cathedrale-sainte-cecile-albi-glb-near-dark-sheet.jpg`, `cathedrale-sainte-cecile-albi-glb-far-dark-sheet.jpg` in that same screenshot directory; exported plan `cathedrale-sainte-cecile-albi-glb-near-light-top.png`.

Mechanical QA prompted offsets between the lower tower cap and turret cornice, between the chevet shaft and cap, and an embedded sacristy contact behind the north nave wall. This removed coplanar overlaps without changing the visible silhouette. Near/far cost was reduced by continuous indexed arch ribbons, simpler radial segments, fewer relief courses and removal of sub-pixel far frames. The near porch remains stylized lattice rather than literal carved limestone; the far porch retains its four piers, three open archways and peaked tracery. Both theme palettes were judged, with restrained warm glass in dark mode.

Cityscape and Full 3D world: **not tested yet, integration is checked separately**. No shared files were edited and no app/build/deployment verification is implied by the exported contact sheet.

### Final checks (2026-10-09)

- Requested two-file test run: this cathedral’s 8 feature tests and 3 generic conformance tests passed; 257/259 total passed, with unrelated concurrent failures for `farris-bad` (far triangles) and `dome-de-la-grave` (catalog/readiness mismatch).
- The same two files with a name filter selecting all 11 cathedral tests passed with exit code 0. The landmark’s own tests run in well under three seconds.
- `node scripts/asset-catalog.mjs` passed: 209 records, 398 GLB variants at the time of validation.
- `qa-metrics.mjs --ids cathedrale-sainte-cecile-albi` passed; its final JSON is `tmp/top-cities/cathedrale-sainte-cecile-albi/qa-metrics.json`.
- No shared source edits were needed. Shared catalog preview, running-app integration and independent release review belong to the coordinator and were not run under this worker’s constrained brief.

## Independent-review correction (2026-10-09)

Compared the review’s tower claim directly against refs `3.jpg`, `5.jpg`, `6.jpg` and the added porch reference `8-porch.jpg`, as one `tmp/top-cities/cathedrale-sainte-cecile-albi/revision-refs.jpg` contact sheet. The photographs support a square lower keep and chamfered/octagonal upper tiers with half-round corner buttresses, so the genuine corner turrets and chamfers were retained. The review file has no Prepare command; the standard exported-GLB `qa-sheet.mjs --ids cathedrale-sainte-cecile-albi --out tmp/top-cities/shots/cathedrale-sainte-cecile-albi/revision-final` was rerun instead.

| Review defect | Before → after |
| --- | --- |
| Tower read as drums with six or more slots per visible side | Lower square keep strengthened through the gallery; chamfered stages have broad cardinal faces and just one tall paired opening on each face, with blank corner facets. Lower blind arches and the four round corner buttresses remain |
| Porch looked like a thin tree lattice | Wider solid stone pier cores, thicker arcades, side spandrels and a broad pale gabled screen carry relief tracery; the passage and three lower arcades remain open |
| Roof looked flat and flanks monotone | Low roof pitch begins at 39.65 m over a wider eave and meets the 44 m ridge, with a ridge tile roll to 44.12 m; round buttresses use slightly lighter warm brick than the flat nave |
| Heavy repeated detail | Near radial samples 14 → 10, relief courses halved; buried cylinder caps removed. Far keeps six-sided buttresses and omits mortar relief. No silhouette dimension was sacrificed |

### Final revised exports

| Variant | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 28764 | 7 | 1229820 | 1201.0 |
| far | 7530 | 7 | 352676 | 344.4 |

Initial near 40,088 triangles / 1,731 KiB → revised 28,764 / 1,201 KiB; initial far 8,862 / 444 KiB → revised 7,530 / 344 KiB, with seven draws in both. Geometry QA is clean: no budget or coplanar flag, zero back-face hits, zero removable bytes, grade at zero and far bounds preserved. New raycast tests count exactly two west belfry openings on a broad flat face, check the solid porch gable, and prove a >2 m roof rise away from the flank, while the existing open-arcade, footprint and height checks remain.

Looked at the first revision’s exported QA sheet `tmp/top-cities/shots/cathedrale-sainte-cecile-albi/revision-review/cathedrale-sainte-cecile-albi.jpg`, then the final day/night comparison `tmp/top-cities/shots/cathedrale-sainte-cecile-albi/revision-final/review-night-contact-sheet.jpg`. The final comparison contains the standard reference/front/back/street/plan/west/near/far review sheet and exported near/far dark overview, back, roof and porch detail views. Solid stone reads at street range; the roof pitches, belfry pairs and square lower keep survive far LOD.

The new gable screen, individual pier widths and relief carving remain procedural estimates rather than a sculpture survey. The source’s tower stage heights and 78 m tip are unchanged. Both app modes remain not tested yet; integration is checked separately. No shared file edits were needed.

Final revision validation: 12 landmark tests plus 3 cathedral conformance/GLB round-trip tests pass (15/15, 568 ms); `node scripts/asset-catalog.mjs` passes with 209 records and 400 GLB variants at validation time. Logs: `tmp/top-cities/cathedrale-sainte-cecile-albi/revision-tests.txt`, `revision-catalog.txt`, and `revision-metrics.json`. Two look iterations were used, with the final sheet containing the current exported models.
