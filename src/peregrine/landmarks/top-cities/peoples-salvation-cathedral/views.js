import { plan } from './geometry.js';
export const VIEWS = {
  overview: [plan(-190,150,205),plan(0,52,0)],
  facade: [plan(-238,90,-3),plan(0,59,-3)],
  back: [plan(205,115,-170),plan(12,51,0)],
  roof: [plan(-85,280,100),plan(0,45,0)],
  street: [plan(-167,8,32),plan(-28,51,-3)],
  detail: [plan(-108,26,10),plan(-52,18,-3)],
  crest: [plan(-108,80,22),plan(-44,60,-3)],
  top: [[0,335,0],[0,0,0]],
};
