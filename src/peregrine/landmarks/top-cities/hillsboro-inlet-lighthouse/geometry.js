import * as THREE from 'three';import {SPEC,PALETTES} from './config.js';import {FOOTPRINTS} from './footprint.js';import {kit} from './hillsboro-inlet-lighthouse-kit.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,cyl,lathe,wall,roof,ring,put}=k;
 const contacts=[],levels=[.86,8,15,22,28.4,34.8],rAt=y=>6.096+(2.55-6.096)*(y-.86)/(34.8-.86),angle=i=>i*Math.PI/4;
 const point=(i,j)=>[rAt(levels[j])*Math.cos(angle(i)),levels[j],rAt(levels[j])*Math.sin(angle(i))];
 const paint=y=>y<22?'white':'black';
 function pipe(mat,a,b,r=.07){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),v=bv.clone().sub(av),g=new THREE.CylinderGeometry(r,r,v.length(),near?6:4,1,true);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...av.add(bv).multiplyScalar(.5).toArray());put(g,mat);}
 function member(mat,a,b,r,label){pipe(mat,a,b,r);contacts.push({label,ends:[a,b]});}
 // Exact mapped paved base, independently inverse-rotated so it follows the source ring.
 const R=SPEC.rotation,C=Math.cos(R),S=Math.sin(R),K=111320*Math.cos(SPEC.origin[1]*Math.PI/180);
 const base=FOOTPRINTS[0].map(([lon,lat])=>{const x=(lon-SPEC.origin[0])*K,z=-(lat-SPEC.origin[1])*111320;return new THREE.Vector2(C*x-S*z,S*x+C*z);});
 const bg=new THREE.ExtrudeGeometry(new THREE.Shape(base),{depth:.16,bevelEnabled:false});bg.rotateX(Math.PI/2);bg.translate(0,.16,0);put(bg,'stone');
 for(let i=0;i<8;i++){
  const a=point(i,0);cyl('stone',a[0],a[2],.6,.6,.16,.86,near?12:8);
  for(let j=0;j<levels.length;j++){
   const p=point(i,j),g=new THREE.OctahedronGeometry(.18,0);g.translate(...p);put(g,levels[j]<22?'jointwhite':'jointblack');
  }
  for(let j=0;j<levels.length-1;j++){
   const a=point(i,j),b=point(i,j+1),c=point((i+1)%8,j),d=point((i+1)%8,j+1),mat=paint((a[1]+b[1])/2);
   member(mat,a,b,.145,'tapered outer leg');
   member(mat,a,d,.046,'diagonal tension rod');member(mat,c,b,.046,'diagonal tension rod');
  }
  for(let j=0;j<levels.length;j++)member(paint(levels[j]-.01),point(i,j),point((i+1)%8,j),.065,'octagonal horizontal strut');
 }
 // Stair cylinder remains structurally distinct from the transparent open outer frame.
 cyl('stone',0,0,1.6,1.6,.16,.65,near?24:16);
 cyl('white',0,0,1.32,1.32,.65,22,near?24:16);cyl('black',0,0,1.32,1.32,22,34.9,near?24:16);
 // Unlettered north entrance vestibule and short raised stair.
 wall('white',2.05,.65,3.8,.22,0,-1.65,Math.PI,[{u:0,y:.85,w:1.2,h:2.4,mat:'black'}]);
 for(const side of [-1,1])box('white',side*.93,2.15,-1.1,.2,3.0,1.1);roof('white',0,-1.3,2.25,1.5,3.8,4.25);
 for(let i=0;i<5;i++)box('stone',0,.08*(i+1),-3.5+i*.36,1.75,.16*(i+1),.36);
 // Black octagonal watch room with five recessed square sash windows.
 const wr=2.8;for(let i=0;i<8;i++){
  const a=(i+.5)*Math.PI/4,x=wr*Math.cos(a),z=wr*Math.sin(a),normalAngle=Math.PI/2-a,holes=i<5?[{u:0,y:35.65,w:1.05,h:1.45,mat:'glass'}]:[];
  wall('black',2*wr*Math.tan(Math.PI/8)+.03,34.8,38.8,.20,x,z,normalAngle,holes);
 }
 cyl('black',0,0,2.95,2.95,34.65,35.0,8);cyl('black',0,0,2.95,2.95,38.55,38.85,8);
 // Gallery floor and rail: the feet and every post sit on the same rigid surface.
 ring('black',0,0,2.2,3.65,38.8,.24,near?32:16);
 const nr=near?24:12;
 for(let i=0;i<nr;i++){const a=i*2*Math.PI/nr,x=3.48*Math.cos(a),z=3.48*Math.sin(a);pipe('black',[x,39.04,z],[x,40.0,z],.038);}
 ring('black',0,0,3.43,3.52,39.96,.08,near?32:16);
 // The lantern's crossed diamond lattice is the defining Big Diamond feature, preserved in far.
 cyl('black',0,0,2.35,2.35,38.84,39.4,near?32:16);
 cyl('glass',0,0,2.25,2.25,39.4,42.5,near?32:16);
 const nd=8,lp=(i,j)=>{const a=(i+(j%2)*.5)*2*Math.PI/nd;return [2.39*Math.cos(a),39.4+j*1.55,2.39*Math.sin(a)];};
 for(let i=0;i<nd;i++)for(let j=0;j<2;j++){pipe('black',lp(i,j),lp(i,j+1),.08);pipe('black',lp(i,j),lp(j%2?i+1:i-1,j+1),.08);}
 ring('black',0,0,2.16,2.5,42.48,.16,near?32:16);
 lathe('black',0,0,[[0,42.62],[2.75,42.62],[1.5,43.10],[.42,44.02],[.16,44.12],[.16,44.35],[.25,44.42],[.13,44.67],[0,44.8056]],near?24:16);
 const root=k.finish();root.userData.memberContacts=contacts;root.userData.lantern={diamondDivisions:8,frameWidth:.16,frameRadius:2.39,paneRadius:2.25,minClearance:.06};root.userData.skeleton={levels,footingRadius:6.096,watchRadius:wr,paintDivision:22};return root;
}
