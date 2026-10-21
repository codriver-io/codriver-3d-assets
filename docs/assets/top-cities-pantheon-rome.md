# Pantheon — Rome

Original, texture-free procedural exterior of the surviving Pantheon / Basilica di Santa Maria ad Martyres, Piazza della Rotonda, Rome. The model represents the present surviving building, with its granite Corinthian porch, tall brick transitional block, cylindrical brick rotunda, concentric stepped lead roof and genuinely open oculus. Removed bell towers and ancient bronze pediment sculpture are excluded.

Source: `src/peregrine/landmarks/top-cities/pantheon-rome/`. Rebuild with `pnpm build:top-cities-landmarks pantheon-rome --no-check`. Original geometry, without third-party meshes, scans, font dependencies or textures. Code/docs follow the repository MIT terms; original exported models follow the public collection's CC BY 4.0 terms. Geographic data retains separate ODbL credit.

## References and dimensions

The supplied dossier was the research starting point. [Pantheon architecture](https://en.wikipedia.org/wiki/Pantheon,_Rome) identifies the Hadrianic reconstruction, conventionally dated about AD 126, its sixteen columns, dome, oculus, granite shafts, Corinthian capitals and bronze doors. Its summary infobox's 58m height is inconsistent with the structural section and mapped building parts; it was not used. Exterior form and materials were compared with the credited modern photographs below. No historic painting was used to establish the current roofline.

| Feature | Model | Basis |
| --- | ---: | --- |
| Internal rotunda diameter | 43.3m | Published section dimension; model internal circle |
| Oculus clear diameter | 9.1m | Published structural opening; actual uncapped aperture |
| Granite shaft height / nominal diameter | 11.9m / 1.5m | Published dimensions; slight entasis estimated |
| Corinthian capital height | 2.4m | Published order height, schematic acanthus and volutes |
| Bronze door envelope | 4.45 × 7.53m | Published dimensions |
| Exterior drum diameter | 57.4m; string courses 58.7m | Fit to OSM outline, separate from internal span |
| Exterior drum top | 28.3m | OSM way 23840631 height |
| Transitional block | 22.85m eaves / 28.5m upper pediment ridge | OSM way 245621144 maximum height; pitched profile estimated from modern facade photograph |
| Portico width / depth | 36.4 × 15.6m | Mapped envelope, photograph fit |
| Portico ridge | 24.4m; crest moulding 24.78m | Photographic estimate |
| Highest exterior rim | 44.0m | Estimate including shell thickness above interior dome |
| Rear annex / buttresses | 11.8m / 14m | Estimated subordinate masonry mass within southern outline |
| Present porch floor above grade | 0.25m | Estimate; buried ancient seven-step stair is not reconstructed |

The 43.3m figure describes the interior, not the outside drum envelope. The dome's interior surface is spherical; the exterior thickens toward its low stepped rings. Exterior rim height and the interior opening datum are consequently different. Capitals, eave mouldings, brick relieving arches, ventilation slots, original stroke lettering and rear masonry are schematic. Interior marble, coffers, altars, tombs, tiny brick joints, detailed weathering, bronze relief and neighbouring houses are omitted. No hardware performance claim is made.

## Geographic frame and ownership

Origin `[12.47683355, 41.898555]` is the rotunda centre. Units are real metres: east/up/south; y=0 is current exterior grade. The canonical portico faces -Z. Rotation +0.06175448 radians around Y is baked once, giving facade bearing approximately 356.462°. Two northern OSM controls `[12.4765759,41.8989896]` and `[12.4770170,41.8990099]` establish the 36.62m front edge and its bearing. No horizontal scale or terrain altitude is baked into the GLB.

The [OSM building relation 3374342](https://www.openstreetmap.org/relation/3374342) outer ring is assembled from ways 251373410 and 251470690. It includes the rectangular southern appendage, which is represented by low annex masonry. `OSM_WAYS` additionally lists all supplied provider parts: drum 23840631; stepped roof parts 251373429–435; oculus 30967221; transitional block 245621144; vestibule parts 251373427 and 251373434; and low parts 251373451 and 251373449. Adjacent houses and Piazza della Rotonda's fountain are excluded. Focused tests measure every source vertex against the owned outline with the provider's 0.8m boundary slack.

The foundation remains rigid. A median terrain pad uses the full owned ring and three representative references, with 3m feathering. Its terrain datum and surrounding lattice coverage require app verification; no DEM was baked or sampled by this authoring task.

## Geometry and visual verification

One merged mesh per material: stone, granite, brick, lead, bronze and recess. Both LODs retain the sixteen shafts, actual porch bays, bronze door, Agrippa inscription, ventilation slots, stepped roof and open oculus. Near capitals have two tiers of slim acanthus leaves; far has one coarse tier and simple volutes. The interior cavity and roof opening are physical geometry.

The independent g19a review correctly rejected the earlier claim that the model had no layered faces: its scan found approximately 1,005m² far and 71m² near. The October 15 review fix removes the rear annex brick top underneath the lead roof and the transition block brick front behind the stone facing. Side niches are now openings in the facing with backs 0.75m inside; grille bars have 0.72m clear depth from the transom backing. That pass also pushed the inscription strokes 0.55m (near) / 1.05m (far) ahead of the frieze to clear the layered-face scan, which left the lettering visibly hovering in front of the entablature; the 2026-10-21 fix below seats it on the stone as raised relief. The upper transitional block now ends in a second triangular stone pediment and pitched lead roof, with a stone roof-edge strip instead of lead backing the rake moulding.

The drum uses adjoining surfaces around real inset relieving-arch bands and ventilation slots. Darker subdued brick, two stone string courses and the top cornice (0.65m projection) give it the photographed tier rhythm. No brick outer skin remains behind these stone courses or recessed bands. Capital leaves and volutes are slimmer. The rear annex, arch bands, capital ornament and lettering remain schematic; no fine weathering or interior decoration is claimed.

Reference photographs judged: `tmp/top-cities/pantheon-rome/refs-sheet.jpg`, modern front/right and straight-front photos; and `refs/7.jpg`, the elevated exterior dome. Final exported evidence is under `tmp/top-cities/shots/pantheon-rome/review-fix-2/`: `pantheon-rome-glb-near-light-sheet.jpg` and `pantheon-rome-glb-far-dark-sheet.jpg`, each covering overview, facade, back, roof, street and detail. The first look-fix iteration is retained in `review-fix-1/` with near/far light sheets. Two look-fix iterations were used; the final sheets confirm the upper gable, clearer drum tiers, retained open porch/oculus and reduced capital bulge. These are ignored local inspection artifacts.

## Costs and validation

| Export | Triangles before → after | Draws | Bytes before → after | Final KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 27,120 → 28,064 | 6 → 6 | 959,460 → 1,010,440 | 986.8 |
| Far | 10,368 → 11,312 | 6 → 6 | 469,420 → 486,416 | 475.0 |

Before is the October 15 review-fix export; after is the 2026-10-21 inscription relief. Bytes are as `build-top-cities-landmarks.mjs` printed them, before license stamping (about 0.5 KB more). The October 15 fix had itself raised near from 22,844 triangles / 672,244 bytes and far from 6,764 / 252,864. Both fit the building budgets. The October 15 increase represents actual cut recesses, stone courses and the second pediment rather than stacked panels; the 2026-10-21 increase is the letters' side faces. Near bounds are approximately `[-29.348,0,-50.708]` to `[29.348,44,34.727]`; far now differs by less than 0.02m (the floating far letters previously pushed it 0.1m forward). No removable bridge attributes remain.

Exported QA after the 2026-10-21 fix (`qa-metrics.mjs --ids pantheon-rome`) reports no issues: zero near coplanar pairs, 0% backface hits over 396 rays, no member-end, window-rhythm, bounds or budget flags. The inscription is a deliberate attached layer. Its 236 bronze face triangles (2.36m²) stand exactly 0.12m (near) / 0.14m (far) in front of the frieze, inside `layeredFaces`' conservative 0.2m/0.5m screening gaps. The shipped scan bins faces by an approximate normal plane and catches only part of the inscription: 0.3m² near (12 faces) and 1.0m² far (104 faces), below its 2m² issue threshold. An exact per-face scan would list all 2.36m² in both LODs. This is a limitation of the heuristic, and the letters do not float: they are closed solids whose sides meet the stone. The near ≥10cm overlay guidance in `references/quality.md` is met; host depth precision at far range is not verified. The October 15 claim of a 0.5487m near / 1.0488m far gap described the floating lettering and no longer applies. Host depth-rank tables (not in this repository) were not regenerated for this export.

All seven Pantheon geometry tests pass, including pitched upper-gable rays, cut niche/transom depths, projected stone courses and physically inset arch bands, plus the existing dimensions, sixteen columns, open porch/oculus, named capital/beam contacts, unsupported negative control, mapped footprint and far silhouette checks. No test asserts release readiness. Registry/conformance output is in `tmp/top-cities/pantheon-rome/review-fix-tests.log`; final shared-check status is recorded below. No shared app bundle, app server or full suite was built or run.

Cityscape: **not tested by this fix pass**. Full 3D world: **not tested by this fix pass**. The g19a reviewer found clean grounding and no provider overlap in both modes; the lead must recapture app evidence against these revised exports before final integration approval. Export sheets do not certify terrain, shared runtime shading or lifecycle behavior.

## Review fixes (2026-10-21)

Review finding: the M·AGRIPPA strokes floated 0.55m (near) / 1.05m (far) ahead of the frieze face at z=-49.05, so oblique and street views showed the lettering hovering in front of the entablature. Each stroke is now a closed bronze prism. Its hidden back sits 0.02m inside the frieze, its sides meet the stone, and its face stands 0.12m proud in near and 0.14m in far. Both depths stay inside the 0.15m cornice projection above. Letterforms, the 5.4cm stroke width and the 0.63m letter height are unchanged. Far shares each prism's eight corners (smooth normals on sub-pixel strokes) to stay within its 500 KB budget; near keeps flat-shaded faces.

Verification on the exported GLBs, both LODs (scratch `/tmp/landmark-fixes/pantheon-parliament/`, not committed):
- Grazing rays 1cm in front of the frieze along the inscription band hit letters 0/67 before and 67/67 after.
- Rays from street and two oblique eyes to all 236 letter faces hit bronze exactly 0.12m / 0.14m proud. Nine high-west near rays are hidden by the dentil course, as expected.
- All 944 side faces point outward.
- Before/after close-up renders (street oblique and raking along the frieze) show the letters seated on the stone.

The contact sheet was re-inspected. The seven Pantheon geometry tests and the registry conformance tests cited in this document live outside this repository and were not rerun. License stamping, thumbnails, the library build and Cityscape/Full 3D world captures are outside this fix and remain **not tested**.

## Photograph credit

Only comparison photographs remain in ignored scratch; no photograph is exported or committed. [Pantheon (Rome) - Right side and front](https://commons.wikimedia.org/wiki/File:Pantheon_(Rome)_-_Right_side_and_front.jpg), NikonZ7II, CC BY-SA 4.0; [Pantheon (J)](https://commons.wikimedia.org/wiki/File:Pantheon_(J).jpg), ParsonsPhotographyNL, CC BY-SA 4.0; [Pantheon (Rome) - Dome exterior](https://commons.wikimedia.org/wiki/File:Pantheon_(Rome)_-_Dome_exterior.jpg), Luistxo, CC BY-SA 4.0. Dossier interior images and historic paintings were viewed as context only, not used as modelling references. Geographic data © OpenStreetMap contributors, ODbL 1.0.

## Final shared-tree check state

The seven Pantheon tests pass in `review-fix-tests.log`. All three scoped registry/spec/geometry/export conformance tests pass in `review-fix-conformance-scoped.log` (`node --test --test-name-pattern=pantheon-rome src/peregrine/landmarks/top-cities/top-cities.test.js`). Catalog validation passes with 425 entries / 836 variants (`review-fix-catalog.log`), and `pnpm assets:preview` passes (`review-fix-preview.log`). Its partial output remains in `review-fix-tests.log`. Independent re-review and revised Cityscape/Full 3D world app captures remain with the lead.
