# Donjon de Niort — Niort

Paired Plantagenet keeps with unequal crenellated square towers, clustered round buttresses, lower slate-roof connecting hall, stair turrets and sparse slit windows.

## Frame and sources

Origin [-0.46507244, 46.32530216], real metres +X east/+Y up/+Z south. Local y=0 is street foundation grade; rotation 40.244° is baked once from mapped controls [[-0.4650467, 46.3252398], [-0.4649449, 46.3252993]]. Exact provider ownership: 40461822. The bounded median pad is placement metadata for later host validation; no terrain datum or stretch is baked in.

South keep 28 m and 13.5 m side; north keep 23 m and about 14 × 15 m from published descriptions, adopted as approximate historic dimensions. Overall plan and bearing mapped. Wall/window layout, turret radii, parapets, stairs and roof rise are photo estimates; no interiors or surrounding plaza.

- [Identity and history](https://fr.wikipedia.org/wiki/Donjon_de_Niort)
- [Mapped footprint 40461822](https://www.openstreetmap.org/way/40461822)
- [Niort Agglo museums: Donjon identity](https://cdn.niortagglo.fr/sortir-visiter/patrimoine-et-musees/patrimoine-de-lagglomeration/index.html)
- [Dimensions of the two keeps](https://en.wikipedia.org/wiki/Donjon_de_Niort)
- [Fichier:Donjon Niort.JPG — Antoine.gacioch, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Donjon_Niort.JPG)
- [Fichier:Niort donjon 1.jpg — Jfpnt, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Niort_donjon_1.jpg)

All listed reference photographs were checked for identity in the dossier and remain comparison-only in ignored scratch. Original model © 2026 Codriver, CC BY 4.0; source code MIT; OSM data ODbL. No external mesh, scan, texture, logo or lettering ships.

Cityscape: **not tested**. Full 3D world: **not tested**. Inspector evidence does not establish terrain placement, provider masking or hardware performance.

Export: `pnpm build:top-cities-landmarks donjon-de-niort`. Measured deterministic QA: no flags, no depth cycles, near back-face sweep 0%. Source/GLB conformance and landmark-specific dimensions/openings/contact probes pass in both LODs. Exported sheet `tmp/r3-france-west-overseas/sheets/final2/donjon-de-niort.jpg` was inspected against the reference; top view `tmp/r3-france-west-overseas/shots/donjon-de-niort/donjon-de-niort-glb-near-light-top.png` was inspected over the footprint rings. The plan-view review moved the large stair turret to the mapped middle of the south-east face and the smaller drum to the opposite face; the unequal keep heights and connected slate hall are retained. Near/far retain silhouette and characteristic openings. Independent review and app placement remain pending.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 4132 | 3 | 64188 |
| far | 3220 | 3 | 54096 |


## Supplementary inspector review

Procedural near/day and exported far/night were inspected together in `tmp/r3-france-west-overseas/supplement/roundtrip-1.jpg`; silhouette and characteristic openings remain coherent. Orthographic top projection with a visible red footprint overlay is `tmp/r3-france-west-overseas/supplement/donjon-de-niort/donjon-de-niort-glb-near-light-orthographic.png` (batch sheet `tmp/r3-france-west-overseas/supplement/orthographic-1.jpg`). The ignored local copy of `shot.mjs` uses an orthographic camera and depth-independent outline only for this inspection, avoiding the perspective parallax and roof occlusion of ground-level rings; shipped geometry and shared tools are unchanged. Cityscape: not tested; Full 3D world: not tested.
