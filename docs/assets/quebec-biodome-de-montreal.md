# Biodôme de Montréal (Montréal, Parc olympique)

Landmark id `biodome-de-montreal`. Original procedural model of the Biodôme at 4777 avenue Pierre-De Coubertin, Parc olympique, Mercier-Hochelaga-Maisonneuve, Montréal. It follows the [Québec landmark contract](../quebec-landmarks.md) and the asset catalog.

## What is modelled, and which version

The building as it stands since 1992: the **former Olympic Velodrome of the 1976 Games** (Roger Taillibert, the architect of the Olympic Stadium next door), converted into the Biodôme museum of five ecosystems. The conversion changed the inside; the roof and the walls under it are Taillibert's. The Olympic Stadium and its inclined tower (a separate landmark, `stade-olympique-*`, OSM way 108505523), the Planétarium Rio Tinto Alcan (way 160672184), the Tour de Montréal office, the access ramps and sunken courts round the shell are not in the footprint and are not modelled.

A driver sees, and the model has:

- the **prestressed concrete shell**, white-grey, kite-shaped in plan (about 160 m across), resting on **four pointed abutments**: the south-west foot (the nose, C), the west and south feet (the shoulders, B and D) and the north-east foot at the back (A). Between the feet it lifts off the ground in **clear arches**: the two concave arches on the stadium side (B-C, C-D) and two long convex edges at the back (D-A, A-B);
- the **glazed walls** set back about 3.6 m under the roof edge, with mullions about every 3.8 m, turning to solid concrete near the feet where the shell comes to the ground;
- the **entrance** on the arch between the west and south-west feet (it faces west-south-west, toward the stadium esplanade): a flat concrete canopy at 5.6 m on two slim posts and a dark sign panel;
- a **spindle** along the long axis (bearing 45.8 degrees, south-west to north-east): two heavy white ribs from the nose to the back foot, the surface between them standing 1.5 m proud, with **sixteen lens-shaped skylights** across it, each with white louvre bars;
- two heavy ribs from the west and south feet toward the crown, **four shorter skylights** on each flank and **eleven lens skylights** along each long back edge, and six fine radial fins on the two arches facing the stadium;
- a 33.5 m **crown** over the middle of the spine.

## Sources

