# Pennzoil Place

Philip Johnson and John Burgee, completed 1975 (also dated 1976). Two 36-storey trapezoidal towers of dark bronze glass at 711 Louisiana Street and 700 Milam Street, Houston, separated by a ten-foot slot and joined at the street by glass atrium pyramids. A driver reads it as two dark wedges with a bright slit, not as a box.

## Sources

| Quantity | Value | Status |
| --- | --- | --- |
| Roof / street ridge | 523 ft (159.41 m) | Wikipedia infobox, via the dossier `facts.txt` |
| Tower height in prose | 495 ft (151 m) | Wikipedia body; OSM `height` 121 + `roof:height` 30 |
| Storeys | 36 | Wikipedia, building history page, OSM `building:levels` |
| Slot | 10 ft (3.048 m) | Building history page; Downtown Houston |
| Atrium | 115 ft (35.05 m) glass pyramid | Building history page; Wikipedia |
| Crown slope | 45° | Building history page ("reflective symmetry and a 45-degree geometry") |
| Plan | Two mapped trapezoids plus the atrium and the block outline | OSM ways 260511513, 260511516, 260511512, 580965929 |
| Mullion spacing | 2.5 ft real, modelled as a 5 ft bay | Estimated from the street photographs |
| Floor pitch | 159.41 / 36 = 4.43 m | Derived |
| Louisiana eave | 121.1 m | Derived: ridge minus the perpendicular depth at 45°. Matches OSM `height=121` |
| Milam eave | 123.7 m | Derived. The mapped plate is shallower than Louisiana's |
| Street canopy | 0.6 m projection at 4.15 m | Estimated, kept inside the 0.8 m footprint slack |
| Entry wall | 5.9 m, under the pyramid eave | Estimated |

The 523 ft ridge is the street edge. Each roof is a true 45° plane down to the slot, so the slope is the whole crown, not an 8 m cap. Wikipedia's 495 ft and the OSM 151 m sum are recorded and not used as a second peak.

## Model

Metres east, up and south about the outline centroid (−95.3656194, 29.7601240). The mapped slot edges are parallel, about 2.2 m apart, and overlap only about 2 m. Each edge is moved toward its own centroid until the perpendicular gap is 3.05 m. The famous slit is that short throat seen end-on; the towers are not a 40 m corridor.

Walls, crowns and the two atrium pyramids are one tiled shell per material (glass, mullion, light, lobby, atrium, frame). Panes and mullions share a plane and do not overlap, so they do not z-fight. Each crown has a same-material soffit 0.45 m below it. The atrium soffit is 0.62 m below the glass. Far keeps the same shell: 4.6 m bays and two-floor bands. Lit panes are scattered office lights; `light` is unshaded. Night glass is a darker bronze.

## What changed after looking

The first near/light sheet (`tmp/landmarks/shots/pennzoil-place/pennzoil-place-procedural-near-light-sheet.jpg`, compared with `tmp/top-cities/pennzoil-place/refs/1.jpg`, `refs/2.jpg`, `refs/3.jpg` and `refs/7.jpg`) had the right wedges, slit and atrium pyramid, but the lit panes marched on diagonals and the atrium glass blew out to a white tent. Lights are now a hash scatter, and day atrium glass is `#8ea3ad` so the white grid reads. The second sheet is the one judged: overview (both 45° crowns and the slit), Louisiana and Milam facades (flat dark curtain walls), roof (two trapezoids, diagonal slot, inside the red rings), slot, and the south pyramid.

## Cost

Near 44,651 triangles / 6 draws / 2,420,188 bytes (2,363 KiB). Far 7,853 / 6 / 432,452 bytes (422 KiB). Budgets are 60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB. The near file is the tight one (about 80 KB of headroom) because the 5 ft bay is what keeps the slot from looking like a blank slab.

## Verification

`pennzoil-place.test.js` raycasts the 45° crowns, the street curtain, the atrium glass and the ridge ends against the slot walls, and rejects a ridge end shortened into the slot. Vertices stay inside the outline plus the canopy. Cityscape and Full 3D world are not tested yet, integration is checked separately.

## Left out

Interior structure, the tunnel connection, lettering, and the real 2.5 ft mullion (paired to 5 ft). The Milam eave is 2.6 m higher than Louisiana's because the mapped depths differ.
