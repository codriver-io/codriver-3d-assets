# Tour Incity — Lyon

Original procedural model of the completed 2015 tower at rue Garibaldi / cours Lafayette, designed by Valode & Pistre and AIA. Source, provenance, dimensions, verification and handoff are recorded below; no photograph or external mesh is shipped.

## Identity and sources

- [Valode & Pistre, Incity Tower](https://v-p.com/en/projet/incity-tower/): 2015 delivery, 200 m, north–south alignment and double-skin glass facade. The architect counts 37 floors; OSM/Wikipedia count 39.
- [Lyon Part-Dieu](https://www.lyon-partdieu.com/en/operations/incity-tower/): 200 m overall, 50 m mast, office use.
- [Wikipedia](https://en.wikipedia.org/wiki/Tour_Incity): 170 m roof, 154 m top floor and 39 storeys.
- [OSM way 368018684](https://www.openstreetmap.org/way/368018684): exact mapped outline, 170 m height, 39 levels, skillion roof, roof direction 352.3°. The dossier `osm.json` contains this outline; no additional Overpass request was needed.
- Reference-only photographs in ignored `tmp/top-cities/tour-incity/refs/`: [Lyon Tour Incity 2.jpg](https://en.wikipedia.org/wiki/File:Lyon_Tour_Incity_2.jpg), Zairon, CC BY-SA 4.0; [Tour Incity Lyon.jpg](https://en.wikipedia.org/wiki/File:Tour_Incity_Lyon.jpg), Aldg692VX, CC BY-SA 4.0. Both licences checked on their file pages. Dossier photo 1 shows La Défense and was excluded.

The task description mentioned a diagonal white exoskeleton. The photographs and architect description show a fine orthogonal curtain-wall grid, a bevelled roof rim and a slender mast. This model follows that evidence; an invented diagonal frame would misidentify the building.

## Frame and replacement

Real metres, +X east / +Y up / +Z south; local flat grade is y=0. Origin `[4.851004736316125, 45.76333066530078]` is the polygon area centroid. Geometry bakes the exact mapped ring, including rounded eastern corners and the north-west setback; no host rotation is required. North–south facade control points `[4.8511591,45.7634898]` and `[4.8512149,45.7631909]` establish the long axis, roughly 172.5° clockwise from north. OSM roof direction 352.3° supplies the down-slope direction; no terrain heights or Mercator stretch are baked in.

`FOOTPRINTS` owns only OSM way **368018684**. No detached or overlapping building parts occur in the dossier for this tower; adjacent apartments, parking and Halles buildings are outside its ownership. Crown rails extend at most 15 cm beyond the mapped ring. The 32 m pad encloses this rigid, single-grade foundation; terrain sampling and lifecycle remain app integration work.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Mast tip | 200 m | Published, architect / Lyon Part-Dieu |
| Highest crown rim | 170 m | Published roof height, Wikipedia / OSM |
| Top occupied floor | 154 m | Published, Wikipedia |
| Storeys | 39, with coarser paired rows in far | OSM / Wikipedia; architect reports 37 |
| Plan | 1085 m², about 28 × 39 m, skewed 7.7° from north | Mapped outline; axis-aligned envelope 32.6 × 41.7 m |
| Crown drop | 16 m toward north | Estimated from photos and five OSM roof levels |
| Open rim | 2.05 m above sloped roof deck | Estimated from photos |
| Mast | y=150–200 m, radius 0.36–0.12 m | Length published; embedding and diameter estimated |
| Facade pitch | ~1.45 m bays / 3.79 m office rows near; ~3.15 m / 7.58 m far | Estimated, budgeted simplification |
| Lobby | Two glazed tiers to 10 m | Estimated; no surveyed interior |

## Modeling and materials

The facade is one closed, tiled surface. Pale frame strips, muted blue glass panes and a sparse night-light pattern occupy disjoint cells; there is no concealed glass wall behind the grid and no layered facade overlays. Every pane is clipped against the sloping crown plane. Triangulated roof and bottom close the shell. The crown has actual open space between its thin balusters, retaining the angled rim in both LODs; every rail/post meets a named support. The tapering mast is embedded ten metres below the central roof surface.

Materials `glass`, `glassShade`, `glassPale`, `frame`, `roof`, `glow`, `light` merge to seven draws per LOD. Day glass is subdued blue-gray, with fine silver mullions; night glass darkens, sparse window cells glow warm and the rim lights cool blue. The real reflected sky, the double skin, the bank emblem, precise lobby doors and the lighting’s live air-quality colour are approximated or omitted. No signage blobs or ground clutter are added. All meshes are original, texture-free and self-contained.

## Verification

| Export | Triangles | Draws | Bytes | Repository KB (1024 bytes) |
| --- | ---: | ---: | ---: | ---: |
| Near | 17,368 | 7 | 1,330,880 | 1,300 |
| Far | 5,364 | 7 | 406,328 | 397 |

Both exported envelopes agree exactly, with grade at 0 and tip at 200 m. Source/GLB round-trip checks pass. Far preserves the complete outline, open crown, mast and discrete window grid at 31% of near triangles.

I **looked at** `tmp/top-cities/shots/tour-incity/tour-incity-procedural-near-light-sheet.jpg` against both valid dossier photos, then the exported comparison sheet `tmp/top-cities/shots/tour-incity/tour-incity-exported-reference-sheet.jpg`. The latter places Zairon and Aldg692VX references next to near/far day/night GLB views; it also shows the opposite and east facades, close crown, lobby, top-down footprint fit and street view. Individual GLB captures and four LOD/theme sheets are in the same directory. The plan follows the red ownership ring. The sloping open crown, rounded eastern corners and slim mast remain recognizable from opposite sides and in far LOD.

Changes after the first sheet: reduced the daytime brightness of self-lit window material to remove pale speckling, changed its deterministic distribution to avoid diagonal streaks, darkened the thin mast for skyline contrast, and darkened the day crown rim to match its reference. The final exported sheet was inspected after those changes. The simplified lobby and absence of reflected city imagery remain visible approximations; the facade is intentionally a subtle solid-color approximation of mirrored glass.

Validation, 2026-10-15:

- `pnpm build:top-cities-landmarks tour-incity --no-check`: passed.
- `node --test src/peregrine/landmarks/top-cities/tour-incity/tour-incity.test.js`: **11/11 passed**, 0.29 seconds. Observable tests pin height, inclined roof, open railing gaps, slender mast, opposite-face window rhythm, grade, footprint envelope and both-LOD silhouette; every crown member end is measured against the actual triangles of its named roof/post/rail support, excluding itself, with a shortened-end negative control.
- Required combined `top-cities.test.js` + landmark test run: **883/888 passed**, including all three Tour Incity registry tests and all 11 landmark tests. Five unrelated failures came from `chateau-de-vincennes` geometry, `custom-house-dublin` record readiness, and `chateau-de-versailles` readiness / geometry / manifest. Full output: `tmp/top-cities/tour-incity/test-output.txt`.
- `qa-metrics.mjs --ids tour-incity --out tmp/top-cities/tour-incity/qa-metrics.json`: **clean**, no removable attributes, coplanar overlap, layered-face issue, window-rhythm flag or back-face hits (0% of 412 rays). This fallback validates this landmark even while another record is incomplete.
- `node scripts/landmark-depth-layers.mjs --ids tour-incity`, followed by `--check`: passed; Only the permitted generated shared depth table was changed; the lead should regenerate all IDs when committing the batch.
- Whole `node scripts/asset-catalog.mjs` was attempted twice; `pnpm assets:preview` was attempted. Both catalog and preview are currently blocked by another builder’s unregistered `/models/buildings/chateau-de-versailles-far.glb`; an earlier attempt saw missing Wembley / Templo de Debod documentation. No other builder’s files were edited. The lead must rerun these shared checks once the batch records settle.

Editable files are this landmark’s config, footprint, geometry, views and test; exports are `public/models/buildings/tour-incity-{near,far}.glb` and `tour-incity.json`; provenance and inspection links are in its catalog fragment. No git writes, app build, dev server, full test suite, extra photo download or direct Overpass request was used.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Neither catalog readiness nor standalone screenshots establish terrain, provider masking, shared app shading, LOD lifecycle or device performance. Bridge road/traffic checks are N/A for this building. Independent review and unobstructed app screenshots in both modes remain with the lead.
