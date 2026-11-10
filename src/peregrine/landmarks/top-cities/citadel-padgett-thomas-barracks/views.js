const a=-24.6*Math.PI/180,P=(u,v,y)=>[u*Math.sin(a)+v*Math.cos(a),y,-u*Math.cos(a)+v*Math.sin(a)];
export const VIEWS={overview:[P(-100,135,65),P(0,0,12)],facade:[P(0,130,22),P(0,25,15)],back:[P(0,-135,35),P(0,0,12)],roof:[P(0,0,170),P(0,0,0)],street:[P(-48,62,2.5),P(0,28,16)],detail:[P(0,14,10),P(0,30,23)],courtyard:[P(-20,-12,6),P(0,22,13)]};
