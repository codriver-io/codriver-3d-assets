# George C. King Bridge, Calgary (top-cities)

Free-standing procedural model of the **George C. King Bridge** ("Skipping Stone Bridge", RFR with Halsall/WSP, opened 20 October 2014): the 182 m pedestrian and cycle bridge over the Bow River between East Village (south) and Bridgeland (north), touching St Patrick's Island in the middle. It carries no road, so it is drawn like a building (footprint ring replaced, no road layer). Source: `src/peregrine/landmarks/top-cities/george-c-king-bridge/`; exports `public/models/bridges/george-c-king-bridge{-near,-far}.glb` + `.json`. Contract: [3d-top-cities-landmarks.md](../top-cities-landmarks.md).

## What makes it this bridge

Three network-arch spans (99 m south, 31 m centre, 52 m north) that step down and up like a skipping stone. Over each span a **pair of grey steel box arches** leans in toward each other: the feet stand outside the deck, the crowns come to within a few metres of the axis above it. The pale deck **rises gently over each span** and returns to the deck line at the piers. Thin **hangers cross** between each arch and the deck edge in two families (network arch). Each arch springs from a **concrete skewback block** beside the deck (shared by the two arches that meet at an interior pier) that stands 1.0 m over grade and goes down to a footing at -2.95 m; under the deck a pier column and cross cap carry the girder, with V struts up to it. The mapped **78 m island ramp** leaves the east edge of the centre span, whose rail is open at its mouth.

## Frame, footprint, origin

- Origin `[-114.0468962, 51.04825375]`: the middle of the two end nodes of the mapped cycleway (OSM way 206004051), 182.55 m apart on bearing 21.10 deg (local plane; `frontageBearing`). Frame: u along the axis toward the north end, v to the right (east), y up from local grade. Rotation is baked into the GLB (`rotateY(YAW)` once).
- `FOOTPRINTS`: the mapped outline (way 1328870003, `man_made=bridge`, 182.6 m, 7 to 11 m wide). The test keeps every vertex within 1.2 m of it in plan: the mapped outline is rough (a straight +-3.5 m rectangle along the south span), and the skewback blocks (+-4.75 m) are the widest parts. The ramp (OSM way 779639382, a `bridge=yes` footway, not an extrusion) lies outside the outline and is checked against its own centre line instead. OSM ids: 1328870003 (outline), 206004051 (axis), 779639382 (island ramp, modelled), 1328870004 (south approach).
- `terrainPad`: one 18 x 11 m ring per abutment (median datum, feather 12 m) instead of a disc, because the river and the island are lower than both banks.

## Dimensions

| quantity | value | status |
| --- | --- | --- |
| length | 182 m (model 182.6 m, the mapped outline) | sourced (Wikipedia, WSP) |
| spans | 99 / 31 / 52 m (south / centre / north) | sourced (8th Int. Conf. on Arch Bridges, 2016, via search result; sum matches 182 m) |
| arch type, crossing hangers | network arch, inclined hangers | sourced (WSP) |
| bearing, ramp junction | 21.10 deg; island ramp at u = +23.9 m, mid centre span | mapped (OSM) |
| arch crown above the walking surface | 17.5 / 6.6 / 10.8 m | estimated from photographs |
| arch lean | feet 8.0 m apart, crowns 3.2 / 4.8 / 3.8 m apart | estimated |
| arch section | 1.1 x 0.8, 0.76 x 0.56, 0.92 x 0.66 m ellipses | estimated |
| deck | 4.4 m wide, slab 0.2 m, steel box girder to 0.8 m below the surface | estimated |
| deck rise over the span | 1.0 / 0.35 / 0.6 m | estimated |
| handrail | 1.15 m top rail, posts every 2.5 m, two wires (near) | estimated |
| hangers | 132 near (r 4.5 cm, 4 sides), 72 far (r 10 cm, 3 sides); 60 deg crossing | estimated |
| skewback blocks, pier columns, abutments | footings at -2.95 m, blocks 1.0 m over grade (Full 3D world buries the footings; the terrain there sits within about 0.3 m of the deck line, so a lower block disappears) | estimated |
| island ramp | OSM 779639382: leaves the deck at u = 24.0 m, 78.3 m to the landing (u 38.1, v 77.5); 3.0 m wide, walking surface 0.30 m falling to 0.10 m, rails 1.15 m, supports at 33 %, 66 % and the landing | mapped alignment, estimated section |

## Materials

`steel` (arches, girder, struts), `deck` (pale concrete walking surface), `rail`, `cable` (hangers), `concrete` (skewback blocks, pier columns, ramp supports, abutments); same keys light and dark, nothing self-lit. The photographs show silver-grey steel and a pale deck, so the steel is a light grey in the day palette (`#8c959d`), dimmed for night.

## Modelling decisions and approximations

