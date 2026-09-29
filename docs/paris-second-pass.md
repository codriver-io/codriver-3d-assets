# Paris: second architectural refinement

Five existing models, revised 2026-09-29 after visual feedback. The target is recognition from street level, with original procedural geometry and no imported photo textures or third-party meshes.

## paris-tour-eiffel

Second pass: curved chords with dense secondary lattice, lift rails, deep platform trusses, glazed observation strips and a two-storey summit gallery. Original architectural geometry only; illumination shows are excluded.

## paris-louvre

Second pass: projecting courtyard pavilions, articulated dormers and west-facing Sully detail; includes a 35 m square, 21 m high entrance pyramid with transparent diamond glazing. Pyramid location (170, 0) follows the schematic court frame and needs surveyed geographic alignment.

## paris-grand-palais

Second pass: intersecting glazed vaults, rounded nave ends, fine glazing bars, paired truss ribs, raised ridge lanterns and a flattened cupola with radial and concentric framing. The glass roof uses tinted opaque glazing for predictable rendering; interiors are not modeled.

## paris-musee-orsay

Second pass: seven monumental river-facing arches, full-height clock pavilions with curved crowns, dark steep roofs, raised glazing strips, pier ornament and abstract roof statuary.

## paris-hotel-de-ville

Second pass: projecting pavilions, chimney stacks, cross-mullioned windows, pediments, statue niches, roof cresting and a two-level open octagonal campanile. Sculptures remain abstract original silhouettes.

## References and scale

- [Eiffel official dimensions](https://www.toureiffel.paris/fr/le-monument/chiffres-cle): 125 m base, 25 m piers, floors at 57/115/276 m, tip at 330 m. Intermediate structural stations and secondary lattice are traced estimates.
- [Louvre palace and pyramid](https://www.louvre.fr/en/explore/the-palace/a-pyramid-for-a-symbol): the museum gives rounded 35 m base / 21 m height. The diamond pattern is modeled, not an exact pane or connection count. Courtyard placement and palace geometry remain schematic.
- [Grand Palais project contractor aerial](https://www.cegelec-tertiaireidf.com/references/le-grand-palais-paris/) and [official dimensions](https://www.grandpalais.fr/sites/default/files/BROCHURE-LOCATION-GRAND-PALAIS.pdf): 200 m nave / 50 m span; crossed vaults, rounded roof ends, shallow cupola, roof lantern and glazing hierarchy are exterior-photo estimates. The western palace wings are outside this nave study.
- [Orsay architecture guide](https://www.musee-orsay.fr/sites/default/files/2021-07/De_La_Gare_Au_Musee.pdf) and [river-side reference](https://www.cometoparis.com/fre/ce/musee-d-orsay-m9000636): published hall 138 × 40 × 32 m; roof, towers and seven central arch bays follow the exterior elevation. The hotel envelope is estimated.
- [Ville de Paris campanile](https://www.paris.fr/pages/l-hotel-de-ville-abrite-cinq-lieux-insolites-7659) and [frontispiece reference](https://www.tourmag.com/Journees-Europeennes-du-Patrimoine-Visite-de-l-Hotel-de-Ville-de-Paris_a105184.html): 50 m campanile; roof cresting, chimneys, statue niches and cross-mullioned windows are simplified original geometry.

Reference photos are linked, not redistributed. The models remain architectural approximations; no survey, close-up sculpture fidelity or exact historic pane counts are claimed. Code MIT and model CC BY 4.0 attribution are unchanged.

## Placement and verification

Metres, east/up/south, local rigid y=0; no DEM baked into geometry. Near/far share the major forms and openings. The Louvre pyramid is a component of `paris-louvre`, not an unregistered separate model. The host must preserve translucent glazing during material conversion.

| Mode | Result |
| --- | --- |
| Standalone procedural / GLB, near / far, day / night | Browser inspection; façade and roof screenshots accompany this revision. |
| Cityscape, flat app placement | Not tested visually for this revision. |
| Full 3D world / topography | Not tested visually for this revision. Rigid-base placement is a separate host check. |
| Actual car hardware | Not tested. Export metrics are not frame-time measurements. |

## Current exported costs

| Asset | Near: triangles / draws / bytes | Far: triangles / draws / bytes |
| --- | --- | --- |
| `paris-tour-eiffel` | 55,248 / 5 / 2,232,336 | 13,584 / 5 / 511,400 |
| `paris-louvre` | 155,885 / 8 / 8,397,548 | 44,059 / 8 / 2,459,088 |
| `paris-grand-palais` | 114,000 / 6 / 4,686,944 | 27,966 / 6 / 1,060,784 |
| `paris-musee-orsay` | 60,215 / 7 / 3,301,684 | 18,819 / 7 / 1,037,004 |
| `paris-hotel-de-ville` | 41,804 / 7 / 1,942,068 | 17,880 / 7 / 824,408 |

Validation: catalog/license/contribution checks and seven geometric regressions pass. Library browser checks cover all 34 viewers; the five revised models were additionally checked as source/GLB, near/far, day/night and façade/roof.

Follow-up: [window, niche and roof-support fixes](paris-rendering-fixes.md).
