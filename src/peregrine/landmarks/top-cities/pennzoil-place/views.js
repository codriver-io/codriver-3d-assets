// Cameras in model metres (+x east, +y up, +z south). The slot axis is the
// 304°/124° throat; the classic silhouette is that view, both 45° crowns
// and the slit in one frame.
import { solve } from './pennzoil-place-plan.js';

const S = solve();
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

function eye(plan, bearing, dist, y) {
  const r = bearing * Math.PI / 180;
  return [plan[0] + Math.sin(r) * dist, y, plan[1] - Math.cos(r) * dist];
}

const throat = mid(S.throat.a, S.throat.b);
const laStreet = mid(S.louisiana.street.a, S.louisiana.street.b);
const miStreet = mid(S.milam.street.a, S.milam.street.b);
const southOuter = mid(S.south.outerA, S.south.outerB);

export const VIEWS = {
  overview: [eye(throat, 124, 230, 62), [throat[0], 78, throat[1]]],
  facade: [eye(laStreet, S.louisiana.streetBearing, 155, 24), [laStreet[0], 62, laStreet[1]]],
  roof: [eye([0, 0], 150, 70, 280), [0, 30, 0]],
  slot: [eye(throat, 124, 48, 14), [throat[0], 55, throat[1]]],
  atrium: [eye(southOuter, 170, 42, 4), [southOuter[0], 16, southOuter[1]]],
  back: [eye(miStreet, S.milam.streetBearing, 155, 24), [miStreet[0], 62, miStreet[1]]],
};
