# Hypo-Haus — Munich

HVB Tower’s three pointed suspended prisms are carried by unequal silver cylindrical pylons and their large 40–50 m collar brackets, with a central glazed web and a distinct staggered skyline.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Hypo-Haus)
- [Mapped way/211447642; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/211447642)
- [File:HVB-Tower Munich, June 2017.jpg | Martin Falbisoner | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:HVB-Tower_Munich,_June_2017.jpg)
- [File:HVB-Tower and Mae West, Munich, June 2017 -02.jpg | Martin Falbisoner | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:HVB-Tower_and_Mae_West,_Munich,_June_2017_-02.jpg)
- [City of Munich: rounded 114 m and skyline identity](https://stadt.muenchen.de/infos/umgang-hochhaeuser-stadtgebiet)
- [HVB property owner interview with Oliver Betz: four pylons and suspended pointed floors](https://www.hvbimmobilien.com/de/immobilien/objekte/tower/interview-oliver-betz)
- [CTBUH: 113.7 m architectural height](https://www.skyscrapercenter.com/building/hvb-tower/4886)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/hypo-haus-munich/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Highest pylon | 113.7 | CTBUH; city rounds to 114 |
| Other mapped cylinders | 112 / 110 / 94 / 79 | OSM parts; 110 m service drum adjoins main pylon |
| Three prism tops | 106 / 90 / 70 | Mapped part heights |
| Suspended prism soffits | 17 | Mapped min_height; missing value on tall prism estimated consistently |
| Three collar brackets | 40–50 | Mapped parts 210584882/883/885 |

The highest published 113.7 m replaces rounded OSM 114 m; other part heights follow OSM and are not a new survey. The official description counts four main pylons; the mapped 110 m small adjoining service drum is retained as an auxiliary part, not a fifth independent main pylon. The tall prism lacks min_height in OSM; its 17 m soffit is estimated consistently with the other suspended prisms and exterior photographs. Circular centres/radii are fitted to mapped rings. Fine aluminium seams, facade cadence and central-web glazing are simplified. The modernized tower is the scope; lower surrounding campus, landscaping and signage are excluded. The June 2008 photo initially returned by the article dossier was excluded from current facade evidence; both retained exterior references are from June 2017, after the tower renovation.

## Frame and ownership

Origin `[11.61725865, 48.14978395]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[11.6170745, 48.1499229], [11.6168574, 48.1497889]]`; rotationY `-2.395070874550129` radians. Exact provider ways: `[135350828, 135353405, 135353407, 196660573, 196660574, 196660575, 196660576, 210584882, 210584883, 210584885, 210584887, 211447642, 211450796]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. Only main high-rise 211447642 and its contained inventoried parts. The lower campus is separately mapped and remains provider. All projected collars and suspended prism corners sit inside the mapped outline.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

Mapped prism, web and collar polygons preserve the angular plan; unequal cylindrical pylons use fitted metric radii with muted vertical seam facets. Suspended floor volumes keep their 17 m underside gaps in far LOD. Collar bottoms are triangulated around shaft holes; shaft contact caps and collars have independent materials so tests cannot hit the load they are checking. Windows are adjoining metal/glass partitions. Both LODs retain every major prism, cylinder and collar wing. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 21071 | 6 | 238168 |
| far | 6375 | 6 | 82828 |

Deterministic QA: no flags (`tmp/central-east/hypo-haus-munich/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/hypo-haus-munich.jpg`; source top over red OSM rings: `tmp/central-east/shots/hypo-haus-munich/`. The unequal pylon tops, suspended pointed prisms, large collar wings, undercroft gaps and silver facade cadence were checked in both LODs and dark views. No geometry look-fix was required; current reference evidence was corrected to the two post-renovation June 2017 exterior photographs.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.

Final cap audit: closed clipping rings are normalized before triangulation indices are flattened, keeping tower, atrium and shaft holes correct. Near/far source-export identity and opening probes pass; refreshed deterministic QA has no flags or depth cycles.
