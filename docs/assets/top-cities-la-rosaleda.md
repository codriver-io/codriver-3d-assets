# La Rosaleda Stadium — Málaga

Original current La Rosaleda stadium: open two-tier blue seating bowl, two opposed long-side roofs, outward-raking pale ribs, glazed concourses, open end stands and roof-mounted floodlight bars.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/La_Rosaleda_Stadium)
- [OSM relation/11059898](https://www.openstreetmap.org/relation/11059898)
- [OSM way/799047590](https://www.openstreetmap.org/way/799047590)
- [OSM relation/11059899](https://www.openstreetmap.org/relation/11059899)
- [OSM way/180851874](https://www.openstreetmap.org/way/180851874)
- [OSM way/799047579](https://www.openstreetmap.org/way/799047579)
- [OSM way/949455804](https://www.openstreetmap.org/way/949455804)
- [OSM way/949455805](https://www.openstreetmap.org/way/949455805)
- [OSM way/949455806](https://www.openstreetmap.org/way/949455806)
- [OSM way/949455807](https://www.openstreetmap.org/way/949455807)
- [Club official: current stadium and105×68m playing dimensions](https://www.malagacf.com/en/stadium)
- [Municipality March2026: replacement-location study, not a completed new stadium](https://deporte.malaga.eu/noticias/detalle-de-la-noticia/?id=177579)
- [File:Málaga Estadio de Fútbol La Rosaleda.20121231.jpg — Epizentrum; CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:M%C3%A1laga_Estadio_de_F%C3%BAtbol_La_Rosaleda.20121231.jpg)
- [File:IMG-20220228-WA0055.jpg — Meloptido; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:IMG-20220228-WA0055.jpg)
- [File:Preferencia Rosaleda.jpg — Morancio; Public domain; comparison only](https://commons.wikimedia.org/wiki/File:Preferencia_Rosaleda.jpg)
- [File:La Rosaleda 2014.jpg — Leo Hidalgo (@yompyHERE); CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:La_Rosaleda_2014.jpg)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Playing lines | 105 ×68 | MálagaCF official stadium page |
| Main exterior | about135 ×185 | OSMstadiumrelation11059898 |
| Long-side canopies | about25wide ×101long | Mappedroofways180851874/799047579 |
| Main roof height | 25.2 | OSM25m;0.2m fascia estimate |
| Seating rear | 23.5 | Photo estimate |
| Floodlight bars | 31.8 | Photo estimate, not published total |

Origin: [-4.42659075,36.734251650000004]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw -3.814197282755949 degrees is baked from the controls [[-4.4261018,36.7346445],[-4.4258248,36.7346297]]; the host must not rotate again. Footprint ownership: relation/11059898, way/799047590, relation/11059899, way/180851874, way/799047579, way/949455804, way/949455805, way/949455806, way/949455807. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

Models the existing stadium, not the proposed replacement or future WorldCup design. Geometry follows mapped east/west roof alignment, with open end stands and a105×68m playing-line rectangle. Grouped seating rows are original geometry, without chair logos, lettering, sponsors or club emblems. Near47 row bands and far24 retain both tiers and aisles. Ground-level turf/apron sit0.15–0.18m above local grade; field lines0.30m. Floodlight height and fine roof framing are estimates. Exteriorphoto4 and open-air bowlphotos1–3 show the same current structure; club2026 stadium information confirms the existing venue while replacement studies remain proposals. South ticket/concourse appendix is included; unrelated nearby school and bridge are excluded. All footing/roof end contacts tested; actual DEM and road contacts not tested.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 20750 | 8 | 345972 |
| far | 5988 | 8 | 139124 |

Metrics: `tmp/batch/la-rosaleda/metrics.json`, no flags. Contact sheet: `tmp/batch/final/la-rosaleda.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/la-rosaleda/la-rosaleda-procedural-near-light-top.png`. The open blue bowl, two short mapped roofs, ground-supported raking fins/ribs and floodlight bars were compared with the exterior and open-air bowl photos. One visual correction exposed the full end-fin profile and darkened turf/seats. All named bearing probes pass; hidden top caps and overlapping canopy skin edges were removed, leaving no metrics flags or dropped cycles. Seating rows and facade rake remain bounded original approximations. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

The rounded seating and end fins are authored plan approximations within a few metres of the mapped stadium, not a survey. A bounded third projection ring records all modeled geometry; mapped rings remain separate and every provider relation/part/member is named. Thirteen solid raking fins on each open end retain the roadside silhouette. Hidden back-wall top caps and overlapping canopy skin edges were removed; named pad/fascia/light-bar contacts are probed in both LODs, including a shortened roof-beam negative control.

One visual correction raked the rear concourse facade inward and moved the end-fin footings forward, exposing the full roadside fin/rib profile instead of hiding it behind a vertical box. Blue seating and turf were darkened to the photographs; the field, open ends and two short roofs remain intact. Facade rake is an estimated0.35m per vertical metre, not a surveyed structural drawing.

## Independent-review follow-up

Far retains all 24 distinct seating rows, both blue tiers, the open pitch/bowl, separated exterior glazing rows, mapped roof lengths and all six floodlight bars. Straight contour subdivisions were removed, curved corners use three arc segments, and roof ribs group to six supported stations per canopy; the pad-count assertion is updated to 76 triangles while every remaining foot/beam endpoint is still ray-tested against named bearings. Near geometry is unchanged. Opening the accepted closed concourse into a new undercroft is deferred because it requires a reference-led structural redesign, not deletion of its existing ground supports.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/la-rosaleda.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.
