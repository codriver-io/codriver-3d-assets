import { lngToMercX, latToMercY, mercStretch, mercXToLng, mercYToLat } from '../facade/geo.js';

export const HABITAT = {
  id: 'habitat-67', name: 'Habitat 67', origin: [-73.54368, 45.49990],
  bearing: 4, osmWay: 440195613,
  // Komocki, PCI Journal (1967): 39 ft 6 in × 17 ft 6 in × 10 ft.
  module: [12.0396, 5.334, 3.048],
  datum: 'Local flat-map ground = 0 m; plaza underside touches ground. No sea-level elevation or drivable surface.',
};
export const HABITAT_PALETTES = {
  light: { concrete: '#a39b8c', stone: '#8a8274', glass: '#35484c', rail: '#53554c', roof: '#a99a84', steel: '#6b7953' },
  dark: { concrete: '#7a858b', stone: '#636d76', glass: '#425967', rail: '#a3adb3', roof: '#6d7a82', steel: '#4e655a' },
};
export const HABITAT_STRETCH = mercStretch(HABITAT.origin[1]);
export const HABITAT_MERCATOR = [lngToMercX(HABITAT.origin[0]), -latToMercY(HABITAT.origin[1])];
const theta = HABITAT.bearing * Math.PI / 180, s = Math.sin(theta), c = Math.cos(theta);
// Authoring u follows the long axis north; v faces the river/east.
export const habitatPoint = (u, v, y = 0) => [u * s + v * c, y, -u * c + v * s];
export function habitatLocal(lng, lat) {
  return [(lngToMercX(lng) - HABITAT_MERCATOR[0]) / HABITAT_STRETCH,
    (-latToMercY(lat) - HABITAT_MERCATOR[1]) / HABITAT_STRETCH];
}
export function habitatLngLat(x, z) {
  return [mercXToLng(HABITAT_MERCATOR[0] + x * HABITAT_STRETCH), mercYToLat(-HABITAT_MERCATOR[1] - z * HABITAT_STRETCH)];
}
