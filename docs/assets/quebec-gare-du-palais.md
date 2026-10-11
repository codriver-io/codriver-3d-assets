# Gare du Palais

Asset `gare-du-palais`, 450 rue de la Gare-du-Palais, Québec (Lower Town, beside the Vieux-Port and Saint-Roch). Original procedural model of the railway and
bus station as it stands in 2026: Harry Edward Prindle's Château-style station for the Canadian Pacific Railway (1915; H. G. Jones and D. H. Mapes are
named with him by Parks Canada), the whole station of the mapped outline and its three building parts, and nothing else. Contract:
[3d-quebec-landmarks.md](../quebec-landmarks.md). No scan, traced mesh, photograph or texture is in the repository or the GLBs. The Place Jean-Pelletier
forecourt and its Éclatement II fountain, the street furniture, the platforms and the neighbouring buildings are not drawn or removed.

## Identity and what a driver sees

From Rue Saint-Paul or the Place Jean-Pelletier (100 m and more) the station is the long facade looking south-south-east over the forecourt: a
red-brown brick building with grey limestone trim under steep verdigris copper roofs, and in the middle the tall central hall. Its face is a great glazed
bay of seven tall mullioned windows under seven arched transoms, framed in stone, with a corbel-table arcature across the top, a stone clock gable
(the dial is eight feet, 2.4 m) between two thin pinnacles, and a steep copper roof behind. Two round turrets under steep conical copper caps flank the
bay, brick below and stone above, corbelled out of the wall. A glazed copper canopy shelters the five entrance doors. To each side a two-storey brick
wing under a mansard roof carries pedimented stone dormers. Behind, a long low west wing (the concourse, 18.8 m wide) and a north wing toward the
tracks run off at about 30 degrees to the main block, which Parks Canada calls the "truncated-Y plan" (a main rectangular block and two wings at angles,
making room for the train yard). Their roofs are huge and steep over low brick walls, with rows of pedimented dormers and brick chimneys on the ridges.

## Sources and dimension table

The plan and the part footprints come from OSM way 33893247 (the station, `building=train_station`, `roof:shape=mansard`) and its three
`building:part` ways (Overpass through the shared helper, 2026-10-04). Facts: Wikipedia (EN, FR) and the Parks Canada Directory of Federal Heritage
Designations (Heritage Railway Station, 1992). Four photographs (Wikimedia Commons, listed below; downloaded to ignored `tmp/quebec/gare-du-palais/refs/`
only to compare) fixed the facade, the roofs and the wings. The public Terrarium DEM (zoom 15, 10 m grid) was sampled for the terrain pad.

