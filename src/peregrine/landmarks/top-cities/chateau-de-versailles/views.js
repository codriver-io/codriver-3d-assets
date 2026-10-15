import { world } from "./chateau-de-versailles-plan.js";
const view=(e,t)=>[world(...e),world(...t)];
export const VIEWS={
 overview:view([470,230,320],[65,12,-12]),
 facade:view([340,65,-9],[40,13,-9]),
 garden:view([-410,145,270],[55,13,0]),
 roof:view([260,620,130],[65,0,-10]),
 entrance:view([205,9,-9],[35,15,-9]),
 detail:view([82,37,-9],[16,17,-9]),
 chapel:view([180,65,-140],[106,27,-78]),
};
