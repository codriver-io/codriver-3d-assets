# First Canadian Place (Toronto)

Stable asset ID: `first-canadian-place`. Original procedural model of the **Bank of Montreal tower at 100 King Street West**, King and Bay, as it stands today: the 2009-2012 recladding in white frit glass, not the original Carrara marble. Part of the [Toronto landmarks](3d-toronto-landmarks.md); catalogue record `prototypes/assets3d/catalog.d/first-canadian-place.json`. Source: `src/peregrine/landmarks/toronto/first-canadian-place/`.

## Identity and version

- 72 storeys (four below grade), Bregman + Hamann with Edward Durell Stone as design consultant, completed 5 June 1975. Canada's tallest building until 2025 (Wikipedia).
- **Version modelled: after the 2009-2012 recladding** (Wikipedia; Brookfield replaced the ~45,000 marble panels with glass, the main expanses in white ceramic frit and the corners in a bronze tint). The lead's brief called the tower "white Carrara marble"; that is the 1975 state. The present facade still reads as a pale slab because the spandrels are frit-white, and the model follows the present facade (photographs 2017-2026).
- What a driver sees: a very pale slab with fine dark horizontal window strips, four narrow dark slits at the corners, a plain white band under the roof carrying the blue BMO wordmark and red roundel on every face, and two broadcast masts.

## Sources and how they were used

