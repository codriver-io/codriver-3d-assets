# Capitole de Toulouse

Original procedural model of the restored eighteenth-century municipal façade by Guillaume Cammas, Place du Capitole, Toulouse, with the mapped town hall / theatre wings and three open courtyards. The detached sixteenth-century Donjon du Capitole is outside this model and replacement envelope. No scaffolding, square paving, neighbouring buildings, interiors, photographic textures or external meshes are included.

## Sources and frame

- [Toulouse Métropole, Capitole](https://metropole.toulouse.fr/annuaire/capitole): Cammas, bichromatic brick/stone façade, eight pink-marble columns representing the eight capitouls, south wing theatre, Cour Henri IV.
- [Toulouse Métropole, restoration](https://metropole.toulouse.fr/espace-presse/le-capitole-retrouve-sa-beaute-dorigine): façade restoration and original 1750–1760 construction. Model depicts the cleaned façade without scaffolding.
- [OSM relation 367073](https://www.openstreetmap.org/relation/367073), queried through the shared Overpass helper on 2026-10-09: public building, three storeys, height 25 m, outer way 10157283; inner ways 46710306, 46710308 and 46710307 define the three unroofed courts. The donjon way 34923008 is excluded.
- Reference-only Commons photographs: [Capitole-27](https://commons.wikimedia.org/wiki/File:Capitole-27.jpg), Frédéric Neupont, CC0; [Panorama du Capitole de Toulouse](https://commons.wikimedia.org/wiki/File:Panorama_du_Capitole_de_Toulouse.jpg), PierreSelim, CC BY 3.0; [Capitolio Toulouse 2023-01-06 DD 120-122 HDR](https://commons.wikimedia.org/wiki/File:Capitolio,_Toulouse,_Francia,_2023-01-06,_DD_120-122_HDR.jpg), Diego Delso, CC BY-SA 4.0; [Toulouse Capitole Extérieure Facade 1](https://commons.wikimedia.org/wiki/File:Toulouse_Capitole_Ext%C3%A9rieure_Facade_1.jpg), Zairon, CC BY-SA 4.0. File pages and licences checked; images remain under ignored `tmp/top-cities/capitole-de-toulouse/refs/`.

Origin `[1.44423,43.604445]`; metres east/up/south; y=0 is local grade. The façade tangent follows mapped controls `[1.4438694,43.6047453]` and `[1.4439014,43.6045964]`, bearing about 171.2°. The outward normal faces west-southwest. Rotation is baked into every vertex and both GLBs. The exact outer ring is the replacement envelope; courtyard holes are cut out of both building and roof. Small projecting stone cornices extend at most 1.32 m beyond the cadastral wall, covered by `ownTolM: 1.4`; no plaza slab expands ownership.

| Dimension | Model | Evidence |
| --- | --- | --- |
| Length along façade | about 106.8 m | Mapped OSM envelope, not a published survey |
| Height including central ornament | 25.0 m | OSM height tag; no separate survey |
| Main wall/eaves | 18.4 m | Estimated from photographs |
| Central pediment apex | about 23.1 m | Estimated |
| Parapet top | 20.365 m | Estimated |
| Marble columns | eight, shaft band 7.28–16.88 m | Count official; dimensions estimated |
| Ground / principal / upper window heights | 4.85 / 5.05 / 3.15 m | Estimated; central portal separately sized |
| Open courts | three, mapped outlines | OSM multipolygon inner rings |

Published lengths conflict: the municipality's monument page says over 120 m, its recent restoration description says 100 m, and tourism descriptions commonly say 128 m. This asset follows the 106.8 m cadastral envelope rather than stretching into streets. Exact historic dimensions need a survey or architectural plan to resolve the discrepancy.

## Modelling and materials

Eight merged materials near; seven far (gold merges into stone). Pink ochre `brick`, pale `stone`, pale rose-cream `marble`, neutral slate `roof`, dark `glass`, first-floor `glow`, iron `metal`, and restrained `gold` rail accents. Night makes first-floor window skins warm while stone and brick dim; individual real façade floodlights are approximated by ambient inspection lighting.

The main features are eight lofted marble shafts in four pairs, rectangular upper windows with curved heads and keystones, ground-floor arches, white rustication, cornice dentils, parapet balusters, wrought-iron galleries, three pediments, clock with hour ticks and hands, heraldic relief, supported roof statuary, central tricolour and near-only CAPITOLIUM lettering. Each material is merged into one draw. Thin window skins and rail diamonds use planar geometry; roof ridges and facade ornament retain volume. Far retains the columns, all pediments, clock, parapet, windows and open courts but drops sashes, detailed rail scrolls and small flags.

Statuary is an abstract supported draped-body/head silhouette, not a sculptural reproduction. Pavilion frontage widths fit the cadastral shoulder transitions. Rear and courtyard window rhythm and low roof ridges are schematic estimates; no rear-photo dossier was available. Courtyard interiors omit the Henri IV statue and decorative busts. These limitations are visible in the inspection views and remain suitable follow-up refinements.

## Verification evidence

Viewed the dossier `tmp/top-cities/capitole-de-toulouse/refs-sheet.jpg` before modelling. First procedural contact sheet `tmp/top-cities/shots/capitole-de-toulouse/capitole-de-toulouse-procedural-near-light-sheet.jpg` exposed pavilion windows buried behind the mapped stepped walls and excessive geometry in extruded curved frames. Second sheet confirmed exposed pavilion bays and restored upper central windows; triangle costs were reduced by using window skins and planar rail diamonds. Central cartouche was then moved ahead of the tympanum, near lettering added, and both pavilion pediments narrowed to fit the mapped shoulders. The referenced procedural sheet is overwritten by the subsequent iteration.

Exported inspection uses six views in each sheet: facade, entrance/street, central detail, opposite/back, elevated roof and north-up plan. Final contact sheets judged against the reference photos:

- `tmp/top-cities/shots/capitole-de-toulouse/capitole-de-toulouse-glb-near-light-sheet.jpg`
- `tmp/top-cities/shots/capitole-de-toulouse/capitole-de-toulouse-glb-near-dark-sheet.jpg`
- `tmp/top-cities/shots/capitole-de-toulouse/capitole-de-toulouse-glb-far-light-sheet.jpg`
- `tmp/top-cities/shots/capitole-de-toulouse/capitole-de-toulouse-glb-far-dark-sheet.jpg`

Combined comparison evidence: `tmp/top-cities/capitole-de-toulouse/export-reference-contact.jpg` places reference photographs alongside the four exported contact sheets. The four exported sheets were opened together beside the dossier photos. The daytime pink/stone front, eight marble shafts, large arched ground openings, clock and three pediments remain legible in far; dark first-floor windows light up without washing out the clock. Rear elevations and roofs remain a deliberate schematic approximation, and roof sculptures are much less detailed than the photographed figures.

| Export | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| Near | 20,118 | 8 | 961,652 | 939 |
| Far | 5,150 | 7 | 270,836 | 264 |

Within 60k/14/2.5 MB near and 12k/8/500 KB far caps. Far costs 25.6% of near triangles; seven materials and full envelope retained. `qa-metrics.mjs --ids capitole-de-toulouse` reports no issues, zero removable bridgeLift bytes, min y=0, top 25 m, zero coplanar pairs and 0% back-face hits across 415 intersecting rays; evidence `tmp/top-cities/capitole-de-toulouse/metrics.json`.

Initial build focused validation passed all six Capitole tests (three landmark tests and three registry conformance tests), in 0.6 seconds, including GLB/source bounds and material parity. The exact requested two-file test invocation also passed all six Capitole checks; at the initial run 249/251 shared checks passed, with failures only in active `basilique-saint-sernin` readiness and `couvent-des-jacobins` geometry budget. Full logs are `tmp/top-cities/capitole-de-toulouse/test.log` and `focused-test.log`. Repeated `node scripts/asset-catalog.mjs` runs reached only unrelated failures: initially `cite-de-l-espace: missing notes`, then an unregistered `cite-de-carcassonne-far.glb`; this landmark's record and exports pass registry and targeted QA validation. No shared file was edited to repair another builder's work. Catalog preview publishing and both-mode integration are for the coordinator's combined pass.

Focused tests assert observable dimensions, height and grade, all eight marble-column ray hits, clock and front openings, the two curved pavilion pediments, all three open courtyard rays and the far silhouette. The full registry conformance test is run only with this landmark's test file; unrelated active-builder failures are recorded separately. The catalog check includes all records and may observe transient files belonging to other builders.

## Placement modes

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. The model is rigid on y=0; `padM: 64` covers the near-level municipal site. No DEM has been sampled; no slopes, terraces or terrain heights are baked into the reusable source. Independent coordinator review remains separate from this author inspection. Hardware performance has not been measured.


## Independent review fixes

The independent `tmp/top-cities/review/capitole-de-toulouse/REVIEW.md` verdict was PASS-WITH-NITS, recognition 4/5. No REVIEW-2 file was present and REVIEW.md supplied no Prepare command; the standard exported-GLB preparation was used:

```sh
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids capitole-de-toulouse --out tmp/top-cities/shots/capitole-de-toulouse/revision
```

Two look/fix iterations were used. The final sheet `tmp/top-cities/shots/capitole-de-toulouse/revision/capitole-de-toulouse.jpg` was opened against its cached reference and the dossier photos, including near/far oblique fronts and backs, north-up plan, street side and close west facade. Dark near and far facade/detail/back/roof sheets were also opened in `tmp/top-cities/capitole-de-toulouse/revision-contact.jpg`.

1. Flat salmon, rose shafts and fine base lines → red-brown brick (#a2584e), pale stone (#e4d9c8), pale marble (#d9cbbb), with ground courses widened from 0.18 to 0.38 m. The eight marble shafts remain distinct geometry and stand out from the wall.
2. Salmon roof and thin balustrade → slate grey-brown roof (#555450); parapet spindles widened 0.14 to 0.20 m, top rail 0.23 to 0.32 m and curved pavilion raking mould 0.29 to 0.40 m. Near adds two supported companion figures at each end pediment; overall 25 m highest point remains unchanged.
3. Near 32,656 tris / 8 draws / 1,599 KiB → 20,118 / 8 / 939 KiB, below both the reviewer’s 1 MB aim and lead’s approximately 1.2 MB target. Far 9,586 / 7 / 471 KiB → 5,150 / 7 / 264 KiB. Near uses six-segment window heads plus planar rear panes, sash strips and tiny trim. Far uses simple frame skins and consolidated indexed window rows, preserving bay gaps, principal-floor night lighting and all three court openings while dropping court window trim. The street-level arch silhouettes, paired columns, clock and pediments survive.
4. Bare flank grid → wider stringcourses at the storey boundaries and pale lower-floor courses; the second look caught bands crossing the glass, so those lower courses were moved behind the window skins. Final sheet confirms clear windows and exposed courses between them.

Re-exported with `pnpm build:top-cities-landmarks capitole-de-toulouse --no-check`. All six focused landmark/registry tests pass, including additional observable assertions for broad base banding, pale shaft contrast and slate roof material. `node scripts/asset-catalog.mjs` passed with 209 records and 398 variants in the final revision check; concurrent neighbouring builders can transiently change that count. Final `revision-metrics.json` reports no flagged issues, zero coplanar pairs, 0% back-face hits, zero removable attributes, y=0 and top 25 m. Approximated roof forms, rear elevations and statuary remain as documented; Cityscape and Full 3D world are still not tested yet, integration is checked separately.

Final requested two-file run: 252/254 checks passed, including all six Capitole checks; unrelated active-builder failures are Farris Bad geometry and Dôme de la Grave spec/catalog readiness. Log: `tmp/top-cities/capitole-de-toulouse/revision-test.log`. No shared files were modified.
