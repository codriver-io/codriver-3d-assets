# Cathédrale Marie-Reine-du-Monde (Montréal)

Stable asset ID: `marie-reine-du-monde`. Original procedural exterior of the Cathédrale Marie-Reine-du-Monde, 1085 rue de la Cathédrale, seat of the Roman Catholic Archdiocese of Montréal: Victor Bourgeau's one-third-scale replica of St Peter's Basilica in Rome (built 1875 to 1894), a Latin-cross church of grey ashlar and fieldstone under green-patinated copper, with its pedimented portico on boulevard René-Lévesque, the ribbed copper dome on a drum with its lantern and cross, and two small domes. Not the interior, the Monument à Mgr Bourget on the stair, the archbishop's palace behind it, nor the towers around it (Place Ville Marie, Le Reine Elizabeth, 1000 de la Gauchetière), which stay provider or their own landmarks. Part of the [Québec landmarks](../quebec-landmarks.md).

Build: `pnpm build:quebec-landmarks marie-reine-du-monde`. Source: `src/peregrine/landmarks/quebec/marie-reine-du-monde/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, plus `marie-reine-du-monde-plan.js`, `-body.js`, `-facade.js`, `-dome.js`, `-kit.js` and `marie-reine-du-monde.test.js`). Catalog record: `prototypes/assets3d/catalog.d/marie-reine-du-monde.json`.

## Identity and sources

The modelled state is today's building: the dome and roofs recovered in green copper, the façade of 1894 with its thirteen copper statues of the patron saints of Montréal parishes, no scaffolding or banners. What a driver sees, and where the budget goes:

* the **dome** from far away: a ribbed copper dome with two rows of oculi on a sixteen-bay drum of coupled columns and arched windows, the small colonnaded lantern with its copper spire, ball and cross, 77 m above the pavement;
* the **façade** from boulevard René-Lévesque: ten giant Corinthian columns (coupled in the middle) under a low pediment, a copper-lined cornice, an attic with rectangular windows and the thirteen statues along its cornice, arched doors and windows behind the columns, a broad stair, end piers with arched portals;
* the long **nave and transept** in the rotated grid: two window tiers between pilasters, the copper roofs (nave gable, aisle lean-tos, transept hips with three-sided ends, corner hips), the two small domes over the front corner blocks, the fieldstone rear.

Sources:

* Wikipedia, [Mary, Queen of the World Cathedral](https://en.wikipedia.org/wiki/Mary,_Queen_of_the_World_Cathedral): 101 m long, 46 m wide, 77 m high at the cupola, whose diameter is 23 m (infobox 101.5 m, 45.72 m, 76.8 m); minor basilica, National Historic Site of Canada (2000); Renaissance and Baroque style, completed 1894.
* Wikipédia, [Cathédrale Marie-Reine-du-Monde de Montréal](https://fr.wikipedia.org/wiki/Cath%C3%A9drale_Marie-Reine-du-Monde_de_Montr%C3%A9al): a reduced copy of St Peter's in Rome; the front is adorned by the statues of the patron saints of thirteen Montréal parishes (St Peter's has the twelve apostles).
* [Official site](https://www.cathedralemontreal.org/) of the basilica-cathedral.
* OpenStreetMap, [way 21335240](https://www.openstreetmap.org/way/21335240) (`building=cathedral`, 80 vertices, 5,600 m2) and its `building:part` ways (fetched 2026-10-04): roof halves 25 to 31 m, the 33 m drum ring (way 113858562), the dome part (way 1144585446, 63 m, radius 12.3 m), the lantern part (way 1144585445, 62 to 77 m), two small domes (ways 1144585447/8, 38 m), the façade block (way 1144585460, 27 m), the porch pediment (way 1144585459, 21 to 25 m), corner blocks 25 m, low blocks 15 m, the rear block 10 m.
* Photographs viewed only to compare proportions (Wikimedia Commons, not shipped, authors and licences in the catalog record): the façade from boulevard René-Lévesque (Thomas Ledl), the frontal façade (Joanne Lévesque), the exterior with the dome and lantern (Concierge.2C), the interior dome (Jeangagnon, Elena Tatiana Chis).

## Frame, origin, orientation

* Origin `[-73.568406, 45.499274]` is the area centroid of the mapped outline (OSM way 21335240). The dome axis is 9.65 m east and 7.04 m south of it (`SPEC.axisM`); the farthest mapped corner is 64.4 m from the origin, so `padM = 70` covers the outline.
* Montréal's grid is not cardinal. The mapped walls run at bearing **33.5 degrees** (boulevard René-Lévesque, the façade line) and **123.5 degrees** (the nave): the length-weighted mean of the outline's edge bearings is 33.5 (mod 90), confirmed by the nave axis being the outline's symmetry axis (the transept ends sit at x = +34.4 and -34.5 m about it). The façade looks toward bearing **303.5** (west-north-west).
* The model is authored in building axes (x across the church, to the right of someone facing the façade; z along the nave toward the façade; origin on the dome axis) and rotated once, by `SPEC.rotationDeg = -123.5`, then moved to the dome axis, inside the kit. No layer rotation.
* `y = 0` is the pavement of boulevard René-Lévesque at the foot of the stair; the site is flat (downtown Montréal on the Dorchester Square terrace). No terrain, sea level or latitude stretch is baked in.

## Dimensions

| Quantity | Model | Source |
| --- | --- | --- |
| Total height to the top of the cross | 77.0 m | sourced (Wikipedia 77 m / 76.8 m; OSM lantern part to 77 m); also the declared `SPEC.height` |
| Outline | 119.3 m from the middle stair to the rear wall, 68.9 m across the transept, 5,600 m2 | mapped (OSM way 21335240); Wikipedia's 101 m by 46 m excludes the stair, the rear block and the transept ends |
| Dome base radius, springing | 12.4 m, 47.0 m | radius mapped (OSM 12.3 m; Wikipedia gives 23 m for the cupola); springing from OSM (dome part 47 to 63 m) |
| Dome crown (lantern ring), profile | 61.2 m, ellipse 12.4 m by 14.7 m, 16 ribs, 2 x 16 oculi | estimated: the frontal photograph puts the lantern base at 61 m, OSM at 62 to 63 m |
| Lantern, spire, ball, cross | columns 61.2 to 63.6 m, cornice 64.3 m, band 65.8 m, spire 70.6 m, ball 71.3 m, cross 71.9 to 77.0 m (5.1 m tall, 3 m across) | estimated from the frontal photograph, tip sourced |
| Drum ring, drum, entablature | ring r 14.4 m to 33.0 m (OSM 33 m), cornice 33.7 m, 16-sided drum r 12.7 m to 44.4 m with 16 coupled-column bays and windows, entablature to 47.0 m | ring mapped, drum estimated |
| Façade block | 55 m wide (x +-27.5), 10.4 m deep, cornice 27.0 m under the statues | mapped (OSM way 1144585460: 27 m, 55 m by 10.4 m) |
| Portico order | ten columns, shaft radius 0.82 m, 12 sides; axes at x = +-2.9, +-6.6, +-8.5, +-13.0, +-18.6 m, z = 63.2 m; floor 1.8 m, abacus top 18.4 m; entablature to 20.5 m, copper-lined cornice to 21.1 m | estimated from the frontal photograph (positions measured at 16 px per metre) |
| Pediment | 15.8 m wide, base 21.1 m, apex 25.1 m | OSM porch part: 15.4 m wide, 21 to 25 m |
| Stair | five risers of 0.36 m (1.8 m); middle flight 15.8 m wide reaching the mapped 2.3 m bump (z = 68.9 m), side flights to z = 66.6 m | mapped plan, risers estimated |
| Attic | 21.1 to 26.2 m, cornice slab to 27.0 m, six rectangular windows, pilaster strips above the columns | estimated |
| Statues | thirteen on the cornice at x = 0, +-2.6, +-5.9, +-7.8, +-11.8, +-17.2, +-23.0 m, about 3.8 m tall with a 0.9 m plinth (a tapered robe 2.4 m high and a head, top at 30.8 m) | count sourced (Wikipédia), positions from the frontal photograph, size estimated |
| Nave | aisle walls at x = +-19.1 m (z 37.8 to 56.3) and +-22.9 m (z 24.2 to 37.8), walls 25.0 m, gable ridge 31.0 m (eaves 26.5 m), aisle lean-tos 25.0 to 26.5 m | walls and ridge mapped (OSM 25 m and 31 m roof halves), pitch estimated |
| Crossing | corner blocks 25 m with copper hips to 27.4 m; transept arms to x = +-34.4 m with three-sided ends, ridge 31 m along x; choir arm to z = -34 m with a hipped end; the left rear corner notched as mapped | mapped plan, OSM part heights, roof forms estimated |
| Small domes | octagonal drums r 4.9 m, 25 to 32.4 m, domes to 37.3 m, lanterns and crosses to 42.5 m, at (+-17.8 m, 18.1 m) | positions and 38 m mapped (OSM dome parts), details estimated |
| Rear block, low blocks, annex | 10 m walls (a 10.4 m straight run then a half-round apse of 8 facets, radius 15.6 m, under a gable and half-cone copper roof rising to 14.2 m), 15 m, 12 m | rear and low blocks mapped (OSM 10 m, 15 m), annex height and the apse form estimated (no OSM height) |

## Materials

Six names, in both palettes: `stone` (pale grey ashlar limestone, `#b9b2a1`; also the cross, lantern columns, pilasters, statue plinths, plinth and cornice bands), `rubble` (darker grey fieldstone for the crossing, the transept ends and the rear block, `#8f8d84`), `copper` (the green-patinated dome, roofs and spires, `#5d8376` by day: the first pass `#669a88` read bright mint against the duller, darker verdigris of the photographs, so value and saturation are about 15 % lower; the night `#6aa196` is the floodlit lift and is unchanged), `bronze` (the statues and the darker copper-lined cornices, `#4a7a68`), `glass` (doors, oculi and portal openings, `#363f46`) and `glow` (windows: dark glass by day, `#4b5a64`, warm lit at night, `#e3bd78`, drawn unshaded). The cathedral is floodlit at night, so the night stone is only dimmed (`#85878d`) and the copper lifted (`#6aa196`); the lit windows carry the night read at 800 m. Far uses the same six names (6 draws).

