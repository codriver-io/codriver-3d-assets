# Kansas City Union Station

Original procedural model of Jarvis Hunt’s 1914 Beaux-Arts station, 30 West Pershing Road, Kansas City, Missouri. The three enormous arches toward Pershing Road and the Liberty Memorial hill identify it at street and regional scale. The front faces SSE, rather than north: the north waiting hall extends away from Pershing behind the headhouse. No historic train shed reconstruction, temporary event installations, exterior texture or third-party mesh is included.

## Evidence and dimensions

Sources checked 2026-10-15: [official station overview](https://unionstation.org/about-union-station-kansas-city/), [official history](https://unionstation.org/100-years-of-kansas-city-history/), [station identity](https://en.wikipedia.org/wiki/Kansas_City_Union_Station), [OSM station outline](https://www.openstreetmap.org/way/23770231), and [John LeCoque’s exterior photograph from Liberty Memorial](https://commons.wikimedia.org/wiki/File:KCUnionStation.jpg). Commons explicitly identifies LeCoque’s photograph as public domain; it remains in ignored reference scratch. Daderot’s two dossier photographs (public domain) establish the tall arch proportions, interior clock and limestone colour. No photograph is redistributed in the asset.

| Item | Metres | Basis |
| --- | ---: | --- |
| Grand Hall interior ceiling | 28.956 | Official 95 feet; retained as a source constraint |
| Clock dial diameter | 1.8288 | Official six feet |
| Central hall mapped width / depth | 64 / 46 | OSM building part 1214640382 and station frontage, rounded |
| Principal headhouse frontage | 154.5 | OSM, approximately u=-80.5 to +74; west annex extends to -113 |
| Northern waiting-hall length | 128.3 | OSM north extension, from v=-22 to -150.3 |
| Exterior parapet / roof crown | 31.8 / 32.8 | Photo estimate; no surveyed external height available |
| Triple opening width / crown | 12.5 / 25.65 | Photo estimate |
| Low wing roof / parapet | 16.8 / 18 | Photo estimate |
| Waiting hall eaves / ridge | 21.6 / 25.4 | Photo estimate |

## Geographic frame and ownership

Origin `[-94.5853,39.0848]`, real metres east/up/south, local y=0 at station grade. The plan u axis follows the long facade at bearing 72°, with v toward the SSE forecourt (162°). Rotation -18° from east toward south is baked into all source geometry and GLBs. Controls `[-94.5857761,39.0848896]` and `[-94.5850679,39.085067]` form the central part’s north long edge; its opposite long edge `[-94.5856463,39.0845776]` to `[-94.5849382,39.084755]` agrees. No host rotation, latitude stretch or elevation should be baked again.

`FOOTPRINTS` owns station 23770231, all four building parts 1214640380–1214640383 and the modelled Arvin Gottlieb Planetarium 183370431. Office 183369915 and parking deck 538856003 remain provider-owned. Wings and service annexes use rounded mapped outlines; minor notches, roof machinery and the complete internal plan are simplified. The terrain pad uses these bounded rings and median entrance references, with 12 m feathering; no broad plaza or Memorial hill is flattened by authoring geometry. This pad is a placement proposal, not terrain verification.

## Model decisions and limitations

Six merged materials give muted limestone with modelled trim, dark recessed iron/glass, grey metal roofs, foundation stone and an unshaded clock dial. True arched holes in the tall hall walls preserve recessed glazing; separate iron mullions follow the arch profiles. Four pilasters, projecting cornice, dentils and near-only limestone joints reinforce the facade. Three rows of individually punched wing windows, raised roof monitors and arched north-hall windows remain in far. Low western service masses and the faceted planetarium dome complete the mapped silhouette. The parapet is flat while the shallow roof sits behind it.

The six-foot interior clock is represented schematically in the central glazed recess so its dial can be seen; this is not a surveyed exterior clock placement or an interior reconstruction. Lettering, carved reliefs, rooms, chandeliers, plaza paving, fountains, trees, train platforms, roads and Liberty Memorial hill are omitted. Rear/service architecture is lower detail than the principal frontage. Canopies in near are grounded on two posts each and embed in their entrance wall; far drops them. No bridge or cable geometry exists.

## Verification and delivery

Source contact sheet inspected: `tmp/top-cities/shots/union-station-kansas-city/source/union-station-kansas-city-procedural-near-light-sheet.jpg` (overview, front, back, roof, entrance, close detail, plan). The first inspection exposed reversed northern glazing; the winding was corrected, then limestone joints, cornice dentils and supported entrance canopies were refined. Exported near/far and light/dark contact-sheet evidence is recorded below after the final round-trip review.

Build: `pnpm build:top-cities-landmarks union-station-kansas-city --no-check`. Focused tests pin hall bounds, three recessed arch openings, north-hall roof and window bays, wing window rows, six-foot dial, canopy/support contact with a deliberately shortened negative control, footprint bounds and exact ownership. No full application test suite, app server, deploy or git mutation is performed by this worker.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Lead app captures and independent review remain required; no inspector sheet establishes provider replacement, terrain contacts, lifecycle behaviour or device performance.

Final exported contact sheet judged against LeCoque’s exterior: `tmp/top-cities/shots/union-station-kansas-city/reference-export-comparison.jpg`. It includes GLB front/back/roof/entrance/detail, near/far, light/dark alongside the photo; the separate final sheets live in `final-near-light/`, `final-far-light/`, `final-near-dark/`, `final-far-dark/` below that same shots directory. Plan alignment was also inspected in the seven-view near/light sheet. The arches dominate both LODs; glazing is recessed, northern window bays are visible from outside, roof/end normals are closed where exposed, and the silhouette remains identical. Architectural trim shares the limestone material to remove mutual depth relations; an internal north-hall gable was removed where it met the Grand Hall wall, and entrance steps share limestone to eliminate close cross-material stair layers.

Final measured costs (default exported scene): near **8,113 triangles / 6 draws / 451 KB**; far **3,173 triangles / 6 draws / 187 KB**, no removable bridgeLift. Deterministic QA reports no issues, no below-grade mass and no unresolved material cycles; six dedicated landmark tests pass in under one second. `SPEC.ready` is true for asset delivery, with runtime integration still unverified.

Final command results: the requested combined test command completed with **894/895 passing**; every Union Station check passed (three shared conformance cases plus six dedicated tests). The sole failure is another builder’s in-progress `tour-1000-de-la-gauchetiere` catalog/spec readiness mismatch (`top-cities.test.js:56`), outside this worker’s ownership; see `tmp/top-cities/union-station-kansas-city/final-tests.log`. A separate target-filtered run passed all nine checks. `node scripts/asset-catalog.mjs` passed with 425 entries / 832 GLB variants; `node scripts/landmark-depth-layers.mjs --ids union-station-kansas-city --check` passed, with zero cycle edges dropped. The final QA metrics are in `tmp/top-cities/union-station-kansas-city/qa-metrics.json` (no issues, zero coplanar area, 0% backface hits).
