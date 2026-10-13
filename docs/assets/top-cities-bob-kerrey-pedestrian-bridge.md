# Bob Kerrey Pedestrian Bridge, Omaha / Council Bluffs

Original procedural model of the current 2008 pedestrian and bicycle crossing of the Missouri River. The mapped S-curve, western return ramp, two opposing three-sided tapered white concrete pylons, two cable planes with 80 stays, thin steel frame, open gaps between pavement and edge girders, and mesh railings distinguish this crossing. It is free-standing; no vehicle roadway layer is supplied. The separate 2025 Baby Bob branch and surrounding park structures are excluded.

## Sources and frame

[National Park Service](https://www.nps.gov/places/bob-kerrey-pedestrian-bridge.htm), checked 2026-10-13, establishes identity, use, opening and the separate Baby Bob branch. [AISC/NSBA 2009 Prize Bridge brochure, printed pages 32–33](https://www.aisc.org/globalassets/nsba/prize-bridge-brochures/2009prizebridgebrochure.pdf) supplies engineering dimensions and cable counts. [Council Bluffs official facts](https://www.councilbluffs-ia.gov/DocumentCenter/View/498/BOB-KERREY-PEDESTRIAN-BRIDGE-FACTS---revised) provides clear walkway width, railing height and the approach-inclusive headline length. The municipal PDF was available in search text, while direct browser open returned an internal error; its rounded 210 ft pylon claim is not the chosen engineering dimension.

The supplied OSM dossier identifies [outline 454976793](https://www.openstreetmap.org/way/454976793) and path controls 177074790, 1423771480 and 662864648. Their geographic alignment is converted once to local metres, +X east / +Y up / +Z south, about origin [-95.92275, 41.26559]. The tower-to-tower mapped bearing is approximately 84.4 degrees. The western return curve is estimated between the mapped outline edges. No OSM building/building:part ways occur inside this crossing in the dossier; no neighboring provider building is claimed. FOOTPRINTS contains the exact mapped outline, the authored steel-frame envelope, the two triangular pylon feet and both bank-connector envelopes. The connectors cover no provider building or building part, so OSM_WAYS remains the exact bridge outline 454976793; highway control IDs are provenance, not building-replacement IDs.

| Quantity | Model | Evidence |
| --- | --- | --- |
| Pylon height above local support datum | 61.8744 m | AISC 203 ft; municipal rounded 210 ft differs |
| Main span | 154.07 m along mapped centreline; approx. 154.79 m between shaft centres | AISC 506 ft = 154.2288 m, independently located from OSM outline widenings |
| Back spans | 77.1144 m support stations | AISC 253 ft each |
| Full structural alignment | 766.161 m including return curve | OSM controls; 3,000 ft / 914.4 m published total includes landings |
| Steel frame | 7.3152 m | AISC 24 ft |
| Precast walking deck | 4.9784 m | AISC 16 ft 4 in panels; clear walk municipal 15 ft |
| Rail height | 1.3716 m | Municipal 4.5 ft |
| Stays | 80 in both LODs | AISC 40 per pylon, in two planes |
| Floorbeam spacing | 7.0104 m | AISC approximate 23 ft panels |
| Deck crest / structural endpoint / bank landing | 18.288 / 0.8 / 0 m | Relative photographic estimates; new connectors end at flat grade, not a water-level or DEM survey |
| Pylon taper, rake and approach shaft spacing | Procedural estimates | Reference photographs, not construction drawings |

Local y=0 is the exposed support-foot datum. No riverbed, sea-level elevation, latitude stretch or DEM is embedded. The bank-only median pad rings and additional buffered connector rings avoid a river-centred flattening disc; terrain behavior is unverified.

## Original modeling and verification

Geometry is self-contained and uses Three.js plus assetBuilder. Closed rectangular sweeps form the deck, curbs and independent outboard girders, leaving genuine aerodynamic gaps. Original lofted triangular shafts preserve the tapered single-pylon silhouette. Every stay ends on the tower surface and an independent edge girder. Cable fans remain complete in far. Floorbeams, approach supports, tower crossheads, rail posts, rail spans and near infill retain structural contacts. Near adds sockets and underside braces; far drops fine mesh and braces and coarsens rail posts and sweep sampling. Six semantic materials merge all repeated elements. The night palette dims surfaces and retains sampled cool-blue walkway/tower LEDs; it does not reproduce the programmable lighting sequence.

Sources inspected: dossier refs-sheet.jpg and its five photos. Antony-22, 2025c underside and 2025b elevation (CC BY-SA 4.0); J Yochem, deck view (CC BY-SA 2.0); WiinterU, Best view (CC0); Skinzfan23, sunset (CC BY-SA 3.0). Their Commons pages and licenses were checked; links are in the catalog. Reference images remain in ignored scratch and no photo or texture ships.

The initial procedural contact sheet at tmp/top-cities/shots/bob-kerrey-pedestrian-bridge/bob-kerrey-pedestrian-bridge-procedural-near-light-sheet.jpg was opened and compared with the dossier. It established the S-curve, opposite-side pylons, slender fan silhouettes and open deck gaps. The first export exposed excessive repetition and serialized test metadata: near railing density and girder flange detail were reduced, far rail posts coarsened, and QA-only member records excluded from export extras. Contact assertions exposed pylon sockets embedded too deeply; they were moved onto the measured triangular shaft faces. The final above view is exactly vertical to show the whole mapped alignment without camera roll.

Focused tests measure sourced dimensions, complete approaches, open walking corridor/channel, 80 actual cable meshes, all named member terminal contacts, independent slab/girder/support contacts, mapped and authored footprint containment, normals/materials and LOD bounds. A deliberately shortened stay fails its named-girder contact assertion. QA metadata is non-enumerable on userData so it is available to source tests without bloating runtime GLBs.

Cityscape: **not tested yet; integration is checked separately**. Full 3D world: **not tested yet; integration is checked separately**. Lead/reviewer app shots, runtime shared shading, provider suppression, DEM footing residuals, terrain lattice coverage, path continuity and lifecycle remain required. Hardware performance is not measured. No app server, deployment or git write was performed.

## Review repair, 2026-10-13

Finding 1 of `tmp/next-200/review/b7b/REVIEW.md` identified both structural walking-deck ends stopping 0.80 m above grade. Both now have solid ground-backed wedges and continuous curbs/rails down to mapped bank-path nodes. West meets the dossier node shared by ways 177074003 and 322999597 at local [-151.81055, -85.94978]; east follows connector 163291845 to the junction of 163197147 and Iowa Riverfront Trail 163291881 at [438.71351, 245.44834]. These short connector shapes are original geometric estimates tied to OSM endpoints, not surveyed ramp dimensions. The entire original 766.161 m deck, 18.288 m crest, pylons, cable fans and all stay contacts remain unchanged. The separate Baby Bob branch remains excluded.

| Connector | Horizontal length | Descent | Maximum grade | Final level landing |
| --- | ---: | ---: | ---: | ---: |
| West | 8.976 m | 0.80 m | 9.67% | 0.50 m at y=0 |
| East | 6.268 m | 0.80 m | 14.37% | 0.50 m at y=0 |

Constant grades have short 0.20 m quadratic vertical curves at each end. Ground-backed ramp surfaces have no buried bottom faces or collapsed zero-area end triangles. Their upper faces, including the level landings, reach local y=0; rails share the existing bridge terminal posts and finish on ground-supported landing posts in both LODs. The bank pads now include buffered connector rings while retaining the original bank-only median references. Live terrain/path agreement needs the lead's Full 3D world check.

Fresh exported GLB sheets **opened and judged**: `tmp/top-cities/shots/bob-kerrey-pedestrian-bridge/review-fix/bob-kerrey-pedestrian-bridge-glb-near-light-sheet.jpg` and `bob-kerrey-pedestrian-bridge-glb-far-light-sheet.jpg` in the same directory. Each includes overview, underside, westLanding and eastLanding views. Both show seated ramps, level landing surfaces, continuous rail seams and retained river-span identity. One look-fix round was used. The earlier `export-reference-contact-sheet.jpg` remains historical near/far day/night reference evidence; night was not recaptured for this repair.

| Export | Triangles before → after | Draws | Bytes before → after | Final KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 53,520 → 55,988 | 6 → 6 | 3,386,104 → 3,550,784 | 3,468 |
| Far | 16,432 → 18,108 | 6 → 6 | 1,082,608 → 1,190,776 | 1,163 |

Both exports are within the bridge budgets; far retains 32.34% of near triangles. Both bounds agree: X -182.342…439.398 m, Y 0…61.8744 m, Z -86.174…247.920 m. The negligible -0.000000081 m minimum is support float precision. The previous qa-metrics.json describes the pre-repair export only, not current screening evidence.

The focused tests now check seven landmark behaviors, adding both ramps' raycast walking continuity, mapped endpoints, local ground contact, grades and level landings. Named support checks still cover every retained stay, floorbeam, brace and rail end, including the added ramp rail members; the shortened-stay negative case remains. A shortened connector endpoint also fails mapped terminal agreement. Required combined registry test output: `tmp/top-cities/bob-kerrey-pedestrian-bridge/review-fix-tests.txt`.

Depth generation and `--ids bob-kerrey-pedestrian-bridge --check` pass, with zero dropped material-cycle edges. All seven focused landmark tests and the three Bob Kerrey registry conformance/export checks pass. The required combined run completed with 597/598 passing (142.5 seconds); the sole failure is outside ownership, `charles-bridge: spec, palettes, footprints and views are well formed`, asserting `footprint is a real polygon`. No Charles Bridge files were edited. `node scripts/asset-catalog.mjs` and `pnpm assets:check` pass with 336 records / 592 variants; `pnpm assets:preview` passes. The shared cycles report may be overwritten by other agents: the Bob Kerrey generation printed zero dropped edges and its own `--ids` check passed. No app server, deployment or git write was performed. Updated Cityscape: **not tested**; updated Full 3D world: **not tested**. Earlier app evidence prompted this repair; the lead must recapture both modes and independently check live terrain, provider suppression, shared shading and path continuity. Hardware performance remains unmeasured.
