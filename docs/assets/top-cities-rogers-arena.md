# Rogers Arena — Vancouver

Original procedural building at **800 Griffiths Way**, opened 21 September 1995 (initially General Motors Place), by Brisbin, Brook and Beynon. This model uses contemporary Rogers branding and the pale dome, glazed entrance fronts, upper louvres, northern cylindrical entrance drum and blue eastern sign tower. Adjacent Aquilini apartment towers and public viaducts are not authored.

## Sources and geographic frame

- [Arena history](https://en.wikipedia.org/wiki/Rogers_Arena): 1995 opening, address, architect; dossier `tmp/top-cities/rogers-arena/facts.txt`.
- [Official entrance directions](https://rogersarena.com/parking-and-directions/): Griffiths Way parkade and named entrance gates.
- [OSM outline 24705911](https://www.openstreetmap.org/way/24705911): four-level arena, address, 1995 start date, pale grey roof. [Roof part 497813171](https://www.openstreetmap.org/way/497813171): five levels and dome roof. Extract in the dossier, reused rather than refetched.
- [Rogers Arena (Vancouver)](https://commons.wikimedia.org/wiki/File:Rogers_Arena_(Vancouver).jpg), Quintin Soloviev, 18 May 2026, CC BY 4.0: southeast elevated view, current blue name tower, pale facade and roof.
- [Rogers Arena](https://commons.wikimedia.org/wiki/File:Rogers_Arena.jpg), Hucul002, 23 August 2011, CC BY-SA 3.0: north viaduct-side glass bays and upper louvres.
- [Vancouver-gmplace3](https://commons.wikimedia.org/wiki/File:Vancouver-gmplace3.jpg), Buchanan-Hermit, 7 June 2007, Attribution licence: historic north-side structure only; former GM signage is not reproduced.

All photos stay in ignored `tmp/top-cities/rogers-arena/refs/`. Source and meshes are original, texture-free; no external meshes or font assets. Source MIT; model CC BY 4.0; geographic data © OpenStreetMap contributors, ODbL 1.0.

Origin `[-123.10889, 49.27778]`; real metres, east/up/south, rigid y=0 local grade. The OSM edges are built directly, so rotation is baked once. The eastern entrance edge from `[-123.1078218,49.2779732]` to `[-123.1078392,49.2773545]` gives outward bearing approximately 91°. The south edge from `[-123.1078392,49.2773545]` to `[-123.1085124,49.2773581]` confirms its near east-west alignment. The local equirectangular conversion differs from Mercator-derived ground metres by less than 2 cm over this site.

The owned footprint clips OSM outline 24705911 around the east boundary of **Aquilini Centre West (401708837)** rather than masking its entire podium. Roof part 497813171 is separately registered. Aquilini Centre West and South (749615076) are left to the provider. No ground plaza slab or surrounding road is included.

## Dimensions

| Element | Model | Basis |
| --- | ---: | --- |
| Owned arena envelope | about 137 × 127 m | mapped, after excluding west tower |
| Roof plan | about 122 × 102 m | mapped roof part; irregular outline |
| Dome crown | 35 m | photo-based estimate, not surveyed |
| Roof eave | 26 m | estimate |
| Outer facade top | 22 m | estimate, OSM four levels |
| Entrance drum | 32 m high, 32 m diameter | deliberately simplified cylindrical estimate |
| Blue eastern sign tower | 31 m top, 12 m wide | photo-based estimate |
| Roof rise | 9 m | estimate, radial shallow dome |

## Construction and limitations

The outer wall is partitioned into separate grey, glass and frame panels rather than decorated with coplanar windows. The northern frontage retains broad curtain-wall bays. The east front combines glazing at entrance level, upper small windows and a blue vertical sign tower; original geometric `ROGERS / ARENA` lettering survives both LODs. The roof uses an indexed smooth radial loft over the mapped rim. The upper arena wall and drum have near louvre grooves, dropped at far distance; far keeps coarser separate glazing panels, drum silhouette, sign and roof plant. Eight material draws in both LODs: stone, roof, glass, frame, louvre, blue, sign, glow. Dark palettes dim the shell and glass; sign and selected entrance panes use the runtime self-lit names.

The drum is an approximate architectural mass, not a measured reconstruction. Door and window counts, mechanical plant, facade subdivisions and roof curvature are estimates; glass is opaque tinted geometry rather than reflective glazing. No interior, statues, Canucks logos/banners, streets, viaducts or residential towers. The local foundation is flat; no DEM or Mercator stretch is baked in.

## Measured exported cost

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 13,891 | 8 | 682,712 | 666.7 |
| Far | 5,880 | 8 | 308,668 | 301.4 |

## Verification evidence

Initial source contact sheet: `tmp/top-cities/shots/rogers-arena/source/rogers-arena-procedural-near-light-sheet.jpg`. Viewed overview, east facade, opposite facade, roof, entrance, drum and sign detail against dossier references. It exposed creases and zero-length apex normals in the roof; replaced independent apex quads with an indexed shared-vertex membrane, which also reduced export bytes. Final comparison inspected: `tmp/top-cities/shots/rogers-arena/final/rogers-arena-review-sheet.jpg` (2026 southeast and 2011 north photo beside GLB near/far, light/dark, overview/back/roof/detail, north-up plan and ground entrance). The final automated `qa-sheet.mjs` export sheet at `tmp/top-cities/shots/rogers-arena/qa/rogers-arena.jpg` was also inspected (no-ref mode avoids downloading another photo; photo comparison is in the review sheet). The individual full-view sheets are `rogers-arena-glb-near-light-sheet.jpg`, `rogers-arena-glb-far-light-sheet.jpg`, `rogers-arena-glb-near-dark-sheet.jpg` and `rogers-arena-glb-far-dark-sheet.jpg` in that same directory. The north drum was shifted 4 m south after vertex containment identified a small projection outside the mapped northern notch; final vertices fit the ownership envelope within 0.8 m (pilaster/door offsets). The reviewed GLBs retain the dome, glazed fronts, blue tower, signage and cylindrical drum in both LODs; dusk entrance panes and sign remain lit. Likeness is intentionally approximate; the references do not establish surveyed drum dimensions.

Validation:

- `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/rogers-arena/rogers-arena.test.js`: **611 passed, 0 failed**, including six specific tests for this model.
- `node scripts/asset-catalog.mjs`: **valid, 336 records / 620 GLB variants** at check time.
- `pnpm assets:preview`: generated ignored local catalog successfully.
- `node scripts/landmark-depth-layers.mjs --ids rogers-arena` followed by `--check`: **current; zero cycle edges dropped**. Shared generated depth table is the only shared file regeneration performed.
- `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids rogers-arena --out tmp/top-cities/rogers-arena/qa-metrics.json`: **no issues**, 0 layered/coplanar overlap area, 0.2% back-face sweep hits, no unsupported member-end candidates, no far window-rhythm flags, no below-grade/removable bridgeLift bytes.
- The bounds differ by less than 0.05 m between near/far; exported normals are unit length and source/GLB envelopes agree.

No shared-check failures remained. Geometry is delivered for the lead's independent review; exported contact sheets do not certify app placement.

Cityscape **not tested yet**; Full 3D world **not tested yet**. Lead separately checks actual provider replacement (especially west tower), shared runtime shading, terrain datum/pad/entrance contacts, failure restoration and lifecycle; catalog readiness describes the export. Independent review is pending.
