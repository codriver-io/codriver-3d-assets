# EYE Filmmuseum — Amsterdam

Original procedural exterior of the waterfront museum at **IJpromenade 1**, designed by Delugan Meissl Associated Architects (DMAA), completed December 2011 and opened in 2012. This is the white bent crystalline museum opposite Amsterdam Centraal, not its former Vondelpark premises or the separate collection centre at Asterweg 26. Asset ID `eye-filmmuseum`.

## Sources and rights

Consulted 2026-10-05:

- [DMAA — Eye Filmmuseum](https://www.dmaa.at/work/eye-film-institute): architect, address, December 2011 completion, 8,700 m² gross floor area, 6,300 m² floor area, 3,250 m² built-up area, four cinemas, southern glazed frontage and crystalline shell. The architect's section and level-02 plan were studied as references for the arrangement of shell, cinema, arena and stair. They are not redistributed; this is original approximate exterior geometry, not a copied mesh or a traced architectural drawing.
- [Eye — Plan your visit](https://www.eyefilm.nl/en/plan-your-visit): exact museum address, white waterfront building and distinction from the collection centre.
- [OSM upper shell, way 127505497](https://www.openstreetmap.org/way/127505497), [lower core, way 1206726812](https://www.openstreetmap.org/way/1206726812), [entrance stair, way 1207014127](https://www.openstreetmap.org/way/1207014127): shared BAG identifier `0363100012237838`, `start_date=2011`, separate `level=1` and `level=0` outlines. Upper outline has `layer=2`. Relation 20772608 contains all three ways. Heights and roof dimensions are **not tagged**. Dossier extract was confirmed once using the shared Overpass helper; result is ignored `tmp/top-cities/eye-filmmuseum/osm-confirmed.json`.
- [EYE Film Institute Netherlands, Amsterdam.jpg](https://commons.wikimedia.org/wiki/File:EYE_Film_Institute_Netherlands,_Amsterdam.jpg), JoachimKohlerBremen, **CC BY-SA 4.0**: waterfront silhouette, rising prow, long diagonal ribbon, narrow slanted upper window, glazed arena and lower level.
- [20130421 Amsterdam 13 EYE Film Institute Netherlands.JPG](https://commons.wikimedia.org/wiki/File:20130421_Amsterdam_13_EYE_Film_Institute_Netherlands.JPG), Mark Ahsmann, **CC BY-SA 3.0**: cladding joints, glazing, mullion/transom proportions and projecting ledge. Author and licence checked on the Commons file page.

The supplied `refs-sheet.jpg` was opened and rejected as a geometric reference: it contains film collection images, the old museum and the separate collection centre. Only **two** additional building photographs were fetched. They and the architect's reference diagrams remain in ignored `tmp/top-cities/eye-filmmuseum/refs/`. No photos, textures, drawings, external meshes or vertex colours are shipped. Original model/code by Codriver; geographic data © OpenStreetMap contributors, ODbL 1.0.

## Frame and dimensions

Real metres, **+X east, +Y up, +Z south**. Origin `[4.9008392696, 52.3843671428]` is the stable area centroid of the upper-shell outline. Geographic vertices convert directly into the local frame; the exported GLB already has the mapped orientation. Do not apply another rotation. `y=0` is the local promenade grade; no absolute sea level, DEM or Mercator stretch is baked in.

The front segment between OSM controls `[4.9005533, 52.3841565]` and `[4.9012428, 52.3841162]` runs at **95.45°**, facing approximately **185.45°**. The building bends northward at its west end rather than following an assumed city grid. Footprints include the upper cantilever as well as the inset lower storey and long entrance stair, and exclude A'DAM Toren and its neighbouring buildings.

| Feature | Dimension | Evidence |
| --- | --- | --- |
| Upper shell plan | 4,733.5 m²; 111.40 m east/west and about 86.3 m north/south | Mapped OSM envelope, not architect's built-up area |
| Lower core plan | About 2,701 m² | OSM |
| Entrance stair envelope | About 343 m² | OSM |
| Eastern roof/prow | 25 m | **Estimated**, using photo proportions relative to mapped plan |
| Western tail roof | 15.5–17.5 m | **Estimated**, photographs and section |
| Waterfront west roof edge | 12 m, rising through 13 / 15.8 / 18 / 21.5 to 25 m east | **Estimated** |
| Lower storey | 4.1 m | **Estimated** |
| Main glazing setback | 3.1 m | **Estimated**, physical recess rather than facade overlay |
| Prow underside | Roughly 17.9 m at its end; lower edge swept back 4.5 m | **Estimated** |
| Entrance stair | 4.1 m rise; 28 treads near / 7 far | **Estimated**, within mapped envelope |
| Mullions / panel joints | 2.3–2.4 m glazing bays; 1.6 m triangular lattice | **Estimated**; simplified panel pattern |

The architect's built-up area (3,250 m²) describes a different area definition from the OSM **upper overhang envelope** (4,733.5 m²); this is not used to horizontally rescale the mapped shell. No published total height was established, so the 25 m figure must not be described as surveyed.

## Geometry and materials

Editable folder: `src/peregrine/landmarks/top-cities/eye-filmmuseum/`. `geometry.js` models the shell and site; `eye-filmmuseum-mesh.js` provides polygon triangulation with real holes and clipped thin geometric panel joints. `config.js`, `footprint.js`, `views.js` and `eye-filmmuseum.test.js` complete the folder contract. Build:

```sh
pnpm build:top-cities-landmarks eye-filmmuseum --no-check
```

Both LODs preserve the bent plan, large folded roof planes, low western edge, rising eastern cinema prow and sloping end cap, white brow, diagonal white facade ribbon, two wedges of glazing, recessed ground storey, narrow slanted upper window, underside closure and open space beneath the projecting prow, plus the long access stair and rails. Near adds the triangular cladding joint lattice and glazing mullions/transoms. Geometry is merged by named material, not a mesh per panel.

Eight materials near: `shell`, `roof`, `joints`, `soffit`, `glass`, `light`, `steel`, `concrete`. Five far: `shell`, `soffit`, `glass`, `light`, `concrete`; the far stair rail folds into glass and the roof into shell. `light` is dark blue glazing by day and warm lit glazing at night, using the runtime's unshaded convention. No new shader or texture is needed. Cladding joints stand 0.065 m proud of each actual triangle plane; frame members stand proud of recessed glazing. The upper bars are bevelled with their host glass so the tip does not leave detached mullions.

## Verification and costs

Exported default scenes, final build:

| Variant | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 6,661 | 8 | 476,580 | 465.4 |
| Far | 290 | 5 | 27,396 | 26.8 |

Both are well under the building caps (60k / 14 / 2.5 MB near; 12k / 8 / 500 KB far). Low far triangle count is intentional for a building whose identity comes from a few flat facets and large apertures. The near/far shell bounds agree within 0.15 m. Device performance has not been measured.

Actual viewed evidence in ignored `tmp/top-cities/shots/eye-filmmuseum/`:

1. `iteration-1/eye-filmmuseum-procedural-near-light-sheet.jpg`: overview, facade, roof, back, street, detail and top. Compared to both Commons photographs. Found the window opening crossed the roof edge and the stair needed exact mapped corners; corrected both and moved cameras closer.
2. `iteration-2/eye-filmmuseum-glb-near-light-sheet.jpg`: checked the exported GLB. Refined cladding spacing/line width and the prow's sloping end cap so the front did not terminate as a vertical slab.
3. `final/eye-filmmuseum-glb-{near,far}-{light,dark}-sheet.jpg`: exported near/far, day/night, waterfront facade, opposite side, above, street and detail; near-light also includes top over all three red footprint rings. Compared in `final/eye-reference-comparison.jpg`, with the two licensed reference photos beside the four GLB sheets. A focused dimension test exposed the last upper mullion still at its unbevelled position; corrected it and regenerated the final near sheets.

Focused landmark tests assert the actual mapped bearing, 25 m estimated height and 111.4 m mapped envelope, unequal west/east roof heights via downward rays, physical glazing setback, the lower glazing wedge and open space beneath the eastern prow via horizontal rays, all vertices within 0.8 m of the union of owned footprints, stair tread height, palette names and source/GLB bounds. Tests run in about 0.2 seconds; the shared top-cities conformance checks cover exported budgets and catalog agreement too.

Final verification: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/eye-filmmuseum/eye-filmmuseum.test.js` passes **107/107**, including all EYE tests; `node scripts/asset-catalog.mjs` passes (164 entries / 276 variants at that checkpoint), and `pnpm assets:preview` builds the local inspector successfully. `SPEC.ready=true` and catalog status is ready.

`qa-metrics.mjs --ids eye-filmmuseum` passes: no budget/removable-attribute/grade/silhouette issues, **0.8%** back-face hits on 253 outside-in ray hits, and two tiny frame-cap/roof coplanar candidates whose total area rounds to 0 m² (no meaningful overlap). Detailed current audit is ignored `tmp/top-cities/eye-filmmuseum/qa-metrics.json`. Author visual QA is complete; **independent reviewer acceptance is still pending**.

## Approximations and placement

The exact roof-facet arrangement and heights, facade aperture/ribbon profiles, eastern supports, window width/slant, stair rise, colours and panel modules are estimates. The real cladding mixes rhombi and irregular polygonal modules; the near model uses a triangular lattice. Interior arena terraces, cinema seats, restaurant furniture, individual doors, signage, vegetation, river wall and neighbouring buildings are omitted. The back facade is a simplified opaque folded shell, with no claim of an elevation survey. Exterior glazing is opaque stylized colour so it remains legible at driving distances.

**Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.** The site is a level waterfront promenade; no hill or absolute water datum is modelled. Default `padM=78` covers the owned building and stair. Full 3D world must check waterfront DEM samples and pad boundaries beside the river: a water sample could depress the default disc, and a bounded median pad may be needed at integration. No terrain certification, masks/lifecycle/app test or independent visual review is inferred from catalog readiness.
