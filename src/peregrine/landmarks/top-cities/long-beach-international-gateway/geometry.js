import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {PALETTES} from './config.js';
import {PROFILE as p,L,DECK_H,TOWER_H,WIDTH,TOWERS,CABLE_START,CABLE_END,LANDING,CURVE,TAPER,authoredLateral,landingBlend} from './long-beach-international-gateway-profile.js';

// Visual estimates from the Arup/Port photograph: octagon base → diamond crown.
export const MAST_LEVELS=[[0,10.4,9.2,.9],[8,10,8.8,1],[62,8.4,7.8,1.25],[103,7,6.4,1.65],[157,5.0,5.0,2.5]];
export function create({detail='near',audit=false}={}){
 const near=detail==='near',b=assetBuilder(p.CHAMPLAIN,detail),supports={},members=[];
 const ck=s=>near?Math.min(2,Math.floor(s/L*3)):0,clamp=x=>Math.max(0,Math.min(1,x));
 const xyz=(s,d,y)=>{const q=p.bridgePoint(s,authoredLateral(s,d),y);return[q.x,q.y,q.z];};
 function put(g,mat,s,names,lift=1){const isPier=typeof names==='string'&&names.startsWith('pier-');g.setAttribute('pierTop',new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count).fill(isPier?p.deckHeight(s)-2.7:-1),1));if(audit&&names)for(const name of Array.isArray(names)?names:[names])(supports[name]??=[]).push(g.clone());const key=typeof names==='string'&&names.startsWith('pier-')&&Math.min(s,L-s)<300?'approachPier':mat==='steel'?'concrete':mat;b.put(g,key,ck(s),lift);}
 function box(mat,s,d,y,len,w,h,name,lift=1){const q=p.bridgePoint(s,authoredLateral(s,d),y),g=new THREE.BoxGeometry(len,h,w);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,y,q.z);put(g,mat,s,name,lift);}
 function bar(mat,a,c,width,depth=width,name,lift=1,round=false){
  const av=new THREE.Vector3(...xyz(...a)),cv=new THREE.Vector3(...xyz(...c)),axis=cv.clone().sub(av);
  const g=round?new THREE.CylinderGeometry(width,width,axis.length(),near?6:3,1,false):new THREE.BoxGeometry(width,axis.length(),depth);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis.normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());put(g,mat,a[0],name,lift);
 }
 const contact=(name,a,c,sa,sc)=>{if(audit)members.push({name,a:xyz(...a),c:xyz(...c),sa,sc});};
 // Independent strips keep the curved approach gap open. Lateral tessellation
 // lets each wide landing meet its own DEM instead of a centerline bank datum.
 function strip(mat,a,c,left,right,off,thick,name,fadeEnds=true){
  const structural=off<0;if(structural){a=LANDING+CURVE;c=L-LANDING-CURVE;}
  const steps=new Set([a,c,...p.ALIGNMENT.map(q=>q.s).filter(s=>s>a&&s<c)]);
  const step=near?12:40;for(let s=Math.ceil(a/step)*step;s<c;s+=step)steps.add(s);
  for(const s of [LANDING,LANDING+CURVE,CABLE_START,CABLE_END,L-LANDING-CURVE,L-LANDING])if(s>a&&s<c)steps.add(s);
  for(const [lo,hi] of [[LANDING,LANDING+CURVE],[CABLE_START-CURVE,CABLE_START],[CABLE_END,CABLE_END+CURVE],[L-LANDING-CURVE,L-LANDING]])for(let s=lo;s<=hi;s+=near?4:8)if(s>a&&s<c)steps.add(s);
  const ss=[...steps].sort((u,v)=>u-v),parts=near?3:1,road=left<0?[-21.6,-4.6]:[4.6,21.6],divisions=near?6:4;
  const ds=thick===.62?[left,...Array.from({length:divisions},(_,j)=>road[0]+(road[1]-road[0])*j/(divisions-1)),right]:Array.from({length:mat==='asphalt'&&thick!==100?divisions:2},(_,j,arr)=>left+(right-left)*j/((mat==='asphalt'&&thick!==100?divisions:2)-1));
  const columns=ds.length;
  for(let part=0;part<parts;part++){
   const lo=Math.max(a,L*part/parts),hi=Math.min(c,L*(part+1)/parts);if(lo>=hi)continue;const sub=[lo,...ss.filter(s=>s>lo&&s<hi),hi],pos=[],idx=[],stride=thick?columns*2:columns;
   for(let i=0;i<sub.length;i++){
    const s=sub[i],f=fadeEnds?clamp(Math.min(s,L-s)/30):1,h=p.deckHeight(s),depthFade=off<0&&off!==-.6?Math.min(f,h/5):f,top=h+off*depthFade,bottom=Math.max(0,top-thick*depthFade);
    const topRow=ds.map(d=>[d,top]),points=thick?[...topRow,...topRow.map(([d])=>[d,bottom])]:topRow;
    for(const [d,y] of points)pos.push(...xyz(s,d,y));
    if(!i)continue;if(off<0&&p.deckHeight(s)<.0001&&p.deckHeight(sub[i-1])<.0001)continue;const u=(i-1)*stride,v=i*stride;
    for(let j=0;j<(thick===100?0:columns-1);j++)idx.push(u+j,u+j+1,v+j,u+j+1,v+j+1,v+j);
    if(thick){const n=columns;if(thick!==100&&thick!==.6)for(let j=0;j<n-1;j++)idx.push(u+n+j,v+n+j,u+n+j+1,u+n+j+1,v+n+j,v+n+j+1);if(thick!==.6||near)idx.push(u,v,u+n,u+n,v,v+n,u+n-1,u+2*n-1,v+n-1,u+2*n-1,v+2*n-1,v+n-1);}
   }
   if(thick&&!structural){const e=(sub.length-1)*stride,n=columns;for(let j=0;j<n-1;j++)idx.push(j,n+j,j+1,j+1,n+j,n+j+1,e+j,e+j+1,e+n+j,e+j+1,e+n+j+1,e+n+j);}
   const clean=[];for(let i=0;i<idx.length;i+=3){const u=new THREE.Vector3().fromArray(pos,idx[i]*3),v=new THREE.Vector3().fromArray(pos,idx[i+1]*3),w=new THREE.Vector3().fromArray(pos,idx[i+2]*3);if(v.sub(u).cross(w.sub(u)).lengthSq()>1e-10)clean.push(idx[i],idx[i+1],idx[i+2]);}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(clean);g.computeVertexNormals();put(g,mat,lo,name);
  }
  if(audit&&fadeEnds){const d=(left+right)/2;if(structural)contact(name,[a,d,p.deckHeight(a)+off*Math.min(1,p.deckHeight(a)/5)],[c,d,p.deckHeight(c)+off*Math.min(1,p.deckHeight(c)/5)],'landing-west','landing-east');else contact(name,[a,d,0],[c,d,0],'ground','ground');}
 }
 for(const side of [-1,1]){
  const left=side<0?-WIDTH/2:4.1,right=side<0?-4.1:WIDTH/2;
  strip('concrete',0,L,left,right,-.6,.62,`deck-${side}`);
  strip('asphalt',0,L,side<0?-21.6:4.6,side<0?-4.6:21.6,0,.6,`pavement-${side}`);
  // Low noses are filled to grade; structural ends bear on their end faces.
  for(const [a,c,n] of [[0,LANDING+CURVE,'landing-west'],[L-LANDING-CURVE,L,'landing-east']])strip('concrete',a,c,side<0?left:4.0,side<0?-4.0:right,0,100,n);
  for(const d of [side*5.1,side*21.7])strip('steel',0,L,d-.5,d+.5,-.80,3.20,`girder-${side}`);
  for(const d of [side*4.35,side*22.15])strip('concrete',0,L,d-.18,d+.18,1.10,1.70,`barrier-${side}`);
  // Exactly two internal dashed lines per three-lane carriageway.
  if(near)for(let s=TAPER+12;s<L-TAPER-6;s+=12)for(const d of [side*11.3,side*14.9])bar('paint',[s,d,p.deckHeight(s)+.12],[s+3,d,p.deckHeight(s+3)+.12],.12,.024);
  for(let s=CABLE_START;s<CABLE_END;s+=near?12:36){const a=[s,side*5.1,DECK_H-1.9],c=[s,side*21.7,DECK_H-1.9];bar('steel',a,c,.5,.8);contact(`floorbeam-${side}-${s}`,a,c,`girder-${side}`,`girder-${side}`);}
 }
 // South-side Mark Bixby path and continuous rail. Grade-level rail ends are
 // folded into the landing curb; no handrail terminates above the pavement.
 strip('concrete',0,L,22.5,WIDTH/2,.18,.78,'path');
 strip('rail',0,L,WIDTH/2-.13,WIDTH/2-.03,1.55,.10,'path-rail');
 if(near)for(let s=6;s<L-6;s+=6){const y=p.deckHeight(s),f=clamp(Math.min(s,L-s)/30),d=WIDTH/2-.08;bar('rail',[s,d,y+.18*f],[s,d,y+1.50*f],.075,.075);contact(`railpost-${s}`,[s,d,y+.18*f],[s,d,y+1.50*f],'path','path-rail');}
 // Paired concrete columns and wide caps under each approach deck. The Back
 // Channel is entirely free of intermediary supports between the two masts.
 const piers=[];for(const [a,c] of [[110,CABLE_START],[CABLE_END,L-110]])for(let s=a;s<c;s+=55)piers.push(s);piers.push(CABLE_START,CABLE_END);
 for(const s of piers){const top=p.deckHeight(s)-3.4;if(top<3)continue;
  for(const side of [-1,1]){
   const n=`pier-${s}-${side}`,d=side*13.4;
   for(const delta of [-5.4,5.4]){
    bar('concrete',[s,d+delta,0],[s,d+delta,top-.1],2.6,2.8,n+'-shaft-'+delta,y=>clamp(y/top));
    contact(n+'-shaft-'+delta,[s,d+delta,0],[s,d+delta,top-.1],'ground',n+'-cap');
   }
   box('concrete',s,d,top,4.4,18.5,1.4,n+'-cap');
   contact(n+'-cap',[s,side*5.1,top],[s,side*21.7,top],`girder-${side}`,`girder-${side}`);
  }
 }
 for(const [ti,s] of TOWERS.entries()){
  const name=`mast-${ti}`,pos=[],idx=[];
  for(const [y,len,w,cut] of MAST_LEVELS){const a=len/2,d=w/2,k=Math.min(cut,a-.001,d-.001);for(const [u,v] of [[-a+k,-d],[a-k,-d],[a,-d+k],[a,d-k],[a-k,d],[-a+k,d],[-a,d-k],[-a,-d+k]])pos.push(...xyz(s+u,v,y));}
  for(let row=1;row<MAST_LEVELS.length;row++)for(let j=0;j<8;j++){const a=(row-1)*8+j,c=(row-1)*8+(j+1)%8,u=row*8+j,v=row*8+(j+1)%8;idx.push(a,u,c,c,u,v);}
  const top=(MAST_LEVELS.length-1)*8;for(let j=1;j<7;j++)idx.push(0,j,j+1,top,top+j+1,top+j);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,'tower',s,name,y=>clamp(y/(DECK_H-3)));
  box('concrete',s,0,.6,14,13,1.2,`mast-foot-${ti}`,0);
  contact(name,[s,0,.6],[s,0,DECK_H-2],`mast-foot-${ti}`,`crosshead-${ti}`);
  box('concrete',s,0,DECK_H-2.4,12.0,44.8,3.0,`crosshead-${ti}`);
  contact(`crosshead-${ti}`,[s,-21.7,DECK_H-2.4],[s,21.7,DECK_H-2.4],'girder--1','girder-1');
  // Twenty stays per half fan, four planes per mast (160 near, 88 far).
  for(const dir of [-1,1])for(const side of [-1,1])for(let i=0;i<20;i++){
   if(!near&&i%2&&i!==19)continue;
   const reach=149,dist=18+(reach-18)*i/19,anchor=s+dir*dist,y=103+48*i/19;
   let level=1;while(MAST_LEVELS[level][0]<y)level++;const low=MAST_LEVELS[level-1],high=MAST_LEVELS[level],t=(y-low[0])/(high[0]-low[0]),section=low.map((v,j)=>v+(high[j]-v)*t);
   const d=side*22.15,a=[s+dir*(section[1]/2-section[3]/2-.03),side*(section[2]/2-section[3]/2-.03),y],c=[anchor,d,DECK_H+.85],n=`anchor-${ti}-${dir}-${side}-${i}`;
   box('concrete',anchor,d,DECK_H+.65,1.3,.60,.90,n);
   bar('cable',a,c,near?.105:.16,undefined,undefined,1,true);contact(`stay-${ti}-${dir}-${side}-${i}`,a,c,name,n);
  }
 }
 // Lamps sit on barrier shoulders, never in a traffic lane.
 for(let s=100;s<L-100;s+=near?65:130)for(const side of [-1,1]){
  const d=side*22.15,y=p.deckHeight(s),n=`lamp-${s}-${side}`;
  bar('rail',[s,d,y+.7],[s,d,y+10],.11,undefined,n,1,true);
  box('rail',s,d,y+10,.30,.30,.30,n+'-head');
  contact(n,[s,d,y+.7],[s,d,y+10],`barrier-${side}`,n+'-head');
  if(near){const c=[s+1.6,d-side*1.4,y+10.3];bar('rail',[s,d,y+10],c,.13,.13);box('lamp',...c,1.1,.45,.18,n+'-fixture');contact(n+'-arm',[s,d,y+10],c,n+'-head',n+'-fixture');}
 }
 const root=b.finish();
 root.traverse(mesh=>{if(!mesh.isMesh||mesh.material.name!=='asphalt')return;const pos=mesh.geometry.attributes.position,col=[];for(let i=0;i<pos.count;i++){const s=p.projectBridge(pos.getX(i),pos.getZ(i)).s,c=new THREE.Color(PALETTES.light.asphalt).lerp(new THREE.Color(0xf2f3f6),landingBlend(s));col.push(c.r,c.g,c.b);}mesh.geometry.setAttribute('color',new THREE.Float32BufferAttribute(col,3));mesh.material.color.setHex(0xffffff);mesh.material.vertexColors=true;});
 if(audit)root.userData.audit={supports,members};return root;
}
