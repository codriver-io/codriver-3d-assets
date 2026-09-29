# Toronto City Hall and Nathan Phillips Square

Landmark id `toronto-city-hall`. Original procedural model of Viljo Revell's city hall, 100 Queen Street West, in its current state (2025 to 2026): the two curved office towers, the saucer-domed council chamber, the two-storey podium with its green roof and ceremonial ramp, and the parts of Nathan Phillips Square a driver on Queen Street sees (reflecting pool, three Freedom Arches, the TORONTO sign, the elevated walkway loop). Old City Hall (`old-city-hall`, Bay and Queen) is a different landmark and is not drawn.

Source: `src/peregrine/landmarks/toronto/toronto-city-hall/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, `toronto-city-hall-site.js`, `toronto-city-hall-mesh.js`, `toronto-city-hall.test.js`). Build: `pnpm build:toronto-landmarks toronto-city-hall`. Exports: `public/models/buildings/toronto-city-hall{-near,-far}.glb` and `.json`. Contract: [3d-toronto-landmarks.md](3d-toronto-landmarks.md).

## Frame

Real metres, +X east, +Y up, +Z south. Origin `[-79.3839615, 43.6534932]` is the centre of the chamber's hollow central column (OSM way 293907515); both towers' arcs and the saucer are concentric about it. `y = 0` is the plaza; the podium roof is 8 m above it. The building and the square sit on Toronto's street grid, 16.7 degrees north of east (Queen Street West bears 73.3 degrees); once rotated by that angle every mapped pool, arch, walkway and podium edge is axis-aligned to within 0.3 m, so `toronto-city-hall-site.js` lays the square out in grid coordinates `(u, v)` and the towers in polar coordinates about the origin. No terrain, sea level or latitude stretch is baked in. `SPEC.padM` is 200 m so a terrain pad covers the pool and the south walkway (187 m from the origin).

## Dimensions

| Feature | Model | Basis |
| --- | --- | --- |
| East tower roof | 99.5 m, 27 storeys | sourced: OSM `height=99.5`, `building:levels=27`; Wikipedia 99.7 m |
| West tower roof | 79.4 m, 20 storeys | sourced: OSM 79.4 / 20; Wikipedia 79.6 m |
| Tower base | stands on the podium roof, 8 m | sourced: OSM `min_height=8` |
| Tower plan | crescents 112 deg (west) and 135 deg (east) about the column; convex back r 39.3 to 43.6 m, glazed face r 28.7 to 33 m | mapped from OSM ways 27767543/44, 963504341/42 |
| Tower face widths | west arc about 68 m at mid radius, east about 99 m on the back | sourced: 225 ft and 325 ft (Canadian Encyclopedia); consistent with the mapped arcs |
| Tower floor height | 3.57 m (west), 3.39 m (east) | derived from the sourced storey counts |
| Ribs on the convex back | pitch 1.5 m, depth 0.38 m, two belt courses at one third and two thirds | estimated from photographs |
| Glazed face | recessed 1.1 m, one ribbon window and one ledge per floor; three dark floors mid-height, two dark louvre floors at the top | estimated from photographs |
| Pylon and block | ribbed pylon (15.5 / 14.8 deg) and 1.9 m glazed slot at the south end, smooth block (17 deg) at the north end | estimated: which end is which is read from photographs |
| Aerial mast | 6 m on the east tower's north block, tip 105.5 m | estimated; the only part above the sourced roof |
| Council chamber | saucer radius 23.7 m (dome 46 m across), soffit 13 m, rim 16.2 to 18 m, crown 25 m | sourced: OSM `Council Chambers` r 23.7, 13 to 25 m; 46 m / 12 m (Toronto Journey 416) |
| Struts | 23 V pairs (46 arms), apex on a ring at r 18.3, arms to the rim soffit at r 21.6 | sourced count (23 pairs); geometry estimated |
| Podium | outline as OSM way 198500761 (about 115 x 108 m), roof 8 m | mapped and sourced; OSM notes it follows the base, not the overhang |
| Podium front | glazed wall on the mapped edge, 2.4 m fascia cantilevered 4.4 m over round columns every 6.2 m | estimated from photographs |
| Roof gardens | ten beds from OSM `leisure=garden`, layer 1 | mapped |
| Ceremonial ramp | 9.2 m wide, climbs 0 to 8 m along OSM way 43605455's centre line (about 82 m) | centre line mapped; width, parapets estimated |
| Reflecting pool | 54.6 x 30.2 m, rim 0.9 m wide, water 0.32 m | mapped (way 25795356); 55.5 x 30 m sourced |
| Freedom Arches | three arches on the mapped feet (33.6 to 35.6 m span), rise 0.345 x span (about 12 m), section 1.3 x 0.85 m, 13 lamp cans each (near) | feet mapped; rise and section estimated from photographs |
| TORONTO sign | 3 m tall, 22 m long, letters 2.8 m wide, 0.9 m deep, on the pool's north deck | sourced (3 x 22 m); position mapped (way 851806479) |
| Elevated walkway | loop on the mapped OSM path, deck top 6.0 m, 6.2 m wide, parapets 0.9 m, columns every 7.5 m | path mapped; section estimated |

## Materials

Names are keys of `PALETTES.light` and `PALETTES.dark` (same keys): `concrete` (precast panels), `concreteDark` (groove floors, coping), `glass`, `darkGlass`, `dome` (white saucer), `metal` (arch lamps, mast), `grass` (roof beds), `water`, and the two self-lit ones, `sign` (the lettering) and `light` (lit office windows, 22 percent of bays, near only; a warm yellow in the dark palette).

## Modelling decisions

- **Towers from the mapped curves, not from cylinders.** Each tower is two polar curves `r(theta)` copied from the OSM ways (the ribbed back and the inner glazed plane), so the model sits in its footprint by construction; a test checks every vertex above the podium against the mapped rings.
- **Ribbing that survives the runtime.** The layer draws unlit, shaded only by normal, so shallow ribs vanish. Each rib is a trapezoid in the extruded outline, and a darker `concreteDark` course lies in every groove; the south end face is fluted too so the pylon reads as one piece. Layers stand off their surface by 0.12 m (near) or 0.3 m (far) so depth precision holds at the distance the far model is used.
- **Recessed ribbon windows.** The glazing is set 1.1 m behind the pylon faces, each floor has a projecting ledge, near adds mullions and lit bays; far groups floors in threes and drops mullions, windows, lamps and lettering.
- **Chamber as a lathe plus struts.** Saucer and glazed cone are revolved profiles; the V struts are individual bars so daylight shows between them.
- **Site.** The podium is the mapped prism with a fascia and glazed front along its two south edges; the ramp is a swept deck with side walls on the mapped centre line; the pool, arches and sign use the grid frame.

## Approximations and what is left out

Floor-to-floor heights, ribs, dark floors, strut and rim profile, podium fascia, ramp and walkway sections and the arch rise are estimates from photographs. Rounded corners of the tower ends, panel joints, the rooftop plant, the interior, Henry Moore's Archer, the flagpoles, the Peace Garden, the west stage and the walkway's bridge over Queen Street are not modelled. The mast height is a guess.

## Verification

Screenshots were rendered with `local-scratch/shot.mjs` and a scratch copy that applies the layer's own material conversion (`--runtime`: unlit, vertex-shaded, recoloured by palette), under `local-scratch/shots/toronto-city-hall/`, and compared with Wikimedia Commons photographs (listed in the catalog provenance).

| Iteration | Looked at | Changed because of it |
| --- | --- | --- |
| 1 | overview, facade (from the square and Queen St), plan, arches, north, chamber, roof, near, light | first version worked; ribs read as smooth walls; dome too puffy; podium glass too light |
| 2 | square (vs the 2009 and 2017 photographs), north, street, ramp, near, light | trapezoid ribs and groove courses added, S end face fluted, saucer crown flattened to a 6 m cap, podium glazing to dark glass, walkway lowered to a 6.0 m deck |
| 3 | far at 330, 560 and 800 m; near/far, light/dark with the runtime shading; tower top close-up; sign close-up | speckled glazing in the far model (0.07 m stand-off) led to 0.12/0.3 m stand-offs; groove course stand-off; sign diagonals no longer dip below grade |
| 4 | exported GLB, near light (overview, square, street, north, roof, arches), far dark (overview, square, street), then `--source glb` with the official `shot.mjs` | GLB matches the source; no further change |

Viewpoints: front (the square, Queen St), back (north), above (overview, roof, plan), street level and close details (sign, tower top, chamber, arches), near and far, light and dark. Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.

## Cost

Near 30 418 triangles, 10 draw calls, 2.34 MB. Far 9 618 triangles, 8 draw calls, 0.73 MB. Budgets are 160 000 / 48 and 45 000 / 14. No Tesla hardware measurements.

## Tests

`toronto-city-hall.test.js` pins roof heights (99.5 m, 79.4 m, mast 105.5 m), the concentric crescents and open slots between the towers, the flute depth read by rays, the saucer (23.7 m radius, 25 m crown, 46 strut arms, nothing below 13 m), the podium deck and glazed front on the mapped edge, the pool size and the three arches (about 12 m, spanning the pool), the sign (3 x 22 m, near only), footprint containment above the podium, nothing below grade and far bounds within 3 percent of near.

## Sources

Wikipedia [Toronto City Hall](https://en.wikipedia.org/wiki/Toronto_City_Hall) and [Nathan Phillips Square](https://en.wikipedia.org/wiki/Nathan_Phillips_Square); [Canadian Encyclopedia](https://www.thecanadianencyclopedia.ca/en/article/toronto-city-hall); [Toronto Journey 416](https://www.torontojourney416.com/new-city-hall/); [City of Toronto exhibit](https://www.toronto.ca/explore-enjoy/history-art-culture/online-exhibits/web-exhibits/web-exhibits-local-government/a-step-forward-in-time-torontos-new-city-hall/); OpenStreetMap ways 27767543, 27767544, 27767545, 963504341, 963504342, 963504343, 963504344, 963504345, 293907515, 198500761, relation 542980, and the square's pool, arch, sign, walkway and garden ways, read 2026-09-29 through the shared Overpass queue (ODbL 1.0, contributors credited). The lead brief's note gave the east tower as the shorter; the OSM tags, Wikipedia and every photograph show the east tower is the taller (99.5 m).
