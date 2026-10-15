# The Parthenon, Nashville

Original procedural exterior of the complete permanent concrete replica in Centennial Park, Nashville, Tennessee, completed as a museum in 1931. This is the roofed Nashville building, with intact pediments and all perimeter columns. `SPEC.ready = true` records asset readiness for independent review; application integration remains separate.

## Sources and dimensions

Consulted 2026-10-15: the [museum history and architecture page](https://www.nashvilleparthenon.com/history), former museum director Benjamin Franklin Wilson III’s [1941 dimensional account](https://www.gutenberg.org/cache/epub/58665/pg58665-images.html), the supplied [OSM way 130913355](https://www.openstreetmap.org/way/130913355), and the reference-only photographs credited below. No additional Overpass request was needed.

| Feature | Model metres | Basis |
| --- | ---: | --- |
| Highest apex ornament | 19.812 | Published 65 ft; museum and Wilson |
| Lowest step length × width | 72.5424 × 33.8328 | Wilson: 238 × 111 ft |
| Upper stylobate length × width | 69.4944 × 30.7848 | Wilson: 228 × 101 ft |
| Perimeter column height | 10.3632 | Wilson: 34 ft including capital |
| Perimeter shaft base diameter | 1.8288 | Wilson: approximately 6 ft |
| Inner porch shaft diameter | 1.6764 | Wilson: 5.5 ft |
| Bronze doorway height × paired width | 7.3152 × 4.2672 | Wilson: 24 ft tall, 7 ft per leaf |
| Perimeter columns | 46; 8 ends × 17 flanks | Museum/Wilson; shared corners counted once |
| Inner porch columns | 6 at each end | Wilson |
| Upper platform datum | 1.8 | Estimated three 0.6 m steps |
| Entablature / eave / roof ridge | 12.1632–15.4 / 15.4 / 18.55 | Photo estimates, constrained by total height |
| Cella outer envelope | 47.2 × 21.4 | Photo/plan estimate |

Published measurements are converted exactly from feet, but their original survey precision should not be inferred from the decimal places. Entablature details, capital profile, tile spacing, palmettes, sculpture poses and cella depths are estimates. The exterior reconstruction dates to 1925; the museum’s completion/opening was 1931. These dates and the exposed concrete aggregate distinguish the permanent replica from the temporary 1897 exhibition structure.

## Frame, replacement and foundation

Origin `[-86.8133823, 36.149715775]` is the center of the four principal OSM rectangle corners. The long edge from `[-86.8138656,36.1496323]` to `[-86.8131014,36.1500439]` gives a northeast bearing of 56.29596°, baked into the mesh as a Y rotation of 0.58824641 rad. Model plan +x points to the northeast pediment; +z points southeast. Export axes are east/up/south, real metres, with the bottom of the lowest step at y=0. No terrain, altitude or Mercator stretch is baked in.

The dossier lists one provider way, `130913355`, without separate building-part ways. Its envelope is about 83 × 32.8 m, whereas the published bottom step is 72.54 × 33.83 m. The exact OSM ring is retained to own the full provider extrusion, and a second ring covers the slightly wider authored bottom step. This discrepancy is recorded instead of stretching the published temple dimensions to the map polygon. Raycast/vertex tests confirm both LODs remain inside the union. The top inspection confirms bearing and alignment.

A rigid median terrain pad uses these bounded rings and three foundation reference locations. Park paths, lawns, Lake Watauga, neighboring buildings and terrain stay outside the model. Full 3D world footing residuals and surrounding lattice-node coverage require separate app evidence.

## Geometry and materials

Self-contained Three.js source uses `assetBuilder` and three merged materials: warm muted `aggregate`, recessed pediment `recess`, and `bronze`. Twelve shallow concave flutes, entasis, echinus and square abacus form the near Doric shafts. The complete colonnade has open corridors and six inner porch columns at either end. The three steps are separate continuous courses; doors occupy openings cut into the cella masonry. Continuous architrave, frieze, alternating triglyph/metope reliefs, cornices, triangular pediments, original grouped human/horse silhouettes and apex/corner palmettes complete the exterior. Roof surfaces are closed, with a broad ridge and small widely spaced antefixes in near, without per-tile ribs.

Far retains every column, all corridor openings, both sculpted pediments, the same roof/step/apex silhouette, cella and doors. It simplifies shaft facets/capitals and triglyphs and omits small metope relief, fluting, roof ribs and antefixes. Both palettes use the same material keys. Dark is a subdued night palette; special colored illumination and physical floodlight fixtures are not simulated.

Sculptures are schematic original human and horse groups, not exact renderings of Kinney/Scholz’s individual figures or their narrative compositions. Optical horizontal curvature, varying column inclinations/diameters, microscopic aggregate texture, interior Athena/gallery/basement displays, accessibility hardware and the landscaped setting are omitted. No photo, scan, texture or third-party mesh is embedded.

## Visual evidence

Scratch paths below are ignored local review evidence, not public pages or committed photographs:

- `tmp/top-cities/parthenon-nashville/refs-sheet.jpg`: supplied six-photo sheet, inspected first.
- `tmp/top-cities/parthenon-nashville/refs/7.png`: clear complete oblique exterior, inspected for fluting, roofline and aggregate color.
- `tmp/top-cities/parthenon-nashville/refs/8.jpg`: museum’s assembled pediment group, inspected for human/horse grouping.
- `tmp/top-cities/shots/parthenon-nashville/reference-comparison.jpg`: references above near/light, far/light, near/dark and far/dark exported overview/facade/detail rows; inspected together.
- `tmp/top-cities/shots/parthenon-nashville/parthenon-nashville-glb-near-light-sheet.jpg`: final exported front, back, above, street and detail views; inspected.
- `tmp/top-cities/shots/parthenon-nashville/back-roof-street-final.jpg`: final opposite/above/street views for all four LOD/theme combinations; inspected.
- `tmp/top-cities/shots/parthenon-nashville/parthenon-nashville-procedural-near-light-sheet.jpg`: procedural overview/front/back compared with exported GLBs; bounds and silhouette agree.
- `tmp/top-cities/shots/parthenon-nashville/parthenon-nashville-glb-{near-dark,far-light,far-dark}-sheet.jpg`: six views per variant/theme, inspected including opposite facade and low entrance angle.
- `tmp/top-cities/shots/parthenon-nashville/parthenon-nashville-glb-near-light-top.png`: exported top view with exact OSM and authored step rings, inspected.

The first iteration showed weak flute shading and overly sparse stick-like figures. The second iteration split flute ridge normals, added draped skirts and grouped horses, and reduced column/lathe subdivisions while retaining the complete silhouette; roof planes received separate normals to keep the ridge and eaves crisp. Final sheets show the intact gable/roof, 8-column fronts, 17-column flanks, warm concrete and three steps. The sculpture is intentionally simplified; independent visual review is still required. The model is recognizable at overview distances; close architectural sculpture is not museum-replica quality.

## Export and verification

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 29,906 | 3 | 1,190,580 | 1,162.7 |
| far | 8,474 | 3 | 364,480 | 355.9 |

Both exports fit the building limits (60k/14/2.5MB near, 12k/8/500KB far). These are measured exported default-scene costs, not device timing. Both bounds are `[-39.5615,0,-34.2000]` to `[39.5615,19.8120,34.2000]`, apart from float32 roundoff. Build command: `pnpm build:top-cities-landmarks parthenon-nashville --no-check`.

Focused landmark tests verify dimensions, all column bays/openings, bronze door recesses, complete roof/pediments, every perimeter and inner-porch column-to-lintel support, a deliberately unsupported negative case, mapped rotation, footprint containment, grade and identical near/far bounds. Export QA metrics reports no issues; depth generation/check reports zero dropped cycle edges. The requested two-file conformance run passed all 840 tests; after the roof-normal correction, the relevant tests passed again (11 tests selected by name, including all five landmark assertions and exported GLB conformance). Catalog validation passed for 406 entries / 800 GLB variants, and `pnpm assets:preview` built successfully. The shared generated `depth-layers.js` was regenerated only with `--ids parthenon-nashville`; concurrent builders can overwrite a prior entry, so the lead should regenerate all IDs at commit time.

Cityscape: **visible placement verified in g13ar captures**. Full 3D world: **visible rigid placement verified in g13ar captures with terrain enabled**. Full integration lifecycle remains not tested. The lead must verify provider replacement, shared runtime shading, terrain pad footing/coverage, mode transitions and app LOD/lifecycle behavior before release. Contact sheets establish export appearance only.

## Reference image credit

All images remained in ignored scratch and were used only for comparison: *Nashville Parthenon at night at night 2024*, Jschnake, CC BY-SA 4.0; *Parthenon 20170829 A/B/C*, Kabbalahcat, CC BY-SA 4.0; *Parthenon Nashville 2024c/2024e*, Antony-22, CC BY-SA 4.0; [*Parthenon Nashville.png*](https://commons.wikimedia.org/wiki/File:Parthenon_Nashville.png), White.alister.t, CC BY-SA 4.0; [*Statues at Parthenon, Nashville, TN, US.jpg*](https://commons.wikimedia.org/wiki/File:Statues_at_Parthenon,_Nashville,_TN,_US.jpg), Bubba73 (Jud McCranie), CC BY-SA 4.0. The supplied sheet’s museum interiors and foggy park views were context, not external geometry sources. Geographic data © OpenStreetMap contributors, ODbL 1.0.

## Review repair g13ar — 2026-10-15

Removed all 178 narrow roof ribs that produced moire rings, retained the complete roof/ridge/eave silhouette, halved antefix density, reduced near shafts to twelve flutes/two height courses and capital subdivision, and coarsened only small frieze relief ellipsoids. Warm pale buff aggregate (#d2c4ad) replaces muddy khaki. Bronze leaves retain the published 7.3152 × 4.2672 m dimension; widened the surrounding masonry opening and raised the bronze value to make the paired doors visible. Near weight fell 32.7% to 1.19 MB decimal (1,162.7 KiB), above the approximate 1 MB aim but preserving all 58 columns, sculpture groups and frieze rhythm; further sculpture stripping would cost recognition. Far also saves 8,000 bytes.

Judged two exported look rounds in `tmp/next-200/fix/g13ar/parthenon-nashville/{iteration-1,final/near,final/far}/`: roof moire is gone, front/back colonnades stay open and the aggregate is pale buff. Final geometry QA reports no issues (0% back-face hits, no layered/coplanar faces or material cycles). All five focused tests pass. Slot K scratch bundle app evidence: `tmp/next-200/fix/g13ar/parthenon-nashville/app/{city,world}/{far,near,street,rear}.png` and adjacent reports. Visible provider replacement and rigid ground placement are checked; full lifecycle/terrain-arrival and hardware testing remain unverified.

Current review checks: both assigned landmarks pass their focused conformance checks (6 registry/export assertions) and all 14 combined landmark tests; catalog validation and assets preview pass. Required full top-cities conformance completed 834/835 with one unrelated `palais-du-luxembourg` exported near `trim` material mismatch; see `tmp/next-200/fix/g13ar/conformance.log`. No edits were made to that landmark.
