# Ghirardelli Square, San Francisco

Original procedural model of Ghirardelli Square (900 North Point Street, Fisherman's Wharf), for Cityscape. Part of the [San Francisco landmarks](../san-francisco-landmarks.md).

Build: `pnpm build:san-francisco-landmarks ghirardelli-square`. Source: `src/peregrine/landmarks/san-francisco/ghirardelli-square/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, plus `ghirardelli-square-plan.js`, `-kit.js`, `-blocks.js`, `-tower.js`, `-sign.js`, `ghirardelli-square.test.js`). Catalog record: `prototypes/assets3d/catalog.d/ghirardelli-square.json`.

## What it is

The Ghirardelli chocolate factory, a block of red-brick industrial buildings between Beach, Larkin, North Point and Polk Streets, recycled in 1964 (Lawrence Halprin with Wurster, Bernardi & Emmons) into the first big adaptive-reuse shopping complex in the United States; National Register of Historic Places 1982. The modelled state is today's.

What a driver sees, and what the model spends its budget on:

* the **"Ghirardelli" rooftop sign**: eleven mixed-case serif letters, 152 ft x 19 ft (46.3 m x 5.8 m), one-sided, facing the bay (north), on a steel scaffold over the Mustard and Cocoa roofs, lit at night. It is built as block strokes in one merged `sign` mesh (self-lit) and is readable from the water in both LODs; the scaffold stands on the two roof decks;
* the **Clock Tower** (1916, "after the Chateau de Blois") at the Larkin / North Point corner: 6.3 m square red-brick shaft, four white-framed dials (lit `glow`), corbelled white cornice, steep slate pyramid roof with four dormers, corner pinnacles and a finial, 34.5 m;
* the **Cocoa (1900) and Chocolate (1911) buildings**, 22 m / five storeys, and the lower **Mustard Building** (three storeys, taller brick pier with its gold board), all with white crenellated parapets, string courses and rows of framed windows; the **Clock Tower Building** wing with big white window surrounds under a deep corbel table;
* the low **Wurster Building** on Beach St under hipped clay-tile roofs, the arched **Power House**, the old **Woolen Mill** on its own rotated grid, the Apartment House, Carousel Building, plaza pavilions, a canopy and the octagonal gazebo.

## Frame, origin, orientation

* Origin `[-122.4230036, 37.8058609]` is the area-weighted centroid of the 17 OSM building ways in `footprint.js` (Overpass `way(around:180,37.8059,-122.4229)[building]`, fetched 2026-10-01). All 17 are the complex itself: Chocolate (939539794), Cocoa (288388853), Mustard (939539784) and its link, Clock Tower Building (939539785) with its `building:part=tower` (939539839) and annex, Apartment House, Carousel, Wurster (288388855), Plaza (288388862), Power House (288388865), Woolen Mill (939539795) and its link, Infill, the plaza canopy (`building=roof`), and the gazebo.
* Two grids are mapped: the street grid, whose long edges give bearing **80.6 degrees** (u) and **170.6 degrees** (v), i.e. 9.4 degrees anticlockwise of east/south (measured on the Cocoa, Mustard, Clock Tower, Wurster, Plaza and Apartment outlines, within 0.3 degrees of each other); and the Pioneer Woolen Mill block at **94.7 degrees**, 14.1 degrees off the grid (OSM maps the Woolen Mill and the Power House's long walls that way; the Power House's other walls follow the street grid, the model follows each outline). Both rotations are baked into the geometry (`THETA` in `ghirardelli-square-plan.js`). The sign and the plaza face bearing 350.6 degrees (`frontageBearing`).
* `y = 0` is local flat-map grade. The real site climbs about 10 m from Beach St to North Point St in terraces; every building is modelled rigid on `y = 0` and the terraces, retaining walls and ramps are not modelled. No terrain or Mercator scale is baked in.

## Dimensions

| Quantity | Model | Source |
| --- | --- | --- |
| Sign width x letter height | 46.3 x 5.8 m (letters sit 24.8 to 30.6 m; far strokes are thickened ~35 % and overshoot by about 0.3 m) | sourced: 152 ft x 19 ft (Hoodline, Color Kinetics) |
| Sign position | centred over the Mustard/Cocoa roofs, letters read left to right from the bay (east, Larkin end, to west) | estimated from photographs (Fort Mason, plaza and night-aerial views) |
| Scaffold | posts every 3.9 m in two planes 3.6 m apart, rails at 5 levels, X-braces; foot on the Mustard roof (11.9 m) and Cocoa roof (21.3 m); top 31.1 m | estimated |
| Clock tower | 34.5 m to the finial; shaft 6.3 m square (mapped part, 41 m2), dials 2.9 m, cornice 23 m, roof base 25.3 m, apex 33 m | footprint mapped; "over 100 ft" sourced; stages estimated |
| Cocoa / Chocolate | 22 m, 5 storeys | sourced: OSM `height=22`, `building:levels=5` |
| Mustard Building | 12.6 m (three storeys + parapet), pier 14.2 m | estimated (OSM says 10 m; photographs show three tall storeys) |
| Clock Tower Building wing | 13.4 m, cornice 1.3 m | estimated (OSM 10 m) |
| Apartment House / Carousel / Wurster | 11 / 8 / 8 m + 3 m roof | estimated (OSM gives only levels) |
| Power House / Woolen Mill / link | 7.5 / 12.5 / 9 m | estimated (Mill OSM 10 m, link 9 m) |
| Plaza and infill pavilions | 4.6 / 5 m | estimated (1 level) |
| Complex outline | 134 m x 102 m, about 7,250 m2 | mapped (OSM) |

## Materials

`brick` (red-brown), `trim` (cream stone: cornices, merlons, window frames, dial frames), `glass` (dark panes), `light` (a quarter of the panes: look like glass by day, warm lit windows in the night palette), `roofTile` (clay tile on the Wurster hips), `slate` (tower roof, gazebo hat), `roof` (flat tar roofs), `steel` (scaffold, finial, canopy posts), `gold` (the MUSTARD BUILDING board), `glow` (clock dials, lit at night), `sign` (the lettering). `sign`, `light` and `glow` are drawn unshaded: cream by day, bright warm white / yellow by night. Near uses 11 materials, far 8 (no `light`, `gold`, `glass`).

## Modelling decisions

* **The sign is the hero.** Each glyph is a short list of strokes (stems, serifs, ellipse arcs sampled at 14 or 7 segments), laid out letter-spaced over the sourced 46.3 m. Neighbouring boxes of a curve overlap and have slightly different depths so no two faces are coplanar.
* **Masses are tiled rectangles** on the street grid (and one on the mill grid) taken from the mapped outlines, each inside its OSM way (the test checks that nothing, cornices aside, leaves the union of the rings by more than 0.8 m at ground level / 1.6 m above).
* **Facades are quads, not boxes**: a stone frame 0.15 m off the wall and a pane 0.08 m in front of it, so about 1,000 windows cost two to four triangles each. Merlons, string courses and the corbel table are merged boxes. Far drops windows, belts, merlons and dormers, keeps cornice bands.
* **Everything is generated into indexed geometry with outward faces** by `ghirardelli-square-kit.js` (one accumulator per frame and material, flushed once), which keeps byte cost low.
* **Roofs:** flat decks behind parapets on the brick factories (as photographed from the plaza and the air), low hipped clay tile on the Wurster Building, slate pyramid with dormers on the tower.

## Approximations and known weaknesses

* The plaza terraces, hedge walls, fountain, trees, the Larkin St arch sign, the glass stair tower beside the Mustard/Cocoa junction, and the carousel are not modelled; the ground between buildings is the provider's.
* The sign letters are block-stroke serifs, not the real typeface; at 100 m the G and the a/e bowls read as polygons. The real scaffold is denser and lighter than the modelled bays.
* The Mustard board has no lettering; other signboards (COCOA, POWER HOUSE) are absent.
* Heights of the Mustard, Clock Tower, Apartment, Wurster, Power House and Woolen Mill buildings, the tower stages and the roof forms behind parapets are photograph estimates. The Woolen Mill and Power House roofs may not be flat.
* The tower roof's zigzag slate pattern, the white quoins and rustication, window muntins and carved cornice detail are abstracted. Colours are single flat tones.
* The party walls between touching masses share coincident back-to-back faces that are never visible. Cityscape and Full 3D world placement are not tested.
* Triangle counts describe the export, not Tesla performance.

## Cost (exported default scenes)

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| Near | 10,196 | 11 | 549,576 |
| Far | 2,532 | 8 | 145,368 |

Budgets are 60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB.

## Verification evidence

Reference photographs (Wikimedia Commons; downloaded to ignored `tmp/san-francisco/ghirardelli-square/refs/` only to compare, none shipped; authors and licences in the catalog record): the sign head-on, the bay view from Fort Mason and from Aquatic Park, the night aerial, the plaza facades, the clock tower from Larkin St.

Renders read with `node tmp/san-francisco/shot.mjs ghirardelli-square` (`tmp/san-francisco/shots/ghirardelli-square/`): overview, sign, facade, roof, tower, clock, back, larkin and a straight-down view with the red OSM rings, in near and far, light and dark, procedural source and the exported GLBs. What the renders changed:

* the first sign was too thin and the arcs jagged: stems went from 0.56 to 0.72 m, arc strokes overlap less, scaffold bars went from 0.22 to 0.15 m (denser, lighter), far thickens strokes and posts so the lettering does not float;
* the tower roof was a squat hat on a heavy white attic: the cornice moved down to 23 m, the attic shrank and the pyramid rose to 33 m;
* the clay-tile roof was glowing orange under the sun light, so it was darkened;
* a plaza pavilion corner stuck 0.9 m outside the mapped ring (a notch in the OSM way): the rectangle was cut back.
