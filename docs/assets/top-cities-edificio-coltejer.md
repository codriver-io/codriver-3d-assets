# Edificio Coltejer (Medellín)

Stable asset ID: `edificio-coltejer`. An original procedural model of **Edificio Coltejer** (Centro Coltejer), Avenida La Playa #47-42, La Candelaria, Medellín. Raúl Fajardo Moreno with Esguerra Sáenz y Samper, Hernando Vélez and Jorge Manjarrés; structural engineer Jaime Muñoz Duque; contractor Rafael Pacheco. Built 1968–1972 on the site of the Edificio Gonzalo Mejía. Part of the [top-cities landmarks](../top-cities-landmarks.md); source in `src/peregrine/landmarks/top-cities/edificio-coltejer/`.

## Identity and what a driver sees

A concrete office slab, 175 m to the ridge, whose **long faces are a grid of vertical fins and dark glass** and whose **short ends are near-white**, each with one column of small square windows. The ends slope together above the eave into a **needle**. Just under the peak each gable has a **dark horizontal slot** (the lookout on floor 34, the "eye" of the needle), and two flagstaffs with small flags stand off the ridge. A low wing fills the bulge on the north-east side of the mapped lot. At 800 m it is a white needle beside a darker gridded slab; at 100 m it is the fins, the window column, the eye and the two flags. The view that names it is the west corner, toward Plaza Botero.

The three basements, the interior, lettering, and the neighbouring blocks are not modelled. The flags are unlettered metal quads, not the Colombian and Antioquian colours.

## Sources

