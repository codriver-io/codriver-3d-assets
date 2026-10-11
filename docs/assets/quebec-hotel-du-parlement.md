# Hôtel du Parlement (Québec)

Stable asset ID: `hotel-du-parlement`. Original procedural exterior of the Hôtel du Parlement, 1045 rue des Parlementaires, seat of the Assemblée nationale du Québec: Eugène-Étienne Taché's Second Empire quadrangle of 1877-86, grey ashlar under slate mansards, with its clock tower on the north-east front. Not the interiors, the 2019 sunken reception pavilion and its curved esplanade stairs, the Fontaine de Tourny (a separate OSM way 108 m out on the front axis), the lamps, the grounds, or the Édifices Pamphile-Le May, Honoré-Mercier, André-Laurendeau, Jean-Talon and Jean-Antoine-Panet (separate buildings, left to the provider). Contract: [3d-quebec-landmarks.md](../quebec-landmarks.md).

## Identity and sources

Consulted 2026-10-04:

- [Wikipedia: Parliament Building (Quebec)](https://en.wikipedia.org/wiki/Parliament_Building,_Quebec): Taché, Second Empire, 1877-86, an eight-floor structure, **height 52.4 m** (citing Ledoux and Jacob 2003).
- [Wikipédia: Hôtel du Parlement du Québec](https://fr.wikipedia.org/wiki/H%C3%B4tel_du_Parlement_du_Qu%C3%A9bec): néorenaissance Second Empire style, mansard roofs, bronze statues of figures of Québec's history in the facade niches (about twenty-two are listed), two allegorical groups by Louis-Philippe Hébert crowning the left and right avant-corps (*Poésie et Histoire*, *Religion et Patrie*), the fleurdelisé on the tower since 1948, the 2016-19 reception pavilion under the main entrance.
- [Répertoire du patrimoine culturel du Québec, Hôtel du Parlement](https://www.patrimoine-culturel.gouv.qc.ca/rpcq/detail.do?methode=consulter&id=105639&type=bien): four rectangular wings round a square courtyard, four storeys under mansard roofs, a central tower of eight storeys, half projecting, on the main front, with a clock, a pavilion roof with a ridge terrace and an iron crest and the fleurdelisé on its mast; projecting corner pavilions under pavilion roofs with ridge terraces, projecting central pavilions under square domes with ridge terraces, pilasters, pediments, arched niches, bronze statues; a monumental fountain in a semicircular stair at the main entrance.
- OpenStreetMap through the shared Overpass queue: **relation 196002** (`building=public`, `building:levels=4`, `government=parliament`): outer way 27072400 (10 vertices) and one inner way 39012651 (the courtyard, 12 vertices); the street, stairs and sculpture nodes around it (`Escalier central du Parlement`, `La halte dans la forêt`, the Fontaine de Tourny way 577383256) to find the front. Derived coordinates © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright).
- Wikimedia Commons photographs, downloaded to ignored `tmp/quebec/hotel-du-parlement/refs/` only, to compare (nothing from them is in the repository or the GLBs): *Assemblée nationale du Québec, Canada* (Wilfredor, CC0; the front, proportions measured from it), *Jean Talon 01*, *Jean-Jacques Olier 02* (Jean Gagnon, CC BY-SA 3.0; the niche statues) and *Guy Carleton Lord Dorchester 03* (sculpture Alfred Laliberté, photo Jean Gagnon, CC BY-SA 3.0).
- A public Terrarium DEM tile (z15 9901/11550, 3.8 m pixels), sampled on a 4 m grid, to decide the terrain pad.

Only the tower height is a published dimension. The 93.2 m front and the courtyard are the mapper's outline; **every storey, cornice and roof height, bay and window size is estimated from the photograph**, scaled from the mapped front width (a 677 px front in the 960 px photograph, about 7.4 px/m) and cross-checked against the tower.

## Frame

Real metres, **+X east, +Y up, +Z south**. Origin `[-71.2141891, 46.8086847]` is the area centroid of the outer ring of relation 196002. The mapped walls run 48.6 and 49.4 degrees (the long sides) and 138.8 / 140 degrees; the front is the 93.2 m **north-east** edge, looking toward bearing **48.9**. Three map objects agree it is the front: the two curved `Escalier central du Parlement` flights and *La halte dans la forêt* sit on its centre line, and the Fontaine de Tourny stands 108 m out along it. (The Grande Allée runs along the south-east side, which is therefore not the front.) The model is authored in the building's own frame (`hotel-du-parlement-plan.js`: x along the front toward the viewer's right, z out of the front) and turned once by 131.1 degrees about Y at the end of `geometry.js`; the layer never rotates it again. `y = 0` is the foot of the walls on flat local grade, not sea level; no terrain or latitude stretch is baked in.

Plan, in that frame: outer envelope 93.2 x 92 m (the walls stand 0.6-1.5 m inside the ring so every cornice stays within it), courtyard x -30.0 .. 30.2, z -30.8 .. 27.4 around a T-shaped central body (the OSM notch: x -13.9 .. 14.9, z -12.4 .. 11.0 and a stem to the front wing), wings 13-16 m thick, four corner pavilions 13.2 x 16.6 m, a 29 m central frontispiece, a 14 m rear projection.

## Dimensions

| Feature | Value | Source |
| --- | --- | --- |
| Quadrangle | 93.2 m front, ~92 m deep, ring area 8 538 m2; courtyard hole 2 686 m2 | OSM relation 196002 |
| Levels | 4 (ground, two storeys, the mansard attic) | OSM `building:levels`; Wikipedia |
| Tower, slate spire apex | **52.4 m** | Wikipedia (read as the tower's height to the spire apex, see below) |
| Tower crest, lantern dome, flagpole | iron platform 52.4-52.8 m, ribbed lantern, dome to 57.2 m, pole to 64.8 m | estimated from the photograph |
| Tower plan, stages | 11.0 x 10.8 m (widened 15 % from 9.6 x 9.3 m after a review of the oblique views; a frontal check against the lead photograph reads the shaft at about 10.6 m, 0.11 of the 93 m front); portal to 5.2 m, windows at 9, 14.6, 19.4 m, lower cornice 24.4 m, arched window 25.2-28.5 m, dials centred 31.2 m (2.4 m across), belfry cornice 33.0-34.2 m, belfry window 35.7-40.4 m, top cornice 42.8-44.1 m, four corner turrets with caps to 47.1 m | estimated |
| Wing walls | plinth 1.2 m, storeys with sills at 1.6 / 7.3 / 12.8 m, cornice 18.0-19.2 m, mansard deck 22.8 m, dormers over every bay | estimated |
| Corner pavilions | 13.2 x 16.6 m, cornice 25.6 m, steep mansard to 31.0 m, shallow crown 32.8 m, iron mast 38.4 m | estimated |
| Central frontispiece | x -14.5 .. 14.5 m, projects 1 m, cornice 23.0 m, aedicules with sculpture groups at x = +-10.0 m to about 27 m, corner finials | estimated; groups from Wikipédia |
| Chamber body | 28.8 x 23.4 m, walls 17 m, mansard to 20.6 m | OSM hole outline; height guessed (barely visible) |
| Overall | 128 x 128 m in east/south axes (the plan is turned 49 degrees), **64.8 m high** (the flagpole tip) | model bounds |
| Statues | 30 simplified bronzes of 2.3 m (12 on ground-storey pedestals, 12 in niches on the frontispiece and tower, 6 in the two groups), against about 22 on the real facade | Wikipédia list; count and places estimated |

Cross-check of the tower height: in the photograph the spire apex stands 0.59 front-widths above the ground line; with the mapped 93.2 m front that is 53-54 m, which is why 52.4 m is taken as the spire apex rather than the crest. The iron crest then adds about 4.8 m and the flagpole about 7.6 m. If 52.4 m instead meant the crest tip, the front would have to be 83 m wide, 12 % under the mapped outline. The model keeps the mapped plan and the sourced 52.4 m at the apex, and says so.

## Model

Source `src/peregrine/landmarks/quebec/hotel-du-parlement/`: `geometry.js` (model), `hotel-du-parlement-kit.js` (boxes with omitted faces, wall slabs, windows, dormers, statue silhouettes, lofts), `hotel-du-parlement-plan.js` (plan rectangles and heights), `config.js`, `footprint.js`, `views.js`, `hotel-du-parlement.test.js`. Build: `pnpm build:quebec-landmarks hotel-du-parlement`. Eight materials, one draw each: `stone` (ashlar), `trim` (dressed stone: courses, cornices, window dressing, pilasters, the flag's cross; linear about 0.51, 15 % darker than first drawn: `#bdbaaf` by day, `#8d8980` at night, so the string courses and surrounds read against the walls), `stoneDark` (plinth, niche backs, steps, and the shadowed reveals of the window surrounds), `roof` (slate), `glass`, `glow` (the ground-storey arched windows, the clock dials and the belfry windows: pale glass by day, warm at night, unshaded), `iron` (statues, cresting, masts, the lantern, the flagpole, the portal and door panes: one dark bronze) and `sign` (the flag's blue field, unshaded).

Features present in both LODs: the four wings with plinth, string courses, frieze and cornice and three window rows with arched, lit ground-storey windows; the steep slate mansards of the wings; the four pavilions with their two-stage mansards, cresting and masts and the two front side doors; the projecting central frontispiece with its flat roof, the two aedicules carrying a sculpture group each, and the corner finials; the clock tower with portal, four dials, belfry windows, corner turrets, the steep spire, the iron platform and ribbed lantern, finial and pole, and the fleurdelisé; the open courtyard with the central chamber body and its stem; the rear projection. Near adds window frames and sills (the surrounds stand 34 cm out, so each pane sits 22 cm deep in a reveal with shadowed jambs and soffit, and the string courses are 0.5 m tall and 0.3 m proud), dormers (about 145) on every mansard, iron cresting along the wing decks and the pavilion crowns, the statues and their niche backs, pilasters, the dials' rings and hands, and the flag's cross and fleurs-de-lis. Far keeps every mass, the lit windows and the open courtyard as flat panes.

Cost (exported default scenes): **near 15 927 triangles / 8 draws / 805 504 bytes; far 2 922 / 8 / 150 988.** Budgets are 60 000 / 14 / 2.5 MB and 12 000 / 8 / 500 KB. Untested on Tesla hardware.

## Terrain (Full 3D world)

The public DEM is not flat here. Sampled over the outline it climbs **5.4 m** across the plan: 82.2 m at the north corner (the front's north-west end), 85.0 m at the east and 84.0 m at the west corner, 87.6 m at the south corner (the back's south-east end); the front's centre reads 83.9 m and the back's 86.4 m. **85.0 m median**, 82.1 m lowest: the front is the lower side and the ground rises about 2.5 m toward the back. The Colline Parlementaire is a plateau, but this slope is more than the 2 m the contract allows without a pad. The default disc takes the lowest sample (82.1 m) and would put the floor 5 m under the ground on the south-east and south-west wings. `SPEC.terrainPad` is therefore `{ rings: FOOTPRINTS, datum: 'median', featherM: 12 }`: the outer ring is held at the median (85.0 m) and blended back over 12 m. Expect the front side to stand up to about 3 m above the drawn ground and the south corner up to 3 m below it (the plinth and the 1.2 m of base hide most of the first; the second reads as a buried foot). The model is rigid on `y = 0` and does not follow the slope. Not measured in the app.

## Approximations

- Heights other than the tower, every bay and window size, the mansard and pavilion profiles (straight slopes, no concave curve), the tower's stage detail (the real belfry is more ornate), the statue count, size and places are estimated from one front photograph. The back, the two sides and the courtyard faces were not photographed: they repeat the front wings' storeys, windows and dormers, and the rear projection and the chamber body are guesses.
- The real roofs may be a mix of slate and green copper (the neighbouring Édifices have copper); the front photograph shows slate, so all roofs are slate. Roof decks are flat and plain.
- Statues are stylised silhouettes (a pedestal, two tapered torsos and an octahedron head), not likenesses; the two sculpture groups are three figures each.
- The Répertoire also lists projecting central pavilions under square domes; the mapped outline shows a projection only at the back (2 m deep, 14 m wide, modelled as a low square dome) and the photograph shows none on the front beside the tower, so the other wings stay plain.
- The sunken reception pavilion (2019) and its curved stairs, the Fontaine des Abénaquis' former place, the esplanade, the lamps and the garden statues are not modelled; the ground in front of the plinth is the flat ground.
- The ring-fit: walls stand up to 1.5 m inside the mapped ring; the tower cornice reaches the ring on the front. The wing/pavilion joins leave tiny open slivers at the courtyard corners that cannot be seen.
- Flat local ground (see Frame). No absolute altitude.

## Verification

Renders with `node .agents/skills/build-3d-city/scripts/shot.mjs hotel-du-parlement ... --out tmp/quebec/shots/hotel-du-parlement`, read against the photographs:

- Front, near, light: `procedural-near-light-photo` (a 960 x 639 camera at 108 m on the axis, the photograph's framing) against the Wilfredor photograph: tower stages (dials at the same height), pavilion roofs, wing rows, central frontispiece, statues; `procedural-near-light-facade`, `-detail`, `-tower`, `-pavilion`.
- Back, above, courtyard: `glb-near-light-back`, `-roof`, `-courtyard`, `-overview`, `procedural-near-light-top` (with the red mapped ring: the model sits inside it).
- Far and night: `procedural-far-dark-*` (facade, overview, pavilion, back), `glb-far-light-d800` (silhouette at about 780 m), `glb-near-dark-night` (the lit ground storey, dials and belfry windows).
- Exported GLB round trip: every `glb-*` shot renders the exported files.

What the renders changed: the first sheet showed squat pavilion roofs (steeper, narrower crowns now), a lantern that read as a black spike against the photograph's open iron cage (now eight ribs under a dome on a railed platform), a plain tower shaft (corner pilasters, bulging corner turrets with bands now), a weak central frontispiece (pediments over the aedicules, a pediment over each front pavilion's attic window), glass too dark and stone too green against the dusk photograph (lighter glass, neutral warm grey stone). Reading the geometry afterwards: the central block's attic windows ran into its cornice (a lower attic row now), the clock dials were exactly on the wall plane (now 8 cm out), the doors' sills sat 0.2 m below grade (dropped), the rear projection's roof was inverted (a down-facing sliver in a vertical ray scan; fixed) and the tower had no top face under its spire (a 0.4 m slit; fixed).

Deterministic checks: `qa-metrics.mjs`: 0 coplanar pairs, nothing below grade, back-face sweep 0.5 % of 207 rays (one grazing ray); a dense ray sweep after the fixes leaves 6 grazing back-face hits in 11 580 rays (thin bars and the flag's back).

Tests: `node --test src/peregrine/landmarks/quebec/quebec.test.js src/peregrine/landmarks/quebec/hotel-du-parlement/hotel-du-parlement.test.js`. The landmark test pins the 93 m x 92 m extent and 64.8 m top, nothing below grade, the 52.4 m spire slope, the crest dome and pole, the lit dial on each of the four tower faces, the flag's blue field, white cross and direction, the four pavilion crowns (32.8 m) and masts (38.4 m), the wing decks (22.8 m) and the block roof (23.0 m), the open courtyard round the chamber body (20.6 m), the lit arched windows, the portal and pavilion doors, the ten pier statues and the niche statues and sculpture groups, the north-east orientation, the containment in the mapped ring (under 3 % of upper vertices outside, every ring corner within 2.5 m of the model), far versus near bounds and cost, and the exported GLBs.

Placement modes: **Cityscape** (flat ground): not tested yet, integration is checked separately. **Full 3D world**: not tested yet, integration is checked separately (`terrainPad` declared, see Terrain; `padM = 75` covers the quadrangle and is unused while the pad is set).

Catalog record: `prototypes/assets3d/catalog.d/hotel-du-parlement.json`.
