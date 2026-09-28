import { habitatPoint } from '../../src/peregrine/landmarks/habitat-67-config.js';

export function habitat67View(camera, controls, view, aspect) {
  const wide = Math.max(1, 1.6 / aspect);
  const poses = {
    overview: [[-170 * wide, 280 * wide, 175 * wide], [0, 0, 17]],
    facade: [[-30, -300 * wide, 58 * wide], [0, -9, 18]],
    river: [[10, 310 * wide, 74 * wide], [0, 0, 17]],
    roof: [[0, 15, 440 * wide], [0, 0, 0]],
    terraces: [[-110, -70, 47], [-99, -12, 19]],
    voids: [[-93, 86, 15], [-99, 0, 20]],
  };
  const [from, to] = poses[view] || poses.overview;
  camera.position.set(...habitatPoint(...from)); controls.target.set(...habitatPoint(...to));
  controls.update();
}
