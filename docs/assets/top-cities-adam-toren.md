# A’DAM Toren — Amsterdam

Original procedural model of the renovated 2016 tower on the north bank of the IJ, opposite Amsterdam Centraal. The 1971 Arthur Staal office tower is represented in its present lookout/hotel configuration. No photograph, texture, scan or third-party mesh is shipped.

The identity is the dark beveled facade lattice, white V-shaped base supports, circular glazed restaurant, square crown rotated 45° relative to the shaft, open roof lookout, Amsterdam-cross mast and two-seat cantilevered swing. Exterior references show a regular rectangular facade lattice, rather than a full-height diagonal diagrid; the source follows that evidence.

| Element | Model | Basis |
| --- | --- | --- |
| Shaft top / lower facade | 64 m / 10 m | OSM 593068474, height / min_height |
| Shaft width | 25 m | Mapped plan approximately 25.7 × 26 m, fitted slightly inside |
| Restaurant diameter | 21.8 m | Published approximately 22 m; OSM smaller, approximately 19.5 m |
| Crown | 32.4 m square, 70–75 m | OSM 750257537, approximately 32.8 m square |
| Central roof shields | 83 m maximum | OSM 750257536, simplified butterfly profile |
| Mast top | 99 m | OSM 750257535; main outline notes “with mast up to 100 m” |
| Facade elements | near 14 bays × 18 rows per face | Published approximately 1.75 × 3 m modules; simplified regular spacing |
| Podium / annex | 7 / 10 / 3 m | OSM 593068473 / 750296019 / 750296020 |
| Swing and rail | 6 m frame height, 7.15 m width; 1.25 m railing | Photo estimates; static pose |

The “80 m tower” describes the tower generally; the asset height includes the mast and uses the explicit 99 m mapped part. The official lookout promotes an approximately 100 m visitor height. These figures are not substituted for the mapped part elevations.

Sources: [official A’DAM LOOKOUT](https://www.adamlookout.com/), [Staalmakers construction account](https://www.staalmakers.nl/projecten/adam-toren-amsterdam/), and [OSM main building](https://www.openstreetmap.org/way/44824385). Exterior comparison: [Zairon’s 2017 exterior](https://commons.wikimedia.org/wiki/File:Amsterdam_A%27DAM_Tower_Au%C3%9Fen.jpg), [Sneeuwvlakte’s 2026 roof](https://commons.wikimedia.org/wiki/File:Top_A%27DAM_tower_(2026).jpg), [Muck’s entrance](https://commons.wikimedia.org/wiki/File:A%27DAM_Lookout-01-Entry.jpg), all CC BY-SA 4.0. Their photographs remain reference-only under ignored scratch output; the procedural model contains none of their image data.

The dossier facts endpoint failed, and most dossier photos were panoramas looking away from the tower. Exactly two additional exterior photos were fetched and their authors and licenses checked. The mapped dossier was reused without another Overpass query.

The origin `[4.9021043,52.3838518]` is the crown’s mapped centre, close to the shaft and mast. Coordinates are real metres, +X east, +Y up, +Z south; y=0 is rigid local grade. Shaft bearing 9° follows points `[4.9018889,52.3837573]` to `[4.901945,52.3839833]`. Crown bearing 54° follows `[4.9017683,52.3838844]` to `[4.9021554,52.3840574]`. Rotations are baked into vertices. Footprints include the main outline and all modeled upper/podium parts; OSM_WAYS lists 44824385, 593068473, 593068474, 750257534, 750257535, 750257536, 750257537, 750296019 and 750296020. Neighboring Groot Lab and EYE remain outside ownership. The modeled swing seats intentionally extend approximately 1.2 m beyond the roof ring.

Seven subdued materials are merged by name. Near facade glass is recessed 17 cm inside tessellated dark frames with bevel reveals, avoiding overlapping facade planes. Far retains separate coarser bays and rows on a single tessellated skin with no overlapping area. The open deck, negative space under the crown, mast and swing remain in both LODs. Roof mechanics, interiors, entrance typography and tiny fittings are approximations or omitted. No animated mechanism is implied.

Rebuild with `pnpm build:top-cities-landmarks adam-toren --no-check`; regenerate `node scripts/landmark-depth-layers.mjs --ids adam-toren`. Focused tests exercise height, width, circular restaurant, crown cantilever gap, roof plane, below-grade bounds, footprint envelope and all V/rail/swing terminal contacts against named submitted support geometries. A deliberately shortened hanger proves that the contact check fails for a free end.

Cityscape **not tested**; Full 3D world **not tested**. App masking, mode lifecycle, terrain datum/pad and renderer shading are checked separately by the lead. Inspector evidence establishes geometry and exports only.

## Export and inspection evidence

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 25,054 | 7 | 1,360,364 | 1,328.5 |
| far | 4,628 | 7 | 257,284 | 251.3 |

Both variants are below building budgets with identical overall bounds (height 99 m, min y effectively zero; x −22.63…33.00 m, z −22.63…39.76 m). Metrics at `tmp/top-cities/adam-toren/qa-metrics.json` report zero layered/coplanar area, zero near back-face hits, no issues, no removable bridgeLift bytes and no depth cycle edges. Named member-end tests cover the structural members omitted by the generic material-name heuristic.

I examined the procedural near/light sheet `tmp/landmarks/shots/adam-toren/adam-toren-procedural-near-light-sheet.jpg` against the exterior references. That review led to brighter subdued frame colour, proper inward bevel normals, continuous far facade skin, correction of the mast crosses, and solid sloping roof wind shields instead of a plain block.

I then examined `tmp/top-cities/shots/adam-toren/adam-toren-export-reference-contact.jpg`: the two external reference photos and entrance reference alongside all six exported views (`overview`, `facade`, `back`, `roof`, `entrance`, `detail`) in near/far and light/dark. Individual evidence follows `adam-toren-glb-{near,far}-{light,dark}-{view}.png`; four `…-sheet.jpg` files retain the same views. The tower/crown proportions, under-crown gap, facade grid, dark palette and seated swing persist after GLB export. Night glazing remains dim with a limited set of lit bays. The static swing pose and simplified rooftop equipment remain estimates, as do regularized facade bays and entrance details; there are no unresolved observed geometry defects.

The exported top view `tmp/top-cities/shots/adam-toren/adam-toren-glb-near-light-top.png` checks mapped crown/shaft/podium rotation against red rings. Full app placement and independent review remain outstanding.

Final focused verification: all seven A’DAM-specific tests and all three A’DAM registry conformance tests pass (targeted log: `tmp/top-cities/adam-toren/targeted-tests.log`). The complete requested two-file run had 477 passes and one unrelated failure: `high-museum-of-art` near geometry had 76,308 triangles against a 60,000 cap. Global `node scripts/asset-catalog.mjs` and `pnpm assets:preview` failed solely because another builder’s `/models/buildings/high-museum-of-art-far.glb` was not registered at check time; a second catalog attempt confirmed the same blocker. No other landmark files were changed. A’DAM’s standalone QA metrics and manifest checks pass. The shared generated depth table was regenerated again after another builder overwrote it; immediate `--ids adam-toren --check` passes, with `cycles.json` empty. The lead should regenerate all depth IDs at batch commit time.
