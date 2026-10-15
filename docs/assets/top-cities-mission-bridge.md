# Mission Bridge — Highway 11, 1973

Original procedural model of the current steel-and-concrete highway bridge between Mission and Abbotsford, British Columbia. The nearby railway swing bridge is excluded. Source: `src/peregrine/landmarks/top-cities/mission-bridge/`; build: `pnpm build:top-cities-landmarks mission-bridge --no-check`; inspect: `/asset-preview.html?asset=mission-bridge&view=piers`.

## Identity, provenance and dimensions

The supplied dossier was read first. Its `refs-sheet.jpg` was opened: the useful photograph is [Missionbridge.jpg](https://commons.wikimedia.org/wiki/File:Missionbridge.jpg), B-columbia, CC BY-SA 4.0; the second depicts the railway bridge and was excluded. The Commons attribution/licence page was checked. No photograph, texture, third-party mesh or survey data ships in the GLBs.

[Associated Engineering's CAEE 2015 retrofit paper](https://www.caee.ca/pdf/Paper_94340.pdf), by Don Kennedy, Katrin Habel and Grant Fraser, is the principal structural source. It describes 1125 m, 22 spans, 11 precast concrete approach spans, eight steel I-girder approach spans, three orthotropic steel trapezoidal box spans, a 134 m main span and inclined concrete columns. This takes precedence over the older conflicting 20-span / approximate 120 m summary. [Wikipedia](https://en.wikipedia.org/wiki/Mission_Bridge) and the dossier supply the four-lane road, nominal 16 m roadway and two 2 m walks. The task's “two lanes” is interpreted as two per direction, consistent with both OSM carriageways.

| Dimension | Model | Basis |
| --- | ---: | --- |
| Opening | 1973 | Engineering paper; current bridge, after retrofit |
| Structural alignment | 1126.968 m | Dossier OSM; agrees within 2 m with published 1125 m |
| Grade/road alignment | 1186.764 m | Averaged mapped carriageways plus connected endpoint roads |
| Main span | 134 m | Engineering paper |
| Other river spans | 115 m each | Estimate, not surveyed pier locations |
| River section | 364 m | 115 + 134 + 115 m; estimate |
| Approach layout | 11 × 31 m north; 8 × 52.746 m south | Span count sourced; allocation and stations estimated |
| Road / whole platform | 16 m nominal / 20.2 m | Dossier dimensions; includes narrow centre divider |
| Raised walks | 1.8 m plus kerb allowance each | Visual/OSM interpretation of nominal 2 m walks |
| Road crest / lamp crown | 30 / 38.11 m | Photographic estimate, local datum; no surveyed absolute elevation |
| Box girders | Two; 7 m top width / 5.8 m bottom width; 2.1–3.5 m depth | Photographic section estimate; haunches over piers |
| Inclined columns | Two per frame, 2.4 m square, feet ±4.4 m / heads ±7.3 m | 2.4 m column size from paper; batter/spacing estimated |
| Flat ramps | 332.174 / 466.591 m | Authored north/south from 12 m grade landings |
| Peak flat grades | 8.649% / 6.046% | Constant grades with 20 m end curves |

Local metres are east/up/south about `[-122.30556,49.12333]`; increasing station runs southeast, roughly 131°. `y=0` is a visual water/flat-map datum. No DEM, scene origin, latitude scale or runtime vertical datum is baked into the reusable exports. The shared absolute-deck policy interprets the authored crest in the world frame, so the approximate road elevation is a visual assumption rather than a hydrographic survey.

## Geometry and road integration

The generator is self-contained and imports only Three.js, assetBuilder and bridge-profile. It retains the OSM curvature and uses one station/lateral/height frame for road acceptance, car/route/camera queries and structure. Mapped northbound carriageways occupy negative lateral coordinates; southbound occupy positive coordinates. Highway vertices come from dossier ways 38094406, 38094449 and 466559827 and connected ways 372515237, 35499845, 35497879 and 62146078, fetched once through the lead tree's shared Overpass helper. A second broader approach query timed out; no unverified response was used. Scratch extracts are under `tmp/top-cities/mission-bridge/`.

The bridge outline 466672802 and both cycleways 372512949/372512950 are registered, together with the authored highway segments. No provider building-tagged pier/tower part appears in the dossier. Adjacent rail, roads, buildings and trails remain unowned. The river section fits inside the mapped outline; taper pavement extends along the connected endpoint roads. Paths are an interpretation inside the total deck envelope, not a surveyed reconstruction of the separate ground cycleway forks.

Three station chunks near, one merged material group far. Both retain the shallow hump, twin closed trapezoidal main boxes, open spaces between approach girders, battered paired pier legs, transverse caps, walks, centre barrier and lamps. Far has coarser rails/posts and drops lane dashes. Colors follow the muted brown-grey steel, pale concrete and metal rails in the reference; dark mode dims structure and lights lamp heads. Lamp arms are simplified straight bars rather than exact curved goosenecks.

The river platform remains rigid. Only the first/last 110 m beyond 12 m level landing ribbons taper to the actual mapped carriageway centres and 6 m standard-road widths. Walk/kerb width and rail height diminish with the taper, with rails ending on explicit terminal posts. A landmark-local layer blends fallback pavement from the live standard-road palette to the shared HD deck palette using exported `_landingblend`; theme changes update uniforms. No shared bridge source extension was needed. Actual HD pavement/paint reuse remains in the shared bridge renderer.

The earliest northern concrete girder spans and final shallow southern span would bury beams below flat grade; their underside members end on the first/last above-grade named cap instead. Slab and pavement remain continuous. Of the 23 station boundaries, 20 have visible support frames; the shallow first interior frame and both abutment boundaries are below the flat structural clearance. This is an explicit flat-map approximation. Ground footings have zero attachment weight, caps/deck have one, and horizontal-section inclined shafts interpolate between them. Their bases stay at terrain while cap contacts follow the accepted deck.

Pavement is sampled across its width (11 columns near / seven far), so the world clamp can follow the terrain lattice at landings. The shared lateral clamp has 0.12 m clearance to prevent fallback pavement fighting the terrain surface. This adds a small world endpoint offset, recorded in the live table below. It does not change Cityscape grade or squeeze rigid steel width.

## Export costs and validation

| LOD | Triangles | Mesh draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 73,765 | 18 | 2,806,080 | 2740.3 |
| far | 23,333 | 5 | 775,396 | 757.2 |

Costs describe texture-free uncompressed GLBs, excluding live road overlays; Tesla hardware was not measured. Source/export bounds, normals, material names, `_bridgelift` and `_landingblend` survive round trip. Contacts are tested against named generated support triangles, excluding the member: approach/main girders, every inclined leg, every rail segment and every lamp arm, in both LODs. A shortened rail negative case proves free ends fail. Raycasts pin the 134 m channel opening, inclined-pier openings above footings, road crest and road ownership. Synthetic terrain revisions preserve immutable refits and restore flat positions exactly.

Visual comparison: the dossier road photo, initial exported near sheet, and `tmp/top-cities/shots/mission-bridge/export-reference-sheet.jpg` were opened. The final delivery contact sheet will be recorded below. The visible pier silhouette, low girders, road crest and separate lanes matched the reference; railway structures were not copied. Contact checks led to raised approach-bearing plinths at the deeper box-girder transitions and horizontal-section pier lofts so feet never protrude below grade. Depth checks led to removal of hidden duplicated pavement/slab faces and buried approach girders; material cycles must remain zero.

## App verification and review corrections

Initial local near/far, Cityscape/world captures exposed crossed landing rails: carriageway controls were listed in the reverse lateral order. The order was corrected and a regression assertion now checks negative/positive carriageway signs at both ends. World captures also exposed terrain showing through coarse two-column pavement; transverse sampling and 0.12 m clamp clearance were added. Final evidence, height values and remaining limitations follow below; the initial captures are retained as diagnostic evidence only.

Final bundle: **b3d13e5ff0a9**, ports 3274/3276, Protomaps from tiles.codriver.io; world uses Terrarium DEM, 256 px, maximum zoom 15. The final exported contact sheet **tmp/top-cities/shots/mission-bridge/delivery-reference-sheet.jpg** was opened: reference photo, near/far, light/dark, overview, both sides, plan, piers and deck. The final app sheets **app-final-near-sheet.jpg** and **app-final-far-sheet.jpg** in the same folder were opened, each covering both ends, both directions and both modes. Individual 1280×800 PNGs, loaded/active/LOD reports, coordinates and height queries are under **final-approaches-{cityscape,world}/**; all sixteen captures report the intended LOD active. Cityscape landings now have separated ribbons and rails, without crossed railings or square pavement noses.

The remaining irregular white road patches in world mode reproduce with the landmark disabled and standard-road masks restored. The paired **world-disabled-comparison/sheet.jpg** was opened: identical foreground provider-road patches persist after the model is hidden. This is a shared terrain/standard-road rendering artifact outside the landmark's owned surface, not proof of a geometry seam in Mission Bridge; it prevents claiming flawless surrounding world roads. The shared renderer was not modified.

Live `window.__map.landmarks.heightAt(lng,lat,heading)` values are metres above the queried ground at mapped carriageway centres, listed northbound / southbound. Opposed aligned headings return exactly identical values; focused tests reject crossings, nearby rail and off-road points.

| Sample | Cityscape NB / SB | World NB / SB |
| --- | --- | --- |
| north-foot | 0.000 / 0.000 | 0.456 / 0.120 |
| north-landing | 0.000 / 0.000 | 0.120 / 0.120 |
| river-start | 27.000 / 27.000 | 20.816 / 20.816 |
| main-start | 29.104 / 29.104 | 22.920 / 22.920 |
| main-midpoint | 30.000 / 30.000 | 23.816 / 23.816 |
| main-end | 29.104 / 29.104 | 22.920 / 22.920 |
| river-end | 27.000 / 27.000 | 20.817 / 20.817 |
| south-landing | 0.000 / 0.000 | 0.120 / 0.120 |
| south-foot | 0.000 / 0.000 | 0.403 / 0.120 |

Raw data is retained in each final capture directory's **heights.json**. Small endpoint offsets include the shared transverse DEM clamp and 0.12 m clearance, rather than being asserted to be zero. River roadway remains about 30 m in the world frame, roughly 23.816 m above the sampled river terrain. All **624** zero-weight foundation/shaft-toe vertices retained their authored ground-relative offsets: live DEM residual **-0.000000915..0.000000891 m**. This checks sampled terrain contacts, not a geotechnical survey or rigid whole-footing topology.

Final focused registry plus landmark tests: **785/785 pass**, eight landmark-specific cases. **node scripts/asset-catalog.mjs** passes (406 entries / 684 variants), **node scripts/landmark-depth-layers.mjs --ids mission-bridge --check** passes with zero material cycles, and **pnpm assets:preview** succeeds. **qa-metrics-delivery.json** reports no issues, 0% external back-face hits, no unsupported member ends and no layered/coplanar candidates. No unrelated shared-check failures occurred.

| Case | Status / scope |
| --- | --- |
| Cityscape standard roads, near/far, both ends/directions | Verified locally after correction |
| World landmark near/far, both ends/directions, height API and footings | Verified locally; surrounding provider roads have a separate disabled-model-reproduced artifact |
| Car/route/camera common height contract | API and synthetic tests verified; paired navigation drive not tested |
| HD pavement/paint on/off | Not tested: local lane endpoint returns 503 without Redis |
| App night theme | Not tested; exported night models inspected |
| Terrain revisions and flat restoration | Synthetic tests verified in both LODs |
| Failed load, tile retirement, reanchor, 2D toggles | Not tested in the app |
| Tesla hardware | Not measured |

Catalog readiness describes the source/export, not publication or blanket terrain certification. No online deployment or public-library transfer occurred. Local app servers were stopped by their exact PIDs after capture.
