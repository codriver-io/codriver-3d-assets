# Samuel Beckett Bridge — Dublin

Original procedural, texture-free model of the 2009 Calatrava cable-stayed swing bridge in its closed swing position, carrying road traffic. Source is the landmark folder; export with `pnpm build:top-cities-landmarks samuel-beckett-bridge --no-check`.

Sources: [architect](https://calatrava.com/index.php/projects/samuel-beckett-bridge-dublin.html), [OSM bridge outline](https://www.openstreetmap.org/way/381481630), [Wikipedia](https://en.wikipedia.org/wiki/Samuel_Beckett_Bridge), and supplied photographic dossier. J.-H. Janßen's [evening photo](https://commons.wikimedia.org/wiki/File:Dublin_Samuel_Beckett_Bridge_08.JPG) CC0 licence independently verified during initial authoring; supplied photo credits/licences remain in catalog provenance. References stay in ignored scratch and are neither textures nor traced mesh inputs.

| Dimension | Value / basis |
| --- | --- |
| Structural length | Architect 124 m; mapped model 124.59 m |
| Platform width | Architect 27 m; rigid model 27 m |
| Swing pier station | Architect 28 m from south abutment; model 28 m |
| Pylon apex | Popular source 48 m above water; architect 46 m ASL; model 48 m above local flat grade, approximate datum |
| Deck | Architect 5.6 m ASL; model 1.6 m above quay grade, estimated |
| Footpaths / cycle tracks | Architect 3 m / 1.5 m each; raised shoulders 4.75 m each |
| Carriageways | Two 8 m lanesets and 1.5 m structural median |
| Landing toes | 5 m combined fallback pavement; standard provider surface at z18.6 is about 5.0–5.2 m, a rendering width rather than surveyed roadway width |
| South / north ramps | 23.16 / 33.58 m; smoothstep peak flat grades 10.36 / 7.15% |
| Pylon plate / opening | 1.4 m thick / 3.2 m diameter, photo estimates |
| Stays | 25 forward plus six back strands near; 13 forward plus six back far |

Local metres east/up/south, origin [-6.2413,53.347], stations south to north. Averaged mapped secondary carriageways 46160694 / 455486017 define the structural axis. Total approach-inclusive alignment is 181.34 m. South toe and its tangent meet mapped way 46160695; north toe is the actual Guild Street vertex [-6.2411656,53.3477639] on way 1313066295. These road ids establish alignment, not provider building replacement. Bridge outline 381481630 is the sole building/bridge footprint mask; no additional provider building or part is overlapped by this fix.

Recognisable structure: single continuous concave white harp spar with a true circular opening, closed extrusion in both LODs, deck stay fan, six rear strands anchored into the rear fin, steel deck/walks and rails, circular swing pedestal and end bearings. Fine ribs, standards and lights thin in far. All stays, rails and cross ribs retain named terminal support contacts. The river slab, girder, median, footways, pylon and cable geometry retain their original dimensions. Foundations stay at local y=0, with bridgeLift=0 at the foot and bridgeLift=1 at the cap to meet the fitted slab. Rigid lateral fitting is identity. Bank-fit uses shared terrain semantics; no DEM or ASL height is baked into the GLBs. Spar curves, hole location, stay placement, underside and deck datum are estimates; swing motion is not animated.

## Review fix and costs

Batch b6b review scored recognisability 5/5 but found abrupt width/colour steps at the outer quay and Guild Street toes. Both ramp pavement edges now use the same smooth taper as `roadEdgesAt` / navigation acceptance, narrowing from 17.5 m at the rigid span to 5 m at the connected road; the median gap closes at each toe. The south curve starts along the actual provider road tangent, and the north end snaps to the mapped road vertex. Both exported LODs share these samples.

A landmark-local subclass of the shared registry layer blends fallback asphalt continuously to `ROAD_PALETTES.surfaceMajor` along each land ramp, in both themes. Its shader reads immutable authored stations, so terrain/refit colour shading cannot destroy the blend. No extra mesh, draw, texture, shared renderer edit or material cycle is introduced. The exported GLBs retain neutral reference asphalt; the application applies the provider-specific colour join while preserving the existing HD overlay lifecycle.

| LOD | Triangles before → after | Draws before → after | Bytes before → after | KiB after |
| --- | ---: | ---: | ---: | ---: |
| Near | 6,494 → 6,494 | 10 → 10 | 411,624 → 411,588 | 402 |
| Far | 2,638 → 2,638 | 9 → 9 | 178,868 → 178,852 | 175 |

Both current bounds: x −22.229..18.368 m, y 0..48 m (float precision), z −85.265..91.009 m. Costs exclude live provider overlays; Tesla hardware is not measured. Depth-layer regeneration/check: zero cycle edges dropped.

Export inspection rounds (two sheet calls, actually viewed): `tmp/top-cities/shots/samuel-beckett-bridge/review-fix-near/samuel-beckett-bridge-glb-near-light-sheet.jpg` and `review-fix-far/samuel-beckett-bridge-glb-far-light-sheet.jpg`, overview/back/roof/deck. They preserve the harp silhouette, opening and stay contacts while removing the broad terminal pavement noses. Original reference comparisons remain in `reference-and-export-sheet.jpg` under the same screenshot root.

## Local app verification

Revised evidence is under `tmp/top-cities/shots/samuel-beckett-bridge/review-fix-cityscape-clear/` and `review-fix-world-clear/`: `spot-south-forward-street.png`, `spot-south-reverse-street.png`, `spot-north-forward-street.png`, `spot-north-reverse-street.png`, and `sheet.jpg` in each. Cameras centre on stations 0.1 and 181.24 m, follow the local approach heading and its reverse, at z18.6/pitch48. The higher pitch exposes the south toe otherwise hidden by a nearby building. Supplemental pitch68 evidence is in `review-fix-cityscape/` and `review-fix-world/`.

Both modes show a continuous narrow toe into the provider ribbon and a gradual asphalt colour join, with no broad square pavement termination or doubled generic bridge. The actual bridge is active and groupY=0 in both modes; world terrain is enabled. Initial synthetic spot report rows can say active:false because they do not name a landmark layer; `height-probes.json` explicitly queries the actual bridge. Latest world report rows name the bridge and confirm near LOD activation.

All nine mapped roadway vertices return a bridge height in their mapped local heading and its reverse. Runtime heightAt is metres above queried local terrain, so world values vary with the river DEM; it is not an ASL reading. Forward/reverse values are identical. Perpendicular and off-bridge queries return null.

| Sample | Cityscape, both headings (m) | World, both headings (m) |
| --- | ---: | ---: |
| south-foot | 0.000089 | -0.049982 |
| south-abutment | 1.600000 | 1.398773 |
| pylon | 1.600000 | 4.187960 |
| north-abutment | 1.600000 | 2.053167 |
| north-foot | 0.000042 | 0.059900 |
| off-bridge | None | None |

| Mapped vertex | Local heading (°) | Cityscape, both directions (m) | World, both directions (m) |
| --- | ---: | ---: | ---: |
| -6.2414727, 53.3463576 | -6.973 | 1.600000 | 1.773578 |
| -6.2414811, 53.3463986 | -0.649 | 1.600000 | 1.832543 |
| -6.2414752, 53.3464893 | 6.279 | 1.600000 | 2.615354 |
| -6.2412901, 53.3474349 | 6.666 | 1.600000 | 1.747374 |
| -6.2412836, 53.3474679 | 6.706 | 1.600000 | 1.413538 |
| -6.2411541, 53.3474608 | -173.842 | 1.599861 | 1.850676 |
| -6.241344, 53.3464101 | -174.124 | 1.600000 | 1.256334 |
| -6.2413406, 53.346379 | 163.824 | 1.600000 | 1.326298 |
| -6.241313, 53.3463463 | 153.258 | 1.600000 | 1.370386 |

World footing verification compares all 122 exported concrete foundation-foot vertices with the actual DEM function: residual −0.000000242..+0.000000349 m. The cap remains independently regression-tested against an 8 m bank/foot datum difference. At lateral toe samples the centreline bank-fit residual is −0.050 m south and +0.060 m north; lateral crossfall remains approximate.

Focused tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/samuel-beckett-bridge/samuel-beckett-bridge.test.js` passes all 480 tests, including 12 asset tests. Coverage includes observed harp opening/dimensions/negative space, every named member end excluding itself and a shortened stay negative case, deck/support contacts, mapped directions/rejection, ramp grades, rigid width, immutable refit, shared route height, GLB attachments and terrain cap contact. New near/far raycasts verify actual asphalt inside and absent outside the tapered edges; pavement tests verify both palette endpoints and immutable colour mixing after a terrain refit. Catalog validation (`node scripts/asset-catalog.mjs` / `pnpm assets:check`) and `pnpm assets:preview` pass.

| Environment | Status |
| --- | --- |
| Cityscape, standard roads, revised toes, both approaches/directions, height API | Verified locally |
| Full 3D world, Terrarium, revised toes, both approaches/directions, DEM feet, height API | Verified for local bank-fit integration |
| Near/far structural geometry and pavement widths | Verified in source tests and exported GLB sheets |
| Dark pavement palette endpoint | Verified by regression test; latest dark app shots not recaptured |
| HD lane paint on/off | Not tested: local lane service returns 503 without Redis |
| Surveyed rigid world datum and lateral bank crossfall | Not tested; bank-fit remains a visual approximation |
| Paired live vehicle/car/camera navigation, terrain lifecycle, mode switches, reanchor, failed-load restoration, hardware | Not tested; API/route tests do not replace these gates |

No online deployment or product gate change.
