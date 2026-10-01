# San Francisco Museum of Modern Art

Landmark id `sfmoma`. Original procedural model of SFMOMA, 151 Third Street, in its current form (2016 onward): Mario Botta's 1995 building on Third Street (stepped reddish-brown brick masses round the black and white striped turret, sliced on the bias, with its skylight) and, behind it, Snøhetta's 2016 expansion, a 62 m white fibre-reinforced polymer slab with horizontal waves. Two parts, one model, because OpenStreetMap maps them as one building and a driver sees them as one.

Source: `src/peregrine/landmarks/san-francisco/sfmoma/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, `sfmoma-site.js`, `sfmoma-mesh.js`, `sfmoma.test.js`). Build: `pnpm build:san-francisco-landmarks sfmoma`. Exports: `public/models/buildings/sfmoma{-near,-far}.glb` and `.json`. Contract: [3d-san-francisco-landmarks.md](../san-francisco-landmarks.md).

## Frame

Real metres, +X east, +Y up, +Z south. Origin `[-122.400673, 37.785899]` is the area centroid of the OSM hull (way 41692824). `y = 0` is Third Street grade at the entrance. South of Market is rotated: the Third Street frontage runs 135.4 degrees (measured on the 65.2 m frontage and the 56.9 m back wall of the mapped Botta body, which agree to 0.04 degrees, and consistent with every neighbouring building, 134.4 to 135.4). The rotation is baked into the geometry: the layer must not rotate the model. `sfmoma-site.js` carries a design frame (u along Third Street toward the south-east, v inward toward the north-east, y up, `(0, 0)` = the Third and Minna corner) and maps it to model metres through two mapped control points (hull vertices 0 and 1).

## Dimensions

| Feature | Model | Basis |
| --- | --- | --- |
| Expansion roof | 62 m at the Howard Street end, 46 m at the Minna end | sourced 62 m / 203 ft, 10 floors (Skyscraper Center); Architectural Record 200 ft; profile estimated |
| Botta body | 65.2 x 49.0 m (Third Street x depth) | mapped: OSM part 1365384415, 5 levels |
| Turret | cylinder r 9.57 m at u 30.6, v 31.1; rim 27.6 m (front) to 45.8 m (back), slope 0.95 (43.5 degrees) | circle mapped (OSM part 1365384410); rim heights and slope estimated: Botta 5 storeys, expansion about 50 ft taller (Architectural Record), cylinder "sliced at a steep angle", oculus "130 ft above" the floor (Time 1995) |
| Brick tiers | front wall 19.5 m (0 to 11 m deep), band 24.5 m, middle tier 29.5 m (44.6 m wide), end towers 40.5 m | plan mapped (parts 1365384412 / 13 start at 34.8 m); heights estimated from four photographs |
| End towers | 14 m squares, 8.1 to 22.5 m and 38.9 to 52.7 m along the front, 14 m behind the turret | mapped; brick part 10 m wide with a 3.4 m dark slit beside the turret (photograph) |
| Ground storey | 6.2 m, glazing 3 m behind the front, 5 striped columns at 12.7 m | estimated from the night photograph |
| Expansion plan | 108.6 x 30 m slab from Minna to Howard (OSM part 1365384411), curved north-east face, two-storey annex 48.8 x 4.5 m | mapped; annex height 10.5 m estimated (2 levels) |
| Waves | pitch 4.8 m, depth 0.45 m, tilted along the wall | estimated from photographs |
| Ribbon windows | 2.5 m tall, recessed 0.5 m, 3 to 5 per face; gallery glazing 7.5 m tall at the Howard end (25 ft glass wall, Wikipedia) | positions estimated, gallery height sourced |

## Materials

`brick`, `brickDark` (courses and the low-contrast dash rows), `stoneBlack` / `stoneWhite` (turret barrel, ring wedges, column bands), `frp` (expansion), `glass` (pale glass: expansion ribbon windows and the Howard gallery), `glassDark` (dark glazing: ground storey and front slot), `steel` (skylight ribs, annex; near only), `concrete` (roofs), `glow` (skylight and a thin lighting strip under the front soffit, unshaded: lit at night). Light and dark palettes share the keys; dark dims brick, stone and FRP and turns `glow` warm. Far uses 8 materials: no `brickDark`, and `steel` is folded into `concrete`.

## Modelling decisions

- The expansion is the mapped plan taken up to a sloped roof, built as rippled walls: a grid of 1.8 x 1.0 m cells whose outward offset follows a tilted wave, fading to zero at corners, the top edge and (on the Third Street face) below the 45.8 m ledge, so the wall above Botta is the smooth lower white wall the photographs show. Ribbon windows are cells on the same grid pushed 0.5 m back, so the FRP folds round them with no coplanar faces. The roof is zipped from the wall top edges, watertight.
- The turret barrel is 32-sided horizontal black and white bands clipped by the slanted plane; only the strip seen through the notch and the part above the 29.5 m roof are drawn. The slanted face is 48 radial wedges, with an inner wall and lit glass 0.5 m below it carrying a leaf of steel ribs (the herringbone skylight).
- Brick courses are 0.14 m protruding bands every 1.3 m, with six stepped dash rows of darker brick on the front wall and a recessed slot. Near only. The "SF MO MA" lettering was tried as block capitals and dropped (it read as blobs).
- The slab leans: above the 40.5 m towers its Third Street face steps back up to 4 m toward the north-east and the two ends slope in (3.5 m at Howard, 1.5 m at Minna). Position-only, so walls sharing a corner agree, and everything moves inward, inside the hull.
- Hidden faces are not drawn (backs against the expansion, bottoms, the hidden lower turret, the lower Snøhetta wall inside Botta's roofs). Far keeps tiers, notch, turret, slab slope, ribbons and the gallery, with a 5 x 2.5 m wall grid, 16-sided turret and no ledges, columns, ribs or lettering.

## Approximations and what is left out

Every height except 62 m, the step depths and the Snøhetta roof profile are estimates (Skyscraper Center gives only the roof; OSM has levels but no heights). The expansion is its mapped plan with a sloped roof and a simple inward lean; the real building's setbacks and sculpted outline are not reproduced. Not modelled: the "SF MO MA" lettering, the oculus bridge and interior, the SFMOMA Garage and rooftop sculpture garden, the Third Street plaza and the Yerba Buena Gardens, the living wall and terrace planting, FRP panel seams and crystal sparkle. Cityscape and Full 3D world: not tested yet, integration is checked separately. The model is rigid on local `y = 0`; `padM` 80 covers the hull and its entrances.

## Cost

Near 19 258 triangles, 10 draws, 623 KB. Far 2 693 triangles, 8 draws, 95 KB. Budget for a building: 60 000 / 14 / 2.5 MB near, 12 000 / 8 / 500 KB far. Far is about one seventh of near; its bounding box matches near to the centimetre.

## Verification

Looked at (renders in `tmp/san-francisco/shots/sfmoma/`, ignored by git): near light overview, front, turret close-up, street level at 100 m, NE face, NW end, SE end with the gallery, under the front overhang, high NE, top view over the red footprint rings, plan; near dark overview and street night view; far light and dark overview, far at 800 m; the exported GLBs (`final/`, `glb/`) near light/dark and far light/dark from the overview, the front and the 800 m viewpoint, and a look-alike of the 2017 reference viewpoint. Compared against: `2017 SFMOMA from Yerba Buena Gardens.jpg` (both parts from the front), `MoMaSF 2008.jpg` and `SF MoMA from Yerba Buena.jpg` (Botta front, notch, stripes), `SF MOMA, San Francisco at night.jpg` (front wall, columns, sign), `Exterior ... 09.jpg` (waves, recessed window). Changed because of them: top faces were missing from the brick tiers (found in the first overview); side courses floated in front of the towers; the second tier is a 24.5 m full-width band with only the middle 44.6 m rising to 29.5 m (the first version made the 29.5 m tier full width, wider than in the 2017 photograph); the turret slope went from 41 to 43 degrees and its lowest rim to 27.6 m so the ring reads as in the photographs; wave depth rose from 0.28 to 0.45 m; the SW wall became one wall (a visible vertical seam at the Natoma corner); degenerate triangles and unused vertices were removed (the exporter warned about non-unit normals); the annex was too black; lit glazing was added for the night view. After the independent review (PASS-WITH-NITS): lettering dropped; ground storey and slot are dark `glassDark` with a thin `glow` strip, ribbon windows lightened to pale glass (they dominated at 800 m); brick desaturated (#7a4639) and the dash rows made low-contrast darker brick; the slab given a lean; skylight slope documented as 43 degrees everywhere.

## Tests

`sfmoma.test.js` (0.35 s): heights (62 m roof near and far, 46 m Minna end, 40.5 m towers, 45.8 m rim), the three brick tiers by downward rays, the barrel stripes (8+ colour changes over 7 m) and ring wedges by rays, the skylight plane height at three points, the notch and skylight in far, the front (glazing, slot, columns, slit), wave depth over 0.5 m on the Howard wall, a recessed ribbon window, the smooth lower Third Street wall, the glazed gallery, the lean at the Howard end, the dash rows and lighting strip, containment in the OSM hull (worst overhang under 0.8 m), the grid bearing and the frontage glazing 3 m behind the mapped edge, nothing below grade. `san-francisco.test.js` passes for the landmark.

## Sources

Wikipedia "San Francisco Museum of Modern Art"; Skyscraper Center "San Francisco Museum of Modern Art Expansion" (62 m, 10 floors); SFMOMA "Architecture and building information"; Time, 1995 "A Soaring Well of Light"; Architectural Record "San Francisco Museum of Modern Art" (200 ft addition, 700+ panels); OSM ways 41692824, 1365384410 to 1365384416 read 2026-10-01. Photographs (Wikimedia Commons, outside the repository): Beyond My Ken (CC BY-SA 4.0), Andreas Praefcke (CC BY 3.0), JaGa (CC BY-SA 3.0), Dllu (CC BY-SA 4.0), Minette Lontsie (CC BY-SA 4.0), GualdimG (CC BY-SA 4.0).
