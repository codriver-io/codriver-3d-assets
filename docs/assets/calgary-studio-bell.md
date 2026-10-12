# Studio Bell, National Music Centre (Calgary)

`studio-bell` · Allied Works Architecture (Brad Cloepfil), opened 1 July 2016 · 850 4 Street SE, East Village. Part of the [Calgary landmarks](../calgary-landmarks.md); source in `src/peregrine/landmarks/calgary/studio-bell/`, catalog record `prototypes/assets3d/catalog.d/studio-bell.json`.

## Identity and state modelled

The building as it stands today: nine interlocking, subtly curved towers of different heights clad in glazed terracotta tile (flat faces charcoal, curved faces warm bronze to gold, with an iridescent sheen), narrow vertical slot windows, and an enclosed skybridge that spans 4 Street SE and carries on over the restored brick King Edward Hotel (1905-1910, dismantled and rebuilt inside the complex in 2013-16) into a west block behind it. The model draws the whole mapped complex: the seven-tower east block, the west block (the ninth tower), the flared skybridge and the hotel. The provider's 15 m extrusion of the OSM way (which runs over the street) is replaced by the modelled span, which clears 4 Street SE by about 18.6 m.

## Sources

| Source | Used for |
| --- | --- |
| OSM way 317559844 (`name=Studio Bell`, `building=commercial`, `layer=1`, `height=15.24`, `building:levels=5`) | the single outline of east block, west block and skybridge with its 7 m flared ends; the 2.4 degree rotation; plan dimensions |
| OSM way 550777783 (`King Edward Hotel`) | hotel outline, adjacent to the west block and partly under the bridge |
| OSM highway ways on 4 Street SE, sidewalks and cycle tracks (`covered=yes` under the bridge) | centreline of the street (u about -11 m), the open ground under the span, the sidewalk at u about 0.5 m |
| Wikipedia, National Music Centre; Studio Bell architecture brochure | nine interlocking towers, five stories, 160,000 sq ft, about 220,000 glazed terracotta tiles, opened 2016 |
| Canadian Architect, "Music of the Spheres" | charcoal flat faces, gold curved elements, the bridge straddling 4 Street SE, hotel rebuilt brick by brick |
| Architecture web summaries (Designing Buildings, Archello listings) | 35 m span over 4 Street SE, walkway 65 ft (19.8 m) above the roadway, hotel built in phases 1905-1910 in a three-storey and a five-storey section |
| Wikimedia Commons photographs (catalog provenance), viewed in `tmp/`, not redistributed | massing, tile colour, bridge band, triangular window, arch, slot windows |

## Dimensions