- Arch centre line: `y = spring + (crown - spring) * (1 - |2t-1|^2.3)`, lateral offset linear in the same shape, so each arch lies in an inclined plane (a pair leans in). Smooth-shaded elliptical sections (10 sides near, 6 far).
- Hangers: the top end sits inside the arch tube, the bottom inside the deck edge slab; none where the arch is within 1.5 m of the deck. The tests measure both ends against the named supports in both LODs and include a deliberately shortened hanger that must be refused.
- Skewback blocks (1.5 m across, 3.95 m tall) take each arch foot; adjacent arches meet in one block at an interior pier, a cross cap ties the pair, and a column under the girder (grounded on the -2.95 m footing) carries it. The two V struts per interior pier join block and girder. In Full 3D world the terrain at the piers sits within about 0.3 m of the deck line (measured in the app: a first 0.35 m block was nearly buried), so the 1.0 m blocks are what shows under each foot.
- Island ramp: slab on a trapezoid girder following the mapped way from the deck edge; it starts under the deck edge 10 cm lower, so it never shares a plane with it, and descends 20 cm over its length. The deck's east rail, posts and the hangers whose feet would fall in the mouth are left out between the ramp's two edge lines; the ramp's rails start where those lines cross the deck rail. The girder's end faces sit 60 cm inside the slab's so no two materials share a plane (depth-layer check: 0 cycle edges).
- Not modelled: light masts, signage, the river and island (the ramp's landing hovers up to about a metre over the island ground in Full 3D world, on its abutment). Deck and abutment levels are on the flat map's grade; Full 3D world is checked separately.
- Colour: the form is sometimes called "dark steel"; the photographs show silvery grey, which is what the model uses.

## Costs (exported)

| | triangles | draws | size |
| --- | --- | --- | --- |
| near | 13 864 | 5 | 946 KiB (968,920 bytes) |
| far | 5 068 | 5 | 359 KiB (367,308 bytes) |

Budget for a bridge: near 120 k / 40 / 4.5 MB, far 30 k / 10 / 1.2 MB. Far is about 37 % of near (hangers fewer and thicker, 4 m arch and deck segments); its bounding box matches near within 5 %.

## Verification

Reference photographs (Commons, in ignored `tmp/top-cities/george-c-king-bridge/refs/`; credits in the catalog record): CC BY / CC BY-SA, used only to compare.

Looked at (contact sheets under `<local path>`): procedural near-light sheet (overview, facade, roof, deck, tower, underside, end), top view over the red footprint ring, procedural far-dark, **exported GLB** near-light and far-dark sheets. Findings and changes: arches thickened after the first sheet (they read thin against photos 4 and 6); the foot spacing narrowed from 8.6 to 8.0 m and the pier caps from 10.2 to 9.2 m so the model stays within 1.2 m of the mapped outline; hangers where the arch is within 1.5 m of the deck were dropped (zero-length members). Photo 5 (end-on) is matched by the deck view: arch crowns lean over the walkway.

Tests: `node --test src/peregrine/landmarks/top-cities/george-c-king-bridge/george-c-king-bridge.test.js` (outline fit, spans, crown heights by raycast, lean, deck rise, nothing below -2.95 m, every arch foot in a block that reaches the footing and stands over grade, pier columns, the ramp (rail open at the mouth, surface heights by raycast, supports from footing to girder with a negative control), hanger terminals vs arch and deck with a free-end negative control, a hovering foot refused, far silhouette).

Cityscape and Full 3D world static appearance: **verified** separately in the g5r app captures below. Terrain off/on and reanchor restoration: verified by the real building-layer test for source and both GLBs. Live terrain replacement, delayed DEM, navigation and device performance remain **not tested**.

### Review fix (g5)

The reviewer's world street capture showed arch feet ending without visible supports (the old caps sat wholly below grade, so the terrain hid them) and the island path running under the uninterrupted centre-span rail. Changes: skewback blocks 1.0 m over grade with footings to -2.95 m, pier columns, the modelled ramp with the open rail, a 60 cm inset of the girder's end faces (a depth-layer cycle). Near 12 136 -> 13 864 triangles (796 -> 928 KB), far 4 232 -> 5 068 (288 -> 351 KB), 5 draws each. Looked at: procedural near-light and exported GLB near-light/far-dark sheets (overview, underside, ramp, deck) and app shots in both modes under `tmp/next-200/fix/g5/george-c-king-bridge/app/`.

### Scoped landing correction (g5r)

Only the island ramp's final 22 m changes in Full 3D world: the slab, steel girder, rails/posts and landing abutment ease downward by 0.50 m using the existing building layer's per-mesh `terrainOffsets` metadata. Both exported LODs carry the offsets; Cityscape keeps every authored position exactly, and the bridge junction and remaining bridge stay fixed. Near/far triangles and draws remain 13,864/5 and 5,068/5. Metadata increases near 950,024 → 968,920 bytes and far 359,692 → 367,308 bytes.

The offset is an estimate from the loaded Terrarium z15 terrain, not a survey altitude or live road fit. At the mapped endpoint [-114.0456657260, 51.0483225340], the close captures record a bridge pad datum of 1043.50 m and terrain 1043.025 m: the corrected landing is 1043.10 m (7.5 cm above the DEM, versus 57.5 cm before). Its concrete abutment top is below the path; all ramp components share the smooth taper, whose maximum added grade is 3.4%. There is no exposed block or visible step in the inspected world close views. The relative offset uses the existing world-only mechanism; terrain source changes with different local relief require revalidation.

Evidence under `tmp/next-200/fix/g5r/george-c-king-bridge/`: `glb/` exported near-light/far-dark overview, underside and ramp sheets; `app/{city,world}/george-c-king-bridge-{far,near,street}.png`; and `app/{city,world}/island-landing-{near,far}-{100,200}.png` (two opposing close angles per LOD, with `landing-report.json` recording active LOD, terrain state and offset runs). Both modes use the ordinary Protomaps renderer, isolated /tmp runtime bundle, slot I 3302/3304. All these captures were inspected; Cityscape is unchanged and world now meets the path. One model look-fix iteration.

Validation: landmark 10/10, including actual building-layer terrain application, exact Cityscape restoration, repeated toggles and reanchor on both procedural models and both exported GLBs; depth regeneration/check with zero dropped cycle edges; catalog valid (406 entries / 766 variants). The complete requested top-cities run had 826/828 passing, with unrelated Frost Bank Tower `occupiedGlass` and Georgia Aquarium source/export bounds failures. George C. King Bridge passes its three registry checks. No SPEC.ready edits or assertions, shared renderer bundle writes, git writes or shared-tree app server starts.
