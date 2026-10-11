# St Paul's Cathedral

Original procedural model of St Paul's Cathedral, Ludgate Hill, London, for Cityscape. Part of the [top-cities landmarks](../top-cities-landmarks.md).

Build: `pnpm build:top-cities-landmarks st-pauls-cathedral`. Source: `src/peregrine/landmarks/top-cities/st-pauls-cathedral/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, plus `st-pauls-cathedral-plan.js`, `-kit.js`, `-build.js` and `st-pauls-cathedral.test.js`). Catalog record: `prototypes/assets3d/catalog.d/st-pauls-cathedral.json`.

## What it is

Wren's English Baroque cathedral, completed 1710, Grade I, as it stands today: Portland stone, a ribbed warm-grey lead dome, a stone lantern with a gilded ball and cross, and two west towers with black-and-gold clocks, open belfries and concave lead cupolas topped by gilded pineapples. The west front is a two-storey portico of paired columns under a pediment. Each transept ends in a semicircular columned porch.

What a driver sees from Ludgate Hill and from Cannon Street, and what the model spends on:

* the **dome** at 800 m: lead hemisphere with ribs, a colonnaded drum, a lantern and a gilded cross at 111.25 m;
* the **west front** at 100 m: paired columns, the great door, the upper order and pediment, and the two clock towers;
* the **south flank**: a two-storey screen (round-headed windows below, blind niches above, pilasters and a balustrade), the transept porch, the lead nave roof;
* the **east end**: the curved apse under the dome.

## Frame, origin, orientation

* Origin `[-0.0983108, 51.5137866]` is the centroid of the mapped outer dome (OSM way 664613340), the crossing. The outline is way 369161987. Fifty rings (the outline and every `building:part` whose centroid lies inside it and whose area exceeds 4 m²) are in `FOOTPRINTS`. Neighbouring buildings (Chapter House, Paternoster House, Temple Bar, the cathedral school) are not.
* The nave bears **83.8°** (tower midpoints to the dome centroid). Geometry is authored in building axes (+u toward the apse, +v toward the south transept) and rotated once by 6.2° onto east/up/south. `frontageBearing` 263.8 is the west front, down Ludgate Hill.
* `y = 0` is the churchyard pavement on the flat basemap. Ludgate Hill rises west of the steps, but the platform under the footprint is level, so there is no `terrainPad`. `padM` is 98 m.

## Dimensions

| Quantity | Model | Source |
| --- | --- | --- |
| Height to the cross | 111.25 m | sourced: 365 ft (Wikipedia; 1911 Britannica agrees within a foot) |
| Outer dome crown | 84.7 m | sourced: 278 ft |
| Tower pineapples | 67.4 m | sourced: 221 ft |
| Length, west steps to apse | about 156 m | sourced 518 ft (158 m); the mapped outline spans 157.5 m and the model stops inside it |
| Nave screen half-width | 17.7 m | published half-width 18.5 m (121 ft); the choir's north wall is mapped at 18.1 m, and the cornice sits inside that |
| Across the transepts, including porches | about 82 m | published body 75 m (246 ft); the mapped outline, including the portico steps, reaches about 86 m |
| Dome springing radius | 16.7 m | OSM dome ring about ±16 m. The often-cited 112 ft (34 m) diameter is unsourced on Wikipedia and is wider than the mapped dome |
| Peristyle | 32 columns, radius 19.7 m | count from the drum photograph; radius from the OSM colonnade ring (±20.8 m) |
| Nave bearing / yaw | 83.8° / 6.2° | mapped |
| Screen-wall height | 33.4 m, cornice 34.9 m | estimated from photographs. OSM `building=cathedral` height is 35 m; the tagged aisle roofs at 22 m are hidden behind the screen wall |

## Materials

Eight names, both palettes: `stone` (Portland), `stone2` (plinth, balustrade, pilasters, blind niches), `lead` (dome, lantern roof, nave ridges, tower cupolas, apse roof: `#8f9294` by day, `#4d5154` at night, a warm mid grey), `rib` (lighter grey lead ribs), `glass` (doors and lower windows), `light` (west window, apse, attic and lantern: dark by day, unshaded warm at night), `lamp` (cross, ball, pineapples, clock rings: unshaded gold), `clock` (black dials and the shadow inside the peristyle). Night stone stays floodlit and pale. Far keeps the same eight materials and the same silhouette.