| Dimension | Value | Basis |
| --- | --- | --- |
| Frame | street grid rotated 2.4 deg clockwise from the cardinal axes (u east, v south); baked into the geometry; frontage onto 4 Street SE faces bearing 272 deg | sourced: OSM edges (hotel wall, block edges, bridge flanks) |
| East block | u 6.3 to 48.5 m, v -18.1 to 18.6 m (about 42 x 37 m); the street-side walls stand 7.3 m east of the origin line, the other exterior walls 0.1 m inside the outline | sourced: OSM outline |
| West block | u -48.6 to -37.2 m, v -18.8 to 17.8 m (about 11 x 36 m) | sourced: OSM outline |
| Skybridge plan | 8.2 m wide between flanks (v -4.7 to 3.5), straight for about 30 m, 7 m radius fillets into both blocks; about 32 m from the hotel street face to the east block (35 m published) | sourced: OSM outline; published span |
| Clear height under the bridge | 18.6 m soffit (walkway floor 19.8 m = 65 ft, 1.2 m of floor build-up); the brief asks for at least 5 m | published 65 ft; build-up estimated; the photographs suggest it may be lower, see Approximations |
| Bridge top | 30 m (a 11.4 m deep band) | estimated from photographs |
| East towers | seven vessels: sign tower 34 m, north-east 24 m, bridge pier 30 m, centre 31 m (+2.8 m vault), east 21 m, south-west 19 m, south-east 27 m (+2.2 m vault) | the count and the 5-storey, nine-tower description are published; every height and the arrangement are estimated from photographs |
| West block | 30 m | estimated |
| Overall height | 34 m (the sign tower); OSM tags the whole building 15.24 m / 5 levels, which understates the double-height towers | estimated |
| King Edward Hotel | u -37.3 to -24.7 m, v -18.8 to 20.2 m; 12.6 m north part (3 storeys), 16.8 m south part (5 storeys); stone cornice; 1.8 m between its roof and the bridge soffit | outline sourced; heights and which end is the taller part estimated |
| Terracotta courses | 1.2 m, three tone families (gunmetal, bronze, gold) mixed per tower, with the gold-to-gunmetal contrast halved (luminance gap about 15 instead of 30) and `tileGold` courses only in the lowest 10 m (above that a gold course is drawn bronze); bridge faces gunmetal; far LOD 3.6 m | estimated; real tiles are about 0.3 m and are merged into courses |
| Slot windows | 11 of about 1.1 m x 14-26 m; triangular window 3.4 m wide at its 15 m base, apex at 22 m, on the sign tower's street wall just north of where the bridge flare starts (a true triangle in `glass`); entrance arch 10 m wide, 7.6 m high under the landing | estimated positions |
| Bridge coves | a concave quarter-round under each end of the bridge across the straight 8.2 m of the span: radius 5.5 m at the east block (the soffit sweeps down to 13.1 m on the tower wall), 1.6 m at the west block (it stands 1.8 m above the hotel roof); 4 quads near, 3 far, closed at each side by a vertical fan | estimated from the concave swoop in the photographs |

## Materials

Nine names, same keys in light and dark: `tileDark`, `tileBronze`, `tileGold` (the three glaze families of the terracotta), `glass` (hotel windows, plinth glazing, triangular window; a light gunmetal blue so the triangle reads), `glow` (slot windows, bridge window strip and entrance arch: lit at night, reads as dark glass by day), `soffit` (the dark underside of the bridge), `roof`, `brick` (the hotel) and `trim` (its stone cornice). Far folds `trim` into `brick` and `tileGold` into `tileBronze`.

## Modelling decisions

- **One cell list, one neighbour rule.** The plan is authored as rectangular cells (towers and hotel parts) in the street frame. A wall is drawn only where it rises above whatever stands across it, so the towers read as interlocked and no two faces are coplanar. This also gives the west block's wall above the hotel roof for free.
- **Concave vessels with rounded corners.** Exterior spans curve inward by up to 1.25 m between tangent rounded corners; the curve closes at roof and grade. At both landings it returns to the bridge wall plane at the soffit, while internal walls inside the bridge envelope are omitted. Roofs retain their vaults and plant boxes, with no vertex above 34 m.
- **Merged tile mosaic.** Near walls use 0.8 m rows with approximately 1.8 m tile divisions; far uses 1.2 m rows and 3.6 m divisions. Upper walls use one dominant glaze; bronze/gold variation stays in the lowest 10 m.
- **The bridge** is a lofted band between two flanks (8.2 m apart) with true 7 m fillets into the blocks, a flat top, a dark soffit, gunmetal tile-clad flanks in the same courses, a concave cove under each end (a quarter-round from the soffit down into the tower wall, so the underside sweeps into the vessel instead of meeting it at a corner), and a long window strip (with mullions near) 22.6 to 25.4 m up. It ends exactly on the wall planes of the east and west blocks and passes 1.8 m over the hotel roof.
- **Hotel** brick volumes with a window grid, ground-floor shopfront glass between piers and a stone cornice (near); far keeps one glass band per floor.
- **Far LOD** keeps the silhouette and the clear span (bounds within 1.5 m of near): shallow concave walls with 1.2 m tile courses, vaults, the bridge with its lit window strip, hotel floor bands, the four tallest towers' slot windows.
- Terrain: Downtown East Village is flat (about 1,045 m), so no `terrainPad` is declared and `padM` is 60 m (the farthest corner is 52 m out).

