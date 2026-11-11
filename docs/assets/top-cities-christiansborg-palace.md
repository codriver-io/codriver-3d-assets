# Christiansborg Palace — Copenhagen

Christiansborg Palace: the mapped U-shaped stone palace, copper mansard roofs and dormers, open central gateway and106 m tower with large arched belfry openings, upper lantern and three crown ornaments.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/Christiansborg_Palace)
- [Royal Danish Collection:106 m tower and three crowns](https://denkongeligesamling.dk/en/christiansborg-palace/interior-and-objects/the-tower-hall/)
- [Danish Parliament: completed tower and later three crowns](https://www.thedanishparliament.dk/en/the-tower/the-history)
- [Danish Parliament: tower symbolism and cross](https://www.thedanishparliament.dk/en/christiansborg-palace/the-interiors)
- [OSM provider footprint / building part 381945167](https://www.openstreetmap.org/way/381945167)
- [OSM provider footprint / building part 381945168](https://www.openstreetmap.org/way/381945168)
- [OSM provider footprint / building part 381945170](https://www.openstreetmap.org/way/381945170)
- [OSM provider footprint / building part 381955939](https://www.openstreetmap.org/way/381955939)
- [OSM provider footprint / building part 381955936](https://www.openstreetmap.org/way/381955936)
- [OSM provider footprint / building part 381955937](https://www.openstreetmap.org/way/381955937)
- [OSM provider footprint / building part 381955934](https://www.openstreetmap.org/way/381955934)
- [OSM provider footprint / building part 381955938](https://www.openstreetmap.org/way/381955938)
- [File:Christiansborg Slot Copenhagen 2014 01.jpg — Julian Herzog (Website); CC BY 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Christiansborg_Slot_Copenhagen_2014_01.jpg)
- [File:Kopenhagen (DK), Folketinget -- 2017 -- 1490.jpg — Dietmar Rabich; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Kopenhagen_(DK),_Folketinget_--_2017_--_1490.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/christiansborg-palace/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=12.5764138,55.6744034,12.5827862,55.6779966.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Highest tower finial | 106 m | Royal collection, Parliament and OSM |
| Palace wall / mansard top | 26 /38.6 m | OSM building/roof heights |
| Tower stone base | 40.1 m | OSM52.4 m less12.3 m roof tag |
| Main belfry / upper gallery | 43.5–60.3 /71.5–79.4 m | Mapped profile levels, photo reconstruction |
| Crown tops | 92.9 /97.2 /100.6 m | Mapped small upper parts |
| Gateway opening | 6.5 m wide,8.5 m crown | Exterior estimate |

Origin `[12.58040665,55.6762271]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

The tower origin is averaged from its mapped upper rings. Main rear-facade controls [12.580248,55.6767851] to [12.5812449,55.6759121] and the corresponding inner face [12.5800886,55.6764767] to [12.5806789,55.6759581] fix the roughly57.3 degree east/south palace grid. The U-shaped wing ring is preserved without filling the courtyard. Every selected mapped part remains in PARTS/OSM_WAYS, while replacement ownership uses the three main ground-owning palace outlines rather than elevated tiny crown/finial rings.

## Model and foundation

Original metric stone facades have repeated framed blue-grey windows, lower plinth and cornice bands. An original offset-band mansard surface stays inside the mapped U-plan and preserves the open court, with mapped roof dormer/chimney locations. The central tower gateway is physically cut through the low masonry and has a curved intrados. Above the broad stone tower, copper shoulders lead to large true arched belfry openings, an open octagonal upper lantern and restrained tiered copper cap. Three separate open crown ornaments and the slender cross/weather-vane finial retain the recognizable106 m silhouette in far. No surrounding stables, chapel, statues, royal insignia lettering, paving, terrain heights or interiors are exported.

The106 m overall height is authoritative; intermediate values are mapped roof/profile estimates, not a commissioned survey. Palace roof folds, window modules, gateway arch, belfry openings, copper weathering, crown arch sections and finial details are photo-calibrated estimates. Historic roof tiles and pre-restoration green copper versions are not mixed into the modern brown-copper tower. Sculpture and heraldic relief are omitted rather than copied from reference photos. Cityscape and Full3D world verification remain a later batch stage.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 35027 | 6 | 383256 |
| far | 5777 | 6 | 91384 |

Deterministic QA: `tmp/batch/christiansborg-palace-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/christiansborg-palace.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/christiansborg-palace/christiansborg-palace-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/christiansborg-palace/christiansborg-palace-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Author self-review used two looks. The second replaces the initial faceted roof with crisp offset mansard bands and adds horizontal window divisions; the open U-court, through-gateway, arched belfry and three supported crown baskets survive both LODs. No additional look-fix rounds were used.

Independent-review revision: Both palettes use darker, desaturated weathered stone, frames and windows as requested; near geometry and triangle count are unchanged. Far groups window panes while retaining horizontal divisions, omits tiny vertical liners and hidden crown/post end caps, and spaces small dormers more coarsely; the courtyard, gateway, open belfry and three crowns remain.

Far cost: 10455 → 5777 triangles; near updated only for the requested FIX/nit. Fresh exported contact sheet: `tmp/batch/revision/sheets/christiansborg-palace.jpg`; far silhouette, openings and separated facade rhythm checked against near. Landmark tests, focused conformance, zero-flag deterministic QA and depth `--check` pass with zero dropped cycle edges. Cityscape: not tested. Full 3D world: not tested.

## 2026-11-10 provider ownership fix

Diagnostic isolation confirms that the tall white inner-court cuboid is a provider building, unlike the flat courtyard paving. OSM part **381945169**, the 25.9 m right-hand courtyard return, was retained in SOURCE_PARTS/OSM_WAYS and modeled but omitted from the three runtime masks. Included that part in the existing geographic PARTS selection for FOOTPRINTS (now four rings); kept the main U-court open and every unrelated stable/chapel outside ownership. No approved model, palette or GLB changed. Before/after application paths and final Cityscape/world verdicts are recorded in `docs/batches/2026-11-10-app-verification-fixes.md`.
