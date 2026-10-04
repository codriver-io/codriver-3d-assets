# Hôtel de Ville de Montréal

Original procedural model of Montréal City Hall (275 rue Notre-Dame Est, Vieux-Montréal), for Cityscape. Part of the [Québec landmarks](../quebec-landmarks.md).

Build: `pnpm build:quebec-landmarks hotel-de-ville-de-montreal`. Source: `src/peregrine/landmarks/quebec/hotel-de-ville-de-montreal/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, plus `hotel-de-ville-de-montreal-plan.js`, `-kit.js`, `-parts.js` and `hotel-de-ville-de-montreal.test.js`). Catalog record: `prototypes/assets3d/catalog.d/hotel-de-ville-de-montreal.json`.

## What it is

Henri-Maurice Perrault and Alexander Cowper Hutchison's Second Empire city hall (built 1872-78 by Laberge & fils), gutted by the fire of 3 March 1922 and rebuilt inside in 1923-26 by Louis Parant and Joseph-L.-D. Lafrenière with an added stone storey, re-formed mansard roofs and a slimmer campanile (Jean-Omer Marchand's suggestion); extended toward the Champ-de-Mars in 1932-34; restored 2017-24 (Beaupré Michaud et Associés / MU Architecture). National Historic Site of Canada (1984). The modelled state is today's building.

What a driver or a walker sees, and what the model spends its budget on:

* the **five-part symmetrical front** on rue Notre-Dame in grey limestone: a projecting central pavilion, two four-bay wings, two end pavilions each under its own steep mansard; a rusticated ground floor of arched windows, a tall first floor with pilasters, a second floor with modillion cornice, an attic row, a crowning cornice and balustrade;
* the **central pavilion**: eleven-step stair with cheek walls, the arched bronze-doored portal, the **balcony** (de Gaulle's 1967 "Vive le Québec libre") carried by six columns under a triangular pediment, and above it the clock frontispiece with its own pediment;
* the **patinated copper mansard roofs** with a row of pedimented dormers per face, a flat cap, two tall Renaissance **chimneys** over the wing/pavilion junctions, and the **copper campanile** (stone stage, eight-sided arched lantern, ribless dome, spire) on the axis;
* the **rear** toward the Champ-de-Mars: the same order, a 5 m deep central bay with a big pedimented roof dormer, and below it the 1932-34 terrace block (64 m x 20 m) whose roof is a parapeted terrace.

## Frame, origin, orientation

* Origin `[-73.5541401, 45.5088246]` is the area centroid of the mapped City Hall outline (OSM way 20919180, fetched 2026-10-04 through the shared Overpass queue). `y = 0` is the rue Notre-Dame pavement at the foot of the front stair; no terrain, sea level or latitude stretch is baked in.
* Vieux-Montréal's grid is about 29.5 degrees off the compass. The weighted bearing of the long mapped edges (28.4, 18.9, 18.3, 17.5, 11.8 m and the rear block's 22.4, 21.6, 18.9 m) is 29.4 degrees, and the 119.2 / 119.5 degree end walls agree. The model is authored in building axes (`s` along the front, `d` outward from it, `y` up) and rotated once by 29.45 degrees (`SPEC.rotationDeg`) onto east/up/south inside the geometry; the front looks toward bearing **119.45** (toward rue Notre-Dame, Place Jacques-Cartier and the Old Port), the rear toward 299.45 (the Champ-de-Mars). The front's centre line lies 0.1 m to the left of the origin (`SPEC.axisS`).
* **Which outlines.** `FOOTPRINTS` holds two rings: way 20919180 (the City Hall) and way 396654637, an untagged `building=public` strip of 1,142 m2 along the whole rear wall. It is the **1932-34 extension**: Wikipédia (fr) "un agrandissement de 1932-1934 jusqu'à proximité du parc Champ-de-Mars … l'ajout d'une terrasse", and Parcs Canada's character-defining elements list "un ajout construit à l'arrière de l'édifice" in 1932; it also shares the City Hall's rear wall edge for 64 m. Château Ramezay (way 87415550, across the street) and the Vieux palais de justice (way 20919178) are separate buildings and stay provider.

## Dimensions

| Quantity | Model | Source |
| --- | --- | --- |
| Outline | 69.5 m (along the front) x 35.1 m deep (+ stair to 41.8 m); area 2,633 m2 | mapped (OSM way 20919180) |
| Stair, central pavilion | stair tip 24.3 m, pavilion front 20.9 m, pavilion 14.5 m wide, stair 8.4 m wide | mapped (the outline's stair and pavilion vertices) |
| End pavilions | 11.8 m wide, front 2.0 m proud of the wing | width and right-hand projection mapped (2.2 m); the left end is mapped flush, drawn like the right (symmetry from the photographs, Wikipédia, Parcs Canada) |
| End walls | recessed middle 1.7 m between the corner pavilions | mapped (right end; the left end is mapped as one straight wall) |
| Rear central bay | 21 m wide x 4.9 m deep | mapped (outline vertices, chamfers simplified away) |
| Rear block | 64.2 m x 20.2 m, top 4.8 m, parapet to 5.65 m, walls down to -2.5 m (slope skirt) | outline mapped (way 396654637); height estimated; the skirt is a modelling allowance, see Frame |
| Storeys | five (ground floor, first, second, attic, mansard dormers) | sourced (Wikipedia, Parcs Canada, RPCQ) |
| Campanile | 9.1 m (30 ft) lantern-and-dome, copper | sourced (RPCQ: "campanile de trente pieds") |
| Crowning cornice / balustrade top | 16.2 m / 17.0 m | estimated from the street photograph |
| Roof ridge (flat cap) | 24.4 m main, 25.0 m end pavilions | estimated |
| Chimneys, clock frontispiece apex | 30.1 m, 24.2 m | estimated |
| Total height to the spire tip | 40.0 m | estimated (no published total, OSM has no height): campanile 9.1 m sourced on a roof ridge read from the photographs, good to about 4 m |
| Floor levels | belt 4.8 m, first cornice 9.6 m, second 13.2 m, wall top 15.5 m | estimated |
| Window and column sizes, bay counts | wings 4 bays of 3.9 m, pavilions 2, balcony 6 columns r 0.3 m | estimated from the street photograph |

## Materials

Six names, in both palettes: `stone` (grey Montréal limestone), `stone2` (plinth, rusticated joints, window surrounds, tympana, balusters: the darker shadow tone), `roof` (patinated copper: a dark charcoal-green; the photographs show it from dark slate-grey to green; also the mansards, the campanile dome and spire, and the rear block's terrace membrane), `glass` (the dark ground-floor and rear-block glazing), `light` (all upper windows: dark glass by day, a warm glow at night, drawn unshaded), `sign` (the clock dial: pale by day, lit at night, unshaded). Light stone `#aaa79e`, roof `#414b47`; night stone `#85817b`, roof `#34413b`, light `#ffdc98`. QA pass: the light roof was `#56645e` (light sage next to the photographs' dark charcoal-green roofs that frame the pale stone) and is now about 25 % darker; the campanile cap was a separate unshaded `lamp` copper (brown `#9a7550` by day, rendered bright orange; floodlit gold at night) and now uses the `roof` patina of the mansards, so the `lamp` material is gone (six materials, six draw calls). The campanile is therefore no longer a gold floodlit accent at night; the rows of warm windows carry the night read at 800 m.

