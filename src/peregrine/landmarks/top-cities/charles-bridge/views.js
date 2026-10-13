import { point, LENGTH, TOWERS, towerPoint } from './charles-bridge-site.js';
export const VIEWS={
 overview:[[430,180,390],[0,15,0]],
 facade:[[5,60,620],[0,15,0]],
 back:[[-20,65,-620],[0,16,0]],
 roof:[[30,590,115],[0,10,0]],
 deck:[point(180,0,17),point(LENGTH-40,0,20)],
 underside:[point(225,62,4),point(225,0,7)],
 tower:[towerPoint(TOWERS.old,-72,35,50),towerPoint(TOWERS.old,0,36,0)],
 lesser:[towerPoint(TOWERS.gate,65,31,44),towerPoint(TOWERS.gate,0,33,-5)],
 detail:[point(215,25,24),point(215,4,15)],
};
