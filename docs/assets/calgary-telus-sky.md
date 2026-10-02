# Telus Sky (Calgary)

Stable asset ID: `telus-sky`. An original procedural model of **Telus Sky, now Calgary House, 685 Centre Street SW** (Bjarke Ingels Group with Dialog for Westbank, completed 2019), Calgary's third-tallest tower when it opened. Part of the [Calgary landmarks](../calgary-landmarks.md); source in `src/peregrine/landmarks/calgary/telus-sky/`.

## Identity and what a driver sees

A 222.3 m glass tower on the corner of 7 Avenue and Centre Street. Its base is "a clean rectangular base and bottom floors for efficient open-office layouts"; "as the building rises, the floor plates slowly reduce in size and pixilate creating small balconies and terraces" (Wikipedia). So at 100 m it is a dark-framed blue-grey glass wall, flush up to the office floors and then broken into a mosaic of framed cells that step in and out by a metre or two; at 800 m it is a slab that thins toward the top, seen from the east as a slender wedge whose north face leans away, with a stepped, pixelated roofline that rises toward the east. Douglas Coupland's LED artwork "Northern Lights" covers the **northern and southern facades**; a 10-level podium strip runs along the west side, and small glazed volumes overhang the street at the north, south and south-east.

The neighbouring Hanover Place (OSM building parts of 23 to 26 levels immediately north) is a different building and is not modelled.

## Sources

