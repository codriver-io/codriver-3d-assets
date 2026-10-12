# Pont de Normandie — Seine estuary

Original procedural model of the current **1995 cable-stayed toll crossing between Sandouville/Le Havre and Honfleur**, carrying N1029 / the A29 link. The bridge is distinguished by two inverted-Y concrete pylons with long solid composite heads, 184 stays in two lateral planes, a slender aerofoil deck with blue edge trim, a pronounced vertical curve and long multi-span approach viaducts. The estuary, ground and neighbouring industrial buildings belong to the ordinary map.

Build: `pnpm build:top-cities-landmarks pont-de-normandie --no-check`.
Inspect: `/asset-preview.html?asset=pont-de-normandie&view=overview`.

## Sources and dimensions

The lead's facts/OSM dossier and five-photo reference sheet were read before authoring. The checked primary references are the [CCI Seine Estuaire operator history](https://www.pontsnormandietancarville.fr/lhistoire/) and [operator structural description](https://www.pontsnormandietancarville.fr/lhistoire/pont-de-normandie/le-pont-en-details/). The former gives 2,141.25 m overall, a 23.60 m deck, 214 m pylons and service opening on 26 January 1995; the dossier gives inauguration on 20 January. The latter supplies the 856 m main span, 184 stays in eight groups of 23, 624 m metallic central deck, 15 northern / 11 southern approach piers and 43.5 m pier spacing. Its 204 m pylon statement conflicts with the history page; the dossier instead gives 202.74 m and the engineering consultant Setec publishes approximately 215 m. **The vertical datum discrepancy is unresolved**: 214 m is the selected visual crown, not a surveyed foundation-to-crown measurement.

| Quantity | Model | Basis |
| --- | ---: | --- |
| Current crossing | January 1995 | Operator history; inauguration/service dates differ |
| Main pylon separation | 856 m | Published main span; north tower at mapped main/approach road junction |
| Structural bridge length | 2,152.891 m | OSM deck/road endpoint frame, within 0.55% of published 2,141.25–2,143.21 m |
| Alignment including land road | 2,470.049 m | Midpoint of mapped directional carriageways |
| Deck platform width | 23.6 m | Operator published width |
| Selected crown | 214 m | Operator history; conflicting 202.74/204/215 m retained as uncertainty |
| Central steel section | 624 m | Operator structural description |
| Road at pylons / midspan | 48 / 59.5 m | Estimated vertical profile; midspan raised 3.5 m after review |
| Midspan central soffit | 56.25 m | Estimated 3.25 m box depth; visual camber exceeds dossier's 52 m clearance reference |
| Inverted-Y fork / solid head | approximately 122–124 / 122–214 m | Photo interpretation |
| Leg centres at foot / roadway | ±20.7 / ±15.8 m | Photo interpretation; outside all driving bands |
| Pylon longitudinal section | 8.4 m at foot / 5.4 m crown | Estimate |
| Stays near / far | 184 / 48 | Published count near; six representative stays per far half-fan, outermost preserved |
| Stay radius near / far | 0.084 / 0.9 m | Operator technical-sheet maximum 0.168 m diameter near; far four-sided prism minimum width 1.273 m for visibility |
| Main / side fan anchor reach | 40–418 / 24–198 m | Estimated distribution, two planes at ±10.95 m |
| Approach piers | 15 north / 11 south | Operator count; station schedule estimated with 43.5 m rhythm |
| North / south rising length | 862.229 / 711.820 m | Flat-map approximation, excluding 20 m grade landings |
| Short vertical curves | 50 m at each rising tangent | Modelling convention |
| Steepest north / south flat grade | 5.9097% / 7.2527% | Measured profile; published access viaducts are 6% |
| Physical abutment road heights | 5.770 / 9.394 m | Flat-map compromise, not surveyed bank height |

Reference-only photographs from the dossier:

