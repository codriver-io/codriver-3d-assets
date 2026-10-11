// Inspector cameras, [eye, target] in the model's metres (+x east, +y up, +z south). The island grid is turned 45.95 deg off north
// (u along bearing 135.95 toward the lighthouse, w toward the south-west front), so cameras are placed in that frame.
const B = (135.95 * Math.PI) / 180, UX = Math.sin(B), UZ = -Math.cos(B), WX = -UZ, WZ = UX;
const at = (u, y, w) => [Math.round(u * UX + w * WX), y, Math.round(u * UZ + w * WZ)];
const view = (eye, target) => [at(...eye), at(...target)];
export const VIEWS = {
  overview: view([20, 70, 230], [-20, 8, -5]), // from the south-west, over San Francisco Bay
  facade: view([-5, 14, 100], [-5, 9, 0]), // the south-west front of the cellhouse
  roof: view([-20, 190, 80], [-20, 5, -2]),
  lighthouse: view([75, 26, 45], [69, 15, -11]),
  tower: view([-120, 12, 45], [-136, 12, -9]), // the water tower from the yard
  ruins: view([88, 14, 10], [88, 5, -40]), // the Warden's House ruins
  back: view([0, 28, -120], [-10, 6, -5]), // the north-east (dock) side
  yard: view([-70, 24, 90], [-90, 4, 14]),
};
