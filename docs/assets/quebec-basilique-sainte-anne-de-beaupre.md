# Basilique Sainte-Anne-de-Beaupré, Québec

Asset `basilique-sainte-anne-de-beaupre`, 10018 avenue Royale, Sainte-Anne-de-Beaupré. Original procedural model of the present shrine basilica for Cityscape and Full 3D world. Part of the [Québec landmarks](../quebec-landmarks.md) (contract, budgets and verification rules live there).

Build: `pnpm build:quebec-landmarks basilique-sainte-anne-de-beaupre`. Source: `src/peregrine/landmarks/quebec/basilique-sainte-anne-de-beaupre/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, `basilique-sainte-anne-de-beaupre-plan.js`, `-kit.js`, `-front.js`, `-body.js`, `basilique-sainte-anne-de-beaupre.test.js`). Catalog record: `prototypes/assets3d/catalog.d/basilique-sainte-anne-de-beaupre.json`.

## What it is

The fifth church on the site, built after the fire of 1922 by the architects Maxime Roisin (Paris), Joseph-Égilde-Césaire Daoust (Montréal) and Louis-Napoléon Audet (Sherbrooke): construction from 1923-1926, towers and spires added in 1962, consecrated 1976, and still unfinished (many niches and cornices are uncarved). Neo-Romanesque with Gothic proportions, in silver-grey dressed granite under green copper roofs; the main Catholic pilgrimage shrine in North America (Wikipedia, RPCQ). The state modelled is today's.

What a driver reads: at 800 m the two tall stone spires, the long green roofs of the five-aisle nave and the crossing; at 100 m the wide front with its great round arch and rose window, the gable carrying the gilded statue of Sainte Anne between the two belfries, the three portals above the front stairs; from the north-east, the apse ringed by radiating chapels.

**Corrections to the brief, from the photographs.** The spires are **stone** (octagonal, the same granite as the towers), not copper-green; only the roofs are copper (RPCQ: "couvertures en cuivre"). The model's spires are therefore stone-coloured and the roofs a muted aged-copper green. The published spire height (91 m / 299 ft) is used, but the photographs suggest less (see Dimensions).

## Frame, origin, orientation

* Origin `[-70.928269, 47.0241087]`: area centroid of OSM way 104582533 (fetched 2026-10-03 through the shared Overpass helper).
* The mapped outline is rectilinear and symmetric about one axis running along **bearing 55.5 degrees** (north-east), measured from the long edges of the way (28.2 m nave walls at 55.4-56.0 degrees, the front at 145.5). The front is at the **south-west** end (bearing 235.5 degrees from the building toward the plaza), the apse at the north-east end. The model is authored in axis coordinates (x lateral toward the viewer's right facing the front, i.e. south-east; z along the nave with the front on +z) and rotated once by -55.5 degrees (`SPEC.rotationDeg`) when `create()` returns, so the GLB already sits in the mapped outline; the layer does not rotate it again. `frontageBearing` 235.5.
* `y = 0` is the **plaza pavement at the foot of the front stairs**. The church floor and the three portals stand 2.2 m higher (twelve steps, modelled). The walls rise from y = 0; no terrain, sea level or Mercator scale is baked in.
* The red outline test (`shot.mjs --top`) and `basilique-sainte-anne-de-beaupre.test.js` (every vertex within 1 m of the mapped ring, except the front stairs and rails) confirm the placement.

## Dimensions

| Quantity | Model | Source |
| --- | --- | --- |
| Spire tips (cross tips) | 91.0 m | published: 91 m / 299 ft (Wikipedia en/fr; RPCQ "plus de 90 m"; the sanctuary's own page says "about 100 m"; one aggregator says 82 m). See below. |
| Octagonal stone spire, tip / base | 87.6 m / base 56 m, 8.8 m circumscribed | tip from the published height less the cross (3.4 m); base estimated from photographs |
| Belfry stage, cornice | 10.2 m square, y 35 to 56 m | estimated (photographs) |
| Gable apex / statue top | 45.6 m / 51.4 m | estimated (photographs); statue modelled gilded |
| Length of the outline | 100.2 m (apse chapel to the front wall) | mapped (published 105 m "hors tout", which includes the outer stairs and steps) |
| Facade | 43.6 m between the tower flanks, 49.8 m with their side buttresses | mapped (published 48 m, sanctuary site "50 m") |
| Across the transept | 62.8 m including the 5 m-radius apsidal ends | mapped (published 61 m, sanctuary site "60 m") |
| Nave and four aisles | 41.6 m wide (central nave 14.8, inner aisles 6.8, outer aisles 6.6), 28.2 m long in front of the transept | mapped width; the subdivision and the "five roofs" from RPCQ and photographs |
| Transept / crossing | 34 m deep (z 1.2 to -29), arms to 26.4 m, high gable 17.2 m wide | mapped; the high gable width and the 24.4 m reach of the high roof are estimated |
| Choir | apse of 7.4 m radius, ambulatory 12.2 m, seven chapels of 3.4 m radius on a 15.2 m circle at 0, 25.7, 49.8 and 75.5 degrees | mapped (circle fit through the OSM outline); RPCQ says ten radiating chapels (another source twelve), the outline resolves seven |
| Floor above the plaza | 2.2 m | estimated (twelve steps in photographs) |
| Wall / roof heights | outer aisle 11 / 14.9 m, inner aisle 20.5 / 25.4 m, clerestory 29.5 m, ridges 37.5 m (nave), 37.2 m (transept), choir apse cone 37.5 m | estimated |
| Rose window | 7.5 m across, centre 26.5 m, on the back wall of a niche 0.8 m deep | estimated (photographs) |
| Great arch / central portal | 14 m wide, crown 34 m / 9.2 m wide, crown 13.8 m | estimated |

**The 91 m question.** The facade is 48-50 m wide (published and mapped) and photographs taken level from the lawn (dossier refs 1 and 5) measure 1.55 times as tall as wide to the cross tips. Correcting for the spires standing 6 m behind the front plane leaves roughly 80-88 m, which would put the real spires 5-15 percent below the published figure (300 ft is a round number, and the sanctuary and Wikipedia disagree among themselves). The model keeps **91 m** (the sourced value, and the one a test pins), so its towers read about 10 percent taller and slimmer than the photographs, while the widths follow the map. A reviewer who prefers photograph proportions should lower `TOWER.tip`, `TOWER.cross` and `SPEC.height` together.

## Materials

`stone` (mid-grey granite, `#aeb0ad` by day, a cool grey at night; the first version `#bcb9b0` read near-white cream), `recess` (shadowed stone: the arch niche, tower recesses, window surrounds, `#85878a`), `roof` (aged green copper, `#4c675b`, about 20 % darker than the first pastel mint), `glass` (dark window panels, belfry louvres, crosses), `glow` (the rose window: slate-blue by day, warm lit at night, drawn unshaded), `gold` (the statue of Sainte Anne). Six materials, six draws near and far. The spires are `stone`.

