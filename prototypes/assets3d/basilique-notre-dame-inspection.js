import { notreDamePoint } from '../../src/peregrine/landmarks/basilique-notre-dame-config.js';

export function updateNotreDameClipping(camera, controls) {
  // A centimetre near plane loses ~0.13 m of 24-bit depth precision at 150 m.
  // Follow orbit/dolly distance so stone relief stays distinct even when far
  // away, while preserving close inspection.
  const distance=camera.position.distanceTo(controls.target);
  camera.near=Math.max(0.1,distance/200);
  camera.far=Math.max(500,distance+250);
  camera.updateProjectionMatrix();
}

export function fitNotreDame(camera, controls, view) {
  const views = {
    overview: [[-100,90,-105],[0,24,44]],
    facade: [[0,32,-150],[0,30,0]],
    roof: [[65,165,-15],[0,12,52]],
    rear: [[75,63,190],[0,22,83]],
  };
  const [eye,target]=views[view]||views.overview;
  camera.position.set(...notreDamePoint(...eye));controls.target.set(...notreDamePoint(...target));
  controls.update();
  updateNotreDameClipping(camera,controls);
}
