# High Museum of Art — Atlanta

Original procedural campus at 1280 Peachtree Street NE: Richard Meier's 1983 Stent Family Wing and Renzo Piano's 2005 Wieland Pavilion, Anne Cox Chambers Wing and Bunzl administration building. Original geometry, no external mesh or textures. Temporary exhibition banners and artworks are omitted.

## Sources and frame

The [museum's official history](https://high.org/history-of-the-high-museum/) establishes the 1983/2005 phases, white enamel and white aluminum cladding, and 1,000 north-light scoops. The [Renzo Piano foundation archive](https://www.fondazionerenzopiano.org/en/project/high-museum-of-art-expansion/) confirms the expansion identity. Neither source supplied a measured exterior height; every modeled height is an estimate.

Dossier `tmp/top-cities/high-museum-of-art/{osm.txt,osm.json,facts.txt,refs-sheet.jpg}` supplied mapped geometry and photo credits. Used photos 2 (panel detail only), 4, 5 and 6; ignored the painting in photo 1 and banner close-up in photo 3. Two additional official references: entrance DSC08446 and ExteriorCampus-1, linked in the catalog, retained only under ignored `tmp/`. Official photographs remain copyright restricted and are reference-only; Commons title/author/license credits are recorded in the catalog.

Origin `[-84.38557,33.79005]`; +X east, +Y up, +Z south. Museum-frame u points NE, v SE. Rotation is baked into every exported vertex: 29° from east, long-axis bearing 61° from north. Control points on Wieland's north edge are u/v approximately `[-73.7,-34.5]` and `[-43.3,-34.6]`, derived from the actual geographic vertices in `footprint.js`. Level y=0 is rigid local grade; no elevation or latitude scaling is baked in.

| Dimension | Model | Evidence |
| --- | --- | --- |
| Building peak | 28 m | Photo estimate, not published |
| Meier west tier / upper curved atrium / entrance drum | 23 / 26 / 12 m | Photo estimates |
| Piano gallery roofs / scoop top | 22 / about 23.7 m | Photo estimates |
| Bunzl / restaurant / auditorium roof | 18 / 6 / 6 m | Simplified photo estimates |
| Upper quarter-circle radius | 20 m | Photo estimate inside the mapped outer curve |
| Campus horizontal extent | about 112 × 180 m east/south | Mapped OSM envelope |
| Exterior ramp | about 44 m × 2.8 m; rises 5.8 m | Photo estimate, stylized connection rather than surveyed accessibility grade |
| Actual light scoops | 1,000 | Museum official history; reduced representative grids modeled |

## Geometry and ownership

White porcelain-enamel gallery panels, stepped front bookend, inset quarter-circle glazed atrium and a wider low entrance drum distinguish the Meier phase. Glazing has white divisions rather than one unbroken dark stripe. Piano's rectangular aluminum wings enclose an open piazza; repetitive tilted circular skylight cups open toward geographic north. Lobby windows and stair slots remain distinct cells in far. The restaurant and Bunzl wing complete the mapped museum campus; the neighboring church and Woodruff Arts Center remain provider-owned.

`FOOTPRINTS` includes a bounded authored forecourt-ramp ring (no extra provider way), the campus outline and every modeled building part: 28961738, 1453239398, 1424891402, 1424891388, 1424891448, 1424891449, 1424891450, 1453239397, 1424891413, 1424891412, 1453239394 and 1453239393. The Anne Cox rear strip is covered by its wing shell. Level-zero links are low plinth caps. The elevated glass connector leaves a genuine void below; both ends meet the named Meier/Wieland shells. The long ramp is a solid grounded wedge with continuous solid parapets; its path terminals bear on its foundation.

Panel and window cells tessellate the actual skin; no background wall exists behind them. Near uses fine panel joints, eight-sided scoop lips and a dense roof grid. Far drops white panel joints and reduces the grid and curved facet count while retaining the full outline, roof levels, courtyard and separate window bays. Eight light/dark material keys, seven draws in far. Indexed/welded coplanar vertices keep bytes low without changing the shape. Night recolors walls/glass and lights the lobby panes.

Approximations: reduced skylight count, solid rather than rail-filled ramp parapets, stylized auditorium, simplified gallery interiors and roof mechanics. No sculptures, trees, landscaping, changing banners or surrounding arts-center buildings. This is an external landmark approximation, not a survey or visitor route model.

## Costs and verification

Current exports: near 34,474 triangles / 8 draws / 1,830 KiB; far 7,375 triangles / 7 draws / 315 KiB. Both remain below the building caps of 60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB. Near/far bounds agree exactly.

Initial procedural contact sheet inspected at `tmp/top-cities/shots/high-museum-of-art/high-museum-of-art-procedural-near-light-sheet.jpg`: overview, facade, entrance, rear, roof, detail and Piano views. It showed a heavy upper glazing band and unnecessarily costly joints. Added explicit white atrium divisions, reduced seams and welded duplicate vertices; near fell from 76,308 triangles / 6,069 KiB to the current costs and far from 23,159 / 1,772 KiB.

The first exported sheet revealed that placing the ramp across the low auditorium buried it. Moved it into the clear forecourt at u=-11, from v=60 to v=16.2, and added a narrow owned ramp ring; its upper end meets the Meier wing. Final exported evidence and acceptance results follow below. Deterministic metrics in `tmp/top-cities/high-museum-of-art/metrics.json` currently report no issues: no coplanar/layered conflicts, no unsupported member candidates, no far window-rhythm loss, no back-face hits, no below-grade geometry. Generated depth layers have zero dropped cycle edges.

## Integration gates

Cityscape: **not tested yet; integration is checked separately**. Full 3D world: **not tested yet; integration is checked separately**. No app server or app bundle was started by this builder. The lead must capture unobstructed app views in both modes and independently review likeness, provider replacement and terrain contacts. The real Peachtree lawn slopes; assess campus terrain datum, ramp contact and separate terrace pads before Full 3D world rollout. The current rigid local model and default pad do not establish terrain readiness.

## Final exported visual inspection — 2026-10-12

LOOKED at `tmp/top-cities/shots/high-museum-of-art/export-reference-contact-sheet.jpg`: 28 exported GLB frames (overview, facade, opposite/rear, roof, entrance, close atrium detail and Piano wings), with every view in near/far and light/dark, next to reference photos 5, 6, 7 and 8. The final ramp is visible in the clear forecourt and ends at the Meier wing; both curved tiers, separate glazing bays, roof-scoop fields and open piazza persist in far. White cladding and restrained night walls retain the reference character. The fine roof grid is deliberately coarser in far; window tiers are preserved rather than full-height stripes. No holes, floating ends, visible material collisions or footprint mismatches were observed.

Individual images and four variant sheets are `tmp/top-cities/shots/high-museum-of-art/high-museum-of-art-glb-{near,far}-{light,dark}-{overview,facade,rear,roof,entrance,detail,piano,sheet}.{png,jpg}` (views are PNG, sheets JPG). Original reference sheets and two official images remain ignored scratch, never runtime exports. `SPEC.ready=true` and catalog status ready indicate exported asset readiness; they do not imply either integration mode has passed.

Focused verification results:

- Eight landmark geometry tests pass in under one second; dimensions, stepped curved glazing, scoop rows, open piazza, elevated connector void, named supports with deliberately broken-terminal counterexamples, all-vertex footprint containment, triangle quality and LOD bounds.
- Requested combined command `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/high-museum-of-art/high-museum-of-art.test.js`: all High Museum tests/conformance assertions pass; the shared run exits 1 solely for `fairmont-hotel-vancouver` far GLB at 0.51 MB against the 0.5 MB cap. This is another builder's asset and was not edited or awaited.
- `node scripts/asset-catalog.mjs`: passes, 286 entries / 560 GLB variants at this checkpoint.
- `node scripts/landmark-depth-layers.mjs --ids high-museum-of-art --check`: passes. Regeneration produced no dropped cycle edges.
- Deterministic QA metrics: no issues; near 34,474 triangles / 8 draws / 1,874,184 bytes; far 7,375 / 7 / 322,560 bytes. `tmp/top-cities/high-museum-of-art/{metrics.json,acceptance-results.json,acceptance-tests.txt,asset-catalog.txt,depth-check.txt}` retains the exact results.

No shared source changes were needed beyond the authorized generated depth table. Remaining work belongs to the lead: independent review and real app Cityscape/Full 3D world screenshots, replacement/lifecycle checks and terrain/ramp contacts; photographs and GLB inspection alone do not verify integration.
