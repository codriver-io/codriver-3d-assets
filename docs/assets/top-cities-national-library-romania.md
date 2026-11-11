# National Library of Romania — Bucharest

The National Library combines a long green-glass semicircular wing with a monumental pale riverfront colonnade, tiered cornices, flanking curtain walls and a glazed central atrium among four open lightwells.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/National_Library_of_Romania)
- [Mapped relation/1670647; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/relation/1670647)
- [File:Biblioteca Națională a României.jpeg | Luckyeye13 | CC BY-SA 4.0; English Wikipedia FoP-US-only architecture notice; comparison only](https://en.wikipedia.org/wiki/File:Biblioteca_Na%C8%9Bional%C4%83_a_Rom%C3%A2niei.jpeg)
- [File:Dâmbovița National Library of Romania.jpg | kallerna | CC-BY-SA-4.0](https://en.wikipedia.org/wiki/File:D%C3%A2mbovi%C8%9Ba_National_Library_of_Romania.jpg)
- [File:Unification Square Bucharest.jpg | CARPATHIANLAND | CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:Unification_Square_Bucharest.jpg)
- [National Library annual report: 2012 new headquarters](https://bibnat.ro/wp-content/uploads/2024/03/RAPORT-anual-de-activitate-BNaR-2012.pdf)
- [European National Librarians: remodeling by Eliodor Popa and 2009–2011 work](https://www.cenl.org/library/national-library-of-romania/)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/national-library-romania/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Highest roof | 35 | OSM survey-derived relation height, approximate |
| Plan envelope | 143.8 × 115.9 | Mapped outer 23491475 |
| Round wing top | 33.5 | Photo estimate |
| Column shaft / total support span | 12.2–28.5 / 11.5–29.2 | Photo estimates |
| Central atrium footprint | 43.5 × 21 | Mapped inner 122216145 |
| Atrium glazed roof | 31.5–33.5 | Estimated shallow barrel canopy |

OSM gives 35 m with 2014–2016 field-survey provenance; no independently measured exterior height was located, so it remains approximate. Rounded-wing height, column count/sections, component cornices and atrium roof are photo-based estimates. Four small mapped inner rings remain open lightwells; the large central ring receives an estimated glazed roof consistent with the library’s reported glass-roofed atrium. Its exact profile needs rooftop review. All five mapped inner boundaries are retained, rather than covering the plan with an opaque slab. No facade lettering, public art, river, quay or landscaping is reproduced.

## Frame and ownership

Origin `[26.11016155, 44.42533775]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[26.109414, 44.425385], [26.1094532, 44.4258401]]`; rotationY `1.5093593548744635` radians. Exact provider ways: `[23491475]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. Outer way 23491475 is the replacement envelope. Inner ways 122216143–122216147 stay provider under the footprint contract and are explicit geometry apertures/lightwells. Columns, cornices and the round wing remain within the outer ring. No neighboring structure or paving is owned.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

The mapped outer ring is split at the actual curved-wing junction. Both LODs preserve its semicircular glass end, pale roof vent crown and the tall projecting columns in front of recessed glazing. Column shafts are open-ended shells joined to separate stone bases/capitals, with independent support probes and a shortened-support negative control. Main roof triangulation preserves five holes; the central atrium canopy is partitioned glass/mullion geometry, while four lightwells stay open. Muted teal panes and narrow dark bands reflect the current modernized exterior without textures. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 15534 | 7 | 188932 |
| far | 5046 | 7 | 73688 |

Deterministic QA: no flags (`tmp/central-east/national-library-romania/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/national-library-romania.jpg`; source top over red OSM rings: `tmp/central-east/shots/national-library-romania/`. One visual refinement strengthened the two dark projecting cornice tiers above the pale columns and closed the upper fascia continuously to the main roof. The mapped round wing, all four open lightwells, central glazed canopy, recessed colonnade and dark far LOD were inspected. Component heights and exact atrium canopy shape remain approximate.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.
