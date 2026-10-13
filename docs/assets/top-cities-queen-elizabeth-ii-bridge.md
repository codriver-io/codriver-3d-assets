# Queen Elizabeth II Bridge (Dartford Crossing)

Original procedural model of the 1991 A282 southbound crossing between Thurrock and Dartford. The four lanes share one undivided roadway; northbound traffic uses the separate tunnels, which this asset does not replace. Editable source is `src/peregrine/landmarks/top-cities/queen-elizabeth-ii-bridge/`; exports are `public/models/bridges/queen-elizabeth-ii-bridge-{near,far}.glb` and the adjacent manifest. `SPEC.ready=true` enables the existing registry bridge layer.

## Dimensions and sources

| Feature | Model | Basis |
| --- | ---: | --- |
| Main span | 450 m | Published construction account |
| Crown height | 137 m | National Highways |
| Concrete/steel tower portions | 53 / 84 m | National Highways |
| Cable-stayed section | 812 m | Construction account; 181 m approach spans each side |
| Physical bridge alignment | 2906.45 m | OSM roadway way 20003982; published crossing length 2872 m has different endpoints |
| Deck width | 20.6 m | Estimate from mapped envelope 467163604, not a survey or aerial measurement |
| Undivided road | 15.8 m, four lanes | Width estimate calibrated to roadway photo; lane count published and OSM |
| Tower deck / crest | 53 / 61 m | Approximate authored datum, not charted navigational clearance |
| Plate girder depth | 2 m main; 2.6 m approaches | Construction account |
| Flat ramp grades | 4.61% north / 4.67% south | Derived from mapped ramp lengths, with 25 m flat feet inside the physical abutments and 60 m vertical curves |
| Pylon spacing across road | 18.3 m | Photo/envelope estimate |
| Stay inventory | 112 near, 48 far | 14 per half-fan near; photographic interpretation rather than an engineering inventory |
| Approach piers | 21 north / 18 south, plus four backspan supports | North count published; south count and all individual stations estimated |

Sources checked 2026-10-13:

