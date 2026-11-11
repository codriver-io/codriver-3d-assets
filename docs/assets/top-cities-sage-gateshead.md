# The Glasshouse (Sage Gateshead) — Gateshead

The Glasshouse, formerly Sage Gateshead: a continuous undulating stainless-steel shell, three broad roof crests, large gridded glass bays and high, recessed west/east porches.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/The_Glasshouse,_Gateshead)
- [Tyne and Wear municipal heritage record: undulating sheath, four80 m primary arches and wide end porches](https://twsitelines.info/SMR/12743)
- [RIBA: Foster-designed Gateshead music centre](https://www.riba.org/explore/competitions/the-sage-gateshead/)
- [Venue: current identity and building](https://theglasshouseicm.org/)
- [OSM provider footprint / building part 36971484](https://www.openstreetmap.org/way/36971484)
- [File:Gateshead - The Glasshouse International Centre for Music.jpg — Benjamin Smith; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Gateshead_-_The_Glasshouse_International_Centre_for_Music.jpg)
- [File:The Sage Building (1186227427).jpg — Tony Hisgett from Birmingham, UK; CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:The_Sage_Building_(1186227427).jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/sage-gateshead/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-1.6051298,54.9661034,-1.5988702,54.9696966.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Roof maximum | approximately40 m | Published secondary estimate; no OSM height |
| Owned mapped envelope | about119 ×111 m east/south bounds | Exact OSM outline |
| Primary arch span | Source maximum80 m | Heritage record; structural span differs from exterior envelope |
| End porch setback | approximately4 m | Photo-calibrated estimate |
| Roof crests/valleys and curtain grid | Photo estimates | Original mathematical surface |

Origin `[-1.60205,54.9677]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

North facade controls [-1.6029924,54.9678136] to [-1.6013314,54.9681356] define the roughly19 degree north-of-east longitudinal direction. The opposite low perimeter controls [-1.6024581,54.9671838] and [-1.6011321,54.9674219] constrain cross-width and scale. Original metric geometry uses the exact provider outline for ground ownership and an explicitly reconstructed overhanging shell, with orientation baked once.

## Model and foundation

A continuous original swept shell uses the mapped transverse extents, with broad unequal roof crests, shallow valleys and a closed crown. Stainless panels and gridded glass are adjacent skin partitions rather than coplanar overlays. The near shell samples all mapped transverse control stations; far has fewer panels but the same roof peaks and glazed bays. Both ends have real canopy overhangs in front of setback glass portal walls, closed edges and a visible underside. The roof bridges small concave mapped entrance recesses as an estimated canopy envelope. Internal concert-hall boxes, plaza, riverbank, bridges, signs and lettering are excluded.

The standing venue is now The Glasshouse; the stable asset id retains the selected historic Sage name. Overall height40 m, roof surface, panel grid, end-wall positions and canopy thickness are photo-calibrated estimates rather than a measured roof survey. OSM supplies the ground outline but no height; mapped ownership is not evidence of app terrain integration. Photos1 and3 show the current exterior shell and opposite end porch; the silhouette/night and distant bridge photos are supplementary only.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 41718 | 4 | 551716 |
| far | 4349 | 4 | 67644 |

Deterministic QA: `tmp/batch/sage-gateshead-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/sage-gateshead.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/sage-gateshead/sage-gateshead-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/sage-gateshead/sage-gateshead-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Self-review: two looks. The final shell uses muted blue-grey metal and a clearer pale trim around both wide arched mouths; glazing stands behind those actual overhangs. The three unequal crests and intervening valleys remain in far. Both LODs retain the mapped transverse control stations so the curved glass walls keep individual pane widths and coverage; far reduces longitudinal roof panels and horizontal portal rows. Near/far roof and porch ray tests pass, with zero QA flags and zero dropped depth cycles.

Independent-review revision: Both LODs use coherent muted silver instead of periodic contrasting roof panels. Far keeps the three unequal crests, gridded glazing and real setback end porches with 18 longitudinal by 32 transverse roof divisions; unneeded metal panel grid and hidden soffit subdivisions are removed. Near geometry dimensions and triangle count are unchanged; only the requested material nit changes its GLB.

Far cost: 11274 → 4349 triangles; near updated only for the requested FIX/nit. Fresh exported contact sheet: `tmp/batch/revision/sheets/sage-gateshead.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.
