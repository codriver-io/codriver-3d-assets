# Edificio Metrópolis, Madrid

Original texture-free procedural exterior of the 1911 Beaux-Arts building at Calle de Alcalá 39, at the Gran Vía junction. The rounded corner, paired giant columns, slate dome with gilded ornament, Metrópolis plaque and bronze winged Victory establish its identity. This models the modern Victory rather than the removed Phoenix/Ganymede group. Adjacent buildings and street furniture are excluded.

## Sources and rights

- [Wikipedia: Metropolis Building, Madrid](https://en.wikipedia.org/wiki/Metropolis_Building,_Madrid): 45 m overall height, five floors, inauguration 21 January 1911, Jules and Raymond Février, and four allegorical figures above the colonnade. The current Victory is distinguished from the historic Phoenix; no claim of surveyed tier dimensions.
- [OSM relation 4655046](https://www.openstreetmap.org/relation/4655046), exterior way [174845074](https://www.openstreetmap.org/way/174845074), courtyard way [331667820](https://www.openstreetmap.org/way/331667820), and mapped rotunda/dome parts [331667818](https://www.openstreetmap.org/way/331667818) and [332068538](https://www.openstreetmap.org/way/332068538). OSM contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright). All three provider exterior/part IDs are owned; the courtyard ring is a hole, not an additional building. Dossier parts carry approximate 37 m / 42 m heights, which are not treated as a survey of the entire 45 m building. The shared Overpass helper failed; two bounded OSM API way/full requests supplied missing relation rings.
- [Edificio Metrópolis, calle de Alcalá, Madrid, España, 2017-05-18, DD 08](https://commons.wikimedia.org/wiki/File:Edificio_Metr%C3%B3polis,_calle_de_Alcal%C3%A1,_Madrid,_Espa%C3%B1a,_2017-05-18,_DD_08.jpg), Diego Delso, CC BY-SA 4.0: complete exterior and stone/dome colours.
- [Edificio Metrópolis (Madrid) 18](https://commons.wikimedia.org/wiki/File:Edificio_Metr%C3%B3polis_(Madrid)_18.jpg), Roger Schultz, CC BY 2.0: night dome and drum details.
- [Edificio Metrópolis (Madrid) 20](https://commons.wikimedia.org/wiki/File:Edificio_Metr%C3%B3polis_(Madrid)_20.jpg), Riverac, CC BY 2.0: elevated view and Victory silhouette.
- [Cúpula do edificio Metrópolis en Madrid no 2016 (En reforma)](https://commons.wikimedia.org/wiki/File:C%C3%BApula_do_edificio_Metr%C3%B3polis_en_Madrid_no_2016_(En_reforma).jpg), Pedro Seoane Prado, CC BY-SA 4.0: slate dome, gilding and statue proportions.
- [Hôtel de la Cie. d'Assurance La Union et le Phénix Espagnol, Madrid 02](https://commons.wikimedia.org/wiki/File:H%C3%B4tel_de_la_Cie._d%27Assurance_%22La_Union_et_le_Ph%C3%A9nix_Espagnol%22,_Madrid_02.jpg), Jules et Raymond Février, public domain: wedge plan and courtyard. The dossier's Phoenix Ganymede photograph depicts the relocated older sculpture; it was inspected for disambiguation and excluded from the current-form model.

All photographs remain in ignored `tmp/top-cities/edificio-metropolis/refs/`. No photograph, texture, scan or external mesh appears in the exports. Mesh and decorative glyphs are original Codriver work.

## Frame and dimensions

Real metres, +X east / +Y up / +Z south, origin `[-3.69747,40.41878]`, flat rigid grade at `y=0`. Geographic coordinates are converted directly to local metres; rotation is already baked into the geometry and GLBs. Two north-wing control points `[-3.6976931,40.4189001]` and `[-3.6973379,40.4188814]` establish the roughly 94° bearing. The south wing from `[-3.6976530,40.4186310]` to `[-3.6973052,40.4187450]` follows roughly 67°. The rotunda faces the eastward street junction; `frontageBearing=90` describes that round frontage, not a global model rotation.

| Feature | Dimension | Basis |
| --- | --- | --- |
| Overall highest point | 45 m | Published Wikipedia / dossier |
| Storeys | Five | Published; regularized exterior rows |
| Owned plan | Approximately 44.4 × 30 m | OSM exterior envelope |
| Rotunda centre | Local east 14.8 m, south −4.45 m | Mapped dome parts |
| Street cornice / mansard top | 26 / 29.35 m | Photo estimate |
| Giant column shafts | 8.6–23.7 m | Photo estimate |
| Drum / dome foot | 26.3–33.85 / 34.15 m | Photo estimate |
| Dome largest diameter | 12 m | Photo estimate guided by mapped lower dome |
| Dome upper collar | 40.1 m | Photo estimate |
| Victory pedestal / figure | 40.5–41.3 / 41.3–45 m | Photo estimate |
| Bronze wing spread | 6.5 m | Photo estimate; retained in both LODs |

The foundation is a bounded median footprint pad with 6 m feather, declared for integration rather than certified against DEM data. The open courtyard is cut from walls and roofs. The model remains within the mapped outer outline with an explicitly tested 1.3 m allowance for projecting cornices and ornament. No street or neighbour is masked.

## Authoring and approximations

`src/peregrine/landmarks/top-cities/edificio-metropolis/` owns config, footprint, geometry, views and specific tests. Build with `pnpm build:top-cities-landmarks edificio-metropolis --no-check`.

Polygon-cut window apertures keep glazing behind the stone in both LODs. Individual rows and bays remain far; no continuous dark stripes replace the grid. Near retains mouldings, pilasters, dormers, medallions and finer gilded leaves. Far simplifies the same forms and keeps the full dome, winged statue, giant columns, openings, mansards and courtyard. All compatible geometry is batched and welded into six named material draws: stone, glass, slate, bronze, gold and selected night glow windows.

The slate dome is a faceted lathed profile with gold collars, original swag chains, stylized leaves and oculus rings. Seated stone allegories use touching skirt/torso/head/arm silhouettes. The bronze Victory uses a thick wing silhouette and feather divisions, facing the junction. The Metrópolis plaque uses original geometric line glyphs cut into the dark surface, with flush pale infill rather than overlapping text. Fine capitals, relief carving, lead tiles, rear service details and the precise individual window irregularities are abstracted. Five floors is the published count; high-ground windows and attic dormers are not a survey of internal levels. Decorative orders and statue limbs are not suspended structural members; bridge/member terminal tests are N/A.

## Export and verification

Final measured costs and final verification results are recorded below after the focused checks. Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. The lead owns live runtime shading, provider replacement, DEM contacts, lifecycle tests, app captures and independent review; no app server or deployment was performed in this shared worktree.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 26,136 | 6 | 931,564 | 909.7 |
| Far | 8,484 | 6 | 348,040 | 339.9 |

Exported bounds are identical in both LODs: 45.46 m east–west × 30.87 m north–south, top 44.931 m and lowest point 0 m. Both fit the building budgets with headroom. No textures, codecs, extra bridge attributes or removable bytes. Actual device performance is not measured.

Reference sheet and exported near/far light/dark sheets were actually opened and judged together in `tmp/top-cities/shots/edificio-metropolis/final-comparison.jpg`. Each exported sheet includes overview, junction facade, opposite/rear, roof, street entrance and close dome. Individual evidence names are `edificio-metropolis-glb-{near,far}-{light,dark}-sheet.jpg`; the alignment view is `edificio-metropolis-procedural-near-light-top.png`. The initial procedural sheet is retained for comparison. All output is ignored local inspection evidence.

First visual correction: the round ground-floor wall was blank, so it gained real openings; the bronze wings faced away from the road, so the figure was rotated to show its spread from the junction. Added original Metrópolis glyphs, dome swags and arched drum mouldings after comparing the close photograph. Second correction: a plaque material cycle was eliminated by cutting glyph-shaped holes in the slate panel and filling them with flush pale geometry; an end of a roof cornice was brought inward to meet the owned-envelope allowance. Final exported contact sheets were inspected again; far preserves the individual window rows and iconic crown, and the courtyard remains open.

Deterministic QA `tmp/top-cities/edificio-metropolis/metrics.json`: **no issues**, zero layered faces, zero coplanar overlaps, 0% backface hits, nothing below grade and no removable attributes. Depth generation dropped **zero cycle edges**; the per-ID depth check passes. Four specific tests pass (published-height tolerance and LOD envelope, all ownership IDs and mapped containment including a deliberately outside point, raycast storefront/columns/dome, open courtyard and bronze wing rays with a negative outside-wing case). All three Edificio Metrópolis registry conformance tests pass, including GLB/source bounds and budgets.

The complete requested focused run recorded 464 passes / one failure in `tmp/top-cities/edificio-metropolis/tests.log`: the unrelated in-progress `high-museum-of-art` near model had 76,308 triangles against its 60,000 cap. Catalog validation, `pnpm assets:check` and `pnpm assets:preview` were attempted and retried; they were blocked by the same builder's unregistered `/models/buildings/high-museum-of-art-far.glb`, not this asset. No shared file was changed to bypass the checks. The lead should rerun shared checks when that other asset settles and regenerate all depth records at commit time. Only the permitted generated `src/peregrine/landmarks/depth-layers.js` was touched outside this landmark's ownership.

## October 12 review fix

Review b5a: near gilded swags now have varied thickness and attached leaf/pendant masses; near seated allegories have a broader lap, bent knees, feet and drapery folds. Far black/gold dome and present-day Victory envelope preserved. Fine sculpture remains an original abstraction, with no texture or copied mesh.

Latest measured default-scene costs: near **26,136 triangles / 6 draws / 931,564 bytes**; far **8,484 triangles / 6 draws / 348,040 bytes**. These supersede earlier authoring-stage results.

Inspected exported contact sheets in `tmp/top-cities/shots/edificio-metropolis/b5-fix/`: near/light, near/dark and far/light or far/dark, including the reviewed facade/crown details; the additional close near dome sheet is in `b5-fix-close/`. Source geometry QA is clean for both LODs, with zero layered/coplanar faces, no material cycles, and preserved bounds/window rhythm. The four-landmark tests pass 27/27; combined registry and landmark run passes 501/502, with its sole unrelated failure at `cite-de-carcassonne` (footprint is a real polygon). Evidence: `tmp/top-cities/marine-building/b5-fix-tests.log` and `b5-fix-metrics.json`. Depth generation and scoped `--check` pass; catalog validation, `pnpm assets:check` and `pnpm assets:preview` pass (286 records, 560 variants).

Cityscape: **not tested by this fix worker**; Full 3D world: **not tested by this fix worker**. Fresh app recaptures and independent re-review remain with the lead, as assigned; no overlap was inferred from foreground occlusion and no neighbours were removed.
