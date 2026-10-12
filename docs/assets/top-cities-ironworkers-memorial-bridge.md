# Ironworkers Memorial Second Narrows Crossing

Original procedural road-fitted model of the current 1960 Highway 1 crossing between Vancouver and North Vancouver, with widened paths and safety fencing. It is a **deck-truss cantilever**: traffic runs above the trusses, as shown by the Ministry elevation drawing and close side photograph. The neighbouring rail lift bridge is outside ownership and is not modelled.

## Sources and dimensions

- [BC Ministry / MMM 2018 engineering report](https://www2.gov.bc.ca/assets/gov/driving-and-transportation/reports-and-reference/reports-and-studies/lower-mainland/2018-03-16-ironworkers-risk-assessment.pdf), sections 1.2 and 3.1, figures 2.3 / 3.1: 1292 m total, 335 m main, 142 m anchors, 116 m cantilevers, 103 m suspended centre, 42.70 m maximum air draft at HHWLT. Its drawing gives 335.280 / 142.151 / 141.770 / 116.281 / 102.718 m; model uses rounded values.
- [SEABC/IABSE 2017, p.45](https://www.seabc.ca/wordpress/files/notable_structures/Vancouver_Notable_Structures_IABSE_SEABC_2017.pdf): four approximately 86 m north truss spans, nine approximately 36.5 m concrete spans, six road lanes and two paths. It rounds the suspended section to 110 m; the detailed Ministry drawing takes precedence.
- [Wikipedia](https://en.wikipedia.org/wiki/Ironworkers_Memorial_Second_Narrows_Crossing): identity, 1960 opening and published length/span.
- OSM extract 2026-10-12: roadway ways 23795563, 1059700345, 48608388, 1275279652; south approaches 23795653 / 507979055; outline 378869560. Derived data © OpenStreetMap contributors, ODbL 1.0.
- Reference photographs listed with titles, authors and licences in the catalog record. Webgeer / photo-tips.ca side photograph supplies the arch-like lower chord and subdued warm steel; formulanone driving photograph supplies six-lane deck, barriers, safety fences and curved lamp arms; EdwardFIrvine dossier photograph supplies the north approach rhythm. All retained under ignored tmp only.

| Dimension | Model | Basis |
| --- | ---: | --- |
| Main / anchor spans | 335 / 142 m | Published engineering values |
| Suspended centre / cantilever | 103 / 116 m | Detailed engineering drawing |
| North approach truss spans | 4 × 85.9 m | Rounded published ~86 m; mapped transition |
| North concrete spans | 9 over 306.7 m | Published ~36.5 m; shortened grade nose is road surface only |
| Mapped bridge extent | 1327.1 m | OSM outline includes ~33 m south landing |
| Road profile extent | 1468.0 m | Mapped approaches to first south junction |
| Deck overall / carriageways | 27.8 / 2 × 10.5 m | OSM outline and road/path separation; aerial cross-check in report figure 2.3, approximate |
| Deck crest / main-pier deck | 56.5 / 52 m | Estimated from drawing proportions, no surveyed datum |
| Main shoes / crest truss depth | 7 / 7.3 m | Estimated from elevation and side photo |
| Lamps / total top | 7.5 / 64 m | Photo estimate |

## Geometry and profiles

One station frame runs north to south along the average of the mapped carriageways; lateral positive west. Origin [-123.026291, 49.29467] is the main-span centre. Real metres east/up/south; geographic stretch is applied once by the runtime. The steelwork contains two open truss planes, triangular web rhythm, curved lower chords descending to low main-pier shoes, the drop-in section, cross-floor beams and near-only lower lateral bracing. Concrete twin-column piers/caps support the north trusses and nine concrete girder spans. Continuous deck, raised paths, centre/edge barriers and fencing remain in both LODs. Every enumerated structural beam, railing, lamp, walkway and approach-girder terminal is tested against its named support’s actual merged geometry, excluding the member; a shortened diagonal proves failure detection.

Authored deck approximates the engineering side elevation; no DEM is baked in. Full 3D world uses absolute-deck policy, no terrain flattening, endpoint terrain datums, and per-vertex support attachment weights. Its endpoint base takes the lowest of 13 cross-deck DEM samples; the existing per-vertex terrain clamp adds 0.15 m where the approach meets the bank. This prevents a centreline datum leaving the high lane underground or the low lane floating. The final 234 m of southern approach uses 2 m near / 3 m far surface stations; pavement splits into lane-width ribbons there to follow the actual terrain TIN across the deck. Endpoint samples are cached per terrain object and approach heights. Rigid authored width prevents incomplete HD lane tiles squeezing the truss spans; only the first/last 150 m landing zones follow connected road widths. Cityscape uses its own flat profile: north approach rises to 40 m at the anchor and 52 m at the main pier, crests 56.5 m, then descends to 38 m at the south main pier and grade at the first south junction. Straight grades with 16 m vertical curves; steepest 12.35%, north 8.45%. This is a flat-map compromise required by the short southern approach and its first branches, not the real highway grade.

## Verification

Source contact sheet: `tmp/top-cities/shots/ironworkers-memorial-bridge/source/ironworkers-memorial-bridge-procedural-near-light-sheet.jpg` (overview, both sides, overhead, deck, underside) viewed against the side photo and Ministry elevation. Confirmed curved lower chord, deep pier fans, suspended centre, long northern approach and open road deck. Reduced fence rail subdivisions after this look to leave export-budget headroom; fine fence bars are double-faced geometry planes, no texture.

Final exported bounds match source, with identical near/far top at 63.979 m. Four export combinations (near/far × light/dark) were judged in `tmp/top-cities/shots/ironworkers-memorial-bridge/export-reference-sheet.jpg` alongside the Webgeer and dossier photos; final near-light and far-dark sheets were rerendered after the approach mesh refinement. The mesh uses named shared unlit/vertex-shaded runtime materials in the actual app. The separated `barrier` material resolves the median/deck depth-order cycle; the asphalt is split around the solid median, with no coincident median bottom face on pavement. Generated depth report: no dropped edges.

| Export | Triangles | Mesh draws | KiB |
| --- | ---: | ---: | ---: |
| Near | 79,678 | 21 | 3,083 |
| Far | 26,334 | 5 | 990 |

The extra southern surface vertices are required by the terrain bank and remain within both bridge budgets. This measures the exported default scene, without claiming hardware frame-rate results.

Focused source tests cover observed pier spacing, channel opening, pavement raycasts, all named terminal contacts (both LODs), a shortened-diagonal negative case, all mapped road vertices in both directions, crossing/rail rejection, fixed width, flat ramp grades, sloped-bank navigation and repeated world-to-flat restoration without drift. The landmark tests run in about two seconds. The shared conformance run, assets check / preview and depth-layer check pass. Bundle built locally for captures only; generated app bundles and depth table are excluded from the landmark commit.

### Cityscape: verified with standard Protomaps roads (port 3274)

Bundle build `5c1055bd5248`; no production deployment. Unobstructed app files `tmp/top-cities/shots/ironworkers-memorial-bridge/app-cityscape/ironworkers-memorial-bridge-{far,near,street}.png` and `approaches-cityscape/{north-in,north-out,south-in,south-out}.png` were captured and inspected. Near and far load through the normal bridge layer, the six-lane deck replaces the generic bridge roadway, and both endpoints meet the standard approach roads. The neighbouring rail bridge/provider piers remain outside ownership. Flat ramps are the stated 12.35% compromise. A combined sheet helps compare frames, but the native 1280×800 captures remain available for review.

### Full 3D world: verified with standard roads and Terrarium DEM (port 3276)

Same bundle; `TERRAIN_URL=https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`, 256 px, max z15. Native `app-world/ironworkers-memorial-bridge-{far,near,street}.png` and `approaches-world/{north-in,north-out,south-in,south-out}.png` captured and inspected, including the full-size south-in frame. No corridor pad/flattening is requested. Supports meet their actual shared terrain; the main deck stays above the inlet. The first world captures exposed a partly buried southern approach and negative high-lane height; per-vertex clamping, cross-deck endpoint samples and finer pavement cells fixed those visible defects. Final approach shots show continuous pavement without the previous terrain holes or isolated lamp tops.

`height-report.json` under each approach directory records all 35 mapped bridge roadway vertices, tested at their heading and reverse heading: no null response in either mode. Railway offset and crossing heading are null. Values below are relative to the actual terrain at each lane; add the ground to obtain the world deck datum. Both travel directions return the same value. Lane positions are lateral -5.8 m (east) / +5.8 m (west).

## Approximations

Member sections, panel counts, gusset blocks, pier/caisson dimensions, exact vertical datum, fence bars and lamp positions are estimated. No rivets, utility pipes, maintenance travellers, signage, rail lift bridge, underwater piles or third-party mesh/texture. Far keeps all chord shapes and openings, reduces panel count, uses 40 m fence posts / 120 m lamps, and drops pickets, paint and lower lateral bracing. The crest lamp is retained, preserving the full top silhouette. Hardware performance remains unmeasured.

| Station | Cityscape heightAt east / west (m) | World ground east / west (m) | World heightAt east / west (m) |
| --- | ---: | ---: | ---: |
| north-foot | 0.002 / 0.002 | 13.902 / 13.029 | 0.150 / 0.150 |
| north-ramp | 19.302 / 19.302 | 5.257 / 5.693 | 17.706 / 17.270 |
| north-anchor | 40.049 / 40.049 | 0.000 / 0.000 | 40.070 / 40.070 |
| north-main | 51.885 / 51.885 | 0.000 / 0.000 | 51.885 / 51.885 |
| midspan | 56.225 / 56.225 | 0.000 / 0.000 | 56.393 / 56.393 |
| south-main | 37.974 / 37.974 | 0.146 / 0.108 | 51.725 / 51.763 |
| south-anchor | 20.464 / 20.464 | 41.732 / 41.176 | 0.150 / 0.150 |
| bridge-south-end | 16.411 / 16.350 | 52.452 / 49.886 | 0.150 / 0.150 |
| south-foot | 0.004 / 0.004 | 48.835 / 45.279 | 0.150 / 0.150 |

Footprint/terrain residual probe: 480 zero-weight foundation/column-foot vertices in the fitted near model differed from their shared DEM sample by -0.0000026 to +0.0000019 m (Float32 round-off). This verifies the runtime terrain attachment, not a survey of the real foundations. No terrain pad is needed for the absolute-deck bridge.

Limits: `/osm-lanes` returns 503 without a configured HD lane service, so HD pavement/dash continuity and HD overlay costs remain **not tested**; standard roads and authored six-lane fallback paint were checked. App captures are daylight; the night palette was inspected in the exported GLBs. Real vehicle hardware, authenticated live route playback and the independent reviewer’s final gate remain outside this worker’s evidence. No shared bridge source was changed. The lead must regenerate the shared depth table on integration: `node scripts/landmark-depth-layers.mjs --ids ironworkers-memorial-bridge`.

## Review b4b: landing transition correction (2026-10-12)

The independent review found over-wide square landing slabs in both modes.
Only the first and last 150 m now ease into the OSM carriageway centres;
the truss spans, sourced 27.8 m deck and all their member contacts remain rigid.
Standard-road endpoint widths use the live motorway ribbon width at the current
zoom (6.037 m per carriageway at z18.2); HD endpoint measurements use the same
landing-only blend. Road ownership and heightAt follow the tapered envelope.
Paths and parapets narrow towards the road noses, safety fences lower to their
path supports, and the median ends where the full rigid deck begins, leaving the separated approach roads unobstructed.
Pavement colour blends into the live road palette and follows theme/terrain/LOD
updates. Each landing slab splits into independent carriageway ribbons so it cannot expose concrete across their sloped terrain gap. Slab and asphalt share samples at both taper boundaries. The final slab thickness reduces to 2.16 cm at grade; end caps and
approach girders terminate 25 m inside each road nose, with named support contact.
Invisible lower faces of supported paths/parapets/median are omitted, eliminating
material cycles without adding draws. Approach-only lamp bases begin beyond the
pinched path noses. No shared bridge source changes were needed.

Final local bundle: `53f85105f884`. Export inspection before the approved app-only gap correction (second/final GLB look round):
`tmp/top-cities/shots/ironworkers-memorial-bridge/review-final-exported/ironworkers-memorial-bridge-glb-{near-light,far-dark}-sheet.jpg`.
Near/far silhouette, curved lower chords and open spans remain recognisable.
Final app evidence is under `review-approaches-cityscape/` and
`review-approaches-world/` in the same shots directory: `north-in`, `north-out`,
`south-in`, `south-out`, each with `-near.png` and `-far.png` and a
`height-report.json`. Those captures replace the earlier square-landing evidence
for this fix. Cityscape and world are verified with standard Protomaps roads;
HD lane service continuity remains not tested because the local endpoint is 503.
Every mapped roadway vertex returns a non-null height in both travel directions;
the railway remains unowned. Cityscape endpoint heightAt is 0.002 m north / 0.004 m south; world endpoints are +0.150 m over the actual DEM in both carriageways/headings. The 480 world foundation vertices have residuals -0.0000027 to +0.0000019 m. Exact measurements are in the final JSON reports.

Measured cost, before → after (KiB): near 82,660 / 21 / 3,120.953 →
79,678 / 21 / 3,082.879; far 27,948 / 5 / 1,006.297 →
26,334 / 5 / 990.051 (triangles / draws / KiB). Source/export and catalog checks,
all named terminal tests and the shared landmark conformance test pass; depth
layer regeneration/check reports zero dropped edges. The fine near fence sampling
changes the curved landing extremum by 0.45 m from far; lateral extent and crown
are identical. Independent re-review remains the lead's next gate.

The split Cityscape landing gap exposes the existing supported transverse cap beams below the carriageways; they do not cross the driving pavement. Full 3D world terrain covers those grade-zone caps. This is visible in both final southern Cityscape approach views for independent review.