- Pont de Normandie, User:Glabb, CC BY-SA 3.0.
- Vue panoramique du pont de Normandie, Citron, CC BY-SA 3.0.
- Normandy bridge (294800107), Jean-Marc Astesana, CC BY-SA 2.0.
- [Le Pont de Normandie 2](https://commons.wikimedia.org/wiki/File:Le_Pont_de_Normandie_2.jpg), Fabrice LANG / Woodstock, Free Art License; Commons author/licence page checked.
- J79164 Yul cdg 20140624-051332.55 France, Emdx, CC BY-SA 4.0.

Remaining photograph metadata is supplied by the dossier. No additional photographs, scan, capture, traced third-party geometry or image texture were used. No photographs ship in the repository/GLBs. The operator's technical-sheet PDF could not be opened through the web tool because it exceeds its size limit; its indexed maximum cable diameter is used only for the small visual cable radius, not structural verification.

## Geographic frame and road fit

Local real metres **+X east, +Y up, +Z south**, around `[0.27402,49.43226]`. Increasing station runs north to south; positive lateral is west. The main-span bearing is approximately 174.9° from true north. Rotation follows the OSM midpoint alignment and is baked in through `PROFILE.bridgePoint`; runtime applies latitude stretch once. Local y=0 is the visual water/flat-map datum. Buried/submerged piles are omitted. No terrain or Mercator scale is authored into the reusable model.

Mapped main carriageways **175399633 / 175405231**, northern approaches **1052637885 / 1052637886**, southern approaches **1052637887 / 1052637888**, northern continuation **27230048 / 175405232 / 220122726**, and southern continuations **1146979341 / 1329305676 / 1329305677 / 1146979340 / 175399628** define the frame. The original extract is `tmp/top-cities/pont-de-normandie/alignment-osm.json`; the one extra small request was made through the lead checkout's shared Overpass queue, saved as `north-osm.json`. Authored alignment vertices and the 20 primary bridge-road vertices used by durable tests are embedded in the owned alignment module.

The mapped `man_made=bridge` envelope **440837974** supplies `FOOTPRINTS`. It contains no building-tagged tower outline in the supplied extract. Pylon feet deliberately extend beyond that mapped deck envelope, as do the land-road ramps at stations 0–142.640 and 2295.531–2470.049 m. Those extensions are explained rather than inventing OSM ownership of neighbouring ground. The towers stand at 882.229 / 1738.229 m; the second is pinned 856 m after the first, approximately four metres short of the mapped southern main-span endpoint.

The two vehicle bands are `[-9.8,-0.7]` and `[0.7,9.8]` m, two lanes each with outer cycle/shoulder allowance. A concrete median separates them; raised outer walkways and lamp posts remain outside those bands. Exact lane/shoulder dimensions are estimates; live HD pavement and paint take precedence when available. The same profile provides deck geometry, road ownership, navigation heights, route/car/camera sampling and approach joins via `ROAD_LAYER = createRegistryBridgeLayer(PROFILE, PALETTES)`.

`terrainPolicy: 'absolute-deck'` retains the authored main deck and avoids flattening an estuary corridor. Shared runtime ground fitting plants supports in their local DEM and joins ramps to terrain. Attachment weights are zero on foundation boxes, interpolate up each support and become one at the deck; the upper structure follows the accepted driving surface. Repeated fitting restores immutable source vertices. No shared bridge module extension was needed. A landmark-owned world landing adapter follows transverse ground for the first/last 20 m and uses a cosine blend to the ordinary absolute ramp at 100 m; it fits the model, navigation API and captured HD surface/paint with their existing biases. Pavement has four lateral samples where landing fitting applies. Cityscape restores the source vertices and original pavement depth state.

## Original procedural structure and LOD

Chamfered lofts form the two inclined legs and tapered solid head of each inverted-Y pylon. The large open spaces below/above the road survive far LOD; a below-road crossbeam contacts both legs without occupying the lanes. Narrow steel head seams and visible casting-joint bands express the composite head and concrete construction without textures. Every stay terminates within the head face and at an overlapping deck anchorage. Near includes cable protection sleeves and landing blocks; far keeps six representative anchors per half-fan, both lateral planes and outermost reaches.

A closed six-point aerofoil section sweeps continuously over the shared vertical curve. Its central 624 m uses steel, with concrete elsewhere. Thin blue edge bands, parapet rails, frequent near posts, a median, four-lane fallback paint and alternating road lamps carry the detail visible to drivers. Twenty-six tapered/chamfered approach piers and caps contact the slab; no pier stands inside the 856 m navigation channel. Exact pier geometry, fork height, sections, anchor positions, hardware, rail spacing and road surface elevations remain visual approximations. Hidden piles, toll plazas, traffic signs, temporary maintenance equipment and cable vibration-control needles are omitted.

Near batches nine material names into three station chunks (25 actual draws); far combines all chunks into eight draws, folds lamp heads into rail material, removes posts/dashes/sleeves/casting bands, and reduces cable facets. Materials are `concrete`, `head`, `steel`, `cable`, `blue`, `asphalt`, `paint`, `rail`, `lamp`; both palettes share keys. Night dims the structure and lights the near lamp heads without invented pylon floodlights. Far lamps remain small unlit silhouettes.

## Export and visual verification

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 86,928 | 25 | 3,776,992 | 3688.5 |
| Far | 25,176 | 8 | 688,836 | 672.7 |

Both have matching bounds x −129.249..114.632 m, y approximately 0..214 m, z −1308.116..1154.118 m. Costs include bridge attachment weights and exclude runtime provider overlays. Tesla hardware performance is not measured.

Images opened and judged under `tmp/top-cities/shots/pont-de-normandie/`:

- `iteration-1/pont-de-normandie-procedural-near-light-sheet.jpg`: overview, front/back, roof, deck, tower, leg/slab contact detail and underside.
- `final/reference-and-export-sheet.jpg`: three dossier photographs beside exported near front/back/roof/driving/detail/underside and near/far light/dark overview/tower/deck views.
- `final/app-modes-sheet.jpg`: actual app far/near/street views in Cityscape and Full 3D world.

First inspection confirmed the inverted-Y openings and deck-edge blue trim. Overview cameras were widened to keep both approaches in frame. A focused geometry test exposed a below-grade slab at the northern physical abutment; the grade ramp was extended along the mapped northern land road until the complete slab clears y=0. The final maximum grade is below 8%. QA initially found four near crown-cover/head coplanar pairs; the nonessential cover was removed and final QA reports **zero coplanar pairs, zero issues, 0% back-face hits in 45 exterior rays**. Cables are intentionally fine/low-contrast in wide daytime views; the driving and tower views show both fans and apertures clearly. Far keeps the same silhouette with 48 of the 184 cables after the review correction. The reference-and-export sheet was regenerated and opened after final export.

Focused tests cover crown/separation from geometry, inverted-Y apertures and solid heads, planted feet, deck/soffit/support contacts, lane/median ownership, mapped orientation/envelope and explicit ramps, all 20 bridge-road vertices in both aligned directions, crossing/off-road rejection, grades/tangents, immutable repeated refits, GLB normals/materials/bounds/weights, absolute world deck, missing-terrain gating and flat restoration. The initial geometry/round-trip cases ran under one second locally. **298 combined focused tests pass**, including twelve landmark cases, using `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/pont-de-normandie/pont-de-normandie.test.js`. `node scripts/asset-catalog.mjs` passes (222 records / 414 variants), and `pnpm assets:preview` builds the local inspector. The twelve-case landmark file takes approximately 2–3 seconds with both LODs and the world/HD synthetic fixtures.

## App integration evidence

World mode uses 256 px Terrarium DEM, max zoom 15. Prescribed `app-shot.mjs --ids pont-de-normandie --shots far,near,street` runs load and activate both exported LODs in both modes. Both banks were additionally photographed at each physical abutment and each grade foot, facing both directions, using the same page automation and live map APIs. `final/app-approaches-sheet.jpg` was opened and judged: slab-to-ramp continuity and grade-foot contact are visible, with no observed vertical step/gap or duplicate elevated generic deck. The fallback road changes width/colour where it joins the ordinary road ribbon; live HD lane fit remains unverified.

The final `final/app-modes-sheet.jpg` and `final/reference-and-export-sheet.jpg` were regenerated and opened after the landing correction. The approach sheet has four columns: northern physical abutment both headings, southern physical abutment both headings; next row has northern and southern grade feet both headings. First two rows are Cityscape, last two are Full 3D world.

Live `window.__map.landmarks.heightAt(lng,lat,heading)` values are **metres above the queried ground**, identical for each sample in both aligned headings. Lane centres below are lateral −5 / +5 m:

| Sample | Cityscape −5 / +5 | Full 3D world −5 / +5 |
| --- | --- | --- |
| North grade foot | 0 / 0 | 0 / 0 |
| North 20 m landing | 0 / 0 | 0 / 0 |
| North physical abutment | 5.770 / 5.770 | 8.166 / 8.295 |
| North pylon | 48 / 48 | 47.544 / 47.690 |
| Midspan | 59.5 / 59.5 | 59.053 / 59.127 |
| South pylon | 48 / 48 | 46.423 / 46.613 |
| South physical abutment | 9.408 / 9.377 | 4.337 / 4.582 |
| South 20 m landing | 0 / 0 | 0 / 0 |
| South grade foot | 0 / 0 | 0 / 0 |

All **20 primary mapped roadway vertices / 40 heading queries** are owned in both modes. A lateral 30 m sample returns null; perpendicular headings are rejected by focused tests. Machine-readable live samples and screenshot coordinates/bearings are `tmp/top-cities/pont-de-normandie/app-height-cityscape.json` / `app-height-world.json`; the owned alignment module embeds the original primary road vertices for durable tests. A small lane-dependent difference at the south abutment comes from its mapped alignment tangent change, and is reflected consistently by the common profile.

**Terrain landing correction:** the initial north foot read −0.0895 / +0.0895 m, and its 20 m landing read +0.6516 / +1.1057 m above ground. The owned adapter corrects both to **0 / 0**, also at both southern feet/landings. It fits each landing vertex against local transverse ground, preserves rail/paint height offsets, and blends back to the shared absolute surface by 100 m. The synthetic tests cover sloping/undulating terrain, repeated terrain revisions, restoration to flat geometry/material depth state, both directions, and captured HD pavement/paint on both banks. No shared runtime extension was required.

HD pavement/paint is unavailable locally: `/osm-lanes` returns 503 without Redis. The HD landing adapter is verified synthetically, while the normal provider overlay behavior remains in the shared registry layer. Account API CORS failures and guest service 503s did not prevent model/terrain loading. The screenshot reports are retained under the two `app-*` directories.

| Environment / case | Status |
| --- | --- |
| Cityscape standard-road near/far load and both approaches | Verified locally on slot D |
| Full 3D world fixed main deck, terrain supports and grade contacts | Verified locally with Terrarium DEM |
| Both physical abutments / both grade feet / both directions | Verified locally, sixteen approach views judged |
| Both lane centres and 20 mapped road vertices | Verified by live height queries in both modes |
| Mesh/navigation common surface and repeated fitting | Focused geometry/surface tests verified |
| World HD landing pavement/paint | Synthetic tests verified; live HD not tested (503) |
| Active route/car/traffic, camera driving and picking | Common API checked; complete active navigation session not tested |
| Full mode/late-load/reanchor/failure lifecycle matrix | Focused terrain gate/restoration verified; complete app matrix not tested |
| MCU2/MCU3 hardware performance | Not measured |

The historical HD 503 limitations above describe the original October 10 run. The October 11 live-HD correction and evidence below supersede them.

## Independent review correction, 2026-10-10

Independent result: **PASS-WITH-NITS, recognition 4/5**, from `tmp/top-cities/review/pont-de-normandie/REVIEW.md`. No `REVIEW-2.md` or Prepare command was present in the supplied review, so its exported GLB review sheet was reproduced with `node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids pont-de-normandie --out tmp/top-cities/shots/pont-de-normandie/review-fix` and matching exported facade/tower/driving views.

| Finding | Before | After |
| --- | --- | --- |
| Far stays dotted/hairline at 500 m+ | 96 stays, three facets, 0.125 m radius (0.25 m nominal diameter) | 48 stays, four facets, 0.9 m radius, **1.273 m minimum cross-section width**; both plane fans and outer anchor reaches retained |
| Main span camber too gentle | 48 m tower deck, 56 m crown; 8 m rise | 48 m tower deck, **59.5 m crown; 11.5 m rise**; same approaches and horizontal OSM alignment |
| Hard pylon head/shaft colour break | Head light `#babbb5`, dark `#84949d`; shaft `#c4c2b5` / `#718089` | Head and shaft use the **same concrete tone in each palette**; solid head and fork silhouette retained |
| Optional near simplification | 184 physically thin six-sided near cables, detailed anchor sleeves/blocks | Near details retained; far reduction saves 384 triangles and about 23.3 KiB while improving visibility |

I opened `review-fix/review-fix-sheet.jpg`, which contains the reproduced reference/near/far review sheet plus exported near light, far light and far dark facade/tower/driving views. Compared with the independent review's original sheet, the far fans now form continuous triangular silhouettes and the head no longer has an artificial paint seam. The far prism is deliberately oversized and reads bulky from the far-only driving camera; this is a distance LOD concession, while near keeps the source cable diameter. No geometry look/fix beyond this single judged iteration was needed.

The final metrics file `tmp/top-cities/pont-de-normandie/review-fix-metrics.json` reports zero issues, zero coplanar overlap pairs and 0% back-face hits in 44 exterior rays; neither LOD exceeds budget. A new geometry test raycasts through an outer far stay from both sides and checks its visible thickness, and pins the 48 four-sided prism inventory. The existing terrain, deck-contact and round-trip tests were updated for the new crown/soffit; 298 combined focused tests and catalog validation pass.

All six app views loaded/activated the expected LOD; all 20 mapped roadway vertices remain owned in both directions in each mode. The live table above now records the revised crown: Cityscape **59.5 / 59.5 m**, world **59.053 / 59.127 m** above local ground. Every tower, physical abutment, grade foot and 20 m landing sample is unchanged from the previous fit; feet/landings remain **0 / 0 m**. The maximum main-span grade is 4.22%, below the unchanged maximum approach grade of 7.25%.

Opened the new `review-fix/app-modes-sheet.jpg` and `review-fix/app-approaches-sheet.jpg` (six mode views and sixteen bank/heading views). The higher crown preserves the existing deck/approach contact without an observed step or gap; ordinary-road width/colour transitions remain visible. Live HD pavement/paint still returns 503 without Redis, so its existing synthetic tests supply the HD landing evidence; a complete active navigation session remains untested. No shared integration source changed.

## Live HD correction, 2026-10-11

Only `REVIEW-2.md` is addressed in this pass. The released proportions, cables, palettes and static geometry are retained.

The initial live north-bank probe captured **four** visible overlays, two pavement and two paint batches, spanning stations approximately 32.64–1297.17 m. Ownership and the +0.06 m pavement / +0.08 m paint lifts were working. The missing paint came from the fitted model: OSM carriageway polygons overlap the median slightly, and a polygon's first vertex can lie on the opposite side. Without a declared median gap, the width sampler produced negative-side edges such as `[-0.701,10.002]` and positive-side edges `[-9.979,0.723]`. Those samples exchange carriageways, fold the slab/rails and cover the live paint.

The landmark profile now declares the existing **0.7 m median half-width** through `railGap`. The shared capturer clips at each median edge before side classification; measured north-bank sections become `[-9.979,-0.7]` / `[0.7,10.002]`. The same correction applies to both modes and LODs, keeps the median fixed, and retains provider lane/dash attributes and shared materials. No shared runtime source is changed.

The first contact sheet showed visible HD lanes in Cityscape but obscured paint in world. The owned landing adapter had applied polygon offset `-4/-4` to all fallback asphalt/paint in world, including pavement covered by live HD. That bias now applies only while HD is off; enabling HD restores the authored material's original depth state, disabling it restores the world fallback bias, and leaving world restores the flat state. Navigation heights and geometry coordinates are unaffected by this depth change.

Two regression cases cover overlapping provider polygons, ordered carriageways, upward-facing fitted asphalt, stationary median, preserved dash distance, lifted pavement/paint and original-index restoration; and world fallback depth state across HD enable/disable and terrain removal. No new reference photos or geographic queries were needed.

Final local bundle **5fa71fccfccb** was checked with HD on and `landmarks=off`, at zoom 18.2 / pitch 55 for both grade feet, both physical abutments +40 m inward, both mid-approaches and midspan. Both bank street views were additionally checked at zoom 20 / pitch 74 in both headings. All **44 on/off captures** loaded HD successfully; all 22 model-on captures loaded the near model. I opened and judged:

- `tmp/top-cities/pont-de-normandie/hd-fix/live-hd-sheet.jpg`: Cityscape on/off and world on/off at seven stations.
- `tmp/top-cities/pont-de-normandie/hd-fix/street-sheet.jpg`: both banks, both headings, both modes, on/off.
- `tmp/top-cities/pont-de-normandie/hd-fix/paint-off-sheet.jpg`: both modes with HD paint off; the fallback dashes remain covered.
- `tmp/top-cities/pont-de-normandie/hd-fix/export-sheet/pont-de-normandie.jpg`: regenerated reference/near/far GLB sheet; geometry is unchanged.

Both modes now show two lanes in each direction with the provider's lane dashes and outer edge lines visible along the structural bridge. The physical median replaces paint in its own occupied band. Railings, walkways and the median remain outside driving lanes. The paint switch hides the markings and restoring it sets all three shared HD materials to `uPaint=1`. The initial blank-deck baseline and first iteration are retained in `hd-fix/baseline/` and `hd-fix/iteration-1/`.

The reports `hd-fix/cityscape/report.json` and `hd-fix/world/report.json` include 15 stations × three laterals × two headings per view. All **30 lane-centre samples / 60 heading queries** return non-null heights and agree between forward/reverse headings in each mode. The actual alignment centreline is the median: all 15 centre samples correctly return null in both headings. Representative final values, metres above queried ground:

| Station | Cityscape −5 / +5 m | World −5 / +5 m |
| --- | ---: | ---: |
| North grade foot | 2.869 / 2.869 | 2.869 / 2.869 |
| North physical abutment | 8.294 / 8.294 | 10.690 / 10.818 |
| North mid-approach | 28.842 / 28.842 | 29.909 / 29.969 |
| North pylon | 48 / 48 | 47.544 / 47.690 |
| Midspan | 59.5 / 59.5 | 59.053 / 59.127 |
| South pylon | 48 / 48 | 46.423 / 46.613 |
| South mid-approach | 30.091 / 30.091 | 20.350 / 20.646 |
| South physical abutment | 10.431 / 10.401 | 5.360 / 5.607 |
| South grade foot | 1.273 / 1.273 | 1.273 / 1.273 |

The newly available HD approach samples replace the original zero-height fallback at the grade feet; the main deck heights remain fixed. This difference is provider fitting, not a change to the authored datum or profile. World lane differences reflect transverse DEM and the mapped south alignment turn.

`pnpm build:top-cities-landmarks pont-de-normandie --no-check` was rerun after each fix; both exports are byte-identical to the released files. Near remains **86,928 triangles / 25 draws / 3,776,992 bytes (3688.5 KiB)**, far **25,176 / 8 / 688,836 bytes (672.7 KiB)**. Artifact QA reports zero issues, zero coplanar pairs, 0% back-face hits and minY=0. `pnpm assets:preview`, all **300 combined focused tests (14 landmark tests)** and `node scripts/asset-catalog.mjs` pass (222 records / 414 variants).

Visible live HD overlays range from **4 to 10 draws**, with a maximum **18,245 triangles / 15,587 vertices / 732,950 bytes of geometry buffers**, separate from GLB download bytes. The corresponding near structure plus overlays uses at most **105,173 triangles / 35 draws** in the captured views. No per-frame tessellation was added and hardware performance is not measured.

| Current HD case | Status |
| --- | --- |
| Cityscape live OSM pavement/paint, both ends/approaches/midspan | Verified locally on slot C |
| World live OSM pavement/paint with Terrarium terrain, same stations | Verified locally on slot C |
| Both bank street views, both headings, paint off/on | Verified locally in both modes |
| Lane-centre common height, median rejection, depth-state reversal | Live queries and focused tests verified |
| Full active route/car/traffic/camera/picking session and MCU hardware | Not tested; checked separately |

Redis remains running. No shared source or other landmark is changed.
