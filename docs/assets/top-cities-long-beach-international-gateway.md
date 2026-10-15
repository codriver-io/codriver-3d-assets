# Long Beach International Gateway

Original procedural model of the current 2020 six-lane cable-stayed crossing over the Port of Long Beach Back Channel. The demolished 1968 Gerald Desmond arch-truss bridge is excluded. Primary designer Arup confirms that the built bridge has **faceted single monopoles**, superseding the brief's inverted-Y description.

## Sources and dimensions

[Arup](https://www.arup.com/projects/long-beach-international-gateway-bridge/) establishes the built tower form, 157 m tower height, 305 m clear main span and 610 m cable unit. [HNTB](https://www.hntb.com/projects/long-beach-international-gateway-bridge/) establishes 166 ft (50.5968 m) width, six traffic lanes, 10 ft shoulders, a cycle/pedestrian path and 205 ft (62.484 m) navigation clearance. [WSP](https://www.wsp.com/en-us/projects/gerald-desmond-bridge-replacement-project) corroborates the 1000/2000 ft spans.

| Quantity | Value | Basis |
| --- | ---: | --- |
| Tower crowns | 157 m | Arup |
| Main / side spans | 305 / 152.5 m | Main and 610 m unit from Arup; symmetric sides inferred |
| Deck width | 50.5968 m | HNTB 166 ft |
| Roadway / girder soffit | 66.5 / 62.5 m | Road estimate above published clearance; visual y=0 harbor datum |
| Modeled through corridor | 2498.228 m | OSM roadway alignment, includes approach landings |
| Project extent | ~2.7 km | Supplied Wikipedia dossier; interchange branches not modeled |
| Flat-map ramps | 858.472 / 929.756 m | Excluding 50 m grade noses at either end |
| Maximum ramp grades | 8.125 / 7.474% | Constant grades with 40 m quadratic vertical curves |
| Stays near / far | 160 / 88 | Visual estimate: 20 stays in each half fan near; reduced far |

The local datum is not a survey. Mast dimensions, stay anchorage elevations, cable diameters, approach pier stations, girder sections and lighting fittings are estimates. Two tapered, chamfered octagonal masts transition toward diamond crowns; they are not twin-legged portals. Four stay planes per mast attach to the outer edge barriers, with named concrete anchors. Mast footings and approach column toes stay planted under road/terrain refits. Exposed approach footing blocks are omitted because local grade-clamped pavement can intersect them; the shafts end flush at the sampled terrain.

## Frame, ownership and modeling

East/up/south in real metres around `[-118.2213,33.764835]`. Increasing station runs west to east, approximately 65.1 degrees through the straight channel crossing. Both carriageways use one OSM-derived station/lateral frame for mesh, route, car and camera; geographic rotation is baked into vertices once.

Roadway ways are retained verbatim in `long-beach-international-gateway-alignment.js`: 1343720078, 855738440, 856234338, 721338730, 1000722443, 855738446, 855738451, 855738455. The bridge outline is way 1433959973. There are no building-tagged pylon outlines in the supplied dossier. Provider road masking is delegated to the standard bridge factory, not a broad building mask over the port.

Slab and asphalt use the same station boundaries and exact lateral road sample columns, with extra slab shoulder columns. The structural slab is 0.60 m below the road; a 0.60 m asphalt shell fills the road build-up, and barriers/path bases reach the slab. Far drops the shell side faces hidden beside the barriers to avoid material depth cycles. A nonplanar terrain raycast regression keeps structural slabs below asphalt in both LODs.

The two approach ribbons follow their separate mapped centers and narrow over the final 180 m to the connected road widths. The main deck remains rigid. The landmark-owned layer fits standard road nose widths to zoom-dependent provider ribbons, and interpolates their pavement color. Full 3D world uses absolute-deck with lateral DEM fitting/clamp at the landings; the main span keeps its authored height, while foundation vertices use zero attachment weights.

Main supports are outside the clear channel. Paired concrete approach shafts meet their transverse caps and longitudinal girders. Their toes meet y=0 without decorative footing boxes. Girder and pier-cap surfaces share the muted structural concrete material, avoiding opposing material depth layers at their joints. Low approach noses have filled side/end surfaces down to grade; structural slab/girder ends bear on these landings 90 m from each end. The south-side Mark Bixby path is simplified into a continuous path alongside the authored through corridor; the separate east plaza switchbacks and scenic overlooks are outside this model. It ends at the grade landings, with rails fading down to the curb. Exactly two dashed dividers per three-lane roadway appear near; provider HD paint is retained when available. Far preserves every main structural feature with fewer stays, lamp poles and floorbeams. Geometry is batched in three longitudinal chunks near, one far; no textures or photos are shipped.

## Reference provenance and visual evidence

The supplied driver photo [Long Beach International Gateway BG](https://commons.wikimedia.org/wiki/File:Long_Beach_International_Gateway_BG.jpg), Jengod, CC BY-SA 4.0, was inspected and its Commons license checked. Two additional reference photos were inspected: HNTB sunset tower close-up, and Arup's Port of Long Beach construction side view showing the current cable bridge behind the old arch. They are reference-only publisher images retained in ignored scratch, not redistribution assets.

First contact sheet inspected: `tmp/top-cities/shots/long-beach-international-gateway/iteration-1/long-beach-international-gateway-procedural-near-light-sheet.jpg` (overview/front/back/above/driver/tower/contact/underside). It confirmed the central single-mast silhouette and paired edge fans. The first pass prompted wider north shoulder coverage, elimination of redundant glow geometry and clipping low structural strip noses to grade.

## Export and validation

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 78,556 | 19 | 3,209,456 | 3134.2 |
| Far | 25,608 | 6 | 924,556 | 902.9 |

Focused tests cover tower crown/main span, clear navigation channel, all named stay/rail/beam/pier terminal contacts with shortened-cable negative controls in both LODs, mapped roadway ownership in both directions, ramp grades, rigid main-span widths, immutable refits and GLB normals/weights/bounds.

Final export/reference sheet inspected: `tmp/top-cities/shots/long-beach-international-gateway/final/reference-and-export-sheet.jpg`. It places the three reference photographs beside final near front/back/above/driver/tower/contact/underside, far overview/tower and both LODs in light/dark. The exported driver view retains the single mast and paired stay-web arrangement in Jengod's photo. Far reduces stay density while keeping fan extents and the open median. Detailed colored architectural tower floodlighting is not simulated.

The deterministic QA report `tmp/top-cities/long-beach-international-gateway/qa-metrics.json` has no issues: zero coplanar overlaps, zero layered faces after generated depth ordering, zero unsupported member candidates in either LOD, 0% backface hits from 37 successful sweep rays. The depth generator/check reports zero dropped cycle edges. The thirteen landmark-specific tests pass, including negative cable-contact controls; the combined top-cities conformance run passes 779 tests. Catalog validation and local asset preview build pass. Costs exclude runtime HD overlays and are not Tesla hardware measurements.

## Real application verification

Cityscape and Full 3D world are verified locally with standard Protomaps roads at `tiles.codriver.io`; world uses Terrarium DEM tiles (256 px, max zoom 15). All loaded landmark meshes use the shared `MeshBasicMaterial` runtime shading path. No shared bridge source, rollout gate, staging deployment or publication was changed.

Viewed full-resolution app images and contact sheets: `app-cityscape/long-beach-international-gateway-{far,near,street}.png`, `app-world/long-beach-international-gateway-{far,near,street}.png`, `approaches-cityscape/{west,east}-{eastbound,westbound}.png` and `approaches-world/{west,east}-{eastbound,westbound}.png`, all under `tmp/top-cities/shots/long-beach-international-gateway/`. Overview and approach contact sheets are in `final/`. The world west-approach close-up exposed footing blocks through grade-clamped pavement; the final fix removes those blocks and omits the first/last 300 m low-pier material group in world mode, where the ramp is carried by terrain. Cityscape keeps those supports; a focused test proves their visibility restores. Visible shaft toes stay planted at their DEM samples. A landmark-only post-fit clamp keeps buried shaft toes below the road underside instead of inverting them through pavement; `pierTop` metadata identifies these vertices. The immutable authoring positions still restore exactly in Cityscape. Final captures are regenerated after restarting both asset-caching servers.

Actual HD pavement and lane paint are **not tested**: local `/osm-lanes` responds 503 without Redis. The shared bridge factory retains its normal HD overlay path; the standard fallback lane dividers were checked. Authenticated navigation, moving vehicle/camera sessions, failed/late load, 2D switching, reanchor and hardware performance were not exercised in the app; immutable fitting/restoration has focused test coverage. Separate interchange branches, path switchbacks/overlooks and surveyed foundation details are outside this model. Offline geographic and surface tests establish the shared deck contract; they do not establish a physical survey.

Live `window.__map.landmarks.heightAt(lng, lat, heading)` values below are metres **above the queried terrain**, not absolute sea elevations. Each pair is the two carriageways (negative / positive lateral); reversing the heading returns the same number. All 75 in-range mapped way vertices return a deck value in both headings and both modes; a point 111 m north of the anchor returns null. Detailed source way/coordinate/heading results are in `tmp/top-cities/long-beach-international-gateway/app-height-{cityscape,world}.json`.

| Station | Cityscape | Full 3D world |
| --- | --- | --- |
| west-foot | 0.000 / 0.000 | 0.000 / 0.000 |
| west-landing | 0.000 / 0.000 | 1.074 / 0.000 |
| west-ramp | 8.937 / 8.937 | 0.419 / 0.935 |
| cable-west | 66.500 / 66.500 | 57.801 / 59.352 |
| mast-west | 66.500 / 66.500 | 72.541 / 72.042 |
| mid | 66.500 / 66.500 | 72.947 / 66.368 |
| mast-east | 66.500 / 66.500 | 62.602 / 62.537 |
| cable-east | 66.500 / 66.500 | 63.032 / 62.697 |
| east-ramp | 8.221 / 8.221 | 10.103 / 6.433 |
| east-landing | 0.000 / 0.000 | 0.000 / 0.000 |
| east-foot | 0.000 / 0.000 | 0.000 / 0.183 |

Cityscape landings are 0 m and the cable unit is 66.5 m. World keeps the absolute deck at 66.5 m; negative harbor DEM cells explain relative heights exceeding 66.5 m. The west foot is 0/0 m, east foot is 0/0.183 m; the west flat-landing station 50 m inboard is 1.074/0 m above local ground because the fitted road starts from its endpoint datum. The small east transverse residual is retained and disclosed; this is a terrain/provider approximation, not surveyed road banking. No step at the outer landing nose was observed in the standard-road captures.

The generated depth table was regenerated and checked for this ID, with no cycle edges dropped. Renderer bundles are local verification artifacts and are restored before committing. Delivery includes only this landmark's source folder, catalog fragment, documentation and three runtime export files; independent lead review remains the next gate.

Final live world attachment probe: 760 visible foundation/toe vertices meet their DEM sample with maximum absolute residual 0.00000111 m; 0 buried shaft-toe vertices are intentionally held below the road underside, and 0 foot vertices protrude above their DEM sample. Hidden low-pier meshes are excluded. Full coordinates/residuals are retained in the world height JSON. This checks renderer attachment arithmetic, not DEM geodetic accuracy. The final world west approach screenshot was inspected at full resolution: slab/pier punctures are gone; fresh both-direction/mode sheets are `final/app-approaches-sheet.jpg` and `final/app-modes-sheet.jpg`.
