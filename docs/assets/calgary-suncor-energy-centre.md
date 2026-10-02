# Suncor Energy Centre (Calgary)

Stable asset ID: `suncor-energy-centre`. An original procedural model of the **Suncor Energy Centre, 150 6 Avenue SW** (formerly the Petro-Canada Centre; WZMH Architects, completed 1984): the 215 m west tower, the 130 m east tower and the low block that joins them. Part of the [Calgary landmarks](../calgary-landmarks.md); source in `src/peregrine/landmarks/calgary/suncor-energy-centre/`.

## Identity and what a driver sees

Two red-granite and dark-glass office towers, nicknamed "Red Square" in the 1980s. Each is a grid-aligned rectangle whose north-east and south-west corners are cut off by long diagonal faces (bearings 48 and 228 degrees, 39 m apart on the west tower, 37 m on the east), with 6 m stepped notches at the other two corners. Each tower is capped by a single dark roof plane that falls toward the south-west, so the wall tops are sharp, slanted lines: the north-east face runs to the full height, the south-west face stops 15 m lower, and the window rows step down the slope. At 100 m the towers read as a lattice of wide dark windows between red-brown granite spandrels and piers; at 800 m as two slabs with a few dark ribbon strips and slanted crowns, the tall one west of the short one. By night about a fifth of the office windows glow.

Modelled as built in 1984. The 2025 to 2027 lobby, fitness-centre and amphitheatre redevelopment is not.

## Sources

