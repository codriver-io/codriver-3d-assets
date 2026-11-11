# Phare de Verzenay — Verzenay / Épernay

Vineyard lighthouse with a tapered pale octagonal shaft, flared gallery capital, open balcony balustrade, glazed lantern and pointed metal cap above the low curved Musée de la Vigne.

## Sources and rights

- [Identity and documented history](https://fr.wikipedia.org/wiki/Phare_de_Verzenay)
- [Mapped provider footprint / part, ODbL](https://www.openstreetmap.org/way/624474053)
- [2.jpg | Fichier:Le phare de Verzenay, vu de la. D.7.jpg | Espirat | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Le_phare_de_Verzenay,_vu_de_la._D.7.jpg)
- [4.jpg | File:Phare de Verzenay en contre-plongée.jpg | Drouetj92 | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Phare_de_Verzenay_en_contre-plong%C3%A9e.jpg)
- [5.jpg | File:20120429 Phare de Verzenay.jpg | Donarreiskoffer | CC BY 3.0](https://commons.wikimedia.org/wiki/File:20120429_Phare_de_Verzenay.jpg)

Photos are local comparison only, no images or textures ship. Original code/docs MIT, model CC BY 4.0, OSM-derived geography ODbL 1.0. No contributor agreement accepted or invented.

## Frame and dimensions

Origin `[4.1515111,49.158327]`, metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior footing; no hill, terrain or scene elevation is baked in. Rotation `0.16851208726812664` radians is baked once from OSM controls `[4.1512767,49.1583385]` → `[4.151505,49.1583639]`. Host must not rotate again. Exact replacement ownership: 624474053; neighbouring structures excluded.

| Feature | Model | Basis |
| --- | ---: | --- |
| Belvedere platform | 25 m | Operator published elevation, 101 steps |
| Roof and finial | 29.7 m | Photo estimate above the published platform datum |
| Shaft radius base / top | 1.8 / 1.4 m | Photo estimate within mapped tower projection |
| Balcony radius | 2.8 m | Photo estimate; slight upper overhang beyond shaft footprint |
| Museum roof | 4.35 m | Photo estimate, full OSM outline retained |

Current lighthouse and connected museum only; vineyard hill, surrounding terrace, retaining walls, paths and old advertising lettering excluded. Anchor is the horizontal IGN survey-point description Centre du renflement at 4.1515111,49.1583270; its elevation is explicitly ignored. Espirat D7 view and Donarreiskoffer 2012 exterior (actual Commons credit in provenance) establish current shell; low-angle photo establishes gallery and shaft taper. Interior Phare5 and historical lettering postcard rejected. Platform is sourced 25 m; cap, shaft subdivision and museum elevations remain estimates.

## Evidence and limitations

Exported near/far geometry, footprint plan and night view inspected against the verified exterior photographs. One fix round expanded the balcony deck so every balustrade corner bears on it, and included the upper overhang in the replacement union. Verified tapered octagonal shaft, 25 m platform, glass lantern, pointed cap and complete low museum envelope. Both LODs are about 2.2k triangles; far deliberately retains this already small geometry and its real balcony openings. IGN height, hill, retaining walls and historical advertising are excluded.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 2208 | 7 | 52052 |
| far | 2200 | 7 | 51996 |

Deterministic QA: no remaining flags; metrics at `tmp/france-northeast/phare-de-verzenay/metrics.json`. Exported contact sheet: `tmp/france-northeast/sheets/phare-de-verzenay.jpg`. Red footprint top view and exported far/night evidence: `tmp/france-northeast/shots/phare-de-verzenay/`. Focused identity/geometry and registry conformance tests, asset catalog and depth-layer checks pass. Self-review only; independent review remains pending.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot run. Independent review and app placement, terrain pad selection, provider replacement, DEM contacts, lifecycle and hardware verification remain later integration work.

The replacement envelope includes the projected upper balcony overhang, unioned with the mapped museum/tower ring. The 2.8 m octagonal deck supports every balustrade corner; it is independent of terrain.

Frontage metadata: 170.3450° clockwise from north, toward the modelled local +Z principal face. The mapped rotation is already baked; this bearing is descriptive and must not be applied as a second rotation.
