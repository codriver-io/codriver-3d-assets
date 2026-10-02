# Canada Olympic Park ski jumps, Calgary

Original procedural model of the 1988 Winter Olympics ski jumps at Canada Olympic Park (WinSport), 88 Canada Olympic Road SW, for Cityscape and Full 3D world. Part of the [Calgary landmarks](../calgary-landmarks.md).

Build: `pnpm build:calgary-landmarks canada-olympic-park`. Source: `src/peregrine/landmarks/calgary/canada-olympic-park/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, plus `canada-olympic-park-plan.js` (every number), `canada-olympic-park-parts.js`, `canada-olympic-park-mesh.js`, `canada-olympic-park.test.js`). Catalog record: `prototypes/assets3d/catalog.d/canada-olympic-park.json`.

## What it is

The ski-jump complex on the Paskapoo Slopes, built 1984-86 for the 1988 Games and closed in 2018. It faces north-north-east, downhill toward the Trans-Canada Highway, and is what a driver recognises from the highway: the 58 m concrete tower of the **90 m (K114) jump** with its cantilevered head, glazed bands and antenna mast, the long grey **K114 inrun** dropping from its head, and beside it the **70 m (K89) tower and inrun**. East of them the model also has the two training hills whose inrun ways are mapped as buildings: the **K63** with its own small tower and the **K38**.

The state modelled is today's structures. WinSport announced in 2024 that the jumps will be decommissioned and demolished later, keeping only the 90 m tower (zipline start). Demolition of the 70 m and training jumps had not been confirmed when this was written (2026-10-02); if they go, remove the K89, K63 and K38 parts and their OSM ways from `FOOTPRINTS`.

The landing hills are earthwork. They are **terrain, not model**: Full 3D world draws them from the DEM. Cityscape has no landing hills.

## Sources (fetched 2026-10-02)

| Fact used | Where |
| --- | --- |
| 90 m ski jump height 58 m; architect J.H. Cook; 1986 | [Heritage Calgary](https://www.heritagecalgary.ca/heritage-calgary-blog/inventory1000) |
| K114 (HS122): inrun 111 m, 35°; take-off 7 m, 11°, 4 m high. K89 (HS95): inrun 88.2 m, 35°; take-off 6.2 m, 10°, 3.2 m high; K63 (HS67), K38 (HS40) exist; closed 2018 | [skisprungschanzen.com](https://www.skisprungschanzen.com/EN/Ski+Jumps/CAN-Canada/AB-Alberta/Calgary/0101-Canada+Olympic+Park/) |
| Cast-in-place concrete towers; steel inrun structures with a timber deck; three towers (90 m, 70 m, training) | [CANA](https://cana.ca/project-details/Canada-Olympic-Park-Ski-Jump-Structures) |
| Decommissioning plan; the 90 m tower is kept for the zipline | [Wikipedia](https://en.wikipedia.org/wiki/Canada_Olympic_Park) |
| Inrun and start-house outlines: ways 272201820, 821, 822, 825, 828 | OpenStreetMap (dossier, shared Overpass queue) |
| Plan positions and bearings of the towers, inruns and take-off edges | Esri World Imagery, z18-19, used as a measuring reference only (nothing traced or shipped). The OSM service road beside the tower lines up with it to 1-3 m. |
| Ground heights between the parts | AWS Terrarium DEM (public; z13, as the app samples it) |
| Massing, head shape, windows, rings, supports | Commons photographs (catalog provenance): 5 (both towers from the north-west), 4 (head's west face, rings), 2 (from the day lodge), 6 (from the east) |

## Frame, origin, orientation

* Origin `[-114.2128861, 51.0767341]`: centre of the 90 m tower head, on the K114 axis. **+x east, +y up, +z south**; rotation is in the GLB.
* Each jump is authored in its own frame (u downhill from the start, v to the skier's right) and placed by its take-off edge and bearing, measured on the imagery: K114 edge (15.8, −101.8), bearing 8.8°; K89 edge (−0.1, −130.0), 13.3°; K63 edge (68.9, −18.0), 4.6°; K38 edge (92.7, −44.2), 1.6°.
* The OSM polygons are coarse. A corner of the K114 way is 14 m from the girder axis, 11 m beyond its west side, so the model follows the imagery. The five rings in `FOOTPRINTS` only remove the provider's `building=yes` slabs. They are not an envelope for the model. The 90 m tower itself is not mapped as a building.
* **y = 0 is the ground at the K89 take-off edge, the lowest footing.** See Placement.

## Dimensions

| Quantity | Model | Source |
| --- | --- | --- |
| 90 m tower, ground to roof | 58.0 m (ground +25.5 → roof +83.5) | sourced (Heritage Calgary) |
| Antenna mast | 9.5 m above the roof (top +93.1) | estimated (photograph 4) |
| 90 m tower head | 16 × 15 m; walls from +51.5 (32 m with the cap, grown downward from 25.5 m; the roof stays at the sourced +83.5), chamfered north cap from +80.3; tapered underside to the shaft at +46 | estimated |
| 90 m tower shaft (lift core) | 10.5 × 11.2 m, 70 % of the head (photographs 4, 5), at the back (south-east); the lowest 6 m (y 0 to 6) flare by 1.2 m on every side. The new footprint contains the old 8 × 7 m one and keeps its back face | estimated |
| Glazed bands, Olympic rings | two bands 7-12 m below the roof; rings 2.5 m across, 1.25 m radius, flat annuli 0.34 m wide on the west face | estimated (photographs 4, 5) |
| K114 inrun | 111 m: 65.9 m straight at 35°, 38.1 m transition (r1 = 91 m), 7 m table at 11°; drop 53.9 m; plan 95.7 m | sourced; r1 estimated with the FIS rule 0.14 v0² |
| K114 take-off edge | 4.0 m above its ground (+8.2) | sourced (take-off height) |
| K89 inrun | 88.2 m: 48.4 m at 35°, 33.6 m transition (r1 = 77 m), 6.2 m table at 10°; drop 41.6 m; plan 76.5 m | sourced; r1 estimated |
| K89 take-off edge | 3.2 m above its ground (+3.2) | sourced |
| 70 m tower | head 10 × 10 m, walls +39.2 to +50.8 (was +41.5), taper from +34.7; shaft 7 × 7 m (70 %), foot flared 1 m | estimated |
| K63 tower | head 7.5 × 7.6 m, walls +48.9 to +57.4 (was +50.6); shaft 5.25 × 5.3 m (70 %), foot flared 0.8 m | estimated |
| K63 / K38 inruns | 70 m at 35°/10°, edge 2.5 m high (drop 32.9 m); 50 m at 32°/9°, edge 1.8 m high (drop 21.7 m) | **estimated**; plan lengths match the mapped 63 m / 47 m |
| Girders | K114 5.6 m wide, 3.6 m deep over the free span, tapering to 2.5 m at the table (was 1.8); K89 4.8 m, 3.0 → 2.5 m (was 1.6); K63 / K38 unchanged (2.4 → 1.4 m, 1.6 → 1.0 m); parapets 1.2 / 1.1 m. Lower 55 % of each flank and the soffit are dark steel | estimated (photograph 5) |
| Supports | K114: concrete pier at u 44, trestle bents every 8.5 m from u 56; K89: pier at u 26, bents every 8 m from u 36; K63, K38: two plain piers each; concrete take-off tables | estimated (photograph 5, imagery) |

## Placement: Cityscape and Full 3D world

**The slope.** On the app's DEM (z13, ~12 m pixels, drawn on a ~24 m lattice), relative to the K89 take-off ground (1192.1 m):

| Footing | DEM | Drawn in the app |
| --- | --- | --- |
| K89 take-off | 0 | 0 |
| K114 take-off | +4.2 | +4.4 |
| K38 take-off / start hut | +11.1 / +20.8 | +11.3 / +20.5 to +21.4 |
| 70 m tower shaft corners | +17.2 to +19.0 | +17.4 to +19.2 |
| K63 take-off / tower | +18.1 / +29.3 | +18.3 / +29.7 to +30.5 |
| 90 m tower shaft corners | +24.4 to +26.6 | +25.2 to +27.0 |

Along the K114 axis the ground falls 20 m over 96 m of plan (about 12°). The inrun falls 54 m. The complex spans about 30 m of relief from the K89 take-off to the K63 tower.

**Choice.** The model is rigid and may not go below y = −3, so it cannot stand at y = 0 on the 90 m tower's ground: the K89 take-off would then be 25 m below grade. Raising the low end in Full 3D world would need a 20-25 m mound. Instead:

* **y = 0 is the lowest footing (the K89 take-off ground).** Every part stands at its real height above that point, measured on the DEM above. **Every tower shaft, pier, trestle leg and take-off table continues straight down to y = 0.**
* **Cityscape (flat): verified.** The complex stands on the flat map. The parts of the shafts and piers below each real ground stand in for the hill. They are plain concrete or steel, not grass or earthwork. The inrun shapes and the tower-to-inrun relation are true. The towers read taller than in life: the 90 m tower's shaft starts 25.5 m below its real base, and the training jumps stand on 11-30 m piers. In the app (port 3278) the group stays at y = 0 and no flatten zone exists.
* **Full 3D world: verified** in the running app (port 3280, AWS Terrarium DEM, `k` = 1). `spec.terrainPad` hangs the group from the DEM at the K89 take-off: the datum is the median of four samples within 2 m of the edge, 1192.1 m. Only the K89 take-off table's 4.8 × 8 m footprint is held at the datum, with a 4 m feather. **No terrace, no pit and no mound.** Everywhere else the hill keeps the DEM, rises round the uphill parts and hides each support below its real ground. Nothing can float, because every support reaches y = 0 and the drawn ground is never below the datum under any part.

Measured with `tmp/cop/measure.mjs` (ignored; adapted from the Alcatraz QA script) after the near DEM arrived:

| Check | Result |
| --- | --- |
| Datum / lattice / DEM zoom | 1192.1 m / 24 m / z13 |
| Flattening, 600 m box, 3 m grid | max cut 0.3 m, no raise, 127 cells changed (the take-off table ring and its feather) |
| Residual at each real base (model ground − drawn ground; − = buried) | 90 m tower −1.5 to +0.3; 70 m tower −1.1 to +0.7; K63 tower −1.2 to −0.4; K38 hut legs −0.6 to +0.3; take-off edges −0.2. These are the slope across each footprint. A + value shows plain shaft, not a gap. |
| Girder underside above the drawn ground | min 1.4 m (K114), 0.7 m (K89), 0.6 m (K63), 0.3 m (K38); the decks clear it by ≥ 1.3 m |

App screenshots looked at: `tmp/cop/app2/cityscape-sheet.jpg` and `tmp/cop/app2/world-sheet.jpg` (sources in `tmp/cop/app2/{cityscape,world}/`: far, near and street from the highway side, a side view from the west and a low view from the north-east). Earlier world close-ups of the tower bases and take-offs are in `tmp/cop/app/world/`. In world mode the hill hides the lowest 25 m of the 90 m tower's shaft and 18 m of the 70 m tower's. The lower inruns lie close to the slope and the training jumps sit on it.

**Limits.** The ground heights come from a smooth public DEM. Its crest under the towers and the take-off knolls are probably a few metres off, so a finer or different production DEM moves these residuals. The K38 girder clears the drawn slope by only 0.3 m, so a different DEM could graze it. The far terrain lattice (~96 m) is coarser still. Terrain exaggeration other than 1 is not tested.

## Materials

`concrete` (towers, piers, tables), `clad` (mid-grey inrun girders and parapets, 15 % darker than the first version: photographs show grey, not white), `track` (inrun bed), `steel` (dark soffit band and underside of the girders, trestles, stairways, mast; 25 % darker), `glass` (teal bands, lift-core strip, start gate) and five ring colours (`ringBlue`, `ringYellow`, `ringBlack`, `ringGreen`, `ringRed`, near only). Far merges `track` into `clad` and drops the rings: four materials. Nothing is self-lit: the jumps are closed.

## Modelling decisions

* **Inruns** are vertical-section sweeps along the sourced profile: a U trough with the track bed between parapets, 8 transition samples near and 4 far. The girder depth tapers over the lower inrun, which lies on the knoll in life, but not below 2.5 m on the Olympic pair. Flanks are two-tone (grey cladding above, dark steel in the lower 55 % and on the underside, also on the end face), so the trough reads deep and dark against the sky as in the photographs. Near adds a stairway slab and handrail along the west side.
* **90 m tower**: a stout flared lift-core shaft (70 % of the head, not a lollipop stalk); a tapered "prow" underside; a head 25 % taller (grown downward, the roof height is the sourced one); head walls with two glazed bands and mullion quads; a chamfered north cap over the inrun; the glazed lift-core strip on the west face from the real ground (+26) up, so the Cityscape stand-in below it stays plain; machine room and a lattice mast; the Olympic rings are flat 24-segment annuli (5 cm proud of the wall, the lower row 5 cm further out), not tori. The K114 girder enters a dark start-gate opening on the north face.
* **70 m and K63 towers**: concrete shaft (70 % of the head, flared foot), tapered underside and a taller box head with a glazed band; each inrun enters its head. The K38 starts from a small hut on four steel legs.
* **Supports** follow photograph 5 for the Olympic pair: one large pier, then steel trestle bents with X bracing (near) down the lower inrun. The training hills get two plain piers each, so the flat map does not show a forest of legs.

## Not modelled, approximations

* Not modelled: the landing hills (terrain), the K20/K10 hills, the judges' towers, coaches' platforms, floodlights and lamp posts, the zipline cables, the day lodge and the low service building east of the 70 m tower.
* The Olympic rings follow 2005 photographs. Their presence today is not verified.
* Head and shaft plans, window heights and the support layout are estimated. The training hills' profiles are estimated from hills of that size.
* Plan positions come from imagery, about ±1-2 m. Ground heights come from a 12 m DEM, about ±2-3 m on the crest.

## Costs

Near 2,932 triangles / 10 draws / 129 KB; far 1,026 / 4 / 51 KB (budget 60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB). Before the proportion pass: 3,308 / 10 / 135,720 bytes and 914 / 4 / 47,540. The rings dropped from 800 to 240 triangles (flat annuli), the steel flanks and flares added about 110 far triangles. `qa-metrics.mjs`: 0 coplanar pairs, 0 % back-face hits, min y 0, no issues. Desktop numbers from the exporter, not car hardware.

## Verification evidence

Inspector renders read (`tmp/cop/shots/`; red rings = OSM ways, 10 m grid):

1. `r1`: the girders were too thin against photograph 5, and the head was a plain box. Fixes: wider, deeper girders, tapering on the knoll; a chamfered cap; mullions.
2. `r2`/`r3` with a photograph-5 camera (`--eye -95,22,-115`): the head was too squat and the shaft too wide. Fixes: head walls from +58 (the girder now enters the head), a shaft 7 m wide at the back, the frustum prow, and the start-gate opening reduced to the girder.
3. App, world: the provider still extruded the K63 and K38 inrun ways as slabs beside the model. Fix: both training hills are modelled and own their ways (`r4`). Their trestles read as a forest of legs on the flat map, so they became two plain piers each (`r5`).
4. Exported GLB: near light (`glb-near`: overview, west elevation, take-offs, head close-up, training hills, back) and far dark (`glb-far`: overview, west, highway, back) match the source.

5. Independent review (recognition 3/5): the towers read as lollipops and the inruns as thin pale strips against massive towers and deep dark troughs. Fixes: shafts 70 % of the head with a flared foot, heads 25 % taller, Olympic-pair girders at least 2.5 m deep with dark steel flanks and soffit, `clad` and `steel` darker, rings as flat annuli. The QA sheet (`tmp/landmark-qa/sheets/canada-olympic-park.jpg`) shows massive towers and a dark trough under the K114 inrun. The footings, take-off edges, tower positions, `terrainPad` and the y = 0 datum are unchanged.

**Not re-measured in the app.** The new shaft footprints contain the old ones (corners moved up to 2.4 m, about 0.5 m of ground on the 12° slope), so a real base can differ by a few tenths of a metre from the table above and every shaft still reaches y = 0 (nothing floats). The flares (y 0 to 6) sit 19 to 25 m below the drawn ground in Full 3D world and show only on the flat Cityscape map. The deeper lower inrun lowers the K114 and K89 undersides by up to 0.7 m and 0.9 m: by subtraction the minimum clearance becomes 0.7 m (K114) and about -0.2 m (K89, the girder meets the knoll, hidden); the decks do not move.

Tests: `node --test src/peregrine/landmarks/calgary/calgary.test.js src/peregrine/landmarks/calgary/canada-olympic-park/*.test.js` (53 pass, about 1 s). They pin the 58 m tower, the 16 m head, the shaft at 70 % of it with a flared foot, the 2.5 m beams with a steel soffit, the 35° straights, the 11°/10° tables, the drops and edge heights, the start inside each head, plan bearings and spacing, each OSM way near its girder, the open span under the K114 girder in near and far, nothing below 0, every table down to 0, a pad without terraces sampled at the K89 edge, the near-only rings and the far silhouette.
