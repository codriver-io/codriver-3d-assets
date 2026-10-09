// Full-scale Ariane 5 exhibit; y=0 is the local flat plinth datum.
export const SPEC = {
  id: 'cite-de-l-espace', name: "Cité de l'espace (Ariane 5)", kind: 'building',
  ready: true, origin: [1.4930070294117646, 43.58556052352941],
  height: 53, padM: 17, mastCenterZ: 6.95, mastWidth: 3.6, mastDepth: 2.5, frontageBearing: 33.25,
  boosterBearing: 123.25,
};
export const PALETTES = {
  light: { white:'#f5f5ef', ivory:'#e5dcc2', tan:'#d2c6a4', metal:'#666f72', blue:'#26558b', red:'#bc413e', gold:'#cfac52', green:'#447e6f' },
  dark: { white:'#b0b9c3', ivory:'#aaa99a', tan:'#979488', metal:'#4d5c6a', blue:'#426488', red:'#80434b', gold:'#8c805f', green:'#456965' },
};
export const MANIFEST = {
  elevationDatum: 'Local grade y=0 at exhibit plinth; rigid flat foundation, no terrain or absolute altitude baked in.',
  attribution: 'Original procedural mesh by Codriver. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
  note: '53 m Ariane 5 replica and 49 m mapped umbilical mast only. Core 5.4 m diameter; booster 3.05 m diameter and ~31 m height follow ESA, not the understated OSM booster height=27. Exhibit cladding, fairing profile, service arms, lettering, plinth and mast buttress are photo estimates. Mast shifted toward rocket from OSM center 10.5 m to 6.95 m, enlarged to 3.6 × 2.5 m and service ties widened to 0.26 m after independent photo review; original OSM replacement rings retained plus photo-estimated mast coverage. Park and adjoining museum excluded. Rotation baked once from mapped booster axes.',
};
