import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { mesh, point, local } from './fairmont-empress-mesh.js';

// Original authored massing in the hotel's mapped 8.5-degree grid.
const BLOCKS = [
  [-5.4,6,0,20,23.4,11.0], [36,48,0,20,23.4,11.0],
  [6,36,3.7,20,23.4,7.7], [-5.4,48,20,33.8,23.4,7.2],
  [-17.3,-5.4,4.3,19.6,22.6,7], [-39.7,-17.3,3.9,27,24,8.4],
  [-33.8,-8,27.4,37.1,21.8,7], [-49.5,-26.3,37.1,60.3,22.6,7], [-26.3,28.7,37.3,63.5,22.8,7],
  [28.7,34.5,34,56.5,21,7], [34.5,39.8,34,50,21,7],
  [39.8,48.1,33.8,50,22.6,7], [48.1,73,34,50,22.6,7.4],
];
const origin=SPEC.origin, lonM=111319.49*Math.cos(origin[1]*Math.PI/180);
const hotelRing=FOOTPRINTS[0].map(([lng,lat])=>local((lng-origin[0])*lonM,(origin[1]-lat)*111319.49));

export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail), k=mesh(b);
  const facePanel=(mat,u,v,y,w,h,side,offset)=>{
    const du=side===0||side===2?w/2:0,dv=side===1||side===3?w/2:0;
    const n=[[0,0,-1],[1,0,0],[0,0,1],[-1,0,0]][side];
    u+=n[0]*offset;v+=n[2]*offset;
    k.face(mat,[[u-du,y-h/2,v-dv],[u+du,y-h/2,v+dv],[u+du,y+h/2,v+dv],[u-du,y+h/2,v-dv]],n);
  };
  const window=(u,v,y,side,index,w=1.25,h=2.05)=>{
    const mat=index%5===1?'glow':'glass';
    if(near){
      facePanel('stone',u,v,y,w+.4,h+.35,side,.10);
      facePanel(mat,u,v,y,w,h,side,.18);
      facePanel('stone',u,v,y,.09,h,side,.25);
      facePanel('stone',u,v,y+.1,w,.09,side,.26);
      const n=[[0,0,-1],[1,0,0],[0,0,1],[-1,0,0]][side];
      const U=u+n[0]*.30,V=v+n[2]*.30;
      if(side===0||side===2)k.box('stone',U-w*.65,U+w*.65,V-.16,V+.16,y-h/2-.12,y-h/2+.02);
      else k.box('stone',U-.16,U+.16,V-w*.65,V+w*.65,y-h/2-.12,y-h/2+.02);
    }else facePanel(mat,u,v,y,w,h,side,.18);
  };
  function building(block) {
    const [u0,u1,v0,v1,eave,rise]=block;
    const faces=[[[u0,v0],[u1,v0]],[[u1,v0],[u1,v1]],[[u1,v1],[u0,v1]],[[u0,v1],[u0,v0]]];
    // Exposed walls only: split at adjacent part boundaries to avoid coplanar internal faces.
    faces.forEach(([a,c],side)=>{
      const along=side%2===0,lo=along?Math.min(a[0],c[0]):Math.min(a[1],c[1]),hi=along?Math.max(a[0],c[0]):Math.max(a[1],c[1]);
      let cuts=[lo,hi];for(const q of BLOCKS)for(const p of along?q.slice(0,2):q.slice(2,4))if(p>lo&&p<hi)cuts.push(p);
      cuts=[...new Set(cuts)].sort((a,c)=>a-c);
      const n=[[0,0,-1],[1,0,0],[0,0,1],[-1,0,0]][side];
      for(let i=1;i<cuts.length;i++){
        const start=cuts[i-1],end=cuts[i],mid=(start+end)/2,u=along?mid:a[0],v=along?a[1]:mid;
        const neighbor=BLOCKS.find(q=>q!==block&&u+n[0]*.05>q[0]&&u+n[0]*.05<q[1]&&v+n[2]*.05>q[2]&&v+n[2]*.05<q[3]);
        const lower=neighbor?neighbor[4]:0;if(lower>=eave)continue;
        const A=along?[start,v]:[u,start],C=along?[end,v]:[u,end];
        k.face('brick',[[A[0],lower,A[1]],[C[0],lower,C[1]],[C[0],eave,C[1]],[A[0],eave,A[1]]],n);
        if(lower===0){
          facePanel('stone',u,v,1.25,end-start,2.5,side,.06);
          for(const y of [5.1, eave-1.2,eave-.45])facePanel('stone',u,v,y,end-start,.24,side,.13);
          const count=Math.max(1,Math.round((end-start)/3.25)),pitch=(end-start)/count;
          for(let j=0;j<count;j++)for(let floor=0;floor<6;floor++){
            const t=start+(j+.5)*pitch,Y=3.4+floor*3.55;const pavilion=v0===0&&(u0===-5.4||u0===36);if(Y+1.25>eave-(pavilion?.4:1.4))continue;
            window(along?t:u,along?v:t,Y,side,j+floor*2);
          }
          if(near){for(let y=2.8;y<eave-2;y+=1.05)for(const t of [start+.23,end-.23])facePanel('stone',along?t:u,along?v:t,y,.46,.5,side,.12);}
        }
      }
    });
    k.hip(u0,u1,v0,v1,eave,rise);
    for(const side of [0,2]){
      const v=side===0?v0:v1,count=Math.max(1,Math.floor((u1-u0)/4.7));
      for(let i=0;i<count;i++){
        const u=u0+(i+.5)*(u1-u0)/count;dormer(u,v,eave+1.1,side,near?2.0:1.7);
      }
    }
    if(near)for(const side of [1,3]){
      const u=side===1?u1:u0,count=Math.max(1,Math.floor((v1-v0)/5));
      for(let i=0;i<count;i++)dormer(u,v0+(i+.5)*(v1-v0)/count,eave+1.1,side,1.6);
    }
  }
  function dormer(u,v,y,side,w){
    const n=[[0,0,-1],[1,0,0],[0,0,1],[-1,0,0]][side],t=[-n[2],n[0]];
    u-=n[0]*.8;v-=n[2]*.8;
    const p=(a,Y,d=0)=>[u+t[0]*a+n[0]*d,Y,v+t[1]*a+n[2]*d];
    k.face('stone',[p(-w/2,y-1),p(w/2,y-1),p(w/2,y+2),p(0,y+3.25),p(-w/2,y+2)],n);
    k.face('slate',[p(-w/2,y+2),p(0,y+3.25),p(0,y+3.25,-3),p(-w/2,y+2,-3)],[-t[0],.7,-t[1]]);
    k.face('slate',[p(w/2,y+2),p(0,y+3.25),p(0,y+3.25,-3),p(w/2,y+2,-3)],[t[0],.7,t[1]]);
    // Closed cheeks start inside the parent roof.
    for(const a of [-w/2,w/2])k.face('brick',[p(a,y-1),p(a,y+2),p(a,y+2,-3),p(a,y-1,-3)],[Math.sign(a)*t[0],0,Math.sign(a)*t[1]]);
    k.face('brick',[p(-w/2,y-1,-3),p(w/2,y-1,-3),p(w/2,y+2,-3),p(0,y+3.25,-3),p(-w/2,y+2,-3)],[-n[0],0,-n[2]]);
    k.face('brick',[p(-w/2,y-1),p(w/2,y-1),p(w/2,y-1,-3),p(-w/2,y-1,-3)],[0,-1,0]);
    facePanel('glass',u,v,y+1.05,w*.48,1.3,side,.12);
  }
  BLOCKS.forEach(building);
  // Narrow mapped link to the northeast wing: never leave the later wing detached.
  const link=[[-61.5,31.8],[-61.4,24.8],[-54.3,24.9],[-54.3,28],[-46,28.1],[-39.7,36],[-34,36],[-34,37],[-50,37]];
  for(let i=0;i<link.length;i++){
    const a=link[i],c=link[(i+1)%link.length],n=[c[1]-a[1],0,a[0]-c[0]];
    k.face('brick',[[a[0],0,a[1]],[c[0],0,c[1]],[c[0],19.5,c[1]],[a[0],19.5,a[1]]],n);
    const A=[(a[0]-49)*.5,23,(a[1]+32)*.5],C=[(c[0]-49)*.5,23,(c[1]+32)*.5];
    k.face('slate',[[a[0],19.5,a[1]],[c[0],19.5,c[1]],C,A],[n[0],10,n[2]]);
  }
  const linkTop=link.map(p=>new THREE.Vector2((p[0]-49)*.5,(p[1]+32)*.5));
  for(const ids of THREE.ShapeUtils.triangulateShape(linkTop,[]))k.face('slate',ids.map(i=>[linkTop[i].x,23,linkTop[i].y]),[0,1,0]);
  // The northeast 1928 wing turns with Humboldt Street rather than the main grid.
  const NE=[[ -79.7,37.9],[-61.5,97],[-41.5,90.7],[-50,60.1],[-61.7,31.9]];
  const top=21.5;
  for(let i=0;i<NE.length;i++){
    const a=NE[i],c=NE[(i+1)%NE.length],du=c[0]-a[0],dv=c[1]-a[1],L=Math.hypot(du,dv),n=[-dv/L,0,du/L];
    k.face('brick',[[a[0],0,a[1]],[c[0],0,c[1]],[c[0],top,c[1]],[a[0],top,a[1]]],n);
    const count=Math.floor(L/3.3);
    for(let j=0;j<count;j++)for(let f=0;f<5;f++){
      const u=a[0]+du*(j+.5)/count,v=a[1]+dv*(j+.5)/count,y=3.6+f*3.5,w=1.3,h=2;
      const p=(t,Y,d)=>[u+du/L*t+n[0]*d,Y,v+dv/L*t+n[2]*d];
      if(near)k.face('stone',[p(-w/2-.2,y-h/2-.2,.1),p(w/2+.2,y-h/2-.2,.1),p(w/2+.2,y+h/2+.2,.1),p(-w/2-.2,y+h/2+.2,.1)],n);
      k.face(j%5===1?'glow':'glass',[p(-w/2,y-h/2,.18),p(w/2,y-h/2,.18),p(w/2,y+h/2,.18),p(-w/2,y+h/2,.18)],n);
    }
    const innerA=[(a[0]+-60)*.5,28,(a[1]+65)*.5],innerC=[(c[0]+-60)*.5,28,(c[1]+65)*.5];
    k.face('slate',[[a[0],top,a[1]],[c[0],top,c[1]],innerC,innerA],[n[0],.8,n[2]]);
  }
  const inner=NE.map(p=>new THREE.Vector2((p[0]-60)/2,(p[1]+65)/2));
  for(const ids of THREE.ShapeUtils.triangulateShape(inner,[]))k.face('slate',ids.map(i=>[inner[i].x,28,inner[i].y]),[0,1,0]);
  // Stone projecting gables of the two main harbour pavilions.
  for(const [u0,u1] of [[-5.4,6],[36,48],[-39.7,-30.5],[-25,-17.3]]){
    const pavilion=u0>=-10,v=pavilion?-.07:3.85,y=pavilion?23.4:24,foot=y-(pavilion?.6:1.8),peak=y+(pavilion?9.2:6.3);
    k.face('stone',[[u0+.45,foot,v],[u1-.45,foot,v],[(u0+u1)/2,peak,v]],[0,0,-1]);
    // Solid gable prism: two sloping slate-grey cheeks and a closed back against the parent hip.
    const m=(u0+u1)/2,A=[u0+.45,foot,v],C=[u1-.45,foot,v],T=[m,peak,v];
    const back=p=>[p[0],p[1],p[2]+3.8];
    k.face('brick',[back(A),back(C),back(T)],[0,0,1]);
    k.face('slate',[A,T,back(T),back(A)],[-1,.7,0]);
    k.face('slate',[C,T,back(T),back(C)],[1,.7,0]);
    window((u0+u1)/2,v,y+(pavilion?3.1:1.2),0,0,1.2,1.8);
    if(near){
      for(const U of [(u0+u1)/2-1.3,(u0+u1)/2+1.3])facePanel('stone',U,v,y+(pavilion?2:0.1),.26,2.7,0,.16);
      for(let U=u0+.6;U<u1-.5;U+=.55)k.box('stone',U-.13,U+.13,v-.24,v+.08,foot+.5,foot+.9);
      facePanel('stone',(u0+u1)/2,v,foot+.05,u1-u0,.4,0,.19);
      facePanel('glass',(u0+u1)/2,v,y+(pavilion?6.5:3.6),.6,.8,0,.18);
    }
    if(near){for(const d of [-1,1])b.bar('stone',point((u0+u1)/2,peak,v-.12),point(d<0?u0+.4:u1-.4,foot+.1,v-.12),.24);}
  }
  // Polygonal turrets flanking the recessed main facade and the north gables.
  for(const [u,v,y] of [[6,1.8,26.8],[36,1.8,26.8],[-17.7,5.8,25.8],[-39,5.8,25.8]]){
    const radius=1.7,segments=near?10:8;
    for(let i=0;i<segments;i++){
      const a=i*Math.PI*2/segments,c=(i+1)*Math.PI*2/segments,A=[u+Math.cos(a)*radius,v+Math.sin(a)*radius],C=[u+Math.cos(c)*radius,v+Math.sin(c)*radius];
      k.face('brick',[[A[0],2.4,A[1]],[C[0],2.4,C[1]],[C[0],y,C[1]],[A[0],y,A[1]]],[Math.cos((a+c)/2),0,Math.sin((a+c)/2)]);
      k.face('copper',[[A[0],y,A[1]],[C[0],y,C[1]],[u,y+3,v]],[Math.cos((a+c)/2),.5,Math.sin((a+c)/2)]);
      for(const Y of [5.1,12.5,19.6,y-.3])k.face('stone',[[A[0]*1+(A[0]-u)*.06,Y-.14,A[1]+(A[1]-v)*.06],[C[0]+(C[0]-u)*.06,Y-.14,C[1]+(C[1]-v)*.06],[C[0]+(C[0]-u)*.06,Y+.14,C[1]+(C[1]-v)*.06],[A[0]+(A[0]-u)*.06,Y+.14,A[1]+(A[1]-v)*.06]],[Math.cos((a+c)/2),0,Math.sin((a+c)/2)]);
    }
    b.bar('metal',point(u,y+2.7,v),point(u,y+4.2,v),.1);
  }
  // Actual open Tudor arcade: spandrels and piers, no solid porch box.
  const archStart=8,archEnd=35.1,porchFront=-.72,porchBack=3.65,pitch=(archEnd-archStart)/4;
  for(let i=0;i<4;i++){
    const a=archStart+i*pitch,c=a+pitch,mid=(a+c)/2;
    const outline=[[a+.5,0],[a+.5,3.8],[mid,5.1],[c-.5,3.8],[c-.5,0]];
    for(const v of [porchFront,porchBack])k.face('stone',[[a,0,v],[a+.5,0,v],[a+.5,3.8,v],[mid,5.1,v],[c-.5,3.8,v],[c-.5,0,v],[c,0,v],[c,6,v],[a,6,v]],[0,0,v===porchFront?-1:1]);
    for(let j=0;j<outline.length-1;j++){
      const [U,Y]=outline[j],[W,Z]=outline[j+1];
      k.face('stone',[[U,Y,porchFront],[W,Z,porchFront],[W,Z,porchBack],[U,Y,porchBack]],[(Z-Y),-(W-U),0]);
    }
  }
  k.box('stone',archStart-.15,archEnd+.15,porchFront-.1,porchBack,6.05,6.45);
  for(const u of [archStart,archEnd])k.box('stone',u-.35,u+.35,porchFront,porchBack,0,6.1);
  k.box('stone',archStart,archEnd,porchFront,porchBack,6.7,7.0);
  for(let u=archStart+.5;u<archEnd;u+=near?.7:1.4)k.box('stone',u-.065,u+.065,porchFront,porchFront+.18,6.4,6.75);
  // Window bay stacks, prominent light stone oriels on main pavilions.
  for(const u of [-2.4,2.6,39,44.5])for(let f=0;f<6;f++){
    const y=3.4+f*3.55;k.box('stone',u-1.25,u+1.25,-.52,-.1,y-1.3,y+1.35,false);
    window(u,-.55,y,0,f,1.65,2.05);
  }
  // Chimneys and pavilion ridge finials determine the distant silhouette.
  for(const [u,v,y] of [[0,10,32.5],[42,10,32.5],[-33,16,30],[-20,17,30],[14,12,28],[29,12,28],[-18,49,28],[8,49,28],[56,42,29],[-65,70,26]]){
    k.box('brick',u-.55,u+.55,v-.65,v+.65,y-4,y+2);
    k.box('stone',u-.68,u+.68,v-.79,v+.79,y+1.95,y+2.35);
  }
  for(const u of [.3,42])b.bar('metal',point(u,33.8,10),point(u,35.4,10),.08);
  // Low irregular hotel foundations make all blocks contact the same rigid grade.
  for(let i=0;i<hotelRing.length-1;i++){
    const a=hotelRing[i],c=hotelRing[i+1];k.face('stone',[[a[0],0,a[1]],[c[0],0,c[1]],[c[0],.65,c[1]],[a[0],.65,a[1]]],[c[1]-a[1],0,a[0]-c[0]]);
  }
  const groundRing=hotelRing.slice(0,-1).map(p=>new THREE.Vector2(...p));
  for(const ids of THREE.ShapeUtils.triangulateShape(groundRing,[]))k.face('stone',ids.map(i=>[groundRing[i].x,.65,groundRing[i].y]),[0,1,0]);
  k.flush();const root=b.finish();root.userData.landmarkFeatures=['four Tudor porch openings','paired harbour gabled pavilions','polygonal turrets','steep dormered slate-grey hips','green copper turret caps'];return root;
}
