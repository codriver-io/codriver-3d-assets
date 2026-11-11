# Tour Pey-Berland — Bordeaux

Detached Gothic belfry with paired lancet openings, stepped corner buttresses, open upper crown, crocketed pinnacles and a six-metre gilded Virgin holding the Child.

## Frame and sources

Origin [-0.57661897, 44.83760913], real metres +X east/+Y up/+Z south. Local y=0 is street foundation grade; rotation 7.162° is baked once from mapped controls [[-0.5766379, 44.837562], [-0.5765773, 44.8375674]]. Exact provider ownership: 79978925. The bounded median pad is placement metadata for later host validation; no terrain datum or stretch is baked in.

66 m overall and 6 m Virgin from French Ministry of Culture/departmental tourism; 50 m is the viewing terrace, not total height. Mapped irregular square plan; all intermediate stages, lancet widths, buttress and statue anatomy are photo estimates. No adjacent cathedral or plaza geometry.

- [Identity and history](https://fr.wikipedia.org/wiki/Tour_Pey-Berland)
- [Mapped footprint 79978925](https://www.openstreetmap.org/way/79978925)
- [Ministry of Culture: summit 66 m](https://www.culture.gouv.fr/rechercher-une-publication-du-ministere-de-la-culture/repertoire-des-informations-publiques/Monuments-nationaux/tour-pey-berland-a-bordeaux)
- [Gironde tourism: statue 6 m, total 66 m](https://www.gironde-tourisme.com/decouvrir-la-gironde/le-patrimoine-culturel/les-iconiques-en-gironde/la-tour-pey-berland/)
- [Fichier:Bordeaux - Tour Pey-Berland.jpg — Jean-Christophe BENOIST, CC BY 4.0](https://commons.wikimedia.org/wiki/File:Bordeaux_-_Tour_Pey-Berland.jpg)
- [Fichier:Statue Tour Pey Berland.jpg — François Adoue, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Statue_Tour_Pey_Berland.jpg)
- [File:Bordeaux - Tour Pey Berland - Statue de la Vierge à l'Enfant - Depuis la rue Père Louis de Jabrun.jpg — Romainbehar, CC0](https://commons.wikimedia.org/wiki/File:Bordeaux_-_Tour_Pey_Berland_-_Statue_de_la_Vierge_%C3%A0_l%27Enfant_-_Depuis_la_rue_P%C3%A8re_Louis_de_Jabrun.jpg)
- [File:Bordeaux Tour Pey Berland 3.jpg — Olivier Aumage, CC BY-SA 2.0 fr](https://commons.wikimedia.org/wiki/File:Bordeaux_Tour_Pey_Berland_3.jpg)

All listed reference photographs were checked for identity in the dossier and remain comparison-only in ignored scratch. Original model © 2026 Codriver, CC BY 4.0; source code MIT; OSM data ODbL. No external mesh, scan, texture, logo or lettering ships.

Cityscape: **not tested**. Full 3D world: **not tested**. Inspector evidence does not establish terrain placement, provider masking or hardware performance.

Export: `pnpm build:top-cities-landmarks tour-pey-berland`. Measured deterministic QA: no flags, no depth cycles, near back-face sweep 0%. Source/GLB conformance and landmark-specific dimensions/openings/contact probes pass in both LODs. Exported sheet `tmp/r3-france-west-overseas/sheets/final2/tour-pey-berland.jpg` was inspected against the reference; top view `tmp/r3-france-west-overseas/shots/tour-pey-berland/tour-pey-berland-glb-near-light-top.png` was inspected over the footprint rings. First visual round added connected facade shafts, pointed lancets and mullions; crown proportions and gilded human group were checked against the dossier. Near/far retain silhouette and characteristic openings. Independent review and app placement remain pending.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 6101 | 3 | 90660 |
| far | 4277 | 3 | 67364 |


## Supplementary inspector review

Procedural near/day and exported far/night were inspected together in `tmp/r3-france-west-overseas/supplement/roundtrip-1.jpg`; silhouette and characteristic openings remain coherent. Orthographic top projection with a visible red footprint overlay is `tmp/r3-france-west-overseas/supplement/tour-pey-berland/tour-pey-berland-glb-near-light-orthographic.png` (batch sheet `tmp/r3-france-west-overseas/supplement/orthographic-1.jpg`). The ignored local copy of `shot.mjs` uses an orthographic camera and depth-independent outline only for this inspection, avoiding the perspective parallax and roof occlusion of ground-level rings; shipped geometry and shared tools are unchanged. Cityscape: not tested; Full 3D world: not tested.

## Independent-review follow-up — 2026-11-11

Strengthened the continuous Gothic facade shafts from0.32m to0.44m and the lower blind-panel jambs from0.23m to0.30m; replaced their round outlines with connected pointed-arch strokes in both LODs. Paired belfry openings, open crown and gold summit are preserved. Four elevations of the freshly exported near and far models were compared face by face in the single new sheet `tmp/followup/sheets/tour-pey-berland.jpg`. Landmark tests and focused source/export conformance pass, deterministic QA has zero issues, depth generation drops no cycle edges and its check is current. Cityscape: not tested; Full 3D world: not tested. Independent re-review of the FIX remains a later coordinator gate.
