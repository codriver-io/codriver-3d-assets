# Berlin Fernsehturm — Berlin

Berlin’s Fernsehturm: long tapered concrete needle, a 32 m faceted silver sphere centered at 212 m, twin observation window belts, evacuation collars and a red-white broadcast antenna.

## References and rights

- [Identity and published dimensions (secondary summary)](https://en.wikipedia.org/wiki/Fernsehturm_Berlin)
- [Mapped way/556435241; © OpenStreetMap contributors, ODbL 1.0](https://www.openstreetmap.org/way/556435241)
- [File:Berliner Fernsehturm, Sicht vom Neptunbrunnen - Berlin Mitte.jpg | Christian Wolf (www.c-w-design.de) | CC BY-SA 3.0 de](https://commons.wikimedia.org/wiki/File:Berliner_Fernsehturm,_Sicht_vom_Neptunbrunnen_-_Berlin_Mitte.jpg)
- [File:Fernsehturm, Berlín, Alemania, 2016-04-22, DD 40-42 HDR.jpg | Diego Delso | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Fernsehturm,_Berl%C3%ADn,_Alemania,_2016-04-22,_DD_40-42_HDR.jpg)
- [File:Fernsehturm seen from the Spree August 2024.jpg | Noahidsmith | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Fernsehturm_seen_from_the_Spree_August_2024.jpg)
- [Federal Agency for Civic Education: technical data (sphere center 212 m, diameter 32 m, shaft 16/9 m)](https://www.bpb.de/system/files/dokument_pdf/MuM_10_Berliner%20Fernsehturm.pdf)
- [Operator banquet brochure via official Berlin convention bureau: 368 m, sphere diameter 32 m](https://convention.visitberlin.de/sites/default/files/2021-10/BANKETTMAPPE-2021-BERLINER-FERNSEHTURM_7.pdf)
- [Berlin government heritage walk: 368 m and 32 m spherical head](https://www.berlin.de/ost-west-ost-kulturbahnhoefe/en/history-walk/artikel.1603657.en.php)

Exterior photographs were inspected to confirm this exact structure and state. They are comparison-only under ignored `tmp/central-east/berlin-fernsehturm/refs/`; no image or derived texture is distributed. Original source/docs MIT; original model CC BY 4.0; mapped data ODbL. No licence/contributor acceptance is fabricated.

## Dimensions and approximation

| Feature | Metres | Basis |
| --- | ---: | --- |
| Overall height | 368.03 | Published current article; operator/government round to 368 |
| Sphere diameter / center | 32 / 212 | Federal Agency for Civic Education technical sheet |
| Shaft diameter below / above | 16 / 9 | Same government source |
| Observation / restaurant floors | 203.78 / 207.53 | Published technical summary; operator rounds 203 / 207 |
| Shaft top | 248.78 | Published architecture summary |
| Pedestal flare, collars and glazing subdivisions | See generator | Photo estimates |

The 32 m sphere and 212 m center use the government technical sheet. OSM component heights conflict: the sphere is tagged 205–235 m and an antenna part reaches 374 m; those heights are not used. The current tip is modeled at 368.03 m. Pedestal flare, emergency collars, antenna diameters and cladding/window segmentation are estimates. The adjacent low entrance pavilion and folded roofs are excluded.

## Frame and ownership

Origin `[13.4094213, 52.52081975]`; Rigid local foundation y=0; real metres +X east, +Y up, +Z south. Two mapped controls fix rotation, baked into the geometry once. No terrain or Mercator stretch. Mapped controls `[[13.4092791, 52.5207148], [13.4092515, 52.5207313]]`; rotationY `2.365020444889832` radians. Exact provider ways: `[96880470, 96880477, 230818931, 304987172, 304987173, 304987174, 304987176, 326772329, 397891642, 556435241]`. The footprint rings follow the mapped outer envelopes, with all modeled detached parts explicitly included. No neighboring buildings or roads are owned.

OSM acquired 2026-11-10; source extracts and exact API URLs retained in the ignored dossier. A bounded rigid foundation datum must be chosen by the host; no terrain certification follows from this geometry.

## Modeling and QA

A continuous tapered shaft supports the closed faceted sphere and mast. Two narrow glazing belts interrupt the silver shell as adjoining faces. The sphere is a named lamp material for its photographed floodlit night character. Far keeps the full round head, antenna striping and lower evacuation collars. Both LODs preserve the named features and openings. Windows are adjoining facade partitions rather than coplanar overlays. Muted day/night palettes use the same material keys.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3204 | 5 | 49252 |
| far | 1588 | 5 | 29804 |

Deterministic QA: no flags (`tmp/central-east/berlin-fernsehturm/metrics.json`); depth table generation/check: no cycles. Exported near/far compared against the reference photograph in `tmp/central-east/sheets/berlin-fernsehturm.jpg`; source top over red OSM rings: `tmp/central-east/shots/berlin-fernsehturm/`. Silhouette, named feature, facade rhythm, roof, back and grade contacts inspected; far preserves the structure. No open visual defect observed.

Focused identity/source-export tests, registry conformance for this landmark and assets:check pass. Standalone evidence is authoring evidence only; independent review remains a coordinator stage.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, app-shot, provider replacement, terrain or device-performance verification in this task.
