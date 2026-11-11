# University of Georgia Arch — Athens

UGA’s 1850s cast-iron gateway: three fluted columns on square plinths, two open walk-through bays, a thin half-round crown with scrollwork and two pale globe lamps. No inscriptions, seal lettering or university logos.

## Sources and rights

- [Smithsonian sculpture inventory: approximate 11 ft by 116 in by 13 in dimensions](https://siris-artinventories.si.edu/ipac20/ipac.jsp?uri=full%3D3100001~%21336949~%210)
- [UGA operator: history and three-pillar gateway](https://georgiadogs.com/sports/2017/6/16/traditions)
- [Mapped Arch node, not the bus stop](https://www.openstreetmap.org/node/4886558902)
- [Nearby Broad Street sidewalk alignment](https://www.openstreetmap.org/way/609286336)
- [Close exterior — JJonahJackalope, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:The_Arch,_UGA.jpg)
- [Campus-side exterior — Chuck, CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:ArchUGA4.jpg)
- [Exterior — Michael Rivera, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:UGA_Arch.jpg)
- [OSM geometry: API map fallback after queued Overpass failed](https://api.openstreetmap.org/api/0.6/map?bbox=-83.37766813917605,33.955548015415026,-83.37290286082396,33.95950058458498)

Current completed exteriors by JJonahJackalope (CC BY-SA 4.0), Michael Rivera (CC BY-SA 3.0), Coxonian (CC BY-SA 4.0), and Chuck (CC BY-SA 2.0) were inspected. Historic postcard is context only; Clayton Street intersection is the wrong subject and rejected. No UGA Police image was downloaded or used: its possession/permission wording was not accepted.

OSM API map fallback was used after three cached/queued Overpass endpoints returned fetch errors, 504 or timeout. Raw map and normalized dossier are kept under ignored `tmp/texas-georgia/uga-arch/`. Source and docs MIT; original model CC BY 4.0. No contributor or license acceptance performed.

## Frame and dimensions

Origin `[-83.3752855,33.9575243]`, real metres, east/up/south. Local y=0 is a rigid exterior foundation plane, with no terrain or latitude scaling baked in. Footprintless freestanding structure placed at mapped historic node 4886558902; bus-stop node 477959373 is not the Arch. Sidewalk controls [-83.3757477,33.9574687] to [-83.3752997,33.9575685] set +15 degrees Y, parallel to Broad Street. This is a photo-and-mapped-alignment estimate, not a surveyed orientation. y=0 is the bottom of the rigid column plinths; the surrounding sloped campus steps are excluded.

Smithsonian inventory gives approximate overall 11 feet (3.3528 m) by 116 inches (2.9464 m) by 13 inches (0.3302 m). A commercial photographer describes 16 feet; this disagrees and is not treated as a surveyed height. The inventory dimensions govern this asset; column proportions, scroll shapes and lamp sizes are photo estimates. Both passages remain empty in far LOD.

## Approximation and ownership

UGA’s 1850s cast-iron gateway: three fluted columns on square plinths, two open walk-through bays, a thin half-round crown with scrollwork and two pale globe lamps. No inscriptions, seal lettering or university logos. Dimensions beyond published height and OSM plan are photo estimates. Cityscape: not tested. Full 3D world: not tested. Provider ownership is limited to OSM ways ; surrounding buildings, roads and site landscaping excluded.

## Verification

Re-review correction, 2026-11-10: the reviewer reversed its earlier low-base instruction after confirming tall rectangular pedestals in the reference. Restored the exact pre-follow-up geometry in both LODs: 0.4464 by 0.3302 m pedestal blocks at y=0–0.48 m, caps at 0.48–0.54 m, circular collars at 0.54–0.60 m and fluted shafts starting at 0.60 m. The 2.9464 m beam width, 3.3528 m overall height, beam position and two open passages are unchanged; no plaque lettering. This supersedes the low-base change in a1ce5684. The fresh exported sheet passes self-review; batch asset review closes by lead judgement.

Cityscape: not tested. Full 3D world: not tested. Runtime placement and terrain verification remain separate gates.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3344 | 2 | 36776 |
| far | 1536 | 2 | 21744 |

One fresh exported contact sheet inspected: `tmp/batch/uga-pedestal-restoration/sheets/uga-arch.jpg`; fitted reference plus near/far frontal, oblique and pedestal views confirm the rectangular bases. Metrics: `tmp/batch/uga-pedestal-restoration/metrics.json`; zero flags. Four asset tests and four focused registry/conformance tests pass, including measured pedestal width/depth and height stages, collars/shaft contact, overall beam width, beam elevation, overall height and open passages. Depth check is current, with zero cycle edges dropped; `pnpm assets:check` (470 entries / 928 variants) and `pnpm assets:preview` pass.

## 2026-11-10 application framing follow-up

Stock model was too small to judge. Custom exact origin; zoom 21, pitch 60, bearing 165; no model edits. All three columns/footings and curved crest are visible at useful scale, aligned beside the street and seated in both modes. Final verdict: Cityscape **verified**; Full 3D world **verified**. Before/after evidence, capture diagnostics and exact command arguments are recorded in the follow-up report. No readiness gate was changed from a framing/data gap.