- [National Highways anniversary statement](https://www.gov.uk/government/news/the-queen-elizabeth-ii-bridge-at-dartford-celebrates-30-years-of-connecting-essex-and-kent): opening, total height and concrete/steel portions.
- [Cleveland Bridge construction account, reproduced by New Steel Construction](https://www.newsteelconstruction.com/wp/20-years-ago-the-dartford-bridge/): span, deck construction, four southbound lanes, viaducts and modified harp arrangement. Its 57.5 m design clearance and other sources' 60–65 m deck heights use different datums; this model does not establish maritime headroom.
- [OSM road way 20003982](https://www.openstreetmap.org/way/20003982) and [bridge envelope 467163604](https://www.openstreetmap.org/way/467163604): supplied dossier snapshot dated 2026-10-13.
- [Amanda Slater, June 15th. Queen Elizabeth II Bridge](https://commons.wikimedia.org/wiki/File:June_15th._Queen_Elizabeth_II_Bridge.jpg), CC BY-SA 2.0, licence checked: independent slender box masts, edge stays, road and lighting. Government anniversary photograph and dossier Diliff panorama also inspected, retained only in ignored scratch. No photos, textures, third-party meshes or scans ship.

## Geometry and placement

Metres east/up/south around `[0.25861,51.46472]`. The mapped north-to-south alignment supplies every slab, pylon, support, cable anchor and navigation query. It includes ordinary approach ways 693074242 and 244897935: 145.994 m beyond the north physical abutment and 120.488 m beyond the south, for a total 3172.936 m frame. This lets the runtime sample the connected ordinary roads instead of the generic bridge lift. The northern pylon is centred on the mapped envelope's widened station `[0.2604473,51.4665213]`; the southern pylon is 450 m farther along. Both have open space between separate columns; the below-deck crosshead does not close the upper portal. The steel masts taper subtly above 53 m. Near includes mast seams, anchorage blocks, edge guardrails, regular light columns and three dashed lane dividers. Far keeps the twin columns, navigation opening, all major piers, deck profile, outer cable reaches and a representative harp pattern. Small fallback paint overlays are dropped in far; live HD paint remains the provider’s. Far stay radius 0.36 m is deliberately larger than near 0.085 m for distance visibility.

The shallow composite slab, five approach plate girders and two main edge girders follow the same station profile. Approach structures begin only once the ramp clears local grade; the lowest approach portions are ground ramps. No navigation-channel pier is invented. Paint is 0.12 m above fallback asphalt. The landmark runtime removes fallback paint triangles covered by actual HD pavement, keeping the provider lane positions and dash rhythm even with HD paint switched off. Missing coverage, HD-off and tile unloading restore the original paint indices; the index buffers retain their allocated capacity. Coverage is cached by model, road replacement version and active HD state, so unchanged per-frame synchronization performs no mask work. Kerbs use a separate material from the lower slab to prevent a concrete/asphalt ordering cycle. The muted concrete, grey steel and galvanised cables have corresponding night palettes and self-lit lamp heads.

Over 100 m at the physical north landing, the deck narrows from 20.6 m to 18 m and the road from 15.8 m to 14.8 m. At the south landing it widens to 24.4 m / 22.2 m to join OSM’s six-lane approach. The river span remains rigid. Pavement/paint ownership is restricted to the physical bridge: ordinary-road extensions preserve provider pavement and paint. Rails terminate at the physical abutments, joining the ordinary roadway outside its mapped driving width. Kerbs and rails follow that taper and terminal posts connect them to the kerb. The structural steel deck retains its authored lateral width (`fittedLateral` identity), rather than squeezing to incomplete HD samples. Public footpaths are absent, matching OSM's pedestrian prohibition. Short maintenance margins are represented by the raised edges; under-deck inspection walkways and buried caissons are omitted.

Cityscape uses zero-height grade feet and the 53/61/53 m river profile. Full 3D world uses the shared `absolute-deck` policy, actual DEM contacts under each support and the existing transverse approach terrain clamp. A landmark-owned 200 m physical-abutment blend joins each landing to the DEM across its width, then eases to the unchanged absolute span. The structure, HD pavement/paint overlays and height queries share that correction. The model refit is cached by model, ground and surface version, so unchanged per-frame synchronization does not rewrite geometry. No terrain, sea bed or Mercator scale is baked into either GLB. Missing terrain keeps the layer hidden until valid samples arrive. The focused test verifies that removal restores immutable authoring coordinates.

## Export and verification

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 83,202 | 23 | 2,832,044 | 2765.67 |
| Far | 24,184 | 8 | 877,924 | 857.35 |

Both variants fit the bridge caps (120k/40/4.5MB and 30k/10/1.2MB). Their bounds agree exactly: approximately `[-893.45,0,-1345.36]` to `[572.31,137,1117.46]`. Geometry is batched in three station chunks near and one far. HD overlay costs are separate; hardware timing is not measured.

I opened and judged `tmp/top-cities/queen-elizabeth-ii-bridge/delivery-reference-export-sheet.jpg`: roadway/government photos above near light, near dark, far light and far dark exported-GLB sheets. The light near sheet includes overview, opposite sides, overhead, deck, tower, stay-anchor detail and underside. This showed the correct independent mast portal and harp cables. Verification found and corrected negative approach girder/cap geometry, separated kerb/slab material ordering, and moved the stay ends to the actual tapered pylon faces. The final depth table has **zero dropped cycle edges**. The geographic frame includes ordinary-road extensions; authored geometry ends at physical abutments. Pylon footings and the six-lane southern landing flare extend beyond the narrow mapped deck envelope deliberately; the overhead sheet’s red OSM outline agrees with the road axis.

The original ten focused tests check observable tower/span dimensions, open portals, four continuous lane centres, clear navigation span, every generated stay/rail/post/light/crossbeam terminal against its named support with the member excluded, a deliberately disconnected stay, ordinary-road endpoint lift rejection, OSM heading ownership, off-road rejection, immutable terrain restoration and exported GLB bounds/normals/materials/attachment attributes. The support contact tolerance is 0.2 m for finite-width embedded beam ends, with a 1 m shortened negative case. The world regression uses a transverse DEM and checks both LODs, pavement/query agreement, heading symmetry, repeated fitting, per-frame fit caching and terrain removal. No runtime module is imported by published authoring source except the permitted shared bridge authoring helpers.

Commands: `pnpm build:top-cities-landmarks queen-elizabeth-ii-bridge --no-check`; `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/queen-elizabeth-ii-bridge/queen-elizabeth-ii-bridge.test.js`; `node scripts/asset-catalog.mjs`; `node scripts/landmark-depth-layers.mjs --ids queen-elizabeth-ii-bridge --check`; `pnpm assets:preview`; `pnpm build:peregrine`. The combined acceptance command passed **595/595 tests**, including all ten landmark tests and the registry/export checks; the catalog validates 336 entries / 580 variants. Asset metric QA reports `ok`; both export budgets and silhouette bounds pass. App capture evidence is recorded below.

## Application checks

Initial fallback captures in `tmp/top-cities/queen-elizabeth-ii-bridge/approaches/` include both grade landings and both inner approaches in both headings and both modes. All 18 views loaded the near landmark; world had valid terrain and the normal unlit/vertex-shaded app path. The first general street view at midspan was below the elevated deck and was rejected as insufficient evidence; the targeted approach cameras avoid that framing problem.

Final app evidence is recorded after the terrain landing and HD paint fixes; earlier fallback and failed-fit captures remain in ignored scratch for audit. The ordinary-road frame extensions return null from landmark `heightAt`, preserving provider ownership.

The optional additional geographic query used the lead's shared Overpass helper once and timed out with HTTP 504. The original dossier remains authoritative. Local HD QA uses that actual OSM snapshot encoded by the standard `compactLanes` server function into a disposable Redis cache, without fabricating lane geometry; requests outside the dossier coverage are blocked in the browser. This is a reproducible snapshot check, not a claim of fresh live Overpass coverage. Synthetic demo grant is the repository's normal QA mechanism; account API/CORS errors are unrelated to asset loading.

Full route/car/traffic/camera driving, lifecycle stress tests, other providers and Tesla hardware remain separate integration checks. Independent reviewer acceptance remains pending.

## Final local integration evidence

Final bundle **8b13768bfc62**, source/GLBs after all landing fixes, 2026-10-13. I opened and judged the 16 approach images in `tmp/top-cities/queen-elizabeth-ii-bridge/approaches-final-world-fit/approaches-sheet.jpg`, plus the unobstructed world north/south and Cityscape north/south individual PNGs. There are 18 final captures total: overview and both physical approaches/inner approaches in both headings, in both modes. Each loaded the near bridge with live normal-renderer HD overlays; the observed overlay draw count was 4–10, separate from the model draws. Both Cityscape and world now show continuous pavement/paint, the north four-lane join and widened southern six-lane join; the north terrain step from the outer-road datum is resolved by the 200 m physical landing blend. Ordinary roads remain provider-owned. The current statuses are **Cityscape verified locally** and **Full 3D world verified locally**, using the declared OSM snapshot and Terrarium terrain; independent review remains pending.

`approaches-final-world-fit/report.json` records all view/terrain/LOD/HD states and the following actual `window.__map.landmarks.heightAt` values, metres above queried local ground; forward and reverse headings agree in all 18 captures:

| Station in the 3172.936 m frame | Cityscape | World |
| --- | ---: | ---: |
| North ordinary-road frame foot | null (provider-owned) | null (provider-owned) |
| North ordinary approach 40 | null (provider-owned) | null (provider-owned) |
| North physical ramp 200 | 0.323 | 2.019 |
| North inner approach 400 | 9.167 | 18.975 |
| North pylon 1381.51 | 53.000 | 50.781 |
| Midspan 1606.51 | 61.000 | 61.666 |
| South pylon 1831.51 | 53.000 | 54.153 |
| South inner approach L−400 | 10.475 | 11.643 |
| South physical ramp L−200 | 1.155 | 0.805 |
| South ordinary approach L−40 | null (provider-owned) | null (provider-owned) |
| South ordinary-road frame foot | null (provider-owned) | null (provider-owned) |

The separate `mapped-height-audit/report.json` probes all **35 alignment vertices**, including **28 physical bridge vertices**, in both modes and both headings: all 28 physical vertices return non-null heights, all seven ordinary-road vertices return null, and heading pairs agree. Off-corridor `[0.25861,51.46]` also returns null. Each world capture measured **564 footing-bottom vertices** against its actual resident DEM, with residual range **−0.000000242 to +0.000000202 m**; this is a numerical contact check, not a survey accuracy claim. No bridge corridor terrain flattening is requested. Physical landing edge geometry and navigation are covered by the transverse-DEM regression in both LODs.

The original acceptance run is retained in `cache-final-tests.txt`: **595/595 pass** (ten landmark tests); catalog 336 records /580 variants valid; export metrics within budget; depth table current and zero material-cycle edges; `pnpm assets:preview` and renderer build pass. No shared runtime source is modified. Active routed car/traffic/camera driving and Tesla hardware timing remain not tested.

## b8b duplicate-paint correction (2026-10-13)

Merged `origin/gauthiergarnier/top-cities` at `a0e59a3d` before fixing the review finding. The landmark now masks authored paint triangles only where actual, active HD pavement covers all three vertices. This removes the competing dash rhythm and offset dividers without changing the provider's lane positions, dash phase, paint toggle or terrain surface. Uncovered triangles remain fallback; HD-off, unloaded/hidden pavement and replacement LODs restore immutable indices in the existing GPU buffers. The mask is cached across unchanged frames and theme switches. Neither geometry, road ownership nor navigation heights changed.

There are 42 fresh PNGs in `tmp/top-cities/queen-elizabeth-ii-bridge/review-fix/app/`: 36 overview/landing/inner-approach views (both ends, headings, modes and near/far LODs), and HD paint-off, HD-off/fallback-only and HD dark-theme views in each mode. I opened and judged `near-approaches-sheet.jpg`, `far-approaches-sheet.jpg`, `landings-sheet.jpg`, and full-size north approach/paint-off/fallback images. Both modes show one provider dash rhythm; paint-off shows blank HD pavement, and HD-off restores the authored rhythm. The adjacent tunnel-road gap remains outside ownership. The exported near-light and far-dark GLB sheets under `review-fix/glb/` retain the accepted pylon/stay silhouette.

`app/report.json` records each runtime state: all 36 views active with 4–10 overlay draws, correct LOD and matching forward/reverse height probes; all world views have valid terrain and 564 footing contacts with maximum DEM residual below 0.000001 m. The physical north inner approach query remains 9.167 m in Cityscape /18.975 m in world; south 10.475 m /11.643–11.710 m depending on resident terrain arrival. Ordinary-road extensions and off-corridor probes remain null. This is contact with the resident DEM, not survey accuracy.

All **611/611** registry/landmark tests pass, including **12 owned tests**. New regressions exercise actual triangle removal, partial-coverage preservation, unload/HD-off/hidden-overlay restoration, unchanged GPU buffer capacity, theme/frame caching and asynchronous near/far replacement. Catalog validation: 336 entries /608 variants; depth table current with zero cycles; exports and `assets:preview` pass. Re-exported GLBs are byte-identical: near **83,202 triangles /23 draws /2,832,044 bytes (2765.67 KiB)** and far **24,184 /8 /877,924 bytes (857.35 KiB)**, before = after. Masking reduces drawn fallback triangles without adding runtime draws.

The shared launcher setup/doctor/up/check commands all rejected the missing pinned universal-local-dev 1.1.0 executable; the assigned native QA slots were used instead. Renderer output is kept in ignored QA scratch and excluded from the landmark commit; the lead must rebuild the bundle after merging. Independent re-review, fresh upstream Overpass, active route/car/traffic/camera driving and Tesla hardware timing remain separate checks.
