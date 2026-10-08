// MUNCH (Munch Museum), Bjørvika, Oslo. estudio Herreros, opened 22 October 2021.
// Measured roof 57.4 m (Dezeen; Wikidata/Commons for the building). The museum,
// Lindner and Bollinger+Grohmann round the same tower to 60 m.
export const SPEC = {
  id: 'munch-museum', name: 'MUNCH (Munch Museum)', kind: 'building', ready: true,
  origin: [10.75523029, 59.90572569], height: 57.4, padM: 72,
  // Glazed head looks west-northwest, toward the Opera House and the city.
  frontageBearing: 290.1,
};
export const PALETTES = {
  light: {
    panel: '#b9bdc0',
    glow: '#9aa1a6',
    glass: '#3a4c58',
    light: '#5c7078',
    frame: '#242c30',
    sign: '#a888d0',
    gap: '#1c2226',
  },
  dark: {
    panel: '#4a545c',
    glow: '#c8b48a',
    glass: '#16303a',
    light: '#f0d7b0',
    frame: '#12181c',
    sign: '#d4c2f0',
    gap: '#101418',
  },
};
export const MANIFEST = {
  elevationDatum: 'y=0 is local flat-map grade on the Bjørvika quay; rigid foundation, no absolute altitude or baked terrain.',
  attribution: 'Original procedural geometry, Codriver, 2026. Mapped outlines © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Roof 57.4 m (Dezeen / building record); museum, Lindner and Bollinger+Grohmann say 60 m. Kink at the mapped 37 m part, incline to the 57 m part, 7.5 m west-northwest shift (Lindner publishes a 7 m overhang). Where the shaft plan leaves the podium the aluminium runs down to grade, so nothing hangs over open air. Glass is the leaning front plus a vertical corner strip on the narrow end; the rest of that end is ribbed. Aluminium elsewhere, light silver with darker grooves, and a recessed crown under a projecting cap. Podium 13 m, lilac MUNCH wordmark. Wave pitch, glass grid and letter size are estimated. No textures or external meshes.',
};
