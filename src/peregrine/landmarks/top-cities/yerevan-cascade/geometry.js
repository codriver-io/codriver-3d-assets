import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { point, LEVELS, STATIONS, ANGLE, groundOffset } from './yerevan-cascade-plan.js';

export function create({detail='near'}={}) {
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const put=(g,m,foot=0)=>{
  const p=g.attributes.position;
  if(!g.getAttribute('terrainOffset'))g.setAttribute('terrainOffset',new THREE.Float32BufferAttribute(Array.from({length:p.count},(_,i)=>p.getY(i)<.001?foot:0),1));
  // Soil-contact caps have no visible exterior and must not participate in
  // opposing garden/stone depth relationships at the shared grade.
  const n=g.attributes.normal,source=g.index,ix=[];
  for(let i=0;i<(source?source.count:p.count);i+=3){const a=source?source.getX(i):i,c=source?source.getX(i+1):i+1,d=source?source.getX(i+2):i+2;
   if(n.getY(a)<-.99 && Math.abs(p.getY(a))<.001 && Math.abs(p.getY(c))<.001 && Math.abs(p.getY(d))<.001)continue;
   ix.push(a,c,d);
  }
  g.setIndex(ix);g.rotateY(-ANGLE); b.put(g,m);
 };
 const box=(m,u,y,s,w,h,d,foot=0)=>{const g=new THREE.BoxGeometry(w,h,d);g.translate(u,y,-s);put(g,m,foot);};
 // Closed sections stop at the previous terrace, rather than a giant y=0 wedge.
 function prism(profile,u0,u1,m,skipVertical=false) {
  const shape=new THREE.Shape(profile.map(([s,y])=>new THREE.Vector2(-s,y)));
  const tris=THREE.ShapeUtils.triangulateShape(shape.getPoints(),[]), ps=shape.getPoints();
  if(ps.at(-1).equals(ps[0]))ps.pop();
  const p=[],ix=[];for(const u of [u0,u1])for(const v of ps)p.push(u,v.y,v.x);
  const n=ps.length;
  for(const t of tris) {ix.push(t[0],t[1],t[2],n+t[2],n+t[1],n+t[0]);}
  for(let i=0;i<n;i++){const j=(i+1)%n;
   if(skipVertical && Math.abs(ps[i].x-ps[j].x)<.01 && ps[i].y>0 && ps[j].y>0 && i>1)continue;
   ix.push(i,j,n+i,j,n+j,n+i);
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();
  put(g,m);
 }
 const counts=near?[42,117,117,110,103,83]:[10,28,28,26,25,20];
 for(let i=0;i<6;i++) {
  const a=STATIONS[i],z=STATIONS[i+1],h=LEVELS[i],top=LEVELS[i+1],lo=Math.max(0,h-.8),front=z-16;
  const core=i===5?[[a,lo],[z,lo],[z,top],[a,top]]:
   [[a,lo],[z,lo],[z,top],[front,top],[front,Math.max(.25,h)],[a,Math.max(.25,h)]];
  prism(core,-14,14,'stone',true);
  const n=counts[i],end=z-3,stairs=[[a,lo],[z,lo],[z,top],[end,top]];
  for(let k=n;k>0;k--)stairs.push([a+(end-a)*(k-1)/n,h+(top-h)*k/n],[a+(end-a)*(k-1)/n,h+(top-h)*(k-1)/n]);
  for(const side of [-1,1])prism(stairs,side<0?-25:14,side<0?-14:25,'stone');
  // Cityscape's authored hillside substitute: short stepped retaining tiers,
  // planted setbacks and a closed base. This is site geometry, never DEM data.
  // In world every base vertex is buried below its section's terrain pad;
  // the separately fitted limestone feet still hold the immutable stair shell.
  if(h>0){
   const baseTop=h-1.3,tiers=Math.ceil(baseTop/8);
   for(let tier=0;tier<tiers;tier++){
    const low=tier*baseTop/tiers,high=(tier+1)*baseTop/tiers,width=49-tier*.35;
    for(const [m,bottom,roof,w] of [['garden',low,high-.65,width],['concrete',high-.65,high,width-.18]]){
     const g=new THREE.BoxGeometry(w,roof-bottom,z-a);g.translate(0,(bottom+roof)/2,-(a+z)/2);
     const p=g.attributes.position,n=g.attributes.normal,ix=[];
     // Keep retaining ledges; remove internal soil/concrete contact caps.
     for(let v=0;v<g.index.count;v+=3){const a=g.index.getX(v),c=g.index.getX(v+1),d=g.index.getX(v+2);
      if(m==='garden' && (n.getY(a)>.99 || tier>0&&n.getY(a)<-.99) || m==='concrete'&&n.getY(a)<-.99)continue;
      ix.push(a,c,d);
     }
     g.setIndex(ix);
     g.setAttribute('terrainOffset',new THREE.Float32BufferAttribute(Array.from({length:p.count},(_,v)=>h-1.5-p.getY(v)),1));
     put(g,m);
    }
   }
   for(const s of (near?[a+2,(a+front)/2,front-2]:[a+2,front-2]))for(const u of [-22,-11,0,11,22]){
    const height=h-.5;
    box('stone',u,height/2,s,2.4,height,2.4,groundOffset(s)-.25);
   }
  }
  // The outer wall is broken into short recessed retaining bays, tied to each
  // flight's floor. No single side/rear panel extends down the 78 m hillside.
  for(const side of [-1,1])for(let s=a+4;s<z-3;s+=8){
   const y=h+(top-h)*Math.min(1,(s-a)/(z-3-a));
   box('stone',side*24.3,(lo+y)/2,s,1.4,y-lo,1.2);
  }
 }
 // True apertures in the upper two gallery walls, recessed blue glazing inside.
 for(let i=0;i<5;i++) {
  const s=STATIONS[i+1]-16,y=LEVELS[i],h=LEVELS[i+1]-y;
  const sh=new THREE.Shape();sh.moveTo(-14,y+.25);sh.lineTo(14,y+.25);sh.lineTo(14,y+h);sh.lineTo(-14,y+h);sh.closePath();
  if(i===1||i===3) {
   const r=i===1?5:6, spring=y+h-6.5, hole=new THREE.Path();
   hole.moveTo(-r,y+3.4);hole.lineTo(-r,spring);hole.absarc(0,spring,r,Math.PI,0,true);hole.lineTo(r,y+3.4);hole.closePath();sh.holes.push(hole);
   const arch=new THREE.Shape();arch.moveTo(-r,y+3.4);arch.lineTo(r,y+3.4);arch.lineTo(r,spring);arch.absarc(0,spring,r,0,Math.PI,false);arch.closePath();
   const glass=new THREE.ShapeGeometry(arch,near?20:10);glass.translate(0,0,-s-.8);put(glass,'glass');
   // Sunburst fountain relief below the arch: broad radial rays, not a decal.
   const cy=y+3.5;
   for(let k=0;k<(near?17:9);k++) {
    const a=Math.PI*(k+.5)/(near?17:9),r0=.55,r1=3;
    const g=new THREE.CylinderGeometry(.18,.48,r1-r0,3);g.rotateZ(a-Math.PI/2);g.translate(Math.cos(a)*(r0+r1)/2,cy+Math.sin(a)*(r0+r1)/2,-s+.4);put(g,'relief');
   }
  }
  const g=new THREE.ExtrudeGeometry(sh,{depth:1,bevelEnabled:false,curveSegments:near?20:10});g.translate(0,0,-s-1);put(g,'stone');
  // Distinctive scalloped/fan fountain walls at the lower and central terraces.
  if(i===0||i===2||i===4) {
   const rows=i===0?2:3,r=i===0?2.8:2.5;
   for(let row=0;row<rows;row++)for(let col=0;col<5-row%2;col++) {
    const u=(col-(4-row%2)/2)*5.35,cy=y+1+row*2.8;
    const fan=new THREE.Shape();fan.moveTo(0,0);fan.absarc(0,0,r,0,Math.PI,false);fan.lineTo(0,0);
    const fg=new THREE.ExtrudeGeometry(fan,{depth:.42,bevelEnabled:false,curveSegments:near?12:6});fg.translate(u,cy,-s+.22);put(fg,'relief');
    const hub=new THREE.CylinderGeometry(.36,.45,.4,near?10:6);hub.rotateX(Math.PI/2);hub.translate(u,cy+.35,-s+.9);put(hub,'relief');
    if(near)for(let a=1;a<8;a++) {
     const ang=Math.PI*a/8;
     const g=new THREE.CylinderGeometry(.035,.035,r-.45,3);g.rotateZ(ang-Math.PI/2);g.translate(u+Math.cos(ang)*(r+.45)/2,cy+Math.sin(ang)*(r+.45)/2,-s+.7);put(g,'relief');
    }
   }
  }
  // Lower gardens and water are seated on the previous level; bounded basins.
  const mid=(STATIONS[i]+s)/2,depth=Math.max(2,s-STATIONS[i]-5);
  for(const u of [-9,9]) {
   const d=Math.min(depth,15);
   for(const side of [-1,1]) {box('stone',u+side*3.25,y+.42,mid,.5,.84,d);box('stone',u,y+.42,mid+side*(d/2-.25),6,.84,.5);}
   box('garden',u,y+.425,mid,4.8,.85,d-2.4);
  }
  for(const side of [-1,1]){box('stone',side*5.7,y+.4,s-3.5,.6,.8,4.8);box('stone',0,y+.4,s-3.5+side*2.1,10.8,.8,.6);}
  box('water',0,y+.38,s-3.5,10.8,.76,3.6);
  // Terrace floodlight modules seated on the structural wall.
  for(const u of [-12,12]) {box('glow',u,y+h+.15,s+.5,.5,.3,.5);}
 }
 // Unfinished top: exposed concrete retaining faces and short incomplete partitions.
 box('stone',0,73.5,246,28,9,1);
 for(const u of [-11,0,11])box('concrete',u,78.6,270,1.1,1.2,20);
 const root=b.finish();root.userData.terraceLevels=LEVELS;
 // Compact runs survive GLB export and use the shared building-layer's existing
 // terrainOffsets path. The base is buried and ground-facing pier feet move;
 // all structural floors, walls and treads remain rigid in both LODs.
 for(const mesh of root.children){
  const g=mesh.geometry,o=g.getAttribute('terrainOffset');mesh.userData.terrainOffsets=[];
  for(let start=0;start<o.count;){const value=o.getX(start);let end=start+1;while(end<o.count&&o.getX(end)===value)end++;if(value)mesh.userData.terrainOffsets.push([start,end-start,value]);start=end;}
  g.deleteAttribute('terrainOffset');g.deleteAttribute('bridgeLift');
 }
 return root;
}