| Source | Used for |
| --- | --- |
| [OSM way 27767627](https://www.openstreetmap.org/way/27767627) | Tower plan (`height=292`, `building:levels=72`, `roof:colour=#BAB49E` gravel, `building:colour=#ffffff`); footprint ring; angle and corner pockets |
| [OSM way 289330446](https://www.openstreetmap.org/way/289330446) | Rooftop penthouse, `building:part`, `height=298` |
| [Wikipedia](https://en.wikipedia.org/wiki/First_Canadian_Place) | 298 m, 72 storeys, 1975, cladding history and 2009-2012 recladding, broadcast masts, BMO logo |
| [CTBUH Skyscraper Center 543](https://www.skyscrapercenter.com/building/first-canadian-place/543) (figures as quoted on Wikipedia / Wikidata) | Architectural height 298.1 m, tip 355 m, top floor 289.9 m |
| [The Infrastructure Index](https://theinfrastructureindex.com/article/first-canadian-place/) | Original Carrara cladding replaced 2010-2012 by white glass |
| Wikimedia Commons photographs (see Provenance) | Facade module, corner pockets, crown band, logo layout, masts, comparison of every screenshot |

Overpass was queried once through the shared helper (`local-scratch/overpass.mjs`, `around:130` the tower, cached under `local-scratch/overpass-cache/`); the extract and my analysis scripts stay in ignored `local-scratch/first-canadian-place/`.

## Frame, orientation and origin

Metres, +X east, +Y up, +Z south; `y = 0` is local flat-map grade, no altitude, no terrain, no latitude stretch baked in.

- `origin = [-79.3816917, 43.6487652]`, the centre of the mapped tower plan.
- The mapped edges snap to a single pair of axes at **-15.9 degrees** from east (the street grid): u runs along King Street, v toward the lake. All four outline edges fit those lines to within 2 cm, so the model's orientation is the outline's own, not an assumed grid angle. The King Street face looks toward bearing 164 degrees (`frontageBearing`).
- Authoring helpers `site(u, y, v)` / `unsite(x, z)` in `first-canadian-place-site.js` rotate authoring axes into the exported frame (the same device as Place Ville-Marie's `pvmSite`).

## Dimensions: sourced against estimated

| Quantity | Model value | Basis |
| --- | --- | --- |
| Architectural height (penthouse cap) | 298.1 m | **Sourced** (CTBUH 298.1; OSM part 298) |
| Roof of the main slab | 292.0 m | **Sourced** (OSM `height=292`); top floor 289.9 m is consistent |
| Mast tip | 355 m | **Sourced** (CTBUH tip height); shape and split into two masts estimated from photographs |
| Plan | 57.65 x 55.04 m | **Mapped** (OSM outline, edges fitted at -15.9 degrees) |
| Corner pockets | 4.8 x 5.0 m, four | **Mapped, regularised** (mapped 4.2-5.2 x 3.7-5.7 m; the mapper's corners differ by a metre, the model is symmetric). Existence of square re-entrant pockets rather than a 45 degree bevel is read from the outline and confirmed by the chevron pattern in the corner slit on close-up photographs |
| Penthouse | 29.9 x 22.2 m, 6.1 m tall on the 292 m roof | **Mapped** plan (OSM part); height follows from 298.1 - 292 |
| Storeys | 66 window rows, pitch 4.08 m from 12.5 m to 281.5 m | **Estimated**: 72 storeys less four below grade, less lobby/mechanical; 4.08 m (13 ft 4 in) is a normal office pitch |
| Window strip / spandrel | 1.55 m / 2.53 m per storey | **Estimated** from photographs (about 38% glass) |
| Bay | 1.52 m (5 ft) | **Estimated**; vertical joints counted against photographs |
| Plain white crown band | 10.5 m, logo centred 5.4 m below the roof | **Estimated** from photographs |
| Wordmark / roundel | text 5.0 m high (12.9 m wide), roundel 7.0 m, group starts 2.2 m in from the left end of each face | **Estimated** from photographs (the group occupies the left 40% of each face as seen from outside) |
| Lobby | 12.5 m of dark glass with pale piers every 6 m | **Estimated**; hidden on most sides by the provider podium |
| Masts | two comparable masts 16 m apart on the penthouse roof (Commons 'View from CN Tower 2023g' crop): a slim lattice mast (2.6 m tapering to 1.7 m) with panel antennas and a whip to the 355 m tip, and a heavier lattice mast (2.9 to 2.1 m) carrying a 0.55 m-radius white FM antenna tube to 349 m | Tip **sourced** (CTBUH); count, spacing and shapes **estimated** from the photograph |

## Materials (light / dark palette, same keys)

`frit` white spandrel glass, `glass` window strips (recessed 0.3 m), `bronze` corner pockets, `mullion` joints and floor lines, `concrete` lobby piers, `roof` gravel (OSM `#BAB49E`), `metal` masts and rooftop plant, `paint` the white mast and panel antennas, and the self-lit `sign` (blue wordmark), `lamp` (red roundel), `light` (roundel mark) and `glow`. `glow` is a sparse scatter (3% of window bays) of lit offices. Unshaded materials cannot follow the per-face baked shading, so by day its colour is set to the average shaded window colour (within about 7 levels of the glass on any face) and at night it is warm; a fully invisible day state is not possible with a shared GLB. The dark palette dims stone and glass and brightens the signs, because the real sign is internally lit.

## Modelling decisions

- **Silhouette first**: a rectangular slab with four square pockets, the plain crown band, the penthouse and two masts. The pale slab and the four dark slits are what identify it from the highway.
- **Facade rhythm**: one white spandrel box per storey per face, 0.5 m thick and proud of a dark glass core recessed 0.3 m, so the strips are real relief, not paint; 30-odd vertical joints per face; white edge fins framing each pocket. 66 rows x 4 faces are merged by material.
- **Corner pockets are real**: each is two bronze walls with floor lines and mullions, set back 4.8 x 5.0 m, so from a corner viewpoint the slit shows the chevrons of both walls, as in the photographs.
- **Lettering as geometry**: the BMO wordmark (B, M, O glyph outlines drawn for this model, not a font) and the round badge with a simplified light mark, on all four faces, in the `sign` / `lamp` / `light` unshaded materials. These are the marks a Torontonian reads at a distance. The mark inside the roundel is a simplified original outline, not the trademark artwork.
- **Far LOD**: same silhouette, pockets, 66 rows, logo positions and masts, at 1,420 triangles: spandrels are single quads with the window glass set 1.0 m behind them (a 0.3 m stand-off z-fought at 800 m), no mullions, no lit windows, the wordmark is a block, the lattice is reduced to three panels with thicker legs so the needles survive at distance.
- **Not modelled: the podium wings and the King and Bay bank pavilion.** OSM has them as two large polygons wrapped around the tower (ways 61429747 and 366222382, 15,000 m2 together, tagged only `layer=5` / `fixme`, heights unknown, one running through to the Exchange Tower). The ownership rule removes triangles only if wholly inside a listed ring, so owning them would mean modelling the whole 15,000 m2 with guessed heights, or leaving holes. They stay provider geometry, and the tower rises through the hole they leave. The footprint therefore lists only the tower and its penthouse (`footprint.js`). Exchange Tower is a separate way and is not touched.

## Approximations and limits

- Storey pitch, window/spandrel split, bay width, logo size and placement, the lobby, the roof equipment and the masts are estimates from photographs, not surveyed.
- Pocket sizes are regularised (mapped pockets differ by a metre from corner to corner).
- The 1975 marble skin, the podium, the bank pavilion, the PATH entrances, the flag masts and the roof-top guy wires are absent.
- Tesla hardware cost is unmeasured. The near GLB (17,188 triangles, 971,984 bytes) is heavier than a typical Montréal building because of the facade relief; the far GLB is 1,420 triangles / 84,952 bytes.

## Costs (exported GLB 2.0, texture-free, `pnpm build:toronto-landmarks first-canadian-place`)

| Export | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| `public/models/buildings/first-canadian-place-near.glb` | 17,188 | 12 | 971,984 |
| `public/models/buildings/first-canadian-place-far.glb` | 1,420 | 8 | 84,952 |

Budgets from the contract: near <= 160,000 / 48, far <= 45,000 / 14. Bounds of both LODs: x/z within the mapped tower outline plus 0.8 m, y from 0 to 355 m.

## Verification evidence

Rendered with `node local-scratch/shot.mjs first-canadian-place` (red OSM outline, 10 m grid) and with a scratch script that reproduces the runtime layer's shading (palette per theme, unshaded `sign`/`glow`/`lamp`/`light`, baked directional vertex colour) so the dark palette was actually looked at. Screenshots in ignored `local-scratch/shots/first-canadian-place/` and `local-scratch/first-canadian-place/shots-runtime/`.

| View | What I compared to | What changed because of it |
| --- | --- | --- |
| overview, near, light | Commons "View from CN Tower 2023g" (K. Antony-22) | Confirmed slab proportions, the four dark corner slits and the mast pair against the aerial view |
| crown, near, light; roof view | "First Canadian Place Close-up, January 26 2026" (D. Payne), "(January 2023)" (TooMuchFrixion) | Logo group moved to the left of each face; the roundel mark redrawn (first version read as a house); wordmark size raised to about a quarter of a face |
| corner, notch and edge close-ups | Same close-ups (chevrons in the corner slit) | The 45 degree bevel I first built was replaced by square re-entrant pockets after the OSM outline showed them; floor lines and mullions added to the pocket walls so they read as curtain wall, not a black slot |
| street level, near | "First Canadian Place, Toronto, Ontario (29375074354)" (K. Lund) | Same strip pattern continues to the base; lobby kept as dark glass with pale piers |
| back, near, light | OSM plan | Checked the north-east faces carry the same strips and logos; the masts are out of frame there, they are on the roof's north-east side and were checked in the crown view |
| far at about 500 m, light and dark (runtime shading emulation) | Skyline photographs above | Far mast legs thickened (needle vanished); block wordmark and round roundel kept; far window stand-off raised from 0.3 m to 1.0 m after review reported speckle at 800 m |
| roof view, exported GLB, near, after review | Crop of 'View from CN Tower 2023g' (two similar masts about 16 m apart, one lattice with a white tube) | Masts replaced: the earlier 5 m spacing read as one needle |
| exported GLB, near crown and far crown (dark background) | Procedural renders | Round trip identical; bounds equal the source (asserted by `toronto.test.js`) |

Tests: `node --test src/peregrine/landmarks/toronto/first-canadian-place/first-canadian-place.test.js src/peregrine/landmarks/toronto/toronto.test.js` (the tests pin the 292 m roof, 298.1 m cap, 355 m tip, 66 window strips by ray sweep, proud spandrels over recessed glass, the four bronze pockets by raycast, the wordmark and roundel on all four faces in both LODs, both masts, containment inside the mapped outline, and far LOD bounds).

| Environment | Status |
| --- | --- |
| Inspector, procedural source and exported GLB, near and far, light and dark | Verified |
| Cityscape (flat ground, real Peregrine renderer) | Not tested yet, integration is checked separately |
| Full 3D world (terrain) | Not tested yet, integration is checked separately |

## Provenance and rights

Geometry is original, authored from published dimensions and photographs studied for proportion only; no scan, no traced mesh, no photograph or texture in the repository or the GLB. Reference photographs are Wikimedia Commons files downloaded to ignored `local-scratch/first-canadian-place/refs/`; titles, authors and licences are in the catalogue record. The BMO name and roundel are trademarks of the Bank of Montreal; the model draws simplified marks because they are part of the building's appearance, not as an endorsement. Mapped outlines © OpenStreetMap contributors, ODbL 1.0.
