# Vancouver: Port Mann Bridge

Original procedural model of the current **2012 Highway 1 cable-stayed crossing** between Coquitlam and Surrey, over the Fraser River. The demolished orange 1964 tied-arch bridge visible in construction photographs is excluded. Recognition features are two central concrete single-mast pylons, stay fans in four planes per mast, two very wide separated carriageways, the open central median and the long curving approach viaducts.

Build: `pnpm build:top-cities-landmarks port-mann-bridge --no-check`.
Inspect: `/asset-preview.html?asset=port-mann-bridge&view=overview`.

## Sources and dimensional datums

Primary structural references actually checked: [BC Ministry opening backgrounder, December 2012](https://archive.news.gov.bc.ca/releases/news_releases_2009-2013/2012PREM0152-001945.htm), and [SEABC / IABSE 2017 structural brochure, printed page 43 / PDF page 47](https://www.seabc.ca/wordpress/files/notable_structures/Vancouver_Notable_Structures_IABSE_SEABC_2017.pdf). The latter's photographs and elevation/plan were inspected from `tmp/top-cities/port-mann-bridge/structural-reference.jpg`. No diagram or photograph is shipped.

| Quantity | Model | Basis |
| --- | ---: | --- |
| Main span | 470 m | BC Ministry, SEABC |
| Back spans | 190 m each | SEABC |
| Cable-supported section | 850 m | BC Ministry |
| Overall structural length | About 2,020 m | Supplied facts and [OSM bridge outline](https://www.openstreetmap.org/way/673896312); mapped road extent is about 2,055 m |
| Maximum platform width | 65 m | OSM `width=65`, dossier; SEABC describes 67 m, a different width measure |
| Carriageways | Two five-lane decks | BC Ministry; OSM maps each as three through lanes plus a separate two-lane local road |
| Median gap | 10 m | Visual/structural layout estimate, consistent with the published twin-deck arrangement |
| Stays | 288 near / 160 far | Published near count; far samples each fan while retaining its outer extent |
| Pylon rise above roadway | 75 m | BC Ministry |
| Published tower height | About 163 m from top of deep footing | BC Ministry; **not a water-to-crown measurement** |
| Local roadway / girder soffit | 46 m / 42 m | Estimated 4 m girder depth over the published 42 m navigation-clearance reference |
| Local crown | 121 m | Estimated local road datum plus sourced 75 m rise |
| Pylon section | Base 12 × 9 m, crown 6.6 × 5.8 m | Photographic estimate, chamfered rectangular loft |
| Authored road alignment | 2,367.906 m | Averaged mapped carriageways, continued onto grade roadway |
| North / south rising ramps | 838.266 / 519.640 m | Authored, excluding 80 m flat landings at either end |
| Maximum flat-map grade | 5.7625% north / 9.5905% south | Constant grades with 40 m quadratic vertical curves |

The visual y=0 datum represents water/flat-map grade. The model deliberately omits the deeply buried/submerged pylon portion implied by the published footing-to-crown height; extending 163 m above water would make the exposed pylons far too tall. The local 46 m road and 121 m crown remain estimates rather than surveyed sea-level elevations. OSM's `deck_height=75` tag is retained in research data but not used as a vertical survey. The government source itself also lists 158 m tower shafts in its material summary: that figure is not treated as the same datum as footing-to-top 163 m.

Dossier contact sheet and all four photographs were reviewed. Reference-only Commons provenance: [The New Port Mann Bridge2](https://commons.wikimedia.org/wiki/File:The_New_Port_Mann_Bridge2.jpg), Reg Natarajan, CC BY 2.0 (file page checked); Vancouver Portmann-Bridge 2015, Dgarte, CC0; Old and new Port Mann bridges, TimBray, CC BY-SA 3.0; Looking up while driving over the Port Mann Bridge, Dllu, CC BY-SA 4.0. The last three licences are supplied dossier metadata. No photograph, texture, mesh capture or traced third-party geometry appears in source exports.

## Geographic frame and structure

Metric east/up/south around `[-122.81306, 49.21972]`, the supplied north-pylon anchor projected onto the averaged OSM motorway centerline. Increasing station runs toward Surrey; positive lateral points west of the southbound direction. The near-straight main span bears about 164.7° clockwise from north. Curvature and orientation are baked into each vertex through the same `PROFILE.bridgePoint` used by navigation.

Mapped current road ways 190721968 / 191165108, local carriageway ways 270786062 / 270786069, and connecting motorways 194384507 / 35352645 / 35352650 / 674010703 / 674061260 are retained in `port-mann-bridge-alignment.js`. Extract obtained once through the lead checkout's serialized Overpass helper; scratch is `tmp/top-cities/port-mann-bridge/alignment-osm.json`. Outline way 673896312 supplies the red footprint ring. Nearby warehouse/building footprints and lighting/communication towers are excluded; no building-tagged bridge pylon was mapped. The authored grade landings extend beyond the bridge outline intentionally.

North pylon station is 1108.266 m at `[-122.81312526,49.21970904]`; south pylon is 1578.266 m at `[-122.81146111,49.21562911]`. The 850 m cable section runs from 918.266 to 1768.266 m. Tower positions are inferred from the supplied structural anchor and sourced spans, not independently surveyed tower outlines.

Each mast is a closed six-level chamfered loft, with continuous tapered broad faces. Eighteen stays on each longitudinal half-fan connect each of four deck anchorage planes to the mast, yielding 144 stays per mast. Upper anchorage heights, cable diameter and spacing are estimated; cables are closed cylinders whose ends intersect their supporting mast and bucket blocks. No pylon lies in a vehicle lane. No approach pier lies in the main navigation channel.

Two slab decks preserve the 10 m median opening. Three longitudinal box girders per deck, 116 floorbeam stations, near diagonal struts and transverse compression members preserve visible underside structure. Concrete approach shafts reach y=0 and their caps overlap the girders. Approach pier stations are simplified from the published thirteen/north and eight/south spans; stations with too little authored deck clearance omit the buried support. The east-side shared path has its own barrier and rail. Fallback lane lines depict five lanes per side; detailed separation/HOV/local-lane paint remains the provider's job when HD data is available.

Near uses four station chunks for culling, merged per material; far merges chunks, keeps both masts, all four cable planes and the open median, drops alternate stays, lane dashes, rail posts, lamp arms and minor anchorage fittings, and reduces floorbeams/facets. Geometry samples densely through vertical curves and the north landing; the first 240 m has 8 m longitudinal samples and asphalt columns no wider than 4 m for transverse DEM fitting. Other constant grades retain mapped curvature samples. Materials: `tower`, `concrete`, `steel`, `cable`, `asphalt`, `paint`, `rail`, `lamp`. Pale concrete/cables in daylight; dimmer structural materials at night with self-lit lamp heads. No floodlighting is invented. `bridgeLift=0` fixes foundation vertices; shafts interpolate attachment weights, upper structure follows the road. Refit tests verify restoration from immutable coordinates.

## Export and visual evidence

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 74,716 | 28 | 3,073,404 | 3001.4 |
| Far | 28,790 | 7 | 837,584 | 818.0 |

Near/far exported bounds match: x −626.831..508.674 m, y approximately 0..121 m, z −885.848..1158.022 m. These metrics exclude runtime provider overlays and do not measure Tesla hardware performance.

Screenshots actually opened and judged, under `tmp/top-cities/shots/port-mann-bridge/`:

- `iteration-1/port-mann-bridge-procedural-near-light-sheet.jpg`: overview, front/back, above, driving, tower, contact detail and underside.
- **`final/reference-and-export-sheet.jpg`**: two reference photos beside final exported GLBs, including near front/back, roof, support detail, underside and driving; far overview/tower; near/far light/dark.
- `final/app-modes-sheet.jpg`: real-app far, near and street in Cityscape and Full 3D world.
- `final/app-approaches-sheet.jpg`: both approaches in both directions in both modes.

Inspection also corrected the shared path to negative lateral (east), as confirmed by mapped cycleway 338712566. Inspection prompted closer main-span overview and side cameras, a complete top view, a below-deck pylon contact camera, and exact curved-profile sampling with flat/constant-grade segments simplified to reduce export costs. The exported driver view matches the single mast and stay-web arrangement seen in the supplied driver photograph. Daylight cable contrast is subtle against the pale inspector grid; dark and driving views show the fan more clearly. Far intentionally reduces web density. Main-span details receive priority over surveyed approach/support fidelity.

Focused tests (164 passed, including twelve landmark-specific checks): `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/port-mann-bridge/port-mann-bridge.test.js` passes, including geometry raycasts, crown/span/platform dimensions, open median, pier-free main channel, all four mapped traffic streams, ramp tangents/grades, immutable refits, route/car height, and GLB weights/materials/normals. Catalog validation and `pnpm assets:preview` pass. `qa-metrics.json` reports no issues, zero detected coplanar overlaps and 0% back-face hits from 31 successful external rays. Independent review accepted the visual model (recognition 4/5); the sole FIX item was the Full 3D world north landing, addressed below.

## Real-app integration and limitations

Review-fix local bundle `f560ea156a56`; slot A servers 3270 Cityscape / 3272 world. Standard Protomaps tiles from `tiles.codriver.io`; world has Terrarium DEM, 256 px, maximum zoom 15. App-shot confirms actual far/near assets active in both modes. Custom approach views use coordinates/bearings recorded in `tmp/top-cities/port-mann-bridge/approach-spots.json`: north 112.257° / 292.257°, south 139.299° / 319.299°. Custom reports say `active:false` because their synthetic spot IDs name cameras rather than landmark layers; the screenshots contain the model, and the separate actual-layer probe confirms activation.

Live `window.__map.landmarks.heightAt(lng,lat,heading)` returns the following **metres above the queried ground**, with identical results in both aligned headings. Columns are lateral −15 m / +15 m:

| Sample | Cityscape | Full 3D world |
| --- | --- | --- |
| North foot | 0 / 0 | 0 / 0 |
| North ramp start | 0 / 0 | 0 / 0 |
| North cable endpoint | 46 / 46 | 45.000 / 45.001 |
| North pylon | 46 / 46 | 45.000 / 45.000 |
| Main midpoint | 46 / 46 | 45.000 / 45.000 |
| South pylon | 46 / 46 | 40.679 / 39.984 |
| South cable endpoint | 46 / 46 | 41.327 / 40.131 |
| South ramp start | 0 / 0 | +5.284 / +5.934 |
| South foot | 0 / 0 | −0.236 / +0.465 |

Both modes own **all 119 in-range mapped roadway vertices in both travel directions**. Median, lateral ±60 m, and perpendicular-heading samples return null. Parent group y=0 in both modes; world ground is present. Durable numbers are `tmp/top-cities/port-mann-bridge/app-height-cityscape.json` and `app-height-world.json`. The route test gives 46.12 m including ribbon bias over the main span; vehicle/camera API returns 46 m.

**North landing review fix:** before → after: north foot −2.007 / +2.995 m → 0 / 0 m; north ramp start +4.248 / +6.195 m → 0 / 0 m, in both driving directions. The landmark-owned layer fits each landing vertex to its local DEM, rather than the shared centerline bank datum. Stations 0–80 m follow terrain plus the provider road approach height; a smooth cubic blend over 80–240 m returns to the existing absolute-deck ramp, never putting the fitted northern road below its queried terrain. Navigation, camera and route use the same world-only height rule. Support weights keep foundation feet planted; immutable shared refits precede the local correction, preventing accumulation. The main span and southern approach retain their previous heights. The first look exposed terrain/pavement depth interference at the coincident landing datum; the second and final look confirmed that a world-only asphalt/paint polygon depth bias (factor/units −4) removes the patches without changing driving heights. Cityscape restores the original material depth settings as well as vertex positions.

The owned adapter also fits newly arriving/refitted HD surface and paint overlays with their normal 0.06 / 0.08 m biases. A synthetic HD overlay test verifies lateral heights; actual HD integration remains not tested because `/osm-lanes` returns 503 without Redis. No shared bridge source was changed. Unknown landing DEM hides the replacement and keeps ordinary roads available. Cityscape bypasses the adapter; focused tests prove bit-exact position restoration after world refits for both LODs and repeated terrain revisions. North pavement tessellation changes neither the authored flat profile nor the accepted main-span geometry.

Review-fix evidence is in `tmp/top-cities/shots/port-mann-bridge/review-fix/`: `port-mann-bridge.jpg` is the repeated exported-GLB/reference QA sheet; `export-modes-sheet.jpg` combines near/far light/dark overview and deck views; `north-world-sheet.jpg` shows the north landing looking in both driving directions on world slot A (3272). The screenshots and the new live height probes were inspected. The exported/reference Prepare-equivalent commands were `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids port-mann-bridge --out tmp/top-cities/port-mann-bridge/review-fix-metrics.json` and `node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids port-mann-bridge --out tmp/top-cities/shots/port-mann-bridge/review-fix`; the supplied REVIEW.md did not contain a Prepare command. The terrain contact is verified locally for standard roads; it is not a survey of the physical abutment. The previous small southern foot transverse mismatch (−0.236 / +0.465 m) is outside this north-only review fix and remains disclosed.

| Environment / case | Status |
| --- | --- |
| Cityscape standard roads, load/LOD and approach grade continuity | Verified locally; no observed duplicate generic elevated deck or vertical step at the feet; fallback pavement changes width/colour against standard road ribbons |
| Full 3D world basic load, fixed deck and shared height queries | Verified locally |
| Full 3D world north landing, both driving directions | Verified locally with standard roads / Terrarium DEM; north foot and flat landing return 0 m above ground on both carriageways |
| HD pavement / lane paint on/off | Not tested: local `/osm-lanes` returns 503 without Redis |
| Vehicle/camera/route common surface | Focused API and route-lift tests verified; paired driving/navigation session not tested |
| Repeated terrain revisions, near/far world refits, Cityscape restoration | Focused tests verified; missing terrain, reanchor and load-failure lifecycle not tested in the app |
| MCU2/MCU3 performance | Not measured |

Only this landmark's folder, catalog fragment, document and three exports are changed. No shared renderer/profile extension, other landmark edit, publication or online deployment occurred. Generated renderer bundles are restored before committing; local servers are stopped at completion.
