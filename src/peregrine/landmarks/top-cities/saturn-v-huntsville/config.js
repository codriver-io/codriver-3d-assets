// Anchor: OSM node 3091286888. Rotation follows the adjacent Davidson Center short edge
// (-86.6558520,34.7107332) -> (-86.6559017,34.7108105); rocket roll phase is estimated.
// Vertical 1999 replica, not SA-500D inside Davidson Center. NASA: 111 m, 33 ft diameter.
export const SPEC = {
  id: 'saturn-v-huntsville', name: 'Saturn V (U.S. Space & Rocket Center)', kind: 'building',
  ready: true, origin: [-86.6559120, 34.7110991], height: 111, padM: 12,
  footprintless: true, frontageBearing: 332.0, rotationRad: 0.4886921906, radius: 5.03,
};
export const PALETTES = {
  light: { white: '#e5e3db', black: '#202326', support: '#c2c2b8', metal: '#777b7b', red: '#893b35', blue: '#354757', light: '#dce3da' },
  dark: { white: '#b6c2c2', black: '#171b21', support: '#818b91', metal: '#69777e', red: '#69403e', blue: '#293c50', light: '#e7ddc1' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local forecourt grade y=0; no absolute elevation or terrain baked in.',
  attribution: 'Original procedural geometry; geographic anchor checked against OpenStreetMap contributors (ODbL 1.0), https://www.openstreetmap.org/copyright; photos used only as references, no textures.',
  note: '1999 vertical outdoor replica only. NASA full-scale height 111 m and main diameter 10.06 m; display support height, stage elevations, fins, roll-pattern phase, markings and engine profiles estimated from photographs. Museum and horizontal rocket excluded.',
};