## Modelling decisions

* **The dome is the far-LOD hero**: a lathe (32 segments near, 16 far) on a sixteen-bay drum, sixteen triangular-section ribs, two rows of sixteen oculi (near), an open-columned lantern around a lit core, a copper spire, a ball and a cross. The far model keeps the same silhouette, ribs (8) and lantern.
* **The plan is the mapped outline**: the nave and crossing are polygon extrusions of the OSM outline, split by material (ashlar nave, fieldstone crossing), with the façade block, stair bump, transept ends, rear block, low blocks and annex at their mapped positions. The façade block's corner chamfers, the notches of the left rear corner and the stair ends follow the outline, so the walls and stair stay within 0.9 m of it everywhere and its interior is covered (`marie-reine-du-monde.test.js`).
* **Facades are rhythms**: free columns (12 sides near, 6 far) in front of a wall with three doors and a window row, a continuous entablature with a copper-lined cornice that wraps the block's end walls, pilasters with capitals and arched windows with hoods on the long walls (near), plain pilasters omitted and windows kept as small quads in far. Pieces are stacked or offset so no two exterior walls share a plane; windows are single quads offset 0.15 m from their walls (large surfaces).
* **Roofs are solids with explicit triangles** (flat-shaded): nave gable on its aisle lean-tos, transept gables with a three-faced hip over the polygonal end, the hipped choir arm, truncated hips over the corner blocks, and over the rear block a gable along the straight run that continues as a half-cone over the apse (same slope, same ridge height), all sitting flush on the wall tops so no underside shows.
* **Statues are cheap silhouettes** in one material: a stone plinth, one tapered six-sided robe and an icosahedron head (near, about 48 triangles each; the first pass had a lathe plus a raised-arm bar that read as forked "bunny-ear" fins and cost about 94), a four-sided taper (far).
* **The rear is an apse, not a box.** The mapped 10 m rear rectangle (31.2 m wide, back wall at z = -50.4 m) is built as a straight run of 10.4 m and a half-round apse of 8 facets inscribed in it, each facet with one arched window; the apse is inside the mapped outline, so only its corner areas are left uncovered (the coverage test still passes).
* **No lettering** (the frieze inscription), no balustrades or sculpture; the Monument à Mgr Bourget on the stair is not modelled.
* Zero-area triangles (lathe poles, collinear cap vertices) are pruned in the kit so no NaN normals reach the GLB.

