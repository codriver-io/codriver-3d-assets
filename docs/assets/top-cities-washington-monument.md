# Washington Monument

Asset `washington-monument`, 2 15th Street NW, National Mall, Washington, D.C. Original procedural model of the
obelisk as completed in 1884 (Robert Mills; Lt. Col. Thomas Lincoln Casey, U.S. Army Corps of Engineers): a
battered marble shaft, a pyramidion with eight windows and red aircraft beacons, an aluminium apex, one bronze
door on the east face, and the low glass screening lobby that covers that door. Contract:
[3d-top-cities-landmarks.md](../top-cities-landmarks.md). Source:
`src/peregrine/landmarks/top-cities/washington-monument/`.

## Sources

| Fact | Value | Basis |
| --- | --- | --- |
| Height to the aluminium apex | 555 ft 5⅛ in = 169.294 m | NPS / Casey 1884, OSM `height=169.294`. NGS 2013–2014 measured 554 ft 7 11/32 in (169.046 m) from a raised 1975 entrance datum; the model uses 169.294 |
| Shaft | 500 ft = 152.4 m | published (HAER) |
| Base | 55 ft 1½ in = 16.802 m square | published (HAER) |
| Shaft top | 34 ft 5⅝ in = 10.506 m square | published (Wikipedia; HAER is 34 ft 5½ in, 3 mm smaller) |
| Colour change | 150 ft = 45.72 m | HAER and the DC historic district. The NRHP nomination says 152 ft; the model uses 150 ft, with one 2 ft course of the third marble between the two stones |
| Aluminium apex | 8.9 in tall, 5.6 in square at the base | Frishmuth, 1884. About ⅜ in lost to lightning historically is ignored |
| East door | opening 6 ft wide by 8 ft high | HAER. The leaf was reduced in 1885 to 5 ft 8 in wide; the west entrance was sealed. Modelled as the opening, set 0.55 m back |
| Pyramidion windows | two per face, 3 ft wide, inner edges 4 ft apart, sill at 504 ft; 18 in high on north, south and west, 24 in on the east | published. A red aircraft beacon sits above each (eight) |
| Axis and faces | origin `[-77.0352426, 38.8894753]`, cardinal | centroid of the four corners of OSM way 766761337. The mapped south edge bears −89.81°, within 0.2° of due west, so the model is axis-aligned rather than skewed 0.19° |
| East lobby | about 9.2 m wide and 10.7 m deep, one level, glass | mapped: OSM way 897141356. Height is not tagged |

## Dimension table (model vs source)

| Element | Model | Status |
| --- | --- | --- |
| Apex | y = 169.294 m | sourced |
| Shaft | y = 0 to 152.4 m, half-width 8.401 m at the plaza to 5.253 m at the top (batter about 20.7 mm per metre) | sourced |
| Lower marble | y = 0 to 45.72 m, `#b7b4ac` | height sourced; the grey is matched to the 2022 daylight photograph, not a laboratory colour |
| Joint course | y = 45.72 to 46.33 m, one 2 ft band, `#a39f96` | the stop line is sourced; treating it as exactly one course is an estimate |
| Upper marble and pyramidion | y = 46.33 m to the aluminium base, `#eceae3` | sourced massing |
| Aluminium cap | 0.226 m tall, 0.142 m square | sourced. Near uses `aluminum`; far reuses `marble_upper` for the same four triangles |
| East door | 1.829 m wide, 2.438 m high, bronze leaf 0.55 m inside the face | opening sourced; reveal estimated |
| Windows | centres at ±1.067 m along each face, sill 153.62 m, glass set 0.12 m in | sizes sourced; reveal estimated. East heads are 0.15 m higher |
| Beacons | 0.30 × 0.18 × 0.08 m boxes, 0.10 m proud, material `lamp` | presence sourced; size estimated so they read at driving distance |
| East lobby | glass to 4.0 m, roof slab to 4.22 m, east wall at x = 19.02 m, sides at z = ±4.48 m | plan mapped; height estimated. No west wall (it would sit on the marble). Dark mullions on both LODs, inside the roof overhang |

