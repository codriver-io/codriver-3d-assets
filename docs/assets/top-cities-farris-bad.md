# Farris Bad, Larvik

Original procedural model of the 2009 Farris Bad spa hotel at Batteristranda, Fritzøe Brygge 2, by Halvorsen & Reine with landscape architect Gullik Gulliksen AS. It is the modern shoreline hotel, rather than the older Nedre Nanset property of the same name or a proposed future expansion. Recognition comes from the four room wings around an open atrium, two room floors over a beach, the single sea-side corner column, suspended glazed spa bridge, grey shutters, beech loggias, dark stone bands, and the white lighthouse with a red cap.

## Sources and rights

- [Architect project page](https://www.heras.no/prosjekter/farrisbad): four wings around an atrium open to the fjord on two sides; two room wings span 24 m to one column; hanging glass spa room around the column. The current project page says completed 2010; the contemporary article and the hotel opening refer to 2009.
- [Øystein Rognebakke / Halvorsen & Reine, MUR+BETONG 2–2009, pp. 22–27](https://murbetong.no/wp-content/uploads/converted/joomdocs/902-farris.pdf): 2009 completion, two main room floors, a smaller setback suite floor in the northwest, below-grade basement, exposed concrete, Larvikite, beech, glass, and the public route under the southwest cantilevers. The drawings were studied for layout, not traced into a mesh.
- [Lundhs, project supplier](https://lundhsrealstone.com/en/projects/farris-bad-larvik-a-spa-hotel-rooted-in-nature): 2009 opening; Larvikite cladding and stone interiors.
- [Wikipedia supplied dossier](https://no.wikipedia.org/wiki/Farris_Bad_hotell): opened 5 March 2009. Storeys are taken from the architect article and photographs; the short encyclopedia description is ambiguous about the orientations.
- [OSM relation 2899596](https://www.openstreetmap.org/relation/2899596), outer way 219135154 and inner way 219135174: original mapped envelope and atrium. No height or levels tags on this hotel. Adjacent commercial ways 219135160/219135167 and Kulturhus Bølgen are excluded. The supplied shared-helper extract omitted relation members. A follow-up through the shared helper failed HTTP 403; a single OSM API relation/full call supplied those members, in ignored `tmp/top-cities/farris-bad/osm-hotel-full.xml`.
- Supplied Commons references: trolvag, *Farris bad, Larvik, Vestfold, Norway - panoramio.jpg*, CC BY-SA 3.0; Arnstein Rønning, *Farris Bad.JPG*, CC BY-SA 3.0; Ssu, *Farris Bad, Larvik, 2016.jpg*, CC BY-SA 4.0; GullikGulliksenAS, *Farris Bad uteområde.jpg*, CC BY-SA 3.0. Full titles and URLs are recorded in the dossier `refs/SOURCES.txt`; photo 1 establishes the lighthouse, photo 2 the pier and bridge, photo 3 the courtyard glass, photo 4 the night lighting.
- Additional architect photograph `Farris_03.jpg`, Tove Lauluten, copyright retained, visual reference only in ignored `refs/6-north.jpg` (its filename is historical; the image actually shows the sea corner). The attempted supplier aerial download returned HTTP 403 and was not used.

All model geometry is original procedural work; no photograph, texture, traced third-party surface or outside mesh is exported. Geographic data © OpenStreetMap contributors, ODbL 1.0. Kilden was studied for material batching and preservation of the signature in far LOD, without copying its geometry.

## Dimensions and geographic frame

| Feature | Model | Basis |
| --- | --- | --- |
| Sea-side span to column centre | 24 m | Architect published value, measured again by raycasts between modeled landward support and column |
| Main sea wing width | 66.194 m | OSM control points [10.019887, 59.049033] → [10.020892, 59.049327] |
| Overall hotel depth | about 80.2 m | OSM outer ring projected perpendicular to sea edge |
| Main roof | 14.6 m | Estimate from two hotel-room storeys over the public floors |
| Setback suite roof | 17.8 m | Estimate from photographed northwest upper suite floor |
| Cantilever underside | 7.4 m | Estimate from pier and bridge proportions |
| Loggia recess | 1.6 m | Photograph estimate |
| Lighthouse | 10.56 m tall, 3.1 m shaft diameter | Photograph estimate; location [u=78, v=-7] is approximate |
| Origin | [10.02005885762306, 59.049466806678204] | Area centroid of mapped outer ring minus courtyard |
| Sea edge direction | 60.37° from north | Two mapped control points; sea-facing normal 150.37°; landward frontage 330.37° |

Local +X east, +Y up, +Z south, real metres. Design u follows the ENE sea edge, v points SSE. Rotation is baked into source and GLBs. Local y=0 is beach/pier grade, rather than absolute sea level. Rigid common-floor bases extend to grade; basement is omitted. A small lighthouse replacement ring supplements the hotel ring. Footprint tests allow 0.8 m for shutters/rails and map precision; the courtyard inner ring is retained as documentation but the complete upper building envelope is owned by the hotel.

The road-side entrance is above beach grade. A shoreline median `terrainPad` specifies narrow land-side rings and reference points to avoid selecting a seabed depression under a broad pad disc. It is a provisional rigid-base policy: the north road grade, pier/water relationship and feather edges still require integration sampling. No DEM or terrain exaggeration is baked into geometry.

## Geometry and materials

The ring-shaped upper shell has continuous concrete soffit and dark Larvikite roof bands. Its open atrium is triangulated as a hole, rather than a covered roof or ground box. Southwest wings retain genuine open space beneath them and a single cylindrical concrete column. A separate glazed spa corridor spans 24 m to the hanging corner room; a small timber terrace and descending metal stair attach to it.

Outer room facades carry two rows of recessed glazing, beech dividers, projecting grey sliding shutters and glass balconies. Courtyard facades are quiet blue glass with a dark grid. Landward ends are dark Larvikite around the tall entrance glazing and timber portal. The northwest suites form a smaller setback roof. Near includes shutter blades, thin railing members, beech/soffit seams and roof grilles; far keeps the bay count with planar shutter strips and removes secondary seams while keeping the courtyard, column, bridge, staircase, balcony recess, suite roof and lighthouse.

Near materials: stone, concrete, pale, wood, frame, glass, metal, red and glow (9 draws). Far folds dark metal trim into stone and retains the white lighthouse (8 draws). Both palettes share keys. Glass is opaque. The dark palette dims stone and glass while select `glow` panes and balcony lights become warm. This approximates illuminated rooms without lighting every glass face.

## Costs and verification

| Export | Triangles | Draws | Size |
| --- | ---: | ---: | ---: |
| Near | 43,002 | 9 | 2,266 KiB (2,319,948 bytes) |
| Far | 8,006 | 8 | 428 KiB (438,472 bytes) |

Measured from exported default scenes with `pnpm build:top-cities-landmarks farris-bad --no-check` and `qa-metrics.mjs --ids farris-bad`. Far bounds differ by at most 0.025 m on a horizontal extreme and retain the same top. QA: 0 different-material coplanar overlaps, 0% back-face hits on the 290-hit near ray sweep, no removable bridgeLift, minimum y=0 within float rounding. Neither variant needs a texture or decoder.

Focused command `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/farris-bad/farris-bad.test.js` passed **262/262**; nine own tests complete in about 0.5 s. Observable tests raycast the 24 m land-to-pier-axis span, isolated concrete column, hanging bridge, open sand below the room wing, open courtyard, recessed loggias, distinct main/suite/lighthouse heights, and near/far envelope. Every source vertex stays within the hotel or small lighthouse ring, allowing 0.8 m for frontage trim and map precision. `node scripts/asset-catalog.mjs` passed with 209 entries / 400 variants.

Original authoring images opened and judged, alongside the supplied reference sheet (before the independent-review revision below):

- `tmp/top-cities/shots/farris-bad/farris-bad-procedural-near-light-sheet.jpg`: front, rear, roof, overview, entrance, sea-corner detail and courtyard.
- `tmp/top-cities/shots/farris-bad/farris-bad-glb-near-light-sheet.jpg` and `farris-bad-glb-near-dark-sheet.jpg`.
- `tmp/top-cities/shots/farris-bad/farris-bad-glb-far-light-sheet.jpg` and `farris-bad-glb-far-dark-sheet.jpg`.
- `tmp/top-cities/shots/farris-bad/farris-bad-reference-glb-comparison.jpg`: the four reference photographs immediately above the exported near/far, light/dark overview, promenade, rear and close sea-corner panels.
- Reference drawings rendered in ignored `tmp/top-cities/farris-bad/architect-plan.png` and `architect-north.png`.

The first procedural sheet exposed inward-facing northern room walls and omitted east public-floor glazing; the normals and glazing were corrected. The second source sheet confirmed the single sea column, suspended bridge, lighthouse and roof alignment against the red outline. Initial exports exceeded byte caps even while triangles were legal; quad vertices were shared and subpixel trims reduced. The exported comparison then showed overly broad far bays, so far was rebuilt to keep the near bay count using planar shutter/rail strips, becoming both more faithful and cheaper; select warm panes were moved above opaque balcony rails. The final four exported sheets and comparison were opened after that change. No further geometry issues were observed, but opaque glazing and the estimated lighthouse location remain explicit limitations.

Independent coordinator visual review is still required; this is the builder's own verification.

## Approximation and handoff

Bay counts, interior depth, suite setback, stone joints and lighthouse placement are photo-informed approximations. The lighthouse ring is not a survey. Public-floor glazing is a shallow skin over rigid base volumes. Window reflections, translucent balcony glass, interior fittings, beach landscaping, water, neighboring buildings and artworks are omitted. The bronze atrium figure is not reproduced as an anonymous blob.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Source/GLB inspector evidence establishes export quality only; independent coordinator review and app integration remain separate. No shared files were edited and no publication was performed.

## Independent-review correction, 2026-10-09

All four findings in `tmp/top-cities/review/farris-bad/REVIEW.md` were addressed in two look/fix iterations:

| Finding | Before → after |
| --- | --- |
| Light facade | Pale silver shutters / blue glass / wood at the front of every divider → #3a3d40 shutter metal, #344b50 glass, charcoal outer piers with beech restricted to the recessed balcony surfaces |
| Thin grey lighthouse | 3.1 m shaft diameter and 11.72 m height, grey far material → same 3.1 m diameter with a compact 10.56 m silhouette, bright white shaft in both LODs, supported white gallery ring and clear red cap |
| Cream end box | Pale wall and concrete base → charcoal Larvikite cladding with a narrow 0.82 m timber band on the western end core |
| Pale public-floor glass band | Facades close to the room-wing edge → darker glazing divided by dark stone piers, recessed about 1.2 m behind east/west cantilever faces, with a dark spandrel and an open shadow recess below the exposed concrete soffit |

The first revised render revealed a hidden south-facing glass skin; its offset was moved in front of its rigid base and timber band for the final export, and all remaining exposed common-floor bases were reclad in dark stone. Tests now raycast the east and west shadow recesses and verify the white three-metre lighthouse shaft in near and far. All nine own tests and three Farris Bad conformance tests pass (12/12, about 0.85 s); `node scripts/asset-catalog.mjs` passes (209 entries / 400 variants). Revised `qa-metrics-review-fix.json` reports no budget or artifact flags, 0 coplanar overlaps, 0% back-face hits and no removable attributes. Final metrics are the cost table above (before: near 41,638t / 9d / 2,201 KiB; far 6,836t / 8d / 370 KiB).

`REVIEW.md` contained no Prepare command, so the standard review workflow was rerun:

```sh
node .agents/skills/build-3d-city/scripts/qa-sheet.mjs --ids farris-bad --out tmp/top-cities/shots/farris-bad/review-fix
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids farris-bad --out tmp/top-cities/farris-bad/qa-metrics-review-fix.json
node --test --test-name-pattern=farris-bad src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/farris-bad/farris-bad.test.js
```

New exported images actually opened: `tmp/top-cities/shots/farris-bad/review-fix/farris-bad.jpg` (standard near/far review cameras), `farris-bad-glb-near-light-sheet.jpg`, and the corrected-photo `farris-bad-reference-comparison.jpg` (four dossier references plus exported near/light and far/dark overview, entrance, rear and sea-corner detail). The automated qa-sheet first tile is still unrelated Farris bottles; it was ignored, and no shared photo cache or script was edited. No new references were fetched. App integration and the approximate lighthouse position remain unverified, as recorded above.
