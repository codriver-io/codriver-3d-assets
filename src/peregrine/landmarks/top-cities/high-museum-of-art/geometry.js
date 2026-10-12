import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PARTS, world } from './high-museum-of-art-site.js';
import { Soup, roof, inRing, clip } from './high-museum-of-art-mesh.js';

// Original texture-free shell. All panel seams and windows replace wall cells;
// there is no wall face behind a pane or joint, hence no overlay depth cycles.
export function create({ detail='near' }={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),soups=new Map();
  const S=m=>{if(!soups.has(m))soups.set(m,new Soup());return soups.get(m);};
  const quad=(m,a,c,d,e,n)=>S(m).quad(a,c,d,e,n);
  const wall=(a,c,y0,y1,mat,window=()=>false,pitch=near?2.7:5.4)=>{
    const len=Math.hypot(c[0]-a[0],c[1]-a[1]);if(len<.03||y1-y0<.01)return;
    const e=[(c[0]-a[0])/len,(c[1]-a[1])/len];
    const mid=[(a[0]+c[0])/2,(a[1]+c[1])/2];
    let n=[e[1],-e[0]];
    // Ring shells pass their known exterior normal through the window closure.
    if(window.normal)n=window.normal;
    const p=(s,y)=>[a[0]+e[0]*s,y,a[1]+e[1]*s];
    const cols=Math.max(1,Math.ceil(len/pitch)),cw=len/cols;
    // Storey/window breakpoints retained identically in both LODs.
    const ys=[y0,y1,...[1,3.8,5.2,8.2,9.8,12,15.8,20.8,22,25.5].filter(y=>y>y0&&y<y1)];
    if(near)for(let y=y0+3.3;y<y1;y+=3.3)if(!ys.some(v=>Math.abs(v-y)<1.4))ys.push(y);
    ys.sort((a,b)=>a-b);const levels=[...new Set(ys)];
    for(let i=0;i<cols;i++)for(let j=0;j<levels.length-1;j++) {
      const l=i*cw,r=(i+1)*cw,lo=levels[j],hi=levels[j+1],s=(l+r)/2,y=(lo+hi)/2;
      const pt=p(s,y), win=window(pt[0],y,pt[2],s,len),m=win===true?'glass':win||mat;
      if(!near && m!=='glass' && m!=='glow') {
        quad(m,p(l,lo),p(r,lo),p(r,hi),p(l,hi),[n[0],0,n[1]]);
        continue;
      }
      const gap=m==='glass'||m==='glow'?(near?.11:.18):.04;
      const left=l+Math.min(gap,cw/4),bottom=lo+Math.min(gap,(hi-lo)/4);
      quad(m,p(left,bottom),p(r,bottom),p(r,hi),p(left,hi),[n[0],0,n[1]]);
      const seam=m==='glass'||m==='glow'?mat:'joint';
      quad(seam,p(l,lo),p(r,lo),p(r,bottom),p(l,bottom),[n[0],0,n[1]]);
      quad(seam,p(l,bottom),p(left,bottom),p(left,hi),p(l,hi),[n[0],0,n[1]]);
    }
  };
  const prism=(ring,y0,y1,mat,window=()=>false,cap=true)=>{
    const area=ring.reduce((sum,a,i)=>{const c=ring[(i+1)%ring.length];return sum+a[0]*c[1]-c[0]*a[1];},0);
    for(let i=0;i<ring.length;i++) {
      const a=ring[i],c=ring[(i+1)%ring.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]);
      const f=(...args)=>window(...args);f.normal=area>0?[(c[1]-a[1])/len,-(c[0]-a[0])/len]:[-(c[1]-a[1])/len,(c[0]-a[0])/len];
      wall(a,c,y0,y1,mat,f);
    }
    if(cap)roof(S('roof'),ring,y1);
  };
  const meier=PARTS[1453239398];
  // Lower entrance drum and plinth: original mapped arc and subsidiary eastern drum.
  prism(meier,0,12,'white',(u,y,v)=>((y>1&&y<3.8)||(y>5.2&&y<8.2))&&u>14?'glass':v>9&&y>5.2&&y<8.2?'glass':false);
  // Tall gallery block behind the atrium. Step levels are independent solids.
  const core=clip(meier,1,-7,false);
  prism(core,12,28,'white',(u,y,v)=>y>15.8&&y<20.8&&u>14?'glass':y>22&&y<25.5&&v<-28&&u>-5?'glass':false);
  const west=clip(clip(meier,1,-7,true),0,-8,false);
  prism(west,12,23,'white',(u,y,v)=>y>15.8&&y<20.8&&v>15?'glass':false);
  // Quarter-circle atrium, with transparent-looking upper storey and panelled crown.
  const segments=near?24:12,r=20,cx=-8,cz=-7;
  const atrium=[[cx,cz],[cx+r,cz]];
  for(let i=1;i<=segments;i++){const a=i/segments*Math.PI/2;atrium.push([cx+r*Math.cos(a),cz+r*Math.sin(a)]);}
  prism(atrium,12,26,'white',(u,y,v)=>y>15.8&&y<22&&(u>-7&&v>-6)&&Math.abs((Math.atan2(v+7,u+8)*20)%5-2.5)<2.05?'glass':false);
  // East stair light slit: plane-like white bookend with actual glazed cells.
  // Core already supplies the tall bookend. No second overlapping shell here.
  // Hill Auditorium is the low southeast connector, not the neighbouring arts center.
  prism(PARTS[1424891402],0,6,'white',(u,y,v)=>y>1&&y<3.8&&v>25?'glass':false);

  const piano=[{id:1424891448,h:22,scoops:true},{id:1424891449,h:22,scoops:true},{id:1424891450,h:18,scoops:false}];
  for(const wing of piano) {
    const ring=PARTS[wing.id];
    // Ground lobby glazing and selected thin stair slots remain in far.
    prism(ring,0,wing.h,'aluminum',(u,y,v,s,len)=>{
      if(y>1&&y<3.8)return 'glow';
      if(s>len*.43&&s<len*.57&&len>16&&y>5.2&&y<20.8)return 'glass';
      return false;
    });
    if(wing.scoops) {
      const pitch=near?2.2:4.4,ns=near?8:5;
      const us=ring.map(p=>p[0]),vs=ring.map(p=>p[1]);
      for(let u=Math.min(...us)+1.25;u<Math.max(...us)-1;u+=pitch)for(let v=Math.min(...vs)+1.25;v<Math.max(...vs)-1;v+=pitch) {
        if(![[u-.85,v-.85],[u+.85,v-.85],[u+.85,v+.85],[u-.85,v+.85]].every(p=>inRing(p,ring)))continue;
        const bottom=[],top=[];
        for(let k=0;k<ns;k++) {
          const a=k/ns*Math.PI*2,du=.68*Math.cos(a),dv=.68*Math.sin(a);
          bottom.push([u+du,wing.h-.01,v+dv]);
          // Lip tilts away from north; all scoops share the same geographic north.
          const south=-Math.sin(29*Math.PI/180)*du+Math.cos(29*Math.PI/180)*dv;
          top.push([u+du+.18,wing.h+1.25+south*.7,v+dv-.32]);
        }
        for(let k=0;k<ns;k++) {const j=(k+1)%ns;quad('white',bottom[k],bottom[j],top[j],top[k],[bottom[k][0]-u,0,bottom[k][2]-v]);}
        for(let k=1;k<ns-1;k++)S('glass').tri(top[0],top[k],top[k+1],[0,1,0]);
      }
    }
  }
  // Anne Cox rear service strip is part of that wing, not a detached neighbour.
  // Three podium links/caps recorded by OSM as level-zero parts.
  for(const id of [1453239393,1453239394])prism(PARTS[id],0,.5,'foundation',()=>false);
  // Glass skybridge is carried at both ends by Meier and Wieland; clear void below.
  prism(PARTS[1424891388],8.4,12,'white',(_u,y)=>y>9.8?'glass':false);
  // Restaurant in the piazza, including its mapped narrow vestibule.
  prism(PARTS[1424891413],0,6,'white',(_u,y)=>y>1&&y<3.8?'glass':false);
  prism(PARTS[1424891412],0,3.8,'white',(_u,y)=>y>1?'glass':false);

  // Long entrance ramp. Its full wedge foundation bears directly on y=0.
  const A=[-11,60],B=[-11,16.2],width=2.8,len=Math.hypot(B[0]-A[0],B[1]-A[1]),n=[-(B[1]-A[1])/len,(B[0]-A[0])/len];
  const P=(p,y,d)=>[p[0]+n[0]*d,y,p[1]+n[1]*d];
  const a=P(A,.2,-width/2),c=P(A,.2,width/2),d=P(B,6,width/2),e=P(B,6,-width/2);
  quad('path',a,c,d,e,[0,1,0]);
  quad('foundation',P(A,0,-width/2),a,e,P(B,0,-width/2),[-n[0],0,-n[1]]);
  quad('foundation',P(A,0,width/2),P(B,0,width/2),d,c,[n[0],0,n[1]]);
  quad('foundation',P(A,0,-width/2),P(A,0,width/2),c,a,[A[0]-B[0],0,A[1]-B[1]]);
  quad('foundation',P(B,0,-width/2),e,d,P(B,0,width/2),[B[0]-A[0],0,B[1]-A[1]]);
  // A named support surface 0.25 m below the walkway; no layered different-material face.
  quad('foundation',a.map((v,i)=>i===1?v-.2:v),c.map((v,i)=>i===1?v-.2:v),d.map((v,i)=>i===1?v-.2:v),e.map((v,i)=>i===1?v-.2:v),[0,1,0]);
  for(const side of [-1,1]) {
    const aa=P(A,.2,side*width/2),bb=P(B,6,side*width/2),at=aa.map((v,i)=>i===1?v+1:v),bt=bb.map((v,i)=>i===1?v+1:v);
    // Solid parapets, with both faces and cap, grounded on the wedge sides.
    const off=.18,ao=P(A,.2,side*(width/2+off)),bo=P(B,6,side*(width/2+off)),aot=ao.map((v,i)=>i===1?v+1:v),bot=bo.map((v,i)=>i===1?v+1:v);
    quad('white',aa,at,bt,bb,[-side*n[0],0,-side*n[1]]);
    quad('white',ao,bo,bot,aot,[side*n[0],0,side*n[1]]);
    quad('white',at,aot,bot,bt,[0,1,0]);
    quad('white',aa,ao,aot,at,[A[0]-B[0],0,A[1]-B[1]]);
    quad('white',bb,bt,bot,bo,[B[0]-A[0],0,B[1]-A[1]]);
  }
  for(const [mat,s] of soups)b.put(s.geometry(),mat);
  const model=b.finish();
  model.userData.rampTerminals=[world(A[0],.2,A[1]),world(B[0],6,B[1])];
  model.userData.namedSupports={ramp:'foundation',skybridge:['Meier gallery','Wieland Pavilion']};
  return model;
}
