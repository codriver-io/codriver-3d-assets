import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {PROFILE as p,L,DECK_H,TOWER_H,WEST_TOWER,EAST_TOWER,CABLE_START,CABLE_END,STRUCTURE_START,STRUCTURE_END,widthAt,planesAt,edgesAt} from './pitt-river-bridge-profile.js';
// Tests inspect the exact generated support triangles without exporting debug data into GLBs.
const records=new WeakMap();
export const contactsFor=root=>records.get(root);
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...p.CHAMPLAIN,palette:PALETTES.light},detail),supports=new Map(),members=[];
 const xyz=(s,d,y)=>{const q=p.bridgePoint(s,d,y);return [q.x,q.y,q.z];};
 const chunk=s=>near?Math.min(2,Math.floor(s/L*3)):0;
 const put=(g,mat,name,s=0,lift=1)=>{if(name){if(!supports.has(name))supports.set(name,[]);supports.get(name).push(g);}b.put(g,mat,chunk(s),lift);};
 function box(mat,s,d,y,len,w,h,name,lift=1){const q=p.bridgePoint(s,d,y),g=new THREE.BoxGeometry(len,h,w);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(g,mat,name,s,lift);}
 function bar(mat,a,c,width,name,anchors,round=false){const av=new THREE.Vector3(...xyz(...a)),cv=new THREE.Vector3(...xyz(...c)),axis=cv.clone().sub(av);
 const g=round?new THREE.CylinderGeometry(width,width,axis.length(),near?6:4,1,false):new THREE.BoxGeometry(width,axis.length(),width);
 g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),axis.normalize()));g.translate(...av.clone().add(cv).multiplyScalar(.5).toArray());put(g,mat,null,(a[0]+c[0])/2);
 if(anchors)members.push({name,ends:[av.toArray(),cv.toArray()],supports:anchors});}
 // Closed, curved strips; subdivided road width lets the world policy fit wide landings.
 function strip(mat,start,end,left,right,offset,thick,name){
  const cuts=[start,end,...p.ALIGNMENT.map(v=>v.s).filter(s=>s>start&&s<end)];
  for(let s=start+(near?4:8);s<end;s+=near?4:8)cuts.push(s);
  for(const s of [CABLE_START,CABLE_END,STRUCTURE_START,STRUCTURE_END])if(s>start&&s<end)cuts.push(s);
  const ss=[...new Set(cuts)].sort((a,c)=>a-c);
  for(let k=0;k<(near?3:1);k++){
   const from=L*k/(near?3:1),to=L*(k+1)/(near?3:1),samples=ss.filter(s=>s>=from&&s<=to);
   if(start<from&&end>from)samples.unshift(from);if(start<to&&end>to)samples.push(to);if(samples.length<2)continue;
   const cols=mat==='asphalt'?11:2,stride=cols*(thick?2:1),pos=[],idx=[];
   for(const s of samples){const a=typeof left==='function'?left(s):left,c=typeof right==='function'?right(s):right;
    for(let row=0;row<(thick?2:1);row++)for(let j=0;j<cols;j++)pos.push(...xyz(s,a+(c-a)*j/(cols-1),p.deckHeight(s)+offset-row*thick));}
   for(let i=1;i<samples.length;i++){const a=(i-1)*stride,c=i*stride;
    for(let j=0;j<cols-1;j++){idx.push(a+j,a+j+1,c+j,a+j+1,c+j+1,c+j);if(thick)idx.push(a+cols+j,c+cols+j,a+cols+j+1,a+cols+j+1,c+cols+j,c+cols+j+1);}
    if(thick)idx.push(a,c,a+cols,a+cols,c,c+cols,a+cols-1,a+stride-1,c+cols-1,a+stride-1,c+stride-1,c+cols-1);}
   if(thick){const a=(samples.length-1)*stride;for(let j=0;j<cols-1;j++)idx.push(j,j+cols,j+1,j+1,j+cols,j+cols+1,a+j,a+j+1,a+j+cols,a+j+1,a+j+cols+1,a+j+cols);}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,mat,name,(from+to)/2);
  }
 }
 strip('concrete',STRUCTURE_START,STRUCTURE_END,s=>-widthAt(s)/2,s=>widthAt(s)/2,-.2,1,'deck');
 // Six longitudinal stringers end on the approach cap beams; their top touches the slab.
 const pierStations=[STRUCTURE_START,CABLE_START,WEST_TOWER,EAST_TOWER,CABLE_END,STRUCTURE_END];
 for(const s of pierStations){const top=p.deckHeight(s)-1.2;
  box('concrete',s,0,top-1.4,5,widthAt(s),2.8,'cap-'+s);
  for(const d of [-15,0,15]){box('concrete',s,d,(top-2.5)/2,3,2.6,top-2.5,'pier-'+s+'-'+d,y=>Math.max(0,Math.min(1,y/(top-2.5))));}
 }
 for(const d of [-17,-10,-3,3,10,17]){strip('steel',STRUCTURE_START,STRUCTURE_END,d-.45,d+.45,-1.2,1.9,'girder');members.push({name:'girder-'+d,ends:[xyz(STRUCTURE_START,d,p.deckHeight(STRUCTURE_START)-2),xyz(STRUCTURE_END,d,p.deckHeight(STRUCTURE_END)-2)],supports:['cap-'+STRUCTURE_START,'cap-'+STRUCTURE_END]});}
 for(let s=STRUCTURE_START+12;s<STRUCTURE_END;s+=near?12:36){bar('steel',[s,-17,p.deckHeight(s)-2.1],[s,17,p.deckHeight(s)-2.1],.55,'floorbeam-'+s,['girder','girder']);}
 // Roadway, north-side 3 m shared path, median and concrete barriers.
 for(let side=0;side<2;side++){
  strip('asphalt',0,L,s=>edgesAt(s)[side][0],s=>edgesAt(s)[side][1],0,0,'road');
  for(let edge=0;edge<2;edge++){
   const d=s=>edgesAt(s)[side][edge]+(edge?-.15:.15);
   if(near)strip('paint',0,L,s=>d(s)-.06,s=>d(s)+.06,.11,0,null);
  }
  if(near)for(let s=4;s<L-4;s+=12)for(let i=1;i<(side?4:3);i++){const d=edgesAt(s)[side][0]+(edgesAt(s)[side][1]-edgesAt(s)[side][0])*i/(side?4:3);box('paint',s,d,p.deckHeight(s)+.11,3,.12,.015,null);}
 }
 strip('concrete',0,L,s=>-widthAt(s)/2,s=>-widthAt(s)/2+3.1,.18,.18,'walkway');
 strip('concrete',0,L,-1.7,1.7,.18,.18,'median');
 for(const side of [-1,1]){const d=s=>side*(widthAt(s)/2-.22);
  strip('concrete',0,L,s=>d(s)-.22,s=>d(s)+.22,side<0?.38:1.13,side<0?.2:.85,'barrier');
 }
 strip('concrete',0,L,s=>-widthAt(s)/2+3.35,s=>-widthAt(s)/2+3.75,1.13,.85,'barrier');
 // Separate slender masts in each of the three stay planes; no portal crossbeam above traffic.
 for(const s of [WEST_TOWER,EAST_TOWER])for(const d of planesAt(s)){
  const name='tower-'+s+'-'+d,pos=[],idx=[],levels=[[2.5,4.4,3.1],[DECK_H,3.7,2.6],[TOWER_H,2.7,2.2]];
  for(const [y,length,width] of levels){const a=length/2,c=width/2,e=.25;for(const [u,v] of [[-a+e,-c],[a-e,-c],[a,-c+e],[a,c-e],[a-e,c],[-a+e,c],[-a,c-e],[-a,-c+e]])pos.push(...xyz(s+u,d+v,y));}
  for(let k=1;k<3;k++)for(let j=0;j<8;j++){const a=(k-1)*8+j,c=(k-1)*8+(j+1)%8,u=k*8+j,v=k*8+(j+1)%8;idx.push(a,u,c,c,u,v);}
  for(let j=1;j<7;j++)idx.push(0,j,j+1,16,16+j+1,16+j);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();put(g,'tower',name,s,y=>Math.max(0,Math.min(1,y/(DECK_H-3))));
  box('tower',s,d,1.25,8,6,2.5,'foundation-'+name,0);
  for(const sign of [-1,1])for(let i=1;i<=10;i++){
   if(!near&&i%2&&i!==1)continue;
   const ds=s+sign*(8+8.45*i),dd=planesAt(ds)[planesAt(s).indexOf(d)],y=DECK_H+2+3.7*i;
   const anchor='anchor-'+s+'-'+d+'-'+sign+'-'+i;
   box('concrete',ds,dd,DECK_H+.52,1.4,.8,1.45,anchor);
   if(near)box('tower',s+sign*1.5,d,y,.55,2.4,.8,null);
   bar('cable',[s+sign*(1.85-(y-DECK_H)*.5/(TOWER_H-DECK_H)-.03),d,y],[ds,dd,DECK_H+.55],near?.105:.14,'stay-'+anchor,[name,anchor],true);
  }
 }
 // Continuous rail on the north path, terminated in end posts, not free in space.
 const railD=s=>-widthAt(s)/2+.15;
 for(let s=0;s<=L;s+=near?3:12)box('rail',s,railD(s),p.deckHeight(s)+.98,.13,.13,1.2,'rail-post');
 box('rail',L,railD(L),p.deckHeight(L)+.98,.13,.13,1.2,'rail-post');
 strip('rail',0,L,s=>railD(s)-.06,s=>railD(s)+.06,1.58,.12,'handrail');
 members.push({name:'handrail',ends:[xyz(0,railD(0),1.52),xyz(L,railD(L),1.52)],supports:['rail-post','rail-post']});
 for(let s=0;s<=L;s+=near?3:12)members.push({name:'rail-post-'+s,ends:[xyz(s,railD(s),p.deckHeight(s)+.38),xyz(s,railD(s),p.deckHeight(s)+1.58)],supports:['barrier','handrail']});
 if(near)for(let s=STRUCTURE_START;s<=STRUCTURE_END;s+=55){const d=widthAt(s)/2-.22;bar('rail',[s,d,p.deckHeight(s)+1.13],[s,d,p.deckHeight(s)+10],.14,'lamp-mast-'+s,['barrier','lamp-head']);box('lamp',s,d,p.deckHeight(s)+10,.6,.5,.24,'lamp-head');}
 const root=b.finish();records.set(root,{supports,members});return root;
}
