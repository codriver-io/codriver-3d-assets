# Estadio Nacional de Costa Rica — San José

Original procedural model of the stadium opened on 26 March 2011 in La Sabana Metropolitan Park, replacing the 1924 ground. The identity is the open oval bowl wrapped in pale curved louvres and the two enormous crescent canopies, with exposed steel arch trusses descending into four independent ground foundations. The model retains uncovered north/south seating, blue upper and red lower tiers, concourse openings, video boards and axial access stairs. No photograph, texture, captured mesh, advertising or logo ships.

## Sources and dimensions

| Element | Model | Basis |
| --- | --- | --- |
| Roof crest | 52.6 m | OSM roof ways [656351598](https://www.openstreetmap.org/way/656351598), [656351599](https://www.openstreetmap.org/way/656351599), parent building relation 9130067; mapped height, not a surveyed engineering dimension |
| Roof plan envelope | approximately 245 × 298 m | Exact mapped roof polygons, including outside sawtooth tips |
| Complete site structure envelope | approximately 245 × 312 m | Roofs plus mapped axial steps and thrust blocks |
| Seating bowl outer envelope | 214 × 268 m | Photo estimate fitted inside OSM stadium envelope |
| Upper stand backs | about 27 m along long sides, 14.6 m at ends | Photo reconstruction; OSM stand tags are simplified 20/10 m heights |
| Arch truss depth | 0.7–5.9 m | Estimate from reference photographs; taper into both ground ends |
| Roof skin thickness | 0.85 m | Modelling estimate, closed soffit |
| White facade louvres | 6 rows near, 4 broader rows far | Photo estimate; actual separate blades with 1.9 m relief from recessed glazing |
| Ground thrust foundations | 3.5 m body, 5 m apex | Exact OSM plans, 5 m tagged heights; simplified faceted caps |
| Field | 105 × 68 m lines | Conventional football proportions; approximate in this asset |
| Tier and structural repetition | 24/5 seat rows, 32/12 truss bays | Deliberate LOD simplification, not claimed construction counts |

[Wikipedia](https://en.wikipedia.org/wiki/Costa_Rica_National_Stadium_(2011)) establishes the 2011 version, La Sabana location and opening date. Capacity is not used as a geometric dimension because the supplied dossier and public pages report differing configurations. Roof curvature, support diameters, bowl height, facade rhythm and colours are estimated, not measured engineering data.

## Geographic frame and provider ownership

Metres, +X east / +Y up / +Z south. Origin `[-84.10772, 9.93675]` is the reconstructed bowl centre, corrected northward from the dossier's Wikipedia anchor. Local y=0 is stadium grade; no DEM, altitude or Mercator stretch is baked in. Roofs and entrance/foot plans are transformed directly from geographic polygons: their mapped alignment is baked once rather than rotated by the host. Two long-side controls `[-84.1071432,9.9371130]` and `[-84.1071426,9.9369090]` confirm a nearly north/south axis (approximately 0.17° west of north).

Parent building relation 9130067 is represented by outer way 222243861; inner way 656368653 is the open arena and is not a provider building part. Owned way ids: 222243861; 656351593, 656351598, 656351599, 656351600, 656351614, 656351622; 656371094, 656371095, 656371096, 656371097; 656611538, 656611752, 656611753, 656611754, 656611755; 656612381; 657432492, 657432493. All 19 exact rings are exported in `footprint.js`; neighbouring park structures are excluded. The last four thrust foundations and the north stands were missing from the original 110 m dossier radius, so one small shared-helper query fetched the complete set.

The procedural bowl and finite member diameters fit within 5 m of the exact ownership union, tested at every geometry vertex. The terrain pad uses the bounded mapped outer ring and median reference sampling around the bowl. This describes a rigid placement policy; real DEM footing, resident terrain lattice coverage, pad transitions and entrances still require the lead's application validation.

## Geometry and cost

Both crescent shells take their exact footprint cross sections from OSM. All outline stations are shared by roof skin, fascia and soffit, preventing open seams along the sawtooth edges. Two curved edge arches per canopy carry triangulated webs and transverse ribs. Every member terminates in a named solid joint; four arch tails descend into mapped thrust blocks, and V-column bases meet grade-rooted concrete pedestals. Far retains the same open roof and ground envelope, with fewer bays and three-sided tubes instead of four. Tube caps are buried in solid joints and omitted.

Seat treads, concrete risers and aisle sectors are disjoint geometry. The far model keeps separate coarse red and blue rows. White louvres project outside recessed concourse glass, producing real open shadow bands; fine blades merge into broader rows at far. Eight merged materials in both variants: concrete, white, steel, glass, red, blue, grass, track. Colours are muted reference estimates; dark palette dims field/seats and keeps pale structural steel legible. The roof shells, louvres and structure use named normals for the shared application shading path, which has not yet been checked in the app. Field marks are geometry with 0.6 m vertical separation for far depth precision, a visual approximation of paint.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 35,126 | 8 | 1,847,716 | 1,804.4 |
| far | 8,854 | 8 | 474,884 | 463.8 |

Measured exported default scenes; both are below building caps (60k / 14 / 2.5 MB and 12k / 8 / 500 KB). Near and far have identical horizontal bounds and crest; no hardware timing is claimed.

## Reference evidence

Reference images remain only under ignored `tmp/top-cities/estadio-nacional-costa-rica/refs/`:

- `1.jpg`: Terran21, *Estadio Nacional de Costa Rica*, exterior, CC BY 2.0; [English Wikipedia local file](https://en.wikipedia.org/wiki/File:Estadio_Nacional_de_Costa_Rica.jpg), originating Flickr account Terran21. This is a local Wikipedia file with architecture restrictions noted on its page, used only for comparison and not redistributed.
- `2.jpg`: Nyarlazul, *Panorama Estadio Nacional de Costa Rica*, 2022, CC BY-SA 4.0; [Commons file page](https://commons.wikimedia.org/wiki/File:Panorama_Estadio_Nacional_de_Costa_Rica.jpg).
- `3.jpg`: MadriCR, *Estadio Nacional de Costa Rica, 2011*, CC BY-SA 4.0; [Commons file page](https://commons.wikimedia.org/wiki/File:Estadio_Nacional_de_Costa_Rica,_2011.jpg).
- `4.jpg`: Peloy (Allan H.M.), *Estadio Nacional, San José, Costa Rica*, 2012, CC BY-SA 3.0; [Commons file page](https://commons.wikimedia.org/wiki/File:Estadio_Nacional,_San_Jos%C3%A9,_Costa_Rica._-_panoramio.jpg).

The dossier's reference sheet and the two added interior structural views were inspected. The first exported near sheet at `tmp/top-cities/shots/estadio-nacional-costa-rica/iteration1/estadio-nacional-costa-rica-glb-near-light-sheet.jpg` showed a recognisable twin canopy silhouette and open trusses, but an excessively dark concourse wrapper; the white blades were broadened in response. Repeated tubes were simplified and hidden caps removed to bring both exports within the required budgets. Final exported sheets include overview, both facades, above, street, close truss/wrapper detail and interior.

## Final verification — 2026-10-13

Judged the exported `tmp/top-cities/shots/estadio-nacional-costa-rica/final/estadio-nacional-costa-rica-glb-{near,far}-{light,dark}-sheet.jpg` and the combined `estadio-nacional-costa-rica-final-comparison.jpg` beside the supplied reference photographs. Each sheet contains overview, facade, opposite facade, above, driver-level approach, close canopy/cladding detail and interior. The final broader blades bring the exterior closer to the white wrapper in the reference while retaining open shadow slots, and both LODs preserve the twin roof wings, open ends and supported trusses. Seating is intentionally coarse at far; individual seats, roof service equipment and the detailed real engineered joints are omitted.

Eight dedicated tests pass in about 1.2 s: mapped crest/envelope, open twin roof, red/blue tier geometry, projecting louvres, every named member terminal and a deliberately shortened failure control, grounded arch feet/pedestals, complete owned-ring containment, and exported bounds/material/byte parity. All three stadium registry checks pass. The initial required combined registry/dedicated command reported 585/589 passing; four unrelated concurrent-build failures were Bob Kerrey Pedestrian Bridge's near triangle budget (138,424 > 120,000), plus Plant Hall Tampa's draft catalog status, far triangle budget (17,871 > 12,000) and absent catalog manifest. No other builder's files were changed.

Deterministic QA in `tmp/top-cities/estadio-nacional-costa-rica/qa-metrics.json` reports **ok**, zero coplanar overlaps, zero close layered faces in both LODs, 0.6% back-face hits (below 2%) and no window-rhythm flags. The generic member scanner does not select the `steel` material; explicit named-solid contact tests cover the truss instead. The generated asset-specific depth table has no material cycles and `node scripts/landmark-depth-layers.mjs --ids estadio-nacional-costa-rica --check` passes. Only that generated shared file was modified.

The initial catalog attempt was temporarily blocked by another builder's unregistered `plant-hall-tampa-far.glb`; the retry passed: **336 catalog entries / 572 GLB variants**. `pnpm assets:preview` also passed and generated the ignored local inspection pages. All **11 stadium checks** (eight dedicated plus three registry) pass together in about 1.3 s in the focused rerun, logged at `tmp/top-cities/estadio-nacional-costa-rica/focused-tests.log`. The ready record, manifest and exports agree. The earlier shared-registry failures are recorded above for the lead to recheck after the batch settles. At the last depth-check checkpoint, the shared catalog was again mid-build, this time with an unregistered `bob-kerrey-pedestrian-bridge-far.glb`; the stadium-specific fallback still passed, so catalog success above records the completed retry rather than a guarantee about concurrent global state.

## Application handoff

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, shared renderer build, deployment or git write operation was run. The lead owns unobstructed app captures in both modes, replacement/provider checks, pad and DEM footing, entrance continuity, asynchronous failure/mode/reanchor lifecycle, hardware performance and independent visual review. Ready means exported and catalogued, not terrain certified.

### Independent-review geometry corrections — b7a, 2026-10-13

Addressed review items 1 and 2: both canopy skins now have broad triangular ridge/valley folds at 20 m ridge spacing, reaching 4.2 m depression at the outer edge and tapering toward the inner edge/end tips. Roof skin, fascia and soffit share every fold station in both LODs alongside all exact mapped plan stations. The smooth supporting arches sit below the valleys; added roof struts connect their named primary joints to named joints embedded in the folded soffit. Primary arch chords are now 1.05 m inner / 1.25 m outer diameter, primary diagonals 0.60 / 0.72 m, posts 0.58 m and roof ribs 0.48 m. This estimated hierarchy makes the exterior arch legible rather than equal-weight wirework. Both LODs retain the primary chords, arch webs/posts and roof struts. Far omits secondary transverse roof webs and uses tetrahedral solid joints to stay below 500,000 bytes; near retains those webs and octahedral joints.

Compared the dossier and exterior `refs/1.jpg` against fresh exported `tmp/top-cities/shots/estadio-nacional-costa-rica/review-fix/estadio-nacional-costa-rica-glb-{near,far}-{light,dark}-sheet.jpg`. Inspected street, close canopy/wrapper and interior views; far day also includes overview. The triangular crests and stronger curved arch survive the far simplification; the white wrapper and open twin-canopy aperture remain intact. Fold geometry and engineered joints are estimated, not a construction-detail reconstruction.

Costs before → after: near 32,114 → 35,126 triangles, 8 → 8 draws, 1,678,764 → 1,847,716 bytes; far 8,234 → 8,854 triangles, 8 → 8 draws, 449,452 → 474,884 bytes. Ten dedicated tests pass, including raycast ridge/valley/soffit geometry, primary steel thickness and every named structural terminal (with a shortened-end failure control), plus roof joint contacts. Fresh deterministic QA reports no issues, zero close-layered faces and 0.6% back-face hits. Depth regeneration/check drops zero cycle edges; catalog retry validates 336 entries / 592 variants.

Cityscape and Full 3D world remain not tested by this worker: the lead recaptures application evidence and requests independent re-review. No app server, full test suite or git write was run.

The required combined registry/dedicated run completed with **608/609 passing**, including all **18 dedicated checks** and all six registry checks for these two landmarks; the unrelated failure is `charles-bridge: footprint is a real polygon`. Log: `tmp/top-cities/one-atlantic-center/review-fix-tests.log`. Final catalog validation and `pnpm assets:preview` both passed (336 entries / 592 variants); depth freshness also passed after the documentation/catalog updates.
