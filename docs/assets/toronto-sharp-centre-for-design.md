# Sharp Centre for Design (OCAD University, 100 McCaul Street)

Asset `sharp-centre-for-design`, part of the [Toronto landmarks](3d-toronto-landmarks.md).
An original procedural model of Will Alsop's 2004 "tabletop": a black-and-white
pixel-skinned box 84 x 31 x 9 m, its underside 26 m above the street on twelve slanted,
multi-coloured steel legs, with the long red stair slab, the black-clad cores, and the
brick OCAD Main Building it floats over. No scan, third-party mesh, photograph or
texture is in the repository or the GLB.

## Identity and version

The building as it stands in 2026 (completed 2004; RIBA Worldwide Award 2004). The
model is the tabletop plus the Main Building beneath it (George Reid wing of 1921 at
the McCaul Street north end, later brick wings up to 1981). The neighbouring house at
74 McCaul Street, Grange Park, the AGO and the apartments stay provider geometry.

## Sources

| Fact | Source |
| --- | --- |
| Tabletop 84 m long, 31 m wide, 9 m high, 26 m above ground, 12 tapered columns | [Designing Buildings](https://www.designingbuildings.co.uk/wiki/The%20Sharp%20Centre%20for%20Design), [Wikipedia: OCAD University](https://en.wikipedia.org/wiki/OCAD_University) |
| Columns 914 mm diameter tapering to 450 mm at both ends, 28 m long; six pairs, each with its own axis of symmetry, no two aligned alike; support all outside the existing building; almost half of the table over the Main Building; small parking lot south of the block; stair core as the primary stabiliser | [Canadian Consulting Engineer, Oct 2005](https://www.canadianconsultingengineer.com/features/sharp-centre-for-design-ocad/) (read 2026-09-29; the page was unreachable for one later check, the fetched copy is in `local-scratch/sharp-centre-for-design/cce.html`) |
| Black and white "pixelated" aluminium skin, steel box truss, long red stairwell linking the Main Building; park to the west, McCaul Street to the east | [Archello](https://archello.com/project/the-sharp-centre), [Architectuul](https://architectuul.com/architecture/sharp-centre-for-design) |
| Tabletop outline 86.7 x 31.6 m, long axis 163.1 degrees; Main Building outline (T-shaped, 100 x 42 m plus 40 x 12 m stem); the two 26 m black cores; the 2-level gabled stem | OpenStreetMap ways 27616814, 225377144, 961216769-961216772, read 2026-09-29 |
| Colours, pixel module and density, window sizes, slab shape, core and leg layout, plant enclosure | Wikimedia Commons photographs listed in the catalog record (viewed locally, not shipped) |

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Tabletop length x width x height | 84 x 31 x 9 m | published (mapped outline reads 86.7 x 31.6 m; the model sits inside it) |
| Underside above grade / roof | 26 m / 35 m | published 26 m; the OSM tags (height 26, min_height 19) disagree and are the mapper's; photographs put the legs at about 22 degrees from vertical, which only fits an underside at 26 m with 28 m legs |
| Legs | 12, length 28 m, diameter 0.914 m tapering to 0.45 m over the last 22 % at each end | published |
| Leg reach | 10.4 m horizontal (sqrt(28^2 - 26^2)) | derived |
| Long axis | 163.14 degrees clockwise from north; east wall faces 73 degrees | mapped |
| Pixel module | 0.75 m (12 rows on the wall) | measured from photographs |
| Wall black / window share | 13 % / 13 % (windows 3 x 2 to 4 x 2 modules) | measured from photographs after review, layout seeded pseudo-random |
| Soffit black share | 13 %, patches up to 4 x 3 modules | measured from photographs |
| Red slab | 3.6 x 3.6 m section, rises 22 degrees from the block roof into the soffit | photographs; route estimated |
| Main Building | 17.5 m tall block (4 storeys) under the table, 13 m step, 8.5 m pale-brick George Reid wing, 10 m gabled stem | estimated: OSM tags every part "4 levels", photographs show the north wing at two storeys |
| Black cores | mapped outlines, roof 17.5 m to the soffit | OSM height 26 |
| Roof plant enclosure | 19 x 10 m, 3.6 m tall (highest point 38.6 m) | estimated from one photograph |
| Leg plan positions, colours | six pairs, feet on the McCaul sidewalk and the south lot | estimated from photographs |

## Modelling decisions

- **The skin is geometry, not texture.** Each wall and the soffit is a grid of cells
  (`sharp-centre-for-design-skin.js`): white aluminium, black pixel or window. Rows of
  equal cells become one quad, so white and black never overlap (no z-fighting at any
  distance) and the split is a true material split (`panel_white` / `panel_black`). Near
  windows are set back 0.25 m with black reveals and alternate `glass` / `glow` (lit at
  night). The pattern is a seeded pseudo-random layout, not Alsop's.
- **Legs stand where the site allows.** All support is outside the Main Building, which
  fills the ground north of u = 8.4. So four pairs stand as A-frames on the McCaul sidewalk,
  tops in the 2.4 m strip of soffit overhanging the block's east wall, leaning along the
  street; two pairs stand on the south lot, clear of 74 McCaul. A test walks every leg's
  axis and fails if it enters a wing.
- **Legs are tapered spindles**, smooth-normalled, on small concrete footings (near).
- **Red slab, cores, plant.** The slab is an oriented box that runs into the soffit; the
  cores are the mapped 26 m building parts in black cladding; the plant enclosure is
  black.
- **Main Building** in brick with recessed window bands, the three-colour parapet band
  along McCaul, and a gabled stem.
- **Far LOD** point-samples the same pattern on a 1.5 m module, drops reveals, footings,
  bands and parapets, and keeps the legs (8 facets), slab, cores, plant and block.

## Approximations

Pixel layout and window placement; every leg's plan position and colour assignment;
the slab route; the block's heights and brick colours; the pale wing's extent;
the plant enclosure; the exact black-core massing (mapped outlines only); no corrugation
of the aluminium (fine ribs are not modelled); no ground plaza, trees or street furniture.
No Tesla hardware measurements.

## Build, cost and verification

`pnpm build:toronto-landmarks sharp-centre-for-design` exports near/far GLBs and the
manifest. Costs are recorded in `public/models/buildings/sharp-centre-for-design.json`.

Tests: `node --test src/peregrine/landmarks/toronto/sharp-centre-for-design/` pins the
published dimensions by raycast (84 x 31 m, soffit at 26 m, roof at 35 m), the pixel
material split on all four walls and the soffit, twelve legs of 28 m with their taper,
colours and clearance from the buildings, the slab and cores, containment in the mapped
outlines, winding against normals, far vs near silhouette and the exported bytes.

Screenshots are in ignored `local-scratch/shots/sharp-centre-for-design/`; see the
verification log at the end of this file.

Cityscape verified: not tested yet, integration is checked separately.
Full 3D world verified: not tested yet, integration is checked separately.

## Verification log (2026-09-29)

Cost of the exported default scenes: near 10 942 triangles / 19 draws / 559 624 bytes;
far 2 256 triangles / 14 draws / 113 872 bytes (budgets 160 000 / 48 and 45 000 / 14).

Compared with the Commons photographs (Taxiarchos228 SE and SW three-quarters,
Arild Vågen from McCaul, Tony Hisgett from Grange Park, Maksim Sokolov skin close-up,
artq55 down McCaul with the CN Tower, Richie Diesterheft and John Mason from below):

| View (ignored PNGs in `local-scratch/shots/sharp-centre-for-design/`) | What it showed and what changed |
| --- | --- |
| procedural near light: overview, facade, west, roof, plan, street, structure, detail | First pass: wall grid was 1 m x 9 rows and far too coarse and dark next to the photos; module changed to 0.75 m x 12 rows, black share cut from 22 % to 13 % after review, windows lightened and enlarged |
| structure, southeast (runtime shading) | Legs first stood on random headings and two passed through the brick block. Reworked to the site: four A-frames on the McCaul sidewalk leaning along the street, two pairs on the south lot; a test now walks each leg and rejects any that enter a wing or the house at 74 McCaul |
| street, mccaul | The block was one 17 m mass; the photographs (Looking north at McCaul, IMG 1302) show a two-storey pale-brick heritage wing at the north end, so the block became three steps (8.5 / 13 / 17.5 m) |
| structure, underside, detail | The red slab was a thin 2 m beam ending short of the soffit; it is now 3.6 x 3.6 m, rises 22 degrees and runs into the soffit |
| GLB near light: overview, facade, west, roof, detail | Exported GLB matches the source (bounds within 1e-3, same materials); window reveals, parapets and set-back windows survive |
| GLB far dark: overview, street; procedural far dark with runtime shading: overview, structure, street | Silhouette holds: speckled white box, twelve coloured legs, slab, cores; lit windows read as cream at night. Note the official harness only darkens the background, not the palette, and its ground-coloured hemisphere light tints the soffit green; the runtime layer's baked shading (checked with a copy of its shading in the scratch harness) shows it light grey |

Not verified: Cityscape in the running app (not tested yet, integration is checked
separately); Full 3D world (not tested yet, integration is checked separately); MCU2 or
any real hardware.

Review fixes (2026-09-29): pale wing brick retuned from mustard `#c5a26a` to cream `#d9cba3` (dark `#8c8168`); wall pixels thinned to 13 % black with fewer clusters, windows enlarged and lightened (`glass` `#9bbfd6`, `glow` `#c2d9e6`), soffit black 13 %.
