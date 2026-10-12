// Present exterior, without temporary roof-restoration scaffolding.
import { FOOTPRINTS } from './footprint.js';
export const SPEC = {
  id: 'texas-state-capitol', name: 'Texas State Capitol', kind: 'building', ready: true,
  origin: [-97.740348684, 30.274671156], // mapped dome ring centroid
  height: 92.2447, // 302.64 ft, south entrance grade to Goddess star
  padM: 92, frontageBearing: 198, rotationDeg: -18,
  terrainPad: {
    rings: [FOOTPRINTS[0]], datum: 'median', featherM: 12,
    refs: [[-97.74047,30.27440],[-97.74022,30.27507],[-97.74102,30.27487],[-97.73962,30.27450]],
  },
};
export const PALETTES = {
  light: { stone: '#b99783', roof: '#4a5957', light: '#35444a', statue: '#ece9dc', lamp: '#404b4e', seal: '#526e78' },
  dark: { stone: '#a88f74', roof: '#313d40', light: '#e8bb75', statue: '#f0deac', lamp: '#ffdf9f', seal: '#7c8b91' },
};
export const MANIFEST = {
  elevationDatum: 'Rigid local y=0 is south entrance ground grade. No absolute altitude, DEM or Mercator stretch is baked in.',
  attribution: 'Original procedural geometry. Mapped footprint © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright',
  note: 'Italian Renaissance Revival Capitol completed in 1888, with the white 1986 Goddess replica. The dome is painted to match Sunset Red granite (SPB 2010 restoration). Height 302.64 ft; mapped envelope approximately 167 by 90 m. Intermediate stage heights, column counts, dome profile, window spacing, mansards and sculpture are photographic estimates; underground extension, grounds monuments and temporary roof work excluded.',
};
