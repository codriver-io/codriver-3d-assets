# SkyBridge — New Westminster–Surrey (1990)

Original procedural SkyTrain-only cable-stayed crossing over the Fraser River, authored in `src/peregrine/landmarks/top-cities/skybridge-vancouver/`. Its identifying features are the twin concrete H/portal pylons, open lower windows, recessed red upper panels, semi-fan stays and narrow two-track guideway. Near LOD includes the maintenance rails. Automobile pavement, HD road fitting and car navigation are N/A.

## Sources and frame

The supplied dossier and its bridge/deck reference photographs establish the main structure. [Atlas Anchor Systems](https://atlas-anchor.com/portfolio/translink-skybridge-surrey-bc/) gives 123 m towers, 340 m main span, 616 m crossing and trains approximately 45 m above the river. The [historical summary](https://en.wikipedia.org/wiki/SkyBridge_(TransLink)) gives revenue opening on 16 March 1990.

Geometry follows [OSM bridge outline 527265987](https://www.openstreetmap.org/way/527265987), paired outline-edge midpoints, and the continuation of Expo Line rail ways 923938536/923938537 into [Scott Road station building 689527849](https://www.openstreetmap.org/way/689527849). Station geometry and NW continuation were checked with small OSM map API extracts on 2026-10-15 after the queued Overpass helper could not reach its endpoints. Exact raw data lives in `tmp/top-cities/skybridge-vancouver/{osm.json,station-map.osm,nw-map.osm,station-rings.json}`. OSM data © OpenStreetMap contributors, ODbL 1.0.

Photo references: [SkyBridge sunset](https://commons.wikimedia.org/wiki/File:SkyBridge_sunset.jpg), JMV, CC BY 2.0; [SkyBridge from SkyTrain](https://commons.wikimedia.org/wiki/File:SkyBridge_from_SkyTrain_(5770458210).jpg), Richard Eriksson, CC BY 2.0; [SkyBridge over the Fraser](https://commons.wikimedia.org/wiki/File:Bridges_-_SkyTrain%27s_SkyBridge_over_the_Fraser_River.jpg), Mike, CC BY 2.0. The added [Scott Road station, February 2018](https://commons.wikimedia.org/wiki/File:Scott_Road_station,_February_2018.jpg), Northwest, CC BY-SA 4.0, establishes its green framing, pale glazing and elevated hall. These are visual references only; no photos, textures, scans or third-party meshes are shipped. Dossier photo 6 depicts another bridge and was excluded from structural comparison.

Origin `[-122.89616225,49.20537825]` is the central-span midpoint; real metres, +X east, +Y up, +Z south. Local Mercator latitude scale is removed once. Pylon bearing is approximately 110.3° NW→SE. Local y=0 is a nominal river/flat-ground datum, not surveyed altitude.

| Quantity | Model | Basis |
| --- | ---: | --- |
| Pylon top | 123 m | Published |
| Main span | 339.371 m | Mapped; within 0.7 m of published 340 m |
| Cable-supported structure | 616 m | Published |
| Whole authored centreline | 2185.786 m | Mapped bridge + Expo Line continuation |
| Added southeast continuation | 739.453 m | Mapped paired track ways |
| Main guideway top | 45 m | Published approximate train height used as visual datum |
| Endpoint profile | NW 35 m; former SE cut 26 m; station 12 m | Estimated; 1.9% added approach grade |
| Deck width | Central 11.1 m; NW 8.5 m; SE 6.9 m | Mapped/photo estimate |
| Upper red panel | y=87.5–121.3 m | Photo estimate |
| Stays | 112 near / 64 far | Simplified photo-inspired pattern |
| Near stay radius | 0.091 m | Visual estimate; 30% below previous 0.13 m |

## Review fixes and structural contacts

Review g9b identified exposed elevated rail cuts at both original boundaries. The SE guideway now follows the mapped Expo Line for another 739 m, continuously descending into the exact station hall footprint. The internal rail boundary is concealed inside the station enclosure; it does not stop visibly outside its facade. A simplified station base, opaque pale glazing, green roof and repeated structural frames supply a natural visibility boundary. The railway continues beyond the model inside this simplified hall; this is not an operational terminus or a surveyed station interior.

At the NW boundary, a battered concrete headwall, framed recessed portal and sloped earth embankment replace the bare end-pier appearance. The wall spreads from 13 m at its top to 32 m at grade; a bounded 73 m long earth wedge backs it. The dark recess meets the rail boundary. Cityscape reads as an embankment and portal; world mode lets the local bluff hide the buried mass. The portal is a compact authoring closure at the asset boundary; its dimensions are estimated, rather than a reconstruction of the complete New Westminster railway infrastructure.

Stays are mid-grey, 30% thinner near and also lighter/thinner far. Lower pylon leg sections are 20% wider below the deck, with the full underdeck crossbeam strengthened. Pylons, red panels, open H windows and semi-fan arrangement remain intact in both LODs.

All rail/parapet/girder ribbons, piers, cap/girder joints and stays have named support contacts. Additional terminal assertions require the rail boundary to lie inside the NW portal or station hall. Deliberately moving it out of each enclosure must fail; a deliberately shortened stay also fails. The previous SPEC.ready assertion was removed: release readiness is controlled separately by the lead.

`FOOTPRINTS` includes the original OSM outline, authored narrow guideway envelope, portal/embankment and footing envelopes, and the exact station/access rings. `OSM_WAYS` includes station 689527849 and adjacent station access ways **689527847 / 689527848**, removing the white provider blocks that intersected the station base. Their exact rings are copied from the existing dated OSM extract in `station-rings.json`. Neighboring bridges and roads remain provider-owned. Individual support pads plus the station/portal pad retain a shared river-pylon median datum with 2 m feathers; the 1700 m envelope radius does not flatten a large disc because explicit rings are present. The soil wedge and buried retaining batter deliberately do not expand this flatten mask: extending the flat river-datum pad over the bluff caused an excavation during the first g9br capture and was removed. Per-foot DEM residuals and terrain refinement remain untested.

## Scoped g9br fixes

The third review requested only station provider ownership, approach rail cost and the NW headwall/embankment. The mapped 739.453 m extension, station geometry, pylons, cables and central-span detail stay intact. Approach rails/reaction/maintenance strips use two triangles per segment, 12 cm proud near with checked depth ordering; far drops those sub-pixel approach overlays. Sleepers remain only over the 616 m cable-supported structure. Near `rail` falls from 31,560 to **9,708 triangles**; far has 1,632. Station undercroft reconstruction was outside this final scoped round; its simplified solid base remains.

## Verification and measured costs

Export: `pnpm build:top-cities-landmarks skybridge-vancouver --no-check`. Depth regeneration and `--check` pass, with zero dropped material-cycle edges. Deterministic exported QA reports no issues: zero layered/coplanar overlaps, zero back-face sweep hits, and all retained named members supported (including 112 near / 64 far stays). Evidence: `tmp/next-200/fix/g9br/skybridge-vancouver/qa-metrics.json`.

| Export | Before g9br tris / draws / KiB | After tris / draws / bytes / KiB |
| --- | --- | --- |
| Near | 53,412 / 9 / 2611.5 | 29,308 / 10 / 1,719,748 / 1679.4 |
| Far | 22,020 / 8 / 1038.8 | 16,604 / 9 / 822,028 / 802.8 |

Both fit the bridge limits (near 120k/40/4.5MB, far 30k/10/1.2MB). Near savings are 24,104 triangles and 954,424 bytes (932.1 KiB); the earth material adds one draw in each LOD. Bounds are approximately 2242.1 × 123.0 × 375.1 m, including the backed portal. Near/far station framing changes the eastern bound by 2.6 cm. These are uncompressed scene costs, not hardware measurements.

Inspected exported GLB contact sheets (one look-fix round, both LODs):

- `tmp/next-200/fix/g9br/skybridge-vancouver/sheet-near/skybridge-vancouver-glb-near-light-sheet.jpg`
- `tmp/next-200/fix/g9br/skybridge-vancouver/sheet-far/skybridge-vancouver-glb-far-light-sheet.jpg`

Both sheets show the battered NW portal and earth wedge, Scott Road entry, bridge overview and close pylon. They preserve the recognizable pylon/red-panel silhouette and show no exposed elevated guideway cuts. The original source/export and dark-palette evidence remains under `tmp/top-cities/shots/skybridge-vancouver/`; new endpoint dark app views are not tested.

App evidence: `tmp/next-200/fix/g9br/skybridge-vancouver/app/{city,world}/{far,near,northwest,southeast}.png`, with camera/active-LOD reports beside them. Far captures use the far GLB; near and close endpoint captures use near. Cityscape and Full 3D world are **verified for static loading, appearance, LODs and both enclosed endpoints**, using the final scratch bundle stamp recorded in `scratch.json`, protomaps from tiles.codriver.io and Terrarium z15 for world. The NW world view shows the abutment joining the bluff. Both SE views show uninterrupted rails into the station hall. `cleanup.json`). Shared `public/peregrine.js` was not rebuilt.

All **16 landmark tests** and the three final SkyBridge registry checks pass. The required full top-cities registry run completed with 827/831 passing: its four unrelated failures are invalid footprints and missing manifests for Palais Bourbon and Brandenburg Gate (being authored elsewhere in the shared tree). The whole-catalog check passed with 406 entries / 756 GLB variants before Brandenburg exports appeared; the final catalog, assets check and preview retries are blocked by the unrelated missing `docs/3d-top-cities-brandenburg-gate.md` (see `catalog-final.log`, `assets-check.log`, `preview.log`). Per-id export, depth and deterministic geometry checks pass. Logs are beside the app evidence.

Terrain-arrival/refinement, pad-edge stress, lifecycle/mode transitions, late/failed loads and device performance remain **not tested**. Static captures do not certify those behaviors. Independent re-review remains with the lead. No git writes or online deployments were performed; the only shared source regeneration is `src/peregrine/landmarks/depth-layers.js` through the required per-id depth command.
