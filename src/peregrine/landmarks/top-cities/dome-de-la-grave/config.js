// Chapel of the Hôpital de La Grave. Heights are provisional; see the source doc.
export const SPEC = {
  id: 'dome-de-la-grave', name: 'Dôme de la Grave (Chapelle Saint-Joseph)', kind: 'building',
  ready: true, origin: [1.43298, 43.60083], height: 56, padM: 40,
  frontageBearing: 114, rotationDeg: 66,
};
export const PALETTES = {
  light: { brick: '#8a4a38', trim: '#c7997b', stone: '#bcbaa5', copper: '#7d9d92', seam: '#53746c', glass: '#303e3e', light: '#455659' },
  dark: { brick: '#ba7c45', trim: '#c59557', stone: '#b6ac83', copper: '#405a53', seam: '#2e4944', glass: '#172223', light: '#ffd389' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local courtyard grade y=0; no absolute altitude or terrain stretch.',
  attribution: 'Original procedural geometry by Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '24.8 m dome footprint mapped in OSM; eight arched drum windows and six facade pilasters documented by CHU Toulouse. Provisional 56 m cross summit follows the 2022 restoration report; municipal pages variously say 40 m and 85 m without a clear datum. Stage heights and ornament are photograph estimates. Hospital scope is one short adjoining wing; full hospital is not modelled. Rotation is baked.',
};
