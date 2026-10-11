# Château Frontenac

Asset `chateau-frontenac`, 1 rue des Carrières, Vieux-Québec. Original procedural model of the Fairmont Le Château Frontenac as it stands in 2026:
Bruce Price's 1893 Canadian Pacific château hotel with its later wings and the 1924 central tower (William Sutherland Maxwell for the Canadian
Pacific; built by Anglin-Norcross), the whole complex of the mapped hotel outline and nothing else. Contract:
[3d-quebec-landmarks.md](../quebec-landmarks.md). No scan, traced mesh, photograph or texture is in the repository or the GLBs. The Dufferin Terrace, the
funicular station, the Champlain monument, the kiosk on Place d'Armes and the neighbouring buildings are not drawn or removed.

## Identity and what a driver sees

From the river and from Lévis (800 m and more) the hotel is the long south-east facade on the lip of the Cap Diamant cliff, about 60 m above the
water: a 115 m wall of red-brown brick over a grey stone base, topped by steep verdigris copper roofs bristling with dormers, chimneys and
conical-capped turrets, with the 14-storey central tower rising behind its middle, under a steep dark roof with four corbelled corner turrets and
pinnacles (about 80 m, 18 floors counting the roof storeys). From 100 m on the Dufferin Terrace the recognisable things are the stone arcade along
the ground floor, the gabled bays and pairs of round turrets that break up the facade, the tower above the central flag bay, and the round
north-east tower with its tall cone. From Place d'Armes (north) it is the plain brick wing along rue Mont-Carmel, the three-arch gateway into the
east courtyard and the hexagonal tower. From above the plan is a ring around two courtyards with a slab (north block plus tower) between them.

## Sources and dimension table

The plan, the two courtyards, the part footprints and the storey counts come from OSM relation 32580 and its `building:part` ways (Overpass through the
shared helper and the OSM API, 2026-10-03). Eight photographs (Wikimedia Commons, listed below; downloaded to ignored
`tmp/quebec/chateau-frontenac/refs/` only to compare) informed the facade rhythm, roofs, turrets, tower and gateway. The two aerial photographs fixed
which mapped part is which (the tower block is the south-east end of the central slab, behind the long terrace facade).

| Feature | Model | Basis |
| --- | --- | --- |
| Overall height to the tower pinnacle tips | 80.0 m | **sourced**: about 80 m (79.9 m), 18 floors (Wikipedia infobox). The pinnacles are two thin metal spires at the ends of the tower ridge; the roof ridge is 77.3 m |
| Plan | outline 158 m along the terrace facade by 84 m across, 10,500 m2 with the courtyards; grid 63.5 deg east of north | **mapped**: relation 32580, outer way 27072105 (two inner courtyard ways 27072114 and 27072117) |
| Tower block | 20.3 x 41.6 m, 14 storeys | **mapped**: way 396293672 (`building:levels=14`) |
| Tower eave and ridge | eave 53.4 m, ridge 77.3 m (roof pitch 66.5 deg, a tall steep hip of about a third of the 80 m) | storeys **mapped**; floor heights (4.5 m ground storey, 3.6 m above) and the pitch **estimated** |
| North wing, west wing | 5 storeys, eave 18.9 m, ridge to 32 m | way 397610024 `building:levels=5`; the west wing from the outline only (relation `building:levels=5`) |
| Central slab north block, terrace-facade pavilion, east wing, link wing, round / hexagonal / square towers | 6 storeys, eave 22.5 m | ways 396948398, 396948396, 397610021, 396293665, 396940763, 396294279 (`building:levels=6`); the link wing and the rest of the south-east facade from the outline |
| Round north-east tower | 16 m across, shaft 22.5 m, cone to 41 m | footprint **mapped** (way 396293665); cone height **estimated** |
| Terrace turret | 8.4 m across, shaft 24 m, cone to 37.5 m | footprint **mapped** (way 1365627870); heights **estimated** |
| Hexagonal tower | 12.6 m across, shaft 22.5 m, cone to 39.5 m | footprint **mapped** (way 396940763) |
| Facade turrets | 4.4 to 5.6 m across, cones about 8 m | positions and sizes **photo estimate** |
| Facade arcade | round arches 2.7 m wide at a 4.1 m pitch, stone base 4.5 m | photo estimate (the real ground floor is grey stone ashlar, Wikipedia) |
| Gabled bays on the facade | 8 m wide, 0.8 m proud, six of them (counting the centre bay and the pavilion) | photo estimate |
| Porte-cochère | one 5.4 m and two 3 m arches in an 8 m stone base, north link wing | photo estimate; **the position is a guess from one close photograph** |
| Window grid | frame 1.9 x 2.6 m, glass 1.4 x 2.0 m with a stone mullion, 3.4 m pitch (3.3 m on the tower), 3.6 m floors | photo estimate |
| Dormers | gabled, 1.7 m wide, one row, 4.2 to 6.2 m pitch | photo estimate |
| Chimneys | 16 brick stacks 1.4 to 1.8 m square, 6 to 9 m above the roof | photo estimate |

