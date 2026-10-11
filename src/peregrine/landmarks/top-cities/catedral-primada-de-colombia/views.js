const a = 32*Math.PI/180;
const p = ([u,y,v]) => [u*Math.cos(a)-v*Math.sin(a),y,u*Math.sin(a)+v*Math.cos(a)];
export const VIEWS = {
  overview: [p([-95,65,-85]),p([12,20,2])],
  facade: [p([-115,27,2]),p([-18,24,2])],
  street: [p([-72,3,7]),p([-20,22,2])],
  back: [p([112,35,65]),p([25,19,2])],
  roof: [p([35,145,65]),p([20,0,2])],
  detail: [p([-43,34,-25]),p([-17,34,-11])],
  north: [p([20,10,-80]),p([20,12,-10])],
};