| Source | What it gave |
| --- | --- |
| [OSM way 505391964](https://www.openstreetmap.org/way/505391964), [127741493](https://www.openstreetmap.org/way/127741493) | Both tower outlines, including the stepped corners and the diagonal faces; `building:levels` 53 and 33; `height=130` for the east tower |
| [OSM way 127741496](https://www.openstreetmap.org/way/127741496) | The untagged low block between the towers and its narrow wing to the south (one outline, 1 927 m²) |
| [Wikipedia, Suncor Energy Centre](https://en.wikipedia.org/wiki/Suncor_Energy_Centre) | Roof 215 m (west) and 130 m (east); 52 storeys and 32 floors; 1984; WZMH; granite and reflective glass cladding, Finnish granite cut and polished in Italy; the "Red Square" nickname; the 2025 redevelopment |
| [CTBUH Skyscraper Center](http://www.skyscrapercenter.com/building/suncor-energy-centre-i/1350) | The 215 m figure and storey count cited by Wikipedia |
| [Brookfield Properties](https://www.brookfieldproperties.com/en/our-properties/suncor-energy-centre-528) | Current owner's page (redevelopment) |

OSM geometry comes from the dossier extract in the ignored `tmp/calgary/suncor-energy-centre/osm.json` (one query through the shared Overpass helper), © OpenStreetMap contributors, ODbL 1.0.

Reference photographs, all Wikimedia Commons, downloaded only to the ignored `tmp/calgary/suncor-energy-centre/refs/` to compare, never committed: "View From Calgary Tower, 1991. 01 (cropped)" (Lankyrider, CC BY-SA 4.0), "Telus Sky under construction, with the Bow and Suncor Energy Centre, Calgary, June 2018" (dancing_triss, CC BY 2.0), "Suncor Building Calgary. (8068090771)" (Bernard Spragg, CC0), "The Suncor Energy Centre, Calgary. (52938836101)" (Bernard Spragg, public domain), "Centre Streey North-Calgary" (Qyd, CC BY 2.5), "Suncor Energy Center (East tower), Calgary, June 2013" (Ultimateshot, CC BY-SA 3.0), "Petro-Canada-Centre-Szmurlo" (Chuck Szmurlo, CC BY 2.5). No photograph, texture or scan is in the repository or the GLBs.

## Frame

Real metres, +X east, +Y up, +Z south, `y = 0` local flat-map grade. Origin `[-114.0639, 51.04803]`, about the middle of the complex: the west tower's centroid is 42 m west of it, the east tower's 32 m east. The plans are the mapped outlines converted with the layer's own Mercator-with-stretch maths, with sub-metre jogs merged. Nothing is rotated: the 42-degree turn of the diagonal faces against the street grid is already in the mapped outlines (edge bearing 138.0 degrees, measured on both towers), so the host must not rotate the model. Nothing is baked for terrain, sea level or latitude stretch.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| West roof, high edge | 215 m | **Sourced**: Wikipedia / CTBUH |
| East roof, high edge | 130 m | **Sourced**: Wikipedia and OSM `height=130` |
| Storeys | 52 office floors + lobby (west, 53 levels in OSM), 31 + lobby (east, 32 in Wikipedia, 33 in OSM) | **Sourced** totals; split estimated |
| West plan | 58 m east-west by 62 m north-south rectangle; diagonal faces 44 m (north-east) and 41 m (south-west), 39 m apart; 6 m notches at the north-west and south-east corners; 2 412 m² | **Mapped** (OSM) |
| East plan | 52 m by 53 m; diagonal faces 33 m and 38 m, 37 m apart; 6 m notches at the north-west and south-east corners; 1 916 m² | **Mapped** (OSM) |
| Roof planes | 22 degrees, falling toward bearing 228 (perpendicular to the diagonal faces); south-west wall tops at 199 m (west) and 115 m (east) | **Estimated** from the Calgary Tower photographs; the highest point of each is exactly the sourced height |
| Floor pitch | 3.95 m; lobby 9.6 m (west) and 7.55 m (east), so the top row lands on the roof height | Estimated |
| Facade module | 3.05 m bay, windows about 2.7 m wide and 2.05 m high on a 0.78 m sill, granite piers 0.32 m, corner piers 0.5 m | Estimated from photographs (about 45 % glass) |
| Low block | 11.5 m (three storeys, level with the east tower's first floor line) | **Estimated**; plan mapped |
| South wing | 6 m, a single glazed storey | **Estimated**; plan mapped. Possibly a raised link in reality |

## Materials

| Name | Use | Light | Dark |
| --- | --- | --- | --- |
| `granite` | Spandrels, piers and corner piers | `#7f4a40` | `#6a4a41` |
| `glass` | Recessed window glass, blue-black | `#2b3440` | `#1d1514` |
| `glow` | About a fifth of the windows (more at the lobby), unshaded | `#2f3946` (reads as glass by day) | `#ffc67a` (lit at night) |
| `roof` | The sloping crown planes and the flat roofs of the block and wing | `#3b2d29` | `#2d2625` |

The runtime layer shades each vertex from its normal (0.66 to 1.0 of the palette colour), so the light granite is the sunlit colour.

## Modelling decisions

- **Real windows, no hidden faces.** Each wall is built in `suncor-energy-centre-facade.js` as granite spandrel strips and corner piers on the mapped line, with one dark glass quad 15 cm behind on the outline inset by 15 cm, and piers between neighbouring windows as one continuous 15 cm proud fin per bay boundary. A window opening exists where its head clears the roof line by 0.5 m, so the top rows end in a stair along the slope and the granite above them follows the slanted edge exactly. Lit windows are warm quads 7 cm in front of the glass. Reveals, sills and heads are sub-pixel at driving range and are not drawn.
- **Sloping crown.** Each tower's roof is a single plane through its outline whose highest point is the sourced height; walls are cut by the same plane, so roof and wall tops share edges (watertight). The stepped notches show as small steps in the crown.
- **Sealed corners.** Every wall carries its glass quad even where granite hides it (short jog edges, and the foot of a tower wall hidden by the low block runs to grade), so a window beside a corner never opens onto a neighbour with no glass behind it: a grazing ray used to slip past a corner pier at the east tower's south-west corner.
- **Low block.** The block mapped between the towers is a three-storey volume in the same granite and glass; its wing is a single storey. Tower walls abutting the block start at its roof line.
- **Far LOD.** Same plan, notches, roof planes and silhouette; the floors become ribbon strips (one per about 8 floors: six on the west tower, four on the east, one on the block; three per tower read as a different building), with the glass share of near (sill at 20 % and head at 72 % of each slot), a lobby strip, 12 m bays only so a strip can stop where the roof falls, no piers between bays and a sparse lit share. 0.76 k triangles, 4 draws (it was 2.0 k with every window opening).

## Approximations and gaps

- Roof plane direction and slope are read from photographs taken from the south (Calgary Tower) and from the north-east; both fit, but the exact slope (22 degrees) is an estimate. The planes are plain dark surfaces: rooftop plant, antennas and the aviation lights visible in photographs are not modelled.
- Floor pitch, window size, granite and glass tone are estimates. The cladding is a deep brick-maroon that photographs render anywhere from pink to orange; the first palette (`#9d6153`) rendered salmon against the photographs, so it was darkened to `#7f4a40`, and the glass moved from bronze-brown to the blue-black of the photographs.
- The low block's height and the wing's height are estimates, and the wing may be a raised walkway rather than a ground-level pavilion.
- Not modelled: the glazed canopies beside the towers (OSM `building=roof` ways 964045475 and 1319374918), the plazas, the lobby entrances and canopies, below-grade levels, and the 2025 to 2027 redevelopment (new lobby, terrace and amphitheatre).
- Mapped outlines carry small irregularities (a few centimetres); jogs under about a metre were merged, so the model can differ from the mapped ring by up to 0.1 m.

## Build, budgets and verification

```sh
pnpm build:calgary-landmarks suncor-energy-centre
node --test src/peregrine/landmarks/calgary/calgary.test.js src/peregrine/landmarks/calgary/suncor-energy-centre/suncor-energy-centre.test.js
node scripts/asset-catalog.mjs
```

| Export | Bytes | Triangles | Draws |
| --- | ---: | ---: | ---: |
| `public/models/buildings/suncor-energy-centre-near.glb` | 259 060 | 4 797 | 4 |
| `public/models/buildings/suncor-energy-centre-far.glb` | 41 460 | 759 | 4 |

Far is 16 % of near; both are far inside the building budgets (60 000 / 14 / 2.5 MB near, 12 000 / 8 / 500 KB far). No Tesla timing was measured.

`suncor-energy-centre.test.js` pins: roof peaks of 215 m and 130 m, nothing below grade; each roof a single plane falling 22 degrees toward the south-west across the tower; the walls facing bearings 48 and 228 and the 39 m spacing; the 6 m notches at the north-west and south-east corners; granite spandrels and piers, glass 15 cm behind the granite on a window row, lit windows; the top windows of the south-west face about 16 m lower than the north-east face; the 11.5 m block and 6 m wing; 1 056 rays from outside that must all hit a front face (no holes or inverted walls); every vertex within 0.6 m of the mapped footprints; far bounds within 1.5 m of near.

Screenshots looked at (`shot.mjs`, output in the ignored `tmp/calgary/shots/suncor-energy-centre/`, plus `cmp2.jpg` and `cmp3.jpg` side-by-sides with the references):

- First sheet (overview, facade, roof, north, diagonal, east, street, west; procedural, near, light). Changed because of it: windows read as tiny dark rectangles (glass 25 cm back hid most of a window when looking up from the street), so the recess dropped to 15 cm and the window grew from 1.65 to 2.05 m; piers narrowed from 0.55 to 0.32 m; granite and roof colours darkened.
- Side-by-side with "View From Calgary Tower, 1991" (Calgary Tower deck, 160 m up): the first roof plane fell toward the south, which showed a broad flat octagon; the photograph shows a thin sliver on the left of each crown with the right wall rising above it, so the direction became 228 degrees (perpendicular to the diagonal faces). The west crown then matched the photograph's slanted top and rising right-hand wall.
- Close views: stepped notch at mid-height (`notch`), foot with the low block and lobby glass (`base`, `street`), crown with windows stepping down the slope (`crown`, `roof`). Changed because of them: corner glass sealing (a ray test found a grazing slit at a corner next to a hidden tower foot).
- Exported GLBs, near and far, light and dark (`overview`, `northeast`, `east`, `roof`; four rows of one sheet): identical to the procedural source in outline, colour and lit-window share; far reads as the same two slabs with a few dark ribbon strips instead of window rows.
- Not compared: a true front elevation (no photograph square onto a face) and a roof-level photograph (none found), so the roof and facade detail rests on oblique views.

## Placement modes

- Cityscape: **not tested yet, integration is checked separately.**
- Full 3D world (terrain): **not tested yet, integration is checked separately.** Downtown Calgary is nearly flat here (the Bow River is about 600 m to the north, the Elbow about 1.5 km south-east), so the default terrain pad with `padM = 75` is expected to be enough; no `terrainPad` is declared. This is an expectation, not a measurement.
- Failed load, LOD switch and reanchoring are handled by the shared building layer and covered by its own tests, not re-tested here.
