# Old Red Courthouse · Dallas

Original procedural model of the 1892 Dallas County Courthouse at 100 South Houston Street, with the clock tower reconstructed in 2007. The authoring target is its restored exterior, rather than the towerless 1919–2007 state. No photograph, scan or external mesh is included.

## References and dimensions

The [courthouse history](https://en.wikipedia.org/wiki/Dallas_County_Courthouse_(Texas)) identifies Orlopp & Kusener, Richardsonian Romanesque design, 1892 completion, and the reconstructed clock tower. Its quoted historical tower height of 123 feet is not used as the total building height: it does not agree unambiguously with the total roof-tip height in the mapped building parts. The main body follows the OSM vertical stack; review g8b calibrates the clock roof against the dossier photographs. All heights remain estimates.

| Feature | Model | Basis |
| --- | --- | --- |
| Complete outline | approximately 58 × 37 m before rotation | OSM way 27940349 |
| Main roof / turret tips | 30 m | OSM `height=30`, `roof:height=8/5` |
| Round turret body | 24.5 m | OSM nested turret parts |
| Clock crown tip | 57.5 m | g8b photo estimate; supersedes the squat 54 m mapped stack |
| Granite base / main eaves | 5.2 / 22 m | photo estimates, eaves consistent with mapped roof height |
| Clock centre / roof base | 41.5 / 45.25 m | photo estimates |
| Rotation | +14.5° about model Y | OSM wing edges, true long-axis bearing about 165.5° |

Source mapping is the dossier `tmp/top-cities/old-red-courthouse/osm.json`. The origin is `[-96.80732,32.77861]`; metres are east/up/south and y=0 is rigid local grade. Rotation is baked once into exported vertices. Two outline control points `[-96.807211,32.7785085]` and `[-96.8073399,32.7784801]` establish the approximately 75.5° cross-wing direction (reverse bearing equivalent). `FOOTPRINTS` retains the complete mapped outline and `OSM_WAYS` includes way 27940349 plus all 33 nested parts, 1491921584–1491921616. No neighbouring building is owned. Turret cornices and roofs have a sub-metre eave allowance beyond the wall envelope.

Photo references, retained only in ignored scratch, were inspected together in `tmp/top-cities/old-red-courthouse/refs-sheet.jpg`:

- [Dallas County Courthouse - Old Red.jpg](https://commons.wikimedia.org/wiki/File:Dallas_County_Courthouse_-_Old_Red.jpg), Leaflet, CC BY-SA 3.0.
- [Dallas - Old Red Museum 01.jpg](https://commons.wikimedia.org/wiki/File:Dallas_-_Old_Red_Museum_01.jpg) and [02.jpg](https://commons.wikimedia.org/wiki/File:Dallas_-_Old_Red_Museum_02.jpg), Joe Mabel, CC BY-SA 3.0.
- [Dallas County Courthouse with Texas Flag.jpg](https://commons.wikimedia.org/wiki/File:Dallas_County_Courthouse_with_Texas_Flag.jpg), Martin Alon, CC BY-SA 4.0.
- [Old Red Courthouse - panoramio.jpg](https://commons.wikimedia.org/wiki/File:Old_Red_Courthouse_-_panoramio.jpg), Michael Laferriere, CC BY 3.0.

The sixth dossier image is an interior sign and was excluded from modelling. Leaflet and Mabel licence pages were checked directly; remaining dossier licence metadata is recorded as supplied.

## Review g8b geometry

The tower roof now rises 8.75 m from its 45.25 m cornice to the 54 m lantern platform, replacing the former 5.25 m rise. Its slightly concave bell profile has alternating grey and strong mauve-red slate courses, with four small gabled dormers seated in its base. The open lantern retains eight supported posts; its final tip is 57.5 m. This is a photo-based proportional correction, not a new survey measurement.

Turret cones use a darker mauve-red material and retain attached finials. Three thin blue-grey granite courses at 6.15, 12 and 13.55 m are built into the wall shells rather than superimposed on them, in both LODs. The eight turrets, arched window rows, gabled wings and four clock faces remain. Seven material draws are used in each LOD. Fine carving, gargoyles, exact rear bay counts, interiors, site furnishings and surveyed night lighting are omitted.

## Export and app verification

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 34,257 | 7 | 1,386,268 | 1353.8 |
| far | 11,839 | 7 | 443,628 | 433.2 |

Rebuild with `pnpm build:top-cities-landmarks old-red-courthouse --no-check`; regenerate/check depth layers after export. Both LODs remain within the 60k/12k triangle, 14/8 draw and 2.5MB/500KB building caps. Depth generation/check reports zero material cycles. The dedicated geometry tests pass, including observable dimensions, openings, footprint containment, silhouette and existing support-contact checks where applicable. The full requested top-cities conformance run has 807 passes and three unrelated failures: Palais de Chaillot material budget, Palais Bourbon footprint and missing export. Both g8b landmarks pass their own conformance cases. Catalog validation passed with 406 records and 748 variants during this run.

Final evidence lives in `tmp/next-200/fix/g8b/old-red-courthouse/`: `reference-comparison.jpg` places exported near/far sheets beside the dossier photographs; `sheets/final/` has the final near sheet, and far sheet paths are included in the fix report. `app/city/` and `app/world/` contain final far, near and street screenshots plus reports identifying active/loaded LODs. Servers are terminated by their recorded PIDs.

Cityscape: **appearance verified** in the final app captures. Full 3D world: **appearance verified** with terrain enabled in the corresponding captures. Visible footing and provider replacement are inspected; full lifecycle, failed-load, terrain-arrival and origin-shift regression and actual device performance remain **not tested**. These appearance checks require independent re-review before approval.
