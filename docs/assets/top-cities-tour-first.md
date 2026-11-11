# Tour First — Courbevoie / Paris La Défense

Original procedural exterior of the completed 2011 tower, excluding the pre-renovation Axa version. Three unequal glass blades, pale horizontal bands, sloping crowns and the slender tip define its silhouette.

## Sources and rights

- [Paris La Défense: First](https://www.parisladefense.com/en/district/towers-buildings/first): completed renovation and helical skyline composition.
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Tour_First)
- [OSM way 82466977: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/82466977)
- [OSM way 226245904: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/226245904)
- [OSM way 226254484: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/226254484)
- [OSM way 226254483: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/226254483)
- [OSM way 226254482: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/226254482)
- [OSM way 227324158: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/227324158)
- [OSM way 227324159: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/227324159)
- [OSM way 226254481: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/226254481)
- [OSM way 227324160: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/227324160)
- [OSM way 227353363: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/227353363)
- [OSM way 227353364: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/227353364)
- [OSM way 227353365: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/227353365)
- [Reference photograph: File:La Défense depuis l'Arc de Triomphe Janvier 2023.jpg — Arthur Weidmann — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:La_D%C3%A9fense_depuis_l%27Arc_de_Triomphe_Janvier_2023.jpg)
- [Reference photograph: File:Tour First - La Defense - Inauguration 6 mai 2011.jpg — User:Apostoly, perspective correction by King of Hearts — CC-BY-SA-3.0](https://en.wikipedia.org/wiki/File:Tour_First_-_La_Defense_-_Inauguration_6_mai_2011.jpg)
- [Reference photograph: File:La Défense depuis l'Arc de Triomphe Janvier 2023 (cropped).jpg — Arthur Weidmann — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:La_D%C3%A9fense_depuis_l%27Arc_de_Triomphe_Janvier_2023_(cropped).jpg)
- [Reference photograph: File:Tours First et Saint-Gobain (42975144462).jpg — Arthur Weidmann — CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:Tours_First_et_Saint-Gobain_(42975144462).jpg)

Two construction-era photos (`Axa-octobre08`, `Tourfirst240309`) were rejected. The 2011 inauguration photo, the 2023 skyline and the completed First/Saint-Gobain exterior are comparison-only; no photos are committed or traced. Original geometry is texture-free, models CC BY 4.0, source/docs MIT; mapped outlines keep ODbL credit. No contributor declaration is signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Main roof | 225 | Published |
| Tip | 231 | Published |
| Other blade crowns | 170 / 190 | OSM and photo estimate |
| Crown slope depth | 25 | OSM roof tags; visual estimate |
| Podium | 5 | OSM/photo estimate |
| Floor pitch | 3.8 near / 7.6 far | Estimated curtain-wall rhythm |

Origin `[2.25160628, 48.88876717]`; +X east, +Y up, +Z south in real metres. The literal mapped rings bake the bearing once, including controls `[2.2520128,48.888989]` and `[2.251439,48.8891717]`. Local y=0 is the rigid exterior grade; no DEM, terrain or Mercator scaling is included. All mapped upper parts within the owned tower envelope are listed, even where their height tags are inconsistent. OSM tags suggesting 240–259 m are not adopted: the published 231 m tip controls the asset.

## Modeling and approximations

Separate mapped blades preserve the changing three-way skyline. Glass and silver frame are adjoining tiles, with no coplanar window decals. Roofs are genuine sloping planes and each blade reaches the base; far doubles the curtain-wall pitch while retaining separate panes and all crowns. Muted grey-blue glass approximates reflections. No lettering, logos, interior, surrounding pavement, vegetation or neighbouring southern canopy is modeled. Foundation contacts and terrain fit require later app checks.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 22546 | 3 | 352444 |
| far | 6560 | 3 | 108712 |

Deterministic metrics: `tmp/france/tour-first/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/tour-first.jpg`. Mapped orientation/top check: `tmp/france/shots/tour-first/tour-first-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.


Two look rounds: widened the tall-landmark framing after automatic views clipped the crown, and reduced pane-column density (31,296 → 22,546 near triangles) without changing the mapped blades or roofline. The final sheet and source far-dark overview/back sheet were inspected; no visible floating parts, missing crowns or footprint rotation mismatch. The source dark sheet is `tmp/france/shots/tour-first/tour-first-procedural-far-dark-sheet.jpg`. Mast starts 0.4 m inside the tallest roof and ends at the published 231 m tip.
