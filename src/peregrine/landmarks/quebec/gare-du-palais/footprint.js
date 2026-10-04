// OpenStreetMap geometry retrieved 2026-10-04 (Overpass through the shared helper). © OpenStreetMap contributors, ODbL 1.0.
// Rings of [lng, lat] whose provider extrusions this landmark replaces: the station (way/33893247 and its three building:part ways).
// Not listed, because the model does not draw them: the 6-storey government office way/103861185 (east), the service building way/163393183 (west), the Edifice Jean-Lesage (way/163392584, 130 m north).

// way/33893247: Gare du Palais (building=train_station, roof:shape=mansard): the outline of the whole station
const OUTER = [
  [-71.2136989, 46.8180077],
  [-71.2137712, 46.8176205],
  [-71.2137625, 46.8176034],
  [-71.2136702, 46.8176318],
  [-71.2135694, 46.8174605],
  [-71.2137207, 46.8174167],
  [-71.2137272, 46.8173862],
  [-71.2138335, 46.8173534],
  [-71.2139064, 46.8173349],
  [-71.2139454, 46.8173516],
  [-71.2141009, 46.8173065],
  [-71.2141632, 46.8174087],
  [-71.2146993, 46.8174551],
  [-71.2146682, 46.8176236],
  [-71.214061, 46.8175711],
  [-71.2140443, 46.8176616],
  [-71.2139713, 46.8180364],
  [-71.2137761, 46.8180162],
  [-71.2136989, 46.8180077]
];

// way/1489885118: building:part, 2 levels, hipped: the north wing toward the tracks
const NORTH_WING = [
  [-71.2139713, 46.8180364],
  [-71.2137761, 46.8180162],
  [-71.2136989, 46.8180077],
  [-71.2137712, 46.8176205],
  [-71.2140716, 46.8175083],
  [-71.214061, 46.8175711],
  [-71.2140443, 46.8176616],
  [-71.2139713, 46.8180364]
];

// way/1489885117: building:part, 2 levels, hipped: the west wing
const WEST_WING = [
  [-71.2146682, 46.8176236],
  [-71.214061, 46.8175711],
  [-71.2140716, 46.8175083],
  [-71.214198, 46.8174711],
  [-71.2141632, 46.8174087],
  [-71.2146993, 46.8174551],
  [-71.2146682, 46.8176236]
];

// way/1489885116: building:part, 4 levels, hipped: the main block with the hall, the towers and the clock
const MAIN = [
  [-71.2136702, 46.8176318],
  [-71.2135694, 46.8174605],
  [-71.2137207, 46.8174167],
  [-71.2137272, 46.8173862],
  [-71.2138335, 46.8173534],
  [-71.2139064, 46.8173349],
  [-71.2139454, 46.8173516],
  [-71.2141009, 46.8173065],
  [-71.2141632, 46.8174087],
  [-71.214198, 46.8174711],
  [-71.2140716, 46.8175083],
  [-71.2137712, 46.8176205],
  [-71.2137625, 46.8176034],
  [-71.2136702, 46.8176318]
];

export const FOOTPRINTS = [OUTER, NORTH_WING, WEST_WING, MAIN];
export const OSM_WAYS = ['way/33893247', 'way/1489885118', 'way/1489885117', 'way/1489885116'];
