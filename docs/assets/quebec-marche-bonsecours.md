# Marché Bonsecours

Asset `marche-bonsecours`, 350 rue Saint-Paul Est, Vieux-Montréal. Original procedural model of William Footner's market hall as it stands today (built 1844-1847; the portico of Doric columns completed in 1860; the dome rebuilt after the 1976 fire). Contract: [3d-quebec-landmarks.md](../quebec-landmarks.md). No scan, traced mesh, photograph or texture is in the repository or the GLBs.

## Identity and what a driver sees

From the Old Port at 800 m: a very long, low block of grey stone with a metal roof, and in the middle of it the silver ribbed dome on its drum with a small pale-stone lantern and a thin silver mast, the one thing every Montréaler recognises. From rue Saint-Paul at 100 m: the Doric portico of six columns under a pediment (a medallion in the tympanum), the central block rising behind it with the drum, and either side two storeys of tall windows in a steady rhythm of about 4.7 m bays under a bold cornice, ending in three-storey pavilions with gables. On the river side (rue de la Commune) the wall stands on basement arches, with two projecting bays. At night the windows and the lantern are lit.

## Sources and dimension table

OSM way 87389029 (the market) gives the whole plan; building:part 207977352 ("Le Cabaret du Roy", a 9.6 x 20 m slice across the full depth one bay west of the centre) lies inside it and belongs to the market. The neighbours (Auberge Alt Hostel and the other 1244238xxx blocks across rue Saint-Paul, the Chapelle Notre-Dame-de-Bon-Secours, the Kiosques du Vieux-Port) are separate and not listed. No height or level is mapped. Prose: Parks Canada / Canadian Register of Historic Places ("a monumental, domed masonry building that stretches a full city block", "symmetrically organized facades with a ground-floor arcade, tall central dome, and projecting pavilions", "doric columns, pilasters, and pedimented entry bays"), the Répertoire du patrimoine culturel du Québec (two main floors with three-floor pavilions at each end and a central drum tower with dome; the Propylaea-inspired Doric portico of six columns on rue Saint-Paul), the Canadian Encyclopedia (cast-iron columns made in England, portico completed 1860) and Wikipedia (535 ft long). Photographs fill in the rest.

| Feature | Model | Basis |
| --- | --- | --- |
| Length | 164.2 m (u = -82.1 to +82.1) | **OSM** way 87389029; Wikipedia 535 ft = 163 m |
| Main body depth | 19.3 m (front v = -9.5, river wall v = +9.8) | **OSM** |
| End pavilions | 15.2 m long (u 63.1 to 78.3), 24 m deep (v -11.9 to +12.1), plus a 3.8 m end bay 19.7 m deep | **OSM** outline |
| River bays | 13.6 m wide, 1.7 m (east) and 2.0 m (west) proud | **OSM** |
| Saint-Paul bay | 13.4 m wide, 0.7 m proud, east half only | **OSM** |
| Portico | 19.8 m wide, edge of the platform 3.8 m in front of the wall (v = -13.3), six columns | **OSM** footprint; six Doric columns **sourced** (RPCQ, Parks Canada) |
| Bearing | long axis 18.2 deg true (+u toward NNE); the Saint-Paul front faces 288.2 deg | **OSM**: every edge longer than 9 m is at 17.7 to 18.6 deg, length-weighted 18.2 |
| Storeys | two in the wings, three in the pavilions and end bays | **sourced** (RPCQ) |
| Wing cornice | 12.9 m (cornice 12.0 to 12.9, parapet to 13.4); roof ridge 15.4 m | **estimated** from photographs |
| Plinth / main floor | 1.7 m | **estimated**: absorbs the +-1.4 m of slope (see terrain) |
| Window bays | 4.7 m pitch, 1.5 x 3.5 m (ground, 2.5 to 6.0) and 1.5 x 3.6 m (upper, 7.3 to 10.9) | **estimated** (counted on photographs) |
| Pavilion | cornice 14.8 m, gable ridge 18.0 m, three window rows | **estimated** |
| Central block | 19.8 m wide, cornice 18.8 m | **estimated** (photographs 2 and 5) |
| Portico columns | shaft 1.7 to 8.9 m, 1.16 to 0.96 m, at u = +-1.78, +-5.34, +-8.9, entablature to 12.6 m, pediment apex 15.6 m | spacing from the 19.8 m OSM width; heights **estimated** |
| Drum | 16 bays, 15 m across the pilasters, windows 1.3 m, from 19.9 to 26.9 m | **estimated** (photographs 2, 4 and 5 give about 15 m) |
| Dome | tin, 24 ribs, 15.2 m across at 27.5 m, crown about 35 m | **estimated** |
| Lantern, mast | lantern 34.8 to 39.2 m (pale stone core with eight columns), cone cap to 41.2 m, silver mast to 49.4 m | **estimated** |
| Total height | 49.4 m to the mast tip | **estimated**: the popular "100-foot dome" (30.5 m) above the 18.8 m block roof, which agrees with the photograph proportions; no published total |

