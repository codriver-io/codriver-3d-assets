# Parthenon (Acropolis), Athens

Original procedural temple-only model of the contemporary roofless ruin, not an intact ancient reconstruction. The Acropolis hill, surrounding fortification, Erechtheion, museum, restoration cranes and temporary scaffolding are outside ownership. `SPEC.ready = true` means the exported asset is ready for independent review; it does not certify app placement.

## References and dimensions

Consulted 2026-10-13: [Acropolis Restoration Service description](https://www.ysma.gr/en/monuments/parthenon/), [YSMA Acropolis Trail](https://www.ysma.gr/wp-content/uploads/2023/09/Acropolis_Parthenon_trail.pdf), [Parthenon dimensional summary](https://en.wikipedia.org/wiki/Parthenon), and the supplied [OSM outline way 910010406](https://www.openstreetmap.org/way/910010406) and 290 building parts. The supplied facts download had failed, so these online sources were checked directly. No new Overpass query was needed.

| Feature | Model | Basis |
| --- | --- | --- |
| Stylobate | 69.50 × 30.88m | Published dimensional summary; distinct from lower platform envelope |
| External columns | 10.43m including capital; 1.905m bottom diameter | YSMA trail height; diameter estimated from mapped column parts and reference proportions |
| Original peristyle | 8 × 17 positions, 46 unique columns | YSMA; three south positions absent in mapped ruin, 43 surviving shafts |
| Lower footprint | 72.6 × 33.4m authored envelope | OSM outer crepidoma approximately 73 × 34m |
| Stylobate elevation | 1.8m above base | OSM height tags; flat local datum |
| Architrave / frieze / cornice top | 13.55 / 14.96 / 15.34m | OSM part height tags; tier division approximate |
| Highest west pediment fragment | 18.05m | Approximate from mapped 18m upper parts; not Wikipedia's inconsistent total-height infobox |
| Outer shaft centers | ±33.6m length; ±14.25m width | Regularized spacing fitted to sourced stylobate, slightly inside mapped centers |
| Inner porch, cella remains, chips | See editable geometry | Estimated from photos and ruin description, not stone-by-stone archaeology |

Frame: origin `[23.72661765, 37.97150335]`, the four-corner mapped outline center; +X east, +Y up, +Z south. Bearing **77.010803°** comes from OSM control points `[23.7261712,37.9715783]` and `[23.7269774,37.9717249]`. A **12.989197°** Y rotation is baked once into source and exports. The long eastward temple axis points slightly north. Height is not horizontally stretched or terrain-baked.

## Appearance and authoring

Honey-white weathered Pentelic marble uses one muted named material (`marble`) for a small draw budget, recoloured darker at night. Near keeps twenty flutes, taper and entasis, Doric echinus/abacus profiles and three-rib triglyphs. Far keeps each column, capital, colonnade void, triglyph interval, broken south lintel and damaged pediment, reducing curved segments and dropping minor wall/cornice chips. The east ridge is missing; the west tympanum has a broken crest. Three mapped south columns are absent and the next central shaft is shortened. The inner east porch retains two full shafts with partly restored/broken drums elsewhere. No roof slab covers the interior; no Athena statue or museum-held pedimental figures have been invented.

Ruins are approximate, including missing lintel extent, wall tops, inner column heights and minor irregularities. Stylobate curvature, individual joints, historical painted details and restoration-phase machinery are omitted. Photos are comparison references only, never traced or shipped as textures. The generator imports only Three.js and landmark authoring modules.

Photo credits (ignored `tmp/top-cities/parthenon/refs/`, licenses and source URLs also in catalog): George E. Koronaios, *The East Facade of the Parthenon on March 22, 2021*, CC BY-SA 2.0; Ad Meskens, *Athens Acropolis Parthenon Metope and pediment 03*, CC BY-SA 4.0; Carole Raddato, *Acropolis viewed from Hill of the Muses*, CC BY-SA 2.0; A. Savin, *Attica 06-13 Athens 50 View from Philopappos*, CC BY-SA 3.0. James Skene's public-domain 1838 drawing was historical context only. The British Museum sculpture photograph was not used to reconstruct removed statues. Original procedural meshes contain no external mesh or image data. Mapped data © OpenStreetMap contributors, ODbL 1.0.

## Footing and integration handoff

`y=0` is the bottom of the crepidoma on the hilltop. Four bounded rigid tiers lead to the continuous 1.8m stylobate; every column begins there. No hill geometry or absolute altitude is embedded. `terrainPad` uses the temple outline, three hilltop references, median datum and 3m feather so the usual lowest-sample disc cannot sink the temple toward the cliffs. Only the temple outline and its 290 mapped parts are replaced; adjacent buildings remain provider-owned.

**Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.** The worker brief prohibits shared app servers; the lead captures both modes after committing/building. Lead must check regional-to-street DEM refinement, hilltop footing residuals (aim ±1.5m), pad coverage of surrounding lattice nodes, base edges, restored provider geometry after load failure/disable, theme/LOD switches and reanchor. Median pad configuration is a handoff, not measured terrain evidence. No runtime file changes or rollout-gate changes were made.

## Verification

Build: `pnpm build:top-cities-landmarks parthenon --no-check`. Focused tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/parthenon/parthenon.test.js`. Depth regeneration/check: `node scripts/landmark-depth-layers.mjs --ids parthenon` and the same with `--check`. Catalog: `node scripts/asset-catalog.mjs`.

First judged sheet: `tmp/top-cities/shots/parthenon/procedural/parthenon-procedural-near-light-sheet.jpg`, compared with the dossier `tmp/top-cities/parthenon/refs-sheet.jpg`; main facade, west/back, above, south entrance level and close triglyph/capital detail. This exposed intact capitals on partial columns; those were changed to broken drum caps before final exports. Final exported light/dark near/far sheets and measured QA results are recorded below after review.

Focused tests pin actual stylobate edges, external shaft rhythm and diameter, absent southern shafts, shortened shaft top, roofless center and damaged pediments, and every lintel terminal's named corner/blast-edge column support in both LODs. A deliberately shortened terminal fails the support assertion. Polygon-distance containment verifies the source against the mapped envelope; the lower bound stays y=0 and LOD bounds coincide.

Final exported evidence judged (2026-10-13):

- `tmp/top-cities/shots/parthenon/qa/parthenon-reference-lods-themes.jpg`: reference east facade, metope/pediment detail and distant hill photos alongside exported near/far, light/dark overview, facade and roof.
- `tmp/top-cities/shots/parthenon/qa/parthenon.jpg`: standard exported GLB QA sheet, including opposite sides, low south view, top plan and west close-up; near/far compared with the 2021 east reference.
- `tmp/top-cities/shots/parthenon/final/parthenon-glb-near-light-sheet.jpg` and `parthenon-glb-far-dark-sheet.jpg` in the same directory: overview, facade, opposite west/back, above, low south and close detail; the complementary near-dark and far-light sheets supply the same six angles.

Second review sharpened the flute ridge normals (the first version smoothed the concavity away) and enlarged triglyphs toward the photographed width. Final sheets show explicit column channels, supported broken pediment corners, open roof/colonnade gaps and consistent far silhouette. Weathering and relief sculpture remain simplified; there are no individual carved narrative figures or photo textures. Night recolouring has no authored floodlight fixtures and requires lead assessment through the real app material path.

| Export | Triangles | Draws | Bytes | KiB rounded |
| --- | ---: | ---: | ---: | ---: |
| Near | 27,068 | 1 | 880,988 | 860 |
| Far | 6,932 | 1 | 248,316 | 242 |

All **627** tests in the requested two-file run passed (39.4s, saved `tmp/top-cities/parthenon/tests.log`); the final landmark-only rerun passed **5/5** in 0.22s after the flute correction. `qa-metrics.mjs --ids parthenon` reports no issues, 0% back-face hits, no layered/coplanar material flags, no removable attributes, and matching LOD bounds (`tmp/top-cities/parthenon/qa-metrics.json`). Depth regeneration reports **0 cycle edges dropped**, cycle report `[]`, and `--check` passes. `node scripts/asset-catalog.mjs` passes: **336 entries / 654 GLB variants**. `pnpm assets:preview` builds the local inspector successfully. A transient missing bank-of-america-corporate-center document caused the first catalog attempt to fail while that builder was in progress; the final check is clean.

Only this landmark's source folder, catalog record, this document and exports were authored. The permitted shared `depth-layers.js` was regenerated with `--ids parthenon`; no other shared source was edited. Independent exported/app review and live Full 3D world footing validation remain with the lead.
