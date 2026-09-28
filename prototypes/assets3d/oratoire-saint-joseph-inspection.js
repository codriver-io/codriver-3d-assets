import { oratoirePoint } from '../../src/peregrine/landmarks/oratoire-saint-joseph-config.js';
// Local inspector viewpoints in the building frame; exported GLBs already use
// the geographic east/up/south frame. Shared by source/export inspection.
export function fitOratoire(view, camera, controls) {
  const views = {
    overview: [[190,150,-285],[0,50,-65]],
    facade: [[2,60,-270],[0,65,-10]],
    roof: [[125,225,-110],[0,65,0]],
    approach: [[-50,22,-245],[0,45,-60]],
  };
  const [eye,target] = views[view] || views.overview;
  camera.near = .8; camera.updateProjectionMatrix();
  camera.position.set(...oratoirePoint(...eye)); controls.target.set(...oratoirePoint(...target)); controls.update();
}
