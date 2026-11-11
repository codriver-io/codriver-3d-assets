# Cosmodôme

Angular silver science museum, horizontal barrel entrance and the slender red-and-white Ariane 4 replica beside Autoroute 15.

## Identity and sources

Current exterior at Laval, Canada; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Cosmodome)
- [Mapped replacement footprint 229733790](https://www.openstreetmap.org/way/229733790)
- [2011 local news report, rocket 46.4 m](https://s3.amazonaws.com/iclic-neomedia/9/journaux/2011/echo-laval-190511-opt.pdf)
- [On-site Ariane 4 replica coordinate](https://www.waymarking.com/waymarks/WMC6TF_Lanceur_Ariane_4_Cosmodome_Laval_Qc)
- [File:Cosmodôme, fusée emblématique.jpg · Laurent Bélanger · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Cosmod%C3%B4me,_fus%C3%A9e_embl%C3%A9matique.jpg)
- [File:Cosmodôme, entrée des camps.jpg · Laurent Bélanger · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Cosmod%C3%B4me,_entr%C3%A9e_des_camps.jpg)
- [File:Cosmodôme, vue arrière.jpg · Laurent Bélanger · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Cosmod%C3%B4me,_vue_arri%C3%A8re.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -73.7444,45.5664. Replacement OSM ways: 229733790. The exact mapped polygon is retained in footprint.js.

| Dimension | Metres | Evidence |
| --- | --- | --- |
| Rocket overall height | 46.4 | Reported by the 2011 local news account; exterior-grade interpretation approximate |
| Museum eave | 11.0 | Photo estimate |
| Main shaft radius | 1.25 | Photo estimate |
| Museum outline | exact polygon | OSM way 229733790 |

Mapped orientation controls are LOCAL_RINGS[0][9] [-73.7441935,45.5664807] and LOCAL_RINGS[0][10] [-73.7437786,45.5665265]. The museum uses direct mapped east/south vertices; its projecting barrel uses the mapped recess line at vertices 9–10, rounded to centimetres in the source.

## Modelling and limits

Current red-and-white rocket paint is based on the Laurent Bélanger exterior photographs, rather than the older black-painted photograph. Replica height 46.4 m is reported; rocket siting uses the mapped-site coordinate -73.7428167,45.56655 from the on-site waymark. Museum heights, barrel curvature, fins and opening rhythm are estimates. Adjacent apartments and other attractions excluded. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

The first exported contact sheet exposed a mistaken roof dome interpretation; it was replaced with the low horizontal cylindrical entrance gallery shown in the rear reference. Rigid museum, detached slender rocket and projected fins retain their proportions in near/far; the museum is intentionally simpler than the rocket. Exact gallery depth is estimated. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

Measured exports: near: 1644 triangles / 7 draws / 33640 bytes; far: 1220 triangles / 7 draws / 28836 bytes. Focused rocket/museum identity tests pass in both LODs; deterministic QA has zero flags and depth check has zero cycle edges. Visual evidence: `tmp/east/sheets/cosmodome-laval.jpg`, `tmp/east/cosmodome-laval/shots/` (mapped procedural plan and far dark GLB). One look-fix round corrected the entrance barrel. Independent application review remains required.

Geographic audit: added explicit authored envelopes for the detached rocket and the cylindrical entrance gallery; neither invents an additional OSM provider way. Near/far component containment now has explicit regression tests at the provider’s0.8m slack plus5cm rounding tolerance.

## Independent review follow-up

Nit: separated the entry barrel into muted silver-green cladding #a7b2af and darkened the angular museum roof to #7f8a88, preserving the existing pale walls and red/white Ariane replica. Geometry and silhouette are unchanged.

Re-exported both LODs; identity and regression tests, focused registry conformance, deterministic QA and depth check passed. New evidence: tmp/fixes/sheets/cosmodome-laval.jpg. Independent re-review pending. Cityscape: not tested. Full 3D world: not tested.
