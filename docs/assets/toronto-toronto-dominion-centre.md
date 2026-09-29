# Toronto-Dominion Centre

Stable asset ID: `toronto-dominion-centre`. An original procedural model of the black steel-and-bronze-glass complex Ludwig Mies van der Rohe planned for the block bounded by King, Bay, Wellington and York Streets, drawn as **one landmark with one origin**: the TD Bank Tower, the TD North Tower (originally the Royal Trust Tower), the Banking Pavilion, the TD West Tower, the TD South Tower across Wellington Street, and the raised granite plaza between them. The underground PATH concourse is out of scope. First Canadian Place and Scotia Plaza are separate landmarks and stay provider geometry, as do 95 Wellington Street West and 222 Bay Street (the Ernst & Young tower, 133 m), which are part of the owner's complex but not in Mies's black-steel vocabulary.

Build: `pnpm build:toronto-landmarks toronto-dominion-centre`. Source: `src/peregrine/landmarks/toronto/toronto-dominion-centre/` (`geometry.js`, `toronto-dominion-centre-{site,kit,tower,pavilion}.js`, `config.js`, `footprint.js`, `views.js`, `toronto-dominion-centre.test.js`).

## Identity and version

The complex as it stands in 2026: the three Mies buildings (TD Bank Tower 1967, Banking Pavilion 1968, Royal Trust / TD North Tower 1969), designated under the Ontario Heritage Act in 2003 and restored to a matte black finish, plus the later black towers the Cadillac Fairview/TD partnership added in the same idiom. The green TD signs and the 2009 living roof on the pavilion are today's state. The briefing note called the TD North Tower "Canada Trust (~148 m)" and listed a separate Inuit Art pavilion; the sources say otherwise (see the table): TD North is the 182.9 m Royal Trust Tower, and the TD Gallery of Inuit Art is in the lobby of the TD South Tower, not a building of its own.

## Sources

