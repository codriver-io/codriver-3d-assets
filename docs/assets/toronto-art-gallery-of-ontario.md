# Art Gallery of Ontario

Stable asset ID: `art-gallery-of-ontario`. Original procedural visual model of the **Art Gallery of Ontario, 317 Dundas Street West**, as Frank Gehry's Transformation AGO (opened November 2008) left it, plus The Grange (1817) that it wraps. Part of the [Toronto landmarks](3d-toronto-landmarks.md). Source: `src/peregrine/landmarks/toronto/art-gallery-of-ontario/`. Build: `pnpm build:toronto-landmarks art-gallery-of-ontario`.

## What a driver recognises, and what is modelled

| Feature | Modelled as |
| --- | --- |
| **Galleria Italia**, the long glass-and-Douglas-fir ribbon along Dundas | 130.5 m convex glass hull (10 m at the street edge rising to a 20 m ridge), 47 glulam arches, a secondary grid of timber purlins, a lit glass belt (4 to 10 m) that overhangs a recessed ground floor on 21 stone piers, glazed ends (ribbed glass over the lit belt, framed by end arches and timber transoms) |
| **The two "tears"** where the ribbon peels away at each end | Framed glass sails (25 m west, 26 m east) with X-braced timber lattice, on a tilted glass skirt; they follow the mapped ribbon paths (13 m and 34 m long) |
| **Blue titanium box** over The Grange | 61.6 x 26 m plan, 12 to 38 m, patchwork of two titanium tones, the recessed 27.8 x 20 m window, stepped as in the photographs (full width 21.4 to 35 m, narrower step down to 15 m; glass, mullion grid) between a sill and an eyebrow, the spiral stair as one connected two-turn helical flight (steel skin, glass ribbon, roof lip, underside) breaking out of the glass, three white roof-plant boxes on the roof |
| **The Grange**, brick, 1817 | 2-storey brick house with hipped roof, chimneys, four-column pedimented portico on the Grange Park front, west wing |
| Walker Court | Glass gabled roof (14 to 18 m) with steel trusses; walls at 14.4 m |
| Wings | Beige precast west (5 levels), central (6), east (4) masses, brick south-west wings (3), storey reveals; roof plant boxes |

Not modelled: interiors (Walker Court, Baillie Court, the Baroque stair inside), signage and the red AGO letters, the Henry Moore sculpture, the OCAD Sharp Centre next door (its own landmark), and the AGO expansion that Commons photographs show under construction on the McCaul Street side in 2026.

## Sources

