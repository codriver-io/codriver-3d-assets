# Stantec Tower (Edmonton)

Stable asset ID: `stantec-tower`. An original procedural model of **Stantec Tower**, 10104 103 Avenue NW, Edmonton, Alberta (Stantec / ICE District Joint Ventures; office floors opened September 2018, residences 2019), the tallest building in Edmonton and in Canada outside Toronto. Part of the [top-cities landmarks](../top-cities-landmarks.md); source in `src/peregrine/landmarks/top-cities/stantec-tower/`.

## Identity and what a driver sees

A 250.8 m, 66-storey slab of blue glass: **20.5 m wide east-west and 52 m long north-south**, so from the west or east it is a broad slender blade and from the north or south a thin one. A thin **dark band at every floor line**, fine white mullions on the wide faces and **white vertical fins on the narrow faces and the chamfered corners** give it its ribbed look. The top is **cut on a slope**: the roof falls about 5 m from the north end to the south end, edged by a white rim, with a dark louvre (plant) band across the north face about 9 m under the top. Two stacks of darker balcony windows run up the upper west face. The shaft rises out of a **125.4 m block** that wraps its east and south-east sides, and both stand on the **16.8 m ICE District podium**, which runs 67 m west with a curved plaza face and has a notch with the entrance canopy facing 103 Avenue. At 800 m it is the slim sloped-top blade against the shoulder block; at 100 m it is the banding, fins and the podium base.

Not modelled: the Stantec lettering, Rogers Place, the JW Marriott and Edmonton Tower neighbours, the Winter Garden, the pedway bridge (OSM way 1419240146), interiors and the real facade's reflections.

## Sources

