# Vincent Thomas Bridge, San Pedro–Terminal Island

Original procedural model of the existing 1963 green welded suspension bridge carrying four lanes of SR 47 over the Los Angeles Main Channel, before the forthcoming deck replacement. Local metres east/up/south; origin at the mean of mapped tower centres `[-118.271390075, 33.7494748]`; orientation baked from the averaged mapped carriageways. No textures or third-party meshes.

## Sources and dimensions

[Port of Los Angeles historical report](https://kentico.portoflosangeles.org/getmedia/33557b3c-6ae6-4b75-a4db-c3e011be4477/AppxF-3_historic-built_techreport) gives main span 1500 ft, side spans 506 ft, tower height 365 ft, 52 ft roadway and 6060 ft total structural length. [Caltrans FAQ](https://dot.ca.gov/caltrans-near-me/district-7/district-7-projects/d7-vincent-thomas-bridge-deck-replacement-faq) identifies the existing roadway and forthcoming replacement. Dossier/Wikipedia gives about 56 m navigation clearance. Reference photos are from the provided dossier; individual Commons titles, authors and licences are in the catalog. The LA skyline photograph (4.jpg) was not a useful structural reference.

| Dimension | Model | Basis |
| --- | ---: | --- |
| Main span | 457.2 m | sourced, 1500 ft |
| Side spans | 154.2288 m each | sourced, 506 ft |
| Tower top | 111.25 m | sourced, 365 ft rounded |
| Roadway | 15.8496 m | sourced curb-to-curb, 52 ft |
| Suspension/viaduct deck envelope | 22.2 m | estimated from aerial/reference proportions, including structural margins |
| Road surface / truss bottom | 60 / 56 m | estimated deck stack above published clearance |
| Main cable low point / saddle | 66 / 110.8 m | photographic estimates |
| Ground cable shoe | 14 m | photo estimate; outside lanes |
| Ramp-inclusive coverage | 2604.993 m | mapped approaches; exceeds published 1847.088 m structural length |
| West / east ramp length | 1013.072 / 826.263 m | station profile |
| Maximum smoothstep ramp grade | 8.89 / 10.90% | calculated from road surface and ramp length |

Shared Overpass helper run from the lead checkout, 2026-10-12: extract `tmp/top-cities/vincent-thomas-bridge/road-osm.json`. Exact provider road IDs are in alignment.js/footprint.js; bridge polygon 1011852501 and tower support outlines 1011852499/1011852500. The dossier extract tags tower support outlines 1011852499/1011852500 as buildings; their exact rings are now supplied to the runtime building masks. Published main span places towers 1.56 m from mapped support stations, preserving the real dimensions. West roadway uses both mapped carriageways; east continuation uses mapped westbound alignment offset 3.9 m to the centre, since the extract lacks the complete eastbound continuation. This is a visual alignment, not a survey.

## Geometry and contacts

Near and far preserve rectangular green steel shafts, two upper diamond lattice bands and a lower band, open vehicle portals, saddles, two true cosh catenaries with ground-anchored backstays, vertical suspenders, open X-panel deck trusses, transverse floor beams, concrete portal piers and the four-lane fallback pavement. Near cables use 24 chords per span; far 10. Hanger tops use the sampled cable chord height, avoiding a gap between analytic curves and exported chords. Anchors terminate on ground blocks rather than at an asset boundary. All structural members share the road profile. Far drops lane paint/flanges and alternate rail posts/hangers/piers; five structural materials plus four landing pavement colours. Near uses three station chunks.

Blue point lights are on tower shafts in both LODs, muted by day and blue by night. No floodlight cones or glow textures. Member sections, cable diameter, lamp spacing, concrete anchorage blocks and viaduct pier spacing are estimates. Rivets, individual wires, construction equipment, temporary detours and exact anchorage machinery are omitted.

Tests collect named unmerged support meshes before batching, then raycast each enumerated cable, hanger, brace, floor beam, rail/post and approach shaft/cap terminal against its named support excluding the member itself. A hanger shortened by 2 m must fail. Additional tests measure pavement/underside heights and open tower portals by raycast, bound mapped tower deviation, ramp grades, ownership in both headings at every alignment vertex, off-road/crossing rejection, attachment weights, geographic envelope and far silhouette/cost.

## Verification

Initial procedural contact sheet read: `tmp/top-cities/shots/vincent-thomas-bridge/initial/vincent-thomas-bridge-procedural-near-light-sheet.jpg`, alongside dossier `refs-sheet.jpg`. It covers overview, both sides, plan, road, tower and underside. Visual correction: moved the approach pier caps upward into the slab so caps and deck meet; removed redundant short approach girders that lacked endpoint supports. Final export and app evidence will be recorded below.

Cityscape: verified locally with standard roads. Full 3D world: verified locally with standard roads and Terrarium DEM. Runtime uses the existing registry bridge layer, absolute-deck terrain policy and identity lateral fit. No shared runtime source changed. HD pavement/paint, physical driving, terrain lifecycle stress and hardware performance are separate checks.

## Final costs and exported evidence

| LOD | Triangles | Mesh draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 79,072 | 23 | 2,832,292 | 2,766 |
| Far | 26,216 | 9 | 945,144 | 923 |

Both are within the hard bridge budgets; far has the same bounds as near. Texture-free GLB round trips retain normals, material names and `_bridgelift`. Initial pre-review deterministic QA (`tmp/top-cities/vincent-thomas-bridge/qa-metrics.json`) reports **ok** in both LODs: no coplanar-overlap, layered-face, outside-in backface, unsupported-end or budget issues. The original coarse end finder flagged four anchor points lying deep inside shoes; shoe sections were refined to expose the contact nearer the visible surface. Named contact tests proved attachment throughout. Backstay ground ends now have zero lift, blending to deck attachment above the road; a separate synthetic 10 m terrain-fit test confirms their ground-shoe contacts survive in both LODs.

Depth regeneration and `--check` pass with zero dropped cycle edges. Curb and approach cap material now share the green steel material to eliminate reciprocal concrete/steel face ordering while retaining concrete shafts and anchor blocks. No shared source extension was needed. `pnpm assets:preview`, asset catalog validation (286 records / 522 variants), and app bundle build pass. Focused registry + landmark tests pass (465/465), including nine landmark tests in under two seconds.

Exported contact sheets actually read, next to the supplied photo sheet:
- `tmp/top-cities/shots/vincent-thomas-bridge/reference-export-comparison.jpg`: reference photographs beside all four exported near/far light/dark configurations.
- `final/vincent-thomas-bridge-glb-near-light-sheet.jpg`: both broadsides, plan, deck, tower and underside.
- `final/vincent-thomas-bridge-glb-near-dark-sheet.jpg`, `final/vincent-thomas-bridge-glb-far-light-sheet.jpg`, `final/vincent-thomas-bridge-glb-far-dark-sheet.jpg`: cable/tower/portal silhouette retained; night lights are deliberately small points rather than glow textures.

All relative image paths above use `tmp/top-cities/shots/vincent-thomas-bridge/`. Final near/far light exports were re-rendered after the anchor and lift changes; they retain the same recognizable silhouette and open structure.

## Initial Cityscape and Full 3D world app evidence (before landing review)

World uses AWS Terrarium z15, exaggeration 1. `app-shot.mjs` captured far/near/street in both modes, all active. Custom endpoint captures use each mapped endpoint and tangent heading plus 180 degrees, in both modes. `app-probe.mjs` records actual `window.__map.landmarks.heightAt` results; it does not substitute analytic profile heights for app measurements. The documented heights are relative to terrain in world mode; add DEM for absolute deck elevation.

Images actually read: `app-overviews.jpg` (both-mode far/near/street), `app-approaches.jpg` (eight endpoint/direction views), individual `cityscape/vincent-thomas-bridge-near.png` and `world/vincent-thomas-bridge-near.png`. Originals are retained in `cityscape/`, `world/`, `cityscape-approaches/` and `world-approaches/`; the CLI ad-hoc entry shot is in `cityscape-cli-approach/`. No visible vertical step or gap at the ramp feet; the standard provider's white pavement transitions to authored grey fallback and maintenance margins. No doubled generic bridge deck across the channel. Local account CORS/401/503 errors did not prevent model/terrain loading. The DEM includes depressions in the channel outside the bridge; no bridge corridor flattening is applied.

Each mode returns non-null heights for all 185 alignment vertices in both headings (370 checks), plus 12 station controls, and null for an off-road point 60 m lateral and a crossing heading. Both ramp feet have zero relative lift. The route/car/camera share this navigation surface; physical route driving was not exercised.

| Station (m) | Cityscape heightAt (m) | World DEM (m) | World heightAt (m) | World absolute deck (m) |
| --- | ---: | ---: | ---: | ---: |
| 0.000 | 0.000 | 25.846 | 0.000 | 25.846 |
| 100.000 | 1.638 | 15.657 | 11.122 | 26.779 |
| 300.000 | 12.668 | 11.566 | 21.492 | 33.058 |
| 600.000 | 38.209 | 4.150 | 43.446 | 47.596 |
| 1013.072 | 60.000 | 3.549 | 56.451 | 60.000 |
| 1778.730 | 60.000 | 4.804 | 55.196 | 60.000 |
| 1167.301 | 60.000 | 1.486 | 58.514 | 60.000 |
| 1624.501 | 60.000 | 3.071 | 56.929 | 60.000 |
| 1395.901 | 60.000 | -0.236 | 60.236 | 60.000 |
| 2100.000 | 39.841 | 6.179 | 34.639 | 40.818 |
| 2400.000 | 9.247 | 6.566 | 5.140 | 11.706 |
| 2604.993 | 0.000 | 2.908 | 0.000 | 2.908 |

Raw numeric evidence: `tmp/top-cities/vincent-thomas-bridge/probe-{cityscape,world}.json`. World samples 1080 exported zero-weight foundation vertices; fitted footing/DEM residual is below 0.000001 m (numerical precision, not a survey accuracy claim). Tower tops remain at the authored datum while the footings meet local terrain. No terrain is baked into the exports.

HD `/osm-lanes` is unavailable locally (503), so provider lane counts/dash phase, continuous HD paint and crossfall fitting are **not tested**. The 15.85 m roadway is sourced; the live steel width remains rigid. Actual driving, repeated terrain/theme/LOD/failure lifecycle stress and Tesla hardware performance remain separate integration gates.

## b5 review: landing correction, 2026-10-12

The reviewer identified square full-width grey slabs and tall green edge rails meeting narrow white standard roads at both ramp feet. The final 180 m of each approach now separates into two two-lane ribbons, easing from the sourced 15.8496 m roadway to 7.45 m per connected standard-road ribbon (styled Protomaps width at z18, not a surveyed roadway dimension). Structural maintenance margins and curbs end on the supported slab inland; low rail terminals descend to 0.15 m and meet the landing pavement through their posts. The ground ribbons have no projecting steel slab underneath; low viaduct bents within the landing are omitted as the road joins fill. Four muted pavement materials change from the app's grey bridge surface to off-white over the final 120 m; near lane lines follow each ribbon through the fork at 0.15 m relief, while far drops paint. Suspension spans, 22.2 m rigid steel width, catenaries and towers retain their previous positions and dimensions.

West connected lines use dossier OSM ways 159324580/159324571; the east westbound line uses 123467790. App inspection found the original eastbound parallel-offset assumption did not match the actual divided continuation. Its connected line is now sampled from the live Protomaps near-ring motorway centreline; literal coordinates and provenance are in `vincent-thomas-bridge-landings.js`. Two small Overpass queries through the shared helper timed out, so no unverified OSM way ID is claimed for that companion. This provider sample is generalized map geometry, not a survey. Both building-tagged tower rings 1011852499/1011852500 are registered exactly in FOOTPRINTS/OSM_WAYS and passed to the runtime building mask.

Existing `lateralBankFit` with terrain clamping and 0.12 m clearance fits the approach pavement above the actual lateral DEM sample in Full 3D world. This addresses terrain emerging through the wide separated ribbons; the suspension stays at its authored absolute datum. Navigation heightAt and mesh fitting use the same existing ground contract. No shared runtime source changed. Slab and pavement use one globally aligned station grid; this removed far ramp chord intersections. Near/far depth generation and --check have zero dropped cycle edges.

| LOD | Before triangles / draws / KiB | After triangles / draws / KiB |
| --- | ---: | ---: |
| Near | 73,808 / 15 / 2,658 | 79,072 / 23 / 2,766 |
| Far | 27,100 / 5 / 937 | 26,216 / 9 / 923 |

Both exports satisfy bridge budgets with all 9 far draws accounted for. Named support contacts pass in both LODs, including rail ends and negative shortened-hanger cases. The new landing raycasts prove separate pavement at the fork, ownership rejects its open central gap, the terminal widths and rail heights are bounded, and both suspension cross-sections remain rigid. Focused registry plus landmark tests pass 466/466 (10 landmark tests); asset catalog/check and local preview build pass.

Exported sheets read: `tmp/top-cities/shots/vincent-thomas-bridge/review-fix/vincent-thomas-bridge-glb-near-light-sheet.jpg` and `review-final/vincent-thomas-bridge-glb-far-light-sheet.jpg`, covering both landings, overview and broadside; these are the two look iterations. Final app evidence is in `tmp/top-cities/shots/vincent-thomas-bridge/review-app/{cityscape,world}-approaches/`, four PNGs each (west/east by eastbound/westbound). The app captures include the final companion-line and terrain correction, after the exported sheets.

`tmp/top-cities/vincent-thomas-bridge/review-probe-{cityscape,world}.json` contains actual window.__map.landmarks.heightAt results at 194 mapped OSM roadway vertices within the model, both fitted carriageway centres at every authored alignment station and control stations, in both headings (1,176 queries per mode). Unit ownership tests reject the fork gap; app probes reject the off-road point and crossing heading. The following values supersede the initial centreline-only table for the landing correction; heightAt is terrain-relative in world mode.

| Station (m) / side | Cityscape heightAt (m) | World DEM (m) | World heightAt (m) | Absolute world road (m) |
| --- | ---: | ---: | ---: | ---: |
| 0.000 / 0 | 0.000 | 25.669 | 0.178 | 25.846 |
| 0.000 / 1 | 0.000 | 26.307 | 0.120 | 26.427 |
| 100.000 / 0 | 1.638 | 14.791 | 11.988 | 26.779 |
| 100.000 / 1 | 1.638 | 16.520 | 10.259 | 26.779 |
| 600.000 / 0 | 38.209 | 4.140 | 43.456 | 47.596 |
| 600.000 / 1 | 38.209 | 4.163 | 43.433 | 47.596 |
| 1395.901 / 0 | 60.000 | -0.232 | 60.232 | 60.000 |
| 1395.901 / 1 | 60.000 | -0.241 | 60.241 | 60.000 |
| 2400.000 / 0 | 9.247 | 6.493 | 5.214 | 11.706 |
| 2400.000 / 1 | 9.247 | 6.640 | 5.066 | 11.706 |
| 2604.993 / 0 | 0.000 | 2.866 | 0.120 | 2.986 |
| 2604.993 / 1 | 0.000 | 3.190 | 0.120 | 3.310 |

All 588 sample locations in each mode return non-null in both headings (including all 194 mapped roadway vertices). World has 1032 exported zero-weight foundation vertices checked against actual DEM, maximum residual 0.000000781 m (numeric fitting precision only). Final combined approach sheet actually read: `tmp/top-cities/shots/vincent-thomas-bridge/review-app/final-approaches.jpg`. Both ground forks line up laterally and retain lane paint through the handoff; terrain no longer emerges through the end ribbons. HD lane payloads remain unavailable locally (503), so HD lane count/dash-phase continuity is still not tested; the visible paint is authored fallback. Physical driving, lifecycle stress, night app recaptures and Tesla hardware remain separate gates. No online deployment.

## b5r3a review: fitted viaduct caps, 2026-10-12

The independent re-review found green transverse pier caps crossing the world approach pavement. Approach caps and shaft tops incorrectly used the suspension tower's fixed 60 m attachment weighting. Caps now use full deck attachment; each concrete shaft graduates from zero attachment at its foot to full attachment at its cap. The footings still sample local DEM. The cap has an explicit upright 2.3 m longitudinal by 21.4 m transverse by 1.2 m vertical section: the previous transverse beam quaternion could rotate its deeper dimension into vertical height. Its top embeds 0.10 m into the authored slab underside, 1.08 m below pavement. Towers, cables, landings and suspension-span geometry are unchanged.

The regression raycasts fitted cap and pavement surfaces in both lanes, checks every named shaft/foot/cap contact and per-vertex footing residual, and refits through flat, sloping terrain, changed approach heights and flat again. A negative control using the previous committed geometry fails: minimum pavement-minus-cap clearance is −3.782 m near / −3.724 m far on the synthetic sloping datum; corrected geometry gives +1.072 / +1.064 m. These synthetic values prove the regression detects the defect; app measurements below establish actual placement.

| LOD | Before triangles / draws / bytes | After triangles / draws / bytes |
| --- | ---: | ---: |
| Near | 79,072 / 23 / 2,832,292 | 79,072 / 23 / 2,832,224 |
| Far | 26,216 / 9 / 945,144 | 26,216 / 9 / 945,128 |

Rounded export costs remain 2,766 KiB near / 923 KiB far. Focused registry and landmark tests pass 467/467, including 11 landmark tests; final landmark-only run passes in 2.82 s. Catalog/assets check and preview build pass. Depth generation and `--check` report no dropped cycle edges. Exported near/far light sheets actually read: `tmp/top-cities/shots/vincent-thomas-bridge/b5r3a-fix/vincent-thomas-bridge-glb-{near,far}-light-sheet.jpg` (overview, underside and both landings; one look iteration).

The actual fitted exported vertex positions are matched back to named authored caps, shafts, footings and pavement for numerical raycasts; the probe does not substitute an analytic profile for the loaded GLB. Each mode captures both endpoints in both driving directions with both near and far loaded explicitly. Evidence lives under `tmp/top-cities/shots/vincent-thomas-bridge/b5r3a-app/{cityscape,world}-approaches/`, with mode-specific `report.json` and contact sheets alongside those directories. The full-resolution world `near-east-westbound.png` was compared directly with the offending previous screenshot: transverse bars no longer cross driving pavement. Cityscape approach sheet was also read; landings remain aligned.

| Mode / LOD | Caps / shafts checked | Minimum cap-to-pavement clearance (m) | Maximum footing/DEM residual (m) |
| --- | ---: | ---: | ---: |
| Cityscape / near | 39 / 78 | 1.07336 | 0 |
| Cityscape / far | 20 / 40 | 1.06375 | 0 |
| Full 3D world / near | 39 / 78 | 1.07083 | 0.000000889 |
| Full 3D world / far | 20 / 40 | 1.06587 | 0.000000889 |

World shaft tops overlap their caps by at least 0.3995 m in both LODs; shaft bases overlap their footings by at least 0.3794 m near / 0.4968 m far. The fitted section corners interpolate the analytic shaft endpoint within 0.080 m near / 0.009 m far; the direct surface overlap checks establish attachment. Foot residual is numerical fitting precision, not DEM/survey accuracy. Both modes are **verified** for this cap/pavement/support correction; all sixteen shots report the requested LOD active. Both mode sheets and the full-resolution world `far-east-westbound.png` were also read: no transverse cap crosses pavement in either LOD.

HD `/osm-lanes` remains unavailable locally (503), so HD dash-phase continuity is not tested. Physical driving, night app capture, broader lifecycle stress and Tesla performance remain the existing separate gates.
