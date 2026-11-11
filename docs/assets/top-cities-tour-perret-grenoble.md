# Tour Perret

Original procedural permanent exterior, 2026-11-10.

## Identity and evidence

Octagonal reinforced-concrete tower with eight vertical ribs, fine chevron screens, an open main gallery, upper cylindrical shaft and open lantern with a small domed crown and needle.

- [Isère tourism: 86 m structure, 95 m to tip; eight pillars; 2026 restoration and observation levels](https://www.alpes-isere.com/en/sit/tour-perret-35439/)
- [City of Grenoble: restored permanent tower reopened in 2026](https://www.grenoble.fr/article/1844/473-la-tour-perret-la-reouverture.htm)
- [Wikipedia identity and reference-photo provenance](https://fr.wikipedia.org/wiki/Tour_Perret_(Grenoble))
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/28696571)
- [Fichier:Tour Perret by M. Riegler.jpg — English : This photo has been taken by Matthieu Riegler (User:Kyro) and released under the licenses stated below. You ar — CC BY 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Tour_Perret_by_M._Riegler.jpg)
- [Fichier:GRENOBLE15.JPG — simdaperce — CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:GRENOBLE15.JPG)

Reference images are comparison-only and retained under ignored `tmp/france-southeast/tour-perret-grenoble/refs/`; no photograph, traced mesh, logo or lettering ships. Photos selected: 3, 4. Historical photographs are used only where the permanent exterior is unchanged; temporary scaffolding, event fit-outs and unrelated pictures are excluded.

## Frame and dimensions

Origin: [5.7354214, 45.1849483]. Local y=0 is the rigid exterior foundation plane; +X east, +Y up, +Z south, real metres. Rotation 0.47725987 radians is baked once using mapped controls [[5.735373,45.1849771],[5.7354158,45.1849927]] (way 238572599). No terrain or Mercator stretch is authored. OSM ways 28696571 define the provider replacement envelope, not an arbitrary bounding rectangle; nearby roads and buildings are not owned.

| Element | Metres | Basis |
| --- | ---: | --- |
| Circular foundation diameter | 15.0 | OSM mapped envelope |
| Lower octagonal shaft diameter | 9.9 | Mapped building part |
| Main shaft / gallery / upper shaft | 59 / 59–67 / 70–78 | OSM height tags, photo-calibrated |
| Lantern / dome / needle tip | 78–85 / 85–90 / 95 | OSM and reference estimates |

## Modeling choices and limits

Total height is 95 m to tip following Isère tourism, which separately gives 86 m for the main structure; other sources use 90 m or OSM 93 m for the mast. Upper stage splits, chevron pitch, gallery rails and dome profile are photographic estimates, not survey. Permanent restored form only; temporary restoration scaffolding, park furniture and signage omitted.

Open gallery gaps remain genuine voids in both LODs. Near carries the dense chevron screens; far coarsens their pitch but retains all eight ribs, gallery and lantern openings. Footing follows the mapped circular envelope; upper shaft orientation follows the mapped octagonal structural part.

Both LODs keep the identifying silhouette, major openings and facade rhythm. Foundations are rigid, not terrain-draped; any modeled ground surface is at least 0.10 m above the local datum. No app terrain certification is implied.

## Reproduction and QA

- Build: `pnpm build:top-cities-landmarks tour-perret-grenoble`.
- Focused test: `node --test src/peregrine/landmarks/top-cities/tour-perret-grenoble/tour-perret-grenoble.test.js`.
- Metrics: `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids tour-perret-grenoble --out tmp/france-southeast/tour-perret-grenoble/metrics.json`.
- Exported reference contact sheet: `tmp/france-southeast/sheets/tour-perret-grenoble.jpg`.
- Red mapped-footprint top view: `tmp/france-southeast/shots/tour-perret-grenoble/`.
- Depth: `node scripts/landmark-depth-layers.mjs --ids tour-perret-grenoble --check`.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 9572 | 4 | 141456 |
| far | 5924 | 4 | 89540 |

Author self-review: identifying features, proportions, palette, near/far openings and foundation contact inspected against the credited exterior references; red-ring mapped plan checked. Deterministic metrics: zero remaining flags; depth graph: no unresolved cycles. Focused structural tests and exported round-trip conformance pass. Model readiness: ready. Independent review is pending; author self-review is not an independent verdict.

**Cityscape: not tested. Full 3D world: not tested.** No app server was started. DEM/pad boundaries, provider lifecycle, live shared shading and hardware performance remain unverified.


## Independent-review correction, 2026-11-11

Narrowed the 70–78 m upper shaft to 4.60–4.50 m diameter and the 78–85 m lantern to approximately 4.60 m, retaining the open gallery, connected eight-rib crown, dome and 95 m tip in near and far.

These photographic authoring targets are estimates, not surveyed dimensions. Re-exported both LODs; focused structural tests, deterministic metrics (zero remaining flags) and depth check pass. Fresh contact sheet: `tmp/batch/fixes/sheets/tour-perret-grenoble.jpg`. Author compared the corresponding SW and NE near/far faces: silhouette, openings, window/arcade rows and structural contacts are retained without blank replacement facades. Independent re-review remains pending; **Cityscape: not tested; Full 3D world: not tested**.

