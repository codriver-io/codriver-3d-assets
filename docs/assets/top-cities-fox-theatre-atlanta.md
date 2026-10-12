# Fox Theatre, Atlanta

Original procedural model of the present exterior of the 1929 movie palace at 660 Peachtree Street NE, Atlanta. Its identity is the striped buff/brown masonry, large glazed onion dome with pale interlaced ribs above the Ponce entrance, two smaller shoulder domes, Peachtree twin minarets, recessed arched entrance, crenellated parapets, vertical red FOX blade and projecting illuminated marquee. The auditorium interior and Egyptian Ballroom are outside the exterior model scope.

## Sources and rights

- [Wikipedia identity/history](https://en.wikipedia.org/wiki/Fox_Theatre_(Atlanta)): opened 1929, architect Olivier J. Vinour, capacity 4,665; exterior Moorish and interior Egyptian design.

- [Peachtree exterior photograph](https://commons.wikimedia.org/wiki/File:Fox_Theatre,_Atlanta_(2024)-104A8449.jpg), Frank Schulenburg, CC BY-SA 4.0: minarets, blade, marquee, stone colours and arcade.
- [Elevated Ponce exterior photograph](https://commons.wikimedia.org/wiki/File:Side_and_elevated_view_of_Fabulous_Fox_Threater.JPG), Daniel Mayer, CC BY-SA 3.0: dome profile/pattern, shoulder domes, portal/balcony and side-front massing.

These two photo pages and the Wikipedia page were checked on 2026-10-11. The supplied reference sheet was viewed, then its two useful exterior photographs were viewed at full available resolution. Reference photographs remain in ignored `tmp/top-cities/fox-theatre-atlanta/refs/`; none is copied into source/runtime output. No scan, traced mesh, image texture or imported third-party geometry. Procedural source/models are original work for Codriver; geographic data separately retains OpenStreetMap contributor attribution and ODbL 1.0.

## Frame, dimensions and provider ownership

Local `(0,0,0)` is `[-84.38556, 33.7725]`, real metres, east/up/south. Grade is rigid `y=0`; no altitude, Mercator scale or DEM elevation is baked in. Plan geometry is transformed directly from mapped coordinates. South temple frontage control points `[-5.89,18.02]` and `[16.65,17.81]` local metres establish its approximately east-west axis; eastern storefront control points `[50.43,17.49]` and `[53.61,-22.05]` establish the Peachtree skew. Rotation is already exported; host rotation must not be repeated.

| Dimension | Value | Basis |
| --- | --- | --- |
| Theater mapped east-west envelope | approximately 115.2 m | OSM outer way |
| Theater mapped north-south envelope | approximately 63.7 m | OSM outer way |
| Large dome horizontal diameter | approximately 10.1 m | mapped roof part 1341948181 |
| Smaller dome diameters | approximately 5.6 m | mapped roof parts 1341948179/80 |
| Auditorium upper roof | 23.8 m | estimated from photographs/OSM six-level part |
| Temple parapet | 22.4 m | photographic estimate/OSM five-level part |
| Large dome spring/rise | 24.6 / 7.7 m | photographic estimate |
| Highest finial | 32.8 m | photographic estimate; no published height found in supplied facts |
| Peachtree minaret tops | 29.0 / 26.3 m | photographic estimate |
| West corner tower | 32.2 m | estimate; mapped seven-level tower |
| Storefront parapet | 9.3 m | photographic estimate |
| Blade face | 3.1 × 17.8 m | photographic estimate |

All 13 mapped ways/parts that the model owns are listed: theater 208355446; tower 1341948178; domes 1341948179/80/81; volume/roof parts 1341948182/85/86/87/88/89/90; Marquee Club 208355679. Neighboring Georgian Terrace, Hotel Indigo, hotels, condominiums and parking structures are excluded. The marquee and sign intentionally overhang the mapped building outline over the sidewalk by approximately 4 m; they are elevated attachments, not plaza/road ownership. No ground pad mesh is authored. Terrain datum/pad coverage and provider masking require separate in-app verification.

## Authoring and approximations

The kit builds mapped polygonal wall volumes, actual alternating masonry courses, indexed facade panels, arched openings, octagonal lantern piers, low-segment lathed domes, interlaced dome ribs and geometry-only lettering. All compatible geometry is merged by eight named materials; duplicate position/normal tuples are welded before export. No UVs or unused building lift attributes ship. Near/far keep all domes, open eastern lanterns, actual recessed entry, storefront bay rhythm, minarets, sign lettering and marquee. Near adds finer rib spacing, canopy bulbs, storefront mullions, minaret arches and rooftop service units. Dark palette dims masonry and leaves `sign` material self-lit, covering the FOX lettering, border and marquee underside.

Fine carving, terracotta joints, complete portal tracery, the ornate sign crown, retail logos, changing digital marquee content, precise rear window layout and detailed rooftop equipment are simplified. Rear windows and all architectural heights are estimates rather than measured facade surveys. The large onion dome lattice is an original coarse geometric interpretation of the photographed tile pattern.

## Verification and handoff

Rebuild: `pnpm build:top-cities-landmarks fox-theatre-atlanta --no-check`.
Focused tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/fox-theatre-atlanta/fox-theatre-atlanta.test.js`.
Catalog: `node scripts/asset-catalog.mjs`.
Depth table: `node scripts/landmark-depth-layers.mjs --ids fox-theatre-atlanta`, followed by the same command with `--check`.

Initial source contact sheet: `tmp/top-cities/shots/fox-theatre-atlanta/source/fox-theatre-atlanta-procedural-near-light-sheet.jpg`, viewed overview/front/Peachtree/rear/roof/sign detail. This prompted a narrower real entry with large outer arched surround, smaller lower side entrances, a stronger interlaced dome pattern and rectangular storefront glazing below narrow upper arched rows. Final exported contact sheet, measured costs and check outcomes follow.

| Mode | Status |
| --- | --- |
| Cityscape | Not tested yet, integration is checked separately |
| Full 3D world | Not tested yet, integration is checked separately |

Export readiness does not establish terrain or application integration. Hardware performance has not been measured.

## Final exported evidence — 2026-10-11

Viewed `tmp/top-cities/shots/fox-theatre-atlanta/exported/fox-theatre-atlanta-final-reference-contact.jpg` against the two attributed photographs. Its twelve tiles, in reading order: Ponce reference, Peachtree reference, near/light front, near/light sign detail, far/light front, far/light detail, near/dark overview, near/dark detail, far/dark overview, far/dark detail, near/light rear, near/light roof. The final GLBs preserve the paired minarets, patterned onion/shoulder domes, distinct entry and storefront bays, legible FOX lettering and self-lit blade/marquee in both LODs. Far O lettering and arches are more angular; the blade crown is simplified. The broad auditorium roof and rear window layout remain coarse mapped massing with photographic estimates rather than surveyed ornamentation.

Per-variant sheets and all six near/light inspection views are alongside the combined reference contact sheet under the same `exported/` directory. Initial source comparison and final exported comparison were both visually inspected. No app screenshots are claimed.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 27,373 | 8 | 1,098,924 | 1,073 |
| far | 9,239 | 8 | 425,092 | 415 |

The measured default scenes fit the building budgets. After inspection, far facade curves were reduced while keeping every storefront and rear window bay; final near/far bounds differ by less than 0.12 m. A minaret shaft overlay/depth cycle was corrected by replacing its overlaid brick collars with actual alternating wall courses; far portal trim clearance was increased. Degenerate triangles were removed and normals normalized before final exports.

Validation: all 386 tests from the specified city conformance plus six landmark tests pass; catalog validates 266 entries / 452 GLB variants on the final retry; final depth generation reports zero dropped cycle edges and its scoped freshness check passes. `tmp/top-cities/fox-theatre-atlanta/tests.log` records the focused run; `tmp/top-cities/fox-theatre-atlanta/metrics.json` records deterministic exported QA with no issues, zero coplanar overlaps, zero removable lift bytes, no far-window loss, on-grade bounds and 0.5% near backface ray hits. Sign bracket tests verify both endpoints against their named masonry/blade surfaces and reject an intentionally free endpoint. App/terrain integration and standalone preview publication remain separate lead steps, as required by the shared-tree brief.

## Independent-review fix — 2026-10-12

Khaki brick was replaced by muted red-brown: day #95866e → #85604e; night #49443c → #49352d. Buff stone, separate alternating course geometry in both LODs, dome/minaret massing, arcade, geometry-only FOX lettering and attached marquee remain. There was no proved provider overlap; the lead recaptures the occluded frontage/base in both modes.

Exported GLB contact sheets in `tmp/top-cities/shots/fox-theatre-atlanta/review-fix/` were inspected: overview, Ponce facade, Peachtree frontage and blade/marquee detail (near/light); facade and detail (far/light and near/far dark). The dossier exterior reference sheet and prior `tmp/next-200/qa/b1/sheets/fox-theatre-atlanta.jpg` were compared. One look-fix iteration was used; the changes preserve recognisable near/far features. Static sheets do not establish runtime flicker or terrain integration.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 27,373 | 8 | 1,098,924 | 1073.2 |
| far | 9,239 | 8 | 425,092 | 415.1 |

Final combined prescribed run passes 411/411 tests (three landmark test files plus `top-cities.test.js`); log `tmp/top-cities/bank-of-america-plaza-atlanta/review-fix-tests.log`. Scoped deterministic QA reports no issues, no close-layer/coplanar defects, retained far window rhythm and 0.5% near backface hits; report `tmp/top-cities/bank-of-america-plaza-atlanta/review-fix-metrics.json`. Scoped depth generation and freshness check pass with zero dropped cycle edges; `cycles.json` is empty. The global catalog and preview checks currently encounter another builder's missing `docs/3d-top-cities-vulcan-statue.md`; final retry status is in the handoff report.

Cityscape and Full 3D world remain **not verified by this worker**: the review's existing app evidence is insufficient for the new exports. Fresh unobstructed application shots, shared-material appearance, provider/terrain contacts and independent re-review are lead-owned. No provider ids/rings, shared renderer logic, Git state or app server was changed. Earlier export/check narratives above are historical and superseded by this section.
