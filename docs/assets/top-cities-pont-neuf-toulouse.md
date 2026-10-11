# Pont Neuf, Toulouse

Original procedural model of the current Pont-Neuf across the Garonne, joining Rue de la République to Place du Pont Neuf. The former triumphal gateway, demolished in the nineteenth century, is absent. Seven unequal basket arches, six through-pier flood openings (ouïes / dégueuloirs), paired pointed cutwaters with pyramidal caps, brick spandrels and pale stone arch/oculus surrounds establish its identity.

The [DRAC Occitanie publication *Du pont du Gard au viaduc de Millau*](https://www.culture.gouv.fr/Media/Regions/Drac-Occitanie/Files/Doc-Ressources-documentaires/Doc-Publications/Doc-collection-DUO/Patrimoine-protege/Ponts-en-Occitanie/Du-pont-du-Gard-au-viaduc-de-Millau), pp. 48–49, states construction 1544–1632, inauguration 1659, 220 m length, 20 m deck and seven arches ranging from 13.47 to 31.70 m. Its description establishes the asymmetric humpback profile, brick/stone polychromy and unfinished rough-cut stone ornament around the flood openings. The [tourism office](https://www.toulouse-tourisme.com/en/unmissables/must-see-banks-garonne/) also counts seven arches; the municipal directory's eight-arch statement conflicts with the publication and reference photographs and was not used.

| Feature | Evidence | Authored value |
| --- | --- | --- |
| Structural length | DRAC, 220 m | OSM bank-to-bank road 222.214 m, preserved rather than rescaled |
| Deck width | DRAC, 20 m | 20 m excluding projecting coping / cutwaters |
| Arch extremes | DRAC, 13.47–31.70 m | 13.47 / 31.70 m; intermediate widths estimated against mapped piers |
| Six pier locations | OSM bridge outline 420826560 | 19.8, 43.3, 72.5, 109, 151.6, 191.8 m from west bank |
| Road alignment | OSM 315778508 / 305162356 plus connecting approach ways | ~75.8° west to east; 110 m approach continuation each side |
| Flat deck heights | Photographic estimate, not surveyed | Banks 8 m, asymmetric crown 11 m at 56% of crossing |
| Flat approach grades | Model compromise | 110 m smooth ramps; steepest 10.91% |
| Flood openings | Photographic estimate | 4.715 m nominal diameter (15% review enlargement), slightly scalloped upper silhouette |
| Road / walks / lamps | Photographic estimates | 7 m roadway, asymmetric walks following mapped road offset, lamps every 21 m |

Geometry is in east/up/south real metres about `[1.43906915,43.5993578]`, with geographic orientation baked once. The local y=0 datum is flat grade, with no terrain or latitude scaling in the GLB. The profile owns only the mapped carriageway and rejects crossing headings. `createRegistryBridgeLayer` supplies loading, road replacement, height fitting and HD overlays; no shared module changes. The provider extrusion mask retains the actual mapped bridge outline, including all cutwaters; exported fallback asphalt extends onto the mapped approaches outside that structural footprint.

Near merges repeated voussoirs, exposed brick mortar courses, parapet courses, pierced rings, lamp posts and noses into two station chunks. Far reduces curve segments and removes fine mortar/parapet seams while retaining every opening, cutwater, lamp and coping silhouette. Nine matching light/dark semantic palette keys; lamp heads and small pier floodlights use `lamp`. Photo reference materials are not redistributed.

Reference sheet inspected: lead dossier `refs-sheet.jpg`. Commons references: Didier Descouens, *Le Pont-Neuf de Toulouse* and *Le pont Neuf à Toulouse*; Frédéric Neupont, *Toulouse - Pont-Neuf détail pile* and *Toulouse - Pont-Neuf (1) 01*; kallerna, *Pont-Neuf de Toulouse 4* and *9*, all CC BY-SA 4.0 (URLs and provenance in the catalog record). These are visual references only; all geometry is original.

Approximations: arch rise and detailed basket curvature, deck datum, pier heights, unfinished stone profiles, exact masonry layout, cutwater dimensions and lamp designs. OSM carriageway offset makes the two modeled walks asymmetric. Modern furniture is simplified. No foundations below y=0, water, bank terrain, inscriptions or historic demolished structures. Original photos show weathering and irregular masonry beyond this texture-free model's detail.

Verification: initial procedural near/light contact sheet `tmp/top-cities/shots/pont-neuf-toulouse/pont-neuf-toulouse-procedural-near-light-sheet.jpg` opened in overview/front/back/roof/deck/underside/pier/detail views against the dossier. It exposed inward-facing mortar and cutwater faces; winding was corrected before export. Further exported and runtime evidence follows.

The first Full 3D world inspection exposed an invalid absolute-deck policy for this local-grade asset (buried arch crowns at the bank terrain altitude); changed to the existing bank-fit policy with per-station support weights. Cityscape / Full 3D world verification continues below. Independent reviewer acceptance remains a coordinator gate.


Final exported GLB contact sheet opened: `tmp/top-cities/shots/pont-neuf-toulouse/export-reference-contact-sheet.jpg`, with four dossier photos beside overview/front/back/above/deck/underside/pier/detail for near/far and light/dark. All seven river arches and six flood tunnels survive both LODs. Coarse far voussoirs and smooth unweathered brick remain deliberate simplifications; the stone flood surrounds approximate the original rough ornament. Coplanar flags at pier parapet seams and cutwater course strips were removed; initial-build QA reports **0 overlapping material pairs, 0% back-facing exterior hits on 69 rays, minY 0, top 16.629 m**. All structural vertices fit the mapped outline within its 0.8 m provider slack (worst offset 0.726 m at an estimated cutwater); fallback approach pavement extends beyond that outline along the mapped roadway.

| GLB | Triangles | Mesh draws | Bytes | KiB (rounded) |
| --- | ---: | ---: | ---: | ---: |
| Near | 31,426 | 17 | 2,080,152 | 2,031 |
| Far | 13,746 | 8 | 810,264 | 791 |

Focused conformance + landmark tests passed 252/252; the landmark-specific file passed 6/6 in under one second. Tests pin actual open arch widths, through-pier tunnels, grade/support contacts, footprint containment with provider slack, both navigation headings, off-road/crossing rejection, export bounds/normals/materials and bridgeLift weights. `node scripts/asset-catalog.mjs` passed: 209 records, 386 GLB variants; `pnpm assets:preview` generated the local inspector, and `pnpm build:peregrine` succeeded (preview build `0311e0633c1f`). Generated runtime bundles are excluded from this landmark commit.

Cityscape: **verified locally** for near/far loading, standard-road approach continuity in both directions and shared navigation-height samples. Full 3D world: **verified locally** for the same limited checks with Terrarium terrain enabled and the existing bank-fit policy. The profile uses local grade and therefore bank-fit, rather than absolute-deck; no terrain corridor pad is declared for the river. The model and navigation use the same bank ground interpolation, and per-station weights keep foundations planted and structural crowns attached. Terrain elevations are renderer samples, not surveyed bridge levels; this is a visual placement check rather than a terrain certification or structural survey.

Screenshots opened: `app-modes-final.jpg` (Cityscape/world far/near/street), `app-approaches-sheet.jpg` (the required ad-hoc `app-shot --at` captures at both banks and both bearings), and `navigation-approaches-sheet.jpg` (both modes, both banks, both bearings), all under `tmp/top-cities/shots/pont-neuf-toulouse/`. Pavement joins the model's ramps and no doubled generic bridge deck is visible. `app-cityscape/report.json` and `app-world/report.json` record loaded/active near and far models. The ad-hoc helper reports `active:false` for its synthetic `spot-*` target because that name is not a landmark ID; separate navigation instrumentation confirmed the real layer active at every captured bank. Local `/osm-lanes` returns 503 without Redis, so HD pavement, lane count, dash phase and paint-toggle continuity remain **not tested**. Account-related CORS/404 requests are outside these static model checks.

Live height samples below are metres relative to the query ground and are identical for headings 75.8° and 255.8°; all crossing-heading (165.8°) and off-road probes returned null. Full numeric evidence: `tmp/top-cities/pont-neuf-toulouse/navigation-check.json`.

| Station / position | Cityscape heightAt | World heightAt |
| --- | ---: | ---: |
| Approach west end, s=0 | 0 | 0 |
| West ramp, s=55 | 4.0000 | 4.0874 |
| West structural bank, s=110 | 8.0000 | 8.0000 |
| Fourth pier, s=219 | 10.8729 | 11.1716 |
| East structural bank, s=332.214 | 8.0000 | 8.0000 |
| East ramp end minus 1 m | 0.001971 | -0.015086 |
| East approach end, s=442.214 | 0 | approximately 0 |

World terrain-ready was true: bank ground at the two structural banks 137.4885 / 141.0539 m, at fourth pier 134.2987 m versus query ground 134.0000 m. The -1.5 cm east-end query-ground interpolation discrepancy is negligible in the inspected standard pavement but should be rechecked with HD coverage. Real road/deck datum remains estimated. Actual moving route/car/traffic/camera behavior, load failures, reanchoring, mode-transition lifecycle, terrain replacement, exaggerated/negative terrain and device performance are not tested. Independent reviewer acceptance and HD-enabled integration remain coordinator gates; there are no shared-file changes, deployments or external publications.


Independent review revision (October 2026): all four requested corrections are retained in both LODs, based on the existing licensed dossier photos rather than new research. The mapped dimensions, seven unequal arches, six through-pier tunnels and bank-fit profile are unchanged; color, ring thickness and cutwater proportions remain photographic estimates.

| Review defect before | Revised model |
| --- | --- |
| Salmon brick and pale slab/parapet blocks | Deeper brick `#b4573a` by day / `#743e34` at night; structural slab, parapets and abutments use brick, walks use a separate neutral pavement material; pale stone is concentrated on arch rings, flood surrounds, string courses/coping and cutwaters |
| Flat, detached-looking pier noses | Single connected pointed lofts, 0.25 m rear penetration into the pier, stepped shafts and four rising pyramidal roof tiers; rear cap meets the enlarged flood opening sill |
| Small 4.10 m flood openings with thin rings | 4.715 m nominal diameter (+15%), faceted surround outer radius 3.45 m and radial width 1.0925 m (formerly 0.80 m); transverse tunnels remain open |
| Thin arch voussoir bands | Horizontal band 0.680 → 0.884 m, vertical 0.850 → 1.105 m (+30%); wider visible fascia, radial joints retained near |

Two visual look/fix iterations were used. The second Prepare run (`qa-metrics.mjs` and `qa-sheet.mjs`) was opened at `tmp/top-cities/review/pont-neuf-toulouse/pont-neuf-toulouse.jpg`; the closer exported GLB comparison was opened at `tmp/top-cities/shots/pont-neuf-toulouse/review-fix/final-export-reference-sheet.jpg` (front/back and pier/detail, near/far, light/dark, with dossier photos). The larger flood openings, pale rings and pointed tiered caps read clearly; coarse far stone joints and regular unweathered brick remain approximations. A parapet/coping overlap detected during this revision was removed. Final metrics: **0 overlapping material pairs, 0% back-facing exterior hits on 70 rays, no budget issues, minY 0, top 16.629 m**. Before → after costs: near 31,286 / 15 / 2,063 KiB → 31,426 / 17 / 2,031 KiB; far 12,882 / 7 / 780 KiB → 13,746 / 8 / 791 KiB (triangles / draws / KiB).

The review geometry checks measure actual tunnel diameter, stone beyond each opening, cutwater roof slope/contact, and thicker arch bands by raycast. The small near radial mortar gaps are sampled away from seams. Focused conformance plus landmark tests pass 254/254 (landmark file 8/8); catalog validation passes 209 records / 386 variants. Local preview bundle `2d2fed98c380` is excluded from the commit.

App placement was rechecked after export in Cityscape and Full 3D world: both near/far layers loaded and were active, terrain-ready true, no doubled generic deck, and standard pavement met the same smooth ramps. Opened evidence is under `tmp/top-cities/shots/pont-neuf-toulouse/review-fix/`: `app-modes.jpg` (far/near/street in both modes), `app-approaches.jpg` (required ad-hoc app-shot captures at both banks and headings), and `navigation-approaches.jpg` (instrumented close approach views). Repeated height evidence is `tmp/top-cities/pont-neuf-toulouse/review-navigation-check.json`; values match the preceding table for both 75.8° and 255.8°, with crossing/off-road probes null. HD lanes/paint remain not tested because local `/osm-lanes` returns 503, and actual moving vehicles and mode/lifecycle behavior remain not tested. No shared modules, photos or textures were changed or committed.
