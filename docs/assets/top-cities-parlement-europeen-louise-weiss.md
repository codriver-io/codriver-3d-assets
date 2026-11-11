# Parlement européen Louise-Weiss — Strasbourg

Louise-Weiss Parliament complex: hollow oval office tower with a full-height southwest agora slot and deliberately unfinished crown, long curved glazed wing, sloping roof and hemicycle dome.

## Sources and rights

- [Identity and documented history](https://fr.wikipedia.org/wiki/Bâtiment_Louise-Weiss)
- [Mapped provider footprint / part, ODbL](https://www.openstreetmap.org/way/41686764)
- [1.jpg | Fichier:Inauguration EYE2014 Parlement européen Strasbourg 9 mai 2014.jpg | Photo Claude TRUONG-NGOC | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Inauguration_EYE2014_Parlement_europ%C3%A9en_Strasbourg_9_mai_2014.jpg)
- [7.jpg | File:Parlement européen - extérieur (Strasbourg).jpg | Gzen92 | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Parlement_europ%C3%A9en_-_ext%C3%A9rieur_(Strasbourg).jpg)

Photos are local comparison only, no images or textures ship. Original code/docs MIT, model CC BY 4.0, OSM-derived geography ODbL 1.0. No contributor agreement accepted or invented.

## Frame and dimensions

Origin `[7.7685436,48.597535]`, metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior footing; no hill, terrain or scene elevation is baked in. Rotation `-0.7490719810584512` radians is baked once from OSM controls `[7.7687783,48.5987619]` → `[7.7701566,48.5979143]`. Host must not rotate again. Exact replacement ownership: 41686764, 339620439, 339621100, 344979818, 344979819, 344979820, 367071632, 367071636, 367071639, 367071641, 367071644, 367071646, 367071648, 367071651, 367071653, 367071656, 367071659, 367071661, 367071663, 367071665, 367071667, 367071670, 367071672, 367071674, 367071676, 367071678, 367071680, 367071682, 367071684, 367071687, 367071689, 367071691, 367071693, 367071696, 367071699, 367071701, 367071705, 367071709, 367071711, 367071713, 367071715; neighbouring structures excluded.

| Feature | Model | Basis |
| --- | ---: | --- |
| Tower maximum | 60 m | European Parliament and City of Strasbourg published value |
| Conflicting OSM / secondary height | 72 m | Not treated as survey data; crown normalized to official 60 m |
| Glazed tower / crown | 50 / 60 m | 17-floor mass and top skeleton, photo estimates |
| Agora and riverfront envelope | Exact mapped rings | OSM outer 41686764, courtyard 41686768, detailed parts |
| Wing roof | 18.3–52.5 m | Estimated from OSM 22/63 m profile × 60/72 |
| Hemicycle dome | about 54 m | Estimated rise over sloping mapped roof |

Current 1999 Louise-Weiss exterior only; neighbouring Palais de l’Europe, Churchill/Madariaga buildings, bridges, river, flags and podium artworks excluded. Official institution and Ministry of Culture sources both give a 60 m tower; conflicting 72 m secondary/OSM value is documented rather than silently chosen. Closed agoras are not filled with a slab: the tower stays hollow and a southwest cut opens towards the old city. Two verified exterior photos: Claude Truong-Ngoc 2014 and Gzen92 current exterior; hemicycle, plaque, winter garden, press racks and altered portrait rejected. No lettering, logos, EU stars or textures.

## Evidence and limitations

Exported near/far geometry, footprint plan and night view inspected against the verified exterior photographs. One visual fix round made the unfinished crown legible as broad supported concrete fins and calibrated the glazed-ring/crown proportions to the official 60 m maximum. The oval agora and southwest full-height slot remain open in both LODs, with separate curtain-wall panes, curved wing, sloping roof, two smaller roof courts and a shallow dome. All fin base corners pass independent support rays with offset negative controls. Main wing roof elevations are explicitly estimated and need independent review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 30137 | 6 | 495060 |
| far | 11971 | 6 | 210492 |

Deterministic QA: no remaining flags; metrics at `tmp/france-northeast/parlement-europeen-louise-weiss/metrics.json`. Exported contact sheet: `tmp/revisions/sheets/parlement-europeen-louise-weiss.jpg`. Red footprint top view and exported far/night evidence: `tmp/france-northeast/shots/parlement-europeen-louise-weiss/`. Focused identity/geometry and registry conformance tests, asset catalog and depth-layer checks pass. Self-review only; independent review remains pending.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot run. Independent review and app placement, terrain pad selection, provider replacement, DEM contacts, lifecycle and hardware verification remain later integration work.

Height decision: [European Parliament](https://api.multimedia.europarl.europa.eu/documents/20125/5269918/I182306%5BSD-EN%5D.pdf), [Ministry of Culture](https://pop.culture.gouv.fr/notice/merimee/ACR0000486) and [City of Strasbourg](https://int.strasbourg.eu/european-parliament) independently report 60 m. The model uses that maximum, with an estimated 50 m glazed ring and a 10 m unfinished structural crown; 72 m is retained only as a conflicting OSM/secondary figure. The sloping wing profile and shallow dome are approximations, requiring particular attention in independent review. Every corner of every crown fin bears on the actual annular concrete roof, with fins excluded from support raycasts; an offset free fin fails the negative control.

Frontage metadata: 228.6558° clockwise from north, toward the southwest open tower slot. The mapped rotation is already baked; this bearing is descriptive and must not be applied as a second rotation.

## Independent review follow-up — 2026-11-11

Rebuilt the unfinished crown as a connected stepped concrete structure: two 201.6-degree horizontal arcs at51.3/53.0 m and shorter upper arcs at56.1/58.3 m, all tied to the same grounded fins in near and far. The exact60 m maximum, oval agora and southwest full-height slot remain open and unchanged. Independent tests pin arc coverage, fin footing corners and every actual beam-to-fin contact with unsupported extension controls.

Fresh exported-GLB sheet: `tmp/revisions/sheets/parlement-europeen-louise-weiss.jpg`. Its paired south, north, east and west views were compared face by face before committing: each facade retains its openings and separate pane/row rhythm, and the changed feature survives in far. The sheet contains a contained reference, matched full-model near/far overview and a plan tile; scratch-only framing changes leave shared tooling untouched.

Landmark tests and focused registry conformance pass; deterministic QA has zero flags and the depth check has zero dropped cycles. Source, exports, manifest and catalog agree. Independent re-review is pending; Cityscape: **not tested**. Full 3D world: **not tested**.

## 2026-11-10 provider ownership fix

Diagnostic removal of provider buildings removes the low southwest forecourt platform; ground/road isolation separately identifies the white agora floor as ordinary paving rather than a retained building. The public provider tile identifies the platform as OSM way **41686767**, absent from OSM_WAYS/FOOTPRINTS; a targeted queued Overpass lookup confirms its government-building / grass-roof tags and exact 50-point ring. Added that ring as PROVIDER_FORECOURT and a second runtime FOOTPRINTS mask, with its ID retained alongside the existing selected parts. The authored tower/wing PLAN, open agora, geometry, palettes and GLBs are unchanged; surrounding blocks remain excluded. Final both-mode evidence and verdicts are in `docs/batches/2026-11-10-app-verification-fixes.md`.
