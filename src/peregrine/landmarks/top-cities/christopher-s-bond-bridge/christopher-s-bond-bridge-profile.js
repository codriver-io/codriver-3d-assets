import { createBridgeProfile } from '../../bridge-profile.js';
import { SPEC, PALETTES } from './config.js';
import alignment from './christopher-s-bond-bridge-alignment.js';
export const DECK_H = 25;
export const MAIN_SPAN = 167.64;
export const BACK_SPAN = 137.6172;
export const DECK_HALF = 22.098;
export const RAMP = 350;
export const ROAD_EDGES = [[-20.5, -0.55], [0.55, 20.5]];
// Station increases south to north. +d is east (driver's right northbound).
// Both carriageways are averaged; shoulders absorb their asymmetric offsets.
const stationFrame = createBridgeProfile({ ...SPEC, width: DECK_HALF * 2, roadEdges: ROAD_EDGES,
  centerline: alignment.centerline, profile: ({ length }) => [[0, 0], [length, 0]] });
export const TOWER_S = stationFrame.stationAt(SPEC.origin);
export const SOUTH_STAY_END = TOWER_S - MAIN_SPAN;
export const NORTH_STAY_END = TOWER_S + BACK_SPAN;
export const STRUCTURE_START = stationFrame.stationAt([-94.5648057,39.12103705]);
export const STRUCTURE_END = stationFrame.stationAt([-94.56690135,39.1255738]);
export const PROFILE = createBridgeProfile({
  ...SPEC, modelDir: 'bridges', width: 2 * DECK_HALF, palette: PALETTES.light,
  centerline: alignment.centerline, roadEdges: ROAD_EDGES,
  profile: ({ length }) => [[0, 'start'], [SOUTH_STAY_END, DECK_H], [NORTH_STAY_END, DECK_H], [length, 'end']],
});
