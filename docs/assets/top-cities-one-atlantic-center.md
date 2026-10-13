# One Atlantic Center

Original procedural model of the 1987 Johnson/Burgee and Heery office tower at 1201 West Peachtree Street, Midtown Atlanta, also known as IBM Tower. Source: `src/peregrine/landmarks/top-cities/one-atlantic-center/`. Both LODs preserve the stepped granite shaft, Gothic arched crown, four corner pinnacles, copper pyramid and open gold lantern.

## Sources and frame

[Official site](https://www.1ac.com/) confirms the address. [Structural engineer Walter P Moore](https://www.walterpmoore.com/projects/one-atlantic-center) confirms Johnson/Burgee, 1987 and granite cladding. [Wikipedia](https://en.wikipedia.org/wiki/One_Atlantic_Center) supplies the 250 m height, 50 storeys, pink Spanish granite, copper pyramid, gold peak and illuminated roof ridges. The lead-supplied dossier contains OSM geometry and facts; checked 2026-10-13.

Reference photographs, comparison only, retained under ignored `tmp/top-cities/one-atlantic-center/refs/`:

- [4 One Atlantic Center.jpg](https://commons.wikimedia.org/wiki/File:4_One_Atlantic_Center.jpg), Atlantacitizen, CC BY-SA 3.0: shaft and crown.
- [One Atlantic Center 1.jpg](https://commons.wikimedia.org/wiki/File:One_Atlantic_Center_1.jpg), Lee Coursey, CC BY 2.0: crown, lantern and ridges.
- [One Atlantic Center.jpg](https://commons.wikimedia.org/wiki/File:One_Atlantic_Center.jpg), Atlantacitizen, CC BY-SA 3.0: opposite facade and lower arcade.

No external mesh or image pixels are distributed. Original model; geographic data © OpenStreetMap contributors, ODbL 1.0.

Origin `[-84.38736845,33.7870797]` is the center of the mapped tower envelope, correcting the dossier's approximate point southeast of the tower. Axes are east/up/south, metres. Local y=0 is rigid pavement grade. No DEM, Mercator stretch or absolute elevation is baked in. The mapped north edge control points `[-84.3875279,33.787313]` and `[-84.387206,33.7873122]` give a bearing of 90.17 degrees; the outline coordinates contain this rotation already. The upper square roof is aligned within 0.17 degrees of these edges.

Provider replacement owns only way 39450314 and tower parts 1425865538, 1451518610 and 1451518611, all copied from the dossier. Nearby parking decks, retail roofs and Regions Plaza are excluded. The outer shell is inset 1.9% from the mapped ring to keep ownership slack; tiny nearly collinear points are simplified. The 39 m rigid pad covers tower corners; terrain fit is a separate integration gate.

## Dimensions

| Feature | Model | Basis |
| --- | --- | --- |
| Highest tip | 250 m | published |
| Floors | two lobby levels plus 48 upper floors | published total 50; distribution estimated |
| Envelope | about 51.2 × 51.0 m after inset | mapped OSM outer envelope about 52 × 52 m |
| Central roof | 33.2 m square | mapped central part about 33 m; square simplification |
| Shaft | 0–198 m; lobby to 10 m | photo estimate |
| Gothic arcade | 198–212 m, arched windows springing at 206.5 m | photo estimate |
| Crown collar and stepped shoulders | 212–218 m collar; terraces at 213.5 / 215.4 / 217.5 m; shoulder tips to 219.8 m | photo estimate |
| Copper pyramid | 218–242.5 m | photo estimate |
| Corner pinnacles | shafts 198–216 m; tips to 220.5 m | photo estimate |
| Lantern and finial | 242.4–250 m, open pillars 243–247 m | photo estimate |
| Window bays | roughly 4.2 m pitch | photo estimate; varied to fit mapped edges |

## Geometry and materials

Six merged materials: stone, trim, glass, light, copper, glow. Granite uses subdued pink-brown; patinated copper is muted blue-green. The gold lantern and ridge strips use glow; a small deterministic subset of panes uses light, dark by day and warm at night. Night lighting is an approximation rather than a photometric simulation.

Near has two panes per bay per floor, inset glazing with jamb/head/sill closures, and small pyramid ridge crockets. Far uses a single disjoint window cell per bay per two floors at the facade plane; it retains separate horizontal cells rather than continuous stripes. All arches, corner pinnacles and the open lantern remain in far. The facade skin has no solid wall hidden directly behind glass. The Gothic decoration is simplified into arches and pinnacles; fine tracery, precise granite joints, lobby doors, interiors, planted gardens and detached parking structures are omitted.

## Verification

Export and visual evidence, measured costs and focused test results are recorded below after final QA. Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Provider replacement, terrain refinement, pads, lifecycle and hardware performance need the lead's unobstructed app evidence in both modes; standalone GLB inspection establishes only the asset handoff.

### Exported costs

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 36,574 | 6 | 1,947,124 | 1,901.5 |
| far | 8,582 | 6 | 435,508 | 425.3 |

Identical near/far bounds: x ±25.617 m, z ±25.478 m, y 0–250 m. Both have normals and no texture, decoder or unused bridgeLift attribute.

### Visual evidence actually inspected

All paths are ignored local evidence under `tmp/top-cities/shots/one-atlantic-center/`:

- `reference-lod-themes.jpg`: three attributed photos next to exported near/far light/dark overview tiles and the near crown detail.
- `final-near-light.jpg`: exported overview, east facade, opposite/back, above roof, entrance and crown detail.
- `one-atlantic-center-glb-near-dark-sheet.jpg`: near night overview, roof and detail.
- `one-atlantic-center-glb-far-light-sheet.jpg`: far day overview, back, roof and detail.
- `one-atlantic-center-glb-far-dark-sheet.jpg`: far night overview, back, roof, entrance and detail.
- `one-atlantic-center-procedural-near-light-sheet.jpg`: source overview/roof match the exported shape.
- `one-atlantic-center-glb-near-light-top.png`: plan orientation, rigid outline and crown footprint.

The first render showed unnecessarily dense glazing and an oversized export, so near glazing was reduced to two panes per bay and far floors paired into distinct cells; crown geometry was retained. Back/facade cameras were moved outward to include the entire silhouette. Named-support and footprint tests found corner shafts protruding beyond the provider's 0.8 m allowance; moved their centers from ±21 m to ±20.3 m and inspected fresh final exports. A material cycle at the shoulder was fixed by making the attached pinnacle shafts the shaft's stone material; final depth regeneration dropped zero edges. The final contact sheets retain the recognizable pyramid, corner spikes and lantern in both LODs. Fine Gothic tracery and exact lobby ornament remain simplified; the crown tiers are fitted estimates and await independent likeness review.

### Checks

- Seven landmark-specific tests pass (about 1.1 s): sourced height, stepped envelope, pyramid taper, four corner tips, open lantern, four ridge feet and common apex touching named collar/pyramid support, a detached-end negative case, window separation, all-vertex footprint ownership and GLB round trips.
- Required combined test command: 582/583 pass; the only failure is another in-progress landmark, `estadio-nacional-costa-rica`, whose temporary geometry material stone is absent from its palette; all One Atlantic Center tests pass.
- Registry-only selection for One Atlantic Center: three conformance tests pass.
- `qa-metrics.mjs --ids one-atlantic-center`: no issues, zero coplanar material overlaps, zero layered-face flags, 0.2% near back-facing first hits (below 2% gate), no unsupported-member or window-rhythm flags; evidence `tmp/top-cities/one-atlantic-center/qa-metrics.json`.
- Depth table regenerated with the permitted `--ids one-atlantic-center` command; freshness check passes, zero dropped cycle edges.
- Catalog check retried: blocked by another builder's missing `docs/3d-top-cities-walt-disney-concert-hall.md` (earlier unregistered Walt Disney GLBs); preview generation separately blocked by another builder's unregistered `atomium-far.glb`. Own record, manifest and exports agree through conformance and deterministic QA; shared checks must be rerun once that work settles.

No app server, shared source edits beyond the authorized generated depth table, git writes or deployment performed. Independent visual review and both-mode app integration remain the lead's responsibility.

### Independent-review geometry corrections — b7a, 2026-10-13

Addressed review item 2: the blank 212–218 m collar now has seven small recessed arched windows per face, twenty solid buttresses with three rising setback stages, supported upper shoulder pinnacles, and twelve parapet pinnacles with square bases and stepped necks. Both LODs retain all these crown features, the copper pyramid, four corner tips and open lantern. All additions use existing merged materials; no new draw calls. Crown dimensions and Gothic profiles remain photo estimates rather than engineering measurements.

Compared `refs/2.jpg` (Lee Coursey's crown close-up) and the dossier reference sheet with fresh exported `tmp/top-cities/shots/one-atlantic-center/review-fix/one-atlantic-center-glb-{near,far}-{light,dark}-sheet.jpg`. The day sheets include opposite overview, roof and close crown; night sheets include roof and crown. The former blank collar is now broken into small openings and rising stone shoulders, with a serrated silhouette visible in far. Fine carved tracery remains simplified.

Costs before → after: near 34,014 → 36,574 triangles, 6 → 6 draws, 1,823,348 → 1,947,124 bytes; far 6,078 → 8,582 triangles, 6 → 6 draws, 314,764 → 435,508 bytes. Eight dedicated tests pass, including new observed collar glazing and stepped shoulder/pinnacle elevations. Fresh deterministic QA reports no issues, zero close-layered faces and 0.2% back-face hits; explicit existing ridge-terminal tests retain their detached negative control. Depth regeneration/check drops zero cycle edges. The catalog retry validates 336 entries / 592 variants.

Review item 1 remains the lead's application evidence task: unobstructed shaft/base/entrance and actual near-LOD captures in Cityscape and Full 3D world. This geometry correction does not establish footing, provider replacement or terrain lifecycle validity in either mode.

The required combined registry/dedicated run completed with **608/609 passing**, including all **18 dedicated checks** and all six registry checks for these two landmarks; the unrelated failure is `charles-bridge: footprint is a real polygon`. Log: `tmp/top-cities/one-atlantic-center/review-fix-tests.log`. Final catalog validation and `pnpm assets:preview` both passed (336 entries / 592 variants); depth freshness also passed after the documentation/catalog updates.
