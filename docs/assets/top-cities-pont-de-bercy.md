# Pont de Bercy — Paris

Original texture-free procedural model of the present double-tier crossing: five broad river arches and 41 small semicircular Métro arcade openings on each flank, a central cycle passage, stone balustrades, lamps and two separated carriageways. It represents the 1864 masonry bridge, the 1905–06 upper viaduct and the stone-clad 1992 widening; it does not depict the preceding suspension bridge.

[RATP heritage](https://www.ratp.fr/en/discover/heritage/history-metro-line-6) gives five lower arches, 41 upper arches, 175 m and the construction stages. The [dimension dossier / encyclopedia](https://fr.wikipedia.org/wiki/Pont_de_Bercy) gives 40 m overall width and five 29 m openings; the often quoted 35 m describes the narrower structural section. The mapped OSM bridge envelope is way [183625692](https://www.openstreetmap.org/way/183625692), with an approximately 162 m inner bank extent; published 175 m includes the abutment zones. Both are retained honestly rather than rescaling the mapped approach roads.

| Quantity | Model | Basis |
| --- | ---: | --- |
| Main structure | 175 m | RATP and dossier |
| Overall width | 40 m | Dossier; IGN aerial ~40 ±1 m |
| River arches | 5 × 29 m | Dossier |
| Upper bays, each side | 41 | RATP |
| Main pier section | 5.2 m | Estimate distributing total opening/bridge lengths |
| Upper bay pitch / aperture | 4.268 / 2.968 m | 175/41; pier width photo estimate |
| Road datum / upper rail bed | 8 / 14.22 m | Photo estimate above local grade |
| Highest balustrade | 15.35 m | Photo estimate |
| Alignment incl. approaches | 375 m | OSM-derived, 100 m beyond each abutment |
| Flat ramps | 100 m each; 12% maximum | Smooth relative-height flat-map convention |
| Main carriageway widths | 11 m each | IGN aerial image measurement estimate |
| Upper viaduct width | 7.8 m | IGN aerial / photo estimate |

Origin and exact mapped roadway control points are in config.js and pont-de-bercy-alignment.js. Geometry uses local metres east/up/south; rotation is baked once. The alignment is the mean of opposing mapped road ways 23645521/44814093, continued through their approach road centrelines; the rigid river axis is continued to the published bank-inclusive 175 m. FOOTPRINTS owns only the mapped bridge envelope; it does not claim the approach roads as building footprints. OSM_WAYS attributes the road, cycle, Métro and envelope ways used. No building extrusions were present in the bridge dossier.

The supplied Commons photos by Cramos (CC BY-SA 4.0), Chabe01 (CC BY-SA 4.0) and Fred Romero (CC BY 2.0) show the upper arcade and cycle tunnel. Dossier photo 1 is Bir-Hakeim and was excluded. Source links and credit are in the catalog. IGN BD ORTHO was fetched once via the Géoplateforme WMS to ignored tmp/top-cities/pont-de-bercy/ign-aerial.jpg; bbox, source URL and 1024-pixel metric scale are retained beside it. The 440 Mercator-metre square is ~290 ground metres at this latitude, approximately 0.283 m/pixel. Deck edges, road bands and the upper viaduct were measured visually against that scale. No reference photograph or aerial texture is shipped.

All river and upper openings remain real voids in both LODs. Near includes separate masonry courses, shallow voussoir relief and X balustrades. Far merges ballast into upper stone to eliminate a cornice-edge depth cycle and keeps all five/41 openings, a continuous cycle tunnel, every pier and the deck/rail silhouette while simplifying masonry, rail density and curve segments. Structural members terminate in named end posts or the rail bed, rather than free ends. Width fitting is identity on the masonry structure; approaches use tapered separated ribbons and narrow kerbs, avoiding a wide square slab landing. The Métro is excluded from the vehicle surface; both vehicle headings sample the lower deck. Materials are subdued limestone, pale trim, dark asphalt and metal with an honest dimmed night palette and lit lamp heads; no fabricated floodlighting is asserted.

Bank-fit keeps foundations weighted zero at y=0 and structures attached to the relative road datum; no full river corridor is flattened. There is no surveyed absolute altitude, so absolute-deck would imply unsupported accuracy. Each support must be checked against live DEM independently. The existing lateralBankFit option samples each lateral endpoint and blends that correction over the 100 m approach; the river spans retain the bank-interpolated rigid transverse datum. No shared bridge module was extended.

## Verification

First procedural sheet inspected: tmp/top-cities/shots/pont-de-bercy/procedural/pont-de-bercy-procedural-near-light-sheet.jpg (overview, both sides, above, road and close arcade), against the supplied reference sheet and IGN aerial. Corrected the river axis to stay straight across the full structure, added continuous upper pier heads and ensured roof/rail hosts meet. Focused tests pin the five river openings, all 41 upper openings, clear cycle tunnel, bounds, fitted road heights, both headings and named terminal contacts with shortened-end negatives. The final exported comparison is tmp/top-cities/shots/pont-de-bercy/reference-export-sheet.jpg: three correct Bercy photos plus IGN aerial, near front/back/above/road/detail, far daylight, and both LODs at night. I looked at this final sheet; all river/arcade openings survive the GLB round trip. Initial depth cycles between lower/upper tiers and cornice/ballast were resolved by separating tier materials, removing a redundant terminal beam and merging far ballast into the upper masonry. Final cycle report is empty; near has zero coplanar overlaps and one backface ray in 73 (1.4%), below the 2% QA threshold, with no QA issues. The underside of the open fallback pavement sheet is not a closed structural member.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 44,752 | 16 | 2,577,160 | 2516.76 |
| Far | 15,168 | 8 | 821,392 | 802.14 |

Prescribed focused command passed **636/636** tests, including 15 dedicated tests; final log: tmp/top-cities/pont-de-bercy/tests-final.log. Catalog validation, assets:check, assets:preview, exported QA metrics and depth --check pass. No full suite, dependency installation, online deployment, shipped photos/textures or shared bridge source extension was needed. Generated depth table is regenerated locally and excluded from the landmark commit; the lead must run `node scripts/landmark-depth-layers.mjs --ids pont-de-bercy` after picking the branch. Renderer build hash: **598861e5cb19**; generated public bundles excluded. Costs exclude HD overlays and Tesla hardware measurements.

## Application placement

Full 3D world: **verified locally for the same placement/API plus lateral endpoint and support-foot DEM contacts**, 3276, AWS Terrarium max zoom 15. Both use Protomaps tiles.codriver.io. This is bounded local placement verification, not release certification. HD pavement/paint, actual navigation driving/traffic, current lane count/dash phase, hardware and the complete lifecycle matrix remain **not tested**: /osm-lanes returns 503; account endpoints have localhost CORS failures. The model's deterministic terrain test verifies missing-DEM deactivation, immutable refit and flat restoration without claiming real driver/network lifecycle coverage.

The shared app-shot harness was copied to ignored scratch to capture far/near/street plus both ends in both directions during one boot and record numeric probes. Synthetic spot IDs report active:false because they are not registry IDs; actual pont-de-bercy rows and numeric reports prove active:true. Final full-resolution PNGs: `tmp/top-cities/shots/pont-de-bercy/final-app-cityscape/` and `final-app-world/`. I looked at all joins together in `approaches-final-sheet.jpg` plus near/street in both directories. The lower road ribbons connect to standard roads, widening approach walks meet the river walks, both arch tiers use shared unlit shading, and no generic elevated river deck duplicates this structure. Generic rail/building extrusions outside the 175 m owned crossing remain provider geometry.

Initial world inspection showed centreline-only fitting was insufficient at wide joins. Enabled existing lateralBankFit with 100 m blend and gradually widened outer approach walks from 0.7 m at grade to 3.2 m at the river deck. Recaptured after export/rebuild/server restart, then inspected both ends again. All four lateral road endpoint residuals are now below 0.000001 m. Main-span clearance remains an estimate, not a surveyed altitude.

Live `window.__map.landmarks.heightAt(lng,lat,heading)` probes are in each final app directory's measure.json. Values below are relative lift above queried ground; forward/reverse and cameraHeightAt agree. Cross headings and off-bridge `[2.38,48.84]` return null. “− / +” denotes the carriageways; ~1 cm differences near a kink use the same closest-station projection as fallback pavement.

| Station | Cityscape − / + (m) | World − / + (m) |
| --- | ---: | ---: |
| 0 | 0.000 / 0.000 | -0.000 / 0.000 |
| 50 | 4.000 / 4.000 | 3.951 / 3.440 |
| 100 | 7.988 / 8.000 | 8.310 / 7.527 |
| 187.5 | 8.000 / 8.000 | 13.562 / 13.347 |
| 275 | 8.000 / 8.000 | 6.722 / 8.239 |
| 325 | 4.000 / 4.000 | 3.575 / 4.072 |
| 375 | 0.000 / 0.000 | -0.000 / 0.000 |

World per-pier DEM checks sample ±18 m and compare fitted zero-weight corner vertices against their **own** resident ground values. All eight outer corner sets have residual <0.000001 m. Centre points provide water-height context; the broad solid piers have no central bottom-face vertex. These are exact coarse-DEM attachment contacts, not surveyed foundation depth.

| Pier station | DEM −18 / +18 m (absolute m) | Largest corner residual (m) |
| --- | ---: | ---: |
| 136.2 | 29.218 / 28.752 | 0.000000732 |
| 170.4 | 28.612 / 28.982 | 0.000000693 |
| 204.6 | 28.827 / 29.077 | 0.000000560 |
| 238.8 | 29.221 / 28.837 | 0.000000611 |

All approach-inclusive alignment vertices are sampled in both lateral bands, both headings and both modes. Exact OSM bridge carriageway vertices (23645521/44814093) are recorded separately in mapped-cityscape/measure.json and mapped-world/measure.json; the vertex table follows below. Independent lead review of final GLBs/app evidence remains required before publishing. Temporary app servers are stopped at delivery; references and inspection tools stay ignored local artifacts.

| OSM way / vertex [lng,lat] | Cityscape, both headings (m) | World, both headings (m) |
| --- | ---: | ---: |
| 23645521 / [2.3740494, 48.8374632] | 8.000000 | 7.818591 |
| 23645521 / [2.375784, 48.838422] | 8.000000 | 10.165234 |
| 23645521 / [2.3758239, 48.8384439] | 8.000000 | 9.113025 |
| 44814093 / [2.3756232, 48.838589] | 8.000000 | 7.724210 |
| 44814093 / [2.3738625, 48.8376244] | 8.000000 | 8.597018 |

All five exact mapped bridge vertices return a deck in both headings, the camera agrees, and every cross heading returns null.
