# Rainbow Row, Charleston

Original procedural model of the thirteen address fronts from **83 through 107 East Bay Street**, in their present restored configuration. The City survey identifies the attached Georgian/Federal house type and its shared roofs; the architectural inventory identifies the address sequence. OSM groups 97–101 in one outline, which is explicitly subdivided into three authored front houses rather than claimed as three mapped polygons.

## Sources

- [City of Charleston, historic resources survey: shared walls and Georgian/Federal row houses](https://www.charleston-sc.gov/AgendaCenter/ViewFile/Agenda/_03112026-10738)
- [City architectural inventory: East Bay addresses and historical names](https://www.charleston-sc.gov/AgendaCenter/ViewFile/Agenda/_02262026-10733)
- [OSM combined 97–101 main footprint](https://www.openstreetmap.org/way/1356814318)
- [Rainbow Row front · Ymblanter, 2017 (CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Rainbow_Row_front.jpg)
- [Rainbow Row from south side · Ymblanter, 2017 (CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Rainbow_Row_from_south_side.jpg)

Both Commons file pages were checked: Ymblanter, CC BY-SA 4.0, 5 November 2017. The front view depicts the broad pink facade, narrow white neighbor, tall lavender front and green gable; the south-side view identifies 91 on the peach facade next to yellow 93 and green 95. Both really show this row, rather than a similarly painted street. Photos are for ignored local comparison only and are not shipped.

## Dimensions

| Address | Width | Ridge | Roof rise | Color | Basis |
| --- | ---: | ---: | ---: | --- | --- |
| 83 | 9.68 m | 17.0 m | 4.0 m | cream | OSM-derived frontage and mapper height; photo color estimate |
| 85 | 7.88 m | 14.0 m | 2.0 m | peach | OSM-derived frontage and mapper height; photo color estimate |
| 87 | 9.45 m | 17.0 m | 3.0 m | cream | OSM-derived frontage and mapper height; photo color estimate |
| 89 | 7.63 m | 13.0 m | 3.0 m | blue | OSM-derived frontage and mapper height; photo color estimate |
| 91 | 8.46 m | 11.0 m | 1.0 m | peach | OSM-derived frontage and mapper height; photo color estimate |
| 93 | 6.15 m | 13.0 m | 3.0 m | yellow | OSM-derived frontage and mapper height; photo color estimate |
| 95 | 7.02 m | 13.0 m | 2.0 m | green | OSM-derived frontage and mapper height; photo color estimate |
| 97 | 6.99 m | 16 m | 1.0 m | blue | Estimated subdivision and photographic height |
| 99 | 6.99 m | 13 m | 2.5 m | pink | Estimated subdivision and photographic height |
| 101 | 6.99 m | 13 m | 2.5 m | pink | Estimated subdivision and photographic height |
| 103 | 5.61 m | 13.0 m | 3.0 m | cream | OSM-derived frontage and mapper height; photo color estimate |
| 105 | 6.73 m | 13.0 m | 3.0 m | green | OSM-derived frontage and mapper height; photo color estimate |
| 107 | 7.81 m | 13.0 m | 3.0 m | green | OSM-derived frontage and mapper height; photo color estimate |

Mapped widths and heights are sourced **mapper data, not surveyed dimensions**. Main house depths are estimated as 11–17 m from the front mapped blocks, excluding long rear annexes. Window sizes, floor divisions, chimney heights (0.7 m over ridge), gable profile, shutter widths and colors are photographic estimates. Overall declared envelope 17.8 m allows for chimneys. Pastels are muted; lavender is combined with blue in this economical palette. Separate 99/101 fronts share the broad pink roof impression.

## Frame, foundation and ownership

Origin `[-79.927339,32.775777]`; metres east/up/south; y=0 is the rigid East Bay doorstep plane. Two frontage controls `[-79.9272871,32.7753042]` (south end of 83) and `[-79.9271684,32.7762418]` (north end of 107) yield an approximately 6.1° northward row bearing; street-facing normal is 96.1°. Rotation is baked in once. No DEM, absolute altitude, runtime sea level or Mercator scale. A host must place the row rigidly, or use an explicitly bounded street pad; no terrain is authored.

OSM ways: 302912113, 302912115, 302912117, 1356814298, 1356814299, 1356814315, 1356814316, 1356814318, 1356814319, 1356814320, 1356814321. The full source rings are retained for traceability; geometry owns the main East Bay front blocks only. Rear annexes extending west into gardens must stay with the provider; replacement must be clipped to the authored main block, not blindly mask every full source ring. 79–81 and neighboring buildings are excluded. The two mapped narrow breaks between 85/87 and 87/89 remain low boundary walls/gates, not invented full-height buildings. Door and window reveals are explicit; tiny interior furnishings are absent.

## Geometry and LOD

Wall surfaces are tiled around each aperture so no second wall lies behind the glazing. Frames, shutter panels, wall and glass are separate nonoverlapping polygons. Hip/gable roofs, uneven cornices and chimney silhouettes persist in far; the green curving Dutch gable at 95 persists. Far uses the same sash-grid rhythm and simplifies pane divisions, chimney count, and trim/shutter materials to eight draws. Rear facades have a modest window grid, rather than blank slabs; rear interiors and detailed annex roofs are omitted. Wrought-iron floral patterns, letters, signage, trees and parked vehicles are omitted.

## Cost and verification

near: 11,899 triangles / 12 draws / 200,648 bytes; far: 7,225 triangles / 8 draws / 131,272 bytes. No remaining qa-metrics flags. Final contact sheet: `tmp/landmark-qa/sheets/rainbow-row-charleston.jpg`; metrics: `tmp/chs4/rainbow-metrics.json`; the approved `--bounds tmp/chs4/rainbow-framing.json` preserves full silhouettes in oblique tiles. Export uses `node scripts/build-top-cities-landmarks.mjs rainbow-row-charleston` and the shared meshopt/quantization codec. Final contact sheet and metrics paths are recorded after QA. Browser evidence is library-only; light/dark, near/far and opposite facade/roof views are checked.

**Cityscape: not tested / Full 3D world: not tested.** No app integration is claimed. No agent acceptance of contributor or product terms is asserted.
