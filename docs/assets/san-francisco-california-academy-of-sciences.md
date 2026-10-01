# California Academy of Sciences (San Francisco)

Landmark id `california-academy-of-sciences`. Original procedural model of the Academy's 2008 building, 55 Music Concourse Drive, Golden Gate Park, designed by Renzo Piano Building Workshop with Stantec (Chong Partners). It follows the [San Francisco landmark contract](../san-francisco-landmarks.md) and the asset library. Cityscape and Full 3D world are **not tested yet**; integration is checked separately.

## What is modelled, and which version

The building as it stands today, seen from outside: a 161 by 103 m glass-and-concrete box under the 2.5 acre living roof. A driver on Music Concourse Drive sees, and the model has:

- the **living roof**: a green height field at 10.8 m (published 35 ft = 10.7 m; OSM height 11) with seven round hills. The two largest (about 26 m over the entrance grade) cover the planetarium and rainforest spheres and carry 25 round vents; five lower mounds sit between and beside them (35 vents in all, each about 3 m across, tilted to the slope on a pale rim with a glazed lid);
- the **rainforest crown**: the highest point (27.4 m), a glass spherical cap with glazing ribs that breaks through the green on the south-west hill, standing in a white collar ring about 20 m across;
- the **glazed piazza roof** (22 by 30 m) in its white kerb, between the two big hills;
- the **railed observation terrace** (18 by 18 m, with the glass lift cab) on the roof's south-west front corner;
- the **photovoltaic canopy**: a flat, 11.9 m deep glass overhang all round the building (notched at the four corners like the mapped outline), with a fine white rim and slender white columns every 6.4 m, so the walls stand set back and the shade under the canopy is open;
- the **walls**: stone-coloured concrete with window bays, the lit glass **entrance hall** (48 m, mullions and transoms, `glow` at night) facing the Music Concourse to the north-west, a glazed centre on the south-east side, and the red banner pylon in the arcade.

Not modelled: planting, interior, trees, paths, the small utility building beside the south-west facade (OSM way 1420082168) and the de Young across the Concourse (another landmark).

## Sources

| Fact | Value | Source |
| --- | --- | --- |
| Plan | 161 x 103 m rectangle with 3 m corner notches, area 16,534 m2 | OSM way 28695389 (`building=museum`) |
| Orientation | long edges bear 48.1 degrees | OSM outline, four edge segments |
| Front side | north-west (318 degrees), the Music Concourse side | **chosen from photographs**; OSM encodes the outline's axes, not an entrance |
| Origin | outline area centroid, `[-122.466091, 37.769828]` | OSM |
| Roof edge height | 35 ft (10.7 m); OSM `height=11`; modelled at 10.8 m, between the two | published; OSM |
| Green roof | 2.5 acres (about 10,100 m2), 1.7 million plants, seven hills | published |
| Domes | two 90 ft (27 m) spheres: planetarium and rainforest | Wikipedia, designboom |
| Piazza | about 22 x 30 m glass roof | designboom |
| Terrace | 3,500 sq ft railed platform | Greenroofs.com |
| Photovoltaic canopy | 60,000 cells between two glass panels, round the perimeter | Wikipedia, rpbw.com |
| Round roof vents | 40 controllable round flaps | designboom |
| Hill slopes | up to about 60 degrees on two domes | Greenroofs.com |

Estimated (from four Commons photographs; see the catalog record): the hill positions, radii and profiles (the five small mounds are placed by eye), the vent positions and exact count, the **canopy depth of 11.9 m** (chosen so the roof plan inside the walls matches the published 1 ha), wall and canopy heights (walls 9.7 m, canopy 9.2 to 9.65 m, white rim to 10.05 m), the stone/glass split of the walls, the terrace position, the red pylon, and the crown height of the planetarium hill (25.8 m). The rainforest cap is a plain sphere of 13.7 m radius; the real shell is triangulated. The canopy is flat.

## Frame and modelling decisions

