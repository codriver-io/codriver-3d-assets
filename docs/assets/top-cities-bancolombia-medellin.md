# Bancolombia headquarters — Medellín

The actual Medellín Bancolombia Dirección General: two exceptionally long twelve-floor limestone-and-glass blocks, staggered vertical slot facades, glazed end walls and two stacked high glass links across the open central gap.

## Sources and rights

- [Article: identity and architectural context](https://en.wikipedia.org/wiki/Bancolombia)
- [OSM way/153413632](https://www.openstreetmap.org/way/153413632)
- [Convel architect:two-block headquarters project2006–2009,135739m²](https://convel.co/bancolombia-direccion-general/)
- [Argos project supplier: north/south blocks and ventilated stone/glass facade](https://colombia.argos.co/proyectos/edificio-direccion-general-bancolombia/)
- [INTERVÉ project supervisor:2008,135000m² and glass-link exterior photos](https://www.interve.co/projects/direcci%C3%B3n-general-bancolombia)
- [Dirección General Bancolombia project exterior — INTERVÉ, individual photographer uncredited; Copyright all rights reserved; comparison only; comparison only](https://www.interve.co/projects/direcci%C3%B3n-general-bancolombia)
- [File:2018 Bancolombia Medellín - Ciudad del Río.jpg — Felipe Restrepo Acosta; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:2018_Bancolombia_Medell%C3%ADn_-_Ciudad_del_R%C3%ADo.jpg)
- [File:2018 Fachada edificio Bancolombia Medellín - Ciudad del Río.jpg — Felipe Restrepo Acosta; CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:2018_Fachada_edificio_Bancolombia_Medell%C3%ADn_-_Ciudad_del_R%C3%ADo.jpg)
- [Dirección General Bancolombia project exterior — INTERVÉ, individual photographer uncredited; Copyright all rights reserved; comparison only; comparison only](https://www.interve.co/projects/direcci%C3%B3n-general-bancolombia)

Photos checked against this exterior, comparison only; no source imagery or third-party geometry is committed. Original procedural model CC BY 4.0; code/docs MIT; OSM geographic data ODbL 1.0. No contributor terms were accepted.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Overall mapped length |about397 | OSM153413632 |
| South /north block length |189 /154 | Mapped exterior edge lengths |
| Main block depths |about34 /25 | OSM varying outlines |
| Body roof /parapet top |48.8 /49.8 | Twelve floors,4m typical and photographic exterior estimate; no published survey height found |
| Gap /mapped link width |42.6 /5.1 | OSM waist alignment |
| Two link deck levels |32 /40 | Exterior photo estimate, not surveyed |

Origin: [-75.57516455,6.2285003]. +X east, +Y up, +Z south; local y=0 is rigid exterior foundation grade. No terrain elevation or Mercator scale is baked. Geographic yaw 82.7503205718843 degrees is baked from the controls [[-75.5754922,6.2267525],[-75.575277,6.2284342]]; the host must not rotate again. Footprint ownership: 153413632. A median bounded pad follows the mapped footprint; actual DEM contact is untested.

## Modeling decisions and approximations

The initial dossier photos1/2 show unrelated bank buildings and are rejected;3 is a remote fireworks view,9/10 show the Metro station rather than useful facade detail. References11/12 from the project supervisor plus4/5 modern Commons streets establish this actual complex. The single OSM outline includes two grounded blocks connected only at upper floors; the model and terrain pad preserve the central ground-level void. Pad rings cover only the two actual grounded blocks. Glazed links are stacked above the central gap, not road-carrying bridges, and no road layer is written. Their deck and roof member contacts are tested against actual building floor geometry excluding the member. Main heights49.8m and deck elevations are explicit photo estimates based on12storeys; the long mapped blocks have varying depth, simplified within about2m. Repeated pale stone strips, inset green-grey glass, lower ventilation bands and transparent-looking glazed end bays supply recognition without any bank logo, lettering or copied textures.

## Evidence and readiness

Standalone asset **ready** after source/GLB round-trip, distinctive-feature tests, deterministic metrics and visual review.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 16866 | 6 | 272044 |
| far | 3670 | 6 | 139460 |

Metrics: `tmp/batch/bancolombia-medellin/metrics.json`, no flags. Contact sheet: `tmp/batch/final/bancolombia-medellin.jpg` (exported near/far with opposite sides, roof, street and reference photo). Red-ring plan: `tmp/landmarks/shots/bancolombia-medellin/bancolombia-medellin-procedural-near-light-top.png`. The two upper glass links remain above a fully open central ground corridor, with both link endpoints checked against isolated actual building floor triangles that exclude the connecting member. Every link mullion and diagonal foot/head is embedded in its named deck/roof; failed shortened-link probes miss the bearings. The supplemental exported glass-links view was inspected against project-supervisor photo12; no unrelated bank towers or logos were modeled. Export budgets have headroom; no Tesla hardware performance is claimed. App replacement, DEM contacts, mode transitions and lifecycle checks are left to the later batched integration stage. Cityscape: **not tested**. Full 3D world: **not tested**.

## Independent-review follow-up

Strengthened the five-bay long-face hierarchy by narrowing each major-strip slot to 1.2m and keeping intermediate slots 1.85m, without adding tiny mullions. Far removes only glazing-concealed inward faces/reveal tubes, retaining all tall slots, staggered heads, twelve end-wall rows, both elevated links and the open ground corridor. Near changes only in the requested slot/stone-strip proportions; original geographic uncertainty remains for later app terrain checks.

Fresh exported near/far compared tile by tile in `tmp/batch/followup/sheets/bancolombia-medellin.jpg`; focused tests, qa-metrics and depth check pass with zero flags/cycles. Cityscape: not tested. Full 3D world: not tested.
