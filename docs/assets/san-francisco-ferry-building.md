# Ferry Building

Asset `ferry-building`, 1 Ferry Building, The Embarcadero, San Francisco. Original procedural model of the terminal as it stands today: A. Page Brown's 1898 Beaux-Arts block, restored in 2002, with its clock tower. Contract: [3d-san-francisco-landmarks.md](../san-francisco-landmarks.md). No scan, traced mesh, photograph or texture is in the repository or the GLBs.

## Identity and what a driver sees

From Market Street at 800 m: a 75 m white clock tower standing up from the middle of a long, low, level pale-grey building that closes the end of the street. From 100 m: the projecting central pavilion with three tall arched windows over three dark portals between pairs of columns, a plain attic above it, the tower shaft with its 6.7 m clock dial, and either side two storeys of round arches (small ones below, taller windows above) in a rhythm of 4.4 m bays. At night the arched windows, the tower's open belfry and lantern and the dials are lit, the tower is floodlit, and "PORT OF" / "SAN FRANCISCO" glow red on the roof.

## Sources and dimension table

The mapped data fixes the plan: OSM way 558731934 (the terminal) is an almost perfect 201.6 x 47.2 m rectangle with a 43.3 m pavilion projecting 8.9 m from the city front, and the clock tower is mapped stage by stage (building:part ways 404449724 to 406710839). Prose and photographs fill in what OSM does not say. OSM was read with one bbox fetch from the OSM map API (2026-10-01); the Overpass helper was queued and not needed.

| Feature | Model | Basis |
| --- | --- | --- |
| Block length | 201.6 m (u = -100.8 to +100.8) | OSM way 558731934; Wikipedia 660 ft = 201 m |
| Block depth | 47.2 m (v = -23.6 to +23.6) | OSM way 558731934 (the long edges agree to 0.1 m over 100 m) |
| Bearing of the long axis | 323.8 deg true (+u toward NNW); front faces 233.8 deg | least squares over the OSM outline edges |
| Central pavilion | 43.3 m wide (u -20.9 to 22.4), front 8.9 m proud (v = -32.5) | OSM way 558731934 outline |
| Pavilion height | 16.1 m to the coping | OSM building:part height=16.1 (way 24460886) |
| Wing cornice height | 14.0 m | estimated from photographs (elevation 2013, JaGa) |
| Wing bays | 18 a side at 4.4 m; ground arch 2.9 x 3.9 m, upper window 3.0 x 5.5 m (sill 5.5, crown 11.0) | estimated: counted and measured on the photographs |
| Pavilion | three great arches 6.4 m wide (sill 5.6, crown 11.0), three portals 6.2 x 3.9 m, six pairs of 0.85 m columns (3.4 to 11.1 m) on 3.4 m plinths | estimated from the front elevation; pair spacing read from the 2013 photograph |
| Clock tower position | axis u = 0.4, v = -18.65; first stage 12.3 x 11.3 m (OSM), shaft 10.6 x 10.4 m | OSM way 404449724; shaft from photographs |
| Tower height | 75 m to the flagpole tip | Wikipedia and the Port: 245 ft (75 m); photograph proportion check ~73-77 m. OSM maps lantern 68.2, dome 70, pole 83.1 m |
| Tower stages | shaft 41.6, cornice 42.5, belfry 47.6, cornice 49.4, steps 53.4, upper loggia 57.4, cornice 58.6, drum 62.4, ring 63.7, lantern 65.8, dome 67.5, pole 75.0 m | stage proportions read from the 2013 elevation scaled to 75 m; OSM stage tops (43.5, 50.5, 54.2, 60.5, 64.5, 68.2) agree to 1-3 m |
| Clock | four dials, 6.7 m diameter, centre 34.2 m | Wikipedia (22 ft); height from photographs |
| Grand Nave roof | cornice 14 m, aisle slopes to a clerestory at 15.3-16.5 m, nave ridge 17.5 m | estimated (photographs from the bay and from above) |
| Bay side | 22 semicircular lunettes (7.9 m, sill 8.9 m) at 9.2 m pitch over a 3.4 m glazed band and a 3.6 m shopfront band; walkway canopy 3 m wide at 4 m | lunette count from Wikipedia (22 arches a side); sizes estimated; canopy mapped (OSM way 1189071405) |
| Roof signs | "PORT OF" u -25.2 to -11.2, "SAN FRANCISCO" u 11.9 to 39.2, letters 3.0 m high on rails at 18.7-22.1 m | positions measured on the photographs, size estimated |

## Frame, origin and rotation

Real metres, +X east, +Y up, +Z south. `origin` is the middle of the block (halfway along it and halfway between the city and bay walls): [-122.3934298, 37.7955383]. The model is authored in a facade frame (u along the Embarcadero toward the NNW, v from Market Street to the bay) and rotated once by `ROTATION = 90 deg - 323.8 deg` about y (`ferry-building-site.js`), so the plan sits in its footprint. `y = 0` is the Embarcadero plaza; nothing is baked for terrain, sea level or latitude. `padM` is 108 m (the farthest corner of the walkway is 104 m out).

## Materials

