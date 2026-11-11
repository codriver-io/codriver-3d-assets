# One Canada Square — London

One Canada Square: stainless-steel office tower with its four stepped shoulder wings, fine regular window grid, recessed upper storeys and the unmistakable silver pyramidal crown.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/One_Canada_Square)
- [Pelli Clarke & Partners: completed tower, 235 m](https://pcparch.com/work/one-canada-square-and-docklands-light-railway-station)
- [CTBUH: 236 m alternative height](https://www.skyscrapercenter.com/london/one-canada-square/1040)
- [OSM provider footprint / building part 5986754](https://www.openstreetmap.org/way/5986754)
- [OSM provider footprint / building part 432777467](https://www.openstreetmap.org/way/432777467)
- [OSM provider footprint / building part 432777466](https://www.openstreetmap.org/way/432777466)
- [OSM provider footprint / building part 269726619](https://www.openstreetmap.org/way/269726619)
- [OSM provider footprint / building part 269726620](https://www.openstreetmap.org/way/269726620)
- [OSM provider footprint / building part 269726621](https://www.openstreetmap.org/way/269726621)
- [OSM provider footprint / building part 269726622](https://www.openstreetmap.org/way/269726622)
- [File:One Canada Square, Canary Wharf (south side).jpg — The wub; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:One_Canada_Square,_Canary_Wharf_(south_side).jpg)
- [File:Canada Wharf (6905220480).jpg — Tony Hisgett from Birmingham, UK; CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Canada_Wharf_(6905220480).jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/one-canada-square/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-0.0212318,51.5040220,-0.0177682,51.5061780.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Pyramid tip | 235 m | Architect and OSM; CTBUH 236 m differs by 1 m |
| Main shoulders | 194 m | Four mapped building parts |
| Recessed upper block | 210 m | Mapped part 432777467 |
| Pyramid rise | 25 m | Mapped roof:height on 432777466; published 40 m accounts are inconsistent with this mapped roof datum |
| Footprint and crown plan | Exact OSM rings | Mapped geometry; roughly 66 m lower envelope and 38 m crown width |
| Main office grid | 50 storeys, roughly 3 m bays | Storey count published; window pitch and frame thickness photo estimates |

Origin `[-0.019495,51.504931]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Mapped upper-block controls [-0.0198052,51.5051561] and [-0.0190883,51.5050804] fix the approximately 99.7° edge bearing; the opposite edge [-0.0191932,51.5047059] to [-0.0199047,51.5047856] confirms the skew. All footprint vertices are transformed directly into east/up/south; rotation is already baked into the GLBs.

## Model and foundation

The lower wall follows the detailed stepped outer ring to the 194 m shoulder level. A separate narrower upper block reaches 210 m and carries the mapped square pyramid. Separate rows and columns of inset-coloured glazing are partitions of the facade plane, with no overlapping frame/window surfaces. Far coarsens the grid, keeps the stepped shoulders and complete pyramid, and retains coarser horizontal crown louvers. The base sits rigidly at y=0; surrounding Canary Wharf landscaping, adjacent pavilions and other towers are excluded.

235 m architect height is used; CTBUH lists 236 m. The mapped pyramid rises 25 m from a 210 m upper block; a 40 m pyramid claim in secondary descriptions is not treated as a surveyed value. Facade grid, entry framing and louver pitch are photo estimates. No lettering or roof beacons are modeled.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 20429 | 5 | 239732 |
| far | 5969 | 5 | 76736 |

Deterministic QA: `tmp/batch/one-canada-square-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/one-canada-square.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/one-canada-square/one-canada-square-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/one-canada-square/one-canada-square-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

The inspected contact sheet shows the broad mapped lower ring, four shoulder setbacks, upper square block and complete louvered pyramid in both LODs. The checked close crown photograph confirms the steeper 25 m mapped roof profile; the 40 m secondary figure is not silently used. Consolidating adjacent frame jambs reduced near cost from 27,173 to 20,429 triangles while keeping every pane. Top view follows the skewed red rings without an extra host rotation; far/night keeps separate window rows and the complete silver crown. One visual look, no unresolved geometry flags.

Independent-review revision: Glass is neutralised from green toward muted silver-grey in both palettes. Geometry, pyramid crown and separated facade grid are unchanged in both LODs.

Far cost: 5969 → 5969 triangles; near updated only for the requested FIX/nit. Fresh exported contact sheet: `tmp/batch/revision/sheets/one-canada-square.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.
