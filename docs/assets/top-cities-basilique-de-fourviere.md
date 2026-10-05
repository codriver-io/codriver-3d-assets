# Basilique Notre-Dame de Fourvière — Lyon

Original procedural model of the permanent completed basilica at 8 place de Fourvière, including its immediately adjoining Virgin/Saint-Thomas chapel. Built from 1872 and inaugurated in 1896, designed by Pierre Bossan and completed by Louis Sainte-Marie Perrin. The 2026 temporary tower-restoration scaffolding is deliberately omitted; this is a permanent-architecture representation rather than a construction-state survey. At 800 m the four octagonal towers and long blue-green nave roof identify Lyon; at 100 m the open triple porch, nine-bay upper gallery, pediment and carved tower crowns distinguish the building.

## Sources and frame

- [Lyon Fête des Lumières / Office de tourisme](https://www.fetedeslumieres.lyon.fr/fr/lieu/basilique-de-fourviere): published dimensions, dates and architects.
- [Fondation Fourvière restoration announcement](https://www.fourviere.org/fr/basilique-n-d-de-fourviere-les-travaux-de-restauration-des-quatre-tours-debutent-fin-mars-2026/): temporary works begin March 2026.
- [Main outline OSM 29179429](https://www.openstreetmap.org/way/29179429), [all-parts outline 247450124](https://www.openstreetmap.org/way/247450124), [Saint-Thomas chapel 60752859](https://www.openstreetmap.org/way/60752859). Dossier and one explicit ID query through the shared Overpass helper, 2026-10-04. All 24 roof/tower/chapel parts used by the model are registered in `footprint.js`; unrelated reception buildings, museums, clergy houses and streets are excluded. Derived geographic data © OpenStreetMap contributors, ODbL 1.0.
- [West facade, Tim Adams, 2022, CC BY 3.0](https://commons.wikimedia.org/wiki/File:Exterior_Basilica_of_Notre_Dame_de_Fourvi%C3%A8re_Lyon_France.jpg).
- [West/south overview and Virgin chapel, Sergey Ashmarin, 2012, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Church_of_Notre_Dame_de_Fourviere_-_Lyon,_France_-_panoramio.jpg).
- Supplied reference sheet: Pierre Bossan/Joanny Séon early design drawing, Commons CC BY-SA 4.0, and Jean-Christophe BENOIST interior photographs, CC BY 4.0. Viewed to establish identity and interior window character; the preliminary drawing is not treated as the completed building. The two extra exterior photographs establish the actual towers and porch. Titles/licences are retained under ignored `tmp/top-cities/basilique-de-fourviere/refs/SOURCES.txt` and catalog provenance.

The structural anchor is `[4.82242, 45.76239]`; units are real metres, +X east, +Y up, +Z south. Local y=0 is a rigid, flat foundation, with no hill altitude or Mercator stretch baked into the mesh. Geometry is authored with `u` east down the nave and `v` south, and rotated clockwise 7° once into the geographic frame. The west porch edge between `[4.8220733,45.7624192]` and `[4.8220437,45.7622514]` gives a roughly 7° facade baseline and its 97° perpendicular nave axis; this fixes the baked rotation. Two mapped nave-roof control points `[4.8221294,45.7624144]` and `[4.8228018,45.7623736]` establish the approximately 95–97° axis; exact vertices in the retained OSM extract are authoritative. Tower centres provide a second alignment check. The west frontage looks approximately 277°.

## Dimensions

| Feature | Model | Basis |
| --- | --- | --- |
| Main basilica nominal length / width | About 86 / 35 m across footing, towers and entrance steps | Tourism published 86 × 35 m; actual geometry follows mapped parts, rather than stretching every part to nominal dimensions |
| Four tower cross tops | 48 m | Tourism published height; checked by downward rays at all four tower axes |
| Tower shafts / open lanterns / crown | 32.7 / 33–40.2 / 40.2–43.6 m | Estimated from the two exterior photographs; mapped tower diameters about 8.5–9 m |
| Nave eaves / ridge | 29.8 / 35.1 m | OSM nave roof part `height=30`, `roof:height=5`, photograph estimates |
| Porch landing / arch spring / crest | 4.2 / 15.2 / about 18.4 m | Photo estimate; main front arches retain open space |
| Gallery / pediment | 23.3–28.5 / apex 35.15 m | Photo estimate; nine small gallery bays retained |
| East chevet drum / crown / hidden roof | 33.5 / 35.15 / 34.15 m | Revised from the city-facing review photograph; intermediate elevations remain estimates |
| Old chapel body / Virgin statue top | 12.4 / about 38 m | Photo estimate, not a surveyed measurement |
| Decorative detail / window dimensions | Parameterized, approximately 0.1–3 m | Photo estimates, simplified rather than traced |

## Geometry and materials

`geometry.js`, `basilique-de-fourviere-chevet.js` and the original `basilique-de-fourviere-kit.js` create material-batched closed solids using `assetBuilder`. The low basilica footing follows the mapped multi-part envelope. The six-bay nave has paired arched upper lights, lower windows, repeated buttresses, a corbel arcade and roof seams. The west front has supported round columns, three deep open arches, nine gallery arches, a triangular pediment, cornices, dentils and abstract relief figures. The chevet has a tall faceted stone drum, seven genuinely recessed upper lights, projecting engaged columns, a heavy cornice and stone parapet concealing its shallow copper cap, plus an abstract green roof figure. Towers have tapered eight-sided shafts, three oculus levels, a true open lantern, lattice rails, cornice rings, sixteen crown merlons, narrow dark pyramids and crosses. The adjoining chapel has its square base, octagonal upper stage, narrow pointed copper roof within eight open stone ribs and pointed arches, and a supported gold-coloured Virgin figure.

Seven shared light/dark material names: `stone`, `trim`, `roof`, `glass`, `metal`, `gold`, `glow`. Day stone is pale warm limestone; trim is slightly lighter; roof is muted grey-blue/green; glazing is dark. Night stone and roof darken, while `glow` nave windows become warm and are interpreted as unshaded by the application. Exact floodlighting is not reproduced. No external mesh, photo, bitmap, font or texture is shipped.

Far keeps all four 48 m towers, porch/gallery voids, nave, chevet, old chapel and gold statue. It drops roof seams, small corbels, secondary columns, most relief sculpture, intermediate oculi and glazing mullions. Far omits minor painted-window surrounds and uses simple tapered column shafts; actual chevet recesses, gallery/tower arches and the chapel rib cage remain three-dimensional. Compatible vertices are welded after material batching without smoothing hard face normals. Ground-facing footing triangles are removed.

Approximations: fine relief is represented by restrained geometric figures; individual saints, crypt entrance sculpture, interiors, railings and restoration scaffolds are omitted. The old chapel body is simplified within its mapped overall envelope, including minor north-wall irregularities. Main steps extend less than 3 m beyond OSM's building-only envelope; footprint masks deliberately do not erase the surrounding parvis. The later independent review supplied a city-facing east photograph, used to correct chevet elevations and articulation; sculptural identities, small relief and roof details remain approximate.

## Export costs and verification

Build: `pnpm build:top-cities-landmarks basilique-de-fourviere --no-check`.

| Export | Triangles | Draws | Size |
| --- | ---: | ---: | ---: |
| Near | 45,145 | 7 | 2,031 KiB |
| Far | 10,045 | 7 | 455 KiB |

Measured from the exported default scenes, not performance estimates. Both are below the hard 60k/14/2.5MB and 12k/8/500kB budgets. No removable `bridgeLift` bytes remain. Deterministic QA reports zero different-material coplanar overlaps and 0.3% back-face sweep hits (below 2%). Highest point 48 m, minimum y approximately 0; near/far bounds agree.

Viewed source contact sheets:

- `tmp/top-cities/basilique-de-fourviere/refs-sheet.jpg` and `exterior-refs.jpg`: supplied dossier and two real exterior views.
- `tmp/top-cities/shots/basilique-de-fourviere/iteration1/basilique-de-fourviere-procedural-near-light-sheet.jpg`: identified mistakenly filled arched trim shapes and missing dark glazing.
- `tmp/top-cities/shots/basilique-de-fourviere/iteration2/basilique-de-fourviere-procedural-near-light-sheet.jpg`: confirmed corrected open tower lanterns and window rhythm; the gallery needed a dark recessed backing. Replaced invalid intersecting-hole arc shapes with single-contour U-shaped closed solids, then added recessed gallery shadow and optimized ornament/vertex reuse.

Final exported sheet actually opened and visually judged:

`tmp/top-cities/shots/basilique-de-fourviere/final/basilique-de-fourviere-export-reference-contact-sheet.jpg`

Its four rows are near/light, near/dark, far/light and far/dark; columns are facade, overview, back, roof, street and close tower detail, with the two exterior reference photographs below. Separate variant sheets and full-resolution images are alongside it. The final review confirmed that exported models retain four slender octagonal towers, open lanterns and porch/gallery depth, correct west-to-east orientation, roof shape and southern gold statue, with consistent near/far bounds. Red mapped outlines remain visible and footing alignment agrees; the entrance steps intentionally extend outside the building-only ring. No visible flipped shell or z-fighting was found. The east chevet and fine sculpture remain approximations; the far arches are visibly more polygonal at close inspector zoom. Independent coordinator visual review remains pending.

Focused tests check all four 48 m tower tips, open tower lanterns, crown continuity, deep triple porch openings and their supporting columns, upper gallery recession, 35 m main width, nominal 86 m longitudinal envelope, nave ridge, gilded Virgin statue, grade and geographic envelope. The required combined conformance invocation passed all Fourvière checks; first run had unrelated failures for old-orange-county-courthouse catalog readiness and palace-of-the-parliament far bytes, which are outside this worker's ownership. A final filtered invocation of those same two files passes all nine Fourvière tests in under one second, including the independent-review regressions.

## Placement and handoff

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. A bounded median `terrainPad` uses the owned building rings, three reference samples and 5 m feather; it avoids the default lowest-sample disc on Fourvière hill. The expected behavior is a rigid common foundation, with terrain arriving/refining separately. No DEM has been sampled or placement certified: hill edges, chapel entrances, pad feather, neighbouring streets, provider masks and terrain/mode/load lifecycle need application QA. No shared runtime file was modified, no bundle/deployment performed, and no hardware measurements were made. `node scripts/asset-catalog.mjs` and `pnpm assets:preview` both passed after documentation was complete.


## Independent-review revision

The reviewer rated the original model FIX, recognition 4/5, for a low/plain chevet and closed/bulbous Virgin chapel dome. The supplied `REVIEW.md` and identical `REVIEW-1.md` contain no Prepare command; `REVIEW-2.md` was absent. Recreated the review preparation with:

```sh
pnpm build:top-cities-landmarks basilique-de-fourviere --no-check
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids basilique-de-fourviere --out tmp/top-cities/basilique-de-fourviere/revision-metrics.json
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids basilique-de-fourviere --out tmp/top-cities/shots/basilique-de-fourviere/revision-final
```

Additional supplied review reference: [Fourviere Lyon, Elwood j blues, 2007, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Fourviere_Lyon.jpg), viewed from the review sheet and existing ignored QA cache; no new image is shipped.

| Defect | Before | After, both LODs |
| --- | --- | --- |
| Chevet too low/plain | 24.8 m wall, exposed broad blue cone to 29.9 m; short surface-painted openings | Drum 33.5 m, crown 35.15 m, shallow roof hidden below it; seven tall upper lights physically recessed 0.85 m in cut wall panels, engaged columns, projecting belts/cornice and small roof figure |
| Virgin chapel bulbous/closed | 3.75 m radius blue cap, no open stone crown at far detail | 2.45 m radius pointed blue core, open eight-rib stone cage and pointed arches in near and far; gilded statue remains at about 38 m |
| Far cost after added detail | First revision 11,773 triangles / 546 KiB, over the byte cap | Simplified far column shaft profiles and minor facade surrounds: 10,045 / 455 KiB, with all new defining features retained |

Two look-fix iterations were used. Opened `tmp/top-cities/shots/basilique-de-fourviere/revision-1/basilique-de-fourviere.jpg`, then the final exported combined sheet `tmp/top-cities/shots/basilique-de-fourviere/revision-final/basilique-de-fourviere-revised-contact-sheet.jpg`: the reviewer’s city-facing reference, near/far day views, top/close street views and near/far dark overview/back views. Confirmed the taller columned chevet, hidden roof from low city views, open pointed chapel ribs and unchanged four-tower/west-front silhouette. The revised final metrics have no budget, coplanar or back-face flags (0 overlaps, 0.3% back-face hits). Six landmark-specific tests plus three targeted conformance tests pass. Independent re-review remains for the coordinator; both app placement modes retain their previously documented untested status.
