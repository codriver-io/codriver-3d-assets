// Saint-Étienne and the eighteenth-century municipal abbey ensemble, Caen.
export const SPEC = {
 id: 'abbaye-aux-hommes', name: 'Abbaye aux Hommes (Saint-Étienne and Hôtel de Ville)', kind: 'building',
 ready: true, origin: [-0.3731,49.1818], height: 82, padM: 175,
 frontageBearing: 275,
};
export const PALETTES = {
 light: { stone:'#d4c6a3', trim:'#e8dab9', recess:'#353733', glass:'#556366', roof:'#4d535f', tile:'#665e55', glow:'#596b72' },
 dark: { stone:'#777263', trim:'#958d75', recess:'#20272b', glass:'#293a44', roof:'#303d4a', tile:'#47433f', glow:'#d8b77b' },
};
export const MANIFEST = {
 elevationDatum: 'Rigid local y=0 at the west-front pavement; no sea-level or terrain height baked into the model.',
 attribution: 'Original procedural mesh. Mapped footprint © OpenStreetMap contributors (ODbL 1.0); https://www.openstreetmap.org/copyright',
 note: 'North/south west towers 82/80 m and front gable 27.30 m follow the OSM part tags and published church dimensions. All footprint rings are OSM. Roofs, lantern height, flying buttresses, town-hall elevation, chapels and ornament are photo-based estimates. Detached Palais Ducal is included. Flat asset only; both app placement modes require separate integration checks.',
};
