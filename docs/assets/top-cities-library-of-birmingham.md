# Library of Birmingham — Birmingham

Library of Birmingham: offset cantilevered glass and muted gold volumes, three roof terraces, a physical screen of interlocking metal circles and the golden Shakespeare Memorial Room rotunda.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/Library_of_Birmingham)
- [Mecanoo: cantilever, interlocking-circle skin, roof terraces and gold rotunda](https://www.mecanoo.nl/projects/project/57/library-of-birmingham?t=0)
- [OSM provider footprint / building part 195934961](https://www.openstreetmap.org/way/195934961)
- [OSM provider footprint / building part 238700642](https://www.openstreetmap.org/way/238700642)
- [OSM provider footprint / building part 238700643](https://www.openstreetmap.org/way/238700643)
- [OSM provider footprint / building part 239275918](https://www.openstreetmap.org/way/239275918)
- [OSM provider footprint / building part 239275919](https://www.openstreetmap.org/way/239275919)
- [OSM provider footprint / building part 240386329](https://www.openstreetmap.org/way/240386329)
- [File:Library of Birmingham (32958941706).jpg — Alex Liivet from Chester, United Kingdom; CC0; comparison only](https://commons.wikimedia.org/wiki/File:Library_of_Birmingham_(32958941706).jpg)
- [File:Library of Birmingham Facade crop.jpg — Soerfm; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Library_of_Birmingham_Facade_crop.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/library-of-birmingham/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-1.9100649,52.4783424,-1.9059351,52.4808576.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Rotunda top | 60 m | OSM estimated height |
| Upper silver volume | 44–52 m | OSM |
| Gold middle volume | 29–44 m | OSM |
| Lower cantilever | 12.5–25 m | OSM |
| Lower terrace wall | 25–29 m | OSM |
| Circle-screen cells | approximately4.8 m near, coarser far | Photo-calibrated exterior rhythm |

Origin `[-1.90849,52.47972]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Main facade control [-1.9087007,52.4793275] to [-1.9078837,52.4795591] and its opposite edge [-1.9091029,52.4798505] to [-1.9082783,52.4800778] fix the baked facade azimuth. All six building-part outlines retain their mapped metric positions; the gold rotunda is centered on its own mapped ring. The neighbouring REP, Baskerville House and Centenary Square remain outside owned replacement footprints.

## Model and foundation

The lower glazed plinth is genuinely recessed behind the12.5 m cantilever soffit. The offset mapped silver and muted gold volumes expose stepped terraces and carry a separate closed metal-circle screen, joined by perimeter rails and discrete brackets to the facade. Near has large interlocking circles plus the smaller offset circles; far retains coarser large rings and the same massing. The golden rooftop rotunda has fine vertical panel divisions and a closed cap. Hidden internal roofs/walls are removed. The interior book rotunda, subterranean circular courtyard, roof planting detail, rooftop public furniture, logos and lettering are excluded.

All absolute heights are OSM estimates; the architect establishes the stacked form and program but not these levels. Screen radii, metallic section sizes, facade setback, glazing modules and rotunda panel count are exterior-photo estimates. Published bright gold is represented by a muted ochre; no emissive lighting is added. Photos3 and4 show the exterior massing and actual circle detail; interior photos1 and2 are rejected.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 51624 | 6 | 726148 |
| far | 4706 | 6 | 70888 |

Deterministic QA: `tmp/batch/library-of-birmingham-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/library-of-birmingham.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/library-of-birmingham/library-of-birmingham-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/library-of-birmingham/library-of-birmingham-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Self-review: two looks. Near includes the larger closed rings, offset small rings and extra inner circles at alternating bays; the reduced far screen keeps large open rings on all three screened volumes. The final palette uses muted gold, alternating glazed/silver bays and an unchanged golden rooftop rotunda; cantilever openings and every bracket contact pass geometric tests.

Independent-review revision: Far rings retain their centres and diameters but use12-segment front-facing annular strips (3.41% chord error) with thin two-sided support brackets, replacing hidden tube faces. Near rings and all near geometry remain byte-identical; the named circle motif now fits below6000 far triangles.

Far cost: 10418 → 4706 triangles; near GLB byte-identical. Fresh exported contact sheet: `tmp/batch/revision/sheets/library-of-birmingham.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.
