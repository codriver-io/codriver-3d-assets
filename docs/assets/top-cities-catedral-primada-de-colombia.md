# Catedral Primada de Colombia, Bogotá

Original procedural model of the present cathedral on Carrera 7 #10-80, facing Plaza de Bolívar. Fray Domingo de Petrés’s neoclassical building was constructed in 1807–1823, with later tower reconstructions and alterations; the current silhouette, rather than the 1846 painted state, is modeled. At street distance it reads through its warm stone facade, paired tiered towers, arched open belfries, northern clock, three framed wooden doors, central pediment and finials. At regional distance the two towers, terracotta nave roof and dark crossing dome remain identifiable.

## Sources and dimensions

The supplied dossier and one single-way verification through the shared Overpass helper establish OSM way [24251969](https://www.openstreetmap.org/way/24251969). [The Spanish cathedral article](https://es.wikipedia.org/wiki/Catedral_primada_de_Colombia) supplies the 52 m tower height, the door dimensions, architectural orders and construction history; these are published descriptions, not a survey. Its infobox and the dossier agree on the height. The height is interpreted as the highest cross tip; the source does not define its measurement datum more precisely.

| Feature | Model | Basis |
| --- | --- | --- |
| Tower cross tips | 52 m | Published tower height |
| Main wooden door | 3.60 × 7.20 m | Published width/height; bottom at 0.50 m |
| Side wooden doors | 2.80 × 5.60 m | Published width/height; bottom at 0.50 m |
| Cathedral ownership envelope | 88.8 × 41.6 m | Partial mapped envelope; east cutoff estimated |
| Nave bearing / front outward bearing | 122° / 302° | Mapped control points |
| Main cornice | 17.6 m | Photo estimate |
| Tower first / second stages | 17.6–29.4 / 29.55–40.5 m | Photo estimate |
| Tower cap / lantern | 40.75–46.1 / 46.05–50.4 m | Photo estimate |
| Central pediment apex | 33.5 m | Photo estimate |
| Nave eaves / ridge | 20 / 24.8 m | Photo estimate |
| Crossing dome radius / cap | 7.25 m / 36.8 m | Photo estimate |
| Dome lantern cross tip | 42 m | Photo estimate |

The mapped control edge runs from `[-74.0753276,4.5982081]` to `[-74.0750582,4.5980383]`. Geometry starts in nave coordinates and rotates 32° clockwise toward geographic southeast: this is baked into vertex positions once. Final axes are east/up/south, in real metres, around `[-74.07524,4.59796]`; grade is local `y=0`. Neither Mercator stretch nor absolute elevation is baked in.

OSM’s cathedral way includes additional southern blocks and the rear house. This model deliberately owns a partial rectangle along the cathedral’s main frontage and nave, excluding the Casa del Cabildo, Capilla del Sagrario and rear Casa Cural. The rectilinear envelope smooths the small frontage quoins. No adjacent landmark, plaza, roadway or independent building way is replaced. The eastern cutoff and provider triangle masking must be checked in the app: a provider triangle spanning the ownership boundary may survive, so catalog readiness does not establish clean replacement.

Photographs inspected, with rights checked on their Commons description pages:

- [Primatial Cathedral of Bogotá 01](https://commons.wikimedia.org/wiki/File:Primatial_Cathedral_of_Bogot%C3%A1_01.jpg), Bernard Gagnon, CC BY-SA 4.0: west front and present tower stages.
- [Catedral desde CCGGM](https://commons.wikimedia.org/wiki/File:Catedral_desde_CCGGM.jpg), Felipe Restrepo Acosta, CC BY-SA 3.0: dome, drum and eastward roof relationships.
- [Calle 11 and north wall … 2024 (2)](https://commons.wikimedia.org/wiki/File:Calle_11_and_north_wall_of_Primate_Cathedral_of_Bogot%C3%A1_-_Bogot%C3%A1_-_Colombia_2024_(2).jpg), José Luiz, CC BY-SA 4.0: exposed rubble wall and the Puerta Falsa.
- Dossier sheet also shows SajoR’s interior, CC BY-SA 4.0, and Edward Mark Walhouse’s 1846 painting, public domain; they provide context only. Interior sculpture/organ references were not used to author runtime geometry.

No photo, scan, mesh, texture or font is shipped. The model and helper geometry are original procedural work for Codriver. Mapped geographic data retains © OpenStreetMap contributors / ODbL 1.0 attribution.

## Modeling and limits

The towers are hollow wall shells with actual round-headed holes on all four sides of both main belfry stages and the small lanterns. Columns, fluting, capitals, cornices, cap terraces, clock hands, simplified finials and framed portals are merged by material. Closed gable solids and a hemispherical dome give stable roof silhouettes. Eight named materials distinguish stone, trim, dark openings, roof tile, metal, wood, rubble and plaster; dark mode dims them, with no invented illuminated windows. Photographic stone patina and carved details are abstracted into geometry rather than textures.

Far LOD reduces radial segments, makes window surrounds flat, and removes column fluting, small hardware, dentils, roof courses and individual rubble patches. It retains both open tower stages, the clock, lanterns, crosses, dome, three portals and facade columns. Near/far exported bounds match exactly.

The west front is better constrained than the rear. Dome location, drum windows, roof pitches, side clerestory rhythm, east termination, detailed carvings and simplified statues remain estimates. No interior, tiny inscription, plaza steps, street furniture or adjoining Sagrario is authored. This is an exterior driving-distance model, not a conservation survey.

## Verification and costs

Build: `pnpm build:top-cities-landmarks catedral-primada-de-colombia --no-check`.

| Export | Triangles | Draws | Bytes | KiB (rounded) |
| --- | ---: | ---: | ---: | ---: |
| Near | 31,568 | 8 | 1,779,544 | 1,738 |
| Far | 6,734 | 8 | 367,552 | 359 |

Both fit the contract with headroom; far has 21% of near’s triangles. Cost is exported scene geometry, not device performance. The eight landmark tests raycast both tower tips, through both belfry stages, across the published door widths, and down to the dome cross; every vertex is checked against the owned envelope and nothing is below grade. The complete requested `top-cities.test.js` plus this landmark’s tests passed with zero failures. `node scripts/asset-catalog.mjs` passed (164 entries / 314 variants at check time); `pnpm assets:preview` built the local standalone catalog successfully. `qa-metrics.mjs` reported no issues, zero mixed-material coplanar overlaps and 0% backface hits in 217 exterior rays. Focused logs and metrics are in `tmp/top-cities/catedral-primada-de-colombia/`.

Visual evidence was opened with the image tool, not inferred from a successful renderer exit. The initial source contact sheet at `tmp/top-cities/shots/catedral-primada-de-colombia/source-first-pass/catedral-primada-de-colombia-procedural-near-light-sheet.jpg` exposed a mirrored roof profile, excess lower north-wall openings and a facade surface overlap. These were corrected; hidden mixed-material threshold/ground bottoms were removed and floating-point ground coordinates snapped to zero. The final exported GLB contact sheets were inspected beside the reference photographs:

- `tmp/top-cities/shots/catedral-primada-de-colombia/catedral-primada-de-colombia-glb-near-light-sheet.jpg`: overview, facade, street, opposite back, roof, tower detail, north wall.
- `tmp/top-cities/shots/catedral-primada-de-colombia/catedral-primada-de-colombia-glb-far-light-sheet.jpg`: facade, back and roof.
- `tmp/top-cities/shots/catedral-primada-de-colombia/catedral-primada-de-colombia-glb-near-dark-sheet.jpg`: facade, back and tower detail.
- `tmp/top-cities/shots/catedral-primada-de-colombia/catedral-primada-de-colombia-glb-far-dark-sheet.jpg`: facade, back and roof.
- `tmp/top-cities/shots/catedral-primada-de-colombia/comparison.jpg`: combined references and exported near/far light/dark sheets, all opened together.

Independent reviewer acceptance remains pending with the coordinator. No shared source files were required or modified.

## Placement handoff

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Bogotá’s historic center can vary in elevation across the footprint; the proposed footprint-bounded median pad with an 8 m feather keeps this reusable building rigid, without baking DEM values. App QA must confirm its entrances, street clearance, partial provider replacement and coarse-to-fine terrain behavior. No terrain rollout or runtime renderer change is included.