| Source | Used for |
| --- | --- |
| [OpenStreetMap](https://www.openstreetmap.org/way/141693728) ways 141693728 (TD Bank Tower), 141693739 and building:part 367642827 (TD North Tower), 110166031 (Banking Pavilion), 27767634 and part 367641020 (TD West Tower), 27767631 (TD South Tower); lawns 177602017 and 177602018; street centrelines. Retrieved 2026-09-29 through the shared Overpass helper (osm3s base 2026-09-29T06:18Z); the lawns and street lines from one OSM API map call for the same box. (c) OpenStreetMap contributors, ODbL 1.0. | Plans, orientation, heights (`height` tags), the origin, the ownership footprints, the plaza margins against the streets. |
| [Skyscraper Center: TD Tower](https://www.skyscrapercenter.com/building/td-tower/1211), [TD North Tower](https://www.skyscrapercenter.com/building/td-north-tower/2210), [TD West Tower](https://www.skyscrapercenter.com/building/td-west-tower/15274), [TD South Tower](https://www.skyscrapercenter.com/toronto/td-south-tower/3756/) | 222.8 m / 56, 182.9 m / 46, 128 m / 32, 153.6 m / 39; all-steel for Bank and North, concrete-steel for West, concrete for South. |
| [Cadillac Fairview, TD Bank Tower technical specification (rev. Jan 2022)](https://assets.cadillacfairview.com/m/200ef1bdeb02696c/original/Technical-Specifications-TD-Bank-Tower.pdf) | 1.52 m (5 ft) planning module, window 1.52 x 2.74 m, floor-to-floor 3.66 m (12 ft), columns 9.14 x 12.19 m, PPG Solarbronze glass, matte black steel and glass curtain wall, 56 storeys above ground. |
| [Wikipedia: Toronto-Dominion Centre](https://en.wikipedia.org/wiki/Toronto-Dominion_Centre) | Building list and dates; pavilion "fifteen 22.9 m2 modules", deep steel I-section roof beams on I-section columns at the periphery only, 22 000 sq ft roof, 2009 living roof; Gallery of Inuit Art in the TD South lobby. |
| [Ontario Heritage Trust background paper](https://www.heritagetrust.on.ca/provincial-plaque-program/provincial-plaque-background-papers/toronto-dominion-centre) | Exposed I-beam mullions, bronze glass in matte-black steel, raised lobbies, pavilion 15 modules (75 ft / 22.9 m) a bay, St-Jean granite plaza in 1.5 m modules. |
| [Heritage Toronto](https://www.heritagetoronto.org/explore/td-centre-54th-floor/), [ERA Architects](https://www.eraarch.ca/projects/the-toronto-dominion-centre/), [TCLF](https://www.tclf.org/landscapes/toronto-dominion-centre) | Black steel and glass, double-height glass lobbies, granite plinth over the concourse, the black-paint restoration, the lawn ("The Pasture"). |

Photographs compared (Wikimedia Commons, kept only in ignored `local-scratch/toronto-dominion-centre/refs/`; nothing is copied into the repository or the GLB): [Balthazar Korab, Toronto-Dominion Centre in Toronto 1973](https://commons.wikimedia.org/wiki/File:Toronto-Dominion_Centre_in_Toronto_1973.jpg) (public domain); [Canmenwalker, The Banking Pavilion 2021](https://commons.wikimedia.org/wiki/File:Toronto-Dominion_Centre_The_Banking_Pavilion_2021.jpg) and [TD West Tower 2022](https://commons.wikimedia.org/wiki/File:Toronto-Dominion_Centre_TD_West_Tower_2022.jpg) (CC BY 4.0); [Dillan Payne, April 27 2026](https://commons.wikimedia.org/wiki/File:Toronto-Dominion_Centre,_April_27_2026_(01).jpg) (CC BY-SA 4.0); [TooMuchFrixion, Toronto-Dominion Centre](https://commons.wikimedia.org/wiki/File:Toronto-Dominion_Centre.jpg) and [Arild Vågen, Toronto Financial District August 2017](https://commons.wikimedia.org/wiki/File:Toronto_Financial_District_August_2017.jpg) (CC BY-SA 4.0); [Paul Bica, Toronto-Dominion Centre](https://commons.wikimedia.org/wiki/File:Toronto-Dominion_Centre_-_Paul_Bica.jpg) (CC BY 2.0).

## Frame

Real metres, +X east, +Y up, +Z south. `origin` `[-79.3815354, 43.647541]` is the centre of the smallest circle enclosing the five mapped footprints (127 m radius; `padM` 140 with the plaza). `y = 0` is local flat-map grade, not sea level; tower heights are from street grade and the plaza is a 0.9 m plinth above it. Toronto's grid is turned about 16.5 degrees off true north; every building is fitted to **its own** mapped outline (`toronto-dominion-centre-site.js#fitRect`, minimum-area rectangle), and the four towers' street-grid directions come out within 0.6 degrees of each other. No terrain, latitude stretch or altitude is baked in.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| TD Bank Tower height | 222.86 m, 56 storeys | **Sourced**: OSM `height=222.86` (Skyscraper Center 222.8 m). |
| TD North Tower | 182.88 m, 46 storeys | **Sourced**: OSM, Skyscraper Center 182.9 m. |
| TD West Tower | 128.02 m, 32 storeys | **Sourced**: OSM, Skyscraper Center 128 m. |
| TD South Tower | 153.57 m, 39 storeys (OSM) | **Sourced**: OSM, Skyscraper Center 153.6 m. Wikipedia counts 36. |
| Plans (long x short) | Bank 75.8 x 39.7; North 65.5 x 38.3; West 46.9 x 37.9; South 54.4 x 37.6; Pavilion 45.7 x 44.7 m | **Mapped** (OSM outlines, fitted rectangles). The Bank Tower's 3 007 m2 outline is plausible against the specification's 123 870 m2 rentable over 56 floors. |
| Curtain-wall module | 1.524 m mullion pitch, 1.52 x 2.74 m panes, 0.92 m spandrel, 3.66 m floor-to-floor | **Sourced**: technical specification. |
| Column grid at the lobby | 9.144 m (30 ft) | **Sourced** (specification). Lobby columns and their 0.9 m size are estimated. |
| Lobby | 8.0 m of glass, recessed 3.05 m behind a 0.9 m column line, under a 1.1 m transfer beam | **Estimated** from photographs (two storeys; the recess and beam depth are visual). |
| Mullion section | I-beam: 0.06 m web standing 0.26 m off the glass, 0.16 m outer flange | **Estimated** (the sources say exposed I-beams; sizes are visual). |
| Mechanical bands | Bank Tower: three windowless 7.32 m bands after 9, 14 and 17 glazed floors, then 9 more floors and a 13.56 m louvered crown. Other towers: no mid bands, crown 10.2 to 13.8 m | **Estimated** from photographs (Korab 1973, Payne 2026, Bica). The crown height is the closing term that makes each tower add up to its published height. |
| TD signs | 4.6 m green squares with white "TD": Bank Tower north and south faces, North Tower east face, Pavilion King Street face | **Estimated** size and placement. |
| Banking Pavilion | 45.7 x 44.7 m, roof 10.2 m above grade (plinth 0.9 + 7.6 m clear + 1.7 m fascia), 16 columns a side on a 3.048 m (10 ft) pitch, waffle ceiling, living roof | Plan and 22 000 sq ft roof **mapped/sourced** (2 041 m2 outline); column pitch and heights **estimated** from the 1973 photograph (2.4 m door under a transom as scale). |
| Plaza | Granite plinth 0.9 m with a 0.45 m stone step, edge margins 4.5 m (King), 8 m (Bay, Wellington), 7 m (York side) around the hull of the four northern buildings; the two OSM lawns; the South Tower's own platform | **Estimated**. Checked not to reach any mapped street carriageway (nearest plinth edge 13 m from the King Street centreline). |

## Modelling decisions

- **One landmark, five bodies.** The Mies group and the later black towers are separate buildings with their own footprints; one origin and one owned-footprint list (seven OSM rings: the parts are listed beside their outlines because the provider extrudes whichever it receives) replace them together.
- **Facade rhythm is geometry.** A tower is a bronze-glass box recessed 0.3 m behind the steel: spandrels per floor, I-beam mullions per module, corner columns, windowless louvered bands and crown, a recessed glass lobby with its own frame. Lit-or-not panes are separate quads (`glow`) placed 0.07 m off the glass and behind the steel, chosen by a deterministic hash: a warm daytime reflection in the light palette, a lit window in the dark one.
- **The pavilion is open.** Columns, deep perimeter fascia, glazing frames and a two-way beam grid over a `lamp` ceiling and floor, with the living roof on top: it reads as the transparent hall it is, and glows at night through its open sides.
- **Far keeps the silhouette.** The same five bodies, bands, crown, recessed lobbies with columns, the pavilion colonnade (every other column) and the four green signs; mullions on the 9.14 m grid only; no per-floor detail, panes, louvers, letters or ceiling grid (they are sub-pixel at range and shimmer).
- **Palettes.** Light: matte black steel `#18191b`, bronze glass `#443d36`. Dark: `#0e0f11` / `#1e1c1a` with amber lit panes, lobbies, pavilion floor and ceiling. `sign` is TD green, `light` the white of the lettering.

## Approximations and what is not modelled

Mechanical-band floors, crown heights, lobby depth, mullion sections, logo sizes and faces, pavilion column pitch and heights, and every plaza margin are estimates. The Bank Tower's real mechanical floors may differ in number and position from the three bands read from photographs. Not modelled: the PATH concourse and the interior (the elevator cores, travertine, mosaic ceilings), the trees, benches, Joe Fafard's cows and Al McWilliam's ring, the small black structure between the pavilion and the Bank Tower (OSM way 301736355, left as provider geometry), the TD Gallery of Inuit Art, 95 Wellington Street West, 222 Bay Street, and the real plaza's exact granite edges and steps.

## Costs

Measured from the exported GLBs (`public/models/buildings/toronto-dominion-centre-{near,far}.glb`, manifest `toronto-dominion-centre.json`):

| Export | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 46 724 | 9 | 2 910 924 |
| far | 3 060 | 7 | 200 168 |

Budgets are 160 000 / 48 and 45 000 / 14. Bounds (near and far): X -126.1 to 102.9, Y 0 to 222.86, Z -107.0 to 135.0 m. Texture-free GLB 2.0. Software-GL screenshots are not Tesla hardware timings.

## Verification evidence

Rendered with `local-scratch/shot.mjs` (procedural and `--source glb`) and a local copy that mirrors `building-layer.js` (flat `MeshBasicMaterial` from the palette by name, vertex shade from the normal, self-lit names unshaded), which is what shows the dark palette. Screenshots in ignored `local-scratch/shots/toronto-dominion-centre/`, compared with the Korab 1973 view of the pavilion and tower, the Payne 2026 street view, the Bica and TooMuchFrixion tower views and the Canmenwalker pavilion and West Tower photographs:

- Near, light: overview from the King Street side, the two northern slabs from King Street with the pavilion at the corner, roof view from the south-west, pavilion from Bay Street, plaza, crown and TD sign close-up, mullion and spandrel close-up, west and south elevations, street level from Wellington.
- Near, dark: overview, pavilion at night (lit lobbies, pavilion floor and ceiling, scattered lit panes).
- Pavilion interior at floor level (waffle beams over the lit ceiling).
- Far, light and dark, and the **exported GLB** in near/light and far/dark: identical to the source.

What the first pass got wrong and changed because of the screenshots: the `glow` panes were bright beige in daylight and turned the facade into a mosaic (darkened, so daylight panes are only a little lighter than the glass); the louver slats aliased into dashes (coarser pitch and thickness); the pavilion columns read as fat black pillars (thinner web and flanges); the far LOD glass was olive brown against the real near-black (darker glass); and at night the pavilion did not glow from above (a lit floor was added). Tests: `toronto-dominion-centre.test.js` pins published heights by ray, mapped plan sizes and orientation, the recessed lobby, the 1.524 m mullion and 3.66 m floor rhythm, windowless bands, the open colonnade, footprint containment, sign and lettering winding, and far/near silhouette and budgets; `toronto.test.js` covers the shared conformance.

## Integration status

Cityscape: **not tested yet**, integration is checked separately. Full 3D world: **not tested yet**, integration is checked separately. The model is a rigid body on a 0.9 m plinth over flat grade; a terrain pad of 140 m radius around the origin is declared (`padM`). The TD Bank Tower and TD North Tower are heritage-designated; this is a visual model, not a survey.
