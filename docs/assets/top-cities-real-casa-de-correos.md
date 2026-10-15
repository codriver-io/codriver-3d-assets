# Real Casa de Correos, Madrid

Original procedural exterior of the Real Casa de Correos at Puerta del Sol 7, with its projecting granite entrance bay, balcony, royal pediment, brick panels, four clock faces and open octagonal bell lantern. It represents the familiar permanent exterior without temporary restoration coverings. The adjacent Real Casa de Postas and plaza buildings are excluded.

## Sources and geographic frame

Consulted 2026-10-15, starting from `tmp/top-cities/real-casa-de-correos/`.

- [Community of Madrid](https://www.comunidad.madrid/real-casa-correos): completion in 1768, Jaime Marquet's two-courtyard arrangement, the Losada clock inaugurated in 1866, regional government use and Km 0. These are historical facts, not metre-height evidence.
- [OSM relation 4098953](https://www.openstreetmap.org/relation/4098953), outer [way 5936475](https://www.openstreetmap.org/way/5936475) and inner way 306984108: mapped block and court envelope. Dossier supplies 10 glass roof parts, the central projection and two clock-tower parts. All 14 replaced way IDs are listed in `OSM_WAYS`. The shared Overpass helper failed on the outline request; two single-way OSM API reads provided the outer and inner geometry, saved in ignored scratch.
- [Real Casa de Correos (Madrid) 03](https://commons.wikimedia.org/wiki/File:Real_Casa_de_Correos_(Madrid)_03.jpg), Dimo Dimov, CC BY 2.0: facade materials, three window rows and lantern silhouette; Commons licence checked.
- [Clock detail, 2017-05-18, DD 02](https://commons.wikimedia.org/wiki/File:Real_Casa_de_Correos,_Plaza_del_Sol,_Madrid,_Espa%C3%B1a,_2017-05-18,_DD_02.jpg), Diego Delso, CC BY-SA 4.0: square clock stage, pediments and open bell chamber; Commons record checked.
- Dossier sheet also inspected: Jean Laurent's public-domain historic Puerta del Sol view, and Enric's CC BY 4.0 facade/entrance photographs (117 Real Casa de Correos and 126 Puerta del Sol). Titles and licence credits remain in the dossier's `refs/SOURCES.txt`.

No photographs, scans, textures or third-party meshes are exported. Geographic data © OpenStreetMap contributors, ODbL 1.0. Original source is editable Three.js geometry.

Real metres: +X east, +Y up, +Z south; origin `[-3.7038, 40.4164]`, with rigid `y=0` at local flat grade. Facade axis approximately 83° from north, outward bearing 353°. The mapped north boundary provides the orientation; the 7° rotation is baked into every vertex and must not be applied again. The replacement ring follows the entire outer block, including its covered courts. It excludes the neighboring Casa de Postas. The indicative Km 0 plaque projects about 2.4 m north of the wall and owns no provider pavement.

| Feature | Model | Basis |
| --- | --- | --- |
| Block | about 69 × 50 m along its axes | OSM mapped envelope |
| Main wall cornice / parapet | 17 / 18.6 m | Photo estimate |
| Projecting entrance bay | about 13.8 m across, pediment apex 20.5 m | Photo estimate fitted to mapped projection |
| Portal | 3.2 m wide, arch top 5.6 m | Photo estimate |
| Clock body | 5 × 5 m, pedestal 18.7 m to top 28.2 m | Mapped tower footprint; estimated height |
| Clock centre / diameter | 25.65 / 2.7 m | Photo estimate |
| Open bell stage | 28.9–31.9 m | Photo estimate |
| Dome / finial top | 33.35 / 34.6 m | Photo estimate; no surveyed total height found |
| Covered court | about 41 × 22.5 m | OSM glass-roof parts and inner outline |

## Model and LOD

Seven merged materials in both variants: subdued granite `stone`, muted `brick`, grey-brown `roof`, dark `glass`, dark metal `iron`, green-grey `clock`, bronze `gold`. Windows are genuine holes with separate infill. Near keeps reveals, mullions, Juliet rails and quoin courses; far uses flush infill inside the holes, fewer side/rear/court bays, and retains all three facade rows, portal arch, balcony, pediment, four clocks, open lantern and bell/ball silhouette. No full-height window bands or blank far extrusion. Court glazing and internal partitions are simplified, sculptural arms are grouped silhouettes, and flags, banners, plaques' lettering, exact masonry joints and interiors are omitted. Night uses a dimmer material palette; no invented facade or window illumination.

Export: `pnpm build:top-cities-landmarks real-casa-de-correos --no-check`.

## Verification

The first exported contact sheet exposed excess facade subdivision and a plain white clock shoulder block. Wall rectangles were consolidated, hidden far reveals dropped, and shoulders given separate brick/stone panels. Clock offsets were increased, and the tiny Km 0 surface's redundant backing was removed. Final costs and screenshot evidence are recorded below after the focused export checks.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. A bounded median footprint pad is declared; app placement, provider replacement, DEM refinement/residuals, pad edges, mode changes, late loading and Tesla hardware remain for lead integration and independent review. Contact sheets verify the standalone exports only. No shared runtime files were changed except the permitted generated depth table.

### Final export evidence

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 29,961 | 7 | 1,437,716 | 1,404 |
| Far | 9,873 | 7 | 416,560 | 407 |

Both GLBs have identical bounds: `[-34.8537,0,-22.7868]` to `[40.7515,34.6,35.9671]`. Costs describe the exported default scene, not measured vehicle hardware.

Judged the final exported contact sheet `tmp/top-cities/real-casa-de-correos/final-comparison.jpg`: reference photos alongside near/far front facades, near/far clock detail, night entrance/tower, overview, rear and above. Individual captures are under `tmp/top-cities/shots/real-casa-de-correos/real-casa-de-correos-glb-{near,far}-{light,dark}-{view}.png`. Full reference dossier sheet: `tmp/top-cities/real-casa-de-correos/refs-sheet.jpg`. The final review refined the tall clock pedestal, reduced shoulder panel heights and rounded the lantern cap. Contact testing then moved the balcony brackets' lower attachments onto the solid lintel above the mezzanine openings; the final entrance captures include this correction. Stone reliefs, roof internals and fine lantern metalwork remain deliberate abstractions for independent review.

- Requested combined registry + landmark command: **835/835 pass**, recorded in `tmp/top-cities/real-casa-de-correos/tests-final.log`.
- Landmark-specific suite, including an additional comprehensive Juliet-rail test: **14/14 pass**, about 0.55 seconds. Pins all four clocks, portal recesses, open lantern negative space, both LOD bounds, eight post-to-collar contacts, balcony posts/brackets, all 158 Juliet-rail terminal points and deliberately detached negative cases.
- Deterministic exported audit: **ok** for near/far; zero layered or coplanar-material issues, identical LOD bounds, no removable attributes, 1.1% back-face rays (below the 2% threshold). Report: `tmp/top-cities/real-casa-de-correos/metrics.json`.
- Scoped depth generation and `--check`: **pass**, zero dropped cycle edges; `cycles.json` was inspected and empty. Only the permitted generated `src/peregrine/landmarks/depth-layers.js` was changed outside the owned asset paths; the lead should regenerate all IDs when committing concurrent work.
- Global catalog check: **pass**, 406 entries / 774 GLB variants. Earlier attempts and preview were transiently blocked by the concurrent Gateway Arch missing documentation; that record is now complete. No other landmark files were edited to resolve this. Final `pnpm assets:preview`: **pass**, local catalog written to ignored `tmp/champlain-preview/asset-catalog.html`.

Independent exported/app review remains pending. Neither mode is certified by the standalone screenshots.
