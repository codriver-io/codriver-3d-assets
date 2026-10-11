# British Columbia Parliament Buildings, Victoria

Original procedural present-day exterior of Francis Rattenbury's Parliament Buildings at 501 Belleville Street, facing the Inner Harbour, including the rear Legislative Library and office additions. Completed in 1897, formally opened 10 February 1898; the Library and office additions were completed in 1915. No third-party mesh, photograph, texture or scan is distributed.

## Sources and dimensions

The lead's OSM dossier and attributed Commons contact sheet were the starting point. Official Legislative Assembly pages checked 2026-10-06:

- [Exterior features](https://www.leg.bc.ca/learn/discover-your-legislature/building-tour/exterior-features): 152.4 m facade, stone/granite/slate/copper materials, colonnades and octagonal renaissance dome.
- [Upper Rotunda](https://www.leg.bc.ca/learn/discover-your-legislature/building-tour/interior-features/upper-rotunda-and-entrance-to-legislative-chamber): 39.6 m from the main floor to Vancouver's head; 30.5 m interior dome height. The interior height is not a grade-to-exterior-crown measurement.
- [Completion and opening](https://www.leg.bc.ca/learn/discover-your-legislature/1897-new-parliament-buildings-completed), [ceremonial entrance](https://www.leg.bc.ca/learn/discover-your-legislature/building-tour/exterior-features/legislative-precinct/front-facade-and-ceremonial-entrance), [Vancouver statue](https://www.leg.bc.ca/learn/discover-your-legislature/building-tour/exterior-features/building-statuary/captain-vancouver-statue).
- [Outdoor walking tour](https://www.leg.bc.ca/sites/default/files/images/pdf/peo/Legislative-Assembly-Outdoor-Walking-Tour-English.pdf): 33 copper domes and two-metre Vancouver statue. This official leaflet says more than 3,500 energy-efficient bulbs, so the model does not claim an exact count of 3,300.
- [Library exterior](https://www.leg.bc.ca/learn/discover-your-legislature/building-tour/legislative-library/legislative-library-exterior): portico, fourteen historical figures, 2.74 m figure height.

| Dimension | Source / confidence | Model |
| --- | --- | --- |
| Frontage including annexes | Official 152.4 m | 151.20 m including trim (0.8% shorter) |
| Main floor to Vancouver's head | Official 39.6 m | 39.60 m |
| Main floor above grade | Estimated from entrance stairs | 2.0 m; total top 41.6 m |
| Copper central crown / lantern | Estimated exterior profile; OSM heights are lower | Crown 37 m; lantern 39.6 m |
| Main dome diameter | OSM part 256936103, approximate | 13.3 m, eight lobes |
| Corner front cupolas | OSM 256936033/034/035/037 | 25.5 m copper crown, about 26.3 m with finials |
| Annex walls / roofs | OSM | 15 / 18 m, low corner domes at 19 m |
| Library roof | OSM | 30 m, four copper corner cupolas at 28 m |
| Statue and window proportions | Comparison photographs / estimates | Stylised; no individual portraits or carved relief replication |

## Frame and provider replacement

Metres, +X east / +Y up / +Z south. Origin `[-123.37028, 48.41944]` is the dossier's anchor in the central chamber block; local grade is y=0. Authoring uses u along the frontage and v toward the rear. A 0.214-radian rotation is baked into vertex positions, leaving the root transform at identity: the frontage axis bears 102.26 degrees and its harbour-facing normal 12.26 degrees.

Two mapped control points on central part 256936040 are `[-123.370063,48.4196922]` and `[-123.370121,48.4197006]`: the westward segment bears 282.31 degrees, confirming the 102.31-degree facade axis to within 0.05 degrees. This follows the actual mapped outline, not an assumed Victoria street grid.

[OSM relation 1371742](https://www.openstreetmap.org/relation/1371742) was fetched through the shared Overpass helper; its sixteen outer member chains are stitched into one 199-point ring. All 115 building parts from the dossier are recorded in editable `bc-parliament-buildings-site.js`, with separate provider rings where area exceeds 4 m². Tiny wholly nested statue/lantern parts are already covered by the outer ring; their ids are retained. Separate nearby government offices and the small east outbuilding are excluded. `OSM_WAYS` includes the outer member and part ids. Geographic data © OpenStreetMap contributors, ODbL 1.0.

Part walls and roofs remain within the mapped envelope plus up to 0.45 m facade trim. Front stairs extend about 5.2 m beyond the central north wall and the library stairs about 3.2 m beyond its portico; these are authored steps, not a wider building mask. Near ornament makes the global envelope only 0.16 m larger on each horizontal edge than far. No terrain height, Mercator stretch or sea-level altitude is baked into the geometry. A rigid base and `padM=112` cover this approximately level site; no terrain relief survey was done.

## Geometry, materials and LOD

Original ring walls, selective exposed facade strips, hip/mansard roof lofts, copper cupolas, octagonal dome lobes, an open lantern and a small gilded humanoid statue. The ceremonial doorway is recessed behind a true arch opening. Both annex colonnades contain five openings on each side, with piers and a roof above; the courtyards remain empty. The Library has a six-column portico, paired tiers of recessed windows and stylised figures mounted on wall brackets.

Eight merged named materials: stone, dressed trim, granite foundation, slate roof, patinated copper, glass, gold and self-lit `light`. Dark palettes dim masonry and warm the glass. Continuous small roof strips, dome ribs and the ceremonial arch stand in for the real outline bulbs; their width is exaggerated for readability. They do not simulate individual bulbs, bloom or electrical fittings. All materials are texture-free.

Near keeps dressed arched frames, mullions, cornice dentils, oculi, engaged columns and library figures. Far keeps the envelope, dome family, Vancouver statue, portico and arcade openings while dropping minor facade frames, figures and half the window rhythm. Parts' dense curved rings are simplified within 0.07 m near / 0.22 m far. Compatible vertices are merged after orientation is baked.

Known approximations: coarse window cadence differs from individual bays; central drum/crown height combines the official total with estimated floor and exterior profiles; the copper lobes are simplified; carved masonry, coats of arms and figures are stylised and the facade reads less ornate at close range than the real building. The rear mansard profile is a loft approximation. Grounds, fountains, trees, flags and interiors are excluded. Night lighting is a low-cost outline abstraction rather than the full photograph's brightness or lamp count.

## Verification and costs

Exports: `pnpm build:top-cities-landmarks bc-parliament-buildings --no-check`.

| Export | Triangles | Draws | KiB |
| --- | ---: | ---: | ---: |
| Near | 52,221 | 8 | 2,046 |
| Far | 11,073 | 8 | 453 |

Measured default-scene GLBs, not hardware timing. Both variants remain under the 60k/14/2.5MB and 12k/8/500kB hard budgets. The far export has limited triangle headroom; do not add unmeasured ornament there. Source and exported bounds agree within 1 mm. `qa-metrics.mjs --ids bc-parliament-buildings` reports no issues: zero flagged coplanar overlaps, 0.5% back-face hits (below the 2% QA threshold), minimum y=0, no removable bridgeLift bytes and unchanged near/far envelope.

Images actually inspected under `tmp/top-cities/shots/bc-parliament-buildings/`:

- `bc-parliament-buildings-procedural-near-light-sheet.jpg`: first facade / back / roof / entrance / dome / plan pass, compared with dossier `refs-sheet.jpg`.
- `bc-parliament-buildings-glb-near-light-sheet.jpg`: exported facade, overview, opposite facade, above, entrance, detail and footprint plan.
- `bc-parliament-buildings-glb-near-dark-sheet.jpg`, `bc-parliament-buildings-glb-far-light-sheet.jpg`, `bc-parliament-buildings-glb-far-dark-sheet.jpg`: exported LOD and theme comparison.
- `final-reference-comparison.jpg`: near/far, light/dark GLBs next to the front, dusk, dome-detail and rear reference photographs; upper row is references, middle near, lower far.

What changed after inspection: bulky hidden window/frame geometry was replaced with surface frames and rings; dense ring coordinates were simplified; the central front's duplicate windows were removed; roof/foundation coplanar caps were separated; dome lights hidden inside copper ribs were moved outward; the rear photo led to a real open library portico, tall rear windows and wall-bracket figures; the portico slab has a closed visible soffit. The final night check showed subpixel roof lights at distant views, so their strips were widened while keeping the same draw/triangle cost.

Focused tests assert published width/height, ground contact, dome and front cupola heights, see-through arcades and real piers, recessed ceremonial door, open courtyards and library portico, envelope allowances, LOD agreement and exported openings/materials. Test command: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/bc-parliament-buildings/bc-parliament-buildings.test.js`. Catalog validation: `node scripts/asset-catalog.mjs`. Independent reviewer acceptance is pending with the lead; self-inspection is not that independent review.

## Reference-image provenance

Comparison only, kept in ignored tmp; none copied into the model or public assets:

- [British Columbia Parliament Buildings - Pano - HDR](https://commons.wikimedia.org/wiki/File:British_Columbia_Parliament_Buildings_-_Pano_-_HDR.jpg), Ryan Bushby / HighInBC, CC BY 2.5.
- [British Columbia Parliament Buildings illuminated at dusk](https://commons.wikimedia.org/wiki/File:British_Columbia_Parliament_Buildings_illuminated_at_dusk.jpg), Dllu, CC BY-SA 4.0.
- [British Columbia legislature building roof close up](https://commons.wikimedia.org/wiki/File:British_Columbia_legislature_building_roof_close_up.jpg), Ryan Bushby, CC BY 2.5.
- [Victoria Legislature building from rear - panoramio](https://commons.wikimedia.org/wiki/File:Victoria_Legislature_building_from_rear_-_panoramio.jpg), Larry LaRose, CC BY-SA 3.0; one additional photograph fetched to cover the missing rear angle.

## Placement modes

| Mode | Status | Evidence / limitation |
| --- | --- | --- |
| Cityscape | Not tested yet, integration is checked separately | Standalone GLB QA only; no app zoom, provider-mask or lifecycle validation |
| Full 3D world | Not tested yet, integration is checked separately | Rigid base; approximately level-site pad expectation, no DEM or mode-switch validation |

No shared runtime files, provider layers or feature gates changed. No public viewer deployment, git write command or full test suite was run. Actual Tesla performance remains unmeasured.

Final validation: all 164 focused registry and landmark tests passed; the catalog passed with 178 records / 336 variants at validation time, and `pnpm assets:preview` built the ignored local inspector successfully.
