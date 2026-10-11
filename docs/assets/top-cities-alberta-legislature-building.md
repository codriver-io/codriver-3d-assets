# Alberta Legislature Building, Edmonton

Original texture-free procedural model of the current exterior after the 2012–2014 terra-cotta dome restoration. Designed by Allan Merrick Jeffers and Richard Blakey; construction 1907–1913; officially opened 3 September 1912. Address: 10800 97 Avenue NW. At 800 m the eight-rib dome and open lantern identify it; at 100 m the six-column north portico, tall drum lights, rusticated basement and facade rhythm carry the recognition.

Build: `pnpm build:top-cities-landmarks alberta-legislature-building --no-check`. Editable modules and focused tests live in `src/peregrine/landmarks/top-cities/alberta-legislature-building/`. Runtime exports are the two GLBs and manifest in `public/models/buildings/`; local inspection pages and reference photos remain ignored.

## Sources and dimensions

[CTBUH](https://www.skyscrapercenter.com/building/alberta-legislature-building/47212) lists 57 m overall height. [The restoration team’s 2014 article](https://www.constructioncanada.net/a-legislative-legacy/) by Karl Binder, Rob Pacholok and Gary Sturgeon documents the eight dome octants, T-plan dimensions, granite first floor, Paskapoo sandstone and terra-cotta domes. Their 54 m major-dome peak differs from the 57 m overall listing; the difference in measurement endpoint is unresolved. [The Assembly’s chamber history](https://www.assembly.ab.ca/learn/the-legislative-assembly/chamber) records the first sitting in 1911 and official opening in 1912. No quotation, construction drawings or third-party mesh is reproduced.

| Quantity | Model | Basis |
| --- | --- | --- |
| Highest point | 57 m | Published CTBUH overall height |
| Lantern roof and finial | 55.7 m / 57 m | Estimated subdivisions of published overall height; article gives 54 m dome peak |
| Stem north/south length | 77.3 m wall line | OSM; restoration authors give 77 m × 24 m stem |
| Transverse envelope | 102.8 m wall line | OSM; article gives two approximately 40 × 29 m wings |
| Rotunda axis | local (-1,-1) m | Mapped dome parts |
| Dome diameter / drum springing | 21.2 m / 36.5 m | Diameter mapped, springing estimated |
| Drum columns | Eight paired clusters, 27.45–34.8 m | Photo estimate |
| Major ribs | Eight | Sourced restoration article |
| North portico | Six columns, 26.6 m wide, pediment 29 m | Width mapped; count observed; heights estimated |
| Wing parapet | 23.15 m | Photo estimate |
| Southern chamber dome | radius 10.4 m, top 29.2 m | Mapped location/diameter; sourced rise about 7 m above roof |
| North stairs | 5.2 m beyond wall mask | Estimated; no provider building extrusion exists there |

## Geographic frame and terrain

Origin `[-113.50661,53.53369]` is the dossier anchor beside the major dome. Real metres, east/up/south. The north portico top edge control points `[-113.5067826,53.5339061]` and `[-113.5064483,53.5339055]` define approximately 90.17° eastward, hence north frontage 359.83°. Geometry unrotates the mapped outline and bakes the corresponding 0.17° rotation once; the host must not rotate again. Mask rings include building way 42782487, major drum 949845607, chamber dome 949845608, lantern 949845609 and portico 949845610; unrelated small campus buildings are excluded. © OpenStreetMap contributors, ODbL 1.0. Data date: 2026-10-06.

Local y=0 is grade beside the raised granite basement. The river and bluff are south of the building; the fountain plaza is north. Neither is modeled. Full 3D world declares `terrainPad` restricted to the building outline, median datum with five distributed reference points (entrance, wings, stem and south end), and an 8 m feather. This avoids the default lowest-sample disc reaching down the valley. It is a placement proposal pending DEM/entrance/pad-boundary validation, never terrain certification. No terrain, altitude or Mercator stretch is in the GLBs.

## Architecture and materials

Mapped T-plan massing preserves wing setbacks and the rear chamber stem. The granite basement supports warm Paskapoo sandstone walls, limestone-colored trim and muted tan terra-cotta domes. Flat light/dark palettes use eight merged named materials. Select windows use self-lit `light` for a warm night read; the night trim and dome suggest floodlighting without invented lamp geometry.

Window panels and their trim project onto the actual mapped wall near each bay, rather than using an assumed cardinal wall plane. Three main window registers, arched lower openings, mullions, sills, lintels, rustication and attic panels form the facade rhythm. Six free-standing tapered fluted columns support the entrance entablature and triangular pediment over a recessed entrance wall. The circular drum has paired columns and tall arched lights, a balustrade, eight ribs and oculi, with an open eight-column lantern. The rear chamber saucer dome remains separate. Near includes flutes, mullions, stepped capitals, balusters and minor ribs; far keeps every principal volume, portico gap, drum light, major rib and lantern opening.

Approximate: storey heights, glazing/bay counts, side and rear facades (extrapolated from the mapped setbacks, no rear photograph studied), capitals and heraldic shield. The miniature shield is an abstract relief, not a reproduction of the arms. Stone color varies in reality. Sculpture, flags, interiors, landscape and fountain are omitted. Stairs extend 5.2 m beyond the north outline and cornices project at most about 0.5 m; the replacement mask stays the actual building, keeping nearby plaza and roads intact. The far model omits the small balustrade posts and most facade trim. Independent review recorded PASS-WITH-NITS (4/5); the subsequent dome nit fixes await coordinator recheck.

## Verification

Reference sheet viewed: `tmp/top-cities/alberta-legislature-building/refs-sheet.jpg`. Exterior photos: D. Benjamin Miller’s *Alberta Legislature Building, June 7, 2024* (CC0), Hugh Lee’s *Alberta Legislature Building at night* (CC BY-SA 2.0), Alexscuccato’s *Alberta Legislature Building* (CC BY-SA 4.0); source links in catalog. The interior reference was not used to author external geometry. No photos or textures ship.

First procedural near/light contact sheet showed buried glazing on skewed walls; facade placement was corrected against the actual mapped edge. Hidden panel-box faces were removed to reduce cost. Procedural comparisons cover north facade, rear, roof, street, dome close-up, portico close-up and the top plan with red mapped rings. Export and final evidence recorded below.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Local asset inspection verifies reusable geometry only; app lifecycle, provider replacement, terrain arrival and physical hardware remain untested.

## Export costs and final evidence

| LOD | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| Near | 34,724 | 8 | 1,632,516 | 1,594 |
| Far | 8,896 | 8 | 430,264 | 420 |

Far is 25.6% of near by triangles; both have identical bounding boxes (103.34 × 57 × 82.78 m including the entrance stair). Costs describe exported scenes, not measured device performance.

Final reference/export comparison **viewed**: `tmp/top-cities/shots/alberta-legislature-building/comparison-final.jpg`. It places the supplied reference sheet above four exported GLB sheets in order: near/light, near/dark, far/light, far/dark. Each sheet includes facade (north front), rear (south oblique), roof (above), street (entrance level), dome (close detail), portico (close detail), and top (mapped red rings). The individual sheet paths are `tmp/top-cities/shots/alberta-legislature-building/alberta-legislature-building-glb-{near,far}-{light,dark}-sheet.jpg`. Earlier exported comparison retained as `comparison-iteration2.jpg`.

The final geometric cleanup removed buried downward caps at the base/cornice/roof joints, compacted unused vertices, and changed cornice offsets from radial scaling to constant-width plan offsets; that last change prevents trim meeting the walls in the inner T corners. Lantern roof pinnacles improve the crown read without closing the lantern. All seven views and all four LOD/theme combinations were examined after cleanup; window rhythm is now present on both wings, roof surfaces have clear boundaries, and the north colonnade and lantern remain open in far. Minor capitals, rear elevations and relief remain approximations; the real dome springing has more intricate scrollwork.

`node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/alberta-legislature-building/alberta-legislature-building.test.js`: **166 passed, 0 failed** in the observed run, including all three named conformance tests and five landmark tests. The landmark-only run completed in about 0.24 s. Tests inspect geometry bounds, grounded stairs, north column contacts and gaps, the major/rear dome positions, open lantern, and both LODs. `node scripts/asset-catalog.mjs`: **valid (178 entries, 340 variants)**. `qa-metrics.mjs --ids alberta-legislature-building`: **no issues**, 0% back-face hits (232 intersecting rays), no removable lift data, min Y rounds to 0. The heuristic still lists 24 very small near-coplanar pairs totaling 2 m², below its issue threshold; no flicker was seen in the final exported views. Independent review recorded PASS-WITH-NITS (4/5); see the dome review fixes below.

No shared file was needed or changed. No git writes, full application test suite, dependency installation, development server or online deployment was performed; the shared exporter reported existing dependencies up to date. The single-object dossier was reused rather than issuing another Overpass request. Local catalog preview delivery uses the registered inspection URLs and screenshot renderer; application testing remains the coordinator’s separate step.

## Dome review fixes (2026-10-06)

The independent review at `tmp/top-cities/review/alberta-legislature-building/REVIEW.md` accepted recognition at 4/5 and requested three nits; the lead limited this pass to those dome features. One geometry/look iteration was used, with all other architecture and placement preserved.

- **Color:** the light terra-cotta palette changed from pale tan `#aa9776` to warm brown `#88694f`, clearly darker than sandstone `#c3b08a`. The existing night terra-cotta remains warm floodlit brown. This applies to both modeled terra-cotta domes.
- **Springing skirt:** the plain lower band now has a continuous eight-wave terra-cotta skirt and rounded scalloped moulding around the oculi. Its crests/troughs span 36–38 m, following the curved shell; closed top returns and the moulding attach it to that shell. It is retained in near and far.
- **Lantern:** pencil-thin single supports became thicker brown shafts (0.36 m base radius, formerly 0.25 m) with paired side members, base collars and broader capitals. Stepped base/cap bands now reach 2.9/2.95 m radius, while the lantern gaps remain open and the finial remains at 57 m.

The front dome/drum diameter relative to the portico was inspected beside photo 1; it already reads at the reference proportion, so the dome/drum mass was not enlarged. The mapped footprint, terrain pad, portico and wing elevations are unchanged. Molded detail is still an abstraction of the actual terra-cotta carving.

`REVIEW.md` supplied no Prepare command and no `REVIEW-2.md` exists. The equivalent repository preparation was run explicitly:

```sh
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids alberta-legislature-building --out tmp/top-cities/alberta-legislature-building/dome-fix-metrics.json
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids alberta-legislature-building --out tmp/top-cities/shots/alberta-legislature-building/dome-fix-review
```

The resulting **exported GLB** review sheet was viewed at `tmp/top-cities/shots/alberta-legislature-building/dome-fix-review/alberta-legislature-building.jpg`. Additional near/far light front/dome/portico sheets were viewed beside the supplied photo sheet at `tmp/top-cities/shots/alberta-legislature-building/dome-fix/comparison.jpg`; near/far dark front/dome sheets were viewed at `dome-fix/dark-comparison.jpg`. These comparisons show a stronger color separation, visible wave skirt in far, and a sturdier crown without changing the total height.

Before → after costs: near 31,428 → 34,724 triangles, 8 → 8 draws, 1,521 → 1,594 KiB; far 7,456 → 8,896 triangles, 8 → 8 draws, 385 → 420 KiB. Both retain identical bounds. Landmark tests: **5 passed**; catalog: **178 entries / 340 variants valid**. Geometry metrics: **no issues**, 0% back-face hits (233 intersecting rays), no byte/draw/triangle overrun; the original 2 m² of minor near-coplanar heuristic pairs is unchanged and below its flag threshold. Independent recheck of these nits and application integration remain separate.
