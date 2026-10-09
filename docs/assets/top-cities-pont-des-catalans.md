# Pont des Catalans — Toulouse

Original procedural model of the current Garonne road bridge, with five paired masonry arches, small semicircular relief openings, rusticated cutwaters, brick spandrels and a concrete deck with green cast-iron balustrades and double-headed lanterns. Sources describe an evolving construction period; this depicts the surviving bridge and modern road surface, rather than the construction photograph's timber centering.

## Sources and dimensions

The [DRAC Occitanie heritage description](https://www.culture.gouv.fr/content/download/208610/2204747) establishes the paired-ring construction and dimensions; the [Toulouse filming office](https://www.toulouse-tournages.fr/decor/pont-des-catalans/) supports the opening span range and deck thickness. OSM ways and complete coordinates are retained in `pont-des-catalans-alignment.js`, from the supplied dossier dated 2026-10-09. Photo titles, authors and licences are recorded in the catalog record; they stay in ignored scratch.

| Quantity | Model | Basis |
| --- | --- | --- |
| Structural length | 257.21 m | DRAC published |
| Deck width | 22.50 m | DRAC published |
| Masonry rib width | 3.25 m each | DRAC published |
| Gap between ribs | 9.90 m | DRAC published |
| Arch clear spans | 38.5 / 42 / 46 / 42 / 38.5 m | Published range; intermediate 42 m estimate consistent with historical descriptions |
| Concrete deck thickness | 1.39 m | Toulouse filming office |
| Deck elevation above flat grade | 16 m | Photo estimate |
| Arch spring / rise | 3.6 / 9.75 m | Photo estimate |
| Relief opening radius / spring / sill | 2.15 / 9.75 / 8.20 m | Photo estimate |
| Highest lantern | 21.825 m | Estimated fitting |
| Pier station gap | 7 m | Photo estimate |
| Approach ramps | 220 m each; peak 10.91% | Flat-map convention, smooth profile |

The frequently repeated 45 m figure is **not** used: the DRAC text assigns it to Pont Adolphe, Luxembourg, in the preceding comparison. Vertical dimensions are estimates rather than a survey.

## Geography and construction

Origin `[1.427967, 43.603224]`; local metres east/up/south. Increasing station runs south to north, approximately 2.8° east of north. The mapped road centre is the midpoint of the two one-way roadway endpoints. Approach polylines follow the mapped west carriageway, offset to the centre between the lanes. The roadway crossing measures 248.663 m; the published 257.21 m structure extends 4.274 m beyond each mapped endpoint into the bank outlines. The ring geometry and navigation use the same profile, with Mercator scaling applied only by the renderer.

Each arch is an extruded elliptical annulus, with raised single-surface white archivolts and radial stone joints, avoiding buried coplanar extrusion faces. The brick spandrel is a perforated solid whose lower outline follows the five extrados curves, including real arched openings with vertical jambs and level sills over four piers. Two independent 3.25 m ribs remain separated beneath the slab. Cutwaters use flared elliptical course rings with recessed joints, projecting capitals and pointed river-facing tips; full surveyed stereotomy, compound basket-handle curvature and below-water foundations are approximated. Clipped masonry courses leave all openings unobstructed. A row of dark corbel brackets and floor beams carries the broadened sidewalks. Railings and lamps are merged per material and station chunk; far keeps every opening, cutwater, railing silhouette and lantern, while omitting individual joints and dense members.

Day palettes distinguish pale Bordeaux stone, weathered muted red brick, grey concrete and green iron. Night palettes dim the structure and retain lanterns and a narrow warm arch wash as self-lit material. Actual diffuse floodlight falloff is approximated without textures. Approach fill is a flat-map embankment convention, not a claim that these large ramps exist beside the Garonne. Sidewalk skirts are embedded 0.20 m at approach grade; pier feet are exactly y=0.

## Integration and verification

The runtime `ROAD_LAYER` uses `createRegistryBridgeLayer(PROFILE, PALETTES)` unchanged. It retains actual HD pavement and paint when available, with authored paint as fallback. `clipStandardEnds` splits provider roads at both profile ends. Cross headings and points outside the carriageway are rejected. The bank-fit terrain policy samples only the two mapped banks across the straight river crossing, interpolating their datum; it does not sample the riverbed or flatten a corridor. Absolute deck elevation remains unsurveyed.

Cityscape: **verified for standard-road placement and deck/navigation API**, on slot A `3270`, Protomaps tiles from `tiles.codriver.io`, renderer build `5d4a21cfca59`, 2026-10-09. Full 3D world: **verified for bank-fit placement and deck/navigation API**, slot A `3272`, AWS Terrarium DEM (maximum zoom 15). This is limited local verification, not the complete ADR-0045 release matrix: HD `/osm-lanes` returns 503 without Redis, so HD pavement and lane-paint continuity are **not tested**; real route driving, traffic, failure/late-load/reanchor and Tesla hardware measurements are **not tested**. Absolute deck altitude and real clearance remain unsurveyed; world mode raises the deck relative to its bank datum and stretches supports toward their individual ground samples.

The required `app-shot.mjs --ids pont-des-catalans --shots far,near,street` captured both LODs, then ad-hoc shots at both banks in both travel directions. Additional screenshots at the actual outer ramp joins cover both directions in both modes. Judged contact sheets: `app-sheet.jpg`, `approach-sheet.jpg`, `join-sheet.jpg`, all under `tmp/top-cities/shots/pont-des-catalans/`. Side views show five paired arches and pierced spandrels without a duplicate generic bridge; the outer ramp joins show continuous standard pavement at grade. Custom `spot-*` reports have `active:false` because their synthetic ID is not a registry landmark; the bridge itself is visible and separately recorded active by the measurement run.

`tmp/top-cities/pont-des-catalans/app-measure-{cityscape,world}.json` records live `window.__map.landmarks.heightAt(lng,lat,heading)` values, model state and provider availability. Returned values are relative to the local terrain surface in world mode, rather than absolute altitude. Both directions agree; all transverse headings and an off-bridge point `[1.43,43.6032]` return null. Camera heights match the accepted height API, and route lift samples use that height plus the normal 0.12 m route offset and Mercator scale. A comparison of 500 fitted fallback pavement vertices against the accepted surface found a curved-node projection discrepancy up to 0.0893 m; corrected the authoring pavement/paint to evaluate at each actual projected vertex. Final maximum mesh/API disagreement is 0.000000477 m in Cityscape and 0.000007821 m in world mode. Dedicated tests cover every fallback pavement/paint vertex in both LODs.

| Station | Location | Cityscape / both headings | World / both headings |
| --- | --- | --- | --- |
| 0 | Southern outer ramp join | 0.000 m | 0.000 m |
| 50 | Southern approach | 2.104 m | 2.113 m |
| 220 | Southern bank | 16.000 m | 16.000 m |
| 344.331 | Central arch | 16.000 m | 24.059 m |
| 468.663 | Northern bank | 16.000 m | 16.000 m |
| 638.663 | Northern approach | 2.104 m | 2.216 m |
| 688.663 | Northern outer ramp join | 0.000 m | ~0.000 m |

The world centre is 24.059 m above the sampled river terrain because the accepted deck rides 16 m above the interpolated bank datum, about 8.059 m above that river sample. This is a documented visual approximation, not a surveyed river clearance. Approaches `[0,0]`, zero HD sections and zero HD tiles confirm this run used standard-road/fallback pavement. Renderer image totals include surrounding buildings, trees and terrain and are not landmark GLB costs.

Procedural contact sheet: `tmp/top-cities/shots/pont-des-catalans/pont-des-catalans-procedural-near-light-sheet.jpg`. Export/reference comparison: `tmp/top-cities/shots/pont-des-catalans/export-reference-sheet.jpg`, combining the dossier references with exported near/far and light/dark views. The first render exposed a reversed southern approach; corrected the polyline direction, added embankment contact, added clipped masonry courses, and indexed the extrusions to reduce bytes. Exported overview, both sides, above, deck, underside and arch detail were inspected. No photos or textures enter the exports. After the numeric curved-node correction, final exported front/back/above/deck/detail and far/night views were checked again beside the references in `tmp/top-cities/shots/pont-des-catalans/final/reference-export-sheet.jpg`; the main structure and material appearance are unchanged.

Focused tests pin the real arch and spandrel holes by raycast in both LODs, twin rib separation, springing contacts, slab width, top/grade bounds, geographic outline envelope, two-direction deck heights, off-road/crossing rejection, ramp grade and far silhouette. Costs, final checks and app evidence follow below.

## Measured exports and checks

| LOD | Triangles | Mesh draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 44,240 | 17 | 1,994,192 | 1,947.5 |
| far | 14,328 | 9 | 598,112 | 584.1 |

Both models keep their attachment weights and standard named materials, with no texture or decoder extension. Near has two spatial batches; far folds them to one. These are default-scene mesh costs, not measured Tesla frame costs or HD-overlay costs.

Checks passed: the prescribed conformance plus landmark test invocation (252/252, including all six dedicated tests); `node scripts/asset-catalog.mjs` and `pnpm assets:check` (209 entries / 386 variants); `pnpm assets:preview`; `pnpm build:peregrine`. Generated renderer bundles are used only for local verification and excluded from the landmark commit. No shared bridge file was modified, no install/full test suite/online deployment was run, and both temporary servers were stopped after verification.

## Independent review revision

The review supplied under this worktree's `tmp/top-cities/review/pont-des-catalans/REVIEW.md` had no Prepare command and no REVIEW-2 supplement; the supplied lead-checkout path was absent. Re-ran the corresponding standard preparation commands:

```sh
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids pont-des-catalans --out tmp/top-cities/review/pont-des-catalans/fix-metrics.json
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids pont-des-catalans --out tmp/top-cities/review/pont-des-catalans/fix
```

| Review finding | Before → after |
| --- | --- |
| Excess near weight | 77,856 → 44,240 triangles, below the 55k target; 3,898 → 1,947 KiB |
| Far weight | 20,880 → 14,328 triangles; 964 → 584 KiB; one batch per material, sparse merged baluster faces, two major pier courses, no brick lines |
| Coplanar artifact | 277 pairs / 9 m² → zero pairs / zero area, with zero back-face sweep hits |
| Opening profile | Full circular eyes → smaller semicircular crowns on vertical jambs and level sills; clear half-width 2.15 m, spring 9.75 m, sill 8.20 m |
| Smooth support cones | Eight recessed rustication courses, flared footing and capital, pointed cutwater tip; 16 circumferential segments near / eight far |
| Flat underside and bulky abutments | Dark repeated corbel/bracket row below the pale cornice; bank blocks split into narrower rib-aligned foundations |

Exterior archivolts, radial joints, brick joints and night wash use surface-only geometry instead of tiny capped extrusions. Offsets between these faces eliminate the buried/coplanar faces without weakening the main arch bodies. The last tiny approach overlap was removed by insetting the embankment's side wall 0.08 m beneath the sidewalk. Near geometry uses 17 draws and far uses nine, unchanged from the first version. Terrain profile, published dimensions, road layer and geographic placement are unchanged.

Looked at the newly prepared `tmp/top-cities/review/pont-des-catalans/fix/pont-des-catalans.jpg` and the exported near daylight / far night sheets, including close support and opening views, with the dossier reference photographs. Combined evidence: `tmp/top-cities/shots/pont-des-catalans/review-fix/compare.jpg` and `final-review-sheet.jpg`. Two look/fix rounds: the first showed the stronger rustication, small arched openings and corbels; the second confirmed the cleaned approach seam and far geometry. No further appearance iteration was needed.

Re-ran the normal app placement check after export using renderer build `67ca40ff4a59`, slot A ports 3270/3272: Cityscape far/near/street and world far/near all loaded and stayed active. Looked at `tmp/top-cities/shots/pont-des-catalans/review-fix/app-placement-sheet.jpg`; updated support/arches sit on the same road surface and no duplicate generic bridge appears. The existing live measurement script again samples the accepted deck, camera and route APIs and outer joins in both directions. HD lane data still returns 503 locally, so the earlier HD paint and real-driving/lifecycle/hardware limitations remain.

The prescribed conformance plus dedicated landmark tests pass 252/252; added geometry raycasts distinguish vertical jamb corners from the old round opening and verify the flared/recessed pier courses. The near 55k ceiling and per-vertex pavement/paint-height assertions also pass. Final QA metrics have an empty issues list; catalog validation passes. All reference photos and review images remain ignored scratch, and only this landmark's source, catalog, documentation and exports enter the commit.
