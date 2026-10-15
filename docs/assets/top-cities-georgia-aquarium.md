# Georgia Aquarium, Atlanta

Original procedural building, authored 2026-10-15. The model represents the 2005 TVS ship-and-wave identity with the current mapped tank-hall envelope. Recognition features are the raked curved glass bow and lantern top, silver hull, short mast, fish-G badge, the curved column-supported entrance canopy and low largely windowless halls. Later interiors are not modeled.

## Sources and rights

- [TVS project](https://www.tvsdesign.com/projects/project-detail/georgia-aquarium/): completion 2005, 550,000 sf and a water/vessel architectural composition.
- [ALUCOBOND project](https://www.alucobondusa.com/blog/georgia-aquarium/): November 23, 2005 opening, platinum mica, silver metallic and custom blue cladding; ship hull emerges from wave roofs into entrance plaza/canopy.
- Supplied dossier `tmp/top-cities/georgia-aquarium/osm.json`: [aquarium way 28912103](https://www.openstreetmap.org/way/28912103), [roof part 1359126494](https://www.openstreetmap.org/way/1359126494), and [attached west service bay 1303916364](https://www.openstreetmap.org/way/1303916364). All three are owned; nearby café, public toilets, kiosk, parking and hotel are excluded. © OpenStreetMap contributors, ODbL 1.0.
- Dossier reference sheet and singles viewed before modeling: Diliff, *Georgia Aquarium Jan 2006*, [CC BY 2.5](https://commons.wikimedia.org/wiki/File:Georgia_Aquarium_Jan_2006.jpg), licence checked; Chanilim714, *Atlanta Aquarium GA USA - panoramio*, CC BY-SA 3.0 per supplied attribution (page unavailable in this run).
- Two additional TVS exterior photographs, `refs/3-tvs.jpg` and `refs/4-tvs.jpg`, retrieved from the architect project page for the raked bow, hull cladding, mullions and canopy detail. Photographer/licence unstated; treated as all rights reserved, local visual references only. No image, texture, external mesh or traced surface ships.

The Kilden Performing Arts Centre source/doc was studied for merged procedural surfaces and retained far silhouette, without copying geometry.

## Dimensions and frame

| Feature | Value | Basis |
| --- | --- | --- |
| Current envelope | about 184 m east–west × 213 m north–south | OSM geometry |
| Original covered floor area | 550,000 sf | TVS, not a footprint area |
| Bow top | 31 m at prow, falling to 20 m aft | photo estimate |
| Mast top | about 37 m | photo estimate |
| Halls | about 16–25 m | photo estimate; OSM has five levels and no height |
| Canopy top / soffit | 8.6 / 8.05 m | photo estimate |
| Frame origin | [-84.39472, 33.76278] | supplied dossier anchor near entrance |
| Frontage | southeast, 135° | mapped envelope and photo interpretation |

Two mapped controls on the eastern hall are [-84.3942317,33.7629506] and [-84.3942332,33.7638411], 99.1 m apart with bearing 359.92°. Geometry is already oriented east/up/south; no host rotation is needed. The entrance roof follows its own mapped curved ring. Local y=0 is flat grade; no terrain altitude or Mercator scale is baked in. The bounded median terrain pad uses owned rings and three distributed reference samples; its actual DEM fit remains untested.

## Review corrections (g10a)

The entrance canopy is a 5.5 m wide, 0.55 m deep arc band following the mapped outer roof edge, rather than a filled half-disc. Fourteen slim columns meet its named soffit at y=8.05 m; the plaza is open inside the arc. Red geometry lettering stands on the outer edge. Near has 84 arc segments and far 42, with the same opening and supports.

The tank halls have three pronounced silver roof swells, approximately 4.5 m amplitude (16–25 m), running toward the bow. Their perimeter walls are subdivided to meet the exact sampled roof edges. Near adds standing-seam ribs following the swells; far drops the ribs but keeps all three wave profiles. Blue panel bands and narrow silver horizontal seams partition the north/east/rear elevations in both LODs. A silver roof skin spans from the aft port hull to the hall boundary, closing the deep notch without placing a blank wall in front of the glass entrance. The raked glass bow, opaque separate pane grid, fish-G badge, lantern and supported mast are retained.

Roof profiles, hall subdivisions, hull curvature and signage remain photographic approximations. No interiors, exhibits, external meshes or textures ship. Provider ownership remains ways 28912103, 1359126494 and 1303916364; the revisions stay within those mapped rings. The roof band uses the mapped outer arc, approximately 90 m long, rather than extending the canopy outside its provider envelope to force a nominal 120 m length.

## Export verification and costs

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 33,415 | 7 | 1,886,988 | 1842.8 |
| far | 7,348 | 7 | 401,452 | 392.0 |

Both LODs meet the building budgets. `qa-metrics.mjs` reports no issues: no layered faces, no coplanar different-material pairs, no unsupported member candidates, grade zero, and zero outside-in backface hits. Depth generation/check passes with zero cycle edges dropped. Focused tests cover source/export parity, dimensions, footprint containment, near/far silhouette and named support contacts with negative controls. The aquarium additionally pins canopy voids and roof swells.

Final exported near/far GLB sheets, reference comparisons and app evidence are under `tmp/next-200/fix/g10a/georgia-aquarium/` (replace ID with this asset id). The GLB sheets include overview, opposite facade, roof, entrance and crown/bow detail. Two look-fix iterations were used. Focused tests: 18/18 pass across these two models. Registry conformance: all six checks for these assets pass; complete top-cities invocation reports 816/819, with three unrelated in-progress `los-angeles-union-station` failures. Catalog validation and local preview generation passed at the 406-entry / 766-variant checkpoint; later catalog retries can encounter that sibling’s missing documentation. See the batch `REPORT.md` for commands, evidence paths and app verification limits.

## Placement status

Cityscape: **verified for static photographed appearance**. Full 3D world: **verified for static photographed appearance**. App evidence is captured separately from a scratch `/tmp` bundle on slot M (3318/3320); no shared app bundle is rebuilt. These screenshots establish static appearance for the photographed views only; terrain arrival/eviction, pad residuals, failed loading, origin shifts, disposal and real-device performance are not certified by this fix pass. Independent re-review remains required. No deployment or git write operation is performed.
