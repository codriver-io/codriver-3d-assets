# Charleston International Airport terminal, North Charleston

Original procedural model of the current terminal defined by the **2016 redevelopment**, retaining the mapped post-2022 Concourse A boarding corridors. This represents the present two-concourse passenger complex, not the unreconstructed 2014 exterior, a future terminal, or the airport as a whole. The remote control tower is omitted because it is not part of this terminal's principal curbside view.

## Sources and dimensions

- [Fentress Architects completion release: 2016, 25 ft Central Hall and dome](https://www.aviationpros.com/airport-business/airport-infrastructure-operations/press-release/12265550/fentress-architects-charleston-international-airport-expansion-completed)
- [Structural engineer MMSA: 2016 completion and two-concourse redevelopment](https://www.mmsainc.com/portfolio/charleston-international-airport-terminal-redevelopment-and-improvement-program-trip/)
- [Airport owner: Concourse A capacity expanded in 2022](https://iflychs.com/chs-expands-gate-capacity/)
- [Airport operator: terminal map](https://iflychs.com/passengers/terminal-map/)
- [OSM main terminal way 35209624](https://www.openstreetmap.org/way/35209624)
- [Front of Charleston Airport · AutoRentals, 2019 (CC BY-SA 4.0)](https://commons.wikimedia.org/wiki/File:Front_of_Charleston_Airport_AutoRentals.jpg)
- [CHS concourse A interior · Edward Russell, 2017 (CC BY 2.0)](https://commons.wikimedia.org/wiki/File:CHS_concourse_A_interior_(32241690883).jpg)

| Feature | Metres | Basis |
| --- | ---: | --- |
| Central Hall | 7.62 m above passenger floor | Sourced: designer's 25 ft completion announcement |
| Main outline and two arm alignments | about 244 × 252 m terminal-only bounding box | Sourced: OSM way 35209624; mapper data, not survey |
| Boarding paths | 17 original mapped polylines | Sourced OSM current geometry; count is paths, not a certified gate inventory |
| Passenger floor relative to apron foundation | +3.6 m | Estimated; operator financial description places curb one level above apron |
| Main wing roof / monitors | 9.2 / 11.5 m | Estimated relative to the above foundation datum |
| Central hall plan / roof | 22 × 54 m / 11.22 m | Estimated plan; sourced 7.62 m hall plus estimated 3.6 m floor |
| Glass dome base radius / rise / tip | 7.2 / 5.5 / 16.72 m | Estimated from project descriptions/photos; not a sourced external height |
| Covered walkway / curb roof | 7.3 / 7.5 m | Estimated, columns continuous to the local foundation plane |
| Enclosed boarding corridor width / deck / roof | 3.2 / 3.6 / 6.7 m | Estimated; static supported configuration from mapped paths |

The Fentress release identifies the dome, raised ceiling and extensive glass; MMSA confirms the 2016 two-concourse work. The owner confirms Concourse A additions opened in 2022, so the fifteen gates quoted in the 2016 release are not claimed as today's count. A curved detached OSM path, way 1570947421, has an ambiguous jet-bridge tag and is excluded; seventeen other mapped paths attached to terminal positions are included. Future construction polygon 1553072120, parking garages, cargo terminal 39854687 and unrelated roofs are excluded.

Both Commons file pages were checked individually. AutoRentals' **2019** exterior (CC BY-SA 4.0) shows the current white canopy, triangular end trusses and glass frontage; Russell's **2017** Concourse A interior (CC BY 2.0, Flickr license verified by Commons) shows the refurbished clerestory, pale columns and full-height airside glass. They match the redeveloped structure; the older April 2014 Commons photo was deliberately not used as current evidence. A designer release photo was inspected for the entrance truss but is reference-only. All photos remain in ignored scratch; no image or texture is committed.

## Frame, footprint and foundation

Origin `[-80.03695,32.88463]`, metres east/up/south. The exact OSM main polygon already carries its geographic orientation. The 8° roof-hall frame is an estimate aligned to the main curb edge; its south-facing normal is 188°. Two controls: the west/north B-concourse tip `[-80.0381618,32.8861126]` and A tip `[-80.0359549,32.8854028]`; their mapped positions are retained without horizontal scaling. Rotation is baked into geometry once.

Local `y=0` is the estimated apron/foundation plane; the passenger floor is +3.6 m. The actual roadway berm is not authored. Rigid terminal plinth, canopy columns and boarding-corridor supports reach y=0; a host must place one datum or a bounded pad, reconcile the curb/apron relief and hide foundation stems with its terrain where appropriate. No DEM, absolute altitude, sea-level correction, Mercator scale, road, water, parking surface or terrain mesh is baked in. This library model does not establish a driveable curb road or app integration.

Owned source ways: 35209624, 301177793, 301178298, 301178300, 1054886329, 1054886331, 1054886332, 1149143759, 1149143760, 1149143761, 1149143762, 1149143763, 1149143764, 1149143766, 1149143767, 1149143768, 1149143771, 1149143772, 1149143774, 1149143775, 1149143776, 1285044778, 1285044780, 1285044782. `FOOTPRINTS[0]` is the terminal; the next six rings are separately mapped covered pedestrian roofs. `JET_BRIDGES` retains all seventeen mapped corridor paths and way ids. Their modeled envelope is about 3.2 m wide, not an asserted cadastral polygon. Provider replacement must cover these exact authored parts while preserving the excluded parking/cargo/future works; no airport-wide mask is authorized.

## Geometry, LOD and omissions

The terminal's unequal branching arms follow the source polygon directly. Individual wall tiles are replaced by separate recessed window quads, with two horizontal rows and mullions; no wall is hidden behind a glass overlay. The higher central hall, spherical-cap glass dome and longitudinal clerestories identify the redeveloped roof. Connected white canopy roofs have supporting columns; the central stem carries an estimated 9.6 m gable and connected triangular end trusses. Each boarding corridor follows its source bends; its outer cabin has paired apron posts, bends have posts, and the inner end meets the terminal. Both variants preserve these contacts and full bounds.

Far coarsens window/clerestory bays and dome segmentation and drops thin dome ribs. It retains both concourse arms, the raised hall/dome, covered pedestrian roofs and all seventeen supported corridors. Interiors, roof mechanical services, airline/airport logos, signage lettering, aircraft, vehicles, landscape, control tower and garages are omitted. The primary dimensions lacking a published measurement are explicitly estimates; this is not an architectural survey.

## Cost and verification

near: 17,601 triangles / 6 draws / 291,796 bytes; far: 8,033 triangles / 6 draws / 132,424 bytes. No remaining qa-metrics flags. Final contact sheet: `tmp/landmark-qa/sheets/charleston-international-airport-terminal.jpg`; metrics: `tmp/chs4/airport-metrics.json`; `--bounds tmp/chs4/airport-framing.json` keeps the complete model in the oblique evidence tiles. Export: `node scripts/build-top-cities-landmarks.mjs charleston-international-airport-terminal` through the shared meshopt/quantization codec. Final sheet and metrics paths follow QA; browser light/dark and near/far checks concern the static library only.

**Cityscape: not tested / Full 3D world: not tested.** No host application is present, and no contributor or separate product terms were accepted by this agent.