## Materials (light / dark)

`brick` (red-brown, Glenboig brick), `stone` (grey ashlar base, trim, turrets, cornices), `copper` (the wing roofs, turret caps and dormers: a dark teal-green, linear about 0.06 / 0.14 / 0.11, `#45695d` by day and `#2e473f` at night),
`slate` (the tower's tall steep roof and the caps of its four turrets: near-black, linear about 0.03, `#2f3133` by day and `#1d1f21` at night), `glass` (window panes and arches), `glow` (30 % of panes: the same colour as `glass`
by day, warm lit yellow at night; drawn unshaded), `metal` (ridge crests, finials, tower pinnacles). Seven materials, so seven draw calls near and far.

## Modelling decisions

* **The plan is the mapped plan, unrotated.** The outline and part footprints are in `footprint.js`; `chateau-frontenac-site.js` converts them to
  model metres around the outline's area centroid and derives the hotel's grid angle (63.5 deg) from the long edges of the north wing and the tower
  block. All plan data (`chateau-frontenac-plan.js`) is authored in that grid (u along the terrace facade, v toward the river), so the blocks tile the
  mapped outline minus its courtyards. The east wing, the east front and the north-east link follow the mapped rings, which are turned about 27 deg from
  the grid.
* **Blocks, not an extrusion.** Each wing is a roofed block (hipped, with a shallow copper hip closing the top where the steep slopes stop short of a ridge, or gabled with vertical gable ends; the narrow link blocks between the wings are low copper hips, not flat decks).
  Wall faces are computed against the neighbouring blocks, so only the exposed part of every wall is drawn (a taller wall above a lower roof starts at
  that roof's eave) and no two walls overlap or share a plane.
* **Detail is quads, merged.** Windows are a stone frame and a glass pane proud of the wall (0.15 and 0.24 m, a mullion at 0.31 m), the arcade arches are
  one fan each, cornices and string courses are five-face slabs, dormers are 13 triangles each, the round turrets are 12-sided with slit windows
  and a belt under the cone, and the larger round towers have windows on every facet. Quoins, ridge crests, gable finials and turret finials make the
  roofline.
* **Far LOD** keeps every block, roof, turret, chimney, the tower and its pinnacles, and replaces the window grids with slim dark slots (about 40 % of a cell, one 3.6 m slot per two storeys, so the brick dominates; a
  quarter of them lit at night) and one narrow arch slot per 4 m of arcade. Dormers, mullions, quoins, crests and slits go. 2,712 triangles against 14,354.
* **Night.** `glow` panes are scattered with a fixed seed, so a dark-theme hotel is speckled with lit rooms; by day `glow` and `glass` are the same
  colour. The real tower is floodlit orange at night; that is not modelled (it would need a self-lit brick material).

## Terrain notes (Full 3D world)

The hotel stands on the Cap Diamant promontory. The public Terrarium DEM (zoom 15, sampled on a 10 m grid) gives 59 to 61 m under the Place d'Armes
(north) end, 62 to 64 m under the middle, 65 to 72 m at the south-west end, about 56 m beyond the east wall, and then the cliff: 53 m 15 m east of the east
wall, 42 m after 35 m, 25 m after 55 m, 12 m at the foot (the funicular covers about 60 m of drop in 50 m). The default 90 m disc would take the lowest sample
under it (the lower town side) and sink the hotel. `spec.terrainPad` is the hotel outline (relation outer ring), held at the median DEM of that outline
(the Dufferin Terrace level, local y = 0) with an 8 m feather. The terrace in front of the south-east facade is about 20 m wide (estimated from the aerial photographs) and the cliff face
starts well east of the east wall, so the pad and its feather stay on the level ground and never touch the cliff face. Expect: the south-west
end of the footprint, about 5 to 8 m above the datum in the DEM, is cut into the hill within the outline (a level terrace in reality too); the east
wall stands on a 5 to 6 m fill that blends back to the DEM within 8 m. If that fill looks like a bulge in the app, the cure is a terrace ring at a
negative offset on the east side; Cityscape ignores the pad. Not tested in the app.

## Approximations and limits

* Facade detail is read from photographs and is not a survey: window sizes, bay pitch, floor pitch, arch counts, turret and dormer positions, chimneys,
  gabled bays and cornices are plausible, not counted. Ornament (carved stone, tracery, balconies, flags, signs, doors, the lanterns on the terrace) is absent.
* The roofs of the unmapped wings (the west wing, the long south-east wing, the filler blocks) are estimated: OSM gives only the outline, five levels
  and a gabled roof for them. Roof pitches are 57 to 67 deg; wide spans close in a shallow copper hip (0.65 rise per metre, up to 6 m), which stands for the ridges and valleys the real roofs have.
* The tower stands on the mapped 14-storey block; the real central tower is likely narrower at the top and has stone-gabled dormers with a crest;
  the model gives it corner turrets, a metal crest, two ridge pinnacles and one row of stone-fronted dormers per slope.
* The courtyard fronts have the same facade pattern as the street fronts. The gallery across the east courtyard is a plain two-storey bridge.
* The position of the porte-cochère (north link wing, towards Place d'Armes) is inferred from one close photograph; the passage itself is not modelled
  (the arches are glazed).
* A few bay gables, cornices (0.55 m) and turret bellies reach up to 2.4 m past the mapped outline along the south-east facade, where the outline steps
  back by about 1 m; 1.3 % of the vertices are more than 1.3 m outside it.
* The roofs are dark verdigris copper for the wings and near-black slate for the tower; the real tower roof may be copper in a darker finish. The tower's hip is as long as the mapped block (a 20.8 m ridge), longer than the real roof's short ridge.
* Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.

## Costs (exported GLBs)

| | Triangles | Draw calls | Bytes |
| --- | --- | --- | --- |
| Near | 14,354 | 7 | 766,768 |
| Far | 2,712 | 7 | 152,100 |

Budgets (building): near 60,000 / 14 / 2.5 MB, far 12,000 / 8 / 500 KB. Costs describe scene meshes and uncompressed bytes, not measured Tesla
performance. Bounds: x -76.4 to 70.4, y 0 to 80, z -63.7 to 68.8 m around the origin (-71.2054215, 46.8118448).

## Verification evidence

Screenshots were rendered with `.agents/skills/build-3d-city/scripts/shot.mjs` (headless Chromium on the GPU, red OSM footprint rings and a 10 m grid)
and read against the references. Files are in ignored `tmp/quebec/shots/chateau-frontenac/`.

* **Procedural, near, light:** `overview`, `facade`, `terrace` (east wing and round tower), `tower`, `court`, `north` (the gateway), `roof`, `arcade`,
  `centre`, `east`, `corner` and a `--top` plan over the footprint rings (the model fills the outline and the two courtyards stay open).
* **Exported GLBs (`--source glb`):** near light `overview`, `facade`, `terrace`, `tower`, `roof`, `centre`; far dark `overview`, `facade`, `river`,
  `north`. The far model keeps the roofs, the tower and the courtyards.
* `qa-metrics.mjs`: no coplanar overlaps of different materials and no back-face or hole hits on the exported GLBs.

What was changed because of them: the east wing's east wall had no windows because windows were culled by footprint alone, and a low annex stood in
front of it (culling is now height-aware, and the annex got windows); the tower had no dormers because they were tied to the visible wall below
(dormers now follow the slopes); the facade was a flat wall under hips, so gabled bays were added and the roofs steepened; facade turrets were
needle-thin and their caps were shortened; the north-east round tower was a pale blank cylinder and became brick with stone belts and windows; the
far dark model had huge lit slots and now lights quarter-cells; turrets and bays that stuck 3 to 4 m out of the outline were pulled in; a second
dormer row poked through the ridges and was dropped; wide flat roofs read as a mint plateau and became dark decks, which in turn read as grey filler blocks and became shallow copper hips; the copper first drawn as a pastel sage became the dark teal-green of the photographs, the tower roof was raised from 74.7 to 77.3 m and darkened, and the far windows were thinned so the brick dominates.

## References and rights

* Wikipedia: <https://en.wikipedia.org/wiki/Ch%C3%A2teau_Frontenac> (80 m, 18 floors, Bruce Price 1893, 1924 expansion and tower, Glenboig brick, grey stone
  ashlar base) and <https://fr.wikipedia.org/wiki/Ch%C3%A2teau_Frontenac>; the hotel's site <https://www.fairmont.com/frontenac-quebec/>.
* OSM: relation 32580 and ways 27072105, 27072114, 27072117, 397610024, 396948398, 396293672, 396948396, 397610021, 396293665, 396294279, 396940763,
  1365627870, 396294280, 396293674, 1365627869 (© OpenStreetMap contributors, ODbL 1.0).
* DEM: Terrarium elevation tiles (zoom 15) read for measurement only; nothing is shipped.
* Photographs compared, not shipped (Wikimedia Commons): 0x010C, "2016-11 Château Frontenac 06" (CC BY-SA 4.0); Wilfredor, "Frontenac Castle, Quebec city,
  Canada 01" (CC0), "Exterior of the Château Frontenac and Terrasse Dufferin" (CC BY-SA 4.0) and "Chateau Frontenac at dusk from the Terrasse Dufferin" (CC0);
  Jeangagnon, "Chateau Frontenac 37" (CC BY-SA 3.0); Ymblanter, "Quebec City Château Frontenac seen from Terrasse Dufferin 01" (CC BY-SA 4.0); Emilemv,
  "Château Frontenac vu en avion" (CC BY-SA 3.0); Hayden Soloviev, "Chateau Frontenac and Dufferin Terrace, night aerial view" (CC BY 4.0).

Rebuild: `pnpm build:quebec-landmarks chateau-frontenac`. Tests:
`node --test src/peregrine/landmarks/quebec/quebec.test.js src/peregrine/landmarks/quebec/chateau-frontenac/chateau-frontenac.test.js`.
