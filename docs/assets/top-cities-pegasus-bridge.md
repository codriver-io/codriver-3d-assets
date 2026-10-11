# Pegasus Bridge — current 1994 road crossing

Original procedural model of the Scherzer rolling-lift bascule carrying D514 across the Caen canal, Bénouville, in closed traffic position. The 1934/35 original exhibited at Memorial Pegasus (dossier reference 2) is excluded. Independent review rated the first export PASS-WITH-NITS, recognisability 4/5; the four requested corrections are implemented below. Updated reviewer sign-off remains separate from builder verification.

## Sources and dimensions

[Identity and replacement history](https://en.wikipedia.org/wiki/Pegasus_Bridge); [mapped roadway](https://www.openstreetmap.org/way/30319467), [bridge outline](https://www.openstreetmap.org/way/745702717), [cylindrical control tower](https://www.openstreetmap.org/way/725863483). Supplied OSM/facts/photo dossier read first; nearby building outlines were queried once through the shared Overpass helper. Only the tower is masked; Café Gondrée and neighbouring houses remain provider-owned.

Visual references: [portal and rolling shoes](https://commons.wikimedia.org/wiki/File:Pegasus_Bridge_Neu_01_09.jpg), Хрюша, CC BY-SA 3.0; [road view and striped barriers](https://commons.wikimedia.org/wiki/File:B%C3%A9nouville_-_Pegasus_Bridge_01.jpg), Kev22, CC BY-SA 4.0; [closed structure and tower access](https://commons.wikimedia.org/wiki/File:Pegasus_Bridge_-_B%C3%A9nouville_(Calvados)_-_Basse-Normandie_-_France_-_Feb._2011.jpg), dynamosquito, CC BY-SA 2.0. Photos remain in ignored dossier storage; no textures, scans or traced meshes in exports.

| Quantity | Model | Basis |
| --- | ---: | --- |
| Bascule leaf | 45.7 m | Nominal dimension supplied by lead; public dimension metadata is ambiguous between versions, not a modern engineering survey |
| Mapped crossing | 78.165 m | Actual OSM roadway endpoints |
| Bridge axis | 115.9° east of north | Mapped roadway |
| Deck / carriageway | 15.6 / 7.4 m | Outline and photo estimate |
| Deck above flat datum | 3.2 m | Photo estimate, not published clearance |
| Main portal height | 20 m above deck | Photo estimate |
| Rolling quadrant radius | 8.4 m | Photo estimate |
| Counterweight housing | 6.2 × 10.7 × 8.7 m | Photo estimate |
| Control shaft / cab | radius 2.15 / 3.25 m; roof 9.81 m high | Cadastre shaft radius approximately 2.4 m; heights/overhang estimated |
| Ramps | 70 m each, maximum 6.857% | Flat-map convention; previously 45 m / 10.667% |
| Exterior fascia | 1.2 m deep | Reference-photo estimate |
| Deck / upper tower catwalk | deck +0.15 m / local y=7.55 m | Photo estimate, with railed stair to the machinery platform |

## Frame, geometry and road fitting

Origin `[-0.27419275,49.24239125]`; +X east, +Y up, +Z south. Station runs west to east along mapped D514 nodes, positive lateral to the right (south). Rotation baked once through `PROFILE.bridgePoint`. Local `y=0` is flat-map grade; no terrain, canal water plane or absolute sea-level altitude is baked in.

The profile follows roadway ways 4889065, 1263068387, 128915830, 1263068388, 30319467, 1265906734, 884677048, 1265645555 and 106423247. The last way continues the east ramp along the real curve, without extrapolating a straight axis. The 218.165 m alignment includes 70 m at each approach; deck remains level across the structural 78.165 m. Shared registry layer owns HD overlay, road replacement and navigation surfaces. `terrainPolicy: 'bank-fit'` uses the renderer's bank datum without flattening the canal; this is a relative deck estimate, not surveyed absolute altitude.

Portal A-frames, open lower X braces, quarter-circle rolling shoes, high counterweight with ribs, machinery cabin, plate-girder leaf and dense rail balusters preserve recognition. The cylindrical tower has cream shaft, green cab/roof and red external stair. Concrete abutment feet and the upper walkway trestle use clamped lift weights; tower stays grade-fixed and superstructure uses deck attachment. Exported `_bridgelift` survives the GLB round trip.

Materials merged into ten near / nine far batches. Day steel is `#aeb7bd`; the rolling quadrants use darker `edge` (`#89979f`). Dark theme uses corresponding blue-grey values; lamp material stays self-lit. Both LODs retain curved sectors, open portal, fascia, deck-level railed catwalk, banded barrier arms and round red/white sign heads. Near adds seams, bolts, machinery stair, upper catwalk and trestle; far drops fine fittings and most railing posts.

## Review changes: before → after

1. Plain red pins → red/white banded raised barrier arms with grey base and round prohibition sign heads facing both driving directions, outside the vehicle lanes; both LODs.
2. White-on-white portal and rolling shoes → mid blue-grey portal steel and darker quadrants; broad bracing and sector outlines remain visible in the distant export views.
3. 45 m / 10.667% hump with thin exterior edge → 70 m / 6.857% ramps following mapped roads, unchanged 3.2 m central deck and live endpoint datum; full 1.2 m grey exterior girder fascia.
4. Detached-looking tower / thin diagonal access member → deck-level railed catwalk to tower shaft in both LODs, plus upper horizontal access catwalk, stair, handrails and grounded trestle in near.

## Export costs and deterministic checks

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Before near | 10,644 | 10 | 649,804 | 634.6 |
| Final near | 11,964 | 10 | 709,680 | 693.0 |
| Before far | 2,864 | 8 | 167,800 | 163.9 |
| Final far | 3,764 | 9 | 206,828 | 202.0 |

Budget headroom remains large (near ≤120k/40/4.5 MB; far ≤30k/10/1.2 MB). Source and both GLBs have identical bounds per LOD; near/far keep the same silhouette. Eight landmark tests pin actual raycast geometry: leaf contacts, open portal/traffic corridor, rolling quadrant, 1.2 m fascia, round sign head and tower walkway, plus alignment, smooth endpoint joins, heading rejection, footprint envelope and exported attachment weights. Final focused conformance passed all 294 tests, including the eight landmark tests; catalog validation passed 222 records / 414 GLB variants, and the local asset viewer build passed. Deterministic QA reports no budget overrun, zero coplanar overlaps and zero back-face hits in 64 rays; minY remains -0.7 m.

The supplied REVIEW file has no Prepare block and no REVIEW-2 file exists. Equivalent preparation was rerun:

```sh
pnpm build:top-cities-landmarks pegasus-bridge --no-check
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids pegasus-bridge --out tmp/top-cities/review/pegasus-bridge/metrics-after.json
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids pegasus-bridge --no-ref --tag 'Review fixes' --out tmp/top-cities/review/pegasus-bridge/after
```

Read the regenerated `tmp/top-cities/review/pegasus-bridge/after/pegasus-bridge.jpg` and the exported camera sheet `tmp/top-cities/shots/pegasus-bridge/review-near-light/pegasus-bridge-glb-near-light-sheet.jpg`. Also read `review-export-reference-sheet.jpg` in the same shots root: dossier refs 4/5 beside final near light side/crossing/detail, near dark, far light and far dark exports. The second and final visual pass turned the initially edge-on sign faces toward traffic; the resulting sheet confirmed the bands/sign head, deeper fascia, darker structural members and connected tower access. No photos were fetched or committed during this review pass.

## App verification

Source baseline `dd8905d48ab52b3f81a56acfd635329288b5e117` plus isolated landmark changes; local bundle stamp `8e8f9e137355` (generated bundles excluded from commit). Protomaps `tiles.codriver.io`, Cityscape port 3274, terrain port 3276 with Terrarium DEM at zoom ≤15. Both approach points were captured facing 115.8° and 295.8° after rebuilding; scratch helper adapts repository `app-shot.mjs` and records the shared `window.__map.landmarks.heightAt` API. Read `tmp/top-cities/shots/pegasus-bridge/review-approaches-sheet.jpg`: all four west/east forward/reverse approaches are shown in Cityscape and again in world. Both joins meet the loaded roads without an obvious step/gap or doubled generic deck, and the longer ramps remain smooth. Full reports: `review-approaches-cityscape/report.json` and `review-approaches-world/report.json` under the same shots root.

| Station / sample | Cityscape forward/reverse m | World forward/reverse m above queried ground |
| --- | ---: | ---: |
| 0, west ramp endpoint | 0 / 0 | approximately 0 / 0 |
| 0.1, inside west join | 0.00001957 / 0.00001957 | 0.00001957 / 0.00001957 |
| 70, west abutment | 3.2 / 3.2 | 3.2 / 3.2 |
| 109.082, span midpoint | 3.2 / 3.2 | 3.34334009 / 3.34334009 |
| 148.165, east abutment | 3.2 / 3.2 | 3.2 / 3.2 |
| 218.165, east ramp endpoint | 0 / 0 | approximately 0 / 0 |
| 12 m beside midpoint | null / null | null / null |

World midpoint differs because the shared bank datum interpolates between the two mapped bridge ends while query ground samples the canal location. The endpoints compose to zero local road offset in both modes, preserving the loaded join datum. Both directions agree at every sample. These are renderer/API checks, not a real vehicle drive.

Final near/far/street captures were repeated after the last export: every capture reports `loaded: true`, `active: true` and the expected near/far detail. Read `tmp/top-cities/shots/pegasus-bridge/review-app-final-sheet.jpg` (Cityscape top row, Full 3D world bottom row), with reports in `review-app-cityscape/report.json` and `review-app-world/report.json` under the same shots root. The darker portal and rolling sectors remain readable; tower access and fascia remain present in both modes.

Cityscape and Full 3D world near/far visual placement, approach placement and both-direction height API: verified locally for this Protomaps/DEM session. HD lane paint remains not tested; mode/load/terrain lifecycle and hardware remain not tested. All owned source, exports, catalog and documentation are committed together on the isolated landmark branch for release; generated runtime bundles and ignored QA captures are excluded.

## Known approximations and remaining checks

No bascule animation, gears/interior machinery, quay/water model or lettering. Members, cabin/housing heights and operating fittings are photographic estimates. Sidewalks keep a simplified outer edge; the narrow leaf walkway is wider than its local OSM main-span outline by up to approximately 1.8 m, within the full bridge footprint envelope. The approach slab extends outside the structural footprint intentionally. Roof/cab overhang extends beyond cadastre tower shaft mask. These approximations are visible and not a survey.

Local `/osm-lanes` returns 503 without Redis, so HD lane widths/paint/dash continuity remain unverified. Live car/traffic simulation, late/missing terrain, failed loads, mode/reanchor/lifecycle matrix and Tesla hardware remain untested. Updated independent review remains for the coordinator; no shared renderer extensions or rollout changes were needed.
