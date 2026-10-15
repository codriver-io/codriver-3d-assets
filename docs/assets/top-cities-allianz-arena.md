# Allianz Arena, Munich

Original texture-free procedural model of the Allianz Arena at Franz-Beckenbauer-Platz 5, Fröttmaning, opened 30 May 2005 (Herzog & de Meuron with Arup). Its identity is the soft, rounded "rubber dinghy" shell of inflated diamond-shaped ETFE cushions, with a long oval roof opening over the pitch, standing on a dark concourse and the 1 m esplanade deck. The shell is white by day; the exported night palette shows it lit red (the real facade changes between red, blue and white).

## Sources and frame

- [Wikipedia](https://en.wikipedia.org/wiki/Allianz_Arena) and the dossier's `facts.txt`: 2,874 ETFE cushions, 2003-05, 70,000 / 75,000 seats, Herzog & de Meuron and Arup. Published size 258 × 227 m, 50 m high.
- OSM [stadium relation 18413487](https://www.openstreetmap.org/relation/18413487): widest outline (way 1257847557), roof opening (605825026), plaza-level building (4431170, "outline of the main arena building on plaza level") and the [esplanade relation 7115751](https://www.openstreetmap.org/relation/7115751) (outer way 483233746, deck 7.5-8.5 m). 141 `building:part` ways (128 grandstand, 13 roof) in the ring are listed in `OSM_WAYS`; all lie inside the two footprint rings. ODbL 1.0.
- Six reference photographs (Commons; credits in the catalog record) in ignored `tmp/top-cities/allianz-arena/refs/`.

Origin `[11.624701, 48.218791]` is the area centroid of the widest outline (the stub's point was about 4 m off). Real metres, +X east / +Y up / +Z south, `y = 0` flat-map grade. The plan outlines in `allianz-arena-plan.js` were converted once with the layer's own Mercator projection; the generator imports no runtime code. The long axis (pitch) is 77.4° from +x toward +z (bearing 168°), measured from the mapped roof opening, and the shell, opening and deck all follow the mapped rings, so the rotation is baked in. The site is flat, so no terrain pad is declared.

## Dimensions

| Item | Model | Reference |
| --- | --- | --- |
| Crown height | 50.1 m (cushion apex) | published 50 m (OSM tag 52 m) - sourced |
| Skin length × width | 259 × 225 m | published 258 × 227 m; OSM widest outline 261 × 227 m - sourced |
| Roof opening | about 123 × 86 m | OSM way 605825026 - sourced |
| Esplanade deck | top 8.5 m, 1 m thick, mapped ring; level round the arena, graded to the ground over the south wedge | OSM min_height 7.5 / height 8.5 - sourced; the grading of the wedge and tail is modelled, the long ramp beyond the mapped ring is not |
| Skin cross-section | base on the plaza outline at 8.5 m, widest outline held from 18 to 34 m (nearly upright flank), shoulder at 39-44 m, crown 49.3 m, opening rim 46.8 m | estimated from photographs |
| Cushions | about 2,300 diamonds at about 11 × 7 m (near); about 410 at 24 × 14 m (far) | 2,874 real - estimated |
| Pitch | 105 × 68 m, 5 m run-off, y = 0.5 m, centre circle, penalty areas | FIFA size; markings simplified |
| Bowl | three tiers from the pitch to 40.6 m under the roof | estimated |

## Modelling

The skin is one lofted surface: the smoothed polar radii (Fourier harmonics up to 12, scaled to stay inside the mapped ring) of the widest outline and the roof opening are blended along a cross-section (`SKIN_KNOTS`, Catmull-Rom, resampled so every row is the same height), bottom row on the plaza outline. A rhombus lattice (vertices where column + row is even) is laid on it with equal arc length round the widest outline; every diamond is a four-sided pyramid (a 0.7 m inflated cushion, three-sided at the base and rim rows), so neighbours share their base edges and nothing overlaps. Near adds a rib strip (28 cm wide, 15 cm proud) on every lattice edge; far keeps ribs at 60 cm wide, 22 cm proud, which keeps the diamond rhythm at distance. The roof opening has a 4.5 m inner lining (`glow`, self-lit) and the soffit under the roof down to the bowl's back wall. Through the opening you see the seating bowl (seat tiers with a lighter gangway band), the pitch and its markings (`paint`, 10 cm above the grass, near only). The dark concourse wall stands under the deck, the deck is triangulated with the plaza ring as a hole, and near adds about 40 pillars under the outer edge (four faces, tops buried in the slab, none placed at the corners of the ramp tail).

Materials: `etfe`, `glow`, `frame`, `deck`, `conc`, `dark`, `seat`, `turf`, `paint` (far: no `paint` and no `conc`, seven draws).

## Approximations and omissions

- Cushion count and size are estimated; the real pattern is irregular near the roof and has radial panels there.
- Night colour is red only (Bayern home colour); no blue or white states, and `etfe` is shaded rather than self-lit.
- The "Allianz Arena" lettering, roof ties/gutters, the interior roof structure and floodlight details are not modelled.
- The esplanade deck is level at 8.5 m round the arena and grades down to the ground over its mapped south wedge (SE tip, 82 m beyond the plaza edge) and its 25 m SW tail; the real ramps rise from the U-Bahn at Fröttmaning beyond the mapped ring and are not modelled. Car parks and the surrounding roads stay provider geometry.
- Bowl tiers are smooth rows, not stepped seating.

## Cost and verification

| Export | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| Near | 22,818 | 9 | 1,791,212 (1749 KB) |
| Far | 5,026 | 7 | 399,288 (390 KB) |

Both are inside the building budgets (near 60 k / 14 / 2.5 MB, far 12 k / 8 / 500 KB); far is the tighter one on bytes (a first far build at 460 KB was thinned to 390 KB). The first near build used shrunk cushions with a partition frame (36.7 k triangles, 2.8 MB, over the cap); cushions that share base edges plus one strip per lattice edge looks the same and costs 22.8 k.

Looked at in `shot.mjs` contact sheets of the procedural source (near, light and dark: overview, facade, back, roof, detail, top) and of the exported GLBs (near light facade/detail, far light overview/facade/roof/back, near dark overview/facade/top), against the six reference photographs. Changes made because of what I saw: diamonds were too tall (4.3 m rows to 3.3 m) and the lower belly flared like a saucer (knots pulled in to a straighter drum); the first glow-stripe pattern read as a spiral and was dropped for uniformly lit cushions; the far LOD had lost the lattice, so far ribs were added; two pillar placements fell outside the deck at the ramp tail and are now rejected; a ring of black teeth around the roof opening turned out to be mis-wound half-cushions at the rim (a pyramid face is now oriented by its cell's outward normal, not a global direction) and the test now fires 2,000 vertical rays at the roof to prove no face leaks. `allianz-arena.test.js` pins height, shell size and orientation, the closed outward-facing skin all round at three heights, the open roof over pitch and bowl, pitch size and marking height, deck level, pillar footings (with a deliberately short pillar rejected), containment in the mapped outlines and far/near envelopes. Depth layers regenerated: 0 material cycles.

Cityscape and Full 3D world: not tested yet, integration is checked separately.

## Review fixes (g1a, 2026-10-14)

1. **Shell profile.** The review read a low domed doughnut rather than the tall, nearly upright rounded flanks of the photographs. `SKIN_KNOTS` now keeps the widest outline from the plinth to 34 m, turns the shoulder between 34 and 44 m (f 0.035 at 39.5 m, 0.1 at 43.5 m), then a gently domed roof (f 0.38 at 48.2 m, 0.58 / 0.78 at 49.2 / 49.3 m) falls to the opening rim at 46.8 m; the crown is still 50 m with the cushion relief and the footprint and opening are unchanged in both LODs. The test now raycasts a level ray at 30 m (the cushions are within 2.5 m of the mapped outline at twelve bearings) and checks the roof stays above 46 m between shoulder and opening.
2. **Esplanade tail.** The deck was a flat 8.5 m sheet that ended abruptly. The slab's top is now a height field on the mapped ring's vertices (the ring is resampled every 9 m near / 18 m far; earcut interpolates): level at 8.5 m within 30 m of the plaza edge, easing to the ground over the next 54 m (SE tip, 82 m out, lands at 6 cm) and the 25 m SW tail tapers to grade at its tip. Walls follow the slab's boundary edges, the underside is dropped where the slab is thinner than a metre, pillars stand only where the slab is above 2 m and run to its actual height. Everything stays inside the owned DECK ring. A new test checks both tips land (< 0.6 m), the slab never falls toward the arena by more than 0.4 m, no step steeper than 65 %, and a level 8.5 m deck at the plaza edge (a ramp that stopped short fails it).
3. Cost: near 24,278 triangles / 9 draws / 1,860 KB (was 22,818 / 9 / 1,749); far 5,400 / 7 / 418 KB (was 5,026 / 7 / 390). Depth layers: 0 cycle edges dropped. App shots recaptured (`tmp/next-200/fix/g1a/allianz-arena/{city,world}`). An exterior street-level approach view of the grade is left to the lead's close captures: the app's street shot sits inside the skin.
