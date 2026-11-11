# Tagblatt-Turm — Stuttgart

The 61 m Tagblatt-Turm: narrow early-modern concrete tower, an irregular stepped plan, paired horizontal window rows, a continuous blank service strip and setback roof block.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Tagblatt-Turm)
- [Mapped way/108689300; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/108689300)
- [File:Tagblatt-Turm Stuttgart.JPG | MSeses | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Tagblatt-Turm_Stuttgart.JPG)
- [File:Stuttgart - Tagblatt-Turm (1).jpg | Fred Romero from Paris, France | CC BY 2.0](https://commons.wikimedia.org/wiki/File:Stuttgart_-_Tagblatt-Turm_(1).jpg)
- [File:Tagblatt-Turm in Stuttgart.jpg | BohunkaNika | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Tagblatt-Turm_in_Stuttgart.jpg)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/tagblatt-turm-stuttgart/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Roof | 61 | Published and OSM |
| Storeys | 16 | Published |
| Plan | approximately 18 × 15 | Mapped OSM 108689300 |
| Window and roof-block levels | See generator | Photo estimates |

Facade bay pitch, service-strip width and four-metre roof setback are photo estimates. Only the tower outline is owned; adjoining lower theater/office buildings remain separate.

## Frame and ownership

Origin `[9.1762511, 48.7728759]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[9.1762642, 48.7729694], [9.176136, 48.7728402]]`; rotationY `-2.1499395641745607` radians. Exact provider ways: `[108689300]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. No neighboring buildings or roads are owned.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

The irregular mapped plan supplies the two offset facade wings. Concrete piers and separate panes flank a plain vertical service zone, with a small roof setback retained in far. Each window is an adjoining surface partition, with no overlay panes. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 4656 | 3 | 57900 |
| far | 3644 | 3 | 46284 |

Deterministic QA: no flags (`tmp/central-east/tagblatt-turm-stuttgart/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/tagblatt-turm-stuttgart.jpg`; source top over red OSM rings: `tmp/central-east/shots/tagblatt-turm-stuttgart/`. One look-fix round widened the plain service strip and retained its small square windows; the roof block uses sparse glazing. The slender stepped silhouette, paired facade windows, mapped reentrant plan, back and roof were inspected in exported near/far and far/dark. No open visual defect observed.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.
