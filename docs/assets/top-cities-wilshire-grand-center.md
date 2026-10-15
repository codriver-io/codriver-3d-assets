# Wilshire Grand Center (Los Angeles)

Original procedural model of the Wilshire Grand Center, 900 Wilshire Boulevard, downtown Los Angeles (AC Martin, completed 2017): a 335.3 m glass tower on the block between Wilshire Boulevard, 7th, Figueroa and Francisco streets, topped by a sail-shaped crown and a 90 m mast, with a seven-level hotel and retail podium. Part of the [top-cities set](../top-cities-landmarks.md). Source: `src/peregrine/landmarks/top-cities/wilshire-grand-center/`. Exports: `public/models/buildings/wilshire-grand-center-{near,far}.glb`.

## What a driver sees

From Figueroa, 7th or the 110 the tower is the tall slim glass blade with the arched, sloping crown and the mast beside it. Its south-west face is bowed and mostly smooth glass with a few long vertical fins; the shaft narrows toward the north-west end while the south-east end stays upright, so the silhouette leans. The crown's top edge is a convex arc, highest at the north-west end and falling toward the mast. The podium is a dark glass seven-storey block west of the tower.

## Sources and dimensions

| Quantity | Value | Basis |
| --- | --- | --- |
| Total height to the mast tip | 335.3 m | sourced (Wikipedia, Skyscraper Center, OSM way 496246723 `height=335.3`) |
| Roof (crown top) | 283 m | sourced (928 ft) |
| Mast | 90 m, from 245.4 m | sourced (OSM spire part 901739648: "spire height is 89.916 m"; tower part 1307580959 `height=245`) |
| Storeys | 73 (tower), 7 (podium) | sourced (OSM `building:levels`) |
| Plan axis | bearing 127.4°, along Wilshire | mapped (the 52 m NE strip, way 1307580961) |
| Tower plan at grade | ≈ 58 m × 34 m: straight NE face, square SE end, a 6 m prow strip carrying the mast, bowed SW face (c ≤ 42.7 m), NW end with a notch | mapped (OSM parts 1307580959/60/61) |
| Podium | outline of way 1307580962, 31 m + 1.2 m cornice | outline mapped, height estimated (7 levels × 4.4 m) |
| Taper | 0.65 along the axis and 0.85 across at 283 m, linear, anchored on the SE end | estimated from photographs |
| Crown top edge | 283 m at the NW end, 262 m at the prow, `283 − 21 (1−t)^1.7` | estimated from photographs |
| Floor pitch | 3.95 m (60 floors from an 8 m lobby to 245 m), spandrel 1.25 m | estimated |
| Truss zone | zig-zag X trusses 58–76 m on the NE and SW faces | estimated from photographs |

## Modelling decisions

- **One tapering plan ring** (`wilshire-grand-center-parts.js`): the mapped base plan is scaled toward its SE end by a linear law, so every floor stays inside the mapped footprint (checked by test) and the south-east end stays upright. Walls are lofted rows (lobby, then spandrel and glass per floor) with normals smoothed along the bowed run and hard at corners.
- **Sail crown**: from 245 m the glass continues to a top edge defined per plan vertex, closed by a sloping roof; LED lines (`light`, self-lit) between the fins.
- **Fins** on the bow's vertices run the full height and up the crown; a thicker spine marks the prow. Trusses are bars bay by bay so the chords follow the curved face.
- **Mast**: three tapering cylinders with collars (near) and a red `lamp` tip at night; it stands on the prow strip at the OSM spire position and rises through the crown roof.
- **Podium**: the mapped ring extruded with a stone plinth, dark glazing bands with silver spandrels, mullions every 4.5 m (near), a roof terrace with a pool; edges that coincide with the tower wall get no wall.
- **Night**: a deterministic share of panes on tower and podium are `glow` quads 15 cm proud (near) or 30 cm (far); the crown LED lines are `light`.
- **Mullions and the stepped NW end (review g6)**: near adds one slim light strip per 3.6 m bay from the lobby to the shaft top (a straight 2-triangle quad, because the taper is linear in height, 14 cm proud), and the NW end faces (a < -72 m in the plan) get a ledge (0.9 m deep, 0.5 m tall, fin material) at every second floor line, the sawtooth edge of photographs 7 and 8. Far keeps the ledges at every fourth floor, 1.4 m deep.
- **Far LOD**: same silhouette (bounds within 1.5 m, test), every floor line kept (3.95 m glass and spandrel quads, review g6: the earlier 13 m bands read as giant stripes) with fewer bays and two bow vertices dropped, ledges at every fourth floor on the NW end, fewer fins, no trusses, no pool or lamp; steel merged into the fin material and plinth stone into the spandrel colour (8 draws).

## Materials

glass, spandrel, crown, fin, metal, pglass (podium glazing and lobby), stone, roof, glow, light, lamp, water: same keys in `PALETTES.light` and `.dark`. Day is a blue-grey reflective glass; night is dim glass with warm lit panes, a cool-white crown and a red mast lamp.

## Approximations and gaps

The real tower's north-west end has stepped, faceted floors and the south-east end a deeper spine; both are simplified (square end, strip prow, one fin). The sloping canopy east of the podium, the real pool position and the lobby entrances are not modelled. Pane lighting is random, not the real floor use. Colours are calibrated by eye to photographs.

## Cost

Near 8.4 k triangles / 12 draws / 416 KB; far 5.3 k triangles / 8 draws / 262 KB (budget: near ≤ 60 k / 14 / 2.5 MB, far ≤ 12 k / 8 / 500 KB).

## Verification

`wilshire-grand-center.test.js` pins the 335.3 m top, nothing below grade, the footprint containment (< 1.6 m), the NE-face bearing, the convex crown arc (283 → 262 m) closed by a roof, the taper (base 58–62 m long, 220 m 38–46 m, prow fixed, NW end moves > 12 m), the bowed face, the mast base on the roof and its radius at 300 and 330 m, truss ends touching the glass with a deliberately shortened chord finding no steel, fins at 100, 240 and 270 m with glass between them, the 32.2 m podium roof and the far LOD envelope.

Screenshots looked at (`tmp/landmarks/shots/wilshire-grand-center/`): procedural near light sheet (overview, facade, crown, podium), a facade close-up, a podium close-up, GLB near dark sheet, GLB far light sheet, GLB far dark podium close-up, GLB near light crown and overview, a top view; compared with refs 1, 6, 7 and 8 (`tmp/top-cities/wilshire-grand-center/refs/`). Changes made after looking: lowered spandrel/glass contrast and the day colour of lit panes (patchy); replaced thin truss lines by bold X frames and made their chords follow the bow (the straight chord was buried mid-span); re-anchored the taper on the mapped SE end and added the OSM notches there after the footprint check showed the SE end 2–4 m outside the outline; gave the far podium six bands (three read as giant stripes); added podium lighting. Cityscape and Full 3D world placement not tested yet; the lead checks them in the app.

Review g6 follow-up: GLB sheets (near and far, overview / NW end / crown / rear / podium / street) in `tmp/next-200/fix/g6/wilshire-grand-center/glb-{near,far}/`; app captures from four bearings in both modes (zoom 17, pitch 58, near LOD) in `tmp/next-200/fix/g6/wilshire-grand-center/app/{city,world}-b{0,90,180,270}/` from a scratch bundle (the shared `public/peregrine.js` was not rebuilt). The provider extrusion of the block no longer shows in either mode; the podium base is partly hidden by neighbouring towers from most bearings (clearest at bearing 90). Tests added: far panes about one floor tall, NW ledges in both LODs.
