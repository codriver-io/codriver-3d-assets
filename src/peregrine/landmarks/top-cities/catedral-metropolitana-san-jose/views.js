import { world } from './catedral-metropolitana-san-jose-kit.js';
const view = (eye, target) => [world(eye), world(target)];
export const VIEWS = {
  overview: view([-80, 55, 115], [1, 13, 4]),
  facade: view([3.5, 14, 110], [3.5, 16, 37]),
  street: view([44, 4, 90], [3.5, 13, 30]),
  rear: view([65, 38, -96], [-1, 9, -6]),
  roof: view([50, 115, 70], [0, 7, 0]),
  detail: view([-18, 24, 67], [-2, 25, 37]),
  portico: view([25, 5, 68], [3.5, 7, 42]),
  top: view([0, 145, 0], [0, 0, 0]),
};
