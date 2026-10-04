# Pavillon Pierre-Lassonde (MNBAQ, Québec)

Stable asset ID: `mnbaq-pavillon-lassonde`. Original procedural exterior of the Pavillon Pierre-Lassonde of the Musée national des beaux-arts du Québec, 179 Grande Allée Ouest: OMA (Shohei Shigematsu) with Provencher_Roy, opened 24 June 2016. Not the interiors, the older Gérard-Morisset and Charles-Baillairgé pavilions, the Église Saint-Dominique beside it, the sculpture garden or the trees.

## Identity and sources

Consulted 2026-10-04:

- [Wikipédia: Pavillon Pierre Lassonde](https://fr.wikipedia.org/wiki/Pavillon_Pierre_Lassonde): "un jeu de trois blocs de verre superposés en porte-à-faux, aux volumes régressifs", a steel armature "dessinant des droites obliques élancées et fuyantes", panels of varying opacity, the entrance hall **26.5 m wide by 12.5 m high**, a glazed stair "accroché en surplomb à une façade latérale", each volume smaller than the one that carries it, the roofs it leaves "largement verdi" and partly terraces; 14 900 m2.
- [Archello: Pierre Lassonde Pavilion](https://archello.com/project/pierre-lassonde-pavilion), with [Area](https://www.area-arch.it/en/pierre-lassonde-pavilion/) and [ArchDaily](https://www.archdaily.com/785982/omas-pierre-lassonde-pavilion-of-the-musee-national-des-beaux-arts-du-quebec-to-open-in-june): the galleries stacked in three volumes of decreasing size, **temporary exhibitions 50 x 50 m, permanent collections 45 x 35 m, design and Inuit art 42.5 x 25 m**, "a cascade ascending from the park towards the city"; the top tier's **26.5 m cantilever** shelters an urban plaza; a Grand Hall 12.5 m high faces Grande Allée; a triple-layer glass facade (a 2D printed frit that mimics the truss structure, 3D embossed glass, diffuser glass); a "lopsided ziggurat" whose volumes shift from the centre into more pronounced cantilevers.
- OpenStreetMap through the shared Overpass queue: **way 487158604** (`building=yes`, 4 201 m2, 11 vertices): the pavilion's whole outline, an orthogonal staircase in plan; **way 389475849** (273 m2, `building=yes`), a wing of the Église Saint-Dominique's presbytery that shares two vertices with it on the north-east side and stays provider; the church (way 103858687); Grande Allée Ouest (way 269997156/7, route 175, four lanes, bearing 50.4 degrees) and Avenue Wolfe-Montcalm (way 156804394) to find the front. Derived data © OpenStreetMap contributors (ODbL 1.0).
- Wikimedia Commons photographs, downloaded to ignored `tmp/quebec/mnbaq-pavillon-lassonde/refs2/` only, to compare (nothing from them is in the repository or the GLBs): *Pavillon Pierre-Lassonde-Québec* (Gilbert Bochenek, CC BY-SA 4.0; the cantilever, the hall and the stair from the park side), *Pierre-Lassonde 18* (Cephas, CC BY-SA 4.0; at night), *Pavillon Pierre-Lassonde 02, 04, 05, 06* (Jeangagnon, CC BY-SA 3.0, during construction; the dossier's own six photographs are artworks, not the building).
- A public Terrarium DEM tile (z15), sampled on a 4 m grid, to decide the terrain pad.

Only the box footprints, the hall height and the 26.5 m cantilever are published; **every other height, the stair, the bays and the colours are estimated from the photographs**.

## Frame

Real metres, **+X east, +Y up, +Z south**. Origin `[-71.224914, 46.8007043]` is the area centroid of way 487158604. The eleven mapped vertices fall on a clean staircase once the plan is turned to bearing **139.34 degrees** (the axis that makes them share the fewest distinct lines; the worst residual is 0.5 m). The model is authored on that grid, `(a, y, b)` with `a` toward the south-east (away from Grande Allée), `b` toward the north-east and `(0, 0)` at the south-west corner of the street end, and turned once into the model frame (`mnbaq-pavillon-lassonde-site.js`); the layer never rotates it again. The street front, the 25.3 m end of the top box, is parallel to Grande Allée and looks toward bearing **319.3**. `y = 0` is the plaza and ground-floor level on Grande Allée; no terrain or latitude stretch is baked in.

Plan, in design metres (`a` along, `b` across): the street end is 25.3 m wide for the first 21 m, steps out to 40.8 m for the next 20 m (to a = 41) and to 58.25 m for the last 51 m (to a = 91.9), with the south-west wall on b = 0 (b = 4.5 beyond a = 67.35). Reading it as OMA's boxes: top box a 0 - 42.5, b 0 - 25.3 (**42.5 x 25.3**); second volume a 21 - 67.35, b 4.5 - 40.8 (**46.3 x 36.3**); first volume a 41 - 91.9, b 4.5 - 58.25 (**50.9 x 53.7**). Each box is shifted about 21 m toward the street from the one below, which is OMA's "shift from center into more pronounced cantilevers"; the strip b 0 - 4.5 south-west of a = 42.5 is the glazed stair.

## Dimensions

| Feature | Value | Source |
| --- | --- | --- |
| Outline | 4 201 m2, 91.9 m long, street end 25.3 m wide, 58.25 m widest | OSM way 487158604 |
| Top box (design and Inuit art) | 42.5 x 25.3 m, roof 26.5 m | OMA 42.5 x 25 m; mapped plan; height estimated |
| Second volume (permanent collections) | 46.3 x 36.3 m, roof 13 m | OMA 45 x 35 m; mapped plan; height estimated |
| First volume (temporary exhibitions) | 50.9 x 53.7 m, roof 8.5 m, ground floor glazed to 5 m | OMA 50 x 50 m; mapped plan; heights estimated |
| Cantilever over the plaza | 21.4 m on the mapped plan (soffit at 13 m), 4.5 m over the south-west side | OMA 26.5 m (probably measured from the structural core); soffit height estimated |
| Grand Hall | glazed wall 20.8 m wide on the mapped line, **12.5 m** glazed under a 0.6 m spandrel | OMA / Wikipédia 26.5 x 12.5 m |
| Glazed stair | prism 4.4 m tall, 5.0 m wide (0.3 m outside the mapped south-west line), 24.9 m long, rising 17 m from the plaza (0.4 m) to the south-east end of the top box at about 34 degrees (it was a 3.5 m tall ribbon rising 5.6 m from 8.7 m, which read short and low) | estimated (photographs); position from the plan strip |
| Gold lantern | 11 x 15 m, 3.1 m tall, on the south-east end of the top box roof | estimated (the warm box above the pale glass in the photographs) |
| Roof terraces | 0.9 m parapets; green roofs on the 8.5 m and 13 m roofs | Wikipédia (toits verdis, terrasses); parapet estimated |
| Overall | **29.6 m high** (the lantern); 92 x 59 m on the 139.3 degree grid | model bounds |

## Model

Source `src/peregrine/landmarks/quebec/mnbaq-pavillon-lassonde/`: `geometry.js` (model), `mnbaq-pavillon-lassonde-mesh.js` (flat-shaded soup with orientation hints, boxes, wall panels, mullions, rails and braces), `mnbaq-pavillon-lassonde-site.js` (design frame and levels), `config.js`, `footprint.js`, `views.js`, `mnbaq-pavillon-lassonde.test.js`. Build: `pnpm build:quebec-landmarks mnbaq-pavillon-lassonde`. Nine materials near, seven far: `frit` (pale frosted glass and spandrels), `glow` (the diffuser glass of the top box, the second volume's strips, the skylights; drawn unshaded: pale white by day, warm white at night), `glass` (clear glazing, dark and reflective), `light` (the lit floors seen through the clear glass; unshaded: the same dark glass colour by day, warm at night), `soffit` (the dark underside of the cantilever and of the stair), `steel` (mullions, rails, truss braces), `gold`, `green` (roof terraces), `concrete` (parapets, the plaza-side wall; far folds it into `frit`).

Features present in both LODs: the three stepped volumes on the mapped staircase plan; the top box with its two floors of diffuser glass between frit spandrels, cantilevered 21 m over an **open plaza** (a ray at any height from the street reaches the hall wall 21 m back) with a dark soffit at 13 m and a 4.5 m overhang along the south-west side; the 12.5 m glazed hall with lit floor bands; the recessed glazed ground floor along the south-west wall under the overhang; the pale translucent band of the first volume and the glow strip of the second; the glazed stair prism with its dark underside climbing toward the top box; the green terraces with their parapets; the gold lantern; the white concrete wall beside the hall (0.3 m inside the presbytery's mapped wall, so it never shares a plane with the neighbour). Near adds the glazing grid (mullions every 2.5 - 3.3 m, a rail at the ground-floor line), the vertical joints of the diffuser glass and the full-height diagonal truss braces that alternate by bay on each side of the top box (0.26 m braces: the real pattern is printed frit), the white frames and rails of the stair, and the three skylight monitors on the top box roof.

Cost (exported default scenes): **near 1 952 triangles / 9 draws / 161 476 bytes; far 242 / 7 / 26 084.** Budgets are 60 000 / 14 / 2.5 MB and 12 000 / 8 / 500 KB. Untested on Tesla hardware. The near model is deliberately light: the building is large flat glass planes, and the budget was not needed to read them.

## Terrain (Full 3D world)

A public Terrarium DEM tile (z15, 3.8 m pixels), sampled on a 3 m grid inside the mapped outline (463 samples), reads **91.9 m (lowest) to 94.2 m, median 93.0 m**; the street end is about 1 m above the median (93.2 m median over the north-west third) and the park end about 0.6 m below it (92.4 m over the south-east end). That is a little over the 2 m the contract allows without a pad, and the default disc round the centroid takes the lowest sample (91.8 m), which would sink the street plaza and the hall about 1.5 to 2 m. `SPEC.terrainPad` is therefore `{ rings: FOOTPRINTS, datum: 'median', featherM: 10 }`: the outline (which includes the plaza under the cantilever) is held at the median and blended back over 10 m. Expect the street end to stand about 1 m under the drawn ground (the hall's lowest metre is cut off by the plaza's 1 m rise to Grande Allée) and the south-east end about 0.6 m above it; the model is rigid and does not follow the slope. The real site falls more steeply toward the Plains of Abraham than this coarse DEM shows; OMA's description ("relier les plaines d'Abraham en bas et la rue en haut") says the stack ascends toward the street, which the model's heights reproduce. Not measured in the app.

## Approximations

- Every height other than the hall's 12.5 m is estimated from two photographs and the mapped box sizes (ground floor 5 m, first roof 8.5 m, second roof 13 m, top box roof 26.5 m): the photographs show the soffit about as high as the hall is, and the top box about as tall as the hall, which gives the 13 m soffit and the 13.5 m box. A real height of 24 to 32 m is plausible; the model's 29.6 m is not a published figure.
- The cantilever is 21.4 m on the mapped plan against OMA's 26.5 m, and it stays so: the mapped step at a = 21 is where the hall's glass stands, and moving it back to reach 24 m would shorten the 12.5 m hall and its concrete wall against the mapped re-entrant corner. The mapped plan is the outline the provider replaces, so the plan wins; OMA's figure probably runs from the structural core behind the hall wall.
- The truss is drawn as 0.26 m steel braces; the real one is a printed frit pattern, nearly invisible by day. The braces are the pattern's identity at a distance and the cheapest way to read it.
- The glazed stair's slope (about 34 degrees, plaza to top box), length and depth, the bay rhythm, the lantern's footprint and the colours are estimated. The 79-step spiral stair, the concrete pentagon of the hall, the cloakroom block, the interiors and the sculptures on the terraces are not modelled.
- The south-west overhang of the top box (4.5 m) and the stair strip share the mapped b = 0 line; under the stair the ground is open, as in the photographs.
- Nothing is built outside the mapped outline (every vertex passes the layer's 0.8 m ownership test).

## Placement modes

**Cityscape** (flat ground): not tested yet, integration is checked separately. **Full 3D world**: not tested yet, integration is checked separately (`terrainPad` declared, see Terrain).

## Verification

Looked at with `node .agents/skills/build-3d-city/scripts/shot.mjs mnbaq-pavillon-lassonde ...` (images in ignored `tmp/quebec/shots/mnbaq-pavillon-lassonde/`), against the Bochenek day photograph and the Cephas night photograph:

1. Procedural near, light, overview / street end / street level / roof / stair / park: the cascade of three volumes, the cantilever with its truss, the hall, the stair and the terraces read as in the photographs. Changed after it: the soffit girders were removed (too heavy, the soffit is smooth), the braces thinned from 0.4 to 0.26 m, the ground-floor glazing got lit bands (`light`) so the pavilion glows warm at night as in the night photograph.
2. Procedural near, dark, and far, light: the top box and the lit floors glow, the stair underside stays dark; the far model keeps the cantilever, the plaza, the recessed ground floor, the stair and the terraces. Changed: the night soffit was lightened (plaza lighting).
3. Plan view (`--top`) over the red ring: the stack covers the mapped staircase, the street end at the north-west, the stair strip along the south-west side, the lantern at the south-east end of the top box. The ring coincides with the model's edges, so containment is asserted numerically in the test.
4. Exported GLBs, near light (overview / street end / street level / park), far dark (same four views), near dark (hall / roof / park / stair), plus a driver's view 100 m from the plaza: they match the procedural renders.
5. `qa-metrics.mjs`: 0 coplanar overlaps of different materials, 0 % back-face hits on 254 outside-in rays, nothing below grade, far bounds equal to near.
6. `node --test src/peregrine/landmarks/quebec/quebec.test.js` and `mnbaq-pavillon-lassonde.test.js` pass; the latter pins the 8.5 / 13 / 26.5 / 29.6 m levels, the three plan boxes, the open plaza and the 13 m soffit, the 12.5 m hall, the climbing stair, the truss, the night materials, containment in the mapped outline and the exported GLBs.

Open: the heights are photograph estimates; the hall's pentagon wall, the interior stair and the sculpture garden are missing; Cityscape and Full 3D world are untested.