| Source | What it gave |
| --- | --- |
| [OSM way 476797578](https://www.openstreetmap.org/way/476797578) | Building outline, `height=250.8`, `building:levels=66`, glass |
| OSM parts [512154307](https://www.openstreetmap.org/way/512154307) (shaft, 250.8 m), [512154306](https://www.openstreetmap.org/way/512154306) (block, 125.4 m), [512154308](https://www.openstreetmap.org/way/512154308) (podium, 16.8 m) | Plan of each mass. The block ring wraps the shaft: the shaft's east and south walls are the block's inner edges. The podium ring equals the outline ring |
| [Wikipedia, Stantec Tower](https://en.wikipedia.org/wiki/Stantec_Tower) | 250.8 m, 66 storeys + 4 underground, architect Stantec, completion 2018 (office) / 2019 (residential) |
| Wikimedia Commons photographs (ignored `tmp/top-cities/stantec-tower/refs/`, never committed): Stantec Tower Edmonton.jpg (Kurayba, CC BY-SA 2.0); StantecTowerConstructionJune2018.jpg (Jarodsc18, CC BY-SA 4.0); Stantec Tower, Edmonton, Alberta - July 2020.jpg (Caddyshack01, CC BY-SA 4.0); Stantec tower December 30 2017 (Jason Woodhead, CC BY 2.0) | Proportions, the sloped crown, the louvre band, balcony-window stacks, fins and chamfers, the block's relation to the shaft |

OSM geometry comes from the dossier extract (`tmp/top-cities/stantec-tower/osm.json`, shared Overpass queue) and is © OpenStreetMap contributors, ODbL 1.0. No photograph, texture or scan is in the repository or the GLBs.

## Frame

Real metres, +X east, +Y up, +Z south, `y = 0` the local flat-map grade (the podium plaza). Origin `[-113.496213, 53.545004]` is the centroid of the mapped shaft outline. The mapped outlines are within a degree of the street grid, and their own bearings are used (the shaft's west wall runs from `(-10.8, 20.6)` to `(-9.8, -31.1)`). Nothing is baked for terrain, sea level or latitude stretch.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Top (north end of the crown rim) | 250.8 m | **Sourced** (Wikipedia, OSM) |
| Storeys | 66; the model draws 62 floor lines on the shaft (3.77 m pitch above the podium) | Count **sourced**, pitch **estimated** |
| Shaft plan | 20.5 x 52 m, corners chamfered 2.6 m | **Mapped** (OSM part 512154307); chamfer from photographs |
| Roof slope | 5.5 m lower at the south end (6 degrees), one plane | **Estimated** from the telephoto photograph (4 to 6 m) |
| Louvre band | 4 m tall, 4.6 m under the rim, across the north face and its chamfers | **Estimated** from the photograph |
| Balcony windows | two stacks 3 m wide, 14 and 37 m from the north end of the west face, 146 to 234 m up | **Estimated** from the photograph |
| Block | 125.4 m at its north end, roof falling 0.06 m/m to 121.5 m at the south; outline mapped, SE corner chamfered 3 m | Height **sourced**, slope **estimated** |
| Podium | 16.8 m, 67 m west of the shaft, curved plaza face | **Mapped** and **sourced** |
| Podium detail | shopfront storey 0.3 to 5.1 m, floor bands, 3 m mullion bays, entrance canopy 9 x 3 m at 5.2 m | **Estimated** |
| Fins | white, 0.22 x 0.32 m at about 1.3 m pitch on the narrow faces, 1.75 m on chamfers; mullions 0.1 x 0.12 m at 3.1 m on the wide faces | **Estimated** |

## Materials

| Name | Use | Light | Dark |
| --- | --- | --- | --- |
| `glass` | Curtain wall | `#5b8eb9` | `#2d4a68` |
| `spandrel` | Floor-line bands, balcony windows, podium shopfront | `#3b6688` | `#1b3047` |
| `fin` | Fins, mullions, rim, canopy | `#e8edf0` | `#808c97` |
| `louvre` | Plant band, lobby glazing | `#22364a` | `#0a1118` |
| `podium` | Podium glass | `#4a78a3` | `#27425c` |
| `roof` | Roof decks | `#80878c` | `#3b4146` |
| `metal` | Roof plant (merged into `roof` in far) | `#9aa1a6` | `#566068` |
| `glow` | Lit panes, unshaded (day colour a little under the glass) | `#5688b3` | `#e8c98c` |

## Modelling decisions

- Three stacked masses on the OSM outlines, each wall a flat quad from its plan edge: no mesh is a tinted extrusion, because the roof slope, the fins, the bands and the louvre follow the real tower.
- The shaft's east corners are square below the block roof and chamfered above it, so the block's roof, the wedge at each cut corner and the shaft walls close without gaps; the shaft's south wall is split where the block's south bulge begins.
- Floor-line bands, panes, louvre and balcony windows are single flat quads 0.15 to 0.3 m proud of the glass (never on the same layer as another overlapping quad); fins stop at the rim's underside. Bands are clipped exactly by the sloping roof.
- Far keeps the slab, slope, rim, louvre, block, podium and chamfers, with a band on every other floor, coarser fins and 8 m window bays.

## Approximations and weaknesses

- The facade is flat-shaded glass with banding; the real tower's mirror reflections and the exact pattern of its fins on the chamfers are not reproduced.
- The roof slope and louvre are read from two photographs from the north-north-west; the south face and the crown from other angles are not surveyed. The block's roof slope is a guess.
- The podium is a simplified 16.8 m glazed volume: no storefront doors other than the lobby, no roof terrace detail.
- Fins and the rim stand up to 0.35 m past the mapped outline.
- Lit windows are a deterministic pattern.

## Costs

| | Triangles | Draws | Size |
| --- | --- | --- | --- |
| Near | 4 269 | 8 | 333 KB |
| Far | 1 475 | 7 | 119 KB |

## Verification evidence

Contact sheets in the ignored `tmp/top-cities/shots/stantec-tower/` (procedural and exported GLB, near and far, light and dark; views `overview`, `facade`, `roof`, `crown`, `north`, `base`, `nnw`, `southeast`, `street`, `skyline`) were read against reference photographs 1 (from the north-north-west), 2, 3 (from the south-east) and 6. What they changed: the glass and band colours were lightened and the lit panes toned down (day panes read as a random patchwork); the balcony-window stacks were moved from the 62 / 88 % of the tower's width I first used to 30 / 79 % of the west face (they sit on that face, not across it) and no longer share a layer with the lit panes (speckle); floor bands thinned from 1.0 to 0.7 m; the louvre band was lightened from near-black; the podium gained a shopfront storey, a lit lobby and shop bays after the night view read as a blank dark box. The GLB round-trip was rendered after export. `src/peregrine/landmarks/top-cities/stantec-tower/stantec-tower.test.js` pins the height, plan, roof slope, louvre band, fins, block and podium heights, the canopy contact (with a control ray past its end) and footprint containment in both LODs. Cityscape and Full 3D world integration: not tested here; checked separately by the lead.
