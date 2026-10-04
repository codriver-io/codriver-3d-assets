// Current 2012 Calatrava road bridge; dimension datums documented in the model notes.
export const SPEC = {
  id: 'margaret-hunt-hill-bridge', name: "Margaret Hunt Hill Bridge", kind: 'bridge',
  ready: true,
  origin: [-96.8221256, 32.7799486],
  height: 131.064, padM: 420, frontageBearing: 67.4,
  terrainPolicy: 'bank-fit',
};
export const PALETTES = {
  light: { tower: '#f0f0e9', cable: '#d5dad6', concrete: '#bfc1b8', steel: '#dadbd3', asphalt: '#555d63', paint: '#eeeade', lamp: '#f4efe1' },
  dark: { tower: '#bccbd5', cable: '#899da9', concrete: '#697984', steel: '#8999a4', asphalt: '#303c47', paint: '#adb9bd', lamp: '#ffe3a0' },
};
export const MANIFEST = {
  elevationDatum: 'Local y=0 is the flat-map foundation grade; no DEM, sea-level elevation or latitude stretch is baked into this asset. Steel arch 121.92 m above 9.144 m concrete bases; deck 13 m is an estimated visual datum.',
  attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: 'Published: 368 m cable-supported section, 184 m spans, 36.7 m width, 58 centreline stays; city fact sheet gives 400 ft steel arch, 30 ft concrete columns and 14 ft 7 in steel base diameter. Architect gives 136 m above riverbanks; differing height datums remain unresolved. Estimated transverse arch spread, deck height, taper, cable attachment ordering, approach supports and lights; tower station inferred from dossier coordinate projected onto averaged OSM carriageways.',
};