## Modelling decisions

* **The front is a rhythm, not a box.** One `facade()` routine draws a wall segment in a wall frame: plinth, rusticated joints, belt course, denticulated and modillion cornices, crowning cornice and balustrade, per bay four rows of arched windows with dark surrounds, pilasters on the upper floors, keystones, quoins on the pavilions and a dormer on the roof above each bay. It is reused on the wings, pavilions, both end walls and the rear, so the whole building keeps one language and 9.6 k triangles.
* **Layered offsets, not coplanar faces.** Joints stand 0.15 m off a wall, window surrounds 0.20 m, glass 0.25 m (walls are over 50 m2); cornices are boxes embedded 0.3 m into the wall; the plinth starts at the wall plane (an early version overlapped it and `qa-metrics` flagged 10 stone2/stone coplanar pairs, 35 m2, at grade).
* **Two mansard profiles.** The block is one hip roof with a steep lower slope, a shallow upper slope and a flat cap (24.4 m); each end pavilion has its own steeper pyramid with a small flat top (25.0 m), so the end pavilions stand a little above the ridge as in the photographs. Dormers are boxes with a lit window and a small pediment (pediments are dropped in far).
* **The campanile cap is patinated copper like the roofs.** One `roof` lathe (14 segments near, 8 far) for the dome and spire; no separate floodlit material.
* **The campanile and chimneys carry the far silhouette.** Far keeps the stage, the eight-sided lantern (four openings), the dome and spire, both chimneys, the dormer boxes, the columns (four sides) and the portico window. The photograph's lantern is taller than the dome; the first version had them equal and was changed.
* **The rear block.** The flat map has no fall toward the Champ-de-Mars, so the 1932-34 block is a terrace slab at 4.8 m (top of its parapet 5.65 m) with two rows of tall windows; its walls run to -2.5 m, so on a ground that does fall they stand on it instead of floating. That -2.5 m (the `minY` that `qa-metrics` reports, the only geometry below y = 0) is a **slope skirt**, not a basement: the block's footprint is inside the mapped rear-block ring, and on the flat map the skirt simply sits below the pavement. The City Hall's own rear ground floor (below 4.8 m) is hidden behind it; the rear rows start above the terrace. The terrace used to be a pale stone slab, which read as an empty slab from above; the block now stops 0.15 m under the terrace level and a dark `roof` membrane closes it between the parapets, and the coping strip on top of the parapets is in the darker `stone2` tone.
* **No lettering, no flags, no sculpture.** The Wikipedia-listed carved pediment groups and the bronze doors are flat; the photographs show no flags on the front (one small mast on an end roof in the Champ-de-Mars photograph), so none are modelled.

