# Muttart Conservatory — Edmonton

Original procedural model of Peter Hemingway’s four glass exhibition pyramids at 9626 96A Street NW, with the central foyer skylight, linked service base and a recessed southwest entrance. No third-party mesh, image or texture ships. Source: `src/peregrine/landmarks/top-cities/muttart-conservatory/`; exports: `public/models/buildings/muttart-conservatory-{near,far}.glb` and `muttart-conservatory.json`. Rebuild with `pnpm build:top-cities-landmarks muttart-conservatory --no-check`.

## Sources and frame

The supplied dossier’s `osm.json`, `osm.txt`, `facts.txt` and `refs-sheet.jpg` were the starting point. The missing main outer was obtained once using the shared Overpass helper and retained at `tmp/top-cities/muttart-conservatory/main-outline.json`.

- [OSM relation 17644228](https://www.openstreetmap.org/relation/17644228), main exhibition-complex outer [way 1287216689](https://www.openstreetmap.org/way/1287216689), and building parts 714340898, 714340899, 714340900, 714340901, 714340902 and 714340904 establish plan and tagged heights. The detached western production greenhouse and other relation members are outside ownership.
- [Wikipedia](https://en.wikipedia.org/wiki/Muttart_Conservatory), supplied dossier: Peter Hemingway, four display pyramids and a fifth foyer skylight; [City of Edmonton](https://www.edmonton.ca/attractions_events/muttart-conservatory) is the operator reference (its page returned 502 during verification).
- Reference photographs: [Muttart Conservatory Edmonton Alberta Canada 01](https://commons.wikimedia.org/wiki/File:Muttart_Conservatory_Edmonton_Alberta_Canada_01.jpg), [Muttart Conservatories Edmonton Alberta Canada 11A](https://commons.wikimedia.org/wiki/File:Muttart_Conservatories_Edmonton_Alberta_Canada_11A.jpg), [01A](https://commons.wikimedia.org/wiki/File:Muttart_Conservatories_Edmonton_Alberta_Canada_01A.jpg), WinterE229/WinterforceMedia, public domain, listed in the supplied `refs/SOURCES.txt`. The 01A licence was additionally checked on Commons. These are reference-only, retained in ignored `tmp/`.
- [Pearson educational dimension reference](https://www.pearson.com/en-au/schools/media/h0qn3d4u/wonderful-building-9780655701392.pdf) reports nominal 26 m and 19.5 m bases. Glass now follows these published dimensions; concrete perimeter curbs retain the complete larger OSM provider envelope.

Origin: `[-113.47729, 53.53521]`; +X east, +Y up, +Z south; local foundation y=0. Tropical’s NE edge from `[-113.4772802,53.5357114]` to `[-113.4769769,53.5355280]` establishes bearing approximately 135.4°. All mapped vertices are converted directly to the local metric frame; rotation is already exported and must not be applied again.

## Dimensions and review g8b geometry

| Element | Model | Basis |
| --- | --- | --- |
| Large pyramid bases | 26 m | published nominal glass dimensions |
| Small pyramid bases | 19.5 m | published nominal glass dimensions |
| Large / small peaks | 24 / 18 m | OSM height tags |
| Foyer skylight | 4 m | OSM height tag |
| Perimeter plinth | 0.8 m high; about 1.4–1.6 m wide | mapped outer minus published glass base |
| Grass berm | edges 0.8 m, central roof 1.75 m | photo approximation |
| Entrance roof | 2.8 m | photo approximation |

The four pyramids retain their mapped north/south large and east/west small arrangement and baked orientation. Scaling only the glass bases makes their faces steeper while preserving all peaks and the complete provider ownership. The mapped outer becomes the concrete perimeter curb.

Pale silver-blue panes and near-white aluminium frames replace the opaque teal/dark-frame tile appearance. Two close glass tones vary subtly across panes. Diagonal frame half-widths are 23 mm near / 28 mm far, with stronger 60/70 mm horizontal courses; the face is tessellated edge to edge, without stacked glass/frame overlays. Vent bands use pale metal matching the framing. The low central link has sloping grass berm edges, a southwest entrance cut, a prominent foyer skylight and a broad glazed opening between concrete jambs under a grass roof.

The shared app material converter discards GLB alpha and PBR properties. Interior botany, the surrounding landscape, detailed HVAC, lettering and detached western production greenhouses are omitted. Berm, entrance and grid dimensions remain photographic approximations.

## Export and app verification

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 23,417 | 6 | 889,052 | 868.2 |
| far | 6,105 | 6 | 243,724 | 238.0 |

Rebuild with `pnpm build:top-cities-landmarks muttart-conservatory --no-check`; regenerate/check depth layers after export. Both LODs remain within the 60k/12k triangle, 14/8 draw and 2.5MB/500KB building caps. Depth generation/check reports zero material cycles. The dedicated geometry tests pass, including observable dimensions, openings, footprint containment, silhouette and existing support-contact checks where applicable. The full requested top-cities conformance run has 807 passes and three unrelated failures: Palais de Chaillot material budget, Palais Bourbon footprint and missing export. Both g8b landmarks pass their own conformance cases. Catalog validation passed with 406 records and 748 variants during this run.

Final evidence lives in `tmp/next-200/fix/g8b/muttart-conservatory/`: `reference-comparison.jpg` places exported near/far sheets beside the dossier photographs; `sheets/final/` has the final near sheet, and far sheet paths are included in the fix report. `app/city/` and `app/world/` contain final far, near and street screenshots plus reports identifying active/loaded LODs. Servers are terminated by their recorded PIDs.

Cityscape: **appearance verified** in the final app captures. Full 3D world: **appearance verified** with terrain enabled in the corresponding captures. Visible footing and provider replacement are inspected; full lifecycle, failed-load, terrain-arrival and origin-shift regression and actual device performance remain **not tested**. These appearance checks require independent re-review before approval.
