// Cameras are transformed from the hall frame into east/up/south metres.
const a=41*Math.PI/180;
const p=([u,y,v])=>[u*Math.cos(a)+v*Math.sin(a),y,-u*Math.sin(a)+v*Math.cos(a)];
const view=(e,t)=>[p(e),p(t)];
export const VIEWS={
  overview:view([105,70,-150],[0,13,-8]),
  facade:view([35,21,-111],[0,17,-51]),
  back:view([-100,50,145],[0,11,6]),
  roof:view([15,160,5],[0,0,0]),
  street:view([66,7,-88],[0,10,-43]),
  detail:view([20,36,-84],[0,29,-53]),
};
