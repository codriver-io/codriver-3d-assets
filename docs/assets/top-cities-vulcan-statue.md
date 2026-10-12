# Vulcan statue and tower

Original procedural model of Giuseppe Moretti’s 1904 cast-iron Vulcan in its present restored setting on the 1939 sandstone pedestal, Vulcan Park & Museum, 1701 Valley View Drive, Birmingham, Alabama. Model origin is `[-86.79550087777778, 33.491722788888886]`, the mean of the mapped shaft vertices. Coordinates are metric east/up/south, with local grade y=0 and rotation baked once into geometry. No elevation, hill, photo, texture, scan or third-party mesh is included.

## Sources and dimensions

| Element | Model | Source/status |
| --- | --- | --- |
| Figure toe to spear point | 56 ft / 17.0688 m | [Official park FAQ](https://visitvulcan.com/about/faq/) |
| Native sandstone pedestal | 124 ft / 37.7952 m | Official FAQ; Wikipedia says 123 ft and OSM part says 37 m; official height selected |
| Total height | 180 ft / 54.864 m | Official FAQ |
| Shaft radius | 3.1 m low, 2.65 m at cap | Mapped octagonal upper-shaft outline plus photo-estimated taper |
| Balcony floor / rail top | 30.75 / 32.0 m | Estimated from reference photos |
| Balcony radius | 4.45 m | Estimated; supported eight-sided projection |
| Elevator | 39 m high, 3.04 m wide, 2.4 m deep | Height estimated; location and envelope mapped |
| Elevator centre | 8.34 m south of tower | Dossier OSM way 1265586546 relative to shaft part 1265583010 |
| Figure body height without spear | about 12.8 m | Estimated anatomical proportions from front/back/low-angle references |
| Orientation | 1.8 degrees east of north | Shaft edge control points `[-86.7954864,33.4917506]` and `[-86.7955113,33.4917514]`; elevator displacement corroborates near north/south axis |

[Wikipedia](https://en.wikipedia.org/wiki/Vulcan_statue) establishes identity, cast-iron construction and history. Dossier OSM ways [233561533](https://www.openstreetmap.org/way/233561533), [1265583010](https://www.openstreetmap.org/way/1265583010) and [1265586546](https://www.openstreetmap.org/way/1265586546) are the exact three replaced provider extrusions. A fourth narrow authored ownership ring covers the elevated balcony/catwalk crossing the concave south notch of the main outline; it claims no additional OSM building. Museum 239083198 and ticket booth 1545248088 remain provider-owned.

Reference photographs inspected in `tmp/top-cities/vulcan-statue/refs-sheet.jpg`: Andre Natta’s “Vulcan statue.jpg” (CC BY 2.0), Carvizca’s “Vulcan In 2011.JPG” (CC BY-SA 3.0), Greg Willis’s “Towers of Vulcan Park (5333308069).jpg” and “Vulcan Park, Birmingham (Alabama).jpg” (CC BY-SA 2.0), David Gunnells/Earthsound’s “Vulcan statue Birmingham AL 2008 snow.jpg” (CC BY-SA 3.0), and Conmat13’s “Vulcan Statue at Dusk.jpg” (CC BY-SA 4.0). Individual Commons title/author/license links are recorded in the catalog; all photos stay in ignored scratch.

## Authoring decisions and approximations

The sculpture is built from original variable-section anatomical lofts, shaped feet, muscular torso, bent hammer arm, open leg/arm gaps, beard, nose, brow and coarse hair curls. A broad irregular apron, diagonal strap, pointed spear blade, hammer, anvil horn and support stump distinguish the smith from a generic figure. Far keeps these volumes and the negative space; it reduces section counts and omits finger/hair detail. The facial likeness and drapery are simplified rather than a reproduction of the sculptor’s surface detail.

The octagonal pedestal has subtle modeled course changes in near and plain flat facets in far. Sandstone roughness is approximated without textures, and individual irregular rubble blocks are omitted. The cap and observation slab are separate stepped volumes; black metal guardrails and eight brackets support the balcony. The elevator is separate, glazed between concrete piers, with a connected deck and railing at balcony level. Glazing is split at crossbeams to avoid interpenetrating layers. The base is a small structural footing rather than a landscape plaza. Interiors, museum, landscaped cascades, trees, paths and visitor signs are omitted.

Five merged materials in both LODs: muted sandstone `stone`, pale cap/elevator `trim`, dark cast-iron and metalwork `iron`, blue-grey `glass`, and dark `recess`. Night uses a dim stone palette and slightly raised iron to preserve the floodlit silhouette; no undocumented self-lit surface is introduced.

## Verification and costs

Near: **15,596 triangles / 5 draws / 490 KB**. Far: **2,312 triangles / 5 draws / 94 KB**. Measured exported default-scene counts, comfortably below 60k/14/2.5MB near and 12k/8/500KB far. Far retains the same overall envelope. No removable bridgeLift attributes, texture dependencies, decoder or compression extensions.

First procedural sheet judged: `tmp/top-cities/shots/vulcan-statue/vulcan-statue-procedural-near-light-sheet.jpg`, seven views: overview, facade, back, roof, street, statue detail and balcony. It exposed bracket ends below the balcony soffit, smoothed octagonal corners, over-emphasized chest relief and reversed front-facing arm pose; brackets were extended into the deck, masonry normals made flat, chest relief reduced and sculpture mirrored into its present north-facing pose.

Final exported GLBs are inspected in near/far and light/dark against the dossier photographs; the contact sheet is `tmp/top-cities/shots/vulcan-statue/exported-reference-sheet.jpg`. The source’s explicit named-support tests cover every rail, picket, bracket, walkway, tool handle and modeled member end (156 near / 88 far terminal contacts) using actual triangle distance/inside-solid rays; a deliberately shortened rail demonstrates failure. Geometry rays pin the human gaps, torso, raised hand, tower/balcony proportions and detached elevator. Tests also pin grade, footprint containment below the sculpture, source-to-export bounds and measured costs.

Depth ordering: zero material cycles after splitting elevator glazing at crossbeams. The focused conformance plus landmark run passed all 397 tests; the catalog validated 266 records / 472 GLB variants, and the per-asset depth check passed. Deterministic QA reports no issues: zero layered-face area, zero coplanar pairs, 1.5% back-face sweep hits, and no unsupported member-end candidates. The final exported comparison sheet was opened and judged: tower/elevator spacing, north-facing raised-arm silhouette, anvil/apron volumes and both LOD palettes remain consistent with the photographs, with the documented simplified anatomy and untextured stone.

## Placement handoff

Cityscape: **not tested yet**. Full 3D world: **not tested yet; integration is checked separately**. The Red Mountain site has a bounded median terrain pad over tower, elevator and connector rings, with 12 m feathering and reference samples from both footing outlines; this avoids the lowest-sample disc policy. The reusable structure remains rigid on local y=0. The lead must capture unobstructed app shots in both modes, verify tower and elevator footing residuals (target ±1.5 m), pad coverage of resident DEM lattice nodes and edge/approach continuity, provider replacement and late/refined terrain. Export inspection does not establish hilltop integration or hardware performance.

## Independent-review refinement — 2026-10-12

Uniform machined sandstone: near tower courses now alternate six restrained heights, with connected facet offsets up to 35 mm and uneven joints up to 18 mm. The small face-normal changes produce subdued facet-light variation within the existing stone batch; no texture, disconnected overlay, or extra draw. Octagonal taper, statue, contacts, foundation and far silhouette remain unchanged.

Opened and judged `tmp/top-cities/shots/vulcan-statue/review-fix/vulcan-statue-glb-near-light-sheet.jpg` and the matching `-far-light-sheet.jpg` against the supplied dossier/reference and reviewer findings. This was one look-fix iteration. All 437 combined dedicated and top-cities conformance tests pass; catalog validation passes (266 entries / 488 GLB variants), and the five-asset depth generation/check passes with zero dropped cycle edges.

| LOD | Before triangles / draws / bytes | After triangles / draws / bytes |
| --- | --- | --- |
| near | 15,628 / 5 / 504,236 | 15,596 / 5 / 501,740 |
| far | 2,312 / 5 / 95,988 | 2,312 / 5 / 95,988 |

Both remain within building budgets. The reviewer found the pictured footing/provider replacement acceptable for Vulcan, Griffith and Notre-Dame; this worker made no terrain or footprint changes and captured no new app shots.

Post-refinement deterministic QA: **ok**, no reported issues; `tmp/top-cities/freedom-tower-miami/review-fix-qa.json`. The ignored local catalog and inspector preview rebuilt successfully with `pnpm assets:preview`.
