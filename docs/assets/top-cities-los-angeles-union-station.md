# Los Angeles Union Station

Original procedural model of the present historic 1939 main terminal at 800 North Alameda Street, Los Angeles. The Parkinsons' Mission Moderne design combines white stucco, red clay tile roofs, Art Deco verticals, tall bronze-glazed arches and a square clock tower. From Alameda the three immense arches and the tower establish identity; at regional distance the tower rises from a long low tiled complex. No photo, scan, traced mesh or texture ships in the model.

## Sources and dimensions

- [Official station history](https://www.unionstationla.com/history/): 1939 completion, John and Donald Parkinson, Spanish Colonial / Mission Revival / Art Deco design.
- [Official historic guide](https://www.unionstationla.com/wp-content/uploads/2026/09/LAUS-union-station-historic-guide-english.pdf): 127-foot tower, four 12-foot brass clocks, lightning rod.
- [Official fact sheet](https://www.unionstationla.com/wp-content/uploads/2025/10/union-station-fact-sheet.pdf): ticket concourse 145 × 80 feet, roughly 61-foot ceiling and 43-foot windows; waiting room about 140 × 80 feet, nearly 30-foot windows. Interior room dimensions are not exterior wall envelopes.
- [OSM relation 1483140](https://www.openstreetmap.org/relation/1483140): the complete historic terminal outline, tagged height 39.1m. The dossier supplied tags but omitted relation geometry. Two attempts through the shared Overpass helper failed (504/500), so one OSM API relation/full request supplied the seven member ways and nodes; saved under ignored scratch.
- Photographic comparison: dossier `refs-sheet.jpg` and Commons images 2–6, credited in the catalog: ZhengZhou (CC BY-SA 3.0), Shesmax / Maxim Shesterikov (CC BY-SA 4.0). File titles and original URLs are recorded in the catalog. The historical platform/train photo is not a headhouse design reference.

| Feature | Model | Basis |
| --- | ---: | --- |
| Tower highest point | 38.71m | Official 127ft, rounded; preferred to OSM's 39.1m tag |
| Clock diameter | 3.6576m | Official 12ft; geometric brass tick circle |
| Tower lower shaft width | 8m | Photo estimate, centered at the mapped western projection |
| Shaft / shoulder / lantern | 31.3 / 32.1 / 35.7m | Photo estimates |
| Tower tile cap / rod tip | 37.45 / 38.71m | Estimated tier proportions, total constrained to official height |
| West hall outer plan | about 30.7 × 44.5m | Mapped envelope; includes wall and ancillary space |
| West hall eave / ridge | 17.5 / 20.92m | Photo estimate; official 61ft ceiling is interior |
| West arched windows | 6.9m wide, 13.1m high | Height based on official 43ft windows; width estimated |
| East-west hall eave / ridge | 15.4 / about 18.7m | Photo estimate |
| East concourse eave / ridge | 6.6 / about 8.6m | Estimated simplified rear massing |
| Facade axis | 10° east of north | OSM western wall control points; exported rotation −10° |

## Frame and ownership

Metres, +X east, +Y up, +Z south. Origin is `[-118.23615775695308, 34.05605795849651]`, near the historic hall junction. The source's station coordinates use a reproducible offset from the dossier anchor, then translate and rotate into the geographic frame. Rotation is baked into source vertices and the GLBs. Local y=0 is rigid pavement grade; no sea-level, DEM or Mercator scaling is baked in.

The joined outer ring replaces relation members **25599909, 25599912, 1409126587, 1409126585, 1409126584, 1264510636, 487844951**. Two additional authored rings cover the north and south patio planting envelopes; those are not additional OSM building ways. Separate layer-1 station canopies **1409126574** (southwest wing/frontage), **1409126588** (south patio) and **1409126586** (north wing) are also explicitly replaced; their full exact OSM rings are included. Train platform canopies, elevators and the Metropolitan Water District office building remain provider-owned. Cornices and simplified tiny outline returns can differ from the mapped ring by up to 1.5m, checked over every vertex.

The west-wall bearing is checked from the mapped long edge endpoints near station coordinates (−148.8, −143.3) and (−148.8, −98.3). Origin and the second orthogonal control use the nearly east-west boundary from (−117.5, −100.9) to (−70.3, −101.3). The authored rectangles simplify small service notches; the ownership polygon retains the original geographic coordinates.

## Geometry and materials

Punched wall slabs retain actual arch recesses and open arcade passages. Amber glass sits 0.55m inside the wall; bronze mullions sit forward within the reveal. Near and far retain individual window bays, the three great arches, the single vestibule entrance, all four clocks, paired open belfry arches, roofs and patio voids. Near adds mullions, tile courses and fuller palm fronds; far reduces arch segments and fronds and drops mullions/tile courses. Eight merged material draws in each level.

Subdued cream stucco, sandstone arch surrounds, brown-red tile, dark glazing, brass and green palms have matched light/dark palette keys. `glow` glazing uses a muted bronze/amber daytime colour and warm night colour; night illumination is illustrative. Eave thickness uses stucco to keep roof/wall depth ordering consistent. The crown's lightning rod meets the tiled cap and includes a shortened-end negative contact test.

Approximations: external hall heights, roof pitches, tower tier widths, rear concourse and roof forms, palm positions, office bay counts and most side/rear elevations. The model does not reproduce interiors, bronze grille ornament, signage, dense landscaping, fountain, site paving, platform sheds or the modern east gateway. Architectural surfaces are reconstructed; this is not a survey model. The full historical outline is owned, with minor service projections simplified inside that outline.

## Review correction (2026-10-15)

Independent review g11b found the 9.6m tower too broad, its rectangular glazed lantern too closed, the west hall eave too high, and a provider slab across the Fred Harvey wing. The shaft is now 8m wide, with shoulder/lantern/cap widths scaled by 5/6; the clock diameter and sourced 38.71m overall height are preserved. Each lantern face has two true through-arches 1.4m wide and 2.8m tall, retained in far. The west hall eave drops from 20.7m to 17.5m and ridge from 24.12m to 20.92m; facade pilasters drop with the eave. These widths and external heights remain photo estimates.

The white slab was not the station relation: the provider extruded separate `building=roof`, `layer=1` way 1409126574 as a five-metre solid volume; way 1409126588 similarly occupied the south patio. A single queued Overpass query supplied their current exact rings, saved in `tmp/next-200/fix/g11b/los-angeles-union-station/sw-osm.json`. Both way IDs and complete rings now belong to the model. Original thin cream canopy roofs (soffit 4.6m/top 4.84m, estimated) stand on individual grounded columns; open sides keep windows and passages visible. The neighboring 11-storey Metropolitan Water District office is deliberately retained. Provider evidence is `provider.json` and `provider.mvt` under that same scratch directory; the Protomaps feature IDs are grouped tile identifiers, not OSM way IDs.

## Prior g11b export and verification

Evidence root: `tmp/next-200/fix/g11b/los-angeles-union-station/`. Two exported-GLB look/fix rounds were used. Final sheets `sheets/los-angeles-union-station-glb-near-light-sheet.jpg` (overview, west facade, east facade, roof, street, clock detail) and `sheets/los-angeles-union-station-glb-far-light-sheet.jpg` (overview, facade, detail) were opened and compared to the dossier photos. `sheets/reference-export-comparison.jpg` places the references beside the final near/far model. The tower now reads slender above the lowered roof; paired arched belfry voids and far window rhythm remain visible.

| Detail | Before triangles / draws / KiB | After triangles / draws / KiB |
| --- | ---: | ---: |
| Near | 16,770 / 8 / 953.3 | 17,662 / 8 / 1015.3 |
| Far | 7,090 / 8 / 428.8 | 7,726 / 8 / 471.2 |

No texture or road-lift attributes; both LODs share complete bounds and tower height. The additional cost is genuine open arch wall geometry and two supported canopy roofs. QA metrics and depth checks are recorded in the evidence root. Build: `pnpm build:top-cities-landmarks los-angeles-union-station --no-check`; regenerate/check depth with `node scripts/landmark-depth-layers.mjs --ids los-angeles-union-station` and `--check`.

The focused eight tests cover sourced height/grade, glass arches and piers, four clocks, shaft width, paired through-belfry arches and curved heads, courtyard/arcade voids, lowered roof heights, complete LOD bounds, every-vertex footprint containment, rod/cap contact with a shortened-end negative case, and every canopy column's grounded shaft/soffit contact and open passages. Registry conformance and catalog validation are recorded alongside the final app results below.

Runtime QA uses a scratch `/tmp` bundle, never shared `public/peregrine.js`, on slot M (Cityscape 3318, world 3320). `scratch.json` records the source stamp and server PIDs. App far/near/street captures are under `app/city/` and `app/world/`; both modes load far and near GLBs successfully. Snapshot placement/provider/shading checks do not certify late terrain, failure recovery, reanchor, repeated mode switching, device performance or deployment. No git writes or staging publication were performed.

Static app inspection: **Cityscape verified** and **Full 3D world verified** for the captured placement/shading/LOD/provider-replacement views only. `app-sheet.jpg` was opened and all six frames judged; the full world street PNG was also opened. Southwest and south-patio canopies now have open sides and grounded columns instead of solid provider slabs, the taller-looking clock tower and lantern holes remain clear, and no visible foundation gap appears on this flat site. The nearby office block remains present. Provider: Protomaps `https://tiles.codriver.io`; world: AWS Terrarium z15; scratch source stamp `aab8c2c90839` (2026-10-15 shared-tree snapshot, before a manifest-note-only edit). The snapshot is not a committed release; `scratch.json` gives both server PIDs and `cleanup.json` records their termination by PID. Authentication/CORS and ancillary service errors in the capture logs did not prevent landmark/tile loading.

Final geometry QA: no issues, zero layered faces in both LODs, zero near coplanar pairs, zero depth-cycle edges, zero near back-face hits (189 outside-in rays), no below-grade vertices. Exact GLB bytes: near 1,039,632; far 482,536. Export metadata refresh did not change geometry or bytes. Remaining approximation: unsurveyed exterior heights, canopy finish/height and regularized column spacing, rear massing and minor facade ornament; independent re-review remains required. Tests and shared-catalog results are recorded in `REPORT.md` under the evidence root.

Final requested registry run: **831/831 passed**, including all three Union Station checks (`conformance-final.log`); own focused tests **8/8 passed** (`focused-tests.log`). The earlier registry run had transient failures in Edmonton City Hall and Arena Națională while other workers edited their exports; the final run is clean. Global catalog/check/preview initially failed on the missing `docs/3d-top-cities-edmonton-city-hall.md`; final retry results are in the evidence report.

## Scoped north-wing canopy correction (g11br, 2026-10-15)

The third review found the north counterpart of the southwest provider slab hiding the lower arched windows. A single bounded queued Overpass roof query identified **way 1409126586** (`building=roof`, `layer=1`); its complete exact ring is now in `OSM_WAYS`/`FOOTPRINTS` and the authored canopy list. The north roof uses the existing canopy construction: 24cm cream roof, underside at 4.6m, fourteen 44cm square columns from local grade to the soffit, including the mapped extension beyond the north wing. Lower windows and spaces between columns remain open in both LODs. Height and regularized column locations remain estimates. The tiny separate entrance roof way 443287377 is outside this north-wing correction; the existing south canopies, tower, hall, cap and finial are unchanged.

Evidence and validation for this scoped correction are recorded in `tmp/next-200/fix/g11br/los-angeles-union-station/REPORT.md`; earlier g11b evidence describes the previous export. Focused geometry checks now also pin every new column/soffit contact, the open north passage and the exposed lower window panes in both LODs.

Current g11br export costs (default GLB scenes):

| Detail | Before triangles / draws / KiB | After triangles / draws / KiB | After bytes |
| --- | ---: | ---: | ---: |
| Near | 17,662 / 8 / 1015.3 | 17,898 / 8 / 1029.3 | 1,054,012 |
| Far | 7,726 / 8 / 471.2 | 7,962 / 8 / 485.3 | 496,912 |

One exported-GLB look iteration (near/far sheets in `sheets/`) was opened; zero layered faces, near coplanar pairs, back-face hits, below-grade vertices or depth-cycle edges. Standard `pnpm build:top-cities-landmarks los-angeles-union-station --no-check` succeeded after the sibling import settled; an equivalent isolated copy of the exporter in the evidence root had provided the first export while that import was unavailable. Focused tests passed 8/8. The final depth-table check passed. Shared registry/catalog/preview outcomes are recorded in the report, including concurrent sibling failures.

**Cityscape: verified** and **Full 3D world: verified**, limited to north-wing near/street static provider replacement and shading. All four app frames and `app-sheet.jpg` were opened, including both full street PNGs: thin cream canopy, exposed lower windows, supported columns, and no remaining north-wing provider wall. Protomaps tiles.codriver.io and AWS Terrarium z15; scratch stamp `9b46b9c2d32c`, slot M ports3318/3320. `scratch.json` records the `/tmp` root and PIDs10463/10464; `cleanup.json` records termination by exact PID, with ports3318–3321 confirmed free afterward. Auth/CORS and ancillary 404/503 errors remain in app reports; landmark active/loaded is true and downloads zero in every frame. Shared `public/peregrine.js` was not rebuilt, and no git write occurred.

The cap/finial and front parapet suggestions were deliberately left unchanged by this final round's explicit north-canopy-only scope. Existing unsurveyed geometry approximations and untested lifecycle/device cases remain as documented above; independent re-review remains required.

Final scoped-check outcome: own tests **8/8**, all **3 Union Station registry conformance checks passed**; shared registry totals **833/835**, with the two failures belonging to the concurrently edited Palais du Luxembourg (near triangle budget and stale GLB/source bounds). Global catalog/check/preview retries remain blocked by siblings; latest catalog and preview runs fail because the Parthenon Nashville document is not yet present. No sibling files were modified.