| Feature | Model | Basis |
| --- | --- | --- |
| Date, architect, materials | 1915, Prindle; copper roofs, brick in Flemish bond, Deschambault limestone trim | **sourced**: Wikipedia, Parks Canada |
| Plan | main block 44.2 m wide along the facade (grid 67.2 deg east of north) by about 25 m, with a 14.8 m central pavilion; west wing 46.6 x 18.8 m and north wing 21 m wide, 44 m long on its east side and 59 m on its west side (its south end is slanted against the main block), on a grid 30 deg off (97.3 deg) | **mapped**: way 33893247 and parts 1489885116, 1489885117, 1489885118 |
| Storeys | main block 4 levels, wings 2 levels | **mapped** (`building:levels`); read as eaves and roofs below |
| Central hall width | 14.8 m outside, 13.7 m inside | **mapped** pavilion; the published ticket lobby is 45 ft (13.7 m) wide, 65 ft (19.8 m) deep, 60 ft (18.3 m) clear to its skylight |
| Concourse | the west wing, 18.8 m wide | **estimated**: the published concourse is 125 x 62 ft (38.1 x 18.9 m), 40 ft (12.2 m) high; the width matches the mapped wing, the vault height is not modelled |
| Hall roof | eave 11.8 m, mansard break 15.6 m, flat top at 19.4 m, finial 20.4 m (total height) | **estimated** from the photographs, consistent with the 18.3 m clear height of the ticket lobby below |
| Side parts either side of the pavilion | eave 6.7 m, mansard to a flat top at 12.4 m, 44 m overall | **estimated** (photograph: eave 6.7 m) |
| West and north wings | eave 3.6 m, mansard break 7.5 m, ridge 10.8 m | **estimated** from a side photograph (low wall, roof about twice its height) |
| Glass wall | seven panes 0.82 x 3.7 m under seven round-arched transoms, stone frame 7.8 x 6.1 m, 1.02 m bay pitch | seven windows **sourced** (Parks Canada) and counted on the photograph; sizes **estimated**. The 40 ft window quoted historically does not fit the mapped 14.8 m pavilion and is not modelled |
| Turrets | 3.0 m round brick tower, 12-sided, continuous from the ground to 10.7 m (stone base course to 0.7 m), stone belt and drum to 12.9 m, cone 13.2 to 17.4 m, finial 18.4 m | **estimated** (photograph); plan position inside the mapped front |
| Clock | stone gable 3.4 m wide, dial 2.4 m with rim, apex 16.1 m | dial diameter **sourced** (eight feet); position estimated |
| Canopy | 10 x 2.2 m copper wedge, 3.4 to 4.6 m high, five glazed doors | photograph estimate; it stands 0.4 m past the mapped front |
| Dormers | wall dormers 3.0 m wide (stone fronts, arched windows), wing dormers 2.3 m, small copper dormers and hall vents; up to 5 per long wing side | photograph estimate |
| Chimneys | 8 brick stacks 1.0 x 0.9 m with stone caps, 2.2 m above the ridges | photograph estimate |
| Windows | arched ground-floor windows, 1.3 x 2.1 m on a 3.75 m (wings) or 2.9 m (parts) pitch; paired upper windows | photograph estimate |
| Roof cresting | 0.1 m wide metal strips, 0.07 m proud, on hips, breaks and tops (were 0.2 m and 0.14 m proud, which read as heavy dark lines) | estimate (the real roofs have ridge cresting; the exact pattern is not known) |

## Materials (light / dark)

`brick` (buff-brown Citadel brick), `stone` (grey limestone and granite trim, dormer fronts, turret drums, mullions), `copper` (verdigris roofs, cones,
canopy, dormer cheeks), `glass` (windows), `glow` (the whole glass wall, the entrance doors and a third of the other windows: the same colour as `glass`
by day, warm lit yellow at night; drawn unshaded), `metal` (cresting, finials, canopy posts, clock hands and rim), `sign` (the clock dial and the canopy
fascia strip: pale by day, lit at night; drawn unshaded). Seven materials, so seven draw calls near and far.

## Modelling decisions

* **The plan is the mapped plan, unrotated.** `gare-du-palais-site.js` converts the rings to model metres around the outline's area centroid and derives the
  two grids from the long edges: the main block (u along the facade, v toward the forecourt, 67.2 deg) and the wings (97.3 deg). Both are baked in the
  geometry; the layer never rotates. The facade looks 157 deg (south-south-east), toward the mapped Rue de la Gare-du-Palais and the fountain plaza.
