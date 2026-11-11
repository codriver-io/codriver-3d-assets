# Siegestor — Munich

Siegestor with three open barrel-vaulted passages, eight classical facade columns, a tall attic, four stone figures and Bavaria’s four-lion quadriga on the crown.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Siegestor)
- [Mapped way/22727580; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/22727580)
- [File:Siegestor Muenchen January 2013.JPG | Hendrik Schöttle | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Siegestor_Muenchen_January_2013.JPG)
- [File:München Siegestor.JPG | Schlaier | CC BY 3.0](https://commons.wikimedia.org/wiki/File:M%C3%BCnchen_Siegestor.JPG)
- [Munich city: gate identity and Bavaria/lion quadriga](https://www.muenchen.de/en/sights/siegestor)
- [Official Munich tourism: current restored quadriga](https://www.munich.travel/en/pois/urban-districts/siegestor)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/siegestor-munich/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Masonry height | 21 | Common published/OSM figure, interpreted as gate body |
| Highest sculpture | 26 | Estimate: roughly 5 m above masonry from exterior proportions |
| Mapped core plan | 23.5 × 10.1 | OSM 22727580 |
| Outer cornice/column envelope | 24 × 12.2 | Published rounded 24 × 12 m plus estimated capital projection |
| Main / side opening heights | 12.5 / 7.15 | Photo estimates |

The often-quoted 21 m height is not explicit about the quadriga; it is treated here as the masonry body, with 26 m total an estimated sculpture-inclusive height. This interpretation and the crown proportions need independent dimensional review. Arch radii, column capitals and sculpture poses are original low-detail estimates. Modern north/south facade differences are simplified; inscriptions, lettering and narrative relief panels are omitted.

## Frame and ownership

Origin `[11.5821402, 48.15235035]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[11.5820113, 48.1524268], [11.5819684, 48.1523404]]`; rotationY `-1.8906793652932214` radians. Exact provider ways: `[22727580]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. Mapped core 22727580 is retained, with a small authored outer envelope covering the projecting columns/cornices. The published 24 × 12 m envelope is wider than OSM’s masonry core. No nearby street or building is owned.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

A single concave extruded wall contour makes three true through-openings with curved soffits. Projecting columns contact pedestals and capitals; the entablature supports an attic and the sculpture plinth. Four individual lions have bodies, manes, muzzles and planted paws, and Bavaria/stone figures have draped torsos, heads and bent arms rather than sticks. Far keeps every arch, lion and the crown silhouette. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3076 | 2 | 36904 |
| far | 1556 | 2 | 23808 |

Deterministic QA: no flags (`tmp/central-east/siegestor-munich/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/siegestor-munich.jpg`; source top over red OSM rings: `tmp/central-east/shots/siegestor-munich/`. One visual refinement added the paired circular attic wreaths; arches and all four lions remain open and recognizable in far LOD.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.

## Independent-review follow-up — 2026-11-10

Lower ellipsoid, limb, arch, wreath and column segmentation removes disproportionate detail; tiny elbow/hand joint balls are omitted while all draped torsos, bent arms, heads, lion bodies, manes, muzzles, legs and paws remain. Sampling compensation keeps the original sculpture extents. Three through-passages and curved soffits, four separate lions, standing Bavaria and 26 m total height survive both LODs. Tests enforce the 5000/2000 total caps and 2000 near bronze cap; the new sheet confirms the same principal silhouette.

One new exported contact sheet: `tmp/followup/sheets/siegestor-munich.jpg`. Updated source/export identity tests, deterministic metrics and depth check pass; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.