## Frame, origin and rotation

Real metres, +X east, +Y up, +Z south. `origin` is the area centroid of the mapped outline, [-73.55151, 45.50894], on the long axis halfway between the end pavilions. The model is authored in a facade frame (u along the market toward the NNE, v from rue Saint-Paul to the river, y up) and rotated once by `ROTATION = 90 deg - 18.2 deg` about y (`marche-bonsecours-site.js`), so the plan sits in its footprint; nothing else rotates it. The red rings of the plan view in `shot.mjs --top` follow the model. `y = 0` is the mid-slope grade of the block: nothing is baked for terrain, sea level or latitude. The market stands 17 to 20 m above sea level.

## Materials

Nine named materials, same keys in light and dark: `stone` (the cool grey cut limestone walls, `#9c9fa0` by day; first pass `#a39f97` read taupe-beige against the cooler grey of the photographs), `base` (the darker plinth and basement arches, `#878a8b`), `pale` (portico, cornices, window lintels and sills, drum, the lantern pedestal, core and columns, chimney caps; painted stone), `roof` (blue-grey metal roofs), `tin` (the silver dome, cap, ball and the mast), `glass` (doors and basement arches, dark), `glow` (unshaded: the windows, warm at night), `metal` (muntins only) and `lamp` (unshaded: eight narrow slits in the lantern, dark by day, lit at night). The far model folds `base` into `stone` and `glass` and `metal` into `roof`, so it draws five materials (it has no `lamp` slits).

## Modelling decisions

