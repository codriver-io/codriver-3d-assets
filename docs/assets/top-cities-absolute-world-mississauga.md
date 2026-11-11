# Absolute World

Mississauga’s two twisting elliptical residential towers, with continuous pale balcony ribbons, darker recessed glazing and the mapped three-storey retail strip.

## Identity and sources

Current exterior at Mississauga, Canada; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Absolute_World)
- [Mapped replacement footprint 55970881](https://www.openstreetmap.org/way/55970881)
- [Mapped replacement footprint 55970894](https://www.openstreetmap.org/way/55970894)
- [Mapped replacement footprint 57827130](https://www.openstreetmap.org/way/57827130)
- [Structural engineer: 209-degree rotation](https://soudack.com/the-pioneers/)
- [CTBUH2012 awards: project heights179.5m and158m](https://www.building.hk/forum/2012_0705ctbuh.pdf)
- [CTBUH case study: varying1–8 degrees per floor](https://global.ctbuh.org/paper/5)
- [Design architect: Absolute Towers](https://en.i-mad.cn/projects/absolute-towers)
- [File:Absolute Towers Mississauga. South-west view.jpg · Sarbjit Bahga · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Absolute_Towers_Mississauga._South-west_view.jpg)
- [File:Absolute Towers - 20191019183705.jpg · Sikander Iqbal · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Absolute_Towers_-_20191019183705.jpg)
- [File:Absolute Towers - 20191019183707.jpg · Sikander Iqbal · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Absolute_Towers_-_20191019183707.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -79.63527778,43.59472222. Replacement OSM ways: 55970881,55970894,57827130. The exact mapped polygon is retained in footprint.js.

| Dimension | Value | Basis |
| --- | --- | --- |
| Taller / shorter tower | 179.5 / 161.2 m | Article including crown; CTBUH gives158m for the shorter tower |
| Storeys | 56 / 50 | CTBUH and article |
| Taller cumulative floor rotation | 209 degrees | Structural engineer and CTBUH case study |
| Shorter cumulative rotation | approx 80 degrees | Photo estimate |
| Taller plate half-axes | 15.1 × 20.7 m | Mapped envelope fit / estimate |
| Shorter plate half-axes | 14.3 × 19.2 m | Mapped envelope fit / estimate |

Mapped orientation controls are LOCAL_RINGS[0][11] [-79.6351052,43.5946586] and LOCAL_RINGS[0][0] [-79.6350866,43.5942848]. The south tower uses these controls; the north tower independently uses LOCAL_RINGS[1][9] [-79.6356593,43.5950831] and [1][21] [-79.6358376,43.5947799]. Twisting floor rotations are added to those mapped initial directions.

## Modelling and limits

Completed twisting towers only; the dossier construction photos were rejected and replaced by 2019 exterior views. Heights disagree: the article gives 161.2 m for the shorter tower, OSM157.9 m, and CTBUH2012 gives158 m; this model uses161.2 m including the open crown; the difference may concern the roof/crown datum, but that explanation is unverified. Taller OSM175.6 m is below published179.5 m. The taller209-degree rotation is sourced; its Gaussian distribution from about1 to8 degrees/floor, the smaller tower’s80-degree total, plate dimensions, podium height and facade setback are estimates calibrated to current photos. Both LODs keep separate balcony and glazing rows. Balcony sweep envelopes are added to the exact mapped footprint rings; adjacent towers are excluded. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 24308 triangles / 6 draws / 342596 bytes; far: 7088 triangles / 6 draws / 111536 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/absolute-world-mississauga.jpg and tmp/east/absolute-world-mississauga/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

Visual correction: the first sheet made both roofs look cut off. Added genuine open crowns, 3.9m and3.3m above the mapped roof elevations175.6m and157.9m, with vertical posts contacting two continuous annular rails; current exterior photos show this distinct feature. Heights remain datum-dependent as documented.
