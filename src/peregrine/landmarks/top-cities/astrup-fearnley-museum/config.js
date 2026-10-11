// Astrup Fearnley Museum of Modern Art, Strandpromenaden 2, Tjuvholmen, Oslo.
// Renzo Piano Building Workshop with Narud-Stokke-Wiig, opened 29 September 2012.
// Contract: docs/3d-top-cities-landmarks.md.
export const SPEC = {
  id: 'astrup-fearnley-museum',
  name: 'Astrup Fearnley Museum of Modern Art',
  kind: 'building',
  ready: true,
  // Vertex mean of the two building outlines and the two glass-roof ways.
  origin: [10.721644, 59.907011],
  height: 25, // Fondazione Renzo Piano: 25 m to the glass peaks
  padM: 78,
  // Canal and long pavilion edges run northeast–southwest, from the mapped outline.
  frontageBearing: 45,
};

export const PALETTES = {
  light: {
    timber: '#9c8a72',
    board: '#776d5d',
    glass: '#e4eef3',
    glassDeep: '#b9cdd8',
    steel: '#5e696f',
    beam: '#c6a36c',
    windowGlass: '#263e49',
    glow: '#a77b43',
    concrete: '#c8c4bb',
  },
  dark: {
    timber: '#554d42',
    board: '#3f3a32',
    glass: '#2c4254',
    glassDeep: '#243848',
    steel: '#c5ced4',
    beam: '#7d623c',
    windowGlass: '#14232b',
    glow: '#b38b55',
    concrete: '#6e736e',
  },
};

export const MANIFEST = {
  elevationDatum: 'Local quay grade y=0 on the flat Peregrine basemap. No terrain, sea level or latitude stretch baked in.',
  attribution: 'Original procedural geometry, Codriver 2026. Mapped placement © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Published height 25 m (Fondazione Renzo Piano). OSM part heights 20 / 16 / 8 / 4 m and roof tags 20 m and 8 m are kept for the timber volumes and the low park eave. Peak spacing, glulam spacing, column rhythm, canal bridges and the sail profile between those anchors are estimated from attributed photographs. No textures or external meshes.',
};
