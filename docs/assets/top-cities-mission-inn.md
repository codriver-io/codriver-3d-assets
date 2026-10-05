# Mission Inn, Riverside

Original procedural model of the present-day Mission Inn Hotel & Spa at 3649 Mission Inn Avenue, excluding the Annex across Sixth Street and adjacent shops. The official history establishes the 1876 boarding-house origin, 1903 Mission Wing and later Cloister, Spanish and Rotunda wings; the NPS nomination identifies the three principal courts and four named towers. No published metric height was found: every height below is an estimate, not a surveyed value.

Sources and reference licences are recorded in `prototypes/assets3d/catalog.d/mission-inn.json`. Reference photographs remain only in ignored `tmp/top-cities/mission-inn/refs/`. The dossier's `facts.txt` describes a disambiguation page; it was not used as evidence. Reference plaque photographs were read on the dossier sheet but were not needed for mesh authoring. No scans, photographs or textures enter the asset.

## Frame and dimensions

Real metres, east/up/south about `[-117.37293,33.9831]`; local y=0 is street grade. The OSM outline is preserved verbatim, and the export bakes a -29° Y rotation into an authoring frame with u at bearing 119° and v at 209°. OSM control points `[-117.3730645,33.9838175]` and `[-117.372601,33.983606]` on the northern boundary establish a bearing approximately 118.8°, matching the baked 119° frame. Source OSM way 206742226 tags four building levels; ways 913950656 and 958853956 are courtyard structures tagged 3.38 m and 3.57 m. These low roof heights are retained, while their mission entrance screen is photo estimated. No neighbour or Annex extrusion is owned.

| Feature | Metres | Basis |
| --- | --- | --- |
| Main outline area | 7,072 m² | Dossier OSM mapped |
| Main envelope in u/v | approximately 105 × 104 | OSM mapped, not nominal block size |
| Main hotel roof datum | 14.0 | Estimated four-storey mass |
| Mission open veranda and tile ridge | 17.9 / 20.25 | Photo estimate |
| Spanish pointed gallery / pinnacles | 18.1–22.45 / 26.0 | Photo estimate |
| Carillon belfry / roof ridge / finial | 23.3–27.7 / 29.5 / 30.2 | Photo estimate |
| Amistad blue dome / lantern finial | 25.45 / 29.52 | Photo estimate |
| Carmel open arched drum / dome / finial | 19.7–24.7 / 31.9 / 32.6 | Revised photo estimate after independent review |
| International Rotunda well | 23 diameter, top 20.65 | Estimated; preserved as real void |
| Spanish Patio void | 34 × 24 | Estimated within mapped envelope |

## Modelling decisions

The mapped U-shaped hotel mass is cut with two true courtyard holes. The northwest Rotunda has circular balcony galleries and a near-only spiral staircase; the separate northwest blue dome and northeast red dome mark the skyline. The square Carillon shaft has a genuine open belfry, suspended bells, thin columns and a tiled hip. The Spanish Wing carries pointed arch openings, projecting pinnacles and cornice detail, while Mission Wing verandas use pierced semicircular arch bands. The small entrance screen has a curved mission gable, three bell openings and a walk-through door. Window locations follow each actual OSM wall segment, and the largest visible facades carry supported balconies, window mullions, eave corbels and tile relief.

All repeated geometry is merged by named material. Nine near materials: stone, trim, roof, glass, wood, iron, glow, blue tile and warm brown masonry. Dark palette dims walls and roofs, warms selected windows; no seasonal Festival of Lights installation is simulated. Far folds wood to iron, reduces Rotunda galleries and tessellation and omits mullions, most balcony posts, stair treads and alternate exterior windows while keeping every tower, courtyard and open arcade.

The model is a recognisable architectural approximation, not a surveyed reconstruction: complex upper terraces and chapel placement are indicative; carved sculpture, exact tile patterns, gardens, Tiffany interiors and the Annex are omitted. Heights and internal court positions remain the main uncertainty. The downtown hotel is expected to use one rigid terrain datum; Cityscape and Full 3D world are both **not tested yet, integration is checked separately**.

## Verification

The initial authoring exports were inspected together with the four attributed reference photographs in `tmp/top-cities/shots/mission-inn/final/mission-inn-export-reference-comparison.jpg`. The sheet includes all rendered front/back/roof/street/detail/tower views: near light (seven views), far light (overview/facade/back/roof/detail), near dark (facade/back/detail/tower) and far dark (overview/facade/back/detail). Procedural source sheets were read in `tmp/top-cities/shots/mission-inn/` and its `iteration2/` directory. Red mapped outlines and the ground grid were retained.

