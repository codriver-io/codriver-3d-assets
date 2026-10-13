# Woodrow Wilson Bridge

Original procedural model of the current twin replacement I-95/I-495 bridges, opened 2006/2008, between Alexandria, Virginia and Oxon Hill, Maryland. Eight bascule leaves are fixed closed for driving; this is not the demolished 1961 bridge. Source lives in `src/peregrine/landmarks/top-cities/woodrow-wilson-bridge/`; exports live in `public/models/bridges/woodrow-wilson-bridge-{near,far}.glb`.

## Sources and dimensions

[H&H, the bascule designer](https://www.hardestyhanover.com/projects/new-woodrow-wilson-bridge-bascule-design/) gives four parallel double-leaf spans, 270 ft between trunnions, 222 ft movable spans, 175 ft horizontal clearance and 70 ft closed vertical clearance. [American Bridge, the contractor](https://americanbridge.net/featured-projects/woodrow-wilson-bascule-spans-maryland-approaches/) gives the 124 ft inner-loop deck with pedestrian path, 110 ft outer-loop deck, 144.5 ft flanking spans and nine lines of four Maryland arch piers. [FHWA case study](https://fhwaapps.fhwa.dot.gov/planworkst/Reference/CaseStudy/8) identifies the V-shaped piers and twelve-lane twin configuration. The supplied Wikipedia 6736 ft length is not used as the current structural length; current design references describe approximately 6000/6075 ft.

| Dimension | Model | Basis |
| --- | ---: | --- |
| Trunnion centre spacing | 82.296 m | Sourced 270 ft |
| Twin decks | 37.7952 / 33.528 m | Sourced 124 / 110 ft |
| Gap | 4.572 m | 249 ft overall minus 234 ft decks |
| Navigation clearance at centre | 21.336 m | Sourced 70 ft |
| Road crest datum | 24 m | Estimated clearance plus deck/girder section |
| Mapped model length | 1900.965 m, approach-inclusive | Supplied OSM four-roadway extract |
| Flat-map approach lengths | 350 / 330 m | Estimated, 30 m vertical curves |
| Maximum flat-map grade | 7.5 / 8.0% | 24/(ramp length−30 m) |
| Control house height | about 33 m | Estimated from Antony-22 photo |
| Virginia / Maryland V support lines | 7 / 9 | Maryland count sourced; station spacing estimated |

Geographic anchor `[-77.037669,38.7927185]` lies at the mapped bascule centre. Geometry is local metres east/up/south with orientation baked once; no Mercator stretch or DEM is baked. Twenty metres of each connected approach are included beyond the outermost OSM roadway endpoints (about 1861 m roadway crossing plus 40 m blending). This transverse-cut extension owns all skewed carriageway endpoints; it is not additional structural bridge length. Four OSM lane centrelines are averaged for a common structural frame, then individually projected for local/express pavement ribbons. Every mapped motorway way is retained in `woodrow-wilson-bridge-alignment.js`. The median control house uses exact OSM building way [232949254](https://www.openstreetmap.org/way/232949254); its ring alone is in `FOOTPRINTS`, with the road layer masking provider bridge geometry. The shared Overpass query returned no mapped bridge-support ways. Saved roadway extract is in ignored `tmp/top-cities/woodrow-wilson-bridge/osm-roads.json`.

## Geometry and approximation

Each concrete V support has two closed tapered longitudinal concrete webs beneath each of two ribs per deck. The webs broaden from a 2.6 m stem to 4.7 m at the girder seats; their solid shoulders retain a deep triangular throat with a rounded lower corner in both LODs. These profiles are photographic estimates, not surveyed structural sections. Four parallel bascule roadways each retain two closed leaf bodies, deep tapered girder ends, machinery chambers and open warning portals. Concrete/girder/steel colours are subdued cream-grey from photographs, with dimmer night palettes and small lamp heads. The northern pedestrian trail, parapets, local/express medians and two-arm lamps distinguish the broad deck from an ordinary freeway viaduct. The supplied OSM snapshot tags each direction as three local plus two express lanes; fallback paint follows that current mapped layout within the published twelve-lane-capacity structure. The original generator contains no image data or third-party mesh.

The final 160 m of each landing tapers the surface and kerbs to four separately mapped SD road ribbons; river spans retain the published deck widths. Rigid lateral fitting prevents incomplete HD samples from shrinking the structure. Full 3D world uses `absolute-deck` and per-vertex approach terrain clamps rather than flattening the river corridor. Footings attach to terrain through `bridgeLift`; structural tops follow the road. V curvature, pier stations, small equipment and the asymmetric leaning glass operator house are visual estimates. No operational drawbridge animation, structural analysis or Tesla hardware performance claim.

Reference-only dossier photographs: MarylandGeoffrey, *Woodrow Wilson Bridge* (CC BY-SA 4.0); Antony-22, tower and boundary photographs (CC BY-SA 4.0); Gary Covington, *Wooddrow Wilson Bridge* (CC BY-SA 3.0); Jeremy Basdeo, *Woodrow Wilson Bridge Open* (CC BY-SA 4.0). Commons links and provenance are in the catalog; no photographs are shipped.

## Verification

Measured exports: near **70,670 triangles / 26 draws / 2,398,120 bytes (2341.9 KiB)**; far **24,548 / 7 / 835,308 bytes (815.7 KiB)**. Both retain the same silhouette and stay below the 120k/40/4.5 MB and 30k/10/1.2 MB bridge caps. Deterministic GLB QA reports `ok`, including the outside-in back-face sweep, with zero material-cycle edges after regeneration.

I inspected all seven views (overview, facade, roof, deck, underside, tower, back) in the exported near/far, light/dark contact sheets under `tmp/top-cities/shots/woodrow-wilson-bridge/export-final-{near,far}-{light,dark}/`. The dossier reference sheet and `reference-comparison.jpg` compare photographs directly beside the model. The first inspection led to moving the control house into its exact mapped median ring and refining its flared base/lean; material QA led to lifting the rail ends clear of kerbs, moving edge paint inside the carriageway and dropping the far expansion seam. Reversed V-arm winding and the control-base sides were corrected, then fresh GLBs passed the front-face arm test and outside-in sweep. The operator-house louvres and equipment remain simplified; the reference likeness is subject to independent reviewer judgement.

The requested registry + landmark command passes **606 tests**, including seven focused landmark cases; `node scripts/asset-catalog.mjs`, `pnpm assets:check`, `pnpm assets:preview` and depth regeneration/check pass. No shared runtime extension was needed; only the generated `depth-layers.js` was refreshed, and it is excluded from my branch commit for lead regeneration.

 Landmark tests enumerate named support contacts excluding each member, include a deliberately shortened portal beam, raycast twin-deck gaps, arch negative space, roadway heights and the clear bascule channel, and check mapped motorway ownership/grade/heading rejection.

## App modes and live road-surface evidence

In each mode I captured and inspected both approaches in both eastbound/westbound directions, as well as far/near/street views. These are application screenshots from the normal renderer, not inspector pages. Final images are in `tmp/top-cities/shots/woodrow-wilson-bridge/review-fix-{cityscape,world}/woodrow-wilson-bridge-{far,near,street}.png` and `review-fix-{cityscape,world}-approaches/{west,east}-{eastbound,westbound}.png`; each approach folder contains `probe.json`.

The approach-only taper splits into four mapped local/express ribbons, joining the standard-road widths and colour without a square slab, visible step or gap. The standard-road bridge geometry and control-house extrusion are masked only while the asset is active. The river decks stay rigid. The 20 m extension beyond the outermost mapped way endpoints fixed eight endpoint height misses; final probes own **all 86 mapped motorway vertices**, in **both directions and both modes**, with zero misses and exactly equal forward/reverse heights. Cross-traffic and off-bridge probes return `null`. All loaded landmark meshes use the shared **MeshBasicMaterial** path with vertex shading; no landmark-specific PBR override.

`heightAt` returns height above the query ground in Full 3D world, not absolute altitude. The 24 m authored deck therefore has a slightly smaller returned height over positive DEM water samples. The representative north-local carriageway results below apply equally in reverse; all four ribbons and all 86 vertices are recorded in the JSON. Values are metres, rounded to three decimals.

| Station along approach-inclusive frame | Cityscape forward/reverse | Full 3D world forward/reverse |
| ---: | ---: | ---: |
| 0.000 | 0.000 | 0.150 |
| 25.000 | 0.781 | 0.432 |
| 100.000 | 6.375 | 8.141 |
| 250.000 | 17.625 | 17.332 |
| 350.000 | 24.000 | 21.903 |
| 779.038 | 24.000 | 23.871 |
| 1570.965 | 24.000 | 23.806 |
| 1650.965 | 18.800 | 21.227 |
| 1800.965 | 6.800 | 15.242 |
| 1875.965 | 0.833 | 6.777 |
| 1900.965 | 0.000 | 0.150 |

The world bridge's terrain-ready flag and ground attachment were active, with endpoint DEM datums 4.745 / 12.177 m. All **864 exported footing/abutment bottom vertices** at source y=0 were compared independently to the DEM after runtime fitting: residual range **-0.000000159 to 0.000000128 m** (floating-point noise). Support-centre DEM samples are retained in `probe.json`, and no terrain pad flattens the Potomac corridor.

**Live HD lanes/paint: not tested** because `/osm-lanes` returned 503 and both probes report `hdSurface=false`; the shared HD replacement path is wired but these images verify standard-road fallback. Actual driving on Tesla hardware and operational bascule animation were not tested. This local verification does not replace independent visual review or authorize an online rollout.

## Independent review fixes (b8b, 2026-10-13)

The reviewer requested broader V-pier webs and a less box-like operator house. Replaced the slender curved arms with solid closed webs, rounded the triangular opening throat, widened the bearing shoulders and retained their footing/girder contacts in both LODs. The original longitudinal station profile, four roadway ribbons, lateral road fitting, terrain policy and endpoints are unchanged.

The median control house remains within mapped way 232949254. Its taller flared silver machinery housing now supports the leaning cab, with a lower equipment tail over the existing median platform. Major vertical mullions and horizontal transoms follow the same lean as the glazing on every face, and louvre rhythm survives far LOD. Near frames stand at least 0.12 m clear of the glass; far uses 24 separate inset panes and no glass backing overlay beneath the louvres. Named-support tests now cover all cab mullions/transoms as well as the existing bridge members. Minor equipment and surveyed enclosure dimensions remain approximations.

Two visual fix iterations were used. Final exported contact sheets under `tmp/top-cities/shots/woodrow-wilson-bridge/review-final-{near,far}-{light,dark}/` were read back against the dossier river photographs and Antony-22's `refs/2.jpg`: the shoulders now have solid depth rather than a narrow beam silhouette, and the control house has a visible frame grid and louvred flared base. Deterministic QA (`tmp/top-cities/woodrow-wilson-bridge/review-metrics.json`) reports no issues, no layered faces, no coplanar pairs, no back-face hits and no unsupported member ends; depth regeneration/check reports zero material cycles.

The shared local launcher is unavailable for this checkout: its wrapper requires 1.1.0, while the installed executable reports 1.2.0. Setup, doctor, up and check stop at that version guard. The rebuilt local renderer bundle is excluded from the bridge commit, and the lead must regenerate the shared depth table and bundle when integrating.

Fresh landing evidence is `review-final-approaches-sheet.jpg` (Cityscape four headings above world four headings) plus the eight full-size images and each mode's `probe.json`. Fresh normal app evidence is `review-final-app-sheet.jpg` and the six full-size far/near/street images. Both sets were inspected: standard-road landings remain continuous, and the control house stays on the median. All 86 mapped motorway vertices have zero misses and identical forward/reverse heights in each mode; world ground is active and all 864 footing/abutment bottom vertices meet the DEM within ±0.0000002 m. The current height samples match the table above. App reports confirm far then near LOD and shared MeshBasicMaterial shading. Expected local account CORS/503 errors are retained in the reports; live HD remains unavailable, and Tesla driving/navigation playback is not claimed.

| Export | Before review fix | After review fix |
| --- | --- | --- |
| Near triangles / draws / KiB | 70,242 / 26 / 2316.4 | 70,670 / 26 / 2341.9 |
| Far triangles / draws / KiB | 23,880 / 7 / 775.6 | 24,548 / 7 / 815.7 |

Only bridge-owned source/test, catalog/doc and exported model files are committed. The local QA bundle stamp is `291bdd5abb6a`; a copy of its bundle and generated depth table is retained in ignored `tmp/top-cities/woodrow-wilson-bridge/review-runtime/` so the shared generated files can return to the branch baseline. The pre-merge generated-depth change already exists unchanged in the merged upstream baseline. Independent visual re-review is the lead's next gate; minor equipment and engineering profiles remain estimates.
