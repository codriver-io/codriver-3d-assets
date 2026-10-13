# Øresund Bridge — Copenhagen / Malmö

Original procedural model of the current 2000 combined E20 road/rail bridge between Peberholm and Lernacken. Four freestanding tapered concrete pylons, paired harp stays, a steel truss carrying rail below motorway, and long pier-supported approach viaducts distinguish it. Tunnel, island landscape, toll plaza and traffic are outside the asset.

Build: `pnpm build:top-cities-landmarks oresund-bridge --no-check`. Inspect: `/asset-preview.html?asset=oresund-bridge&view=facade`.

## Sources and dimensions

Primary [operator bridge facts](https://www.oresundsbron.com/en/about-oresundsbron/about-us/facts-about-oresundsbron/bridge-pylons-and-cable-stays) establish four pylons, 160 stays, 490 m main span, 57 m clearance, 203.5 m crown, 7,845 m overall and west/high/east sections of 3,014/1,092/3,739 m. The [Arup design account](https://www.arup.com/projects/oresund-link/) confirms the road/rail scheme and 2000 opening. The contemporary [Royal Academy of Engineering account](https://www.ingenia.org.uk/articles/the-oeresund-bridge-linking-scandinavia-to-the-continent/) describes pentagonal pylons, paired harp cables at 20 m deck / 12 m tower intervals, lower crossbeams near 45 m and 49 approach girders. [Arup Journal 2/1996](https://www.arup.com/globalassets/downloads/arup-journal/the-arup-journal-1996-issue-2.pdf) gives the 160/141 m side spans and 22 west / 27 east approach spans; exact pier shaft sections remain estimated.

| Quantity | Model | Basis |
| --- | ---: | --- |
| Crown | 204 m | Brief/dossier rounded value, current operator 203.5 m |
| Main span | 490 m | Published; second tower pinned to first |
| Deck overall width | 23.5 m | Dossier published dimension |
| Road / lowest high-span soffit | 66.5 / 57 m | Road estimate, published clearance |
| Rail floor / rail head | 57.7 / 58.22 m | Estimated section |
| Pylon lateral centres | ±14 m | Mapped outline widening and aerial photo |
| Pylon base / crown sections | 9.6 × 6.2 / 5.2 × 4 m | Photo estimates, pentagonal sections |
| Stay inventory | Near 160; far 40 | Ten pairs each side of four pylons; far five single representatives per half-fan |
| Cable radius | Near and far 0.115 m | Visual estimate; unchanged physical thickness at LOD switch |
| High bridge | 1,092 m | Published; 301 m either side of towers |
| Main truss depth | 9.5 m | Estimated to achieve published 57 m clearance |
| Viaduct pier stations / web bays | Estimated; near 14 m / far 28 m bays | Repeated procedural visual rhythm |

The mapped bridge envelopes are OSM ways **912575184, 912575183, 370256014**. Roadway ways **23283662, 304383859, 370255938, 370255940, 304383858, 370255937, 370255939, 148500437** define the midpoint frame. The full bridge is modelled with mapped grade continuations from ways **912575194, 912575195, 8123176, 148500436**. These were read from two small OSM API map extracts after the shared Overpass helper timed out; no raw Overpass calls were made. A bounded 2026-10-13 Overpass building/part query found four pylon outlines (**121292169, 121292281, 121292283, 121292284**) and sixteen shaft/roof parts (**370255910–370255920, 370255922, 370255923, 370255925–370255927**), missed by the original road-focused dossier. Every exact id and ring now belongs to `OSM_WAYS`/`FOOTPRINTS`, with those twenty rings forwarded through `SPEC.buildingFootprints` to the reversible bridge provider mask. Near footprints contain the road/truss and pylon widening; grade ramps and foundations extend intentionally beyond mapped deck outlines.

Local real metres +X east/+Y up/+Z south around `[12.8270015,55.575176]`; station increases west to east. The alignment is the midpoint between directional carriageways, simplified within 0.4 m. Orientation is baked through one shared station/lateral frame; runtime applies latitude stretch once. Local y=0 is visual water/flat ground, with hidden submerged foundations omitted. `terrainPolicy: absolute-deck` fits support feet separately and keeps the high span at its authored altitude without flattening the strait. At-grade landings taper the deck, kerbs and rails; river spans retain rigid published width. Shared layer supplies road masks, HD draping and navigation height; no shared module extension.

## Procedural decisions and reference rights

Pentagonal lofts form four separate tapered pylons. The only transverse tower beams are below rail level at 45 m; the lower opening between each pair remains open, with no central pier or overhead frame. Side-span piers stand 160 m outside each pylon station. Every stay reaches its named pylon and a steel deck block. Open steel girder webs, chords and rail floor remain in far LOD. Near includes paired cables, web/floor members, sparse parapet posts, casting seams and lane dashes; far removes minor fittings and coarsens bays while preserving silhouette and openings. Pavement, ballast and paint are separate quads to keep costs down. Structural supports, road faces and attachment weights share the profile. Contact tests use the actual named support triangles, exclude the member, and include a deliberately shortened cable negative case.

Muted concrete, grey-blue steel, grey cables and neutral pavement are calibrated to the dossier photographs. Both palettes share names. Night dims the concrete and steel; specialised colour displays and detailed pylon lighting are omitted. Railway rails are modelled below the motorway but are not a second drivable road; median/crossing heading queries are rejected. Deck thickness, pier sections/stations, hardware, rail layout and grade joins are visual estimates, not a structural survey.

Reference-only photographs are listed with author/licence in the catalog source provenance. The primary aerial [20191107 Oresundsforbindelsen 0271](https://commons.wikimedia.org/wiki/File:20191107_Oresundsforbindelsen_0271_(49042749191).jpg), News Oresund / Anna Palmehag and Jenny Andersson, has Commons CC BY 2.0 metadata (description also mentions CC BY 3.0); the file page was checked. Remaining dossier images use CC BY 2.0 except Neptuul's Klagshamn view, CC BY-SA 4.0. No additional photographs, image texture, scan, captured mesh or traced model ships.

## Verification evidence

First procedural contact sheet opened: `tmp/top-cities/shots/oresund-bridge/iteration-1/oresund-bridge-procedural-near-light-sheet.jpg` (overview, facade/back, roof, deck, tower, detail, underside). It confirmed the open truss and four-pylon silhouette; redundant straight alignment vertices were reduced, pavement/paint became quads, and pylons changed from flat emissive material to shaded concrete. The final views below cover the exported GLB and both local application modes.

Independent review, full active route/car/traffic/camera lifecycle and hardware timing are checked separately. No online deployment is authorized or performed.

## Measured frame, ramps and exports

Physical modeled deck length **7,833.822 m**, 0.14% shorter than the published 7,845 m. Mapped alignment including grade joins is **8,297.523 m**. West/high/east modeled sections are **3,010.864 / 1,092 / 3,730.957 m**. Mapped tower placement differs by about 2.22 m at the east tower when the published 490 m separation is enforced. West/east grade joins continue **242.812 / 220.890 m** beyond the structural abutments, with 25 m level ends and parabolic vertical curves of up to 100 m. The steepest authored fallback grades are **6.8867% / 7.6574%**. Source abutment roadway is 10 m; high roadway is 66.5 m. Live HD joins use their accepted provider heights instead of the zero-height fallback.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 81,676 | 19 | 3,706,732 | 3619.9 |
| Far | 29,228 | 7 | 1,020,740 | 996.8 |

Bounds are identical in both LODs: x −3,393.324..4,344.019 m, y approximately 0..204 m, z −1,704.531..1,101.087 m. A −0.000001 m minimum is float quantization. Near batches three station chunks into 19 draws; far uses seven merged material draws. Costs include bridge attachment attributes and exclude provider overlays. Both LODs now use the same 0.115 m cable radius; far retains five representative stay groups per pylon face without exaggerating thickness. No hardware timing is claimed.

Original delivery deterministic checks: **608 combined focused tests passed (12 landmark tests)**; `node scripts/asset-catalog.mjs`, `pnpm assets:check`, `pnpm assets:preview` and the generated depth-table check pass. Landmark tests cover four crowns/openings, 490 m separation, 57 m soffit, roadway/rail floor, all enumerated member contacts and a shortened-cable negative case, mapped carriageway ownership in both headings, rigid deck width, repeatable fitting, missing terrain, flat restoration and GLB attachment/normal/bounds round trip. World cut tests cover area triangles, shader-extruded collinear faces, repeatability, actual shared HD endpoint clipping and original-index restoration. Asset metrics report **zero issues, zero coplanar overlap pairs, zero unsupported end candidates and 0% back-face hits**.

## App placement and accepted OSM snapshot

The normal unlit/vertex-shaded bridge material path is used; no viewer material or product gate code was substituted. Local demo QA grants follow the maintained app-shot tool.

The initial upstream lane requests returned 503 and the shared dossier continuation query timed out. Two small OSM API endpoint extracts supplied the missing grade connections. This is an explicitly declared **OSM snapshot**, not a claim of a fresh live Overpass query. The ordinary server, worker, HD shaders, masks and provider dash attributes consume it without browser interception or synthetic mesh injection.

Both ends, both headings, physical abutments, approaches, towers and midspan were captured with HD off and with the accepted HD snapshot. Each mode's report verifies all **111 mapped E20 vertices in both travel directions**, with no null owned-road heights. Median, lateral +30 m and crossing headings return null. Near/far app captures independently verify LOD activation. Every final world view has **548 bottom-vertex ground samples**, with maximum residual approximately **0.000002 m** against the resident DEM. No bridge corridor or seabed is flattened.

### World endpoint correction

The first world HD sheet showed a transverse gap at each model cut. The shared HD splitter appends retained outside provider vertices in relative-height space; its caller then re-adds a ground buffer that contains only the original vertices. Newly appended outside vertices consequently stayed at relative height while the adjacent original roadway and landmark overlay were absolute.

`oresund-bridge-landings.js` and the owned `layer.js` wrapper capture original provider triangles before clipping and restore the appended vertices' ground by interpolation after the caller restores the originals. This preserves the provider's actual bank datum, style, dash phase and paint; the high deck, navigation heights and original source vertices are unaffected. Shader-extruded collinear paint/wall faces use their source edge interpolation. Repair runs once per geometry, only while this bridge is wanted in world; terrain rebakes provide new geometries and disposal releases the records. **110 / 108 appended cut vertices** were repaired at the west/east landings. No shared runtime source extension was needed.

The new world shots show pavement and lane paint continuing through both cuts without the original gap. Both-direction roadway heights remain unchanged by this provider-mesh repair. Cityscape uses the unchanged shared path. Provider overlays observed in both modes use **6–16 draws**, at most **39,326 triangles / 1,535,796 bytes of geometry buffers**, separately from GLB download bytes. No per-frame tessellation or cut repair is added.

### Live heightAt values

Values below are metres above queried ground, at lateral −5 / +5 m with the accepted HD snapshot; forward and reverse headings agree. The high-span absolute road is 66.5 m; world values are larger because the local seabed DEM is below the sea-level authoring datum. Transverse differences at landings reflect the query ground, not stacked directional decks.

| Station | Cityscape −5 / +5 | World −5 / +5 |
| --- | ---: | ---: |
| West grade join, 15 m inward | 10.000 / 10.000 | 10.062 / 9.919 |
| West abutment +12 m | 10.014 / 10.014 | 10.426 / 10.049 |
| West approach midpoint | 41.171 / 41.171 | 46.984 / 46.998 |
| West pylon | 66.500 / 66.500 | 73.630 / 73.628 |
| Main-span midpoint | 66.500 / 66.500 | 73.480 / 73.481 |
| East pylon | 66.500 / 66.500 | 73.178 / 73.187 |
| East approach midpoint | 40.592 / 40.592 | 46.570 / 46.581 |
| East abutment −12 m | 10.011 / 10.011 | 4.302 / 4.419 |
| East grade join, 15 m inward | 9.005 / 9.005 | 9.142 / 8.841 |

Without HD, the same two grade joins return 0 / 0 m in Cityscape; world residuals range roughly −0.16..+0.14 m against transverse terrain. The accepted HD samples replace those fallback approach heights. The main span stays at the same authored absolute height.

Evidence opened and judged under `tmp/top-cities/shots/oresund-bridge/`:

- `final/reference-and-export-sheet.jpg`: three reference photographs beside current exported near/far light/dark facade, driving and tower views, plus back, roof, truss detail and underside. The lower pylon openings and side-span piers were corrected after comparison; both LODs keep the open truss and distinct four pylons.
- `app-cityscape-final/` and `app-world-final/`: unobstructed ordinary-app far/near/street views and activation reports.
- `hd-probes-cityscape/` and `hd-probes-world/`: both grade joins and physical abutments in both headings, all approaches/towers/midspan, exact height and footing reports.
- `final/hd-app-approaches-sheet.jpg`: final HD snapshot approach/midspan montage in both modes; individual full-size images remain in the mode directories.
- `before-cut-fix-world/`: the rejected original world seam, retained for comparison.
- `final/{cityscape,world}-hd-paint-{on,off}.png`: ordinary HD paint toggle; on restores the three provider material uniforms to 1.

| Case | State |
| --- | --- |
| Cityscape structure, LODs, both joins/headings | Verified locally |
| Full 3D world structure, DEM feet, both joins/headings | Verified locally |
| Accepted OSM snapshot HD pavement/paint and reversible cut restoration | Verified in both modes |
| Fresh live upstream OSM lane response | Not verified; upstream timeout/503 |
| Full active route/car/traffic/camera/picking session | Not tested; common height API verified |
| Independent release review and Tesla hardware | Not tested; coordinator/reviewer responsibility |

No photos/textures, shared module edit, online deployment or published inspector page is included. The owned branch contains only the landmark folder, catalog record, document and near/far/manifest exports. Local servers are stopped after capture; generated renderer bundles are restored before committing.

## Independent review b9b corrections (2026-10-13)

The tan/white split crowns were overlapping provider buildings, not a loft cap/side elevation gap. Masking only the road envelopes left the generic 204 m pylon extrusions visible around the original tapered concrete legs. The exact four building outlines and sixteen building-part rings now use the existing bridge building-mask lifecycle. No terrain corridor is flattened, no neighbour is masked, and no shared runtime file changes. Each original pylon remains one watertight pentagonal concrete loft with a three-triangle upward crown; a regression test checks manifold edges, cap winding and the unchanged 204 m crown datum under spatially varying terrain in both LODs. Provider-triangle tests verify owned suppression, neighbour preservation and exact index/draw-range restoration when disabled.

Far stay radius was reduced from **0.65 m to 0.115 m**, matching near; the representative harp layout and deck/pylon contacts remain. Measured costs are unchanged: near **81,676 triangles / 19 draws / 3,706,732 bytes (3619.9 KiB)** and far **29,228 / 7 / 1,020,740 bytes (996.8 KiB)**. The near GLB is byte-identical because its geometry was already closed and correctly fitted.

Opened exported near/far light contact sheets at `tmp/top-cities/shots/oresund-bridge/review-fix/`; compared identical ordinary-app views in `review-fix-cityscape/` and `review-fix-world/`. The white provider shafts and split crowns are absent in both modes. No reference screenshot, inspector material or synthetic provider mesh was substituted. Focused crown/LOD evidence is under `review-fix-{cityscape,world}-lod/`: both tower pairs, near→far→near through the actual zoom hysteresis (15.31→14.79→15.31 at a road-centred camera), runtime mask counts, absolute crown heights and DEM footing residuals.

The shared launcher `local:setup`, `local:doctor`, `local:up` and `local:check` are unavailable here (each reports that universal-local-dev 1.1.0 must be installed); the explicitly assigned native bridge slots were used for app QA. Local generated viewer/bundle artifacts are excluded from the commit.

Correction validation: **16/16 landmark tests and 614/614 top-cities conformance tests pass**; catalog validation, `assets:check`, `assets:preview`, depth regeneration/check and `git diff --check` pass. Depth cycles, coplanar pairs and layered-face flags are zero; outside-in back-face hits are 0%. The thin far cables expose **eight automated member-end candidates at y=85 m**: their centres are approximately 0.93 m *inside* the closed pylon, farther from its skin than the heuristic's 0.75 m search. These are embedded anchors, not free ends: `review-fix-embedded-stays.json` verifies all eight by odd ray intersections with their named closed pylon and records nearest-surface distance; the existing named-support tests plus shortened-cable negative case pass. The source/GLB contact sheets show the stays entering the pylons. These heuristic candidates remain documented for independent review rather than moving a structurally valid anchor to satisfy a surface-only heuristic.
