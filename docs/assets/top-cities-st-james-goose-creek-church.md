# St. James' Church, Goose Creek

Original procedural geometry of the standing 1713–1719 church at 100 Vestry Lane. The church's compact rectangular volume, slate jerkinhead roof, tall round arches, white quoins and pedimented west doorway are kept in both LODs. No reference photograph, scan, logo, lettering or texture is shipped.

## Sources and dimensions

- [Church owner](https://saintjameschurchgoosecreek.com/): identity, construction, 50 × 40 feet, stucco, slate roof, arched windows and west doorway/pelican relief.
- [South Carolina Archives NHL record](https://www.nationalregister.sc.gov/berkeley/S10817708020/index.htm): 1713–1719 and architectural details.
- [OSM way 1307285849](https://www.openstreetmap.org/way/1307285849), API snapshot 2026-11-09: footprint and orientation. © OpenStreetMap contributors, ODbL 1.0.
- [Itsbrandoyo exterior](https://commons.wikimedia.org/wiki/File:St._James_Goose_Creek_Parish_Church,_Goose_Creek,_South_Carolina.jpg), 2014, CC BY-SA 4.0, licence checked on file page/API. Shows this church's clipped roof, stucco, quoins and arched windows.
- [Jack E. Boucher HABS southeast exterior](https://commons.wikimedia.org/wiki/File:EXTERIOR,_VIEW_FROM_SOUTHEAST_CORNER_-_St._James%27_Protestant_Episcopal_Church,_Goose_Creek,_Berkeley_County,_SC_HABS_SC,8-GOOCR,1-9.tif), 1963, public domain US federal government. Identity and licence checked on file page/API. HABS west and north elevations also checked to resolve doorway and window counts. Historic photographs show closed shutters; the model follows the open glazing in the modern exterior.

| Dimension | Model | Status |
| --- | ---: | --- |
| Owner plan | 15.24 × 12.192 m (50 × 40 ft) | Sourced, published approximate dimensions |
| Model plan | 15.22 × 12.57 m | Sourced, OSM mapped exterior; difference from owner width recorded rather than hidden |
| Eave / ridge / clipped gable | 6.18 / 8.85 / 7.73 m | Estimated from photographs |
| Window width / height / sill | 1.26 / 4.15 / 1.12 m | Estimated; four per long side and two per end |
| West doorway width / height | 1.80 / 3.55 m | Estimated |
| Side doorway width / height | 1.35 / 2.85 m | Estimated |
| Exterior wall thickness | 0.72 m | Estimated |
| Long axis geographic bearing | 94.5° | Sourced, OSM opposite long edges |

## Frame and foundation

Origin `[-80.03264685, 32.9755013]` is the mapped rectangle's centre, using the two opposite control corners `[-80.0327334,32.9754503]` and `[-80.0325603,32.9755522]`. Mapped south and north edges independently give an east axis about 4.5° south of east; the −4.5° Y rotation is baked once into geometry. Local +X east, +Y up, +Z south, real metres. Local y=0 means the rigid exterior foundation toe, not sea level. The single provider replacement way is the church itself. Cemetery, perimeter walls and neighbouring buildings are excluded. A host must select a rigid foundation datum or a bounded pad; no terrain or map scale is baked in.

## Modeling and omissions

Thick walls have real arched cutouts and recessed glazing, with individual rectangular lights and fanlight sectors, present in both LODs. Muntins replace strips of glazing on the same surface. Quoins, sills, door pilasters and entablature attach to the walls; hips meet the shortened ridge. The small bird-and-young group is an original approximate relief cue, not a traced carving. Near adds finer lights and smoother arches; far retains the same openings, doorway and roof. Materials use muted white stucco, grey slate and dark grey-green glazing. Shutters, interior, fine carved cherubs, perimeter wall, tombstones and landscaping are omitted. No human contributor agreement has been accepted by this agent.

## Measured costs and evidence

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 12,256 | 4 | 175,332 |
| Far | 6,200 | 4 | 101,832 |

`qa-metrics` reports no issues, no below-grade geometry, zero layered/coplanar candidates and 0% back-face hits. The final contact sheet `tmp/landmark-qa/sheets/st-james-final/st-james-goose-creek-church.jpg` compares the verified modern exterior with five near views and two far views; padded scratch bounds avoid automatic framing clipping. Metrics: `tmp/landmark-qa/st-james-goose-creek-church-metrics.json`. Two look-fix rounds corrected the top of the clipped gable and the Y-rotation sign (the east axis runs south of east); final comparison preserves the roof silhouette, windows and doorway in both LODs. Finer sculpture and mouldings remain deliberately simplified. Local reference images remain outside tracked paths.

Cityscape: **not tested**. Full 3D world: **not tested**. Static library inspection does not establish host placement, terrain fitting, provider replacement or driving-app integration.
