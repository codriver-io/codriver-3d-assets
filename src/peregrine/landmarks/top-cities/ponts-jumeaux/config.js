// Protected historic canal bridges and the adjacent boulevard crossings, Toulouse.
export const SPEC = {
  id: 'ponts-jumeaux', name: 'Ponts-Jumeaux', kind: 'bridge', ready: true,
  origin: [1.41868, 43.61099], height: 5.25, padM: 100,
  frontageBearing: 258, footprintless: true,
};
export const PALETTES = {
  light: { brick: '#ab6049', stone: '#bcb19a', marble: '#fffaf0', mortar: '#be9579', relief: '#f5f1e7', iron: '#444c46', asphalt: '#555d63' },
  dark: { brick: '#624b46', stone: '#7c8080', marble: '#ccd2d2', mortar: '#75675b', relief: '#c7cece', iron: '#667a82', asphalt: '#303c47' },
};
export const MANIFEST = {
  elevationDatum: 'Local canal-side grade y=0, metres east/up/south; no DEM or sea-level altitude baked in. Historic deck 4.7 m, boulevard decks 4.2 m are estimated flat-map offsets. Bank-fit terrain profiles are checked separately.',
  attribution: 'Original procedural mesh by Codriver. Mapped road alignments © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Historic basket-handle brick arches, stone rings and coping, and a raised abstract Carrara marble relief panel. Dimensions other than OSM horizontal alignment are photographic estimates, not survey. Adjacent north/south vehicle bridges have independent profiles and simpler fascias; ornamental relief is not a reproduction of the sculpture.',
};
