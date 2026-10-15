import { world } from "./palais-de-chaillot-plan.js";
const view=(a,c)=>[world(...a),world(...c)];
export const VIEWS={
 overview:view([280,235,410],[0,18,73]),
 facade:view([3,72,480],[3,24,8]),
 roof:view([0,620,125],[0,0,90]),
 back:view([-40,130,-350],[0,24,20]),
 entrance:view([4,23,105],[3,28,0]),
 detail:view([82,48,92],[93,25,18]),
};
