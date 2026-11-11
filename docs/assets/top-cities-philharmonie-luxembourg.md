# Philharmonie Luxembourg

Philharmonie Luxembourg’s two-pointed lens,823 individually modelled slender white columns in three offset rows, raised oblong auditorium roof and its two asymmetric curled chamber/discovery petals.

Version: exterior standing on 2026-11-10, Luxembourg, Luxembourg. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

Main lens tips reconstructed from two mapped control corners, approximately127.6m apart; mapped flanks define roughly70m maximum breadth. Overall aggregate with chamber petals approximately115×90m in its mapped frame. Venue and vibration-engineering supplier confirm823 columns,20m height and323mm diameter; architect website uses827 vertical lines, so823 follows the venue’s current count. Three continuous rows277/275/271 approximate the published3–4-row layout rather than claiming a surveyed structural grid. Floor0.2m, column/eave top20.2m, flat lens roof20.8m and raised oblong crown23m (OSM). Petal2–10m roof heights and clerestory dimensions are estimates from exterior and architect plan comparisons.

Origin 6.14252515,49.618453349999996; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation -2.9226369669666017 radians is baked from the two mapped control points [[6.142763,49.6189573],[6.1421741,49.6188724]]; the host must not rotate again. Footprints replace only OSM ways 37847301. y=0 exterior local plaza grade; all authored paving tops0.20m above grade. Aggregate OSM37847301 floor unioned with the reconstructed lens plinth and curved mapped flanks govern placement; missing lens arcs hidden by the petals are reconstructed between mapped points. Glazing is represented at the inner edge of the three column rows to retain readable depth in an opaque game material; the actual wall interleaves the forest. All823 separate open-ended column surfaces are retained in both LODs and terminate on actual floor/roof planes; the enclosure hides their ends. Interior auditorium balconies are not authored. Main building as standing in2026; incomplete2024–27 extension and construction hoarding are omitted and not masked. No venue names, signs, logos or branding.

## Sources and rights

- [Landmark identity and architectural context](https://en.wikipedia.org/wiki/Philharmonie_Luxembourg)
- [OSM mapped footprint](https://www.openstreetmap.org/way/37847301)
- [Philharmonie current architecture:823 columns and2027 extension status](https://www.philharmonie.lu/en/architecture)
- [Column-vibration engineering supplier:823 columns,20m high,323mm diameter,3–4 rows](https://www.spannverbund.com/fr-lu/philharmonie-luxembourg-luxembourg/)
- [Architect project:two-pointed main hall, chamber petal and827 vertical-line count; photographs retain individual copyrights](https://www.2portzamparc.com/en/projects/luxembourg-philharmonie/)
- [Architect overall site plan, copyright Atelier Christian de Portzamparc, comparison only](https://www.2portzamparc.com/wp-content/uploads/2026/02/199706-LUXEMBOURG_PlanMasse.webp)
- [Venue architectural brochure:3–4 column rows](https://www.philharmonie.lu/media/j4uhngkb/brochure_bleue_web.pdf)
- [File:Luxembourg philarmonie jnl 01.jpg — Jean-noël Lafargue — CC-BY-2.5](https://en.wikipedia.org/wiki/File:Luxembourg_philarmonie_jnl_01.jpg)
- [File:Luxembourg Philharmonie Säulen-20080530-RM-195346.jpg — Reinhold Möller Ermell — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Luxembourg_Philharmonie_S%C3%A4ulen-20080530-RM-195346.jpg)
- [File:Luxembourg, Philharmonie - Mudam tram stop (105) (blurred).jpg — GilPe — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Luxembourg,_Philharmonie_-_Mudam_tram_stop_(105)_(blurred).jpg)
- [Current main-hall exterior aerial, original2005 building — Wade Zimmerman — All rights reserved, comparison only](https://www.2portzamparc.com/wp-content/uploads/2026/02/199706-LUXEMBOURG_cWade_ZIMMERMAN_30.webp)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/philharmonie-luxembourg.jpg`; mapped overhead: `tmp/benelux/philharmonie-luxembourg/qa/philharmonie-luxembourg-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/philharmonie-luxembourg/dark/philharmonie-luxembourg-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. One look-fix round completed: unioned the actual plinth under the reconstructed lens and subdivided the two warped white petal roofs. Both LODs retain all823 individually surfaced323mm columns; tests count actual polygonal column ends and check every root/top against the independent floor/roof, with shortened-member negative cases. Zero material-cycle edges; venue823 versus architect827 vertical-line wording is documented rather than conflated.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 14548 | 4 | 212780 |
| far | 8589 | 4 | 141824 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.
