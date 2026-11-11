# Parus Business Centre — Kyiv

Parus’s pointed lens-shaped blue curtain wall rises above its broad five-storey podium, beside a pale rear service spine; a recessed mechanical crown and slender antenna complete the sail silhouette.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Parus_Business_Centre)
- [Mapped way/23648473; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/23648473)
- [File:БЦ Парус Київ вид внизу бульвару Лесі Українки.JPG | uk:User:Turzh | Custom Attribution (author credit required); English Wikipedia FoP-US-only architecture notice; comparison only](https://en.wikipedia.org/wiki/File:%D0%91%D0%A6_%D0%9F%D0%B0%D1%80%D1%83%D1%81_%D0%9A%D0%B8%D1%97%D0%B2_%D0%B2%D0%B8%D0%B4_%D0%B2%D0%BD%D0%B8%D0%B7%D1%83_%D0%B1%D1%83%D0%BB%D1%8C%D0%B2%D0%B0%D1%80%D1%83_%D0%9B%D0%B5%D1%81%D1%96_%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%BA%D0%B8.JPG)
- [File:БЦ Парус Київ.JPG | uk:User:Turzh | Custom Attribution (author credit required); English Wikipedia FoP-US-only architecture notice; comparison only](https://en.wikipedia.org/wiki/File:%D0%91%D0%A6_%D0%9F%D0%B0%D1%80%D1%83%D1%81_%D0%9A%D0%B8%D1%97%D0%B2.JPG)
- [File:БЦ Парус Київ вид з вулиці Мечникова.JPG | uk:User:Turzh | Custom Attribution (author credit required); English Wikipedia FoP-US-only architecture notice; comparison only](https://en.wikipedia.org/wiki/File:%D0%91%D0%A6_%D0%9F%D0%B0%D1%80%D1%83%D1%81_%D0%9A%D0%B8%D1%97%D0%B2_%D0%B2%D0%B8%D0%B4_%D0%B7_%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%96_%D0%9C%D0%B5%D1%87%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%D0%B0.JPG)
- [Main contractor Osnova: 136 m building, 156 m including antenna](https://osnova-group.com.ua/en/projects/commercial-property/parus)
- [Facade contractor EVB: 136 m and curtain-wall specification](https://evb.ua/en/2021/11/04/70/)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/parus-business-centre/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Architectural roof / antenna tip | 136 / 156 | Main contractor Osnova; facade contractor also gives 136 |
| Glass shaft top | 133.1 | OSM part 300328722 |
| Main lens plan | 73.3 × 33.4 | Mapped part 300328722 |
| Podium / service-spine head | 22 / 143 | Mapped min_height / estimated sloping cap |
| Floor pitch | 3.9 | Published Ukrainian specification; visual approximation |

Heights disagree: the main contractor gives 136 m and 156 m with antenna, whereas OSM/older operator-derived summaries give 133.1 m glass roof, 138 m crown and 149.6 m tip, and the outline itself is tagged 130 m. This model retains the mapped 133.1 m glazing and 137 m service-spine figure, places the inset mechanical roof at the contractor’s 136 m, and uses its 156 m tip. These mixed measurement definitions and the service-spine cap need independent dimensional review. Podium height 22 m follows the mapped tower min_height; window cadence and colors are original visual approximations. Neighboring Gulliver parts 153776632/300347479 are about 300 m away and are not owned. Billboards, lettering and trademarks are omitted. The pointed service-spine head rises from 136 to approximately 143 m, an original photo-based estimate above the mapped 137 m prism; it should be reviewed separately from the published main roof measurement.

## Frame and ownership

Origin `[30.527385250000002, 50.4375536]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[30.5269489, 50.4379362], [30.5280673, 50.4375185]]`; rotationY `-0.5303486916589644` radians. Exact provider ways: `[23648473, 300328720, 300328721, 300328722, 300328723]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. Only mapped parent 23648473 and contained parts 300328720–300328723 are replaced. No neighboring high-rise, street or detached feature is owned.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

The exact mapped pointed-lens plan is retained in both LODs, with adjoining floor bands, mullions and restrained glass variation. The service spine has a curved pale enclosure and narrow stacked glazing. Roof surfaces have holes for the core/crown so there are no overlaid caps. The antenna is a tapered, grounded-on-crown assembly rather than a floating pole. Far keeps both pointed ends, spine, mechanical slots and complete tip. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 17355 | 8 | 205820 |
| far | 6487 | 8 | 85036 |

Deterministic QA: no flags (`tmp/central-east/parus-business-centre/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/parus-business-centre.jpg`; source top over red OSM rings: `tmp/central-east/shots/parus-business-centre/`. One visual refinement restored a sloping, pointed cap on the pale service spine and muted the pane-color variation. Both pointed lens ends, roof-supported antenna, mechanical slots and low podium were inspected in both LODs; mixed published roof/tip definitions and the estimated spine head remain explicit review items.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.

Final cap audit: closed clipping rings are normalized before triangulation indices are flattened, keeping tower, atrium and shaft holes correct. Near/far source-export identity and opening probes pass; refreshed deterministic QA has no flags or depth cycles.
