# Vancouver House, Vancouver

Original procedural model of BIG and DIALOG's residential Vancouver House for Westbank, completed 2020 at 1480 Howe Street. Stable ID `vancouver-house`; source is `src/peregrine/landmarks/top-cities/vancouver-house/`. At bridge and street distances its identifying features are the narrow triangular lower plate, eastward curved expansion into a rectangular upper tower, and white staggered balcony frames around blue-grey recessed glass.

Sources checked 2026-10-06: [Skyscraper Center](https://www.skyscrapercenter.com/building/id/13987), [Westbank](https://westbankcorp.com/body-of-work/vancouver-house), [BIG](https://big.dk/projects/van), [International Highrise Award](https://www.international-highrise-award.com/en/best-high-rises/20222023/vancouver-house/), and OSM ways [742009401](https://www.openstreetmap.org/way/742009401) and [1092241825](https://www.openstreetmap.org/way/1092241825). OSM geometry was supplied in the dossier and rechecked through the shared queued Overpass helper. The International Highrise Award explains the triangular-to-rectangular transition and 30 m bridge clearance.

The current Skyscraper Center lists **155.6 m architectural/tip height, 147.9 m occupied height and 52 physical floors**. Westbank describes **59 storeys** and a **nine-storey podium**. The older dossier gives 150.3 m and 49 floors; OSM gives 157 m and 49. This model uses the current 155.6 m architectural height and 52 physical floor intervals; marketed floor numbers are not treated as physical counts. The top occupied floor's walking datum is approximately 149.9 m; the 152.8 m occupied-roof slab, 154.55 m recessed crown and equipment to 155.6 m are estimates.

| Quantity | Model | Basis |
| --- | --- | --- |
| Highest architectural point | 155.6 m | Current Skyscraper Center |
| Completion and architects | 2020, BIG / DIALOG | Skyscraper Center and Westbank |
| Upper plate envelope | 43.3 × 28.8 m | Mapped OSM tower part, 1,248 m² |
| Lower plate | Half-area triangle, approximately 624 m² before facade insets | Architect's triangular-to-rectangular concept; inferred base corners within mapped upper envelope |
| Plate expansion | Begins 30 m, complete by 115 m | 30 m clearance sourced; smoothstep profile/end height estimated from photographs |
| Tower physical floor rhythm | Lobby + 51 tower intervals; plant crown | 52 count sourced; 2.914 m typical intervals estimated |
| Connected retail base | 4.2 m | Estimated |
| Nine-storey site-tail wings | 27 m | Count sourced / mapped; split and height estimated |
| Balconies | 3.8 m nominal bays, alternating 1.05 m ledge recesses, 0.48 m slab fascia | Estimated from photographs |
| Glass / balustrade / partitions | 2.6 m inset, 0.98 m rails, 0.34 m white party-wall fronts | Estimated |
| Roof plant | 14 × 8 × 1.05 m | Estimated |

The frame is real metres, +X east, +Y up, +Z south. Origin `[-123.1310292, 49.274925625]` is the upper tower outline centre. Local plan +u is bearing 44° from north; geometry rotation **−46° from east is baked once**. Two OSM controls are the tower's north corner `[-123.1309648,49.2751554]` and east corner `[-123.1306790,49.2749757]`; their 28.8 m edge is approximately bearing 134°. The opposing long edge is 43.3 m at bearing 44°. `FOOTPRINTS` retains both the mapped site-wide podium and the upper overhanging part. Neither roads nor the separate University Canada West/off-ramp buildings are included.

`y=0` is local flat-map grade. The connected base is rigid; no DEM, sea level or latitude stretch is baked. The waterfront urban block is treated as approximately level and `padM: 88` covers its long site envelope. App terrain sampling could require a later bounded foundation policy; this export does not certify it.

Geometry is an original procedural stack of convex plates. Above 30 m the diagonal east face splits into two edges and grows into a rectangle. Each white slab has a stepped outline and closed top/soffit. A convex half-plane inset handles very short emerging faces without projecting their glazing outside the mapped envelope. Glass is recessed behind balconies; staggered white party-wall fronts and closed returns give the basket-weave facade seen in the references. Geometry batches once per material. Far keeps every floor band and the entire expansion, doubles the bay width and drops glass rail panels, mullions and lit apartment panes.

Named palettes use `white` for slab edges and partitions, `glass` for blue-grey glazing, `rail` for pale glazed balcony fronts, `metal` for mullions and equipment, `roof` for plant roof and `light` for sparse apartment lighting. Night dims the shell and uses warm self-lit apartment panes; the lighting pattern is invented. Balustrades are opaque, and the podium is intentionally simplified into a low connected plinth and two nine-storey tails. Neither floor plans nor facade elevations were available. The swimming pool, interiors, furnishings, signage, Spinning Chandelier, landscaping, bridge and detached campus buildings are omitted.

Reference photographs used only for comparison, retained in ignored scratch: **Vancouver House - 22**, Haatu, CC BY 2.0; **The Tower Rises, Vancouver House, Vancouver**, W & J, CC BY-SA 2.0; **Vancouver House, Vancouver, British Columbia 04 - Nov 30, 2019**, Ken Lund, CC BY-SA 2.0. Their checked Commons links are in the catalog. Two Westbank page photographs, BIG VancouverHouse 0113 EDIT (skyline) and BIG VancouverHouse 0660 (balcony detail), were viewed as copyright-retained references only. Original source/model, no photo/scan/texture/external mesh ships. OSM-derived geographic data © OpenStreetMap contributors, ODbL 1.0.

Build: `pnpm build:top-cities-landmarks vancouver-house --no-check`.
Focused verification: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/vancouver-house/vancouver-house.test.js` and `node scripts/asset-catalog.mjs`.

Visual evidence lives under ignored `tmp/top-cities/shots/vancouver-house/`. The dossier reference sheet and the developer balcony close-up were read. Procedural contact sheets in `iteration-1/` and `iteration-2/` show overview, east face, back, roof, street, detail and plan. The first sheet caught an erroneous rectangular low plate causing a waist; the diagonal base closure was corrected. Facade/back cameras were moved out to keep the top visible. A focused containment test then caught obsolete inset intersections on short emerging faces; the inset now clips its half-planes correctly.

Final exported default-scene costs (KiB rounded, shown as KB by the repository tools):

| Variant | Triangles | Draws | Bytes | KB |
| --- | --- | --- | --- | --- |
| Near | 27,712 | 6 | 1,388,352 | 1,356 |
| Far | 7,324 | 4 | 346,588 | 338 |

Both LODs have exactly matching bounds, min y=0 and max y=155.600006 m. Flat caps share indexed vertices and unused cap vertices are removed; no redundant road attributes or textures ship. A rail is omitted when a growing upper floor absorbs that balcony or approaches its curtain wall, eliminating coincident rail/glass/mullion faces.

The final exported GLBs were **looked at next to the reference photos** in `tmp/top-cities/shots/vancouver-house/exported-reference-contact-sheet.jpg`: first row three Commons photos and the developer balcony detail; remaining rows overview, east facade, back, above roof, street, close detail and plan; columns near light, near dark, far light, far dark. Full-resolution component sheets are `final-near-light/vancouver-house-glb-near-light-sheet.jpg`, `final-near-dark/vancouver-house-glb-near-dark-sheet.jpg`, `final-far-light/vancouver-house-glb-far-light-sheet.jpg` and `final-far-dark/vancouver-house-glb-far-dark-sheet.jpg` under that same scratch directory. The peel remains readable in both LODs, the near facade has deep staggered balconies, and the baked outline is contained in the red mapped rings. Far's bay pattern is visibly coarser and more horizontal; night apartment lights are retained only near. The podium remains the least certain portion because the supplied skyline photos obscure its base; its two wing masses are schematic.

The final focused command passed **164 tests, zero failures**, including six landmark-specific tests plus Vancouver House conformance, GLB round-trip, byte budgets and catalog checks. Test log: `tmp/top-cities/vancouver-house/focused-tests.txt`. `node scripts/asset-catalog.mjs` passed with 178 records / 336 GLB variants at this checkpoint. `qa-metrics.mjs --ids vancouver-house` reports **zero coincident different-material planes**, **1.1% back-face hits** (below its 2% threshold), zero removable road-attribute bytes, no below-grade vertices and no issues; report `tmp/top-cities/vancouver-house/qa-metrics.json`. The thin balustrades are opaque, single-sided panels rather than full window assemblies; the small sweep residual is not a certification of every balcony interior. No full app test, full suite, install, git mutation or shared file edit was performed.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Independent visual review and hardware measurements remain with the coordinator. No shared file changes were required.
