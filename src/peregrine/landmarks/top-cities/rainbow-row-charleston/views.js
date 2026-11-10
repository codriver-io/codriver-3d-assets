const a=6.1*Math.PI/180;
const P=(u,v,y)=>[u*Math.sin(a)-v*Math.cos(a),y,-u*Math.cos(a)-v*Math.sin(a)];
export const VIEWS={overview:[P(-56,-85,38),P(0,3,6)],facade:[P(0,-95,10),P(0,0,7)],back:[P(0,65,23),P(0,4,7)],roof:[P(0,5,130),P(0,5,0)],street:[P(-34,-20,2.4),P(0,0,8)],detail:[P(10,-19,6),P(10,0,6)]};
