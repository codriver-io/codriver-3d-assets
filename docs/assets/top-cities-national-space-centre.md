# National Space Centre — Leicester

National Space Centre: the42 m rounded ETFE Rocket Tower with inflated horizontal pillows, dark meridian structure, low metal-clad exhibition hall and geodesic planetarium dome.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/National_Space_Centre)
- [National Space Centre:42 m Rocket Tower and ETFE pillows](https://www.spacecentre.co.uk/plan-explore/explore/rocket-tower/)
- [Grimshaw: exhibition hall, spiralling roof and geodesic planetarium](https://grimshaw.global/projects/culture-and-exhibition/national-space-centre/)
- [OSM provider footprint / building part 124859850](https://www.openstreetmap.org/way/124859850)
- [OSM provider footprint / building part 267528358](https://www.openstreetmap.org/way/267528358)
- [OSM provider footprint / building part 177654793](https://www.openstreetmap.org/way/177654793)
- [OSM provider footprint / building part 177654794](https://www.openstreetmap.org/way/177654794)
- [File:National Space Centre from main entrance.jpg — Timfilbert; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:National_Space_Centre_from_main_entrance.jpg)
- [File:National Space Centre, Leicester.jpg — Ned Trifle; CC BY-SA 2.0; comparison only](https://commons.wikimedia.org/wiki/File:National_Space_Centre,_Leicester.jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/national-space-centre/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-1.1355655,52.6518830,-1.1302345,52.6551170.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Rocket Tower | 42 m | Owner |
| Tower plan | approximately22 ×23 m | Estimate from mapped curved wing controls and exterior photos |
| Hall roof | 9–12 m | Photo estimate |
| Planetarium | approximately20 m diameter /19 m top | Exact mapped plan; estimated exterior height |
| POD and entrance wing | 5 m | One-storey/photo estimates |

Origin `[-1.131649,52.653763]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Main hall diagonal [-1.1331593,52.6537455] to [-1.1325278,52.6532266] fixes its baked site angle. The curved wing arc [-1.1318141,52.6537213] through [-1.1318082,52.6537925] to [-1.1315554,52.6538619] constrains the Rocket Tower position and plan; OSM maps the tower inside that wing without a separately tagged42 m part. The tower ellipse is reconstructed from those arc controls and photographed proportions, not a surveyed circular footprint.

## Model and foundation

A closed original ETFE skin has12 courses of inflated pillows, six meridian sectors, rounded top and structural seam strips. Pillows are actual curved geometry in both LODs, without photographic texture or transparent overlapping shells. The mapped low hall and entrance wing have metal wall rhythm and a gently rising roof around the mapped geodesic planetarium, with a single documented spiral break. Roof surfaces under the dome and tower are cut out. The separate mapped POD remains a low block. Indoor rockets and exhibits, flags, signs, parking and surrounding buildings are omitted.

Only42 m Rocket Tower height is owner-published. Its ellipse, pillow course count, opaque translucent material, frame, hall roof rise and low-wing heights are photo-calibrated exterior estimates. OSM does not separately resolve the Rocket Tower; its geographic fit uses the curved portion of way177654794. Photos2 and3 are checked current built exteriors; the interior exhibit photo is rejected. The geodesic dome is owned by way267528358.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 10162 | 7 | 156664 |
| far | 3270 | 7 | 64572 |

Deterministic QA: `tmp/batch/national-space-centre-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/national-space-centre.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/national-space-centre/national-space-centre-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/national-space-centre/national-space-centre-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Self-review: two looks. The finished silhouette has a rounded42 m ETFE crown and actual pillow bulges in near/far, with narrow horizontal seams and dark meridian structure. The low hall has visible panel divisions, entrance glazing and a separate mapped planetarium; no exhibit mesh, imagery or signage is exported.