What inspection changed: the first pass placed north-facing windows using a swapped coordinate; windows now follow actual mapped segments, including setbacks. The first overly expensive thick window frames became planar facade detail. Mapped north-roof setbacks were respected instead of a single rectangular roof; the courtyard gallery windows no longer extend above their supporting wall. The final near/far images retain the domes, Carillon opening, Rotunda void and Spanish pointed skyline; the Rotunda court remains open in both LODs. The near Spanish Patio resembles the photographed facade rhythm but omits carved panels and vegetation, and its exact internal composition remains estimated. Far drops much of the facade ornament while keeping the distinctive skyline and negative space.

The deterministic audit additionally caught inward-facing courtyard walls caused by unnormalised hole winding; holes now have explicit counter-winding. Open roof sheets became closed roof solids, and the arch bands discard their buried floor faces to avoid coplanar contacts. `tmp/top-cities/mission-inn/fix-metrics.json` reports **zero coplanar overlaps, zero back-face hits, no removable bridgeLift bytes**, and no budget or bounds issues.

| Export | Triangles | Draws | Bytes | KiB (rounded) |
| --- | --- | --- | --- | --- |
| Near | 48,291 | 9 | 2,144,760 | 2,094 |
| Far | 8,395 | 8 | 371,528 | 363 |

Focused landmark tests assert the mapped ownership/bearing, revised estimated 32.6 m skyline, below-grade absence, two sky-open courts, a walk-through entrance, open belfry, dome/roof retention, footprint containment allowing 1.6 m for balcony and cornice overhangs, far silhouette and exported GLB courtyard-facing normals. These numerical height assertions pin the chosen photo estimates; they do not convert those estimates into sourced measurements. `node --test` with the two requested files passes the Mission Inn landmark tests and its registry conformance checks; `node scripts/asset-catalog.mjs` passes. Independent reviewer acceptance remains with the coordinator; no in-app or Tesla hardware checks were performed.

Build: `pnpm build:top-cities-landmarks mission-inn --no-check`. Test: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/mission-inn/mission-inn.test.js`.

| Mode | Status |
| --- | --- |
| Inspector, source/GLB, near/far, light/dark | Verified through reference comparison and geometric audit |
| Cityscape | Not tested yet, integration is checked separately |
| Full 3D world | Not tested yet, integration is checked separately; rigid level foundation expected |

## Independent review fixes

The first independent review (`tmp/top-cities/review/mission-inn/REVIEW.md`, FIX, recognition 3/5) requested three architectural improvements. No second lead review or Prepare command was present, so the shared exported-GLB preparation tool was used: `node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids mission-inn --out tmp/top-cities/mission-inn/fix-sheet-final`.

| Finding | Before → after |
| --- | --- |
| Squat Carmel cap and blank drum | Solid blank cylinder under dome based at 21.45 m → octagonal shaft with a 5 m tall open arched drum, corner piers, eight projecting pinnacles and dome based at 24.7 m; dome rise 6.0 → 7.2 m, finial 28.2 → 32.6 m |
| Shallow uniform Spanish gallery | 0.55 m wide / 0.65 m deep stone piers and 0.32 m deep dark arch bands → 1.02 m wide / 1.8 m deep brown masonry piers with 0.9 m deep pointed arch spandrels, pale courses, and pinnacles raised from 24.1 to 26.0 m |
| Weak courtyard facade detail | Small sparse individual slabs and dark window outlines → two projecting balcony levels with continuous railings in Spanish Patio and entrance court, additional east-wall balconies and wider pale arched surrounds at prominent windows; far retains the upper entrance balcony and courtyard rail silhouettes |

The regenerated main review sheet `tmp/top-cities/mission-inn/fix-sheet-final/mission-inn.jpg` was read against its Spanish Wing reference photo. The detail/reference contact sheet `tmp/top-cities/shots/mission-inn/fix-final/fix-details-reference.jpg` was also read: it compares the actual reference with near/far Carmel drum and Spanish Wing close views, near dark versions, the avenue-facing courtyard and roof. Those views show the requested tall dome, strong masonry/pinnacle rhythm and projecting balcony bands in both LODs. Courtyard composition and every revised height remain photographic estimates; carvings, plants and the exact glazing pattern remain omitted.

Near/far preserve the same silhouette bounds apart from the deliberately raised Carmel tower. The added masonry uses nine near draws and eight far draws; far retains one upper Rotunda gallery, with the sky-open well unchanged. Identical position/normal tuples are merged at 1e-7 m tolerance before export, preserving triangle counts, sharp normals and visible surfaces while reducing bytes. The final deterministic audit has no flagged artifact, zero coplanar overlaps, zero back-face hits and no removable attributes. Landmark tests now raycast the open Carmel drum, contrasting gallery piers/pointed openings and projecting entrance balcony in addition to the existing courts/belfry checks. Independent acceptance of this revision and app integration remain separate coordinator steps.
