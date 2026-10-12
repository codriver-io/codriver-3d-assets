# 875 North Michigan (John Hancock Center), Chicago

Original, texture-free procedural model of the 1969 SOM tower at **875 North Michigan Avenue**, Chicago, by Bruce Graham and Fazlur Rahman Khan. Stable ID `john-hancock-center`; source in `src/peregrine/landmarks/top-cities/john-hancock-center/`. Its recognizable features are the straight-sided tapered black prism, five full-height tiers of giant X-bracing on all four faces, bronze glazing behind black aluminium spandrels, and two tall roof antennas. Both LODs retain those features.

## Sources and geographic frame

- [SOM design record](https://www.som.com/projects/875-north-michigan-avenue-formerly-john-hancock-center/): tapered mixed-use tower and collaboration between Graham and Khan. The official search-index extract was accessible; direct page fetching returned HTTP 403. No website mesh or imagery is used.
- [CTBUH / The Skyscraper Center](https://www.skyscrapercenter.com/building/875-north-michigan-avenue/345), checked 2026-10-12: 343.7 m architectural height, 456.9 m to tip, 321.3 m highest occupied level, 100 above-ground floors and completion in 1969.
- Lead dossier `tmp/top-cities/john-hancock-center/{osm.txt,osm.json,facts.txt,refs-sheet.jpg}`: mapped outline, parts, roof house and antenna centres; no additional Overpass query was needed.
- [OSM main outline 31064573](https://www.openstreetmap.org/way/31064573) and parts listed below, © OpenStreetMap contributors, ODbL 1.0.
- [Chris Rycroft, “Chicago in 2022 John Hancock Center (52054925135)”](https://commons.wikimedia.org/wiki/File:Chicago_in_2022_John_Hancock_Center_(52054925135).jpg), CC BY 2.0: the elevation, five X tiers, bronze glazing, vertical columns, roof and masts. Downloaded by the lead to ignored `refs/2.jpg`.
- [Balthazar Korab, “John Hancock Center, Chicago, Illinois. Exterior. Night view (1974)”](https://commons.wikimedia.org/wiki/File:John_Hancock_Center,_Chicago,_Illinois._Exterior._Night_view_(1974).jpg), public domain: warm individual office lights against a dark tower. Ignored `refs/1.jpg`. This historic image is not evidence for today's lighting programme.

The dossier sheet's remaining photos show mostly the surrounding city or views taken **from** the tower; they were inspected for context but not used to infer its detailed form. No photos, textures, scans or external meshes are committed or embedded in the GLBs.

Real metres, **+X east / +Y up / +Z south**, origin `[-87.62309465, 41.8988181]`, near the geometric centre of the mapped base. `y=0` is rigid local ground grade. Latitude stretch, sea-level height and DEM datum are host responsibilities. Rotation **+0.0195 rad about Y** is baked into every vertex: local +X points east and slightly north. The west Michigan Avenue frontage faces bearing 268.88°. Do not rotate the GLB again.

Mapped orientation uses the north-west control point `[-87.6235966,41.8990480]` and north-east `[-87.6226038,41.8990608]`; their east-west edge rises north by roughly 1.4 m across 82.3 m. The south-west and south-east controls independently confirm the near-rectangular frame. Base and upper dimensions are horizontal fits, independent of structural height.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Architectural roof | 343.7 m | Sourced, CTBUH |
| Antenna tip | 456.9 m, both masts | Highest tip sourced, CTBUH; equal tips simplified |
| Above-ground floors | 100 near window rows | Sourced count; facade distribution estimated |
| Base curtain-wall rectangle | 82.3 × 52.8 m | Mapped OSM main outline |
| Top rectangle | 48.9 × 31.0 m | Mapped OSM core part 232905283; taper straight to y=337 |
| Upper mechanical enclosure | 337–343.7 m | OSM heights and photos; simplified opaque cap |
| X tiers | Five: y=8 / 73.8 / 139.6 / 205.4 / 271.2 / 337 m | Count observed; equal spacing estimated |
| Diagonal width / depth | 1.25 / 1.1 m | Estimated |
| Primary corner columns | 1.55 × 1.4 m | Estimated |
| Masts | 31.3 m separation; four tapered sections from y=346.7 | Mapped centres; radii/equipment estimated |
| Near facade bays | 26 broad / 16 narrow, 100 rows | Estimated, simplified photographic rhythm |
| Far facade bays | 9 broad / 6 narrow, 46 rows | Coarse separate window quads, normally <6 m tall |
| Entrance roofs | North 13.8 × 5.1 m; south 26 × 4.9 m; west 3.2 × 30.5 m | Mapped roof rectangles, heights estimated |
| Rigid terrain pad radius | 57 m | Authored placement handoff; terrain untested |

## Geometry and materials

Each face is partitioned into spandrel bands, narrow mullions and individual glass or glow quads. There is **no full steel face behind the window grid**: adjacent panels meet without layered glass/steel faces. Braces and columns sit proud of the glass and are merged into two structural materials with the generated depth order. The largest façade model is about 1.94 MiB, preserving 100 window rows rather than reducing the tower to vertical stripes.

Four continuous tapered facades run to y=337; a plain mechanical enclosure continues to the architectural roof. A closed roof plane supports two roof houses; the masts start exactly at their tops. Their four tapered segments are contiguous. Near adds small antenna equipment boxes; far drops those boxes and uses five-sided mast sections. Forty diagonal members meet named tapered corner columns; posts reach local grade. Three western lobby posts touch the underside of the canopy. Ground cap vertices are flattened to y=0 without baking terrain or changing the tower height.

| Material | Light | Dark | Use |
| --- | --- | --- | --- |
| skin | #373630 | #171e24 | Black aluminium spandrels and fine mullions |
| glass | #4d4c43 | #202a30 | Subdued bronze glass |
| glow | #45463f | #a28b60 | Deterministically scattered warm night office panes |
| structure | #282a29 | #262e34 | Giant X-braces |
| columns | #292b2a | #262e34 | Primary verticals and entrance roofs/posts |
| roof | #323430 | #202930 | Roof deck and antenna houses |
| antenna | #a2a4a0 | #606e79 | Metal masts and equipment |

Seven merged draws per LOD; no textures, bridge attachment attributes, decoder extensions or per-window draws. Night windows use the shared unshaded `glow` material convention. Far retains the same X geometry, primary columns, roof, entrances and maximum bounds as near; its coarse grid is 19.8% of near's total triangle count.

## Provider ownership and approximations

Owned provider IDs: **31064573, 232905283, 232905278, 232905280, 232906397, 232914185, 1282265474, 279951771, 279951772, 1282265436, 1282265437, 1282293649**. These cover the main tower, all four tapered parts, inner core, roof house, both antennas and the three attached entrance roofs. Rings retain the exact mapped coordinates. Exterior steel projects up to about 1.4 m beyond the curtain-wall outline; the test permits 1.5 m for that exoskeleton.

The adjacent parking tower (232935981 / 1282265459), guards, neighbouring hotels and Water Tower Place are **not modelled or masked**. The sunken plaza, basement, interiors, detailed 360 Chicago observation fittings, lettered signs, detailed roof plant and façade panel subdivision are omitted. X tiers and primary column counts are visually simplified; antennas are solid tapered poles with simplified equipment, not a reproduction of every lattice member. The historical floodlit crown in Korab's photo is not reproduced as a claim about current night lighting. These are model scope/accuracy limitations; no known floating members, material cycle, inverted facade or budget violation remains.

## Export costs and verification

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| `near` | 36,610 | 7 | 1,990,040 | 1943.4 |
| `far` | 7,234 | 7 | 404,844 | 395.4 |

Budgets: near ≤60k / 14 / 2.5 MB; far ≤12k / 8 / 500 KB. Costs are actual exported default-scene metrics, not hardware timings.

Commands run:

```sh
pnpm build:top-cities-landmarks john-hancock-center --no-check
node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/john-hancock-center/john-hancock-center.test.js
node scripts/asset-catalog.mjs
node scripts/landmark-depth-layers.mjs --ids john-hancock-center
node scripts/landmark-depth-layers.mjs --ids john-hancock-center --check
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids john-hancock-center --out tmp/top-cities/john-hancock-center/metrics.json
```

The six landmark-specific tests pass in about 0.25 s. They measure architectural roof/tip heights, both mast bases/tips, facade widths by outside-in raycasts at three heights, both LOD bounds, the actual cap centres of all forty X members against their named corner-column convex volumes (excluding braces, with a deliberately shortened free-end negative case), separate window row sizes and outward winding, vertex containment in the mapped rings plus projecting steel allowance, ownership exclusions, source/GLB round-trip costs/bounds, column footings, canopy/post contact, and mast roof-house contact. Generated depth-table check passes with **zero dropped cycle edges**. Deterministic metrics report **no findings**: no layered/coplanar issue, back-face sweep failure, unsupported-member candidate or lost window rhythm.

Both shared registry runs passed all John Hancock assertions; the final combined run reports 469/471 passing (all six own tests plus all three John Hancock registry checks pass); unrelated failures were High Museum's 76,308 near triangles and Nashville's temporary ready/spec mismatch. Whole-catalog validation was retried and is blocked by another builder's missing `docs/3d-top-cities-att-building-nashville.md`; no shared record was altered.

### Visual evidence actually inspected

All evidence is local ignored output under `tmp/top-cities/shots/john-hancock-center/`:

- `john-hancock-center-final-comparison.jpg`: final exported **near/light, far/light, near/dark, far/dark** sheets beside Rycroft's facade and Korab's night photos, inspected after the final export.
- `john-hancock-center-glb-{near,far}-{light,dark}-sheet.jpg`: eight views each, in order **overview, west facade, opposite back, roof/antennas, street level, X/window close detail, entrance, overhead plan**.
- `john-hancock-center-procedural-near-light-sheet.jpg`: source overview, facade, roof and detail compared with the same exported views; round-trip also measured in tests.

Changes driven by inspection/checks: initial duplicated window-border quads were consolidated to bring near under the byte budget; a roof box sharing the cap side faces became a single closed deck plane; north/south/west canopies were fitted to their exact mapped rectangles; an overhead camera below the roof was lifted above the whole model; a periodic lighting pattern producing diagonal stripes became a mixed integer hash; corner columns were extended to grade; far increased from 34 to 46 rows with fewer bays so window height stays below six metres and QA window-rhythm findings disappear. Final comparison preserves the tapered prism, five X tiers, twin antennas and separate window grid on the opposite faces. The model is intentionally dark and its night pattern is estimated, rather than matched to the historic photo's particular occupancy.

## Placement handoff

- **Cityscape: not tested yet, integration is checked separately.**
- **Full 3D world: not tested yet, integration is checked separately.**

`SPEC.ready=true` means exported/catalogued asset readiness only. The lead must rebuild the runtime, regenerate the full depth table, inspect shared unlit/vertex-shaded rendering and provider replacement, and capture unobstructed app shots in both modes; independent review remains required. The rigid base and pad are authored, but DEM footing residuals, pad lattice coverage, neighbouring roads, mode/terrain arrival, LOD and origin transitions, late/failing loads, and real Tesla performance have not been verified here. No server, app bundle, staging deployment, git write or shared source edit was performed; only the permitted generated depth table was regenerated.
