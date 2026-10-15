# San Fernando Cathedral, San Antonio

Original procedural model of San Fernando Cathedral at 115 West Main Plaza: the 1868 Gothic Revival east front by François P. Giraud facing Main Plaza (twin belfry towers, a pinnacled central gable with a rose window, three pointed portals), the gabled nave with side aisles, and the low sanctuary dome at the west end (towards Military Plaza and City Hall), the surviving part of the 1738-55 church. No plaza, Cathedral Centre, gift shop or neighbouring building is owned.

[Wikipedia](https://en.wikipedia.org/wiki/Cathedral_of_San_Fernando_(San_Antonio)) dates the cornerstone to 1738, the dedication to 1755, and the 1868 rebuild in which "part of the nave and the bell tower were razed" and the church was rebuilt "with a gable roof and twin bell towers and buttresses", three entrances to a Gothic Revival nave, keeping only the sanctuary; consecrated 1873. [SAH Archipedia](https://sah-archipedia.org/node/48543) describes the apse and low dome at the core as remnants of the original parish church.

## Frame and dimensions

Metres, east/up/south about `[-98.49432, 29.42456]` (the mapped outline's centroid); y = 0 is rigid local plaza grade. The mapped outline of way 80647022 runs 4.5° off east-west (its two long walls measure 4.4° and 4.5°); the geometry is authored in a nave frame (a west along the nave from the front, s north across it) and rotated **once** by 184.5° into the GLB. The front faces Main Plaza to the east, outward bearing 94.5°; the host must not rotate again. The orientation is the mapped plan's: the outline's east end is the clean 22.5 m square-ended front, its west end the stepped block of the old sanctuary, and City Hall (way 78601538) on Military Plaza is behind it. A [UNT Libraries / San Antonio Conservation Society photograph](https://texashistory.unt.edu/ark:/67531/metapth459982/) confirms the towers on the east front.

| Feature | Metres | Basis |
| --- | --- | --- |
| Plan, front to west end / front width | 50.8 / 22.3 (22.5 mapped, buttresses inside) | OSM way 80647022 |
| North aisle length / sanctuary block (a 41.3-50.8) | 32.4 / 9.5 × 23.75 | OSM way 80647022 (north indent, stepped south-west corner) |
| Tower base / belfry width | 6.55 / 5.25 | photo estimate, scaled from the portal doors, fitted to the mapped front width |
| Tower belfry floor / cornice / roof peak / cross top | 14.4 / 22.7 / 24.0 / 25.7 | photo estimate (front photograph, ~32 px per metre from door and passer-by height) |
| Central gable apex / pier pinnacles | 16.8 / 18.4 | photo estimate |
| Nave eaves / ridge | 11.8 / 16.2 | estimate (roof not visible in the front photographs) |
| Aisle wall / aisle roof top | 7.0 / 9.6 | estimate |
| Side portals / great portal (w × h) | 1.7 × 3.7 / 2.2 × 4.4 | photo estimate |
| Rose window diameter | 2.9 | photo estimate |
| Sanctuary block / drum / dome crown / cross top | 10.0 / 13.35 / 16.05 / 20.3 | estimate; least certain part |
| Dome / drum radius, centre | 5.0 / 4.9, 45.8 m behind the front on the axis | estimate placed over the mapped west block |

No surveyed height was found; every vertical dimension is a photo-scale estimate.

## Modelling

Original texture-free Three.js geometry, eight materials (`stone`, `trim`, `roof`, `dark` glazing and louvres, `wood`, `iron`, `dome`, `joint`). The east front is real relief: tower slabs and the central bay are extruded with the portals, lancets and oculus cut through and recessed doors and glazing behind; the rose window is a hole glazed 0.8 m deep with a ring and four spokes in front of the glass; stepped corner buttresses carry small pyramid caps; the piers rise to pinnacles. Each belfry has twin louvred arches on front and back and one on each flank, a bracketed cornice, a dark deep-eaved slab and a low hip with a cross standing on its peak. Near adds ashlar course lines (skipped across every opening and moulding), hood mouldings and sanctuary pilasters. Far keeps every opening as a gable-headed quad and drops the mouldings, spokes, joint lines and drum windows.

The first build put the front on the outline's west end (whose stepped corner it read as a tower notch), facing away from Main Plaza with the south-west tower ~9 m outside the ring. The 2026-10-14 review fix turned the frame 180° onto the mapped plan: front on the clean east edge (towers 11.15 m either side of the axis so the buttresses stay on the mapped front), both aisles to the long walls, the north aisle ending at the mapped north indent with a low 6.2 m link filling the indent, the nave narrowed to 8.8 m so it stays on the indent, and the sanctuary block extruded from the mapped west end, stepped south-west corner included, carrying the drum and dome. Every vertex is now within 0.8 m of the ring (the front and flank buttresses and the eaves).

## Verification

Procedural contact sheets: `tmp/top-cities/shots/san-fernando-cathedral/r1` (all seven views), `r2` (facade, detail, street, back after the first fixes, plus `--top` over the red ring). First-pass defects found by looking: the dome was a tall white hemisphere (flattened to 2.7 m, greyed); belfry glazing read black (lightened); the sanctuary block was a blank box (pilasters added); a floating row of north-side windows and buttresses outside the ring (the aisle loop now starts at its own aisle).

Exported GLB sheets: `r3` (near/light and far/dark: overview, facade, street, back, dome, detail) and `r4` (near/light and far/light after the final edits), each compared with the reference photographs (Daniel Schwen's front view, the light-show night view). Front proportions, tower width to height (about 1:4 for the belfry), pinnacle and gable rhythm, three portals and the oculus/rose arrangement match the front photograph; the dome and east end are described, not photographed (see Notes).

| Export | Triangles | Draws | KB |
| --- | --- | --- | --- |
| Near | 12,016 | 8 | 740 |
| Far | 1,705 | 7 | 108 |

`qa-metrics.mjs` reports no issues. `landmark-depth-layers.mjs --ids san-fernando-cathedral` drops **0** cycle edges (a rose-window ring/glazing cycle, two joint/trim overlaps and a buttress/stone overlap were fixed by recessing the glazing, adding skip zones for mouldings and ending the buttresses at the wall plane). The five landmark tests pin tower and cross heights, nave ridge, open sky between the towers, the pier pinnacles, the three recessed portals, the rose glazing depth, the belfry louvres, the dome, cross feet on the hip roofs (with a lifted foot proved to fail), footprint overhang limits, bearing, far/near bounds and the exported round trip.

Orientation fix (2026-10-14): procedural sheet and top view `tmp/top-cities/shots/san-fernando-cathedral/fix1`, exported GLB sheets `fix2` (near light: overview, facade, back, dome, street, roof; far dark: overview, facade, back, dome). The tests now pin the geography straight from the lng/lat ring: both tower crosses 2-6 m behind the mapped east edge, the dome within 8 m of the mapped west edge and 40+ m from the front, a ray walked in from Main Plaza along the 94.5° frontage reaching the great portal door, and every vertex within 0.8 m of the ring (with a 2 m-out probe proving the distance check bites). Depth layers: 0 dropped cycle edges after burying the sanctuary roof slab's foot and keeping its sides 0.5 m inside the cornice (the far LOD first showed a trim/roof cycle).

Cityscape and Full 3D world: app far/near/street shots after the fix in `tmp/next-200/fix/g2a/san-fernando-cathedral/`.

Build: `pnpm build:top-cities-landmarks san-fernando-cathedral --no-check`. Focused tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/san-fernando-cathedral/san-fernando-cathedral.test.js`.

## Notes and approximations

- All heights, the nave pitch, aisle profile, buttress spacing and side windows are estimates; tracery, statues, stained glass, the stations and the three-tier belfry mouldings are omitted or simplified.
- The sanctuary dome, drum and west block follow the descriptions, the mapped plan and the city-centre medallion; no west-end photograph was available. The low link in the north indent is a plain estimate.
- Photographs (Wikimedia Commons: Daniel Schwen, CC BY-SA 4.0; Michael Barera, CC BY-SA 4.0; Musical Bridges Around the World, CC BY-SA 4.0) stay in ignored `tmp/` as references. Geographic data © OpenStreetMap contributors, ODbL 1.0.
