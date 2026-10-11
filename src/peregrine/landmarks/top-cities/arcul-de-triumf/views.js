const a = 20.305 * Math.PI / 180;
const point = ([x,y,z]) => [x*Math.cos(a)+z*Math.sin(a), y, -x*Math.sin(a)+z*Math.cos(a)];
const view = (eye, target) => [point(eye), point(target)];
export const VIEWS = {
  overview: view([37,30,48], [0,12,0]),
  facade: view([0,16,62], [0,12.5,0]),
  rear: view([-28,23,-48], [0,13,0]),
  roof: view([28,53,26], [0,17,0]),
  street: view([12,1.7,57], [0,12,0]),
  detail: view([13,19,23], [7.9,17.2,4.5]),
  passage: view([0,3,16], [0,11,0]),
};
