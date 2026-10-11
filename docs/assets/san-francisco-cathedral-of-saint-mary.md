# Cathedral of Saint Mary of the Assumption

Landmark id `cathedral-of-saint-mary`. Original procedural model of the cathedral at 1111 Gough Street, San Francisco (Pietro Belluschi and Pier Luigi Nervi with McSweeney, Ryan and Lee, cornerstone 1967, consecrated 1971), in its current state: the cantilevered roof slab over the glazed ground block, the travertine tower of flat framed walls and sweeping shell flanks, the fin with a black stained-glass slot at the middle of each face, the glass strips that cross at the summit and the dark metal cross. The parish buildings south of it are drawn as a plain windowed three-storey mass only because the mapped cathedral outline covers them. The old Saint Mary's (Old Saint Mary's, Chinatown) and the second cathedral (burned 1962) are different buildings.

Source: `src/peregrine/landmarks/san-francisco/cathedral-of-saint-mary/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, `cathedral-of-saint-mary-parts.js`, `cathedral-of-saint-mary.test.js`). Build: `pnpm build:san-francisco-landmarks cathedral-of-saint-mary`. Exports: `public/models/buildings/cathedral-of-saint-mary{-near,-far}.glb` and `.json`. Contract: [3d-san-francisco-landmarks.md](../san-francisco-landmarks.md).

## Frame

Real metres, +X east, +Y up, +Z south. Origin `[-122.4253877, 37.7842352]` is the centre of the mapped 63 m ground block (OSM way 436473547), which is also the centre of the cross of fins (way 435831007) and of the tower. `y = 0` is the plaza level at the entrance; the raised plaza, the garage under it and the stairs down to the streets are not modelled, and no terrain, sea level or latitude stretch is baked in. `SPEC.padM` is 64 m: the slab corners are 55 m from the origin and the east entrance terrace (towards Gough Street, about 40 m east of the slab) needs the rest.

The block, slab, tower and fins are all axis-aligned on one grid that is rotated 9.1 degrees from true (the Western Addition street grid; the mapped base edge bears 80.9 degrees, Gough Street is parallel). Geometry is authored in that grid frame (u east, v south) and rotated into local metres when it is added, so the rotation is baked into the GLB and the layer never rotates it. The bronze doors and the plaza face east, to Gough Street (`frontageBearing` 80.9). Geary Boulevard is 70 m north of the slab and Ellis Street 106 m south of the origin (OSM street ways, read 2026-10-01); the annex fills the block's south end.

## Dimensions

| Feature | Model | Basis |
| --- | --- | --- |
| Overall height | 58 m to the tip of the cross | sourced: 190 ft (Wikipedia, C20 Society); matches photographs, where the cross rises roughly 4.5 m over the fins |
| Roof slab | 76.7 x 77.2 m (255 ft class), 10.8 to 12.7 m | plan mapped (OSM outline, which equals the roof edge; Wikipedia 255 ft = 77.7 m); thickness and height estimated from the front elevation |
| Ground block | 62.8 x 63.0 m, glazed walls inset 1.2 m, piers and panels in front, walls 10.8 m | plan mapped (OSM way 436473547, 62.8 x 63.0); bay layout and heights estimated from photographs |
| Tower plan | 35.6 m square, flat walls from the slab to the wall-top rim at 45 m | square mapped (OSM way 436473546: 35.6 m with the four fin tips); wall-top re-measured from the straight-on photograph in the fix round (the fin rises about 21 percent of its height above the walls, the photograph shows about a quarter once its perspective is allowed for) |
| Fins | 3.3 m wide, tips 20.2 m from the centre (2.4 m proud of the walls), tops climbing from the 43 m hub to 53.5 m at the tip | plan mapped (OSM way 435831007: four 3 m blades 40.8 m tip to tip); heights estimated from photographs |
| Glass slot | 1.6 m wide, recessed 0.25 m between two 0.85 m jambs, from 14.2 m to the top | slot sourced (a stained-glass slot on each face rising to the cross); widths estimated |
| Glass strips | 1.6 m wide along the top of each fin, crossing at the centre | sourced: "narrow linear sections which rise steeply from the four compass points to form a bold cross" |
| Shell flanks | two per face, ruled surfaces springing from the fin edge and widening to the corners at the base along a concave crest, 2.4 m deep at the fin | arrangement sourced (eight hyperbolic-paraboloid segments, square at the base, cross at the top); crest shape and depth estimated from the straight-on photograph |
| Crossing hub and cross | 3.3 m stone hub topped at 43 m; dark metal cross 15 m tall (0.32 m section) with a 5.2 m bar, tip at 58 m | the 55 ft (16.8 m) cross of the sources is consistent with a 58 m tip over a hub at about 41 to 43 m; hub height estimated, colour and thinness from photographs (dark, not gold) |
| Travertine joints | 2.4 m pitch grid, near only | estimated from photographs |
| Annex | the mapped outline south of the slab (53.7 m east to 52.7 m west of the origin, v 39 to 87 m), 10.5 m (three storeys of about 3.5 m) with 1.9 x 1.6 m window quads every 3.4 m, four courtyards | outline: OSM relation 7814696; height: OSM gives 18.9 m for the whole relation (taller than the 12.7 m slab, which photographs do not show) so a plausible parish-building height was assumed; the two large courtyards are squared off |

OSM's `height` tags on the three building:part ways (60 m on the block, 77.7 m on the fins) are mapping slips (77.7 m is the 255 ft width) and were not used.

## Materials

Names are keys of `PALETTES.light` and `PALETTES.dark` (same keys): `stone` (travertine, walls, flanks, fins, panels), `stoneDark` (joints, frame strips, rim, lintel, mullions), `slab` (the cantilevered roof), `glass` (ground-floor glazing and annex windows), `bronze` (door leaves, relief ribs and the far door bay), `bronzeLight` (the relief panel above the doors), `metal` (the dark cross), `annex` and the self-lit `glow` (the slots and the glass strips: dark blue-grey by day, warm lit at night). Far merges `stoneDark` into `stone` and drops `bronzeLight`; its door bay is a plain bronze plate, never a black box.

## Modelling decisions

- **Shells as ruled surfaces.** Each flank row is a straight line from the fin edge (x = 1.65, z = 20.2) to the crest (x = X(y), z = 17.8, the wall plane); X(y) narrows from the corner at the slab to the fin at 88 percent of the wall height as `(1 - s)^2.2`. Every horizontal section of a flank is therefore a straight line and the surface twists with height, a hypar-like doubly ruled grid (22 x 8 cells per flank near, 8 x 3 far). The flat wall between the crest and the corner is a separate strip so the crease stays sharp. The test cuts the near flank on three grid rows and checks the straightness.
- **Cross of glass.** The two blades are stone jambs with a recessed glass core; their tops slope from the fin tips down to the crossing, so the glass strips cross at the summit and the cross stands on the crossing. The four arms start at a stone hub 3.3 m square on the crossing and stop at it, so nothing interpenetrates there: the first version let the two blades pass through each other and left slivers of jamb and deck at the centre.
- **Roof deck.** A shallow pyramid inside the framed rim, falling from the rim to the crossing; invisible from the street.
- **Both sides.** Flanks and walls are the outer skin of a closed volume (they stand on the slab and under the rim); the pyramid deck is single-sided because it is only seen from above.
- **No overlaps.** Tower joints are flat quads 0.06 m off the wall (they were 12-triangle boxes, 2.6k triangles), the other joints and windows 0.05 to 0.06 m, frame strips 0.1 m, the glass core is recessed 0.25 m from the jamb faces, the annex stands 0.2 m clear of the slab's south edge, and the north/south rim boxes run through the corners while the east/west ones butt against them.
- **Ground floor.** A blue-grey glass box inset 1.2 m, travertine piers and set-back panels in front with 1.2 m courses and vertical joints as flat quads (2 triangles each), glazing grids (2.4 m mullions, two transoms) on the wings, a lintel, and an entrance bay in every face. The east face carries four bronze door leaves, a transom and a lighter relief panel with five dark ribs; the other faces have the same bay glazed. Far has no joints and a bronze plate for the door.

## Approximations and what is left out

The exact hyperbolic-paraboloid geometry of the eight shell segments is not in the public sources used; the flank crest, its 2.4 m depth, the wall-top and fin heights and the crossing height were fitted to photographs (a straight-on telephoto, two oblique views and the interior views). The corner flare seen in wide-angle photographs from the street is largely keystone distortion and is not modelled. Travertine joints are bars, not a texture. Not modelled: the raised plaza, stairs, fountain and bollards, the lamp standards, the figures of the bronze door relief, the interior, the pipe organ, the bell platform, the slight slope of the slab roof and the rectory/school facades (the annex is a plain extrusion with window quads).

## Verification

Screenshots rendered with `tmp/san-francisco/shot.mjs` under `tmp/san-francisco/shots/cathedral-of-saint-mary/` and compared with the Wikimedia Commons photographs listed in the catalog provenance (Levi Clancy's straight-on photograph of the plaza face, Daderot's oblique from the street, Gndawydiak's views from below, Franco Folini's and Fred Hsu's obliques).

| Iteration | Looked at | Changed because of it |
| --- | --- | --- |
| 1 | overview, facade, corner, back, near, light (procedural) | the south "facade" looked into the annex: the plaza face is east (Gough Street is at u = +79 m); doors, views and `frontageBearing` moved; fin top lowered to 53.5 m and wall top to 48.5 m after estimating the perspective in the telephoto photograph |
| 2 | corner, roof, fin close-up, telephoto at 235 m (near, light) | travertine joint grid, framed corner strips and rim added; slot glass darkened; cross slimmed; glass strips confirmed to cross at the centre |
| 3 | oblique from the east against Daderot's photograph, summit and base-corner close-ups, top view over the red footprint rings, far light and dark | bronze plate moved in front of the glass (it was buried); rim boxes no longer overlap at the corners; annex courtyards that poked through the outline were pulled in and the two large ones squared off |
| 5 (fix round, after the independent review) | Gough, Geary, Geary-and-Gough, far Gough, summit close-up, far dark (exported GLB) | wall top lowered from 48.5 to 45 m and the crossing hub to 43 m (the cross now 15 m, dark metal and thin) so the fins read as a fifth of their height above the walls; ground block given courses, joints, bronze door leaves, a relief panel and gridded blue-grey glazing; tower joints converted to quads; annex lowered to 10.5 m with windows; crossing rebuilt on a hub to remove the slivers |
| 4 | exported GLB: near light (overview, facade, entrance, top), near dark (facade), far dark (overview, corner, facade), far light (facade, roof) | GLB matches the source; night palette lifted the glass from black; no further change |

Viewpoints: front (east, Gough Street side), back (north-west), above (overview, roof, summit, top plan), street level (facade, entrance) and close details (fin, corner base, summit), near and far, light and dark. Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.

## Cost

Near 5 580 triangles, 9 draw calls, 213 368 bytes. Far 1 248 triangles, 7 draw calls, 66 724 bytes. Budgets are 60 000 / 14 / 2.5 MB and 12 000 / 8 / 500 KB. No Tesla hardware measurements.

## Tests

`cathedral-of-saint-mary.test.js` pins the 58 m top and nothing below grade, far within 1.5 m of near; the slab edges (76.7 m) at 10.8 to 12.7 m and the glazed wall behind it; the 35.6 m tower walls at 17.8 m from the axis with the flank proud at the base and flat above; the fin faces at 20.2 m, the black slot (`glow`) at 14 to 48 m recessed 0.25 m, jambs of stone, the fin 3.3 m wide and its top between 52 and 54.5 m; the glass strips of both blades ending on a stone hub with a clean top, the dark thin cross pole and bar (`metal`), nothing above 58 m and the roof deck below the rim; the fin-above-wall ratio of 18 to 26 percent; the ground block's course joints, bronze door leaf and relief, glazing grid and bronze far door; the annex below the slab with windows; straight horizontal sections of the flank on three grid rows; and every vertex inside the mapped outline (1 m slack) with the tower above 20 m inside the mapped tower base.

## Sources

Wikipedia [Cathedral of Saint Mary of the Assumption (San Francisco)](https://en.wikipedia.org/wiki/Cathedral_of_Saint_Mary_of_the_Assumption_(San_Francisco)) (255 ft square, 190 ft, eight hyperbolic-paraboloid segments); [WikiArquitectura](https://en.wikiarquitectura.com/building/cathedral-saint-mary-assumption/) (plan, section, four corner pillars, stained glass on each side); [Laboratorio Nervi, Politecnico di Milano](https://www.laboratorionervi.polimi.it/en/portfolio/cattedrale-di-st-mary-san-francisco-1963-1971/) (Greek-cross arrangement of the paraboloids, 42 m); [Princeton Form Finding Lab](https://formfindinglab.wordpress.com/2018/11/27/pier-luigi-nervi-in-america-part-3-san-francisco/); [Twentieth Century Society](https://c20society.org.uk/building-of-the-month/cathedral-of-st-mary-of-the-assumption-san-francisco) ("narrow linear sections which rise steeply from the four compass points to form a bold cross"); [Archeyes](https://archeyes.com/cathedral-of-saint-mary-of-the-assumption-in-san-francisco-by-pier-luigi-nervi-and-pietro-belluschi/); OpenStreetMap relation 7814696 (outer way 256900649), ways 436473547, 436473546, 435831007 and the Gough Street, Geary Boulevard and Ellis Street ways, read 2026-10-01 through the shared Overpass queue (ODbL 1.0, contributors credited).