* **Blocks, not an extrusion.** Five roofed blocks (the hall, two side parts, west wing, north wing) are brick boxes under three-ring mansard roofs; where a
  block meets another, the wall is drawn only where it is exposed (a taller wall above a lower roof starts at that roof's eave), so no two walls share a
  plane. The hall and the two side blocks have mansard roofs of their own; each wing's roof is hipped at its free end and a gable at the end that joins the main building, where the wing's slopes, gable wall and cresting are cut exactly by the hall and side-block roofs (`gare-du-palais-clip.js`: convex half-space clipping), so the wing ridge ends in a gable and valleys instead of a hip pyramid butting the hall roof.
* **Decision on the neighbours.** The 6-storey government office (way 103861185, 38 m east of the north wing) and the one-storey service building (way
  163393183, 12 m west of the west wing) are separate buildings: the photographs show each as free-standing (the office, a pinkish-brown hipped block, stands
  behind the main block in the west-wing photograph). Their rings are not in `FOOTPRINTS`. The Édifice Jean-Lesage, 130 m north, is also separate.
* **Detail is quads, merged.** Windows are a stone frame, a glass pane proud of the wall (0.06 and 0.11 m), a mullion and a sill; quoins alternate 0.75 and
  0.45 m; arches are one fan each; dormers are about 13 triangles; the turrets are continuous 12-sided brick towers from the ground, with slit windows and a corbel table under the drum; the roofs get 0.1 m cresting.
* **Far LOD** keeps every block, roof, the turrets and cones, the clock gable, the dormers and chimneys, the glass wall (seven panes, no mullions) and the
  canopy, and replaces windows with dark slots in 7.5 m cells (a quarter lit at night). Cresting, quoins, sills, frames, arcature arches, slits and vents go.
* **Night.** The seven-bay glass wall, the doors and the clock glow, a third of the other windows are lit (fixed pattern); the real station is floodlit,
  which is not modelled.

## Terrain notes (Full 3D world)

The site is the flat Lower Town. The public Terrarium DEM (zoom 15, 10 m grid) gives 5.6 to 7.1 m under the station (6.0 m along the tracks side, 7.0 m on the
forecourt, a 1.5 m rise south across the block) and 4.9 to 5.0 m about 50 m to the north-east. That is under the 2 m rule, but the default disc (`padM`
60 m around the centroid) takes the lowest sample under it (4.9 m) and would cut the forecourt, 2 m higher, into a pit in front of the doors. `spec.terrainPad`
is therefore the station outline (way 33893247) held at the median DEM of its own outline (about 6.1 m, local y = 0) with a 6 m feather: the model stands
within about 1 m of the real ground everywhere and the plaza keeps its level. Expect: the forecourt side 1 m above the datum in the DEM is cut down to the
pad inside the outline and blends back within 6 m; the north end, about 0.5 m below the datum, stands on a small fill. Cityscape ignores the pad. Not tested in the app.

## Approximations and limits

* Facade and roof detail is read from four photographs and is not a survey: every height, pitch, pitch of windows and dormers, the chimneys and the
  cresting are plausible, not counted (the seven bays are counted).
* The roofs of the north wing and of the rear of the main block are inferred from the outline and the west wing; the real hall (13.7 m wide) has a vaulted
  ceiling and a skylight under its roof, which is not modelled. The side parts' roofs are free-standing hipped mansards beside the hall; the real junctions
  are probably gabled into it. The wings' joined ends are gabled into the main roofs (clipped), but the two wings still meet each other as two separate roofs.
* Not modelled: the long covered walkway (flat canopy on posts) along the south side of the west wing seen in the dawn photograph, the stained-glass
  coats of arms and cartouches, the signs and lettering ("GARE DU PALAIS", the VIA Rail logo), the lamps, trees, planters and the compass-rose paving of the
  forecourt, the platforms, the engine-room building mentioned by Parks Canada (not found in the mapped outline) and every ornament.
* The model stays inside the mapped outline: the canopy, which stands 0.4 m beyond the mapped front, and cornices and sills up to 0.3 m are the only parts
  beyond it; about 0.5 m of the north end of the north wing is outside where the mapped north edge is 1.4 deg off the grid.
* Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.

## Costs (exported GLBs)

| | Triangles | Draw calls | Bytes |
| --- | --- | --- | --- |
| Near | 5,543 | 7 | 264,148 |
| Far | 1,014 | 7 | 58,984 |

Budgets (building): near 60,000 / 14 / 2.5 MB, far 12,000 / 8 / 500 KB. Costs describe scene meshes and uncompressed bytes, not measured Tesla
performance. Bounds: x -56.4 to 30.2, y 0 to 20.4, z -53.1 to 28.4 m around the origin (-71.2139626, 46.81756).

## Verification evidence

Screenshots were rendered with `.agents/skills/build-3d-city/scripts/shot.mjs` (headless Chromium on the GPU, red OSM footprint rings and a 10 m grid)
and read against the references. Files are in ignored `tmp/quebec/shots/gare-du-palais/`.

* **Procedural, near, light:** `overview`, `facade`, `roof`, `clock`, `street`, `entrance`, `west`, `tracks`, `east`, `corner`, `back`, `aerial` and a
  `--top` plan over the footprint rings; one close view of the clock gable from the side.
* **Exported GLBs (`--source glb`):** near light `facade`, `clock`, `street`, `aerial`, `west`, `tracks`, `east`, `corner`, `entrance`; near dark `clock`,
  `entrance`, `corner`, `east`; far dark `facade`, `clock`, `aerial`, `west`.
* `qa-metrics.mjs` on the exported GLBs: no coplanar overlaps of different materials, 0 % back-face hits in 235 outside-in rays, nothing below grade, far bounds within budget.

What was changed because of them: dormer cheeks and roofs had been built outward from the wall (spikes beyond the outline), and the hall vents floated in
front of the facade: both now run inward into the slope, and a vertex scan finds none more than 0.3 m outside the mapped outline except the north end; the
glass wall had five bays and now has the seven the photograph and Parks Canada show; the hall roof was too low once the 18.3 m clear height of the ticket
lobby is respected, and was raised from 17.7 m to 19.4 m; the dial was enlarged to the published eight feet; the far window slots were one dark bar per wall
and became lit and dark cells; the belt course's top was coplanar with the window sills and was lowered; the wings got hips and cresting to read as
mansards; the end walls of the side parts got the pedimented dormers of the west-end photograph. QA pass (independent review): the turret shafts ended at 7.9 m on an inverted stone cone (a corbel) over nothing, where the photographs show continuous round towers, so the brick cylinder now runs from y = 0 and the cone is gone; the wing roofs ended in hip pyramids butting the hall roof, so each wing's joined end is now a gable clipped into the main roofs with valleys; the ridge cresting was thinned from 0.2 m to 0.1 m wide.

## References and rights

* Wikipedia: <https://en.wikipedia.org/wiki/Gare_du_Palais> (1915, Prindle, châteauesque, copper roofs, lobby and concourse dimensions, 8 ft clock dial);
  <https://fr.wikipedia.org/wiki/Gare_du_Palais_(Qu%C3%A9bec)>; Parks Canada, Du Palais Station: <https://www.pc.gc.ca/apps/dfhd/page_hrs_eng.aspx?id=2116>
  (truncated-Y plan, two conical-roofed turrets flanking a massive glazed bay, seven windows, brick in Flemish bond, Deschambault limestone, mansard roofs).
* OSM: ways 33893247, 1489885116, 1489885117, 1489885118 (© OpenStreetMap contributors, ODbL 1.0).
* DEM: Terrarium elevation tiles (zoom 15) read for measurement only; nothing is shipped.
* Photographs compared, not shipped (Wikimedia Commons): Wilfredor, "Ornate clock at Gare du Palais in Quebec City", "Gare du Palais, Quebec city, Quebec,
  Canada 2340 24" and "Main hall of Gare du Palais in Quebec City" (all CC0); Daniel Di Palma, "Gare du Palais at dawn" (CC BY-SA 4.0).

Rebuild: `pnpm build:quebec-landmarks gare-du-palais`. Tests:
`node --test src/peregrine/landmarks/quebec/quebec.test.js src/peregrine/landmarks/quebec/gare-du-palais/gare-du-palais.test.js`.
