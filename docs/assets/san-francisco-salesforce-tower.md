# Salesforce Tower (San Francisco)

Stable asset ID: `salesforce-tower`. An original procedural model of **Salesforce Tower, 415 Mission Street** (Pelli Clarke Pelli Architects, completed 2018), the tallest building in San Francisco. Part of the [San Francisco landmarks](../san-francisco-landmarks.md); source in `src/peregrine/landmarks/san-francisco/salesforce-tower/`.

## Identity and what a driver sees

A 326 m, 61-storey obelisk: a **rounded-square prism** of blue-grey glass that holds its width for roughly the lower 170 m, then narrows along one smooth ogive curve to a **rounded nose** whose corners round more as they rise. Every floor line carries a **pearl-white aluminium sunshade** that stands about two feet (0.6 to 0.7 m) proud of the glass, so at 100 m the tower reads as fine horizontal white banding over glass, with a finer vertical fin rhythm; at the foot a **recessed glass lobby** opens onto the street behind slender fin columns. The top 30 m is a **crown**: above the roof deck the fins and sunshades continue as an open lattice screen with sky showing through it, and on its inside 11,000 LEDs ("Day for Night", Jim Campbell) light the screen from within at night. At 800 m it is the obelisk taper and the open crown; at 100 m it is the banding and the base.

The Salesforce Transit Center and its rooftop park next door are not modelled.

## Sources

