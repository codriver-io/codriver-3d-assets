# Canadian Museum for Human Rights, Winnipeg

Original procedural reconstruction of Antoine Predock’s museum, completed in 2014, at 85 Israel Asper Way, The Forks. Source: `src/peregrine/landmarks/top-cities/canadian-museum-for-human-rights/`. The recognizable elements are the spreading stone roots and planted roofs, four overlapping blue glass shells, stepped limestone gallery cliff, a broad approach stair flight and continuously tapering 100 m Israel Asper Tower of Hope. Both LODs preserve these elements.

## Sources and rights

- [CMHR — The Building](https://humanrights.ca/about/building): primary source for the 100 m tower, 1,335 custom glass pieces in the Cloud, 1,669 in Cloud and tower combined, 24,155 m² total building area, Tyndall stone and three prairie roofs. Those glass counts describe the building, not this approximation’s tessellation.
- [Museum outline, OSM way 131229325](https://www.openstreetmap.org/way/131229325), glass part 131229326, tower part 306556703 and all 16 other parts listed in `footprint.js`: mapped outlines, height tags and orientation. Dossier `osm.json` reused; the outline/cloud/tower were checked again through the shared Overpass helper, saved as `tmp/top-cities/canadian-museum-for-human-rights/osm-controls.json`.
- [Museum identity and history](https://en.wikipedia.org/wiki/Canadian_Museum_for_Human_Rights): 2014 opening and architect identity, also supplied in the task.
- Dossier reference sheet `tmp/top-cities/canadian-museum-for-human-rights/refs-sheet.jpg`, inspected directly. Commons photo titles/authors/licences are listed in the catalog record and dossier `refs/SOURCES.txt`: Quintin Soloviev (CC BY 4.0, completed museum aerial), Ethan Sahagun (CC BY 4.0, illuminated night view), Herb Neufeld (CC BY 2.0, construction front), Client42 (CC BY-SA 4.0, tower overlook), Wpg guy (CC BY-SA 3.0, architectural model), Ccyyrree (CC0, rear construction view). Construction photographs establish the geometry; temporary cranes/scaffolding were excluded.

Original geometry only, no third-party meshes or photograph textures. Code is repository-owned procedural authoring; geographic derivatives retain OSM/ODbL contributor attribution. No contributor licence acceptance was invented or public publication performed.

## Geographic frame and dimensions

Metres, +X east, +Y up, +Z south. Origin `[-97.131, 49.8908]` is a fixed nearby anchor inside the mapped complex, not a surveyed centroid. Local y=0 is the level entrance/plaza grade, with no terrain or sea-level height baked in. Geometry uses the mapped coordinates directly, so geographic orientation is already exported.

| Feature | Value | Basis |
| --- | --- | --- |
| Tower tip | 100 m (structural bars reach about 100.04 m) | CMHR published height; bar thickness is a rendering tolerance |
| Whole root envelope | about 135.3 m east-west × 120.2 m north-south | mapped outer way, not a published main-building width |
| Glass envelope | about 89 m × 62 m in plan | mapped cloud part |
| Tall rear gallery | 57 m | OSM height tags on ways 308812811/812 |
| Other gallery tops | 38, 45, 48, 54, 63 m | mapped tags except 63 m central riser, estimated |
| Main cloud | four overlapping sheets; lower edge 20–26 m, folded lips 33–64 m | estimated planar-panel profiles using mapped envelope and photos |
| Roots | west 14/30 m, southwest 17 m, south 16 m, southeast 24 m | mapped heights; nonlinear roof slope and toe at 1 m estimated |
| Tower plan | about 13 m across below 55 m; continuous taper through 78% width at 75 m, 45% at 90 m, 30% at 100 m | mapped six-sided outline; taper and upper glazing estimates |
| Stair approach | 39.9 m run × 11.5 m width; 16 m rise; 80 near treads / 25 aggregated far treads | photo-estimated placement and dimensions |
| Stone courses | roughly 0.68 m near, 2.8 m far | deliberately aggregated approximation |
| Foundation pad | 90 m | covers the root tips on this level urban site; not a terrain certification |

Two control points on the tower’s north edge are `[-97.130787,49.8907725]` and `[-97.1306656,49.8907761]` (bearing about 87.4° from north). They establish the skew of the rear galleries and tower. All nineteen mapped provider ways (outer envelope plus eighteen building parts) are listed, including the skinny entrance and upper glass parts. No neighbouring building or roadway is owned. The stair flight occupies an authored rectangle between the west and southwest roots, outside the OSM building outline but within the museum approach plaza; this is the twentieth footprint ring and is explicitly separate from the nineteen mapped OSM ways. Every model vertex is tested against the building or staircase envelope with the provider’s 0.8 m ownership slack.

## Modelling decisions

Mapped limestone polygons have course-batched exterior walls and non-convex triangulated roofs. Walls along shared boundaries begin above the neighbouring roof instead of duplicating faces. Three root roofs use a nonlinear height profile to read as curved prairie slopes. Their inner ends touch the cloud podium; the stone cliff rises behind the glass.

The Cloud now uses four overlapping angular glass shells: a low wrap, a west-facing upper fold descending towards the front, an opposing front/east fold rising to the right, and a taller east blade. Each sheet has a leaning facade, an individually sloping lip and a glazed roof return. The roof is glass with panel ribs, rather than the earlier pale rounded deck. Facade and roof panels are planar, with merged mullion quads at least 0.18 m proud; glass returns close the inner edges and ends into the gallery volume. Far preserves all four sheets and the same slope changes.

The irregular six-sided Tower of Hope tapers continuously above the gallery, with no abrupt changes of width at floor rings. Its lower blue-grey shaft extends down to the podium for a structural contact. The upper crown uses transparent `towerClear` glazing, slender continuous ribs, diagonals and staggered opaque panel tops at 94–99 m. The clear envelope and ribs retain the 100 m tip. A lit entrance strip follows the southeast podium face.

The broad straight staircase between the west and southwest roots has actual horizontal treads, vertical risers, closed sides and attached low parapets. Far aggregates the flight into 25 steps rather than deleting it or replacing it with a smooth wedge. A separate authored approach footprint documents the small plaza area outside the mapped building outline.

Ten merged named materials near, seven far. Stone shades vary subtly by course; three restrained blue glass tones provide a reflection-like effect without textures or vertex colours. Cloud glass roughness is 0.3, metalness 0.24 and remains opaque; `towerClear` uses standard alpha blending at opacity 0.24 to expose the crown lattice. Dark palettes dim stone and glass and retain the warm tower-edge and entrance `glow` material. Far uses coarser stone courses and panel grids, retaining all roots, four glass folds, rear cliff, continuous tower taper and stairs.

## Approximations and limitations

The cloud curvature and fold are authored from the reference photographs rather than architectural CAD; small individual panel cuts, the complex internal steel framework and roof folds are simplified. The upper tower uses a continuous crystal profile and a transparent lattice-like crown; its detailed panel cuts and frame arrangement remain approximate. Prairie roof slopes and hues are approximate, and the plinth is more regular than the real limestone masses. Exterior lettering, furniture, other paths, trees, interior ramps and the full landscaped plaza are omitted. No claim is made that the authored panel count matches the 1,335 actual unique panes.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. The Forks site is expected to use a rigid grade-level foundation; no separate hill/terrace is authored. Because the nearby rivers could affect the default lowest-sample disc, pad datum and terrain edges require app verification. Roads, traffic and navigation are outside this asset task. Independent reviewer acceptance remains for the coordinator.

## Export cost and verification after independent-review fixes

The initial independent review rated the model **FIX, recognisability 3/5**. The lead agreed with three defects: a smooth bowl with a flat rounded roof, a tower broken into abrupt tiers, and a smooth approach without the broad stair flight. The earlier attempt to tighten the two bowls and add shelf reductions did not satisfy that review; those approaches have now been replaced.

| Review defect: before | Revised model: after |
| --- | --- |
| Smooth concentric bowls, broad pale roof deck | Four separately sloped, overlapping planar-panel glass shells, a rising east blade and glazed roof returns; no pale cloud deck |
| Abrupt three-tier tower | Continuous hexagonal taper, slender ribs and transparent lattice-like crown with staggered upper glazing |
| Smooth pale approach wedge | Broad straight stair flight with level treads, risers and connected parapets; coarser real steps retained in far |

The limestone roots and mapped gallery cliff were preserved. In the first fix iteration I inspected `tmp/top-cities/shots/canadian-museum-for-human-rights/review-fix/canadian-museum-for-human-rights.jpg` against the supplied reference sheet. The final iteration strengthened the opposing slopes of the upper folds and their outward lean. I inspected `tmp/top-cities/shots/canadian-museum-for-human-rights/review-fix-final/comparison.jpg`: the exported near/far review sheet, Commons dossier photos and exported near/dark and far/dark sheets side by side. The review sheet contains reference, near southwest, near northeast, street, top, close west, far southwest and far northeast views; both dark sheets add facade/rear/roof/street/cloud/tower detail. There were **two look-fix iterations** for this dispatch. No further visual or recognisability verdict is claimed for the independent reviewer.

### Final measured exports

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 33,668 | 10 | 1,754,292 | 1,713.2 |
| far | 6,442 | 7 | 360,188 | 351.7 |

Before this fix: near 34,906 / 9 / 1,792.6 KiB; far 5,960 / 6 / 322.8 KiB. Both revised exports fit the hard building budgets with headroom, and far keeps the exact near envelope at about 19% of near triangle cost.

### Checks and evidence

- `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/canadian-museum-for-human-rights/canadian-museum-for-human-rights.test.js`: **171 passed, 0 failed**, including eight museum tests and three museum conformance checks. The eight museum tests alone finish in about 0.3 seconds. New ray tests check continuous tower width around the old shelf heights, folded roof glazing at four points with more than 5 m of height variation, actual horizontal stair treads and risers, and containment within the mapped building or authored approach ring. Log: `tmp/top-cities/canadian-museum-for-human-rights/review-fix-tests.log`.
- `node scripts/asset-catalog.mjs`: **passed**, 178 entries / 344 variants at validation time.
- `qa-metrics.mjs --ids canadian-museum-for-human-rights --out tmp/top-cities/canadian-museum-for-human-rights/review-fix-metrics.json`: **no issues**; zero coplanar pairs, 1.4% back-face hits over 220 hits (under the 2% threshold), no removable lift bytes, min y=0, no budget overrun.
- REVIEW.md supplied no Prepare block; the repository’s standard `qa-metrics.mjs` and `qa-sheet.mjs` commands were used for this ID, with final sheet output under `tmp/top-cities/shots/canadian-museum-for-human-rights/review-fix-final/`.
- `pnpm assets:check` and `pnpm assets:preview`: passed for the revised models; output remains an ignored local inspection tool.

Remaining approximations: the four cloud sheets are an original photographic reconstruction rather than surveyed panel geometry; roof folds and limestone massing are still simplified, tower transparency is stylized, and stair dimensions/placement are estimated. Cityscape and Full 3D world remain **not tested yet, integration is checked separately**. The revised exported sheets are ready for the coordinator’s independent re-review. No shared source files, app code, roads, deployments or Git writes were required.
