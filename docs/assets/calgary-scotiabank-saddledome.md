# Scotiabank Saddledome (Calgary)

Landmark id `scotiabank-saddledome`. Original procedural model of the Scotiabank Saddledome, 555 Saddledome Rise SE, Stampede Park, home of the Calgary Flames. It follows the [Calgary landmark contract](../calgary-landmarks.md) and the asset catalog.

## What is modelled, and which version

The arena as it stands today: the 1983 building (Graham McCourt Architects, structure Jan Bobrowski and Partners, opened 15 October 1983 as the Olympic Saddledome) with its 1994-95 renovation, under the 2010 Scotiabank name. Only the arena is modelled; the BMO Centre, the parkade north-east of it, the Agriculture Building and the Stampede grounds are separate buildings and are not in the footprint. The arena is due to be replaced (Scotia Place, 2027-28); the model shows the building that is there now.

A driver sees, and the model has:

- the **saddle roof**: a hyperbolic paraboloid that rises to two high ends (north-east and south-west) and dips on the other two sides (south-east, facing Stampede Park, and north-west, facing downtown), in a light roof colour with **eight thin darker seam strips** (`seam`) laid along its two principal directions so an elevated view reads as a saddle, not an egg, closed all round by
- the **edge ring**: a 4.3 m wide precast ring on a 67.7 m radius sphere, its 1.5 m fascia lit orange (`glow`) as at night, with the soffit under it;
- the **wall**: a grey ribbed upper wall that leans out 4 degrees to the ring, with dark reveal lines that follow the roof's curve, sixteen leaning concrete piers (one under each ring element), and in the tall panels of the two high ends a row of lit slits and a few portholes;
- the **concourse**: a ribbon window band on a concrete concourse wall, on a raised deck over a dark recessed ground floor carried on 32 columns;
- the two **concrete portals** on the low sides (a curved beam under the ring on a central pier), the south-east one carrying the **"Scotiabank Saddledome" lettering** (a pixel face, `sign`), with the **roof loop** (a figure-eight ribbon, `sign`) laid on the roof above it;
- at the **south-west end**, the west entrance: a red-orange stadium-shaped pavilion with a dark entrance reaching 81 m from the centre, two flights of steps, two red towers with sloped white tops and a yellow stair tower; at the **north-east end** the matching two towers, a small vestibule and a yellow stair tower, standing on the deck. Both yellow stair towers climb to the underside of the roof ring (about 37 m), as in the front photograph.

## Sources

