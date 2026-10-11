# Palace of the Parliament

Palatul Parlamentului (the People's House), Strada Izvor 2-4, on Dealul Spirii in Bucharest. Anca Petrescu directed the design, completed in 1997. This original procedural exterior uses the mapped OSM outline and courtyard holes, pale limestone, giant-order columns, an arched piano nobile, broad setback storeys and a Romanian roof flag.

## Sources and frame

The dossier supplies Wikipedia facts, OSM relation 2230391 (outer way 14325732; court ways 167231786/178309073; parts 232360843/283976783), and licensed photographs by Jorge Franganillo, William John Gauthier, Dennis Jarvis and Robert Anders. Reference URLs and licenses are retained in the catalog record; photographs remain comparison-only, never textures or shipped mesh. Architectural height is 84 m (Wikipedia); OSM's central part says 86 m and broad middle part says 58 m. The relation's 29 m height is not used.

Origin: 26.08735814, 44.42747051, the mapped area centroid. Real metres, east/up/south, with local y=0 at the terrace under the walls. The ceremonial east front faces Piața Constituției and Unirii at bearing 93.3°, derived from mapped edges. Authoring +x runs north along that facade and +z east; the rotation is baked once into the export. No DEM, absolute altitude or Mercator scale is baked.

| Element | Final value | Evidence |
| --- | --- | --- |
| Central stone parapet | 84 m | Published architectural height |
| Flagpole tip | 89.5 m | Estimate |
| Outline envelope | About 245 m east–west by 290 m north–south | OSM outer ring, including pavilions |
| Bastion roof / parapet | 40.8 / 42.4 m | Visual estimate, raised 2 m to accommodate stacked upper rows |
| Outer wing roof / parapet | 46.2 / 48 m | Visual estimate |
| First setback tier | 190 × 147 m; roof 56.4 m, parapet 58 m | Envelope estimated; height anchored to OSM middle part |
| Second setback tier | 162 × 122 m; roof 64.4 m, parapet 66 m | Visual estimate |
| Upper central crown | 105 × 23 m; roof 82.7 m, parapet 84 m | Plan/setback estimated; published final height |
| Giant-order columns | Shafts reach 22.2 m, entablature reaches 25.4 m; bay about 8.4 m | Visual estimate |
| Underground | 92 m, omitted | Wikipedia |

## Final massing and facade

The OSM shell remains intact with the original two courtyard holes. Instead of isolated shoulder boxes on one flat roof, a broad 58 m tier and smaller 66 m tier form genuine setback volumes around both courts. Their east fronts sit at authoring z=77 and 67 m; the 84 m crown is further back at z=63 m. Every tier has two visible window rows and a profiled cornice in both LODs. Roof plates exclude the next tier, and tier courtyard walls continue to grade without spanning either opening. The ceremonial ground frontage remains recessed 6.8 m behind the wings and carries the eight-column entrance portico.

Upper wings have three stacked rectangular rows above the arched piano nobile; east bastions have two upper rows. Substantial stepped cornices and parapets replace blank upper bands. Giant-order shafts remain tall while the glazing behind them is divided into three storeys, with stone spandrels at 7.3–8.65 and 14–15.35 m. Near adds jambs, central mullions and small balcony profiles; far retains the glazed storeys and stone divisions. Arched piano-nobile and top-crown heads remain legible.

The material palette remains pale limestone, lighter trim, darker base, cool glass, warm night glow, dark openings, iron pole and three flag stripe materials. Geometry is merged by material. Four vertices per quad reduce repeated vertex payload; far additionally merges trim/base shades into stone and omits minor cornice ledges and window frames. Closed cornice ends and inward parapet faces prevent back-face holes. Door surrounds stand 0.2 m ahead of the new spandrel plane to avoid coplanar faces.

## Export costs and verification

| LOD | Triangles | Draws | KiB | Exact bytes |
| --- | --- | --- | --- | --- |
| Near | 23,361 | 10 | 1,191 | 1,219,496 |
| Far | 8,875 | 8 | 464 | 474,780 |

Before this round: near 14,143 / 10 / 903 KiB, far 6,818 / 8 / 473 KiB. Final-round caps are 35 k near / 9 k far triangles and 12 draws, plus the repository's 2.5 MB near / 500,000 bytes far and 8 far draws. Both exports pass. Near/far bounds match exactly, min y=0, flagpole tip=89.5 m, no removable bridgeLift, zero coplanar pairs and zero back-face hits in the deterministic sweep.

Commands: `pnpm build:top-cities-landmarks palace-of-the-parliament --no-check`; landmark-specific node tests; focused `top-cities.test.js` with `--test-name-pattern=palace-of-the-parliament`; `node scripts/asset-catalog.mjs`; the requested `qa-metrics.mjs --ids palace-of-the-parliament` and `qa-sheet.mjs --ids palace-of-the-parliament`, both outputting to `tmp/top-cities/review/palace-of-the-parliament/`.

Five landmark tests verify height, the five roof levels in both LODs, courtyard openness, tier/wing/bastion window rows, glazed storeys versus stone spandrels, the arched piano nobile, closed inward parapet and footprint tolerance. The additional three focused conformance tests check spec/catalog/footprints, geometry budgets and export/source agreement.

## Visual evidence

Compared the new exported near/far sheet `tmp/top-cities/review/palace-of-the-parliament/palace-of-the-parliament.jpg` directly with its reference tile and `tmp/top-cities/palace-of-the-parliament/refs-sheet.jpg`. It shows real broad terrace steps around open courts, stacked wing/bastion rows and divided colonnade glazing. The first massing attempt used three tiers but left too little central crown exposed and overspent far bytes; the final two tiers retain a taller central block. Far-only reductions omit minor cornice ledges while keeping roof levels, rows and glazing divisions. Metrics evidence is `tmp/top-cities/review/palace-of-the-parliament/metrics.json`.

## Approximations and placement

The setback envelopes, storey dimensions, shallow central crown, cornice profiles and pavilion heights are visual estimates, not a measured architectural survey. Sculpture, dense ornament, gardens, fountains and underground floors are omitted. The colonnade is glazing behind round shafts rather than a full carved loggia. At sharp bastion corners the entablature overhangs the mapped ring by about 2.4 m; long walls stay closer.

The rigid foundation uses `terrainPad: { rings: FOOTPRINTS, datum: 'median', featherM: 18 }` for the terraced Arsenal hill. No terrain sample was taken. Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately. Catalog readiness and these inspector sheets do not certify app placement.
