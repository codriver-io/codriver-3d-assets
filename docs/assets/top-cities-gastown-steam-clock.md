# Gastown Steam Clock

Asset `gastown-steam-clock`, Water Street at Cambie Street, Gastown, Vancouver, British
Columbia. Designed and built by Raymond Saunders, 1977. A 5 m cast-bronze and glass
clock on a granite plinth with four dials and a pagoda roof carrying five steam
whistles, standing in a ring of bollards and chains on brick paving. Contract:
[3d-top-cities-landmarks.md](../top-cities-landmarks.md). Source:
`src/peregrine/landmarks/top-cities/gastown-steam-clock/`.

## Sources

| Fact | Value | Basis |
| --- | --- | --- |
| Maker, year | Raymond Saunders, 1977 | [Wikipedia](https://en.wikipedia.org/wiki/Steam_clock), the clock's own plaque |
| Height | about 5 m (16 ft) | published. The model's whistle tip is 5.00 m |
| Layout | four dials in a square case, pagoda roof, tall central whistle and four corner whistles | photographs ([Leonard G., CC SA 1.0](https://commons.wikimedia.org/wiki/File:GastownSteamClock.jpg); Dietmar Rabich, CC BY-SA 4.0, [1920](https://commons.wikimedia.org/wiki/File:Vancouver_(BC,_Canada),_Gastown_Steam_Clock_--_2022_--_1920.jpg) and [1908](https://commons.wikimedia.org/wiki/File:Vancouver_(BC,_Canada),_Gastown_Steam_Clock_--_2022_--_1908.jpg)) |
| Position | (-123.10889, 49.28438) | the dossier origin, taken from the OSM clock position |
| Orientation | square plan turned 16 degrees from east-west | Water Street's bearing, 106 degrees, read from the longest edges of the mapped blocks around (ways 136255883, 136252474, 301829390; 106 and 15 degrees) |
| Provider extrusion | none | no OSM building way under the clock: the nearest, way/363419786, is a 4 m annex about 50 m away. The model is `footprintless` |

## Dimension table (model vs source)

| Element | Model | Status |
| --- | --- | --- |
| Total height | 5.00 m to the central whistle tip | sourced (about 5 m) |
| Plinth | granite, 0.92 m square to 0.62 m, then 0.80 m square to 1.10 m | estimated from photographs |
| Shaft | 0.58 m square, 1.10 to 2.85 m, arched window 0.28 m wide on each side to 2.71 m, brass corner strips | estimated. The real windows show weights and a bell |
| Flare | bronze, 0.64 to 0.84 m, 2.85 to 3.03 m | estimated |
| Cabinet | 0.84 m square, 3.03 to 3.83 m, amber-backed glass, brass corner posts | estimated |
| Dials | four, diameter 0.54 m, centre 3.43 m, brass bezel, self-lit cream face, ten past ten | estimated. Roman numerals are ticks |
| Cornice | 1.0 m square, 0.10 m, 3.83 to 3.93 m | estimated |
| Pagoda roof | two bronze frusta 0.86 to 0.60 m then 0.60 to 0.30 m, 3.93 to 4.38 m, cap box to 4.45 m | estimated |
| Whistles | central r 0.075 m, 4.56 to 4.90 m, finial to 5.00 m; corner r 0.042 m on the cornice corners, tips at 4.45 m | height sourced, radii estimated |
| Plaque and vent | brass plaque on the upper plinth step, six-slat grille on the lower, on one face | estimated. Assigned to the south-south-east face (frontage 164 degrees) |
| Pad and bollards | brick pad 3.0 m square, 8 cm proud; four bollards 0.88 m high on a 2.3 m square, chains sagging 14 cm | estimated stylisation of the mapped brick corner |

## Materials

Six merged materials: `granite` (plinth), `bronze` (shaft walls, flare, cornice, roof,
whistles, bollards, chains), `brass` (bezels, corner strips and posts, plaque, ticks,
hands, weights, collars), `glass` (the amber backing seen through the windows and
behind the dials), `glow` (the dial: cream by day, warm yellow at night, drawn
unshaded) and `brick` (the pad). Light and dark palettes share keys. Colours are
calibrated to the photographs: blackened green-grey bronze, aged brass, an unsaturated
amber, not toy yellow.

## Modelling decisions

- One axis of 4-fold symmetry authored in clock-local metres, then turned once (16
  degrees) into the street's frame. Only the plaque and vent break the symmetry.
- The window to the works is real negative space: each side of the shaft is an
  extruded slab with an arched hole and the amber `glass` core sits 14 cm behind it, so
  the opening reads from the street and a ray through it hits the glass, not the wall.
- The dial is a drum recessed 2 cm behind a thicker brass bezel ring, so the dial and
  bezel never share a plane. Ticks and hands are 2.5 cm proud, in `brass`: dark hands
  made a bronze/brass depth-ordering cycle with the corner posts, and the layer ranks
  materials rather than faces, so the hands and ticks are gilt.
- Whistle collars stand on the cornice with the tube starting at their top, not passing
  through them, to avoid bronze/brass interpenetration.
- Far keeps the five stages, the arched windows, the four dials with quarter ticks and
  both hands, the whistles and the bollards. It drops the numeral ticks between the
  quarters, the grille, the plaque, the blossoms, the hub, the collars and the chains.
  Bounding boxes are identical.

## Not modelled

The steam plume (it blows every quarter hour and is not a rigid object), the lamp post
and flower baskets beside the clock, the plaque's lettering, the gilt blossoms' colours
and the real Roman numerals, the pendulum and weights beyond a brass bar and a bell,
the surrounding sidewalk (the brick pad is a stylised patch), and the street furniture
on Water Street.

## Costs

Near 4,984 triangles, 6 draws, 299 KB; far 2,168 triangles, 6 draws, 140 KB (budget
60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB).

## Verification

- `node --test src/peregrine/landmarks/top-cities/top-cities.test.js
  src/peregrine/landmarks/top-cities/gastown-steam-clock/gastown-steam-clock.test.js`:
  height 5.00 m in both LODs, four dials by raycast on every face (self-lit, recessed,
  brass bezel proud), the arched windows (glass inside, bronze beside, ends below
  2.78 m), the roof widths at three heights, five whistles by vertical and horizontal
  ray, plaque and vent on face 0 only, bollards holding every chain end with a free end
  0.5 m short detected as free, chain sag near and absent far.
- `node scripts/landmark-depth-layers.mjs --ids gastown-steam-clock --check`: no cycle
  edges dropped (the first export had two: a brass collar through a bronze whistle, and
  bronze ticks and hands against brass bezel and posts; both fixed in the geometry).
- Contact sheets looked at (all under `<local path>`):
  `gastown-steam-clock-procedural-near-light-sheet.jpg` (overview, facade, roof, dial,
  back, plan) and `all-sheet.jpg` (exported GLB, near light, far light, near dark, far
  dark; overview, facade, dial, back), against `refs-sheet.jpg`. Changed because of
  them: the amber glass and the brick pad were too bright (a pink slab and a yellow
  case), the pad was narrowed from 3.4 to 3.0 m, and the far dial was a blank disc, so
  quarter ticks and hands were added to far.
- Cityscape and Full 3D world: not tested yet, integration is checked separately.
