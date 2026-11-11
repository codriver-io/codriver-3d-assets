# Porte Cailhau — Bordeaux

Medieval royal gate with open Gothic passage, paired rounded flanks, machicolated parapet, five slate points, open central lantern and small royal niches.

## Frame and sources

Origin [-0.56849737, 44.83875599], real metres +X east/+Y up/+Z south. Local y=0 is street foundation grade; rotation -64.428° is baked once from mapped controls [[-0.568537, 44.8387616], [-0.5685177, 44.838733]]. Exact provider ownership: 1093782523. The bounded median pad is placement metadata for later host validation; no terrain datum or stretch is baked in.

35 m total height from Bordeaux Tourism. Plan and bearing mapped from OSM way 1093782523; roof stage heights, gate width, window dimensions and simplified royal figures are photo estimates. Both facades modeled; neighboring houses and street furniture excluded.

- [Identity and history](https://fr.wikipedia.org/wiki/Porte_Cailhau)
- [Mapped footprint 1093782523](https://www.openstreetmap.org/way/1093782523)
- [Bordeaux Tourism: 35 m gate and medieval identity](https://www.bordeaux-tourisme.com/sites/bordeaux_tourisme/files/widgets/list/pdf/cp_porte_cailhau.pdf)
- [Fichier:Bordeaux Porte Cailhau R02.jpg — Marc Ryckaert (MJJR), CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Bordeaux_Porte_Cailhau_R02.jpg)
- [Fichier:Bordeaux France.jpg — PLBechly, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Bordeaux_France.jpg)

All listed reference photographs were checked for identity in the dossier and remain comparison-only in ignored scratch. Original model © 2026 Codriver, CC BY 4.0; source code MIT; OSM data ODbL. No external mesh, scan, texture, logo or lettering ships.

Cityscape: **not tested**. Full 3D world: **not tested**. Inspector evidence does not establish terrain placement, provider masking or hardware performance.

Export: `pnpm build:top-cities-landmarks porte-cailhau-bordeaux`. Measured deterministic QA: no flags, no depth cycles, near back-face sweep 0.6%. Source/GLB conformance and landmark-specific dimensions/openings/contact probes pass in both LODs. Exported sheet `tmp/r3-france-west-overseas/sheets/final2/porte-cailhau-bordeaux.jpg` was inspected against the reference; top view `tmp/r3-france-west-overseas/shots/porte-cailhau-bordeaux/porte-cailhau-bordeaux-glb-near-light-top.png` was inspected over the footprint rings. Visual review replaced oversized white dormer caps with stone gables and slate sides; real recessed dormer openings remove all depth cycles. Near/far retain silhouette and characteristic openings. Independent review and app placement remain pending.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3100 | 4 | 46800 |
| far | 2208 | 4 | 36940 |


## Supplementary inspector review

Procedural near/day and exported far/night were inspected together in `tmp/r3-france-west-overseas/supplement/roundtrip-1.jpg`; silhouette and characteristic openings remain coherent. Orthographic top projection with a visible red footprint overlay is `tmp/r3-france-west-overseas/supplement/porte-cailhau-bordeaux/porte-cailhau-bordeaux-glb-near-light-orthographic.png` (batch sheet `tmp/r3-france-west-overseas/supplement/orthographic-1.jpg`). The ignored local copy of `shot.mjs` uses an orthographic camera and depth-independent outline only for this inspection, avoiding the perspective parallax and roof occlusion of ground-level rings; shipped geometry and shared tools are unchanged. Cityscape: not tested; Full 3D world: not tested.

## Independent-review follow-up — 2026-11-11

Two outer front dormers now cut through the conical slate roofs in both LODs, each with a pointed stone gable, recessed dark opening and exposed cross mullion. Width1.9m is13.87percent of the13.7m front; apex25.2m is46.67percent of the21.7–29.2m cone rise, matching the roughly14percent/47percent reference proportions within the requested8percent tolerance. The central dormer and five principal roof points remain unchanged; the town-side outer cones remain undecorated as in the second reference. Four elevations of the freshly exported near and far models were compared face by face in the single new sheet `tmp/followup/sheets/porte-cailhau-bordeaux.jpg`. Landmark tests and focused source/export conformance pass, deterministic QA has zero issues, depth generation drops no cycle edges and its check is current. Cityscape: not tested; Full 3D world: not tested. Independent re-review of the FIX remains a later coordinator gate.