| Fact | Value | Source |
| --- | --- | --- |
| Roof form | hyperbolic paraboloid concrete shell on a cable net, "reverse" saddle | [Wikipedia](https://en.wikipedia.org/wiki/Scotiabank_Saddledome), [arcaro.org](https://www.arcaro.org/tension/album/saddledome.htm) |
| Edge ring | on a 67.7 m radius sphere, 16 precast elements 4.3 m wide, 122 m clear span, 0.5-0.6 m shell | arcaro.org |
| Roof centre | 14 m below the higher and 6 m above the lower point of the ring | arcaro.org |
| Maximum building height | 89 ft (27.1 m) | [venue technical information](https://www.scotiabanksaddledome.com/technical-information/) |
| Plan | a 70.0 m radius circle (30 vertices, least-squares fit, residual 0.2 m) plus one 52-degree bulge to 81.6 m on the south-west | OSM way 4397328 (retrieved 2026-10-02, ODbL 1.0) |
| Orientation | high ends toward bearings 61 and 241; low sides toward 151 and 331 | the mapped bulge is centred on bearing 241 and holds the west entrance; the saddle's tilt in five photographs |
| Lettering, loop, colours, towers, yellow stair towers | | photographs (below) |

Photographs used to compare (kept in the ignored `tmp/calgary/scotiabank-saddledome/refs/`): Commons 'Saddledome from Calgary Tower.JPG' (Resolute, CC BY-SA 3.0); '2020 Calgary Saddledome.jpg' and '2020 Calgary Saddledome night.jpg' (AceYYC, CC BY-SA 4.0); 'Scotiabank Saddledome, southeast view 20240819 1.jpg' and 'southwest view 20240819 1.jpg' (DXR, CC BY-SA 4.0); 'Scotiabank Saddledome sign.jpg' (Quintin Soloviev, CC BY 4.0).

How the orientation was read: the two views from the Calgary Tower and from the south-east show the near edge dipping and a tip rising at each end, so the dips face the downtown and Stampede Park sides; the south-west view shows the roof's high peak over the west entrance. The mapped outline's bulge (bearings 214.5 to 267, centre 241) is that entrance, which fixes the high axis at about 61/241 degrees. Solving the south-east photograph's camera from the Calgary Tower and the Bow behind the roof gives a low-side axis at about 153 degrees; the two agree to within 10 degrees.

## Dimensions: sourced against estimated

| Dimension | Model | Status |
| --- | --- | --- |
| Roof surface | `z = 27.1 + 14 (u/67.7)^2 - 6 (v/67.7)^2` (u toward the high ends, v toward the low sides) | form sourced, heights estimated |
| Edge ring radius | 67.0 m at the ends, 67.7 m on the diagonals (on the 67.7 m sphere) | sourced |
| Ring height | 40.8 m at the high ends, 31.1 m on the diagonals, 21.2 m at the low sides; roof centre 27.1 m | offsets sourced (14 m, 6 m); the 27.1 m is the venue's 89 ft read as the centre (estimated) |
| Ring section | 4.3 m soffit band, 1.5 m fascia | width sourced, depth estimated |
| Piers | 16, one per ring element, every 22.5 degrees from the high axis | count sourced, size estimated |
| Plan | circle R 70.0 m about the origin, bulge to 81.6 m on the south-west | mapped |
| Deck / concourse / ledge | deck slab 5.2-6.8 m out to R 69.5; concourse wall to 14.6 m with a ribbon window at 9.8-11.6 m | estimated |
| Upper wall | R 61.0 m at 14.6 m, leaning out 0.07 m per metre to the soffit (37.6 m at the ends, 20.7 m at the low sides) | estimated |
| Portals | beam 33 m long, 3.5 m deep, 17.2-20.7 m, on a 3.8 m pier; letters 1.6 m tall, each word about 14 m | estimated |
| Pavilion | 22 m wide, 13.5 m tall, out to R 81.1 m | width and reach from the mapped bulge, height estimated |
| Towers | 9 m x 5.4 m x 19 m (SW, on the ground) and 21 m (NE, on the deck), white top sloping 1.5 m | estimated |
| Yellow stair towers | 4.4 m across, from the deck (6.8 m) to the underside of the roof ring over them (37.1-38.3 m, ending 0.1 m inside it, so no gap and nothing through the roof); about 90 % of the wall's height in the front photograph, the review's finding | estimated |
| Roof seams | eight ribbons 0.8 m wide: four along the high axis at 14 and 40 m either side of it, four across it at 22 and 46 m either side of the centre; 0.10 m (along) and 0.16 m (across) proud of the shell near, 0.14 / 0.20 m far, so they never share a plane where they cross; 364 triangles near, 228 far | estimated |
| Roof loop | 31 m x 11 m figure eight, 0.9 m ribbon raised 0.45 m on the roof 10 m inside the edge | estimated |

**Datum.** `y = 0` is the plaza and parking level round the arena (flat map grade); no terrain is baked in. Nothing is below grade.

## Materials

Ten in the near model: `roof` (light shell), `seam` (the eight thin darker ribbons on it), `glow` (the orange edge ring), `concrete` (wall, deck edge, portals, columns), `pier` (the lighter piers, ledge, deck top and soffit), `dark` (ground recess, deck underside, reveals, entrance, portholes), `light` (ribbon and slit windows), `red` (towers and pavilion), `yellow` (stair towers), `sign` (lettering, roof loop). Self-lit by the layer: `glow`, `light`, `sign`. Night swaps the palette to dimmer concrete and a bright orange ring, warm windows and a red-orange sign. The far model folds `pier` into `concrete` and `light` into `dark` (eight draws, the limit; the seams keep their own material so they stay a notch darker than the roof there too).

## Modelling decisions

- The roof is generated from the published geometry, not drawn: one polar grid evaluated on the saddle, a ring at the sphere's intersection, and every other band hangs off the same functions, so the soffit, the wall top and the fascia close onto each other with shared vertices (no gap, tested by rays under the eaves at every 7.5 degrees).
- The seams are ribbons straight in plan and sampled every 5 m near (8 m far); each vertex is placed by a ray down onto the **faceted** roof shell, plus a lift, so they stand proud of the exported surface (not of the ideal curve, which differs from it by up to 7 cm between rings). The loop on the roof stays clear of them. Colour: `#bbc0bb` against the roof's `#dfe2de` (about 16 % darker), `#7a838c` against `#929ba3` at night.
- The yellow stair towers are lofted from the deck up to the roof ring: each rim vertex is placed at the soffit's height over it (`soffitAt`, the same chord the soffit strip uses) plus 0.1 m, so the top follows the sloping underside with no visible gap and cannot reach the roof's top face (the ring is 1.5 m thick).
- The curved edge is sampled every 2.8 degrees near (the silhouette is read there) and 7.5 degrees far; the roof surface itself needs only seven rings.
- The wall, deck and concourse are lofted profiles around the circle, one merged mesh per material. Hard edges are separate strips, so the normals are smooth round the circle and crisp across it.
- The sixteen piers are 6-triangle prisms, the slit windows and portholes quads and fans, the lettering a 5 x 7 pixel face merged into runs.
- Far keeps the saddle, the orange ring, the piers, the towers, the pavilion and two red bars for the words; it keeps the eight seams (228 triangles) and drops the reveals, columns, windows, the loop and the lettering's pixels.

## Approximations and what is not there

The absolute heights are the main uncertainty: the 89 ft figure is read as the roof centre; a reading as the ring's low edge would lower the whole roof by about 6 m. The high-axis bearing is good to about 10 degrees. The red towers lack their rounded outer corner; the steps are ten steep treads with no railings or canopy; the north-east end is not mapped as a bulge so its towers and vestibule are an inference from photographs; the north-west portal has no lettering (not verified); the roof loop is one colour and has no S stem; the interior, the seating bowl, the scoreboard, the roof's actual panel joints (the eight seams are stand-ins for them along the principal directions, not a survey) and the 2013-flood details are not modelled. Cityscape and Full 3D world are not tested yet; integration is checked separately. Stampede Park is expected to be nearly flat under the 85 m pad, so no `terrainPad` is declared (unverified).

## Costs (measured by `pnpm build:calgary-landmarks scotiabank-saddledome`)

| | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| Near | 7,195 | 10 | 230 KB |
| Far | 1,935 | 8 | 69 KB |

Both are far under the building caps (60 k / 14 / 2.5 MB near, 12 k / 8 / 500 KB far) and the far model is about a quarter of the near one (before the seam pass: 6,831 / 9 / 218 KB near, 1,707 / 7 / 61 KB far).

## Verification evidence

Rendered with `shot.mjs` (headless Chromium, red footprint ring, 10 m grid) and read, in `tmp/calgary/shots/scotiabank-saddledome/`: the procedural near light sheets (overview, south-east low side, roof from above, south-west end; north-west side, plaza level, sign close-up; west, tower, eave, street), the plan view over the red outline (`--top`), the far dark sheet, and the **exported GLBs**: near light (overview, facade, west, north-west), near dark (overview, facade, west, sign) and far dark (overview, facade, west, roof). Compared with the five photographs above from the south-east, north-west, south-west and in the night view.

What the looks changed: the first roof loop was two separate ellipses (like spectacles) and became a lemniscate; the far lettering was a flat quad that sank behind the curved beam (four slivers) and became a strip on the arc; the roof was too bright to read its curve and the above-roof view was too close; the night ribbon of windows was glaring white and became amber. Seam and stair-tower pass (independent review: the yellow towers reached about 60 % of the wall against about 90 % in the front photograph, and the featureless roof read as an egg from above): the towers now end at the roof ring's underside and the eight seams show the saddle in the near and far sheets (`tmp/landmark-qa/sheets/scotiabank-saddledome.jpg`). The tests also pin that no ray sees through the eaves and every face under the ring faces the viewer (the `qa-metrics.mjs` ray sweep was run on the exported GLBs).

Landmark test: `src/peregrine/landmarks/calgary/scotiabank-saddledome/scotiabank-saddledome.test.js` (twelve tests, about 0.6 s). It pins the mapped plan (a 70 m circle plus the bulge facing 241 degrees), the saddle (high at 61/241, low at 151/331, centre 27.1 m, 14 m and 6 m offsets, symmetric), the smooth ring, the 40.8 m top with nothing below grade, closure under the eaves, the orange fascia and the proud piers, the lettering and loop, the towers, pavilion and stair towers, the yellow stair towers reaching the soffit (rays up under each rim: within 5 cm below and 25 cm above it), the eight seams (under 500 triangles; a ray down every strand meets the seam first and the shell 5 to 40 cm below it; slightly darker than the roof in both themes), containment in the OSM outline, and the budgets.
