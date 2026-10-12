# Motherland Monument, Kyiv

Original procedural stainless-steel Motherland Monument (Mother Ukraine), on the museum pedestal above the Dnipro; this is the contemporary shield with the Ukrainian trident installed in 2023. Source: `src/peregrine/landmarks/top-cities/motherland-monument/`. Contract: [top-cities landmarks](../top-cities-landmarks.md).

## Identity and sources

The dossier supplied the OSM building/part extract, Wikipedia facts, six Commons photographs and their credits. [Mother Ukraine](https://en.wikipedia.org/wiki/Mother_Ukraine) was rechecked for the dimensions and contemporary shield. The current front and oblique references are photographs 1 and 3; photograph 4 establishes the museum podium and hill relationship, and photograph 5 establishes the road-distance silhouette. Photograph 6 shows the obsolete Soviet emblem and was used only for shield shape, never its heraldry. No photographs, scans, textures or third-party mesh are part of the source/export.

Visual reference credits (CC BY-SA 4.0, retained only in ignored scratch): «Батьківщина-Мати на фоні похмурого неба», Арманов; Motherland Monument Tank, Omar David Sandoval Sida; Mother Ukraine 2023, Гусєв Олександр; Монумент та прапор, Seencleyr; Kyiv - Mother monument, Віктор Полянко; Rodina mat Kiev (arms), Георгий Долгопский. Individual file URLs are in the catalog provenance.

## Dimensions and frame

| Element | Model | Basis |
| --- | --- | --- |
| Overall tip | 102 m | Published Wikipedia description; OSM sword part 1421908683 |
| Figure including weapon | 62 m, y=40–102 | Published; pedestal/robe contact y=40 follows OSM upper pedestal |
| Sword including grip | 16 m, y=86–102 | Published; blade/grip division, width and guard estimated |
| Shield | 13 m high × 8 m wide, y=77–90 | Published dimensions; pose/placement estimated from current photos (OSM models a shorter vertical part) |
| Head | Top 81.5 m, about 4.5 m wide | Estimated anatomy and swept hair from front/oblique photos |
| Robe | y=40–65, maximum width approximately 12.8 m; 20 longitudinal pleats | Estimated; noncircular elliptical sections taper at the waist |
| Pedestal | y=13–40, radius 15.1–8.45 m, 16 lower buttresses and glazed slots | Heights and lower envelope mapped; profile, ribs, slots and buttress count estimated |
| Museum base | Parent mapped envelope; two entrance wings 7.5 m, central roof 13 m, tapering outer roof lip 0.25 m | OSM tier heights; connecting roof profiles and glazed bays estimated |
| Axis | [30.563060582456142, 50.426552964912275] | Mean of the mapped pedestal ring, way 1421908684 |
| Facing | 56.5° from north, baked rotation 123.5° about Y | Mapped sword vs shield control points; approximately NE toward the Dnipro |

Coordinates are real metres, +x east, +y up, +z south; local y=0 is museum plaza/entrance grade. The OSM control points are sword part 1421908683 near [30.56318,50.42644] and shield part 1421908682 near [30.56293,50.42663], on opposite sides of the pedestal axis. No hill, DEM value, absolute altitude or Mercator stretch is baked into reusable geometry.

`FOOTPRINTS` is the exact parent museum envelope (way 1421908687); `OSM_WAYS` enumerates all 121 dossier ways, including the many statue slices, sword, shield, museum wings and pedestal parts. The parent envelope covers the modeled rigid podium as well as all higher geometry. The base follows mapped geographic coordinates directly; only the statue rotates. The host must not rotate it again.

## Modeling and LOD

The sculpture uses closed lofted elliptical sections for its pleated robe, broad bodice, drooping shoulder sleeves, shaped forearms and neck, with separate human hands, jaw/forehead planes, eyes, nose, lips, ears and swept hair. The sword has a hand-supported grip, crossguard, broad blade and pointed tip. The shield is a closed, slightly arched rounded escutcheon with an embossed angular three-prong tryzub and visible openings between its prongs. All geometry is original.

Near uses finer elliptical sections and hair waves, fingers and chest folds; far uses fewer sections and hair waves while retaining the complete human pose, robe pleats, face, sword, shield and trident, all sixteen pedestal buttresses and glazed slots, and the museum outline. The low terraces are simplified, rather than a detailed landscape reconstruction. Far preserves the exact near export bounds.

Six merged materials in both LODs: subdued silver `steel`, darker gray `pedestal`, warm gray `museum`, subdued green `roof`, dark `glass` and dark stainless `emblem`. Light/dark palettes match keys. Museum and roof surfaces form disjoint connected bands rather than overlapping layers. Night is dimmer steel/stone without invented self-lit metal or windows.

## Verification and visual changes

I inspected the dossier sheet and the exported GLBs in the comparison contact sheet `tmp/top-cities/shots/motherland-monument/motherland-monument-reference-glb-contact.jpg`: photographs 1/3/4/5 next to facade, rear, roof and close detail for both near/far and light/dark. The individual sheets have names `motherland-monument-glb-{near,far}-{light,dark}-sheet.jpg` in the same directory. Near/light also includes overview and street-level views, which I inspected separately in its sheet. GLB/source bounds are checked by the round-trip test.

The first look exposed an overly rounded face and a museum material cycle. The face was changed to firmer cheek, brow and jaw planes with narrow eye slits; the museum uses one surface material and a continuous podium instead of intersecting colored roof layers. The second look led to retaining the pedestal slot rhythm in far and using faceted robe/bodice normals so the cloth folds remain readable. Final sheets preserve the sword/shield negative space, recognizable long dress and contemporary trident; fine facial likeness and cloth still remain stylized approximations rather than sculptural replicas.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 13,995 | 6 | 454,516 | 443.9 |
| Far | 4,543 | 6 | 215,200 | 210.2 |

Both fit the building budgets with substantial headroom. `qa-metrics` reports no issues, zero layered/coplanar area, and 0% back-face hits over 160 rays. Depth generation and `--check` pass, with zero dropped cycle edges. Eight landmark tests pass: observed dimensions, human parts/sky gaps, actual three-prong material hits, measured pleat relief, sword/shield/forearm contact with named hands and sleeves (including a deliberately shortened grip that fails contact), complete ownership/containment, and exported GLB round trips/bounds.

The combined registry + landmark command ran 465 tests: 462 passed; Motherland's eight focused tests and three registry checks all passed. The three failures belonged to other builders' in-progress Tower of London catalog/export readiness and Fountain Place readiness. A catalog run was temporarily blocked by an unregistered Basilica de los Angeles Cartago export; final catalog/preview attempts are blocked solely by another builder’s missing `docs/3d-top-cities-marine-building.md`. The isolated registry selection passes all three Motherland conformance tests. No other landmark or shared runtime source was edited; only the authorized generated depth table was regenerated.

## Integration gates and limitations

Cityscape: **not tested yet; integration is checked separately**. Full 3D world: **not tested yet; integration is checked separately**. The bounded median `terrainPad` uses the owned museum envelope and five reference points near the pedestal, with an 8 m feather, avoiding a lowest-sample disc on the Dnipro hillside.

The museum's external envelope and broad roof tiers are modeled, with earth-covered outer roofs, but the surrounding green landscape, exterior stairs, terraced paths, tanks, large flag, exhibition interiors, fine welded panel grid, sword observation-platform rails and full anatomical likeness are omitted/simplified. No hardware performance measurement or application screenshot is claimed. The lead owns renderer bundle rebuild, unobstructed Cityscape and Full 3D world captures, independent review and release.

## Independent-review corrections, 2026-10-12

Review fix: removed the uniform 7.5 m outer slab; continuous museum roof tiers taper to a 0.25 m grade lip outside the two glazed entrance wings, while the central thirteen-metre museum roof and pedestal remain rigid. Broader asymmetric hips, deeper folds and hanging sleeves survive far; sword/shield contacts and current trident are retained. Roof elevations between mapped tiers and exact entrance bay widths are estimated; both modes were visually verified in revised app captures (2026-10-12, four bearings in Full 3D world) and passed independent re-review; hillside DEM residuals were not measured numerically.

Judged exported near/far light/dark sheets under `tmp/top-cities/shots/motherland-monument/review-fix1/`; near sheets include facade/detail and the initial round includes roof/opposite or rear views. Museum and statue changes passed after one look round; Fountain Place needed a second round because matching colours alone still left bright unshaded daytime patches. Exported QA reports no material cycles, layered/coplanar flags, back-face hits or unsupported-member flags for these three assets. The 28 focused landmark tests and all 475 registry conformance tests pass; catalog validation and assets:check pass (286 entries / 560 variants), and assets:preview generated the local catalog. Updated app Cityscape and Full 3D world captures (2026-10-12) were visually verified and passed independent re-review; these exported sheets alone do not certify terrain placement.