- Local metres, +X east, +Y up, +Z south. `y = 0` is the entrance grade; nothing is baked from terrain or Mercator. The model is authored in the building's own axes (u along the front toward the north-east, v into the building toward the south-east) and rotated 48.1 degrees inside `california-academy-of-sciences-site.js`, so it sits in the mapped outline.
- Roof: an 84 x 48 grid (near) or 36 x 22 (far) over the wall rectangle, heights from `roofHeight(u, v)` (hills are spherical-cap domes, `P (sqrt(1 - k r^2) - sqrt(1 - k)) / (1 - sqrt(1 - k))` with an eased foot, so the two big ones are round with flanks near 60 degrees; a gentle undulation faded to nothing at the edge, the piazza and the terrace). A white skirt carries the roof edge down to the canopy. Vents are cylinders along the surface normal, buried on the uphill side and proud on the downhill side; far uses 8-sided discs.
- The cap sphere stands inside a white collar ring (wall plus flat top) that rises 0.65 m over the green all round, so the glass-to-green junction is a clean circle instead of the grid's serrated intersection; the hills fade to nothing 0.6 to 3 m before the piazza's kerb. Eight meridian and two parallel ribs stand 0.08 m proud of the shell (near only).
- Offsets: every inset trim, window and mullion stands at least 0.16 m proud or sunk into its parent; the skirt is 0.25 m outside the wall; nothing shares a plane. Nothing floats: columns run from grade into the canopy, the terrace deck is sunk into the roof, vents stand on the surface.
- Far keeps the roof, hills, vents (as discs), cap, piazza, terrace deck, canopy, rim, every second column, the glass hall and the wall boxes; it drops window bays, mullions and rails. Bounding boxes are identical.
- Seven materials (`green`, `glass`, `glow`, `pv`, `white`, `stone`, `sign`) in both palettes; `glow` (the lit hall and the piazza) and `sign` draw unshaded.

## Cost

| | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 15,260 | 7 | 499,036 |
| far | 2,744 | 7 | 81,296 |

Budget (building): near 60,000 / 14 / 2.5 MB, far 12,000 / 8 / 500 KB.

## Verification

Looked at with `node tmp/san-francisco/shot.mjs california-academy-of-sciences` (procedural source, then the exported GLB), against the reference photographs (Alfred Twu's aerial, the 2008 view from the de Young tower, Highsmith's roof vents, Mabel's canopy view). Views judged: overview, front (head-on and street level), roof, rainforest and planetarium hills, canopy, back and end; near and far; light and dark.

What the looks changed:
1. First render: the rainforest cap came out a 1 m speck because an 18 m hill is steeper than the 13.7 m sphere; the hill was widened and lowered so the glass shows about 19 m across as in the photographs.
2. The terrace deck was a heavy white slab against the hill; recoloured stone and moved clear.
3. Dark theme: the green and window glass went near black; both lifted.
4. Footprint: the first outline overshot the mapped notch by up to 0.16 m at the north-east corner (the OSM rectangle is slightly skewed); the outline was tightened so every vertex is inside the ring.
5. Review round (PASS-WITH-NITS): the planetarium hill was a peaked parabolic bell, now a spherical-cap dome; the roof green went from lime to olive (light `#6f7638`, dark `#4b5230`); the cap's serrated base became a white collar ring, with ribs; hills no longer run up the piazza's kerb. Re-rendered the procedural and exported near views (facade, entrance, planetarium, rainforest, overview) and the far GLB at 800 m, light and dark.
6. The canopy soffit reads dark olive in the review viewer because of its green ground light. It is already the near-white `#e7e9e4` (the app shades downward faces to about 0.66 of the colour), so it was left unchanged.

Tests: `node --test src/peregrine/landmarks/san-francisco/california-academy-of-sciences/california-academy-of-sciences.test.js` (crown height, plan size and bearing, roof edge and hills, vents proud of the surface, piazza and terrace, canopy and columns, entrance hall and pylon, footprint containment, far keeps the features), plus the shared `san-francisco.test.js`.

Cityscape: not tested yet. Full 3D world: not tested yet. The building stands on the flat plateau of the Music Concourse; the terrain pad is `padM = 100`.

## Known weaknesses

- The five small hills and the vent layout are placed by eye from oblique photographs.
- The glass cap is a smooth sphere with 8 meridian and 2 parallel ribs, not the real triangulated shell.
- One olive `green` for the whole roof: no ochre patches or planting texture.
- No PV cell pattern on the canopy, no braces under it; the walls are plain boxes with window bays rather than the Academy's actual curtain-wall and concrete detailing.
- Far has no window bays, so the side walls are plain.
