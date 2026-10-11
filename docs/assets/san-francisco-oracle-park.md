# Oracle Park (San Francisco)

Original procedural model of Oracle Park, 24 Willie Mays Plaza, home of the San Francisco Giants (HOK Sport, opened 31 March 2000; Pacific Bell Park, SBC Park and AT&T Park until 2019). Part of the [San Francisco landmarks](../san-francisco-landmarks.md); contract, frame and budgets are there.

- Source: `src/peregrine/landmarks/san-francisco/oracle-park/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, the helper modules `oracle-park-{plan,site,mesh,stands,facade,towers,toys,field}.js` and `oracle-park.test.js`).
- Build: `pnpm build:san-francisco-landmarks oracle-park` → `public/models/buildings/oracle-park-{near,far}.glb` and `oracle-park.json`. Catalog record: `prototypes/assets3d/catalog.d/oracle-park.json`.
- State drawn: the ballpark as a driver sees it today: open-air, no roof, the 2020 right-center bullpen changes not distinguished. The Willie Mays Plaza entrance, King Street facade, McCovey Cove arcade, light frames, scoreboard, Coca-Cola bottle and glove are all present in both LODs.

## Sources and what is mapped, published or estimated

| Item | Value | Basis |
| --- | --- | --- |
| Plan of the stadium building | 42-vertex ring, about 296 x 268 m | **Mapped**: OSM way 24352572, outer ring of the `building=stadium` multipolygon relation 7330762 (retrieved 2026-10-01, ODbL). Orientation comes from this outline: the King Street facade runs 44.6 degrees east of north (edge between ring vertices 5 and 6) |
| Playing field outline | mapped field opening and baseball grass | **Mapped**: OSM way 98224507 (inner ring), way 500283910 (grass) |
| Field axis | home plate to centre field 86 degrees clockwise from north | **Derived from the mapped grass**: its east edge sits 121 m from the mapped home area (published centre field 399 ft = 121.6 m); the left-field line is nearly parallel to King Street |
| Foul poles / right-field wall | 309 ft right line, 24 ft (7.3 m) wall, 421 ft (now 415 ft) right-centre | **Published** (Wikipedia Oracle Park): the 7.3 m wall height is built; the field outline fixes the distances |
| Light frames and scoreboard frame | 70 m (three long frames), 65 m (scoreboard frame), 62 and 65 m (corner quads) | **Mapped** `building:part` heights (OSM ways 499568646-49, 499568643-44). The two corner quads (62/65 m) are read as the brick towers, not as light towers (see below) |
| Grandstand rim band | 17 m wide band, tagged 60 m | **Mapped outline** (OSM way 499568642); the 60 m tag is read as the canopy and light-frame zone and drawn at about 35 m: see approximations |
| Coca-Cola bottle | 80 ft (24 m) long, with slides | **Published** (Wikipedia). Footprint and long axis from OSM way 499568652 (the tagged height 60 is not credible and is not used) |
| Giant glove | 1927-style four-fingered glove, steel and fibreglass, beside the bottle | **Published** (Wikipedia); position estimated from photographs (OSM maps no outline) |
| Facade heights | 21 m King Street, 25 m entrance pavilions, 22 m south-west wing, 14 m cove arcade, 12.5 m bleacher rear wall | **Estimated** from photographs and from the mapped 25/30 m facade parts |
| Tier profile | lower deck, club band behind glass, upper deck, canopy, stepped terraces | **Estimated** from photographs; deck depth follows the mapped plan |
| Clock tower | brick shaft 31 m, green hip roof to 40.5 m, four clock faces | **Estimated** from photographs; position from the mapped corner quad (OSM way 499568644) |

## Frame

Local metres about `origin` = (-122.3895, 37.77855), the middle of the mapped ring's bounding box; +x east, +y up, +z south. `y = 0` is street level; the field is drawn at y = 0.1 on the same datum (its real few-metre drop below the concourse is not modelled). The mapped plan is already in this frame, so nothing is rotated: the 86 degree field axis and the 44.6 degree street grid are baked into the plan data (`oracle-park-plan.js`, generated from OSM). Nothing of terrain, sea level or latitude stretch is in the mesh.

## What is built

- **Seating bowl** (stepped terraces, no seats): lofted between the mapped field edge and the facade ring. Three tiers around home plate and down both lines: lower deck (about 8 stepped rows rising to 10.5 m), a club band (concrete, dark glass, concrete) under a flat roof, an upper deck rising to about 32 m, and a green canopy over its back rows. Left-field and centre-field bleachers (one tier, 11.4 m deck behind), the right-field arcade (7.3 m brick wall with arched openings, four rows of seats, 10.6 m concourse). The notch in the mapped centre-field fence is a 9 m batter's-eye wall.
- **Outer wall**: every edge of the mapped ring is a wall of its own height and material: red brick with a stone plinth and cornice, tall window bays between pilasters (King Street, the north corner, Willie Mays Plaza); cream stone for the south-west wing and the 124 m right-field arcade on McCovey Cove (21 arched openings); brick with windows on the 2nd Street side. The east end (Seals Plaza, the ferry pier) is plaza, not building, and has no wall or roof.
- **Willie Mays Plaza**: the brick clock tower with a stone cornice, a green copper hip roof, four clock faces and a flagpole; ORACLE PARK in orange block letters on the entrance pavilion roof (one box per stroke, facing the plaza).
- **Six lattice frames**: two along King Street and one on the first-base side (OSM 70 m part): two lattice masts each (four tapering legs, a diagonal on every face of every bay), chords and a lamp bank of three rows; the centre-field scoreboard between two 65 m masts with lamp banks, a lit board, a clock and flagpoles; six flagpoles with pennants on the east plaza; four-sided brick tower on the north corner (2nd & King).
- **The two toys**, in near and far: the bottle (a lofted body with a wider red label band, tilted 30 degrees with its neck toward centre field, on three supports) and the glove (a rounded heel and palm, four fanned tapered fingers with rounded tips, a thumb, a support post).
- **Field**: clay warning track on the mapped opening, mapped grass, an infield skin and lawn built to the standard diamond (90 ft bases, mound 60.5 ft, 95 ft skin radius), mound, bases, plate and foul lines in chalk.
- **Roof**: dark roof material with twelve rooftop plant boxes on the two big flat roofs (west block, south-west wing) so they read as roofs from above.

### Materials (12 near, 8 far)

`brick`, `stone`, `concrete`, `roof`, `seat`, `steel`, `glass`, `copper`, `grass`, `clay`, `light`, `glow`, `sign`; far merges `stone`/`roof` into `concrete`, `glass` and `glow` into `steel` (the far scoreboard is a dark board, not lit), `copper` into `seat`. The dark palette dims brick, stone, grass and seats and lights `light` (lamp banks, clock faces), `glow` (scoreboard) and `sign` (the ORACLE PARK letters, the bottle's label, pennants).

## Approximations and open points (honest list)

- Everything not in the "mapped" or "published" rows above is an estimate: facade and tower heights, the tier profile and deck depths, the window and arch rhythm, the exact glove and bottle shapes, the roof plant boxes.
- OSM tags a 60 m height on the rim band and 62-70 m on frames; the 60 m band is drawn at about 35 m (canopy top) because photographs show the canopy well below the frames. If a reviewer has a published rim height, change `profileGrandstand` in `oracle-park-stands.js`.
- The two corner quads (OSM 62 and 65 m) are drawn as the brick north-corner tower (34 m) and the clock tower (31 m shaft, 40.5 m with the roof). Their mapped heights look like the light frames behind them, not the towers; the tower heights are therefore estimates.
- The first-base side and the west block carry large flat roofs beyond the stands; their extent is the mapped ring, the interior (concourses, suites, the 3rd Street gate) is not modelled.
- The left-field foul pole region, the foghorn, foul poles, statues, the Giants "Wall of Fame" and the water-side pier are not modelled.
- Seat rows are terraces; there are no seats, aisles or railings.
- Walls and tiers are single-sided surfaces: the stands are hollow shells and cannot be inspected from inside (below the terraces) without seeing through them. The closure tests check the outside only.
- The upper deck tapers away toward the first-base end (below 28 m of stand depth) and the grandstand's canopy slab exists only where the stand is deep enough; the glove is a stylised hand-shaped mitt.
- Cityscape and Full 3D world: **not tested yet; integration is checked separately.** The model is a rigid structure on local `y = 0`; `padM` 150 covers the mapped ring and its entrances.

## Costs

| | triangles | draws | bytes |
| --- | --- | --- | --- |
| near | 10 789 | 13 | 671 128 B (655 KiB) |
| far | 2 224 | 8 | 169 868 B (166 KiB) |

Budgets for a building: near 60 000 / 14 / 2.5 MB, far 12 000 / 8 / 0.5 MB.

## Verification

Rendered with `node tmp/san-francisco/shot.mjs oracle-park` (procedural source) and `--source glb` (the exported files), near and far, light and dark, with the red mapped ring drawn under the model (`tmp/san-francisco/shots/oracle-park/`, not committed):

- plan view (`...-roof.png`): the bowl sits inside the red ring, home plate at the west, left-field line parallel to King Street, scoreboard east, bottle and glove beyond the left-field bleachers; compared with the aerial photograph (Commons "Aerial photograph of AT&T Park").
- overview from McCovey Cove, King Street facade, Willie Mays Plaza (clock tower and ORACLE PARK sign, compared with Commons "AT&T Park northern side 1" and "Sign with clock (TK1)"), cove arcade, behind-home-plate, bottle and glove (compared with "Coca Cola and Glove at Oracle Park"), scoreboard, north corner, 2nd Street, west zigzag, east, first-base side, a 800 m far view.
- What the screenshots changed: a twisted "fin" through the first-base side (rays converging at an inner vertex: the vertex was removed), stands spilling into the notch of the centre-field fence (the notch became a batter's-eye block), lamp-frame masts crossing the facade (frames shifted 1.6 m inward), coplanar roof heights between strips and stands (offset 15-30 cm), the letter R reading as A, an open east end enclosed by a wall (walls removed on the plaza), a blank north tower (windows added), pilasters floating when seen from inside (inner wall faces added), a featureless far facade (window bands and arches added), a grey flat roof (roof material and plant boxes).
- Review fix round (independent review: FIX): (1) the north end near 2nd & King was see-through: the grandstand profile gave stations different segment lists (variable terrace step counts and conditional wall segments), so the loft joined mismatched segments and left a floating canopy over missing wall slabs. Every station now gets the same fixed segment list, and a ray-sweep closure test covers it. (2) The stray green wedge above the south-west wing and the cove roofline was the upper deck running on over the shallow first-base end: the upper deck now tapers to nothing where the stand is shallower than 28 m. (3) The far facade read black at 800 m: window bands are now a few short groups per row, 3 m tall, so the brick shows. (4) The sign's "O" has cut corners and reads as an O, not a D; the glove is lofted capsules and an ellipsoid, not boxes. Re-rendered `street2m`, `aerialNE`, `wedge*` and the 800 m far views from the exported GLBs.
- Re-review polish: the stray brick-red triangle on the north tower's shoulder and the red sliver at the end of the 2nd Street wall were the thin inner face of a taller wall seen past a lower neighbour (or past a free end). Inner wall faces now exist only beside the open east plaza (arcade end, 2nd Street wall), and each free wall end gets a return wall under its roof strip.
- Tests: `node --test src/peregrine/landmarks/san-francisco/oracle-park/oracle-park.test.js` (12 tests: heights 70/65 m, field axis 86 degrees and 121 m to centre field, 7.3 m right-field wall with open arches and 21 cove arches, clock tower 40.5 m, bottle and glove sizes, stepped terraces and canopy, footprint containment within 1.2 m, far silhouette, and two closure sweeps: 360 horizontal rays at street, 5, 10 and 17 m must meet the wall where the mapped ring is, rays above the facade must meet the stand's back wall or canopy in the tall north-west to north sector and the south-west sector, and 45-degree rays aimed at the north-end walls must meet them first).
