# Bayeux Cathedral (Notre-Dame)

Asset `cathedrale-de-bayeux`: Cathédrale Notre-Dame-de-l’Assomption, rue du Bienvenu, Bayeux, Normandy. The present exterior combines Romanesque western towers, Gothic stone spires, a slate nave and chevet with flying buttresses, and the nineteenth-century copper-capped central lantern. The tapestry and interiors are outside this asset’s scope. Original procedural geometry, no scan, traced external mesh, photographs or textures in source/GLBs.

## Sources and dimensions

The [cathedral history](https://www.cathedraledebayeux.fr/la-cathedrale) and [Ministère de la Culture](https://www.culture.gouv.fr/regions/drac-normandie/Dossiers/ressources/la-cathedrale-de-bayeux) establish the Romanesque towers and nineteenth-century completion of the central tower. The [French dimension table](https://fr.wikipedia.org/wiki/Cath%C3%A9drale_Notre-Dame_de_Bayeux) distinguishes the west spires from the clock tower; the dossier’s English infobox gives only 76.6 without distinguishing them.

| Feature | Model | Basis |
| --- | --- | --- |
| West spire tips | 76.6 m | Published French dimension table; crosses included |
| Central clock tower tip | 74.5 m | Published French dimension table |
| Total length | Approximately 102 m mapped envelope | Published 102 m; [OSM way 132132649](https://www.openstreetmap.org/way/132132649) |
| Transept | 37 m walls, approximately 38 m with projecting trim | Published 37.6 m |
| West masonry stages / spire spring | 47 / 50 m | Photo estimates, not a survey |
| Nave / choir eaves, ridge | 25 / 34 m | Photo estimates, consistent with published 23.3 m interior vault |
| Low chapel eaves / ridge | 12.3 / 17.1 m | Photo estimates |
| Central octagon / lantern / copper | Gothic stages 37–62.8 m; ogee bulb 62.95–70.2 m | Photo estimates; finial reaches published 74.5 m |
| Annex roofs | 13.5 / 15 m ridges | Mapped plan, estimated heights |

OSM parts 448934051, 448934052, 448934053 and 1362297699 are registered as additional replacement rings, alongside the complete cathedral outline. Their tower heights of 60 m are schematic and disagree with the published dimension table. The existing dossier includes every vertex and tag; the shared Overpass helper was attempted for those five ways but failed with HTTP 504. No direct Overpass request was made. Adjacent library and civic buildings are excluded.

The six dossier photographs were judged in `tmp/top-cities/cathedrale-de-bayeux/refs-sheet.jpg`: Mbzt (CC BY-SA 3.0), GO69 (CC BY-SA 3.0), MagicRubberDuck (CC BY-SA 4.0), Zairon (CC BY-SA 4.0), PsamatheM (CC BY-SA 4.0) and M.Strīķis (CC BY-SA 3.0). Exact file titles and links are in the catalog provenance; the photos stay in ignored scratch. They inform appearance only, not a derived texture or copied mesh.

## Frame and placement

Real metres, +X east, +Y up, +Z south, origin `[-0.703426, 49.275479]` beside the crossing tower. Authoring u points toward the chevet, v toward the south aisle. `rotateY(-25.3°)` is baked once; the host must not rotate again. The long mapped nave edge from approximately `[-0.7039370,49.2757265]` to `[-0.7034349,49.2755716]` provides two control points; the opposite edge agrees. The west frontage bearing is 295.3°. y=0 is west-front pavement, with a rigid base and no DEM/absolute-height/stretch baked in. The complete mesh is within the outline’s 0.8 m provider tolerance.

`padM=66` covers the footprint. No hillside terrace is authored: the immediate cathedral pavement is assumed to vary less than 2 m, an unsurveyed assumption to check when terrain is integrated. Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. No app, road, navigation or lifecycle work is claimed by this export.

## Geometry and materials

The west screen has five pointed portals, concentric arch mouldings, a central trumeau and round opening, a reduced pointed traceried window, lower circular balustrade, upper Gothic gallery motifs and steep gable. West tower stages have paired round-headed windows, a three-opening upper stage, corner spirelets, gabled lucarnes, near crockets and flanking stair turrets. The central tower has an octagonal Gothic lower stage, taller lancet lantern, tiered cornices, clock, a narrower elongated copper ogee bulb with ribs, upper corner pinnacles and a slender finial. Repeated nave/choir windows, triangular chapel gables and pinnacles remain distinct; flying arches leave air above the aisle roofs. The lower polygonal chevet is centred west of the high apse, with two balustrade gallery bands, five separate radiating gable roofs, pinnacled buttress piers, and an east projecting chapel, fitted to the mapped envelope. Flying arches have closed extruded masonry with curved soffits. North attached halls are reduced to their mapped outlines.

Seven merged materials: limestone `stone`, lighter `trim`, shadow `recess`, slate `roof`, patinated `copper`, dark `glass` and clerestory `glow`. Light/dark use the same keys. Night clerestory tint is subdued warm glass; it is an interpretive palette rather than measured illumination. Windows and frames sit proud of supporting walls. Far keeps all three tower tips, spirelets, every flying-buttress station, chapel silhouettes, portal outlines and major tracery; near adds copper ribs, small eaves galleries, extra mouldings and niche relief. Carvings and intricate medieval tracery are simplified geometric motifs, not restored portraits. Stone joints, stained-glass imagery, roof tiles, sculpture portraits, tapestry and interiors are omitted.

## Verification and inspection

The initial procedural contact sheet exposed a reversed transept roof extending outside the outline; its extrusion direction was corrected. Lower chevet placement was then moved west and a projecting eastern chapel added to match OSM; aisle/annex widths were tightened so every vertex satisfies the provider tolerance. Arch profiles were reduced and smaller far mouldings flattened to keep both budgets with headroom. The procedural near/light sheet was viewed twice; final inspection uses exported GLBs in both LODs and themes, alongside the reference sheet.

Inspector views: `overview`, `facade`, `roof`, `east`, `south`, `street`, `portal`, `lantern`, at `/asset-preview.html?asset=cathedrale-de-bayeux&view=<key>`.

Final export metrics and QA evidence follow below. Independent review remains the coordinator’s release gate; author inspection does not establish app integration or hardware performance.


## Independent-review repairs and final measured export

Two repair look/fix passes addressed `tmp/top-cities/review/cathedrale-de-bayeux/REVIEW.md` and the lead’s corrected copper crown instruction; no `REVIEW-2.md` or Prepare command existed. The equivalent preparation was `qa-metrics.mjs --ids cathedrale-de-bayeux --out tmp/top-cities/cathedrale-de-bayeux/revision-metrics.json` plus `qa-sheet.mjs --ids cathedrale-de-bayeux --out tmp/top-cities/shots/cathedrale-de-bayeux/revision-2`.

| Review defect: before | Repair: after |
| --- | --- |
| Oversized 12.8 × 14.5 m west trefoil window | Reduced 9.4 × 10.2 m pointed opening, four lancets and smaller Gothic rosettes, 1.8 m-radius central portal rose, broader five portals with concentric mouldings, gallery bands and gabled canopies |
| Plain drum and squat wide copper bulb | Raised lower stage to 52 m, upper stage to 62.8 m, added eight upper corner pinnacles; narrower elongated ribbed ogee profile (maximum radius 3.5 m) and finial to 74.5 m |
| Bare segmented flying bars, cone ambulatory roof | Closed masonry arches with curved soffits, tall pinnacled chevet piers, two balustrade galleries and five separate radial chapel gable roofs |
| Wide west belfry openings and smooth stone spires | Narrow 0.85–0.95 m openings, gabled lucarnes (four near/two far per spire), corner spirelets and near crocket accents |

Ref 2 contains a real pointed west window above the entrance; it was retained at smaller scale rather than removed. The small round rose sits in the central portal tympanum. The copper crown follows the bulbous/ogee profile in ref 1, rather than the plain needle originally suggested by the reviewer. Stage proportions and motifs remain photo estimates; tower-tip heights and the mapped frame stay fixed.

The first repair look exposed a still-squat copper crown; the final pass narrowed it and increased the visible bulb height. Mechanical QA found lower gallery/apse cap overlaps and a gallery/roof plane conflict; separating those surfaces removed them. A 0.815 m envelope protrusion was corrected by moving the lower gallery inward, preserving the original 0.8 m tolerance. Reducing far arch tessellation restored byte headroom while preserving all bays and signature features.

Final near: **34953 triangles / 7 draws / 1408540 bytes (1376 KiB)**; far: **10779 triangles / 7 draws / 467064 bytes (456 KiB)**, measured from exported scenes. Before repair: near 32064 / 7 / 1318 KiB; far 9412 / 7 / 379 KiB. The far export has 32936 bytes of headroom under its 500000-byte cap. The largest bounds difference is 0.07 m; all three tower heights remain identical. `SPEC.ready=true`.

Export QA reports **ok**, zero coplanar pairs / zero square metres, zero back-face hits in the 500-ray sweep (212 hits), y-min zero to measurement precision, no removable attributes and no budget or silhouette flags. All 296 assertions pass in the exact requested combined test command, including four landmark tests and three shared Bayeux conformance assertions. The landmark raycasts now pin five portal recesses, the small rose, reduced upper window, copper shoulder, upper corner pinnacle and masonry flyer, alongside tower dimensions, air gaps and OSM containment. `node scripts/asset-catalog.mjs` passes (222 records / 426 GLB variants).

Judged final images, alongside all six dossier photos:

- `tmp/top-cities/shots/cathedrale-de-bayeux/revision-2/cathedrale-de-bayeux.jpg`: exported near/far overview, opposite side, street, above and close exterior QA sheet with ref 1.
- `tmp/top-cities/shots/cathedrale-de-bayeux/revision-2/reference-export-comparison.jpg`: all six reference photos above near/far × light/dark GLB sheets; west facade, roof/footprint, east chevet and central crown detail.
- The four `cathedrale-de-bayeux-glb-{near,far}-{light,dark}-sheet.jpg` files in that directory provide the original comparison panels; first-pass evidence is preserved in `revision-1/`.

Fine Gothic screen ornament, sculptural carving and copper finial details are simplified. The model’s facade motifs remain less intricate than the photographs, particularly in far LOD. Independent reviewer acceptance and in-app Cityscape/Full 3D world validation remain coordinator gates; no shared source was changed and no new geographic research was needed.
