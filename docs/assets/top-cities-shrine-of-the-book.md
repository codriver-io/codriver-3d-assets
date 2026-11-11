# Shrine of the Book — Jerusalem

Shrine of the Book’s white scroll-jar roof with a real open oculus, a shallow surrounding pool and the contrasting black basalt wall.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Shrine_of_the_Book)
- [Mapped way/158934535; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/158934535)
- [Mapped way/136009915; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/136009915)
- [File:Billy Rose Art Garden (14755133799).jpg | Edmund Gall | CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:Billy_Rose_Art_Garden_(14755133799).jpg)
- [File:Shrine of the Book 2.jpg | deror_avi | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Shrine_of_the_Book_2.jpg)
- [Israel Museum: Shrine of the Book](https://www.imj.org.il/en/wings/shrine-book)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/shrine-of-the-book/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Dome base diameter | 21.6 | OSM 158934535 |
| Dome crown / open oculus diameter | 8.0 / 2.1 | Photo estimates |
| Basalt wall | 14 × 1.5 × 8.5 high | Photo estimate |
| Pool radius / water elevation | 12.8 / 0.18 | Estimates; water >0.10 m over grade |

No surveyed height was found. Roof profile, oculus and basalt-wall dimensions are photo estimates. The basalt wall’s position is estimated at the eastern side of the mapped museum courtyard, with its bearing constrained by two controls on that site edge; it needs app-stage placement review. The dome uses its own exact mapped circle. Interior exhibits, inscriptions, sculptures, fountains jets and the descending public entrance are excluded.

## Frame and ownership

Origin `[35.20291115, 31.7734426]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[35.2031964, 31.7736204], [35.2032002, 31.7732806]]`; rotationY `0.009506835526718587` radians. Exact provider ways: `[158934535]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. The dome owns provider way 158934535 only. Way 136009915 is a site-alignment source, not a building replacement. The estimated basalt wall has its own small authored ring; the pool is ground decoration outside the dome building mask. No adjoining museum wing is replaced.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

A concave bell/scroll-jar profile has a narrow open neck, inward-facing return and dark recessed floor, preserving the oculus rather than sealing it with a cap. Pool water is an annulus at y=0.18, adjoining its raised stone rim without a coplanar floor. The simple basalt slab stands at grade. Near and far both retain the oculus and wall at a few thousand triangles or less. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 1336 | 5 | 29152 |
| far | 892 | 5 | 22844 |

Deterministic QA: no flags (`tmp/central-east/shrine-of-the-book/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/shrine-of-the-book.jpg`; source top over red OSM rings: `tmp/central-east/shots/shrine-of-the-book/`. One look-fix round added a short vertical neck below the open oculus, matching the scroll-jar profile rather than a generic cone. Exterior near/far, roof opening, dark wall, water/rim contact and far/dark were inspected. Water is at y=0.18, and its annulus avoids a hidden overlapping floor. Wall position remains an explicitly estimated app-stage placement item.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.

## Independent-review follow-up — 2026-11-10

Normals are averaged only across coincident curved lamp-shell vertices, retaining the flat oculus lip, recessed interior and raised water/coping. No triangles or dimensions are added. The new near/far sheet shows smoother jar-lid shading with its true oculus and separate basalt wall retained.

One new exported contact sheet: `tmp/followup/sheets/shrine-of-the-book.jpg`. Updated source/export identity tests, deterministic metrics and depth check pass; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.
