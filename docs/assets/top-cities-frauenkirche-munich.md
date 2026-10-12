# Frauenkirche, Munich

Original procedural exterior of Dom zu Unserer Lieben Frau, Frauenplatz, Munich. Restored permanent form without temporary scaffolding; no photographs, textures, scans or third-party mesh shipped. Editable source lives in `src/peregrine/landmarks/top-cities/frauenkirche-munich/`; export with `pnpm build:top-cities-landmarks frauenkirche-munich --no-check`.

## Sources and dimensions

[Wikipedia architecture section](https://en.wikipedia.org/wiki/Frauenkirche,_Munich) and the supplied dossier identify the late Gothic brick church and Renaissance Welsche Hauben. [OSM way 225698612](https://www.openstreetmap.org/way/225698612) supplies the full envelope; all twelve mapped subordinate parts are explicitly registered, including both stacked tower parts, sacristy and portal regions. No neighbouring block is replaced.

| Feature | Model | Basis |
| --- | --- | --- |
| North / south tip | 98.57 / 98.45 m | Published dimensions, independently tagged on OSM 222512591/592 |
| Overall church | About 109 × 40 m; annex expands northern envelope | Published main plan and OSM outline |
| Nave eaves / ridge | 30 / 60 m | OSM 222512593 height 60, roof height 30; mapped estimates, not survey |
| Square tower base | 16.1 × 15.1 m, to 60 m | Mapped plan, photograph-estimated slight taper |
| Octagonal belfry / dome | Belfry to 90.7 m; green dome to 98.2 m | OSM dome height about 8 m; profile and tiers estimated from photos |
| Sacristy eaves / ridge | 15 / 22 m | OSM 108429818, explicitly guessed tags |
| Origin | [11.57358, 48.1385668] | Centre near nave axis |
| Axis / west frontage | 88.846° / 268.846° | Control points [11.5730723,48.1387451] and [11.5740596,48.1387585] on the north nave wall |

## Frame and modelling

Real metres, east/up/south. Local y=0 is Frauenplatz pavement. A single 1.154° Y rotation is baked into source meshes and GLBs. No DEM, absolute altitude or Mercator stretch is baked in. The cathedral has a rigid foundation; Cityscape and Full 3D world are **not tested yet; integration is checked separately** by the lead. Terrain sampling, replacement/lifecycle and Tesla hardware remain untested.

The twin battered brick towers change to octagonal belfries above 60 m, with clock rings, tall pointed openings, a small upper arcade and ribbed green copper domes. The large steep roof ends in a faceted eastern hip. There are no exterior flying buttresses; this hall church’s structural buttresses are internal. The long wall windows, west portal and central Gothic light have actual holes in the masonry with inset glazing. Far keeps every principal window bay, clock, dome and roof shape; it simplifies tracery and copper ribs. Seven muted materials are merged in both variants: brick, trim, roof, copper, glass, recess and clock, with light/dark palettes. Dark mode dims the exterior; no invented broad nighttime window illumination.

Approximations: clock hands and dial positions, tower taper and tier heights, dormer spacing, stone bands, pointed-window tracery, sacristy roof construction and dome ribs. Interior vaults, individual bricks, fine carved door sculpture and transient restoration scaffolding are omitted. No hanging beams, bridges or site-terrain platforms are authored.

## Visual evidence

Judged dossier `tmp/top-cities/frauenkirche-munich/refs-sheet.jpg`: aerial photo by Diliff ([CC BY 2.5](https://commons.wikimedia.org/wiki/File:Frauenkirche_Munich_-_View_from_Peterskirche_Tower2.jpg)), front tower photo by Bmdavll ([CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Munich_Frauenkirche.jpg)), tower detail by Silverije ([CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Katedrala,_M%C3%BCnchen_-_tornjevi.jpg)). Images stay in ignored scratch.

Exported contact sheets under `tmp/top-cities/shots/frauenkirche-munich/` cover overview, west facade, roof, opposite east/north side, street entrance and belfry detail, for near/far and light/dark. First rendered sheet revealed inward wall winding: corrected and re-exported before final checks. Stone courses now replace wall sections rather than overlap them. Depth ordering has zero cycle edges. Top view checks the baked rotation against red provider rings. Local inspection is evidence for the exports only, not app mode verification.

## Costs and checks

| Detail | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 14,776 | 7 | 672,668 | 656.9 |
| Far | 4,036 | 7 | 154,468 | 150.8 |

Final selected-model QA is clean: no coplanar overlap, layered-face or unsupported-member findings; near back-face sweep is below 2%; no removable attributes; matching LOD silhouette. A second correction fixed underside-facing west/sacristy roof triangles and replaced the sacristy fan with triangulation of its concave mapped plan. The depth regeneration reports zero dropped edges and `--check` passes.

`node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/frauenkirche-munich/frauenkirche-munich.test.js`: **419 tests passed, 0 failed**, including seven specific tests for sourced tower tips, copper caps, roof ridge, visible windows/portal/belfry, geographic envelope, grade and preserved far rhythm. `node scripts/asset-catalog.mjs`: **266 entries / 514 variants valid** at final check. Metrics: `tmp/top-cities/frauenkirche-munich/qa-metrics.json`; full focused test output: `tmp/top-cities/frauenkirche-munich/tests.txt`.

Final images actually inspected: `tmp/top-cities/shots/frauenkirche-munich/frauenkirche-munich-final-reference-comparison.jpg` combines aerial/front references with all six views of each exported near-light, far-light, near-dark and far-dark variant. Constituent sheets are `frauenkirche-munich-glb-{near,far}-{light,dark}-sheet.jpg` in that directory. `frauenkirche-munich-procedural-near-light-top.png` was inspected against red mapped rings and confirms roof/annex orientation. Both tower domes and the tall window rhythm remain recognisable in far; dark views retain dim copper and brick rather than artificial interior lighting. Fine stone carving and actual brick texture remain intentionally simplified.

No shared source edits were needed; only the permitted generated `src/peregrine/landmarks/depth-layers.js` was regenerated. No app server, full suite, install, Git write or online deploy was run. The lead still owns both-mode app screenshots, terrain/provider replacement review and independent release approval.
