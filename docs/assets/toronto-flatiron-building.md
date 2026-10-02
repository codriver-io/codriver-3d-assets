# Gooderham (Flatiron) Building, Toronto

Original procedural model of the Gooderham Building at 49 Wellington Street East, the wedge at Front, Wellington and Church Streets that Torontonians call the Flatiron. It is one folder in the Toronto set ([contract](3d-toronto-landmarks.md), [asset catalog](3d-assets.md)): `src/peregrine/landmarks/toronto/flatiron-building/`, catalog record `prototypes/assets3d/catalog.d/flatiron-building.json`, exports `public/models/buildings/flatiron-building-{near,far}.glb` and `flatiron-building.json`.

Build: `pnpm build:toronto-landmarks flatiron-building`. Tests: `node --test src/peregrine/landmarks/toronto/toronto.test.js src/peregrine/landmarks/toronto/flatiron-building/flatiron-building.test.js`.

## Identity

- Gooderham Building, designed by David Roberts Jr. for George Gooderham (Gooderham and Worts distillery), built 1891-92 on the site of the three-storey Coffin Block; Romanesque Revival with Gothic touches; designated under the Ontario Heritage Act in 1975 (Ontario Heritage Trust easement 1977).
- The model is the building as a driver sees it today: red brick on a battered Ohio sandstone foundation, four brick floors under a slate mansard, a patinated copper cornice, eight brick dormers with copper cheeks (four each side), and the rounded east apex carrying a round turret with a conical copper roof and finial.
- The 1980 trompe-l'oeil "Flatiron Mural" (Derek Besant) is painted on the back of the taller building across Berczy Park. It is not part of this model.
- Orientation: the wedge points east-north-east (axis bearing about 64 degrees) toward Church Street. The north wall (Wellington St E) runs at bearing 72.9 degrees, the south wall (Front St E) at about 56 degrees; the west end faces Berczy Park.

## Sources

Facts (used as published):
- Wikipedia, "Gooderham Building": completed 1892, David Roberts Jr., 5 floors, 16.70 m (54.8 ft) high, red brick, steep roof with eight gable dormers, four on the south and four on the north facade, Romanesque cornice and frieze above the arched fourth-floor windows.
- Canada's Historic Places (register 8311) character-defining elements: red brick walls, Ohio sandstone battered foundation, main entrance on the north facade with an elaborate hood mould and ogee arch, columnettes with Corinthian capitals and two roundels, a string course dividing the north and south elevations, a decorative frieze with carved faces, Roman arches and hood moulds, a tower at the east end.
- ACO Toronto and Taylor on History: main entrance on Wellington Street, rounded apex "topped with a pointed tower, its top still sheathed in copper", 12 ft ceilings, Otis elevator; Toronto Journey 416: conical copper tower with finial, curved sashes, ogee arches above the tower windows.
- OpenStreetMap way 300884214 (Gooderham Building, `building:levels=5`, `start_date=1892`, `height=22`): the footprint (ODbL, (c) OpenStreetMap contributors). The 14 mapped nodes give a 40 m long wedge, 15.4 m across the straight west end, and a rounded apex fitted at radius 1.9 m.

Reference photographs (Wikimedia Commons, downloaded only to the ignored `local-scratch/flatiron-building/refs/` to compare; none is in the repository or the GLB): Peter Kudlacz, "Flatiron Building Front View" and "Facade Upward View" (CC BY 2.0); DXR, "East view 20170417" (CC BY-SA 4.0); Arild Vaagen, "August 2017 01/02" (CC BY-SA 4.0); daryl_mitchell, "Gooderham Building (52656775384)" (CC BY-SA 2.0); Richie Diesterheft, "with Skyline", "Firkin", "Fire Escape" (CC BY 2.0); Mark, "(25334949747)" (CC BY 2.0); Sebastian Kasten, "2011" (CC BY-SA 2.5); Canmenwalker, "2022" (CC BY 4.0); Anthonyd3ca, "2012" (CC BY-SA 3.0); Mike from Vancouver, "(15547861149)" (CC BY-SA 2.0); Paulo O, "Toronto Flatiron (36491292975)" (CC BY 2.0); Geo Swan, "in Berczy Park" (CC0); William James, "Front and Church Streets looking SE" (public domain); booledozer and Bernard Spragg (public domain / CC0).

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Cornice crest (published height) | 16.7 m | sourced: Wikipedia 16.70 m |
| Storeys | basement plinth + 4 brick floors + dormer attic (5) | sourced |
| Footprint, length x west width x apex diameter | 40 m x 15.4 m x 3.9 m | mapped (OSM) |
| Dormers | 4 north, 4 south | sourced |
| String course | 8.5-9.3 m | estimated from photographs against 16.7 m |
| Plinth | 2.0 m, batter 0.35 m | estimated |
| Floor windows | 2.6-4.9, 6.0-8.2, 9.9-12.0, 12.9-15.0 m; fourth floor arched | estimated |
| Bays | 11 on each long elevation (pitch about 3.1-3.2 m), 4 on the west end, one narrow bay beside the apex | estimated from photographs |
| Mansard | eave 16.7 m, curb 20.4 m, 1.4 m inset | estimated |
| Dormer peak / chimney cap | 20.1 m / 22.2 m | estimated (OSM `height=22` agrees with the chimneys) |
| Turret shaft, cone base ring, cone tip, finial tip | 20.55 m, 20.95 m, 24.85 m, 26.0 m | estimated (+-1 m) from five photographs |
| Turret diameter | 3.1 m brick, 3.8 m cone skirt | derived from the mapped apex arc |

