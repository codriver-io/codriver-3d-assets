import { LENGTH, place } from './kilden-performing-arts-centre-plan.js';

const eye = (along, depth, y) => {
  const [x, z] = place(along, depth);
  return [x, y, z];
};
const at = (along, depth, y) => eye(along, depth, y);

// Cameras in metres. Negative depth is over the quay, west of the oak lip.
export const VIEWS = {
  overview: [eye(LENGTH * 0.48, -78, 32), at(LENGTH * 0.5, 18, 10)],
  facade: [eye(LENGTH * 0.5, -46, 8), at(LENGTH * 0.5, 16, 9)],
  rear: [eye(LENGTH * 0.46, 118, 24), at(LENGTH * 0.5, 40, 11)],
  roof: [eye(LENGTH * 0.2, 8, 78), at(LENGTH * 0.5, 30, 16)],
  entrance: [eye(LENGTH * 0.86, -24, 3.4), at(LENGTH * 0.86, 14, 5)],
  detail: [eye(LENGTH * 0.3, -18, 7), at(LENGTH * 0.32, 8, 11)],
  // On the quay, off the south end, so the profile is the curl rather than a view up into the soffit.
  south: [eye(LENGTH + 16, -28, 11), at(LENGTH * 0.62, 16, 9)],
};
