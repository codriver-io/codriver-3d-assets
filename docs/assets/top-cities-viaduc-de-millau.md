# Millau Viaduct

Original procedural current **2004 A75 crossing**, Millau–Creissels, Aveyron. Michel Virlogeux and Norman Foster designed the seven-pylon, eight-span bridge over the Tarn valley. Source lives entirely in `src/peregrine/landmarks/top-cities/viaduc-de-millau/`; no photographic textures, traced meshes or reference captures ship.

## Dimensions and provenance

[Eiffage's official key figures](https://www.leviaducdemillau.com/sites/viaducdemillau/accueil-viaduc-de-millau/le-viaduc/les-chiffres-cles.html) establish the span arrangement, seven pylons, 154 stays, grade and curve radius. [Buonomo, Raas and Schröter, Stahlbau 74 (2005), fabrication paper hosted by Dillinger](https://www.dillinger.de/app/uploads/2024/03/20160215023853-dh_gro__e_viadukt_von_millau.pdf) supplies pier heights, the longitudinal inverted-Y mast, 38 m legs / 49 m stem, tapered sections and 3.20 m wind screens. [Wikipedia](https://en.wikipedia.org/wiki/Millau_Viaduct) and the supplied dossier establish identity, opening date and 32.05 m overall width.

| Feature | Model | Basis |
| --- | --- | --- |
| Structural deck | 2460 m | Official; centred on mapped 2470 m roadway |
| Spans | 204 + 6 × 342 + 204 m | Official |
| Overall deck width | 32.05 m | Wikipedia; official rounds to 32 m |
| Pylon above deck | 87 m; 38 m open legs, 49 m stem | Official / fabricator |
| Stay arrangement | 11 forward + 11 back per pylon, 154 total | Official; single median plane |
| Grade | 3.025% north to south | Official; source road rises 74.415 m |
| Plan curvature | Mapped roadway, nominal 20 km radius | OSM / official |
| Pier P1…P7 | 94.501, 244.96, 221.05, 144.21, 136.42, 111.94, 77.56 m | Published fabricator lengths |
| Pier upper split | 90 m, shortened for the smallest pier | Fabricator; small-pier closure estimated |
| Mast sections | 3.5 m transverse; 4.75 m legs, 9.7 → 2.4 m stem longitudinal | Fabricator |
| Pier sections | 17 m along, tapered 10…27 m across; bevels | Fabricator limits, interpolation estimated |
| Steel box soffit | 4.2 m central depth, sharp cantilever edges | Fabricator; edge sections estimated |
| Wind screens | Continuous 3.2 m closed skins with near horizontal louvre bands | Fabricator height; representation estimated |
| Stay anchors | 26…151 m reach, 51…82 m anchor height | Visual estimate; LOD-compensated radii 0.45 m near / 1.30 m far, deliberately enlarged for distant rasterization |
| Plateau abutments | 12 × 31.3 × 10 m | Visual estimate |

Origin `[3.02242,44.07999]`, axes east/up/south. Alignment averages the two mapped motorway carriageways at equal normalized distance and continues onto mapped plateau ways 472304184 / 4296810. The shared Overpass helper was attempted; a failed endpoint was followed by the documented single-object OSM API fallback. Dossier and API responses stay in ignored scratch. [OSM outline 440836275](https://www.openstreetmap.org/way/440836275) is the replacement footprint, with roads 4296812 / 4296813. No building-tagged tower boxes were present in the supplied extract. Source roadway extends roughly 80 m north / 55 m south beyond the physical deck. Bearings and geographic rotation are baked from this alignment, with the runtime applying latitude scale once.

The five supplied photos were viewed in `refs-sheet.jpg`. Only two were used beside the final export: *Millau Viaduct, France (39307678014)*, Mike McBey, CC BY 2.0 (dossier licence), and [*ViaducdeMillau.jpg*](https://en.wikipedia.org/wiki/File:ViaducdeMillau.jpg), Mike Switzerland, CC BY-SA 2.5 (file page checked). The latter lives on English Wikipedia; its former Commons page is deleted. [*Creissels et Viaduct de Millau*](https://commons.wikimedia.org/wiki/File:Creissels_et_Viaduct_de_Millau.jpg), Stefan Krause, CC BY-SA 3.0, also has a checked file page. Other dossier references: Wolfgang Pehlemann's panorama, CC BY-SA 3.0, and *Viaduc de Millau 1*, Vincent, public domain. They remain reference-only scratch, never public exports.

## Datum and placement

**y=0 is the north abutment finished-road surface.** Published unequal pier lengths are structural geometry and extend below this datum; no DEM or absolute altitude is baked into GLBs. Lowest exposed foot is −232.6435 m; highest source crown is +155.244 m. `SPEC.height=155.25` describes that crown ordinate, while `belowGradeM=240` declares the intentional negative support range. The published **343 m above the foundation** is a different datum: this visual model omits buried foundation shafts and represents the exposed pier and mast lengths; it does not claim a survey-grade reproduction of the full foundation-to-tip measurement.

The coordinator authorized this datum and supplied a backward-compatible shared conformance exception, commit `ca15277f` (`belowGradeM`), already staged in this worktree. The worker did not edit shared files. This prerequisite must accompany integration; no bridge-* source extension was needed.

**Cityscape:** the valley is absent. The local road profile flattens to the two live approach-road heights with 0.35 m camber; piers remain below ground by design; their concrete meshes are hidden explicitly because the flat basemap otherwise draws negative geometry through the ground. There is no implausible 270 m ramp on the flat basemap. Pylons retain their 87 m road-relative height and single-plane fans. Grade feet meet the shared endpoint road heights exactly.

**Full 3D world:** `absolute-deck` avoids flattening a valley corridor. A landmark-owned adapter tags the absolute road profile internally, fits a straight graded deck between live plateau endpoint samples and trims/extends the lower solid pier shafts to local terrain. The upper split, mast and deck stay rigid when terrain leaves enough room. A DEM that encroaches on a short pier compresses that pier’s split bay only as necessary to retain a positive lower shaft; it never moves the deck or mast. Unknown support/approach DEM keeps the model and mask inactive through the shared layer. Refits use immutable source positions. The DEM-derived grade may differ from the surveyed 3.025%; it is recorded with app evidence below. The normal registry layer owns HD replacement, navigation and the moving-origin lifecycle.

## Geometry, palettes and measured exports

Each LOD retains all seven masts, eight spans, split pier windows and the steel A openings. Near merges four station chunks by eight materials, keeps all stays, sleeves, median rail posts, continuous 3.2 m screens with three louvre bands, fallback motorway paint and small crown beacons. Far merges seven materials, uses coarser longitudinal sampling, four stays per half-fan and continuous 3.2 m screens with a top cap, and removes posts, dash paint, sleeves and beacons. Light is pale concrete / white steel (#e6e9e8) with darker cables and asphalt; night darkens the structure while keeping stays readable. Only small near crown beacons use a self-lit `lamp` material. No invented floodlighting or texture assets.

| Export | Triangles | Mesh draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| Near | 68,442 | 32 | 2,082,756 | 2,033.9 |
| Far | 14,280 | 7 | 341,728 | 333.7 |

Both fit 120k / 40 / 4.5MB near and 30k / 10 / 1.2MB far caps with headroom. The near cost is chiefly 2.46 km of sampled graded pavement and wind-screen/louvre strips; continuous screens remove hundreds of vertical posts. Far is one fifth of near triangles; bounding boxes match exactly. GLBs use standard uncompressed materials and preserve bridge attachment weights.

## Export inspection and tests

Scratch evidence is rooted at `tmp/top-cities/shots/viaduc-de-millau/`. For this below-grade datum, the ordinary `shot.mjs` was copied into landmark scratch with its inspection ground lowered to −255 m; no shared QA script was changed. Footprint rings remain at y=0, so a ring crossing the projected deck in broadside is a reference overlay, not model geometry.

Viewed **`final/reference-and-export-sheet.jpg`**, with reference photos alongside exported near front/back/above/driving/mast/pier-detail and far light overview/mast, near dark overview and far dark overview. Source iteration sheet was also opened. Initial raycasts exposed a missing longitudinal loft coordinate; it was fixed before visual/export inspection. The first sheet prompted tighter broadside framing, a coarser inspection grid and replacement of estimated mast/pier sections with fabricator dimensions. The final sheet confirms seven sail fans, the thin box deck, true mapped curve, A openings and unequal supports. Day overview cables are sub-pixel and low contrast against the inspector sky; the driving and mast close-ups show the actual full near fan. Far intentionally reduces cable density while retaining outer reaches and every structural opening.

`node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/viaduc-de-millau/viaduc-de-millau.test.js`: **255 passed / 0 failed**. Nine landmark-specific tests finish well below 3 s: crown heights/span rhythm, split and A openings by raycast, published feet/deck soffit contacts in both LODs, lane ownership/rejected crossing headings, synthetic DEM support landing / repeated immutable refits, transverse landing mesh/navigation HD overlay surface-bias checks, high plateau terrain shortening P7 without inverted shafts, and continuous wind screens hit from either side between former posts at three heights in both LODs. Registry tests check GLB bounds, materials, source equality, export bytes and silhouette. `node scripts/asset-catalog.mjs` passes: 209 entries / 386 variants. `pnpm assets:preview` builds the local inspector. `pnpm build:peregrine` succeeds, review build `82043386a67d`; generated bundles are excluded from delivery.

## Application evidence

Local slot C, Cityscape 3278 / terrain 3280, Protomaps tiles and Terrarium 256 px / maximum zoom 15. The prescribed app-shot far/near/street runs loaded both LODs and activated the landmark in both modes. Viewed `app-modes-sheet.jpg` and `app-approaches-sheet.jpg`: both physical abutments in both headings, grade feet, and a world view from the Millau valley. No duplicate generic deck was observed. The narrow white standard-road ribbons join the broader fallback deck; the change in width/colour is visible because HD pavement is unavailable. This is not HD lane-width or paint certification.

Live `window.__map.landmarks.heightAt(lng,lat,heading)` samples below are **metres above local ground** at lateral +7 m; reversing heading gives identical values. Perpendicular headings return null. Raw observations and capture coordinates are `tmp/top-cities/viaduc-de-millau/app-height-cityscape.json` / `app-height-world.json`.

| Sample | Cityscape | Full 3D world |
| --- | --- | --- |
| North grade foot | 0 | 0 |
| North physical abutment | 0.00384 | 17.62270 |
| P1 | 0.04128 | 80.88213 |
| P2 | 0.16694 | 238.36519 |
| P3 | 0.29777 | 220.21799 |
| P4 | 0.34992 | 146.05601 |
| P5 | 0.28998 | 129.45960 |
| P6 | 0.15635 | 105.30363 |
| P7 | 0.03468 | 57.13806 |
| South physical abutment | 0.00194 | 11.06719 |
| South grade foot | 0 | 0 |

The first world landing query read +1.60638 m north / −1.75834 m south because centerline DEM differed from lane ground. The owned adapter now uses transverse ground for the first/last 25 m and a smooth blend out to 65 m, correcting both grade feet to **0 m** in both headings. Meshes, navigation and captured HD overlay landing heights share this rule; synthetic tests verify repeated fits and overlay bias. HD overlay handling is tested synthetically, not against live provider paint. Ordinary flat-mode supports also needed explicit visibility removal after the first app sheet revealed that below-ground piers were drawn through the basemap.

The current terrain-derived deck endpoints are 592.249 / 677.161 in renderer ground metres, yielding a 3.2545% bank chord across the approach-inclusive 2609.065 m profile. These are **renderer DEM datums**, not surveyed sea-level elevations. This coarse terrain shortens the visible P1/P7 relative to published source lengths; P7 has about 53 m of pier below the 4.2 m soffit, versus its published 77.56 m. A focused high-plateau test keeps the lower shaft positive and closes the foot without moving the deck. World placement is verified as a coherent visual/road fit; exact surveyed elevations and pier heights in terrain remain unverified. The source GLBs retain the published dimensions.

Deterministic exported QA reports **zero different-material coplanar overlaps**, 0% back-face hits from 44 exterior rays, correct budgets and matching bounds. Its only issues are the intentional −232.64 m supports; the older generic QA reporter has no `belowGradeM` exception. Initial abutment edge coincidences were removed by slightly narrowing the buried concrete block beneath the cantilever deck.

| Environment / case | Status |
| --- | --- |
| Cityscape standard-road load, near/far and approaches | Verified locally; flat valley omitted, concrete supports hidden |
| Full 3D world deck, support landing, valley and approach views | Verified locally with current Terrarium DEM; surveyed geometry placement unverified |
| Both grade feet, both headings | Verified; height API returns 0 m above local ground |
| Profile ownership / crossing headings / shared camera height API | Verified by focused tests and live queries |
| Live HD pavement and paint | Not tested; local lane service returns 503 |
| HD transverse landing fitting | Verified synthetically |
| Active paired driving, route/traffic/picking and paint switches | Not tested |
| Full terrain revision / failed-load / leave-return / reanchor lifecycle | Not tested in app; immutable refits covered by tests |
| MCU2 / MCU3 performance | Not measured |

Only the landmark folder, catalog fragment, document and three runtime exports are delivered. No shared bridge source was edited. Coordinator conformance prerequisite `ca15277f` remains necessary. Generated bundles are restored and local slot C servers stopped before completion. Live HD lane paint remains not tested because local `/osm-lanes` returns 503 without Redis. Actual paired driving, active navigation/traffic/picking, the full late-terrain/failure/reanchor/mode matrix and MCU hardware performance remain separate QA gates.


## Independent review corrections (2026-10-09)

The local `tmp/top-cities/review/viaduc-de-millau/REVIEW.md` has three findings and no Prepare command; `REVIEW-2.md` is absent. Re-ran the standard preparation with `node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids viaduc-de-millau --out tmp/top-cities/review/viaduc-de-millau/revision-2` and opened that exported-GLB sheet. Also opened `tmp/top-cities/shots/viaduc-de-millau/revision-2/reference-and-export-sheet.jpg`, comparing near/far, light/dark, deck and mast captures against both supplied reference photos. Two look-fix iterations were used.

| Review finding | Before → after |
| --- | --- |
| Dotted stays at distance | 0.13 / 0.19 m near/far radii → 0.45 / 1.30 m; far half-fans consolidate six strands to four, keeping inner and outer reaches; no longitudinal segments added |
| Low open edge rails | Ribs and 5 m posts → continuous closed 3.2 m wind screens, with near horizontal louvre bands and a top cap in both LODs |
| Blue-grey masts | Light steel #cbd3d4 → white #e6e9e8 |

The cable widths are deliberate visual compensation, not measured physical stay diameters. Full-sized facade and mast renders show continuous fans; the generic 480 px, whole-bridge QA tiles still undersample thin geometry and should not be interpreted as missing cable segments. Screen panels are opaque pale glass-colour geometry so traffic is obscured without transparency sorting. No photos or textures are exported.

Near changed from 75,290 triangles / 32 draws / 2,715,248 bytes to 68,442 / 32 / 2,082,756; far changed from 15,312 / 6 / 365,528 to 14,280 / 7 / 341,728. Both retain the same bounds and stay within budget. Post-review focused tests pass (255 / 0), catalog validation passes (209 entries / 386 GLBs), and exported geometry QA finds zero coplanar pairs and 0% back-face hits over 51 exterior rays. Only the already-agreed below-grade support datum is flagged by the older generic metrics script. Coordinator conformance change `ca15277f` is preserved unchanged.


Rebuilt the final runtime (`82043386a67d`) and re-ran `app-shot.mjs` at slot C after the second export: Cityscape and Full 3D world each report `loaded=true`, `active=true`, far/near/near for far/near/street captures, and zero pending downloads. Opened `revision-2/app-modes-sheet.jpg`: fan silhouettes and continuous edge screens are visible in the app, with white pylons and no duplicate deck. The world street preset looks from the valley below the elevated deck, so its close view primarily checks support landing; the near world view checks the stays and screens. Existing terrain, HD-service and lifecycle limitations above remain unchanged. Generated bundles were restored and both local servers stopped after inspection.
