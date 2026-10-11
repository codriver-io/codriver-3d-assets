# Centre Bell (Montréal)

Landmark id `centre-bell`. Original procedural model of the Centre Bell (Bell Centre, formerly the Molson Centre), 1909 avenue des Canadiens-de-Montréal, Montréal: home of the Canadiens de Montréal (NHL), opened 16 March 1996, about 21,000 seats, the largest indoor arena in Canada. It follows the [Québec landmark contract](../quebec-landmarks.md) and the asset catalog.

## What is modelled, and which version

The arena as it stands (2026): the building drawn on OpenStreetMap as way 19911284. The Tour des Canadiens condominium towers, L'Avenue, Gare Lucien-L'Allier and the office towers around are separate buildings outside the footprint and are not modelled; the provider keeps drawing them.

A driver sees, and the model has:

- a **146 m x 107 m box turned 41 degrees from true north** (the downtown grid), on a flat site, with a 6 m set-back on its south-west end;
- a **28 m lower volume**: orange **brick** on the south-west face (Rue de la Montagne) with seven rows of window pairs between blank brick bays and two louvre grids high up; **brick under a tan band** on the north-west end (Avenue des Canadiens-de-Montréal) with tall narrow slits; **silver panels** with tall glazed strips on the south-east end (Rue Saint-Antoine Ouest); tan cladding round the north corner;
- a **band of dark glass** 10 m high above it, in a grid of mullions, set 1 m behind the brick and capped by a tan coping, carrying the flat **roof** with its plant boxes and stacks;
- the **glazed entrance front** on the north-east side (Place des Canadiens): a curtain wall 3.4 m proud of the brick face over a solid grey base with four dark doors, divided by tan piers, a mullion and transom grid and **two LED screens** (`lamp`, dark by day and lit at night), with the glazing running on to a pale glazed bay on the other side of the sign tower;
- a **glazed arcade** under the brick on the south-west face (recessed 2.4 m, dark storefront, columns every 12.7 m), so the brick appears to stand on a glass base;
- the **sign tower** 20 m in from the north corner, standing proud of the glazing (pale glazed bay on its north-west side, the entrance front on its south-east side, its tan foot filling the front's first bay): a tan block rising from the street to 47 m, 8.6 m above the dark band, with **"Centre" over "Bell" in blue block letters** (`sign`, self-lit) on its two street faces.

## Sources

| Fact | Value | Source |
| --- | --- | --- |
| Plan | 37 vertices, 146 m x 107 m, 15 046 m2 | OSM way 19911284 (building=stadium, retrieved 2026-10-03, ODbL 1.0); [Wikipédia](https://fr.wikipedia.org/wiki/Centre_Bell): "107 m sur 146 m", 15 622 m2 |
| Orientation | long edges at bearings 40.9 and 131.8 degrees; the model uses 41.3 / 131.3 | the mapped outline (length-weighted mean of its long edges) |
| Address, opening, capacity, architects | 1909 avenue des Canadiens-de-Montréal; 16 March 1996; 21 105 to 21 302; Lemay & Associés with LeMoyne Lapointe Magne, engineers Dessau | [Wikipedia](https://en.wikipedia.org/wiki/Bell_Centre), Wikipédia |
| Surrounding streets | Rue Saint-Antoine Ouest on the south-east end, Rue de la Montagne on the south-west face, Avenue des Canadiens-de-Montréal on the north-west end, Rue de la Gauchetière / Place des Canadiens on the north-east side | OSM street nodes and ways round the outline |
| Brick lower volume, dark upper band, glazed front, sign tower with blue "Centre Bell" lettering | read from three exterior photographs | Commons: 'Bell Centre August 2005.jpg' (Michael Barera, CC BY-SA 4.0), 'Centre Bell (2009).jpg' (Alexcaban, CC BY-SA 3.0), 'Façade Centre Bell Center Front.JPG' (Fleurdelisé, CC BY-SA 3.0) |

Nothing is published for the building's height; every height below is read from the photographs.

## Dimensions: sourced against estimated

| Dimension | Model | Status |
| --- | --- | --- |
| Plan, length x width | 142.2 m x 100.1 m inside the outline, plus the 3.4 m glazed front | sourced (OSM), inset 0.3 to 1.8 m so every vertex stays inside the mapped ring |
| Bearing of the long axis | 41.3 degrees (v axis), 131.3 degrees (u axis) | sourced (mapped edges) |
| South-west set-back | 6.2 m, over 27.6 m | sourced (OSM) |
| Glazed front | 86 m long, 3.4 m proud, on the north-east face | sourced (OSM step), glass and piers estimated |
| Height to the top of the sign tower | 47 m (8.6 m above the dark band, 9.4 m above the 38.4 m roof) | estimated (photographs; `SPEC.height`); the first version stood 45 m, only 6.6 m above the roof |
| Roof / dark band top | 38.4 m | estimated |
| Brick / tan volume | 28 m (base 5.5 m, brick to 21 m, tan band or brick to 28 m) | estimated |
| Dark band | 28 m to 37.6 m, coping to 38.4 m | estimated |
| Window rhythm | 2.9 m pitch, 7 rows on the south-west face | estimated |
| Sign tower | 15 m x 15.7 m in plan, u -52.4 to -37.4 (20 m from the north corner), lettering 3.0 m ("Bell") and 1.8 m ("Centre") high from 40.3 m | position, height and size estimated from the photographs |
| Arcade | recessed 2.4 m, 76 m long, columns every 12.7 m | estimated |

## Materials

Eleven, merged one mesh per material in the near model; the far model folds `metal` into `conc`, `frame` into `dark` and `lamp` into `dark` (eight draws): `brick` (orange brick desaturated about 15 % toward terracotta, `#ab684f`), `clad` (tan cladding, coping, piers), `metal` (silver panels, roof plant), `conc` (grey base, ledge, roof), `dark` (storefront, doors, louvre slots: near-black `#262e2b`), `band` (the upper band's grey-green reflective glass, `#41524c`; it shared `dark`, `#3a4642`, and read near-black), `frame` (mullions and transoms), `glass` (windows, pale), `glow` (the glazed front: pale grey-blue by day, warm at night, unshaded), `sign` (the blue lettering: self-lit), `lamp` (the LED screens: dark by day, lit at night, unshaded). Light and dark palettes name the same eleven keys.

## Modelling decisions

- The arena is authored on its own grid (u along the long edge toward the south-east, v across it toward the north-east) and rotated by 41.3 degrees as each vertex is written: the rotation is baked, no node is rotated.
- Walls, ledges, caps and relief are flat quads and polygons with their outward side given, so winding cannot be wrong; windows, mullions and letters are shallow boxes standing 0.1 to 0.3 m proud of the wall they touch (no floating decals, no coplanar faces).
- The dark band is set back 1 m: a 1 m ledge at 28 m gives the brick/band step the photographs show; the front's flat roof is the same ledge polygon.
- The glazed front's west end stands 0.2 m inside the mapped step (u = -44.4 against the outline's -44.6) so that it, too, stays inside the outline.
- Far keeps the silhouette (identical bounds to near), the arcade recess with its columns, the tower with its two lettering blocks, the front, the window pairs (one box per pair), the louvres and half of the roof plant; it drops mullions, transoms, piers, doors' relief, slits and strips.

## Approximations and weaknesses

- **Every height is an estimate**; nothing is published. The 28 m / 10 m / 6.6 m split is read from two photographs and may be off by a few metres.
- The sign tower's position (20 m in from the north corner, between a glazed bay and the entrance front), its 47 m height and the grouping of the windows are read from the photographs, as are which face is brick, tan or silver, and where the arcade and doors are, are read from three photographs and the street nodes, not surveyed.
- The real dark band probably overhangs the south-west set-back; the model keeps it inside the mapped outline.
- The small rounded bay near the east corner of the mapped outline is not modelled.
- The lettering is rectangular block letters, not the Bell typeface; the Canadiens roundel and banners are not drawn.
- The roof plant (ten boxes, four stacks) is a plausible invention. Interior, seating and the arena's roof structure are not modelled.
- No recessed windows: windows are raised 0.15 m quads-in-boxes, so they read flat.
- At night only the front (`glow`), the lettering (`sign`) and the LED screens (`lamp`) light up; the windows stay dim.

## Costs

| Detail | Triangles | Draw calls | Size |
| --- | --- | --- | --- |
| near | 4,938 | 11 | 387 KB (was 5,910 / 10 / 460 KB) |
| far | 1,330 | 8 | 109 KB (was 1,016 / 7 / 84 KB) |

Budgets for a building: near 60,000 triangles / 14 draws / 2.5 MB, far 12,000 / 8 / 500 KB. The model is far below them: it is a box, and the budget went on the window grid, the mullion grid and the lettering rather than on curves.

## Verification evidence

- `qa-metrics.mjs --ids centre-bell`: no issues; 0 coplanar overlapping pairs; 0 % back-face hits in the outside-in ray sweep (350 rays); nothing below grade; top 47 m.
- `centre-bell.test.js` (13 tests, about 0.3 s): outline area and centroid, grid bearing, 142 x 100 m extent, 47 m top (8 m or more above the dark band) and 38.4 m roof, every vertex inside the mapped ring (both LODs), three tiers on the south-west face by raycast, window pairs (24 to 28 per row, 2.9 m inside a pair, a blank bay between) and row count, the sign tower 20 m in from the corner with glazing on both sides and standing alone above the band, glazed front proud by 3.4 m with doors, piers and LED screens, the glazed arcade and its columns, the 6 m set-back, the south-east and north-west ends, the lettering on two faces, far envelope and cost, rotation baked.
- Screenshots looked at (`tmp/quebec/shots/centre-bell/`, not committed): procedural near light sheet (overview, glazed front, tower, south-west face, south-east end, roof, then street, north-west end), top view over the red outline, procedural far dark sheet, then the exported GLBs: near light (overview, facade, tower, sw, se, street), near dark (overview, facade, tower, nw) and far dark (overview, tower, sw, nw). Changes made because of them: the glazed front got a solid 5 m grey base with four dark doors (the photographs show a solid base under the glass), the LED screens moved down to y 8.5 to 17.5, the glazed front's west end was pulled 0.4 m east, from 0.2 m outside the mapped step to 0.2 m inside it, the far model gained its window groups and lost a window group that overshot the south-east end, the front's day colour was shifted from near-white to a grey-blue.
- Review fix (regions batch): the tower was a corner block barely above the roof and is now inboard, taller, with the glazed front continued round it; the uniform window lattice became pairs of windows between blank bays (also fewer quads); the dark band got its own grey-green material; the brick was desaturated. Checked on the `qa-sheet.mjs` contact sheet (the reference photograph beside near and far): the photograph shows the tower standing out of the glazed front with window grids on both sides and a tan and brick wall beyond, which the model approximates.
- Cityscape and Full 3D world: not tested yet, integration is checked separately. The site is flat downtown: `padM` 95 m just covers the outline (corners lie 87 m from the origin), so no `terrainPad` is declared; the Full 3D world should sit the base on the DEM without a visible pad, but this is expected, not measured.
