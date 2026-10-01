# Sutro Tower

Asset `sutro-tower`, 1 La Avanzada Street, Mount Sutro, San Francisco. Original procedural model of the 1973 broadcast
tower as it stands today: three triangular legs in orange and white bands that lean in to a waist at Level 4 and flare
out above it, solid triangular decks at Levels 2 to 4, the white lattice triangle at Level 5, the three 60 m crossarms
at Level 6 and the three top masts with their stays and aviation lights. Contract:
[3d-san-francisco-landmarks.md](../san-francisco-landmarks.md). Source:
`src/peregrine/landmarks/san-francisco/sutro-tower/`.

## Sources

| Fact | Value | Basis |
| --- | --- | --- |
| Height to the top of the antennas | 297.8 m (977 ft, 297.79 m) | published ([Wikipedia](https://en.wikipedia.org/wiki/Sutro_Tower), [sutrotower.org](https://sutrotower.org/)) |
| Levels | 2: 56.7 m, 3: 116.4 m, 4: 169.8 m, 5: 200.3 m, 6: 241.4 m | published (sutrotower.org); OSM maps the first four to within 0.2 m |
| Paint | alternating Aviation Orange (FS 12197) and Aviation White (FS 17875) bands | published (sutrotower.org) |
| Lights | steady-burning red obstruction lights, red and white beacons at the tops | published (sutrotower.org: 18 steady red, 9 red flashing, 12 white flashing, 3 antenna beacons) |
| Axis | `[-122.4528526, 37.7552413]` | mapped: mean of the 27 mapped leg sections (spread 1 cm); also the centre of the mapped platforms |
| Legs | bearings 270 (west, the lift leg) / 30 / 150, equilateral triangle, centre 26.3 m from the axis at 13 m, 10.5 m at 169 m, 17.5 m at 220 m | mapped: OSM building:part ways `leg_1..3` (nine 26 m parts each) of relation 18290620 |
| Leg section | triangle, flat face toward the axis, apex outward, about 3.3 m side (mapped hexagon 3.35 x 2.9 m) | mapped |
| Paint bands | white 0-52, orange 52-78, white 78-104, orange 104-130, white 130-156, orange 156-182, white 182-208, orange 208-232 m | mapped (part colours `#e9e9df` / `#bf4e3b`) |
| Platforms | 4 m slabs: Level 2 53-57, Level 3 112.5-116.5, Level 4 165.75-169.75, Level 5 196.25-200.25, Level 6 228.25-232.25; triangular plans | mapped (relations 18290615-619) |
| Crossarms (Level 6) | three straight bars 59.5 m long, 1.9 m wide, each through two leg tops and 14.3 m past each | mapped plan (relation 18290619) |
| Top masts | three, on the leg tops, to 298 m | mapped (poles 0.9 m across, `top_mast_1..3`) |
| Foot | about 254 m above sea level | published; not modelled (local y = 0) |

## Dimension table (model vs source)

| Element | Model | Status |
| --- | --- | --- |
| Tip | 297.8 m (a red beacon on each mast) | sourced |
| Leg centre radius | 27.6 m at grade, 10.4 m at 169.75 m, 17.85 m at 222 m and vertical to the crossarms | mapped runs reproduced to within 0.3 m; the vertical tail under the crossarms follows the bars and the photographs |
| Leg outer apex radius | 29.8 m at grade, 12.3 m at the waist, 19.3 m at 220 m | mapped within 0.3 m (tested within 0.7 m) |
| Leg section side | 3.8 m at grade tapering to 2.9 m at 233 m | estimated from photographs (mapped parts are a constant 3.35 m) |
| Level 2 / 3 / 4 decks | solid triangular plates 4 m deep, corner circumradius 23.5 / 17.3 / 11.8 m, tops at 57 / 116.5 / 169.75 m | heights and plans mapped (plate corners are 0.3-0.6 m inside the leg apexes to avoid coplanar faces); **solid** from photographs (OSM maps 2 m rings) |
| Level 5 | white lattice triangle, 1.95 m x 4 m beams through the leg axes, 196.25-200.25 m | mapped plan; lattice estimated |
| Level 6 crossarms | three orange lattice beams 59.5 m long, 1.9 m x 4 m, at 236.5-240.5 m (top chords up to 241.5 m), staggered by 0.5 m; plan within 0.5 m of the mapped ring | plan mapped; height raised in the fix round to the published Level 6 deck (241.4 m) and the photographs (about 233-240 m); OSM maps 228-232 m. Raising it does not touch the mapped plan |
| Masts | square lattice 2.4 m tapering to 1.8 m from the leg tops (239 m) up to 284.4 m (266 m on the south-east one), then a 1.6 m orange radome (west, north-east) or a white pole with an orange band (south-east). Far: a solid column 2.8 m tapering to 2.4 m with a 2 m radome (deliberately fatter, the lattice is sub-pixel beyond 500 m) | estimated from photographs |
| Stays | near only: 18 cables from the lattice tops and 18 from the radome tips to the crossarm tips; far has none (sub-pixel) | estimated |
| X bracing | six cables per panel in four panels between the legs | estimated from photographs |
| Pods, dishes, whips | five white pods on the north-east leg at 188-199 m, six dishes on the Level 2 and 3 decks, a red whip on Level 2 | estimated from photographs |

## Materials

Five merged materials: `orange` (legs bands, decks, Level 6 crossarms, radomes, bands; `#bd4e38`, the faded Aviation
Orange of the photographs and the OSM colour `#bf4e3b`), `white` (leg bands, Level 5, pods, pole; `#e8e7df`), `steel`
(mast lattice, cables, the far-LOD mast columns; grey), `soffit` (the underside of the Levels 2 to 4 decks, pale brown as in the photographs; lifted in the palette because down-facing faces render dark) and `lamp` (the red aviation lights; unshaded, a dull red by day and bright
red in the dark palette). Light and dark palettes share keys.

## Modelling decisions

- The silhouette is the tower: the hourglass of three legs, the horizontal crossarm with its X, and the trident of masts.
  The legs are plain triangular prisms (the real legs are clad), one prism per paint band, split where the leg changes
  direction (the Level 4 waist, 169.75 m, and the start of the vertical tail, 222 m). They are identical in near and far.
- The decks at Levels 2 to 4 are solid because every photograph shows a filled soffit (a "dish" under each deck with the
  west leg at its apex); a 2 m ring (as mapped) would show the sky.
- Lattice (Level 5 and 6 beams, masts) is merged round and square bars: chords, a Warren zig-zag and, in near, vertical posts.
  Far keeps chords and a sparse zig-zag, so the open space between the legs and under the crossarms remains.
- Three crossarms form a triangle through the leg tops, each 14.3 m longer on both sides, so seen from the east they read
  as one 60 m bar and an X (the other two bars crossing over the west leg), as in the photographs. They are staggered by
  0.5 m so that where two cross over a leg no two faces are coplanar.
- Deck corners sit 0.6 m inside the leg apexes (0.3 m perpendicular) because the deck edges are parallel to the legs' outer faces.
- All three masts reach 297.8 m (OSM maps them equal). In photographs from the east the middle mast looks 7-14 m lower:
  the west leg is the far one and the camera looks up, so this is perspective.
- Aviation lights are steady red lamps on every deck corner, crossarm tip and mast top (self-lit `lamp` material); the flashing
  white strobes are not modelled.
- The transmission building (OSM relation 18555914) stays with the provider; the south-east leg foot touches its west wall.
- Far LOD: same legs and decks; the Level 5 and 6 beams are I-sections (0.8 m flanges 1.9 m wide and a 0.5 m solid web) so each crossarm and the X read as bold bars at 1-3 km (four-chord lattice rendered as hairlines); masts are solid columns; no stays, pods, dishes, posts or bracing cables.
- Runtime zone: drawn within 9 km from zoom 12.5 (the tower is seen from the whole city), near LOD within 700 m.

## Approximations, honestly

- The Level 6 height (236.5-240.5 m, between the mapped 228-232 m and the published 241.4 m) is a compromise; the lattice, masts, stays, pods, dishes and whips are estimated, not surveyed.
- The leg section taper is estimated; the legs are untextured prisms, without cladding ribs, ladders or the lift enclosure.
- Far masts and radomes are about 1.5 times thicker than the real ones and solid, on purpose; far beams are solid webs.
- Decks have no handrails or equipment; the real decks carry many dishes and antennas.
- The mast tops follow a 2010s configuration (two radomes, one slender pole); the 2019-20 repack changed some antennas.
- Footprints: each mapped leg part is the leg's section at the middle of its 26 m run, so the model's sloped legs leave the part
  rings by up to 1.6 m at the ends of a run (the legs' outer apex at grade reaches 29.8 m from the axis, the mapped ring 28.2 m).
  The three mast rings are widened from the mapped 0.9 m poles to 2.4 m squares so the ownership test reaches the poles.
- Cityscape: uses the normal flat map, `y = 0` at the tower foot. Full 3D world: **not tested yet, integration is checked separately**; the
  tower is a rigid structure, the terrain pad radius is 34 m (the legs' outer corners reach 29.8 m from the axis).

## Costs

Measured by `pnpm build:san-francisco-landmarks sutro-tower`: near 7 297 triangles / 5 draws / 276 KB; far 863 triangles / 5 draws / 49 KB
(budget 60 000 / 14 / 2.5 MB and 12 000 / 8 / 500 KB).

## Verification evidence

Rendered with `tmp/san-francisco/shot.mjs` (1280x800) and compared with the Commons photographs listed in the catalog record:

- Whole tower from the east (the HiRes photograph and the closeup): proportions of the hourglass, band order (white at the foot, orange
  just under each deck and under the crossarms), the horizontal crossarm with the X, the white Level 5 triangle, the pods on the right
  leg, the white pole on the left mast. First pass: legs ran straight to the crossarms (photographs show a vertical tail), the crossarms
  were 1 m short of the mapped plan and 2 m low; fixed by adding the 222 m kink, extending the bars to 14.3 m and moving Level 6 to 230-234 m. Review fix round: far crossarms and masts thickened (rendered the exported far GLB at 1.5 km east and 3 km south-east, light and dark: the crossarm bar and its X read as solid, the three masts as columns), deck soffits lightened (they rendered near-black), Level 6 raised to 236.5-240.5 m.
- From above (roof, crossarm, top view with the red mapped rings): the three bars match the mapped Level 6 ring (all ring vertices within
  1 m of a bar centreline, extents within 0.5 m).
- Close-ups of a Level 4 corner and of the Level 6 crossing: no coplanar faces; decks are closed top and bottom.
- Looking up from the foot and from the west (back): decks closed, legs and bracing as expected.
- Near and far, light and dark, procedural source and exported GLB (`--source glb`): identical geometry, lamps readable in the dark palette, far keeps the legs, decks, crossarms and three masts.
- Numeric checks (`tmp/san-francisco/sutro-tower/check-*.mjs`, ignored): leg section centres within 0.6 m of the mapped part centroids, outer apex within
  0.3 m of mapped.

Tests: `sutro-tower.test.js` (tip height, leg bearings and mapped radii, waist, band sequence, solid decks with pale soffits and their heights, open Level 5, crossarm plan, height and
ownership, bold far beams and masts, masts and beacons, far budget, GLB round trip) plus `san-francisco.test.js`.

OpenStreetMap geometry © OpenStreetMap contributors, ODbL 1.0.
