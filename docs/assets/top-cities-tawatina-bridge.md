# Tawatinâ Bridge (Edmonton)

Original procedural model of the Valley Line's extradosed concrete bridge over the North Saskatchewan River at Cloverdale, Edmonton. Free-standing and footprintless: it carries two LRT tracks and a path, not a road, so there is no HD road fitting and no provider building to replace. Registry: `top-cities/tawatina-bridge`, kind `bridge`, `SPEC.ready = true`. Files: `config.js`, `footprint.js`, `geometry.js`, `views.js`, `tawatina-bridge-site.js` (shared numbers), `tawatina-bridge.test.js`. Catalog record `prototypes/assets3d/catalog.d/tawatina-bridge.json`; exports `public/models/bridges/tawatina-bridge-{near,far}.glb` and `.json`.

## What it is today

Arup design for TransEd / the City of Edmonton. The path under the girder opened 12 December 2021, trains from 4 November 2023 (Valley Line southeast). An extradosed bridge: a low, shallow-stayed concrete box girder rather than a tall cable-stayed deck. *Tawatinâ* is Cree for "valley". About 550 art panels (David Garneau and other Indigenous artists, Madhu Kumar) are fixed to the girder soffit and are seen from the path. What a driver sees from the river valley road: a long pale concrete girder, two leaning pylons with fans of thin stays at the north-bank pier, and the timber path slung beneath.

## Sources and what is sourced

| Item | Value | Basis |
| --- | --- | --- |
| Length | 261 m | Wikipedia infobox 260 m; OSM outline 259.8 m between end edges (+0.6 m backwalls per end) |
| Spans | 100 + 110 + 50 m (three) | Structurae; main span 110 m also Wikipedia |
| Deck width | 11 m | Wikipedia / Structurae |
| Girder depth | 3.5 m mid-span | Structurae |
| Path | 8 m wide, hung under the girder | Wikipedia / Structurae |
| Stays | 28 (7 per side on 2 planes) | Dialog Design |
| Axis bearing | 0.57 deg east of true north | OSM way 570036448, end-edge midpoints |
| Track spacing | 4.5 m (tracks at v = ±2.25) | OSM Valley Line ways 1221895803 / 1221895804 at the pier |
| Pylon pier | 101 m from the north end | the Valley Line way break at z = -28.6 m (ways 636427023 / 1221895803) |
| Path extent | mapped 113 m south and 76 m north of the centre (OSM cycleway bridge way 732161091); modelled 113 m south to 42 m north, where it meets the bank | OSM, shortened at the north by the terrain (see the review fixes) |

## Estimated

| Item | Value | Basis |
| --- | --- | --- |
| Pylon height above deck | 16 m (top at 30 m above the datum) | proportion in photographs against the 3.5-5 m girder |
| Pylon lean, section | 9 deg outward; 2.3 x 1.7 m at the foot tapering to 1.3 x 1.0 m | photographs |
| Stay layout | main-side stays 11-65 m from the pylon (9 m pitch), back stays 14-80 m (11 m pitch), anchors 9-15.5 m up the pylon | photographs; only the count of 28 is sourced |
| Haunch | 5.0 m over the pylon pier, 4.4 m over the south pier, cosine over 24 m either side | photographs |
| Deck height above datum | 14 m; path 4.8 m, level from u = -55 to 30, ramping 5 % down to y = 1.9 at its south end and 3 % up to y = 5.2 at its north end | the flat map has no valley; DEM profile read below |
| Which pier carries the pylons | north | Valley Line way break plus the bank shown in the photographs; not confirmed by a drawing |
| Parapet, masts, luminaires, art-panel pattern | stylised | photographs; the panel tones are three flat colours, no artwork is reproduced |

## Datum and terrain

`y = 0` is the river-level floodplain at the south pier. The north bank climbs ~19 m to the end of the structure, so a default disc pad would level the valley wall: `SPEC.terrainPad` instead holds one small ring per footing (south pier = datum, pylon pier +3.3 m, south abutment +1.8 m) and, on the north bank, an open cutting under the guideway: four 46 m wide terraces from u = 98 to u = 176 at +13.6 / +12.75 / +11.7 / +11.0 m (the floor 0.1-1.6 m under the track slab, which falls 5.5 %), so the hill closes the cut at the mapped tunnel portal (u = 172, OSM ways 650830876 / 672849774 at grade from 129 to 172, then tunnel ways 1221895805 / 674098689). The rings are 46 m wide because the near terrain lattice is 22.7 m on the ground: two held node columns must straddle the axis or the TIN lifts the floor back to the DEM under the deck (probed in the app along the axis: the ground reads 629.6 m at u = 110-120 falling to 627.7 m at 170 against a deck of 630.0 falling to 627.8 m, then 636.4 m at 180: the hill closes the cut). Offsets come from two AWS Terrarium z14 tiles (3027/5295 and 3027/5296, probed on a 12 m x 30 m grid; the river reads ~615-616 m, the pylon pier ground 619.3 m, the north end 635 m). They are estimates: Full 3D world is **not tested yet**, integration is checked separately. Cityscape is not tested either.

