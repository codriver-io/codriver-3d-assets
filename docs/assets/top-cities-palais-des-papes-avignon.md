# Palais des Papes — Avignon

Pale Gothic papal fortress with52 m Trouillas tower,crenellated Campane,twin entrance spires,deep pointed arcades and four mapped open courts/gardens.

## Sources and rights

- [UNESCO:52 m Tour de Trouillas and authentic palace composition](https://whc.unesco.org/fr/list/228)
- [Restoration architect:52 m Trouillas at north-east of Benoit garden](https://rla.archi/projets/palais-des-papes-avignon-84)
- [Operator:palace visitor identity and site](https://palais-des-papes.com/)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Palais_des_Papes)
- [OSM way 83769181: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/83769181)
- [OSM way 83750775: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/83750775)
- [OSM way 83767052: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/83767052)
- [OSM way 83783857: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/83783857)
- [OSM way 83758537: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/83758537)
- [Reference photograph: File:Avignon Palais des Papes 2013.jpg — François de Dijon — CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Avignon_Palais_des_Papes_2013.jpg)
- [Reference photograph: File:Exterior of Palais des Papes - west part 14.jpg — John Samuel — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Exterior_of_Palais_des_Papes_-_west_part_14.jpg)
- [Reference photograph: File:Exterior of Palais des Papes - west part 15.jpg — John Samuel — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Exterior_of_Palais_des_Papes_-_west_part_15.jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/palais-des-papes-avignon/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Tour de Trouillas | 52 | UNESCO and restoration architect |
| Campane crest | 46 | Photo estimate; contemporary work near45 m |
| Entrance needles | 44 | Photo estimate |
| Old/new wing roof | 28/24 | Photo estimates |
| Grande Chapelle ridge | 42 | Photo estimate;published52×16 m room is internal plan |
| Mapped open courts/gardens | 4 | Relation1253164 inner rings |

Origin `[4.8074426, 43.95049756]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

The outer envelope and four exact OSM inner rings establish the irregular medieval palace without swallowing the neighbouring cathedral. Old/northern and new/southern wings have separate heights;the south chapel has a stone gabled profile.52 m Trouillas at the north-east corner,46 m Campane at the western front,smaller Saint-Jean/Anges masses and two44 m entrance needles produce an uneven skyline. Crenellations stand on real closed roofs. Repeated pointed arch recesses have0.8 m actual reveals;stacked buttresses reach ground and the wall. Far retains every major tower,needle,court and roof step,with a coarser open battlement rhythm. All non-Trouillas vertical dimensions and derived tower subdivisions are estimates from exterior reference proportions. Fine carved statues,coats of arms and lettering are omitted. Initial interior fresco/chapel dossier images rejected;current western facades/entrance confirm this exterior version. No ground paving,cathedral,rocher terrain or river geometry.

Trouillas52 m primary UNESCO;Campane46 m,entrance spires44 m,old/new wings28/24 m and Grande Chapelle42 m ridge are exterior photo estimates. Four relation1253164 inner rings remain open. Towers are geographic subdivisions of the mapped palace envelope,not surveyed roof-part footprints. Original abstract stone detail,not copied sculpture. No Cathedral Notre-Dame-des-Doms,rocher terrain,plaza or gardens floor.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 15854 | 5 | 261428 |
| far | 10274 | 5 | 175792 |

Deterministic metrics: `tmp/france/palais-des-papes-avignon/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/palais-des-papes-avignon.jpg`. Mapped orientation/top check: `tmp/france/shots/palais-des-papes-avignon/palais-des-papes-avignon-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.


## Independent review follow-up — 2026-11-10

Replaced generic chapel-end lancets with three 4.8 m wide, 23 m high pointed blind bays recessed 1.1 m, each containing a narrower lancet at 1.5 m depth. Carved the 7 m wide, 15.5 m high pointed entrance portal 1.8 m deep between the paired slender towers, and moved chapel buttresses to the intervening piers. The taller chapel now begins beside the lower entrance wall; all four courts remain open. Near cost fell; far adds only 128 triangles for the required recesses.

Fresh exported comparison: `tmp/france/fixes/sheets/palais-des-papes-avignon.jpg`; deterministic metrics `tmp/france/fixes/palais-des-papes-avignon-metrics.json` have no unresolved flags. Focused identity/conformance tests and depth check passed; no dropped cycle edges. Builder compared the new sheet to its reference; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.

## 2026-11-10 application-finding diagnosis

Relation 1253164 still has outer 83769181 and four inner court/garden ways; the runtime already owns only the complete outer. The pale court surfaces remain with provider buildings hidden and disappear with ground/roads hidden, identifying the visible fill as ground/paving rather than an unowned building part. The cathedral and surrounding buildings remain outside ownership; no geometry or footprint change is justified. Both-mode final captures and the mode verdicts are recorded in `docs/batches/2026-11-10-app-verification-fixes.md`; diagnostic layer visibility overrides are not acceptance screenshots.