| Fact | Value | Source |
| --- | --- | --- |
| Height | 33.5 m (110 ft) above ground | Parc olympique, [Le toit du Vélodrome](https://www.stadeolympiquemontreal.ca/le-toit-du-velodrome.php) |
| Length | 172 m on average | same page; "172 m prestressed concrete shell balanced on four support points" |
| Ground cover | 16 723 m2 | same page (the OSM way measures 16 496 m2) |
| Supports | four abutments, 144 voussoirs and 63 Y-shaped ribbed elements | same page |
| Plan | OSM way 26699302, 101 vertices, `building=government`, retrieved 2026-10-04, ODbL 1.0 | OpenStreetMap |
| Former use, date | the Olympic Velodrome of 1976, converted into the Biodôme in 1992 | [Wikipédia](https://fr.wikipedia.org/wiki/Biod%C3%B4me_de_Montr%C3%A9al) |
| Entrance faces the stadium | the "BIODÔME" sign under the arch that faces the tower | Commons 'Biodome.jpg', photographed from the stadium tower |

The brief's note that the entrance is "on the Planétarium side" did not match the photographs: the Planétarium lies north, beyond the long back edge, while the sign and the glazed arch face the stadium (west-south-west). The model follows the photographs.

Photographs used to compare (kept in the ignored `tmp/quebec/biodome-de-montreal/refs/`; none is in the repository or the GLB): Commons 'Biodome 1.jpg' (Mover of molehills, CC BY-SA 4.0), 'Montreal Biodome - Gulf of St. Lawrence - above shot.jpg' (Wackistan, CC BY-SA 4.0), 'Montreal Olympic Stadium aerial view.jpg' (Bobjagendorf, CC BY-SA 3.0), 'Biodome.jpg' (Fishhead64, CC BY-SA 3.0), 'Penguin in Captivity.JPG' (Ilikepie2221, CC BY-SA 3.0) and 'Biodome Montreal.jpg' (PtitLutin, photograph; Roger Taillibert, architect; CC BY-SA 2.5). The plan view of 'Biodome Montreal.jpg' (the kite, the three visible feet, the spindle of oval skylights) and the entrance arch in 'Biodome.jpg' decided the layout.

## Dimensions: sourced against estimated

| Dimension | Model | Status |
| --- | --- | --- |
| Crown height | 33.4 m (declared 33.5 m) | sourced |
| Plan | 160.2 m east-west x 158.3 m north-south, kite with four feet | mapped |
| Origin | [-73.549709, 45.559599]: area centroid of the mapped outline | mapped |
| Feet (local m, east, south) | A (69.1, -68.5), B (-88.5, -14.0), C (-61.8, 58.7), D (12.5, 86.4) | mapped |
| Long axis C to A | 182 m at bearing 45.8 degrees; the plan is mirror symmetric about it | mapped |
| Four abutments | the four feet reach the ground | sourced (count), mapped (places) |
| Clear height under the edge at mid-arch | B-C 8.5 m, C-D 8 m, A-B 7 m, D-A 6 m | estimated (about 8 m read from the entrance photograph) |
| Edge beam | 1.1 m thick | estimated |
| Dome profile | 1.8 power, 0.22 drop between the feet, so ridges run down to the abutments | estimated |
| Spindle | 34 m wide at mid, from the nose to 5 m short of the back foot, 1.5 m proud, ribs 2.8 m wide and 1.5 m high | estimated from the plan photograph |
| Skylights | 16 across the spine (about 6.9 m pitch, 5.4 m wide, 22-30 m long), 4 + 4 on the flanks, 11 + 11 along the back edges | estimated; counts read from the plan photograph |
| Walls | set back 3.6 m, mullions about 3.8 m apart | estimated |
| Entrance | canopy 17 x 3.1 m at 5.6 m, sign 6.4 x 1.3 m | estimated |

**Datum.** `y = 0` is the Olympic Park esplanade round the building; the published 33.5 m is taken as height over it. `padM` is 102 (the farthest foot is 97 m from the origin); the site is flat and no terrain pad is declared.

## Materials

`concrete` (the shell, edge beam, soffit, solid walls near the feet, entrance canopy and posts), `rib` (heavier, lighter ribs and louvre bars), `skylight` (the lens glazing), `glass` (the dark glazed walls under the arches), `frame` (mullions), `sign` (the self-lit sign panel, a plain dark panel by day without lettering). Light and dark palettes name the same keys; the dark palette dims the stone and glass and makes the sign light. Far drops `frame` and `sign` (4 draws).

## Modelling decisions

- **The plan is the OSM outline.** `biodome-de-montreal-plan.js` holds its 101 vertices in local metres, rounded to 0.1 m; every vertex of the shell, edge beam, soffit and walls sits on or inside it (a test checks it). Rotation is baked in: nothing here is rotated by a layer, and the kite's feet were checked against the footprint ring in the plan view and against the geometry of the reference photographs (the stadium tower, at about (-176, 58), looks north-east at the nose).
- **A height field, not boxes.** `biodome-de-montreal-shell.js` gives the shell as a function of position over the plan: radial fraction `t` from the centroid to the outline, perimeter position `sigma` (so the roof edge follows an arch between feet, zero at each foot), a dome profile, and a raised spindle. Ribs, skylights and walls are all draped on it, so they hug the surface and nothing floats. The boundary samples are the mapped vertices (near, split to 6.5 m) or a 0.7 m simplification of them with the four feet kept (far).
- **Closed shell.** Top surface, 1.1 m edge beam, soffit back to the wall, and the wall down to the ground are separate surfaces meeting at shared vertices, so the arches show a thick lip, a shadowed soffit and a setback glass wall from any angle, and nothing is open underneath. Every surface is oriented by a stated facing.
- **Ribs** are raised trapezoid strips swept along spline-smoothed plan polylines (3 m steps, tapered to nothing at the ends, base sunk 0.14 m so there is no coplanar contact).
- **Skylights** are lens-shaped bubbles with apex ends, rim 0.16 m over the shell and 0.46 m at the centre; louvre bars cross the larger ones (near only).
- **Far.** Same silhouette and negative space: simplified boundary, 13 rings instead of 30, coarser lenses, the same four feet, the same arches with glass behind them, ribs at 5.5 m steps, no fins, louvre bars, mullions, canopy or sign.

## Approximations and weaknesses

- The shell is smooth where the real one is a tent-like surface of ruled panels between the ribs; the dome exponent and the dip between feet are tuned by eye. The real ridges between feet are sharper.
- The real skylights are stepped, louvred banks; here they are low glass bubbles with white bars. Their number and size are read from one plan photograph and an oblique one.
- The real edge beam flares into each abutment; here the feet are the mapped pointed tips with the beam tapering to the ground.
- The glazed walls are an opaque dark teal and carry no interior; there is no lettering ("BIODÔME de Montréal") on the sign, no doors, ramps, sunken courts or steps.
- Arch heights are estimates; the long back edges may be lower or walled in the real building.
- Cityscape and Full 3D world are not tested yet; integration is checked separately. The model is a rigid structure on local `y = 0`. On the flat Cityscape map it stands on the esplanade; in Full 3D world the ground under the 97 m footprint is expected to be flat, but that is not verified.

## Costs

| Detail | Triangles | Draw calls | Size |
| --- | --- | --- | --- |
| near | 18,962 | 6 | 454,920 bytes (444.3 KiB) |
| far | 2,974 | 4 | 74,716 bytes (73.0 KiB) |

Budgets for a building: near 60,000 triangles / 14 draws / 2.5 MB, far 12,000 / 8 / 500 KB.

## Verification evidence

Screenshots looked at (under the ignored `tmp/quebec/shots/biodome-de-montreal/`): procedural near light sheets of `overview`, `facade`, `roof`, `back`, `street`, `detail`, `plan`, `tower`; `towerbig` (the vantage of the reference photographs); the exported GLB near and far, dark (`...-glb-near-dark-sheet.jpg`, `...-glb-far-dark-sheet.jpg`) from overview, facade, roof, back, street, plan and tower. What changed because of them:

- The first render read as a plain white helmet: the ribs were invisible and the skylights tiny. The spindle was raised 1.5 m, the ribs made 1.4 to 1.5 m high, the base concrete darkened, the lenses enlarged and louvre bars added.
- The dome (exponent 2.25) was blunter than the photographs; it was flattened to 1.8 with a larger dip between the feet so ridges run down from the crown to the four abutments.
- The plan view put the kite, the four feet and the spindle on the red footprint ring; the tower view reproduces the arrangement of the reference plan photograph (nose at the bottom, shoulders left and right, rounded back).
- `qa-metrics.mjs` flagged one coplanar pair (mullions against the glass, 0.6 m2); the mullions were embedded behind the glass and it now reports none, 0 % back-face hits on 278 rays, minimum y 0.

Tests: `node --test src/peregrine/landmarks/quebec/biodome-de-montreal/biodome-de-montreal.test.js` pins the 33.5 m crown, the plan envelope against the footprint ring, the long-axis bearing, the four abutments reaching the ground, clear arches with the glazed wall behind each, the sixteen spine skylights with the two spindle ribs standing proud, the eleven edge skylights per side, the entrance canopy and sign facing the stadium, and the far model keeping the silhouette and the open arches.
