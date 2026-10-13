# Edificio Metálico — San José, Costa Rica

Original procedural exterior of Escuela Buenaventura Corrales, Avenida 5 Mauro Fernández, facing the Parque Morazán / Jardín de Paz area. Stable ID `edificio-metalico`. The surviving two-storey prefabricated iron school is modelled with its raised central pavilion, triangular pediment, lower end pediments, three entrance bays, tall gridded windows, cream/ochre framing and muted grey-mauve pressed panels. This represents the paint scheme visible in the supplied dated photographs; today's paint has not been independently established. No photo, texture, scan or external mesh is shipped.

The editable source is `src/peregrine/landmarks/top-cities/edificio-metalico/`; exports are `public/models/buildings/edificio-metalico-{near,far}.glb` and the measured `edificio-metalico.json` manifest. The catalog fragment is `prototypes/assets3d/catalog.d/edificio-metalico.json`. Follow the [folder contract](../top-cities-landmarks.md).

## Sources and provenance

Consulted 2026-10-13:

- [Spanish Wikipedia: Edificio Metálico](https://es.wikipedia.org/wiki/Edificio_Met%C3%A1lico): school identity, Belgian prefabrication, Charles Thirion, iron construction, inauguration in 1896 and national heritage declaration in 1980. No survey height is supplied. The photo caption on one Commons reference gives a conflicting construction date/designer; it was used for visual observation only, not those historical claims.
- [OpenStreetMap relation 3548723](https://www.openstreetmap.org/relation/3548723): Escuela Buenaventura Corrales, `building:levels=2`, address, outer building [way 31419920](https://www.openstreetmap.org/way/31419920), inner garden [way 264136747](https://www.openstreetmap.org/way/264136747). The dossier omits multipolygon members. A single request through the shared Overpass helper failed; the allowed single-object OSM API fallback `/api/0.6/relation/3548723/full.json` supplied the full geometry, retained at `tmp/top-cities/edificio-metalico/school-api.json`. No other nearby provider buildings are owned. The inner way is a garden, not a replacement building.
- [Edificio Metalico. Escuela Buenaventura Corrales. San Jose. Costa Rica.JPG](https://commons.wikimedia.org/wiki/File:Edificio_Metalico._Escuela_Buenaventura_Corrales._San_Jose._Costa_Rica.JPG), Rodtico21, CC BY-SA 4.0, 2014: front massing, pediment, window/door rhythm and colours.
- [Edificio Metálico — Metallic Building — Downtown San Jose — Costa Rica](https://commons.wikimedia.org/wiki/File:Edificio_Met%C3%A1lico_-_Metallic_Building_-_Downtown_San_Jose_-_Costa_Rica_(8477713550).jpg), Adam Jones, CC BY-SA 2.0, 2013: pressed-metal panel relief, tall glazing, cream posts, hood profiles and cornice finials.
- [Edificio Metálico SJO.jpg](https://commons.wikimedia.org/wiki/File:Edificio_Met%C3%A1lico_SJO.jpg), Alejandro Álvarez Taborda, CC BY-SA 4.0: overall frontage proportions. It is a processed photograph; colour calibration principally uses the two preceding references.
- [Edificio Metálico.jpg](https://commons.wikimedia.org/wiki/File:Edificio_Met%C3%A1lico.jpg), Bernal Saborio, CC BY-SA 2.0: window grids and pressed cassette relief at street level.
- [Escuela Metálica y Jardín de Paz SJ CR.jpg](https://commons.wikimedia.org/wiki/File:Escuela_Met%C3%A1lica_y_Jard%C3%ADn_de_Paz_SJ_CR.jpg), Guanlong D., CC BY 2.0: lower entrance and park-facing elevation.

Commons file-page licences were checked. All five supplied photos were viewed in `tmp/top-cities/edificio-metalico/refs-sheet.jpg`; individual files remain in ignored scratch. The final local inspection sheet includes credited reference photos and is likewise ignored. All geometry is original procedural work; OSM geographic data is independently credited under [ODbL 1.0](https://www.openstreetmap.org/copyright).

## Frame, dimensions and provider envelope

Real metres, +X east / +Y up / +Z south, rigid y=0 at local grade. Origin `[-84.074372, 9.93615065]` is approximately the outer-envelope centre. The south frontage is aligned from OSM southwest `[-84.0746646,9.9359788]` to southeast `[-84.0741111,9.9359334]`: eastward bearing approximately 94.76°, outward frontage bearing **175.24°**. The **−4.76° Y rotation is baked into every mesh vertex** and GLB; the host must not rotate again.

| Feature | Metres | Evidence |
| --- | ---: | --- |
| OSM outer envelope in architectural frame | 60.9 wide × 43.8 deep | Mapped coordinates, not a survey |
| Main wall frontage | 59.55 | Inset inside mapped envelope |
| Wing / central cornice | 12 / 14.5 | Photo estimates |
| Central pediment / highest finial | 17 / 17.67 | Photo estimates; declared height rounded to 17.8 |
| Upper wing / central glazing | 2.15 × 4.4 / 2.55 × 5.0 | Photo estimates |
| Ground windows / entrance doors | 2.15 × 4.55 / 2.65 × 4.55 | Photo estimates |
| Front window pitch / bays | 4.4 / 13 in each row | Original simplified rhythm from photographs |
| Roof rises above wing eave | 0.85–2.1 | Estimated, no aerial survey supplied |
| Terrain pad radius | 38 | Covers approximately 37.5 m outer half-diagonal |

The replacement footprint is the exact OSM outer ring. The notched inner garden is retained as `COURTYARD`; no slab, generic extrusion or roof fills it. The courtyard faces and central rear-facing school spur follow an inset simplification of that mapped hole. No neighbouring school, modern annex, garden fountain, park fence, tree, street or plaza is included. Tests check every vertex against the actual replacement envelope. No DEM, terrain altitude or Mercator stretch is embedded.

## Geometry, materials and detail levels

The generator imports only Three.js and the shared authoring `assetBuilder`. Exterior and courtyard walls have actual window/door holes with inset glazing, not dark rectangles covering uninterrupted walls. All thirteen frontage bays, three reddish entrance doors, five central transom fanlights, raised central roofline, end pediments, finials, pale hipped roofs and courtyard opening survive far LOD. The rear and courtyard elevations have separate two-storey window rows.

Near adds bevelled pressed-panel cassettes in solid frontage webs, three vertical glazing mullions and closely spaced horizontal rails, fuller post collars and roof standing seams. Far removes cassettes and seams and uses a coarse glazing grid and planar window surrounds, preserving each opening and both storeys. Geometry is merged by named material: `panel`, `relief` (near only), `trim`, `roof`, `glass`, `door`, `iron`. The light and dark palettes have identical keys. Night dims opaque painted metal, roof and glass; no unsupported assumption of illuminated rooms or floodlights is made. The crest is a small geometric ring, not a reproduction of heraldry. Inscriptions, minute rivets and filigree are omitted.

The plinth uses the wall material and hood assemblies use a single trim material, avoiding bidirectional overlap. The depth ordering is generated from exported triangles rather than guessed. Raking pediment cornices are checked against their named triangular panel support, excluding cornice geometry; a deliberately detached endpoint proves the tolerance rejects an unsupported member. Roof seams are surface decoration, not free-standing beams/cables.

## Verification and visual evidence

Build and focused checks:

```sh
pnpm build:top-cities-landmarks edificio-metalico --no-check
node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/edificio-metalico/edificio-metalico.test.js
node scripts/asset-catalog.mjs
node scripts/landmark-depth-layers.mjs --ids edificio-metalico
node scripts/landmark-depth-layers.mjs --ids edificio-metalico --check
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids edificio-metalico --out tmp/top-cities/edificio-metalico/qa-metrics.json
pnpm assets:preview
```

The initial procedural near/light sheet was opened and compared to all dossier photos. It established the raised frontage and courtyard but prompted a cheaper far grid and corrections to wall depth orientation. Deterministic QA then found material conflicts around the lower plinth, hood infill and cornice backs. The plinth was unified with the wall material, hood infill removed, and pediment/cornice backs moved into clean contact. Final exported QA reports **no issues, zero coplanar overlaps, zero back-face hits** and **zero dropped material-cycle edges**. The depth table was regenerated and its targeted check passed.

Opened and visually judged: `tmp/top-cities/shots/edificio-metalico/exported-reference-contact-sheet.jpg`. It places two reference photographs beside the final exported near/far GLBs and includes light front, back, roof, entrance, detail and mapped plan, plus dark near/far front and back. Individual PNGs and four labelled `edificio-metalico-glb-{near,far}-{light,dark}-sheet.jpg` sheets remain in that folder. Compared features: two-storey glazing rhythm, central height hierarchy, cream framing versus grey panels, entrance colour, open courtyard, pale roof envelope, geographic plan alignment and far silhouette. The fine embossed panels intentionally disappear in far; the window rows remain discrete. Screenshots are local inspection output, not published pages.

The six dedicated tests pass in under one second: mapped plan and estimated apex, all frontage windows/doors/fanlights by raycast, courtyard negative space and supported roof masses, exact footprint containment, cornice-support proximity with a negative case, far bounds/cost and GLB source round trip with normals and stripped bridge attributes. The requested combined conformance and landmark test command passed **611/611 tests**; its output is retained at `tmp/top-cities/edificio-metalico/test-results.txt`. The global catalog validated **336 entries / 620 GLB variants** and `pnpm assets:preview` built the ignored inspector successfully. A later targeted depth check remained current but its preliminary global catalog scan saw another worker's temporarily unregistered `san-jacinto-monument-far.glb`; the targeted reader fell back to this landmark, and no other record was changed.

| Exported default scene | Triangles | Draws | KiB, rounded |
| --- | ---: | ---: | ---: |
| Near | 35,585 | 7 | 1,701 |
| Far | 10,267 | 6 | 460 |

Both exports meet the building budgets of 60k/14/2.5 MB near and 12k/8/500 KB far. Scene metrics are exact in the generated manifest; these are uncompressed asset costs, not measurements on Tesla hardware.

## Limitations and integration handoff

All heights and roof slopes are estimated. Rear/courtyard facade ornament is inferred because the supplied photographs chiefly show the park-facing frontage. The outer envelope and notched courtyard, not an invented rectangular solid, constrain that inference. Pressed panels and hood forms are simplified; central lettering, intricate crest, roof-edge filigree, flagpole, interiors and site furniture are omitted. Dated reference paint is used; current colour is unverified.

| Mode / check | Status |
| --- | --- |
| Cityscape | **Not tested yet, integration is checked separately.** |
| Full 3D world | **Not tested yet, integration is checked separately.** Rigid grade base; DEM/pad/entrance sampling remains required. |
| Provider replacement, failed/late loads, restoration, theme/LOD/reanchor lifecycle | Not tested in app; source and exported geometry checked locally |
| Actual hardware performance | Not measured |

Only this landmark's source, record, documentation and runtime exports were authored. No app server, runtime bundle, managed clone, git write operation or deployment was performed.
