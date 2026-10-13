# Porsche Museum — Stuttgart

Original procedural, texture-free model of Delugan Meissl’s 2009 Porsche Museum at Porscheplatz, Stuttgart-Zuffenhausen. Identity is the angular white exhibition monolith floating over a low glazed base on **three V-shaped concrete cores**, the north-facing glazed facade with broad steel V chords, the open undercroft and the angled stair connection. Both LODs retain those features.

## Sources and rights

- [Porsche official architecture and building data](https://newsroom.porsche.com/en/press-kits/Porsche-Museum/Architektur-als-Erlebnis.html): architect, 23 m building height, maximum 10 m undercroft, three V columns, north glazing, low base, angled partly glazed stair and roof terrace; published overall dimensions 140 × 70 m.
- [Ebener facade supplier](https://www.ebener.de/en/referenzen/porsche-museum-2/): white aluminium rhomboid cladding and circumferential structural girders on three concrete cores.
- [OSM museum way 30698972](https://www.openstreetmap.org/way/30698972), retained dossier `tmp/top-cities/porsche-museum/osm.json`: complete angular overhanging envelope, civic building, three levels, layer 1. No extra Overpass query was required.
- [Porsche-Museum in summer.JPG](https://commons.wikimedia.org/wiki/File:Porsche-Museum_in_summer.JPG), RudolfSimon, CC BY-SA 3.0: daytime entrance, white wings, north glazing, cores and stair; added to ignored references as `refs/summer.jpg`.
- [Porsche-Museum Main Entrance.JPG](https://commons.wikimedia.org/wiki/File:Porsche-Museum_Main_Entrance.JPG), RudolfSimon, CC BY-SA 3.0: dossier `refs/2.jpg`, night facade and underside.
- [Porsche-Museum in Stuttgart-Zuffenhausen 03.jpg](https://commons.wikimedia.org/wiki/File:Porsche-Museum_in_Stuttgart-Zuffenhausen_03.jpg), Giftzwerg 88, CC BY-SA 3.0: silver panel soffit detail, ignored `refs/side.jpg`.
- Dossier construction photograph `refs/5.jpg`: Wolfgang Pehlemann, *Neues Porsche-Museum am Porscheplatz Stuttgart-Zuffenhausen 2007 Foto Wolfgang Pehlemann DSCN8511.jpg*, CC BY-SA 3.0 de, corroborates the facade V trusses.

The initial dossier sheet was inspected; its four exhibition/car close-ups are not architectural sources. Only two additional photographs were fetched. All photos remain under ignored `tmp/`, with no copied pixels, meshes or textures in source or GLBs. Generator/model are original Codriver work; OSM-derived data retains contributor credit and ODbL independently of model licensing.

## Dimensions and estimates

| Feature | Value | Basis |
| --- | --- | --- |
| Highest building point | 23 m | Porsche published; source and exported geometry |
| Maximum north undercroft | 10 m | Porsche published; facade bottom vertices |
| Museum overall dimensions | 140 × 70 m | Porsche published overall building data; not a surveyed replacement ring |
| Exported geographic envelope | 115 m east-west × 71.86 m north-south | Photo-calibrated shell inside the complete provider ring; these axes are not the published building axes |
| Museum provider outline | about 6,675 m² | OSM dossier |
| North glazed face | 43.17 m upper / 39.67 m lower edge | Photographic estimate, oriented to the mapped north-edge bearing |
| Support cores | 3 bifurcating cores | Porsche published count; position/width/angle estimated |
| Core tops | 7.7 / 8.7 / 9.6 m | Estimated; arms embed in named soffit surface |
| White shell lower edge | 6.2–10 m | Estimated variable underside fitted to photo, maximum sourced |
| Roof slope and terrace | Southern descent; one recessed terrace | Photographic interpretation, not measured plans |
| Low base roof | about 1.7–4.5 m | Photographic estimate |

Published dimensions and the mapped irregular provider envelope do not coincide. The OSM ring remains the complete geographic replacement authority. The visible shell is independently fitted to entrance photographs: shorter white wings bring north glazing to 56.7% of the projected frontage, within the review’s 55–60% reference range. Its estimated 115 m east-west extent is not a new surveyed dimension. No surveyed facade, structural or roof plans were used.

## Frame and provider ownership

Origin `[9.152559010518338, 48.83422261502164]` is the museum ring area centroid. The initial dossier origin was on the northwest side of the footprint. Real metres, X east / Y up / Z south; local y=0 is rigid flat-map grade. Rotation is baked into mapped vertices, never reapplied by the host. Mapped north-edge control points `[9.1519705,48.8345625]` and `[9.1525343,48.8345958]` establish approximately 85° edge bearing and 355° outward frontage. The authored north edge retains that bearing while adjoining wings are shorter and inset. Lower side vertices taper inward 7%; the glazing narrows with explicit 2 m / 1.5 m corner offsets. Every source vertex remains inside the unchanged provider ring.

`FOOTPRINTS` and `OSM_WAYS` own **only way 30698972**, including the overhang, even where the undercroft is empty. The detached roof ways 234155411 and 234155421, station elevators 300215732/300215734, DB technical hut 1418112905, shelter 783544697 and nearby Porsche works/dealership buildings remain outside ownership. No provider parts are separately tagged inside the dossier museum envelope.

A bounded median terrain pad uses the museum ring and its seven perimeter reference points, with 6 m feathering. It provides a placement handoff, not demonstrated DEM compatibility. No DEM, altitude or latitude stretch is baked into the GLB.

## Geometry and materials

A closed photo-calibrated angular loft, independent of the mapped replacement ring, creates tapered white aluminium side faces, the north trapezoidal glazed facade, a silver soffit and sloping roof. The roof terrace is a genuine recessed hole with closed reveals and floor. Near aluminium panel seams partition the wall skin; far drops the fine seams. Broad diagonal V chords and glazing mullions partition pane polygons, with no underlying overlapping glass slab. Near uses 18 north bays in four rows, far 10 bays in two rows; the base has 12/6 bays per facade.

All three cores retain both angled arms and horizontal footing sections at grade. Arms penetrate the monolith, and the enclosed stair meets the low base roof and upper soffit. The stair’s upper terminal was lowered from 9.1 to 8.8 m to retain contact after reshaping the soffit. Tests isolate the main soffit from the stair's shared material to prevent self-contact from passing. Small block lettering reads “PORSCHE MUSEUM” on near glazing and is omitted in far. All compatible geometry is merged by material: eight near materials, six far. Daylight uses subdued white, concrete and dark grey-blue glass; night uses dimmer metal and warm grey self-lit panes.

Approximations: individual lozenge panels are reduced to sparse seam divisions; opaque glazing has no interiors or cars; the silver soffit has no photographic reflections; exact lobby and terrace geometry, detailed interior ramps, railings, surrounding sculpture, lights and campus/station structures are omitted. Roof slope, V arm geometry/position and stair enclosure are visual estimates. These are exterior driving-scale LODs, not engineering reconstructions.

## Measured exports and verification

Build: `pnpm build:top-cities-landmarks porsche-museum --no-check`.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 6,992 | 8 | 553,568 | 540.6 |
| far | 542 | 6 | 48,412 | 47.3 |

Measured default-scene GLB costs; no hardware timing is implied. Near/far bounds agree exactly. The render tool includes two extra ground-plane triangles, which are excluded from these asset metrics.

Review b9a finding 1 identified overlong white wings and a north glazed face occupying only about 43% of the rendered frontage. The fix separates the shell from the OSM replacement envelope, shortens both wing transitions, moves the north upper/lower corners and retains the three V cores and clear undercroft. Near cost changed from 8,432 triangles / 8 draws / 666,032 bytes to 6,992 / 8 / 553,568; far changed from 542 / 6 / 48,504 to 542 / 6 / 48,412.

Judged exported screenshots under ignored `tmp/top-cities/shots/porsche-museum/`:

- `fix1/porsche-museum-glb-near-light-sheet.jpg` and `fix1/porsche-museum-glb-far-light-sheet.jpg`: opposite elevations, roof, plan, support detail, entrance and initial frontal camera; both LODs retain the void, all cores, terrace and glazing rhythm. The first frontal camera clipped a wing, so its framing was rejected.
- `fix2/porsche-museum-glb-near-light-sheet.jpg` and `fix2/porsche-museum-glb-far-light-sheet.jpg`: complete north facade and entrance with final camera `[-38,4,-140] → [-18,11,-34]`, compared with `refs/summer.jpg` and `refs/2.jpg`. All shell corners are in frame; projected upper glazing spans 56.7% of frontage in both LODs, compared with 45.1% for the previous shell projected in the same camera. Camera pose and shell fit are photographic estimates.
- `fix2/porsche-museum-glb-near-dark-sheet.jpg` and `fix2/porsche-museum-glb-far-dark-sheet.jpg`: final night facade/entrance, preserving pane rhythm and support visibility.

All **14 museum tests pass**, including the new projected glazing-share and whole-frontage framing checks, unchanged footprint ownership, 23 m height, grade, named core/stair/V-chord contacts with shortened-end negative cases, and near/far bounds. The required combined `top-cities.test.js` + museum run finished **631/632 passing**, with all three museum registry checks passing; the sole unrelated failure was `washington-national-cathedral` far at 0.51 MB against its 0.5 MB cap. `node scripts/asset-catalog.mjs` was run twice and blocked by another builder’s missing `docs/3d-top-cities-ut-tower.md`; landmark-only metric/depth checks used their supported fallback and passed. These shared checks remain lead-owned once concurrent builds settle. See `tmp/top-cities/porsche-museum/fix-report.md`.

`node scripts/landmark-depth-layers.mjs --ids porsche-museum` and `--check` pass with zero cycle edges dropped. `tmp/top-cities/porsche-museum/fix-metrics.json` reports zero coplanar overlaps, zero layered faces, 0% back-face ray hits, no below-grade geometry, no window-rhythm flags and no budget issues. The generated shared depth table is the only permitted shared edit. No other landmark or shared source was edited.

| Integration gate | Status |
| --- | --- |
| Cityscape | Not tested yet; integration is checked separately by lead |
| Full 3D world / topography | Not tested yet; integration is checked separately by lead |
| Provider replacement, app shared shading and DEM contacts | Not tested |
| Independent reviewer | b9a FIX addressed locally; lead recapture and independent re-review pending |

No application server, full test suite, runtime bundle, installation, git write or deployment was run. Global asset preview/server generation and both-mode app captures remain lead-owned under the builder brief. Readiness describes the verified asset exports; it does not certify application integration or terrain.
