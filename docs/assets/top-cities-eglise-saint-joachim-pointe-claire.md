# Église Saint-Joachim

Pointe-Claire’s grey Gothic Saint-Joachim church with a projecting central bell tower, paired open lancets under a long silver octagonal needle, steep nave roof and corner pinnacles.

## Identity and sources

Current exterior at Pointe-Claire, Canada; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Saint-Joachim_de_Pointe-Claire_Church)
- [Mapped replacement footprint 1256703650](https://www.openstreetmap.org/way/1256703650)
- [Mapped replacement footprint 1366986223](https://www.openstreetmap.org/way/1366986223)
- [Municipal heritage: current church, 45.6 × 18.9 m and materials](https://www.pointe-claire.ca/en/history-and-heritage/heritage/church-of-saint-joachim)
- [Restoration architect: current church identity and spire](https://evoqarchitecture.com/fr/projects/leglise-saint-joachim)
- [File:Église presbytère de Pointe-Claire.jpg · Ancien et moderne · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:%C3%89glise_presbyt%C3%A8re_de_Pointe-Claire.jpg)
- [File:Église Pointe-Claire.jpg · Ancien et moderne · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:%C3%89glise_Pointe-Claire.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -73.82513468181818,45.42683651363637. Replacement OSM ways: 1256703650,1366986223. The exact mapped polygon is retained in footprint.js.

| Dimension | Metres | Basis |
| --- | --- | --- |
| Nave depth / width | 45.6 / 18.9 | City of Pointe-Claire heritage page |
| Overall spire and cross | 55.8 | Photo estimate; no surveyed height located |
| Nave eave / ridge | 11.4 / 22.5 | Photo estimates |
| Stone tower / belfry / needle spring | 26 / 33 / 33.3 | Photo estimates |

Mapped orientation controls are LOCAL_RINGS[0][10] [-73.8250494,45.4269304] and LOCAL_RINGS[0][9] [-73.8249521,45.4267093]. The working-frame angle is atan2(Δsouth, Δeast); its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

The current 1882–1885 church, not its earlier predecessors, is identified by the municipal heritage page and both checked exterior photographs. The separate western rectory (way481688596), visible on the left of photo1, is excluded. Rear sacristy1366986223 is included. Nave dimensions are published; tower height and roof/crown proportions are photo estimates, not survey claims. Open paired lancets retain negative space in both LODs. Small statue and fine relief carving are omitted; no lettering or logos. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 1138 triangles / 6 draws / 29592 bytes; far: 985 triangles / 6 draws / 27536 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/eglise-saint-joachim-pointe-claire.jpg and tmp/east/eglise-saint-joachim-pointe-claire/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

Geographic audit: separated the narrower apse and transept roofs from the 18.9m nave, and fitted the projecting bell tower to its own mapped centre. The 45.6m published depth includes the apse; it exceeds the mapped rear line by about0.6m, retained as a bounded eave estimate. The low entrance porch is simplified into the pointed tower portal. Near/far component containment now has explicit regression tests at the provider’s0.8m slack plus5cm rounding tolerance.

## Independent review follow-up

Nit: darkened the pale metal roof to a muted blue-gray #778c92 so it separates from the light sheet background. Existing outward normals, mapped roof geometry, lancets and needle spire are unchanged.

Re-exported both LODs; identity and regression tests, focused registry conformance, deterministic QA and depth check passed. New evidence: tmp/fixes/sheets/eglise-saint-joachim-pointe-claire.jpg. Independent re-review pending. Cityscape: not tested. Full 3D world: not tested.
