# Canada Olympic Park ski jumps, Calgary

Original procedural reconstruction of the Olympic K114/K89 jumps and K63/K38 training hills on Calgary’s Paskapoo Slopes. The landmark represents the standing jump complex in the earlier authoring references; later demolition is outside this geometry fix.

Build: `pnpm build:calgary-landmarks canada-olympic-park --no-check`. This earlier Calgary landmark uses the Calgary exporter, rather than the top-cities exporter. Source: `src/peregrine/landmarks/calgary/canada-olympic-park/`. Catalog: `prototypes/assets3d/catalog.d/canada-olympic-park.json`.

## World terrain and LOD correction, 2026-10-12

The previous authored hill estimated 35 m of relief above the K89 outrun, then tapered to zero along its shoulders and edges. Constant-height terrain patches lowered the real hillside beneath that shape, producing a pit, grey cliffs and a terrain triangle through the K89 landing. Earlier Full 3D world acceptance claims are superseded by this correction.

The replacement survey targets the terrain displayed by the app: AWS/Mapzen Terrarium **z13 DEM**, sampled on the globally aligned **z14 TIN**, with 64 cells per tile and 24.0119 m ground spacing at Calgary. `TERRAIN_MAX_ZOOM=15` is a cap, not the near renderer’s sampling zoom. Four z15 tiles were fetched once as a resolution cross-check.

`canada-olympic-park-dem.js` contains a literal 14 × 23 node height table and the same SW–NE triangle interpolation as the app. Heights are relative to the outrun; its surveyed absolute datum is metadata. The generator has no terrain/basemap/runtime imports and performs no network requests. Survey scripts and raw PNGs remain in ignored `tmp/top-cities/canada-olympic-park/`.

Local world zero is the lower K89 outrun, 120 m downhill of its take-off: **1166.2831 m**; z15 at that point is **1166.2143 m**. The live median of two reference samples is 1166.2837 m.

| World take-off | Height above outrun |
| --- | ---: |
| K89 | 25.9973 m |
| K114 | 30.2293 m |
| K63 | 44.1158 m |
| K38 | 37.1303 m |

Existing `terrainOffsets` preserve the Cityscape mesh and apply world positions once. Each tower/inrun assembly shifts rigidly to its measured take-off level; tower height, start-head contact and sourced inrun dimensions remain intact. Lower shafts, hut legs, piers, trestle legs and take-off tables terminate 1 m beneath independently sampled local grade. World far extends them beneath the lower of the near and regional TINs. Both World LODs conceal the authored grass beneath the lower of both surveyed TINs with a 3 m burial allowance. The native DEM hillside therefore renders at every distance, with the same uncoloured appearance as surrounding app terrain. Tiny 2 × 2 m rings centred on terrain nodes still trim only **15 cm**, with 1 m feathering and a full cell halo; no terrain trim changed for the LOD correction.

Cityscape geometry is unchanged: every triangle position, normal, material and winding matches the previous near/far exports exactly, after accounting for vertex reordering. Its rounded photo-estimated hill and 35 m relief remain the flat-mode appearance. World → Cityscape and repeated mode changes restore original coordinates bit for bit.

At regional distances the z12 lattice differs from the near surface by up to 2.54 m. A green skin fitted to one can cross the other. The earlier fix concealed grass only in World far, making the whole green hillside disappear at the near/far switch. Following the lead decision, **both World near and far conceal the authored grass below both TINs and use the native DEM hillside**. Cityscape near and far keep their original green hill exactly. The World grass offset policy is now independent of the selected model LOD; supports retain their existing near/regional ground contacts.

## Measured residuals

Triangle vertices and barycentric interior points were compared to the padded height field: 63,930 near and 29,235 far samples. Negative residual means concealed grass below terrain; the visible World hillside is native terrain in both LODs. Measurements include the live median datum and exported offset rounding to 1 mm.

| Surface comparison | Near min / max / RMS | Far min / max / RMS |
| --- | --- | --- |
| Grass minus displayed padded z13 TIN | −4.940 / −2.769 / 3.480 m (concealed) | −5.136 / −2.748 / 3.487 m (concealed) |
| Grass minus original z13 TIN | −5.089 / −2.918 / 3.628 m (concealed) | −5.286 / −2.897 / 3.634 m (concealed) |
| Grass minus raw z15 DEM | −5.376 / −2.229 / 3.519 m (concealed) | −5.370 / −2.249 / 3.527 m (concealed) |
| Grass minus regional z12 TIN | −4.970 / −2.898 / 3.156 m (concealed) | −4.945 / −2.853 / 3.163 m (concealed) |

Near footing vertices are −0.850 to −0.793 m below displayed near terrain; far footings are −2.437 to −0.850 m below near terrain and −1.652 to −1.000 m below regional terrain. Negative values show buried members, not gaps. The visible native hillside has zero authored surface residual in both World LODs. Near footing vertices against the regional fallback alone can reach +0.587 m; near acceptance uses the resident z13 TIN, while far feet are buried beneath both surfaces.

