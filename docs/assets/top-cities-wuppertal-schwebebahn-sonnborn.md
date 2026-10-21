# Wuppertal Schwebebahn — Sonnborn section

Original texture-free procedural model of the land section over Sonnborner Straße, including the A46 crossing and Sonnborner Straße station. The railway opened in 1901; the modeled station represents the 2002 replacement, with green-grey steel portals and glazed platform sides. It is a suspended monorail, with a single running rail per direction and two directions side by side. It carries no automobile traffic and owns no HD pavement.

## Sources and geographic frame

The dossier `tmp/top-cities/wuppertal-schwebebahn-sonnborn/` supplied the mapped railway and general railway photographs. Several dossier photographs were interiors or other stations, so two exact Sonnborn photos were fetched and inspected instead of inferring this station from Werther Brücke.

- [WSW operator station page](https://schwebebahn.de/en/stationen/sonnborner-strasse): platform length 30 m, two lifts, two stairways, reopening August 26, 2002; describes the turn toward the Wupper beyond Sonnborn.
- [WSW official city guide](https://schwebebahn.de/cms/uploads/J01_Schwebebahn_2025_DE_c553cda8f6.pdf): railway raised 2.20 m over 485 m for the motorway intersection. This asset uses a simplified nominal profile, not an engineering reconstruction of that historic grade change.
- [OSM railway way 36388592](https://www.openstreetmap.org/way/36388592): hanging monorail, two tracks, bridge layer 2; centerline control points copied from the dossier. Selected segment 7.0919657/51.2376561 to 7.1018920/51.2386205, measured 700.107 m.
- [OSM station 198459753](https://www.openstreetmap.org/way/198459753) and indoor elevators 369505983/369505984: exact provider ownership rings fetched through the shared Overpass helper, 2026-10-15. Neighbouring residential buildings remain provider-owned.
- [Schwebebahnstation Sonnborner Straße 01 ies.jpg](https://commons.wikimedia.org/wiki/File:Schwebebahnstation_Sonnborner_Stra%C3%9Fe_01_ies.jpg), Frank Vincentz, CC BY-SA 3.0 / GFDL 1.2+: exact station portal, open street undercroft, overhead twin track, green-grey steel.
- [Wuppertal Sonnborner Str 0005.jpg](https://commons.wikimedia.org/wiki/File:Wuppertal_Sonnborner_Str_0005.jpg), Atamari, CC BY-SA 3.0: station stair and lift at street level.
- Dossier exterior photos by Mbdortmund, GFDL 1.2: `Wuppertal-100508-12833-Uferstraße.jpg` and `Wuppertal-100522-13378-Werther.jpg`, used only for general lattice girder and splayed steel leg vocabulary, not this station's shape.

All photos remain in ignored scratch; none is included in the source delivery or GLBs. Geometry is original, with no downloaded or traced mesh. OSM-derived coordinates retain ODbL attribution.

The origin is `[7.09868,51.23818]`. Units are real metres, +X east / +Y up / +Z south; orientation is baked from mapped geographic control points. Local y=0 is nominal flat street grade. No absolute elevation, DEM relief or Mercator stretch is baked in.

## Dimensions

| Feature | Value | Basis |
| --- | --- | --- |
| Modeled centerline | 700.107 m | Measured from mapped OSM section |
| Station platform length | 30 m | WSW operator |
| Nominal running rail elevation | 11.7–13.9 m above local grade | Visual estimate, 2.2 m raised crossing informed by WSW history |
| Overall height | 15.91 m | Measured geometry, estimated sections |
| Frame feet | 16 m apart | Visual estimate for road-straddling trestles |
| Typical frame spacing | approximately 27 m | Estimated rhythm, not surveyed support locations |
| Motorway span | approximately 108 m between retained trestles | Estimated support-free envelope over mapped motorway corridor |
| Main truss depth | 1.55 m | Visual estimate |
| Blue car | three approximately 7.5 m sections, 2.3 m wide | Recognition proxy, not a vehicle engineering model |

## Modeling decisions and limitations

Paired single-rail green girders sit over open street space. Dark narrow iron running flanges carry bogies and short suspension links into a three-part blue vehicle. Open-street supports have vertical kerb legs and 4.6 m radius rounded shoulders carrying the crown. The tapered 0.85 m box sections narrow to approximately 0.60 m at the foot. Near retains triangular lattice openings and I-section shoulder flanges; far keeps the complete rounded portal opening with solid simplified shoulder webs. Only the two western approach frames beyond the motorway street corridor retain splayed legs. Warren panels are approximately 9 m near / 18 m far; both LODs retain two running rails, station glazing bays and car windows. Compatible geometry is merged into eight material draws in both levels. Vehicle panes are separate solids between pillars, avoiding close face overlays. Small canopy lamps and selected vehicle panes use a subdued self-lit material at night.

The station glazing is lighter and inset 0.20 m farther toward the track, with shorter panels leaving the steel clear; the canopy uses a light grey-cream fascia band. The station has two narrow side platforms with a central open vehicle slot, low canopies, glazed outer walls, curved end portal shoulders, two mapped opaque lift shafts and ground-connected stair stringers. It deliberately omits neighbouring shop facades and detailed interiors. The exact OSM station ring includes those access spurs; the platform length follows the operator instead of shortening it to the narrower main roof outline.

The continuing railway is bounded at complete ground-connected trestles: running girders, chords and rails end at joists attached to those frames. These are supported section boundaries, not invented end-of-line stations. Trestle positions are estimates. No trestle is placed in the broad x=-439 to -352 m motorway corridor; the crossing is represented as a longer open truss span. Road alignment/provider surfaces are not modified. Actual live road elevations, surveyed bridge clearance, support positions, terrain arrival/refinement and mode transitions require app review.

Explicit small terrain rings cover individual footings and the station, with a rigid median datum and 2 m feathers. They avoid flattening a 500 m radius disc. Per-foot DEM residuals have not been tested. Cityscape: **verified visible**. Full 3D world: **verified visible**. Evidence and remaining integration limits are recorded below; ready here means authored/exported/catalogued.

## Review fixes and verification

The independent g17a review requested rounded street portals, stronger legs, a clearer glazed station/fascia and removal of a 1 cm steel/glass overlap. The revised generator addresses all four: near lattice shoulders and far solid shoulders have the same large road opening, vertical kerb legs use 0.85 m deep tapered sections, glass is lighter and inset, and the canopy has a separate light grey-cream material. Shoulder ends meet named leg-top/crown supports; the tests retain a shortened-leg negative control and check curved shoulder geometry plus road clearance in both LODs.

Two exported look rounds were inspected under `tmp/top-cities/shots/wuppertal-schwebebahn-sonnborn/review-fix-{1,2}/`. Final near/far sheets cover facade, opposite side, roof, train, underside and a street-axis portal view. The first round established the portal shape; the second simplified near tessellation and far lattice microdetail to control bytes. An additional vertex weld removes duplicate matching vertices without changing positions, normals or triangles.

The exact OSM station/elevator ownership remains unchanged: no additional provider building was added or replaced. App captures use an isolated `/tmp` bundle on slot K (Cityscape 3310/3311, world 3312/3313), never the shared public bundle. Final export costs, deterministic QA, test and app-capture results are recorded below after verification.

| LOD | Before triangles / draws / KiB | After triangles / draws / bytes / KiB |
| --- | --- | --- |
| Near | 40,492 / 7 / 3006.6 | 31,420 / 8 / 1,922,520 / 1877.5 |
| Far | 14,956 / 7 / 1033.2 | 16,872 / 8 / 1,144,052 / 1117.2 |

Near bytes fell 37.6%; far increased to preserve the defining street portals while remaining below the 1,200,000-byte bridge cap. Both retain the previous 697.07 × 15.91 × 125.79 m near bounds (far height differs by 0.021 m).

Final focused geometry tests: 11/11 pass, including the new near/far curved-portal and roadway tests, with no readiness assertions. Final exported deterministic QA: **ok**, zero coplanar/layered overlaps, no material cycles, and no dropped depth edges; `landmark-depth-layers.mjs --check` passes. Evidence: `tmp/top-cities/wuppertal-schwebebahn-sonnborn/review-fix/{landmark-tests.log,metrics.json}`.

Cityscape: **verified visible** in local scratch-bundle near/street/far captures. Full 3D world: **verified visible** in equivalent terrain-enabled captures. App evidence is under `review-fix/app/{city,world,city-axis,world-axis}/`; the axis captures show the repeated curved street frames. Scratch bundle stamp `34daceb40949` on slot K used isolated files under `/tmp/codriver-sonnborn-g17ar-qYEIkb`; only its own server PIDs 87660/87661 were terminated. Captures preceded the final identical-geometry vertex weld. Provider HD-lane requests returned 503, and account calls gave expected local-demo CORS errors; no HD fitting is required by this railway. Footing DEM residuals and runtime transitions remain **not tested**. No shared app bundle, git state or online deployment was written.

All three Sonnborn shared conformance checks pass separately (`review-fix/conformance.log`). That unrelated file was not changed.

Required combined landmark/shared registry run completed: **899/900 passed**; the only failure is the unrelated in-progress Tour 1000 catalog/readiness mismatch (`top-cities.test.js:56`). All 14 Sonnborn geometry/conformance checks pass; the final standalone 11-test run also includes explicit shoulder-flange end checks. See `review-fix/tests.log` and `landmark-tests.log`.

## g17ar2 provider audit

The reported continuous white extrusion was checked against fresh OSM building,
building-part and bridge polygons and the actual Protomaps `planet-20261011.pmtiles`
z14/z15 tiles on 2026-10-15. No long building or roof occupies the authored rail
corridor. The continuous white strip is the **ground-level Sonnborner Straße road
ribbon** (tile road way 42562928); the railway is tile way 36388588, grouped in
that archive from the mapped monorail segments. Hiding only building groups leaves
the strip visible; hiding road groups removes it. These are temporary diagnostic
captures, not changes to runtime visibility. The white masses beside the track
are the adjoining residential rows.
confirmed retaining the road and houses, with no additional OSM ownership ids.

Ownership remains exactly station 198459753 and indoor lifts 369505983/369505984.
All 16 distinct quantized z14 station boundary vertices lie inside the existing
mask with the standard 0.8 m provider tolerance. A new landmark regression test
checks these vertices and confirms five neighboring street-house interiors remain
outside ownership. No rail geometry, road fitting, footprint ring or terrain pad
was changed. Re-export costs remain near **31,420 triangles / 8 draws /
1,922,520 bytes (1877.5 KiB)** and far **16,872 / 8 / 1,144,052 bytes (1117.2 KiB)**.

New evidence is under
`tmp/top-cities/wuppertal-schwebebahn-sonnborn/provider-fix/`:
`city-axis/` and `world-axis/` contain street-axis app captures and diagnostic
no-buildings/no-roads images; `city-station/` and `world-station/` show the station
with neighboring houses retained. `city-station-axis/` and
`world-station-axis/` provide an additional view along the station's open street.
Cityscape and Full 3D world are **verified visible**, separately, with eight
basemap tiles loaded and the near model active. These captures use scratch bundle
`accc7d0b3921` under `/tmp/codriver-sonnborn-g17ar2-mf45Ou`, slot K. Slow provider
responses exceeded the app tile timeout initially; final captures replay complete,
unmodified provider tile bytes saved during this run through a capture-only
Playwright route. World terrain remains the configured live AWS Terrarium source.
The initial zero-tile capture in `before-axis/` is excluded from verification.
Per-foot DEM residuals, terrain arrival and route/mode lifecycle remain **not tested**.

Final g17ar2 validation: **12/12** landmark tests and **3/3** Sonnborn-filtered
registry checks pass; catalog validation passes (**425 entries / 836 GLB variants**).

`provider-fix/tests.log` is that interrupted run, while `landmark-tests.log`,
`conformance.log` and `catalog.log` are the final results. Depth generation/check
passes, with zero cycles or dropped edges. Owned scratch server PIDs 42729/42730
were stopped, ports 3310–3313 verified clear, and the scratch tree removed.

## Review fixes (2026-10-21)

The QA-only `supports` index ranges and `contacts` graph are now non-enumerable on `root.userData`. GLTFExporter therefore no longer writes them into the shipped node extras, about 20% of each GLB; they remain readable in memory for authoring checks. Geometry, triangles, draws and bounds are unchanged. `platformLength` and `railDirections` remain as two small extras.

Build: `CODRIVER_ASSET_BATCH=1 node scripts/build-top-cities-landmarks.mjs wuppertal-schwebebahn-sonnborn`. Bytes are as printed, before the maintainer license stamp (about 540 bytes per GLB).

| LOD | Before triangles / draws / bytes | After triangles / draws / bytes / KiB | Node extras |
| --- | --- | --- | --- |
| Near | 31,420 / 8 / 1,922,520 | 31,420 / 8 / 1,552,976 / 1516.6 | 369,812 → 268 bytes |
| Far | 16,872 / 8 / 1,144,052 | 16,872 / 8 / 898,304 / 877.3 | 246,017 → 267 bytes |

Near bytes fell 19.2% and far 21.5%; the GLB JSON chunks shrink from 378,464 to 8,380 bytes near and from 254,644 to 8,356 far. Deterministic QA is otherwise identical, including the existing steel-on-roof layered-face flag at the station canopy (3 m² near, 5 m² far). Cityscape and Full 3D world were **not re-tested**; the exported geometry is identical.