## Model

Authored in the bridge's frame (u north, v east, y up) and rotated once by -0.569 deg about Y. Materials (10 near, 5 far): `concrete`, `steel`, `track`, `rail`, `timber`, `asphalt`, `art1`-`art3`, `lamp` (unshaded luminaires).

- 11 m trapezoidal box girder (wings ±5.5 m, flat soffit ±2.8 m) as one loft, haunched over the piers; 0.5 m wing edge, 3.5 m mid-span depth.
- Pylon pair: tapered, leaning, one loft each with caps; twin pier legs under each pylon; twin legs under the south pier; a pair of end-pier legs at each end, from which the approach viaducts continue.
- 28 stays as 5-sided cylinders (3-sided far), each ending in a pylon anchor on the pylon axis and a concrete blister on the deck edge.
- Parapet rails with posts, track slabs with running rails, two contact wires with end masts, extra masts every 40 m (away from stay anchors, near only).
- Hung path: concrete slab with timber margins and an asphalt strip 10 cm proud (far: a single timber solid), handrails along the ramps, hanger rods (7 m pitch near, 14 m far) ending in the girder soffit and the slab, luminaires on alternate rods (near), and ~225 art panels under the flat soffit (near).

## Cost

Near 16 556 triangles / 11 draws / 1 078 KB after the north portal (the north viaduct now ends at the portal instead of running 200 m buried in the hill; one more material, the portal's dark lining); far 3 208 / 6 / 216 KB. Before that: near 21 680 triangles / 10 draws / 1 361 KB (21 488 / 1 351 KB before the overhead-line terminals; 8 996 / 652 KB before the approaches); far 3 880 / 5 / 255 KB (was 1 716 / 118 KB) (budgets for a bridge 120 000 / 40 / 4.5 MB and 30 000 / 10 / 1.2 MB). `qa-metrics`: ok, no coplanar pairs, no back-face hits, no unsupported member ends; depth layers: 0 cycle edges dropped.

## Verification

- `tawatina-bridge.test.js`: length, deck level and width, girder depth at mid-span and over both piers, pier spacing (110 m), pylon lean and height, all 28 stays end in concrete at both ends in both LODs (with shortened-stay negatives that must fail), hanger rods meet soffit and slab (shortened-rod negative), path levels and ramps, track spacing and bearing, art panels in near only, budgets, GLB round trip.
- Contact sheets looked at (exported GLB, light and dark, near and far, six views each) in `tmp/top-cities/shots/tawatina-bridge/r1` (procedural), `r2`, `r3`, plus single back and pylon-detail renders (`r3/…-back.png`, `…-detail.png`) against the six reference photographs in `tmp/top-cities/tawatina-bridge/refs-sheet.jpg`. Found and fixed from them: inside-out girder faces from a loft winding test that used a whole-bridge centre, a stay layout reaching too far, rods through the art panels, the far path's layered timber, floating overhead-wire ends.

## Known weaknesses

Pylon height, lean and stay layout are photo estimates. The model has no water or valley. The 5.5 % approach viaducts are an engineered continuation (LRT grade from the 14 m deck): the south one follows the mapped Valley Line bridge ways, the north one is straight and ends in a modelled portal at the toe of the north hill (u = 169.5, 2.5 m short of the mapped tunnel start); neither is a surveyed profile. In Full 3D world the north guideway runs in a terrain-held cutting to that portal. The cutting is as coarse as the 22.7 m terrain lattice: a wide, smooth basin, so the wing walls are the only retaining structure; the portal's footing (the datum) is buried by the held floor (11 m) and the hill covers the recess behind it. The path's north end stops at u = 42 although the mapped cycleway runs to 76 m.

Photo credits (kept in ignored scratch, not shipped): Matthew Boonstra, Thankyoubaby, Sdkb (CC BY-SA 4.0); Mack Male (CC BY-SA 2.0).

## Review fixes (g1a, 2026-10-14)

1. **Lower walkway swallowed by the terrain in Full 3D world.** The path used to ramp to y = 0.5 at both mapped ends, but the DEM (AWS Terrarium z15 sampled along the axis, relative to the 615.8 m south-pier floodplain) climbs 3.4 m at the pylon pier, 4.4 m at u = 40, 6.2 m at u = 50 and 9.7 m at u = 76 (15 % bank), so the north half of the path ran 5-9 m underground while the rods and lamps carried on. `pathYAt` now keeps the path level at 4.8 m to u = 30, rises 3 % to 5.2 m at u = 42 and stops on a concrete end wall that runs down to grade (the wall of the bank in Full 3D world, a landing on the flat map); the south end ramps 5 % down to 1.9 m (terrain there is 0.6-1.3 m) on its own end wall. The path stays at least 0.3 m above the DEM profile at every sampled station (pinned in the test with the sampled table), hanger rods end where the path ends, and the rod/lamp headroom check is unchanged (>= 4.2 m).
2. **Guideway ended in the air on the flat map.** The two abutment blocks stood at 14 m with nothing behind them while OSM maps the Valley Line as viaduct for 200 m more to the south (ways 1221895802, 1221212789, 1221212818, 672849775, swinging 42 m west). The model now continues the girder both ways at 5.5 % (LRT grade, 247 m to the ground) with the same track slabs, running rails, parapets and overhead line, twin-leg piers every 32 m, the girder tapering from 3.5 m to 2.6 m over 24 m so it is flush with the main girder; the abutment blocks became two stout legs each. The south approach follows the mapped alignment (Catmull-Rom through the mean of the two track ways), the north one is straight along the axis. Cost +12.5 k near, +2.2 k far.
3. Tests: the 261 m check now measures the end-pier faces by raycast; new tests pin deck level and grade along both approaches (continuous, flush at the abutment, lands below 1 m, the south one swings west with the mapped line, a leg reaches grade where one is due and not half-way between, nothing beyond the built end), the path end walls reach grade with nothing above them, and the path clears the DEM profile. Depth layers 0 cycle edges. App shots recaptured in both modes (`tmp/next-200/fix/g1a/tawatina-bridge/{city,world}`); the path is fully visible in the Full 3D world foreground and the guideway lands on the flat map.

## Review fixes (g1a2, 2026-10-14)

1. **North guideway buried by the terrain in Full 3D world.** The DEM climbs 15-19 % north of the abutment (14 m at u = 100, 21 at 140, 27 at 172), faster than the guideway can follow, so the descending deck sank into the hill and its masts and wires poked out above it. OSM maps the Valley Line at grade from the abutment to u = 172 and underground beyond, so the terrain pad now holds that stretch as an open cutting (see Datum and terrain), the deck and its furniture stand in it, and the hill closes it at the portal. Verified in the app: height probe along the axis (ground 0.1-0.9 m under the deck from u = 100 to 170, then a 9 m rise by u = 180), side and close views at the north end in Full 3D world; Cityscape is unchanged (the approach still lands on the flat map).
2. **Dangling overhead-wire ends.** Each approach mast carried one arm to one track, so the first and last masts held only one of the two wires and the first span started 0.4 m short of the deck's own wire. Every approach mast now has two arms (its own track and a longer one across to the far track), and the first span starts exactly on the deck-end wire. Near +192 triangles; far unchanged (it has no approach wires, and its deck-end wires sit on their masts). Tests: every wire end (deck ends in both LODs, every approach mast in near) meets steel within 2 cm, a free end 1.5 m past the last mast and a mid-span point do not; the north cutting terraces sit 0.1-1.6 m under the deck from u = 100 to 172, and none lies beyond the portal or on the open flank.

## Review fixes (g1a3, 2026-10-15)

1. **North tunnel transition closed as solid terrain.** In Full 3D world the tracks vanished into a smooth hillside, which read as the guideway sliced off. The north approach now ends in a concrete portal, in both LODs: a 1.2 m headwall 20.3 m above the datum (jambs, lintel, and a 40 cm coping in near), an 11.2 m wide opening 6.6 m over the rail slab, two wing walls splaying from 9.5 m to 13 m off the axis over 12 m and stepping down to 1.4 m over the rail level, and a 2.4 m recess (concrete shell round a dark lining and a 0.6 m dark end wall) the girder, track slab, rails and wires run into; each wire ends on a steel dropper from the recess roof (near). **The portal stands at u = 169.5, not at the mapped tunnel start (u = 172, OSM ways 1221895805 / 674098689).** Probed in the app, the near terrain lattice (22.7 m) holds the cutting floor only to its node column at u = 168.4 and the TIN then climbs 0.8 m per metre (11.3 m at u = 168, 13.5 at 172, 20.4 at 180, 31 at 192), so a headwall at 172 stood 2 m above the track with the hill already through its opening (first attempt, an 8 m box: the hill covered the dark bore completely and the opening read as ground); at 169.5 the headwall stands at the toe of the hill, the ground at the dark end wall is about 0.4 m above the rail and the hill covers the rest. Every wall stands on the datum: on the flat map it is a free-standing portal at the end of the viaduct, in Full 3D world the hill buries its lower part. The north viaduct that used to run 200 m on past the portal (buried in the hill in Full 3D world) is gone, so near drops 21 680 to 16 556 triangles (far 3 880 to 3 208) with one added material (`tunnel`, dark lining, light and dark palettes), 11 draws near / 6 far. Tests: each track ray meets the dark bore, not the headwall; headwall front, lintel and jambs by raycast; wings step down and stand on the datum; north wire droppers reach the roof; a ray past the wings meets nothing. `qa-metrics`: ok, no coplanar pairs, no back-face hits, no unsupported member ends; depth layers: 0 cycle edges dropped. Evidence: tmp/next-200/fix/g1a3/tawatina-bridge (Cityscape and Full 3D world: far, near, street, north portal close and side).
