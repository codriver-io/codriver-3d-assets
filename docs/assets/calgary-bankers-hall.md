# Bankers Hall (Calgary)

Stable asset ID: `bankers-hall`. Original procedural model of **Bankers Hall**, 855 2 Street SW: both 52-storey towers and the retail podium they stand on. Part of the [Calgary landmarks](../calgary-landmarks.md); catalogue record `prototypes/assets3d/catalog.d/bankers-hall.json`. Source: `src/peregrine/landmarks/calgary/bankers-hall/`.

## Identity and version

- Twin postmodern office towers by Cohos Evamy (now Design Dialog); structural engineers Jablonsky, Ast and Partners (Wikipedia infobox). **Bankers Hall East** (855 2 Street SW, OSM way 807001350) opened 1989, **Bankers Hall West** (888 3 Street SW, OSM way 294875872) in 2000. Both are 197 m and 52 storeys (OSM, Wikipedia; SkyscraperPage counts 45 floors and a 645 ft / 196.6 m roof for the West tower, from Google Earth) and sit on a shared four-level retail podium (the Bankers Hall mall, joined to the Plus 15 skywalks). The version modelled is the complex as it stands today (Commons photographs of undated recent years).
- What a driver sees: two near-identical pink-tan stone towers with a grid of punched windows, each capped by a **peaked, ribbed metal crown** like a cowboy hat (Wikipedia: West gold, East silver), a tall pale glass slot with a gabled pediment under the crown, shoulders that step down toward the north, and a dark band of mechanical floors under the crown. At night the offices are lit, the slot glows, the crowns stay dark and red beacons mark the tops (photograph "Bankers Halls-Calgary.JPG").

## Sources and how they were used