## Approximations and what is missing

- The tower arrangement (which tower is tallest, the seven-way split of the east block) is a reading of five photographs, not a drawing. The sign tower position (north-west) follows the "StudioBell" sign in the street-front photographs; the lettering is not modelled.
- The real surfaces are doubly curved and concave in places (the sweeping vessel that rises into the bridge); the model gives shallow concave walls, rounded corners, the bridge fillets and one concave cove under each bridge end, so the swoop is simplified (it is 8.2 m wide, not the full width of the landing) and the silhouette from the street is more boxy than the photographs. The triangular window sits on the flat wall beside the flare; in the photographs it is cut into the swooping face under the bridge.
- The soffit height follows the published 65 ft. In the street-front photographs the bridge band looks at least as deep as the opening under it, which would put the soffit lower (roughly 12 to 18 m); either way the clearance is well over 5 m.
- Iridescence is only a tone mix; colours are dark gunmetal and bronze with a faint gold low down, not the bright gold of the close-up tiles.
- Hotel storey heights, which end is five-storey, and its window pattern are estimated.
- Not modelled: signage, interior, the glazing detail of the Hall of Fame wing, trees, street furniture, shopfront signs, the Studio Bell plaza.
- Cityscape and Full 3D world in the running app: not tested yet, integration is checked separately. Expected in Full 3D world: flat ground, so the default 60 m disc should hold; the bridge span is rigid at 18.6 m above local grade.

## Cost

Measured from the exported GLBs by `pnpm build:calgary-landmarks studio-bell` (default scene):

| | triangles | draw calls | bytes |
| --- | --- | --- | --- |
| Near | 23,755 | 9 | 1012 KB |
| Far | 9,560 | 7 | 408 KB |

Before the review fix: near 7,617 / 9 / 304 KB, far 1,196 / 7 / 68 KB (dropping the barrels saved about 2,500 triangles; the coves add about 50).

Budgets (building): near 60,000 / 14 / 2.5 MB, far 12,000 / 8 / 500 KB. Desktop timing is not in-car performance.

## Verification evidence

Looked at (`tmp/calgary/shots/studio-bell/`): three contact sheets of the procedural near/light model (overview, street, facade, roof, rear, underside, detail), a top view with the red OSM rings, then the exported GLBs: near/dark (overview, street, rear, underside), far/light (same views), near/light (overview, facade, street, rear) and far/dark (overview, facade, rear, underside). Compared by eye against the Commons photographs: the north-west street view (Daniel from Glasgow, 48719528203) and the close views of the vessel and bridge (48719862166). I did not render a 100 m / 800 m street-level pair at a narrow field of view; the street view is a 2.2 m eye at 60 m.

What the renders changed:

1. The first sheet showed zebra stripes: random course tones with large contrast read as bold bars. The tone odds were made dominant-plus-accent and the palette contrast cut.
2. Slot windows first read as a dozen long blue posts: fewer, wider, neutral dark glass by day.
3. The first towers were plain boxes: barrelled walls, rounded exterior corners and vaults were added; the walls were pulled in 1 m so the bulge stays on the mapped outline (the barrels were later dropped, see the review below).
4. The bridge top was raised from 28.5 to 30 m after comparing the band depth with the photographs.
5. The `qa-metrics` run found zero-area triangles in the arch ends (the arch collapsed to a point there): the arch now ends in a short vertical edge.
6. While writing the tests, the triangular window was found to straddle the rounded corner of the sign tower (floating up to 1 m): it moved onto the flat part of the wall.
7. Far at night had no lit windows: its bridge strip keeps `glow`.

