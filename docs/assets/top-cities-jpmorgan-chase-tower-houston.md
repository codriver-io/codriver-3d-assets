# JPMorgan Chase Tower, Houston

Original procedural model of the 600 Travis Street tower, formerly Texas Commerce Tower, designed by I. M. Pei & Partners. Stable ID `jpmorgan-chase-tower-houston`; local source folder under `src/peregrine/landmarks/top-cities/`. The model represents the existing exterior, using the supplied dated photo dossier, rather than claiming a new site survey.

## Identity and sources

[Pei Cobb Freed & Partners](https://www.pcf-p.com/projects/jpmorgan-chase-tower-formerly-texas-commerce-tower/) identifies 75 storeys, polished **pale gray granite** and dual-pane glass, a corner sheared at 45°, and an 85-foot column-free main facade facing west. This primary source resolves the brief’s darker granite description: the material is pale gray in sun and darker in shade. The granite grid on four main sides contrasts with thin horizontal bands and broad glazing on the cut west face. The roof is flat without an invented mast or crown.

[Wikipedia](https://en.wikipedia.org/wiki/JPMorgan_Chase_Tower_(Houston)) supplies 305.4 m roof, 296.8 m top floor, 75 storeys and the 1982 completion date; the architect describes completion in 1981. [OSM way 44130644](https://www.openstreetmap.org/way/44130644) supplies the footprint, `height=305` and `building:levels=75`. The cached dossier contains the surrounding building/part ways, none overlapping this tower outline: Chase Center (44130646) and the nearby Bank of America complex remain provider-owned.

Reference photographs were studied only for proportions, colours and window rhythm. They remain ignored under `tmp/top-cities/jpmorgan-chase-tower-houston/refs/`; titles, creators, licences and URLs are in the catalog provenance: Adam Baker (CC BY 2.0), Jim Evans (CC BY-SA 4.0), Agsftw (CC BY-SA 3.0), WhisperToMe (public domain), Reagan Rothenberger (CC BY 3.0). The dossier’s `Jpmorganchasetower` photo carries CC0 with no supplied creator. No photographs, textures, captured meshes or copied third-party geometry are shipped.

## Frame and dimensions

All coordinates are real metres, +X east, +Y up, +Z south, local grade y=0. The area centroid of the mapped ring is `[-95.3640051633, 29.7603990667]`. Geographic coordinates are converted once into local metric positions; rotation is baked into the export. Controls `[-95.3641819,29.7602157]` and `[-95.3642483,29.7605166]` define the cut face: outward bearing approximately 259.16°. Controls `[-95.3640743,29.7606804]` and `[-95.3637162,29.7604669]` define the adjoining grid-facing orientation, about 125° along the edge. Ownership is exactly way 44130644, with its full ring retained.

| Quantity | Value | Basis |
| --- | --- | --- |
| Roof | 305.4 m | Published; OSM rounds to 305 |
| Top occupied floor | 296.8 m | Published; used to locate last facade row |
| Storeys | 75 | Published / mapped |
| Plan envelope | 52.7 m east–west × 64.0 m north–south | Mapped; includes orientation |
| Five main elevations | 42, 42, 21, 34, 21 m approximately | Mapped; three 4–5 m corner bevels also retained |
| Clear west facade | 85 ft / 25.9 m | Published internal span; mapped exterior cut is 34.1 m, kept explicitly |
| Lobby glazing height | 10.3 m within 12 m base register | Estimated; stylized exterior, no interior |
| Typical row pitch | 3.90 m, 74 rows above lobby | Estimated facade registration, not a floor-by-floor survey |
| Near bay pitch | about 2.95 m | Estimated from photo grid |
| Window height | 2.65 m grid, about 3.5 m cut face | Estimated from photo contrast |
| Near lobby recess | 0.18 m | Estimated; explicitly closed jamb/head/sill surfaces |
| Far rows / bays | pairs of floors and roughly pairs of bays | Deliberate simplification |

## Geometry and materials

Each wall is tessellated into adjoining granite and glass cells. Upper windows are flush and replace wall cells; there is no solid wall behind them and no stacked overlay. Near lobby panes have closed recess reveals. Three narrow mapped corner bevels stay granite, preserving the five main sides. A convex triangulated roof closes the flat top. The low sill, granite corner piers and lobby grid meet y=0. There are no free beams, cables or hanging ornaments requiring member-end assertions.

Named materials are granite, glass, glow and roof, merged to four draws in both LODs. Light granite is subdued gray; glass is dark blue-gray. Dark palettes dim stone and unoccupied panes; a deterministic, dispersed nine-percent occupancy pattern provides warm self-lit panes. Lighting is an estimate, not a night occupancy survey. Far keeps 37 separate office rows and a separate lobby row, preserving vertical and horizontal rhythm.

Unmodelled: public plaza, Míro sculpture, freestanding entrance name stone, interior banking hall, small roof equipment and the adjacent Chase Center. They are outside the modeled building envelope. Roof plant is omitted to preserve the sourced flat silhouette. The mapped exterior cut differs from the published column-free interior span; no arbitrary horizontal rescaling was applied.

## Export, measured costs and verification

Export: `pnpm build:top-cities-landmarks jpmorgan-chase-tower-houston --no-check`. Models and the measured manifest are under `public/models/buildings/`.

| Variant | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 16,968 | 4 | 920,824 | 899.2 |
| Far | 4,436 | 4 | 244,076 | 238.3 |

Inspected exported-GLB contact sheets under `tmp/top-cities/shots/jpmorgan-chase-tower-houston/`: `jpmorgan-chase-tower-houston-glb-{near,far}-{light,dark}-sheet.jpg`, covering overview, cut facade, opposite facade, above/roof, entrance and close facade detail. `reference-export-comparison.jpg` places all four sheets beside the six dossier reference photographs. A separate `*-glb-near-light-top.png` checks the plan; the ground-level red ring is occluded by the roof in this exact vertical view, so the vertex-containment tests establish alignment quantitatively. Procedural overview/roof sheet is also checked against the export.

Visual iteration: the first export had full-height tiny recess details and exceeded the byte budget; flush upper panes retained its grid while reducing near from 2,824 KiB to 899 KiB. The first contact sheet exposed cropped facade cameras, which were moved back. Reference comparison showed the west cut face needed thinner horizontal granite bands and the night occupancy needed a dispersed hash instead of diagonal periodic lights; both were corrected and re-exported. Final geometry is recognizable through the cut face, contrasting elevations and flat roof, with unmodelled reflective surroundings and simplified entrances stated above.

Landmark tests pin roof height, y=0, vertex containment, exactly five major mapped faces, the absent cut corner, roof closure and outward normals by facade raycasts at six heights, distinct row counts, west glass, and identical near/far bounds. Conformance checks verify GLB/source round trips and exported budgets. Depth-layer generation/check has zero dropped cycle edges. Deterministic GLB QA checks metrics, backfaces, overlays and far rhythm. The first combined conformance run passed 385/385 tests and the catalog passed 266 entries / 450 variants. After the final origin/frame correction, all Houston tests and checks still passed; the shared run temporarily failed only Lviv’s in-progress catalog status and the shared catalog waited on its missing documentation, and the final retry remained 384/385 with only that unrelated Lviv status failure; Houston’s eight selected tests pass, and shared catalog validation requires Lviv’s missing document to finish. Final GLB QA reports zero issues, no coplanar overlaps or layered faces, and 0.2% backface sweep hits (edge samples; facade rays confirm outward walls).

Cityscape: **not tested yet, integration checked separately**. Full 3D world: **not tested yet, integration checked separately**. Rigid base and 43 m pad radius are authored; terrain placement, provider replacement, lifecycle, renderer bundle parity, hardware cost and unobstructed both-mode app captures belong to the lead’s integration gate.
