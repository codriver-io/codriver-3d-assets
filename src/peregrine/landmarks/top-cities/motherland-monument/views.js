const turn = ([x,y,z]) => { const a=123.5*Math.PI/180; return [x*Math.cos(a)+z*Math.sin(a),y,-x*Math.sin(a)+z*Math.cos(a)]; };
const view = (eye,target) => [turn(eye),turn(target)];
export const VIEWS = {
  overview: view([125,95,185],[0,47,0]), facade: view([0,61,170],[0,59,0]),
  rear: view([-90,78,-180],[0,53,0]), roof: view([70,200,90],[0,25,0]),
  detail: view([10,80,59],[0,78,0]), street: view([-20,6,165],[0,52,0]),
};