| Source | What it gave |
| --- | --- |
| [OSM way 500294061](https://www.openstreetmap.org/way/500294061) | Outline of the tower plate (2 070 m², `building:levels=59`, `addr` 685 Centre Street S, 326 flats). Fitted: a rectangle 51.43 m (east-west) by 34.27 m, its edges 2.45 degrees clockwise of the cardinal axes (length-weighted over every edge); the centre is the origin |
| OSM `building:part` ways [1328504264](https://www.openstreetmap.org/way/1328504264), [1328504258](https://www.openstreetmap.org/way/1328504258), 1328504261, 1328504262, 1328504263 | The 10-level west podium strip, the L-shaped level-2 volume that overhangs the north face by 9.7 m, the south-east annex (levels 1 to 4) and the level-3 south bay. All listed as footprints |
| [Wikipedia, Telus Sky](https://en.wikipedia.org/wiki/Telus_Sky) | 222.3 m roof, 60 storeys (59 mapped), offices on floors 1 to 29 (39 181 m²) and residences on 30 to 58 (29 678 m²), the plate description above, "Northern Lights" on the northern and southern facades, a 31 m excavation |
| [Westbank, Calgary House](https://living.westbankcorp.com/property/calgary-house/) | Developer page named in the Wikipedia infobox (not needed for dimensions) |

OSM geometry came from the lead's dossier (`tmp/calgary/telus-sky/osm.json`, read through the shared Overpass queue) and is © OpenStreetMap contributors, ODbL 1.0.

Reference photographs, all Wikimedia Commons CC BY-SA, downloaded only to the ignored `tmp/calgary/telus-sky/refs/` to compare, never committed: "TELUS SKY" (Ultimograph5, 4.0), "Telus Sky May" (Jason Corbett, 4.0), "Telus Sky October" (Chadillaccc, 4.0), "Telus Sky May 2018", "Telus Sky September 2017" and "Telus Sky March 2018 - 2" (Chad Koski, 4.0), "Telus Sky from Calgary Tower, Calgary, Alberta, 2025-07-14" (Chris Woodrich, 4.0), "Brookfield Place and Telus Sky 2020" (Alex Szczuczko, 2.0). No photograph, texture or scan is in the repository or the GLBs.

## Frame

Real metres, +X east, +Y up, +Z south, `y = 0` local flat-map grade (the street-level lobby floor). Origin `[-114.0635398, 51.0467718]` is the centre of the 51.4 x 34.3 m tower plate. The geometry is authored in a plan frame (u along the east-west grid direction, v along the north-south one, +v south) rotated 2.45 degrees clockwise and rotated into the model frame as it is built, so the GLB needs no further rotation. The south face looks onto 7 Avenue (bearing 182). Nothing is baked for terrain, sea level or latitude stretch. Downtown Calgary is flat here, so the plain pad (`padM` 42) is enough.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Roof | 221.1 m on the highest (east) end, roof plant to 222.3 m | **Sourced** (222.3 m, Wikipedia); the 1.2 m plant is estimated |
| Levels | 59: a 7.0 m lobby, 28 office levels of 4.1 m (to 121.8 m), 29 residential levels of 3.3 m (to 217.5 m), a 3.6 m plant level | Count and the office/residential split **sourced**; heights **estimated** so the roof lands on 222.3 m (offices end about 55 % up, as in the south-face photograph) |
| Tower plate | 51.43 x 34.27 m rectangle, flush from the lobby slab to level 28 | **Mapped** (OSM) |
| West podium | 4.9 x 31.2 m strip, 10 levels (43.9 m) | **Mapped** (OSM); the 1.2 m nub at its south end is not modelled |
| Lobby | 7 m, glass recessed 1.2 to 1.4 m behind 0.5 m columns on the plate line | **Estimated** |
| Pixel columns | 7 per north and south face (7.35 m), 5 per east and west face (6.85 m); grid cell 1.22 x 1.37 m | **Estimated** from the south-face photographs (about 6.5 columns across the top) |
| Step-back by the roof | north 9 cells (12.3 m), west 5 (6.1 m), east 2 (2.4 m), south 1 (1.4 m), each with a hashed 1 to 2 cell jitter growing with height; starts at level 29 | **Estimated** (see below); the resulting top plate is about 43 x 22 m, 55 % of the base, which matches the published residential area (29 678 m² over 29 floors is about 60 % of the 1 750 m² plate once net-to-gross is allowed for) |
| Roof | pixel columns stop at level 53 to 58 in six 6-cell steps (west to east), 3.3 m apart: the roof climbs from 207.6 m on the west plates (204.3 m on the westmost columns) to 221.1 m on the east, about 13.5 m | **Estimated**: the elevated south photograph suggests about 1.4 floors, but the independent review read the ramp as 10 to 15 m in the photographs, so it was lowered from the first 7 m to 13.5 m |
| LED fascia | 0.95 m strip on the slab edge, north and south faces only, about 65 % of floors in an aurora-curtain pattern | Faces **sourced**; pattern invented |
| Windows | 3.6 m modules with 0.2 m mullions; about 16 % lit at night (near only) | **Estimated** |
| Overhanging volumes | north L (15.9 x 9.7 m and 7.3 x 1.9 m at level 2, three slim columns), south-east annex (4.8 x 8.4 m, levels 1 to 3), south bay (8 x 1.7 m at level 3) | Plans **mapped**; heights and columns estimated |
| Roof plant | one 7 x 10.5 x 1.2 m box | **Estimated** |

### Why the north face recedes

No elevation drawing was found. Three observations fix the form. (1) An elevated view from the Calgary Tower looking north shows the south face almost plumb, a nearly constant width (about 91 % at the top) and a roofline that rises only about 1.4 floors toward the east. (2) Street-level photographs from the south show the west end stepping in about 15 % of the width and the east edge staying plumb, with the east face a thin sliver. (3) A distant view from the south-east shows a slender wedge (top plate roughly 40 % of the base width in the image) whose left edge stays plumb and whose right edge steps in as it rises: the north side. Only a plate that thins mainly from the north fits all three, and it also reproduces the published residential floor area. The amounts are fitted to those views and the floor areas; treat them as plausible, not surveyed.

## Materials

| Name | Use | Light | Dark |
| --- | --- | --- | --- |
| `glass` | Curtain wall, lobby | `#5f84a8` | `#22364a` |
| `frame` | Slab-edge bands, mullions, cell sides, soffits, lobby columns | `#5b6773` | `#0f1318` |
| `ledge` | Terraces where a floor is covered by a smaller one, roofs | `#8b9298` | `#363c43` |
| `metal` | Roof plant | `#7b8288` | `#3b4248` |
| `glow` | Northern Lights LED fascia, unshaded | `#505b68` (silver-grey, reads as the slab edge by day) | `#33e8a2` (aurora green) |
| `light` | A share of lit apartment windows, unshaded | `#4c6a86` (reads as glass by day) | `#f2d395` |

The runtime layer shades each vertex from its normal, so the light palette is the sunlit colour.

## Modelling decisions

- **A stack of floor plates on a cell grid, built as exposed faces.** Each level says how far each pixel column or row steps back; the mesh is the faces of the resulting cell stack, merged into runs: a glass wall and a slab-edge band (silvery grey by day) per run, a pale terrace where a floor is covered by a smaller one, a dark soffit where one overhangs. This is the "stepped slabs" loft: no box per apartment, one merged mesh per material, six draws.
- The step-back is `mean(level) + jitter`, rounded to whole cells; the mean grows as a power of the level (north 9 t^1.1, west 5 t^1.2, east 2 t, south 1 t) and the jitter's amplitude grows too, so the pixelation starts as a few terraces at level 30 and becomes the full mosaic at the top. Plates may step out again from one level to the next (balcony cantilevers up to about 3 m), so soffits are drawn.
- Far merges levels in pairs (it keeps every level at which the podium or the stepped roof changes), drops mullions and lit windows, and thickens the bands: the same silhouette and recessions at 30 % of the triangles.
- Orientation is baked in; footprint rings are the OSM outline and parts, and a test checks every vertex stays within 0.5 m of them.

## Approximations and what is not modelled

Pixel pattern, step-back amounts, level heights, roof stair, overhang heights, lobby and colours are estimated (above). The LED art is a green fascia strip pattern, not Coupland's real layout or colours. Not modelled: the +15 skywalk links, the plaza and street furniture, balcony balustrades and individual apartment glazing, rooftop equipment beyond one plant box, the 1.2 m nub of the podium, and everything below grade.

## Cost

| | Triangles | Draws | Size |
| --- | --- | --- | --- |
| Near | 17 772 | 6 | 943 KB |
| Far | 5 260 | 5 | 283 KB |

Budgets for a building: near at most 60 000 / 14 / 2.5 MB, far at most 12 000 / 8 / 500 KB.

## Verification

Looked at, with `shot.mjs` contact sheets (`tmp/calgary/shots/telus-sky/`, ignored): procedural source and the exported GLBs, near and far, light and dark, from the south (street level, 350 m and the Calgary Tower vantage), the east, the north, from above the roof and the crown, the base and the skyline distance, with the red OSM rings in the plan. What changed because of them: the first render read as a smooth tapering slab, so the pixel jitter amplitude was roughly doubled and dark vertical frames and 3.6 m mullions were added so every cell reads as a framed box; the first night render showed the Northern Lights as hairlines, so the LED fascia was widened to fill the slab-edge band; the lit-window colour was darkened by day because it showed as white squares, and the glass and frame colours were first darkened toward a dark blue-grey, and then, after the independent review (the photographs show a silvery light-blue mosaic, not a heavy black grid), lightened to `#5f84a8` glass and `#5b6773` frame by day (the dark palette is unchanged); the roof ramp was lowered a further 6.6 m at the west; the podium strip was shortened by 2.2 m after the footprint test found it overrunning the mapped strip.

`node --test src/peregrine/landmarks/calgary/telus-sky/telus-sky.test.js` pins: 222.3 m top and nothing below grade; far within 1.5 m of near; a flush 51.4 x 34.3 m office rectangle; the podium face and roof; the recessed lobby; the pixelated south face, the receding north and west faces and the plumb east face; the stepped roof highest at the east end; glow only on the north and south faces; every vertex within 0.5 m of the mapped rings.

## Cityscape and Full 3D world

Not tested yet; integration is checked separately. Expectation: downtown Calgary and the Centre Street corner are flat to within a metre or two, so the default terrain pad should hold the base without a declared `terrainPad`; the lobby floor is `y = 0`.