| Source | Used for |
| --- | --- |
| OSM [807001350](https://www.openstreetmap.org/way/807001350), [294875872](https://www.openstreetmap.org/way/294875872) | Plan of the East and West towers (`height=197`, `building:levels=52`) |
| OSM [548390399](https://www.openstreetmap.org/way/548390399) | Whole complex outline (the replaced footprint) |
| OSM [1557739183](https://www.openstreetmap.org/way/1557739183), [1557739184](https://www.openstreetmap.org/way/1557739184), [548390400](https://www.openstreetmap.org/way/548390400) | Podium parts: 4 levels, 5 levels (south entrance), 3 levels (west wing) |
| OSM 548390398 (Hollinsworth Building, 6 levels), 294876657 and parts 1557739180-2 (Royal Bank Building, 26 and 3 levels) | Neighbours that stay provider geometry; used only so the model never draws a wall in the same plane as theirs |
| [Wikipedia](https://en.wikipedia.org/wiki/Bankers_Hall) | 197 m / 52 storeys, East 1989 and West 2000, four-level podium, cowboy-hat crowns, West gold and East silver |
| [SkyscraperPage · Bankers Hall West Tower](http://skyscraperpage.com/cities/?buildingID=7073) | Roof 645 ft (196.6 m) agrees with the 197 m; finished 2000; Cohos Evamy; lists 45 floors against the 52 storeys of Wikipedia and OSM |
| Wikimedia Commons photographs (Provenance; "photograph N" below is the file `refs/N.jpg`, in the order of the provenance list) | Crown shape, colour and night behaviour, the pedimented slot, the stepped shoulders, the window grid, the mechanical band, the galleria roof; comparison of every screenshot |

The Overpass extract (`osm.json`), the plan conversion scripts and the reference photographs stay in ignored `tmp/calgary/bankers-hall/`.

## Frame, orientation and origin

Metres, +X east, +Y up, +Z south; `y = 0` is local flat-map grade, no altitude, no terrain, no latitude stretch baked in.

- `origin = [-114.069122, 51.045251]`, the centroid of the mapped complex outline (way 548390399).
- Plan rotation is baked, from the mapped rings: both towers' long axes are turned **2.4 degrees** clockwise from north (the Calgary downtown grid; the four long edges of the West tower measure 2.40-2.42 degrees, those of the East tower 2.0-2.9). `frontageBearing = 92` (the East tower's face on 2 Street SW looks east). No rotation is applied in the layer.
- Footprints: the complex outline, both tower rings and the three podium parts (six rings). The West Parkade (127734678) is not drawn and stays provider geometry, as do the Hollinsworth and Royal Bank buildings.

## Dimensions: sourced against estimated

| Quantity | Model value | Basis |
| --- | --- | --- |
| Tower height (mast tips) | 197 m | **Sourced** (OSM `height=197`, Wikipedia; SkyscraperPage 645 ft). The model puts the crown top at 194 m and 3 m masts above it: that split is **estimated** |
| Storeys | 52 (43 window rows, 2 mechanical rows, a double-height lobby and the floors inside the crown) | **Sourced** (OSM, Wikipedia); how the 52 are split and the row pitch of 3.667 m are **estimated** |
| Tower plan | two staggered blocks, 34.8 x 53.5 m main rectangle plus two 6 m ears, 34.8 x 66 m overall | **Mapped** (OSM; every ring vertex within 0.3 m, except the West tower's 1-2 m jogs which are not modelled) |
| Shaft top / crown base | 173 m | **Estimated** from photographs 1 and 4 |
| Crown | truncated pyramid, eave 31.8 x 35.6 m inset 1.5 m from the walls, flat top 10.8 x 14.5 m, 21 m high (194 m), 63 degree hips | **Estimated** (about 0.6 of the shaft width in the telephoto photograph) |
| Stepped north end | roofs at 173, 158, 134 and 116 m, steps 8, 4 and 3 m wide; the ears stop at 116 m | **Estimated** from photographs 1, 3 and 4 (tier heights read from the stepped silhouette; the direction, north, from the photographs taken from the south-west) |
| Pedimented slot | glass 4.6 m wide from 150 m to 173 m (south) and 160.5 m to 173 m (north), dark jambs, gable 9.8 m wide rising 8.2 m above the ledge | **Estimated** from photographs 3 and 4; its position beside the stagger seam from photographs 1 and 4 |
| Window grid | 1.5 m pitch, 1.05 x 2.2 m panes, sill 0.85 m, 50% self-lit | **Estimated**; the real grid is a similar punched-window pattern (photographs 2 and 4) |
| Podium parts | 17.5 m (4 levels), 21.5 m (5 levels), 13.5 m (3 levels) | Level counts **mapped**; 4.4 m a level **estimated** |
| Galleria roof | 13 x 40 m glazed ridge, 4.2 m high | **Estimated** from the atrium photograph; its position between the towers is mapped |
| Masts and beacons | two 3 m masts, four red lamps per tower | **Estimated** from photographs 1 and 3 |

## Materials

`stone` (pink-tan granite walls and piers), `glass` (window panes, a cool grey), `glow` (self-lit office windows: a glass tone by day, warm at night), `light` (the pale glass slot, self-lit), `lamp` (red beacons, self-lit), `crown` (gold-bronze roof of the West tower), `silver` (grey roof of the East tower), `metal` (slot jambs, rib pinstripes, the dark mechanical band, masts), `podium` (dark stone of the retail base), `roof` (flat roofs, ledges and tier tops). Ten keys in both palettes; the dark palette dims stone and glass, turns `glow` warm and leaves the crowns dark. The far LOD folds `metal` and `roof` into `podium` (8 draws).

## Modelling decisions

- The mapped plan reduces to a main rectangle and two ears per tower in the tower's own rotated frame, and the tower is built as a height-field over the cells of that plan: every edge where a cell is taller than its neighbour becomes a wall from the neighbour's roof (or the podium it stands on) to its own, so the ears, the three north tiers, the ledges and the East tower's 2 m jog all come out of one rule, with one flat roof quad per cell.
- Windows are one inset pane per window (0.15 m stand-off) aligned to a global column grid, so the grid is continuous over runs split by tiers; the top two floors are a dark mechanical band. The far LOD turns them into one 1.75 m glass band per floor cut into bays of at most 14 m by stone piers (about the same share of wall as the near grid, 0.4 m stand-off), a continuous glass band over the lobby, a dark band for the mechanical floors and one band per podium level.
- The crown is four planar slopes and a flat roof (near: plus 0.3 m ribs 2.4 m apart, 0.15 m proud, the standing-seam pinstripes). The slot is a flat light-glass strip with dark jambs and two bands in front of the wall; the pediment is a small gabled dormer whose back runs into the roof slope (so it has no open back).
- The podium is three extruded parts with walls only where nothing else is: no wall against a tower, none against a taller neighbour, and a wall from the lower neighbour's roof where mine is taller. Where the model meets a **provider building** (the Hollinsworth Building, the Royal Bank Building) the model's own wall is drawn 0.3 m inside the mapped line and the tower or podium wall starts above the neighbour's roof, so the model has no hole when seen alone and cannot flicker against the provider's extrusion in the app.
- Not modelled and left to the provider: the West Parkade, the Hollinsworth and Royal Bank buildings, Plus 15 bridges, street furniture, the lobby interiors and the atrium itself.

## Costs (measured by `pnpm build:calgary-landmarks bankers-hall`)

| Detail | Triangles | Draw calls | Bytes |
| --- | --- | --- | --- |
| near | 19,139 | 10 | 1,044,676 |
| far | 4,415 | 8 | 247,624 |

Budgets for buildings: 60,000 / 14 / 2.5 MB near, 12,000 / 8 / 500 KB far. Far is 23% of near. Tesla hardware cost is unmeasured; desktop timing is not in-car performance.

## Verification

Looked at (all under ignored `tmp/calgary/shots/bankers-hall/`, 1280x800 unless named): procedural and **exported GLB** renders, near and far, light and dark: the seven inspector views (`overview`, `facade`, `roof`, `crown`, `south`, `north`, `podium`) as contact sheets (`bankers-hall-glb-near-light-sheet.jpg`, `bankers-hall-glb-far-dark-sheet.jpg`, `bankers-hall-procedural-near-dark-sheet.jpg`), a top plan with the red footprint rings, a telephoto view from the south-south-west set beside the Cszmurlo photograph (near, far, dark; `cmp5.jpg`, `cmp6.jpg`), 100 m street-level and 550 m views, eye-level crown views and low ground views at the north-east (Hollinsworth side), the west edge and between the towers.

What the looking changed: (1) the first renders had every crown gold; Wikipedia states the East crown is silver, so a `silver` material was added; (2) the self-lit window colour in the light palette was brighter than the shaded glass and speckled the day view; it was darkened; (3) the crown was a squat hat against the telephoto photograph, so it grew from 16 to 21 m and the shaft top dropped from 176 to 173 m; (4) the slot read as a wide white block; it is now 4.6 m wide with a wider gabled pediment, as in photographs 3 and 4; (5) the far LOD first showed tall pale bands two floors high that read as a different building at 700 m; it now has one band per floor with stone piers, about the wall fraction of the near grid (this took far from 2.5 k to 4.4 k triangles); (6) the first towers rested on nothing where a neighbour's wall coincided, and the podium's west edge sat in the Royal Bank Building's plane; both are now recessed or start above the neighbour; (7) the East tower's 2 m jog in its south wall poked 1.5 m past the mapped ring and its slot overhung it; it is now an explicit notch and the slot sits clear of it; (8) the dark mechanical band under the crowns (photographs 1 and 4) was added; (9) the crown's dormer originally had an open back; it now runs into the roof; (10) the independent review found the crowns olive and slate and the window grid mottled by day, so `crown` went from `#70603a` to `#b79f5e`, `silver` from `#808a95` to `#c6ccd2`, and the light-palette `glow` from `#6a7c88` to `#8f969a` (within 10 % of `glass` `#9aa1a6`; the night palette is unchanged).

Deterministic checks (`qa-metrics.mjs`, run on the exported GLBs): 0 coplanar overlaps of different materials, 0% back-face hits in the outside-in sweep, lowest point 0.0 m, top 197 m, far/near bounds equal. Tests: `node --test src/peregrine/landmarks/calgary/calgary.test.js src/peregrine/landmarks/calgary/bankers-hall/bankers-hall.test.js` (mast tips 197 m, crown top 194 m and ledge 173 m by raycast in both LODs, gold and silver crown surfaces with a 2 m per metre slope through the ribs, the three north tiers and the ears, the slot glass on both faces and the gable above, the window grid and the glass bands by horizontal ray, podium roofs 17.5 / 21.5 / 13.5 m and the galleria ridge, containment of every vertex within 0.7 m of the mapped footprints, the recessed wall against the Hollinsworth Building, far at most a quarter of near).

Cityscape: **not tested** (integration is checked separately). Full 3D world: **not tested**. The standalone render does not establish placement on terrain; the model is a rigid structure on local `y = 0`. Downtown Calgary is nearly flat (the Bow River is several hundred metres to the north), so no terrain pad is declared and `padM = 74` covers the complex; the lead should check in the app that the default pad does not sink the 6 m ears and the podium edges on the slight slope.

## Open points

- The stepped north end and the crown proportions are an interpretation of photographs taken from the south and south-west; an elevation drawing would settle the tier heights, the crown height and which end steps down.
- The towers' real window and spandrel pattern is not a uniform grid (pairs of windows between wider piers, lighter spandrels near the top); the model's grid is regular.
- The crown gold and silver are flat tones; the real standing-seam metal is specular, so its colour changes strongly with the sun (it reads brass in the sunset photograph and grey-blue in cloud).
- The arched slots near the top of each tower's long face (visible on the East tower in the Cszmurlo photograph) are not modelled.
- Hollinsworth, the Royal Bank Building and the West Parkade are drawn by the map, so the lower 24 m of the East tower's east face and the podium's west edge are plain walls inside them in the standalone viewer.

## Provenance

Original geometry; no photograph, scan or texture in the repository or the GLB. Plan derived from OpenStreetMap © OpenStreetMap contributors (ODbL 1.0). Comparison photographs (Wikimedia Commons, kept only in ignored `tmp/`): "Bankers-Hall-Szmurlo.jpg" by Cszmurlo (CC BY 2.5); "Bankers hall west.jpg" by Surrealplaces (CC BY-SA 3.0); "Bankers Halls-Calgary.JPG", "Bankers Hall-Calgary.JPG" and "Bankers hall shopping atrium.JPG" by Qyd (CC BY 2.5); "Bankers Hall, NE corner.JPG" by Tyson2k (public domain).
