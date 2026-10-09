# Dôme de la Grave — Chapelle Saint-Joseph

Original procedural model of the chapel of the Hôpital de La Grave, 23 rue du Pont Saint-Pierre, Toulouse. The river landmark is its copper dome and lantern; the model includes the brick chapel and one short attached hospital wing, rather than the entire hospital.

Build: `pnpm build:top-cities-landmarks dome-de-la-grave --no-check`. Source is `src/peregrine/landmarks/top-cities/dome-de-la-grave/`; exports are `public/models/buildings/dome-de-la-grave-{near,far}.glb` and the measured JSON manifest. Catalog: `prototypes/assets3d/catalog.d/dome-de-la-grave.json`.

## Identity and references

The [CHU Toulouse history](https://www.chu-toulouse.fr/IMG/pdf/histoire_de_la_chapelle_de_la_grave.pdf) describes construction from 1758 to 1845, the eight arched windows with paired pilasters, six facade pilasters and unfinished pediment, and the timber structure clad in copper. Its 24 m diameter describes the interior including the ambulatory, rather than a surveyed external envelope. [Municipal history](https://monuments.toulouse.fr/chapelle-de-la-grave/histoire/) records the 2020–2022 restoration. This model depicts the patinated copper and brick exterior, without temporary exhibitions or scaffolding.

Reference photos examined in the dossier `tmp/top-cities/dome-de-la-grave/refs-sheet.jpg`: Didier Descouens, *Chapelle de l'hôpital Saint-Joseph de la Grave* (CC BY-SA 4.0); PierreSelim, *Toulouse - 2012-03-26 - Dome Hospital de la Grave* (CC BY-SA 3.0); Gzen92, *Hôpital de La Grave - dôme (Toulouse)* (CC BY-SA 4.0). Links and rights are recorded in the catalog. No photos or textures are shipped.

## Frame and dimensions

Origin `[1.43298,43.60083]` is near the mapped dome centre. Metres, east/up/south; local y=0 is the level chapel courtyard. Geometry rotation 66° is baked once; front looks southeast, bearing 114°. The facade control points `[1.4332481,43.6008288]` and `[1.4331516,43.6006705]` define the straight mapped frontage (bearing about 24° along it). No terrain datum or latitude stretch is baked.

Mapped replacement rings: chapel way 219747752, dome part 1563601036, adjoining wing 869732616. Other hospital wings are retained as provider buildings. Data came from the supplied OSM dossier and confirmed using the shared Overpass helper into `tmp/top-cities/dome-de-la-grave/chapel-osm.json`.

| Dimension | Model | Basis |
| --- | --- | --- |
| Dome diameter at springing | 24.4 m | OSM ring spans about 24.8 m; narrowed 1.6% for reviewed tighter springing |
| Chapel lower wall/cornice | 19.3 m | Photo estimate; OSM lower outline says 15 m |
| Drum and dome springing | 20–37.65 m | Photo estimate, revised after independent review |
| Drum windows | about 2.69 × 7.45 m, sill 26.25 m | Photo estimate, reduced 20% in width / 25% in height after review |
| Dome lantern seat | 49.35 m | Photo estimate |
| Lantern cap | 54.35 m | Photo estimate |
| Summit cross | 56 m | Provisional published restoration-report value |
| Main facade width | about 20 m | Mapped straight edge 19.4 m plus mouldings |
| Attached hospital range | 13.6 m high | Photo estimate, mapped plan |

Height uncertainty is explicit: [La Dépêche's 2022 restoration report](https://www.ladepeche.fr/2022/03/02/le-dome-de-la-grave-se-refait-une-beaute-pour-cet-ete-10143086.php) gives 56 m. Municipal pages give a 40 m dome and an 85 m height above the river, while OSM tags the dome part at 30 m. Those figures cannot all represent height above courtyard grade. The 56 m summit is provisional, with stage divisions estimated from photos; a survey is still needed for absolute accuracy.

## Geometry and materials

Seven merged material draws in each LOD: brick, trim, stone, copper, seam, glass and light. The copper dome is a smooth elliptical lathe, with 48 meridian joints near and 24 far. Near adds horizontal copper-panel courses. The brick drum has eight real arched wall apertures backed by recessed glass, paired pilasters, capitals and string courses. The small lantern has eight piers, recessed glazing, a balcony, copper cap, ball and Latin cross. The light material makes lantern glass warm at night; brick and trim use a warm floodlit palette.

The entrance has six flat pilasters, oval panels, the tall door and small door pediment, and the large unfinished stone tympanum represented with rough stone blocks. Roof terrace balustrades remain in both LODs. Near adds thin brick courses; far keeps the architectural rhythm. The short wing is low brick massing with quiet windows. No hospital-wide mask, roads or ground plaza are authored.

Approximations: lower outline is a solid mapped extrusion rather than an interior shell; rear lower facade is plain. Iron balcony scrollwork, individual bricks, precise Ionic capitals and carved mouldings are omitted. Entrance steps/mouldings extend up to 1 m outside the mapped wall. Dome profile and all stage heights require survey confirmation. The rigid courtyard foundation is level; the 40 m terrain pad needs separate riverbank/DEM validation.

## Verification

Initial procedural contact sheet `tmp/top-cities/shots/dome-de-la-grave/first-look.jpg` compared facade, back, roof, entrance, dome and plan with the reference facade. It exposed reversed drum-wall winding, which was corrected before export. The second look adds facade oval panels, fine brick courses and mapped base/cornice courses.

The final exported GLBs were viewed beside the facade, river and night photos in `tmp/top-cities/shots/dome-de-la-grave/final-export-review.jpg` (front, back, roof, entrance, dome detail, north-up plan, near/far, light/dark). Complete exported sheets are `dome-de-la-grave-glb-{near,far}-{light,dark}-sheet.jpg` in the same directory. The final look confirmed solid brick drum walls, the eight window rhythm, pale green copper panel joints, recessed warm lantern glazing at night and matching far silhouette. The terrace rails were changed from solid roof-like slabs to open perimeter rails and balusters. Reference-only night/context images also viewed: PierreSelim, *Hopital de la Grave et Pont Saint-Pierre* (CC BY 3.0), and Gzen92, *Hôpital de La Grave et la Garonne (Toulouse)* (CC BY-SA 4.0), credited in the catalog.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 27,584 | 7 | 797,608 | 779 |
| Far | 8,044 | 7 | 296,628 | 290 |

Both exported bounds match exactly: x −22.479 to 22.409 m, y 0 to 56 m, z −36.101 to 23.330 m. `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/dome-de-la-grave/dome-de-la-grave.test.js` passed all 256 tests, including all four landmark-specific tests (eight glazing raycasts, solid inter-window wall, lantern/door, mapped diameter, grade and footprint envelope). `node scripts/asset-catalog.mjs` passed, 209 entries / 398 GLB variants. Targeted deterministic QA in `tmp/top-cities/dome-de-la-grave/metrics.json` found no issues: 0% back-face hits in 288 rays, no removable attributes and no material-overlap area at reported precision. These are asset checks, not device benchmarks.

Initial independent review returned PASS-WITH-NITS (recognisability 4/5); the requested refinements are documented below for coordinator re-review. Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately. Static export readiness is not terrain, lifecycle or hardware certification.


## Independent review refinement, 2026-10-09

Addressed findings 1–3 from `tmp/top-cities/review/dome-de-la-grave/REVIEW.md` in one geometry iteration:

- Pale/orange-salmon daylight brick `#b97d62` → darker red-brown `#8a4a38`; trim and night floodlighting palette retained.
- Drum apertures approximately 3.36 × 9.95 m → 2.69 × 7.45 m (20% narrower, 25% shorter), sill raised from 23 to 26.25 m. Arch trim and glazing bars follow the resized apertures. All eight remain visible in both LODs.
- Dome meridian rise 13.05 → 11.55 m; springing raised from 36.15 to 37.65 m, with lantern seat, lantern and 56 m cross unchanged. Dome radius 12.45 → 12.2 m; maximum drum cornice radius 12.85 → 12.3 m. The dome now sits directly within the tighter cornice and has a flatter profile. Green copper and meridian joints retained.
- Optional finding 4 was left unchanged: the low apron follows the mapped chapel outline; squaring it would require a new footprint/replacement decision rather than a cheap detail correction. The plain rear facade remains an approximation.

The review contains no Prepare command and no REVIEW-2 document was present. Re-ran the standard preparation tools: `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids dome-de-la-grave --out tmp/top-cities/dome-de-la-grave/review-fix-metrics.json` and `node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids dome-de-la-grave --out tmp/top-cities/shots/dome-de-la-grave/review-fix`. Personally viewed the new sheet `tmp/top-cities/shots/dome-de-la-grave/review-fix/dome-de-la-grave.jpg`; its automatically selected Wikipedia tile remains the unrelated Dreux chapel, so it was ignored for fidelity judgement. Also personally viewed `tmp/top-cities/shots/dome-de-la-grave/review-fix/with-correct-references.jpg`, comparing the revised exported near/far GLBs in light/dark to dossier facade, river and night photos, with back, roof and dome details.

The corrected-reference comparison confirmed red-brown brick, smaller high-set drum windows, tight cornice contact, a flatter copper dome and preserved lantern silhouette. Final focused conformance plus landmark tests passed all 257 tests; catalog check passed (209 entries / 400 GLB variants at the time checked). Targeted metrics report no issues, 0% back-face hits in 287 rays, matching near/far bounds, and no budget overruns. Near cost reduced 27,776 → 27,584 triangles and 789 → 779 KiB; far remains 8,044 triangles / 290 KiB; both remain seven draws. All changes are confined to this landmark. Height uncertainty and separate Cityscape/Full 3D world validation remain as documented above.