## Cityscape and Full 3D world

**Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.**

No `terrainPad` is declared. The public Terrarium DEM (z14 and z15, read on a 10 m grid over the outline and 60 m round it, 2026-10-04) is **19.9 m everywhere under the City Hall, the rear block and the Champ-de-Mars side**, rising only to 20.5-21.2 m 40-60 m east of the front (rue Notre-Dame, toward Château Ramezay). The real fall of the ground toward the Champ-de-Mars (about 5 m, which the terrace of 1932-34 bridges) is not in that data. The default disc (`padM` 52, just covering the farthest vertex of the rear block at 50 m) takes the lowest sample, 19.9 m, and so lies level under the whole model; an explicit pad or terrace would carve a pit into a plain the DEM draws flat. What to expect in the app: the front stair and the pavement at the same level as the terrain, the rear block level with it, and the east edge of the disc cutting the street down by up to 0.9 m with the default feather. If the app's own terrain does fall at the rear, the rear block's walls (to -2.5 m) cover a drop of up to 2.5 m; a larger drop would need a terrace on the rear block's ring (`offsetM` about -5) and the block's walls lengthened to match.

## Approximations and known weaknesses

* No published total height: 40 m and every storey height are read from perspective photographs (the street front, two Champ-de-Mars views) and are good to about 4 m; proportions between the parts were checked against the street photograph, not a survey.
* The left end pavilion projects 2.0 m like the right one although the outline maps it flush: it overhangs the mapped ring by up to 2.7 m on the left front corner (cornices included). The test allows 2.8 m and names why.
* The rear central bay is a plain rectangle (the outline has 45 degree chamfers), and the rear block's 0.5 m central bump and the glazed barrel roof seen on its terrace in the night photograph are not modelled.
* Stone, copper and glass are single flat colours; real patina varies from green to brown across the roofs.
* The front parterres, the street, the flags and the lettering are not part of the model. Sculpture, carved relief, the bronze doors, balustrade detail and the Corinthian capitals are abstracted (blocks and bars).
* Cornices project up to 0.6 m beyond the wall line, the balcony slab 1.5 m beyond the central pavilion's front (still inside the mapped stair tip at 24.3 m), and the end-pavilion dormers and cornices add to the left-corner overhang noted above.

## Cost (exported default scenes)

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| Near | 9,591 | 6 | 490,964 |
| Far | 3,360 | 6 | 177,008 |

Budgets are 60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB. Far is about 35% of near by triangles. Triangle counts describe the export, not Tesla performance. `qa-metrics`: no coplanar overlaps, 0% back-face hits (247 rays), nothing below grade except the rear block's walls (-2.5 m, the slope skirt).

## Verification evidence

Reference photographs (Wikimedia Commons, downloaded to ignored `tmp/quebec/hotel-de-ville-de-montreal/refs/` only to compare, none shipped; authors and licences in the catalog record): the front from rue Notre-Dame (Canmenwalker, CC BY 4.0), the rear and campanile floodlit from the Champ-de-Mars (Joanne Lévesque, CC BY-SA 3.0), and the City Hall beside the old courthouse from the Champ-de-Mars (Joanne Lévesque, CC BY-SA 3.0). The other three photographs in the dossier are interiors and were not used.

Renders read (under `tmp/quebec/shots/hotel-de-ville-de-montreal/`): all eight views and four detail views from the procedural source and from the **exported GLB**, near and far, light and dark; a street-level comparison at the street photograph's framing; a top plan over the mapped rings (the model fills them, the stair tip sits on the mapped stair vertex, the terrace block lies behind the rear wall). Changes made because of what they showed: the roof was a saturated green and became a darker verdigris-grey; the campanile's lantern was too short against the photograph (its lantern is taller than its dome) and the stage under it too tall, so they were swapped; the rear block read as a 3 m retaining wall with black squares and was raised to 4.8 m with two window rows; `qa-metrics` found the plinth's coplanar bottoms (fixed).
