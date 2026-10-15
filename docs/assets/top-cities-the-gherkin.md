# 30 St Mary Axe (the Gherkin)

Procedural landmark for the Peregrine cityscape. The model is a circular bullet in real metres, +X east, +Y up, +Z south, with y=0 at local flat-map grade. It does not bake terrain or sea level.

## What makes it this building

A 180 m tower, widest around the 16th floor, tapering to a glazed lens. A steel diagrid of diamonds covers the skin. Six dark light-well bands spiral up the shaft. The plan is a circle on a small plaza. The spiral bands and the diamond grid are the identity.

## Sources

Sourced:

- Height 180 m, 41 floors, roof shape dome, address 30 St Mary Axe: OSM way [4959489](https://www.openstreetmap.org/way/4959489) and [Wikipedia](https://en.wikipedia.org/wiki/30_St_Mary_Axe).
- Completed 2003, opened 28 April 2004, Foster + Partners with Arup: Wikipedia and [thegherkin.com](https://thegherkin.com/).
- Plan radii, from the dossier rings (vertex mean origin −0.08033161, 51.51447498): outline and dome part (way 1365317067, 70–180 m) about 28.4 m; widest band (way 1365317068, 53.5–70 m) about 28.3 m; then 27.9, 27.1, 26.0 and a 25.0 m base (way 1365317072, 0–8 m).

Estimated from photographs, not from a survey:

- 24 diamonds around the circumference.
- Light wells advance about 0.85 bay per diamond course (six bands, each two bays wide). A constant angle per metre straightened out on the short upper courses.
- Glass radius above 70 m, the blue-grey glazed lens from about 171 m, mullion spacing, and the blue-grey / silver-grey / dark-well colours.
- Floor pitch 4.15 m (41 floors into 180 m, with the lens above the last office floors).

Photographs compared, not shipped: Commons files by Aurelien Guichard (CC BY-SA 2.0), Paste (public domain), Diliff (CC BY-SA 3.0), Samuel Zeller (CC0), Jon Hardy (CC BY-SA 2.0), Duncan Harris (CC BY 2.0).

## Geometry

`the-gherkin-parts.js` builds a complete alternating diamond lattice. Both even and odd half-courses carry glazing; the previous even-only layout left diamond holes that broke the spiral bands and exposed channel backs. Six connected dark bands cross the staggered courses. Far uses slightly taller courses but samples the near course pitch for the spiral colour, so it keeps the helix rather than straightening it into columns.

Near steel channels are closed on their glass-facing side, 0.50 m off the glass with an 0.18 m lip, and reduced to 0.32 m width. Far uses 0.42 m outward structural strips. Feet and boundary glazing reach y=0.02. Bar width shrinks with the bay. Equal position/normal vertices are welded without smoothing the facets. Near keeps small office mullions; far drops these small crossbars while retaining every diamond edge and the window rhythm.

The last nine metres are a blue-grey glazed lens carrying a fine crossing diagrid in both LODs. The lighter opaque-looking smooth cap was removed. Materials keep the same five day/night keys: `glass`, `lens`, `well`, `glow`, `steel`; office glow stays a minority of glazing by day.

## Footprint

`FOOTPRINTS` lists way 4959489 and parts 1365317067–072. The outline and the dome part are the same ring. Neighbours are not included. The plaza is not modelled, because a pad larger than the tower would leave the outline. In a top-down view the belly matches the outer red ring and sits outside the smaller height-part rings. That is the stacked plan, not overflow. Measured mesh radius is 28.20 m against an outline minimum of 28.35 m.

## Cost

Exported with `pnpm build:top-cities-landmarks the-gherkin --no-check`:

| LOD | Triangles | Draws | Size |
| --- | --- | --- | --- |
| near | 26260 | 5 | 2093 KiB |
| far | 7656 | 5 | 465 KiB |

Building budget is 60,000 / 14 / 2.5 MB near and 12,000 / 8 / 500 KB far.

## Review correction and evidence (2026-10-15)

The g3a review called out isolated black diamonds, an opaque-looking crown and 21.1% back-face hits. Compared the exported near/far sheets directly with `tmp/top-cities/the-gherkin/refs-sheet.jpg`, particularly the aerial and low-angle glass views. The final sheets are `tmp/next-200/fix/g3a/the-gherkin/final-{near,far}/the-gherkin-glb-<LOD>-light-sheet.jpg`; the first iteration is retained under `glb-{near,far}`. The continuous dark spiral, narrower silver lattice and gridded blue-grey lens now read in both LODs. Near/far retain matching overall shape.

Focused tests pin the complete outward skin between joints in both LODs, plus the original dimensions, footprint, spiral layout and member contacts. The radius check distinguishes glazing from the structural steel 0.68 m proud: a single ray may hit either surface. QA metrics report 0% outside-in back-face hits, no layered faces, and no material cycles. Export bytes: near 2,143,104; far 476,112. These are software metrics, not Tesla hardware measurements.

App evidence is under `tmp/next-200/fix/g3a/the-gherkin/`. The selected `app-sheet.jpg` uses Cityscape above and Full 3D world below: `app-{city,world}/the-gherkin-far.png`, `app-{city,world}-east/the-gherkin-near.png`, and `app-{city,world}-plaza/the-gherkin-street.png`. The first north and south camera attempts remain available and are explicitly obstructed by spatially separate neighbouring buildings; they are not replacement evidence.

The selected east camera exposes the bullet, lens and continuous dark spirals without the previous foreground tower covering the shaft. The plaza close-up (bearing 0, zoom 20, pitch 82) exposes the lower diamond glazing, diagrid feet and grade in both modes, with no white extrusion through the skin or exposed foundation. Reports confirm the distant/east view uses far and the plaza view uses near. The seven exact owned OSM outline/part ids and rings were already registered; no additional provider overlap was established, so neighbouring buildings were not masked.

Full terrain/lifecycle certification remains **not tested**: no late/missing DEM, reanchor, exaggeration, route or hardware checks. The shared runtime bundle was not changed. The far night GLB sheet in `final-dark/` retains the unlit dark spiral wells and glass cap grid.