## Modelling decisions

* The plan is the mapped outline. Aisles, chapel shoulders, transept arms, towers and the apse are boxes and faceted arcs that stay inside way 369161987. The screen wall is one height; the low aisle roofs are not modelled as a second storey.
* The dome is one lathe (28/14 segments) plus triangular ribs (24 near, 12 far). The lower drum is stone with a string course. The peristyle is 32 free-standing columns near and 16 far, each with a wider capital, in front of a dark core at radius 14.6 m. A balustrade rings the gallery. The attic keeps small windows. There is no window band in the colonnade.
* The nave and transept screen walls are two storeys: round-headed glass windows below, blind stone niches above, paired pilasters on the near model, a cornice between the storeys and a balustrade on the top cornice.
* West towers: square shaft with clock dials, then a slim open columned drum (about 7.2 m across and 11 m tall), a concave lead cap and a gilded pineapple. The tip stays at 67.36 m, about 2.8× the 11.6 m shaft width above the screen cornice.
* The west portico is two orders of paired columns. Within a pair the shafts nearly touch; the bay between pairs is open back to the door wall. The transept porches are arcs of columns, a curved entablature and a pediment. The steps narrow toward the tip because the outline there is only a few metres wide.
* Windows and orders are offset at least 0.12 m off the walls. One mesh per material.

## Approximations and known weaknesses

* No sculpture: the west pediment and the south transept's phoenix are plain triangles. Balustrades are a rail with piers, not individual balusters. The tower's upper stage has four arches and no urns.
* The apse is a faceted arc with a lead cone, not the real windowed curve in detail. The nave bay rhythm is estimated.
* The cross is a flat Latin cross facing west, so a due-south view sees its edge. Clock faces have ticks, not numerals or hands.
* Column fluting, carved capitals and the lead ribs' rolled joints are omitted. The ribs read as stripes in a close view and soften at street distance.

## Verification

Compared with Colin's dome photograph (CC BY-SA 4.0), Julie Anne Workman's south-west tower (CC BY-SA 3.0) and Canaletto's west/south view (public domain), all under `tmp/top-cities/st-pauls-cathedral/refs/`. Procedural contact sheets: `tmp/top-cities/shots/st-pauls-cathedral/st-pauls-cathedral-procedural-near-light-sheet.jpg` (three looks) and the top view `…-top.png`. The first look showed conical tower cupolas, a fin-like transept pediment and a star-shaped cross; the cupolas became ogees, the pediment gained depth, and the cross became one flat pair of arms. Exported GLB sheets, looked at after `pnpm build:top-cities-landmarks st-pauls-cathedral --no-check`: `st-pauls-cathedral-glb-near-light-sheet.jpg`, `st-pauls-cathedral-glb-near-dark-sheet.jpg`, `st-pauls-cathedral-glb-far-light-sheet.jpg`, `st-pauls-cathedral-glb-far-dark-sheet.jpg`, and the plan `st-pauls-cathedral-glb-near-light-top-glb.png`. Night windows and the cross glow; the far model keeps the dome, towers, clocks and cross. The second review pass, looked at on `tmp/top-cities/review/st-pauls-cathedral/st-pauls-cathedral.jpg` beside the reference tile and on close south, dome and tower renders, shows warm-grey lead, a columned peristyle with dark gaps, two-storey screen walls, and slim open tower cupolas. Cityscape and Full 3D world in the running app were not tested; integration is checked separately.
