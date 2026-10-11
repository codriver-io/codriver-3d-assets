# Vikingskipet (Hamar Olympic Hall)

Asset `vikingskipet`, Åkersvikvegen 1, Hamar. The 1992 speed-skating hall for the 1994 Winter Olympics,
architects Biong & Biong and Niels Torp. Original procedural model. Contract:
[3d-top-cities-landmarks.md](../top-cities-landmarks.md). No scan, traced mesh, photograph or texture is
in the repository or the GLBs.

## Identity and what a driver sees

From Åkersvikvegen, or from the lake, the hall is one long upturned hull. The side view is a shallow
arch about 250 m long and 35 m high, pinched to a point at each end. The cladding is pale silver-grey
metal with continuous longitudinal ribs. A blue-grey glass skirt runs under the eaves, and the road
side has a recessed entrance with a dark canopy and two doors. The end-on view is a tall rounded arch,
the ribs converging toward the stem. The dark timber people remember is inside: seventeen glulam
lattice arches. They are not in this model, and neither is the X sculpture on the lawn.

## Sources and dimension table

| Feature | Value | Basis |
| --- | --- | --- |
| Length | published 250 m (Structurae 260 m). Model keel 248 m | Store norske leksikon, the 2011 Hamar Olympiske Anlegg fact sheet, Visit Norway. 248 m is the eave length that stays inside OSM way 28287844 |
| Width | published overall 110 m; glulam span 96 m (Structurae lists 96 m as the width). Model eaves 102.3 m | SNL / HOA for 110 m and the 96 m span. 102.3 m is the widest curve that keeps about a metre inside the mapped ring |
| Height | 36 m clear under the ceiling; Structurae exterior 35 m. Model keel batten 35.00 m | SNL and HOA for the clear height. The mesh crown is the exterior figure |
| Opened | 19 December 1992. Rink 400 m. Capacity about 10 600 / 20 000 | Wikipedia |
| Floor / roof / volume | floor about 22 000–25 000 m², roof about 30 000 m², volume 350 000–400 000 m³ | SNL, HOA, Wikipedia. Not used as mesh dimensions |
| Structure | 17 glulam lattice girders, longest 96 m, 4 m deep | HOA archive. Interior only; omitted |
| Plan | keel bearing 25° (NNE). Road and entrance on the WNW long side, frontage 295°. Lake to the ESE. Origin is the area centroid of way 28287844, 11.10098302, 60.79298595 | OSM way 28287844. Wikipedia's point is on the west side, not the centroid |

## Frame, origin and orientation

Real metres, +X east, +Y up, +Z south. The hull is authored along the keel (+s toward NNE, +a toward
the lake) and baked with bearing 25°. `y = 0` is local grade on the filled Åkersvika shore. Nothing
is baked for terrain or sea level. `padM` is 145 m, enough to cover the lens. The shore is flat fill,
so there is no `terrainPad`.

Cityscape and Full 3D world: not tested yet, integration is checked separately. On Full 3D world the
hall should sit on one grade; the model does not carry a hillside pad.

## Materials

Six names, the same keys in both themes: `hull` (silver planks, day `#c2c8ce`, night `#5c656d`),
`seam` (rib grooves, mullions, porch, day `#2a3138`), `concrete` (plinth), `light` (unshaded glass
skirt, day `#5d7c90`, night `#e8b56b`), `glow` (a thin unshaded line under the eave), `door`. The day
glass is deliberately darker than the silver, because the contact-sheet lights wash a pale glass into
the hull. Night glass is the warm interior. Roughness stays the builder default. No textures.

## Modelling decisions

- The plan is an analytic lens, `halfWidth = 51.15 * (1 - |s/124|^1.42)^1.08`, not a trace of the OSM
  ring. The ring is jagged on the road side; the hall's eave is the smooth curve inside it. The north
  neighbour, way 987946525, is a different building and is not covered.
- The section is a round arch from an eave at 7.15 m (midships) up to the keel. Ten plank bands a side
  on the near model, five on the far, with the joint pulled in 0.42 m along the section normal so the
  rib is a groove. The groove walls carry their own across-section normal. The inset fades where the
  section gets shorter than 3.5 m, so the stem does not fold over itself.
- The shell runs to 98.5% of the keel. A short fan sets the stem on the plinth. Where the eave has
  dropped too close to the plinth for glass, a metal cheek closes the gap.
- The road entrance is a recess about 26 m long and 6.4 m deep, with cheek returns, a dark canopy and
  two doors. The lake side is the same glass skirt without a door.
- Far keeps the same crown, the same plan, the glass, the entrance and a coarser rib set. Both LODs
  are six draws.

## Approximations and what is not modelled

Eave height, plank count, groove depth, the stem kick and the entrance recess are read from
photographs, not from a survey. The ends are metal points with the glass skirt stopping as the eave
meets the plinth; there is no separate flat glazed gable. The 17 interior arches, the X sculpture,
flagpoles and the neighbour are omitted. At a grazing view along the prow the thinnest ribs break
into dashes. The entrance cheeks are plain blocks.

## Costs (exported)

| | triangles | draw calls | bytes |
| --- | --- | --- | --- |
| near | 21 416 | 6 | 1 623 KB (1 662 160 bytes) |
| far | 4 980 | 6 | 379 KB (387 596 bytes) |

Building budgets are 60 000 / 14 / 2.5 MB near and 12 000 / 8 / 500 KB far. Both LODs share the
crown at 35.00 m and sit on y = 0. Far bounds match near within a millimetre.

## Verification

Looked at `tmp/top-cities/vikingskipet/refs-sheet.jpg` and refs 2 (entrance), 3 (winter end) and 4
(lake profile). The first procedural sheet washed the ribs and the glass into one white hull, and the
entrance was a floating slab. Seams were darkened and deepened, the day glass was dropped to
`#5d7c90`, and the porch gained cheeks. The deep grooves then rendered as sawteeth, because the
groove walls were wound against the plank normal; they now face across the section, and the inset
fades toward the stems. The stem was still floating on a peg, so the shell was extended and the point
was set on the plinth.

Judged after that: the procedural near-light sheet, the facade, the prow, the overview and the
straight-down shot (the eave stays inside the red ring, including the road-side notch). The groove
walls were then turned to face into the joint. A repeat of the outside-in sweep went from 7.4%
back-face hits, all on `seam`, to none, with no coplanar pairs. The facade was checked again and
the ribs stayed smooth. Exported GLBs judged at
`tmp/top-cities/shots/vikingskipet/vikingskipet-glb-near-light-sheet.jpg`,
`vikingskipet-glb-near-dark-sheet.jpg`, `vikingskipet-glb-far-light-sheet.jpg` and
`vikingskipet-glb-far-dark-sheet.jpg`, and the near-light facade was shot once more from the
re-exported GLB. Far keeps the hull, the ribs, the glass band and the two doors. Night reads as a
dark hull with a warm skirt.
