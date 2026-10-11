# Calgary City Hall (Calgary)

Stable asset ID: `calgary-city-hall`. An original procedural model of **Calgary City Hall, the historic "Old City Hall" (716 / 800 Macleod Trail SE)**, William M. Dodd, completed 26 June 1911, a National Historic Site of Canada. Part of the [Calgary landmarks](../calgary-landmarks.md); source in `src/peregrine/landmarks/calgary/calgary-city-hall/`. Compare the Toronto Old City Hall, also Romanesque Revival with a clock tower.

## Identity and what a driver sees

A four-storey Romanesque Revival hall of rusticated, locally quarried Paskapoo sandstone (buff, with smoother dressed bands) on a steel frame, standing on the south-east corner of Macleod Trail and 7 Avenue SE with its main front toward 7 Avenue (north). It was restored in 2017-2021 (97 % of the sandstone repaired, original roof tile manufacturer matched), so the model shows today's building, not the 1910 photograph (which was used for massing only).

From the road it is **the clock tower** on the north front: a square rusticated shaft with three window tiers, a belt course, a clock stage with a dial on each of its four faces and round corner columns, a cornice carrying four small cupolas, and a steep red tile pyramid with a round window on each face and a finial. At its foot, a **round-arched recessed entrance on four red granite columns** reached by a stair. Either side are the wings: sandstone walls with a rusticated plinth, rectangular first-floor and arched second-floor windows, a balustraded balcony over the first-floor veranda, a corbelled cornice, and a steep **tile hipped roof** broken by stone-gabled dormers with small arched windows and round shoulder turrets (a larger gable on the east wing), two roof cupolas, a gabled bay on the west (Macleod Trail) side, a gabled porch on the south and, on the east, a plain flat-roofed two-storey wing. At 800 m it is a red-roofed block with a slender tower with a pale dial; at 100 m it is the arch, the columns, the dials and the dormers.

The blue-glass Calgary Municipal Building (OSM way 122803594, 1985), its podium (part 1455566318), the link blocks on the hall's east side (parts 1455566323 and 1455566324, 5 and 2 levels), the parkade, the CTrain line on 7 Avenue and the street trees are not modelled and stay provider.

## Sources

