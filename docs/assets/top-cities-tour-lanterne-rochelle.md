# Tour de la Lanterne — La Rochelle

Medieval lighthouse/prison tower with broad cylindrical drum, pierced circular galleries, octagonal upper shaft, a long crocketed stone needle and the projecting neo-Gothic glazed lantern with its own small pinnacles.

## Frame and sources

Origin [-1.1571191, 46.15578515], real metres +X east/+Y up/+Z south. Local y=0 is street foundation grade; rotation 1.275° is baked once from mapped controls [[-1.1572342, 46.1557813], [-1.1570007, 46.1557849]]. Exact provider ownership: 119868751. The bounded median pad is placement metadata for later host validation; no terrain datum or stretch is baked in.

58 m adopted estimate from the current CMN page; the older CMN section drawing says 55 m and other records vary. Public upper gallery about 38 m. Base diameter about 18 m mapped from OSM; stage splits, lantern and small side spire are photo estimates. East–west mapped drum diameter establishes the exported reference axis; octagonal/bay radial phase is estimated from exterior references. Post-2015 restored permanent exterior, without scaffolding, sea platform or adjacent walls.

- [Identity and history](https://fr.wikipedia.org/wiki/Tour_de_la_Lanterne)
- [Mapped footprint 119868751](https://www.openstreetmap.org/way/119868751)
- [CMN: current 58 m total and 38 m gallery](https://www.tours-la-rochelle.fr/decouvrir/histoire-des-tours-de-la-rochelle)
- [CMN earlier section: 55 m, height discrepancy retained as estimate](https://www.monuments-nationaux.fr/content/download/537584/file_fr/document_dossier_fr_dp.tours.de.la.rochelle.pdf?inLanguage=fre-FR&version=3)
- [File:La Tour de la Lanterne (4).JPG — Jean-Pierre Bazard Jpbazard, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:La_Tour_de_la_Lanterne_(4).JPG)
- [File:Tour Lanterne août 2015 La Rochelle Charente Maritime.jpg — Jebulon, CC0](https://commons.wikimedia.org/wiki/File:Tour_Lanterne_ao%C3%BBt_2015_La_Rochelle_Charente_Maritime.jpg)

All listed reference photographs were checked for identity in the dossier and remain comparison-only in ignored scratch. Original model © 2026 Codriver, CC BY 4.0; source code MIT; OSM data ODbL. No external mesh, scan, texture, logo or lettering ships.

Cityscape: **not tested**. Full 3D world: **not tested**. Inspector evidence does not establish terrain placement, provider masking or hardware performance.

Export: `pnpm build:top-cities-landmarks tour-lanterne-rochelle`. Measured deterministic QA: no flags, no depth cycles, near back-face sweep 0%. Source/GLB conformance and landmark-specific dimensions/openings/contact probes pass in both LODs. Exported sheet `tmp/r3-france-west-overseas/sheets/final2/tour-lanterne-rochelle.jpg` was inspected against the reference; top view `tmp/r3-france-west-overseas/shots/tour-lanterne-rochelle/tour-lanterne-rochelle-glb-near-light-top.png` was inspected over the footprint rings. The first visual round added the genuine radial taper of the octagonal shaft, preserving the needle and the projecting lantern; both galleries retain daylight and all posts meet their decks, with a shortened negative control. Near/far retain silhouette and characteristic openings. Independent review and app placement remain pending.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 5763 | 3 | 81212 |
| far | 3867 | 3 | 58044 |


## Supplementary inspector review

Procedural near/day and exported far/night were inspected together in `tmp/r3-france-west-overseas/supplement/roundtrip-2.jpg`; silhouette and characteristic openings remain coherent. Orthographic top projection with a visible red footprint overlay is `tmp/r3-france-west-overseas/supplement/tour-lanterne-rochelle/tour-lanterne-rochelle-glb-near-light-orthographic.png` (batch sheet `tmp/r3-france-west-overseas/supplement/orthographic-2.jpg`). The ignored local copy of `shot.mjs` uses an orthographic camera and depth-independent outline only for this inspection, avoiding the perspective parallax and roof occlusion of ground-level rings; shipped geometry and shared tools are unchanged. Cityscape: not tested; Full 3D world: not tested.
