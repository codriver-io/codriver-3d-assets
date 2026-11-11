# Cathédrale Saint-Louis — Fort-de-France

Post-2016 Saint-Louis metal cathedral: cream-and-blue west tower, large rose, twin round-arched belfry, open eight-rib iron needle with arched cross-bracing, three-aisle nave, green roofs and mapped rear extension.

## Frame and sources

Origin [-61.069959975, 14.60426575], real metres +X east/+Y up/+Z south. Local y=0 is street foundation grade; rotation -28.486° is baked once from mapped controls [[-61.0700582, 14.6041919], [-61.0697674, 14.6040392]]. Exact provider ownership: 94884319. The bounded median pad is placement metadata for later host validation; no terrain datum or stretch is baked in.

Adopted 58.8 m overall follows the parish and historic street-to-cross account; restoration descriptions also quote a 25 m spire and can be read ambiguously, so intermediate heights are estimates. Published church length66 m/width24 m differ from the mapped 60.5 ×24.5 m hall and 70.9 m outer envelope including west porch and rear extension; the mapped plan is used. Current open metal spire is the March 2016 replacement, confirmed by a September 2017 exterior and the parish installation photo. Pre-2016 clad-spire images and interior-only photos were discarded. All stage splits, structural section sizes, traceries and rear elevations are estimated; no square/plaza, flags, lettering or logos.

- [Identity and history](https://fr.wikipedia.org/wiki/Cath%C3%A9drale_Saint-Louis_de_Fort-de-France)
- [Mapped footprint 94884319](https://www.openstreetmap.org/way/94884319)
- [Parish: new spire installed 7 March 2016 and height statement](https://cathedralesaintlouismartinique.fr/de-la-chapelle-a-la-cathedrale-saint-louis/)
- [DAC restoration dossier: 66 ×24 m, 58.8 m and 25 m statements](https://www.culture.gouv.fr/content/download/251299/pdf_file/FORT%20DE%20FRANCE%20-%20CATHEDRALE%20SAINT%20LOUIS%20-%20MH%20en%20chantier%20-%20avril%202015.pdf)
- [City: skyline landmark and identity](https://www.fortdefrance.fr/point-d-interet/cathedrale-saint-louis-1895/)
- [File:Cathédrale de fort de France.jpg — Dunston thomas evans, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Cath%C3%A9drale_de_fort_de_France.jpg)
- [Replacement spire installation, March 2016 — Photographer uncredited; Saint-Louis parish publisher, All rights reserved, no reuse licence stated](https://cathedralesaintlouismartinique.fr/wp-content/uploads/2021/03/cathedrale-saint-louis-fleche.jpg)

All listed reference photographs were checked for identity in the dossier and remain comparison-only in ignored scratch. Original model © 2026 Codriver, CC BY 4.0; source code MIT; OSM data ODbL. No external mesh, scan, texture, logo or lettering ships.

Cityscape: **not tested**. Full 3D world: **not tested**. Inspector evidence does not establish terrain placement, provider masking or hardware performance.

Export: `pnpm build:top-cities-landmarks cathedrale-saint-louis-fort-de-france`. Measured deterministic QA: no flags, no depth cycles, near back-face sweep 0%. Source/GLB conformance and landmark-specific dimensions/openings/contact probes pass in both LODs. Exported sheet `tmp/r3-france-west-overseas/sheets/final2/cathedrale-saint-louis-fort-de-france.jpg` was inspected against the reference; top view `tmp/r3-france-west-overseas/shots/cathedrale-saint-louis-fort-de-france/cathedrale-saint-louis-fort-de-france-glb-near-light-top.png` was inspected over the footprint rings. The current post-2016 open iron needle was checked against the parish installation photograph and the dated September 2017 exterior; the older clad spire was discarded. The final pass added clock openings and set the blue framing against the masonry surface. Near/far retain silhouette and characteristic openings. Independent review and app placement remain pending.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 9238 | 8 | 147352 |
| far | 4627 | 8 | 87908 |


## Supplementary inspector review

Procedural near/day and exported far/night were inspected together in `tmp/r3-france-west-overseas/supplement/roundtrip-2.jpg`; silhouette and characteristic openings remain coherent. Orthographic top projection with a visible red footprint overlay is `tmp/r3-france-west-overseas/supplement/cathedrale-saint-louis-fort-de-france/cathedrale-saint-louis-fort-de-france-glb-near-light-orthographic.png` (batch sheet `tmp/r3-france-west-overseas/supplement/orthographic-2.jpg`). The ignored local copy of `shot.mjs` uses an orthographic camera and depth-independent outline only for this inspection, avoiding the perspective parallax and roof occlusion of ground-level rings; shipped geometry and shared tools are unchanged. Cityscape: not tested; Full 3D world: not tested.

## Independent-review follow-up — 2026-11-11

Added paired blue facade divisions alongside each tower pier and two horizontal framing breaks below and above the rose, using the existing inset metal material in both LODs. The open post2016 needle, clock openings, rose and separated nave bays remain unchanged; no lettering or extra material draw was introduced. Four elevations of the freshly exported near and far models were compared face by face in the single new sheet `tmp/followup/sheets/cathedrale-saint-louis-fort-de-france.jpg`. Landmark tests and focused source/export conformance pass, deterministic QA has zero issues, depth generation drops no cycle edges and its check is current. Cityscape: not tested; Full 3D world: not tested. Independent re-review of the FIX remains a later coordinator gate.