| Source | What it gave |
| --- | --- |
| [OSM way 31973359](https://www.openstreetmap.org/way/31973359) | The outline (1,258 m²), `building=office`, `building:levels=38`, `addr:street=Calle 52`, `addr:housenumber=47-42`, `alt_name=Centro Coltejer`. A 36.4 m × 29.1 m parallelogram plus a 206 m² wing off the north-east long wall |
| [Wikipedia, Coltejer Building](https://en.wikipedia.org/wiki/Coltejer_Building) | Roof 175 m, 36 floors, 42,000 m², 11 elevators, completed 1972, architects Fajardo Moreno, Saldarriaga, Samper and Manjarrés |
| [Wikipedia, Centro Coltejer](https://es.wikipedia.org/wiki/Centro_Coltejer) | Altura arquitectónica 175 m, 37 plantas, east and west lookouts on floor 34, shaft windows to the north and south, two blades above the salon, flags of Colombia and Antioquia |
| [Skyscraper Center](https://www.skyscrapercenter.com/building/centro-coltejer/3473), [Wikidata Q3057904](https://www.wikidata.org/wiki/Q3057904) | 175 m, 37 floors above grade |
| Photographs (below) | Which face is finned, which is white, the eye as a horizontal slot, the two staffs above the peak |

OSM geometry was read from the dossier `tmp/top-cities/edificio-coltejer/osm.json` (© OpenStreetMap contributors, ODbL 1.0).

Reference photographs, all Wikimedia Commons, kept in the ignored `tmp/top-cities/edificio-coltejer/refs/` and never committed: "Coltejer-Medellin.jpg" (laloking97, CC BY-SA 2.0; the massing photo), "2018 Torre Coltejer en contrapicado.jpg" (Felipe Restrepo Acosta, CC BY-SA 4.0; the fin grid), "Plaza Botero7.JPG" (Staticshakedown, CC BY-SA 3.0), "Edificio Coltejer-Medellin.jpg" (laloking97, CC BY-SA 2.0), "BOGOTA CITY.jpg" (Kevin Castañeda Villamil, CC BY-SA 4.0; a distant skyline, little use). No photograph, texture or scan is in the repository or the GLBs.

## Frame

Real metres, +X east, +Y up, +Z south, `y = 0` local flat-map grade. Origin `[-75.5660596, 6.2501496]` is the area centroid of way 31973359. The tower is the parallelogram on ring vertices 1, 0, 2 and 6; its own centre is about (−3.0, +2.2) m, because the wing pulls the centroid off the shaft. Nothing is baked for terrain, sea level or latitude stretch. `frontageBearing` 210 is the outward bearing of the south-south-west finned face (the long wall opposite the wing). That face is taken as Avenida La Playa; it was not checked against a street centreline.

The lot is one block on the valley floor. Grade under the ring is expected to vary by less than 2 m, so the spec keeps `padM` 50 and sets no `terrainPad`. Full 3D world was not tested.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Concrete ridge | 175 m | **Sourced** (Wikipedia roof / altura arquitectónica, Skyscraper Center) |
| Flagstaff tips | 183 m (8 m above the ridge) | **Estimated**. The alcaldía's poles are about 14 m and were added later; 8 m still reads above the needle without leaving the declared-height allowance |
| Eave | 143.2 m, where the vertical shaft ends and the gables start | **Estimated** from the photographs (the white slope is roughly the top fifth) |
| Podium | 14.2 m, three commercial floors | **Estimated** (three commercial floors are described; the height is not) |
| Shaft | 32 floors at 4.03 m | **Estimated** pitch. Floor counts of 36 and 37 are both published; the model does not try to hit either count with a storey line |
| Plan | parallelogram 36.18 m × 29.10 m, bearing 119.8° / 29.5° | **Mapped** (mean of the long edges, the short edges) |
| Taper | 4.5% from the podium to the eave, in plan | **Estimated** (the shaft reads slightly narrower at the top) |
| North inset | an extra 0.9 m on the t=1 wall | **Hedge**. The ring leaves that corner on a shorter edge than the parallelogram, and full-depth fins crossed it |
| Fins | 0.58 m wide, standing 0.28 to 0.95 m off the backing; 18 bays near, 12 far | **Estimated** from the contrapicado photograph |
| Eye | slot from 160.8 to 162.6 m, about 5 m wide, set 1.35 m back in each gable | **Estimated**. Floor 34 and "east and west" are **sourced**; the size is read from the massing photo |
| Wing | roof at 14.2 m over the mapped bulge | **Mapped** outline; height **estimated** (it is a podium, not a second tower) |
| Windows on the ends | one 1.56 m square per shaft floor, centred (every other floor when far) | **Estimated** from the massing photo |

## Materials

| Name | Use | Light | Dark |
| --- | --- | --- | --- |
| `concrete` | Fins, spandrels, mullions, podium, wing, pilasters | `#b5afa2` | `#6e6a63` |
| `end` | White gable walls and the two roof slopes | `#f6f3ec` | `#b4b1a8` |
| `glass` | Unlit shaft glass, podium shopfronts, wing shopfronts | `#3c4852` | `#161d24` |
| `glow` | Scattered lit office panes, unshaded | `#7e97a8` | `#f0c48a` |
| `light` | The eye, unshaded: a dark slot by day, warm at night | `#1c2830` | `#e7b56a` |
| `metal` | Flagstaffs and the two flags | `#9aa1a6` | `#5e656b` |

The runtime layer shades each vertex from its normal. `glow` and `light` stay at full palette colour.

## Modelling decisions

- **Parallelogram plus one wing.** The outline is not a box. The shaft is the bilinear patch on the four corners that actually form the tower; the three vertices that stick out to the north-east are a low annex. A fan from the tower edge crossed the concave kink, so the annex roof is three triangles that stay inside the bulge.
- **The needle is a gable along the long axis.** Each short end closes from the full width at the eave to a point at 175 m. The long faces stay vertical up to the eave, then the roof slopes are the white blades. That is the silhouette in "Coltejer-Medellin.jpg": a finned face beside a white face that slopes to a peak.
- **The eye is a recess, not a hole.** A dark pane sits 1.35 m behind the gable, with white jambs. It does not pierce the tower. By day it is dark; at night the same material is warm.
- **Fins are one rib per bay line**, not a box per window. Near adds a single mullion quad in each bay and one spandrel band per floor across the whole face. Glass, mullion, spandrel and fin sit on different depths (0.16, 0.40, 0.30–0.58, 0.28–0.95 m) so different materials do not share a plane.
- **Far LOD** keeps the same outer envelope, the same 32 floor bands, the eye, the staffs and the wing, drops the mullions, and uses 12 bays instead of 18. Bounds match near exactly.

## Approximations and gaps

- Bay count, fin size, eave height, podium height, taper and the eye's exact rectangle are read from photographs.
- The staffs are 8 m, shorter than the published later addition of about 14 m. The concrete ridge stays at the cited 175 m.
- Which long face is La Playa is inferred from the wing sitting on the opposite side, not from a street centreline.
- The flags have no colour and no emblem. The two "cuchillas" above the salon are the roof slopes, not separate blades.
- The north wall steps in 0.9 m from the parallelogram so the fins stay on the lot.

## Cost

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 8,785 | 6 | 480,880 (470 KB) |
| far | 3,033 | 6 | 170,256 (166 KB) |

Building budget is 60,000 / 14 / 2.5 MB near and 12,000 / 8 / 500 KB far. `qa-metrics` is recorded in the verification section.

## Verification

Looked at, in `tmp/top-cities/shots/edificio-coltejer/`:

- Procedural near, light, portrait contact sheet, after the camera and crown pass. The first landscape sheet was edge-on and the eye read as a pale square; the portrait corner view shows the finned face, the white needle, the dark slot and two staffs together. Compared with `refs/silhouette.jpg` and `refs/crown.jpg`.
- Street view: the fins stand proud of the glass and the podium shopfronts reach the sidewalk.
- Roof view: the two slopes meet at the ridge and the staffs clear it.
- Exported GLB sheets in the same directory (`edificio-coltejer-glb-{near,far}-{light,dark}-sheet.jpg`), plus the near-light annex view. Far keeps the needle, the eye and the grid. Night turns the eye warm.

`qa-metrics` on the export: 0 coplanar pairs, back-face hits 1.3% of 384 rays (under the 2% flag), nothing below grade. `node --test src/peregrine/landmarks/top-cities/edificio-coltejer/edificio-coltejer.test.js` and the shared conformance checks for this id pass, including the exported bytes. `node scripts/asset-catalog.mjs` still stops on another agent's unregistered `united-states-capitol-far.glb`; this record was not the failure.

Cityscape placement and Full 3D world were not tested; integration is checked separately.
