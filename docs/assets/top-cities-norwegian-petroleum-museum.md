# Norwegian Petroleum Museum — Stavanger

Original procedural model of Norsk Oljemuseum at Kjeringholmen, Stavanger: Lunde & Løvseth's 1999 building, opened by King Harald on 20 May 1999. The official museum describes the composition as Norwegian bedrock, the open coast and offshore installations. Three silver drums elevated over the harbour, glazed links, granite rock-like ends and a sloping silver exhibition shell define the exterior.

Sources checked 2026-10-08: [official building history](https://www.norskolje.museum.no/en/om-museet/the-building-of-the-norwegian-petroleum-museum/), [official location](https://www.norskolje.museum.no/en/home/visit-the-museum/where-is-the-museum/), OSM ways [31722952](https://www.openstreetmap.org/way/31722952), [31820507](https://www.openstreetmap.org/way/31820507), [32323150](https://www.openstreetmap.org/way/32323150), [32323166](https://www.openstreetmap.org/way/32323166). Confirmed with the shared Overpass helper; extract `tmp/top-cities/norwegian-petroleum-museum/osm-confirmed.json`.

Reference photographs inspected: [Stavanger Norwegisches Ölmuseum 3.JPG](https://commons.wikimedia.org/wiki/File:Stavanger_Norwegisches_%C3%96lmuseum_3.JPG), Zairon, CC BY-SA 3.0; [Museum Oil Stavanger.JPG](https://commons.wikimedia.org/wiki/File:Museum_Oil_Stavanger.JPG), Fxp42, CC BY-SA 3.0; [Oljemuseet2.jpg](https://commons.wikimedia.org/wiki/File:Oljemuseet2.jpg), Ranveig, CC SA 1.0. Authors/licences checked on Commons. The dossier also contains exhibit photos which were not used for architecture. Photos stay ignored in tmp; no photograph, bitmap, texture, tracing or external mesh is shipped. Original geometry by Codriver; OSM data ODbL 1.0.

## Frame and dimensions

Metres, east/up/south; origin `[5.73472,58.97361]`, local y=0 is rigid promenade grade, not sea level. Mapped control points `[5.7343961,58.9732921]` and `[5.7350042,58.9734919]` give the long facade 57° from north; the landward frontage faces 147°. Rotation is baked into every vertex. Four OSM outlines own the main irregular body and three separate drums. Four additional narrow estimated polygons cover only the glass connectors, not the intervening harbour. No neighbouring building is owned.

| Feature | Model dimension | Evidence |
| --- | --- | --- |
| Main OSM outline | 2,545 m², roughly 75 m along the long axis | Mapped dossier, no height tags |
| Three pavilion outlines | 186 / 174 / 202 m² | OSM |
| Pavilion body diameters | 14.7 / 14.2 / 15.2 m | Fitted inside mapped outlines |
| Pavilion underside / top | 5.7 / 12 m | Estimated from photographs |
| Granite end tops | 10 / 14.2 m | Estimated |
| Inclined silver exhibition top | 11.4 m | Estimated |
| Highest roof plant | 17.2 m (17.31 m declared envelope) | Estimated, no published height established |
| Glazed base | 4.55 m | Estimated |
| Glazed links | about 3.5 m wide, elevated | Estimated |

## Geometry and export

Editable source in `src/peregrine/landmarks/top-cities/norwegian-petroleum-museum/`; the prefixed helper supplies the mapped frame and closed polygon shells. `assetBuilder` merges named materials. Main roof/wall shell is original approximate geometry, not an architectural-plan trace. Two drums use four columns and diagonal bracing, the eastern one a broad caisson; no water plane is included. Near has horizontal drum courses, vertical seams, railings, granite block joints, glazing mullions, vent louvres and roof piping. Far retains all defining volumes, open undercrofts, roof caps, links, bracing and entrance.

Eight named materials near; seven far (joints merge with steel). Day/night palettes dim stone and metal; only circulation glazing and entrance use the runtime's unshaded `light` material. Night lighting is a restrained stylization, not a photometric survey.

Build: `pnpm build:top-cities-landmarks norwegian-petroleum-museum --no-check`.

## Verification

Initial procedural contact sheet `tmp/top-cities/shots/norwegian-petroleum-museum/iteration-1/norwegian-petroleum-museum-procedural-near-light-sheet.jpg` was opened alongside the dossier. It exposed roof-cap boxes rotated opposite the mapped axis, causing projecting disconnected louvres; corrected the box rotation. Adjusted drum seams to touch the cylindrical skin. Main facade, back, roof, street entrance, pavilion detail and plan were inspected.

The second exported comparison exposed twisted glazed-link cross sections from quaternion bars; replaced them with upright axis-aligned boxes in the architectural frame. Deterministic QA also exposed hidden coplanar glass/roof and support/plate caps; removed the redundant caps and offset internal contacts. The final comparison was opened and judged against the three licensed photographs: all drums, roof caps, silver courses, concrete caisson, open stilted undercrofts, granite ends and inclined exhibition shell remain visible, including in far LOD.

Final viewed evidence: `tmp/top-cities/shots/norwegian-petroleum-museum/final/reference-comparison.jpg` puts the reference photographs beside the four final `norwegian-petroleum-museum-glb-{near,far}-{light,dark}-sheet.jpg` sheets. Each includes overview, landward facade, roof, back/waterfront, street, pavilion detail and top. Final changes fit within three look/fix iterations; no additional photographs fetched.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 29,114 | 8 | 1,184,988 | 1,157.2 |
| Far | 4,322 | 7 | 172,996 | 168.9 |

Both LODs have identical measured bounds (approximately 86.18 × 17.25 × 89.02 m), no texture or decoder, and no removable bridgeLift attributes. Budget headroom: near below 60k/14/2.5MB and far below 12k/8/500KB.

Focused command `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/norwegian-petroleum-museum/norwegian-petroleum-museum.test.js` passes **226/226**; six local tests run in about 0.2 seconds. Assertions inspect ray hits on three pavilions/unequal plant caps, empty undercrofts, grade-contacting supports, caisson, granite tops, sloped shell, mapped bearing, all vertices within 0.8 m of owned footprint union, and LOD silhouette. Conformance also parses actual GLBs and checks source bounds/material names and measured budget/manifest agreement.

`node scripts/asset-catalog.mjs` passes (198 entries / 378 GLB variants at this checkpoint); `pnpm assets:preview` builds the local ignored inspector. `qa-metrics.mjs --ids norwegian-petroleum-museum` reports **no issues, zero coplanar overlaps, 0% back-face hits on 250 rays**, no below-grade part beyond float rounding, and no removable attributes. Full details are ignored `tmp/top-cities/norwegian-petroleum-museum/qa-metrics.json`; tests in `tests.txt`. SPEC.ready=true and catalog ready. Independent reviewer acceptance remains pending.

Approximations: exact roof folds, granite-wing extent, pavilion heights, rail spacing, number/locations of piles, plant/pipes, panel modules and glass-link routes are estimated. Simplified opaque glass; no interiors, maritime exhibits, flagpoles, quay walls, furniture or adjacent streets. Author visual QA does not establish independent acceptance or device performance.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Level harbour site, rigid grade with padM=66; no terrain baked. Water samples can depress a default terrain pad: the integration owner must inspect promenade/pile footing heights and may need a bounded median pad. Under-platform voids must remain visible; catalog readiness is not terrain certification.
