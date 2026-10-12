# Pitt River Bridge — current 2009 crossing

Original procedural model of the Highway 7 / Lougheed Highway bridge between Port Coquitlam and Pitt Meadows, British Columbia. It replaces the scaffold with six separate pale concrete masts in two transverse rows, three planes of parallel harp stays, a widening seven-lane deck and the northern shared path. The demolished swing bridges and nearby railway bridge are excluded.

Build: `pnpm build:top-cities-landmarks pitt-river-bridge --no-check`.
Inspect: `/asset-preview.html?asset=pitt-river-bridge&view=overview`.

## Research and dimensions

The supplied dossier was read and its photographic contact sheet opened. The modern Dllu photograph was used; the second photograph shows the 1915 predecessor and was excluded. Primary sources checked:

- [Designer SYSTRA IBT](https://www.systra.com/ibt/project/pitt-river-bridge-vancouver-british-columbia-canada/): 190 m main span, 380 m three-span crossing, deck widths, steel/concrete composite construction, three harp cable planes.
- [Canada, August 2009](https://www.canada.ca/en/news/archive/2009/08/announces-pitt-river-bridge-will-soon-be-open-traffic.html): three westbound/four eastbound lanes and up to 16 m marine clearance.
- [Canada, October 2008](https://www.canada.ca/fr/nouvelles/archive/2008/10/projet-construction-pont-riviere-pitt-franchit-nouvelle-etape.html): six 60 m pylons on two main supports; full archived page checked in scratch.
- [OSM outline 742056675](https://www.openstreetmap.org/way/742056675) and roadway vertices from the supplied `osm.json`; OSM contributors, ODbL 1.0.
- [Pitt River Bridge 2016](https://commons.wikimedia.org/wiki/File:Pitt_River_Bridge_2016.jpg), Dllu, CC BY-SA 4.0; Commons licence independently checked. Two additional SYSTRA aerial photographs were opened from its project page, copyright SYSTRA, reference-only in ignored `tmp/`. No image or texture ships.

| Dimension | Authored value | Basis |
| --- | ---: | --- |
| Main span / cable section | 190 / 380 m | Designer |
| Side spans | 95 m each | Symmetric division of remaining 190 m; estimate |
| Masts | Six, crowns at local 60 m | Published 60 m pylons; visual water-level base convention |
| Total deck width | 44.66 m west → 40 m east | Designer endpoints, direction/linear taper inferred from aerial and outline |
| Northern shared path | 3.1 m | Visual estimate within sourced total width |
| Traffic | Three westbound / four eastbound lanes | Canada announcement |
| Road / girder soffit | 19 / 15.9 m | Estimated structure depth above sourced 16 m clearance |
| Main structure plus approaches | 506 m | 380 m cable section plus dossier 126 m multi-span approaches |
| Grade alignment | 867.627 m | Averaged OSM carriageways and connected roads |
| Ramp lengths, excluding landings | 189.401 m west / 250.226 m east | Authored flat-map convention |
| Peak flat grades | 11.350% / 8.325% | Constant slopes with 22 m quadratic vertical curves |
| Flat landings | 24 m each | Authored |
| Mast sections | 4.4 × 3.1 m base; 2.7 × 2.2 m crown | Photo estimate, chamfered tapered loft |
| Stays | 120 near / 72 far | Visual sampling; not a surveyed cable count |

Local metres are east/up/south about `[-122.7302791,49.24837405]`, the west tower row midpoint inferred from opposed outline vertices. Tower stations are 308.401 and 498.401 m; increasing station runs southeast at approximately 123°. The corresponding mapped transverse rows are about 190 m apart. `y=0` is visual flat-map/water grade; no DEM, Mercator scale or moving vertical datum is baked into the reusable GLBs. The 19 m deck is an approximation, not a sea-level survey.

## Geometry and road ownership

A single station/lateral/profile drives geometry, road replacement, navigation and camera heights. The two OSM carriageways are interpolated by longitude and averaged; mapped curvature survives in vertices. `fittedLateral` retains authored rigid width even with fragmentary HD samples. All nine mapped road way ids are recorded in `pitt-river-bridge-alignment.js`; footprint ownership also records the bridge outline, shared-path way 82339081 and authored connection portions of 337747777 / 337741521, with a separate path ring. Way 136794030 splits toward Mary Hill: its first two shared-deck vertices remain owned, while the third lies outside the carriageway corridor and stays provider-owned. No building-tagged tower/part was present in the dossier. Nearby industrial buildings, Belfast Street, railway and unrelated paths are excluded.

The red outline covers the structural bridge. Authored grade ramps deliberately continue beyond it, onto connected Lougheed Highway. Foundation blocks project roughly 2.5 m beyond the authored roadway edge; the sourced-width deck and averaged mapped carriageway frame differ from the OSM outline on the south side. Its overall positive-lateral outline envelope ends at 19.056 m, while the west-row footing reaches 24.247 m (5.192 m overhang). The envelope test allows this explicitly; no provider building is masked outside the mapped outline. This does not claim unrelated provider building ownership. An observable envelope test distinguishes the structural section from these outside grade approaches.

Closed lofts keep each mast separate above the road. Parallel, closed cylindrical stays terminate inside the taper's actual longitudinal face and named deck anchorage blocks in both LODs. Six stringers end on approach caps; floorbeams contact the stringers. Pier bases and mast footings have zero attachment weight; shafts stretch toward the accepted road datum. The northern path follows mapped lateral controls and diverges from the highway approaches to ground connections at stations 97.758 and 699.452 m. Its estimated 3.1 m width narrows to a 0.8 m provider path ribbon over the last 45 m; a 55 m ground blend ends the path, curb and handrail on the connected path, with explicit terminal posts. Attachment weights blend to local terrain at both ends. Near lamps have heads that touch their masts. Tests enumerate named cable, rail, lamp, beam and girder support triangles, accept solid containment or surface contact, and deliberately shorten a stay to prove a free end fails.

Near has three station chunks; far merges materials, reduces stays/posts and drops lane dashes, lamp masts/heads and anchor fittings. Both preserve all six towers, the three cable planes, deck taper and channel opening. Day palette is subdued concrete/steel with pale cables; night dims these and lights near lamp heads. No floodlighting is invented. Materials are `tower`, `concrete`, `steel`, `cable`, `asphalt`, `paint`, `rail`, `lamp`. Pavement and lane lines are fallback geometry; actual HD overlay remains the shared renderer's responsibility.

## Review fix: continuous landings

Independent b3b review rated recognisability 5/5 and required removal of broad square gray pavement noses at both landings. The river structure remains 40–44.66 m wide, with the six 60 m masts, 190 m main span, three harp planes and three/four lane split. Only the land ramps taper: west stations 24–143.401 m and east 649.401–843.627 m blend each carriageway toward its mapped OSM centre and a 6 m standard-road ribbon. This is a renderer match at the captured driving zoom 18, not a claim that the real highway is 6 m wide. The final 24 m landings retain that narrow width.

Kerbs/parapets and median width/height taper to zero at the landings; authored lane paint stays on the structural section. The northern path ends on mapped cycleway connections instead of continuing beside the highway grade endpoint. The path uses its own ground-blended height and attachment weights; terminal handrails meet named posts in both LODs. Lamp bases were moved with the parapet and rechecked for contact. Collapsed taper triangles are removed.

Pavement carries an exported `_landingblend` attribute. A landmark-local subclass of the shared bridge layer applies a smooth unlit blend between the existing HD deck and standard-road palettes, updating both colors on theme changes without changing the shared terrain, replacement or LOD lifecycle. No shared bridge source extension was required. Actual HD overlays still use the normal shared surface path.

## Export and visual verification

| LOD | Triangles before → after | Draws before → after | Bytes before → after | KiB before → after |
| --- | ---: | ---: | ---: | ---: |
| Near | 45,480 → 47,612 | 21 → 21 | 1,566,544 → 1,570,356 | 1,529.8 → 1,533.6 |
| Far | 18,924 → 20,732 | 6 → 6 | 530,868 → 607,292 | 518.4 → 593.1 |

Both LODs remain below bridge budgets with substantial headroom. Final bounds: x −268.166..473.727 m, y 0..60 m (minimum floating-point residual −0.000000221 m), z −166.142..315.958 m. Costs exclude provider overlays and are not hardware measurements.

Two exported-GLB inspection sheets were opened during the review fix, within the two-round limit: `tmp/top-cities/shots/pitt-river-bridge/review-fix/near/pitt-river-bridge-glb-near-light-sheet.jpg` and the corresponding `far/pitt-river-bridge-glb-far-light-sheet.jpg`. They show overview, back, roof and deck. The dossier contact sheet was also opened: the modern Dllu photograph is the relevant six-mast bridge; the historical photograph is excluded. Structural recognisability was preserved.

The final app sheet `tmp/top-cities/shots/pitt-river-bridge/review-fix/app-approaches-final-sheet.jpg` was opened and judged: 16 unobstructed views, both approaches in both driving directions, near and forced far, Cityscape and Full 3D world. Individual 1280×800 PNGs are in `review-fix/approaches-{cityscape,world}-{near,far}/`. The broad pavement noses are gone; each road end narrows and lightens into its connected provider ribbon, with no visible step, gap or duplicate deck in these views.

Final landmark plus registry conformance tests pass (410 checks, ten landmark-specific tests), including every named stay/rail/beam/lamp contact, shortened-stay negative case, observable approach pavement/path endpoints, mapped road ownership, source/export metrics, terrain refit restoration and exported gradient/theme handling. `pnpm assets:check`, `node scripts/asset-catalog.mjs` and `pnpm assets:preview` pass (266 catalog entries / 490 GLB variants). `review-fix-qa-metrics.json` reports no issues, zero layered/coplanar candidates, zero unsupported terminal candidates and 0% external back-face hits. Depth regeneration/check reports zero cycles. The generated depth table remains uncommitted; the lead must regenerate the Pitt River entry after merge.

## Live integration evidence and limits

Full 3D world uses the Terrarium DEM, 256 px, maximum zoom 15. Servers were stopped by their exact PIDs after capture. Both LODs were explicitly confirmed active in each mode. The camera points remain west `[-122.73362850,49.24969537]`, bearings 120.319° / 300.319°, and east `[-122.72412024,49.24573710]`, bearings 123.436° / 303.436°.

`window.__map.landmarks.heightAt(lng,lat,heading)` is measured above the queried ground. All fourteen in-range mapped roadway vertices return owned heights in both aligned headings, in both modes and both LODs. Perpendicular and off-road rejection is covered by focused tests. Current samples use the actual mapped carriageway centres rather than fixed ±10 m offsets, which now lie outside some narrowed landings.

| Location | Cityscape north / south | Full 3D world north / south |
| --- | --- | --- |
| West foot | 0 / 0 | 0.089 / 0 |
| West flat landing | 0 / 0 | 0 / 0 |
| West cable endpoint | 19 / 19 | 15.643 / 16.414 |
| West tower | 19 / 19 | 17.962 / 17.986 |
| Main midpoint | 19 / 19 | 17.999 / 18.000 |
| East tower | 19 / 19 | 18.031 / 17.445 |
| East cable endpoint | 19 / 19 | 4.159 / 4.513 |
| East flat landing | 0 / 0 | 0 / 0 |
| East foot | 0 / 0 | 0 / 0 |

Numbers and capture locations are retained in `tmp/top-cities/pitt-river-bridge/review-fix-height-{cityscape,world}-{near,far}.json`. Near and far each have 256 zero-weight ground vertices (including the new path ends), with DEM residual −0.000000634..+0.000000205 m. This establishes sampled terrain contact, not an independent physical survey or whole-foundation rigidity. The shared absolute-deck policy retains a 0.089 m transverse height residual at the mapped west north carriageway centre; no visible step was observed. The 6 m standard-road fit is specific to the inspected road style/driver zoom; real HD carriageways require separate live-provider QA.

| Case | Status |
| --- | --- |
| Cityscape standard roads, near/far and both approaches/directions | Verified locally after fix |
| Full 3D world standard roads, near/far, approaches and ground vertices | Verified locally after fix; 0.089 m west transverse residual |
| Route/car/camera common height API | Verified by API and focused refit tests; paired navigation drive not tested |
| HD pavement/paint on/off | Not tested: local lane endpoint returns 503 without Redis |
| Repeated terrain revisions and flat restoration | Verified by focused synthetic tests in both LODs |
| Failed load, reanchor, missing terrain, tile retirement and 2D toggles | Not tested in the app |
| App day/night appearance | Day verified after fix; theme uniforms tested; night app recapture not performed |
| Tesla hardware performance | Not measured |

Source, exports, geographic footprint and inspection views remain registered in `prototypes/assets3d/catalog.d/pitt-river-bridge.json`. Generated application bundles and the shared depth table are excluded from the commit; no online deployment or publication was performed.
