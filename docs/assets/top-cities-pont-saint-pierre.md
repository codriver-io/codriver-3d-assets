# Pont Saint-Pierre, Toulouse

Original procedural model of the steel/concrete bridge opened on 14 November 1987, connecting Place Saint-Pierre with La Grave. The earlier suspended bridges are deliberately excluded. The Dôme de la Grave is a separate landmark and is not duplicated here.

## Sources and dimensions

[Municipal Archives](https://www.archives.toulouse.fr/histoire-de-toulouse/patrimoine-urbain/dans-ma-rue/-/asset_publisher/CLQUBtXHFZEQ/content/le-pont-saint-pierre-ou-quand-la-ville-de-toulouse-sable-le-champagne-pour-la-5e-fois-?inheritRedirect=false) establish the modern identity/date. [Muller & Renault, RGRA 652, May 1988](https://trid.trb.org/View/1021133) describes the five-span composite structure. [Wikipedia](https://fr.wikipedia.org/wiki/Pont_Saint-Pierre_de_Toulouse) lists spans 36.88 / 55 / 55 / 55 / 36.88 m. The supplied Commons contact sheet and six credited photograph pages are listed in the catalog; they were viewed, remain in ignored scratch, and supply no runtime textures.

| Parameter | Value | Evidence |
| --- | --- | --- |
| Length between abutments | 240 m published; 236.090 m mapped roadway | RGRA / OSM way 5149948; no rescaling |
| Deck width | 13.2 m | RGRA |
| Original carriageway | 8 m | RGRA; current provider remains authoritative for access |
| Sidewalk height | 0.75 m above road | RGRA |
| River piers | Four, approximately 55 m central pitch | Municipal history / mapped pier notches |
| Pier stations on mapped bridge | 34.75, 89.70, 144.73, 199.85 m | OSM outline 1007478960 |
| Main deck in flat map | 7.4 m | Photographic estimate / flat-map compromise |
| Pylon above deck | 3.27 m to coping | Photographic estimate |
| Highest lantern | 14.893 m above flat grade | Photographic estimate |
| White girder depth | 3.78 m at bearings; 1.35 m at crown | Photographic estimate |

## Frame and modelling

Anchor `[1.4348263, 43.60220035]` is the mapped roadway midpoint. Real metres, +X east, +Y up, +Z south; orientation is baked into exported geometry. Station increases toward Place Saint-Pierre at approximately 27.6 degrees. The mapped outline centres 1.2 m left of the roadway; the deck/rail/pier geometry uses that offset. FOOTPRINTS contains the original bridge outline, including pier notches; OSM_WAYS also records roadway/approach provenance. No nearby building extrusion is owned. Narrow approach ramps extend beyond the outline because they fit the mapped road, not a building footprint.

Five white shallow haunched girders keep their triangular openings in both LODs. Four bevelled brick foundations connect paired rising rust-brick pylons with stone quoins and coping; the central under-deck void is open. Green railings retain double rails, collared posts and X/diamond panels. Lantern standards have flared bases, twin curved arms, a higher centre lantern, glass volumes, caps and finials. Near adds pier courses, lantern frames and denser truss web/crossbeams; far retains every structural span, pier, pylon and lamp standard. Eight texture-free semantic materials, merged per material and two near station chunks. Dark palette dims masonry/steel and makes lantern glass warm/self-lit.

Approach profile uses 80 m of mapped Rue du Pont Saint-Pierre (1269718276) and 60 m of mapped Place Saint-Pierre (582228721/5149946). Flat ramps continue through the outer spans, reach 7.4 m at the first/last river pier, and meet zero at both outer approach endpoints. South rise is 114.75 m; north fall is 96.240 m; smoothstep peak grades are 9.67% and 11.53%. These grades and the deck height are an explicit flat-map approximation, not surveyed elevations. `terrainPolicy: 'bank-fit'` uses interpolated bank datums in world mode and grounds foundations separately without flattening the channel; world accuracy needs separate terrain verification.

OSM currently tags the roadway/approaches `highway=pedestrian`, with a note for 27 May–1 October 2026. Road-fitting is retained as requested; access/routing is left to the provider. The 8 m authored asphalt is fallback pavement, without invented motor lane stripes or temporary summer furniture/murals.

## Validation and limitations

`SPEC.ready = true`. Exported via `pnpm build:top-cities-landmarks pont-saint-pierre --no-check`. The requested two-file focused run passed all 262 tests (eight Saint-Pierre-specific tests); catalog validation passes with 212 entries / 390 variants, and `pnpm assets:preview` builds the local inspector. GLB round-trip tests check bounds and `_bridgelift` attachment weights as well as dimensions, river-channel openings, pylons/feet, sidewalk heights, footprint envelope, ramps and heading rejection.

| Export | Triangles | Mesh draws | Bytes | KiB (build output calls these KB) |
| --- | ---: | ---: | ---: | ---: |
| Near | 52,228 | 14 | 2,923,836 | 2,855 |
| Far | 18,438 | 8 | 906,856 | 886 |

`qa-metrics.mjs --ids pont-saint-pierre`: zero cross-material coplanar overlaps; zero back-face hits in 56 exterior-hit rays; lowest point −0.16 m (the shallow ramp-fill recess), top 14.893 m. Near/far bounds match. The first diagnostic found buried masonry caps sharing a plane; their buried bottom faces were removed, then QA re-run cleanly. Far narrow rail/arm members became double-facing ribbons and mast profiles four-sided, saving approximately 253 KiB without removing structural spans or lanterns.

### Independent review corrections, 9 October 2026

The independent review rated recognisability 4/5, PASS-WITH-NITS. Its four requested fixes are implemented; this records the response rather than a new independent approval.

| Finding before | Corrected export |
| --- | --- |
| Faint grey-blue lattice under a thick cream cornice | Light lattice `#e3e8df` → `#fbfcf8`; lower chords 0.34 × 0.26 → 0.48 × 0.38 m, diagonals 0.20 × 0.20 → 0.30 × 0.28 m. Cornice 0.36 → 0.14 m and sidewalk plate 0.93 → 0.32 m, preserving the 0.75 m walking level; inner kerb web and transverse bearers support the plate. |
| Pale, slight piers | Brick base plan 4.2 × 19.4 → 5.0 × 20.5 m; upper pylon shaft 2.7 × 2.6 → 3.1 × 3.1 m. Dominant shaft material becomes rust brick with narrow limestone quoins and coping. |
| Far piers washed out | Both LODs use the same saturated brick `#a4765b` → `#874529`; far keeps the rust-brick shafts and stone corner accents. |
| Small lanterns | All heights above the sidewalk, including arms, glass, caps and near frames, increase 10%; peak 14.28 → 14.893 m. The existing 26 standards remain at approximately 18.84 m spacing, consistent with the references. |

Two look/fix iterations were used. The fresh near/far, light/dark sheet `tmp/top-cities/review/pont-saint-pierre/final/pont-saint-pierre.jpg` and close-view sheet `final-detail/pont-saint-pierre-glb-near-light-sheet.jpg` were actually inspected against the supplied reference sheet. The revised lattice openings, mass of the piers, far colour and lantern silhouettes remain readable. The review file contains no Prepare command; the standard `qa-metrics.mjs --ids pont-saint-pierre --out tmp/landmark-qa/metrics.json` followed by `qa-sheet.mjs --ids pont-saint-pierre --out tmp/top-cities/review/pont-saint-pierre/final` regenerated its metrics/header and sheet.

The older review sheet reported 20,950 far triangles / 1,046 KiB while the original manifest reported 16,478 / 793; that image was stale. The current GLB, manifest, round-trip tests and refreshed header agree on **18,438 far triangles / 886 KiB**. SHA-256 of the delivered far GLB: `960284b493a2ba19483438cfe6cb00e5a79e7b99833184d3bde32d68d611b42d`; near: `6c0fb04c0aa0887f9eb5f93b1a7153f88ae9482b38a9e9cb5851103dbf4bc7ba`.

The fresh app screenshots under `tmp/top-cities/review/pont-saint-pierre/app-cityscape/` (far/near/street) and `app-world/` (far/near) were inspected. Both LODs loaded and were active. The repeated eleven-station shared surface check again gave maximum pavement/navigation residuals of 4.25 mm Cityscape and 4.27 mm world, with identical forward/reverse and camera heights, rejected off-bridge/transverse calls, and 46/72 masked standard road triangles. HD lanes remain not tested because the local service returns 503. No new renderer page error or QA artifact was found; bridge budgets remain satisfied.

### Images actually inspected

All paths below are ignored local evidence rooted at `tmp/top-cities/shots/pont-saint-pierre/`:

- `source/pont-saint-pierre-procedural-near-light-sheet.jpg`: overview, front, opposite side, above, deck, underside, pylon, lantern detail. This established the span/pylon/lantern proportions before export.
- `export-reference-sheet.jpg`: supplied six-photo contact sheet directly above exported near/light and far/dark sheets, each including all eight views; verified open girder windows, raised pylons, green railing pattern, lamps and footprint orientation.
- `extra-lod-theme-sheet.jpg`: exported far/light and near/dark, overview/front/deck/pylon. Far retains the silhouette/negative space; lantern panes become warm at night.
- `app-final-sheet.jpg`: final exports loaded in the normal app, Cityscape far/near/street and world far/near.
- `approach-sheet.jpg`: both structural abutments, looking in and out at 27.6° / 207.6°, Cityscape top row, world bottom row. Roadway meets the model and no duplicate provider deck is visible.

### In-app standard road and terrain checks

Bundle built locally (`2c8140d076b2`); static app on port 3270 and terrain app on 3272, real Protomaps tiles from `tiles.codriver.io`, Terrarium DEM at max zoom 15. Both models loaded/active in both modes. The ordinary provider road replacement is active: 46 standard triangles were suppressed in the sampled Cityscape tile, 72 in world; terrain changes tessellation. No bridge flatten corridor is requested (`terrainFootprint() === null`). All eight approach shots used the prescribed `app-shot.mjs --at` flow. Its custom spot rows say `active:false` because the custom spot name is not a landmark id; the dedicated landmark run and direct layer inspection confirm the real Saint-Pierre layer is active.

A local scratch browser check compares fallback asphalt triangles against `window.__map.landmarks.heightAt`, both headings, at eleven stations including both outer approach endpoints, both structural abutments ±1 m, and the main-span midpoint. Heights are in real metres; world navigation height is above the local DEM, while its rendered local Y includes the bank datum. Adding the sampled DEM exactly once yields the rendered height (largest residual 4.25 mm Cityscape / 4.27 mm world, a 2 m profile chord approximation).

| Station / location | Cityscape navigation | World navigation | World rendered pavement Y |
| --- | ---: | ---: | ---: |
| 0 / outer south ramp | 0.000 | −0.049 | 143.751 |
| 80 / south abutment | 5.775 | 5.656 | 144.024 |
| 198.045 / centre | 7.400 | 13.131 | 145.131 |
| 316.090 / north abutment | 5.042 | 5.079 | 142.255 |
| 376.090 / outer north ramp | 0.000 | 0.021 | 146.908 |

Both headings agree, and off-bridge / transverse-heading calls return `null`. `cameraHeightAt` equals navigation height (centre 7.400 m Cityscape / 13.131 m world); the app’s `liftLine` route/traffic surface adds its existing 0.12 m overlay clearance (centre 7.520 / 13.251 m). This checks the actual shared API, rather than observing a live GPS vehicle. Detailed values and road-mask counts are retained in `tmp/top-cities/pont-saint-pierre/height-qa.json`. The few-centimetre world endpoint offsets reflect lateral/coarse DEM interpolation; no surveyed deck altitude is claimed. Terrain bank interpolation across the river raises the centre roughly 13.13 m above the sampled river DEM, a plausible but un-surveyed clearance.

The provider draws the currently pedestrian-tagged corridor and the original bridge layer still supplies shared navigation heights, as requested; the model does not rewrite OSM access or force vehicle routing. Local `/osm-lanes` has no Redis and returns 503, so HD pavement/paint has zero tiles and remains **not tested**; the authored unstriped asphalt supplies fallback. Local account/CORS/503 errors concern absent services; model requests succeeded, without a renderer page error. Live GPS driving, live route/traffic feeds, mode/failure/reanchor stress cases and hardware remain outside this verification. The requested Pont Neuf quality reference was still a stub and its doc absent in both worker/lead checkouts; the completed Prince Edward Viaduct was studied for the shared road surface/attachment contract only. No shared code was changed. Pier shape, steel sections, lantern ornament and masonry coursing are interpretations; rivets, plaques, seasonal furniture and neighbouring quays are omitted. No Tesla hardware measurement.

Cityscape: **verified locally** for exported near/far loading, standard road replacement, both approaches/directions and shared surface heights. Full 3D world: **verified locally** for terrain activation, bank-fit support/deck placement, both approaches/directions and the same height checks; absolute real-world survey accuracy and HD lanes remain not tested. Independent visual review remains the coordinator’s delivery gate.