## Terrain (Full 3D world)

Flat site: downtown Montréal on the Dorchester Square terrace, no cliff or river bank. No `terrainPad` is declared; `padM = 70` is a plain disc around the origin that covers the outline. The model is rigid on local `y = 0`. The lead verifies Full 3D world in the running app; the rigid model is expected to sit on the drawn ground without a pad.

## Approximations

* Heights between sourced anchors (77 m tip, OSM part heights) are estimated from perspective photographs and are good to about 2 m. The OSM façade block (27 m) is taken as is; the frontal photograph suggests the cornice may be 1 to 2 m lower, and the nave eaves (25 m) are the OSM value.
* The nave's side walls are modelled at 25 m with window tiers read from the photographs; the OSM aisle parts (15 m and 21 m) are the roofs and low chapels, which are not distinguished here. The aisle roofs are a shallow lean-to between the wall tops and the nave gable.
* The rear block is a half-round apse inscribed in the mapped 31.2 m x 26 m rectangle (a flat-topped box before the QA pass), under a half-cone roof; the real chevet's curve, buttresses and roof slope are estimated. Roofs of the corner blocks, the choir and the transept ends are simplified hips.
* Sculpture and relief are abstracted: Corinthian capitals are a flared bell with an abacus, the cross is a plain bar cross, the frieze lettering, aedicules, balustrades, lamp posts and the Monument à Mgr Bourget are absent; the portico ceiling is flat.
* Pilasters, cornices and window hoods project up to about 0.9 m beyond the mapped wall line (the façade cornice slab and the pilaster capitals on the rear block are the worst).
* The model is a visual approximation, not a survey. Cityscape and Full 3D world in the running app: not tested yet, integration is checked separately.

