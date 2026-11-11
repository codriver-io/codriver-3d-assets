# 8 Canada Square — London

8 Canada Square in its original completed exterior: softly rounded square glass tower, close horizontal silver spandrel bands, widened glazed entrance podium and a pale perimeter crown around recessed roof plant.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/8_Canada_Square)
- [AFK: original 200 m, 2002 tower and retrofit context](https://www.afkstudios.com/projects/8-canada-square-tower/)
- [CTBUH: completed building and architect](https://www.skyscrapercenter.com/building/8-canada-square/1719)
- [OSM provider footprint / building part 5986805](https://www.openstreetmap.org/way/5986805)
- [OSM provider footprint / building part 183242123](https://www.openstreetmap.org/way/183242123)
- [OSM provider footprint / building part 432780680](https://www.openstreetmap.org/way/432780680)
- [OSM provider footprint / building part 432780681](https://www.openstreetmap.org/way/432780681)
- [OSM provider footprint / building part 432780682](https://www.openstreetmap.org/way/432780682)
- [OSM provider footprint / building part 432780683](https://www.openstreetmap.org/way/432780683)
- [OSM provider footprint / building part 432780684](https://www.openstreetmap.org/way/432780684)
- [OSM provider footprint / building part 432985855](https://www.openstreetmap.org/way/432985855)
- [OSM provider footprint / building part 432985936](https://www.openstreetmap.org/way/432985936)
- [File:HSBC Tower - September 2012.JPG — Retignano; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:HSBC_Tower_-_September_2012.JPG)
- [File:London MMB »1M1 HSBC Tower.jpg — mattbuck (category); CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:London_MMB_%C2%BB1M1_HSBC_Tower.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/8-canada-square/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-0.0196762,51.5044322,-0.0159238,51.5067678.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Architectural top | 200 m | Published; OSM 199.5 m differs by 0.5 m |
| Main glass wall | 186.3 m | Mapped part 432780680 |
| Roof equipment | 191 / 197 m | Mapped parts 432985855 / 432985936 |
| Rounded-square tower plan | Exact OSM ring | Way 5986805, roughly 60 m sides with corner chamfers |
| Podium | 8 m | Height estimated; plan from 183242123 |
| Glazing/spandrel grid | 40 rows above podium; coarser far | Photo estimate consistent with 42 mapped office levels |

Origin `[-0.01744,51.505435]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Mapped facade controls [-0.0177588,51.5057422] and [-0.0169788,51.5056569] fix the 99.9° long frontage edge. The opposite side [-0.0171234,51.5051282] to [-0.0178926,51.5052113] verifies the same skew. Direct geographic ring conversion bakes the orientation once.

## Model and foundation

The original 2002 tower is modeled; proposed retrofit designs are excluded. The expanded podium follows its separate mapped envelope. Above it, the main glazed wall follows all mapped corner chamfers, with horizontal metal spandrels and separate pane bays. Four perimeter roof-screen wings rise above the recessed two-stage plant. The roof well remains open to the lower plant roof rather than becoming a solid white cap. Far retains rounded corners, close horizontal rhythm, pale crown and recessed plant. All components meet the rigid local foundation or their actual supporting roof; no plaza, surrounding trees, lions, adjoining buildings or terrain are included.

Published 200 m height is chosen over OSM 199.5 m; a 0.5 m difference. Main glass elevation and roof-plant levels follow mapped parts. Podium height, mullion pitch and minor mechanical details are photo estimates. The historic completed exterior is retained while retrofit proposals are unbuilt. Logos and lettering are omitted.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 17885 | 5 | 207472 |
| far | 5429 | 5 | 71008 |

Deterministic QA: `tmp/batch/8-canada-square-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/8-canada-square.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/8-canada-square/8-canada-square-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/8-canada-square/8-canada-square-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

The first comparison showed overly heavy vertical mullions; narrowing them restored the photo's dominant horizontal spandrel rhythm. The final light contact sheet, far/night sheet and top red-ring view preserve the rounded corners, mapped skew, expanded podium and recessed roof well. Both completed-era exterior references were checked; adjoining Canary Wharf buildings and the lion close-ups were not used to infer the tower massing. Two visual looks; no unresolved flags.
