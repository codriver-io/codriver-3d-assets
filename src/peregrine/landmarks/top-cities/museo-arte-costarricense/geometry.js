import * as THREE from 'three';
import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {kit} from './museo-arte-costarricense-parts.js';
export const CABIN=[3.6,-9.7];
export const GUARDS=[{x0:-.15,x1:7.35,z0:-12.9,z1:-6.5,floor:13.4,top:14.35,closed:true},{x0:.15,x1:12.45,z0:13.4,z1:14.6,floor:4.3,top:5.4,closed:false}];
export function guardPosts(g,detail='near'){const p=[];for(const z of g.closed?[g.z0,g.z1]:[g.z1]){const n=Math.ceil((g.x1-g.x0)/(detail==='far'?2.1:1.05));for(let i=0;i<=n;i++)p.push([g.x0+(g.x1-g.x0)*i/n,g.floor,z]);}for(const x of [g.x0,g.x1])p.push([x,g.floor,g.z0]);return p;}
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,bar,poly}=k;
 function hip(x,z,w,d,y,peak,abutEast=false){
  const pts=[[-w/2,y,-d/2],[w/2,y,-d/2],[w/2,y,d/2],[-w/2,y,d/2]].map(p=>[p[0]+x,p[1],p[2]+z]),ridge=w>=d?[[x-(w-d)/2,peak,z],[x+(w-d)/2,peak,z]]:[[x,peak,z-(d-w)/2],[x,peak,z+(d-w)/2]];
  const faces=w>=d?[[pts[0],pts[1],ridge[1],ridge[0]],[pts[1],pts[2],ridge[1]],[pts[2],pts[3],ridge[0],ridge[1]],[pts[3],pts[0],ridge[0]]]:[[pts[0],pts[1],ridge[0]],[pts[1],pts[2],ridge[1],ridge[0]],[pts[2],pts[3],ridge[1]],[pts[3],pts[0],ridge[0],ridge[1]]];
  for(let i=0;i<pts.length;i++){if(abutEast&&i===1)continue;const a=pts[i],b=pts[(i+1)%pts.length];poly('roof',[a,b,[b[0],b[1]-.22,b[2]],[a[0],a[1]-.22,a[2]]],[0,1,2,0,2,3]);}
  for(const f of faces){const a=new THREE.Vector3(...f[1]).sub(new THREE.Vector3(...f[0])),b=new THREE.Vector3(...f[2]).sub(new THREE.Vector3(...f[0]));if(a.cross(b).y<0)f.reverse();const ix=f.length===4?[0,1,2,0,2,3]:[0,1,2];poly('roof',f,ix);poly('roof',f.map(p=>[p[0],p[1]-.22,p[2]]),[...ix].reverse());}
 }
 // Mapped low curved terminal wings, with the detailed middle facade owning the eastern long edge.
 k.shell('white',LOCAL_RINGS,0,4.0,[.55],near?6:9);
 wall('white',16.7,0,4.0,.65,-8.35,12.56,0); // Blank low arrival wing below the foreground hip.
 // Long upper hall. The grand flat arch and three small upper arches remain geometric recesses.
 const mainHoles=[{u:-.3,y:.2,w:12,h:3.3,arch:true,mat:'glass'},...[-2.7,-.5,1.7].map(u=>({u,y:4.65,w:1.45,h:2,arch:true,mat:'glass'}))];
 wall('white',32.6,0,7.1,.65,-3.7,5.55,0,[-14,-9,-4].map(x=>({u:x+3.7,y:5.05,w:3.2,h:1.6,lunette:true,mat:'glass'})));
 wall('white',12.6,0,7.1,.65,6.3,12.45,0,mainHoles);
 wall('white',6.9,0,7.1,.65,.65,9.65,-Math.PI/2);
 box('trim',6.3,6.95,9.65,12.6,.3,6.9);hip(6.3,9.7,13.2,7.5,7.15,7.9,true);
 wall('white',32.6,0,7.1,.65,-3.7,-6.15,Math.PI,[8.3,1.3,-5.7,-12.7].map(u=>({u,y:4.6,w:1.2,h:1.8,arch:true,mat:'glass'})));
 wall('white',13,0,7.1,.65,-19.35,-.3,-Math.PI/2,[{u:0,y:4.5,w:1.2,h:1.8,arch:true,mat:'glass'}]);
 // The north pavilion owns the adjoining side; no buried duplicate wall.

 const cornice=new THREE.BoxGeometry(33.4,.35,14.0),ci=Array.from(cornice.index.array);cornice.setIndex([...ci.slice(6,18),...ci.slice(24)]);cornice.translate(-3.7,7,0);k.put(cornice,'trim');hip(-3.9,0,33.0,14.0,7.2,8.7,true);
 // Foreground tiled low wing and the open arrival balcony above its flattened entrance.
 hip(-8,10.5,16.2,6.2,4.1,5.0,true);
 box('white',6.3,4.25,13.6,12.6,.3,2.3);
 // Two-storey north pavilion: five arched lights around a central entrance on each level.
 const pavilion={};for(const f of ['north','south','east','west'])pavilion[f]=[];
 for(const u of [-4,-2,0,2,4])for(const y of [.5,4.65])pavilion.south.push({u,y,w:u===0?1.0:1.1,h:2.7,arch:true,mat:'glass'});
 for(const f of ['north','east','west'])for(const u of [-8,-3,3,8])for(const y of [.7,4.65])pavilion[f].push({u,y,w:1.05,h:2.5,arch:true,mat:'glass'});
 // North/south walls are11.4m wide, side walls26.4m; their window sets fit each face.
 pavilion.north=pavilion.south;
 k.block('white',18.3,6.3,11.4,26.6,0,9.2,pavilion);
 box('trim',18.3,9.15,6.3,12.2,.35,27.4);hip(18.3,6.3,12.5,27.7,9.35,10.8);
 // Rear mapped tower projection: two stacked arches beneath a glazed former control cabin.
 const [tx,tz]=CABIN;
 k.block('white',tx,tz,7,5.3,0,13.3,{south:[8.6,10.7].map(y=>({u:0,y,w:1.25,h:1.8,arch:true,mat:'glass'})),north:[{u:0,y:10.7,w:1.25,h:1.9,arch:true,mat:'glass'}]});
 for(const s of [-1,1])box('trim',tx+s*3.25,10.6,tz+2.35,.6,5.0,.6);
 // Shallow projecting tier breaks beneath the two actual stacked shaft windows.
 for(const y of [8.25,10.50]){
  const rectangle=(w,d)=>[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].map(([x,z])=>new THREE.Vector2(tx+x,-tz-z));
  const sh=new THREE.Shape(rectangle(7.35,5.65));sh.holes.push(new THREE.Path(rectangle(7,5.3)));
  const g=new THREE.ExtrudeGeometry(sh,{depth:.18,bevelEnabled:false,steps:1}),p=g.attributes.position,ix=[];
  for(let i=0;i<p.count;i+=3){const v=[0,1,2].map(j=>[p.getX(i+j),p.getY(i+j),p.getZ(i+j)]),side=Math.max(...v.map(q=>q[2]))-Math.min(...v.map(q=>q[2]))>.1,buried=side&&([tx-3.5,tx+3.5].some(x=>v.every(q=>Math.abs(q[0]-x)<.002))||[-tz-2.65,-tz+2.65].some(z=>v.every(q=>Math.abs(q[1]-z)<.002)));if(!buried)ix.push(i,i+1,i+2);}g.setIndex(ix);
  g.rotateX(-Math.PI/2);g.translate(0,y-.09,0);k.put(g,'trim');
 }
 box('white',tx,13.3,tz,7.8,.4,6.7);
 const cabinWindows=w=>[-1.75,0,1.75].filter(u=>Math.abs(u)<w/2-.4).map(u=>({u,y:13.6,w:1.05,h:2.3,arch:true,mat:'glass'}));
 for(let i=0;i<4;i++){const a=i*Math.PI/2,long=i%2===0,w=long?5.7:4.5;wall('white',w,13.5,16.2,.45,tx+(long?0:(i===1?2.4:-2.4)),tz+(long?(i===0?1.8:-1.8):0),a,cabinWindows(w));}
 box('trim',tx,16.2,tz,6.5,.35,5.4);hip(tx,tz,7.1,6.0,16.4,17.4);
 bar('metal',[tx,17.25,tz],[tx,18.5,tz],.06);
 // Separate named posts and rails allow actual member-end bearing tests in both LODs.
 for(const g of GUARDS){
  for(const p of guardPosts(g,detail))bar('metal',p,[p[0],g.top,p[2]],.12);
  const edges=[[[g.x0,g.z1],[g.x1,g.z1]],[[g.x0,g.z0],[g.x0,g.z1]],[[g.x1,g.z0],[g.x1,g.z1]]];if(g.closed)edges.push([[g.x0,g.z0],[g.x1,g.z0]]);
  for(const [a,b] of edges)for(const y of near?[g.top-.1,g.floor+.45]:[g.top-.1])bar('iron',[a[0],y,a[1]],[b[0],y,b[1]],.075);
 }
 // Exterior stair flight: rigid, grounded step groups and a landing into the north pavilion.
 const n=near?16:8;
 for(let i=0;i<n;i++){const h=4.32*(i+1)/n,z=19-(i+.5)*9.6/n;box('white',26.2,h/2,z,3,h,9.6/n+.02);}
 box('white',25.5,4.23,9.2,4.0,.34,1.8);
 const stairSide=new THREE.Shape([[19,0],[19,1.0],[9.4,5.3],[8.3,5.3],[8.3,0]].map(([z,y])=>new THREE.Vector2(-z,y)));
 for(const x of [24.65,27.55]){const g=new THREE.ExtrudeGeometry(stairSide,{depth:.22,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(x,0,0);k.put(g,'white');}
 // Muted thin base course, not painted signage or copied relief artwork.
 box('base',-3.7,.18,13.14,32.6,.32,.15);
 const m=k.finish();m.userData.features=['former airport control cabin','open iron balconies','flattened arrival arch','tiled colonial hips','north stair/pavilion'];return m;
}
