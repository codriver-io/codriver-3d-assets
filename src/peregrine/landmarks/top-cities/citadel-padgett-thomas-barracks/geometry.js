import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {surfaces} from './parts.js';
const a=-24.6*Math.PI/180;
const P=(u,v,y)=>[u*Math.sin(a)+v*Math.cos(a),y,-u*Math.cos(a)+v*Math.sin(a)];
const EDGES=[{T:[1,0],N:[0,1],d:31.3,span:92.6},{T:[-1,0],N:[0,-1],d:31.3,span:92.6},{T:[0,-1],N:[1,0],d:46.3,span:62.6},{T:[0,1],N:[-1,0],d:46.3,span:62.6}];
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),S=surfaces(b);
 const Q=(e,t,d,y)=>P(e.T[0]*t+e.N[0]*d,e.T[1]*t+e.N[1]*d,y);
 const N=(e,sign=1)=>{let q=P(e.N[0],e.N[1],0);return q.map(v=>v*sign);};
 const face=(m,e,t0,t1,y0,y1,d,sign=1)=>{if(t1-t0<.001||y1-y0<.001)return;S.quad(m,Q(e,t0,d,y0),Q(e,t1,d,y0),Q(e,t1,d,y1),Q(e,t0,d,y1),N(e,sign));};
 function top(m,e,t0,t1,d0,d1,y,up=1){S.quad(m,Q(e,t0,d0,y),Q(e,t1,d0,y),Q(e,t1,d1,y),Q(e,t0,d1,y),[0,up,0]);}
 function box(m,u,v,y,w,d,h){b.box(m,P(u,v,y),[w,h,d],114.6*Math.PI/180);}
 function pane(e,t0,t1,y0,y1,d,sign=1){
  if(!near){face('glass',e,t0,t1,y0,y1,d,sign);return;}
  const inset=d-sign*.24;
  face('glass',e,t0,t1,y0,y1,inset,sign);
  for(const [t,sg] of [[t0,1],[t1,-1]])S.quad('wall',Q(e,t,d,y0),Q(e,t,inset,y0),Q(e,t,inset,y1),Q(e,t,d,y1),P(e.T[0]*sg,e.T[1]*sg,0));
  top('wall',e,t0,t1,d,inset,y0);top('wall',e,t0,t1,d,inset,y1,-1);
  
 }
 function facade(e,t0,t1,d,y0,y1,rows=4){
  const count=Math.max(1,Math.round((t1-t0)/(near?3.4:6.8))),step=(t1-t0)/count;
  for(let row=0;row<rows;row++){const ya=y0+(y1-y0)*row/rows,yb=y0+(y1-y0)*(row+1)/rows,lo=ya+.65,hi=yb-.65;
   for(let k=0;k<count;k++){let l=t0+k*step,r=l+step,c=(l+r)/2,w=.95;
    face('wall',e,l,c-w/2,ya,yb,d);face('wall',e,c+w/2,r,ya,yb,d);face('wall',e,c-w/2,c+w/2,ya,lo,d);face('wall',e,c-w/2,c+w/2,hi,yb,d);pane(e,c-w/2,c+w/2,lo,hi,d);
   }
  }
 }
 // Thick arch spandrel, true opening. Top boundary can be a floor band or tower wall.
 function arch(e,c,width,y0,spring,cap,d0,d1){
  const r=width/2,l=c-r,rr=c+r,n=near?12:3;
  // Side piers; arch is clipped to this cell, leaving a visible clear aperture.
  for(const [d,sign] of [[d0,-1],[d1,1]]){
   for(let k=0;k<n;k++){const x=l+width*k/n,xx=l+width*(k+1)/n;
    const f=t=>spring+(width>4&&cap===7?r:Math.min(r,1.4))*Math.sqrt(Math.max(0,1-((t-c)/r)**2));
    S.quad('wall',Q(e,x,d,f(x)),Q(e,xx,d,f(xx)),Q(e,xx,d,cap),Q(e,x,d,cap),N(e,sign));
   }
  }
  for(let k=0;k<n;k++){const x=l+width*k/n,xx=l+width*(k+1)/n,f=t=>spring+(width>4&&cap===7?r:Math.min(r,1.4))*Math.sqrt(Math.max(0,1-((t-c)/r)**2));
   S.quad('wall',Q(e,x,d0,f(x)),Q(e,xx,d0,f(xx)),Q(e,xx,d1,f(xx)),Q(e,x,d1,f(x)),[0,-1,0]);
  }
 }
 // Four outer facades and flat wing roofs surrounding an empty quadrangle.
 for(const [index,e] of EDGES.entries()){
  const end=e.span/2,inner=e.d-10;
  if(index===0){facade(e,-end,-5.7,e.d,0,14.6);facade(e,5.7,end,e.d,0,14.6);}else facade(e,-end,end,e.d,0,14.6);
  top('roof',e,-end,end,inner,e.d,14.6);top('roof',e,-end,end,inner+.55,inner+2.9,14.42,-1);face('wall',e,-end,end,14.42,14.6,inner,-1);
  // Outer parapet and alternating merlons, closed and attached.
  for(const t of [-end,end]){} // corner turrets close wing intersections
  face('wall',e,-end,end,14.6,15.2,e.d);face('wall',e,-end,end,14.6,15.2,e.d-.55,-1);top('wall',e,-end,end,e.d-.55,e.d,15.2);
  const count=Math.round(e.span/2.1),step=e.span/count;
  for(let k=0;k<count;k++){const t=-end+(k+.5)*step,uv=[e.T[0]*t+e.N[0]*(e.d-.27),e.T[1]*t+e.N[1]*(e.d-.27)];
   if(index<2)box('wall',...uv,15.4,.95,.55,.7);else box('wall',...uv,15.4,.55,.95,.7);
  }
  // Courtyard arcades, with four continuous gallery levels and a recessed room wall.
  const insideSpan=index<2?72.6:42.6,cells=Math.round(insideSpan/(near?3.3:6.6)),step2=insideSpan/cells;
  for(let k=0;k<cells;k++){
   const c=-insideSpan/2+(k+.5)*step2,l=c-step2/2,r=c+step2/2,w=step2-.7;
   if(index===0&&Math.abs(c)<5.7)continue;
   for(let level=0;level<4;level++){
    const y0=level*3.65,y1=y0+3.65;
    face('wall',e,l,c-w/2,y0,y1,inner,-1);face('wall',e,c+w/2,r,y0,y1,inner,-1);
    face('wall',e,l,c-w/2,y0,y1,inner+.55,1);face('wall',e,c+w/2,r,y0,y1,inner+.55,1);
    for(const [t,sg] of [[c-w/2,1],[c+w/2,-1]])S.quad('wall',Q(e,t,inner,y0),Q(e,t,inner+.55,y0),Q(e,t,inner+.55,y1),Q(e,t,inner,y1),P(e.T[0]*sg,e.T[1]*sg,0));
    if(level===0){face('wall',e,c-w/2,c+w/2,y1-.5,y1,inner,-1);face('wall',e,c-w/2,c+w/2,y1-.5,y1,inner+.55,1);top('wall',e,c-w/2,c+w/2,inner,inner+.55,y1-.5,-1);}
    else arch(e,c,w,y0,y0+1.65,y1,inner,inner+.55);
    // Recessed doors replace the room wall, not a black full-height stripe.
    const rd=inner+2.9,lo=y0+.15,hi=y1-.65;
    face('wall',e,l,c-.5,y0,y1,rd,-1);face('wall',e,c+.5,r,y0,y1,rd,-1);face('wall',e,c-.5,c+.5,y0,lo,rd,-1);face('wall',e,c-.5,c+.5,hi,y1,rd,-1);pane(e,c-.5,c+.5,lo,hi,rd,-1);
   }
  }
  for(const y of [3.65,7.3,10.95]){
   // Gallery floor: top, soffit and exposed edge; no unsupported floating bands.
   top('floor',e,-insideSpan/2,insideSpan/2,inner,inner+2.9,y);
   top('floor',e,-insideSpan/2,insideSpan/2,inner+.55,inner+2.9,y-.18,-1);
   face('wall',e,-insideSpan/2,insideSpan/2,y-.18,y,inner,-1);
  }
 }
 // Four round staircase turrets on the mapped outer corners.
 for(const u of [-46.3,46.3])for(const v of [-31.3,31.3]){
  const g=new THREE.CylinderGeometry(1.9,1.9,16.3,near?24:12,1,false);g.translate(...P(u,v,8.15));b.put(g,'wall');
  for(let k=0;k<8;k++){const ang=k*Math.PI/4,uu=u+1.55*Math.sin(ang),vv=v+1.55*Math.cos(ang);box('wall',uu,vv,16.65,.62,.62,.7);}
 }
 // Tower and continuous east sally-port vault, 109 ft to the merlons.
 const e=EDGES[0],front=34.0,back=21.3,w=11.4,half=w/2;
 for(const [d,sg] of [[front,1],[back,-1]]){
  face('wall',e,-half,-2.3,0,7,d,sg);face('wall',e,2.3,half,0,7,d,sg);
  // Passage spandrel is handled once below with the complete depth.
  face('wall',e,-half,half,7,16,d,sg);
  const holes=[[-.5,.5,17,19.2],[-2.1,-1.65,27.0,29.5],[-.25,.25,27.0,29.5],[1.65,2.1,27.0,29.5],...Array.from({length:10},(_,i)=>[-4.7+i*1.04,-4.48+i*1.04,30.4,31.5])];
  const xs=[-half,...new Set(holes.flatMap(h=>[h[0],h[1]])),half].sort((a,b)=>a-b),ys=[16,17,19.2,27,29.5,30.4,31.5,31.8];
  for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++){
   const x=(xs[i]+xs[i+1])/2,y=(ys[j]+ys[j+1])/2,h=holes.find(h=>x>h[0]&&x<h[1]&&y>h[2]&&y<h[3]);
   if(h)face('glass',e,xs[i],xs[i+1],ys[j],ys[j+1],d,sg);else face('wall',e,xs[i],xs[i+1],ys[j],ys[j+1],d,sg);
  }
 }
 // Front/back arch surfaces and the soffit remain genuine negative space in far.
 arch(e,0,4.6,0,2.7,7,back,front);
 for(const u of [-2.3,2.3])S.quad('wall',P(u,back,0),P(u,front,0),P(u,front,2.7),P(u,back,2.7),P(u<0?1:-1,0,0));
 for(const u of [-half,half])S.quad('wall',P(u,back,14.6),P(u,front,14.6),P(u,front,31.8),P(u,back,31.8),P(u<0?-1:1,0,0));
 top('roof',e,-half,half,back,front,31.8);
 // Crenellated projecting crown and small corner bartizans, all contacting shaft.
 
 for(const v of [back,front])for(let k=0;k<7;k++)box('wall',-5.7+k*1.9,v,32.5116,.95,.72,1.4232);
 for(const u of [-6,6])for(let k=1;k<6;k++)box('wall',u,back+k*(front-back)/6,32.5116,.72,.95,1.4232);
 // Clock disc: no text or institutional insignia.
 const mount=new THREE.CylinderGeometry(.72,.72,.52,near?32:16,1,true);mount.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(...N(e))));mount.translate(...P(0,front+.26,24.2));b.put(mount,'wall');
 const clock=new THREE.CircleGeometry(.72,near?32:16);clock.rotateY(Math.PI/2+24.6*Math.PI/180);clock.translate(...P(0,front+.52,24.2));b.put(clock,'glass');
 // Courtyard paving is 0.10 m proud of grade to clear the world terrain depth surface.
 const step=near?2.2:4.4,nu=Math.ceil(72.6/step),nv=Math.ceil(42.6/step);
 for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const u0=-36.3+72.6*i/nu,u1=-36.3+72.6*(i+1)/nu,v0=-21.3+42.6*j/nv,v1=-21.3+42.6*(j+1)/nv;S.quad((i+j)%2?'red':'floor',P(u0,v0,.10),P(u1,v0,.10),P(u1,v1,.10),P(u0,v1,.10),[0,1,0]);}
 S.flush();return b.finish();
}