## Modelling decisions

- The plan is derived from `footprint.js` at load (`flatiron-building-site.js`): two wall lines and the west line fitted to the mapped nodes, an apex circle fitted tangent to both, so the model sits exactly in the OSM footprint (brick face 0.4 m inside it, cornice and belts within 0.05 m of it).
- `flatiron-building-parts.js` sweeps profiles along that outline (plinth, string course, frieze, copper cornice, slate mansard), so the round apex and the corners are one continuous mitred surface. Each bay of the long elevations is an extruded brick panel with real holes for the tall lower recess and the tall arched upper recess; window frames, glass, sills and hood moulds are set into them, so openings read from oblique views. The apex has four floors of curved bay windows (two per floor either side of a brick pier on the axis) built as cylinder sectors; the turret repeats this with two arched windows.
- Near only: frieze dentils and interlace blocks all round, basement windows tilted onto the battered plinth, the north entrance doorcase, the apex door, two fire escapes (four landings and zigzag flights), roof lights on the slate beside the turret, window meeting rails, chimney flue caps. About a quarter of the windows are the self-lit `glow` material (warm at night, glass-coloured by day).
- Far keeps the wedge, plinth, string course, cornice, mansard, all eight dormers, the chimneys, the bays' dark window panels and the turret with its cone and finial, at about 8% of the near triangle count.
- Materials: `brick`, `recess` (the shadowed reveal behind the piers, darker because the runtime shades by normal only and casts no shadows), `stone`, `slate`, `roof`, `copper`, `glass`, `iron`, `glow`; light and dark palettes share keys.

## Approximations and limits

- No survey exists in the sources: floor levels, window sizes, bay counts, dormer and fire-escape positions, the turret and cone heights and the ornament are estimates from photographs. The carved faces of the frieze, the tracery over the turret windows and the ogee curve of the doorcase are stylised.
- The west end (Berczy Park side) is not photographed here and is drawn as a plain brick wall with four bays and the mansard hipped round it; the heritage easement excludes that facade.
- The rooftop is a flat grey plate with chimneys, dormer roofs and roof lights; nothing on it is surveyed.
- Fire escapes and their landings hang about 0.65 m beyond the footprint (they overhang the street); everything else is within 0.45 m of the mapped outline.
- Ground is flat local grade (y = 0); the site is close to level. No terrain, sea-level or latitude stretch is baked in.
- No Tesla hardware measurement. Software-GL screenshots are not device timing.

## Costs

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 32 865 | 9 | 1 917 976 |
| far | 2 728 | 7 | 145 976 |

Budgets are 160 000 / 48 and 45 000 / 14; far is 8% of near.

## Verification evidence

Rendered with `local-scratch/shot.mjs` (headless Chromium on the GPU, red footprint rings, 10 m grid) and read against the photographs above, source and exported GLB, near and far, light and dark:

- Front (apex-on), rounded bays, turret and both rows of dormers against Kudlacz "Front View" and Vaagen "August 2017 01": `flatiron-building-glb-near-light-apex.png`, `...-procedural-near-light-cmp-front.png`.
- South elevation against daryl_mitchell "(52656775384)" and DXR "East view": `...-near-light-facade.png`, `...-cmp-east.png`, `...-close-south.png`.
- Back and north elevation, the west end and the roof from above: `...-near-light-structure.png`, `...-west.png`, `...-roof.png`.
- Street level and about 100 m: `...-street.png`, `...-d100.png` (near and far).
- Turret close-up: `...-turret.png`. Exported GLB near (overview, apex, roof, street, structure) and far dark (overview): `flatiron-building-glb-*.png`.
- Changed because of what the screenshots showed: the recess reveal was invisible (same brick colour) so a darker `recess` material was added; the turret windows were too small and the corners above the arched heads showed as dark squares, so they were enlarged and filled with brick; the mansard and turret heights were raised after measuring the cone ring and dormer peaks against the eave in five photographs; the cone skirt, the apex door and the cornice were pulled inside the mapped outline; the far model gained lit windows so the dark theme reads.
- `flatiron-building.test.js` (12 tests) pins the mapped wedge and its orientation, the 16.7 m cornice, the 26 m tip, the cone skirt radius, the turret solid from every side, paired curved windows either side of a brick pier at all four floors, recessed 0.4 m glass (each window layer stands 5 cm proud of the one behind it, so no two faces share a plane) with a flush pier between each pair on both long walls, the projecting string course, four dormers per side in both LODs, chimneys, the fire escapes and doorcase, containment within 0.45 m of the footprint, triangle winding against vertex normals, far bounds within 0.8 m of near, palettes and the exported GLBs.

## Placement modes

- Cityscape (flat ground): not tested yet, integration is checked separately.
- Full 3D world (topography): not tested yet, integration is checked separately. The model stays rigid on its own plinth and bakes no terrain datum.
