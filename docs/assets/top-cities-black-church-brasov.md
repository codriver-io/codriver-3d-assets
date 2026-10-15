# Black Church (Biserica Neagră), Brașov

`black-church-brasov` — the Lutheran parish church in Brașov's old town, Romania. Original procedural model of the church as it stands today. Contract: [top-cities landmarks](../top-cities-landmarks.md). No scanned mesh, traced third-party mesh, photograph or texture is in the repository or the GLBs.

## Identity and sources

A late-Gothic hall church (14th–15th c.): one very tall, steep tiled roof over a three-aisle nave, a single square tower at the south-west corner (only the southern of the two planned west towers was built above the roof) with two clock dials, a hip roof, a dark timber drum and a flared cone with a slender spire, tall buttressed lancet walls, and a polygonal apse at the east end. A fire in 1689 blackened the walls and gave it its name; the stone reads today as weathered grey-brown, which is how it is drawn.

- [Romanian Wikipedia: Biserica Neagră](https://ro.wikipedia.org/wiki/Biserica_Neagră) (dossier `tmp/top-cities/black-church-brasov/facts.txt`).
- OSM: church outline [way 866090450](https://www.openstreetmap.org/way/866090450), nave part way 866090448 (`height=41`, `roof:height=13`, gabled), choir part way 866090447 (`height=37`, gabled) and apse part way 866090446 (`height=37`, pyramidal). Dossier `osm.txt` / `osm.json`.
- Reference photographs (compared only, not redistributed; titles, authors and licences in the ignored `refs/SOURCES.txt` and the catalog record): Firilacroco (CC BY-SA 3.0 ro), Kosson ×2 (CC BY-SA 3.0 ro), Mark Ahsmann (CC BY-SA 4.0), Dennis G. Jarvis (CC BY-SA 2.0), NeuP (CC BY-SA 4.0).

| Feature | Value | Source | Implementation |
| --- | --- | --- | --- |
| Axis | bearing 72° (long edges of ways 866090448 / 866090447) | mapped | Whole model authored in its own frame (u along the nave) and rotated 18° once in `geometry.js`; tower at the WSW end, apse at the ENE end |
| Length | ~82 m on the axis (mapped outline; the commonly quoted 89 m includes the porch and buttresses) | mapped | 82.0 m including buttresses |
| Width | 25.6 m nave outline | mapped | walls 24.8 m plus 0.9 m buttresses, 26.6 m overall |
| Tower height | 65 m | published (spec) | exact in both LODs: shaft 40 m, hip to 46.5 m, drum to 50 m, cone to 57.5 m, spire to 63.6 m, cross to 65 m |
| Nave ridge | 41 m | OSM `height=41` | 41 m (41.3 m with the ridge cap) |
| Choir ridge | 37–37.5 m | OSM `height=37` | 37.5 m |
| Nave / choir eaves | 22.5 / 21.5 m | estimated (OSM implies a higher eave; the interior vault is ~21 m) | steep 56° nave roof, 62° choir roof |
| Tower position | south-west corner, the nave's west gable beside it to the north | de.wikipedia ("nur der südliche Turm"), every photograph | south face 0.5 m proud of the south wall, west face 0.3 m proud of the west front |
| Tower footprint | 11.2 × 11.2 m | estimated from photographs (about half the west front) | |
| Clocks | two dials, about 30 m up | de.wikipedia ("zwei Zifferblätter in etwa 30 Metern Höhe"), photographs | square red-brown panels with a light dial on the west and south faces, centre 30.8 m, one narrow opening above each free face |
| Bays | six nave bays between tower and choir, three in the choir, five apse faces | estimated | one lancet per bay, buttress between each |
| Cross gables | one over each side portal, ridge 33 m, flush with the wall | estimated from photographs; the mapped outline has no transept projection | prism roofs sunk into the nave roof |

## Geographic frame and ownership

Real metres, +X east, +Y up, +Z south. Origin `[25.58807, 45.641]` is the dossier anchor; the footprint centroid sits ~10 m east of it. `y = 0` is local pavement grade. `FOOTPRINTS` / `OSM_WAYS` list the church outline and its three building parts (nave, choir, apse): the model draws over exactly those provider extrusions and over none of the neighbouring shops, school or houses. A test pins that the model never leaves the mapped rings by more than the 1.25 m buttress projection less 0.1 m (the stepped buttress feet are the worst points). The model is rigid; no terrain is baked in. The default terrain pad (`padM: 60`) is used and has not been checked against the DEM (the old-town square is gently sloped); Full 3D world is not tested.

## Geometry, materials and LOD

Six merged materials, same names in both palettes: `stone` (weathered grey-brown, not black), `trim` (lighter dressed stone: clock faces, eaves cornice, string courses, spire cross), `roof` (red-brown tile), `glass` (dark window backing, also the interior core visible through the lancets), `wood` (dark timber drum, doors, clock hands, tile courses) and `copper` (the spire). The dark palette is a dim approximation; nothing glows.

- **Walls** are real extruded slabs with pointed lancet holes (near) or flat cut-out faces (far); a dark interior core behind them shows through every opening, so no window is see-through. Near adds window mullions and transoms, moulded frames, a plinth and an eaves cornice.
- **Buttresses** stand at every bay line: three stages stepping back from 1.25 m to 0.53 m with sloped weatherings and a pyramid cap in near, one 1.25 m block in far; the apse ones stay at 0.7 m.
- **Roofs** are closed prisms with a 0.35 m overhang; near adds horizontal tile courses and a ridge cap. The choir roof ends in a half-pyramid over the apse. The two cross-gable roofs run into the nave roof, with a gable window and a pinnacle at the apex.
- **Tower**: at the south-west corner; the west and south faces run to the ground (west portal, slits, a lancet on the south), the east and north faces rise out of the nave roof. Each free face has a small window, the square painted clock panel (west and south), a string course and a single narrow upper opening. The west front's own wall and gable stand to the north of it. Four corner pinnacles, a hip, a timber drum with louvres, a flared lathe-turned cone, a copper spire and a cross.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 9,589 | 6 | 431 KB |
| Far | 1,066 | 6 | 51 KB |

Both are far below the building budget (60 000 / 14 / 2.5 MB and 12 000 / 8 / 500 KB). Far keeps the same silhouette (identical bounds: 82.1 × 65 × 43.1 m in the world axes), windows as cut-outs, clocks and the tower stages, and drops frames, mullions, tile courses and buttress steps.

## Approximations and limits

Eave heights, window and buttress rhythm, the cross-gable size and the tower's stages are read from photographs, not surveyed. The mapped outline has no projecting transept, so none is drawn. No interior, statues, gargoyles, crockets, stair turret, weathering variation or texture. The real roof is somewhat steeper and the real stone more mottled. The 0.9 m buttresses on the apse are cut back to 0.55 m to stay near the mapped ring.

## Verification evidence

`black-church-brasov.test.js` (12 tests, < 0.3 s) pins: ways owned (and neighbours not), 65 m top, ~82 × 26.6 m extent along the mapped axis, ridge heights by raycast along the whole nave and choir, slope falling at the expected rate beside the ridge, apse roof falling away to the east and nothing beyond it, the tower stages by horizontal raycast (clock `trim`, recessed belfry `glass` openings with a `stone` pier between, hip `roof`, drum `wood`, cone `roof`, spire `copper`, sky either side of the spire and above the narrower cone), the west face 0.3 m proud, lancet openings in the nave wall with solid wall below the sill, every nave buttress's face 0.9 m out (and a ray shifted off it missing the face), cross gables rising to 33 m with the portal door recessed 0.45 m, footprint containment, and far keeping the near bounds in under a third of the triangles. All in both LODs.

Looked at (all under `<local path>`): procedural near light contact sheets (overview, facade, tower, north, roof, apse); exported-GLB near light sheet (overview, facade, tower, north, south, roof, apse, portal); exported-GLB far dark sheet (overview, facade, tower, north, roof, apse); GLB top view. Changes made because of them: clocks moved from the nave-roof-buried part of the north and south tower faces up to 34.8 m where the photographs show them, belfry openings on the west face turned into recessed dark panels (the nave gable showed through the holes), the apse pulled in 0.5 m and its buttresses shortened to stay within the mapped ring, the choir/apse centre buttress removed from the portal bay, and plinth and clock hands recoloured to remove two material depth cycles (`landmark-depth-layers` now drops 0 edges).

Not verified: Cityscape and Full 3D world placement (integration is checked separately), terrain pad against the DEM, in-app unlit shading.

### Review fixes (g3a, 2026-10-15)

The independent review (FIX, 3/5) found the tower centred on a broad west gable (a generic symmetrical church), the clocks set between paired belfry lancets, and thin buttresses, plain lancets and heavy black roof courses. Changed: the tower moved to the south-west corner as an 11.2 m shaft, with the west front wall and gable (and a finial) standing to its north and the south wall's west bay carried by the tower; the clocks are now square red-brown panels with a light dial and dark hands on the west and south faces, below a string course and one narrow opening per face; the paired belfry lancets are gone. Buttresses are three-stage with weatherings (1.25 m projection), lancets have a second moulded order in the reveal, a springing transom and Y-tracery, and the tile courses are finer bars in the roof colour instead of black. The test now pins the tower's south-west offset, the gable beside it, the clock panels, the single upper opening and the stepped buttresses; its footprint tolerance follows the buttress projection (the buttress feet are the worst points, under 1.15 m outside the mapped ring). Costs before → after: near 6,428 → 9,589 tris (6 draws, 280 → 431 KB); far 1,119 → 1,066 tris (6 draws, 51 KB). Looked at: procedural near sheets `tmp/next-200/fix/g3a/black-church-brasov/iter1*/`, exported-GLB near and far light sheets `glb-near/`, `glb-far/` and a near dark sheet `glb-near-dark/`. Depth layers: 0 cycle edges (the dial's dark centre was dropped and the cross-gable window overlay is near-only, which removed glass/stone/trim cycles).

