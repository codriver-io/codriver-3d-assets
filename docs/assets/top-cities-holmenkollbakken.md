# Holmenkollbakken, Oslo

Original procedural model of the 2010 Holmenkollbakken ski jump (HS134 / K120) at Holmenkollveien, Oslo. The version is the JDS / COWI rebuild, the white-clad cantilevered inrun with its continuous wind-screen sides, not the pre-2010 white concrete tower. Cityscape model with a separate, incomplete Full 3D world terrain gate.

Build: `pnpm build:top-cities-landmarks holmenkollbakken`. Source: `src/peregrine/landmarks/top-cities/holmenkollbakken/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, `holmenkollbakken-plan.js`, `holmenkollbakken-mesh.js`, `holmenkollbakken.test.js`). Catalog: `prototypes/assets3d/catalog.d/holmenkollbakken.json`.

## What a driver sees

From the bowl the signature is a shallow truss wind screen across the head of the snow landing, OSLO and the red/blue lines, and grey seating stepped down both flanks into a horseshoe outrun bowl. The side silhouette is a continuous opaque white cantilever sweeping down from one slender square start tower to the take-off. Fine lattice is surface relief in near detail. One short raked strut meets the inrun near its lower root; elevated spans stay clear of the ridge in both LODs.

## Sources

| Fact | Where |
| --- | --- |
| HS134 / K120, inrun length e = 95.65 m, 36° to an 11° table, r1 = 108.80 m, t = 6.60 m, take-off 3 m, track 2.77 m, h = 59.10 m, n = 103.70 m, landing angles 35.7° / 33.2° / 30.8° at P / K / L (105.6 / 120 / 134 m), landing width 25.2 m at K | 2022 FIS certificate, skisprungschanzen.com HS134_2022 |
| Tower 64 m, wind screen 2 m at the lip and 12 m at its highest, judges on the left, steel grandstand structure with concrete seating, outdoor glass elevator, viewing platform | Holmenkollen faktaark, 2010, and the holmenkollen.com archive note of 3 March 2010 |
| JDS Architects, stainless-steel mesh, about 69 m cantilever, rises about 58 m | JDS project notes, used as a cross-check. The model uses the certificate length and the 64 m tower figure |
| Plan, centreline bearing 120.2°, steel slices, flares and stands | OpenStreetMap, dossier extract of 2026-10-08. Ways listed in `footprint.js` |
| Finished massing: shallow front truss, mesh inrun, glass start, OSLO, red/blue lines, bowl stands | Commons: New Holmenkollen ski jump, Egil, CC BY 2.5; Ski Jump at Holmenkollen, Max Froumentin, CC BY 2.0. Construction lattice: Wilhelm Joys Andersen, CC BY-SA 2.0. The pre-2010 tower in the older dossier photos was not modelled |

## Frame and datum

Origin is the take-off lip on OSM way 81176913. +X east, +Y up, +Z south. Downhill is +u, the jumper's right is +v. Rotation is baked in. **y = 0 is the outrun floor at the bottom of the bowl**, not the tower footing and not sea level. The lip is about 80 m above that floor and the terrace rail is 133.5 m, so the 64 m tower figure is the rail minus the grate under the start (69.5 m), the clearance under the overhang.

No DEM is baked in. Cityscape uses a closed neutral embankment below the snow. The earth/ridge is #d6d8d0 and shoulders #c4c8bc (night #2b3440 / #252d38); snow stays white and stands grey. The rear taper is 15 m beyond the start house instead of 100 m, and side toes are capped at 15 m beyond the local landing/stand envelope. This makes the upper side batter steeper; it is still closed and sloped. Both LODs interpolate the same exterior stations. Stand shells have shallow concrete edges and sloping earth backing, rather than full-height pale retaining walls. This bounded structural/site stand-in is estimated; it is not surveyed natural terrain. Its earth shoulders extend beyond the mapped snow and stand polygons; those polygons still own only the provider building replacement, and are not enlarged to erase surrounding terrain or buildings.

`terrainPad` now covers only the flat outrun at u=196–214, v=±9, taking the **lowest** of four DEM references at u=198/210, v=±6 (12 m feather). It does not flatten the upper hill or lift the model from the take-off datum. Cityscape: **verified for daytime near/far visual smoke only**; full lifecycle, night and hardware integration are not tested. Full 3D world: **unsupported for verified terrain integration pending hillside fitting**. Preliminary Terrarium captures load both LODs, but the rigid upper ridge/landing still protrudes above terrain; the corrected outrun pad alone cannot suppress the authored mound in world mode.

## Dimensions

| Quantity | Model | Source |
| --- | --- | --- |
| Inrun e | 95.65 m (36° straight, circular transition, 6.60 m table at 11°) | sourced, FIS certificate |
| Lip to K | 59.1 m, K near u = 106 m | sourced |
| Landing angles | 35.7° near P, then 33.2° at K and 30.8° at L, run out to flat | sourced angles; the grade at the knoll is the free value that makes the K drop |
| Track width | 2.77 m | sourced |
| Tower, rail to grate | 64 m | sourced, faktaark |
| Crown (terrace rail) | 133.5 m above the outrun | derived from the certificate drop plus the 64 m |
| Wind screen | 2 m at the lip, 12 m highest, 8 m at the gate | 2 m and 12 m sourced; 8 m at the gate estimated |
| Front truss | feet on the flares, crown just above the snow, 10 m sag, 3.4 m deep | estimated. Foot height is not the hillside grade; tying it to the grade drew a semicircle |
| Start house | about 7 m of glass on a deck at the gate, elevator from the grate | estimated plan. The real house is small; the shaft is slim on purpose so it is not the old tower |
| Snow width | about 10 m at the top, about 24 m near K, narrowing in the outrun | mapped pitch. The certificate's 25.2 m is the K width; the mapped pitch is narrower above K, and the published 28 m gate width does not fit the steel slices |
| Stands | mapped flank treads plus continuous horseshoe outrun seating | mapped flank extents sourced; connecting bowl, row count and 11 m rise estimated |
| Inrun supports | one square start core, about 6.1 × 5.7 m, from the upper ridge to the gate deck; one raked strut at inrun s = 52 m | estimated support plan and station, per final lead targets; elevated rail-to-grate remains 64 m |
| OSLO | 3.5 m steel letters, word 13.4 m wide, dark faces (#30363b by day) on the upper snow | estimated size; the word is on the hill in the 2010 photographs |
| Judges | glass box on the jumper's left stand | side sourced (faktaark); size estimated |

## Materials and LOD

Light / dark palettes include white cladding (`mesh`), dark steel, snow (`track`), neutral earth and slightly darker shoulders, grey concrete, glass, seats, red/blue lines and near-only lamps. The cladding is opaque in both LODs, with light lattice relief in near detail. Far keeps the tower, root strut, side profile, snow, front truss, OSLO, coloured lines and horseshoe seating; it reduces treads and drops fine rail/seat/lattice details. Both LODs keep the same envelope. Far batches the small glass panels into dark steel to retain eight draws with the new shoulder material.

## Approximations

The embankment is a faceted geometric stand-in, not an exact mountain or terrain survey. Its closed shoulders and graded rear ridge replace the earlier pale cliffs; the final review bounds this stand-in close to the jump instead of extending a broad olive mound. The horseshoe connects mapped lower stand groups rather than retaining their schematic gaps; its spacing, thickness and outer earth backing are estimated from dossier photos. The 64 m sourced rail-to-grate dimension includes the start house; the vertical core below its gate deck is about 55 m. The white side-sheet reading follows the final lead targets and reference side silhouette; it simplifies the real stainless mesh. Trees, spectators and nearby buildings are omitted. Both app placement modes require independent integration checks, especially the residual upper mound above real terrain.

## Verification

Final bounded REVIEW-3 round: two geometry look/fix iterations against the dossier reference sheet (side photo 4, aerial 2 and bowl photos 1/3/6). Latest REVIEW.md contains no Prepare command; the equivalent exported preparation was `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids holmenkollbakken --out tmp/top-cities/holmenkollbakken/final-review/metrics.json` plus `node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids holmenkollbakken --out tmp/top-cities/holmenkollbakken/final-review`. The resulting `holmenkollbakken.jpg` and `holmenkollbakken-glb-far-dark-sheet.jpg` were inspected (opposite sides, street, plan, close side, near/far, dark facade/detail/side).

- Large olive mound → requested neutral day/night colours; 15 m rear taper and capped shoulders.
- Detached right outer wedge / left interval break → merged same-flank mapped intervals and a bounded u=128–188 jumper-right connection, retained in far.
- Olive screen-foot walls → concrete feet with upper terraces reaching the feet at u=62.
- Low-contrast 10.24 m OSLO word → 13.4 m word with dark steel faces, readable from the bowl in the app and close dark sheet.
- Near/far envelope mismatch found on the first revised export → both LODs use the same piecewise-linear toe stations.

App captures used the actual server on **3276/3277**, Protomaps tiles and Terrarium 256px/max-z15, with an isolated current-source bundle intercepted only by Playwright (`final-review/peregrine-preview.js`). No shared bundle was written. `app-shot-current.mjs` is a scratch copy of the normal app-shot adding the bundle route and terrain telemetry. Viewed `cityscape/holmenkollbakken-{far,near}.png`, `world-median/holmenkollbakken-{far,near}.png` and `world-lowest/holmenkollbakken-{far,near}.png`, all beneath `tmp/top-cities/holmenkollbakken/final-review/`. The server was stopped after capture.

The world captures show a protruding upper mound. After moving the pad to the lowest flat-outrun references, terrain is enabled, exaggeration k=1, resident DEM z13 and the near datum is **320.121 m**. The snow outrun at the references is about **0.18–0.49 m** above drawn ground. The ridge at u=-90 remains about **29.2 m**, upper landing at u=0 about **38.2 m**, and landing at u=80 about **20.4 m** above the DEM surface. These are sampled preliminary measurements, not a surveyed fit; raw DEM and drawn-ground values are in `world-lowest/report.json`. Upper hillside reconciliation/suppression in world mode remains an integration follow-up outside this bounded authoring round. Do not infer Full 3D release verification from these screenshots. Authenticated account requests fail locally and HD lanes/trees return 503; they do not block asset loading.

Focused command: `node --test --test-name-pattern=holmenkollbakken src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/holmenkollbakken/holmenkollbakken.test.js` — **11 pass**. Ray regressions cover concrete on both screen-foot terraces, left break and right lower connection, no excess upper mound, descending shoulders, narrow start core, open elevated spans and horseshoe, plus sourced profile/crown/export conformance. `node scripts/asset-catalog.mjs` passed (198 records, 364 variants). Final metrics have **zero coplanar pairs**, **1.4%** outside-in back-face hits and **no flagged issues**.

## Cost

| Export | Before this round triangles / draws / KB | Final triangles / draws / KB |
| --- | --- | --- |
| Near | 32,242 / 10 / 1,710 | 34,922 / 11 / 1,853 |
| Far | 6,204 / 8 / 335 | 6,190 / 8 / 335 |

Near remains below the lead's 35k triangle cap; far remains in 3–8k and at the eight-draw limit. Both fit byte budgets. Minimum y is -0.02 m near (small edge trim tolerance), 0.01 m far; crown remains 133.5 m. Exports were generated using `pnpm build:top-cities-landmarks holmenkollbakken --no-check`. No git write, full-suite test, shared-file edit or deployment was performed.
