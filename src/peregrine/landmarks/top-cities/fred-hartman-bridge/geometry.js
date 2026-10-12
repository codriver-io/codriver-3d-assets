import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {PROFILE as p,L,DECK_H,TOWER_H,DECK_WIDTH,GAP,HALF_WIDTH,TOWERS,CABLE_START,CABLE_END,ROAD_EDGES,LANDING,CURVE} from './fred-hartman-bridge-profile.js';

export const DIAMOND_LEVELS=[[2,0],[DECK_H,12.5],[120,0],[TOWER_H,0]];
export function create({detail='near',audit=false}={}){
 const near=detail==='near',b=assetBuilder(p.CHAMPLAIN,detail),support={},members=[];
 const xyz=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
 const ck=s=>near?Math.min(2,Math.floor(s/L*3)):0;
 const clamp=v=>Math.max(0,Math.min(1,v));
 function put(g,mat,s,name,lift=1){if(audit&&name)for(const n of Array.isArray(name)?name:[name])(support[n]??=[]).push(g.clone());b.put(g,mat,ck(s),lift);}
 function box(mat,s,d,y,len,w,h,name,lift=1){const q=p.bridgePoint(s,d,y),g=new THREE.BoxGeometry(len,h,w);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,y,q.z);put(g,mat,s,name,lift);}
 function bar(mat,a,c,w,depth=w,name,lift=1,round=false){const av=new THREE.Vector3(...xyz(...a)),cv=new THREE.Vector3(...xyz(...c)),v=cv.clone().sub(av);const g=round?new THREE.CylinderGeometry(w,w,v.length(),near?6:3,1,false):new THREE.BoxGeometry(w,v.length(),depth);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());put(g,mat,a[0],name,lift);}
 function contact(name,a,c,sa,sc){if(audit)members.push({name,a:xyz(...a),c:xyz(...c),sa,sc});}
 // Closed slab/girder strips with ground-embedded ends. All LODs sample curve chords at 4 m.
 function strip(mat,left,right,offset=0,thick=0,name,ends=false){
  const ss=new Set([0,L,...p.ALIGNMENT.map(q=>q.s),...p.knots.map(q=>q[0])]);
  for(let s=near?25:50;s<L;s+=near?25:50)ss.add(s);
  for(const [a,c] of [[LANDING,LANDING+CURVE],[CABLE_START-CURVE,CABLE_START],[CABLE_END,CABLE_END+CURVE],[L-LANDING-CURVE,L-LANDING]])for(let s=a;s<=c;s+=near?4:8)ss.add(s);
  const stations=[...ss].sort((a,c)=>a-c);
  for(let part=0;part<(near?3:1);part++){
   const lo=L*part/(near?3:1),hi=L*(part+1)/(near?3:1);
   const sub=[lo,...stations.filter(s=>s>lo&&s<hi),hi],pos=[],idx=[],stride=thick?4:2;
   for(let i=0;i<sub.length;i++){
    const s=sub[i],fade=ends&&offset>0?clamp(Math.min(s,L-s)/25):1,h=p.deckHeight(s),top=h+offset*fade,bottom=top-thick;
    for(const [d,y] of thick?[[left,top],[right,top],[left,bottom],[right,bottom]]:[[left,top],[right,top]])pos.push(...xyz(s,d,y));
    if(!i)continue;const a=(i-1)*stride,c=i*stride;
    idx.push(a,a+1,c,a+1,c+1,c);
    if(thick)idx.push(a+2,c+2,a+3,a+3,c+2,c+3,a,c,a+2,a+2,c,c+2,a+1,a+3,c+1,a+3,c+3,c+1);
   }
   if(thick){const e=(sub.length-1)*4;idx.push(0,2,1,1,2,3,e,e+1,e+2,e+1,e+3,e+2);}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,mat,lo,name);
  }
  if(audit&&ends)members.push({name,a:xyz(0,(left+right)/2,Math.min(0,offset)),c:xyz(L,(left+right)/2,Math.min(0,offset)),sa:'ground',sc:'ground'});
 }
 // Twin independent slabs; only the two pylon crossheads connect the median.
 for(const side of [-1,1]){
  const center=side*(DECK_WIDTH+GAP)/2,left=center-DECK_WIDTH/2,right=center+DECK_WIDTH/2;
  strip('concrete',left,right,-.16,.64,`deck-${side}`,true);
  strip('asphalt',left+.5,right-.5,0,0,`pavement-${side}`,true);
  // Steel longitudinal edge girders and the subordinate floor-beam rhythm.
  for(const d of [left+1.15,right-1.15])strip('steel',d-.38,d+.38,-.8,1.4,`girder-${side}`,true);
  for(const d of [left+.2,right-.2])strip('concrete',d-.2,d+.2,1.05,1.05,`barrier-${side}`,true);
  for(const d of [left+.8,right-.8])if(near)strip('paint',d-.07,d+.07,.11,0);
  if(near)for(let s=5;s<L-5;s+=12)for(let lane=1;lane<4;lane++){
   const d=center-7.2+lane*3.6;bar('paint',[s,d,p.deckHeight(s)+.11],[Math.min(L,s+3),d,p.deckHeight(Math.min(L,s+3))+.11],.13,.025);
  }
  for(let s=CABLE_START;s<=CABLE_END+.01;s+=near?8:32){
   const a=[s,left+1.15,DECK_H-1.1],c=[s,right-1.15,DECK_H-1.1];
   bar('steel',a,c,.35,.6);contact(`floorbeam-${side}-${s}`,a,c,`girder-${side}`,`girder-${side}`);
  }
 }
 // Approach columns under each carriageway. Tops meet the continuous edge girders.
 const piers=[];
 for(const [a,c] of [[90,CABLE_START],[CABLE_END,L-90]])for(let s=a;s<=c;s+=35)piers.push(s);
 // The side unit has two spans, with an intermediate support outside each fan.
 piers.push(CABLE_START,CABLE_START+62,CABLE_END-62,CABLE_END);
 for(const s of piers){const top=p.deckHeight(s)-2.05;if(top<3)continue;
  for(const side of [-1,1]){
   const center=side*(DECK_WIDTH+GAP)/2,n=`pier-${s}-${side}`;
   for(const d of [center-7.8,center+7.8]){
    box('concrete',s,d,.2,4.4,4.4,.4,n+'-foot',0);
    bar('concrete',[s,d,.2],[s,d,top-.4],2.5,2.3,undefined,y=>clamp(y/top));
    contact(n+'-shaft-'+d,[s,d,.2],[s,d,top-.4],n+'-foot',n+'-cap');
   }
   box('steel',s,center,top,3.4,22.6,1.2,n+'-cap');
   contact(n+'-cap',[s,center-DECK_WIDTH/2+1.15,top],[s,center+DECK_WIDTH/2-1.15,top],`girder-${side}`,`girder-${side}`);
  }
 }
 // Four diamonds: lower V up from separate feet, outward knees at road, upper inverted V.
 for(const [ti,s] of TOWERS.entries()){
  for(const side of [-1,1]){
   const center=side*(DECK_WIDTH+GAP)/2,tower=`tower-${ti}-${side}`;
   box('concrete',s,center,.6,13,12,1.2,`foundation-${ti}-${side}`,0);
   for(const dir of [-1,1])for(let j=1;j<3;j++){
    const a=DIAMOND_LEVELS[j-1],c=DIAMOND_LEVELS[j];
    const limb=tower+'-limb-'+dir+'-'+j;
    const from=[s,center+dir*a[1],a[0]],to=[s,center+dir*c[1],c[0]];
    bar('tower',from,to,3.1,4,[tower,limb],y=>clamp(y/(DECK_H-2)));
    contact(limb,from,to,j===1?tower+'-base':tower+'-limb-'+dir+'-1',j===1?tower+'-limb-'+dir+'-2':tower+'-mast');
   }
   box('tower',s,center,(120+TOWER_H)/2,4.4,3.4,TOWER_H-120,[tower,tower+'-mast']);
   box('tower',s,center,2,6.5,5.6,3,[tower,tower+'-base'],y=>clamp(y/(DECK_H-2)));
   // 12 stays per half fan × 2 directions × 2 edges × 4 towers = 192.
   for(const direction of [-1,1])for(const edge of [-1,1])for(let i=0;i<12;i++){
    if(!near&&i%2===1&&i!==11)continue;
    const main=(ti===0&&direction===1)||(ti===1&&direction===-1);
    const reach=main?MAIN_REACH:186.0,dist=22+(reach-22)*i/11,anchor=s+direction*dist;
    const y=108+23*i/11,lateral=center+edge*Math.max(0,(120-y)/63*12.5);
    const d=center+edge*(DECK_WIDTH/2-.2),a=[s+direction*1.35,lateral,y],c=[anchor,d,DECK_H+.72];
    const name=`anchor-${ti}-${side}-${direction}-${edge}-${i}`;
    box('concrete',anchor,d,DECK_H+.60,1.4,.7,.7,name);
    bar('cable',a,c,near?.085:.14,undefined,undefined,1,true);
    contact(`stay-${ti}-${side}-${direction}-${edge}-${i}`,a,c,tower,name);
   }
  }
  box('tower',s,0,DECK_H-1.4,5.0,48.9,2.2,`crosshead-${ti}`);
  contact(`crosshead-${ti}`,[s,-24.45,DECK_H-1.4],[s,24.45,DECK_H-1.4],`tower-${ti}--1`,`tower-${ti}-1`);
 }
 // Lamps are shoulder fittings; at far LOD only the paired upright rhythm remains.
 for(let s=100;s<L-100;s+=near?70:140)for(const side of [-1,1]){
  const d=side*(HALF_WIDTH-.25),h=p.deckHeight(s),name=`lamp-pole-${s}-${side}`;
  bar('rail',[s,d,h+.7],[s,d,h+9.5],near?.10:.13,undefined,name,1,true);
  box('rail',s,d,h+9.5,.3,.3,.3,name+'-head');
  contact(name,[s,d,h+.7],[s,d,h+9.5],`barrier-${side}`,name+'-head');
  if(near){bar('rail',[s,d,h+9.5],[s+1.5,d-side*1.8,h+9.7],.14,.14,name);box('lamp',s+1.5,d-side*1.8,h+9.7,1.1,.4,.18,name+'-fixture');contact(name+'-arm',[s,d,h+9.5],[s+1.5,d-side*1.8,h+9.7],name+'-head',name+'-fixture');}
 }
 const root=b.finish();if(audit)root.userData.audit={support,members};return root;
}
const MAIN_REACH=186.8; // Leaves a short central gap between opposed main-span fan tips.
