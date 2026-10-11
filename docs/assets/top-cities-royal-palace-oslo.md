# Royal Palace, Oslo

Stable asset ID: `royal-palace-oslo`. Original procedural exterior of Det kongelige slott, Slottsplassen 1, the official residence of the Norwegian monarch, at the head of Karl Johans gate. Hans Ditlev Franciscus von Linstow's neoclassical palace, plastered brick on a cut-stone base, begun 1825 and inaugurated 26 July 1849. Not the interiors, the Karl Johan equestrian statue, the stair and grass banks down to Slottsplassen, or the guardhouses in the park. Contract: [3d-top-cities-landmarks.md](../top-cities-landmarks.md).

## Identity and sources

Consulted 2026-10-08:

- [Det kongelige hoff, Slottets historie](https://www.kongehuset.no/artikkel.html?tid=27630): foundation stone 1 October 1825, taken into use for Oscar I on 15 March 1849, inaugurated 26 July 1849. Published sizes: main wing 100.8 × 24.1 × 23 m, side wings 40.7 × 14.3 × 16 m, highest point 25 m, gross footprint 3,320 m², floor area 17,624 m², 173 rooms.
- [Det kongelige slott](https://www.kongehuset.no/kongelige-eiendommer/det-kongelige-slott): address Slottsplassen 1, state property placed at the king's disposal.
- [Wikipedia: Royal Palace, Oslo](https://en.wikipedia.org/wiki/Royal_Palace,_Oslo): Linstow, neoclassical, coordinates 59°55′2″N 10°43′39″E. The 1833 scheme dropped the front wings and added a third storey; the garden wings were extended later; the central colonnade was put back before the 1849 inauguration and the steep temporary roof became a low roof. The park is about 22 ha.
- OpenStreetMap through the shared Overpass queue: **relation 12267199** (`building=palace`, name Det kongelige slott). Outer ways 903106965, 903895748, 903106963, 913213634, 911515964, 913213637. Eight portico-column parts (404742859–404742865, 404743542, 404743543) sit inside the ring; each is under 2 m². Derived coordinates © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright).
- Wikimedia Commons photographs in ignored `tmp/top-cities/royal-palace-oslo/refs/` only: *Slottet i Oslo 1* (Andreas Haldorsen, CC BY-SA 4.0; the south front), *1292 A2. Oslo* (National Library of Norway; the plan from the air), *Slott noreg bak 1* (Bjørn Erik Pedersen, CC BY-SA 3.0; the park side), *Slottet IMG 6069* (Bjoertvedt, CC BY-SA 3.0 no; the balcony), *Royal Palace from Karl Johans Gate* (Andy Mitchell, CC BY-SA 2.0). *Karl johan statue 1* was not used for the massing.

## Frame

Real metres, **+X east, +Y up, +Z south**. Origin `[10.72740248, 59.91714405]` is the area centroid of relation 12267199. The south front runs at bearing 30°. The model is authored in a building frame (`royal-palace-oslo-plan.js`: +u along the front, +v toward Karl Johans gate) and baked once; the layer never rotates it again. `frontageBearing` is **120**. `y = 0` is the leveled terrace the palace stands on, not the avenue below the grass banks.

The mapped outline is a shallow U opening north, into the park. The front wall of the ring sits near v = 22.2, the portico nose near v = 29.24, the main north wall near v = −2.94, and the wing ends near v = −43.8. Walls are inset so cornices and the column bases stay inside that ring. The east wing's inner corner has only about 0.14 m of clearance, so court reveals there are nearly flush.

## Dimensions

| Feature | Value | Source |
| --- | --- | --- |
| Main wing | 100.8 × 24.1 × 23 m | kongehuset.no |
| Side wings | 40.7 × 14.3 × 16 m | kongehuset.no |
| Highest point of the building | 25 m | kongehuset.no (roof). The mesh flagpole is 36.5 m, `SPEC.height`, so the flag clears the pediment |
| Mapped frontage | 100.50 m (u −50.09 to 50.41) | OSM relation 12267199 |
| Model length, wall to wall | 99.1 m, cornice about 100.1 m | inset of the mapped 100.5 m outline |
| Model depth, front wall to north wall | 24.10 m (v 21.55 to −2.55) | set to the published 24.1 m, and inside the ring |
| West wing | width 14.15 m, projection about 40.8 m | OSM, inside the published 14.3 × 40.7 |
| East wing | width 13.80 m | OSM inner corner; the published 14.3 m does not fit that corner |
| Column band | y 8 to 19 m | OSM `building:part` min_height / height |
| Pediment apex | 24.25 m | estimated so it crowns the 22.55 m parapet |
| Flagpole | 36.5 m | measured off the south-front photograph: the cloth flies about 12 m above the pediment. The published 25 m is the building, not the pole |
| Main hip | eaves 21.35 m, ridge 23.05 m | estimated, hidden from the street by the parapet |
| Wing hip | eaves 15.15 m, ridge 16.55 m | estimated against the published 16 m wing height |

## Model

Source `src/peregrine/landmarks/top-cities/royal-palace-oslo/`: `geometry.js`, `royal-palace-oslo-plan.js`, `config.js`, `footprint.js`, `views.js`, `royal-palace-oslo.test.js`. Build: `pnpm build:top-cities-landmarks royal-palace-oslo`. Materials, one draw each: `stucco` (warm beige `#d8c29c` by day), `granite` (base), `trim` (portico, columns, cornice, frames, and the flag's white cross), `roof`, `glass` (attic, and the rectangular ground-floor openings), `glow` (piano nobile: dark glass by day, warm and unshaded at night), `iron` (balcony and flagpole), `flag` (red field). Near adds `blue` for the flag's cross. Far keeps the red field and the white cross and does not draw `blue`, so it stays at eight draws.

Both LODs keep the long block, the grey base, the hexastyle portico with five arched openings, the pediment, the balcony, the low hips behind a parapet, the flag, and the two lower wings with the centre of the north wall stepped toward the park. Ground-floor windows on the flanks are short rectangles in the stone base. Arches are only the five loggia bays. Near adds window surrounds, a sash bar, dentils and balustrade posts on the street front, and balcony balusters. Far keeps one rectangle per bay and the same outer bounds. Columns are 14-sided near and 8-sided far.

## Terrain (Full 3D world)

Bellevue was graded under the palace. Slottsplassen and the park drop within a few metres of the walls, so a disc pad that takes the lowest sample would sink the terrace. `SPEC.terrainPad` is `{ rings: [FOOTPRINTS[0]], datum: 'median', featherM: 16 }`. `padM` is 100 and is unused while the pad is set. The model stays rigid on `y = 0`. No DEM was sampled in this pass.

## Approximations

- Storey heights other than the OSM column band (8–19 m) are estimated from the photographs. The stone base is 7.4 m on the main block and 4.5 m on the wings.
- The published 100.8 m length includes the plinth. The mesh follows the mapped 100.5 m ring.
- The east wing is 13.8 m wide in the model because the mapped inner corner leaves no room for the published 14.3 m plus a cornice.
- The pediment is two triangles and two raking quads. Arches are extruded half-disks, not smooth curves.
- The flag is the Norwegian civil cross (red field, white cross, blue cross on the near LOD). The pole is 36.5 m, taller than the published 25 m building height, so the cloth sits in open sky above the pediment the way the south-front photograph shows. The white cross reuses `trim`.
- Court pavement is omitted. The footprint is the U, and a slab in the court would stand outside the ring.
- The Karl Johan statue, the stair, the grass banks and the guardhouses are outside the building ring and are not modelled.

## Verification

Procedural contact sheets, read against `tmp/top-cities/royal-palace-oslo/refs-sheet.jpg` and refs 1, 3 and 5:

- First sheet `tmp/top-cities/shots/royal-palace-oslo/royal-palace-oslo-procedural-near-light-sheet.jpg`. The massing and the plan sat inside the red ring, but the portico base was five black rectangles with the yellow wall showing in the lunettes, and the piano nobile was pale because `glow` was a day-lit glass colour. The north wall had also been only 8 cm inside the ring, so court windows were pulled back and that wall was set at v = −2.55.
- Second sheet, same path, after the fix: white spandrels behind dark arches, day `glow` darkened to `#243038` (night stays `#f0c48a`), stucco moved to `#e8c45e`. The entrance view shows five arches, six columns, a dark balcony rail and dark upper windows. The park side shows the taller centre block between lower wings.

Exported GLB sheets, read the same way:

- Near, light: `tmp/top-cities/shots/royal-palace-oslo/royal-palace-oslo-glb-near-light-sheet.jpg` (front, portico, park side, plan). The arches, six columns, balcony and U plan match the procedural model and sit inside the red ring.
- Far, light: `royal-palace-oslo-glb-far-light-sheet.jpg`. The silhouette, the five arches and the window rhythm survive; near-only dentils, sash bars and balusters drop out.
- Near, dark: `royal-palace-oslo-glb-near-dark-sheet.jpg`. The piano nobile goes warm; the arches stay dark.
- Far, dark: `royal-palace-oslo-glb-far-dark-sheet.jpg`. Same night read at the far LOD.

Export before the review nits: near 23,213 triangles / 8 draws / 1,511,904 bytes (1476 KB); far 6,225 / 8 / 349,420 bytes (341 KB).

Export after the nit pass (`pnpm build:top-cities-landmarks royal-palace-oslo --no-check`): **near 13,117 triangles / 9 draws / 706 KB; far 6,273 / 8 / 344 KB.** The near drop is the ground-floor half-disks leaving; the ninth draw is the flag blue. `qa-metrics` reported no issues (coplanar pairs 0, back-face 0%, min y 0, top 36.5 m). The front check is `tmp/top-cities/shots/royal-palace-oslo/royal-palace-oslo-glb-near-light-facade.png`: beige walls, rectangular flank windows, five loggia arches, six columns, pediment, and a Norwegian flag above the centre. Building budget is 60,000 / 14 / 2.5 MB near and 12,000 / 8 / 500 KB far. Untested on Tesla hardware.

Placement modes: **Cityscape** (flat ground): not tested yet, integration is checked separately. **Full 3D world**: not tested yet, integration is checked separately (`terrainPad` declared; no DEM sample).
