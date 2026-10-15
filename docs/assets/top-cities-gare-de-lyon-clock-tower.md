# Gare de Lyon — clock tower and 1900 headhouse

Original procedural model of Marius Toudoire's Paris terminus at 4 Place Louis Armand, with the 67 m Tour de l'Horloge, stone Beaux-Arts headhouse, rue de Bercy return, Chalon range, Hall 1 glass-and-iron roof and a simplified modern Hall 2 extension. Source and exports are texture-free; no third-party mesh is used.

## Sources and measured frame

Research date: 2026-10-15. Started from the supplied OSM/facts/reference dossier under `tmp/top-cities/gare-de-lyon-clock-tower/`. [Wikipedia](https://en.wikipedia.org/wiki/Gare_de_Lyon) identifies Toudoire's new station for the 1900 exhibition (inaugurated 1901). The 67 m height is sourced from the [mapped tower](https://www.openstreetmap.org/way/115948339), rather than inferred from a photograph.

Photographs checked, including their Commons author/licence pages:

- [Gare De Lyon Paris](https://commons.wikimedia.org/wiki/File:Gare_De_Lyon_Paris.jpg), Tom Corser, CC BY-SA 3.0: front, tower and roof silhouette.
- [Facade of Paris-Gare de Lyon (5629782550)](https://commons.wikimedia.org/wiki/File:Facade_of_Paris-Gare_de_Lyon_(5629782550).jpg), Marie Thérèse Hébert & Jean Robert Thibault, CC BY-SA 2.0: tower proportions, arches, restaurant row and return wing.
- [Paris Gare de Lyon hall panorama](https://commons.wikimedia.org/wiki/File:Paris_Gare_de_Lyon_hall_panorama.jpg), Prateek Karandikar, CC BY-SA 4.0: broad curved shed, repeated iron ribs and glazing.

These are visual references only, retained in ignored scratch. Original code/docs and original model rights follow ADR-0044; mapped geographic data remains © OpenStreetMap contributors under ODbL 1.0.

| Feature | Model value | Basis |
| --- | --- | --- |
| Tower highest point | 67 m | OSM 115948339, also roof part 231095203 |
| Tower upper block | 38–50 m | OSM 231095201 height=50/min_height=35, tier allocation estimated |
| Dome and lantern | 53.8–67 m | OSM upper roof parts 231095202/203/204; profile estimated from photographs |
| Clock faces | four, diameter 6.4 m, centre at 44.1 m | photo-scaled estimate; no survey claim |
| Headhouse | approximately 88 m including tower, ridge 30 m | OSM 115948337, height 30 and mansard tags; exact part plan in source |
| Great fanlights | seven 7 m wide arches | photo-based simplification of facade rhythm |
| Hall 1 roof | 187.5 m long, 84.4 m wide, 20–30 m high | OSM 231098535 envelope and height/roof-height tags; curved profile follows hall photo |
| Rue de Bercy return | 23.5 m wall, 29.8 m ridge | mapped 115948491 height=30; mansard estimate |
| Chalon range | wall 23.6 m, flat roof 24 m | mapped 115928131 plan; simplified height below tagged 30 m |
| Modern Hall 2 extension | 10.5–13.6 m | mapped outline 1161318094; heights and roof divisions estimated |

Origin `[2.3735, 48.8448]`, metres east/up/south. Local y=0 is rigid flat-map station pavement, with no sea level, DEM, geographic stretch or moving renderer datum baked into the model. Authoring u runs northeast at 40° true; v runs southeast. Geometry receives a single 50° rotation about y, baked into both GLBs; the host must not rotate it again. Frontage faces northwest (310°).

Two facade controls on OSM 115948337 are approximately `[-16,2]` and `[21,-42]` east/south metres from the origin (long edge bearing about 40°). The adjacent roof 231098536 has the same alignment. This is checked against the red footprint plan in the roof renders.

## Ownership and construction

`footprint.js` retains the exact geographic rings and ids of station outline 1161318094, headhouse 115948337, transverse roof 231098536, tower 115948339 and all four tower upper parts 231095201/202/203/204, rue de Bercy return 115948491, Chalon range 115928131 and shed 231098535. The complete station outline is modelled, including a low Hall 2 extension, so ownership does not erase an unmodelled large station wing. Nearby offices, streets, terraces and furniture remain outside ownership.

The facade uses real punched arch/window openings in a stone wall slab, inset glazing and separate stone piers. Cornices, fanlight mullions, dormers and grouped allegorical heads/bodies articulate the headhouse. The clocks use circular geometry, twelve grouped marks and two hands per face; no font/image is used. The dome uses a measured-height lathed profile with ribs and supported lantern tiers. Shed glazing and opaque roof strips occupy separate surfaces, with repeated supported cross-ribs and longitudinal purlins. Its rear mouth stays open above the platform.

Stone carving and facade stone merge into one material, preventing reciprocal hidden-face depth ordering. The seven exported materials are stone, roof, glass, iron, clock, mark and glow. Pale muted limestone, grey zinc/slate and blue-grey clock dials derive from the photos. Night dims the stone/roof and warms the headhouse glazing. Far keeps arches, individual upper windows, dome tiers, all four clock faces and coarser shed ribs; it removes fanlight mullions, fine sculpture and alternate dormers.

Facade cornices and upper clockwork project beyond OSM wall outlines by up to 1.7 m; a focused test bounds every vertex to within 1.8 m of the owned rings. This is an architectural overhang, not an alignment correction. The plan is fitted independently of the 67 m height. The 250 m default pad is only a placement handoff; terrain sampling, pad policy, provider extrusion replacement and surrounding roads require lead verification in the app.

## Exported costs

| Detail | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 19,231 | 7 | 1,038,880 | 1014.5 |
| Far | 7,917 | 7 | 465,852 | 454.9 |

Default-scene costs, not hardware timing. Both LOD envelopes match, no vertex is meaningfully below y=0, and free-standing exports carry no bridgeLift attribute.

## Verification evidence

Judged the dossier `refs-sheet.jpg` and exported-GLB contact sheets under `tmp/top-cities/shots/gare-de-lyon-clock-tower/`. The final `verification.jpg` places the three reference photos beside: near light facade/street/detail/back/roof; far light overview/facade/detail/roof; near dark facade/detail; and far dark facade/detail. Individual renders follow `gare-de-lyon-clock-tower-glb-{near,far}-{light,dark}-{view}.png`.

Visual changes: the first pass had an unarticulated front return and weak clock contrast; added return arches, pilasters, window rows and blue-grey dials, then followed the Chalon range's diagonal exterior edges with individual bays. Far preserves the clock/dome outline and separate facade bays; its fanlight mullions are deliberately omitted. The reference comparison shows simplified carving and flatter Chalon roofing; these are approximations, not a survey reproduction. The broad glass shed is intentionally open and has no trains/interior furnishings. Station name lettering, detailed historic sculpture, platform equipment, exact individual Roman numerals and fine balustrades are omitted.

Focused tests pin the 67 m top, grade, LOD envelope and cost, four outward-facing clock disks, visible dome, seven glazed arches and stone piers, upper restaurant windows, open train-shed mouth, 30 m roof crown, footprint envelope and actual GLB round trip. Every shed rib/eave/purlin endpoint is checked against its named support using actual geometry, excluding itself; a deliberately shortened rib fails the contact threshold.

Deterministic QA: `qa-metrics.mjs --ids gare-de-lyon-clock-tower` reports both LODs **ok**, no material cycles in generated depth ordering, zero near back-face hits, no coplanar overlap issue, and no window-rhythm flags. Final checks: all eight landmark tests passed in 0.51 s, and all three Gare de Lyon registry tests passed; `pnpm assets:check` and `node scripts/asset-catalog.mjs` validated 406 entries / 790 GLB variants, `pnpm assets:preview` succeeded, and depth `--check` passed with zero cycle edges dropped. The requested combined registry/landmark command completed with 836 passes and one unrelated failure: `cathedrale-saint-jean-lyon` near GLB/source bounds mismatch (another builder in progress); no shared or other-landmark source was edited to address it. Logs: `tmp/top-cities/gare-de-lyon-clock-tower/tests.log`, `registry-focused.log`, and `metrics.json`. The final Chalon window winding was additionally pinned by an outward-facing ray test.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Independent likeness review, shared runtime material appearance, unobstructed app screenshots, terrain footing/pad edges and lifecycle checks remain with the lead; inspector images do not establish these gates.

## Rebuild

`pnpm build:top-cities-landmarks gare-de-lyon-clock-tower --no-check`

Regenerate/check depth layers with `node scripts/landmark-depth-layers.mjs --ids gare-de-lyon-clock-tower` and the same command plus `--check`. Focused verification uses `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/gare-de-lyon-clock-tower/gare-de-lyon-clock-tower.test.js`; then `node scripts/asset-catalog.mjs` and `pnpm assets:preview`. No runtime shared module was changed except the authorised generated depth table.
