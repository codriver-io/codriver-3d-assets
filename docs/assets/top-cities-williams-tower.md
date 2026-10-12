# Williams Tower — Houston

Original procedural model of Williams Tower (formerly Transco Tower), 2800 Post Oak Boulevard, Uptown Houston, completed in 1983 by John Burgee Architects with Philip Johnson and Morris-Aubry Architects. Editable source: `src/peregrine/landmarks/top-cities/williams-tower/`; record: `prototypes/assets3d/catalog.d/williams-tower.json`.

## Sources and frame

[Hines](https://www.hines.com/properties/williams-tower-houston) establishes the architect, opening year, 64 storeys, 88-foot granite arched entry and revolving beacon on a peaked roof. [Wikipedia](https://en.wikipedia.org/wiki/Williams_Tower) supplies the 275 m roof height. The prepared dossier `tmp/top-cities/williams-tower/{osm.txt,osm.json,facts.txt,refs-sheet.jpg}` supplied the geographic building-part outlines and comparison images; no additional Overpass requests or reference photos were needed.

Real metres: +X east, +Y up, +Z south; y=0 is flat local grade. Origin `[-95.461325,29.737264]` is the mapped crown/beacon centre. Rotation is already in the mapped vertices and exported geometry. The south podium controls `[-95.4615179,29.7369414]` and `[-95.4611212,29.7369468]` give the facade's slight northward rise to the east (about 0.9°); south frontage bearing approximately 179.1°. Geometry uses the shared Mercator conversion divided by local stretch, never baked latitude scaling.

The replacement envelope is the [whole tower outline, way 48486714](https://www.openstreetmap.org/way/48486714), including its west link; an additional ring explicitly identifies that link. Owned provider parts: 581342682, 581342685, 581342686 and 581354690–699. The 2 m² beacon part is covered by the main outline instead of a degenerate replacement ring. Building relation 8221404 groups these ways; its dossier bounds introduce no additional shape. Adjacent garage, other offices, park and waterwall are outside the model and ownership.

## Dimensions

| Feature | Model | Basis |
| --- | --- | --- |
| Overall height | 275 m | Wikipedia / OSM |
| Storeys | 64 | Hines / Wikipedia; facade rhythm approximates the floors |
| Stepped wings | 197, 226, 233, 250 m | OSM building-part heights |
| Central shaft | 261 m | OSM 581354693 |
| Clerestory | 261–266 m | Estimated transition to mapped roof base |
| Pyramid | 266–274 m, about 27 × 27 m | OSM 581354698, height 274 / roof height 8 |
| Beacon | 274–275 m | Mapped height; housing proportions estimated |
| Podium / west-link roof | 28 m | OSM |
| West-link underside | 6.6 m | OSM min_height on 581342686 |
| Granite entry | 26.8224 m / 88 ft | Hines |
| Entry width / opening / reveal | 22 m / 14 m wide, 19 m high / 1.8 m deep | Estimated from front reference |
| Facade bay and floor pitch | about 2.4 m / 4.04 m near | Estimated photograph rhythm |
| Far subdivisions | about 6 m bays / 12.12 m rows | Coarse discrete grid; lit rooms remain room-sized |

## Authoring and materials

Each height slab uses the union of active mapped building parts. Exposed terraces are the difference between adjoining slabs, so no internal stacked-part walls or duplicate roofs remain. The elevated link has an explicit soffit. This preserves the tower's deeply stepped corners and vertical wings rather than approximating them with a single extrusion. The central shaft meets a low four-sided pyramid and a small self-lit beacon lens supported by a roof housing.

Glass, mullions and self-lit office cells partition the same facade plane without backing or overlays; they have no coplanar conflicts. The near facade retains individual rows and bays. Far groups them into separate coarse quads while retaining every mapped setback, portal opening and crown feature; occupied room inserts partition their coarse cells rather than becoming oversized bright slabs. The granite portal is a solid arched ring with inner reveals and genuinely recessed, subdivided glazing.

Muted blue glass, silver-grey mullions, pale warm granite and cool grey metal terrace caps and crown follow the dossier photographs. Night uses dim blue glazing and cream occupied windows with a bright crown lens. The moving atmospheric beam is deliberately omitted from a static reusable GLB. Window occupancy and portal proportions are approximations; no interiors, lettering, ornamental paving, waterwall or neighbour buildings are authored. No photograph, external mesh or texture is shipped.

## Provenance

Original procedural source is MIT; original exported models CC BY 4.0. Mapped geographic data © OpenStreetMap contributors, ODbL 1.0. The ignored dossier photographs were studied for proportion only: *Williams Tower Front*, Ksaziz, CC BY-SA 4.0; *Wiliams Tower Texans* and *Uptown Houston*, Henry Han, CC BY-SA 3.0; *Williams Tower*, Bill Jacobus, CC BY 2.0; *Williams Tower Spotlight*, Trey Perry, CC BY 3.0. File links and licence credits are in the catalog record; no reference images are committed.

## Verification evidence

The dossier contact sheet was inspected before authoring. Procedural near/light overview, opposite facade, roof, entrance and crown detail were inspected in `tmp/top-cities/shots/williams-tower/williams-tower-procedural-near-light-sheet.jpg`. The first inspection prompted daylight self-lit colour correction and reduction of far subdivisions; exported inspection prompted a second adjustment to subdued day lighting and room-sized far illuminated cells. The final exported near/far and light/dark contact sheets, plus a combined sheet next to the reference photos and a top footprint view, are under `tmp/top-cities/shots/williams-tower/` (see final results below).

Tests raycast the five distinct stepped heights, slope of the pyramid, arch opening/jamb/lintel, recessed glazing and beacon lens contact with its named roof housing. A deliberately detached lens fails that contact check. Every vertex is checked against the mapped envelope, minimum grade is zero, and near/far bounds match exactly. These checks exercise geometry rather than repeating its construction formulas. There are no free cable, beam or rail terminal members.

Cityscape: **not tested yet**. Full 3D world: **not tested yet**. Integration is checked separately by the lead, including provider replacement, terrain datum, foundation and lifecycle behaviour; inspector screenshots do not establish those gates. Tesla hardware cost is unmeasured.

Rebuild: `pnpm build:top-cities-landmarks williams-tower --no-check`; depth table: `node scripts/landmark-depth-layers.mjs --ids williams-tower`. Focused tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/williams-tower/williams-tower.test.js`.

## Final measured results

| Export | Triangles | Draws | Bytes | KiB (rounded) |
| --- | --- | --- | --- | --- |
| Near | 37,144 | 6 | 1,662,168 | 1,623 |
| Far | 7,809 | 6 | 352,040 | 344 |

Both are within the building budgets. `tmp/top-cities/williams-tower/metrics.json` records no issues: zero layered-face area, zero coplanar overlaps, 0.3% near back-face sweep, no removable bridgeLift and no window-rhythm flags. Depth generation and `--check` pass; the cycle report is empty.

Final inspected evidence: `tmp/top-cities/shots/williams-tower/williams-tower-final-comparison.jpg` places two dossier references next to the exported near/far, light/dark overviews, opposite facades, roof, street entrance, crown detail and plan view. The exported `williams-tower-glb-far-dark-sheet.jpg` was also inspected in full. All final light/dark near/far contact sheets are retained in that same folder. The daylight occupied panes are subdued; the far illuminated rooms retain near room proportions instead of occupying the entire coarse cell. Silhouette, podium arch, inset crown and footprint alignment read consistently in both LODs.

All nine Williams Tower tests and its three registry conformance checks pass. The prescribed combined registry test ran; its only failures at that checkpoint were other builders' temporary over-budget geometry: high-museum-of-art near 76,308 triangles and att-building-nashville far 14,460 triangles. The global catalog check was retried: first another builder's missing magere-brug document, then unregistered att-building-nashville-far.glb prevented a global pass. No other landmark files were edited. Independent reviewer and both-mode app evidence remain the lead's release gates.

## October 12 review fix

Review b5b: daytime roof and terrace caps changed from taupe to restrained cool grey metal, retaining reflective blue glass, stepped corners, low pyramid and static beacon lens. Geometry and near/far costs unchanged; rotating night beam remains omitted from the static reusable model.

Latest measured default-scene costs: near **37,144 triangles / 6 draws / 1,662,168 bytes**; far **7,809 triangles / 6 draws / 352,040 bytes**. These supersede earlier authoring-stage results.

Inspected exported contact sheets in `tmp/top-cities/shots/williams-tower/b5-fix/`: near/light, near/dark and far/light or far/dark, including the reviewed facade/crown details; Source geometry QA is clean for both LODs, with zero layered/coplanar faces, no material cycles, and preserved bounds/window rhythm. The four-landmark tests pass 27/27; combined registry and landmark run passes 501/502, with its sole unrelated failure at `cite-de-carcassonne` (footprint is a real polygon). Evidence: `tmp/top-cities/marine-building/b5-fix-tests.log` and `b5-fix-metrics.json`. Depth generation and scoped `--check` pass; catalog validation, `pnpm assets:check` and `pnpm assets:preview` pass (286 records, 560 variants).

Cityscape: **not tested by this fix worker**; Full 3D world: **not tested by this fix worker**. Fresh app recaptures and independent re-review remain with the lead, as assigned; no overlap was inferred from foreground occlusion and no neighbours were removed.
