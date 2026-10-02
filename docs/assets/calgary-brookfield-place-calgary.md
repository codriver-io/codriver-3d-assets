# Brookfield Place (Calgary)

Stable asset ID: `brookfield-place-calgary`. An original procedural model of **Brookfield Place East, 225 6 Avenue SW** (Arney Fender Katsalidis, with Dialog as delivery architect; completed 2017), Calgary's tallest building, and of the three-storey glass pavilion beside it. Part of the [Calgary landmarks](../calgary-landmarks.md); source in `src/peregrine/landmarks/calgary/brookfield-place-calgary/`.

## Identity and what a driver sees

A 247 m, 56-storey **straight glass prism**, 66 x 41 m in plan with **rounded corners**, in dark blue reflective glass. There is no taper, no setback and no spire: from 800 m it is a tall, wide, dark rectangle whose only feature is its **crown**, an 18 m lantern of lighter glass that stands on a projecting ledge, is ringed by vertical ribs (about every 2 m) that flare out over their top 9 m, and ends in a rim whose lip flares out like a fringe. At 100 m the facade is a fine grid: a silver floor line at each floor and a mullion every 1.5 m, over a **two-storey dark lobby** set back behind slim columns and closed by a pale belt cornice. Against the tower's west and south-west faces stands the **three-storey glass pavilion** (the "50,000 square foot transparent glass pavilion" of the project description), with a gently pitched glass roof that rises toward the tower and ribs along its slope.

Modelled: the tower, the lobby, the crown and roof deck, and the pavilion. The OSM outlines decide the coverage: way 252560101 (tower) and way 575090048 (pavilion, `building=commercial`, 1 599 m2, no height tag). Not modelled: the 7 Avenue plaza and CTrain stop, the Plus 15 bridges, signage, the below-grade levels and the planned (unbuilt) West tower.

## Sources