Deterministic checks (a local copy of `scripts/qa-metrics.mjs` that skips other landmarks' catalog entries): 0 coplanar overlapping faces, 0.7 % back-face hits on the outside-in sweep, nothing below grade, no zero-area triangles or non-unit normals.

Independent review (recognisability 3/5: a striped layer cake with convex barrels and a triangular window nobody could find). Changed: the gold-to-gunmetal contrast was halved and gold confined to the lowest 10 m, the bridge faces and soffit were made gunmetal, the per-tower barrels were dropped for flat walls and a concave cove was added under each bridge end, and the triangle was moved to 15 to 22 m and given a lighter blue-grey `glass` so it reads. Looked at again: the `qa-sheet` of the exported GLBs and near-light `street`, `facade`, `underside` and `detail` renders (`tmp/calgary/shots/fix-east-village/`): calm dark tile, a visible apex-up triangle beside the bridge landing, the cove sweeping into the tower under the bridge. `qa-metrics` on the new GLBs: no issues, 0 coplanar pairs, 0.5 % back-face hits.

`node --test src/peregrine/landmarks/calgary/studio-bell/studio-bell.test.js` pins: the 34 m top and the roof height of each of the seven east towers in both LODs, the bridge soffit at 18.6 m (above 5 m) at seven points across the street, the street open under the span at 10 m, the bridge top running over the hotel into the west block with a gap above the hotel roof, the hotel's 12.6 and 16.8 m roofs and brick street front, glow slot window, a true glass triangle (wide at its 15 m base, narrow near the 22 m apex, tile beside and above it), the arch, the concave coves under both bridge ends (steep at the wall, flat toward the span), shallow concave vessel walls, the halved tile contrast with `tileGold` only in the lowest 10 m, the three tile tones, the baked 2.4 degree rotation, every vertex inside the mapped rings (1 m slack) and the far envelope.

## Integration

Normal Peregrine Cityscape: lazy regional GLBs, MCU2 far LOD, reversible owned-building replacement over two OSM rings (Studio Bell with its skybridge, and the King Edward Hotel). No road, terrain or navigation contract. Cityscape and Full 3D world: verified visually in the 2026-10-11 QA run; see current evidence and limits below.

## QA revision 2026-10-11

Concave vessel walls replace the flat spans, including the walls beside both bridge landings; internal landing faces are omitted so the flared bridge joins continuously. Upper courses use a calm dominant glaze, while smaller bronze/gold tile divisions articulate the lower walls and entrance. The curves and tile mosaic remain in far.

Reference basis: the supplied review and reference photograph in its contact sheet, plus the existing authoring notes. No new city dossier exists for these first-run Calgary/Toronto assets; the sculptural approximation uses the existing documented plan and general architectural knowledge.

Cityscape: verified visually at far, near and street. Full 3D world: verified visually with terrain enabled at far, near and street; world-state.json confirms terrain enabled, terrain rings active and the landmark lifted to its terrain datum. Verification is limited to the captured views; no lifecycle, night, hardware or terrain-toggle coverage is claimed.

## Follow-up QA, 2026-10-11

Follow-up QA: the concave bridge underside now spans the complete flared landing mouth and closes into both towers, rather than using a narrow rectangular cove. Upper walls retain restrained tile-scale bronze/dark variation in both LODs. The 18.6 m straight-span soffit and lower flared landing clearance are retained; geometric curves and glaze are photographic approximations.

The architect’s [Allied Works project page](https://alliedworks.com/projects/national-music-centre-canada/) was checked for the interlocking terracotta tower concept. 

All landmark tests and city conformance tests pass; metrics report no issues, asset-catalog validation and assets:preview pass, and the depth-layer check is current. Cityscape: **verified** at far, near and street. Full 3D world: **verified** at far, near and street with terrain enabled; These are visual captures only; no lifecycle, night, toggle or hardware certification is claimed.

Current exported costs:

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 23,771 | 9 | 1,036,176 |
| far | 9,560 | 7 | 417,004 |
