# Westminster Abbey

Original procedural exterior of the Abbey church in London, United Kingdom: medieval nave, choir and transepts, Henry VII Lady Chapel and the completed Hawksmoor west towers. The twin square towers, stepped counterforts, great west window, northwest clock, north transept rose, triple porch and long flying-buttress rows are retained in both LODs. Temporary works and the King Charles III Sacristy construction are excluded; the neighbouring Chapter House, cloisters, College Hall and St Margaret's Church are outside ownership.

## References and dimensions

The lead dossier (`tmp/top-cities/westminster-abbey/`) supplied OSM geometry and interior references. Two permitted supplemental exterior images were downloaded to ignored `refs/west.jpg` and `refs/north.jpg` and visually inspected; no photograph or texture is embedded or committed.

- [Abbey official dimension sheet](https://www.westminster-abbey.org/media/lnbl3alq/abbey-dimensions-for-web.pdf), checked 2026-10-13.
- [Abbey architectural history](https://www.westminster-abbey.org/history/explore-our-history/architecture).
- [OSM main outline, way 364313092](https://www.openstreetmap.org/way/364313092), dossier extract; ODbL 1.0, © OpenStreetMap contributors.
- [West facade](https://commons.wikimedia.org/wiki/File:Westminster_Abbey_west_facade.jpg), Steve Cadman, CC BY-SA 2.0, 2006; licence checked on Commons.
- [North transept](https://commons.wikimedia.org/wiki/File:Westminster_Abbey_north_transept_TTaylor_sky_adj.JPG), Amandajm, CC BY-SA 3.0; licence checked on Commons.

| Feature | Evidence | Model |
| --- | --- | --- |
| West tower pinnacle height | Official 225 ft 4 in (68.68 m; PDF rounds to 68 m); OSM 69 m | 69 m in both LODs |
| Extreme exterior length | Official 161.5 m | Mapped geographic x extent about 160.3 m |
| Nave width | Official exterior 85 ft (25.91 m) | Aisle block 25.4 m; projecting buttresses follow mapped envelope |
| Transept length | Official 62 m including lantern | Mapped high wings from church-frame z −26.4 to 33.2 m, plus porch/counterforts |
| Main nave/transept roof | OSM 43 m, roof height 9 m | Eaves 33.6 m, ridge 43 m |
| Crossing | OSM part 363728287, 51 m | Low square lantern and cap to 51 m |
| Lady Chapel turrets | Official 101 ft 6 in, about 30.94 m | 31 m |
| Main tower body | Mapped upper tower and pier parts about 59–62 m | Body 59 m, parapets about 61 m, pinnacle tips 69 m |
| Window sizes, clock radius, porch depths and sculpture | Estimated from mapped parts and the two exterior photos | Editable low-poly approximations |

## Geographic frame and source

Origin `[-0.1275,51.49944]`, real metres, +X east, +Y up, +Z south. Local y=0 is rigid pavement grade. The ridge controls on OSM way 153342452 are `[-0.1283312,51.4993982]` and `[-0.1274250,51.4993466]`, yielding 5.2262° south of east; rotation `THETA = −0.0912145` radians is baked into every exported vertex exactly once. The west frontage bearing is 264.774°.

`FOOTPRINTS` contains the detailed main church outline. `OSM_WAYS` lists 330 exact mapped church outlines/overlapping parts selected inside it, including nave roof strips, chapels, tower tiers and corner pinnacles. Neighbouring buildings and the Sacristy construction way are excluded. The plan helper simplifies sub-28 cm bends for the plinth and eastern lower chapels; focused tests check all distinct model horizontal vertices against the unsimplified ring with the provider's 0.8 m clipping slack.

The generator imports only Three.js, the shared asset builder and its own modules. Five merged materials use muted pale stone, grey roof, dark glass/recesses and the clock face. Dark palettes share the same names; the unlit night model approximates dim masonry rather than photographic floodlighting. Windows and portals are relief panels, not a modelled interior. Gothic trim and sculpture are simplified; the real northwest clock has geometric hands and ring, without Roman-number lettering. There are no scanned meshes, traced third-party geometry, embedded images, absolute altitudes or latitude scaling.

Flying arches are curved masonry bands with open air above the aisle roofs. Their terminal points penetrate the named outer buttress pier and high clerestory wall in both LODs. Tests isolate those support surfaces and exclude the member's faces, with displaced/free endpoint controls. Near has louvre bars, petal tracery, transoms, paired/denser mullions and small west-front figures. Far simplifies those details but keeps separate Gothic bays, both towers, all principal rooflines, the rose and supported arches. Near/far bounding silhouettes match.

## QA and visual evidence

The first procedural contact sheet, `tmp/top-cities/shots/westminster-abbey/round1/westminster-abbey-procedural-near-light-sheet.jpg`, was compared with the west/north references and dossier sheet. It exposed an over-tall full-plan low wall hiding the west portal and north porch. The correction reduced that volume to a plinth, retained the eastern lower chapel walls and seated the nave/transept masses independently. The exported final sheets in `tmp/top-cities/shots/westminster-abbey/final/` cover overview, west facade, north facade, east/back, roof/plan, entrance and rose detail in near/far and light/dark. These sheets were inspected against the references; the exported geometry now exposes the entrance and three porch openings. Small Gothic decorations remain stylized, especially the parapet tracery and figure group.

Focused tests pin the 69 m tower tips, 43 m nave ridge, sky between towers, west glass/clock, north rose/entrances, named flying-arch contacts, open aisle air gap, full ownership envelope and far silhouette/window rhythm. Export metrics and deterministic geometric QA are recorded under `tmp/top-cities/westminster-abbey/metrics.json`; depth-cycle and focused check results are recorded in the final worker report. There are no unresolved material cycles, below-grade structure or inverted exterior faces in the checked exports.

## Integration handoff

Cityscape: **not tested yet**. Full 3D world: **not tested yet**. Integration is checked separately by the lead; the inspector does not establish app shading, provider replacement, resident terrain footing residuals, late terrain refinement, mode/lifecycle behaviour or Tesla hardware performance. A bounded median terrain-pad proposal uses the owned ring, three grade reference positions and 12 m feathering; those positions require DEM and road/entrance verification. No app server, app bundle, shared registry edit or online deployment was performed.

Final export costs, 2026-10-13:

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 16,087 | 5 | 733,488 | 716.3 |
| far | 7,913 | 5 | 372,388 | 363.7 |

The final four exported contact sheets (near light, far light, near dark, far dark) were visually inspected together with the credited west/north photos in `tmp/top-cities/shots/westminster-abbey/final/reference-comparison.jpg`. The west portal, north porch and stepped towers remain readable across LOD and palette. Far removes thin louvres and petal rings; window bays and roof silhouettes persist.

Final validation: all 9 landmark-specific tests and all 3 Abbey registry conformance checks passed; the required combined run was 621/623 green, with both failures confined to another active builder’s Saint Sophia Kyiv footprint and far byte budget. Shared catalog and `pnpm assets:preview` failed because `docs/3d-top-cities-saint-sophia-cathedral-kyiv.md` did not exist; these are outside Abbey ownership. The same catalog validator passes against an isolated scratch root containing only the Abbey record, documentation and its two exports. Selected depth generation/check passes, with zero cycle edges dropped; metrics report zero layered faces, zero coplanar overlaps and 0% exterior back-face hits.
