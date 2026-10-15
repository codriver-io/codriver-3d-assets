// Pont Royal, Paris: five-arch masonry bridge of 1685-1689 (Jacques IV Gabriel and Jules
// Hardouin-Mansart, built by François Romain) from the Pavillon de Flore / Tuileries to the Rue du Bac.
export const SPEC = {
  id: 'pont-royal', name: 'Pont Royal', kind: 'bridge',
  ready: true,
  origin: [2.3299162, 48.8601221], // structural centre: crown of the middle arch on the mapped carriageway axis
  height: 2.17, // flat-map parapet coping at the crown above the quay grade (deck 0.95 m + 1.22 m)
  padM: 70,
  frontageBearing: 26.1, // the mapped carriageway axis, south to north
  footprintless: true,
  belowGradeM: 7.5, // the deck is flush with the quays; piers and quay walls reach 10.2 m below grade (FOOT)
};
export const PALETTES = {
  light: { stone: '#cfc7b4', masonry: '#cfc7b4', trim: '#dcd4c1', ring: '#dcd4c1', glow: '#b2aa98', setts: '#6d6661', walk: '#aaa59a', paint: '#e6e1d0', mark: '#30333f', gauge: '#e9eaee' },
  dark: { stone: '#7d8088', masonry: '#7d8088', trim: '#91939a', ring: '#91939a', glow: '#b88f5e', setts: '#3b3e45', walk: '#5a6066', paint: '#b9bdbe', mark: '#22252e', gauge: '#a2a7b0' },
};
export const MANIFEST = {
  elevationDatum: 'Local flat-map y=0 = quay street grade. Mapped span only: the deck is flush with the quays (0.10 m proud at both mouths) with a 0.85 m parabolic hump to 0.95 m over the centre arch; no ramps. River level 7.2 m below grade, arches spring 1 m under it, piers and quay walls run to 10.2 m below grade. In Full 3D world the deck spans straight between the live ground at its two street ends; masonry below grade is shown on terrain only (layer.js). No DEM, absolute altitude or latitude stretch baked in.',
  attribution: 'Original procedural geometry, Codriver. Mapped bridge outline and roadway © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Sourced (1685 specification, fr.wikipedia): spans 20.80/22.42/23.40/22.42/20.80 m, three-centred arches rising one third of the opening, piers 4.55 m; width 17 m, length 110 m (Structurae). Deck datum, hump, ring depth, cutwater and chaperon heights, cornice and parapet sections estimated from photographs; walks and carriageway measured on the IGN orthophoto.',
};
