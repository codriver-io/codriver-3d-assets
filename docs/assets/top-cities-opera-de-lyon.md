# Opéra de Lyon

Original procedural reconstruction of the 1993 Jean Nouvel opera house at 3 place de la Comédie, Lyon. The preserved stone facades of the 1831 theatre by Antoine-Marie Chenavard and Jean-Marie Pollet support a tall glass-and-steel half-cylinder barrel vault. The west tympanum faces the Hôtel de Ville behind eight Muses; the ground-floor peristyle wraps three sides. The rear tympanum is gray perforated steel, represented without literal perforation holes.

Sources checked 2026-10-13: [Ateliers Jean Nouvel](https://www.jeannouvel.com/en/projects/opera-3/) establishes the 1986–1993 project, glass louvers, round arches, red night purlin lights, recessed west glass tympanum, rear steel screen and three-sided peristyle. [Opéra national de Lyon](https://www.opera-lyon.com/informations-pratiques/visiter-l-opera) identifies the visitor spaces. [OSM way 10061086](https://www.openstreetmap.org/way/10061086) supplies the mapped outline and height tags. References were supplied in the local dossier; no new photos or meshes were imported.

| Feature | Model | Basis |
| --- | --- | --- |
| Total height | 42 m | OSM height=42, mapped estimate rather than published survey |
| Roof rise | 20 m | OSM roof:height=20; architectural half-cylinder identity |
| Stone roof datum | 22 m | Derived from the two OSM height tags |
| Shell plan | about 56 × 38 m | OSM mapped, nonparallel facade edges |
| Roof half-width | 17.9 m | Estimated fit inside the mapped shell |
| Barrel length | 49.6 m | Estimated west setback and rear facade fit |
| Main facade bays / Muses | 7 / 8 | Modern dossier photograph |
| Side bays | 13 | Photographic rhythm approximation |
| Arch opening / spring | 3.45 m / 5.45 m | Estimated from photograph |
| Muse height including base | 2.9 m | Estimated original grouped silhouettes |

Metres, +X east / +Y up / +Z south; local y=0 is rigid street grade. The polygon centroid origin is `[4.8366,45.76778905]`. The mapped northern edge controls `[4.8362324,45.7679255]` and `[4.8369094,45.7679866]` give a bearing about 82.6°; southern controls `[4.8363009,45.7675849]` and `[4.8370093,45.7676708]` give about 80.1°. The middle authoring axis is 81.4°, with 8.6° yaw baked into vertices; the stone shell remains slightly tapered to follow these nonparallel edges. Provider replacement owns only way 10061086; neighbors, metro elevator, plaza and streets are excluded. No DEM, absolute altitude or Mercator stretch is included. A 40 m rigid pad is declared for separate live terrain inspection.

Five merged near materials provide warm muted limestone, darker relief, blue-black glass, pale gray steel, dark shutters and subdued day / red night purlin lighting. Ground arches and upper windows are actual holes with recessed glass; far preserves each individual bay, all eight statue silhouettes and the full vault. Fine carvings, statue identities/attributes, double glass skin, rear perforations, backstage interiors and below-grade floors are approximations or omitted. Models contain only original geometry and no photos or textures.

Reference sheet opened: `tmp/top-cities/opera-de-lyon/refs-sheet.jpg`, with the modern west/south facade by Robot8A (CC BY-SA 4.0), dusk photograph by SashiRolls/Steve Shimanek (CC BY-SA 4.0), and 1901–1902 Grand Théâtre plate by E. de Rolland & D. Clouzet (public domain). Their individual files, authors and license links are registered in the catalog provenance; ignored local images are comparison-only. The first source sheet showed reversed roof-end and pane faces, which were corrected before exported inspection. A second exported inspection checked the west arcade, opposite facade, roof, street and statue detail; quantitative QA then prompted further depth and far-budget refinement.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**.

## Final exported evidence

Opened and judged `tmp/top-cities/shots/opera-de-lyon/final/export-reference-contact.jpg`: supplied photographs next to all six exported views (overview, west facade, back, roof, street and muse detail), near/far and light/dark. Opened the exported overhead plan `opera-de-lyon-glb-near-light-top.png` in the same directory; the shell fits the red OSM ring, whose outline is mostly hidden beneath the opaque building. Vertex-by-vertex tests independently pin ownership within 0.8 m. The half-cylinder, seven front bays, three-sided arcade and eight Muses survive far simplification; red night roof purlins remain visible from the sides. Far drops individual side louver slats but retains separate arched bays, keeping the silhouette and window rhythm. Fine statue attributes, carved capitals, stone joints and exact louvers remain intentionally simplified rather than copied sculpture.

The two visual correction rounds fixed exterior winding and reduced far cost, replaced rear door overlays with actual wall openings, removed competing relief material and increased pane/slat separation; an additional contact-test repair added continuous roof-seat cornices at the tapered rear edge, then repeated export/contact inspection. Final QA has no flagged overlaps/layered faces after geometry-derived depth ordering, no material cycles, no below-grade parts and 0% back-face hits over 437 sampled rays. The custom tests check curved roof heights, open west arches, all eight muse heads/pedestal contacts, named rim/stone-eave contacts for every grid member and primary roof arch, a shortened-member failure control, all-vertex geographic containment and near/far bounds.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 14,514 | 5 | 878,348 | 857.8 |
| Far | 6,726 | 5 | 440,156 | 429.8 |

Final focused command: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/opera-de-lyon/opera-de-lyon.test.js` recorded **617/619 passing** in `tmp/top-cities/opera-de-lyon/tests.txt`: all five dedicated Opéra tests and all three Opéra registry/export tests pass. The only failures belong to another builder's in-progress `saint-sophia-cathedral-kyiv` (catalog readiness mismatch and far 0.54 MB export). The global `node scripts/asset-catalog.mjs` was retried and remains blocked only by that builder's missing `docs/3d-top-cities-saint-sophia-cathedral-kyiv.md`; an earlier run was blocked by the missing Santiago Bernabéu doc. These external records were not edited.

`node scripts/landmark-depth-layers.mjs --ids opera-de-lyon --check` passes after regeneration, with zero cycle edges dropped; output is retained in `tmp/top-cities/opera-de-lyon/depth-check.txt`. Final `qa-metrics.json` contains no issues, and all five dedicated tests finish in about 0.35 seconds. The only shared source file regenerated was the explicitly authorized `src/peregrine/landmarks/depth-layers.js`; no runtime, registry, other landmark, git write or deployment was performed.
