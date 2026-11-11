# Markham Civic Centre

Markham’s long terracotta civic wing and open pond-side colonnade, green framed glass atrium, low circular council chamber and peaked entrance pavilions.

## Identity and sources

Current exterior at Markham, Canada; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Markham_Civic_Centre)
- [Mapped replacement footprint 55223344](https://www.openstreetmap.org/way/55223344)
- [Mapped replacement footprint 943422686](https://www.openstreetmap.org/way/943422686)
- [Mapped replacement footprint 943422687](https://www.openstreetmap.org/way/943422687)
- [Mapped replacement footprint 935651674](https://www.openstreetmap.org/way/935651674)
- [City of Markham: civic centre](https://pub-markham.escribemeetings.com/filestream.ashx?documentid=11582)
- [File:MarkhamCivicCenter30.jpg · Raysonho @ Open Grid Scheduler / Scalable Grid Engine · CC0](https://commons.wikimedia.org/wiki/File:MarkhamCivicCenter30.jpg)
- [File:MarkhamCivicCenter25.jpg · Raysonho @ Open Grid Scheduler / Grid Engine · CC0](https://commons.wikimedia.org/wiki/File:MarkhamCivicCenter25.jpg)
- [File:MarkhamCivicCenter13.jpg · Raysonho @ Open Grid Scheduler / Grid Engine · CC0](https://commons.wikimedia.org/wiki/File:MarkhamCivicCenter13.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -79.3369,43.8566. Replacement OSM ways: 55223344,943422686,943422687,935651674. The exact mapped polygon is retained in footprint.js.

| Dimension | Metres | Basis |
| --- | --- | --- |
| Main mapped envelope | approx146 ×130 | OSM parent and parts |
| Long wing eave / arcade roof | 12.8 /5 | Photo estimate |
| Rear office / small plant cap |16.8 /18.8| Four mapped floors, photo estimate |
| Glass atrium peak |16.5| Photo estimate |
| Council copper roof |13.2| Photo estimate |

Mapped orientation controls are LOCAL_RINGS[0][0] [-79.3370396,43.8567794] and LOCAL_RINGS[0][1] [-79.3372601,43.856546]. The working-frame angle is atan2(Δsouth, Δeast); its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

Arthur Erickson and Richard Stevens1990 civic centre, current exterior compared at the named entrance, pond-side colonnade and wider roadway setting. The reflecting pond and paving are deliberately not authored. Both LODs keep26 grounded arcade columns and the open walkway and the gridded sloping glass roof; feet remain on local rigid y0 and require later ground/pond datum verification in the app. Parent55223344 and matching upperpart943422686 are both named for provider ownership; the low octagonal entry943422687 and street canopy935651674 are included. All heights are photo estimates from mapped floor counts, not surveys. Solar panels, flags, words and signs omitted. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 3768 triangles / 6 draws / 60968 bytes; far: 2560 triangles / 6 draws / 45952 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/markham-civic-centre.jpg and tmp/east/markham-civic-centre/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

The municipal designation describes precast concrete, green-tinted glass and copper. The warm terracotta-coloured wall surfaces use a neutral `cladding` material key rather than a claim of brick construction. Arcade, entrance and canopy envelopes were checked over all source triangles, not just bounding boxes.
