# Tower Bridge (`tower-bridge`)

Original procedural model of the present-day A100 Thames crossing, London, opened 30 June 1894, designed by Horace Jones and engineered by John Wolfe Barry. Bascules are closed for normal road travel. The two Gothic towers, pointed piers, separated high walkways, blue chains with white lattice/hangers and low abutment arches are retained in both LODs.

Source: `src/peregrine/landmarks/top-cities/tower-bridge/`; catalog: `prototypes/assets3d/catalog.d/tower-bridge.json`; exports: `public/models/bridges/tower-bridge-{near,far}.glb` and `tower-bridge.json`. Rebuild: `pnpm build:top-cities-landmarks tower-bridge --no-check`.

## Sources and dimensions

- [Tower Bridge, official visitor site](https://www.towerbridge.org.uk/explore-inside), checked 2026-10-04: upper walkways 33.5 m above the road, 70 m between towers. The page gives both 42 m and 43.5 m above the Thames in different sections; these tide datums are not a survey. We preserve the unambiguous road-to-walkway difference.
- [Planning heritage statement, section 2](https://docs.planning.org.uk/20250910/54/T24DANKBG9900/oz2eqj61rsqdhm0v.pdf), checked 2026-10-04: 65 m towers; 61 m bascule span; 82 m suspension side spans. Its 225 m description excludes tower/pier extents; the dossier's 940 ft overall length includes the abutments. Those definitions are not interchangeable.
- [OpenStreetMap bridge outline](https://www.openstreetmap.org/way/378541210), prepared dossier retrieved for this batch: A100 roadway and approaches, road passages through both towers, two upper building parts (367652753, 367653917). Road IDs and geographic points are retained in `tower-bridge-alignment.js`; original extract in ignored `tmp/top-cities/tower-bridge/osm.json`. © OpenStreetMap contributors, ODbL 1.0. No new Overpass call was necessary.
- Commons reference contact sheet supplied in the dossier: Heresy0uk, *Tower Bridge - 1950* (CC BY-SA 4.0); Fuzzypiggy, *Tower Bridge at Dawn* (CC BY-SA 3.0); Benh LIEU SONG, *Tower Bridge London 2022-10-10* (CC BY-SA 4.0); Doyle of London, *South Arch of Tower Bridge (South Face - 01)* (CC BY-SA 4.0); HyunJae Park, *Tower Bridge in London at night* (public domain); Fry72, *Krkavec (raven), Tower, City, Londýn, Anglie 01* (CC BY-SA 4.0). File-page links and licence metadata are in the catalog; images stay in ignored scratch. No third-party mesh, photograph, texture or scan is shipped.

| Dimension | Model | Basis |
| --- | ---: | --- |
| Tower highest finials | 65 m | Published; local pier-base datum |
| Road–upper-walkway floor difference | 33.5 m | Official |
| Road / walkway above local grade | 8.5 / 42 m | Illustrative high-water convention; tide datum uncertain |
| Main tower centres | 82.82 m | Mapped road passages |
| Clear distance between tower stone faces | 71.82 m | Mapped spacing minus estimated 11 m tower depth; consistent with official ~70 m walkway |
| Nominal bascule span | 61 m | Published; distinct from visible tower spacing; pivot machinery not modelled |
| Suspension spans | 82 m each | Published, tower outer face to chain anchor |
| Full road-fit alignment | 378.51 m | Mapped approaches, stops before separated carriageways |
| Bridge structure incl. low abutments | 281.82 m | Derived from mapped centres, side spans and estimated gateway ends |
| Deck / road / main tower width | 16.5 / 8.4 / 19 m | Estimated from map and photos |
| Portal soffit | ~10.6 m above deck at crown | Photo estimate; clear bus passage ray-tested |
| Ramp length / maximum grade, Cityscape | 112 m / 11.4% | Flat-map compromise, smooth transitions |

## Geometry and placement

Real metres, east/up/south. Origin `[-0.0753637, 51.5055166]` is the mapped centre joint of the bascules. Station follows the A100 north to south at approximately 202.8°; lateral positive is west/right. Rotation is baked into the GLB. The road profile is shared with the runtime registry bridge layer, pavement, car, route and camera. All approach vertices are mapped, not extrapolated onto an assumed street grid.

The portal mass is an extruded outline with an actual arched opening, radial voussoirs on both faces, projecting corner buttresses, five string courses, paired lancet windows, pointed crests, crenellations, four octagonal turrets and a steep slate central roof. Two separate walkways retain the transverse gap; lattice webs, gold medallions and deck beams remain visible. The suspension chain curves only over the side spans; white lattice and hangers attach to the deck. Bascules have floor beams and a 12 cm joint. Repeated members merge by material, with no texture or decoder. This 282 m structure fits in one spatial chunk, 9 near draws / 8 far draws. Far drops lamps, fine paint, window trim, alternate windows/hangers and fine railings; the Gothic roofline, open archways and walkway gap remain.

`bridgeLift` keeps footings fixed at zero, stretches the pier shaft to the fitted road datum and moves upper structure together. Round-trip tests verify `_bridgelift`. `terrainPolicy: absolute-deck` avoids a flattened trench across the river: world mode fits the approach ends to DEM while the main deck keeps its illustrative 8.5 m datum. No terrain elevation is baked into the mesh. This is not a surveyed tide/Ordnance Datum conversion. River cutwaters intentionally extend outside the mapped road-outline ring, while the upper walkways remain in the bridge envelope. Approach geometry extends along the mapped road beyond the bridge polygon.

## Materials and approximations

`stone` warm grey masonry; `trim` pale limestone bands; `roof` dark slate; `steel` sky blue; `white` lattice/paint; `glass` dark window recesses; `asphalt`; `gold` finials/medallions; `light` lamps and narrow architectural lights. Dark palette dims masonry and metal with warm self-lit lights. The actual architectural floodlighting, carved heraldry, masonry joints, door details, chain rivets, bascule counterweights/interiors and bridge opening animation are simplified or omitted. Road width, roof profiles, windows, chain sections and pier cutwaters are photographic estimates. Night is a stylized lighting treatment, not a lighting survey.

## Costs and deterministic verification

| LOD | Triangles | Draws | KiB |
| --- | ---: | ---: | ---: |
| Near | 33,950 | 9 | 2,049 |
| Far | 11,422 | 8 | 675 |

Within bridge caps 120k/40/4.5 MB and 30k/10/1.2 MB. The far bounding box matches near exactly; y = 0 to 65 m.

Focused conformance plus landmark tests: 93 passing, under 1 second total on this machine. They assert published crown and relative walkway heights, mapped spacing/bearing, open bus portals in both directions, pier/cap contacts, separate walkways and central gap, unobstructed navigation channel, closed roadway surfaces, footprint envelope, both-direction height ownership, null off-road/crossing headings, approach contacts and <12% grade, GLB bounds and attachment round trip. `qa-metrics.mjs --ids tower-bridge`: clean; no significant coplanar overlaps, no failed back-face sweep, no removable bytes.

## Visual evidence

The reference sheet was opened before modelling. Procedural contact sheets inspected: `tmp/top-cities/shots/tower-bridge/tower-bridge-procedural-near-light-sheet.jpg` and `iteration2/tower-bridge-procedural-near-light-sheet.jpg`, each overview/front/back/above/street/underside/tower. First-look fixes: corrected winding after the reflected station/lateral transform, added pointed window heads and facade crests. Deterministic ray checks then exposed inverted ribbon pavement, corrected its winding, separated internal coplanar buttress toes and omitted invisible approach ground faces. The final exported GLBs were inspected in `tmp/top-cities/shots/tower-bridge/final/export-reference-sheet.jpg`, which combines all four near/far light/dark sheets beside the dossier photos. Each variant includes overview, facade, back, above, street, underside and close tower views. The blue side chains, pointed tower crowns, twin walkways, roadway arches and open river channel read consistently; far preserves silhouette while simplifying windows and lanterns. Night retains the structure but is much dimmer than the real floodlit bridge, a documented approximation.

`app-mode-sheet.jpg` combines the prescribed application far/near/street captures for Cityscape and world. Both exported LODs loaded and the model replaced the generic bridge without a second deck in the shots. Local bundle built successfully; standalone catalog/inspector generated through `pnpm assets:preview`. No shared source changes were required. Independent review remains the coordinator's delivery gate.

## Mode verification

Cityscape: **verified locally for standard roads**, Protomaps tiles, bundle build 4f3ccdcf4639, port 3270; near/far GLBs active. The height API matches the deck in both directions, starts and ends at zero, returns null for crossing headings and 30 m off-road. Full route/car playback was not exercised.

Full 3D world: **verified locally for standard roads and terrain fitting**, port 3272, AWS Terrarium DEM z15. Absolute deck stays at 8.5 m between the ramp crests; supports meet the DEM and the ramps blend into terrain roads. This validates this illustrative datum, not surveyed tide/Ordnance Datum accuracy. Ground is converted from Mercator world units by the latitude stretch 1.60658 exactly once.

Height samples from the live app (forward and reverse are equal; all crossing-heading samples are null):

| Station m | Cityscape heightAt m | World ground m | World heightAt m | World absolute deck m |
| --- | ---: | ---: | ---: | ---: |
| North foot 0 | 0 | 5.8592 | 0 | 5.8592 |
| North ramp 20 | 0.7163 | 4.8791 | 1.2026 | 6.0817 |
| North chain anchor 47.08 | 3.2427 | 2.2166 | 4.6500 | 6.8666 |
| North crest 112 | 8.5 | 1.2518 | 7.2482 | 8.5 |
| North tower 134.58 | 8.5 | 1.8984 | 6.6016 | 8.5 |
| Bascule centre 175.99 | 8.5 | 0.2061 | 8.2939 | 8.5 |
| South tower 217.40 | 8.5 | 1.9718 | 6.5282 | 8.5 |
| South crest 266.51 | 8.5 | -0.0203 | 8.5203 | 8.5 |
| South chain anchor 304.90 | 6.1887 | 1.5428 | 6.2994 | 7.8422 |
| South ramp 358.51 | 0.7163 | 5.7356 | 0.5493 | 6.2849 |
| South foot 378.51 | 0 | 6.0810 | 0 | 6.0810 |

Numeric evidence: `tmp/top-cities/shots/tower-bridge/approaches-{cityscape,world}/probes.json`. Endpoint views from both 23° and 203° are in the corresponding `approaches-*-clear/` directories and combined into `approach-mode-sheet-clear.jpg`; low-angle first captures were obscured by tower roofs and were replaced by clear elevated join views. Standard pavement has no step or gap at the profile feet; generic bridge does not double the landmark deck in the inspected app views. A separate source test samples every mapped alignment station in both headings and rejects the crossing heading.

The server's `/osm-lanes` responds 503 locally: HD lane paint and lateral fitting could not be tested. The usual local account CORS/entitlement errors appear in capture reports; no model load or geometry error occurred. No online deployment, access-gate or shared runtime-source changes. Generated app bundles were restored after local QA and are not part of this delivery.
HD paint/provider lateral fitting, vehicle/route playback, mode/failure/reanchor lifecycle and hardware performance remain unverified until explicitly evidenced. A ready catalog record certifies the export, not terrain rollout or those runtime cases.
