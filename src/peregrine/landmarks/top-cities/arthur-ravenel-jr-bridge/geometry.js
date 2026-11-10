import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {PROFILE as p,MID,L,CORE,LANDING,TAPER,landingBlend,authoredLateral} from './arthur-ravenel-jr-bridge-profile.js';
export const TOWERS=[-235.6104,235.6104], END=720, HALF=19.5;
export const deckHeight=x=>p.deckHeight(MID+x);
export const point=([x,y,z])=>{const q=p.bridgePoint(MID+x,authoredLateral(MID+x,z),y);return new THREE.Vector3(q.x,q.y,q.z);};
export function pierStations(){const stations=[];for(const sign of [-1,1])for(let x=462;x<(sign<0?MID:L-MID)-TAPER;x+=64.5)if(deckHeight(sign*x)>5)stations.push(sign*x);return stations;}
export function stays(detail='near') {
 const out=[];
 for(const t of TOWERS)for(const side of [-1,1])for(const dir of [-1,1])for(let i=0;i<16;i++) {
  if(detail==='far'&&i%2&&i!==15)continue;
  const y=143.5+i*1.72, z=side*(1.55+(174.9552-y)*21.3/114.9552),s=t+dir*(25+13.0*i);
  out.push({top:[t+dir*2.8,y,z],foot:[s,deckHeight(s)+.42,side*18.9]});
 }
 return out;
}
export function create({detail='near',audit=false}={}) {
 const members=[],supports={posts:[],concrete:[]};
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const put=(g,m,lift=1,role=null)=>{const a=g.attributes.position;for(let i=0;i<a.count;i++){const q=point([a.getX(i),a.getY(i),a.getZ(i)]);a.setXYZ(i,q.x,q.y,q.z);}if(!g.index)g.setIndex(Array.from({length:a.count},(_,i)=>i));const kept=[],ix=g.index,ab=new THREE.Vector3(),ac=new THREE.Vector3(),a0=new THREE.Vector3();
  for(let i=0;i<ix.count;i+=3){const ids=[ix.getX(i),ix.getX(i+1),ix.getX(i+2)];a0.fromBufferAttribute(a,ids[0]);ab.fromBufferAttribute(a,ids[1]).sub(a0);ac.fromBufferAttribute(a,ids[2]).sub(a0);if(ab.cross(ac).lengthSq()>1e-10)kept.push(...ids);}g.setIndex(kept);g.computeVertexNormals();if(audit&&(role==='posts'||m==='concrete'))supports[role==='posts'?'posts':'concrete'].push(g.clone());b.put(g,m,0,lift);};
 const box=(m,x,y,z,w,h,d,lift=1,grade=false)=>{const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);if(grade){const a=g.attributes.position;for(let i=0;i<a.count;i++)a.setY(i,a.getY(i)+deckHeight(a.getX(i))-deckHeight(x));}put(g,m,lift);};
 function faces(m,positions,index){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions.flat(),3));g.setIndex(index);g.computeVertexNormals();put(g,m);}
 function tube(m,a,c,r,n=near?6:4,role=null){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...c),v=B.clone().sub(A);const g=new THREE.CylinderGeometry(r,r,v.length(),n,1,false);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...A.add(B).multiplyScalar(.5).toArray());put(g,m,1,role);if(audit&&role)members.push({role,a:point(a).toArray(),c:point(c).toArray()});}
 // Shared sampled deck: top asphalt and concrete shell meet on edges, never overlapping planes.
 const step=near?12:24,start=-MID,end=L-MID;
 const stations=new Set([start,end,-CORE,CORE,0,...TOWERS]);
 for(let x=-END;x<=END;x+=step)stations.add(x);
 for(let x=start;x<end;x+=step)if(Math.abs(x)>END)stations.add(x);
 for(const q of p.ALIGNMENT)stations.add(q.s-MID);
 for(const q of [LANDING,TAPER,L-TAPER,L-LANDING])stations.add(q-MID);
 const xs=[...stations].filter(x=>x>=start&&x<=end).sort((a,b)=>a-b);
 for(let i=1;i<xs.length;i++){const x=xs[i-1],e=xs[i],a=deckHeight(x),c=deckHeight(e);
  const thick=q=>Math.min(2,Math.max(.20,deckHeight(q)));
  for(const [l,r] of [[-HALF,-.3],[.3,15.6]])faces('asphalt',[[x,a,l],[x,a,r],[e,c,r],[e,c,l]],[0,1,2,0,2,3]);
  faces('concrete',[[x,a,15.6],[x,a,HALF],[e,c,HALF],[e,c,15.6]],[0,1,2,0,2,3]);
  const nose=MID+x<TAPER-.001||MID+e>L-TAPER+.001;
  for(const [left,right] of nose?[[-HALF,-.3],[.3,HALF]]:[[-HALF,HALF]])
   faces('concrete',[[x,a,left],[e,c,left],[e,c-thick(e),left],[x,a-thick(x),left],[x,a,right],[x,a-thick(x),right],[e,c-thick(e),right],[e,c,right],[x,a-thick(x),left],[e,c-thick(e),left],[e,c-thick(e),right],[x,a-thick(x),right]],[0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11]);
  // Barrier and median supported continuously by the slab; no raised asphalt overlays.
  for(const z of [-18.9,0,15.3,18.9]){
   const fa=1-landingBlend(MID+x),fc=1-landingBlend(MID+e);
   faces('concrete',[[x,a-.02,z-.275],[x,a+1.08*fa,z-.275],[x,a+1.08*fa,z+.275],[x,a-.02,z+.275],[e,c-.02,z-.275],[e,c+1.08*fc,z-.275],[e,c+1.08*fc,z+.275],[e,c-.02,z+.275]], [0,1,5,0,5,4,1,2,6,1,6,5,2,3,7,2,7,6,3,0,4,3,4,7,0,3,2,0,2,1,4,5,6,4,6,7]);
  }
  // Distinct south pedestrian walk: integrated light concrete strip replaces the asphalt face here.
 }
 // At-grade ends have no slab top crossing the open median; only the road ribbons meet the provider.
 // Towers are true hollow diamond prisms; the road passes through the widest opening.
 for(const t of TOWERS){
  const shape=new THREE.Shape([[-5,4],[-25,60],[-3.0,174.9552],[3.0,174.9552],[25,60],[5,4]].map(p=>new THREE.Vector2(...p)));
  shape.holes.push(new THREE.Path([[0,15],[19.0,61],[0,163.8],[-19.0,61]].map(p=>new THREE.Vector2(...p))));
  const g=new THREE.ExtrudeGeometry(shape,{depth:5.6,bevelEnabled:false,curveSegments:1});g.rotateY(Math.PI/2);g.translate(t-2.8,0,0);put(g,'tower',y=>Math.max(0,Math.min(1,(y-4)/(deckHeight(t)-4))));
  box('tower',t,deckHeight(t)-3.3,0,7,4.5,44);
  box('concrete',t,3.2,0,15,4.4,18,0);
  const island=new THREE.CylinderGeometry(1,1.23,2,near?24:12);island.scale(29,1,23);island.translate(t,1,0);put(island,'rock',0);
 }
 for(const q of stays(detail))tube('cable',q.top,q.foot,near?.17:.24,near?5:4);
 // Deep edge members and transverse floorbeams are part of the slab material, with actual bearing contacts.
 for(const x of pierStations()){
  const h=deckHeight(x)-2;
  for(const z of [-11,11])box('concrete',x,(h-2)/2,z,3.4,h-2,3.4,y=>Math.max(0,Math.min(1,y/(h-2))));
  box('concrete',x,h-1.2,0,4.8,2.4,38.8,1,true);
 }
 // Fine railing on the pedestrian edge, with terminal posts and all intermediate supports.
 const railY=x=>deckHeight(x)+1.8;
 const railStep=near?12:24,postStep=near?6:24;
 const railStations=[start+TAPER,...Array.from({length:Math.ceil(L/railStep)+1},(_,i)=>Math.ceil((start+TAPER+END)/railStep)*railStep-END+i*railStep).filter(x=>x>start+TAPER&&x<end-TAPER),end-TAPER];
 for(let i=1;i<railStations.length;i++){const x=railStations[i-1],e=railStations[i];tube('metal',[x,railY(x),18.9],[e,railY(e),18.9],near?.075:.12,near?6:4,'rails');}
 const posts=[start+TAPER,...Array.from({length:Math.ceil(L/postStep)+1},(_,i)=>Math.ceil((start+TAPER+END)/postStep)*postStep-END+i*postStep).filter(x=>x>start+TAPER&&x<end-TAPER),end-TAPER];
 for(const x of posts)tube('metal',[x,deckHeight(x)+1.08,18.9],[x,railY(x),18.9],near?.06:.10,near?6:4,'posts');
 if(near)for(let x=Math.ceil((start+TAPER+714)/18)*18-714;x<end-TAPER-4;x+=18)for(const z of [-14.0,-10.1,-6.2,4.0,7.9,11.8]){
  const y=deckHeight(x)+.03;faces('paint',[[x,y,z-.07],[x,y,z+.07],[x+4,deckHeight(x+4)+.03,z+.07],[x+4,deckHeight(x+4)+.03,z-.07]],[0,1,2,0,2,3]);
 }
 const root=b.finish();if(audit)root.userData.audit={members,supports};return root;
}
