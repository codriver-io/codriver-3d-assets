# Tour LU — Nantes

Original Tour LU drum with muted blue lower shaft, pink decorative band, arched balcony bay, four glazed dome bays, cream ribs and two open crown lanterns; all logos and lettering omitted.

## Frame and sources

Origin [-1.54620367, 47.21545928], real metres +X east/+Y up/+Z south. Local y=0 is street foundation grade; rotation 17.681° is baked once from mapped controls [[-1.5461632, 47.215512], [-1.5461281, 47.2155196]]. Exact provider ownership: 288814717, 288874905, 288874906, 288874907, 288874908, 288874909, 288874912. The bounded median pad is placement metadata for later host validation; no terrain datum or stretch is baked in.

38 m overall is an adopted unsurveyed OSM finial-height estimate. The mapped drum is about 8.5 m diameter; 20.5 m shaft, dome/lantern stage splits, relief silhouettes and balcony are photo estimates. Tower only, not the factory. OSM parent 32428111 is partially owned only inside the tower ring; all tower parts are listed, and the authored balcony envelope extends the mapped drum conservatively.

- [Identity and history](https://fr.wikipedia.org/wiki/Le_Lieu_unique)
- [Mapped footprint 288814717](https://www.openstreetmap.org/way/288814717)
- [Mapped footprint 288874905](https://www.openstreetmap.org/way/288874905)
- [Mapped footprint 288874906](https://www.openstreetmap.org/way/288874906)
- [Mapped footprint 288874907](https://www.openstreetmap.org/way/288874907)
- [Mapped footprint 288874908](https://www.openstreetmap.org/way/288874908)
- [Mapped footprint 288874909](https://www.openstreetmap.org/way/288874909)
- [Mapped footprint 288874912](https://www.openstreetmap.org/way/288874912)
- [Current tower visitor identity and restoration](https://lelieuunique.com/les-espaces/la-tour-lu)
- [Fichier:Nantes-TourLU.jpg — Selbymay, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Nantes-TourLU.jpg)
- [Fichier:Nantes - Tour LU (09).JPG — Fab5669, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Nantes_-_Tour_LU_(09).JPG)
- [Fichier:Nantes - Tour LU (04).JPG — Fab5669, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Nantes_-_Tour_LU_(04).JPG)
- [Fichier:Nantes - Tour LU (02).JPG — Fab5669, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Nantes_-_Tour_LU_(02).JPG)

All listed reference photographs were checked for identity in the dossier and remain comparison-only in ignored scratch. Original model © 2026 Codriver, CC BY 4.0; source code MIT; OSM data ODbL. No external mesh, scan, texture, logo or lettering ships.

Cityscape: **not tested**. Full 3D world: **not tested**. Inspector evidence does not establish terrain placement, provider masking or hardware performance.

Export: `pnpm build:top-cities-landmarks tour-lu-nantes`. Measured deterministic QA: no flags, no depth cycles, near back-face sweep 0%. Source/GLB conformance and landmark-specific dimensions/openings/contact probes pass in both LODs. Exported sheet `tmp/r3-france-west-overseas/sheets/final2/tour-lu-nantes.jpg` was inspected against the reference; top view `tmp/r3-france-west-overseas/shots/tour-lu-nantes/tour-lu-nantes-glb-near-light-top.png` was inspected over the footprint rings. Visual review replaced stepped dome glazing with continuous curved arch boundaries; two open lanterns and all foot/head contacts pass, with no redundant dome cap or depth cycle. Near/far retain silhouette and characteristic openings. Independent review and app placement remain pending.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 4708 | 6 | 66568 |
| far | 2756 | 6 | 45992 |


## Supplementary inspector review

Procedural near/day and exported far/night were inspected together in `tmp/r3-france-west-overseas/supplement/roundtrip-1.jpg`; silhouette and characteristic openings remain coherent. Orthographic top projection with a visible red footprint overlay is `tmp/r3-france-west-overseas/supplement/tour-lu-nantes/tour-lu-nantes-glb-near-light-orthographic.png` (batch sheet `tmp/r3-france-west-overseas/supplement/orthographic-1.jpg`). The ignored local copy of `shot.mjs` uses an orthographic camera and depth-independent outline only for this inspection, avoiding the perspective parallax and roof occlusion of ground-level rings; shipped geometry and shared tools are unchanged. Cityscape: not tested; Full 3D world: not tested.

## Independent-review follow-up — 2026-11-11

Removed the long diagonal bracing-like strokes around the pink band; only two short quiet1.5m relief rays remain near the balcony-side sculpture. Added a connected balcony-window archivolt in both LODs, concentrating detail around that arch while preserving the muted blue/pink drum and both open lantern tiers. Four elevations of the freshly exported near and far models were compared face by face in the single new sheet `tmp/followup/sheets/tour-lu-nantes.jpg`. Landmark tests and focused source/export conformance pass, deterministic QA has zero issues, depth generation drops no cycle edges and its check is current. Cityscape: not tested; Full 3D world: not tested. Independent re-review of the FIX remains a later coordinator gate.
