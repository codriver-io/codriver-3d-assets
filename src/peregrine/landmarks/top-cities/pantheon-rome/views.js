import { plan } from './geometry.js';
const view = (eye, target) => [plan(...eye), plan(...target)];
export const VIEWS = {
  overview: view([-80,65,-110], [0,18,-8]),
  facade: view([0,21,-115], [0,13,-30]),
  back: view([70,46,95], [0,20,2]),
  roof: view([55,112,-62], [0,23,-5]),
  street: view([-28,4,-88], [0,12,-39]),
  detail: view([-25,20,-66], [-5,15,-45]),
};
