# Custom House, Dublin

Original procedural model of the restored Custom House on the north bank of the Liffey, completed in 1791 to James Gandon’s design. The river frontage faces south. Original code MIT; model CC BY 4.0; mapped geography © OpenStreetMap contributors, ODbL 1.0. No photograph, texture, scan or third-party mesh ships.

## Evidence and dimensions

[Heritage Ireland](https://heritageireland.ie/places-to-visit/custom-house-visitor-centre/) confirms Gandon, the north quay location and Edward Smyth’s exterior sculpture. The prepared facts dossier supplies the 1791 completion and Portland stone with later Ardbraccan limestone. [OSM relation 610966](https://www.openstreetmap.org/relation/610966), outer way 23013986 and dome part 316947618 establish the geographic envelope and provider ownership.

| Feature | Value | Basis |
| --- | --- | --- |
| Main envelope | Approximately 115 × 63 m | Mapped outer north/south edges; west projection extends another 4.5 m |
| Visible main facade | Two principal storeys | Reference photos; OSM four levels include basement and penthouse |
| Main cornice / pavilion top | 15.6 / 18.2 m | Photo estimate; OSM main height 20 m includes roof |
| Dome and Commerce top | 40 m | OSM dome height tag, approximate rather than a survey |
| Dome outer radius | 4.25 m | OSM circular footprint approximately 4 m radius, photo estimate for cornice |
| Drum colonnade | 12 columns, 22.2–28.5 m | Photo-estimated tier proportions |
| Doric portico | Four columns, platform 0.85 m, entablature 14.95 m | Reference-photo estimate |
| River wing arcades | Seven bays each side | Counted from photographs |
| Statue, details, rear and roof pitches | Simplified | Photo/mapped estimates; rear not independently surveyed |

The two primary comparison photographs are [Dublin-Custom-House-Panorama-2012.JPG](https://commons.wikimedia.org/wiki/File:Dublin-Custom-House-Panorama-2012.JPG), Bjørn Christian Tørrissen, CC BY-SA 3.0; and [DublinTheCustomHouse-2014-10.jpg](https://commons.wikimedia.org/wiki/File:DublinTheCustomHouse-2014-10.jpg), the same photographer, CC BY-SA 4.0. Their Commons authors/licences were checked. The supplied reference sheet also includes [Early morning Crossing the LIffey - panoramio.jpg](https://commons.wikimedia.org/wiki/File:Early_morning_Crossing_the_LIffey_-_panoramio.jpg), andrew mcmillan, CC BY 3.0; and [Dublin Customs House at night.jpg](https://commons.wikimedia.org/wiki/File:Dublin_Customs_House_at_night.jpg), Jimmy Harris, CC BY-SA 3.0, used to compare the tower and warmer night facade; these Commons pages were also checked. All photographs remain only in ignored scratch.

## Geographic frame and modelling

Origin `[-6.25319,53.34868]`, real metres east/up/south, rigid local grade y=0. The north-edge controls `[-6.2540268,53.3489646]` and `[-6.2522940,53.3489627]` give an eastward bearing 89.89° and outward south bearing 179.89°. Mapped vertices preserve that skew directly; there is no host rotation and no latitude stretch or DEM altitude baked into exports. Dome centre is approximately 1.03 m east and 25.3 m south of the anchor, central across the river facade rather than the courtyard depth.

The exact outer ring of way 23013986 owns the complete main provider envelope; part 316947618 is inside it. Inner ways 56427098 and 56427588 are courtyard voids, retained as holes in the model rather than filled roofs. The detached northern Security building 1280902364 is excluded. Model cornices, steps and window relief project up to approximately 0.8 m beyond the mapped wall edge; the replacement polygon remains the building’s true outer ring.

Six named materials near, five far, batch repeated details. Pale Portland stone contrasts with a muted darker rebuilt drum and a green copper dome. The portico wall is recessed behind four freestanding columns. Windows remain separate arched or rectangular bays in far; sash bars, most balusters and copper ribs are omitted far. Grouped statue silhouettes stand on connected plinths. Fine carving, river-head portraiture, interior rooms, flags and surrounding quay furniture are omitted. Rear elevation and courtyard ornament are restrained mapping-based approximations.

## Verification

Initial procedural seven-view contact sheet: `tmp/top-cities/shots/custom-house-dublin/source/custom-house-dublin-procedural-near-light-sheet.jpg`. Compared with the supplied reference sheet: widened wing arches, strengthened pavilion pilasters and opened the full portico recess after this first inspection.

Final exported contact sheet judged against the dossier photographs: `tmp/top-cities/shots/custom-house-dublin/comparison.jpg`. It contains reference photos followed by all seven views (overview, south facade, north/back, roof, street entrance, dome detail and mapped plan) for near/light, far/light, near/dark and far/dark. Individual sheets are under `tmp/top-cities/shots/custom-house-dublin/{near-light,far-light,near-dark,far-dark}/custom-house-dublin-glb-<detail>-<theme>-sheet.jpg`. Final review retains the low two-storey silhouette, seven-bay wing rhythm, free porch, green dome and both courtyard openings; the west projection now receives windows at its actual mapped wall. Night uses warmer floodlit stone and dark glass rather than simulated lighting fixtures.

The contact tests caught a shallow gap under the column bases: the upper platform was extended beneath each shaft, and both LODs now meet it. Raking cornices were moved back to contact the gable. Tests select the large horizontal support surfaces separately from column geometry and include shortened endpoint negative controls.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 15,687 | 6 | 834,492 | 814.9 |
| far | 4,695 | 5 | 227,116 | 221.8 |

`tmp/top-cities/custom-house-dublin/metrics.json`: no issues, zero layered-face area, zero coplanar pairs, zero back-face hits and no window-rhythm flags. Generated depth ordering has zero dropped cycle edges and the focused `--ids custom-house-dublin --check` passes. Only the permitted shared generated `depth-layers.js` was regenerated.

Fifteen landmark tests plus three Custom House conformance checks pass (18/18; `focused-final.log`). The requested combined run passed 890/893 (`tests.log`), with all Custom House cases passing; concurrent unrelated failures were Wembley far GLB/source bounds, Vincennes ready/catalog mismatch and Versailles far byte budget. No unrelated files were changed. Initial catalog checks were blocked by other builders; the retry passed with 425 entries and 812 GLB variants (`catalog-retry.log`). `pnpm assets:preview` passed (`preview.log`). Source and GLB bounds, palette names, byte metrics, near/far silhouette, grade, courtyard voids, arcade bays and named porch/pediment supports are covered by the focused checks.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. App shading, provider replacement, foundations/pad lattice coverage, DEM arrival and lifecycle transitions remain lead integration gates. No app server or bundle build was started by this worker.
