# Westminster Abbey (Mission)

Asset `westminster-abbey-mission`, Westminster Abbey, 34224 Dewdney Trunk Road, Mission, British Columbia. A Benedictine abbey on the hill above Mission: the Abbatial Church of Saint Joseph (1982, architect Asbjørn Gathe), the Pfitzer Memorial Bell Tower, a covered walkway and the monastery and seminary wings. Original procedural model. Contract: [3d-top-cities-landmarks.md](../top-cities-landmarks.md). No scan, traced mesh, photograph or texture is in the repository or the GLBs. This is the Mission abbey, never the London one.

## Identity and what a driver sees

From the road at 800 m: a cluster of pale concrete on the hilltop, a slim pointed tower to its north-east and long cream wings with low red roofs. At 100 m: a square church of saw-tooth bays, each carrying one tall lancet window, a flat roof with a small central finial, a low canopy on slim columns over the entrance, and beside it the tower, a pointed concrete arch with a through bell opening above a perforated screen and a cross at the top. At night the lancets are the lit glass.

## Sources and dimension table

| Feature | Value | Basis |
| --- | --- | --- |
| Church plan | about 52 × 34 m including its arms; walls on the compass axes, saw-tooth bays at ±45° | OSM way 90078404 (71 vertices); sanctuary part 411108371, finial part 411108372 |
| Church wall | 15 m | estimate from the photo (canopy columns ≈ 4.5 m, wall ≈ 3.3 × that) |
| Sanctuary roof / finial | wall + 1.1 m; finial tip 18.5 m | estimate |
| Lancets | 1.5 × 8.6 m, from 4.9 m, one face of every bay (33) | photo; placement is an approximation |
| Bell tower footprint | 6.5 × 5.9 m at (31.7, −16.5) | OSM way 90078880 |
| Bell tower height | arch apex 28 m, cross to 31.2 m | estimate: photo ratio to the church wall and the footprint |
| Walkway | deck 3.3–3.6 m, 6 × 39 m between the tower and the north wing | OSM way 385780101 (`building:levels=0`); height estimated |
| Wings | three storeys to a 10.4 m eave, low hip to 12.3 m | OSM way 90078385 and 90078430, `building:levels=3` |
| Origin | [−122.27069, 49.153464], area centroid of the church. `padM` 120 | |

Church built 1982 (Wikipedia); one photograph is on Commons (Joe Mabel, CC BY-SA 3.0) and the dossier found no published heights.

## Frame

Real metres, +X east, +Y up, +Z south, authored directly on the mapped plan (the rings in `westminster-abbey-mission-rings.js` are the OSM outlines in model metres, within a centimetre, and a test checks them against `footprint.js`). Nothing is rotated: the church walls are on the compass axes and its bays are the mapped zig-zag. `y = 0` is the church plaza. The hilltop is not baked in. A bounded median terrain pad (church first, then sanctuary, tower, walkway and wings as terraces at the same datum, 8 m feather) keeps the whole abbey on one rigid level; DEM footing residuals have not been checked.

## Materials

Eight near, seven far, the same keys in light and dark: `concrete` (church, piers, tower), `trim` (lancet surrounds, the tower's arch ribs, a step lighter so they layer cleanly), `wall` (cream wings, and the lancet mullions, so trim < glow < mullion is not a cycle), `roof` (muted red-brown; far also draws the brick core in it, same hue), `brick` (the recessed undercroft core, near only), `glass` (wing windows), `glow` (church lancets: dark glazing by day, warm and unshaded at night), `recess` (doors, core glazing, the tower's perforated cells). No material cycles in the depth table.

## Modelling decisions

- Six rings: church, its sanctuary part (the 1.7 m² finial part, way 411108372, is inside the church ring and too small to list), tower, walkway and both wing ways. Not drawn: the small hexagonal chapel (90078379), the garage and the farm buildings.
- The church wall is the mapped saw-tooth, so the pilasters come from the plan, and it **stands on an open undercroft** (review fix 2026-10-15, after the Commons photograph): the concrete walls start at 4.3 m on a slab (the porch deck height), over a brick core pulled 1.2 m in from the mapped ring (`insetRing`) and concrete piers (0.4 m, every plan corner near, every third far) with dark glazing between them. Roof datum and plan are unchanged and the porch doors sit on the recessed core. Each bay has one lancet with a concrete surround (12 cm proud), dark glazing standing 24 cm proud and a mullion at 34 cm (near), chosen by the turn into the next edge so they pinwheel round the square.
- The tower is an extruded pointed parabola (vertical shaft to 13 m, then to the apex) with the bell opening cut through, now 4.4 m deep (not the 5.9 m footprint) tapering to 65 % above 18 m, so it reads as a slim fin and not a wedge. A 0.5 m raised rib follows the shaft edges and the arch on both faces, and the perforated screen is a grid of 27 small dark cells per face (four coarse cells in far) instead of one broad black panel. The cross is 3.2 m.
- Wings: cream walls, a sloped inset skirt and a flat cap form the low hip; window rows per storey (3.1 m pitch near, 6.2 m pitch far, never a continuous band).
- Walkway and canopy are slabs on 0.35–0.4 m columns; the walkway ends are buried in the tower and the north wing.
- Far keeps the same silhouette with bare lancets, the undercroft piers (every third), wider-pitched wing windows and a six-cell tower screen.

## Approximations

All heights are photo estimates; the entrance canopy on the north arm and the doors under it are a guess from one view; the real roof may be stepped higher behind the parapet; trees and the hexagonal chapel are omitted.

## Costs

Near 3906 triangles / 8 draws / 202 KB. Far 2039 / 7 / 110 KB (budget 60 000 / 14 / 2.5 MB and 12 000 / 8 / 500 KB). Far bounding box matches near on every axis.

## Evidence

Compared with the Commons photograph (`tmp/top-cities/westminster-abbey-mission/refs/1.jpg`, not shipped). Judged: `tmp/top-cities/shots/westminster-abbey-mission/r1` (first contact sheet, procedural near light), `r2` (near light and far dark, procedural), `r3` (plan view with the red rings, tower from the north, far from the south-west), `r4` (exported GLB: `…-glb-near-light-sheet.jpg`, `…-glb-far-dark-sheet.jpg`). Changes made because of them: lancet reveals and mullions added, the tower made rounder and slimmer in depth, the north tower face's screen fixed, the dark continuous window bands of the far model replaced by separate quads and a four-cell screen, and grid bars moved to `trim` to remove two material cycles.

Inspector: `/asset-preview.html?asset=westminster-abbey-mission&view=facade` (also `overview`, `roof`, `tower`, `wings`, `east`, `south`).

Review fix g4a (2026-10-15): the reviewer read the church as a solid extrusion to grade, the tower as a thick wedge and the lancets as pale outlined blanks. Changes above; looked at `tmp/next-200/fix/g4a/westminster-abbey-mission/{look1,look1f,look2,look2c,glb-near,glb-far}` beside the Commons photograph only (never the London abbey). A test vertex tolerance moved from 0.30 to 0.40 m because the mullion now stands 34 cm proud.

Cityscape and Full 3D world: recaptured by the lead after this fix.
