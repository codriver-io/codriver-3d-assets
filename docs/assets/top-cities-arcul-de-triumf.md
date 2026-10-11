# Arcul de Triumf, Bucharest

Original procedural, texture-free model of Petre Antonescu’s stone monument on Șoseaua Kiseleff, in its post-2013–2016 restoration state. The earlier temporary timber/stucco arches are not modeled. At 100 m the royal medallions, recessed arch, stone courses and deep cornice distinguish the monument; at 800 m the single passage and low stepped attic remain. Source: `src/peregrine/landmarks/top-cities/arcul-de-triumf/`; exports: `public/models/buildings/arcul-de-triumf-{near,far}.glb`.

## Sources and dimensions

Primary source: restoration architect Aurora Târșoagă, [Restaurarea Arcului de Triumf din București](https://www.revistamonumenteloristorice.ro/fisiere/RMI-2017_118-Tarsoaga.pdf), *Revista Monumentelor Istorice* 1/2017, pp.118–127. The author records the 1936 stone facade, the 2013–2016 restoration, the restored similistone royal portraits, the vaulted passage and terrace levels. [PSC](https://www.psc.ro/stiri-psc/arcul-de-triumf-din-bucuresti) gives 27 m overall and a 25 × 11.5 m foundation.

| Feature | Model | Basis |
| --- | --- | --- |
| Highest point | 27 m flagpole | Published overall height; division between flagpole and stone is estimated |
| Stone attic | 25.50 m | Restoration architect |
| Cornice terrace | 22.83 m | Restoration architect; OSM maps cornice parts at 24–24.5 m, a conflicting source retained in the dossier |
| Passage crown | 15.20 m | Restoration architect |
| Clear arch width | 9.50 m | Traditional published figure; treated as approximate relative to the mapped jambs |
| Arch spring | 10.45 m | Estimated semicircle to the sourced crown |
| Main body | 24.8 × 8.7 m | Fitted inside current OSM visible envelope; outline about 24.9 × 9.3 m |
| Cornice | 26.14 × 10.42 m | OSM overhanging roof envelope, approximately 26.25 × 10.5 m |
| Published foundation | 25 × 11.5 m; restoration article describes 25.5 × 12 m in plan | Neither number is drawn as a ground slab; use OSM for visible replacement envelope |
| Ornament, medallion and joint dimensions | Estimated | Reference photo proportions; original simplified geometry |

Frame: real metres, +X east/+Y up/+Z south. Origin `[26.07812725, 44.467190214285715]` is the mean of the main OSM outline’s distinct vertices. Two control points `[26.0780001,44.4671123]` → `[26.0780819,44.4671339]` give the facade axis 20.305° north of east; south facade bearing 159.695°. This rotation is baked into all geometry and GLBs. Local y=0 is ground at the two footings; no sea level, DEM or Mercator stretch is baked.

OSM dossier `tmp/top-cities/arcul-de-triumf/osm.json` was prepared via the shared Overpass helper on 2026-10-04. `OSM_WAYS` lists all 29 monument ways, including the little nested parts and upper arch span, without nearby restaurants/houses. `FOOTPRINTS` lists the main monument outline and its larger roof envelope; nested tiny polygons are covered by these rings instead of becoming sub-4 m² replacement polygons. No plaza or roundabout roads are owned.

## Reference photographs and rights

Compared against the supplied six-photo contact sheet `tmp/top-cities/arcul-de-triumf/refs-sheet.jpg`; no extra photographs fetched. Photo titles/authors/licenses are retained in the catalog provenance and dossier `refs/SOURCES.txt`. The checked [Diego Delso frontal photograph](https://en.wikipedia.org/wiki/File:Arco_de_Triunfo,_Bucarest,_Ruman%C3%ADa,_2016-05-30,_DD_24.jpg) is CC BY-SA 4.0 and its page warns of US-only architectural freedom of panorama; [Rsandu’s side crown detail](https://commons.wikimedia.org/wiki/File:Crown_lateral_Arch_of_Triumph_Bucharest.jpg) is CC BY-SA 4.0. Images remain ignored reference-only files; none is shipped or embedded. Historical engraving in the sheet is not the current design. Source mesh and symbolic relief shapes are original, not copied third-party meshes or traced sculpture.

## Modeling and materials

A closed concave extrusion preserves the ground-open semicircular barrel passage. Both facades retain three archivolt bands, paired pier edge pilasters, lower framed panels, upper relief frieze and portrait/floral medallions. The south facade carries stylized royal profile busts; north uses floral allegories. The cornice has a dark undercut, dentils, projecting stepped courses and low parapet with corbels, surrounding a shallow central attic. Near adds staggered masonry joints, crowns, garlands, winged reclining relief symbols and vault coffers; far retains the passage, stepped crown, paired medallions, relief panels and tricolour.

Named merged materials: `stone`, `trim`, `relief`, `joint`, `recess`, `lamp`, `iron`, `blue`, `yellow`, `red`. Light stone is warm pale limestone; dark uses dimmer warmer stone and floodlit vault coffer accents (`lamp`, unshaded). Far folds `joint` and `lamp` into `stone`, retaining eight draws. No textures, decoders or quantization extensions.

Approximations: royal portraits and victory figures are shallow symbolic forms, not reproductions of individual sculptures. Main and side inscription panels preserve framing and density but omit readable lettering. No interior museum, stairs, rooftop public access fixtures, chains, bollards, surrounding traffic circle or landscape. Estimated flag folds are static. The rigid 15 m pad covers the building’s envelope on an expected level site; runtime terrain samples and placement remain untested.

## Costs and verification

Measured exported default scene: near **27,124 triangles / 10 draws / 1,055 KiB (1,079,904 bytes)**; far **3,264 triangles / 8 draws / 137 KiB (140,044 bytes)**. Building caps are 60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB respectively. Far preserves near bounds within 0.1 m.

Initial procedural near/light contact sheet inspected: `tmp/top-cities/shots/arcul-de-triumf/arcul-de-triumf-procedural-near-light-sheet.jpg` (overview, facade, rear, roof, street, detail, passage). Compared directly with the supplied reference sheet: open passage, medallion locations, stepped crown and foundation alignment read correctly. Refined the upper reclining figures with draped relief folds and reduced curved primitive segmentation without changing the silhouette.

Final exported comparison sheet **read visually**: `tmp/top-cities/shots/arcul-de-triumf/arcul-de-triumf-export-reference-sheet.jpg`. It places Delso/Belu/Stanley reference photographs beside exported near/light facade, rear, roof, street, detail and passage; near/dark facade and passage; far/light facade, rear and roof; far/dark street; and the near/light plan over the red footprint rings. The near model retains visible masonry, medallions, cornice dentils and coffers; far removes these fine subdivisions while preserving the silhouette, opening and main facade motifs. No exterior holes or flipped faces seen. Portraits and allegorical relief still read as simplified symbols at close inspection; far omits small parapet corbels.

The geometric audit identified a coincident attic cap, buried bottom faces and footing/joint edges; separated the cap, removed the buried core faces and kept joint strokes clear of ornamental frames. Final `qa-metrics.json` reports **zero coplanar overlaps, 0% back-face hits, min y=0, no removable lift bytes**, identical near/far bounds. The flag uses separate front/back normals. Deterministic geometry corrections did not require another look-fix cycle.

Focused command `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/arcul-de-triumf/arcul-de-triumf.test.js`: **111/111 pass**, including all six dedicated tests; duration 2.81 s for the combined run. Tests measure height, mapped width, footings, raycast opening/crown, medallions, cornice projection, every vertex’s provider containment, LOD cost reduction and GLB round-trip normals/materials. Log: `tmp/top-cities/arcul-de-triumf/final-tests.txt`. `node scripts/asset-catalog.mjs`: **valid, 164 entries / 284 GLB variants** at this checkpoint. Shared catalog preview was not rebuilt because the dispatch confines writes to this landmark’s files and ignored scratch; the prescribed isolated screenshot renderer supplied inspection evidence instead.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Independent exported-GLB review and actual vehicle hardware performance remain for the coordinator. No shared files changed and no integration/rollout gate changed.
