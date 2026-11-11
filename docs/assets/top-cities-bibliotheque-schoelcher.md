# Bibliothèque Schœlcher — Fort-de-France

Henri Picq’s eclectic metal library: striped pink-and-cream piers, large arched glazed bays, layered chalet gables, louvred clerestory and ribbed glass cupola with a fine finial; mapped entrance steps and rear annex included.

## Frame and sources

Origin [-61.068057275, 14.60485175], real metres +X east/+Y up/+Z south. Local y=0 is street foundation grade; rotation -29.422° is baked once from mapped controls [[-61.0681728, 14.6048235], [-61.0680231, 14.6047418]]. Exact provider ownership: 94924763. The bounded median pad is placement metadata for later host validation; no terrain datum or stretch is baked in.

Mapped main hall about 18.5 × 17.7 m, versus frequently quoted 17.75 m square for the historic hall. Adopted 23.65 m overall is an unsurveyed published secondary figure, treated as an estimate; no primary height survey found. Roof/clerestory stages, arch sizes, material tones and simplified mosaic borders estimated from the exterior photographs. An authored roof envelope includes the estimated 1.5 m chalet eaves beyond the mapped foundation. Fine lettering, writer names, decorative emblems and iron garden fence omitted; no garden/plaza modeled.

- [Identity and history](https://fr.wikipedia.org/wiki/Biblioth%C3%A8que_Sch%C5%93lcher)
- [Mapped footprint 94924763](https://www.openstreetmap.org/way/94924763)
- [Martinique Tourism: library and current exterior identity](https://www.martinique.org/fr/bibliotheque-schoelcher)
- [Ministry of Culture historic listing](https://pop.culture.gouv.fr/notice/merimee/PA00105941)
- [Secondary historical dimensions, adopted as estimates](https://martinique-irma.blogspot.com/2007/11/la-bibliothque-schoelcher.html)
- [Fichier:Bibliothèque Schoelcher IM0392C.JPG — Anneli Salo, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Biblioth%C3%A8que_Schoelcher_IM0392C.JPG)
- [Fichier:Fort-de-France - 2014 - Bibliothèque Schœlcher (1).jpg — Aristoi, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Fort-de-France_-_2014_-_Biblioth%C3%A8que_Sch%C5%93lcher_(1).jpg)
- [Fichier:Détail Bibliothèque Schoelcher.jpg — UHF, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:D%C3%A9tail_Biblioth%C3%A8que_Schoelcher.jpg)
- [Fichier:Schoelcher librairy.JPG — Riba, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Schoelcher_librairy.JPG)
- [Fichier:Schoelcher library.jpg — Jukka, CC BY 2.0](https://commons.wikimedia.org/wiki/File:Schoelcher_library.jpg)
- [Fichier:Bibliothèque Schoelcher à Fort de France.jpg — Deborah Doquin, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Biblioth%C3%A8que_Schoelcher_%C3%A0_Fort_de_France.jpg)

All listed reference photographs were checked for identity in the dossier and remain comparison-only in ignored scratch. Original model © 2026 Codriver, CC BY 4.0; source code MIT; OSM data ODbL. No external mesh, scan, texture, logo or lettering ships.

Cityscape: **not tested**. Full 3D world: **not tested**. Inspector evidence does not establish terrain placement, provider masking or hardware performance.

Export: `pnpm build:top-cities-landmarks bibliotheque-schoelcher`. Measured deterministic QA: no flags, no depth cycles, near back-face sweep 0%. Source/GLB conformance and landmark-specific dimensions/openings/contact probes pass in both LODs. Exported sheet `tmp/r3-france-west-overseas/sheets/final2/bibliotheque-schoelcher.jpg` was inspected against the reference; top view `tmp/r3-france-west-overseas/shots/bibliotheque-schoelcher/bibliotheque-schoelcher-glb-near-light-top.png` was inspected over the footprint rings. Photo review enlarged the chalet eaves and restored cream wall fields with muted striped piers; bracket sides are clipped at their named masonry/roof contacts, tested with shortened negative controls, and buried trim caps are removed so no depth cycles remain. Near/far retain silhouette and characteristic openings. Independent review and app placement remain pending.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 10436 | 8 | 153140 |
| far | 4576 | 8 | 97224 |


## Supplementary inspector review

Procedural near/day and exported far/night were inspected together in `tmp/r3-france-west-overseas/supplement/roundtrip-2.jpg`; silhouette and characteristic openings remain coherent. Orthographic top projection with a visible red footprint overlay is `tmp/r3-france-west-overseas/supplement/bibliotheque-schoelcher/bibliotheque-schoelcher-glb-near-light-orthographic.png` (batch sheet `tmp/r3-france-west-overseas/supplement/orthographic-2.jpg`). The ignored local copy of `shot.mjs` uses an orthographic camera and depth-independent outline only for this inspection, avoiding the perspective parallax and roof occlusion of ground-level rings; shipped geometry and shared tools are unchanged. Cityscape: not tested; Full 3D world: not tested.

## Independent-review follow-up — 2026-11-11

Far now retains two full-height mullions and two transoms in every one of the twelve arched glazed bays, including the tall entrance down to its sill, with coarse inset members merged into the existing trim material. All west/east/north/south near and far elevations were checked, including bays partly hidden by the service annex. Far4576triangles/8draws remains well below12000triangles/8draws/500000bytes, and per-bay ray tests now catch missing vertical or horizontal grid members. Four elevations of the freshly exported near and far models were compared face by face in the single new sheet `tmp/followup/sheets/bibliotheque-schoelcher.jpg`. Landmark tests and focused source/export conformance pass, deterministic QA has zero issues, depth generation drops no cycle edges and its check is current. Cityscape: not tested; Full 3D world: not tested. Independent re-review of the FIX remains a later coordinator gate.
