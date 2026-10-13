# Jackson Street Bridge — Atlanta, Georgia

Original procedural, texture-free concrete road bridge on Jackson Street NE over John Lewis Freedom Parkway NE, in Atlanta's Old Fourth Ward. This is the short skyline overlook, **not** the Jackson Street swing bridge over the Passaic River in Newark. The dossier's `facts.txt` and reference photographs 1–3 identify Newark and were rejected; Atlanta OSM data and photographs 4–6 were retained as geographic/context references.

The model represents the existing short concrete structure and mapped two-lane street, with sidewalks and open two-rail parapets. It does not assert that the proposed 2025/26 pedestrian parklet has been completed. The City Studio page still labels that project under construction and gives an early-2026 target; its rendering is useful for the underlying span and slopes, but is not an as-built survey.

## Sources and rights

- [OSM roadway 43520078](https://www.openstreetmap.org/way/43520078): two lanes, tertiary street, bridge/layer 1, cycle lanes, and endpoints. [Structural outline 1451196894](https://www.openstreetmap.org/way/1451196894): actual bridge envelope. Approaches: ways 43520052, 79387248 and 79387246; independent sidewalk ways 637636159 and 1389424703.
- [Atlanta City Studio project page](https://www.atlcitystudio.org/jackson-street-bridge): identity, skyline overlook use and proposed expanded pedestrian/cycle connection. Atlanta Department of City Planning rendering `20251009_Rendering_JacksonSt.jpeg` inspected for the span, girder fascia and sloping abutments. Copyright, visual comparison only.
- [Atlanta DOT project 1126, March 2025 project manual](https://ctycms.com/ga-atlanta/docs/22-jackson-street-bridge-project-bid-manual.pdf): concrete bridge deck with asphalt road approaches, restriping and multimodal work; no structural span/height numbers were adopted from unrelated bridge documents.
- [Urbanize Atlanta November 2025 site photograph](https://atlanta.urbanize.city/post/jackson-street-bridge-old-fourth-ward-redo-iconic-downtown): looked directly at the actual broad concrete sidewalk, low concrete wall, two horizontal silver rails, angled posts and simple streetscape. Copyright, visual comparison only, no image-derived mesh or texture.
- [Atlanta skyline from Jackson Street Bridge 2020](https://commons.wikimedia.org/wiki/File:Atlanta_skyline_from_Jackson_Street_Bridge_2020.jpg), Marc Merlin, CC BY-SA 4.0; panorama June 2015 by the same author and licence; Jackson Street Bridge and Atlanta Night Skyline, Joey Kyber, CC0. Dossier references establish the west-facing lookout context, not structural dimensions.

All images remain ignored local references. The generator and exports are original editable Three.js geometry, without scans, captures, decals or textures.

## Frame and dimensions

Local real metres: +X east, +Y up, +Z south. Anchor `[-84.37431035, 33.7601681]` is the midpoint of the mapped structural roadway. Station increases north to south, roughly bearing 179°. Rotation is baked into geometry; Mercator scale is applied once by the shared runtime. `jackson-street-bridge-atlanta-alignment.js` retains attributed mapped controls. The south approach terminates at a cut along the mapped ordinary street, not a fabricated bridge extension.

| Quantity | Model | Evidence |
|---|---:|---|
| Structural span | 67.137 m | Measured from OSM roadway endpoints |
| Structural outline width | 19.061 m, lateral −9.259 to +9.802 m | Measured OSM outline |
| Authored full envelope | 19.4 m | Symmetric simplification; west edge up to 0.45 m outside asymmetric mapped outline |
| Authored carriageway | 14.6 m on bridge; 10.8 m at approach toes | Estimate from broad street/sidewalk reference; includes cycle/edge space, not four traffic lanes |
| Approach length | north 94.057 m; south 74.209 m | Mapped street segments |
| Sidewalk top | +0.18 m above pavement | Photograph estimate |
| Parapet | 0.38 m wide; concrete top +0.73 m | Photograph estimate |
| Metal rails | +0.97 and +1.25 m above pavement | Photograph estimate; angled posts 3.05 m near / 6.10 m far |
| Slab and girders | 0.65 m slab under −0.28 m; six 0.52 m deep girders below it | Structural visual estimate; no fabrication drawings available |
| Cityscape deck height | 6 m across span | Estimated flat-map clearance convention, minimum girder underside 4.55 m |
| Cityscape ramp grades | 7.687% north / 10.308% south at zero approach datum | Constant grade with 12 m vertical curves and 4 m level toes; ≤12% |
| Supports | two full-width abutments and median cap on three columns | Visual estimate; wing walls continue into the approach fill |
| Highest point | 14.686 m in export, declared 14.7 m | Deck + estimated 8.62 m davit light arms |

No surveyed altitude, NBI dimensions or Newark dimensions are claimed. Small girder/member sections, exact support configuration and the two light stations are estimates. The OSM outline is structural provenance, not a building footprint: adjacent buildings remain provider-owned. Ordinary street approach geometry necessarily extends beyond that outline and follows the mapped street corridor; footprint containment applies to the central bridge envelope, within the stated 0.45 m approximation.

## Geometry and road contract

`geometry.js` builds closed variable-width pavement/sidewalk ribbons, concrete fascia and girders, abutments with connected wing walls, a median cap/columns, low concrete parapets, two open guardrails with supported end posts, and two restrained davit lights. The skyline-facing side stays open above the low parapet. Compatible pieces merge into seven near/five far materials; far keeps the same envelope, girders, support openings, two rails and lights, with fewer posts and no geometry lane paint. Near fallback paint is 12 cm proud; far paint is omitted.

Only the landings taper: the central span remains rigid. Sidewalks continue to ordinary street paths rather than stopping with the parapets. The approach fill reaches grade, avoiding unsupported ramp ribbons. Terminal guardrails embed in posts, posts embed in concrete, every girder bears on both abutments and the median cap, and light heads meet their arms. Material-contact tests exclude the member and include shortened/detached negative examples in both LODs.

The runtime is the shared registry bridge factory, with one landmark-owned subclass. No shared bridge modules were changed. `PROFILE` owns station, pavement, lateral fitting, car/route/camera elevations and perpendicular-road rejection. It uses existing `absolute-deck`, `clipStandardEnds` and `lateralBankFit` features. Connected provider widths affect only the approach zones; the rigid central span is never squeezed by partial samples. The shared factory retains and drapes HD pavement/paint, switches source materials to the unlit vertex-shaded map convention, and removes the generic provider deck while loaded.

Flat Cityscape uses the explicit clearance ramps. In Full 3D world the owned `_surface()` attaches sampled abutment datums to the existing numeric approach array; `deckHeight()` independently interpolates north approach, bank-to-bank span and south approach. It does not add six metres above the real banks. Ordinary support feet sample their own ground; there is no corridor-flattening pad. The existing lateral terrain clamp keeps pavement at least 0.12 m above the local DEM where its bank interpolation would intersect terrain. Unknown DEM remains governed by the shared factory's activation gate.

## Cost and checks

| LOD | Triangles | Draws | Uncompressed bytes | KiB |
|---|---:|---:|---:|---:|
| Near | 6,346 | 7 | 188,932 | 184.5 |
| Far | 3,164 | 5 | 96,460 | 94.2 |

Far/near bounds match on all axes. Budget limits are 120k/40/4.5 MB near and 30k/10/1.2 MB far. Runtime draped-HD overlay draws are additional. Browser cost is not Tesla hardware performance.

- `pnpm build:top-cities-landmarks jackson-street-bridge-atlanta --no-check`: exported both GLBs and manifest.
- `node scripts/landmark-depth-layers.mjs --ids jackson-street-bridge-atlanta` plus `--check`: current; zero dropped cycle edges.
- Focused landmark tests: 14 pass, under one second locally; raycast pavement/sidewalk, named girder/rail/light contacts, negative contacts, slope/taper, navigation ownership, independent world bank profile and repeated immutable fitting.
- Combined top-cities and landmark conformance: 607/607 passed with exported model marked ready before the visual rejection; readiness was then withheld, and the conformance check was repeated.
- `node scripts/asset-catalog.mjs`: 336 records / 596 GLB variants valid. `pnpm assets:preview`: local ignored catalog/viewers generated.

## Visual evidence

All evidence is local, ignored and under `tmp/top-cities/shots/jackson-street-bridge-atlanta/` in this worktree.

Looked at `reference-comparison.jpg`: Atlanta deck photograph and City Studio overview beside near/far GLB light/dark sheets. Near-light views: overview, both sides, above, crossing, rail detail, underside and both landings. Near-dark: overview, side, above, rail detail. Far-light: overview, reverse side, above, rail detail. Far-dark: overview, side, above, crossing, rail detail. The individual files use `jackson-street-bridge-atlanta-glb-{near,far}-{light,dark}-{view}.png`; the four `*-sheet.jpg` files are the export round-trip evidence. Procedural and exported bounding-box agreement is also checked by registry conformance.

Changes prompted by looking: replaced the erroneous Newark identity with Atlanta's short concrete/open-railed profile; added ground-connected fill below the flat ramps; moved fill tops below the road to remove a material depth cycle; close app terrain views exposed coplanar/clipped approach triangles, so the existing 12 cm lateral terrain clearance was enabled and recaptured. No depth-cycle edges are accepted as resolved by dropping them.

App overview captures from the supplied `app-shot.mjs` are in `app-cityscape/` (far, near, street) and `app-world/` (near, street). Those supplied `nopair` captures had HD switched off. Final landing captures use the normal guest demo session, the actual renderer and its HD setting, in `landings-cityscape/` and `landings-world/`: `north-0.png`, `north-180.png`, `south-0.png`, `south-180.png`, and both toe views in both directions. Numeric reports are `heightAt.json` in each directory.

The whole parent-tile query timed out; this browser-local reference response avoids extra unmanaged Overpass calls. It verifies real geographic HD synthesis and bridge draping, not the lane-cache service's availability. Live Protomaps tiles and live Terrarium DEM were used. No fixture or screenshot is shipped.

## Placement verification and remaining limits

Final landing readings and assessment are appended after the final captures below. Cityscape and Full 3D world are judged independently. Inspector readiness alone does not establish terrain integration. No full driven route, traffic/car animation, missing/late model failure, repeated live mode toggling, origin-shift run, or MCU2/MCU3 performance measurement is claimed; the shared lifecycle is reused and synthetic repeated-fit tests pass. The proposed parklet, benches, temporary construction work, utility wires and highway guide signs are omitted. Exact girders/support/light locations remain visual estimates.

## Landing seam: cause and fix

The south-toe gap first reported here was not a datum mismatch in this model. A downward probe through every visible mesh at the toes (`tmp/top-cities/jackson-street-bridge-atlanta/seam-probe.mjs`) found the provider HD road **missing for 4–8 m beyond each toe** in Full 3D world: those vertices sat at datum 0, about 376 scene units below ground, while the deck and the HD sample agreed to within 0.1 m. The cause is shared app code. `hd-roads.js` took each vertex's baked ground off, let the landmark clip the provider road at its toe (which appends interpolated vertices), and restored the ground by the ORIGINAL vertex count, so the appended clip vertices never got their ground back. Toes that fall mid-segment, as here, leave a visible hole up to the next provider vertex; most bridges end on or near one, so the sliver was invisible. Fixed by `withGroundOff` in `hd-roads.js`: the ground rides along as a temporary attribute that the clip interpolates (unit test `withGroundOff: a vertex the replacement appends gets its interpolated ground back`). After the fix the provider road continues from the deck at 1.38, 1.28, 1.02 and 0.72 m above ground (south) and 0.26, 0.18, 0.02 m (north) over the first 1–8 m, with no gap; the recaptured landings show continuous pavement and paint in both modes and directions.

Final normal guest-demo observations: `roadsOn=true`, 11 measured HD sections, near model active; all seven material batches use `MeshBasicMaterial`, with vertex shading on structure and unlit pavement. Screenshots looked at: both `landings-*/sheet-final.jpg` sheets (eight views per mode), plus full-size world south-toe-0 and Cityscape north-toe-180. These supersede the initial HD-off and terrain-clipped shots. Both directions below return identical heights; all perpendicular (90°) headings return null, as do points two metres outside either endpoint.

| Position / station | Cityscape heightAt (m) | Full 3D world heightAt above query DEM (m) |
|---|---:|---:|
| North toe / 0 | 0.40943309 | 0.40971156 |
| North abutment / 94.05694 | 6.00000000 | 0.12000000 |
| Mid-span / 127.62558 | 6.00000000 | 3.10256279 |
| South abutment / 161.19422 | 6.00000000 | 0.12000000 |
| South toe / 235.40285 | 1.34181826 | 1.34150593 |
| Outside either toe | null | null |

World sampled abutment bank heights: 309.62876595 and 311.78814360 m in the runtime terrain datum (not surveyed elevations). The world midpoint's 3.10 m above smoothed DEM is not a surveyed highway clearance; fine-cut relief remains approximate. Across 226 zero-lift attachment vertices, measured footing residuals against their own DEM are −0.350015 to +0.000014 m (the −0.35 m points are intentionally buried ramp fill). No corridor pad is used, so no pad lattice is flattened.

| Mode / check | Final status |
|---|---|
| Procedural/export geometry, near/far, light/dark | Verified locally |
| Cityscape normal app, HD and both directions | Verified (2026-10-13 recapture, lead) |
| Full 3D world normal app, HD and both directions | Verified after the hd-roads ground fix (2026-10-13 recapture, lead) |
| Full driven route/car/traffic and lifecycle/hardware | Not tested |
| Runtime readiness | Enabled after the seam fix, pending independent review |

Local app bundle used for the final checks: build `27b465c6aff4`; Test servers were stopped by their recorded PIDs after capture. The generated depth table was regenerated for this id and left outside the landmark commit; the lead must regenerate it when integrating. Generated app bundles are excluded from the commit.

## Coordinator handoff

The builder retained draft readiness after two visual rounds and recorded the seam at the south toe (−84.374316, 33.7592, station 235.40 m). The lead traced it to the shared HD clip/ground restore described above, fixed it in app code, re-enabled readiness and recaptured both landings in both modes; the evidence under `docs/3d-top-cities-jackson-street-bridge-atlanta-evidence/{cityscape,world}/` is replaced by the post-fix captures.