| Source | What it gave |
| --- | --- |
| [OSM way 431972186](https://www.openstreetmap.org/way/431972186) | Outline (83 nodes, 2 657 m²), `height=326`, `building:levels=61`, architect, `building:colour=#FFFFFF`. Fitted: a rounded square, half-side 26.5 m, corner radius 14.3 m, centre used as the origin |
| OSM ways [1053143796-803](https://www.openstreetmap.org/way/1053143796), [1053143805](https://www.openstreetmap.org/way/1053143805) | Eight `building:part` ways with skillion roofs (the mapper's version of the taper) and a flat-roofed core part, all `height=326`. Used as footprints; the taper itself is taken from a photograph, because the skillion `roof:height` tags are a cartographic shortcut |
| OSM way [1560173288](https://www.openstreetmap.org/way/1560173288) | A `layer=-1` duplicate named Salesforce Tower, `height=326`: listed so a provider extrusion of it is also removed |
| OSM streets | Mission Street 45.2, Fremont and First Street 135.2 degrees (length-weighted segment bearings); the outline fit prefers 46.2. The plan axes are baked at 45.7 degrees |
| [Wikipedia, Salesforce Tower](https://en.wikipedia.org/wiki/Salesforce_Tower) | 1,070 ft (326 m) architectural, roof 970 ft (296 m), 61 storeys, obelisk with a grid of metal fins from base to roof, white aluminium fins and perforated sunshades reaching up to two feet beyond the glass, top 150 ft "largely ornamental", 11,000-LED nine-storey light sculpture (top six floors LED, three below lit), connection to the Transit Center park at the fifth floor |
| [Pelli Clarke & Partners](https://www.pcparch.com/project/salesforce-tower) | "Slender, tapering silhouette", "layers of graceful curves and rounded glass corners that reach beyond the top floor and appear to dissolve into the sky", sunshades at each floor, lobby as a natural extension of the sidewalk |

OSM geometry was read once from the OSM API bounding-box endpoint (2026-10-01; the shared Overpass queue was 35 requests deep) and is © OpenStreetMap contributors, ODbL 1.0. The extract is kept in the ignored `tmp/san-francisco/salesforce-tower/`.

Reference photographs, all Wikimedia Commons, downloaded only to the ignored `tmp/san-francisco/salesforce-tower/refs/` to compare, never committed: "Salesforce Tower 2021" and "Salesforce Tower from Sacramento and Davis Street 2021" (Dead.rabbit, CC BY-SA 4.0), "Salesforce Tower from Ina Coolbrith Park-01445" (Frank Schulenburg, CC BY-SA 4.0), "Salesforce Tower Roof" (InvadingInvader, CC BY-SA 4.0), "Salesforce Tower facade detail (2020)" (HaeB, CC BY-SA 4.0), "Salesforce Tower Completed 2018" (Leijurv, CC BY-SA 4.0), "Salesforce tower facing south" (Gorfle, CC BY-SA 4.0). No photograph, texture or scan is in the repository or the GLBs.

## Frame

Real metres, +X east, +Y up, +Z south, `y = 0` local flat-map grade (the lobby floor). Origin `[-122.39693, 37.789776]` is the centre of the rounded square fitted to the mapped outline (not the vertex mean, which the small entrance bump pulls). The geometry is authored in a plan frame (u along bearing 45.7 degrees, v a quarter turn clockwise) and rotated into the model frame as it is built, so the GLB needs no further rotation. The Mission Street frontage faces bearing 316 (north-west); First Street is south-west, Fremont north-east. Nothing is baked for terrain, sea level or latitude stretch.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Top of crown | 326.0 m | **Sourced** (Wikipedia, OSM) |
| Roof deck | 296.0 m | **Sourced** (Wikipedia, 970 ft) |
| Storeys | 61 occupied; the model draws 66 sunshade lines (9 m lobby, then 4.4 m pitch to 295 m) | **Sourced** count; line pitch **estimated** from photographs (about 4.3 m on the telephoto view) |
| Plan at the base | rounded square, 53 m across the faces (envelope 26.45 m half-side), corner radius 14.3 m | **Mapped** (OSM outline fit, rms 0.37 m) |
| Orientation | faces at bearing 45.7 / 135.7 | **Mapped** (outline and street grid) |
| Width law | one curve, `1 - 0.45 * ((y - 170) / 156) ^ 2.5`: 100 % to 170 m, 0.90 at 255 m, 0.74 at the 296 m roof, 0.62 at 317 m, 0.55 at the 326 m rim; no kink where the glass ends | **Measured** by edge detection on the telephoto photograph (Ina Coolbrith Park, 3.4 px/m): 0.995 at 189 m, 0.945 at 230 m, 0.90 at 259 m, 0.83 at 276 m, 0.75 at 294 m, 0.685 at 305 m, 0.61 at 317 m; checked on a second photograph (Sacramento and Davis Street): the ratios of width to rim width at 10, 20, 30, 40 and 50 m below the top agree to about 4 % |
| Corner radius / half-side | 0.54 at the base, 0.77 at the roof, 0.85 at the top (cubic in height) | Base **mapped**; the rest estimated from the roof photograph (corners round more upward) |
| Sunshade | 0.7 m deep wedge with a 0.45 m lip and a top sloping down and out to 0.7 m at the glass | Depth **sourced** (up to two feet); profile estimated |
| Vertical fins | 56 around the ring (8 per side, 6 per corner), white, 0.2 x 0.34 m | **Estimated** |
| Lobby | 9 m high, glass recessed 0.8 m behind 0.22 m fin columns, closed by a 1.25 m canopy beam | **Estimated** |
| Crown | roof beam, six open rings 1.2 m deep and 4.4 m apart, vertical fins 0.5 m wide at about 2 m pitch along the perimeter (52 near; 1.0 m wide at 4 m pitch, 28, far), a top ring 1.2 m deep ending at 326 m, LED bands on the inside of the screen | 30 m height **sourced**; lattice pitch **estimated** |
| Roof plant | one 14 x 12 x 6.5 m enclosure and two low rails on the deck | **Estimated** from the roof photograph |
| Lit windows | about 27 % of bays, hashed deterministically (near); coarser bays on alternate floors (far) | Estimated |

## Materials

| Name | Use | Light | Dark |
| --- | --- | --- | --- |
| `glass` | Curtain wall and lobby glass | `#6c88a4` | `#314c66` |
| `fin` | Sunshades, vertical mullions, lobby columns and canopy, roof beam, crown fins and rings | `#f1f3f4` | `#8693a0` |
| `metal` | Roof plant | `#9ba2a7` | `#59616a` |
| `roof` | Roof deck | `#6f7478` | `#383d42` |
| `glow` | Lit office bays, unshaded | `#4f6f8f` (a little darker than the shaded glass, so by day it reads as glass) | `#e3bd82` |
| `light` | Inward-facing LED bands of the crown, unshaded | `#e8eef2` | `#cfe7ff` |

The runtime layer shades each vertex from its normal, so the light palette is the sunlit colour.

## Modelling decisions

- **Rings, not boxes.** Every floor is the same closed ring: four straight sides and four 90-degree arcs, parameterised by one number `p` in [0, 8), scaled by the one width law (no separate crown cone) and rotated onto the street grid (`salesforce-tower-parts.js`). Near uses eight segments per corner arc up to the sunshade line at 149.8 m and five above (the arcs are shallow up there); the coarse ring's top edge lies inside the span of the sunshade underside at that line, which closes the join, and the vertical fins sink 0.2 m into the glass so they never hover off a chord. The glass is one loft through those rings with analytic-numeric vertex normals, so the corners shade as curves; sunshades are a wedge section swept around the same ring; vertical fins are thin ribbons that follow `p`, so they hug the taper.
- **The crown is negative space.** Above the roof deck there is no skin: only rings and fins, heavy enough (1.2 m rings, 0.5 m fins near; 2.2 m and 1.0 m far) to read as a white screen rather than a wire cage, with 75 % of the perimeter open between fins. A level ray at 322 m crosses both walls of the crown through the gaps in near and in far (tested), the roof deck stays visible from above, and the LED art is a box of unshaded `light` resting on the fins' inner faces, visible through the lattice at night and from above. Crown fins are placed by even spacing along the perimeter at 311 m, because the straight sides are only about 6 m long up there and a fixed count would crowd them.
- **Lobby.** The glass is pulled in 0.8 m and the fins continue to the ground as columns; the first sunshade line is a deeper canopy beam whose underside is the lobby soffit.
- **Lit windows.** `glow` quads stand 0.15 m (near) or 0.25 m (far) proud of the glass between fins, so they cannot z-fight with it. By day `glow` is close to the glass colour.
- **No box clutter.** The only boxes are the roof plant on the deck. Nothing is below grade; the model stands on `y = 0`.
- **Far LOD.** Same envelope and the same open crown; glass rings every eight floors, a sunshade every other floor line, no vertical fins above the lobby, three crown rings and 28 crown fins, LED bands on alternate levels, lit bays on alternate floors. 5.5k triangles against 30.9k.

## Approximations and gaps

- The small **bump** (7 x 5 m, probably an entrance canopy) on one corner of the OSM outline, the **fifth-floor bridge** to the Transit Center park, the **plaza**, the "salesforce" cloud sign and the below-grade levels are not modelled.
- The vertical fin pitch changes with height (the fins sit at fixed positions around the ring, so they crowd as the sides shorten); the real module is constant.
- Sunshades are plain wedges: the perforated panels, support brackets and the intermediate horizontal mullions are not drawn. Above 150 m the corners are five-segment arcs, so the plan reads slightly polygonal from directly above.
- The crown's real lattice is denser and whiter than the open ring-and-fin screen drawn here; this model prefers the open screen so the sky reads through it. The LED art is drawn as light bands, not the real 11,000-pixel layout.
- Floor pitch, glass colour, roof plant and every lit window are estimates.

## Build, budgets and verification

```sh
pnpm build:san-francisco-landmarks salesforce-tower
node --test src/peregrine/landmarks/san-francisco/san-francisco.test.js src/peregrine/landmarks/san-francisco/salesforce-tower/salesforce-tower.test.js
node scripts/asset-catalog.mjs
```

| Export | Bytes | Triangles | Draws |
| --- | ---: | ---: | ---: |
| `public/models/buildings/salesforce-tower-near.glb` | 964 684 | 30 918 | 6 |
| `public/models/buildings/salesforce-tower-far.glb` | 192 572 | 5 498 | 6 |

Budgets are 60 000 / 14 / 2.5 MB near and 12 000 / 8 / 500 KB far; the aims are 15 to 40k and 2 to 8k. No Tesla timing was measured.

`salesforce-tower.test.js` pins (all in near and far where it applies): the 326 m top and nothing below grade; far bounds within 1.5 m of near and under a quarter of its triangles; the plan faces at 26.45 m and the corners at about 31.5 m from the axis, on the plan axes; the faces square to the OSM outline's own support function (so the GLB is not rotated against the mapped footprint); the width law through the sunshade lines and crown rings (0.90 at 255 m, 0.76 at 290 m, 0.69 at 305 m, 0.58 at 323 m of the base, no change of slope at the roof) and corners that round more upward; one sunshade per floor line by raycast (three in three floors near, every other line far) with glass between; the lobby glass recessed from the facade and a canopy beam at 9 m; the crown open (more than 20 % of level rays cross it) while the glass below is closed; the roof deck at 296 m under the plant; LED light only between 296 and 326 m and lit offices only on occupied floors; every glass triangle facing away from the axis (no inside-out curtain wall, no NaN normals); every vertex within 0.8 m of the mapped outline; the exported GLB bounds equal the source.

Screenshots looked at (`tmp/san-francisco/shot.mjs`, output in `tmp/san-francisco/shots/salesforce-tower/`):

- Telephoto from 1.6 km north-west at the framing of "Ina Coolbrith Park", procedural near and far, light and dark (`...tele-near`, `...tele-far`). Compared with the photograph: the silhouette was first a straight cone; the telephoto showed a prism and a nose, so the width law was rewritten (taper start 25 m to 180 m, 72 % to 84 % at the roof, a conical crown to 58 %).
- Overview, facade, street level, rounded corner, lobby and base (`...overview`, `...facade`, `...street`, `...corner`, `...base`, `...base2`, `...base3`), near and far, procedural and exported GLB. The street view was compared with "Salesforce Tower Completed 2018" and "Salesforce Tower 2021"; the fin grid was too strong (white verticals as heavy as the sunshades), so the verticals became thin grey mullions and were dropped from far.
- Roof and crown from above and from the side, light and dark (`...roof`, `...crown`, `...crown-mid`, GLB far and near), compared with "Salesforce Tower Roof": rounded-rectangle open screen, dark deck with plant, LED bands on the inside.
- The first test run found NaN vertex normals on the glass loft (a wrap-around at the start of the ring); fixed in `ringPoint`, and a test now fails if any glass triangle faces the axis.
- **Review round.** An independent review measured the upper taper 5 to 9 % too fat with a kink at 296 m. The width was re-measured by edge detection on the telephoto photograph (the first estimate was by eye and wrong), a single smooth law replaced the glass curve plus crown cone, and the exported silhouette was measured back from a render at the same scale: 0.616 / 0.682 / 0.742 / 0.828 / 0.887 of the base at 317 / 305 / 292 / 276 / 259 m against 0.61 / 0.685 / 0.746 / 0.83 / 0.90 measured on the photograph. Also changed: crown rings and fins thickened so the crown reads as a screen, `glow` darkened, vertical mullions made white and 0.2 m, the sunshade lip thickened to 0.45 m, and five-segment arcs above 150 m (34.9k to 30.9k triangles).
- Changed because of what the renders showed: glass lightened from navy, lit windows dimmed and made smaller in the dark theme, far gets lit bays so the night tower is not a black slab, lobby recess reduced from 1.2 to 0.8 m so the columns stop hiding the glass at grazing angles, near lit windows lifted from 0.08 to 0.15 m off the glass.

## Placement modes

- Cityscape: **not tested yet, integration is checked separately.**
- Full 3D world (terrain): **not tested yet, integration is checked separately.** The model is authored on grade with a rigid base and `padM = 55`, which covers the 54 m footprint and its entrances.