## Materials

Nine materials on the near model, one draw each: `marble_lower`, `marble_joint`, `marble_upper`, `bronze`, `glow`
(window glass; unshaded, dark by day and warm when floodlit), `lamp` (the eight beacons; unshaded), `aluminum`,
`glass` (lobby), `roof` (lobby roof and mullions). Light and dark palettes share keys. At night the shaft stays
bright, because the real obelisk is floodlit; the beacons stay red and the windows go warm. Far drops the window
and door jambs and folds the apex into `marble_upper`, which leaves eight draws. The 2 ft ashlar courses are not
drawn: at this height they shimmer, the same lesson as Coit Tower's pour joints.

## Modelling decisions

- The built 1884 obelisk, not the 1878 completion proposals, the 1845 certificate, the temporary mural, or scaffolding.
- Silhouette first: a square shaft that tapers, a sharper pyramidion, and a colour break about a quarter of the way up. That is what a driver names from the Mall.
- The east lobby is included because OSM way 897141356 and the 2022 photograph both show a low dark glass box on the east door. Leaving it out would let the provider draw a generic box over the entrance.
- Faces are cardinal. Rotation is baked; the layer does not rotate the model. Origin is the shaft centroid. y = 0 is plaza grade. `padM` 18 covers the shaft. There is no `terrainPad`: the plaza is locally level, and the grassy knoll beyond it is not part of the model.
- Open bottom. Nothing is built below y = 0. Offsets between the door, the window glass and the stone are at least 12 cm.

## Approximations, honestly

- Lobby height (4 m) and the mullion grid are estimates. The real pavilion is a security structure with a darker, less regular frame.
- The third-marble band is drawn as one 2 ft course. The real joint is a change of stone, not a modelled moulding.
- Lightning rods (about 0.3 m above the apex since 2013), the circle of fifty flags, the circular paving, and the interior are omitted. The rods would move the top off the 169.294 m figure.
- Colours are tuned to the 2022 photograph: lower shaft grey, upper shaft near-white. They are not measured marble samples.
- The door is the 6 ft opening, not the narrower 1885 leaf.

## Costs

Near 420 triangles / 9 draws / 35 KB; far 348 triangles / 8 draws / 29 KB (budget 60 000 / 14 / 2.5 MB and 12 000 / 8 / 500 KB). Far is the same shaft, windows, beacons and lobby, without the door and window jambs, and with the apex on the upper marble. The bounding box matches the near model.

## Verification

- References looked at (not committed): `tmp/top-cities/washington-monument/refs/7.jpg` (Greyfiveys, daylight, colour break and lobby), `refs/6.jpg` (Bill Ingalls, overhead: cardinal square, pyramidion, east rectangle, flag ring), `refs/1.jpg` (ForestWander, night silhouette). The proposal sheet, the mural and the scaffold photo were set aside.
- Procedural contact sheets in `tmp/top-cities/shots/washington-monument/`: near-light (overview, facade, entrance, pyramidion, joint, west), far-light, near-dark, and a plan. The first cameras sat inside the shaft and cropped the apex; they were pulled back so a 169 m tower fits a 40° view (overview eye at 150, 78, 230). Lobby glass was lightened and mullions added so the pavilion reads as glazing rather than a crate. No further mesh change after that look.
- Exported GLBs, looked at against the same photographs: `tmp/top-cities/shots/washington-monument/washington-monument-glb-near-light-sheet.jpg` (overview, roof, entrance, pyramidion, colour joint, west), `washington-monument-glb-far-light-sheet.jpg`, `washington-monument-glb-near-dark-sheet.jpg`, `washington-monument-glb-far-dark-sheet.jpg`, and `washington-monument-glb-near-light-plan.png`. The GLB matches the procedural mesh: cardinal square on the red footprint, lobby on the east (+X) axis, grey lower third, pale shaft, two windows and red beacons per pyramidion face, floodlit night shaft. No mesh change after the GLB look.
- Cityscape: not tested yet. Full 3D world: not tested yet. The monument stands on a level plaza; integration is checked separately.
