# 20 Fenchurch Street — London

20 Fenchurch Street (the Walkie Talkie): continuously flaring glazed office body, pale vertical side fins, and the high arched Sky Garden crown, with a closed curved glass canopy and broad open-looking glazed front.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/20_Fenchurch_Street)
- [Rafael Viñoly Architects: 160 m tower and inverted massing](https://www.rvapc.com/works/20-fenchurch-street/)
- [CTBUH: 160.1 m architectural height](https://www.skyscrapercenter.com/london/20-fenchurch/3350)
- [City of London: 155 m alternative account](https://www.cityoflondon.gov.uk/things-to-do/architecture/modern-architecture/20-fenchurch-street)
- [OSM provider footprint / building part 201247295](https://www.openstreetmap.org/way/201247295)
- [OSM provider footprint / building part 365920476](https://www.openstreetmap.org/way/365920476)
- [OSM provider footprint / building part 949000311](https://www.openstreetmap.org/way/949000311)
- [OSM provider footprint / building part 949000329](https://www.openstreetmap.org/way/949000329)
- [OSM provider footprint / building part 949000356](https://www.openstreetmap.org/way/949000356)
- [File:Walkie-Talkie - Sept 2015 (cropped).jpg — Colin; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Walkie-Talkie_-_Sept_2015_(cropped).jpg)
- [File:The Walkie Talkie Sky Garden.jpg — sebastiandoe5; CC BY-SA 2.0; comparison only](https://commons.wikimedia.org/wiki/File:The_Walkie_Talkie_Sky_Garden.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/20-fenchurch-street/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-0.0853321,51.5102220,-0.0818679,51.5123780.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Crown apex | 160.1 m | CTBUH; architect rounds to 160 m, City account says 155 m |
| Office wall / Sky Garden datum | 134.75 m | Mapped building-part profile |
| Main floor pitch | 3.85 m | Mapped storey elevations |
| Lower and upper plan | Mapped continuously varying profiles | 17 main storey profiles with mapped side strips |
| Arched crown eaves | 142.45 m | Mapped upper-part datum; curved roof profile photo-calibrated |
| Side fins, glazing divisions and arch frame | See generator | Photo estimates; partitioned surfaces |

Origin `[-0.08354,51.51127]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Controls [-0.0837612,51.5114978] and [-0.0832093,51.5114389] fix the roughly 99.7° frontage edge. The opposite frontage [-0.0838686,51.5111059] to [-0.0833167,51.5110469] confirms orientation. Profile rings are converted directly to metric east/south; the crown axis follows those controls and geographic rotation is baked once.

## Model and foundation

Body cross-sections derive from the exact mapped storey rings plus the curved side strips, resampled by rays from a common centre. Interpolation gives a continuous flare rather than a stack of differently sized boxes. Near keeps 64 facade sectors and every office row; far retains 32 sectors with coarser distinct panes. The pale fin effect is an adjoining facet partition on side faces, avoiding coplanar overlays. Above the 134.75 m floor, the Sky Garden expands to the mapped roof envelope under a barrel-like arch that reaches 160.1 m. The roof and wide arched facade frame remain in far. All components sit on the rigid y=0 foundation or meet the supporting office/crown surfaces. The separate south annex is outside modeled ownership; no surrounding paving or terrain surface is authored.

Height accounts differ: CTBUH 160.1 m is used, architect rounds to 160 m and the City page says 155 m. Body plan and intermediate heights follow OSM parts; smooth interpolation, crown vault, glazing, fin thickness and facade rhythm are photo-calibrated estimates. Sky Garden interior, roof machinery, maintenance cranes, logos and lettering are omitted. All 212 replaced mapped ways/parts are enumerated in footprint.js; separate south annex excluded.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 21259 | 6 | 263436 |
| far | 5794 | 5 | 88636 |

Deterministic QA: `tmp/batch/20-fenchurch-street-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/20-fenchurch-street.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/20-fenchurch-street/20-fenchurch-street-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/20-fenchurch-street/20-fenchurch-street-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Two visual looks. The first found a low-storey kink caused by missing mapped side-strip ways; the low intermediate ring now interpolates between the adjacent existing profiles. Brighter upper Sky Garden panes and horizontal transoms distinguish the arched crown from the office wall. Final exported near/far and dark views retain the broad upper flare and arched roof; the top view remains inside the mapped ownership ring. The canopy is clipped to the mapped plan with matching wall/roof edge heights; collapsed corner quads are removed and all source normals are unit length. No interior or restricted reference material is included. The complete outer ring owns all 212 listed provider parts; tiny rib rings are retained as source data rather than separate runtime masks.

Post-delivery far-window audit: the dark far spandrels blended into the glass at road scale. Far-only0.70 m pale transoms now separate the18 coarse office rows; adjoining partitions keep the same silhouette and triangle count, and the far material batch count drops to5. A side-ray regression requires repeated pale transoms and no glass run over8 m; export, conformance, metrics and depth checks pass with zero flags/cycles. Near geometry is unchanged; updated exported sheets were inspected.
