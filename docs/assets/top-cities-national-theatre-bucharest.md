# National Theatre Bucharest — Bucharest

The restored National Theatre has a broad red upturned canopy over a bowed white entrance curtain, two arched side fins, rooftop auditorium/amphitheatre, tall pale fly tower and a restrained red-and-white checker facade on the annex.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/National_Theatre_Bucharest)
- [Mapped way/41542957; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/41542957)
- [File:3. Bucuresti, Romania. Teatrul National Bucuresti. 3 Aprilie 2017 (3).jpg | Britchi Mirela | CC-BY-SA-4.0](https://en.wikipedia.org/wiki/File:3._Bucuresti,_Romania._Teatrul_National_Bucuresti._3_Aprilie_2017_(3).jpg)
- [File:Bucharest - New National Theater (19237949514).jpg | Ștefan Jurcă from Munich, Germany | CC BY 2.0](https://commons.wikimedia.org/wiki/File:Bucharest_-_New_National_Theater_(19237949514).jpg)
- [TNB: reconstruction restores original exterior, 2014–2015](https://www.tnb.ro/en/the-reconstruction-of-the-ilcaragiale-national-theatre-is-nearing-completion)
- [TNB: amphitheatre is 24 m above University Square](https://www.tnb.ro/ro/amfiteatru-tnb-o-scena-in-aer-liber)
- [TNB main hall: stage fly bars rise to 35 m](https://www.tnb.ro/ro/teatrul/sala-mare)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/national-theatre-bucharest/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Fly-tower highest edge | 38.6 | Photo estimate consistent with operator’s 35 m fly rigging |
| Rooftop amphitheatre floor | 24 | Theatre operator |
| Red canopy / thickness | About 20–22.5 / 1.4 | Photo estimates |
| Main hat plan | About 79 × 93 | Mapped outline clipped to front auditorium zone |
| Annex top | 18.5 | Photo estimate |

OSM labels the whole complex 24 m, while the theatre explicitly places the rooftop amphitheatre floor at 24 m and describes fly bars rising to 35 m. The 38.6 m fly-tower crown is therefore a documented photo-based estimate, not a surveyed published total. Auditorium, canopy, side fins and fly tower have estimated internal plans constrained to the mapped envelope; only the overall outline and bearing are mapped. Red-brim curvature, 1.4 m thickness, support profiles, checker rhythm and seating parapets are simplified original geometry. The old theatre facade / Novotel photos 3 and 4 are different structures and were rejected. Only restored post-2014 exterior references are used; no posters, sculpture group, logos or lettering. The mapped rear technical projection is retained as a low 12.5 m service mass; its height is estimated.

## Frame and ownership

Origin `[26.10380025, 44.43705625]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[26.10327, 44.4377338], [26.1036462, 44.4369857]]`; rotationY `-1.2260713181490182` radians. Exact provider ways: `[41542957]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. Only mapped theatre envelope 41542957. Canopy, piers, upper masses and annex stay inside it. No square paving, statuary, neighboring hotel, hospital or street is replaced.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

A triangulated annular canopy has a curved top, separate underside, closed brim and real holes around the upper auditorium/fly tower. Its side fins have true arched passages; their top vertices follow the canopy underside exactly. The low foyer has five retained glass entrance doors in a bowed white curtain, with pale horizontal bands. A 24 m rooftop terrace and open amphitheatre parapet remain visible from above. Fly-tower roof and edge profiles retain their shallow upward bow in both LODs. The annex checker pattern is adjoining facade cells, not pasted imagery. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 11778 | 6 | 168408 |
| far | 5014 | 6 | 78880 |

Deterministic QA: no flags (`tmp/central-east/national-theatre-bucharest/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/national-theatre-bucharest.jpg`; source top over red OSM rings: `tmp/central-east/shots/national-theatre-bucharest/`. Two visual refinements: first darkened the red brim, angled the arched side fins and strengthened the fly-tower crown; the second corrected the entrance curtain to bow inward toward its centre in plan and elevation, as the street photograph shows. The five doors and all canopy/vent contacts remain independently tested. Front street, full near/far, footprint and dark far views inspected; internal component plans and fly-tower height remain estimates.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.
