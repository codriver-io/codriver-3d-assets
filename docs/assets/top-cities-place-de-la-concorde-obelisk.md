# Place de la Concorde obelisk and fountains

Original procedural Paris ensemble, asset `place-de-la-concorde-obelisk`: Luxor's western obelisk erected here in 1836, its modern gilded pyramidion, and Hittorff's two fountains completed in 1840. South is Fontaine des Mers; north is Fontaine des Fleuves. Four representative rostral lamp columns accompany the fountains. The roundabout, roads, surrounding palaces, eight city statues, fences and paving remain outside this asset.

## Sources and frame

- [Luxor Obelisks](https://en.wikipedia.org/wiki/Luxor_Obelisks): 23 m stone, approximate assembled height 33.37 m, Ramesses II era and 1998 gilded cap.
- [Hôtel de la Marine / Centre des monuments nationaux](https://www.hotel-de-la-marine.paris/decouvrir/la-place-de-la-concorde/l-histoire-de-la-place-de-la-concorde): Hittorff ensemble, paired fountains, ship-prow rostral columns.
- [Fountain design](https://en.wikipedia.org/wiki/Fontaines_de_la_Concorde): six seated lower figures, three upper spirits, outer tritons/nereids and two bowl tiers. Large sculptures are bronze-painted cast iron, smaller figures bronze; model uses subdued bronze and green/gold finishes.
- Reference photos inspected, retained only in ignored `tmp/`: Craig Booth, **Paris, Obelisk in the Place de la Concorde, July 22, 2008**, CC BY 2.0; Jebulon, **Fontaine des mers concorde detail**, CC0; Benh LIEU SONG, **Fountain of the Seas, Paris 16 August 2014**, CC BY-SA 2.0. File links and credits are in the catalog fragment. Dossier photos of Egypt and engravings were rejected as geometry references.
- Dossier OSM plus one cached shared-helper fountain query, 2026-10-13. A supplementary street-lamp/column query timed out; the four column locations are explicitly estimates.

Origin `[2.3211306,48.8654765]` is the centroid of OSM way 72937686. Real metres, east/up/south, local plaza grade y=0. The two mapped control corners `[2.3211178,48.8655004]` and `[2.3211671,48.8654846]` give the southeast base edge bearing 116°, and the perpendicular fountain axis is 26° east of north. Rotation is baked once. No terrain or Mercator scaling is baked in.

## Dimensions

| Element | Model | Basis |
| --- | --- | --- |
| Obelisk stone | 23 m | published |
| Assembled apex | 33.37 m | published approximate value, also OSM height |
| Pedestal and steps | 10.37 m | inferred from the two published heights; tier splits estimated from photo |
| Shaft | 2.55 m square tapering to 1.62 m | photographic estimate |
| Gilded pyramidion | 2.8 m tall | photo estimate, modern cap |
| Fountain north | center +27.61 east / −57.39 south; radius 7.65 m | OSM way 72937684 |
| Fountain south | center −27.77 east / +57.53 south; radius 7.50 m | OSM way 72937685 |
| Vasque / cap | diameter 8.36 / 4.16 m, highest point 9.45 m | photo estimates |
| Rostral columns | four, 10.44 m to finial; 12 m beside fountains across axis | representative estimated placement and height |

## Geometry and ownership

The narrow battered shaft has integrated recessed abstract incisions in three columns on each face at near LOD. These are neither an authentic transcription nor pierced holes: recess backs and reveals are modeled. Far drops the incisions and keeps the full shaft, pedestal and gilded pyramidion. The pedestal's literal transport diagrams and text are omitted.

Both fountain LODs retain six seated central figures, six outer figure groups, three upper spirits, a broad gold-edged vasque, smaller mushroom cap, rim piers and finials. Heads, torsos, bent knees, arms, robes, fish and dolphins are original simplified geometry; this is a driving-distance representation rather than a faithful sculpture replica. Near adds bowl ribs and headdresses. Water is an opaque subdued annulus; jets and mist are omitted. Near/far materials merge to seven/six draws. The night palette retains a warm obelisk and muted bronze/water; no fictional luminous water jets.

All eleven obelisk building/part ways in the dossier are listed in `OSM_WAYS`; the large stepped-base replacement ring contains their small parts. The fountain rings are exact mapped amenity outlines, not building extrusions. Four separate estimated column-foundation rings avoid a plaza-wide mask. Every object has a rigid local y=0 foundation. Explicit `terrainPad` replaces the old obelisk-only `padM=8` disc with seven bounded rings sharing the obelisk perimeter median datum. Each basin has a full-circle pad (north radius 9.15 m, south 9.0 m); four estimated column groups each have a 2.2 m radius pad. All feathers extend 2 m outward. These are separate from unchanged provider replacement footprints, with no connecting plaza hull. Solid stone foundation skirts reach y=-1.5 m beneath the two basins and four column plinths in both LODs, hidden below Cityscape grade; above-grade basin and figure geometry is unchanged. No column nodes were claimed as mapped.

## Verification and costs

Exported costs, measured from the default scene:

| LOD | Triangles | Draws | Bytes / KB (1024) |
| --- | --- | --- | --- |
| Near | 34,412 | 7 | 1,155,444 / 1,128 |
| Far | 10,272 | 6 | 371,212 / 363 |

All bounds match between LODs: about 79.30 × 34.87 × 130.67 m including 1.5 m below-grade skirts; the above-grade apex remains 33.37 m. Both variants fit the 60k/14/2.5 MB and 12k/8/500 KB building budgets. No `bridgeLift`, UVs, textures, compression or decoder extensions ship.

Evidence personally inspected on 2026-10-13, under `tmp/top-cities/shots/place-de-la-concorde-obelisk/`:

- `reference-glb-comparison.jpg`: three credited photos beside exported near/far and light/dark overview, back, roof, street and fountain renders. The longitudinal layout sits on the mapped red fountain rings; both tiers and statue groups survive far LOD; green/gold finishes read in both palettes.
- `place-de-la-concorde-obelisk-glb-near-light-sheet.jpg`: includes the shaft incisions close up, obelisk base, opposite side and plan.
- `place-de-la-concorde-obelisk-procedural-near-light-sheet.jpg`: source overview, fountain and shaft match the exported assets.
- Individual `place-de-la-concorde-obelisk-glb-{near,far}-{light,dark}-sheet.jpg` contact sheets retain the original larger renders for independent review.

The initial look led to smaller incisions, lower-cost figure meshes and rostral details. Geometry review then lowered the upper figures onto the bowl with explicit supporting feet, replaced covered basin floors with annular geometry/water, and merged far column trims into patina to eliminate material cycles. Final views show no obvious holes, flips or floating assemblies. Sculptures remain deliberately simplified; no claim of close-range sculptural fidelity or literal pedestal/hieroglyph transcription.

Focused command `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/place-de-la-concorde-obelisk/place-de-la-concorde-obelisk.test.js`: **620 passed, 0 failed**. Four landmark-specific tests pin assembled height and taper, paired basin/tier geometry and central figures, isolated shaft/prow root contact with a failing shortened-root control, and footprint containment/LOD bounds. Catalog validation passes (336 records / 642 GLBs at check time); `pnpm assets:preview` builds the local inspector. QA metrics report near/far **OK**, zero coplanar overlap, zero back-face hits in near sweep, and no geometry below grade beyond floating-point epsilon in that initial export; the review correction adds intentional foundation skirts to -1.5 m. Depth layers were regenerated for this ID: **0 dropped cycle edges**, and `--check` passes. QA metrics report: `tmp/top-cities/place-de-la-concorde-obelisk/metrics.json`; test log: `tmp/top-cities/place-de-la-concorde-obelisk/tests.log`.

Cityscape: **not tested yet**. Full 3D world: **not tested yet**. Integration is checked separately by the lead, including isolated foundations, terrain pads, nearby road ownership, failed loads and mode changes. Inspector contact sheets establish asset appearance only. Real device performance is not measured.

## Independent review correction and bounded terrain coverage (2026-10-13)

Review `tmp/next-200/review/b11b/REVIEW.md` judged Cityscape recognizable but found Full 3D world terrain hiding the south basin rim and lower figures. The fix adds the seven bounded pads described above, using 16 obelisk perimeter references for the shared median instead of depressed fountain DEM samples. No generic building overlap was established: all eleven exact obelisk part ways and existing fountain/column replacement rings remain unchanged. Fountain ways 72937684/72937685 are mapped amenity basins, not additional provider building parts.

Numerical evidence: `tmp/top-cities/place-de-la-concorde-obelisk/pad-coverage.json`; reproduce with `node tmp/top-cities/place-de-la-concorde-obelisk/pad-coverage.mjs`. Every basin circumference including 0.11 m projecting rim allowance and every 0.85 m column foundation has 128/128 sampled points inside its pad. OSM road geometry was fetched once through the shared helper into `roundabout-roads.json`. Minimum feather-boundary distances to the nearest mapped road **centerline**, in metres:

| Pad | Distance | Way |
| --- | ---: | --- |
| North fountain | 19.06 | 1207439706 (4 lanes) |
| South fountain | 16.73 | 14882355 (lane count unspecified) |
| North-west column | 14.24 | 1207439706 |
| North-east column | 37.68 | 1207439706 |
| South-west column | 13.90 | 14882355 |
| South-east column | 32.76 | 14882355 |

These are centerline clearances, not surveyed carriageway-edge distances. No pavement or road ownership geometry was authored. A 7 m half-width estimate for the four-lane northern road leaves at least 7.24 m clearance for that column feather; the southern carriageway width is not supplied by OSM and needs the lead's app check.

The terrain near lattice has a 25.141 m step here, far 100.565 m. Exact disk/terrain-triangle intersection finds five required support nodes per basin: north 0/5 are fully padded, one reaches the feather; south 1/5 is fully padded. Columns require 3, 3, 4, 3 near support nodes respectively, with 0, 0, 1, 1 fully padded (across the pad union). No far support node lies inside these bounded pads. Full support-node halos would reach the road: some nodes are only 5.35–7.36 m from mapped centerlines.

**Remaining world gate:** small rings guarantee footprint coverage, not flat interpolation of all supporting terrain vertices. Skirts close modest downward terrain gaps; they do not mathematically prevent positive terrain overdraw of the rim/figures. No current DEM residual was measured. The lead must recapture Full 3D world from four bearings and street level and judge whether the south clipping is resolved; retain FIX if it remains. Cityscape after this correction: **not tested**; Full 3D world after this correction: **not tested**, prior review failed contact.

Fresh exported evidence personally inspected: `tmp/top-cities/shots/place-de-la-concorde-obelisk/review-fix/export-review.jpg`. Near day includes overview, back, roof, street, fountain and obelisk; far day and both night LODs include overview and fountain. Both basin rings, lower and upper figures and column prows remain attached and readable, with skirts hidden by the inspector's ground. One export look iteration was used. New tests pin all seven same-datum zones, full basin/column pad coverage, exclusion of connecting plaza hulls, bounded skirts and contact with named basin walls/column plinths. Combined landmark/conformance run passed 638 tests with zero failures; catalog validation passed 336 entries / 658 variants and local preview built. Selected depth regeneration/check has zero cycles. Near/far costs change 34,028 / 10,016 triangles, 7 / 6 draws, 1,138,756 / 359,904 bytes → 34,412 / 10,272 triangles, 7 / 6 draws, 1,155,444 / 371,212 bytes.
