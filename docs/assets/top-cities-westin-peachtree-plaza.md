# Westin Peachtree Plaza, Atlanta

Original procedural model of John Portman's 1976 cylindrical hotel at 210 Peachtree Street NW. The recognizable features are a 220.37 m roof, subdued bronze-grey reflective glass, dense window rows, the three-level Sun Dial restaurant drum and the small glass scenic-elevator cylinder on the ENE side. The irregular seven-story podium and a low atrium skylight complete the street-level massing. This represents the repaired exterior, not the torn glazing visible in the 2008 detail reference.

## Sources and dimensions

| Item | Source or estimate | Authored dimension |
| --- | --- | --- |
| Roof height / stories / opening | [Wikipedia](https://en.wikipedia.org/wiki/Westin_Peachtree_Plaza_Hotel), OSM tower height | 220.37 m; 73 stories; 1976 |
| Diameter | OSM way 192939493, independent horizontal fit | 39.2 m |
| Published diameter discrepancy | Wikipedia says 57 m; conflicts with the mapped ~39 m tower and ~43 m deep hotel parcel | 39.2 m fit approved by coordinator; height not scaled |
| Podium | [Portman Architects](https://portmanarchitects.com/project/the-westin-peachtree-plaza/) describes seven stories and a 90 ft skylit lobby | 24 m exterior height estimated, full mapped outline |
| Restaurant | Three-level top drum identified in reference photos | 208.2–218.9 m estimated; 1.47 m upper rim to 220.37 m |
| Main facade | ~5,600 flat windows reported, photo grid | 80 bays × 64 body rows near; 32 × 32 far, estimated |
| Elevator | Small cylinder in OSM outline and detail photograph | Radius 2.55 m, center 20.5 m from tower, 58° bearing, estimated |
| Historical antenna | Wikipedia infobox quotes 269.1 m antenna height | Not modelled: present-day configuration not verified |

Portman's own page quotes 230 m rather than the 220.37 m OSM/Wikipedia roof height; the latter is used for the requested 220 m landmark. No announced future renovation is guessed. A 57 m cylinder would project past the mapped podium; the horizontal fit is explicitly independent of the height. No antenna height is silently included in SPEC.height, which is the highest authored point.

## Geographic frame and provider ownership

Origin `[-84.388577, 33.7594283]` is the circular tower's mapped center. Metres use +X east, +Y up, +Z south; y=0 is rigid local hotel grade. OSM control points `(−84.3890740,33.7592473)` and `(−84.3877266,33.7592415)` along the south edge establish approximately 90.3° frontage; mapped coordinates are baked into the podium. The scenic-elevator bulge is ENE at approximately 58° from north.

[Hotel podium way 42904130](https://www.openstreetmap.org/way/42904130) and [tower/elevator part 192939493](https://www.openstreetmap.org/way/192939493) are both registered in FOOTPRINTS and OSM_WAYS. Every modeled vertex is checked against this ownership envelope. North skybridge 1040543347, adjacent garages, 230 Peachtree and AmericasMart remain provider-owned. No plaza pad covers neighbouring roads. Terrain is not baked into the exports; the default pad and entrance contacts require runtime review.

## Materials and authoring

Original texture-free Three.js source is in `src/peregrine/landmarks/top-cities/westin-peachtree-plaza/`. Rebuild with `pnpm build:top-cities-landmarks westin-peachtree-plaza --no-check`, then regenerate/check the landmark's depth table. A partitioned faceted shell forms the panes, slim vertical mullions and floor joints as adjoining surfaces, with no backing cylinder or stacked window overlays. Sparse occupied-room panes use a subdued day colour and warm `glow` colour at night. The two main glass materials use closely matched neutral bronze/silver-grey colours; one broad reflection sector replaces the former every-seventh-bay olive stripes, and day glow is calibrated to the shaded shell. The fine bay/floor grid remains unchanged in both LODs. External elevator glass remains cooler. Materials merge into seven draws at both LODs.

The far model retains the podium envelope, fine horizontal floor rhythm, separate panes, elevator cylinder and all restaurant tiers. It coarsens bay counts and podium windows. The atrium skylight, exterior podium windows and restaurant heights are simplified estimates; interiors, signage, revolving mechanics and antennas are omitted. There are no separate cables, beams, rails or walkways requiring terminal contact tests. The elevator's base contact with the named podium roof is raycast in both LODs, with a raised/shortened negative case.

## Reference provenance

Reference-only files remain in ignored `tmp/top-cities/westin-peachtree-plaza/refs/`; none is embedded or shipped. The dossier sheet was viewed before modeling:

- [Westin Peachtree Plaza Hotel.jpg](https://commons.wikimedia.org/wiki/File:Westin_Peachtree_Plaza_Hotel.jpg), Ncsr111, CC BY-SA 4.0: skyline silhouette.
- [Atlanta (8215269237).jpg](https://commons.wikimedia.org/wiki/File:Atlanta_(8215269237).jpg), Aleksandr Zykov, CC BY-SA 2.0: opposite street exterior.
- [Worm-eye Westin Peachtree Plaza Hotel.jpg](https://commons.wikimedia.org/wiki/File:Worm-eye_Westin_Peachtree_Plaza_Hotel.jpg), AAK, public domain: glass hue, crown and window scale.
- [2008 Tornado Damage to Westin Peachtree Plaza Hotel.jpg](https://commons.wikimedia.org/wiki/File:2008_Tornado_Damage_to_Westin_Peachtree_Plaza_Hotel.jpg), Brianga, CC BY-SA 3.0: elevator/crown structure only.

Models: original Codriver procedural work, CC BY 4.0; source and documentation: MIT. Geographic data © OpenStreetMap contributors, ODbL 1.0. Photo licences govern references only; no image pixels or third-party mesh is redistributed.

## Verification and handoff

Near export: **29,872 triangles / 7 draws / 1,622,588 bytes (1,585 KiB)**. Far export: **6,908 triangles / 7 draws / 381,156 bytes (372 KiB)**. Costs describe exported scene draws and uncompressed bytes, not measured Tesla performance. Both are within the building budgets. Focused tests cover observable tower/crown dimensions, discrete window rows, elevator placement and support, grade, ownership containment and source/GLB round trips.

Visual evidence looked at:

- `tmp/top-cities/westin-peachtree-plaza/refs-sheet.jpg` before modeling.
- `tmp/top-cities/shots/westin-peachtree-plaza/westin-peachtree-plaza-final-contact.jpg`: reference street/crown/elevator photographs next to exported GLB near/far front, back, roof/detail, entrance and night views.
- `tmp/top-cities/shots/westin-peachtree-plaza/westin-peachtree-plaza-procedural-near-light-sheet.jpg`: source overview, entry and crown against the exported equivalents.
- `tmp/top-cities/shots/westin-peachtree-plaza/westin-peachtree-plaza-glb-near-light-top.png`: north-up mapped fit, with the tower, elevator and podium envelope.

The first look exposed facade/back cameras cropping the cylinder and excessively pale day glow panes. The cameras were moved back, day glow muted, night glass lifted slightly, and the ground-floor podium glazing extended down to a 0.3 m sill. Final exported views were re-rendered and judged after these changes. The bronze-grey facade is intentionally subdued; texture-free glass does not reproduce the skyline's changing silver/blue reflections. Far podium storeys and lit windows are visibly coarser than near. The top drum and shaft remain simplified rather than detailed architectural surveys; no claim of exact roof equipment or current antenna state is made.

## Independent review fix, 2026-10-12

The reviewer requested smoother reflective glass and reported a white enclosure in the near app views. Dossier OSM data and fetched Protomaps z14/z15 features confirm the complete provider ownership is still podium `way/42904130` and tower/elevator `way/192939493`; both rings already contained every provider vertex. The Overpass helper was attempted once but its endpoints timed out, so the saved dossier and the actual tile features were used. IDs now use canonical `way/<id>` strings. The lead inspected the far Full 3D world capture and confirmed the rectangular white tower in the near view is a foreground neighbour, not an overlapping hotel extrusion; footprint coverage is therefore retained without expanding into neighbours. Evidence is saved in `tmp/top-cities/westin-peachtree-plaza/provider-review.json` and the fetched tile files.

Removed the fixed olive shade stripes, shifted the closely matched day glass colours toward neutral bronze/silver-grey and reduced the day contrast of sparse lit panes. The 220.37 m cylinder, fine near/far floor/bay grid, top restaurant drum, external elevator and podium remain intact. Geometry cost is unchanged: near **29,872 / 7 / 1,584.6 KiB** before and after; far **6,908 / 7 / 372.2 KiB** before and after (each GLB is four bytes smaller).

One look-fix round was used. Judged exported contact sheets are `tmp/top-cities/shots/westin-peachtree-plaza/review-fix1/westin-peachtree-plaza-glb-near-light-sheet.jpg` (overview, facade, back, roof, entrance and crown/elevator detail) and the corresponding far sheet (overview, back and crown). The cylinder reads as a continuous reflective grey shell with subdued pane variation; the distinct grid, drum and elevator survive both LODs. Day/night reflection remains a texture-free approximation.

Focused tests cover tower/crown dimensions, retained floor rhythm, elevator support with a shortened-end negative case, grade, canonical ownership and GLB round trips. Exported QA in `tmp/top-cities/cologne-cathedral/review-fix-metrics.json` reports no issues, zero layered/coplanar faces, 0% back-face hits and no far window-rhythm flags. Depth generation and selected `--check` pass with zero cycle edges dropped; the shared catalog validates 286 entries / 520 GLB variants at the checked snapshot. Final combined test evidence is recorded in `tmp/top-cities/cologne-cathedral/review-fix-tests.txt` and `REVIEW-FIX.md`.

The lead confirmed existing b3 provider replacement; visible podium/base contacts still need an unobstructed view. Revised glass is **not yet recaptured** in Cityscape or Full 3D world; the lead owns those refreshed captures and independent re-review. No app server or bundle was started during this fix.

Final focused run: **17/17 passed** for both landmarks together in 1.7 seconds, including 12 Cologne tests. Required combined top-cities plus both landmarks run: **431/432 passed**; the sole failure is another active builder’s `washington-dc-temple` footprint polygon, outside this fix’s scope. All six Westin/Cologne registry conformance checks pass.

`pnpm assets:check` and `pnpm assets:preview` passed; the standalone catalog is generated only under ignored `tmp/champlain-preview/`.
