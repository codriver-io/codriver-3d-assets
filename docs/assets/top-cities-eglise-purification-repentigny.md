# Église de la Purification

Historic Repentigny stone church with twin silver open belfries, needle roofs, round-headed windows and a steep gabled nave and rear sacristy.

## Identity and sources

Current exterior at Repentigny, Canada; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://fr.wikipedia.org/wiki/Église_de_la_Purification-de-la-Bienheureuse-Vierge-Marie)
- [Mapped replacement footprint 375854628](https://www.openstreetmap.org/way/375854628)
- [Québec heritage inventory](https://www.patrimoine-culturel.gouv.qc.ca/detail.do?id=92549&methode=consulter&type=bien)
- [Municipal history: the church](https://patrimoine.repentigny.ca/la-vie-au-quotidien/les-eglises/)
- [Fichier:Église de la Purification-de-la-Bienheureuse-Vierge-Marie 02.jpg · Fralambert · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:%C3%89glise_de_la_Purification-de-la-Bienheureuse-Vierge-Marie_02.jpg)
- [File:Église de la Purification-de-la-Bienheureuse-Vierge-Marie 01.jpg · Fralambert · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:%C3%89glise_de_la_Purification-de-la-Bienheureuse-Vierge-Marie_01.jpg)
- [File:Église de la Purification-de-la-Bienheureuse-Vierge-Marie 03.jpg · Fralambert · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:%C3%89glise_de_la_Purification-de-la-Bienheureuse-Vierge-Marie_03.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -73.44705325,45.7392156. Replacement OSM ways: 375854628. The exact mapped polygon is retained in footprint.js.

| Dimension | Metres | Basis |
| --- | --- | --- |
| Mapped main facade width | approx 24.7 | OSM way |
| Twin highest crosses | 32 | Exterior photo estimate |
| Tower stone / open belfry eave | 19 / 23.8 | Photo estimates |
| Nave eave / ridge | 9.4 / 17.9 | Photo estimates |

Mapped orientation controls are LOCAL_RINGS[0][0] [-73.4470311,45.7390534] and LOCAL_RINGS[0][1] [-73.4468536,45.7392154]. The working-frame angle is atan2(Δsouth, Δeast); its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

2020 Fralambert front, oblique and rear exteriors show the same current stone body, two open silver belfries and lower sacristy. Notre-Dame de Paris, an interior, a municipal water plant and a 1971 archival photograph returned by search were rejected. Heights, lantern diameters, roof slopes and fenestration are photo estimates. No paving or terrain is authored. The open lanterns remain genuinely open in far detail. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 1019 triangles / 7 draws / 27520 bytes; far: 859 triangles / 7 draws / 25548 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/eglise-purification-repentigny.jpg and tmp/east/eglise-purification-repentigny/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

Visual correction: moved the nave gable behind the front stone screen so its roof end no longer shares the facade plane. The first contact sheet exposed a triangular depth conflict that the metric heuristic missed; the corrected export was re-rendered. The belfry openings and contacts are tested in both LODs.

Geographic audit: the wide nave roof stops at its mapped shoulder; two smaller rear roofs follow the stepped apse/sacristy footprint. The twin open belfries and heights are unchanged. Near/far component containment now has explicit regression tests at the provider’s0.8m slack plus5cm rounding tolerance.

## Independent review follow-up

Nit: modestly darkened the stone to #8d8e82 and emphasized the lower and upper belfry cornices with pale trim instead of the silver roof material. Both open belfries and their support contacts are retained.

Re-exported both LODs; identity and regression tests, focused registry conformance, deterministic QA and depth check passed. New evidence: tmp/fixes/sheets/eglise-purification-repentigny.jpg. Independent re-review pending. Cityscape: not tested. Full 3D world: not tested.
