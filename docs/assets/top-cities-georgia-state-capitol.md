# Georgia State Capitol — Atlanta, Georgia

Original procedural exterior of the 1889 Capitol at 206 Washington Street SW, in its present gold-leaf dome state without temporary construction. The pale limestone Renaissance Revival body, six-column west portico, tall windowed drum, ribbed yellow-gold shell, open lantern and white Miss Freedom silhouette identify this building. The United States Capitol source and notes were studied for efficient batching and readable dome stages; no external mesh, scan or photograph is used in the asset.

## Sources and dimension basis

Primary sources checked on 11 October 2026: the [2005 Georgia state visitor brochure](https://dlg.usg.edu/record/dlg_ggpd_s-ga-bs700-b-pm1-b2005-bc33-belec-p-btext) and [1987 visitor brochure](https://dlg.usg.edu/record/dlg_ggpd_s-ga-bs700-b-pm1-b1987-bv5), preserved by the Digital Library of Georgia. They establish the Indiana limestone exterior, six west columns, dome diameter and Dahlonega gold. Their descriptions of the 237 ft 4 in height refer to the rotunda, and their statue dimensions disagree; those ambiguities are retained here rather than treated as an external survey.

| Feature | Published/mapped value | Model | Basis |
| --- | --- | --- | --- |
| Height reference | 237 ft 4 in = 72.3392 m | Summit 72.34 m above local grade | Official brochure figure adopted as authoring height; summit datum interpretation estimated |
| Gold dome diameter | 75 ft = 22.86 m | 22.86 m at shell springing | Both state brochures |
| Main west columns | Six Corinthian shafts on large piers | Six, retained in both LODs | State brochure and entrance photograph |
| Storeys | Four above the basement composition | Basement plus three window rows / tall chamber bays | OSM four-level tag, facade photographs; row heights estimated |
| Miss Freedom | 1987: 15 ft; 2005: 22 ft | Approx. 4.6 m robed figure including raised torch, plus 1 m pedestal | 15 ft interpretation; original silhouette, not a sculptural survey |
| Architectural envelope | OSM: approximately 107.6 m along wings, 84.9 m through porches | Walls/approaches fit mapped outline with <0.85 m trim tolerance | OSM dossier; brochure maximum dimensions are not used to scale the map |
| Body cornice, drum, gold springing | No stage survey used | 28.5 / 36.6–47.4 / 49.3 m | Photo estimates |
| Lantern and statue pedestal | No stage survey used | Lantern 60.9–64.15 m, pedestal 66.65–67.65 m | Photo estimates |
| Bay widths, window arches, relief, rustication, roof pitch | Not measured | Editable procedural parameters | Reference photographs |

Mapped provider ownership is limited to [building outline way 113041732](https://www.openstreetmap.org/way/113041732) and [dome building part 536753432](https://www.openstreetmap.org/way/536753432). Adjacent churches and government buildings are excluded. The prepared `tmp/top-cities/georgia-state-capitol/osm.json` and `osm.txt` were reused; no additional Overpass calls were required.

The origin `[-84.38813,33.74905]` is a nearby rotunda anchor. Architectural axes are rotated **−33.5 degrees about Y**, baked into every vertex; the west frontage consequently looks northwest at bearing 303.5 degrees. Control points `[-84.3881305,33.7494129]` and `[-84.3882262,33.7492931]` define a straight wing wall with an axis bearing of 33.59 degrees modulo 180. The longer east-side wall between `[-84.3881423,33.7486941]` and `[-84.3880176,33.7488533]` gives 33.08 degrees. The authored 33.5 degree fit accounts for small survey irregularities without stretching the building. Real metres, east/up/south, y=0 at the west approach; no terrain, altitude or Mercator stretch is exported. The red-footprint top view and a vertex containment test verify the placement fit.

## Reference photographs and rights

The dossier sheet was read first; photo 2 depicts the old Milledgeville capitol and photo 6 is a historical aerial, so neither informed the present exterior model. Current photographs used and their Commons author/licence pages checked:

- [DXR, Georgia State Capitol, Atlanta, West view 20160716 1](https://commons.wikimedia.org/wiki/File:Georgia_State_Capitol,_Atlanta,_West_view_20160716_1.jpg), CC BY-SA 4.0: limestone colour, wing massing, facade and tall chamber openings.
- [Ken Lund, Georgia State Capitol, Atlanta, Georgia](https://commons.wikimedia.org/wiki/File:Georgia_State_Capitol,_Atlanta,_Georgia.jpg), CC BY-SA 2.0: west portico, six-column arrangement, pediment and approach.
- [Connor.carey, Georgia-state-capitol-dome](https://commons.wikimedia.org/wiki/File:Georgia-state-capitol-dome.jpg), CC BY-SA 3.0: drum windows, mouldings, ribs, lantern and Miss Freedom.

Photographs remain in ignored dossier scratch storage and appear only in local QA contact sheets. No photo, texture or third-party mesh is committed or embedded in either GLB. Original procedural source/model; mapped outline © OpenStreetMap contributors, ODbL 1.0.

## Model decisions and limits

Five merged materials: subdued pale `stone`, grey-green `roof`, inset window `light`, shaded gold dome `gold`, and bright rib/lantern `lamp`. The broad dome shell now receives surface shading to show volume; its narrower self-lit gold ribs replace shell strips with shared seam vertices. They are continuous geometry, rather than layered bars over the shell. Dark mode dims the stone and warms the windows/dome; this is a stylistic night palette without measured illumination or a light simulation.

The mapped cross-shaped plan retains stepped wing returns and unequal west/east entrances. Near has true facade window holes with recessed glazing, window transoms, stone sills, dentils, rustication, grouped capital/relief masses and 22 grounded stair steps. Far retains every separate window bay, the arched chamber openings, six free west shafts, eight lantern supports, drum bays, dome ribs, statue and eight-step west approach. Far removes hidden interior wall caps and small surface details; welding repeated vertices preserves normals/hard edges and limits export bytes. The drum has sixteen photographic-estimate bays, not a sourced count.

Sculptural relief and Corinthian leaf work are abbreviated connected masses. Miss Freedom is an original robed silhouette with raised right torch and lowered left sword; it is not an accurate sculptural replica. Modern flags, equipment, tiny railings, forecourt statues, landscaping and interior rooms are omitted. Roof pitches and the back porch are inferred from available photographs and the map; no modern aerial was available in the dossier. This limits roof survey fidelity. Windows represent glazing rather than rooms. The street-visible profile is the intended level of detail.

The base stays rigid at grade. A bounded median terrain pad over the owned outline is supplied as metadata to avoid a lowest-sample disc; sample points and 9 m feather are provisional.

## Exports and verification

Export command: `pnpm build:top-cities-landmarks georgia-state-capitol --no-check`.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| near | 34,234 | 5 | 1,570,836 | 1534.0 |
| far | 10,272 | 5 | 444,316 | 433.9 |

Both are texture-free self-contained GLB 2.0 with normals and no compression/decoder extension or removable bridgeLift attribute. These costs are measured default-scene export metrics, not Tesla hardware performance. Far preserves the source silhouette within 0.5 m per horizontal bound while simplifying cornice detail.

Two visual review rounds were performed:

1. Read `tmp/top-cities/shots/georgia-state-capitol/initial/georgia-state-capitol-procedural-near-light-sheet.jpg`: checked all seven authored views. The shell read as plain pale gold and the first far export exceeded budget. Replaced overlaid rib bars with continuous gold strips, removed the hidden lantern core, omitted far wall back caps and welded vertices. The revised gold remains yellow rather than orange.
2. Read **`tmp/top-cities/shots/georgia-state-capitol/verified/georgia-state-capitol-export-reference-contact-sheet.jpg`**: exported near/far, light/dark, each in overview, west facade, opposite/back, roof, street, dome detail and entrance views, beside the three current reference photos. The drum stage changes, dome ribs, lantern voids, six free column gaps, window rhythm and grounded steps remain visible in far; sculpture/trim simplify. Also read `verified/georgia-state-capitol-glb-near-light-top.png` against the red outline. The mapped envelope fits; no visible float, hole, flipped face or material flicker was found in these static views.

`tmp/top-cities/georgia-state-capitol/metrics.json` records clean geometry QA: no issues, zero different-material coplanar overlaps, zero screened close-layer area in either LOD, and 0% back-facing first hits across 239 successful near rays. Landmark tests cover the gold diameter, observable torch summit, drum glazing, lantern openings/support contacts, all six west shafts and gaps, balcony/entablature contacts, continuous stairs, an intentionally free endpoint negative control, exact provider ids, footprint containment, material/window rhythm and near/far bounds. The shared conformance suite also checks the actual GLB round trip and manifest costs.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Acceptance run: the prescribed two-file `node --test` command passed **383/383 tests** (including five landmark-specific tests and the Georgia Capitol GLB conformance checks). `node scripts/asset-catalog.mjs` passed with **266 entries / 446 GLB variants**. `node scripts/landmark-depth-layers.mjs --ids georgia-state-capitol` regenerated the selected model with **zero dropped cycle edges**, and the matching `--check` passed; `cycles.json` was read and was empty. Logs are `tmp/top-cities/georgia-state-capitol/{focused-tests,catalog-check,depth-regenerate,depth-check}.txt`. No app server, full test suite, package installation or Git write command was run; shared depth metadata was touched only by the brief-authorized generator. Earlier catalog errors were transient concurrent missing documents and resolved on the final acceptance run.

This authoring evidence does not establish terrain integration, lifecycle behaviour, rollout or publication.

## Independent-review fix — 2026-10-12

The uniformly lemon-yellow self-lit shell was replaced by shaded muted gold broad panels (#b7a15d day / #c5af69 night), with bright yellow-gold continuous ribs (#d8c27b day / #e3cf89 night) and lantern cap. Shell/rib material assignment was reversed without layering or adding a draw; shared seam vertices and the 22.86 m diameter remain. Dome volume now reads through surface shading, while pale limestone, lantern voids and Miss Freedom retain their silhouettes.

Exported GLB contact sheets in `tmp/top-cities/shots/georgia-state-capitol/review-fix/` were inspected: overview, west facade, opposite facade, dome and entrance (near/light); overview and dome (far/light and near/dark). The dossier exterior reference sheet and prior `tmp/next-200/qa/b1/sheets/georgia-state-capitol.jpg` were compared. One look-fix iteration was used; the changes preserve recognisable near/far features. Static sheets do not establish runtime flicker or terrain integration.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 34,234 | 5 | 1,570,836 | 1534.0 |
| far | 10,272 | 5 | 444,316 | 433.9 |

Final combined prescribed run passes 411/411 tests (three landmark test files plus `top-cities.test.js`); log `tmp/top-cities/bank-of-america-plaza-atlanta/review-fix-tests.log`. Scoped deterministic QA reports no issues, no close-layer/coplanar defects, retained far window rhythm and 0% near backface hits; report `tmp/top-cities/bank-of-america-plaza-atlanta/review-fix-metrics.json`. Scoped depth generation and freshness check pass with zero dropped cycle edges; `cycles.json` is empty. The global catalog and preview checks currently encounter another builder's missing `docs/3d-top-cities-vulcan-statue.md`; final retry status is in the handoff report.

Cityscape and Full 3D world remain **not verified by this worker**: the review's existing app evidence is insufficient for the new exports. Fresh unobstructed application shots, shared-material appearance, provider/terrain contacts and independent re-review are lead-owned. No provider ids/rings, shared renderer logic, Git state or app server was changed. Earlier export/check narratives above are historical and superseded by this section.
