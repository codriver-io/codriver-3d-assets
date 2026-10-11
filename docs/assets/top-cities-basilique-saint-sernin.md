# Basilique Saint-Sernin, Toulouse

Original procedural landmark `basilique-saint-sernin`, Place Saint-Sernin, Toulouse, France; current Romanesque basilica, with its detached Renaissance abbey gate. At 100 m the paired portals, rose, round stone arches and tiered chapels read; at 800 m the five-stage octagonal tower and pale spire identify Saint-Sernin. No photographs, textures, third-party mesh or scans are shipped.

## Sources and dimensions

| Feature | Value used | Evidence / uncertainty |
| --- | --- | --- |
| Tower tip | 64.93 m, nominal 65 m | [Toulouse Mairie Métropole](https://metropole.toulouse.fr/annuaire/basilique-saint-sernin) gives 65 m; the supplied OSM spire part 260584882 tags 67 m and is not followed for height |
| Published length / transept | 115 / 64 m | City page and [official basilica plan](https://basilique-saint-sernin.fr/saint-sernin-parcours1fr/); the mapped exterior outline spans about 110 / 63 m and is retained, rather than being stretched into neighbouring pavement |
| Central nave vault | 21 m | City page; an interior measure, not a roof height |
| Model nave eaves / ridge | 17 / 21.1 m | OSM part 260584771 mapping estimates; the vault vs exterior roof discrepancy is retained as an approximation, not a surveyed exterior measurement |
| Model transept roof | 16.1 / 21.1 m | OSM parts 260584770 / 260584825 |
| West block | 20 m eaves, 23.1 m ridge | OSM parts 260584889 / 260584854 |
| Chevet / chapels | 15–18 / 8–9 m | OSM parts 260584822 / 260584821 and chapel roof parts; approximate mapped levels |
| Belfry tiers | 22.35–51.8 m, five stages | Photographic estimate, with narrowing octagonal stages; three round and two mitred paired bays per face |
| Orientation | nave 58.707° bearing; west front 238.707° | OSM roof edge from [1.4421358,43.6085828] to [1.4414778,43.6082932]; 31.293° mesh rotation from local u toward ENE |
| Origin / grade | [1.44197,43.60838]; y=0 at square pavement | Supplied dossier anchor. Crossing is [18.91,-2.13] in u/v metres |
| Renaissance gate | about 7.2 m wide, 8 m high | Mapped ways 260584763–768; dimensions and relief simplified from the gate photograph |

The full supplied OSM dossier was read, including nearby buildings and every building part. Only the basilica and gate are owned. Fresh verification through the shared Overpass helper returned HTTP 403 (service whitelist); no alternate endpoint loop was used. The supplied `osm.json` remains the authoritative mapped input. The church mask is way 260584755, with one convex gateway envelope combining its six overlapping parts (including the upper arch across the walkway); all modelled source parts are listed in OSM_WAYS. The Musée Saint-Raymond, presbytery and nearby houses remain outside ownership.

Photos examined in the supplied `tmp/top-cities/basilique-saint-sernin/refs-sheet.jpg`: [tower and south nave](https://commons.wikimedia.org/wiki/File:Basilique_Saint-Sernin_de_Toulouse_nef_et_transept_sud,_clocher.jpg), [west exposure](https://commons.wikimedia.org/wiki/File:Basilique_Saint-Sernin_de_Toulouse_-_exposition_ouest-1-.jpg), and [Renaissance gate](https://commons.wikimedia.org/wiki/File:31_-_Toulouse_-_Basilique_Saint-Sernin_-_Porte_Renaissance_de_l%27abbaye.jpg), all Didier Descouens, CC BY-SA 4.0; `Basilique de Saint-Sernin 4.jpg`, Guiguilacagouille, CC BY-SA 3.0 (licence supplied in dossier). Commons pages for the first three were checked; the fourth page could not be retrieved in this session. [Toulouse Tourisme](https://www.toulouse-tourisme.com/en/activite/saint-sernin-basilica/) confirms the recent Othoniel rose glazing; the geometric lead pattern is approximate, not a reproduction of the artwork.

## Geometry, materials and placement

The editable source uses assetBuilder, with mapped wall shells, ridge-split roofs, triangle-fan chapel cones, custom arch shapes and brick belfry faces with recessed dark backing. Both LODs retain all five solid-backed belfry stages, the lower round arches, upper mitred arches, chevet lobes, pitched roof heights, rose and walk-through gate. Far flattens archivolt frames, removes grilles and small shafts, and simplifies subpixel OSM edge noise to 8 cm. No interior or below-grade foundation is authored. Carved capitals, tympana and statues are omitted; roof tiles are continuous surfaces. Wall openings other than the tower/gate are dark recess panels.

Eight merged named materials in both LODs: brick, stone, roof, tile, recess, glass, iron and spire. Day uses muted Toulouse brick, pale limestone, two contrasting brown tile tones and a grey-slate spire. Night dims masonry/glass; no self-lit windows or invented floodlighting. Archivolts and eaves project by at most 0.65 m from the mapped masonry outline; this is checked against the union of replacement rings. The frame is real metres, X east / Y up / Z south. One baked rotation aligns the exported meshes; no terrain, absolute altitude or Mercator stretch is baked in.

Cityscape and Full 3D world: **not tested yet, integration is checked separately**. Place Saint-Sernin is expected to have less than 2 m of relief under the church, so padM is 64 m and no hillside terrainPad is declared. Terrain, entrance/pad edges, provider replacement and lifecycle still require app verification. No shared runtime or deployment files were changed.

## Verification

The initial independent review returned PASS-WITH-NITS (recognisability 3/5) and identified four material/detail defects. Before revision, near was 32,906 triangles / 7 draws / 2,069 KiB and far was 7,416 / 7 / 319 KiB. The final revised evidence and checks below supersede the initial delivery checks. Local visual verification is not app/terrain certification.

## Independent review revision

Followed `tmp/top-cities/review/basilique-saint-sernin/REVIEW.md`; no REVIEW-2 existed. The review file did not contain a Prepare command, so the standard native preparation was used:

`node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids basilique-saint-sernin --out tmp/top-cities/shots/basilique-saint-sernin/review-fix-final`

| Review defect | Before → after |
| --- | --- |
| Cream, see-through tower | Bay widths reduced from 34% to 25.5% of each octagonal face; window heights shortened, excess stone shafts removed, brick retained around the paired round/mitred openings, and a dark octagonal backing set 0.65 m behind each stage. Pale stone is confined to thin archivolts and stringcourses; spire and ribs are grey slate |
| Transept slivers | Fixed facade-plane placement replaced by each detail’s actual mapped edge and outward normal. Corner vents lacking 0.4 m of supporting wall on each side were deleted. Pilasters bite into the masonry. A geometry regression test limits upper-vent projection from the mapped wall envelope to 0.3 m |
| Flat terracotta walls | Alternating pale courses follow the lower mapped masonry and curved chapels, with more courses in near. Miégeville surround is widened in stone; the genuine Renaissance gateway jambs are stone rather than brick |
| Flat tan roofs | Opposite nave/transept/west-block pitches use distinct roof/tile tones, low aisle pitches and chapel roofs have their own tone, and raised ridge caps meet the existing roof surface in both LODs |

The tiny detached plan mark south of the nave is the **real Renaissance abbey gateway**, documented in the dossier photograph and mapped ways 260584763–768. It remains within its dedicated replacement envelope, with grounded jambs and a walk-through arch; deleting it would remove authentic architecture. This is distinct from the unsupported transept slivers that were fixed.

Two look/fix passes were used: the first revised standard sheet showed the corrected tower, stone courses and roof tones; a new attachment test then caught one corner vent spanning beyond its supporting short edge, so such vents were omitted before the final export and look. Final inspected evidence is `tmp/top-cities/shots/basilique-saint-sernin/review-fix-final/basilique-saint-sernin.jpg`, and `tmp/top-cities/shots/basilique-saint-sernin/review-fix-final/review-comparison.jpg`, which includes that prepared sheet plus near/far light/dark tower, street, chevet and roof views beside the four dossier photos. Both were compared with the dossier/reference photo: the tower now reads as continuous brick stages with dark recessed bays, rather than pale open scaffolding. Roof-tone separation and grounded/attached details survive far.

| Final export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 36,006 | 8 | 2,317,004 | 2,263 |
| far | 8,056 | 8 | 375,172 | 366 |

Final focused tests: five pass, zero fail, under 3 seconds. They pin brick centre piers, dark backed openings and at least 0.5 m of visible recess, slate material on the spire, mapped vent attachment, dimensions, roof ridge, grounded/walk-through gate and far silhouette/cost. The shared asset catalog passes. QA reports no budget/artifact issues, zero removable attributes, numerical grade zero and 0% back-face hits; remaining 10 tiny coplanar candidates total 0.8 m² at a cornice contact, below the broad-overlap threshold. See `tmp/top-cities/basilique-saint-sernin/review-fix-metrics.json` for exact values. No shared file was changed. Sculpture, rose artwork and individual tiles remain simplified; Cityscape and Full 3D world are not tested yet, integration is checked separately.
