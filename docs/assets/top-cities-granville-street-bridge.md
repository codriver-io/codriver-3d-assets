# Granville Street Bridge, Vancouver

Original procedural geometry of the third Granville Street Bridge (1954), with the 2025 west-side Granville Connector, across False Creek and above Granville Island. The primary Granville crossing is authored; branching Howe/Seymour/Fir/Hemlock ramps remain provider-owned, rather than being masked by the asset. Source is `src/peregrine/landmarks/top-cities/granville-street-bridge/`.

## Sources and dimensions

[SEABC / IABSE Notable Structures (2017), printed page 7](https://www.seabc.ca/wordpress/files/notable_structures/Vancouver_Notable_Structures_IABSE_SEABC_2017.pdf) establishes the seven steel deck-truss spans, their 29–121 m range, and 65 south / 38 north concrete girder spans including branch ramps. [City of Vancouver](https://vancouver.ca/streets-transportation/granville-bridge.aspx) identifies the maintained 1954 crossing; its [July 2025 Connector announcement](https://vancouver.ca/news-calendar/granville-connector-opens-july-2025.aspx) establishes the present west-side walking/cycling arrangement and removed north loops. [Wikipedia](https://en.wikipedia.org/wiki/Granville_Street_Bridge) reports 1,171 m overall length and 27.4 m clearance below, rather than roadway elevation.

| Parameter | Authored value | Evidence |
| --- | --- | --- |
| Steel spans | 7, 29–121 m | SEABC, sourced count/range |
| Individual spans south → north | 29 / 76 / 91 / 76 / 121 / 91 / 29 m | Estimated from photographs and mapped extent, not a structural survey |
| Steel support stations | 498 / 527 / 603 / 694 / 770 / 891 / 982 / 1011 m | Estimated registration in mapped approach-inclusive corridor |
| Primary fitting corridor | 1515.31 m (raw mapping 1515.95 m) | OSM primary roadway and continued Granville streets; differs from published bridge-only length |
| Deck envelope | 27.9 m, lateral −17.9 to +10 m | Conservative measured OSM envelope; mapped central crossing roughly 28–31 m |
| Fallback vehicle surface | 19.2 m, six lanes | 2025 connector arrangement; individual lane widths estimated |
| West Connector | 6.5 m usable width | Estimated photographic/map proportions |
| Deck elevation | 35 m above authored sea/flat grade | Estimated 27.4 m published clearance + truss/slab depth; not a surveyed datum |
| Truss depth | 12 m at supports, 6.8 m midspan | Photograph estimates; minimum main-span underside approximately 27.8 m with bottom chord |
| Main steel span | 121 m | Largest published span; position estimated |
| Maximum height | 42.4 m including lamps | Authored geometry |

Reference-only views were inspected: `tmp/top-cities/granville-street-bridge/refs/2018.jpg` (Wpcpey, CC BY-SA 4.0 per Commons licence section), `side.jpg` (Usgnus, CC BY-SA 3.0), and `engineering.jpg` (SEABC page containing Associated Engineering and Vancouver Archives/Lew Parry photographs). Two extra Commons photos were fetched because the supplied dossier depicts views FROM this bridge and Burrard Bridge, and its facts page was a disambiguation. Photographs and the PDF remain ignored local reference material; none is shipped. Full links/credits are in the catalog.

## Model and surface contract

Origin `[-123.133049,49.272551]`, local metric east/up/south. Station increases south → downtown, positive lateral points southeast. Two corner-cutting passes remove the mapped south lane-merge kink, with endpoints fixed; nearly collinear control points are then pruned within 2.5 cm. OSM snapshot 2026-10-12 retained in the landmark's mapped helper; attribution © OpenStreetMap contributors, ODbL 1.0. `FOOTPRINTS` follows the authored primary corridor, including fitting streets; the larger mapped outline also covers omitted branch ramps and is retained as research data rather than used as a blanket mask. No bridge building extrusions were found in the dossier.

Seven paired haunched deck trusses preserve open panels, variable bottom chords, transverse beams, near bottom bracing, paired channels and gussets. Concrete capsule-ended wall piers have fixed feet and interpolated shaft attachment weights. Repeated concrete-girder approach bays, west Connector divider, rail posts, horizontal rails, lamps and six fallback lanes remain texture-free. Material palette uses muted grey-green steel, weathered grey concrete and dark pavement. Far keeps all seven open trusses and piers, with fewer panels/posts/lamps and no lane paint.

Flat Cityscape ramps are 498 m south and 504.31 m north, smooth profiles reaching the 35 m deck: peak grade 10.54% / 10.40%. This extends along ordinary approach streets as a flat-map compromise. The steel spans retain their authored width; `fittedLateral` is identity outside the outer 90 m. The landings taper in the same station/lateral frame as the accepted road surface. `terrainPolicy: absolute-deck` keeps the central structure rigid, adapts support feet to shared DEM and blends approaches without corridor flattening. Ground and Mercator latitude scaling are runtime operations. The existing registry bridge layer owns loading, LODs, road replacement and navigation; no shared implementation changes.

## Validation evidence

Both exported GLBs were loaded and inspected in near/far, light/dark: `tmp/top-cities/shots/granville-street-bridge/granville-street-bridge-glb-{near,far}-{light,dark}-sheet.jpg`. Near-light includes overview, front (facade), back, above (roof), detail, underside and both deck directions; the other sheets include overview/front/detail/underside or roof. `export-vs-references.jpg` places the actual bridge photographs alongside near/far light/dark exports. Open haunches and pier contacts survive far; colours are subdued against the photographs. The local grid in distant inspection shots has moiré; it is inspection-only.

The initial checks found the mapped lane-merge kink and a lamp base intersecting the cycle pavement. The centreline was smoothed, redundant collinear samples removed, and lamp bases attached to the walking/Connector surfaces. Final deterministic QA reports no issues, no layered/coplanar faces, no unsupported endpoint candidates, and 0% backface hits. Named endpoint tests exclude each member and inspect its separate support geometry in both LODs; a shortened diagonal proves the test detects a free end. Pavement raycasts agree with the shared profile within 12 cm, including curved approaches. GLB round trips retain normals and fixed/deck/interpolated attachment weights.

| Export | Triangles | Mesh draws | Bytes / KiB |
| --- | ---: | ---: | ---: |
| Near | 68,902 | 21 | 3,278,512 / 3,202 |
| Far | 27,504 | 4 | 1,096,148 / 1,070 |

Focused command `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/granville-street-bridge/granville-street-bridge.test.js`: 473 passed, 0 failed; own tests finish in approximately 1.6 seconds. `node scripts/asset-catalog.mjs` / `pnpm assets:check`: pass, 286 records and 542 GLB variants. `pnpm assets:preview`: local catalog built under ignored `tmp/champlain-preview`. Depth table generation and `--check`: pass with zero cycle edges dropped. Lead must regenerate the shared depth table after integration; it is intentionally excluded from this branch's commit. Renderer bundle built for app QA and excluded from commit.

Cityscape app shots were inspected under `tmp/top-cities/granville-street-bridge/app-cityscape/`: `granville-street-bridge-{far,near,street}.png` and `spot-{south,north}-{northbound,southbound}-street.png`. The bridge is active in both LODs; the visible primary pavement is continuous, and its generic provider deck is replaced. All 43 raw mapped vertices, 71 smoothed controls and 9 named deck/approach stations were probed in both directions (246 height queries); they match the accepted profile, with `heightAt` null at lateral 40 m off the bridge. Evidence is `height-probes.json`. The captured provider is standard Protomaps roads; HD lanes are not tested.

Cityscape captures used 3274. The seven corresponding world screenshots in `tmp/top-cities/granville-street-bridge/app-world/` were inspected (far, near, street, south/north × northbound/southbound); the renderer's unlit vertex shading remains visible, central truss/deck stays rigid, support feet meet terrain, approaches remain connected, and no corridor flattening is introduced. `height-probes.json` records all 123 probe coordinates, both directions, DEM values and accepted deck heights; no nulls on the mapped roadway, identical directions, maximum accepted deck error below 1e-12 m, null off the bridge. The synthetic QA grant comes from the existing app-shot harness; no product gates were changed.

`heightAt` returns a **relative road offset in metres**, not Mercator world units or absolute altitude. In world mode, add the query DEM (world ground / latitude stretch) once to compare to the absolute accepted deck. Both direction values were identical at every probe:

| Station / position | Cityscape `heightAt`, either direction | World `heightAt`, either direction | Query DEM m | Accepted world deck m |
| --- | ---: | ---: | ---: | ---: |
| 0, south street join | 0.000 | −0.008 | 25.650 | 25.643 |
| 145, south approach shot | 7.174 | 8.774 | 18.787 | 27.561 |
| 498, first steel pier | 35.000 | 27.514 | 7.486 | 35.000 |
| 770, south channel pier | 35.000 | 35.000 | 0.000 | 35.000 |
| 830.5, main span centre | 35.000 | 35.000 | 0.000 | 35.000 |
| 891, north channel pier | 35.000 | 30.163 | 4.837 | 35.000 |
| 1011, last steel pier | 35.000 | 22.394 | 12.606 | 35.000 |
| 1370.31, north approach shot | 7.016 | 1.787 | 27.256 | 29.043 |
| 1515.31, north street join | 0.000 | 0.033 | 27.516 | 27.549 |

Per-footing checks compare the **actual fitted exported near GLB** bottom vertices to the resident DEM, using immutable authoring coordinates to select each base. Twelve sampled base vertices per pier; maximum residual below 0.000001 m at every pier. This validates local runtime contact, not DEM survey accuracy:

| Pier station m | DEM minimum / maximum m | Max base residual m |
| --- | ---: | ---: |
| 498 | 7.317 / 7.790 | <0.000001 |
| 527 | 7.705 / 8.230 | <0.000001 |
| 603 | 6.218 / 7.184 | <0.000001 |
| 694 | 5.719 / 7.021 | <0.000001 |
| 770 | 0.000 / 0.091 | <0.000001 |
| 891 | 4.177 / 5.325 | <0.000001 |
| 982 | 12.235 / 12.473 | <0.000001 |
| 1011 | 12.534 / 12.662 | <0.000001 |

The existing surface fit uses centreline heights across the width. Both approach directions were inspected, but a per-lane HD/crossfall guarantee is not established; sloped quay bank fit remains a shared limitation. Branch ramps retain generic provider geometry and were not authored or independently fitted. Account/CORS/API messages in the unauthenticated local QA harness did not prevent tile, GLB or terrain loading. Both local server processes were stopped after captures. Lifecycle toggles, tracked car/route driving, paint on/off and Tesla hardware are not tested. Independent visual review remains with the batch lead.

## Review fix: close landing evidence (b6b, 2026-10-12)

The independent review accepted the open truss silhouette and pier rhythm but
could not inspect the outer street joins. Exact endpoint captures then exposed a
square 27.9 m slab, dark-to-light pavement step and the divided south street.
The final model tapers only the outer 90 m at each bank, leaving all seven steel
spans unchanged. The south surface splits into the mapped northbound and
southbound ribbons (ways 341691649/341691651, with southbound continuation
74231041); downtown tapers to the single two-way secondary street 975327011.
These additional exact southbound way ids are recorded in `OSM_WAYS`.

Both LODs taper slab, pavement, Connector, walk and divider together. Raised
surface offsets and the divider drop toward street grade; lamps stay outside
the taper and rails end on named posts/slabs 20 m inside the landings. Below-grade
thin toe undersides are omitted and the approach girders stop under the supported
deck, removing visible underground end bars in flat Cityscape. No main span,
pier registration, shared renderer module or product gate changed.

The landmark-local runtime layer matches the standard road shader's current
zoom-dependent widths: trunk class 0 at the split south end and secondary class
2 downtown. Pavement vertex colours blend into the live road palette. The same
landing edges feed navigation and repeated immutable-source GLB fitting; HD
keeps the existing measured-edge path, but HD capture is not part of this run.
Raycast regression tests check both carriageway centres, absent broad shoulders,
the open southern separator, repeated zoom fitting and the rigid steel deck.
Near paint is 12 cm proud of vehicle pavement and 12 cm proud of Connector
pavement; far paint remains dropped.

Final exported near/far light/dark sheets were inspected under
`tmp/top-cities/shots/granville-street-bridge/final-{near,far,near-dark,far-dark}/`.
They preserve the accepted open haunches and pier contacts. Final deterministic
QA (`final-metrics.json`) reports zero issues, zero layered/coplanar faces, zero
unsupported member-end candidates and zero back-face hits. Depth generation and
`--check` pass with no cycle edges dropped. Original → final costs:

| LOD | Triangles | Draws | KiB |
| --- | ---: | ---: | ---: |
| Near | 65,478 → 68,902 | 21 → 21 | 3,181 → 3,202 |
| Far | 24,648 → 27,504 | 4 → 4 | 1,025 → 1,070 |

The required named sheet is
`tmp/top-cities/shots/granville-street-bridge/final-approaches-sheet.jpg`.
Its eight panels show station 0 (`[-123.138387,49.2666841]`) and station
1515.31 (`[-123.126185,49.2771504]`) in both travel directions, in both modes.
Full unobstructed landing images are retained in `final-city/` and `final-world/`
as `spot-{south,north}-{northbound,southbound}-street.png`.
The narrow toes meet the live pavement without a broad square slab or surface
height step, and the southern provider separator stays visible.

Each mode's `height-probes.json` records all 43 raw mapped vertices, 71 smoothed
controls and 9 named stations in both directions (246 queries), no on-road nulls,
and null off the bridge. Accepted surface error is below 1e-12 m; Full 3D world
uses the resident Terrarium DEM. The final fitted footing probe residual stays
below 0.14 m. Rebuilt bundle used for captures is excluded from the commit, as is
the regenerated shared depth table; the lead must regenerate depth ranks after
cherry-picking. Asset catalog/check and local preview pass; focused landmark plus
registry tests pass (473 total). Servers are stopped by their recorded PIDs.
Independent visual re-review is still pending. Existing limits remain: HD lanes,
per-lane crossfall, branch-ramp modeling, tracked route/car motion, lifecycle
stress and Tesla hardware have not been tested in this fix.
