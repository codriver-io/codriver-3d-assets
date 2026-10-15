# Pont Mirabeau — Paris

Original procedural model of the present green steel arch bridge opened in 1896, joining the 15th and 16th arrondissements. Its recognizable features are the very low central arch, two smaller side arms, exposed triangular green spandrels, two stone boat piers, four seated bronze allegorical figures, circular iron parapets and city-arm panels. The figures represent La Ville de Paris, La Navigation, L’Abondance and Le Commerce; anatomy, faces, drapery and attributes are stylized original sculpture rather than replicas.

Sources: [dimension dossier](https://fr.wikipedia.org/wiki/Pont_Mirabeau), [Ministry of Culture heritage record PA00086659](https://pop.culture.gouv.fr/notice/merimee/PA00086659), [mapped bridge way 184264542](https://www.openstreetmap.org/way/184264542), and the six credited Commons references in the catalog. The dossier English summary says 1895–1897; the French account and requested identity use the 1896 opening. No reference pixels, textures, captures or traced mesh are exported.

| Quantity | Model | Basis |
| --- | ---: | --- |
| Structural bank-inclusive length | 173 m | Published dossier |
| Clear spans | 32.4 / 93 / 32.4 m | Published dossier |
| Total deck / original carriageway | 20 / 12 m | Published dossier; IGN aerial visual check |
| Walk widths | 4 m each | Published dossier; includes current cycle provision |
| Central arch rise | 5.8125 m | Estimated from published length/rise ratio 16 |
| River pier station spacing | 100.6 m | Published openings plus estimated 7.6 m pier thickness |
| Main deck above local grade | 8 m | Photo estimate, not surveyed absolute height |
| Lamp height / model top | 12.93 m | Photo estimate |
| Dossier reported bridge height | 15 m | Published; unspecified vertical datum, not used as local-grade lamp height |
| Approach ramps | 160 m each | Flat-map convention, OSM-connected roads |
| Maximum flat ramp grade | 7.50% | Measured derivative of smoothstep 8/160 |

The origin is the midpoint of mapped roadway abutments, [2.2755771, 48.8466587]. River rotation is 122.44° from north, baked into east/up/south metre geometry. The mapped 174.795 m inner bank distance is trimmed by 0.897 m per end to the published 173 m. Centerline follows the mapped Amiral Cloué, Pont Mirabeau and Convention roads; the northmost ~74 m continues the same avenue axis beyond the dossier extract. Alignment plus ramps is 493 m; each outer endpoint continues 50 m farther along its road axis than the first export. OSM_WAYS lists every source roadway/path and the bridge envelope. No building extrusions occur within the bridge dossier. The envelope ring masks only the river structure; approach ribbons are connected roads, not claimed building footprints.

IGN BD ORTHO was fetched once through the Géoplateforme WMS into ignored tmp/top-cities/pont-mirabeau/ign-aerial.jpg. Its 440 Mercator-metre square is 289.56 ground metres at this latitude, or 0.283 m/pixel. Visual cross-sections are about 70–72 pixels overall and 42–44 pixels for the original road band, consistent with 20 ±0.5 m and 12 ±0.5 m. Current cycle/vehicle allocation is controlled by provider HD pavement and paint rather than fabricated lane markings. Source URL and scale are saved in ign-aerial.json.

Near has seven rib arches, fine diagonal spandrels, circular/scroll parapets and articulated bronze groups; far retains four ribs, all three openings, both boat piers, four figures, open parapet rings, lamps and city arms while reducing trusses and ornaments. Seven materials distinguish yellow-green steel, foundation limestone, walkway limestone, asphalt, patinated bronze, gilt and lamp heads. Review correction brightens steel to #9fb04c by day / #64753e at night, bronze to #6fa394 and the near gilded prow to #c3ab62; no glowing bridge floodlighting is invented. All components batch by material; no shared source extension is needed.

The rigid steel width is preserved with identity fittedLateral. Landings taper the road, raised walks and rail lines to the broader Amiral Cloué roadway and narrower Convention roadway; river spans do not taper. The landmark-specific runtime layer retains the shared bank-fit lifecycle but replaces its sloping river datum with one level datum: the maximum of the two original, unmodified quay/abutment TIN ground samples only. Outer road heights and provider offsets affect the landings without raising the river deck. The authored 8 m flat-map offset is removed when composing this world datum. Smooth 160 m land approaches absorb the bank difference and taper crossfall from the actual lateral endpoint ground; the steel river deck stays level and full width. A node-limited north land cutting clears buried pavement; no full river corridor is flattened and no DEM or absolute altitude is baked into exports. Stone foundation shafts reach the local river terrain; the rounded boat courses, arch heels and bronze figures translate rigidly together. Only the foundation beneath each boat course stretches. The stylized flat-map ramps pass over urban junctions; Cityscape retains its 8 m deck convention.

## Quay datum and landing grade correction (2026-10-15)

The g3b2 follow-up found the previous level world deck was pinned to the **outer north road** (45.111 m), 4.910 m above the north quay; its south landing peaked at 13.26%. Those earlier height tables and `review-fix-*` app captures are superseded. The rigid world deck now uses `max(north quay, south quay)` in this landmark’s `bankYAt`; the outer road samples and provider offsets are excluded. Both landing tapers extend from 110 to 160 m so Cityscape’s 8 m rise has a maximum grade of 7.50%. The river structure, geographic abutments, palette, statues, width and foundation rules are unchanged. No shared bridge module changed.

The southeast quay block remains the real Javel station building, OSM way **230096533**, not a duplicate bridge object. The previous query at `tmp/top-cities/pont-mirabeau/review-fix/quay-buildings.json` puts it beyond the structural endpoint and outside the tapered walkway. Neither it nor the adjacent houseboat 787079299 is replaced or masked.

| LOD | Triangles before → after | Draws before → after | Bytes before → after | KiB after |
| --- | ---: | ---: | ---: | ---: |
| Near | 58,606 → 60,466 | 7 → 7 | 2,045,984 → 2,123,032 | 2073.27 |
| Far | 18,446 → 20,018 | 6 → 6 | 776,188 → 847,976 | 828.10 |

The increase is the longer approach pavement, walkways and attached railings. Both LODs remain within the bridge budgets. Depth regeneration and `--check` pass with **zero dropped cycle edges**. The generated depth table is unchanged. Export metrics (`tmp/top-cities/pont-mirabeau/quay-fix/metrics.json`) report no issues, zero layered/coplanar pairs and zero backface hits in 48 near sweep rays. Exported contact sheets inspected: `tmp/top-cities/shots/pont-mirabeau/quay-fix-near/pont-mirabeau-glb-near-light-sheet.jpg` (overview, front, back, deck, underside, pier detail) and `quay-fix-far/pont-mirabeau-glb-far-dark-sheet.jpg` (front, back, deck, pier detail). Both retain the low arch, open spandrels, all four bronze groups and circular parapets; the extended landings leave the river silhouette unchanged. This targeted correction preserves the existing far sculpture, including its simplified unaccented prow.

The focused landmark and registry tests pass **799/799**, including 15 landmark tests (`tmp/top-cities/pont-mirabeau/quay-cut/tests.log`). The strengthened unequal-bank regression tests check a quay-level rigid deck, both-heading heightAt and ≤8% centerline landing grade in both LODs, repeatable fitting, rigid upper pier courses, ground-connected feet, unchanged deck altitude after nonzero provider joins, Cityscape restoration and unknown-DEM fallback. Asset catalog validation and assets:preview pass (406 entries / 698 variants). Local renderer bundle **dcc66ef9cae9** was generated for app QA only; public/peregrine*.js are excluded from the commit and must be rebuilt after merge.

## Current app integration

The existing local guest QA grant is used; no product gates changed. Heights and grades are recorded in `tmp/top-cities/pont-mirabeau/quay-cut/app-heights.json`; images live in `tmp/top-cities/shots/pont-mirabeau/quay-cut-{cityscape,world}-approaches/`.

Inspected sheets: `tmp/top-cities/shots/pont-mirabeau/quay-cut-cityscape-approaches.jpg` and `quay-cut-world-approaches.jpg`, each in north-in, north-out, south-in, south-out, north-join, south-join order. Both layers report active and terrainReady; world reports terrainEnabled=true. Every one of the 13 height probes agrees between forward/reverse headings; crossing probes and both off-bridge probes return null. Endpoints have zero heightAt offset (north numerical residual below 1e-24 m).

| Mode | North landing max grade, forward / reverse | South landing max grade, forward / reverse |
| --- | ---: | ---: |
| cityscape | 7.49999% / 7.49999% | 7.49999% / 7.49999% |
| world | 5.33738% / 5.33738% | 1.02689% / 1.02689% |

Grades are central finite differences of actual heightAt + query ground, with 0.02 m separation sampled every 0.5 m over both 160 m landings. Both LODs are also tested against the 8% ceiling before and after nonzero synthetic provider joins.

| Station (m) | Cityscape heightAt (m) | World heightAt (m) | World accepted ground (m) | World pavement absolute (m) |
| --- | ---: | ---: | ---: | ---: |
| 0.000 | 0.00000 | 0.00000 | 45.89458 | 45.89458 |
| 2.000 | 0.00372 | 0.01416 | 45.87777 | 45.89193 |
| 10.000 | 0.08984 | 0.11062 | 45.72002 | 45.83064 |
| 148.000 | 7.87175 | 0.55627 | 39.73636 | 40.29264 |
| 160.000 | 8.00000 | 2.75689 | 37.44448 | 40.20137 |
| 196.200 | 8.00000 | 12.10009 | 28.10128 | 40.20137 |
| 190.000 | 8.00000 | 12.10263 | 28.09874 | 40.20137 |
| 296.800 | 8.00000 | 11.02640 | 29.17497 | 40.20137 |
| 333.000 | 8.00000 | 10.74696 | 29.45441 | 40.20137 |
| 345.000 | 7.87175 | 11.90798 | 28.27583 | 40.18381 |
| 483.000 | 0.08984 | 0.59912 | 38.51919 | 39.11831 |
| 491.000 | 0.00372 | 0.12177 | 38.98476 | 39.10652 |
| 493.000 | 0.00000 | 0.00000 | 39.10601 | 39.10601 |

The river deck is **40.201366131 m** at every sampled station from 160–333 m, using the original north quay TIN datum and replacing 45.111003809 m. The original south quay sample is 29.454409082 m; extended outer roads are 45.894578879 / 39.106013303 m and do not lift the deck. Native (unmodified) quay samples are used explicitly to prevent the cutting feeding back into its own deck datum. The accepted ground under the north abutment changes through TIN interpolation; heightAt compensates for it exactly once. All 248 zero-weight footing vertices still meet their own terrain within −0.00000102 / +0.00000174 m numerically.

**Cityscape: verified** for current fallback loading, shading, both landings in both directions, grade and heightAt. **Full 3D world: verified** for the same plus the level quay-based deck, feet and north cutting. Before the cutting, station 148 m had pavement at 40.29264 m under ground at 43.31533 m (−3.02270 m heightAt); afterward its ground is 39.73636 m and heightAt is +0.55627 m, with unchanged pavement altitude. All north centerline samples have nonnegative heightAt (minimum +0.00075 m away from the exact zero endpoint). The north-in/out images show fully visible pavement; the crossing quay road remains continuous without a visible step, hole or flicker, adjacent buildings meet the ground, and the river/quay wall retain their normal appearance. South approaches remain continuous in both headings. This is ordinary-road fallback visual verification; no live HD lane claim is made.

## North cutting and bounded TIN spill

`pont-mirabeau-terrain.js` uses the existing footprint/terrace mechanism, with 0.6 m nominal floor clearance and no feather. It enumerates the actual SW–NE TIN triangles intersecting the north carriageway plus 1 m shoulders, preserves every node supporting the outer endpoint cross-section, and lowers only the remaining high nodes. Each tiny terrace patch holds one node; it never raises a river node or flattens a complete river corridor. The original HeightField samples (without this cutting) hold the deck datum, while pavement, routes and the camera continue reading the accepted shared terrain. The regression test checks visible pavement, ≤8% grade, exact lowered nodes, unchanged outer join/deck datum, untouched mid-river TIN and Cityscape removal.

The near lattice is **25.15071 m** on the ground. **21 nodes** are lowered; node centers cover stations **17.388–162.395 m** and lateral **−41.567 to +40.696 m**. Maximum lowering is **4.08622 m**. The first river pier and center-river samples are unchanged. This finite lattice footprint can influence adjacent land/crossing-road cells; visual checks above are the acceptance condition. Future provider or DEM changes need renewed QA.

Exact affected near cells, identified by lower-left global `(i,j)`; each has the fixed SW–NE diagonal:

| Cell j | Cell i values |
| ---: | --- |
| 163504 | 6623, 6624 |
| 163505 | 6621, 6622, 6623, 6624, 6625 |
| 163506 | 6620, 6621, 6622, 6623, 6624, 6625, 6626 |
| 163507 | 6619, 6620, 6621, 6622, 6623, 6624, 6625, 6626 |
| 163508 | 6619, 6620, 6621, 6622, 6623, 6624, 6625 |
| 163509 | 6620, 6621, 6622, 6623 |
| 163510 | 6620, 6621 |

Before/after values at every modified node are **DEM metres**; accepted `nodeHeight` equals the declared after value exactly in this capture (zero residual). Native coordinates and complete probe data are in `tmp/top-cities/pont-mirabeau/quay-cut/{app-heights,terrain-audit}.json`.

| Node i | Node j | Station (m) | Lateral (m) | Before DEM (m) | After DEM (m) |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 6621 | 163510 | 17.388 | -34.360 | 45.15137 | 45.10628 |
| 6620 | 163508 | 20.361 | 21.800 | 45.87793 | 45.04066 |
| 6621 | 163509 | 29.809 | -12.491 | 45.28418 | 44.77438 |
| 6621 | 163508 | 42.230 | 9.379 | 45.39258 | 44.31333 |
| 6622 | 163509 | 51.678 | -24.912 | 44.72461 | 43.89548 |
| 6622 | 163508 | 64.100 | -3.043 | 44.79590 | 43.28470 |
| 6621 | 163507 | 54.651 | 31.248 | 45.01953 | 43.75507 |
| 6623 | 163509 | 73.548 | -37.333 | 43.90039 | 42.79065 |
| 6622 | 163507 | 76.521 | 18.827 | 44.29297 | 42.63299 |
| 6623 | 163508 | 85.969 | -15.464 | 43.90723 | 42.12923 |
| 6623 | 163507 | 98.390 | 6.406 | 43.51758 | 41.48316 |
| 6624 | 163508 | 106.467 | -28.079 | 43.14746 | 41.08615 |
| 6622 | 163506 | 88.942 | 40.696 | 43.26270 | 41.97233 |
| 6623 | 163506 | 112.187 | 27.868 | 42.93457 | 40.82235 |
| 6624 | 163507 | 119.944 | -6.844 | 42.88867 | 40.49262 |
| 6624 | 163506 | 133.444 | 14.371 | 42.35449 | 40.01945 |
| 6625 | 163508 | 127.637 | -41.567 | 43.42285 | 40.20521 |
| 6625 | 163507 | 141.072 | -20.321 | 43.90723 | 39.82101 |
| 6625 | 163506 | 154.664 | 0.822 | 43.46777 | 39.61960 |
| 6624 | 163505 | 147.174 | 35.593 | 42.88086 | 39.70509 |
| 6626 | 163507 | 162.395 | -33.932 | 42.07422 | 39.60084 |

No live HD tiles/sections or learned joins were available; a fresh `/osm-lanes/15/...json?v=4` request returned **503**, `osm lanes unavailable`, `overpass HTTP 500`. Live HD paint/counts/provider joins remain **not tested**; changed nonzero joins have focused regression coverage.

Live HD lane backend availability is reported separately from ordinary-road fallback continuity. Driving routes/car/camera exercise, repeated interactive mode switches, Tesla hardware and survey accuracy remain **not tested**. No deployment or publication was performed.
