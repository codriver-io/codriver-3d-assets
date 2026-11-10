const a=8*Math.PI/180,P=(u,v,y)=>[u*Math.cos(a)-v*Math.sin(a),y,u*Math.sin(a)+v*Math.cos(a)];
export const VIEWS={overview:[P(-320,380,230),P(0,-45,6)],facade:[P(0,210,30),P(0,10,8)],back:[P(30,-380,140),P(0,-70,7)],roof:[P(0,-40,430),P(0,-40,0)],street:[P(-70,82,5.5),P(0,32,9)],detail:[P(38,76,30),P(0,5,12)],concourse:[P(-190,-175,36),P(-70,-120,7)]};
