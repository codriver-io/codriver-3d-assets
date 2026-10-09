# Couvent des Jacobins, Toulouse

Original texture-free procedural exterior of the restored medieval convent at Place des Jacobins, including the church, octagonal belfry, north cloister, sacristy, small connecting chapel, chapter house, Saint-Antonin chapel and refectory. Temporary roof-restoration equipment is omitted. The adjoining Pierre-de-Fermat lycée is outside ownership.

## Sources and frame

The supplied dossier (`tmp/top-cities/couvent-des-jacobins/`) supplies OSM ways, historical facts and six attributed Commons photographs. The [official architectural guide](https://jacobins.toulouse.fr/fr/architecture-couvent-des-jacobins-toulouse/) establishes the brick construction, four belfry tiers with paired mitre arches, and 160 marble cloister colonnettes; [official highlights](https://jacobins.toulouse.fr/fr/incontournables-jacobins-toulouse/) gives a 45 m tower, 28 m interior palmier and refectory 55 m long / 15 m high. The [historical measured description](https://www.persee.fr/doc/bulmo_0007-473x_1946_num_104_2_9364) describes a church about 80 × 20 m; external mapped dimensions include its walls and buttresses.

OSM relations [1562254](https://www.openstreetmap.org/relation/1562254), [1605505](https://www.openstreetmap.org/relation/1605505), [1605509](https://www.openstreetmap.org/relation/1605509) were retrieved through the single-object OSM API after the shared Overpass helper returned HTTP 403. Member ways are joined by node IDs, preserving the cloister courtyard; five convent ways are from the supplied dossier (985193700, 985193704, 985193705, 985193706, 128537994). Only outer rings are provider replacement masks; the modeled cloister is open through its courtyard. Derived geographic data © OpenStreetMap contributors, ODbL 1.0.

Origin `[1.44023,43.60349]`, real metres east/up/south, local `y=0` is flat pavement. The mapped north-wall control points `[1.4397352,43.6035367]` and `[1.4400419,43.6035720]` give a long axis approximately 81° clockwise from north; the west facade faces 261°. Rotation is baked once into source and GLB. No absolute elevation or latitude stretch is baked in. The central Toulouse site is expected to be substantially level; `padM=115` covers the north refectory, with no authored terrainPad. Foundation and DEM behavior still require separate integration review.

## Dimensions

| Feature | Model | Basis |
| --- | --- | --- |
| Highest belfry pinnacles | 45 m | Official site; overrides OSM `height=49` |
| Belfry | Octagonal, four paired mitre tiers | Official site and close photo |
| Belfry flat-to-flat | Base 7.3 m; tiers 7.48 → 6.88 m; crown 7.96 m | Mapped envelope; photographic taper and corbel estimates |
| Church length | Approximately 81 m, approximately 88 m including extreme projections | Mapped outline; historical description approximately 80 m |
| Main nave wall width | 22.1 m | External mapped envelope; historical 20 m is an interior-scale description |
| Nave ridge / eave | 32 / 28.3 m | OSM `height=32`; eave estimated photographically |
| West central / corner turret spires | 38.5 / 36.5 m; octagonal shafts to 34 / 32.4 m | Revised photographic estimates, not a published survey |
| Interior palmier | 28 m, not modeled | Official site; not exterior roof height |
| Cloister shafts | 160 near, 80 far | Official near count; four simplified regular galleries |
| Refectory mapped length | Approximately 51 m | OSM enclosure; official historical interior description says 55 m |
| Refectory exterior ridge | 16 m | Estimate; official 15 m describes the room |
| Other convent roofs | 11.7–14.2 m | Photographic estimates |

## Model and approximations

The church shell has genuinely recessed upper Gothic bays, narrower tracery windows, a polygonal east apse, paired west rose windows, a portal, tapered buttresses and three octagonal west turrets with eight-sided terracotta spires. The octagonal tower has four tiers of open paired mitre bays, narrow central piers, projecting bands, a broader corbelled pierced crown above progressively narrower tiers and eight enlarged terminal pinnacles; it has no invented spire. The cloister preserves negative space and paired marble shafts. Near keeps capitals, roof seam relief, rose spokes, masonry bands and glazing bars. Far reduces curved profiles, gallery bay count and fine trim while retaining all roof/tower bounds and the cloister void.

Seven merged named materials: warm red brick, lighter brick trim, dark red-brown terracotta roof, dark recess, muted glazing, pale marble, and west-rose `glow`. Dark uses dimmer masonry and restrained warm rose glass; widespread artificial interior lighting is not assumed. Geometry is original, with no retained photograph, mesh, scan or texture in the runtime exports. Commons images stay in ignored scratch; all six dossier title/author/licence credits and the additional Pom² cloister panorama (CC BY-SA 3.0) are in catalog provenance.

Approximations: regularized church bay spacing, simplified glass tracery and rose spokes, estimated west portal profile, simplified convent roofs and small east annex roof/lantern. Decorative carving, interiors and the famous palmier, garden vegetation, furniture, gates and temporary construction works are omitted. Small facade projections are checked against the mapped rings with a sub-metre tolerance; no whole-building scale adjustment is applied.

## Verification

The first procedural contact sheet exposed rounded Gothic heads, costly extruded trim and reversed roof fans; these were corrected to sharper profiles, flat relief strips, correct roof winding and darker brick. Ray/footprint checks also exposed inward-facing apse walls; their orientation was corrected before final export. Refectory glazing was aligned to its slanted mapped wall. No shared file changes were needed.

Judged procedural sheet: `tmp/top-cities/shots/couvent-des-jacobins/couvent-des-jacobins-procedural-near-light-sheet.jpg`. Final export evidence and measured costs are recorded below. The views include facade, opposite/back, overview, roof, entrance, belfry and cloister detail. Reference comparisons: dossier `refs-sheet.jpg`, especially west front (Pistolero), east apse (Didier Descouens / Gzen92), belfry (Frédéric Neupont), and additional `refs/cloister.jpg` (Pom²).

Cityscape and Full 3D world: **not tested yet, integration is checked separately**. Device performance, provider mask lifecycle, terrain arrival, mode changes and pad behavior are not established by these asset checks.


Initial authoring export evidence (superseded by the revision below): `tmp/top-cities/shots/couvent-des-jacobins/couvent-des-jacobins-final-comparison.jpg` places reference photos beside all eight exported GLB views for near/light, near/dark, far/light and far/dark; all four component `couvent-des-jacobins-glb-<near|far>-<light|dark>-sheet.jpg` sheets were included in that visual review. Also judged `couvent-des-jacobins-glb-near-light-top.png` for mapped footprint/orientation. The corrected apse is closed from the opposite facade, all four tower tiers remain open in far, and night colors preserve the brick silhouette. Convent roofs remain approximate; the small east annex roof is a simplified pointed hip rather than a smooth dome.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: | ---: |
| near | 42735 | 7 | 1844472 | 1801.2 |
| far | 11527 | 7 | 493892 | 482.3 |

Focused landmark assertions pass in both LODs: sourced 45 m height, approximately 80 m church mass, both rose windows, door, four genuinely open belfry tiers with central supports, courtyard void, no below-grade vertices, mapped footprint containment with 0.55 m projection allowance, and near/far silhouette within 0.2 m. The three conformance checks for this landmark also pass (spec/catalog, geometry/budgets, and exported GLB/source/manifest agreement). The revision run passes all 256 focused tests, including the three Jacobins conformance cases and its three landmark-specific cases. Test output: `tmp/top-cities/couvent-des-jacobins/test-results-revision.txt`.

`node scripts/asset-catalog.mjs` passes after revision: 209 entries / 400 GLB variants. The initial `qa-metrics.mjs --ids couvent-des-jacobins` run passed with zero coplanar pairs, zero back-face hits (210 intersecting sweep rays), zero removable bridgeLift, minimum Y=0, top=45 m and matching LOD silhouette; saved `tmp/top-cities/couvent-des-jacobins/qa-metrics.json`. Weathering-band rear planes, belfry floor interfaces and refectory glass offsets were corrected after the numeric sweep identified coincident surfaces. Full application integration and independent coordinator review remain outstanding; no shared files, git write commands, runtime build, installation or dev service were used.


## Independent review revision, 2026-10-09

The lead requested defects 1–3 and cheap parts of defect 4 from `tmp/top-cities/review/couvent-des-jacobins/REVIEW.md`; no `REVIEW-2.md` was present. The photo sheet and west-front photograph establish octagonal turret heads with long pointed tile caps, while the belfry close-up establishes the broader upper crown.

- West facade: tiny square 33.25 m corner pinnacles → octagonal shafts reaching 32.4 m and eight-sided tile spires reaching 36.5 m; the central turret now reaches 38.5 m. Window relief runs around all eight shaft faces in both LODs. These heights are estimates; the overall official belfry height remains 45 m.
- Belfry: uniform 7.3 m tiers and narrow rim → tiers taper from 7.48 to 6.88 m flat-to-flat, then return to a 7.96 m corbelled pierced crown with broader eight-sided terminal pinnacles. Four genuinely open paired mitre tiers remain.
- Roof: light `#89503c` / dark `#4c3530` → darker red-brown light `#623b30` / dark `#342724`, separating tile from the unchanged brick palette across nave and convent roofs.
- Blank north-west refectory frontage: uninterrupted brick slab → eight west-side and three north-end pointed openings with trim; its existing hipped fan roof is retained. Nave buttress depth is retained to respect the mapped replacement envelope.

The review file contains no Prepare command. Its auto-framed layout was regenerated with `node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids couvent-des-jacobins --no-ref --tag "Revision: west turrets and belfry crown" --out tmp/top-cities/shots/couvent-des-jacobins/revision-review`. The name tile avoids the original tool's incorrect painting reference. Looked at the new `revision-review/couvent-des-jacobins.jpg` beside the supplied reference sheet, then the comprehensive `revision-themes/couvent-des-jacobins-revision-comparison.jpg` with references above facade/back/roof/belfry GLB views in near/far and light/dark. Two visual review iterations total; all evidence is under `tmp/top-cities/shots/couvent-des-jacobins/`.

Revision costs: near 40,955 → 42,735 triangles / 7 draws / 1,740 → 1,801 KiB; far 10,803 → 11,527 / 7 / 456 → 482 KiB. Both stay below the hard 60k/14/2.5 MB and 12k/8/500,000-byte caps. `qa-metrics-revision.json` reports no flagged issue, 0% back-face hits, grade 0, top 45 m, no bridgeLift and matching silhouette; its five small coincident candidates total 1.6 m² at the belfry/nave junction, below its artifact threshold. Landmark tests additionally raycast both corner spire tips and the taller center, and measure the crown projection relative to the top tier. Placement integration remains not tested in both modes.

Final revision acceptance: the focused `node --test .../top-cities.test.js .../couvent-des-jacobins.test.js` command passes 256/256, `node scripts/asset-catalog.mjs` passes, and numeric metrics report no budget or artifact flags. No shared files were modified; full application integration remains separate.
