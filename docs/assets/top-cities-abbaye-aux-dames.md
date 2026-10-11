# Abbaye aux Dames — La Trinité, Caen

Original procedural model of the present church at Place Reine Mathilde and the adjoining convent now occupied by the Normandy regional council. The target is the restored Romanesque church with two **square west towers crowned by pierced balustrades**, not the historical spires in the 1702 engraving. The engraving was used only as a layout reference.

The [official regional visitor page](https://www.normandie.fr/visites-de-labbaye-aux-dames) documents foundation around 1059–1060 by William and Matilda. The [official regional leaflet](https://www.normandie.fr/sites/default/files/2020-09/Depliant_abbaye-aux-dames_2018.pdf) identifies the eleventh/twelfth-century church and eighteenth-century convent, an unfinished fourth cloister wing, and the crypt compensating the terrain drop under the apse. The current external treatment follows the dossier photos, particularly refs 2–6; no dimensions or historic roof heights were copied from the engraving.

## Dimensions and geographic frame

| Element | Model | Evidence |
| --- | --- | --- |
| Church length | approximately 80.4 m | OSM exterior geometry; nominal 80 m in [description](https://fr.wikipedia.org/wiki/Abbaye_aux_Dames_de_Caen) |
| Nave exterior width | approximately 18.5 m | OSM geometry; nominal 19 m in description |
| Transept | approximately 33.2 m including buttress feet | mapped outer envelope; nominal arms span 32 m |
| West tower crowns | 34 m | photo estimate; no surveyed height available |
| Crossing finial | 36 m | photo estimate |
| Nave eaves / ridge | 18.2 / 23.65 m | photo estimate |
| Convent eaves / pavilion ridges | 14 / 23 m | photo estimate from modern exterior photo |
| Church axis / front | 135.3° / 315.3° | two mapped controls, west-tower midpoint to crossing centre |
| Convent axes | 12.3° off nave axes | mapped long wing edges |

Origin is `[-0.35242, 49.18682]`, the supplied abbey-complex anchor. Geometry uses real metres east/up/south and rigid grade `y=0`. Orientation is baked exactly once into geometry and GLBs. No DEM, absolute elevation or Mercator stretch is baked in. All eleven church/convent/annex outlines and building parts are named in `footprint.js`; the fresh `osm-verified.json` was obtained through the shared Overpass helper and retained only in ignored scratch. No neighbouring buildings are replaced.

The bounded `terrainPad` requests a median datum over the owned church, convent and annex footprints, with four reference locations and a 9 m feather. The official evidence of terrain relief makes a lowest-sample disc inappropriate. The pad is an integration handoff, not a verified DEM fit; the real apse grade and transitions require app inspection.

## Materials and authoring

Eight merged material draws: weathered tan-grey church limestone `stone`, lighter carved `trim`, pale eighteenth-century convent limestone `weather`, grey-blue slate `roof`, dark inset `recess`, subdued `glass`, burgundy `door`, and muted `iron` for blind niches, selective ashlar and small metalwork. The convent adapter reuses `weather` for its wall solids, maintaining eight draws without adding a ninth stone material. Night uses dimmer matching colours without invented emission. No photographic texture, scan or third-party mesh is present. The model is original code using the repository asset builder, planar relief, mapped masonry solids and closed near roofs.

The west front keeps the triple portals, central twin rows of triple round arches, small gable opening, five slender belfry slots per tower face, crown corbels, pierced balustrades and engaged rear stair turrets. Tower bays are real holes over dark solid cores; the crowns are open through. The nave has low lean-to aisles, repetitive clerestory arches and buttresses. The crossing has four triple-arched belfry faces and a square slate cap. The semicircular chevet is distinct from the rectangular transept.

The convent preserves three wings around a large empty court, a 3 m deep gallery behind true arcade openings, two window rows, repeated dormers, hipped end pavilions and a clock-front projection. The mapped northeast extension, Sainte-Anne wing, open Hôtel-Dieu portico and two entrance pavilions remain part of the complete campus envelope. Polygon intersections trim roofs and masonry to owned outlines. Far retains massing, crown voids, belfry recesses, courtyard and arcades while omitting muntins, minor surrounds and half the small dormers. Flat window/arch relief is offset from supporting masonry. The carved portal surrounds extend no more than 1.2 m beyond the mapped wall line; other eaves/trim are substantially closer.

The supplied reference attribution is recorded individually in the catalog. Two supplementary photos were fetched, both kept only under `tmp/top-cities/abbaye-aux-dames/refs/`: [modern convent exterior](https://commons.wikimedia.org/wiki/File:Normandie_Calvados_Caen1_tango7174.jpg), Tango7174, CC BY-SA 4.0; [portico gallery](https://commons.wikimedia.org/wiki/File:Caen_abbayeauxdames_portique_galerie.jpg), Karldupart, CC BY-SA 3.0. Their description-page licences were checked. The official leaflet was read for textual layout/terrain evidence; it is not a mesh or texture source.

## Verification and limitations

The reference sheet `tmp/top-cities/abbaye-aux-dames/refs-sheet.jpg` and supplementary photos 7/8 were opened and judged. Source sheets `tmp/top-cities/shots/abbaye-aux-dames/iteration-1/abbaye-aux-dames-procedural-near-light-sheet.jpg` and `iteration-2/abbaye-aux-dames-procedural-near-light-sheet.jpg` cover facade, rear apse, top, street, portal, tower and cloister/detail. The first look exposed a missing tower upper masonry band and excessive repeated surround cost; the second exposed roof slivers over the front and side doors obscured by cadastre wall projections. Those were corrected before final export, along with unsupported round chapel roof discs. Small frames were changed to relief surfaces and vertices welded while retaining their normals, reducing cost without losing the recognisable features.

The final exported comparison sheet was opened and judged: `tmp/top-cities/shots/abbaye-aux-dames/final/abbaye-aux-dames-reference-comparison.jpg`. It puts dossier front/tower/portal photos and the modern convent reference beside exported near/far facade, rear apse, full roof plan, tower detail and courtyard views, with near-dark facade/portal/street and far-dark facade/courtyard beneath. The three doors, open crowns, separate crossing cap and empty courtyard survive in far. Dark masonry/glass remains readable; ornate stonework and sculpture are intentionally abstracted. The corrected plan view shows the entire campus and red footprint outlines. This was the third and final visual iteration. Tests cast actual geometry for church dimensions, all three burgundy doors, inset tower backing and stone piers, pierced crowns, empty courtyard, deep galleries, rigid grade, mapped containment and LOD silhouette/cost.

**Approximations:** all vertical heights and architectural spacing are photographic estimates. Tympanum sculpture is abstracted to simple relief rather than traced. Ashlar is selective banding, not every block; fine mouldings, roof tiles, interior vaults, crypt and furnishings are omitted. The upper convent construction uses mapped solids while ground galleries use simplified orthogonal walls. Small plan skews and original roof divisions are approximated within the owned envelope. Device performance has not been measured.

| Mode | Status |
| --- | --- |
| Cityscape | not tested yet, integration is checked separately |
| Full 3D world | not tested yet, integration is checked separately |

No shared source, runtime renderer, roads, terrain gates, deployment or git history were changed. Rebuild with `pnpm build:top-cities-landmarks abbaye-aux-dames --no-check`.


## Independent review corrections

All four findings in `tmp/top-cities/review/abbaye-aux-dames/REVIEW.md` were addressed in one new visual iteration. That file contains no Prepare command and no `REVIEW-2.md` exists, so the standard exported-GLB preparation was run instead:

```sh
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids abbaye-aux-dames --out tmp/top-cities/shots/abbaye-aux-dames/review-fix-1
```

The resulting `review-fix-1/abbaye-aux-dames.jpg` was opened. Its cached engraving remains layout-only evidence; present tower architecture was compared against the dossier photographs. The additional opened `tmp/top-cities/shots/abbaye-aux-dames/review-fix-1/review-fix-reference-comparison.jpg` puts current facade/tower/portal photos and the modern convent photo beside exported front, back, above, street and stair-turret detail views, near/far, light/dark. The twin open crowns remain unchanged, the stair turrets now clearly project, and the corbels and pilasters read in far. No second look-fix iteration was needed.

| Review defect: before | Corrected observable behavior |
| --- | --- |
| Stair turret buried in a square tower; thin corner trim; incomplete intermediate arcade | 1.3 m radius exposed round rear stair turrets with slit openings, 0.65 m corner pilasters with wider feet, and a five-bay short blind arcade immediately below each belfry |
| Flat-looking nave/facade and hidden transept windows | Projecting corbels support a stronger nave cornice in both LODs; facade corbels and stepped gable plinth added; transept windows moved onto the actual mapped exterior, clerestory rhythm retained |
| Smooth apse drum; two windows hidden behind its assumed radius | Four broad pilaster strips and polygon-following cornice; upper/lower radial windows placed on actual mapped walls instead of an assumed circle |
| Church and convent share the same beige | Weathered tan-grey church stone and paler convent limestone in both themes, reusing an existing material to keep eight draws |

The deterministic scan initially found coincident turret cornice/upper-band and footing faces. The cornice and trim bases were offset by a few centimetres while keeping their attachment to supporting masonry. Final QA has **no flagged artifacts**, no removable attributes, rigid grade zero and 0% back-face hits across 228 successful rays. Exact metrics are in `tmp/top-cities/abbaye-aux-dames/review-fix-metrics.json`.

## Final measured exports

| LOD | Before triangles / draws / KiB | After triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: | ---: |
| near | 42,991 / 8 / 1819 | 44,475 | 8 | 1,923,364 | 1878 |
| far | 9,844 / 8 / 398 | 10,958 | 8 | 466,684 | 456 |

Both fit the building budgets; far retains 33,316 bytes of headroom under 500,000 bytes, costs less than one quarter of near triangles, and has identical bounds on every axis. The six landmark-specific tests pass in 1.5 seconds, including new actual-geometry raycasts for the curved exposed turret, short blind arcade, visible nave/transept/apse windows, corbel, apse pilaster, and pale convent material. All three Abbaye aux Dames conformance checks pass. The combined command currently has one unrelated failure: `cathedrale-de-bayeux` far GLB exceeds its byte budget; no other landmark was edited. `node scripts/asset-catalog.mjs` passes (222 entries / 426 variants).

The shared catalog preview was not rebuilt: assigned ownership permits only this landmark’s files and scratch, while `assets:preview` writes the shared viewer output; the native GLB screenshot tools provided the required local visual evidence. No app or online staging service was started. Photographic vertical estimates, abstracted sculpture, terrain integration and device performance remain the limitations recorded above; no shared file change is required.
