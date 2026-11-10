import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {HOUSES} from './houses.js';
import {surfaces} from './parts.js';
const a=6.1*Math.PI/180;
const P=(u,v,y)=>[u*Math.sin(a)-v*Math.cos(a),y,-u*Math.cos(a)-v*Math.sin(a)];
const F=[Math.cos(a),0,Math.sin(a)],B=F.map(v=>-v),R=[Math.sin(a),0,-Math.cos(a)],L=R.map(v=>-v);
export function create({detail='near'}={}){
 const near=detail==='near',map=m=>near?m:({trim:'cream',shutter:'glass',iron:'glass',brick:'roof'}[m]||m);
 const b=assetBuilder({...SPEC,palette:PALETTES.light},detail),S=surfaces(b,map);
 const face=(m,u0,u1,y0,y1,v,front=true)=>{if(u1-u0<0.001||y1-y0<0.001)return;S.quad(m,P(u0,v,y0),P(u1,v,y0),P(u1,v,y1),P(u0,v,y1),front?F:B);};
 const top=(m,u0,u1,v0,v1,y)=>S.quad(m,P(u0,v0,y),P(u1,v0,y),P(u1,v1,y),P(u0,v1,y),[0,1,0]);
 function side(m,u,v0,v1,y0,y1,right){S.quad(m,P(u,v0,y0),P(u,v1,y0),P(u,v1,y1),P(u,v0,y1),right?R:L);}
 function aperture(h,c,y0,y1,w,front=true,shutters=true,door=false){
  const v=front?h.v:h.v+h.depth,sgn=front?1:-1,m=h.paint,trim='trim',u0=c-w/2,u1=c+w/2;
  const vf=v,vg=v+sgn*0.26,e=.10;
  // Aperture and frame occupy disjoint polygons, with no wall under glass or shutters.
  face(trim,u0-e,u1+e,y0-e,y0,vf,front);face(trim,u0-e,u1+e,y1,y1+e,vf,front);
  face(trim,u0-e,u0,y0,y1,vf,front);face(trim,u1,u1+e,y0,y1,vf,front);
  S.quad(trim,P(u0,vf,y0),P(u0,vg,y0),P(u0,vg,y1),P(u0,vf,y1),R);
  S.quad(trim,P(u1,vg,y0),P(u1,vf,y0),P(u1,vf,y1),P(u1,vg,y1),L);
  top(trim,u0,u1,vf,vg,y0);S.quad(trim,P(u0,vf,y1),P(u1,vf,y1),P(u1,vg,y1),P(u0,vg,y1),[0,-1,0]);
  const cols=near&&!door?2:1,rows=near&&!door?3:1,bar=.035;
  if(door&&front){
   const spring=y1-w/2;
   face('glass',u0,u1,y0,spring,vg,front);
   const count=near?12:6;
   for(let k=0;k<count;k++){
    const xa=u0+w*k/count,xb=u0+w*(k+1)/count;
    const arch=x=>spring+Math.sqrt(Math.max(0,(w/2)**2-(x-c)**2));
    S.quad('glass',P(xa,vg,spring),P(xb,vg,spring),P(xb,vg,arch(xb)),P(xa,vg,arch(xa)),F);
    S.quad(h.paint,P(xa,vg,arch(xa)),P(xb,vg,arch(xb)),P(xb,vg,y1),P(xa,vg,y1),F);
   }
  }else for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const xa=u0+i*w/cols,xb=u0+(i+1)*w/cols,ya=y0+j*(y1-y0)/rows,yb=y0+(j+1)*(y1-y0)/rows;face('glass',xa,xb-(i<cols-1?bar:0),ya,yb-(j<rows-1?bar:0),vg,front);if(i<cols-1)face(trim,xb-bar,xb,ya,yb,vg,front);if(j<rows-1)face(trim,xa,xb,yb-bar,yb,vg,front);}
  if(shutters){const sw=.39;face('shutter',u0-e-sw,u0-e,y0,y1,vf,front);face('shutter',u1+e,u1+e+sw,y0,y1,vf,front);
   
  }
 }
 function elevation(h,front=true){
  const eave=h.height-h.roofHeight,v=front?h.v:h.v+h.depth,n=front?h.bays:Math.max(2,h.bays),cell=(h.u1-h.u0)/n;
  for(let row=0;row<h.floors;row++){
   const ya=eave*row/h.floors,yb=eave*(row+1)/h.floors,wy0=ya+(row===0?.4:.7),wy1=yb-.65,w=front?1.0:.85;
   for(let col=0;col<n;col++){
    const x0=h.u0+col*cell,x1=x0+cell,c=(x0+x1)/2,door=row===0&&col===0,sh=front&&row>0,spread=w/2+.1+(sh?.39:0),lo=door?.06:wy0,hi=wy1;
    face(h.paint,x0,c-spread,ya,yb,v,front);face(h.paint,c+spread,x1,ya,yb,v,front);
    face(h.paint,c-spread,c+spread,ya,lo-.1,v,front);face(h.paint,c-spread,c+spread,hi+.1,yb,v,front);
    // Stucco beside the frame, outside shutter height.
    if(sh){face(h.paint,c-spread,c-w/2-.1,lo-.1,lo,v,front);face(h.paint,c+w/2+.1,c+spread,lo-.1,lo,v,front);face(h.paint,c-spread,c-w/2-.1,hi,hi+.1,v,front);face(h.paint,c+w/2+.1,c+spread,hi,hi+.1,v,front);}
    aperture(h,c,lo,hi,w,front,sh,door);
   }
  }
 }
 for(const [houseIndex,h] of HOUSES.entries()){
  const u0=h.u0,u1=h.u1,v=h.v,d=h.depth,e=h.height-h.roofHeight,uc=(u0+u1)/2;
  elevation(h,true);elevation(h,false);
  const prev=HOUSES[houseIndex-1],next=HOUSES[houseIndex+1];
  const joined=(n,edge)=>n&&Math.abs((edge==='left'?n.u1:n.u0)-(edge==='left'?u0:u1))<.04;
  for(const [n,u,right,edge] of [[prev,u0,false,'left'],[next,u1,true,'right']]){
   if(!joined(n,edge))side(h.paint,u,v,v+d,0,e,right);
   else{
    if(e>n.height)side(h.paint,u,v,v+Math.min(d,n.depth),n.height,e,right);
    if(d>n.depth+.03)side(h.paint,u,v+n.depth,v+d,0,e,right);
   }
  }
  const ridge=h.height,vr=v+d/2,hip=h.roof==='hipped'?Math.min((u1-u0)*.27,2):0;
  S.quad('roof',P(u0,v,e),P(u1,v,e),P(u1-hip,vr,ridge),P(u0+hip,vr,ridge),[0,1,0]);
  S.quad('roof',P(u1,v+d,e),P(u0,v+d,e),P(u0+hip,vr,ridge),P(u1-hip,vr,ridge),[0,1,0]);
  if(hip){S.quad('roof',P(u0,v,e),P(u0+hip,vr,ridge),P(u0,v+d,e),P(u0,v+d,e),[0,1,0]);S.quad('roof',P(u1,v+d,e),P(u1-hip,vr,ridge),P(u1,v,e),P(u1,v,e),[0,1,0]);}
  else{if(!joined(prev,'left')||prev.height<e)S.quad(h.paint,P(u0,v,e),P(u0,v+d,e),P(u0,vr,ridge),P(u0,vr,ridge),L);if(!joined(next,'right')||next.height<e)S.quad(h.paint,P(u1,v+d,e),P(u1,v,e),P(u1,vr,ridge),P(u1,vr,ridge),R);}
  // The crenellated-curved Dutch street gable of 95 is the key small silhouette.
  if(h.address==='95'){
   const outline=[[u0,e],[u0+.25,e+1.0],[u0+1.1,e+1.0],[u0+1.4,e+1.55],[uc-.7,e+2.0],[uc,e+2.25],[uc+.7,e+2.0],[u1-1.4,e+1.55],[u1-1.1,e+1.0],[u1-.25,e+1.0],[u1,e]];
   for(let i=0;i<outline.length-1;i++){const [x,y]=outline[i],[xx,yy]=outline[i+1];S.quad(h.paint,P(x,v,e-.02),P(xx,v,e-.02),P(xx,v,yy),P(x,v,y),F);S.quad(h.paint,P(x,v+.25,y),P(xx,v+.25,yy),P(xx,v+.25,e-.02),P(x,v+.25,e-.02),B);S.quad('trim',P(x,v,y),P(xx,v,yy),P(xx,v+.25,yy),P(x,v+.25,y),[0,1,0]);}
  }
  // Cornice replaces a narrow exterior strip above the wall, no cap slab.
  for(const [cv,front] of [[v,true],[v+d,false]]){
   if(front&&h.address==='95')continue;
   face('trim',u0,u1,e,e+.16,cv,front);face('trim',u0,u1,e,e+.16,cv+(front?.18:-.18),!front);
   top('trim',u0,u1,cv,cv+(front?.18:-.18),e+.16);
   side('trim',u0,cv,cv+(front?.18:-.18),e,e+.16,false);side('trim',u1,cv,cv+(front?.18:-.18),e,e+.16,true);
  }
  if(['93','99'].includes(h.address)){
   const y=e/h.floors+.35,half=1.45,off=.75;
   top('iron',uc-half,uc+half,v-off,v,y);
   for(const u of [uc-half,uc+half]){b.bar(map('iron'),P(u,v,y),P(u,v-off,y),.08);b.bar(map('iron'),P(u,v,y-.65),P(u,v-off,y),.07);}
   for(let k=0;k<=10;k++){let u=uc-half+2*half*k/10;b.bar(map('iron'),P(u,v-off,y),P(u,v-off,y+.9),.035);}
   b.bar(map('iron'),P(uc-half,v-off,y+.9),P(uc+half,v-off,y+.9),.04);
   for(const u of [uc-half,uc+half])b.bar(map('iron'),P(u,v-off,y+.9),P(u,v,y+.9),.04);
  }
  // Chimney emerges from the ridge and continues to a restrained cap.
  if(near||['83','95','101','107'].includes(h.address)){
   const y=ridge-.25,cy=ridge+.7,x=uc+.5,z=vr;
   const g=[P(x-.3,z-.3,y),P(x+.3,z-.3,y),P(x+.3,z+.3,y),P(x-.3,z+.3,y)];
   for(let i=0;i<4;i++){let j=(i+1)%4;S.quad('brick',g[i],g[j],[g[j][0],cy,g[j][2]],[g[i][0],cy,g[i][2]],[(g[i][0]+g[j][0])/2-P(x,z,0)[0],0,(g[i][2]+g[j][2])/2-P(x,z,0)[2]]);}top('brick',x-.3,x+.3,z-.3,z+.3,cy);
  }
 }
 // Narrow mapped gaps contain simple ground-level boundary walls and gates; no invented houses.
 for(let i=0;i<HOUSES.length-1;i++){const h=HOUSES[i],j=HOUSES[i+1];if(j.u0-h.u1>1){face('cream',h.u1,h.u1+.6,0,1.6,h.v);face('cream',j.u0-.6,j.u0,0,1.6,h.v);face('glass',h.u1+.6,j.u0-.6,0,1.5,h.v);}}
 S.flush();return b.finish();
}
