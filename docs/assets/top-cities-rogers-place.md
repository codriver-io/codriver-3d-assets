# Rogers Place — Edmonton

Original procedural exterior of the 2016 Edmonton Oilers arena at 10220 104 Avenue NW. The model emphasizes the stainless-steel shell, its broad dark curved scoop, continuous upper clerestory and the Ford Hall lobe over 104 Avenue. It does not model the bowl interior. Source files live in `src/peregrine/landmarks/top-cities/rogers-place/`; exports in `public/models/buildings/rogers-place*`.

## Sources and rights

- [HOK project](https://www.hok.com/projects/view/rogers-place-and-the-ice-district/): unpainted stainless-steel skin, raised Ford Hall pedestrian bridge and arena identity.
- [Official arena architecture award](https://www.rogersplace.com/iaks-gold-award/): oil-drop roof line and drifting-snow curvilinear siding.
- [Official Ford Hall venue](https://www.rogersplace.com/book-the-arena/private-events/venue/ford-hall): glazed grand entrance.
- [OSM way 448626254](https://www.openstreetmap.org/way/448626254): arena plus complete Ford Hall footprint, height 43 m, roof height 7 m, silver/steel colours. Dossier `tmp/top-cities/rogers-place/osm.json`; © OpenStreetMap contributors, ODbL 1.0.
- [Opening and address](https://en.wikipedia.org/wiki/Rogers_Place): 2016 arena.

Comparison images stay in ignored `tmp/top-cities/rogers-place/refs/`: *Rogers Place Entrance*, Urban Versis 32, CC BY-SA 4.0; *Rogers Place, Edmonton, Alberta, 2026-09-27 01*, Chris Woodrich, CC BY-SA 4.0; *Ice District Construction - July 2017 - (36228354735)*, jasonwoodhead23, CC BY 2.0. Commons URLs and credits are in the catalog record. Licences for all three exterior references were checked on their Commons file pages; the elevated page is cached locally as `tmp/top-cities/rogers-place/aerial-license.html`. The dossier sheet also contains interior photos (IQRemix / Mack Male, CC BY-SA 2.0), which were viewed but not modeled. No external mesh, photograph or texture is shipped.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | --- | --- |
| Highest roof | 43 m | OSM height |
| Main bowl envelope | about 164 × 131 m | OSM outline |
| Complete envelope with Ford Hall | about 164 × 206 m | OSM outline |
| Ford Hall south end | about 139 m south of origin | OSM outline |
| Steel roof rim | about 37 m west to 17 m at the hall tip | Photo estimate |
| Upper clerestory | 3.5 m high all around | Photo estimate |
| Dark scoop | 3 m high, diving to about 10 m at the southwest entrance | Photo estimate |
| Main south glass wave | 10.5–20.5 m | Photo estimate |
| Underpass clearance | 8 m | Photo estimate; not road integration |

Origin `[-113.49778, 53.54694]` is the prepared arena anchor. Real metres: east/up/south, local street grade y=0, no absolute elevation or latitude stretch. All vertices follow the mapped ring directly, so rotation is baked in. The south frontage control points `[-113.4988224,53.5463712]` and `[-113.4976602,53.5463615]` give an east-running edge bearing about 90.8°, hence south-facing normal 180.8°. A second north edge between `[-113.4981072,53.5475356]` and `[-113.4973148,53.5475338]` confirms the near-cardinal bowl orientation. The long hall lobe follows the actual mapped skew rather than a nominal grid angle.

The replacement ring owns exactly way 448626254, including Ford Hall. It does not own the casino (448626255), community arena (448626256), LRT canopies, warehouse or neighbouring ICE District towers. No plaza is added. A bounded rigid footprint pad and terrain datum must be assessed by the integrator; this export does not bake terrain or claim Full 3D world readiness.

## Geometry and materials

The bowl is a offset compound roof loft with a 43 m crown. The complete outer ring is swept through continuous silver ribbons whose lower edge rises toward Ford Hall. Dark reveals are separate adjoining surfaces, not overlays. The upper clerestory runs continuously around the bowl, recessed approximately 1–1.5 m below the overhanging rim; near detail has diagonal frame members embedded in both steel lips. Glazing is restricted to 104 Avenue and Ford Hall; other sides have silver skin down to grade. Ground glazing is split into individual panes with visible frame divisions in both LODs. Ford Hall has a continuous downward-facing soffit and an opening under the raised span; its terminal glass walls reach local grade. The previous pixel lettering was removed. A 3 m dark inset swoosh follows the upper cladding and dives to about 10 m at the southwest entrance. Four adjoining, slightly darker silver seams and a pale silver highlight band keep the cladding readable without overlays. The outer roof bands use silver skin continuously across the rim, with an offset 43 m crown and drifting crest.

Seven merged materials in both LODs: silver, highlight, seam, roof, glass, frame and shadow. Dark palette dims the shell and glazing. No texture or decoder extension. Far keeps the exact mapped outline, crown, glass rows, reveals, and underpass; roof sampling and facade divisions are coarser.

Approximations: smooth steel skin omits individual rippled panels, fasteners and most roof plant; glass is opaque tinted geometry with no interior. Entrance stairs, mosaic, retail details and adjacent structures are omitted. This is architectural massing for driving views rather than a construction model. Clearance, glass heights and roof profiles are estimates. No runtime road fitting, app lifecycle test, Tesla performance test or DEM footing assessment was performed.

## Scoped review g11ar fixes — 2026-10-15

Scoped review g11ar: bright #cdd3d6 stainless skin with pale silver highlights and adjoining 0.3 m panel seams, a 3 m dark swoosh diving to about 10 m at the south-west entrance, and a continuous 3.5 m green clerestory recessed under the rim. The 43 m crown, mapped envelope, base glazing frontages and 8 m Ford Hall underpass are retained; cladding profiles and clearances remain photographic estimates.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 19,132 | 7 | 609,976 | 595.7 |
| far | 6,560 | 7 | 204,340 | 199.6 |

Exported near/far GLB sheets beside dossier photos: `tmp/next-200/fix/g11ar/rogers-place/comparison.jpg`. Both sheets were inspected for the scoped fixes. Focused regression tests pin shed ridge clearance/steep roof normals, the broad entrance scoop and continuous clerestory; all 17 tests across these two landmarks pass, including the existing named-support contact tests and shortened negative controls. Deterministic metrics report zero layered faces, zero material cycles and no issues; depth ordering was regenerated and checked.

Cityscape: **visually verified** in far/near/street app captures. Full 3D world: **visually verified** in far/near/street app captures with terrain enabled. Evidence: `tmp/next-200/fix/g11ar/rogers-place/app/{city,world}/` and `app-sheet.jpg`. Additional southwest `entrance.png` and southeast `ford-hall.png` views check the 104 Avenue glass frontage and entrance scoop; the camera sits closer to avoid neighbouring towers. Lifecycle transitions, per-footing DEM residuals, pad lattice coverage and real-device performance remain **not tested** by this scoped pass.

Shared checks: focused top-cities conformance **6/6 pass** for these two landmarks; the requested complete top-cities file **832/835 pass**, with concurrent Palais du Luxembourg (two checks) and Art Gallery of Alberta (source/GLB bounds) failures. Catalog/check/preview attempts are blocked by other landmarks being authored concurrently (logs in `tmp/next-200/fix/g11ar/{catalog,catalog-retry,assets-check,assets-preview}.log`); their files were left to their owners.
