import { xyz } from './arctic-cathedral-parts.js';
const v=(eye,target)=>[xyz(...eye),xyz(...target)];
export const VIEWS = {
  overview:v([70,48,-68],[0.6,13,24]),
  facade:v([0.6,12,-85],[0.6,15,5]),
  back:v([35,24,106],[0.6,12,43]),
  roof:v([55,88,52],[0.6,10,25]),
  entrance:v([17,4,-37],[0.6,9,3]),
  detail:v([24,17,70],[0.6,13,47]),
  side:v([92,15,26],[0.6,13,26]),
  plan:v([0.6,125,26],[0.6,0,26]),
};
