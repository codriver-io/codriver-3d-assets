# Brandenburg Gate, Berlin

Original procedural model of the sandstone 1791 Langhans gate and the later Strack guardhouse/portico wings, in the present restored state. No Wall, event fixtures, temporary protest lighting or paint. At road distance its identity is the twelve Doric columns in two rows, five deep passages, triglyph/metope entablature, stepped attic, east-facing Quadriga and low pedimented wings. Source lives in `src/peregrine/landmarks/top-cities/brandenburg-gate/`; reproducible export: `pnpm build:top-cities-landmarks brandenburg-gate --no-check`.

## Sources and dimensions

[visitBerlin, Brandenburg Gate](https://www.visitberlin.de/en/brandenburg-gate) was checked 2026-10-15: 26 m high, 65.5 m wide, 11 m deep, two rows of six Doric columns, built 1788–91, Quadriga installed 1793 and facing east. [Berlin State heritage record 09065019](https://denkmaldatenbank.berlin.de/daobj.php?obj_dok_nr=09065019) confirms five passages separated by massive transverse walls, Doric triglyph/metope frieze, raised central attic with Triumph-of-Peace relief, and 1867–68 open Strack porticoes. [OSM main way 518071791](https://www.openstreetmap.org/way/518071791) and the provided shared-helper dossier supply the visible outline and part heights.

| Feature | Model metres | Basis |
| --- | --- | --- |
| Highest point | approximately 26 | visitBerlin; sculptural staff/eagle division estimated |
| Total north–south row width including porticoes | 65.7 | published 65.5, fitted to five OSM roof outlines |
| Main cornice | 33.8 × 12.7 | OSM upper envelope about 33.9 × 12.85 |
| Main structural depth | 11.9 | Published 11 m is a nominal main-gate dimension; projecting mapped cornice is larger |
| Main Doric shafts / abaci | 13.5 high, 1.74 bottom diameter | OSM column heights; diameter estimated from mapped column rings |
| Main entablature upper edge | 16.8 | OSM 206004656 |
| Central attic pedestal | 20 | OSM 1222287190 |
| Wing colonnade / roof | 10 / 12 | OSM parts; pitches estimated |
| East guardhouse extent | about 23.3 from origin | OSM gatehouse roof outlines; separate from nominal 11 m main-gate depth |
| Relief, animal poses, dress, feather, wreath and eagle | estimated | Original simplified symbolic geometry judged against photographs |

Frame: real metres, east/up/south, origin `[13.37770245, 52.516274925]` is the midpoint of the four main outline corners. Control points `[13.3777683,52.5164328]` → `[13.3778251,52.5161301]` identify the east facade edge: the northern row direction is 96.51430144 degrees in Three.js Y rotation; east facade bearing 83.48569856 degrees clockwise from north. This rotation is baked into every primitive and export. The layer must not rotate again. Local y=0 is the flat public plaza; no absolute altitude, terrain or Mercator stretch is baked.

`FOOTPRINTS` contains exactly the five exterior gate/wing/guardhouse roof outlines: 518071791, 206159289, 518071779, 518071762 and 375247938. `OSM_WAYS` lists all 92 gate/wing building and building-part ways in the dossier; small nested columns and upper spans are covered by their owning roof outline. Neighbouring Max-Liebermann-Haus, Haus Sommer, embassies, roads and plaza are excluded. Each near/far vertex is checked against actual building-layer ownership. A rigid 36 m pad bounds the site; terrain residuals and pad transitions require application verification.

## References and rights

Looked at the supplied six-photo `tmp/top-cities/brandenburg-gate/refs-sheet.jpg`, particularly the east night facade, Reichstag roof oblique and modern street-level Quadriga detail. The historical Reagan image and historic postcard were used only to distinguish the opposite facade and profile; the 2023 orange paint and 2022 Ukrainian coloured floodlighting are temporary and excluded. No additional photos fetched.

Reference-only credits: Leonhard Lenz, Ukraine solidarity protest Berlin Pariser Platz with lighted Brandenburg Gate 2022-02-24 07 (CC0); DimiTalen, View of Brandenburger Tor from the Reichstag roof terrace Berlin 2017 (CC0); [Thomas Wolf, Brandenburger Tor nachts](https://commons.wikimedia.org/wiki/File:Brandenburger_Tor_nachts.jpg) (CC BY-SA 3.0, author and licence checked); White House Photographic Office, Reagan Berlin Wall speech (public domain); Martin Rulsch, 2023-09-17 Brandenburger Tor mit oranger Farbe (CC BY-SA 4.0); Skepticalism, Brandenburg Gate Berlin Germany (CC0). URLs and full titles remain in ignored dossier `refs/SOURCES.txt`. Photographs stay in ignored scratch and are never embedded or shipped. Original geometry uses no traced mesh, scan or texture. Geographic data retains © OpenStreetMap contributors, ODbL 1.0; original source and model follow repository public-asset licensing.

## Geometry and limitations

Six full-height transverse walls connect paired fluted columns and carry the entablature; there is no ground slab through the five public passages. Fluted tapered Doric shafts, echinus and abaci, triglyph rhythm, shallow symbolic metopes, undercut cornice, side steps, central relief panel and passage medallions distinguish the gate. Lower porticoes contain real empty bays; each solid gatehouse is surrounded by lower columns, with separate individual windows and doors.

Four separate original horses, with connected bodies, necks, heads, ears and grounded/raised legs, face east. The chariot has two spoked wheels, axle, floor and draped standing Victoria; grouped wings, staff, wreath, cross and eagle retain the crown silhouette in far. The horses and figures are deliberately stylized, not detailed sculpture reproductions. Relief figures are original grouped human symbols, not individual portraits. No text, museum interiors, landscape, flags, bollards or event equipment.

Five merged materials: `stone`, `trim`, `relief`, `recess`, `bronze`. Warm subdued sandstone and patinated bronze have matching darker nighttime palettes; no invented emissive lamps. Far merges pale trim into stone and reduces column rings/fluting, animal segmentation, metope sculpture and relief density while keeping every passage, every portico column, the guardhouse window grid and the complete Quadriga silhouette. Roof metal is not independently coloured: the subdued roof mass shares the sandstone material to keep the draw budget low.

## Verification

Initial procedural contact sheet read: `tmp/top-cities/shots/brandenburg-gate/brandenburg-gate-procedural-near-light-sheet.jpg` (overview, facade, rear, roof, street, detail, passage). It showed the correct five openings and four-horse crown. Reduced curve segmentation and small relief cost, aligned the side attic to its central pedestal, and restored visible undersides of the entablature and abaci before final exported inspection.

Final exported default scenes: **near 33,936 triangles / 5 draws / 1,135 KiB (1,162,720 bytes)**; **far 6,928 triangles / 4 draws / 306 KiB (312,880 bytes)**. Both are below the building caps with headroom; far costs about one fifth of near triangles and keeps the world bounds within 5 mm. Bounds run from local plaza grade to approximately 25.97 m; the eagle tips approximate the sourced 26 m. Measured min y differs from zero by floating-point noise only.

Final combined photo/export contact sheet **looked at visually**: `tmp/top-cities/shots/brandenburg-gate/brandenburg-gate-export-reference-sheet.jpg`. It contains credited reference facade, roof oblique and street detail beside exported near/light facade, opposite facade, roof, street, Quadriga detail, passage and plan with red OSM outlines; far/light facade, rear, roof and Quadriga detail; near/dark facade and detail; far/dark street and detail. The five deep openings, column count, lower open porticoes and four-horse east-facing crown survive in far. Close reliefs and the animal anatomy are simplified and the nighttime asset is dimmer than real monument floodlighting. No exposed holes, flipped exterior faces or footprint spill were visible. Source and exported GLBs agree in the inspected views. Also looked at the standard `qa-sheet.mjs` output `tmp/top-cities/shots/brandenburg-gate/standard-qa/brandenburg-gate.jpg` (generated before the final far material consolidation; geometry is identical).

After restoring the visible undersides, the far close stacked cornice surfaces imposed a stone/trim depth cycle. Folded far `trim` into `stone`, preserving all geometric courses while removing that contradictory ordering; then re-exported and re-read the updated far light/dark tiles in the final comparison sheet. Final `tmp/top-cities/brandenburg-gate/qa-metrics.json` reports **no issues, zero layered or coplanar overlap area after generated material ordering, 0% back-face ray hits, zero removable lift bytes and no below-grade structure**. Final depth generation dropped **zero** cycle edges; `node scripts/landmark-depth-layers.mjs --ids brandenburg-gate --check` passed.

Latest dedicated tests: **8/8 pass in 0.65 s**, testing measured heights and cornice width, every passage from both faces, all shaft/abacus/beam contacts, both terminals of each main/wing/house entablature beam against named capitals with deliberately disconnected negative controls, four horses facing east, grounded hoof/wheel/plinth bounds, every vertex inside actual provider ownership, LOD silhouettes/cost, GLB normals/materials/bytes and source round trip. Latest filtered shared conformance (`node --test --test-name-pattern=brandenburg-gate src/peregrine/landmarks/top-cities/top-cities.test.js`): **3/3 pass**. The required full combined focused command was run: **820/822 pass**, with both failures exclusively in another active builder's `palais-bourbon` (unfinished polygon and missing manifest); Brandenburg Gate's seven tests at that time and all three registry tests passed. The subsequently added terminal-contact regression also passes in the final eight-test dedicated run.

`node scripts/asset-catalog.mjs` passed: **406 entries / 758 GLB variants** at the final checkpoint. Shared catalog preview was not rebuilt: the worker ownership boundary confines generated QA output to its own ignored scratch, and the prescribed isolated renderers supplied the inspector evidence. Independent review remains pending.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. No shared runtime source changed; the generated depth table is the sole permitted shared-file regeneration. No app servers or bundle builds performed.