Eleven named materials, same keys in light and dark: `stone` (wings and pavilion, pale blue-grey), `pale` (cornices, trims and the whole tower, near white; floodlit warm at night), `base` (granite plinths), `roof` (slate and the walkway), `glass`, `glow` (unshaded: the arched windows, warm at night), `lamp` (unshaded: the dark void behind the belfry and lantern columns by day, lit warm at night), `light` (unshaded clock dials), `copper` (the cupola and finials), `metal` (mullions, clock hands, sign rails) and `sign` (unshaded: dark letters against the sky by day, red neon at night). The far model folds `base` into `stone` and `copper`, `metal` and `glass` into `roof`, so it draws seven materials.

## Modelling decisions

- Walls with windows are slabs with the openings punched through (`ferry-building-kit.js`), the infill is tucked 0.1 m into the back of the reveal, and the hidden back cap of every slab is dropped, so a facade of 100 round-headed openings has real reveals and no coplanar sheets. Trims stand proud by at least 0.1 m. The wing's ground storey is a 2.2 m deep arcade (the infill sits 2.1 m behind the face) under a 1 m thick upper wall, with pier strips standing 0.18 m proud between the arches (near only).
- Mullions, clock marks and hands, the tower's slit windows and the sign letters are single-sided flat quads (2 triangles each) a few centimetres off the surface, not boxes: `metal` fell from 3 444 to 1 544 triangles and the sign from 1 464 to 488. The letters are one quad a side so they read from the city and the bay.
- The city front keeps its rhythm in both LODs (18 + 18 bays a wing, the three great windows, the 22 lunettes); the far model keeps four-segment arches and drops mullions, pier strips, clock numerals, slit windows, capital detail, finials, canopy posts and individual letters (each sign becomes a bar).
- The tower is stacked boxes, lathed cylinders for the lantern and cupola, and clock faces built from flat discs and rings placed 0.1 m off the shaft; the open belfry and loggia have a lit core behind four slender columns a side.
- The roof is three extruded profiles (two aisle slopes and a nave gable) with glass clerestory strips; the gabled end walls follow the same profile.

## Approximations and what is not modelled

Storey heights, window sizes, the roof profile, bay-side glazing and the stage heights of the tower are estimates (above). The real nave roof is more stepped than the model's. The end walls are plain panels with three arched windows over four glazed bays; the real ends carry three gables of different heights. Not modelled: interior, the ferry gates and the Golden Gate Ferry Terminal roofs and piers behind the building, the two plaza lamp standards, flags, the tram stop and the pier decks.

## Costs

| | triangles | draws | KB |
| --- | --- | --- | --- |
| near | 11 079 | 11 | 662 |
| far | 5 488 | 7 | 351 |

Budget: near <= 60 000 / 14 / 2.5 MB, far <= 12 000 / 8 / 500 KB.

## Verification evidence

All renders with `node tmp/san-francisco/shot.mjs ferry-building` (1280x800), procedural source and exported GLB, near and far, light and dark; reference photographs (Commons, listed in the catalog record) compared by eye.

- Iteration 1 (overview, facade, roof, tower, pavilion, bay side, end, sign, top; light): recognisable at once. Fixes made: pale/blue-grey palette (the wings first rendered almost white), the sign glyph grid raised from 3x5 to 4x5 (the N read as an H), the clerestory glass end poking out of the gable (the end-wall outline now covers its width), z-fight at the end plinths (pedestals inset 0.25 m from the pavilion corners, side arches narrowed).
- Iteration 2 (junction, underside, bay end, frontal elevation compared with the 2013 photograph, night, far light/dark): tower stage fractions match the photograph within 1 % of the tower height; the bay-side glazing and lunettes read like the bay photographs; night shows lit arches, lit belfry, floodlit tower and red signs.
- Fix round (independent review PASS-WITH-NITS): the signs were white hairlines against the sky and the belfry read as flat blue panes. Now the sign is dark by day (red at night) on thicker rails, the belfry and lantern cores are the dark `lamp` void, the wing walls gained a deep arcade and proud piers, the flagpole is 0.24 m at its base, and the mullions are flat quads. Re-rendered the GLB down Market Street (100 m street view, close wing view, 800 m far view, night overview).
- Iteration 3 (exported GLB near and far: overview, facade, 100 m street view, 800 m far view, bay side, tower at night): the GLB matches the source; at 800 m the tower over the long low block reads at once, at night too.
- Top view with the red footprint rings: the model fits inside the rings, the pavilion sits on the SW (Market Street) side.

Tests: `node --test src/peregrine/landmarks/san-francisco/ferry-building/ferry-building.test.js` (9 tests, about 3 s) pins the 75 m height, the 201.6 m length and 8.9 m pavilion, the mapped bearing, 18 + 18 bays a wing, three portals under three great windows between six column pairs, four lit dials, the stepped, narrowing tower stages and copper dome, the deep arcade and proud pier strips, the dark belfry void between white columns, the 22 lunettes, the canopy, the sign strokes, the nave ridge at 17.5 m, the end-wall windows, footprint containment (1.3 m), no degenerate triangles, and the far model keeping the silhouette in half the triangles.

Cityscape and Full 3D world in the running app: not tested yet; integration is checked separately.
