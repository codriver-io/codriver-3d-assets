# AT&T Building / 333 Commerce, Nashville

Original procedural asset `att-building-nashville`, representing the 1994 Batman Building at 333 Commerce Street, Nashville, Tennessee. The nickname refers to the two tall pointed ears above the broad glass crown. The model preserves those ears, the folded trapezoidal crown, pale stepped corner piers, blue-black vertical glazing and connected brick winter garden. Editable source lives in `src/peregrine/landmarks/top-cities/att-building-nashville/`; build with `pnpm build:top-cities-landmarks att-building-nashville --no-check`.

## Sources and rights

- [Wikipedia: 333 Commerce](https://en.wikipedia.org/wiki/333_Commerce), checked 2026-10-12: architectural spire 617 ft / 188.1 m, occupied roof 452 ft / 137.8 m, 33 storeys, completed September 1994, Earl Swensson Associates, three-storey winter garden. The supplied dossier rounds height to 188 m.
- [Official building site](https://www.333commerce.com/), checked 2026-10-12, establishes the current 333 Commerce identity. The stable asset ID retains the familiar former AT&T name. Corporate lettering is omitted.
- Supplied OSM dossier `tmp/top-cities/att-building-nashville/{osm.json,osm.txt}`: [outline 130910785](https://www.openstreetmap.org/way/130910785), [tower 465454851](https://www.openstreetmap.org/way/465454851), ridge part 1311381715, spires 1307887852 / 1307887853, winter garden 591983690, annexes 1311381713 / 1311381714 / 591973495 / 1311381711 / 1311381712. All eleven are registered as replaced parts; neighbouring Commerce Center way 267485081 is excluded. Geographic data © OpenStreetMap contributors, ODbL 1.0.
- [Telephoto facade / crown photograph](https://commons.wikimedia.org/wiki/File:333_Commerce_Street_(formerly_AT%26T_Building)_-_Nashville,_TN.jpg), Quintin Soloviev, CC BY 4.0; Commons file licence checked. This anchors crown, stone wing and spire proportions.
- Warren LeMay's Commons photos, “AT&T Building, Commerce Street and 3rd Avenue, Nashville, TN,” images [54385436310](https://commons.wikimedia.org/wiki/File:AT%26T_Building,_Commerce_Street_and_3rd_Avenue,_Nashville,_TN_(54385436310).jpg), 54385062416, 54384181982, 54384181782 and [54385435835](https://commons.wikimedia.org/wiki/File:AT%26T_Building,_Commerce_Street_and_3rd_Avenue,_Nashville,_TN_(54385435835).jpg), CC BY-SA 2.0 as recorded in the dossier's `refs/SOURCES.txt`: winter garden, opposite-side and low-angle comparisons.

Reference photos remain under ignored `tmp/`; none is committed or embedded. The mesh is original procedural geometry, without a traced mesh, scan or texture.

## Metric frame and dimensions

Origin `[-86.7769592, 36.1624127]` is the fitted tower centre, offset from the article's approximate coordinate. +X east, +Y up, +Z south; y=0 is rigid local flat-map grade. The long crown axis is bearing 107 degrees. OSM control points `[-86.7772426,36.1625187]` and `[-86.7766699,36.1623729]` establish the mapped ridge direction, approximately 107 degrees. The rotation is baked into source vertices and both GLBs; no host rotation, terrain elevation or Mercator stretch is baked in. The winter-garden frontage faces approximately 197 degrees.

| Quantity | Model | Basis |
| --- | --- | --- |
| Architectural height / two tips | 188 m | Sourced: 188.1 m published, 188 m dossier / OSM |
| Occupied roof / eave | 138 m | Sourced: 137.8 m published, OSM part 138 m |
| Occupied storeys | 33 | Sourced; near facade draws 33 rows above a 6 m podium |
| Main tower plan | About 65 × 40 m, chamfered ends | Exact mapped tower polygon, not a square extrusion |
| Glass crown ridge | 161 m | Estimated from telephoto photograph |
| Stone ridge screen | 158–164 m, 55 × 5.1 m | Estimated from photographs |
| Spire centres | u=±27.7 m on the ridge | Fitted to mapped spire parts and photographic symmetry |
| Spire tiers | 138–166 / 166–169 / 169–173 / 173–180 / 180–188 m; widths 4.6 / 3.7 / 2.9 / 1.9 / 0.24 m | Estimated; all tiers touch the tier below |
| Stepped stone wing tops | 88 / 110 / 130 m | Estimated from photographs |
| Window rows | 4 m near; approximately 8.8 m far | Estimated grid, retaining individual cells in both LODs |
| Brick podium and annex | 6 m base, 9 m garden wall, 16 m garden ridge, 12 m side parts | Estimated heights on exact mapped outlines |

## Geometry and materials

Seven merged materials: subdued grey-beige stone, blue-black glass, blue-grey crown glazing, brown brick, grey roof, muted metal and sparse lit office cells. Dark palette dims the structure; `glow` cells are self-lit at night. Night occupancy is a deterministic estimate, not a reproduction of any recorded lighting programme.

Facade openings replace the stone/metal wall cells with glass in a tessellated shell. There are no glass decals laid over a backing face. Crown panes and mullion tiles similarly partition the surface. Indexed shared vertices reduce bytes while preserving flat normals. The crown is a two-sided gable clipped to the mapped chamfered plan; both gable ends are closed. The stone ridge screen and stepped spires are solids. The complete mapped low annex is included to avoid leaving provider parts behind.

The winter-garden roof is simplified and lacks its fine mullion grid; the brick podium is a coarse mapped reconstruction. Omitted: AT&T logo/lettering, landscaped plaza, underground parking, window reflections and fine rooftop machinery. The exact occupied floor arrangement and spire internals are not reproduced.

## Export costs and authoring verification

| Variant | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 34,690 | 7 | 1,177,876 | 1150.3 |
| Far | 7,619 | 7 | 279,360 | 272.8 |

Both variants meet the building limits, retain identical bounds, have normals and contain no textures or road attributes. Costs are measured from exported default scenes, not Tesla hardware timings.

Evidence inspected locally:

- Dossier `tmp/top-cities/att-building-nashville/refs-sheet.jpg` and full telephoto `refs/1.jpg`.
- Initial GLB near/light facade, back, roof, crown, entrance and street contact sheet under `tmp/top-cities/shots/att-building-nashville/near-light/`: prompted wider pale stone piers and subtler central horizontal mullions.
- Final reference comparison `tmp/top-cities/shots/att-building-nashville/export-reference-contact.jpg`: photographs beside facade, back, crown and entrance views for exported near/far and light/dark. Final sheets and individual PNGs are under `final-{near,far}-{light,dark}/`.
- Plan view `final-plan/att-building-nashville-glb-near-light-top.png` and final roof/street source comparison: mapped rotation and complete annex envelope checked.

The first far pass used 12 m rows; deterministic QA flagged tall window cells. The final far uses approximately 8.8 m rows, preserving separate bays and rows. Night cells were changed from a visible regular diagonal pattern to an irregular deterministic distribution. Depth generation reports zero dropped cycle edges. Focused tests pin both 188 m tips, open sky between the ears, sloped glazed crown, named lower-tier contact with a raised/free-end negative control, footprint containment, excluded neighbour, LOD envelope and GLB round trip.

## Integration handoff

| Mode / case | Status |
| --- | --- |
| Cityscape / flat app placement | Not tested yet; integration is checked separately by the lead |
| Full 3D world / terrain and foundation fit | Not tested yet; integration is checked separately by the lead |
| Provider replacement, terrain arrivals, reanchor and lifecycle | Not tested in app |
| Road fitting / vehicle deck contacts | N/A: office building, no road layer |
| Actual device performance | Not measured |

The asset stands on a rigid base. The lead must inspect foundation and podium contacts, pad edges, neighbouring roads, complete owned-building replacement and shared runtime shading in both app modes before certifying placement. Inspector/contact-sheet approval alone does not establish terrain integration. No app server, renderer build, deployment or shared registry change was performed for this asset.

Final check results (2026-10-12): six landmark-specific tests and all three AT&T conformance cases passed; the requested combined run completed 470/473 tests, with unrelated failures in High Museum of Art (76,308 near triangles against the 60,000 limit) and Jefferson Memorial (degenerate footprint and missing manifest during authoring). Catalog validation was attempted twice and reached only the unrelated unregistered `high-museum-of-art-far.glb` failure. This asset's source/docs/record/manifest and both GLBs passed the catalog record loop before that global orphan check. The dedicated metrics report `tmp/top-cities/att-building-nashville/metrics.json` has no issues, zero coplanar/layered faces and zero near back-face hits; the depth check reports current for this asset with zero cycle edges dropped. Other builders' files were not changed or awaited.

## Independent-review correction, 2026-10-12

Replaced the fine stone checkerboard with broad grouped vertical piers and thin spandrels; near has three subordinate panes per band and far one coarser discrete pane. Kept the stepped wing heights, folded glass crown and both 188 m tips. Widened the full-facade camera so both tips are framed; comparison now uses dossier refs/1.jpg rather than the unrelated aerial batch tile.

Inspected exported near/light and far/dark sheets at `tmp/top-cities/shots/att-building-nashville/review-fix-final/att-building-nashville-glb-{near-light,far-dark}-sheet.jpg` against the dossier references and b6a review. The sheets show the corrected feature, opposite facades and complete main silhouette; ornament remains a photographic approximation. No more than two look-fix rounds were used.

Current validation supersedes earlier concurrent-build exceptions: the combined registry and four-landmark run passes **506/506 tests**, including the graded-lawn and pointed-dormer regressions. Exported geometry QA reports all four on budget with no issues. Depth regeneration/check passes with **zero dropped cycle edges**; the shared generated table may be overwritten by concurrent workers, so the lead regenerates all IDs before commit. `node scripts/asset-catalog.mjs` validates 286 records / 560 GLB variants and `pnpm assets:preview` builds the ignored local catalog.

Cityscape and Full 3D world remain **not tested by this correction worker**. The independent review inspected pre-correction app captures, but new unobstructed app shots, shared runtime shading, provider ownership and Jefferson's graded perimeter/terrain-pad contact are the lead's required recapture and re-review gates.
