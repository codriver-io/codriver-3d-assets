import { point,TOWERS,START,END } from './skybridge-vancouver-profile.js';
export const VIEWS={
 northwest:[point(START+75,70,62),point(START,0,29)],
 southeast:[point(END-120,120,55),point(END-20,0,12)],
 overview:[point(80,700,300),point(90,0,38)],
 facade:[point(-30,-510,160),point(0,0,62)],
 roof:[point(130,170,1100),point(140,0,0)],
 deck:[point(-480,0,60),point(-100,0,80)],
 underside:[point(-80,105,24),point(TOWERS[0],0,46)],
 tower:[point(TOWERS[0]-90,90,85),point(TOWERS[0],0,90)],
};
