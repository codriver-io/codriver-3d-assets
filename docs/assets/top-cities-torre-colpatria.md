# Torre Colpatria — Bogotá

Original procedural landmark `torre-colpatria`, Carrera 7 No. 24–79 at Calle 26, Centro Internacional, Bogotá. Source: `src/peregrine/landmarks/top-cities/torre-colpatria/`; catalog: `prototypes/assets3d/catalog.d/torre-colpatria.json`. Present architectural state: pale concrete vertical tube, narrow dark glazing and post-2012 programmable LED facade. It is recognisable at street and skyline distances by uninterrupted vertical fins, chamfered corners and a low flat observation/helipad crown, without a spire.

## Sources and rights

- [Building operator](https://www.davibank.com/torre-colpatria): address, Obregón Valenzuela & Cía., construction 1973–1978, August 1979 opening, 50 storeys, observation terrace and replacement of xenon lighting by Philips LEDs in December 2012. Its height text has a unit typo (196 m²); [Wikipedia](https://en.wikipedia.org/wiki/Torre_Colpatria) and the dossier corroborate 196 metres.
- Coordinator-provided shared-helper OSM extract, `tmp/top-cities/torre-colpatria/osm.json`: [outline 955123534](https://www.openstreetmap.org/way/955123534), facade 767352739, [core 1175248695](https://www.openstreetmap.org/way/1175248695), [helipad 1175248694](https://www.openstreetmap.org/way/1175248694), building relation 12856512. No additional Overpass request was needed.
- Commons photos, checked file pages and licences: [Colpatria desde la cra 7.JPG](https://commons.wikimedia.org/wiki/File:Colpatria_desde_la_cra_7.JPG), Felipe Restrepo Acosta, CC BY-SA 3.0; [BOGOTA CITY.jpg](https://commons.wikimedia.org/wiki/File:BOGOTA_CITY.jpg), KEVIN CASTAÑEDA VILLAMIL, CC BY-SA 4.0; [Vista aérea Bogotá - 15 - Torre Colpatria.jpg](https://commons.wikimedia.org/wiki/File:Vista_a%C3%A9rea_Bogot%C3%A1_-_15_-_Torre_Colpatria.jpg), ProtoplasmaKid, CC BY-SA 4.0; [Bandera en Torre Colpatria.jpg](https://commons.wikimedia.org/wiki/File:Bandera_en_Torre_Colpatria.jpg), EEIM, CC BY-SA 3.0; [Bogotá over the night. Torre Colpatria.jpg](https://commons.wikimedia.org/wiki/File:Bogot%C3%A1_over_the_night._Torre_Colpatria.jpg), CARLOS ANDRES MESA GIRALDO, CC BY 2.0.

Photos were studied for structure and colour and remain in ignored `tmp/top-cities/torre-colpatria/refs/`. No photograph, scan, traced mesh or texture is shipped. Geometry is original; mapped outlines retain OpenStreetMap contributor credit and ODbL 1.0. First Canadian Place was studied for efficient facade relief and footprint ownership, without copying its geometry.

## Frame and ownership

Real metres; +X east, +Y up, +Z south. `y=0` is local flat-map grade. Origin `[-74.0702479896, 4.6109939751]` is the area centroid of the mapped mirror core. The helipad north edge from `[-74.0703625,4.6110675]` to `[-74.0701716,4.6111057]` fixes u at **−11.3515° from east**, bearing **78.6485°**. This rotation is baked into every vertex and both exports; the host must not rotate again.

Four exact mapped rings own the tower outline, facade fins, mirror core and helipad, including the upper part. Tiny mapping irregularities are regularised in the model; all vertices pass the normal building-layer ownership test with its standard tolerance. The adjoining Edificio Colpatria, way 544447819, and every neighbouring building remain provider geometry: this model has no invented podium or surrounding plaza.

The tower has a rigid foundation with a bounded median terrain pad over its own outline, four perimeter references and 4 m feather. Bogotá's relief makes a lowest-sample circular pad a poor default. The pad is a placement handoff, not a surveyed slope or a terrain validation result; it must be checked against entrances and nearby roads in Full 3D world.

## Dimensions and approximations

| Feature | Model | Basis |
| --- | ---: | --- |
| Highest architectural roof | 196 m | Published; OSM helipad `height=196` |
| Main roof and fins | 192 m | OSM core/facade `height=192` |
| Storeys | 50 facade rows | Published and OSM; lobby assignment simplified |
| Glazed core plan | 30.8 × 28.8 m | Mapped, symmetric regularisation within about 0.3 m |
| Chamfers | approximately 3.4 × 2.6 m | Mapped, regularised |
| Helipad cap | 21.58 × 21.07 m | Mapped roof rectangle |
| Main-face facade | 13 slots, 14 fins per face | OSM sawtooth cadence, visually checked |
| Fins | 0.69 m wide, 0.8 m deep | Estimated; crest 0.52 m proud of glazing |
| Floor pitch / spandrel | 3.76 / 0.75 m | Estimated from photos, 50 repeated rows starting at 4 m |
| Lighting | 30–182 m, yellow upper half, blue and red lower quarters | Estimated representative flag scene; actual programs change |
| Helipad support, H, guardrail, plant, doors | simplified geometric detail | Estimated from mapped height and photos, not surveyed |

The landing H is 0.06 m above the cap for depth separation, so measured mesh height is 196.06 m. Exact roof signage, terrace furniture, full entrance architecture, the adjacent low-rise block and LED animation are omitted. Roof support geometry and small mechanical equipment are approximations; no claim of an as-built rooftop survey. The lighting module gaps are simplified, and the far strips are widened to retain the coloured facade at distance.

## Geometry and materials

A closed chamfered glass prism supports continuous concrete fins on all eight faces. Floor spandrels sit in front of glass, behind the fins. Near has horizontal window divisions and continuous narrow centre mullions hidden behind the floor bands, three chains of LED modules per slot, sparse warm office windows, terrace rails and small rooftop plant. All repetition is merged by material. Far retains the same silhouette, all fins, all fifty floor bands, all eight corners/faces, the raised helipad and three-colour light scene; small mullions, rails, plant and office lights are omitted.

Named palettes share keys: `concrete`, `glass`, `spandrel`, `metal`, `roof`, `light`, `lamp`, `sign`, `glow`. Night dims the structural materials and uses self-lit yellow, blue and red LED materials; daytime LED hardware uses neutral dark grey. The static flag scene is one photographed program, not the permanent colour of the tower. Texture-free GLB 2.0, no compression, no UV/image payload and no bridge attachment attributes.

## Measured exports

Build: `pnpm build:top-cities-landmarks torre-colpatria --no-check`.

| Detail | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 22,434 | 9 | 1,229,664 | 1,200.8 |
| Far | 2,024 | 8 | 126,444 | 123.5 |

Both bounds: X −18.054…18.052 m; Y 0…196.06 m; Z −17.087…17.129 m. Far has identical bounds and about 9.0% of near triangles. Below the building caps of 60,000 / 14 / 2.5 MB near and 12,000 / 8 / 500 KB far. Draws are material batches, not individual windows. Tesla hardware performance is unmeasured.

## Visual evidence and validation

The dossier reference sheet was opened before authoring. Three contact-sheet looks were used:

1. `tmp/top-cities/shots/torre-colpatria/iteration-1/torre-colpatria-procedural-near-light-sheet.jpg`: overview, facade, back, roof, entrance, detail and top. Confirmed chamfered footprint fit and roof silhouette; removed overemphasised seams on the continuous fins and widened facade/back cameras that cropped the tower.
2. Exported near/far, light/dark comparison beside the reference sheet: simplified repeated window divisions into hidden continuous strips, preserving appearance while reducing near from 33,672 to 22,592 triangles; the flag was too subdued at skyline distance.
3. Final `tmp/top-cities/shots/torre-colpatria/final/torre-colpatria-reference-export-contact.jpg`: all seven views in near/far and light/dark, alongside all five reference photographs. Increased LED strip width and brightened blue/red while darkening their daylight hardware. Judged full-height front/back silhouette, continuous fins, window rhythm, supported roof, low entrances, light bands and plan alignment against the red footprint rings. No visible holes, inverted exterior faces or floating roof details observed.

After the final visual look, the QA scan found 52 coplanar contacts only in invisible ground bottoms (concrete/metal on the closed tube bottom). Those bottom triangles were removed and roof/rail support undersides were slightly embedded to avoid flush buried contact faces; exterior silhouettes and bounds remain identical, with 158 fewer triangles in each LOD. The scan then reported no coplanar overlaps, 0% exterior back-face hits, no bridge attributes and all budgets passing. The visual sheet records the visibly equivalent exports before that underside cleanup.

The final sheet includes `torre-colpatria-glb-{near,far}-{light,dark}-{overview,facade,back,roof,entrance,detail,top}.png`, all under the same `final/` directory. Inspector evidence covers original geometry and the exported GLBs; it does not establish app placement.

Focused tests pin the 196 m cap and 192 m terrace, continuous fins and glazing recess on eight faces, thirteen slots on each main face, fifty floor bands, three self-lit flag bands, footprint containment, two-control orientation, median terrain pad, near/far bounds and GLB round trip. Required commands are `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/torre-colpatria/torre-colpatria.test.js` and `node scripts/asset-catalog.mjs`; the combined command passed all 121 tests (including all eight landmark-specific tests and three Torre Colpatria registry checks), and the catalog validated 164 entries / 300 GLB variants. Landmark-specific checks complete in under one second; the combined registry run takes about 4.2 seconds. Logs are `tmp/top-cities/torre-colpatria/tests.log` and `catalog-check.log`. Final deterministic QA is `tmp/top-cities/torre-colpatria/qa-metrics.json`: within budget, no coplanar pairs and 0% exterior back-face hits in the near sweep.

| Environment | Status |
| --- | --- |
| Source / exported GLBs, near/far, light/dark, standalone inspector | Verified by the builder |
| Cityscape | Not tested yet, integration is checked separately |
| Full 3D world | Not tested yet, integration is checked separately |
| Independent asset review | Pending coordinator review |

No shared files were changed; no renderer build, dev server, online deployment, git write operation or full test suite was run.