## Modelling decisions

* **The outline is the plan.** Walls follow the mapped plan inside the 1 m footprint slack. The axis frame comes from two control points (the 28.2 m nave walls and the 10.8 m axial chapel end); the mapped outline is symmetric about the nave axis within 0.1 m, so the model is built symmetric.
* **The central bay is built in depth**: a backing wall at z = 46.4 and a 0.8 m front layer into which the great arch (14 m) and the recessed portal (9.2 m) are cut, with two stepped archivolt orders and a raised ring around the rose window, so the reveals read in raking light. The rose (12 petals round a hub, glowing disc) and the arcade under it sit on the backing wall.
* **Two pier groups** (1.4 m proud of the front) with slim shafts and niches flank the arch; the towers' tall lancets, side portals (with gabled canopies), arcature bands and string courses carry the rhythm of the front.
* **Towers**: a base block with a sloped-capped side buttress and a corner pier, a belfry stage with twin round-headed openings in a framed arch, an oculus, four corner turrets with pointed caps, a corbelled cornice, an eight-sided stone spire (flat-shaded, so it reads as a pyramid of eight planes and not as a smooth cone) with eight thin edge ribs, one small gabled lucarne with a dark opening on each of its four cardinal faces, a square pinnacle at each corner of the belfry cornice, and a cross. Kept in far: the towers, the spires, the front belfry windows.
* **The nave** is five aisle widths: a central nave and two aisles each side under their own roofs (gable, two lean-tos), with pilasters, corbelled eave bands and three window stages; the roofs carry standing-seam ribs (the "decorative beading" RPCQ mentions) as thin bars lifted off the surface so nothing is coplanar.
* **The transept** is a wide low block with a higher gabled transept inside the width of the facade (photographs show nothing taller beyond the front's flanks), stone gable ends with a triple window and an oculus, and 5 m-radius apsidal half-cylinders with half-cone roofs. **The choir** has a half-cylinder apse under a half cone, a lower ambulatory ring with a conical roof, seven chapels (cylinders under cones) and the rectangular axial chapel under a gable.
* **Roofs** are closed prisms/wedges whose high ends are sunk into the walls they lean on; gable walls are separate stone slices ending where the roof prism ends, so no slope is coplanar with another surface.
* **Podium and stairs**: a 2.2 m podium and a 17 m-wide twelve-step flight with two sloped balustrades. The stairs reach 56.6 m from the origin, beyond the mapped outline (the provider draws no extrusion there); `STAIRS_PAD` (a pad ring, not a provider footprint) covers them in Full 3D world.
* **Far LOD** keeps the same envelope: towers, spires, gable and statue, the rose disc and its niche, portals, all roofs, transept, apse and chapels as coarser cylinders; it drops window rows, frames, ribs, pilasters, lucarnes and the string courses.

## Approximations

* Every height below the spire tips (the belfry stage, gable, aisle and nave walls, ridges), the aisle widths and the five-roof arrangement are estimated from photographs; the heights may be off by 1-3 m. The 91 m top is the published value and is probably high (see above).
* Not modelled: the twelve apostle statues and other carving, tracery (except a rose wheel and a few arcatures), the plaza fountain and its Sainte-Anne group, the Scala Santa and the other buildings of the sanctuary, the side flights and curved ramps of the front stairs, the uncarved niches, any lantern or flèche over the crossing (none is visible in the aerial photograph).
* The transept apses and the arm ends, the ambulatory roof pitch, the choir clerestory and everything on the north-west and north-east sides are extrapolated from the footprint and the aerial photograph; RPCQ counts ten radiating chapels where the outline resolves seven.
* Colours are flat: the stone is a pale cool grey, the roofs a muted aged-copper green (the roofs are not green in every photograph: they are snow-covered in the aerial photograph).
* Windows are dark flat panels; no interior is modelled.

## Cost (exported default scenes)

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| Near | 7,878 | 6 | 437 KB (was 7,576 / 6 / 419 KB) |
| Far | 1,668 | 6 | 101 KB (was 1,668 / 6 / 100 KB) |

Budgets 60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB. Desktop numbers, not in-car measurements. `qa-metrics.mjs`: no different-material coplanar overlaps, 0 % back-face hits in 204 outside-in rays, nothing below y = 0, far bounds equal to near.

## Terrain (Full 3D world)

The basilica stands on the flat shore terrace between Route 138 and the foot of the Laurentian escarpment. Photographs (the plaza seen from the front steps; the aerial view) show a level terrace around it; the Chapelle commémorative, 92 m to the north on the first rise of the slope, is the nearest relief. A coarse public DEM (open-meteo, 90 m samples, a surface model including buildings and trees) is too noisy to say more (7-44 m within 80 m).

`spec.terrainPad` is declared, as the review of the model asked: the mapped outline and the podium and front stairs (`STAIRS_PAD`, a 45 m-wide podium from 46.4 m and the 17 m flight with its balustrades, out to 57 m along the axis, so up to 8 m past the outline) are held flat at the **median** ground under both with an 8 m feather, instead of the default disc's lowest DEM sample, which would sink the church if the escarpment toe rises under the north-west aisle wall. Nothing outside the two rings and their feathers is flattened, and nothing conflicts: the flight stands at the plaza level that is the model's y = 0. Cityscape ignores the pad. Not verified in the app.

## Verification evidence

References (Commons, in ignored `tmp/quebec/basilique-sainte-anne-de-beaupre/refs/`, none shipped; authors and licences in the catalog record): the front from the lawn (Hayden Soloviev, CC BY 4.0) and from the plaza (Pierre André, CC BY-SA 4.0), the aerial view from the south-west (Gabriel Picard, CC BY-SA 4.0), the plaza from the stairs (Thomas1313), the 1926 construction photograph (Tomodachidami), the Chapelle commémorative (Judith Bourque).

Renders (`tmp/quebec/shots/basilique-sainte-anne-de-beaupre/`): the procedural source and the exported GLBs, near and far, light and dark: overview, facade, roof (plan), towers, side (south-east), apse, portal; a telephoto front view (`ortho-front`) compared against the Hayden Soloviev photograph; close-ups of the gable and belfries (`detail`) and the north-west side and chevet (`rear`); a plan view over the red footprint rings (`top`); contact sheets `*-glb-near-light-sheet.jpg`, `*-glb-far-dark-sheet.jpg`; `*-glb-near-dark-facade.png`.

Changes made because of the renders: the first transept roof stood beyond the facade's flanks, which no photograph shows, so the high transept was pulled inside x +-24.4 m with low arms outside; the roof green was too pale and minty against the grey and was darkened; the gilded statue read as a spike and became a robed figure with a head, crown and child; the central bay was flat panels and became a real niche and recessed portal; the rear faces of the tower bases were blank 35 m walls and gained lancets and an arcature; the containment test found the arm block's corner 1.1-1.6 m outside the outline and it was chamfered; the stair rails floated 0.4 m above the plaza and were lowered; roof seams were added after the first roof looked like flat plates.

Review fix (regions batch): the stone was near-white cream and the roofs pastel mint against mid-grey granite (both darkened); the spires were smooth-shaded cones with one slit (now flat-shaded eight-sided pyramids with four lucarnes each and eight corner pinnacles); the stairs 8 m past the outline now sit in a declared terrain pad. The 91 m height is kept (the reviewer's front elevation gives 91 m / 49 m = 1.86, matching the published figures). Checked on the `qa-sheet.mjs` contact sheet.

Tests: `basilique-sainte-anne-de-beaupre.test.js` (16 tests, adding flat-shaded spire faces and the granite grey, four lucarnes and corner pinnacles inside the tower footprint, and the terrain pad covering every stair vertex; the original 12: outline length, transept span, front width and symmetry; spire tips at 91 m on two equal towers with nothing else above 56 m, in both LODs; the spires are stone, octagonal and taper by raycast; the rose window is a glowing disc 0.4 m deep in its niche, the portal door is recessed and the pier groups stand proud, the front stairs climb by raycast; five-aisle wall and roof heights and the nave ridge at 37.5 m by raycast; the seven radiating chapels on their circle by raycast; footprint containment within 1 m; far keeps the envelope; the exported GLBs match the source) plus the shared `quebec.test.js`.

Cityscape: **not tested yet, integration is checked separately.** Full 3D world: **not tested yet, integration is checked separately** (see Terrain above).
