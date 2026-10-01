# Coit Tower

Asset `coit-tower`, 1 Telegraph Hill Boulevard, San Francisco. Original procedural model of Coit Memorial Tower as it
stands today (Arthur Brown Jr. and Henry Howard, 1933; the Columbus statue was removed in June 2020 and is not
modelled): the 64 m unpainted-concrete column with 24 shallow flutes, the three-tier arched
observation crown, and the stepped Art Deco base of glazed rotunda, entrance terrace, step, porch and block.
Contract: [3d-san-francisco-landmarks.md](../san-francisco-landmarks.md). Source:
`src/peregrine/landmarks/san-francisco/coit-tower/`.

## Sources

| Fact | Value | Basis |
| --- | --- | --- |
| Height | 210 ft / 64 m | published ([Wikipedia](https://en.wikipedia.org/wiki/Coit_Tower), OSM `height=64`) |
| Outer shaft | tapering fluted shaft, 180 ft (55 m), supporting the viewing platform; observation deck 32 ft (9.8 m) below the top, arcade and skylights above it; three nested cylinders | published (Wikipedia, Architecture) |
| Flutes and taper | 24 grooves, centres 15 degrees apart; top diameter 18 in smaller than the base; poured in 4 ft lifts | secondary: architecture description found by web search (it repeats the Young and Horstmeyer construction account); not re-fetched from a primary page; checked against photographs (about 4 % narrower at the top, 24 panels read around) |
| Axis | `[-122.4058354, 37.8023738]` | mapped: centre of the shaft circle, OSM part 451331530 (least-squares fit, r = 5.511 m, residual 5 mm) |
| Block | 11.4 m square carrying the shaft, 12 m high, rotated so its front faces 345.6 deg | mapped: OSM part 451331534 |
| Porch, front step | 4.3 x 4.9 m, 10 m; 6.1 x 2.6 m, 8 m | mapped: OSM parts 451331533, 451331535 |
| Base outline | circle R 11.2 m on three sides, four 3 x 2.7 m corner piers, front terrace to 11.0 m ahead of the axis | mapped: OSM part 451331532 (its 5 m height is not followed, see below) |
| Front | 345.6 deg (14.4 deg west of north) | mapped: the block's north edge, and the bearing to the old Columbus statue pedestal (OSM way 1076158345) |

## Dimension table (model vs source)

| Element | Model | Status |
| --- | --- | --- |
| Top | 64.0 m | sourced |
| Shaft | ridge radius 5.74 m at 12.9 m, 5.51 m at 52.9 m (diameter 11.48 to 11.02 m, taper 0.46 m = 18 in); 24 flutes as V grooves 0.15 m deep, grooves on the front axis, one smooth lift (no pour joints) | radius at the top mapped, base from the published taper; flute depth and groove phase estimated; no pour joints |
| Ledge and observation level | corbelled ledge to r 5.62 m, floor at 53.9 m, balustrade top 54.9 m (= 180 ft), crown top 64.0 m (9.8 m above the deck, matches the published 32 ft) | sourced levels |
| Crown wall | r 5.05 m, 0.46 m inside the shaft top; eight bays at 45 deg, bay 0 on the front axis | estimated: an aerial telephoto shows the crown about 9 % narrower than the shaft just below |
| Lower alcoves | eight round-headed alcoves 2.3 m wide, floor 53.9, head 58.9 m, 1.25 m deep, stone balustrade 1.0 m high, round window in the front alcove | estimated from photographs (head 5.1 m below the top, 66 px of 305 px crown width) |
| Small windows | three per bay, 0.4 x 0.8 m, 60.3-61.1 m | estimated |
| Upper arcade | eight 2 m wide arches, 61.5-62.9 m, through a 1 m ring wall into a hollow cavity (r 4.1 m) so a level ray crosses the crown | estimated; the through-view follows the photographs (sky or lit interior seen in the arches) |
| Cap | wall to 63.75 m, rounded to r 4.75 m at 64.0 m | estimated |
| Block and plinth | 11.7 m square (mapped 11.4 m, widened so the shaft does not overhang it), 8.5 to 12.0 m, rounded plinth to 12.9 m | mapped, widened 0.15 m per side |
| Rotunda | R 11.2 m arcs, 8.5 m tall with a 2.7 m cornice (11.5 m); rear arc: six pilasters and five glazed bays 1.3-5.4 m; four corner piers | height calibrated from a pinhole fit to one photograph (8.7 m); OSM says 5 m; arcs mapped |
| Terrace, step, porch | terrace 6.5 m with a recessed 2.2 x 3.0 m entrance, step 8 m, porch 10 m, phoenix roundel and two fasces on the porch front | terrace height estimated; step and porch mapped; relief simplified |

## Materials

Five merged materials, one draw each: `concrete` (shaft, crown, rotunda, terrace), `concrete_warm` (block, porch,
step: the lighter upper volumes), `recess` (alcove reveals, door reveal, relief, the six stair slits as a soft mid-tone), `glass` (rotunda glazing, doors, small
windows, balustrade slots, oculus), `glow` (alcove back walls and the arcade interior; unshaded, a
shaded-stone tone by day and a warm floodlit tone in the dark palette, as the tower is floodlit at night). Light and
dark palettes share keys.

## Modelling decisions

- Silhouette first: the long fluted column and the open, arched crown are the tower; the base is secondary but its
  stepped massing and the glazed curved rear are what a visitor sees from the car loop.
- The shaft is one lift of 48-vertex rings (24 ridges, 24 grooves). A first version modelled the 4 ft pour joints as 2 cm
  shoulders (26 courses, about 5 k triangles); they rendered as dotted grey dashes that would shimmer at driving range, so
  they were dropped. The six stair slits are quads 6 cm proud of their facet in the `recess` tone; far drops them.
- The crown wall is a polygon of columns whose breaks follow the arches' own samples (`coit-tower-mesh.js`): every arch
  edge is exact, nothing is a boolean, and the reveals (jambs, sill, head) are generated from the same rim. Far uses 4
  samples per arch instead of 8/6 and drops the small windows, balustrade slots and oculus; every alcove and the open
  arcade stay.
- The ground floor is rebuilt from the OSM outline as arcs plus rectangles, extruded at two heights (rotunda 8.5 m,
  terrace 6.5 m); upper volumes start on the roof below them and omit bottom and hidden faces, so no two faces coincide.
- Everything is on local y = 0 at the entrance forecourt; the hill is not modelled (`padM` 18 covers the rotunda, piers and
  terrace, which reach 12.4 m from the axis).

## Approximations, honestly

- The 24-flute count, the 18 in taper and the 4 ft pours come from a secondary description; flutes read as V grooves
  whereas the real flutes are shallow panels; the faint pour seams are not modelled.
- The crown's three tiers are measured from a few perspective photographs: arch widths and heights are within about
  0.3 m; the real alcoves also have a double reveal and the arcade has skylights, which are not modelled.
- The rotunda height (8.5 m) conflicts with OSM's 5 m; it follows a calibrated photograph and the fit is rough (one image).
  The north-side stepped wings are simplified into corner piers and a terrace; their heights are guesses.
- Not modelled: Columbus statue (removed 2020; its pedestal stays provider-owned), flagpole, entrance steps, handrails,
  murals and interior, trees, the Telegraph Hill Boulevard loop, the hill itself.
- The shared Overpass queue did not answer for about 20 minutes, so the footprint came from two small OSM API calls
  (`way/28824850/full`, one 200 x 180 m map bbox) and was re-confirmed through the helper once it was fixed.

## Costs

Near 3 186 triangles / 5 draws / 177 KB; far 1 392 triangles / 5 draws / 80 KB (budget 60 000 / 14 / 2.5 MB and 12 000 / 8 /
0.5 MB). Far is 44 % of near triangles with the same height and a bounding box within 0.3 m (11.2 m footprint radius against 11.5 m
at the rotunda cornice, the only difference); it keeps every alcove, the open arcade and the stepped base.

## Verification

- Compared with Commons photographs in `tmp/san-francisco/coit-tower/refs/` (not committed; licences in the catalog
  record): the crown from the front and below (Almonroth 01/05/07, 'Columbus statue' and 'with statue' views), the shaft
  (02, 03, 'from the ground'), the south rotunda (Wgreaves) and the aerial telephoto. A calibrated render at the
  south photograph's viewpoint (`tmp/san-francisco/shots/coit-tower/*-south-match.png`) lined up the drum, block,
  plinth and shaft; this exposed three changes: the first model had a missing front facet (a flipped quad, fixed and now pinned
  by a ray test), ledge and balustrade 1.1 m too high (lowered to 53.9 / 54.9 m), the drum 2 m too low (6.5 to 8.5 m), and
  the crown as wide as the shaft (stepped in to 5.05 m).
- Rendered the procedural source and the exported GLBs near and far, light and dark, from the front, rear, above, street level
  and close up (`shots/coit-tower/`: overview, facade, crown, roof, rotunda, shaft, entrance, look-up, base-aerial, plan,
  south-match, north-match, d170, d800).
- Review polish: the pour joints were dropped and the slits lightened after the independent review. The light slivers seen in a wide-angle plan are the block and rotunda roofs beyond the cap in perspective, not geometry at the cap rim (a near-orthographic plan, `plan-zoom`, is clean).
- `node --test` on `coit-tower.test.js` (10 tests, under a second): height, flute radii and depth, taper, eight alcoves
  with balustrades, the see-through arcade, small windows, base steps, no back faces from level rays at 360 bearings x 15
  heights, containment in the mapped outline below 13 m, GLB round trip.
- Cityscape: not tested yet. Full 3D world: not tested yet; the rigid-on-y=0 contract and the 18 m pad are untested
  against real terrain. Integration is checked separately.
