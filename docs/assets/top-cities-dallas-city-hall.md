# Dallas City Hall — original procedural landmark

Dallas's current City Hall at 1500 Marilla Street, the 1978 I. M. Pei / Harper and Kemp building, not the earlier Dallas Municipal Building and not its fictional enlarged RoboCop version. The road-distance identifiers are the very long, buff-concrete inverted pyramid, inclined north glazing, triangular end walls with stepped south cantilevers, three round stair pylons, and the plaza's circular pool. The three roof vaults and abstract three-piece sculpture remain in both LODs.

## Sources and dimensions

- [National Park Service, HABS TX-3325](https://tile.loc.gov/storage-services/master/pnp/habshaer/tx/tx0500/tx0564/data/tx0564data.pdf): 560-foot length, 122-foot height, seven office floors, 34-degree north slope, buff cast-in-place concrete, south sun screens and three roof vaults.
- [Pei Cobb Freed & Partners](https://www.pcf-p.com/projects/dallas-city-hall/): architect project facts, 180-foot pool, north slope, transverse and longitudinal sections. Sections were inspected to distinguish the continuous north incline from the discrete cantilevers at the longitudinal ends.
- [OSM way 27129838](https://www.openstreetmap.org/way/27129838), dossier snapshot: civic building with seven levels; complete provider outline, including upper cantilevers. No additional building parts appear in the supplied extract. Derived data © OpenStreetMap contributors, ODbL 1.0.
- [Wikipedia](https://en.wikipedia.org/wiki/Dallas_City_Hall): identity, stair-cylinder role and plaza sculpture dimensions. Photo 3 in the dossier is an interior and was not used as an exterior elevation.

| Property | Model | Basis |
| --- | --- | --- |
| Full length | 170.688 m (560 ft) | HABS, PCF&P |
| Overall top | 37.1856 m (122 ft) | HABS; mechanical bookends establish the top |
| North lean | 34° from vertical, toward plaza | HABS, PCF&P; baked continuous plane |
| Main roof / glazing rows | 33.4 m / seven | Roof level estimated; storey count sourced |
| Glazing rows above ground | approximately 4.4 m pitch, broad 1.5 m concrete floor bands | Estimated from exterior photos and sections |
| Long-axis bearing / facade | 75° / 345° | Mapped control points, below |
| Upper depth | 52.93 m | Mapped envelope / photographic fit, not the published clear-bay depth |
| South end-wing growth | half-width 62 m at grade to 85.344 m at roof | Estimated from sections and exterior end photo |
| Cylindrical pylons | three, 6.2 m diameter, grade to roof | Count sourced; diameter and placement estimated |
| Roof vaults | three, radius 3.65 m, length 27 m | Count sourced; dimensions estimated |
| Pool | 54.864 m (180 ft) diameter | PCF&P; centre and rim detail estimated |
| Sculpture | three original rounded fin, hook and open-C forms on one low plinth | Approximation of the landmark group; no exact sculpture mesh copied |

Origin `[-96.796935, 32.776255]` is near the centre of the mapped roof envelope, rather than the dossier's approximate Wikipedia anchor in the forecourt. The long mapped edge from `[-96.7979132, 32.7763093]` to `[-96.796121, 32.7767121]` runs approximately 75° from north; the opposite long edge provides a second direction check. Authoring coordinates u/v are rotated +15° about Y into east/up/south, baked into each exported mesh. The host must not rotate again. The top view was inspected against the red complete OSM ring and both LODs pass vertex containment for all building materials with the layer's 0.8 m ownership slack.

## Geometry and materials

The north plane expands toward negative v with height. Each of seven window rows is subdivided into individual panes (16 per structural bay near, five far), bounded by concrete uprights and horizontal bands. Glass replaces the wall surface and lies 0.7 m inside a genuine pocket with sill, soffit and returns. South glazing is recessed 0.9 m and the end wings expand with successive floors. The glass rhythm remains in far; it is not collapsed into one unbroken band. All shapes are original parameterized Three.js geometry batched by material.

Seven subdued materials in both palettes: `concrete`, `glass`, `joint`, `paving`, `water`, `bronze`, `glow`. Only a few ground-floor door panes use `glow`; night lighting is restrained. Solid end walls and mechanical bookends use off-white/buff concrete; board texture and tiny construction joints are not tessellated. No photograph or texture enters a GLB.

Three round pylons run from grade to the roof and intersect the inclined envelope. The tests extract the two broad horizontal roof triangles as the named support, excluding pylon caps, and test each terminal in both LODs; a shortened-end case fails. These are visual stair pylons, not a claim that they carry the building's cantilever loads. Roof vault shells end on the roof, with closed end caps. Plaza pavement has a real circular opening for the pool rather than a backing plane beneath water, avoiding conflicting material depth order. Pool water and its annular rim meet without overlaid lids. Three distinct abstract vertebral forms stand on one low plinth: an upright cupped fin, a low sweeping hook and a broad open C. The profiles have different heights and orientations, rounded bevels and welded smooth normals. Each local toe is aligned from its measured geometry bounds to the plinth top at y=0.46 m, in both LODs.

Only the civic building's mapped ring masks provider extrusions. Pavement, pool and sculpture extend into the forecourt as ground/site details; they are not building ownership rings and do not authorize removal of surrounding buildings. The ground reference is rigid local y=0, with no sea-level elevation, terrain deformation or latitude stretch baked into the exports. `padM=138` is a provisional level-site placement hint; terrain, road edges and forecourt pad coverage require the separate Full 3D world gate.

## Cost and verification

| LOD | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| near | 15,384 | 7 | 1,080,744 | 1055.4 |
| far | 5,824 | 7 | 403,788 | 394.3 |

The source and GLB bounds agree in conformance tests. The landmark-specific tests pin length and top, north lean by outside-in raycasts, seven rows and floor bands, real glass recesses, the three grounded cylinders and roof contacts with a shortened-end negative case, stepped-end negative space, complete mapped building containment, pool diameter, three roof vaults and identical far silhouette. Both LODs remain within the 60k/14/2.5 MB and 12k/8/500 KB caps.

Before review fixes: near 14,952 / 7 / 1,152,728 bytes; far 5,488 / 7 / 424,928 bytes. Welding the sculpture's bevel/side vertices makes both exports smaller despite the additional rounded form detail. Existing building tests remain unchanged; a ninth test extracts three connected bronze components, verifies distinct heights and independently raycasts the paving support beneath every toe while excluding the sculpture.

The b1b review accepted the building and asked for distinct rounded sculpture profiles instead of identical punched blocks. First look-fix iteration varied the pierced profiles; the second used an [Adapt/re:Adapt conservation photograph](https://www.adaptreadapt.com/art-conservation/recent-work-sculpture) to replace them with open concavities, a fin, hook and C silhouette, stronger rounding and muted bronze. The photograph is `tmp/top-cities/dallas-city-hall/refs/adapt-vertebrae-after.jpg`, title “Vertebrae in Three Pieces — After Conservation”; photographer is unspecified and no redistribution licence is stated, so it is rights-reserved reference only and never shipped. This is an original road-distance approximation, not an exact reproduction or traced mesh.

Final day exported evidence: `tmp/top-cities/shots/dallas-city-hall/review-fix-2/contact.jpg`, assembled from `dallas-city-hall-glb-{near,far}-light-sheet.jpg` in that folder; overview, driver-height entrance and the new sculpture detail view show the differing open profiles and plinth contact in both LODs. Night evidence uses the corresponding dark sheets in the same folder. Building lean, stepping, bands, pylons, roof and provider replacement are preserved. Original dossier/reference and section evidence remains under `tmp/top-cities/dallas-city-hall/`.

Geometry QA and depth regeneration/check report no issues, no coplanar or layered candidates, zero back-face sweep hits, and zero dropped material-cycle edges. Metrics are in `tmp/top-cities/mercedes-benz-stadium/review-fix-metrics.json` (both assigned ids); requested conformance plus both landmark tests are in `tmp/top-cities/mercedes-benz-stadium/review-fix-tests.log`, with final counts in the fix report. Focused commands: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/dallas-city-hall/dallas-city-hall.test.js`; `node scripts/asset-catalog.mjs`; `node scripts/landmark-depth-layers.mjs --ids dallas-city-hall --check`. Export through `pnpm build:top-cities-landmarks dallas-city-hall --no-check`.

## Approximations, rights and integration

The roof level, window mullions, cylindrical diameters, end-wing growth and forecourt layout are estimated. The large simplified end walls omit subtle formwork courses; south sun control is represented by recessed glazing and concrete ledges rather than every original screen. The interior great court, roof services, trees, flagpoles, pool sculptures and fountain jets are omitted. The Henry Moore group uses three distinct original rounded organic fin/hook/C volumes as a road-distance cue, without reproducing its exact sculptural surfaces. Hardware performance is unmeasured.

Reference photographs remain in ignored scratch only: Michael Barera, aerial (CC BY-SA 4.0); Kent Wang, plaza and interior (CC BY-SA 2.0); Daquella manera, west-end (CC BY 2.0). PCF&P project photographs and sections are rights-reserved visual references, credited to Balthazar Korab Ltd./PCF&P/Nathaniel Lieberman on the project page, and are neither committed nor shipped. The mesh is original, not a scan or traced external mesh. Geographic data licensing is separate from original source/model rights.

Cityscape: **not tested yet**, integration is checked separately. Full 3D world: **not tested yet**, integration is checked separately. Provider replacement, shared vertex shading, late terrain arrival, pad edges, lifecycle/theme/LOD transitions and actual hardware need unobstructed app captures and lead/independent review.

Final review-fix checks: **406/406** requested conformance plus both landmark tests pass; catalog/assets check validates 266 entries / 472 GLB variants, and `pnpm assets:preview` builds the local ignored catalog. Full fix report: `tmp/top-cities/mercedes-benz-stadium/review-fix-report.md`.
