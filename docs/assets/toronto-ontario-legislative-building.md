# Ontario Legislative Building (Toronto)

Stable asset ID: `ontario-legislative-building`. Original procedural exterior of the Legislative Building at Queen's Park (111 Wellesley Street West), the "Pink Palace": Richard A. Waite's Richardsonian Romanesque building of 1886-1893, the west wing rebuilt and raised by E. J. Lennox after the fire of 1909, and G. W. Gouinlock's free-standing north block (1909-13). Not the Ontario Legislature's interiors, the chamber, the Whitney Block across the road, the grounds or the statues. Contract: [3d-toronto-landmarks.md](3d-toronto-landmarks.md).

## Identity and sources

Consulted 2026-09-29:

- [Wikipedia: Ontario Legislative Building](https://en.wikipedia.org/wiki/Ontario_Legislative_Building): architects, dates, five storeys, pink Credit Valley sandstone, asymmetry of the south face after 1909 (a pyramidal-roofed east wing against a raised, long-gabled west wing), the U-shaped plan with two arms turning north around a courtyard, the 1909 block standing in it.
- [Legislative Assembly of Ontario, historical overview](https://www.ola.org/en/visit-learn/parliament-government/legislative-building/historical-overview) and [ACO Toronto](https://www.acotoronto.ca/building.php?ID=2262): Vermont slate roofs, copper domes, carved stone, rebuilt west wing.
- OpenStreetMap, retrieved through the shared Overpass queue: **way 15089986** (`building=public`, sandstone, 203 nodes, ~8 800 m2), **way 960958887** (front steps) and the **`building:part` ways 960958805-960958889** (towers, domes, the octagonal central roof, wings, arms, pavilions, porches, bays, stacks) with `height`, `min_height`, `roof:shape` and `roof:height`. Derived coordinates © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright).
- Wikimedia Commons photographs, downloaded to ignored `local-scratch/ontario-legislative-building/refs/` only, to compare (nothing from them is in the repository or the GLB): *South view* (DXR, CC BY-SA 4.0), *Ontario Legislative Building in Toronto* (Joli Rumi, CC BY-SA 4.0), *North facade ... DSC00224* (Daderot, CC0), *View from north-east* and *View from north-west* (Sarbjit Bahga, CC BY-SA 4.0), *Ontario Legislature viewed from UC Tower, 1987* (A J Butler, CC BY 3.0).

No published height or plan dimensions were found (Wikipedia, the Assembly, ACO, Ontario Heritage Trust, Wikidata). **All heights and plan dimensions are therefore the OSM mapper's**, cross-checked against the photographs (below), not surveyed.

## Frame

Real metres, **+X east, +Y up, +Z south**. Origin `[-79.391663, 43.662569]` is the area centroid of OSM way 15089986. The mapped edges run **16.92 degrees** off the compass grid (Toronto's street grid), so the south front looks toward bearing **163** (down University Avenue); the model is authored in the building's own frame (`ontario-legislative-building-site.js`: x along the front, z toward it) and turned once by `PLAN.angle` at the end of `geometry.js`. `y = 0` is flat local grade, **not sea level**. No terrain or latitude stretch is baked in. The real building stands on a rise in the middle of the Queen's Park roundabout: the model keeps a rigid flat base (plinth 1.4 m, portico floor 0.9 m, eight steps), which is what the terrain pad and Full 3D world placement expect; the slope is not modelled.

## Dimensions

| Feature | Value | Source |
| --- | --- | --- |
| Octagonal central roof | eave 35 m, peak 60 m (finial to 63 m) | OSM parts 862-869 (`height=60`, `roof:height=24-25`); finial estimated |
| Four corner towers | 8.1-8.3 x 9.7 m plan, shaft 32 m, copper domes to 45 m | OSM parts 870-877; shaft/drum split, dome profile, finials estimated |
| Central block | 34 x 31.4 m, eave 35 m | OSM outline and parts; wall heights follow the roof eave |
| Portico | 20 m wide, 3.9 m deep, balcony 10-11 m | OSM parts 878-886; arch sizes (5.9 / 4.5 m) and heights (8.6 / 7.5 m) estimated from photographs |
| Front steps | 25 x 8 m | OSM way 960958887; tread count/rise estimated |
| West wing | eave ~21 m, flat-topped roof 34 m | OSM 839, 858, 859 |
| East wing | eave 20 m, pyramidal roof 35 m | OSM 836 |
| Pavilions | hip roofs, peak 43 m; eave 27 m (west) / 24 m (east) | OSM 832-835, 854-857; the front gables are estimated from the south photograph |
| Arms | west ridge 34 m, east ridge 30 m, eave 22 m; ~41 m long | OSM 830/831, 846/847 |
| North-end pavilions | eave 22 m, ridge 35 m | OSM 815-823, 842-845 |
| Rear pyramids / round stacks | 36 m / 49 m and 50 m | OSM 838, 840 / 805, 806 |
| North block and spine | 20 m and 18 m, flat roofs, 39 x 46 m | OSM 813, 810 |
| Overall | ~152 x 135 m, 63 m high | model bounds |
| Storey pitch, window sizes, courses, dormers, turrets, oculi | 5.1 m storeys, 1.5-1.8 m windows | estimated |

Cross-check of the OSM heights: from the south photograph (camera ~55 m from the tower fronts, at eye height) the central roof peak stands slightly above the tower dome tops and the pavilion ridges sit at ~0.7 of the peak, which is what 60 m / 45 m / 43 m give in a render from the same viewpoint (`photo-match` shot). A 35 m roof peak (my first, pre-OSM estimate) did not match.

## Model

Source `src/peregrine/landmarks/toronto/ontario-legislative-building/`: `geometry.js` (model), `ontario-legislative-building-kit.js` (roof, dome, arch and window primitives), `ontario-legislative-building-site.js` (plan rectangles and heights from the OSM parts), `config.js`, `footprint.js`, `views.js`, `ontario-legislative-building.test.js`. Build: `pnpm build:toronto-landmarks ontario-legislative-building`. Eight materials, one draw each: `stone`, `stoneDark` (plinth, turrets), `trim` (dressed stone: courses, arches, sills, balustrades), `roof` (slate), `copper` (domes), `glass`, `glow` (the three chamber windows, oculi and portico doors: lit at night in the dark palette) and `iron` (doors, portico interior).

Features present in both LODs: the octagonal slate roof with its south dormer, the four copper-domed towers with engaged turrets (the west front tower carries the rose window, the east one a balcony and arched opening), the **real three-arch portico** (holes cut through the front wall, dark interiors, balcony over), the three arched chamber windows and five oculi, the wings (west: flat-topped mansard with a row of wall dormers; east: pyramidal), the two hip-roofed pavilions with front gables and corner pinnacles, the arms and their north-end pavilions with the tall corner stacks, the two round stacks behind the chamber, the spine and the flat-roofed north block with its round bays, entrance arch and pediment, and both flank porches. The two courtyards between the arms and the north block are open air.

The engaged tower turrets are stout rock-faced piers (flared foot, course-by-course swelling in near, corbel ring, low stone cap ending below the belfry), not slender shafts. Near adds window frames (heads, sills, jambs) on every window, string courses, balustrades, pier columns, hip ridge bars, tower drum lights and rose-window spokes. Far keeps every mass, the portico openings, the chamber windows and every other window as a dark pane, without frames.

Cost (exported default scenes): **near 51 161 triangles / 8 draws / 2 602 332 bytes; far 9 128 / 8 / 418 732.** Budgets are 160 000 / 48 and 45 000 / 14. Untested on Tesla hardware.

## Approximations

- Every height is OSM's (unverified); the pavilion front gables, arcades, portico arch proportions, turret radius/height, dome profile, dormer counts and sizes, the north block's entrance bay, pediment and lions' plinths are estimated from photographs. The rock-faced masonry is not modelled (no texture); it is represented by a plinth, string courses and darker turrets.
- The wings' plan follows the OSM part rectangles; small notches and the round east bay of the north-end pavilion are simplified (a cylinder). The stair bays are cylinders. Rear chimneys, roof lights, statues, lamps, the Lieutenant Governor's drive and the roses are omitted.
- The north-face entrance bay of the 1909 block projects 1.4-2.6 m beyond the mapped outline (about 3.5 % of upper vertices; the test allows 4 %); the flank porches, bays and steps are covered by their own part rings.
- Flat local ground (see Frame). No absolute altitude.

## Verification

Renders with `local-scratch/shot.mjs` (a copy that imports only this folder, `local-scratch/ontario-legislative-building/shot.mjs`) and read against the reference photographs, in `local-scratch/shots/ontario-legislative-building/`:

- Front: `procedural-near-light-facade` and `-photo-match` (compared with the DXR and Joli Rumi south photographs: tower and dome proportions, roof peak vs domes, dormer, oculi, chamber arches, balcony, portico), `procedural-near-light-portico` (openings and steps), `procedural-near-light-tower` (turrets, rose window, dome).
- Above and back: `glb-near-light-overview`, `procedural-near-light-roof`, `procedural-near-light-top` (with the red OSM outline), `procedural-near-light-north` and `glb-near-dark-structure` (north block, arms, stacks), `procedural-near-light-arm`/`-porch` (west arm, flank porch), `procedural-near-light-pavilion` (pavilion and wing).
- Far LOD and night: `glb-far-dark-facade`, `glb-far-light-structure`, `glb-far-light-distance-800m` (silhouette at ~650 m), `procedural-far-dark-overview`.
- Exported GLB round trip: every `glb-*` shot above renders the exported files.

Review round: the turrets were pencil shafts with slate cones (now stout piers, per the Joli Rumi south photograph); stone and trim shared a hue (stone `#8a5d51`, trim `#c69f88` light; `#5c4340` / `#8f7268` dark, so the dressed trim reads lighter); the east north-end pavilion had no round stair bay against its mapped part 819 while the west one (part 844) was 5 m too tall (both now modelled, 25 m and 29 m). What I changed because of my own renders: the first model (built before the OSM parts arrived, at 24 m eave / 35 m peak) was 1.7x too small and had two towers instead of four; rebuilt from the parts. Flat roofs read salmon (coping slab covered the whole top): now a parapet ring plus a dark membrane. Cones on the north-block bays poked through the roof: flat caps. The flank porches read as goalposts at 800 m: solid stone porches with an arched door. The north block, link and wing boxes overshot the mapped outline where the parts have notches: split and trimmed. Ribbed stacks were spindly: shorter and 3 m wide. The dormer got three windows.

Tests: `node --test src/peregrine/landmarks/toronto/toronto.test.js src/peregrine/landmarks/toronto/ontario-legislative-building/ontario-legislative-building.test.js` (Node 26 wants the file, not the folder). The landmark test pins the 60 m roof and 45 m domes, the open portico arches and solid piers (rays), the lit chamber windows and rose window, the 43 m pavilions / 34 m wing plateau / flat north block / open courtyards, containment in the mapped outline plus its part rings, nothing below grade, far vs near bounds, and the GLB round trip.

Placement modes: **Cityscape** (flat ground): not tested yet, integration is checked separately. **Full 3D world**: not tested yet, integration is checked separately (the base is rigid on `y = 0` and the site's rise is noted above; `padM = 125` covers the ~100 m half-diagonal).

Catalog record: `prototypes/assets3d/catalog.d/ontario-legislative-building.json`.
