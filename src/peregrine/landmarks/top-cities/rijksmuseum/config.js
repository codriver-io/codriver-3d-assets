// Rijksmuseum, Museumstraat 1, Amsterdam. Pierre Cuypers, 1876–1885, as it
// stands after the 2013 reopening. Origin is the centroid of OSM way 431070185.
// The north facade faces 39.32°; that rotation is baked into the geometry.
export const SPEC = {
  id: 'rijksmuseum',
  name: 'Rijksmuseum',
  kind: 'building',
  ready: true,
  origin: [4.8851455, 52.3600098],
  height: 54, // 3DBAG on the north towers; the 1885 figure is 52.90 m
  padM: 100, // half-diagonal of the outline is about 87 m; the Museumplein site is flat
  frontageBearing: 39.32,
};
export const PALETTES = {
  light: {
    brick: '#8a4a3a',
    stone: '#efe4d2',
    plinth: '#8e8a82',
    slate: '#3c4450',
    glass: '#4a5560',
    light: '#3c342c',
    metal: '#d9c48a',
    clock: '#14161a',
    white: '#f3f0e8',
  },
  dark: {
    brick: '#4f2a22',
    stone: '#e4d8c4',
    plinth: '#5e6368',
    slate: '#2a3138',
    glass: '#8ea0ae',
    light: '#ffc27a',
    metal: '#f0e2b0',
    clock: '#0c0e12',
    white: '#d9d4ca',
  },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Tower tops follow the 3DBAG height of 54 m (OSM roof:height 20 on a 54 m part). The 1885 delivery height is 52.90 m. Gallery ridges are the tagged 27 m. The passage is about half the central bay (10.2 m, spring 1.15 m, crown 6.25 m), with a stone archivolt. The north gable is crow-stepped with a tall arched window; the Museumplein front is a continuous slate roof, a rectangular ridge skylight and a horizontal arcade, not a second stepped gable. North towers carry clock dials and a hip, lantern and needle on both LODs. Roof glass is blue-grey by day and a faint cool tone at night. The mapped 17 m part south of the arch is a low plinth: the Museumplein elevation shows that ground open.',
};