A 3 m survey across the pad envelope measured terrain change −0.1494 to 0 m. The buried grass provides depth separation while the native terrain remains continuous across the site. The z15 disagreement is reported rather than used to excavate the displayed z13 surface. Evidence: `tmp/top-cities/canada-olympic-park/residuals.json` and `measure.mjs`.

## Frame, structure and ownership

Origin `[-114.2128861, 51.0767341]`, real metres, +x east/+y up/+z south, rotation already exported. The downhill bearings are K114 8.8°, K89 13.3°, K63 4.6°, K38 1.6°. Olympic take-offs are at local (15.8, −101.8) and (−0.1, −130.0).

Provider replacement owns exact OSM ways 272201820, 272201821, 272201822, 272201825 and 272201828: the K89 start house and four mapped inruns. Their original rings remain in `FOOTPRINTS`; coarse mapped outlines serve replacement ownership, while placement retains the earlier imagery measurements.

The 58 m concrete tower carries a cantilevered, tapered head, glazed bands, Olympic rings and antenna. Deep grey inrun troughs with dark steel soffits descend on sourced profiles. The normal hill and training jumps retain towers, supports and open spans in far. Near adds stairs, bracing, rings and mast lattice; far retains glazed bands and service divisions in five material batches.

| Sourced dimension | Reference |
| --- | --- |
| K114 tower 58 m, J.H. Cook, 1986 | [Heritage Calgary](https://www.heritagecalgary.ca/heritage-calgary-blog/inventory1000) |
| K114 inrun 111 m at 35°, take-off 7 m at 11°, table height 4 m | [Hill data](https://www.skisprungschanzen.com/EN/Ski+Jumps/CAN-Canada/AB-Alberta/Calgary/0101-Canada+Olympic+Park/) |
| K89 inrun 88.2 m at 35°, take-off 6.2 m at 10°, table height 3.2 m | Same hill data |
| Cast-in-place concrete towers and steel inruns | [CANA](https://cana.ca/project-details/Canada-Olympic-Park-Ski-Jump-Structures) |
| Relative ground heights | [Terrain Tiles on AWS](https://registry.opendata.aws/terrain-tiles/), accessed 2026-10-12 |

Tower plans, head massing, windows, supports, transition radii and training-hill profiles are photographic estimates. Comparison photographs and authors/licences remain in catalog provenance; no photo, texture, scan or third-party mesh is shipped. K20/K10 hills, judges’ towers, floodlights, zipline and nearby service buildings are omitted.

DEM tiles: z13 `1496/2739`, `1497/2739`; z15 `5987/10958`, `5987/10959`, `5988/10958`, `5988/10959`. Canada terrain data contains information licensed under the Open Government Licence – Canada. See [Tilezen attribution](https://github.com/tilezen/joerd/blob/master/docs/attribution.md). Mapped outlines © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright).

## Verification and costs

Final evidence in `tmp/top-cities/canada-olympic-park/app-r3/`: near bearings 0/90/180/270 at zoom 16.7, pitch 58, resident near TIN; regional far bearings 90/180 at zoom 15.2; transition pair at 399.998/519.998 m and zoom 16.7; Cityscape near bearing 90. Near enters within 350 m at zoom ≥16.5 and retains below 500 m. Both transition frames show native terrain colour, with no green skin, pit, perimeter cliffs, terrain piercing the landing or visibly floating footing. Fresh local renderer stamp `0acd6c587fd7`; exported near GLB contact sheet in `sheet-r3/`. Earlier `app/` and `app-r2/` remain diagnostic history rather than acceptance of the final LOD correction. Near/far bearing 180 frames had eight peripheral downloads outstanding and the far transition frame had four; the landmark loaded and the correct terrain was active in every frame. Other final World frames settled to zero downloads; Cityscape had two peripheral downloads outstanding.

| LOD | Before triangles / draws / KiB | After triangles / draws / KiB |
| --- | --- | --- |
| Near | 8,370 / 11 / 320.0 | 8,370 / 11 / 320.3 |
| Far | 3,135 / 5 / 115.0 | 3,135 / 5 / 115.0 |

The 364-byte near increase stores the revised reversible grass offsets; topology and draw counts are unchanged. Both LODs remain within the 60k/14/2.5 MB and 12k/8/500 KB budgets. Landmark tests verify measured residuals, footing contact, preserved profiles and exact mode restoration. All 483 focused landmark/top-cities tests, catalog/preview and depth checks pass, with no depth cycles.

Static local captures do not certify vehicle/road continuity, car hardware, night appearance, exaggerated terrain, terrain absent/late, origin changes or lifecycle beyond tested mode reversibility. A finer/different production DEM requires another survey. Shading normals remain those of Cityscape to preserve its appearance; world uses the shared approximate vertex shading path.