| Source | Evidence used |
| --- | --- |
| [OSM way 141693334](https://www.openstreetmap.org/way/141693334) and its `building:part` ways 959819118-147 (wings, hull bands, tears), 959903553-558 (box, window, Grange), 960781588-591 (stair) | Plan, heights, `min_height`, glass bands, window and blue-metal strips. Queried once through the shared Overpass helper (`local-scratch/art-gallery-of-ontario/osm-around.json`). © OpenStreetMap contributors, ODbL 1.0 |
| [OSM way 242550201](https://www.openstreetmap.org/way/242550201), parts 959903545-554 | The Grange outline, 7 m walls, 10 m hipped roof, six 3.5 m portico columns |
| [Wikipedia](https://en.wikipedia.org/wiki/Art_Gallery_of_Ontario) | 47 radial arches, glulam mullion grid, two end tears, "protruding spiral staircase", glass and titanium south block, 2008 opening |
| [Entuitive](https://www.entuitive.com/projects/transformation-ago), [Equilibrium](https://equilibrium-eq.com/projects/art-gallery-of-ontario-galleria-italia-facade/) | Glulam arches and mullions, sloped glulam backup framing |
| Press / AGO material | "70 feet above Dundas" (the 20 m ridge); "tinted titanium-and-glass four-storey south wing"; the length is quoted three ways (137 m, 600 ft, 200 m), see below |
| Wikimedia Commons photographs (licences in the catalog record), kept in ignored `local-scratch/art-gallery-of-ontario/refs/` | Proportions, colours, sail and hull shape, window and stair pod arrangement, Grange portico |

## Frame and dimensions

Metres, +X east, +Y up, +Z south, `y = 0` local flat-map grade (the Dundas sidewalk; the real block falls gently south toward Grange Park). Origin `[-79.392525, 43.653638]`, the mean of the mapped outline's vertices. The model is authored on the street grid the outline itself fits: `u` runs along Dundas at **16.2 degrees north of east** (least-squares fit of the outline's long edges; the contract's ~17 degrees is the whole-city figure), `v` runs away from Dundas. `pt(u, y, v)` in `art-gallery-of-ontario-site.js` rotates into east/up/south once.

| Quantity | Model | Basis |
| --- | --- | --- |
| Overall height (roof plant on the box) | 41.5 m | box roof 38 m (OSM `height`) + 3.5 m plant (estimate) |
| Blue box | 12 to 38 m, 61.6 x 26 m | **OSM** (`min_height 12`, `height 38`, outline) |
| Window | 27.8 x 20 m, 15 to 35 m, recessed ~1 m | **OSM** parts 959903555/557/558; recess from the outline |
| Hull length / width | 130.5 m / 8.5 m plan | **OSM** hull parts |
| Hull profile | 10 m eave, 15 m at 23%, 18 m at 49%, 20 m ridge | **OSM** band heights (10/15/18/20); smooth curve `10 + 10 (1 - (1-t)^2.6)` is an estimate through them |
| Belt and podium | belt 4 to 10 m, ground floor 0 to 4 m recessed 2.4 m | belt **OSM** (`min_height 4`, `height 10`); recess and piers estimated from photos |
| Arches | 47 | Wikipedia / Entuitive |
| Tears | 13 m and 34 m long, sails 25/26 m | paths **OSM**; OSM caps the ribbon at 20 m, the sail heights are photo estimates |
| Galleria length | 130.5 m hull, 175 m with the tears | sources say 137 m, 600 ft (183 m) or 200 m; the mapped hull plus tears sits between |
| Wings | 18 / 21.6 / 14.4 / 10.8 m | **OSM** `building:levels` (5/6/4/3) x 3.6 m, estimate |
| The Grange | 7 m walls, 10 m ridge, 20 x 14 m | **OSM** |

## Materials (same keys in both palettes)

`timber` (glulam, Douglas fir; pale honey `#b59a72` by day, `#6d5c49` at night, retuned from a saturated orange), `glow` (Galleria ribbed glazing and sails, unshaded: pale reflective blue by day, amber at night as the real hull is lit from inside), `light` (the glass belt, unshaded: dark teal by day, warm lit at night), `glass` (podium, court roof, box window, stair-pod ribbon), `titanium`/`titaniumDeep` (two tones of the blue cladding), `stone` (piers, portico), `precast` (beige wings), `brick`, `metal` (mullions, lattice, pod skins), `roof`, `paint` (white roof plant).

## Modelling decisions

- The wings and central mass are extrusions of the mapped building parts, on purpose: they are the plain precast blocks the real building has. The identity is in the hull, the tears, the box and The Grange, and the mass polygons tile the OSM outline exactly (checked by rasterising parts against the outline).
- The hull is one lofted surface with vertex normals, the ribs and purlins are swept rectangular tubes following the surface, all merged by material. A hard "outward hint" orients every face, so no face can be inside-out.
- Everything sits inside the mapped rings except the glass skirts (project 2.2 m at the sails) and the stair pods, which are over The Grange's ring; the test allows 3.4 m and says why.
- Far LOD: same silhouette and negative space (sails, ridge, window recess, portico) with 16 thicker arches, no purlins or mullions, one titanium tone, single sail diagonals.

## Approximations

Ribs are drawn in vertical section planes (the real arches are raked); the spiral stair is a smooth helix (radius 3.8 m, two turns, 10.6 m rise) rather than the real steel-and-glass pods; the window step (3.3 m each side, at 21.4 m) is read from one photograph; hull panels are one opaque pale plane (the real glass is transparent); the sail height, skirt, pier spacing (6.5 m), belt lean (none), roof plant and panel pattern are estimates; the wings have storey reveals but no windows.

## Export and cost

| Export | Bytes | Triangles | Draw calls |
| --- | ---: | ---: | ---: |
| `art-gallery-of-ontario-near.glb` | 856 884 | 18 108 | 12 |
| `art-gallery-of-ontario-far.glb` | 250 608 | 5 144 | 7 |

Texture-free, self-contained GLB 2.0. Budgets: building near 60 000 / 14 / 2.5 MB, far 12 000 / 8 / 500 KB.

**Draw budget.** Near keeps all twelve materials. Far folds look-alikes through `FOLD` in `config.js`: `titaniumDeep` into `titanium` (far uses one tone anyway), the grey `roof` into the grey `metal`, the off-white `stone` and `paint` into the off-white `precast`, and the belt glazing `light` into the ribbed glazing `glow` (both unshaded, both amber after dark). That is seven draws. The storey reveal bands now stand 6 cm off the walls, which took the near coplanar overlap from 79 m2 to 2 m2. Costs are scene metrics, not Tesla hardware measurements.

## Verification evidence

Looked at (procedural and exported GLB, `local-scratch/shots/art-gallery-of-ontario/` and `local-scratch/art-gallery-of-ontario/rt/`; the second set uses the runtime layer's shading and the dark palette): overview from the north-west (near and far, light and dark), Dundas street level at 100 m, from the west end at dusk (compared with the dusk photograph), from the east end, the east sail close-up, under the overhang, the hull's back, the south side from Grange Park at 500 m and 110 m, window/pod close-up, the Grange portico, a plan view with the red OSM outline, exported GLB near and far.

Review pass 2 (independent reviewer): the solid timber-brown end wall was replaced by glazed ends with the ribs continuing through; the three stacked drums and floating wedge became one connected helical stair; the plain window became the stepped one seen in `Art_Gallery_of_Ontario_overlooking_Grange.jpg`; the timber was retuned. Earlier changes, because of what the images showed: the first blue box was a camouflage of two strong tones (now 30% of panels, tones close); the ground floor read as tombstones (piers widened and attached to a recessed wall); the sails looked like flat billboards without a foot (tilted skirt added, X-braced lattice, taller); the belt was daytime-dark and night-dead (now the self-lit `light` material); the hull glass was too pale; skirts left wedge gaps at bends (vertex normals averaged); roofs read as blank slabs (plant boxes and storey reveals). No z-fighting, holes or inside-out faces were visible from the angles above.

Tests: `node --test src/peregrine/landmarks/toronto/toronto.test.js src/peregrine/landmarks/toronto/art-gallery-of-ontario/`.

| Environment | Status |
| --- | --- |
| Inspector renders, near/far, light/dark, source and GLB | verified |
| Cityscape, flat ground | not tested yet, integration is checked separately |
| Full 3D world, topography | not tested yet, integration is checked separately |
