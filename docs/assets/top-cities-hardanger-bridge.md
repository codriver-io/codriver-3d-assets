# Hardanger Bridge (`hardanger-bridge`)

Original procedural model of Hardangerbrua, the completed August 2013 suspension bridge carrying Rv7/Rv13 between Ulvik and Ullensvang over Eidfjorden. The two tapered concrete portal towers, single high transverse beam, thin aerodynamic steel box, paired suspension cables with vertical hangers, separate pedestrian/cycle lane, and direct tunnel entrances distinguish it from a generic suspension bridge. No copied geometry, photographs, textures, fjord terrain or underground roundabout ship with it.

## Sources and rights

- [Aas-Jakobsen design fact sheet](https://www.aas-jakobsen.com/wp-content/uploads/2017/09/Hardanger_referanse_eng.pdf), checked 2026-10-08: published preliminary design dimensions, not a completion date source (the sheet anticipated 2011).
- [Hardanger Bridge](https://en.wikipedia.org/wiki/Hardanger_Bridge), supplied dossier: completed bridge identity and 2013 opening; total length commonly reported as 1,380 m, approximate overall width 20 m.
- [Bosc d’Anjou, Hardangerbroen 01](https://commons.wikimedia.org/wiki/File:Hardangerbroen_01.jpg), CC BY 2.0: completed road, concrete taper, single top beam, rails and lighting.
- [Holger Uwe Schmitt, Die Nebel lichten sich, Morgenstimmung am Hardangerfjord. 02](https://commons.wikimedia.org/wiki/File:Die_Nebel_lichten_sich,_Morgenstimmung_am_Hardangerfjord._02.jpg), CC BY-SA 4.0: completed side silhouette, cable sweep, box deck and shore support.
- The supplied reference sheet also includes Christoffer H. S., *Hardangerbrua juli 2010* (CC BY-SA 3.0), Aleksander Gjøsæter, *Constructing a bridge* (CC BY-SA 2.0), and Goodwin Steel Castings, *Cable saddle for Hardanger bridge* (CC BY-SA 2.0). Temporary construction equipment was deliberately omitted. Reference photographs remain in ignored dossier/scratch storage.
- OSM, © OpenStreetMap contributors, ODbL 1.0: dossier extract dated 2026-10-08; roadway ways 71221277 / 718438249, short joins 1167323627 / 734949157 and tunnel ways 244905661 / 718438262. All retained data is attributed. `hardanger-bridge-alignment.js` records the baked control points; the extract is in ignored `tmp/top-cities/hardanger-bridge/osm.json`.

## Dimensions and frame

| Item | Model | Basis |
| --- | --- | --- |
| Main span | 1,310 m between portal tower axes | Published design |
| Tower top | 201.5 m above local y=0 | Published tower height; footing/water datum convention, no surveyed base altitude |
| Steel box width / depth | 18.3 / 3.25 m | Published design; OSM polygon width 14.5 m is too narrow and not used to rescale the bridge |
| Midspan box underside / pavement | 55 / 58.25 m | Published sailing clearance interpreted at midspan plus girder depth |
| Vertical curvature radius | 20,000 m | Published design |
| Main cable diameter / sag | 0.60 m / 121.30 m | Published design diameter and sag/span = 1:10.8 |
| Mapped visible structure | 1,384.55 m | OSM roadway endpoints; published completed total 1,380 m, preliminary sheet 1,373 m |
| Tower setbacks from mapped ends | 37.27 m each | Centered published main span on mapped structure; independent mapped tower footprints unavailable |
| Whole fitted alignment | 1,572.45 m | Mapped bridge, two short joins, 80 m of each tunnel |
| World/authored portal pavement | 46.27 m | Estimated from published radius and midpoint clearance |
| Roadway / cycle lane | 8.5 / 3.75 m | Estimated division; cycle lane to northeast (negative lateral) |
| Tower leg sections | 7.8 × 5.4 m base, 4.5 × 3.4 m top | Photographic estimate |
| High crossbeam | y=186.75–192.25 m, 20 m across | Photographic estimate |
| Hanger pitch | 16.375 m near / 32.75 m far | Visual estimate, not engineering fabrication data |

Local origin `[6.83033, 60.47848]`, +X east, +Y up, +Z south; station increases north shore to south shore, bearing about 148.97 degrees. Rotation is baked into source/export. Mercator stretch is applied once by the shared layer. No DEM or geographic altitude offsets are baked into vertices. `terrainPolicy: absolute-deck` avoids flattening the fjord and mountains; supports have zero-weight feet, an interpolated lower shaft, and rigid deck-attached upper structure. Tunnel station ranges suppress above-ground clamping beneath mountains.

There are no building/building:part ways in the dossier. `FOOTPRINTS=[]` and `footprintless=true` are deliberate: the man_made=bridge outline is not a provider building extrusion. Road replacement is bounded by the shared centerline/lateral corridor; tests enforce a 16 m lateral model envelope. No shared file was changed.

## Geometry and LOD

The main span is a closed six-sided lofted steel box with crisp aerodynamic edges; short side spans are concrete viaducts without hangers. The towers are lofted inward-tapered solid shafts with an open high portal, one top crossbeam and a low bearing beam beneath the girder. Near adds restrained casting joints, cable clamps, hanger shoes, transparent railings, fallback two-lane paint and roadside lamps. Cables are eight-sided near / five-sided far lofts; hanger stations coincide exactly with cable samples. Compatible members merge per material, with three station chunks near and no chunks far. Far preserves tower openings, deck profile, cycle lane, tunnel mouths and both cable planes; it drops lamps, casting joints, paint and railing posts.

Both palettes have the same seven semantic keys. The pale concrete stays recognizable at night; metal dims and real deck lamp positions emit warm light. Palette changes do not change the structural geometry. Tunnel mouths and the smaller adjacent cycle entrance are estimated open arches, not texture plates; only short visible mouths are included. Backstays end at the asset boundary where the unmodeled mountainside/rock anchorage belongs; their endpoints/shape are estimates, not surveyed anchorage geometry. The standalone ground therefore does not support those truncated cable ends visually.

## Costs

| Export | Triangles | Mesh draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 49,358 | 21 | 2,542,232 | 2,482.6 |
| Far | 8,244 | 4 | 357,124 | 348.8 |

Texture-free standard GLB 2.0, no compression extensions or decoders. Bridge attachment attributes are retained and round-trip tested. These costs exclude provider roads and terrain, and are not Tesla hardware measurements.

## Verification evidence

The reference dossier `refs-sheet.jpg` was opened before modeling. Judged contact sheets are under `tmp/top-cities/shots/hardanger-bridge/`: `hardanger-bridge-procedural-near-light-sheet.jpg`, all four `hardanger-bridge-glb-{near,far}-{light,dark}-sheet.jpg`, `export-matrix.jpg`, and `reference-comparison.jpg` (completed reference photos adjacent to exported renders). They cover front/back, above, crossing, underside, tower detail and both tunnel mouths. Initial views clipped the distant tower and hid the portals behind a tower leg; cameras were moved wider/closer. Inspection then prompted extending cycleway pavement beneath both cycle entrances and distinguishing the concrete side spans from the aerodynamic suspended main deck. Final GLBs were rendered and opened after those corrections.

Focused command: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/hardanger-bridge/hardanger-bridge.test.js`: **215 passed, 0 failed**. The four asset tests raycast tower spacing/openings, the grounded feet, 55 m soffit, tunnel holes, source envelope, both driving directions, crossing/off-road rejection and exported attachment weights. `qa-metrics.mjs --ids hardanger-bridge`: no issues, min y=0, zero different-material coplanar overlaps, 0% back-face hits in the sweep. `node scripts/asset-catalog.mjs` / `pnpm assets:check`: **198 entries, 360 variants valid**. `pnpm assets:preview` builds the local ignored inspector successfully. Runtime bundle built locally for app QA; generated bundles are not part of this delivery. Independent reviewer approval remains a coordinator release gate.

## Cityscape: verified for standard Protomaps roads and height API

Local app, slot A port 3270, renderer build `5a07ecb54395`, public Protomaps tiles. The flat portal pavement is 4 m; ramps run over 92.59 m north / 95.32 m south and meet the mapped tunnel roads at 0 m, steepest grade **6.48%**. Midspan keeps the real camber rise, yielding 15.985 m; attached towers/cables move with that lower deck (tower top approximately 159.2 m in Cityscape). This is an explicit flat-map compromise.

Judged `app-matrix.jpg`, `approach-matrix.jpg`, `cityscape/hardanger-bridge-{far,near,street}.png` and the four `cityscape-approaches/spot-{north,south}-{forward,reverse}-near.png` captures. Both LODs were active and the pavement met the approaches; no doubled generic main deck was visible. The API probe is `cityscape-probe/probe.json`: `heightAt` at stations 0 / 84.59 / 92.59 / 129.86 / 784.86 / 1439.86 / 1477.13 / 1485.13 / 1572.45 m returned 0 / 3.916 / 4 / 5.256 / 15.985 / 5.256 / 4 / 3.920 / 0 m, identical in both directions. Crossing headings and the point 60 m off the roadway returned null.

HD lane service returned 503 locally, so HD paint/dash/lateral fitting are **not tested**. No live car, route, congestion feed or device performance certification is claimed; the navigation height API is verified. Mode/failure/restoration matrices remain separate release checks.

## Full 3D world: unsupported for certified underground handoff (tested)

Port 3272, AWS Terrarium z15 source, standard Protomaps. The landmark loaded near/far/street and both tunnel approaches in both directions; inspected screenshots are in `world/`, `world-approaches/`, `app-matrix.jpg` and `approach-matrix.jpg`. The fjord remains intact and no corridor flattening is created. Terrain around tunnel endpoints samples the mountain surface above the actual roadway: the shared absolute-deck approach fit can therefore steepen the buried tunnel ramps. Surveyed tunnel/portal elevations and a provider-consistent underground transition remain required before calling world placement verified. Ground refinement, lifecycle changes, negative/exaggerated terrain and HD surfaces are not certified by these screenshots.


World API evidence is `world-probe/probe.json`: the surface pair read 97.00 / 101.79 m at the tunnel alignment ends, versus the estimated true portal pavement 46.27 m. Relative `heightAt` (deck minus local terrain) at start / north portal / north tower / midspan / south tower / south portal / end was 0 / −5.925 / 38.194 / 58.250 / 22.984 / −9.581 / 0 m; both travel directions agree, cross headings and off-road queries return null. Negative values inside a tunnel are legitimate; the unresolved issue is the approximately 50–55 m descent over each 93–95 m buried ramp, because its outer endpoint is tied to the DEM roof. South-portal DEM clamping added 9.58 m at the exact boundary in this snapshot. No shared workaround was shipped: an actual tunnel vertical alignment and a provider-consistent transition are needed, and must be reviewed before world rollout.

Delivery stays uncommitted for coordinator review; only this landmark's source folder, catalog fragment, documentation and exports are changed. Local servers were stopped and generated renderer bundles restored after QA. The independent visual review, terrain handoff and HD/lifecycle matrix remain explicit follow-up work.