| Source | What it gave |
| --- | --- |
| [OSM way 252560101](https://www.openstreetmap.org/way/252560101) | Tower outline (2 704 m2), `height=247`, `building:levels=56`, `building:material=glass`, `wikidata=Q15789968`. Fitted: a rounded rectangle 65.8 x 41.0 m, corner radius 5.5 m, turned 2.0 degrees clockwise |
| [OSM way 575090048](https://www.openstreetmap.org/way/575090048) | Pavilion outline (1 599 m2) against the tower's west and south-west faces. Used as the plan of the pavilion (small jogs on its west side dropped) and as a second footprint |
| [Wikipedia, Brookfield Place (Calgary)](https://en.wikipedia.org/wiki/Brookfield_Place_(Calgary)) | 56 storeys, 247 m (810 ft) at completion in 2017, tallest building in Calgary, Arney Fender Katsalidis designer and Dialog delivery architect, "a three-storey, 50,000 square foot transparent glass pavilion connected to the City's Plus 15 pedway", LEED Gold core and shell |
| Photographs (Wikimedia Commons, compared only) | The crown (lantern glass, ribs, rim, corner openings), the lobby and its belt cornice, the pavilion's glass roof and the facade rhythm; see Provenance below |

OSM geometry was read through the shared Overpass queue on 2026-10-02 and is © OpenStreetMap contributors, ODbL 1.0. The extract is kept in the ignored `tmp/calgary/brookfield-place-calgary/`.

Reference photographs, all Wikimedia Commons, downloaded only to the ignored `tmp/calgary/brookfield-place-calgary/refs/` to compare, never committed: "Brookfield Place, Calgary, southeast view from Calgary Tower 20240819 1" and "South view of Brookfield Place, Telus Sky and The Bow, from Calgary Tower 20240819 1" (DXR, CC BY-SA 4.0), "Brookfield Place from Calgary Tower, Calgary, Alberta, 2025-07-14" (Chris Woodrich, CC BY-SA 4.0), "Brookfield Place, Calgary, Alberta 2017" (Malcolm, public domain), "Calgary AB CTrain Downtown 7-Avenue-SW 4-Street-SW 2022-09-26 (5)" (Milan Suvajac, CC BY-SA 4.0). No photograph, texture or scan is in the repository or the GLBs.

## Frame

Real metres, +X east, +Y up, +Z south, `y = 0` local flat-map grade (the lobby floor and the pavilion floor). Origin `[-114.0660248, 51.0471806]` is the centre of the rounded rectangle fitted to the tower outline. The plan is authored in a frame (u east, v south) turned 2.0 degrees clockwise onto the mapped outline and rotated into the model frame as it is built, so the GLB needs no further rotation. The outline's four edges give turns of 1.3, 2.1, 2.4 and 2.5 degrees (it is a slightly skewed trace); 2.0 is their mean. The 6 Avenue SW frontage faces north (`frontageBearing` 0). Nothing is baked for terrain, sea level or latitude stretch. Downtown Calgary is nearly flat, so no terrain pad is declared (`padM` 78 covers both footprints, 75.5 m from the origin to the pavilion's far corner).

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Top of crown | 247.0 m | **Sourced** (Wikipedia, OSM `height`) |
| Storeys | 56 (the model draws 2 lobby storeys, 52 floor lines and an 18 m crown) | **Sourced** count; the split is **estimated** |
| Plan | 65.8 x 41.0 m, corner radius 5.5 m, turned 2.0 degrees clockwise | **Mapped** (OSM outline; mean residual of the outline to the model 0.2 m) |
| Floor pitch | 4.16 m (216.1 m between the 12.9 m belt and the 229 m crown ledge, 52 floors) | **Estimated** from the photographs |
| Lobby | 12.0 m of dark glass set back 0.6 m behind 0.45 m columns every 3 m, a transom at 5.6 m, a 0.9 m belt cornice standing 0.55 m proud, top at 12.9 m | **Estimated** from the photographs |
| Curtain wall | one tall glass loft, a 0.2 m deep silver floor line at each floor, a 0.1 m wide mullion every 1.5 m (about 2.2 m on the corner arcs) | **Estimated** |
| Crown | ledge 229.0 to 229.9 m (0.7 m proud), three rings at 4 m pitch, ribs 0.3 m wide every 2 m, standing 0.5 m off the glass and flaring to 0.8 m over the last 9 m, a rim 246 to 247 m with a lip that flares from 0.3 m to 0.85 m out (as far as the ledge); lantern glass lighter than the tower glass | 18 m height and ribbed lantern **observed** in the photographs; pitches **estimated** |
| Roof deck | 3.1 m below the rim, with a 14 x 14 m plant block and two low enclosures | **Estimated** |
| Pavilion | OSM outline, walls 11.5 m (west) to 17 m (tower) high with mullions every 3 m and floor lines at 4 and 8 m, a glass roof rising 0.2 m per metre toward the tower with ribs every 3 m along the slope and every 6 m across | Outline **mapped**; "three-storey" **sourced**; heights and roof pitch **estimated** from the photographs |
| Lit offices | about 24 % of the bays (near, deterministic), 2-floor coarser blocks (far) | **Estimated**; not the real pattern |

## Materials

| Name | Use | Light | Dark |
| --- | --- | --- | --- |
| `glass` | tower curtain wall | `#3f6a98` | `#1a2837` |
| `mullion` | floor lines (near and far) and mullions (near only) | `#6e8092` | `#36424e` |
| `frame` | belt cornice, lobby columns, crown ledge, rings, ribs and rim, pavilion posts and roof ribs | `#aeb8c0` | `#566370` |
| `glow` (unshaded) | lit offices; by day a slightly lighter glass blue | `#456f9a` | `#ebca8c` |
| `light` (unshaded) | the lantern glass; pale blue-grey by day, lit white-blue at night | `#8aa9c2` | `#cfe1fa` |
| `lobby` | dark lobby glass | `#2f4256` | `#161f29` |
| `roof` | roof deck and plant | `#6c7174` | `#33383c` |
| `pglass` | pavilion glass walls and roof | `#6f969f` | `#2c464e` |

The crown lighting at night is an estimate: the lantern is shown lit because it reads lit in night views of the skyline, but this was not checked against a night photograph.

## Modelling decisions

- **A prism, not a tinted extrusion.** The identity is the crown and the grid, so the budget is spent there: the 52 floor lines and the mullions are a sweep and a fin each, merged by material. The glass itself is one tall loft per ring segment.
- **Rounded corners fitted to the mapped chamfers.** The OSM outline cuts its corners by about 4 m. A 3.8 m radius poked up to 1.7 m through the outline at the crown ledge; 5.5 m hugs it (a search over radius, half-sides and turn: mean residual 0.2 m, the ledge now at most 0.9 m outside).
- **A crown that reads from 800 m.** Lighter glass, a ledge that steps out 0.7 m, ribs that flare out into a proud, flared rim lip, and a roof deck 3.1 m inside the screen. Far keeps the ledge, one ring, ribs every 4 m (0.6 m wide), the rim and the lighter glass.
- **The pavilion is part of the model** because OSM maps it as a separate building touching the tower and the Plus 15 glass pavilion is part of the Brookfield Place complex. Its east edge runs inside the tower so the roof meets the tower glass with no crack.
- **Lit offices are a deterministic share of bays**, merged into runs on straight sides, 0.16 m proud of the glass (above 0.15 m for a surface this large, below the 0.2 m mullions, so panels sit in the niches).
- **No coplanar faces by construction.** Every proud element has its own offset (panels 0.16, mullions and floor lines 0.2, belt 0.55, ledge 0.7, ribs 0.5 to 0.8, rim lip 0.3 to 0.85); open profiles (no inner face) wherever a ring would otherwise share the glass plane. `qa-metrics.mjs` finds 0 coplanar pairs and 0 % back-face hits.
- **Far** (about a fifth of near): one glass loft at 2 segments per corner, a floor line every fourth floor (0.3 m deep, 0.6 m tall, in the `mullion` tone, a draw more than before: 8) so the mirror wall does not read as bold stripes, no mullions, coarse lit blocks, a few lobby posts, the crown without its mid rings, and the pavilion as walls, an eave band and a roof skin.

## Approximations and what is not modelled

- Floor pitch, mullion rhythm, lobby height and recess, crown height split, rib pitch and flare profile, roof plant, pavilion heights and roof pitch are estimated from photographs; no drawings were used.
- The crown's corner openings seen in one photograph (a vertical slit at the corners), the curved south-west glass corner and glass roof of the pavilion, interiors, signage, the plaza and the Plus 15 bridges are not modelled.
- The tower's glass is one flat colour; the real facade reflects the sky and the neighbouring towers.
- No Tesla hardware measurements; desktop timings are not in-car performance.

## Costs (exported GLBs, measured by `pnpm build:calgary-landmarks`)

| | Triangles | Draws | Bytes | Budget |
| --- | --- | --- | --- | --- |
| Near | 14 505 | 8 | 572 KB | 60 000 / 14 / 2.5 MB |
| Far | 3 037 | 8 | 126 KB | 12 000 / 8 / 500 KB |

## Verification

All renders by `shot.mjs` (headless Chromium, red OSM footprint rings), judged against the Commons photographs; the screenshots are in the ignored `tmp/calgary/shots/brookfield-place-calgary/`.

- Procedural near, light: overview, facade, roof, crown, base, pavilion, street, corner, skyline sheet; a plan view (`--eye -10,2500,12 --target -10,0,12 --fov 5.5`) over the footprint rings; a telephoto from the Calgary Tower deck (203, 150, 322) set against the south-east photograph. Changes made from them: the first facade was a quilt of bright floor lines and bright mullions (the photos are dark glass with fine lines), so the lines became a darker `mullion` material, thinner and shallower, and the glass darker; lit panels were too dense and too bright at night (0.30 to 0.24, dimmer cream); the 3.8 m corner radius was replaced by 5.5 m after the containment test found the crown ledge 1.7 m outside the outline; the pavilion's wall junctions at the tower's north-west and south-west corners were redrawn so no slit shows into the pavilion.
- **Exported GLBs**: near light (overview, facade, roof, crown, base, pavilion, street, corner) and far dark (overview, facade, roof, crown, base, pavilion, street, skyline) sheets, plus a plan over the footprint rings: the model fills the tower and pavilion rings and shows red only at the small jog on the pavilion's west side that is deliberately dropped.
- Also from the exported GLBs: far light (overview, crown, pavilion, corner) and near dark (overview, crown, base, corner). Far reads as the same dark rectangle with the lighter crown and a coarser window pattern, but its pavilion is a plain pale block and its lit blocks are chunky at close range (the day colour of `glow` was pulled closer to the glass because of it).
- `qa-metrics.mjs`: 0 coplanar pairs, 0 % back-face hits on 384 rays, nothing below grade, near/far bounds equal.
- Tests: `node --test src/peregrine/landmarks/calgary/calgary.test.js src/peregrine/landmarks/calgary/brookfield-place-calgary/brookfield-place-calgary.test.js` (11 landmark tests, about 2 s): height, plan size and turn, rounded corners, recessed lobby and belt, mullion count, crown ledge and rib rhythm, roof deck height, lit share, pavilion wall and roof, containment inside the mapped rings (at most 1.1 m, the crown ledge at the north-west corner), materials.

## Placement status

Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately. Downtown Calgary is nearly flat (about 1,045 m); the default pad (78 m disc) should be adequate and no `terrainPad` is declared; the lead verifies it in the running app.
