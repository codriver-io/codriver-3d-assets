# Lefty O'Doul Bridge (Third Street Bridge), San Francisco

Asset `lefty-odoul-bridge`: the 1933 Strauss heel-trunnion single-leaf bascule that carries Third Street over the Mission Creek (China Basin) channel beside Oracle Park. Original procedural model, **superstructure only** (`kind: 'bridge'`, `footprintless`): the provider keeps drawing Third Street's pavement, so the model has no deck, nothing in the lanes and nothing below grade. Contract: [3d-san-francisco-landmarks.md](../san-francisco-landmarks.md). Source: `src/peregrine/landmarks/san-francisco/lefty-odoul-bridge/`. Rebuild: `pnpm build:san-francisco-landmarks lefty-odoul-bridge`. Tests: `lefty-odoul-bridge.test.js` in the same folder.

## Identity and version

Opened 12 May 1933 (Joseph Strauss's company; contractor Barrett & Hilp), renamed for Francis "Lefty" O'Doul in 1980, retrofitted 1999, rehabilitated 2017-2020 (counterweight repair, deck and steel repairs; no change of form). It is a **single-leaf** bascule: one leaf hinges at the north-west (ballpark) end on a heel trunnion at the top of a tall frame, and its two concrete counterweights swing down behind it when it opens. Modelled in the **closed** position, which is what a driver sees: a black Pratt through truss over the road, and at the far end a huge steel frame with two concrete blocks hanging high above the sidewalks. The operator's house (oxblood panels, balcony, glazed cab, green roof) and two cream huts stand on the piers.

## Sources

| Source | Used for |
| --- | --- |
| [Bridgehunter](https://www.bridgehunter.com/bridges/11419) and [HistoricBridges.org](https://historicbridges.org/bridges/browser/?bridgebrowser=california%2F3rd%2F) | 143 ft (43.6 m) main span, 295 ft (89.9 m) length, 71.5 ft (21.8 m) roadway, 1 main + 5 approach spans, Pratt through truss, heel trunnion; **roadway cantilevered out from the western truss line** |
| [NoeHill, SF Landmark #194](https://noehill.com/sf/landmarks/sf194.asp) | concrete counterweights, no pit, operator's and watchman's houses on the piers, approach spans |
| [SF Public Works](https://sfpublicworks.org/ThirdStreetBridge), [SF Chronicle](https://www.sfchronicle.com/bayarea/article/What-s-up-with-Lefty-O-Doul-Bridge-It-s-12465380.php) | east and west counterweights, counterweight at the north (ballpark) end, black steel, rehab dates |
| OSM ways [1088314479](https://www.openstreetmap.org/way/1088314479) (bridge outline), 27656674 / 674496104 / 1006830791 (carriageways), 675874822 / 675874825 (sidewalks), 579664204 and 1006830800 (houses) | axis bearing 327.5 deg, leaf 44.6 m, width 24.5 m, heel extent (V -7.9 to +10.7), house and hut outlines, model origin |
| Wikimedia Commons photographs (CC0, CC BY 2.0, CC BY-SA 4.0; titles, authors and licences in the catalog record) | every height above the road, the heel and tail truss layout, colours, house details. Kept in ignored `tmp/` only |

## Frame

Authored in bridge coordinates (`lefty-odoul-bridge-site.js`): B along the axis toward the north-west heel, 0 at the middle of the leaf; y above the pavement (local `y = 0`, flat-map grade); V across, positive toward the east-north-east (Oracle Park side), 0 at the middle of the 24.5 m deck. Turned once onto the mapped bearing 327.5 deg and baked in. The origin sits on the centre line 8 m from the leaf centre toward the heel, the middle of the 90 m structure (`[-122.390281, 37.776798]`, `padM` 52). No terrain, sea level or Mercator stretch is baked in. Checked by test: the OSM sidewalk ways land at V = +-11.3 m and B = +-23 m.

## Dimensions

| Quantity | Model | Status |
| --- | --- | --- |
| Overall length (house rail to counterweight tail) | 88.4 m | published 89.9 m (295 ft) |
| Leaf (bottom chord) | 44.6 m | OSM outline 44.6 m; published 43.6 m (143 ft) |
| Width over sidewalk railings | 24.6 m | published 24.7 m (81 ft) |
| Truss planes | V +10.2 (east), -6.7 (west) | the "cantilevered from the western truss line" note and the mapped heel outline (V -7.9..+10.7); the west plane is pulled inboard of the outline so the westernmost lane stays clear; planes estimated |
| Truss panels, depth | 10 panels of 4.46 m, top chord 8.8 m above road | estimated (photographs) |
| Heel knuckle (leaf trunnion) | 22.8 m, laced inclined chords from the top chord at B 11 | estimated |
| Tower column, front leg | column B 39, 18 m; leg 22.9 to 37.3 m | estimated |
| Counterweights | 7.6 m x 11.3 m x 3.6 m, underside 6.3 m above the road, one inboard of each frame | block size estimated; the published 2,250 ton total (press) is not used |
| Top of lamp masts | 25.8 m | estimated (`SPEC.height`) |
| Operator's house | 9.3 m high, balcony slab 8.6 x 7.2 m | estimated; outline from OSM |
| Clear height under overhead members | at least 5.4 m between the trusses; nothing below 5 m inside any mapped lane or the cycle track | design rule, tested |

## Materials

Seven names, same keys in light and dark: `steel` (black riveted steel and railings), `concrete` (counterweights, house plinth and balcony), `house` (oxblood panels), `trim` (verdigris roof, mullions, frames), `cream` (huts), `glass` (operator's cab), `lamp` (bridge lamps, unshaded so they stay lit at night). Colours follow the 2016-2025 photographs; the dark theme is dimmer but legible.

## Modelling decisions

- Superstructure only. Every structural member between the trusses is above 5.4 m (tested with 300+ upward rays per LOD). The mapped lanes (OSM carriageway centre lines V -9.1, -2.45 two-lane way, +3.6, cycle track +7.75, taken as 3.3 m lanes) are checked directly: 1,000+ upward rays per LOD plus every vertex under 5 m must stay outside each lane's width, so the west truss' 1.4 m shoe plates end at V -7.4 and the east ones at +9.5. The sidewalks are open. The lowest vertex is 0.06 m, so nothing is coplanar with the provider pavement.
- Pieces are convex solids with different member thicknesses wherever they overlap, so no two faces share a plane (checked with a scratch pairwise coplanarity pass: nothing under 2 cm, large surfaces at 7 cm or more).
- The two operator houses are the only footprint rings: the provider extrudes OSM ways 579664204 and 1006830800 as buildings and the model draws both itself.
- Far LOD keeps the Pratt truss, the heel frame, tail truss, counterweights, houses and rail lines (same bounding box within 1.1 m) and drops lacing, gusset plates, rail posts, lamps, windows and mullions.

## Approximations

Closed position only (the leaf cannot be shown raised). The members' exact sections, panel count, the lacing pattern, the tail-truss web and the counterweight steel "ears" are visual estimates, not shop drawings. The steel guard plate on the front leg stands for the stair and its rails. The approach girders, piers, fenders, gate arms, signals and signs are not modelled. The mapped heel outline is asymmetric (V -7.9 to +10.7); the east frame matches it, the west frame sits 1.2 m inboard of it because the outline would put low steel 0.65 m into the westernmost lane.

## Costs

Near 5 480 triangles, 7 draws, 296 KB; far 1 708 triangles, 6 draws, 97 KB (budget: 120 000 / 40 / 4.5 MB and 30 000 / 10 / 1.2 MB; aim 15 000 and 3 000). Desktop numbers, not Tesla measurements.

## Verification

Procedural source and exported GLB, near and far, light and dark, with the red footprint rings (`tmp/san-francisco/shots/lefty-odoul-bridge/`): overview, side elevation, plan (`--top`, north-up: the structure runs NNW-SSE with the counterweights at the north-west end and both house rings enclosing their buildings), driver's eye from the south-east, from the north-west, heel frame, under the counterweights, operator's house, toe, leg, and a distant far-LOD view. Compared with the 2007, 2010, 2014, 2016 and 2025 Commons photographs. Review round 1 (PASS-WITH-NITS): moved the west truss plane from V -7.4 to -6.7 after the reviewer found its low steel 0.65 m inside the westernmost lane, extended the test to the mapped lane centre lines, lifted the dark palette (steel #535a64, oxblood #7e3340, concrete, cream) after the dark renders read almost black, and added riveted straps on the front leg, bands on the column, gusset plates at the frame joints, two extra tail-truss posts and a hooded, louvred, glazed machinery house under the apex. Changes made because of what the renders showed: the apex was raised and the heel flanges, chords and leg thickened (the first model looked spindly against the photographs); the counterweights were enlarged and lowered to the photographed 6 m clearance; the truss planes moved from a symmetric +-10.2 m to +10.2 / -7.4 m after the HistoricBridges note and the mapped heel outline; sliver-like stair posts and a roof/fascia overlap were removed; overlapping members were re-thickened after the coplanarity pass.

| Environment | Status |
| --- | --- |
| Inspector, exported GLB near/far, light/dark | verified (screenshots above) |
| Cityscape, flat ground | not tested yet, integration is checked separately |
| Full 3D world, topography | not tested yet, integration is checked separately |
