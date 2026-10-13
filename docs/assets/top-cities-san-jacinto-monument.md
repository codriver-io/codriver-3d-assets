# San Jacinto Monument

Original procedural model of Alfred C. Finn and Robert J. Cummins' 1939 monument,
1 Monument Circle, La Porte, Texas. Source folder:
`src/peregrine/landmarks/top-cities/san-jacinto-monument/`.
The octagonal, tapered, fluted Texas limestone shaft and faceted Lone Star are the
identity. The model includes the observation windows, stepped crown, relief
pedestal, museum base, bronze entries, mapped terraces, forecourt and stairs.
Contract: [top-cities landmarks](../top-cities-landmarks.md).

## Sources and dimensions

| Element | Model | Basis |
| --- | --- | --- |
| Highest star tip | 172.916088 m (567.31 ft) | [Museum](https://www.sanjacinto-museum.org/Discover/Monument/) |
| Star height | 10.3632 m (34 ft), 220-ton real finial | Museum |
| Shaft base width | 14.6304 m (48 ft) | [Original contractor, Bellows](https://bellowsconstruction.com/?project-details=san-jacinto-monument) |
| Observation-level width | 9.144 m (30 ft) | Bellows |
| Star-support width | 5.7912 m (19 ft) | Bellows |
| Museum width | approximately 38.1 m (125 ft) | Bellows; mapped plan about 38 × 38 m with clipped corners |
| Museum roof | y=10 m | OSM building part 41290215 height tag |
| Platform heights | 0.5, 0.75, 1, 1.5, 2.25, 3 m | OSM part height tags |
| Relief pedestal | y=10–18.5 m, 16 m across | estimated from photos and mapped shaft base |
| Long fluting | y=21–150.5 m | photo estimate; geometrically recessed 0.3 m |
| Observation windows | 3 per broad face, 0.48 × 1.2 m, y=151.7–152.9 m | estimated from closeup; actual recessed openings |
| Crown | y=154.8–165.35 m | photo estimate; partly embedded in star |
| Doors | 2.8 × 4.2 m, bottom y=3 m, 0.3 m inset | estimated from photos; four broad museum faces |
| Axis | northeast face bearing 25.2° | mapped edge control points below |

Primary museum information also establishes Cordova shellstone, eight carved
history panels, and the April 20–21, 1939 dedication. Height follows the museum's
567.31 ft value rather than Bellows' rounded 570 ft.

## Frame, footprint and foundations

Origin `[-95.080704525,29.74985375]` is the mapped star-support centroid (way
257767770). East/up/south metre axes; local y=0 is grade beneath the stepped site.
The facade orientation is baked by a −25.2° Three.js Y rotation. Control points on
the museum northeast face are `[-95.080761,29.7500694]` and
`[-95.080481,29.7499524]`; the perpendicular face normal points northeast.
No horizontal scale adjustment, geographic stretch, absolute altitude or DEM
heights are baked into the export.

All 33 provider building/part ways in the prepared dossier are listed in
`OSM_WAYS`, including the monument outline 257767763, museum 41290215, shaft
facets 257767765–257767777, pedestal 257767778, platform 257767764, forecourt
41252819, and the small stairs/landing parts. Exact rings are retained except the
two tiny stair parts 607470127 and 607470130: each has a bounded rectangular
replacement envelope expanded about 0.3 m so its area clears the catalog's 4 m²
minimum. These are modeled stairs, not neighboring provider buildings.
Collinear museum-edge midpoints are simplified within 0.18 m for door placement.

Every stair has clipped ascending treads and risers ending on the next terrace.
The broad base is rigid, with no below-grade geometry. `padM=88` is a placement
handoff, not terrain certification; forecourt and terrace DEM contacts and pad
coverage require app review. No runtime layer, roads or shared renderer were
changed. Cityscape: **not tested yet**. Full 3D world: **not tested yet**.

## Geometry and materials

Four merged material draws per LOD: subdued buff `stone`, dark `bronze`, and
observation `glass`, and a subdued `stone_recess` tone on the actual flute floors. No textures, scanned or traced mesh, copied inscription or
external dependencies beyond Three.js and assetBuilder. The dark palette dims
limestone and bronze; the observation glass remains subdued, with no invented
self-lit crown or facade lights.

The octagonal shaft is lofted through notched rings, giving real recessed flutes
and clipped corners. Far retains the silhouette, windows and doors, uses fewer
flutes and stair treads, and omits the small relief figures and inscription rhythm.
Both LODs have punched observation and door openings with stone reveals and
recessed panels. Far has no surface overlays. Stone reliefs use grouped bodies and
heads, with each head touching its torso; these are silhouettes, not replicas of
the historic carvings. Near's shallow stone blocks suggest inscription rhythm
without manufacturing readable historical text.

The original nine-point three-dimensional finial is approximated by two
perpendicular diamond-section five-point stars sharing their zenith. This keeps a
Lone Star in both axial views and nine outer tips. It is an original geometric
approximation, not an exact reconstruction of the historical compound facets.
The crown reaches into the lower central notch so the star is supported.

## Omissions and rights

The separate reflecting pool, landscape, six flags, interior and literal
inscriptions are omitted. The pool is about 533 m long and is outside this
building replacement envelope. The shared Overpass helper's supplementary water
query timed out on all endpoints; no invented pool footprint is registered.

References kept only in ignored `tmp/top-cities/san-jacinto-monument/refs/`:
Crystal Akers' engraved-panel photo (CC BY-SA 3.0), Jim Evans' battlefield view
(CC BY-SA 4.0), Tijuana Brass' full-monument and star-detail photos (public domain),
and Louis Vest's fog view (CC BY 2.0). The museum's monument cutout illustration
is a reference only, copyright its owner/all rights reserved. Photo links and
credits appear in the catalog record. No photograph or reference illustration is
redistributed in the GLBs. Mapped plans are © OpenStreetMap contributors (ODbL
1.0); original procedural geometry follows the repository asset licensing.

## Verification

Inspected the dossier `refs-sheet.jpg`, `refs/5.jpg` (star closeup), and museum
`refs/6.png` reference illustration. The source contact sheet is
`tmp/top-cities/shots/san-jacinto-monument/san-jacinto-monument-procedural-near-light-sheet.jpg`
(front, back, overview, roof, entrance and star). The first look led to wider
geometric flutes, correction of the diagonal relief radius, and a crown extension
into the star notch. Metric review found layered door/window faces; those were
replaced with actual openings and recessed panels in both LODs.

Exported GLB evidence is under `tmp/top-cities/shots/san-jacinto-monument/`:
`san-jacinto-monument-glb-{near,far}-{light,dark}-sheet.jpg` and
`san-jacinto-monument-glb-near-light-plan.png`. The four sheets show front, back,
roof, entrance, star and overview. The plan checks baked orientation against red
provider rings. A combined reference/GLB contact sheet is `comparison.jpg`.

Landmark tests pin the published apex, grade, taper by raycast, geometric flute
recesses, separate observation windows, star height/arms/negative space, crown
continuity, museum door and provider ownership. Source-to-GLB bounds and budgets
are checked by the focused top-cities conformance test. The depth table is
regenerated for this ID; material cycles must be empty. Neither inspector QA nor
catalog readiness establishes app integration or Tesla hardware performance.

## Export costs and final checks

| LOD | Triangles | Draws | GLB bytes | KiB |
| --- | --- | --- | --- | --- |

| near | 4853 | 4 | 235904 | 230.4 |
| far | 1852 | 4 | 97556 | 95.3 |

Both LODs are well inside the 60k/14/2.5 MB and 12k/8/500 KB caps.
Final metric review reports zero layered faces in both LODs, zero coplanar
cross-material area, 0% backface hits in the near sweep, no unused bridgeLift,
and no window-rhythm or unsupported-member flags. Depth-layer generation drops
zero cycle edges and the ID-scoped check passes. Final geometry inspection added
a subdued limestone shadow tone to the actual flute floors so vertical grooves
read at driving distance; there is no hidden solid shaft behind those faces.
The final combined reference/GLB sheet and north-up plan were inspected: tapered
octagon, Lone Star, crown contact, recessed windows and museum doors, and aligned
terraces remain present in both LODs. Exact star facets and relief narratives are
approximated as described above. App review and independent reviewer signoff are

Focused final conformance run: 613 tests, 612 passed; the sole failure was another
worker's `tour-montparnasse` source/GLB bounds mismatch during active editing.
All three San Jacinto conformance assertions and all five landmark-specific
geometry tests passed; an ID-filtered repeat passes all eight. The first combined
run before the final palette-only refinement passed all 612 then-current tests.
The final global catalog retry passes: 336 entries and 628 GLB variants;
output is recorded in `tmp/top-cities/san-jacinto-monument/catalog-check.txt`.
Earlier failures were caused by the other worker's not-yet-written Tour
Montparnasse documentation and cleared once that worker completed its record.
Own manifests, catalog and source/GLB
bounds pass the ID-scoped conformance tests. Catalog preview and app bundle/app

