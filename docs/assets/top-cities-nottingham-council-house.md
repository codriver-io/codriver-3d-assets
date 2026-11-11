# Nottingham Council House — Nottingham

Nottingham Council House: Portland-stone civic block, eight-column west portico and open ground loggia, octagonal drum, ribbed dome, four clocks and the upper lantern.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/Nottingham_Council_House)
- [Council: clock and bell restoration2025](https://www.mynottinghamnews.co.uk/nottinghams-council-house-clock-to-undergo-major-restoration-for-first-time-in-nearly-50-years/)
- [Visit Nottinghamshire:200 ft total dome height](https://www.visit-nottinghamshire.co.uk/things-to-do/nottingham-council-house-p626231/1000)
- [Picture Nottingham municipal archive: eight massive columns and roof sculpture](https://picturenottingham.co.uk/image-library/image-details/poster/ntgm008514/posterid/ntgm008514.html)
- [Exterior loggia detail: Vasa1628;CC BY-SA3.0; comparison only](https://commons.wikimedia.org/wiki/File:Ccl-hse-loggia-sml.jpg)
- [OSM provider footprint / building part 67187268](https://www.openstreetmap.org/way/67187268)
- [OSM provider footprint / building part 571743175](https://www.openstreetmap.org/way/571743175)
- [OSM provider footprint / building part 569318815](https://www.openstreetmap.org/way/569318815)
- [OSM provider footprint / building part 664459600](https://www.openstreetmap.org/way/664459600)
- [OSM provider footprint / building part 664459599](https://www.openstreetmap.org/way/664459599)
- [File:Nottingham Council House.jpg — Necrothesp at English Wikipedia; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Nottingham_Council_House.jpg)
- [File:Ccl-hse-lightnight2012.JPG — Vasa1628; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Ccl-hse-lightnight2012.JPG)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/nottingham-council-house/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-1.1515366,52.9520525,-1.1470634,52.9547475.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Overall finial | 60.96 m | Published200 ft; OSM pole60 m differs0.96 m |
| Main stone block | 21 m | OSM |
| Octagonal drum top | 32 m | OSM |
| Colonnade / dome spring / crown | 32–43 /43 /52 m | Mapped dome roofheight9 m |
| West pediment | 28.4 m | Photo-calibrated estimate |
| West portico | 8 columns | Municipal archive and checked photo |

Origin `[-1.1485605,52.953426]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Main west mapped corners [-1.1491981,52.9532376] and [-1.1492174,52.9535809] define the portico axis. The opposite east-edge control [-1.1480291,52.9536231] fixes scale and confirms the east-west plan skew. Dome center is averaged from the exact upper part rings, not placed on the west facade.

## Model and foundation

The exact mapped main footprint supports a stone shell with window rhythm, cornices and parapet. The west loggia is physically open between square piers, with a set-back inner wall; above it eight full-height columns carry the balcony entablature. The octagonal drum leads to a ring of round columns and a ribbed lead dome, with four texture-free clock faces cut into the base band. Upper lantern and finial remain in far. Courtyard interior, arcade shops, freestanding lions, inscriptions and sculptural figure details are omitted; roof sculpture, including urns, is omitted.

The published200 ft total60.96 m differs from OSM60 m highest pole; this model uses60.96 m and records the discrepancy. Main21 m and intermediate32/52/58 m levels follow OSM; column diameters, architectural subdivisions, dome curve and portico depth are photo-calibrated estimates. Clocks are geometric dials without numerals or lettering. No plaza surface or ground height is baked.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 8580 | 5 | 113444 |
| far | 5632 | 5 | 79012 |

Deterministic QA: `tmp/batch/nottingham-council-house-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/nottingham-council-house.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/nottingham-council-house/nottingham-council-house-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/nottingham-council-house/nottingham-council-house-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Self-review: two looks. The dome ribs are narrow pale meridians over a muted lead-grey shell, rather than broad alternating dark sectors. Both LODs keep eight supported portico columns, seven genuinely open ground arches, the open upper colonnade, four clocks, dome and lantern; restoration scaffolding in the full-building reference is excluded.

Runtime replacement ownership uses only the complete ground-owning Council House outline; the mapped elevated dome and tiny lantern/finial rings remain in PARTS and OSM_WAYS, avoiding sub4 m² replacement masks.

Independent-review revision: Seven low-cost original human relief silhouettes are embedded in the west pediment, subordinate to the eight-column portico; a ray test pins the central separate head and projection. This requested nit adds 812 near and 616 far triangles, with the dome, lantern, clocks, apertures and other geometry unchanged.

Far cost: 5016 → 5632 triangles; near updated only for the requested FIX/nit. Fresh exported contact sheet: `tmp/batch/revision/sheets/nottingham-council-house.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.
