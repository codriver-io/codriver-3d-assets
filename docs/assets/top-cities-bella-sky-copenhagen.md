# Bella Sky — Copenhagen

Bella Sky: the two76.5 m leaning hotel towers with different upper/lower bends, a narrow glazed skybridge, white triangular panel rhythm and blue-green glazing above the mapped conference podium.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/AC_Hotel_Bella_Sky_Copenhagen)
- [DAC:76.5 m,20 m lean,12 degree upper/lower bends and skybridge](https://dac.dk/en/magazine/places/bella-sky-205)
- [LE34 as-built survey:15 degree inclination and20 m displacement](https://www.le34.dk/en/projects/bella-sky-hotel/)
- [CTBUH:23 floors, upper10/lower14 horizontal shift and triangular facade](https://www.skyscrapercenter.com/copenhagen/bella-sky-tower-2/11199/)
- [OSM provider footprint / building part 178572487](https://www.openstreetmap.org/way/178572487)
- [OSM provider footprint / building part 445431611](https://www.openstreetmap.org/way/445431611)
- [OSM provider footprint / building part 445431613](https://www.openstreetmap.org/way/445431613)
- [OSM provider footprint / building part 1092646295](https://www.openstreetmap.org/way/1092646295)
- [File:Bella Sky 1.jpg — DanNav; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Bella_Sky_1.jpg)
- [File:Bella Center og Bella Sky.JPG — Orf3us; CC0; comparison only](https://commons.wikimedia.org/wiki/File:Bella_Center_og_Bella_Sky.JPG)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/bella-sky-copenhagen/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=12.5749168,55.6375034,12.5812832,55.6410966.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Tower tops | 76.5 m | DAC and mapped parts |
| Main lean | 20 m outward displacement | LE34;14.65° over76.5 m, published rounded15° |
| Upper/lower secondary bend | 12° after43.2 m / below43.2 m | DAC angle; kink height estimated from23 floors and10 upper floors |
| Podium | 11 m | OSM |
| Skybridge | 71.5–76.5 m | OSM vertical levels; DAC describes75 m |

Origin `[12.5781,55.6394]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Mapped long edges [12.5778198,55.6395627]–[12.5785951,55.6394627] and [12.5775425,55.639179]–[12.5783703,55.6390591] set the12.9° east/south frame and both exact base rings. The mapped2D skybridge is a geographic alignment control, not a3D as-built endpoint survey. Its model endpoints are fitted to the reconstructed upper inner facades. Runtime replacement masks include the swept upper overhangs as well as exact base ownership; nearby Bella Center halls and Bella Arena are excluded.

## Model and foundation

Both towers use separate piecewise leaning skins in metres, including the different kink heights. Adjacent white, blue-green and narrow frame polygons create the triangular hotel-room facade, with a glazed upper storey. Far retains coarser triangles and floor rows on every side. The enclosed skybridge has a real underside and side windows; both ends penetrate their named tower skins. The low podium retains its mapped outline and window bays. The open space between towers is genuine geometry, with no giant joining block.

Completed2011 permanent exterior; photos7–8 checked as opposite exterior views, while initial1–2 are interiors,3 signage and5–6 views away from the building, all excluded. The20 m main lean is sourced; transverse kink positions, exact twist distribution and upper bridge alignment are reconstructed estimates from the published12° bend and photos because OSM supplies no3D floor profiles. No name signs, hotel logos, flags, rooftop maintenance gear, surrounding arena or conference halls are shipped.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 12633 | 6 | 193816 |
| far | 4193 | 6 | 79708 |

Deterministic QA: `tmp/batch/bella-sky-copenhagen-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/bella-sky-copenhagen.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/bella-sky-copenhagen/bella-sky-copenhagen-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/bella-sky-copenhagen/bella-sky-copenhagen-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Author review used two looks; the second restored the contrasting glazed top storey. The near/far skins retain floor rows, triangular panes, both bends and a fully joined skybridge. Exact twist distribution and upper bridge alignment remain photo-calibrated estimates for independent review.
