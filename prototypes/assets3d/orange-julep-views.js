// Local inspector only. Coordinates match the metric east/up/south asset frame.
export function orangeJulepView(view,camera,controls) {
  const views={
    overview:[[40,29,37],[14,6,0]],
    facade:[[29,6,-21],[0,5,0]],
    roof:[[21,37,-17],[0,5,0]],
    structure:[[-22,4,18],[0,4,0]],
    signage:[[42,6,10],[49,4.5,1]],
  };
  const [position,target]=views[view]||views.facade;
  camera.position.set(...position);controls.target.set(...target);
}
