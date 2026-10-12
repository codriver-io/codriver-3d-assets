# Fred Hartman Bridge

Original procedural model of the 1995 SH 146 crossing between La Porte and Baytown, Texas. Twin independent four-lane decks, four open diamond concrete pylons, yellow double-plane fan stays, green-grey steel edge girders and long concrete approach viaducts establish its identity. No photographs or textures ship.

Sources: [UT Austin / TxDOT-funded Ridd thesis (2004)](https://fsel.engr.utexas.edu/pdfs/Jennifer%20Ridd%20Thesis%20August%202004.pdf), [Dowd thesis (2001)](https://fsel.engr.utexas.edu/pdfs/Dowd%20thesis.pdf), [SAH Archipedia](https://sah-archipedia.org/buildings/TX-01-AT15), and attributed OpenStreetMap roadway geometry. Commons USCG/James Dillard aerial is public domain; Sam's panorama is CC BY-SA 3.0, checked at their linked file pages in the catalog. Esri World Imagery was inspected solely as an aerial reference. Dossier image 1 shows Kemah Boardwalk and was excluded. Ridd figures 1-1 through 1-3 show the independent decks and transverse tower contacts.

| Dimension | Authored value | Basis |
| --- | --- | --- |
| Main span | 381 m | Published 1,250 ft |
| Cable unit | 754.38 m | Published 2,475 ft |
| Combined side spans each bank | 186.69 m | Derived from cable-unit and main lengths; individual span split not surveyed |
| Each deck | 23.7744 m | Published 78 ft; aerial width check about 24 m |
| Median gap | 1.2192 m | Published total 160 ft minus 2 × 78 ft; aerial about 1–2 m |
| Tower crown | 134.112 m | 440 ft, commonly cited; Ridd cites 436 ft (132.893 m) |
| Deck / soffit | 57 / 54.8 m | Deck estimate selected around published navigation clearance (SAH 178 ft = 54.25 m); not a survey |
| Stay count | 192 near / 112 far | Published 192; far reduces fan density while retaining terminal anchors |
| Approach-inclusive alignment | 3,093.830 m | Dossier mapped extent; highway-project 4.185 km length is different |
| Flat ramp lengths / max grades | 1,163.182 / 1,056.269 m; 5.075 / 5.609% | Authored landing 60 m, 40 m vertical curves |

The commonly repeated 47 m overall width differs from the primary Ridd deck dimensions (160 ft = 48.768 m overall); this model uses the latter, consistent with the inspected aerial. The dossier’s 80.6 m clearance was rejected in favour of the documented navigation clearance around 54–55 m.

Origin `[-95.01688,29.70347]` is the averaged roadway near the channel. Units are real metres, east/up/south. Alignment follows averaged parallel OSM carriageways. Southern tower is projected from aerial `[-95.0182,29.70230]`; northern tower is 381 m farther along the alignment. Rotation is baked once. Local y=0 is sea-level / flat Cityscape ground; no DEM or Mercator scale is baked into the exports. `absolute-deck` holds the main unit at 57 m and fits individual support feet and ramp ends to terrain. The elevated structure retains rigid authored width; only the last 150 m at each landing taper to the mapped carriageways (10.2 m per nose in the export, zoom-matched standard ribbons or measured HD edges at runtime); the available shared transverse terrain clamp is enabled at ramps.

Roadway ownership: mapped motorway ways 41290874, 15407810, 15410095, 15454019, 423490590 (northbound), 29521399, 423490303, 423490304, 15407809, 15410092, 123125894 (southbound). The dossier contains no building/building:part tower outlines. Its larger man_made=bridge polygon 1303601727 includes interchange branches not modelled, so is not masked. The footprint covers only authored decks and supports. Two additional small shared-helper Overpass requests failed (400/timeout); the supplied continuous alignment is retained rather than fabricating extra roads.

Diamond limbs have explicit foot-to-deck-to-crown contact; the two diamonds touch only at their pylon crosshead. Stays terminate inside named concrete pylons and concrete anchorage blocks. Approach shafts terminate on concrete feet and caps; caps meet edge girders. Slab, pavement, girder and barrier edges share the same smooth landing taper; girder/barrier ends meet ground at the road boundary. Fallback lane paint stops before the tapered ordinary-road noses, and no path is invented. Section dimensions, anchor levels, intermediate pier spacing, shoulder fittings and lamps are photographic estimates. No pedestrian walkway is invented. Near geometry uses three station chunks; far retains every pylon opening, the median and girders while dropping fine paint and thinning lamps/stays.

Verification and measured export costs are recorded below after focused tests and inspected GLB/app captures. Catalog readiness describes source/export readiness; it does not certify untested terrain or HD road providers.

Measured exports after landing review fix: near **57,844 triangles / 20 mesh draws / 2,771,528 bytes (2,707 KiB)**; far **24,212 / 6 / 1,007,260 bytes (984 KiB)**. Before: near 59,516 / 20 / 2,889,980 bytes; far 22,276 / 6 / 958,872 bytes. Exact bytes are generated in the runtime manifest; both remain below the 120k/40/4.5 MB and 30k/10/1.2 MB budgets. Near has three station chunks; far merges all chunks. Original structural support feet reach y=0; the low-ramp undersides embed at most 2.2 m below flat grade and collapse to zero thickness at each road boundary, avoiding a hanging or visible buried cut face.

`node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/fred-hartman-bridge/fred-hartman-bridge.test.js` passes **409/409**. Own tests verify observable crown height, main-span separation, upper/lower diamond apertures, mast closure, two asphalt slabs and median opening; every stay, tower limb, floor beam, approach shaft/cap, girder/barrier end and lamp pole/arm is checked against its named supporting geometry, excluding the member itself. Inside-volume ray parity or ≤16 cm surface contact passes; deliberately shortened longest stays fail at both terminals. Footprint/rigid width, mapped ownership, grade continuity, heading rejection and GLB attachment/normals round trips are pinned. Own tests complete below 3 seconds.

`node scripts/asset-catalog.mjs`, `pnpm assets:check`, `pnpm assets:preview`, and `node scripts/landmark-depth-layers.mjs --ids fred-hartman-bridge --check` pass. Regeneration reports **zero dropped cycle edges**. `qa-metrics.mjs --ids fred-hartman-bridge` reports **ok**. No shared bridge-* extension was needed. The generated depth table was checked locally and is excluded from the fix commit.

The first exported sheet exposed the long-deck cost of uniformly dense samples. Straight strips now use 25/50 m near/far spacing; the 40 m quadratic curves retain 4/8 m spacing. Contact/depth QA exposed coincident ground-clamped steel/slab faces and mixed-material anchorage overlap: negative embedded girder ends and concrete anchor blocks resolved those cycles. Missing intermediate side-unit supports were added (estimated 62 m + 124.69 m split at each bank), preserving the published five-span unit. Tower legs remain open, all stay ends anchored, and the side-unit supports reach the girders in both LODs.

Looked at the dossier `refs-sheet.jpg` and `refs/2.jpg`, `refs/3.jpg`, reference-only `tmp/top-cities/fred-hartman-bridge/refs/esri-aerial.jpg`, and the extracted Ridd structural/photo sheet. Reviewed `tmp/top-cities/shots/fred-hartman-bridge/export/fred-hartman-bridge-glb-near-light-sheet.jpg` for overview, facade, back, roof, tower, deck, underside and anchor detail. Final exported near/far light/dark files are in `tmp/top-cities/shots/fred-hartman-bridge/final/`; `export-reference-sheet.jpg` places them alongside the Coast Guard and aerial references. The final north-up footprint plan is `fred-hartman-bridge-glb-near-light-top.png`. The tiny visual fittings and pylon thickness are estimates; the silhouette, 381 m span and double diamonds are retained in far.

Provider is Protomaps standard roads from tiles.codriver.io; world uses Terrarium 256 px DEM, maximum z15. Captures at far/near/street show the shared runtime vertex shading, active model, open diamonds and separated decks. Both ends were captured looking in both directions as `approach-{south,north}-{1,-1}.png`; these were inspected in the combined `approaches-sheet.jpg` and as unobstructed PNGs. Final app evidence is in `tmp/top-cities/shots/fred-hartman-bridge/{cityscape-final,world-final}/`. No observed vertical gap, duplicate elevated generic deck or terrain through the main deck; The original captures showed an abrupt width/colour break at the ordinary white road ribbons; the review fix and replacement evidence below supersede that result. This is standard-road evidence, not HD pavement evidence.

Live `window.__map.landmarks.heightAt(lng,lat,heading)` returns **metres above queried ground**; each entry below is lateral −12.5 m / +12.5 m, and both aligned driving headings agree:

| Sample | Cityscape | Full 3D world |
| --- | --- | --- |
| south-foot | 0.000 / 0.000 | 0.027 / 0.000 |
| south-ramp | 0.000 / 0.000 | 0.963 / 0.919 |
| south-unit | 57.000 / 57.000 | 53.688 / 53.294 |
| south-tower | 57.000 / 57.000 | 54.687 / 54.445 |
| midspan | 57.000 / 57.000 | 56.678 / 56.489 |
| north-tower | 57.000 / 57.000 | 55.008 / 54.694 |
| north-unit | 57.000 / 57.000 | 54.502 / 54.465 |
| north-ramp | 0.000 / 0.000 | 0.000 / 0.750 |
| north-foot | 0.000 / 0.000 | 0.000 / 0.406 |

All **45 in-range mapped roadway vertices** return non-null values in both headings, in both modes; median, 65 m off-road and perpendicular heading return null. Full arrays and geographic coordinates are `height-at.json` beside the final app shots. Main-span absolute deck is 57 m; world offsets vary because the function subtracts local DEM. Group Y stays zero, terrain is present and the bridge is active. The enabled shared per-vertex terrain clamp prevents below-ground ramp shoulders; maximum sampled landing elevation above ground is 0.963 m, with no negative residual.

A live exported-mesh footing probe samples all 3,024 bridgeLift=0 vertices whose original local y=0. In world, no footing DEM is unknown and residual against local DEM is below 0.000001 m; this validates the actual source-to-GLB attachment/refit path at sampled supports, not a physical survey. Durable probes are `tmp/top-cities/fred-hartman-bridge/runtime-cityscape.json` and `runtime-world.json`. Cityscape route lift is 57.12 m (57 m deck + 0.12 m ribbon bias), while camera height is 57 m. World route and camera use the same above-ground contract: three route samples return 54.651 / 56.609 / 54.921 m including the ribbon bias; camera at the catalog anchor returns 56.468 m. The actual loaded layer is active/visible, parent y=0, terrain-ready with ground present. A paired driving session with a followed vehicle/live traffic was not performed.

| Environment / case | Status |
| --- | --- |
| Cityscape standard roads, near/far loading, both landings/both directions | Verified locally after review fix; smooth landing width/colour joins in both directions |
| Full 3D world standard roads / Terrarium, actual model loading, sampled supports and ramps | Verified locally; main deck absolute 57 m and transverse terrain clamp active |
| HD pavement, lane count/dash phase and paint on/off | Not tested: `/osm-lanes` returns 503 without local Redis |
| Vehicle/camera/route common height API | Camera/route API checked; full driven navigation/traffic session not tested |
| Source/GLB near/far light/dark, normals, planted support weights | Verified; texture-free and zero material cycles |
| Missing/late terrain, repeated mode toggles, reanchor, failure/unload restoration | Shared factory used; app lifecycle matrix not tested for this asset |
| MCU2/MCU3 hardware performance | Not measured |

Reference photos remain ignored scratch. No third-party geometry, online deployment, other landmark edit or shared bridge extension is included. Standalone viewers remain in ignored tmp. Generated app bundles are restored before the commit, and slot servers are stopped after the final captures.

## Landing review fix — 2026-10-12

FIX: broad square gray slab ends against narrow white standard roads at both landings. The final 150 m now smoothly taper each independent slab, pavement, edge girder and kerb to its actual mapped carriageway centre. The export uses a 10.2 m road surface at each nose; the asset-local layer matches standard motorway ribbon width using the renderer’s shared width function (10.189 m at z17.1; 8.265 m at z18.6), or accepts measured HD nose edges. Decks over the channel, open diamonds, supports and 78 ft structural widths remain unchanged. Both normals and vertices retain attachment weights. The same nose edges govern navigation. Endpoint colour blends to the current standard motorway palette; the retained HD path uses its live surface colour. All fitting starts from immutable authoring positions, and sub-pixel width changes within 5 cm per edge skip refitting. No shared runtime file extension was needed.

Inspected exported near/far overview, tower, deck and underside sheets under `tmp/top-cities/shots/fred-hartman-bridge/review-fix/export-{near,far}/`, then the eight unobstructed `review-fix/{cityscape,world}/approach-{south,north}-{1,-1}.png` captures and `review-fix/approaches-sheet.jpg`. The taper removes the broad square noses and visibly aligns both paved ends with the white road ribbons; main-deck silhouette and negative space remain intact. Cityscape 3274 and Full 3D world 3276 retain Protomaps standard roads / Terrarium. New `height-at.json` arrays again show all 45 in-range mapped vertices returning finite heights in both headings in both modes; median, off-road and perpendicular queries return null. Heights in the table above are unchanged. The final probe identifies the active local subclass by its group name; separate `tmp/top-cities/fred-hartman-bridge/review-fix-runtime-{cityscape,world}.json` probes record the actual active model and terrain state, route/camera values and all 3,024 planted vertices (maximum DEM residual <0.000001 m; none unknown).

New tests raycast the narrowed surfaces in both LODs, reject removed square shoulders, check repeated fits without accumulated movement, preserve rigid channel width under deliberately narrow HD samples, and verify zoom/theme changes and restoration of standard-road joins after the HD path is disabled. All 409 focused tests pass; depth regeneration drops zero cycle edges, `qa-metrics.mjs` reports ok, catalog/asset checks and local preview pass. HD app lanes remain untested because local Redis is absent; driven traffic, hardware and the full lifecycle matrix remain untested as stated above.

The second and final look-fix pass also tapers the slab/girder thickness and kerb height to zero at the road boundary, removing the buried vertical end face that appeared as a crossbar on the flat basemap. The close z18.6/p74 captures are in `review-fix/{cityscape,world}-driver/approach-{south,north}-{1,-1}.png`; the raycast/contact tests also pin all endpoint vertices to y=0.

Close world captures retain a faint terrain boundary line at the tip; the existing transverse terrain clamp and the standard provider ribbon use different lateral ground samples, with the unchanged sampled landing offset up to 0.963 m in the table above. The broad width/material breaks and flat buried end crossbars are removed; independent re-review should judge the remaining close terrain boundary.