- Walls with windows are slabs with the openings punched through (`marche-bonsecours-kit.js`, the Ferry Building's approach); the glazing is tucked 0.1 m into the back of the 0.9 m reveal and the hidden back cap is dropped, so a facade of 235 openings has real reveals and no coplanar sheets. Each window has a pale lintel and sill 0.15 m proud and 3 cm clear of the reveal, and (near) a muntin and a transom as flat quads.
- Trims and cornices stand proud by 0.15 m or more; every trim run goes 5 cm into the block, pavilion or bay it butts against. `qa-metrics.mjs`: 0 coplanar pairs, 0 % back-face hits.
- Wings: a continuous plain wall slab per wing and face (the projecting bays are separate slabs in front of a solid stretch of wall), string course between the storeys, cornice and parapet, a shallow metal ridge hidden behind the parapets. Pavilions: gable slabs (the stone gable is 0.9 m thick, which reads as a coping) and a gabled metal roof starting behind them; the end bays are flat-roofed.
- Portico: three stepped tiers inside the OSM edge, six tapered 14-sided columns with echinus and abacus, a solid architrave and frieze so the soffit closes the portico, a cornice, a pediment slab with a raking cornice, a disc for the medallion, a gabled metal roof to the central block, and a back wall with three doors and three windows.
- Drum and dome (`marche-bonsecours-dome.js`): a 16-gon drum with a pilaster on every corner and an arched window with muntins on every face, a stepped base and entablature, a ribbed tin shell built as alternating rib and groove columns (24 ribs, 48 columns, flat shaded), a 12-sided lantern pedestal, a pale stone octagonal core with eight slender columns round it and eight narrow `lamp` slits between them (near; the photographs show a pale stone lantern, and the first pass drew the core as a dark lamp void that read near-black, with a `metal` mast that did the same), a cone cap, ball and a 5-sided mast in the dome's `tin`. Four stone chimney stacks stand on the block roof.
- Far LOD: the same plan and silhouette. Walls are plain boxes and the windows flat quads 0.15 m proud (the wing walls are longer than 50 m); the columns are 7-sided, the dome has 12 ribs, no muntins, lintels or sills, no basement slabs, no pilasters. The mast is kept (it sets the 49.4 m bounds) and the lantern core is a plain pale cylinder.

## Terrain notes (Full 3D world)

The public DEM (Terrarium tiles, z12, z14 and z15 agree) under the market, sampled in the facade frame: at u = 0 it reads 20.9 m at 25 m inside rue Saint-Paul, about 20.0 to 20.2 m at the Saint-Paul wall, 19.1 m mid-block, 17.9 to 18.1 m at the river wall, 16.8 to 17.0 m at 25 m toward the river and 15.1 m at 40 m (the Old Port). Along the 164 m length the change is about 1 m (rising slightly to the NNE). So the ground falls about 2 to 2.7 m across the block, 4 m or more over the streets either side. That is above the 2 m threshold, and the default 60 m disc takes the **lowest** sample (about 15 m, the Old Port side) and would leave the Saint-Paul front on a deep wall of fill. `spec.terrainPad` is therefore the outline (way 87389029) held at the **median** DEM of its own vertices (about the mid-slope, local y = 0) with a 6 m feather: both streets run right at the walls, so the blend must not reach the next building. A two-terrace pad is not used: the terrain lattice is about 30 m, which could not draw a 2 m step 20 m wide inside the block. The model carries the rest: the real street is about 1.4 m above the model's grade on rue Saint-Paul and 1.4 m below it on the river side, so the front stands on a 1.7 m plinth (with a three-tier podium under the portico) and the river wall on its plinth with basement arches (shallower than the real arcade, whose lower part would be below the pad).

What to expect in the app (not tested): the flattened pad is a level platform under the block, a 2 m cut on the Saint-Paul side and a 2 m fill on the river side, blending back to the DEM within 6 m; if the fill reads as a bulge at the de la Commune wall, the cure is a lower `refs`/`datum` weight on the river vertices, not a terrace. Cityscape ignores the pad and is flat.

## Approximations and what is not modelled

Every height, the window sizes and rhythm, the drum and dome proportions, the roof pitches (the real wing roofs may be steeper), the plinth, the basement arches and the stepped podium are estimates from five photographs. The medallion is a plain disc; the lettering MARCHÉ BONSECOURS on the frieze, balustrades and railings on the parapets, door detail, the cast-iron entasis, quoins and stone coursing, the interior, the market-day stalls and street furniture are not modelled. The dome's floodlighting (it changes colour through the night) is not modelled: at night only the windows and the lantern are lit. The real river facade is probably a little taller than the model's (a full basement storey on the lower ground). This is a deliberate flat-map compromise and stays: by the builder's own reading the river facade is about 1.4 m (about 10 % of the 12.9 m cornice) shorter than the real one and the 1.7 m Saint-Paul podium is higher than the real street step, neither of which can be checked from the photographs; the 1.7 m plinth is what absorbs the +-1.4 m of slope on a rigid model. The portico's depth (2.4 m from the wall to the column axis) follows the OSM edge and may be shallower than the real one. Whether the river-side bays carry pediments is not visible in the photographs and they are flat-topped.

## Costs and verification

| | triangles | draws | bytes |
| --- | --- | --- | --- |
| near | 13 067 | 9 | 784 KB (803,060 bytes) |
| far | 3 029 | 5 | 164 KB (168,388 bytes) |

Budget (building): near <= 60 000 / 14 / 2.5 MB, far <= 12 000 / 8 / 500 KB. `qa-metrics.mjs`: no issues, minY 0, top 49.4 m, 0 coplanar pairs, 0 % back-face hits over 167 outside-in rays (after the QA colour and lantern pass).

Looked at (`tmp/quebec/shots/marche-bonsecours/`, ignored by git): the procedural near light contact sheets (`overview`, `facade`, `roof`, `dome`, `river`, `portico`, `pavilion`, `end`, `arcade`), a top view with the red OSM rings, the far dark sheet (`overview`, `facade`, `river`, `dome`), and the **exported GLBs**: near light, all nine views, and far dark `overview`, `facade`, `river`, `roof`. Compared with the Commons photographs listed in the catalog record (portico and dome from rue Saint-Paul, dome at dusk, the river side from the Bassin, the 1948 front). Changed because of them: raised the lantern and mast (photographs give a mast about 0.55 of the drum width, which also puts the total near 49 m rather than 46 m), added window lintels and sills (the wing windows read as holes in a grey wall without them), added the medallion disc and the chimney stacks (visible in the dusk photograph), made the dome tin darker, fixed the coplanar string-course and bay-trim ends the metrics found. QA pass (independent review): the lantern core and the mast rendered near-black (a dark `lamp` void and a `metal` mast) where the photographs show a pale stone lantern and a silver spire, so the core is now `pale` with narrow `lamp` slits and the mast is `tin`; the wall stone moved about 10 % toward the cooler grey of the photographs (`stone` `#a39f97` to `#9c9fa0`, `base` `#8d8a83` to `#878a8b`). The `qa-metrics` back-face sweep and the footprint test (`marche-bonsecours.test.js`: every vertex below 20 m within 0.8 m of the mapped outline; the cornices project up to 0.6 m) pass.

Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.

References: see the catalog record `prototypes/assets3d/catalog.d/marche-bonsecours.json`. Photographs (compared only, not shipped): Dpalma01 (CC BY-SA 4.0), Guilhem Vellut (CC BY 2.0), AnnaKucsma (CC BY-SA 2.5), Shrakel (CC BY-SA 3.0), Conrad Poirier / BAnQ (public domain). Mapped outline, bearing and bay positions © OpenStreetMap contributors (ODbL 1.0).
