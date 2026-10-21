# Château de Versailles, Versailles, France

Original procedural model of the present palace: Louis XIII brick-and-stone core around the Cour de Marbre, stepped U-plan sequence of courts, Royal Gate, classical garden front, North/South wings and Royal Chapel. The detached Ministers wings, Place d’Armes street works, remaining gardens, Orangerie and interiors are excluded; the two immediate garden basins are included as low rims and water surfaces. The Cour d’Honneur stays open toward the Avenue de Paris; it is not filled with a building slab. Fine carved heraldry and sculpture likenesses are simplified.

The [official chapel history](https://en.chateauversailles.fr/news/life-estate/restoration-royal-chapel/royal-chapel) describes the present 1710 chapel and removal of the former roof lantern in 1765. The [official teaching dossier](https://www.chateauversailles.fr/sites/default/files/ressources-pedagogiques/IMG/pdf/ressource-pedagogique_dossier-les_grands_appartements.pdf) lists 25.59 × 17.82 × 44 m for the chapel; its room dimensions are not used as the exterior footprint. The [palace overview](https://en.wikipedia.org/wiki/Palace_of_Versailles) establishes its royal-residence identity and architectural phases.

Real metres, east/up/south, origin `[2.1203,48.8047]`; y=0 is rigid local grade, with no baked terrain altitude or Mercator stretch. Local u points 22° south of east, v 22° west of south; rotation is baked once into source and exports. Two OSM control points on the long wing wall `[2.1224847,48.8050672]` and `[2.1228904,48.8057308]` give a longitudinal direction about 22° east of north, hence a courtward normal approximately 112°. The exact retrieved coordinates in `footprint.js` remain the ownership authority.

| Feature | Metres | Basis |
| --- | ---: | --- |
| Main palace north/south extent | about 422 | Joined OSM outline in palace axes |
| Garden core to royal gate | about 148 | OSM outline |
| Main eaves | 20.6 | Photo estimate |
| Slate roof tops | 26.6–29.6 | Photo estimate |
| Chapel highest point | 44 | Official teaching dossier |
| Chapel exterior plan | nave 32.4 × 22.2, plus 11.1 m apse radius | Mapped relation 9087585; distinct from interior dimensions |
| Chapel eaves | 30.7 | Photo estimate |
| Royal gate span | 60 | OSM court opening/photo estimate |
| Typical facade bays | about 5.4 near / 12.0 far | Photo estimate and LOD simplification |

Ownership uses [OSM relation 1149002](https://www.openstreetmap.org/relation/1149002), its 26 joined outer ways and seven inner service-court ways, all enumerated in `OSM_WAYS`. The seven service courts remain real roof holes. Footprints describe provider building replacement; checkerboard marble paving and the permeable gilded gate occupy the open court and do not claim unrelated provider buildings. A bounded median pad is declared, but terrain contact/refinement is not tested.

Stone is warm grey-beige, old court masonry muted brick, slate blue-grey and gilding subdued ochre. Separate individual panes survive both LODs. Near adds window surrounds, mullions, pilasters, carved cornices, arched ground/chapel glazing, slate dormers, paired roof gilding, chimneys, balusters and grouped draped trophy figures. Far reduces fine framing and sculpture while keeping the roofline, open courts, glass rows, clock pavilion, chapel and gate. The entire model batches into nine near / eight far materials; no photos, textures, scans or third-party meshes ship.

Reference-only photos remain in ignored `tmp/top-cities/chateau-de-versailles/refs/`: Peter Stehlik’s panorama (CC BY 3.0), Julian Lupyan’s main facade and Cour Royale (public domain), Daniel Jolivet / sybarite48’s garden facade (CC BY 2.0), Lionel Allorge’s 2014 aerial view (CC BY-SA 3.0). Exact file pages and credits are in the catalog record. The dossier’s interior images were not used for exterior design.

## Review fixes (g16ar)

The Royal Chapel now follows relation **9087585**: the long nave runs along palace u=95.2–127.6 m, with a semicircular east apse to u≈138.7 m and a steep slate roof. The ridge is 43.65 m, with the supported gilded crest/finials ending at 44 m, clearly above the 20.6 m wing roof. Upper arched bays and coarser separate far windows survive. Exact missing outer ways **653519276 / 124861530 / 427280010** are joined with the two already-owned members in the replacement ring, including the north sacristy outline.

Classical garden-front and north/south-wing roof surfaces now use light lead grey, while the Louis XIII court and chapel retain dark slate. Far merges the minor glow panes into glass to keep eight draws. The white shapes behind the garden-front balustrade were provider building extrusions of the **Bassin du Nord/Midi** rims (relations 3459591 / 3459592), not another palace wall: exact outer ways **5013284 / 5013295** and inner ways **257712056 / 237843251** now have low 0.32 m stone rims and inset water at 0.04 m. The palace garden-front outline already included way 452023684, and tile coordinates confirmed that ring's coverage.

## Review fixes (2026-10-21)

The slate dormers were buried. They sat 4.2 m in from the eave, past the 3.9 m hip slope, so the roof there was already 26.1–26.5 m high, while each dormer topped out at 25.35 m. All 28 near and 18 far dormers were inside the roof, and none could be seen. Each dormer now takes its heights from the same hip parameters (eave, ridge, inset) and stands on the lower slope, with its front 0.7 m behind the eave line. Triangular cheeks and a hipped cap end exactly on the slate, the hidden back face is gone, and near adds a small soffit under the cap. Near keeps the gilded frame and recessed pane. Far replaces the old buried trim box with a stone sill and a separate pane under the same cap. The dormer positions, spacing (8 m near / 11 m far) and slopes are unchanged.

Measured on the exported GLBs, all 28 near and 18 far dormers now rise up to 2.83–2.86 m above the slope. The lowest pane vertex is 0.40 m above the slate in near and 0.60 m in far, and exported slate exists under every dormer (none falls over a service-court hole). From the Marble and Royal courts, the dormers now show above the cornice at street level in both LODs. Dormer geometry went from 728 to 532 near triangles and from 396 to 198 far. `qa-metrics.mjs` shows the same layered-face flags as before, with the same areas and positions (near trim on stone; far trim on stone/brick and clock glass/gold on trim): no new issue, unchanged bounds. These exports come from a `CODRIVER_ASSET_BATCH=1` build without license stamping, so the license metadata has not yet been re-applied and the published byte counts will change slightly when it is. Cityscape and Full 3D world were not re-tested after this change.

## Verification

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 52,756 | 9 | 2,473,440 | 2415.5 |
| Far | 10,564 | 8 | 484,608 | 473.3 |

All exports fit the building limits. Focused tests for these two landmarks: **24/24 pass**, including roof slopes, moat floor, longitudinal chapel ridge/apse, open courts, far window rhythm, gate/portico support contacts and grade-level basins; no test asserts `SPEC.ready`. Final mechanical metrics have no issue flags, and generated depth ordering has zero dropped material-cycle edges. Logs and full metrics: `tmp/top-cities/chateau-de-vincennes/review-fix/`.

Exported sheets were inspected in two fix iterations: `tmp/top-cities/shots/chateau-de-versailles/review-fix-near/` (near/light, before final refinements) and `review-fix-far/` (final far/dark). Final near appearance is checked in the app captures. No further look-fix iteration was taken.

Cityscape: **visual placement verified** in the scratch app (Protomaps/OSM tile provider), with far/near/street captures at `tmp/top-cities/chateau-de-vincennes/review-fix/final-app/city/`. Full 3D world: **visual placement verified**, equivalent captures at `final-app/world/`. Scratch bundle built in `/tmp`, on reserved slot J (3306/3308); shared `public/peregrine.js` was not rebuilt. These captures check shared shading, visible replacement and gross footing, not DEM arrival/refinement, transition/lifecycle or hardware performance; those remain **not tested**. No terrain excavation is claimed. Independent re-review remains required.

Catalog validation, `pnpm assets:check`, and `pnpm assets:preview`: **pass**, 425 records / 832 GLB variants at check time. Full unfiltered conformance run: **883/887 pass**; unrelated union-station-kansas-city and marche-atwater ready/catalog mismatches, pavillon-roger-gaudry far triangle budget, and a stale Versailles source/GLB bounds comparison because the process imported its pre-basin source before the final export. Fresh final conformance restricted to the two assigned IDs: **6/6 pass**, superseding that stale comparison.

Subsequent global catalog/preview retries encountered another worker’s unfinished `tour-1000-de-la-gauchetiere` export/doc after the successful 425-record pass; these unrelated files were not changed. Final app comparison: `tmp/top-cities/chateau-de-vincennes/review-fix/final-app-sheet.jpg`.