## Cost (exported default scenes)

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| Near | 8,640 | 6 | 395,528 |
| Far | 3,440 | 6 | 158,768 |

Budgets are 60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB (aim 15 to 40 k near and 2 to 8 k far; the near model is under the near aim because the repeated order, statues and windows are small merged parts). Far is about 37% of near by triangles. `qa-metrics.mjs`: no coplanar overlaps of different materials, no back-face hits in its sweep; a denser own sweep (12,000 outside-in rays from the upper hemisphere) found 1 back-face hit in 5,692 (0.02%) on a dome rib flank. Triangle counts describe the export, not Tesla performance.

## Verification evidence

Reference photographs (Wikimedia Commons; downloaded to ignored `tmp/quebec/marie-reine-du-monde/refs/` only to compare, none shipped): the façade and nave side from boulevard René-Lévesque, the frontal façade, the exterior with dome and lantern, two interior dome views.

Renders read with `.agents/skills/build-3d-city/scripts/shot.mjs` (under `tmp/quebec/shots/marie-reine-du-monde/`, procedural source and exported GLB): contact sheets of overview, facade, roof, dome, portico, side, rear, corner; photo-matched street views (`photo1` against the side-oblique photograph, `photo2` and `street` against the frontal one); lantern, under (portico ceiling), oblique, transept, eave, left, distant; the top plan with the red OSM ring; near and far, light and dark.

Changes made because of what the renders and photographs showed:

* The first palette read as pale mint and chalk; stone went to a greyer beige and copper to a deeper green. The ground-floor niches between the columns were big black arches that the photograph does not have: only the three central doors and the end portals stay dark, the rest are small lit windows.
* A row of statues along the nave cornice (first modelled from the oblique photograph) is not there: the row in that photograph is the façade's, seen at an angle, and Wikipédia gives thirteen statues on the front; the side statues were removed.
* The façade photograph showed the dark copper-lined cornice running around the end walls and the capitals under it: the cornice now wraps the block, the end piers gained engaged pilasters and capitals, and the long walls gained pilaster capitals and window hoods.
* The first top plan and a vertex check against the outline showed the façade corners, the stair ends, the front hip roofs and the left rear corner overshooting the mapped outline by up to 2 m: the façade pieces now follow its 45-degree corner cuts, the stair flights stop at the cut, the hips follow the mapped steps and the left rear notch is in the plan.
* `qa-metrics` and a mesh check found zero-area triangles at the statue tops and a cap sliver in the stair (NaN normals warnings in the exporter); they are pruned. Portico and cornice undersides now have bottom faces (they were open from below), and the rear hip roof sits flush on its walls.
* QA pass (independent review): the rear 10 m block read as a flat-topped beige box on the green roofs, so it became a half-round apse under a half-cone copper roof; the thirteen statues read as forked fins and are now one tapered robe and a head each (fewer triangles); the copper lost about 15 % value and saturation (`#669a88` to `#5d8376`). The 0.9 m cornice overshoot at the facade corners was accepted (real cornices project).
