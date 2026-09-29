# Dôme des Invalides — `paris-invalides`

Original texture-free geometry commissioned for Codriver in 2026. The [Musée de l’Armée current brochure](https://www.musee-armee.fr/fileadmin/cru-1761668226/user_upload/Documents/Communiques_Presse/MA_brochure_MINERVE_EN_A4_mail_v2.pdf) gives 107 m for the gilded dome, used as the target height. An older [museum architectural sheet](https://www.musee-armee.fr/fileadmin/user_upload/Documents/Support-Visite-Fiches-Objets/Fiches-periode-louis-XIV/dome-presentation-GB.pdf) gives 101 m. The model includes church wings, two drum levels, cupola, lantern and portico. It excludes the surrounding hospital complex. Drum diameter, bay rhythm and colour are visual estimates.

Origin [2.31254, 48.85505] lies at the center of [OSM church way 112452790](https://www.openstreetmap.org/way/112452790), retrieved 2026-09-29. The mapped church is about 58 × 70 m; this replaces the initial broader 88 × 83 m estimate. Orientation is approximately cardinal. Local y=0 is the rigid church foundation plane, in east/up/south metres without terrain datum. © OpenStreetMap contributors, ODbL 1.0.

Build: `pnpm build:paris-icons`. [Inspect source and GLBs](/asset-preview.html?asset=paris-invalides), including roof and opposite facade; measured costs are in `public/models/buildings/paris-invalides.json`. Host Cityscape: not tested here. Host Full 3D world: not tested here. Hardware timing is unmeasured.

Visual comparison: [Musée de l’Armée south-façade photograph](https://www.musee-armee.fr/votre-visite/les-espaces-du-musee/dome-des-invalides-tombeau-de-napoleon-ier.html). No reference pixels are redistributed. [GLB façade](../../docs/screenshots/paris-icons/paris-invalides-near-glb-facade.png) · [source façade](../../docs/screenshots/paris-icons/paris-invalides-near-source-facade.png) · [far roof/night](../../docs/screenshots/paris-icons/paris-invalides-far-glb-roof-night.png).

## Street-level revision — 29 September 2026

Radial drum openings, curved gold dome ribs, column capitals, side elevations and crown cross.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

Current revision: [near GLB facade/support](../screenshots/paris-refinement/paris-invalides.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-invalides-roof-or-structure.png).


## Geographic registration revision

The source and GLBs now include the mapped origin, facade bearing and documented horizontal fit. Heights remain unchanged; the host must apply only geographic scale and its ground datum. See [Paris registration](../paris/placement.md) for reference coordinates, partial-palace scope and approximation limits. Host Cityscape and Full 3D world were checked in the desktop renderer with live map data; this is not vehicle-hardware or authenticated-session evidence.
