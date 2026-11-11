# Tour Saint-Nicolas — La Rochelle

Pentagonal harbour fortress with mapped clustered base, corbelled crenellated parapet, tall square north-west keep, lower tiled terrace roof and attached east curtain wall.

## Frame and sources

Origin [-1.1533735, 46.15577436], real metres +X east/+Y up/+Z south. Local y=0 is street foundation grade; rotation 0.000° is baked once from mapped controls [[-1.1531301, 46.1557672], [-1.1531587, 46.1557699]]. Exact provider ownership: 119832532. The bounded median pad is placement metadata for later host validation; no terrain datum or stretch is baked in.

42 m overall follows current CMN and the 2026 Freyssinet project, adopted as an estimate because other published accounts give 36–37 m. Exact irregular plan and east curtain alignment are mapped; architecture authored directly in east/up/south, no host rotation. Main parapet 33.2 m, upper keep 42 m, windows, corbels and tiled roof are photo estimates. Current 2026 exterior checked against Freyssinet; subpixel ties, construction barriers, flags and temporary works omitted. Local y=0 is the flat foundation/street datum, not sea level.

- [Identity and history](https://fr.wikipedia.org/wiki/Tour_Saint-Nicolas)
- [Mapped footprint 119832532](https://www.openstreetmap.org/way/119832532)
- [CMN current heights: Saint-Nicolas 42 m, Lanterne 58 m](https://www.tours-la-rochelle.fr/en/discover/a-unique-panorama-of-the-city-and-ocean)
- [2026 emergency stabilization: 42 m and current exterior](https://www.freyssinet.fr/references/tour-saint-nicolas-securisation-durgence/)
- [City: ongoing stabilization context](https://www.larochelle.fr/annuaires/projets/projet/la-tour-saint-nicolas)
- [Fichier:La Tour Saint-Nicolas (4).JPG — Jean-Pierre Bazard Jpbazard, CC BY 4.0](https://commons.wikimedia.org/wiki/File:La_Tour_Saint-Nicolas_(4).JPG)
- [Fichier:La Tour Saint-Nicolas (1).JPG — Jean-Pierre Bazard Jpbazard, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:La_Tour_Saint-Nicolas_(1).JPG)
- [Fichier:Torre de San Nicolás La Rochela 04.JPG — B25es, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Torre_de_San_Nicol%C3%A1s_La_Rochela_04.JPG)
- [Tour Saint-Nicolas — Freyssinet 2026 project exterior — Photographer uncredited; Freyssinet publisher, All rights reserved](https://www.freyssinet.fr/references/tour-saint-nicolas-securisation-durgence/)

All listed reference photographs were checked for identity in the dossier and remain comparison-only in ignored scratch. Original model © 2026 Codriver, CC BY 4.0; source code MIT; OSM data ODbL. No external mesh, scan, texture, logo or lettering ships.

Cityscape: **not tested**. Full 3D world: **not tested**. Inspector evidence does not establish terrain placement, provider masking or hardware performance.

Export: `pnpm build:top-cities-landmarks tour-saint-nicolas-rochelle`. Measured deterministic QA: no flags, no depth cycles, near back-face sweep 0%. Source/GLB conformance and landmark-specific dimensions/openings/contact probes pass in both LODs. Exported sheet `tmp/r3-france-west-overseas/sheets/final2/tour-saint-nicolas-rochelle.jpg` was inspected against the reference; top view `tmp/r3-france-west-overseas/shots/tour-saint-nicolas-rochelle/tour-saint-nicolas-rochelle-glb-near-light-top.png` was inspected over the footprint rings. Visual review replaced per-edge wall extrusions with a continuous skin and joined parapet ring, removing seams and reducing weight; upper/lower crowns, narrow windows, tiled roof and mapped curtain contact remain in both LODs. Near/far retain silhouette and characteristic openings. Independent review and app placement remain pending.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 2624 | 4 | 48696 |
| far | 2152 | 4 | 42080 |


## Supplementary inspector review

Procedural near/day and exported far/night were inspected together in `tmp/r3-france-west-overseas/supplement/roundtrip-2.jpg`; silhouette and characteristic openings remain coherent. Orthographic top projection with a visible red footprint overlay is `tmp/r3-france-west-overseas/supplement/tour-saint-nicolas-rochelle/tour-saint-nicolas-rochelle-glb-near-light-orthographic.png` (batch sheet `tmp/r3-france-west-overseas/supplement/orthographic-2.jpg`). The ignored local copy of `shot.mjs` uses an orthographic camera and depth-independent outline only for this inspection, avoiding the perspective parallax and roof occlusion of ground-level rings; shipped geometry and shared tools are unchanged. Cityscape: not tested; Full 3D world: not tested.
