# Paris street-level refinement — 29 September 2026

Target: recognizable from street level, with more accurate proportions and defining details.
This is the first review pass after the initial Paris collection. Source, near/far
exports and catalog IDs stay paired. Photographs and institutional plans are linked
references only: no third-party image, texture or mesh is redistributed.

Published dimensions guide the Eiffel base/floors, cathedral facade/roses,
Madeleine columns and Orsay hall. Intermediate sections, ornament, dome profiles,
footprint extents and support dimensions remain visual estimates. This is not a
survey, a close-up sculptural replica, or a hardware performance certification.

## What changed

| Asset | Revision |
| --- | --- |
| `paris-tour-eiffel` | Broader curved lower piers, four-sided X bracing, separate upper shaft, framed floors and connected decorative arches. |
| `paris-arc-de-triomphe` | Layered cornices, masonry courses, framed relief groups and a more legible frieze; sculpture remains abstract. |
| `paris-notre-dame` | 43.5 m west facade, 9.7 m west rose, 13.1 m transept roses, open belfries, narrower nave and two tiers of flying buttresses. |
| `paris-sacre-coeur` | Tapered central cupola, small corner domes, centered rear campanile, stepped frontispiece, open triple porch and bronze equestrian silhouettes. |
| `paris-invalides` | Radial drum openings, curved gold dome ribs, column capitals, side elevations and crown cross. |
| `paris-louvre` | Mansard pavilions, Sully roof and clock, articulated street/court bays, dormers and eastern paired colonnade; pyramid remains excluded. |
| `paris-palais-garnier` | Seven entrance bays, paired upper columns, loggia, rounded side pavilions, ribbed cupola and differentiated fly tower. |
| `paris-grand-palais` | Lower glazed nave with transverse ribs and longitudinal bars, raised crossing, side colonnades and entrance orders. |
| `paris-petit-palais` | West-facing arch and gilded gate, façade columns and bays, shallow ribbed entrance dome, retained garden void. |
| `paris-musee-orsay` | 138 x 40 x 32 m hall guide, lower vault, mansards, dormers and vertically oriented river-facing clock dials. |
| `paris-pantheon` | Column bases/capitals, stepped portico approach, curved dome ribs, nave bays and pilasters. |
| `paris-hotel-de-ville` | Mansard roofs, visible gabled dormers, detailed clock face, façade pilasters, balustrade and side/rear bays. |
| `paris-conciergerie` | Distinct western crenellated tower, closer twin central towers, Gothic bays and gilded eastern clock. |
| `paris-madeleine` | 52 articulated columns, complete ascending steps, continuous peristyle, entablature and abstract pediment relief. |
| `paris-institut-de-france` | Tangent-aligned curved-wing bays, cornices, entrance order, radial drum openings and curved dome ribs. |
| `paris-pont-alexandre-iii` | 15 near-detail steel ribs, open spandrels, bank abutments, pylon cornices, candelabra and denser ironwork. |
| `paris-pont-bir-hakeim` | Three unequal spans per arm, open steel arches, full-width river piers, repeated curved Métro brackets; posts moved out of vehicle lanes. |
| `paris-pont-neuf` | Full-width masonry vaults, cutwaters, semicircular refuges, dressed arch rings and lamps; five/seven arch split retained. |
| `paris-pont-iena` | Five regularly distributed masonry vaults independent of alignment nodes, rounded cutwaters and stylized eagle reliefs. |
| `paris-pont-concorde` | Five regularly distributed shallow vaults independent of alignment nodes, full-width piers, parapets and lamps. |

## References

- [Eiffel Tower official dimensions](https://www.toureiffel.paris/fr/le-monument/chiffres-cle)
- [Notre-Dame official plan](https://www.notredamedeparis.fr/comprendre/architecture/plans/)
- [Sacré-Cœur facade and campanile](https://www.sacre-coeur-montmartre.com/decouvrir/patrimoine-et-art-sacre/lentree-et-sa-facade/)
- [Garnier facade restoration](https://www.operadeparis.fr/actualites/restauration-de-la-facade-principale-du-palais-garnier)
- [Grand Palais educational dossier](https://www.grandpalais.fr/sites/default/files/2025-03/dossier_pedagogique_grandpalais_grandpalaisrmn_promenade_2018.pdf)
- [Orsay original hall](https://www.musee-orsay.fr/en/node/283773)
- [Madeleine dimensions](https://www.paris.fr/pages/la-madeleine-n-a-ni-croix-ni-clocher-25919)
- [Conciergerie history](https://www.paris-conciergerie.fr/decouvrir/histoire-de-la-conciergerie)
- [Institut de France palace](https://www.institutdefrance.fr/decouvrir-le-palais/)
- [Bir-Hakeim structural history](https://www.afgc.asso.fr/app/uploads/2023/06/HistoireAdminPontsParis_Prade-1982b.pdf)
- [Iéna structural history](https://www.afgc.asso.fr/history-heritage/pont-diena-a-paris/)

Existing per-asset references remain in the catalog. The Bir-Hakeim 30/54/30 and
24/42/24 m ratios guide the span rhythm; the exported lengths are fitted to the
existing mapped centerline around an estimated island extent. Do not confuse
those fitted lengths with published structural measurements. Full-width vaults
retain open river passages. Support weights and the host's road datum are retained.

## Validation and limitations

- Both LODs preserve primary openings. Raycast regressions check the Eiffel ground
  passage, cathedral belfries/spire contact, Bir-Hakeim lane clearance and the stone
  vault soffit. Geometry/lifecycle/terrain-footprint tests cover round trips and
  reversible replacement; these are automated checks, not driving screenshots.
- Browser review covers all 20 GLB/procedural pairs, near/far, day/night and a second
  roof or structure view. Screenshots are inspection evidence only.
- Cityscape visual integration: **not tested for this revision**.
- Full 3D world/topography visual integration: **not tested for this revision**.
- Actual in-car hardware: **not tested**. Draw counts are scene meshes; byte counts
  are uncompressed GLBs. Keep the near detail streaming range bounded.
- Louvre footprint/orientation, sculpted figures, cathedral tracery, historical
  pediment reliefs and facade lettering still need more precise reference work.
  The Louvre pyramid is outside the current model's scope. Iéna's equestrian
  groups are not yet modeled. These should be judged in the next visual review.

## Authoring lessons

Use measured anchors before adding ornament. Preserve a few structural counts
and apertures as independent tests. Do not derive spans from every polyline node,
put columns into road corridors, or draw flat rectangular glass where the feature
is an arched opening. Dome ribs must follow the curved surface. A clock face needs
a vertical facade plane. Check winding on both bridge elevations and roof slopes.
Use one material batch for repeated detail; a window pane needs no hidden solid
back, and a baluster needs fewer sections than a full architectural column.
