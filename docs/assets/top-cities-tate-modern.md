# Tate Modern — London

Tate Modern: the long Bankside brick shell, 99 m fluted chimney and glass lightbox, with the completed 2016 faceted brick Blavatnik extension and its horizontal window cuts.

## Sources and rights

- [Wikipedia: identity and architectural context](https://en.wikipedia.org/wiki/Tate_Modern)
- [Herzog & de Meuron: original conversion and roof light beam](https://www.herzogdemeuron.com/projects/126-tate-modern/)
- [Herzog & de Meuron: completed 2016 extension, perforated brick and horizontal cuts](https://www.herzogdemeuron.com/projects/263-the-tate-modern-project/)
- [ICE: original station and 99 m chimney](https://ice.org.uk/what-is-civil-engineering/infrastructure-projects/tate-modern)
- [OSM provider footprint / building part 123075369](https://www.openstreetmap.org/way/123075369)
- [OSM provider footprint / building part 123075376](https://www.openstreetmap.org/way/123075376)
- [OSM provider footprint / building part 123075366](https://www.openstreetmap.org/way/123075366)
- [OSM provider footprint / building part 542122686](https://www.openstreetmap.org/way/542122686)
- [OSM provider footprint / building part 542122680](https://www.openstreetmap.org/way/542122680)
- [OSM provider footprint / building part 542122684](https://www.openstreetmap.org/way/542122684)
- [OSM provider footprint / building part 542122683](https://www.openstreetmap.org/way/542122683)
- [OSM provider footprint / building part 542122682](https://www.openstreetmap.org/way/542122682)
- [OSM provider footprint / building part 542122687](https://www.openstreetmap.org/way/542122687)
- [OSM provider footprint / building part 542122681](https://www.openstreetmap.org/way/542122681)
- [OSM provider footprint / building part 542122685](https://www.openstreetmap.org/way/542122685)
- [OSM provider footprint / building part 542122679](https://www.openstreetmap.org/way/542122679)
- [OSM provider footprint / building part 542253509](https://www.openstreetmap.org/way/542253509)
- [File:Tate Modern - Bankside Power Station.jpg — Acabashi; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Tate_Modern_-_Bankside_Power_Station.jpg)
- [File:Tate Modern Switch House (27633103611).jpg — Jim Linwood from London; CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Tate_Modern_Switch_House_(27633103611).jpg)

References accessed 2026-11-10. Photos are retained only in ignored `tmp/uk-nordics/tate-modern/refs/` for visual comparison. Original geometry and materials; no image texture, third-party mesh, logo or lettering is shipped. Code/docs MIT, model CC BY 4.0, geographic data ODbL 1.0; no contributor declaration is signed or invented. OSM fallback request: https://api.openstreetmap.org/api/0.6/map?bbox=-0.1022866,51.5058034,-0.0965134,51.5093966.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | ---: | --- |
| Chimney top | 99 m | ICE and mapped height |
| Original shell / lightbox | 25 / 34 m | OSM estimates |
| Blavatnik top | 64.5 m | OSM and published extension height |
| Main mapped north frontage | approximately 165 m | Exact mapped shell; published 200 m describes original whole station |

Origin `[-0.0994,51.5076]`; +X east, +Y up, +Z south. Rigid exterior foundation plane y=0. Metres east/up/south; mapped orientation is baked once. No terrain, sea-level offset or Mercator scale is authored.

Main north edge [-0.1005076,51.5079806] to [-0.0996079,51.5079302] and south edge [-0.098686,51.507225] to [-0.0994383,51.5072629] constrain the approximately 5 degree east-west riverfront skew. Extension faces use the exact shared nodes of nine roof polygons and the flat roof plateau.

## Model and foundation

All mapped owned parts retain exact geographic outlines. The brick chimney has shallow vertical fluting, a narrow light crown and closed cap. The roof lightbox has adjacent frame/glass partitions; long cathedral-window bays break up the station. The twisted extension uses the mapped sloping skin facets with horizontal window cuts and muted brick rhythm, including the upper viewing gallery. Hidden roof under the lightbox/chimney is omitted. No terrain heights, underground tanks, collection art, signs, nearby substation building or bridge are exported.

Roof/lightbox25/34 m and local bay dimensions are estimates. The99 m chimney top differs from the architect’s93 m proposed viewing level, which is not the chimney height. Sloping extension skin heights between mapped upper nodes64.5 m and base/25 m contacts are reconstructed estimates; published geometry and current exterior photos take precedence over a generic pyramid. Photographs3 and4 are checked exterior views of the original shell and completed2016 extension; artwork/interior and reverse river panorama are rejected.

## Verification

Cityscape: **not tested**. Full 3D world: **not tested**. Asset inspection does not establish application integration. No app server or app-shot was used.

| LOD | Triangles | Draw calls | Bytes |
| --- | ---: | ---: | ---: |
| near | 7577 | 7 | 101652 |
| far | 2215 | 6 | 39180 |

Deterministic QA: `tmp/batch/tate-modern-metrics.json`, zero flags. Depth-layer generation and `--check` pass with zero dropped cycle edges. Landmark-specific observable geometry/contact tests and focused top-cities conformance pass; catalog validation passes.

Visual review: `tmp/batch/sheets-final/tate-modern.jpg` (exported near/far, opposite views, top, street and detail compared with the checked exterior photo), `tmp/landmarks/shots/tate-modern/tate-modern-procedural-near-light-top.png` (red footprint rings), and `tmp/landmarks/shots/tate-modern/tate-modern-glb-far-dark-sheet.jpg` (exported far/night). The model keeps its named silhouette, openings and facade rhythm. This is author self-review; independent review and both app modes are left to the coordinator's later batch stage.

Self-review: two looks. Narrow paired station window slots and muted brown-grey brick replace the initial over-glazed bays; the chimney crown and fine grooves remain within the99 m envelope. The complete2016 faceted extension, its upper gallery and long roof lightbeam remain in far; reference construction cranes and adjacent development are excluded.
