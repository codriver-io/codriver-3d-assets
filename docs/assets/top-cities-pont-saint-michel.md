# Pont Saint-Michel — Toulouse

Original procedural model of the present Eugène Freyssinet road bridge, spanning the Garonne and the northern Île du Ramier. Its signature is four open V-piers supporting five parallel concrete girder lines below a thin continuous slab. The model includes the eastern short river-arm crossings, two carriageways, a reserved double tram corridor, open railings, edge lamps and central catenary. It depicts the modern traffic layout rather than either predecessor bridge.

## Evidence and dimensions

The [Ministry of Culture heritage record EA31000008](https://pop.culture.gouv.fr/notice/merimee/EA31000008) gives the main 326 m structure, four piers, five 65.20 m spans, five parallel rectangular beam lines, 26 m slab and approximately 550 m total crossing. It records opening on 12 February 1961; the [Freyssinet Association](https://efreyssinet-association.com/apropos/ses-ouvrages/) lists the project as 1959–1962, and the supplied encyclopedia dossier describes 1962. These dates describe the current bridge, not its predecessors. Vertical sections are photo estimates, not a structural survey.

| Quantity | Model | Basis |
| --- | ---: | --- |
| Main structure | 326 m | Heritage record |
| Main span rhythm | 5 × 65.2 m | Heritage record |
| Main V-piers | 4 | Heritage record and photographs |
| Parallel beam / strut lines | 5 | Heritage record and underside photograph |
| Deck width | 26 m | Heritage record |
| Full mapped station alignment | 561.770 m | OSM tram/road centre points; published 550 m includes a different endpoint convention |
| Deck above flat grade | 8 m | Photo estimate |
| Slab / girder depth | 0.55 / 0.95 m | Photo estimate |
| V-arm shoulder reach / thickness | ~12.2 / 1.1–1.8 m | Photo estimate; ~51° main face; tapered haunch extends to 15.5 m |
| Girder lateral positions | −10, −5, 0, 5, 10 m | Even spacing estimate |
| Highest catenary pole | 14.9 m | Fitting estimate |
| Flat-map approach ramps | 100 m each, 12% maximum | Explicit flat-map convention |
| Tram rail gauge | 1.435 m | Supplied OSM tags |

Reference photographs: **Pont Saint-Michel Toulouse.JPG** and **Pile du pont Saint-Michel Toulouse.JPG**, Serydicule, CC BY-SA 3.0; **Toulouse - Pont Saint-Michel -1.JPG** and **-2.JPG**, MOSSOT, CC BY-SA 3.0. Exact Commons links, authors and licences are in the catalog provenance. Only original texture-free geometry is shipped; photographs remain ignored scratch.

## Geography and geometry

Origin `[1.43865, 43.59238]`; local metres east/up/south, increasing station east toward Saint-Michel. Control points follow the mapped tram corridor between opposite one-way roads; geometry, road ownership, navigation and camera share `pont-saint-michel-profile.js`. The complete OSM bridge envelope, way 563384165, is in `FOOTPRINTS`, with attributed relevant road way IDs. No neighbouring building footprint is owned. The central ±4.4 m tram reserve and transverse headings reject vehicle-height queries; pavement claims only lateral bands −9.7…−5.1 and 5.1…9.7 m. Near geometry has two station chunks; far merges each material to one draw.

Each inclined arm is one broad chamfered slab with a steep main face, gently turning upper knee and five short tapered haunches beneath the longitudinal soffit beams. The large central V opening stays clear; the support planes are continuous across the deck rather than cut into five isolated strips. The transverse low footing joins their toes. Smaller eastern crossings have estimated narrow piers; island junction widening, brick bank arch details, tram stops/shelters and exact hidden foundations are omitted. The published principal length is located immediately west of the mapped island landing; the western abutment position differs from the broad OSM outline by about 37 m. The first/last 100 m of the full alignment descend to the measured approach datum, an explicit flat-map compromise that slopes the west end of the principal deck. Slab/girder ends embed up to 1.6 m below flat grade; these buried beam tails are intentional and no deep foundation is shipped.

Light materials are neutral weathered grey concrete, pale slab edges, dark pavement and metal. The dark palette dims these surfaces and applies a narrow self-lit green wash to the outer rib faces and deck edge, based on the supplied night photographs. This approximates floodlighting with geometry and does not claim the current lighting programme or diffuse illumination falloff. Lamp heads are self-lit amber at night. Far retains all four V openings, broad arm slabs, all five soffit beams, deck/rail silhouette and lamp/catenary heights, dropping close railing density, one horizontal rail and thin contact wires.

The bank-fit terrain policy uses the shared DEM surface and alignment bank/island samples without a flattening corridor. Supports retain zero attachment weight at their foundations and graded weight toward the deck; the structure is refit from immutable geometry. Absolute deck elevation remains unsurveyed, so absolute-deck placement would assert an unsupported datum. Bank-fit is a visual relative-height approximation, not a survey of real flood clearance.

## Export and visual checks

Inspected the supplied `refs-sheet.jpg` before authoring and the procedural overview/front/back/above/deck/detail sheet in `tmp/top-cities/shots/pont-saint-michel/procedural/`. The first view showed that the far-away side framing hid the V supports; moved the side cameras closer, kept the open five-rib construction and reduced far ramp sampling. The exported models were then compared beside all four photographs in `tmp/top-cities/shots/pont-saint-michel/reference-export-sheet.jpg`: near front, back, above, deck and close pier; far daylight; near night; far night. Export matches source; the V negative space is retained from both sides, with no opaque body between struts. Full diffuse night wash is deliberately approximated by narrow strips.

| LOD | Triangles | Mesh draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 38,012 | 16 | 1,554,016 | 1,517.59 |
| Far | 15,888 | 8 | 597,172 | 583.18 |

QA metrics: no issues, zero coplanar overlaps, zero back-face hits in the outside-in sweep. Exports preserve bridge attachment weights, named standard materials and metric bounds without textures or decoders. Costs are default-scene GLB metrics, not HD-overlay or Tesla hardware measurements.

Prescribed focused tests pass 262/262, including eight dedicated tests covering the actual V apertures, continuous arm planes, 50–55° face inclination and all five tapered haunches by raycast, footing/knee contacts, observable slab width, bounds/envelope, both road headings, tram/cross-heading rejection, per-vertex fallback pavement/paint height agreement, ramp slope and far silhouette. `node scripts/asset-catalog.mjs`, `pnpm assets:check`, `pnpm assets:preview` and the local Peregrine bundle build passed. No shared bridge extension, dependency installation, full test suite or online deployment was needed. Generated renderer bundles are excluded from delivery.

## App placement

Cityscape: **verified for standard-road placement, both LODs and navigation/camera deck-height API** on slot B port 3274, Protomaps tiles from tiles.codriver.io, renderer build `80e9ffee1241`, 2026-10-09. Full 3D world: **verified for loading, relative bank-fit placement and the same deck-height API**, with terrain join accuracy still limited; port 3276, AWS Terrarium DEM at maximum zoom 15. This is limited placement verification, not release certification. Both temporary servers were stopped at delivery. HD `/osm-lanes` returns 503 in these credential-free local servers, so HD pavement/paint continuity, actual route driving, traffic and Tesla hardware remain untested. App captures alone do not establish the complete ADR-0045 lifecycle/late-load/reanchor matrix.


The prescribed `app-shot.mjs --ids pont-saint-michel --shots far,near,street` recorded active near/far models in Cityscape and world. Ad-hoc `app-shot.mjs --at … --bearing 97/277` captured both ends in both directions in both modes; its synthetic spot IDs report `active:false` because they are not registry IDs, while the bridge’s separate ID captures show active loading. Inspected `app-first-sheet.jpg`, `app-joins-sheet.jpg` and final `approaches-final-sheet.jpg` under `tmp/top-cities/shots/pont-saint-michel/`, including the bank-fit world captures. Cityscape joints show fallback pavement meeting standard roads; no duplicate generic elevated deck is visible. The world bridge does not flatten the river or island.

Live numeric samples are retained in `tmp/top-cities/pont-saint-michel/app-measure-{cityscape,world}.json`. Values below are relative to the terrain under the queried carriageway in world mode, not absolute altitude. Forward, reverse and camera heights agree at every sampled point; all cross headings and the off-bridge point `[1.44,43.59]` return null. Source pavement/paint vertices also pass dedicated projection/height tests in both LODs. Route/car APIs consume this shared surface, but real route driving and live traffic were not tested.

| Station | Cityscape, both directions | World, both directions |
| --- | ---: | ---: |
| 0, western join | 0.000 m | 0.601 m |
| 50 | 4.000 m | 4.304 m |
| 100 | 8.000 m | 8.815 m |
| 102.496, first V-pier | 8.000 m | 8.852 m |
| 167.696, second V-pier | 8.000 m | 9.807 m |
| 232.896, third V-pier | 8.000 m | 10.761 m |
| 298.096, fourth V-pier | 8.000 m | 11.928 m |
| 461.770 | 8.000 m | 9.282 m |
| 511.770 | 4.000 m | 7.464 m |
| 561.770, eastern join | 0.000 m | 0.027 m |

World’s centreline bank datum differs from the DEM beneath a carriageway 7.4 m to its side. At the western endpoint that difference is **0.601 m**; the eastern endpoint is **0.027 m**. The shared bank-fit surface keeps the deck transverse section flat. Thus world has an unresolved cross-slope join tolerance and is **not certified for seamless terrain road integration**. HD pavement samples might improve the accepted surface but were unavailable locally; they are not claimed to fix this. Surveyed deck altitude, exact bank sections, detailed stop platforms, current floodlighting, HD lane continuity, failed/late loads, reanchor/mode-switch regression and hardware performance remain unverified. No shared files were modified to hide these limitations.


## Independent review correction

The review in this worktree’s `tmp/top-cities/review/pont-saint-michel/REVIEW.md` was PASS-WITH-NITS, recognisability 4/5. No Prepare command or REVIEW-2 supplement was present; the supplied lead-checkout review path was absent. Used the normal preparation commands after each export:

```sh
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids pont-saint-michel --out tmp/top-cities/review/pont-saint-michel/fix-metrics.json
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids pont-saint-michel --out tmp/top-cities/review/pont-saint-michel/fix
```

The generic review sheet had previously fetched the Paris namesake; replaced the ignored reference cache with the supplied Toulouse daylight pier photograph before preparing the new sheet. Dossier photos 3/4 are night images, while photo 2 is the useful daylight underside. Inspected all three: the arms read as broad concrete planes with shallow rib relief, and the five parallel beam lines are visible beneath the deck.

| Finding | Before → after |
| --- | --- |
| Shallow, stripe-sliced arms | Five isolated strips, long 23 m upper reach and roughly 20° principal slope → one 21.3 m-wide chamfered slab per arm, 12.2 m shoulder reach and measured raycast face inclination between 50° and 55° |
| Olive daytime fascia | Slightly warm/green concrete and a dark daytime wash → slab edges and pier/girder concrete share neutral pale grey `#b6b8b8`; day wash `#c5c6c6`; saturated green remains confined to the night palette |
| No haunch at V nodes | Constant-depth beam meets bare arm → five short tapered haunches at each arm shoulder, thickening toward the knee and tapering into the existing 0.95 m girder soffit |

Two look/fix rounds: the first prepared the broad arm plates, neutral grey material and new haunches; the second tightened the main face to about 51° and added the 50–55° observed slope guard. Looked at `tmp/top-cities/review/pont-saint-michel/fix/pont-saint-michel.jpg`, the exported near day/far night comparison `tmp/top-cities/shots/pont-saint-michel/review-fix/reference-export-sheet.jpg`, and final exported close underside/detail `review-fix/final/pont-saint-michel-glb-near-light-sheet.jpg`. All four V apertures remain open; deck width, mapped road profile, tram reserve, support footings and navigation heights retain their earlier values. Neutral material albedos are shared between fascia and pier; the inspection hemisphere light can tint shaded undersides.

Final costs: near **38,012 triangles / 16 draws / 1,554,016 bytes (1,517.59 KiB)**; far **15,888 / 8 / 597,172 bytes (583.18 KiB)**. Triangle/draw counts match the earlier exports; the extra bevel normal/vertex splits add about 9 KiB per LOD. QA has zero coplanar overlap, zero back-face sweep hits and an empty issues list. The raycasts verify continuous slab coverage in the former rib gaps, principal face inclination, every tapered soffit contact and central negative space in both LODs.

Rebuilt the renderer (`3ee40f3aefb2`) for slot B app inspection and reran both approaches in both driving directions in Cityscape and world, with final exports served after a server restart. Judged final join captures in `tmp/top-cities/shots/pont-saint-michel/review-fix/app-joins-sheet.jpg`. The new arms and haunches use the same road surface; no duplicate elevated deck or visible approach step appears. The reviewer explicitly accepted the documented 0.601 m world western cross-slope difference as not visible in its joins sheet; that numeric limitation remains recorded rather than claimed resolved. Both directions and camera deck heights still agree, and off-bridge/cross-heading queries return null. HD lane service still returns 503; HD paint, real driving, lifecycle and hardware limitations remain. No shared file was modified; runtime bundles are excluded from the commit, and temporary servers are stopped at delivery.