| Source | What it gave |
| --- | --- |
| [OSM way 37829977](https://www.openstreetmap.org/way/37829977) (fetched 2026-10-02 through the shared helper, `tmp/calgary/calgary-city-hall/osm.json`) | The outline: 22 nodes, 1,106 m2; the tower base projecting 12.8 m wide and 2.35 m from the north wall, a west bay, a small east jog, a rear porch. Roads (way 135678690 Macleod Trail SE, 200339961/2 7 Avenue SE with the CTrain line) fix the north front |
| [Canadian Register of Historic Places, id 7562](https://www.historicplaces.ca/en/rep-reg/place-lieu.aspx?id=7562) | Four-storey sandstone building with central clock tower; rock-faced sandstone with contrasting rusticated and dressed stone; steeply pitched tile roof, stone-gabled dormers; semicircular arched recessed main entrance supported by four red granite columns; central glass dome; 1962 brick extension to the rear and the 1985 Municipal Building |
| [City of Calgary, The Making of Historic City Hall](https://www.calgary.ca/arts-culture/heritage-sites/city-hall-construction.html) and [Heritage rehabilitation](https://www.calgary.ca/arts-culture/heritage-sites/city-hall-rehabilitation.html) | The clock tower "more than 32 metres high (100 feet)"; red tile roof (about 400 original tiles kept, replacements from the original manufacturer); 15,522 pieces of sandstone; 191 original wooden windows; new steel bracing in the tower |
| [Wikipedia, Calgary City Hall](https://en.wikipedia.org/wiki/Calgary_City_Hall) | 1907-1911, Romanesque Revival (the article also says Richardsonian), four floors, Paskapoo Sandstone from the Bone and Oliver Quarry, Seth Thomas clock, recessed main entrance, 2017-2020 rehabilitation |
| Photographs (below) | The tower stages and proportions, the entrance, the wing storeys, dormers and cupolas, colours |

Reference photographs, all Wikimedia Commons, downloaded only to the ignored `tmp/calgary/calgary-city-hall/refs/` to compare, never committed: "Calgary City Hall National Historic Site of Canada 2012-09-30 12-11-21" (JaeNadon, CC BY-SA 3.0; the entrance and tower), "Calgary City Hall 1910 NA-2861-16" (unknown author, public domain; massing and the unglazed clock opening), "Old Calgary City Hall" (Rockies77, CC BY-SA 4.0; the north front and the tower stages, the main proportion reference), "City Hall, Calgary" (XeresNelro, CC BY-SA 4.0; the tower from Macleod Trail) and "Calgary AB CTrain Downtown City-Hall-Station 2022-09-26 (3)" (Milan Suvajac, CC BY-SA 4.0; only to place the neighbouring Municipal Building). No photograph, texture or scan is in the repository or the GLBs.

## Frame

Real metres, +X east, +Y up, +Z south, `y = 0` local flat-map grade (the plinth foot, on every side). Origin `[-114.05735267, 51.04606148]` is the area centroid of way 37829977. The hall stands **2.079 degrees clockwise of the grid**: the mapped walls fit a single angle to the outline (long edges at bearing 92.1 and 2.1 degrees). The geometry is authored in building axes (u along the north front, v into the building) and rotated once by `SPEC.rotationDeg = 2.079` inside the geometry; the layer never rotates it again. The tower front looks toward bearing 2.1 (`frontageBearing` 2). A numeric check (`tmp/calgary/calgary-city-hall/ringcheck.mjs`, and the landmark test) confirms every ground-level vertex of the plinth is within 0.69 m of the mapped ring, except the entrance stair and porch platform which stand out on the pavement. Nothing is baked for terrain, sea level or latitude stretch.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Top (finial) | 32.7 m | Clock tower "more than 32 metres (100 feet)" (**sourced**, City of Calgary); the 32.7 m figure comes from a secondary summary of the same height, no primary page found that states it |
| Storeys | 4 (raised basement and plinth 0-1.6 m, first floor, second floor under the cornice, attic in the roof) | **Sourced** (Wikipedia, CRHP); floor heights **estimated** |
| Outline | 42.8 x 32.4 m including the tower base, west bay and rear porch; main block 36.35 x 27.65 m; area 1,106 m2 | **Mapped** (OSM) |
| Main walls | straight east wall at 18.45 m (mapped 18.1 north, 18.8 south) | **Mapped**, simplified: 35 cm error |
| Tower base block | 12.8 m wide, 2.35 m beyond the north wall, to 7.6 m, belt course 7.3-7.9 m | Width and projection **mapped**; height **estimated** (photographs) |
| Tower shaft | 8.4 m square, 7.9-21.8 m, three window tiers (8.4-11.8, 14.1-16.0, 18.0-20.2 m) | **Estimated** from the 2012 and "Old Calgary City Hall" photographs against the sourced height |
| Clock stage | 8.0 m square, 22.4-26.3 m; dial 2.9 m across centred at 24.35 m, bezel to 3.5 m; hands at ten past ten | **Estimated**; four dials as briefed (the 1910 photograph shows an unglazed circular opening) |
| Cornice, corner columns and cupolas | 26.3-26.9 m cornice; corner columns r 0.5 m, cupola caps to 29.2 m | **Estimated** |
| Tower roof | pyramid 5 m square at 26.7 m rising to 32.0 m (about 65 degrees), finial to 32.7 m, round window on each face | **Estimated** (photographs: base about 0.6 of the stage width, apex at the sourced height) |
| Entrance | arch 4.4 m wide, sill 1.6 m, crown 6.2 m, voussoirs 0.65 m; four red granite columns r 0.25 m; seven steps plus a 1.6 m porch platform; cheek walls with globe lamps | Arch on four red granite columns **sourced**; dimensions **estimated** |
| Plinth / cornice | 1.6 m rusticated plinth projecting 0.3 m; corbel table and cornice crown 12.0-12.8 m projecting 0.75 m | **Estimated** (photographs: cornice at about 39 % of the tower height) |
| Balcony | slab at 6.65-6.95 m, balustrade to 7.9 m, projecting 0.85 m, on both front wings | **Estimated** from the entrance photograph |
| Roof | steep hip, 45 degrees, eave 12.7 m, flat top 17.7 m; a raised crown over the centre (a low tiled hip, 1.3 m above the flat top) | Tile roof **sourced**; the register's "central glass dome" is not drawn as glass (see the weaknesses); pitch, heights and crown shape **estimated** |
| Dormers and gables | 10 dormers (4.0 m wide, apex 16.3 m), a 5.4 m gable (apex 17.4 m) on the east front wing, gabled west bay (5.5 m) and rear porch (11.8 m); two cupolas | Presence **sourced** (stone-gabled dormers); positions and counts **estimated** |
| East wing | 2.6 x 9.5 m, flat roof edge at 8.9 m (stone box to 8.5 m, 0.6 m cornice cap), two rows of plain windows (2.2-4.5 m and 5.5-7.8 m, two columns) | Footprint **mapped** (the east bump, u 18.1-20.6 m; OSM also maps a 2-level link block on this side); **estimated** form: a plain lower two-storey wing, which only the 1910 photograph hints at. The first pass's pitched red lean-to was an invention no photograph supports and is gone |
| Windows | rows of 1.5 x 3.1 m rectangular (first floor) and 1.7 x 3.0 m arched (second floor) at 3.6 m pitch | **Estimated** rhythm; counts approximate |

## Materials

Six materials, all keys of both palettes: `stone` (rusticated Paskapoo sandstone walls and coursing strips), `trim` (lighter dressed sandstone: plinth-to-cornice string courses, window frames, quoins, balustrade, cornices, cupolas), `roof` (red tile), `glass` (dark window openings, clock hands and ticks and lamp posts), `granite` (the four red granite entrance columns) and `lamp` (the four clock dials and the two entrance globe lamps, drawn unshaded). Light palette: stone `#a89070`, trim `#bea888`, roof `#ab5242`, glass `#364852`, granite `#8c4a44`, lamp `#ebe6d1` (stone and trim are the first pass's `#b9a47e` / `#d0c19f` darkened by about 11 % and turned from yellow-tan toward brown, 40 to 34 degrees of hue, after a review against the photographs' brown-grey sandstone; the night values were scaled alike). The night palette dims the stone, trim and roof and turns the lamp material warm `#ffe6a4`, so the dials and the two globes are the only lit parts, as at the real building at night. Draws: 6 near, 6 far.

## Modelling decisions

* **The plan is the mapped outline**: a prism of the main walls (block, west bay, rear porch), a separate tower base, a flat-roofed east wing, with plinth and cornice crown made by offsetting the outline (0.3 and 0.75 m). Roofs and dormers are closed or half-open solids (the underside is always inside a cornice or a wall), so the valleys and hips are made by the depth buffer, never by coplanar faces.
* **Relief only where a street looks.** Full extruded surrounds (30 cm out), sills, mullions, quoins and corbel side faces are drawn on the north front (7 Avenue SE) and on the west faces (Macleod Trail) only. The east, south and rear walls face the Municipal Building and its parkade and get a flat 16 cm surround sheet, a two-face sill, flat dormer-light surrounds and quoins only at the corners a street sees; quoin tops (14 cm ledges) and baluster sides are not drawn anywhere. This took the `trim` material from 9,324 to 6,246 triangles with no change to the street faces.
* **Facades are rhythms, not textures**: rock-faced coursing is flat strips standing 7 cm proud of the wall every 0.6 m (windows stand 12 cm proud, hiding them), corner quoins alternate long and short blocks, windows are dark quads inside extruded frames, corbels are merged boxes with only their visible faces. All repeated elements merge into one draw per material.
* **The tower is the far-LOD hero**: shaft, belt courses, stage, cornice, cupolas, pyramid, finial, dials and tier windows all survive in the far model; the entrance arch stays open and dark. Far drops coursing, quoins, corbels, frames, ticks, hands, lamp posts and balusters (the balcony becomes a solid parapet) and costs about a tenth of near.
* **Dials are `lamp`**: pale cream by day, warm lit cream at night. The hands and 12 ticks are a `glass` quad each, 4 to 7 cm proud.
* **Placement**: no terrain pad. Downtown around 7 Avenue SE is nearly flat; `padM` is 30 m (the footprint reaches 23.3 m from the origin, the entrance stair 20 m).

## Approximations and known weaknesses

* Carved ornament, rock-face relief, the real window glazing and the glazed veranda behind the first-floor wings are abstracted; windows read as dark openings in lighter frames.
* Window counts, the dormer and cupola layout and the whole south, east and west elevations are extrapolated from the north-front photographs and the mapped outline. The asymmetry (one larger gable on the east wing, a dormer and a cupola on the west) follows the asymmetrical mapped outline and the photographs, but is not verified from the other sides.
* The register names a "central glass dome". The first pass drew it as a dark glass lantern, which read as a hole from above and has no photograph behind it, so the raised centre is now tiled like the roof (a 1.3 m crown with no glazing). Whether the real dome shows from the street is not known.
* The tower shaft and the dial size are read from photographs, not measured: the shaft may be 0.5 to 1 m narrower than modelled.
* The east wing is a plain two-storey box that fills the mapped bump so the provider outline is covered: its height, cornice cap and two window rows are estimated, and the real link to the Municipal Building was not modelled.
* The mapped east wall jogs; the model draws it straight (35 cm).
* Cornices, balcony and porch project beyond the mapped wall (0.75 m, 0.85 m, 3.7 m); the layer removes only provider triangles entirely inside the ring, so this only affects how the model meets the pavement.
* Triangle counts describe the export, not Tesla performance.

## Cost (exported default scenes)

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| Near | 9,179 | 6 | 532,508 |
| Far | 1,074 | 6 | 74,796 |

The first pass cost 12,213 / 6 / 740,040 B near and 1,064 / 6 / 74,204 B far. Budgets for a building are 60,000 / 14 / 2.5 MB near and 12,000 / 8 / 500 KB far. `qa-metrics` (run on a local copy with the shared catalog bypassed, because other records were mid-edit): 0 coplanar overlapping pairs and 0 % back-face hits in both LODs, nothing below grade, far bounds equal near.

## Verification evidence

Renders were read through `shot.mjs` (headless Chromium, GPU) into `tmp/calgary/shots/calgary-city-hall/` (ignored by git), one contact sheet per look plus a few single images:

* procedural, near, light: overview, facade, tower, entrance (sheet); roof, west, back, clock (sheet); east, corner, dormers, entrance (sheet); gable, bay, annex, rear (sheet); a street-level frontal image (`...-procedural-near-light-street.png`) compared against the "Old Calgary City Hall" photograph for the cornice-to-tower ratio (39 %), the tower tiers and the dormers; a top view (`...-top.png`, whose red ring is hidden under the roof, so the footprint was checked numerically instead);
* exported GLB, far, light: overview, facade, corner, tower; far, dark: overview, facade, tower, back; near, light: overview, facade, entrance, roof; near, dark: overview, facade, corner, tower.

What the looks decided: the first sheets matched the photographs (tower stages, entrance, steep roofs, dormers, cornice), so no massing was changed; the window glass was lightened (`#2f3e45` to `#364852`) because it read as black voids, and the stone was warmed and the roof reddened a little (`#b3a182` to `#b9a47e`, `#a8503f` to `#ab5242`) against the sunlit photographs. Before the first render the porch was extended into a 1.6 m platform so the granite columns stand on it, the stair cheeks were pulled back from the columns and the cornice, roof and dormers were arranged to avoid coplanar faces; the QA run confirmed none remain.

`calgary-city-hall.test.js` pins: the outline (area and spans in building axes), the finial at 32.7 m over the tower axis in both LODs, nothing taller than 22 m away from the tower, a lamp-material dial of the right radius on all four stage faces, the open dark doorway and the red granite columns beside it, the cornice at 12.8 m, the roof top at 17.7 m and the 45 degree slope, the east gable, windows on the east wing, the plinth within 0.75 m of the mapped ring, far-LOD silhouette and cost, palettes, and the exported GLB's bounds, dial and doorway; since the fix pass also the flat east wing, the tiled crown, street against flat surrounds and the sandstone colour (see below). `calgary.test.js` passes for this landmark.

### Review fix pass (2026-10-02, independent review: PASS-WITH-NITS, recognisability 4/5)

Four findings, all addressed: (1) the east annex's red lean-to is deleted and the mapped bump is a flat-roofed two-storey sandstone box, kept (rather than deleting the wing) because the mapped outline has a 2.6 x 9.5 m bump there that the model must cover so the provider's walls do not poke through, and because the 1910 photograph and OSM's 2-level link block both point to a lower plain wing on the east; (2) the dark slate patch (the glass lantern) is now `roof`; (3) `stone` and `trim` are darker and browner; (4) `trim` fell from 9.3 k to 6.2 k triangles (surrounds, quoins, corbels, balusters). `qa-metrics` after the pass: 9,179 / 6 / 520 KB near and 1,074 / 6 / 73 KB far, no budget issue, 0 coplanar pairs, 0 % back-face hits. One contact sheet (`qa-sheet.mjs`) was read: the east wing reads as a plain lower block, the roof has no dark patch. New tests pin the flat wing (no tile below 12 m, two window rows), the tiled crown, 30 cm street surrounds against 16 cm flat ones with trim under 7,000 triangles, and the sandstone hue and lightness.

## Cityscape and Full 3D world

Cityscape and Full 3D world in the running app: **not tested yet, integration is checked separately.** Expectation for Full 3D world: the default pad takes the lowest DEM sample under a 30 m disc; the area between Macleod Trail and the Municipal Building is nearly flat, so the plinth should stand on the pad without sinking, but the lead should check the 1.6 m plinth against the DEM at the south-west and north-east corners and add `spec.terrainPad` if it varies by more than about 2 m.
