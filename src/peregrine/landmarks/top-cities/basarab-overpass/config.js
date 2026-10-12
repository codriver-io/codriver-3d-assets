// 2011 railway crossing: engineering dimensions from CFC's ACHE paper.
export const SPEC = {
  id: 'basarab-overpass', name: "Basarab Overpass", kind: 'bridge',
  ready: true,
  origin: [26.06785, 44.44945],
  height: 94, // Estimated 14 m local road datum + designer's 80 m above deck.
  padM: 900, frontageBearing: 46, nearM: 1600, rangeM: 4500,
  terrainPolicy: 'bank-fit',
};
export const PALETTES = {
  light: { tower:'#dfddcf', concrete:'#babbb2', steel:'#929c9d', cable:'#d9dfdb', asphalt:'#5c6265', rail:'#9faeae', paint:'#e9e6d8', glass:'#859ba0', glow:'#386898', lamp:'#e8dcba' },
  dark: { tower:'#879499', concrete:'#65737b', steel:'#637c89', cable:'#a8b9bf', asphalt:'#303b43', rail:'#8da2ae', paint:'#b8c4c3', glass:'#3b5865', glow:'#287cff', lamp:'#ffe1a3' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 on the flat Peregrine basemap; no absolute altitude.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Original 2011 Basarab railway crossing, 168 m main span, 60 stays, twin vertical chamfered shafts rising 80 m above road (CFC ACHE paper). Estimated 14 m local deck datum, pylon station, canopy and fittings. Long mapped approaches use flat-map ramps; southern Dâmbovița arch and side branches are outside this asset. Terrain datum is sampled separately; no DEM or geodetic height is baked.',
};
