# Willis Tower — Chicago

Asset ID `willis-tower`. Original procedural model of SOM’s Willis Tower, formerly Sears Tower, at 233 South Wacker Drive: the 1973 bundled-tube tower with its present broadcast antennas and mapped 2022 Catalog podium. No external mesh, photograph or texture ships in the source or GLBs.

## Sources and dimensions

[SOM](https://www.som.com/projects/willis-tower-formerly-sears-tower/) describes nine 75 ft square tubes and the black aluminium / bronze-tinted glass skin. The [Skydeck teacher guide](https://theskydeck.com/wp-content/uploads/2023/10/The-Hows-Whats-and-Wows-of-Willis-Tower-A-Guide-For-Teachers.pdf.pdf) confirms the northwest/southeast termination at level 50, northeast/southwest at 66, north/east/south at 90, leaving the west and center tubes. The [operator](https://www.willistower.com/about) documents the antennas, Wacker atrium and completed Catalog renovation. The supplied Wikipedia dossier provides 442.3 m roof and approximately 527 m antenna tip; the mapped height tags round these to 442 and 527 m.

| Feature | Authored value | Basis |
| --- | --- | --- |
| Structural tubes | Nine, nominal 22.86 m squares | SOM’s published 75 ft modules |
| Cladding envelope | Approximately 70 × 71 m | OSM building parts; retained without horizontal scaling |
| Northwest / southeast roofs | 200 m | OSM level-50 parts |
| Northeast / southwest roofs | 260 m | OSM level-66 parts |
| North / east / south roofs | 355 m | OSM level-90 parts |
| West + center roof | 442 m | OSM / rounded published 442.3 m |
| Antenna tops | West 527 m, east 520 m | Highest tip sourced; east difference estimated from photos |
| Podium roofs | 5–25 m | Mapped parts |
| Typical facade row / bay | 4 m / approximately 3 m near | Estimated facade rhythm |
| Far panels | 10 m rows / approximately 8 m bays | Coarser independent quads |
| Mechanical belts | 118–130, 254–264, 346–355, 420–442 m | Photo-estimated bands |

The mapped roof parts use 108 levels, while operator material counts 110 stories including mechanical penthouse levels; the model uses the measured roof elevation rather than multiplying a floor count.

## Frame, footprint and ownership

Real metres, east/up/south, local grade `y=0`; origin `[-87.6358, 41.8789]` is the supplied nearby structural anchor, not an absolute terrain datum. Facade orientation is already baked into every mapped vertex. Two control points on the top tube’s north edge are `[-87.6363255, 41.8789853]` and `[-87.6357604, 41.8789934]`: this edge runs about 89° clockwise from north, making the Wacker facade face about 269°. The host must not rotate the model again.

`willis-tower-plan.js` retains the mapped geographic rings. `footprint.js` lists the complete main building envelope (way **380868216**) plus canopy rings outside it; `OSM_WAYS` enumerates the tower parts, antenna parts, corner roof drums, low podium, atrium and owned entrance canopies. Neighboring Fashion Trades Building, Northern Trust, parking garage and streets remain outside ownership. The full podium envelope is represented, including its southern extension and west entrance; no bounding rectangle replaces nearby buildings.

The nine-tube grid is eight OSM polygons: the west and center top tubes share one 442 m part. Shared faces are omitted below the neighboring roof. Mapped boundary wiggles within 12 cm are simplified. Low volumes use their mapped roof heights; the roof of the nested 25 m volume cuts a hole in the lower podium cap. A 100 m pad covers the footprint envelope; terrain and per-entrance slopes still require application verification.

## Geometry and materials

Black metal mullions, muted bronze-grey glass, flat mechanical belts, four circular corner roof plants and two tapered white antenna shafts retain the identifying silhouette. The antenna bases meet the named 442 m roof, and canopies have soffits and posts extending to grade. Windows, mullions and sills are disjoint facade panels with no opaque backing or close overlays. Six merged materials serve both LODs; light/dark palette keys agree. Sparse office windows and white antenna lighting use `glow` / `lamp`; holiday colors are not animated.

Both LODs keep every setback, top tube pair, antenna, roof drum, podium volume and entrance canopy. Far keeps separate rows and bays rather than a full-height stripe or blank slab. The Wacker atrium is faceted and flat-topped rather than an exact curved glass vault. Rooftop garden planting, the Ledge glass boxes, interiors, signage, facade blinds and service machinery are omitted. The low-volume massing and aperture rhythm are modeled; decorative entrances are approximate.

## Export costs

Measured default-scene GLB costs from `pnpm build:top-cities-landmarks willis-tower --no-check`:

| LOD | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| Near | 40,460 | 6 | 2,184,600 | 2,133.4 |
| Far | 7,610 | 6 | 413,544 | 403.9 |

Near is below 60,000 / 14 / 2.5 MB and far below 12,000 / 8 / 500 KB. Far costs 18.8% of near triangles and preserves identical bounds. Hardware performance is unmeasured.

## Verification evidence

Personally inspected the dossier reference sheet and exported GLB comparison at `tmp/top-cities/shots/willis-tower/willis-tower-final-comparison.jpg`: overview, opposite/back, roof, facade detail and entrance in **near/far × light/dark**, plus near street and plan views, beside the contemporary exterior photos. The four variant contact sheets are `willis-tower-glb-{near,far}-{light,dark}-sheet.jpg` in that directory. Procedural overview/roof were also inspected in `willis-tower-procedural-near-light-sheet.jpg`; source/GLB bounds are checked by the shared conformance test.

Changes prompted by inspection and metrics: the initial facade tessellation exceeded size budgets, so common sill fragments were removed and bay counts reduced while keeping individual rows; the first far panels were too wide, so far changed to approximately 8 m bays and 10 m rows; mapped canopy rings were added to replacement ownership, then canopy soffits and grade-reaching posts removed floating entrance edges. Final sheet preserves the asymmetric setback layout and fine near grid; far uses visibly coarser windows.

Focused tests pin all four roof elevations by raycast, both top tubes, antenna tips and named-roof contact with a deliberately floating negative case, outward facades, separate window grids, grade, footprint containment and near/far bounds. The metrics report `tmp/top-cities/willis-tower/metrics.json` reports no issues: zero coplanar/layered material faces, zero back-face hits in 315 near rays, no lost window rhythm. Generated depth layers contain no material cycles.

Cityscape: **not tested yet; integration is checked separately**. Full 3D world: **not tested yet; integration is checked separately**. Independent visual review and both-mode app screenshots remain the lead’s release gates; no shared renderer or app server was changed.

## Provenance

Mapped plan © OpenStreetMap contributors, ODbL 1.0, [copyright](https://www.openstreetmap.org/copyright). Commons photos are reference-only in ignored `tmp/`; full titles, authors and licences are recorded in the catalog. Primary exterior comparisons: [Sears Tower, Wacker Drive and Jackson Boulevard, Chicago, IL - 54189600901](https://commons.wikimedia.org/wiki/File:Sears_Tower,_Wacker_Drive_and_Jackson_Boulevard,_Chicago,_IL_-_54189600901.jpg), w_lemay, CC BY-SA 2.0; [Base of the Willis Tower (2021)](https://commons.wikimedia.org/wiki/File:Base_of_the_Willis_Tower_(2021).jpg), Bobertrobert0709, CC BY-SA 4.0. The old construction photo in the dossier was used only as historical context, not as current facade reference.

Final validation: all **12 Willis Tower checks** pass (three registry conformance checks plus nine landmark tests); the actual catalog validator passes for its record and both variants in an isolated scratch root linking the real owned files. The unfiltered shared run finished 391/393 passing, with only the in-progress `mercedes-benz-stadium` readiness mismatch and `helsinki-cathedral` missing positive pad value failing. Shared `asset-catalog.mjs`, `pnpm assets:check` and `pnpm assets:preview` currently stop at missing `docs/3d-top-cities-helsinki-cathedral.md`; retry reproduced that external failure. Willis Tower metrics and `landmark-depth-layers.mjs --ids willis-tower --check` pass with an empty cycle report.
