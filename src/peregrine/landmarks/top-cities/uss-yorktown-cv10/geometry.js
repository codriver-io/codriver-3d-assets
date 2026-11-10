import * as THREE from 'three';
import polygonClipping from 'polygon-clipping';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES,ROTATION} from './config.js';
// Original plan, simplified against OSM way 39010151. +Z aft, +X starboard.
const DECK=[[18,-135.3312],[20,-124],[21,-75],[20,-35],[20,32],[33,32],[33,46],[20,46],[18,92],[18,126],[15,134],[-15,135.3312],[-17,119],[-19,96],[-24,61],[-28,30],[-31,0],[-31,-24],[-19,-26],[-19,-64],[-15,-65],[-15,-102],[-13,-135.3312]];
export function create({detail='near'}={}) {
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 function faces(m,p,ix){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p.flat(),3));g.setIndex(ix);const n=g.toNonIndexed();n.computeVertexNormals();b.put(n,m);}
 const box=(m,x,y,z,w,h,d)=>b.box(m,[x,y,z],[w,h,d]);
 function prism(m,ring,y0,y1){const shape=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z))),g=new THREE.ExtrudeGeometry(shape,{depth:y1-y0,bevelEnabled:false,curveSegments:1});g.rotateX(-Math.PI/2);g.translate(0,y0,0);b.put(g,m);}
 function tube(m,a,c,r,n=near?8:5){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...c),v=B.clone().sub(A),g=new THREE.CylinderGeometry(r,r,v.length(),n,1,false);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...A.add(B).multiplyScalar(.5).toArray());b.put(g,m);}
 // Above-water hull: raked, flared bow and broad transom. No submarine hull or terrain offset.
 const stations=[[-135,.4,14.5],[-129,6,15.7],[-112,13.5,15.5],[-94,16,10],[-70,16.5,8],[0,16.5,8],[65,16,8],[112,14.8,8],[130,13,8]];
 for(let i=1;i<stations.length;i++){
  const [za,wa,ha]=stations[i-1],[zc,wc,hc]=stations[i];
  for(const sg of [-1,1]){
   const p=[[4+sg*wa*.76,0,za],[4+sg*wc*.76,0,zc],[4+sg*wc,hc,zc],[4+sg*wa,ha,za]];
   faces('hull',p,sg>0?[0,2,1,0,3,2]:[0,1,2,0,2,3]);
  }
  faces('dark',[[4-wa*.76,0,za],[4+wa*.76,0,za],[4+wc*.76,0,zc],[4-wc*.76,0,zc]],[0,1,2,0,2,3]);
 }
 for(const [z,w,h] of [stations[0],stations.at(-1)])faces('hull',[[4-w*.76,0,z],[4+w*.76,0,z],[4+w,h,z],[4-w,h,z]],z<0?[0,2,1,0,3,2]:[0,1,2,0,2,3]);
 // Hangar side walls use actual openings and inset bulkheads, keeping bay rhythm at distance.
 for(const sg of [-1,1]){
  const x=4+sg*14.7;
  box('hull',x,9.6,17.5,.75,3.2,215);
  box('hull',x,15.6,17.5,.75,1.0,215);
  box('dark',x-sg*1.1,13.1,17.5,.2,4.0,214);
  const step=near?10.75:21.5;
  for(let z=-90;z<=125;z+=step)box('hull',x,13.15,z,.75,3.9,1.2);
 }
 box('hull',4,12.1,-90,29.4,8.2,1.2);box('hull',4,12.1,125,29.4,8.2,1.2);
 // Flight deck: cap and edge are one closed solid; no second coplanar surface.
 prism('deckPaint',DECK,16.1,17);
 // Bow fairing connects the flared hull to the deck lip, leaving broad side galleries.
 for(const sg of [-1,1]){
  faces('hull',[[4+sg*16,10,-94],[4+sg*13.5,15.5,-112],[4+sg*6,15.7,-129],[sg>0?18:-13,16.1,-135.33],[sg>0?20:-15,16.1,-102],[sg>0?20:-15,16.1,-94]],sg>0?[0,2,1,0,3,2,0,4,3,0,5,4]:[0,1,2,0,2,3,0,3,4,0,4,5]);
  // Cantilever brackets beneath the broad port landing deck and starboard sponsons.
  for(let z=-50;z<95;z+=near?13:26){const end=sg<0?(z<0?-24:z<35?-28:-22):20;
   tube('hull',[4+sg*14.7,10.8,z],[end,16.25,z],.3,near?6:4);
  }
 }
 // Starboard island: stacked offset decks, pilothouse fronts and broad funnel trunk.
 box('hull',17.2,21.4,-12,10.4,8.8,45);
 box('hull',17.4,27.4,-13,10.0,3.2,36);
 box('hull',17.4,31.0,-13,8.4,4,28);
 box('hull',17.4,34.2,-9,7.6,2.4,16);
 // Overhanging bridge platforms are supported by the island core; individual window panes sit in openings.
 for(const [y,z,depth,width] of [[25.5,-27,13,14],[29.3,-24,12,13],[33.2,-19,10,11]]){
  const outer=[[17.2-width/2,z-depth/2],[17.2+width/2,z-depth/2],[17.2+width/2,z+depth/2],[17.2-width/2,z+depth/2]],core=y<26?[12,-34.5,22.4,10.5]:y<30?[13.2,-27,21.6,1]:[13.6,-17,21.2,-1];
  const cut=[[core[0],core[1]],[core[2],core[1]],[core[2],core[3]],[core[0],core[3]]];for(const poly of polygonClipping.difference([outer],[cut])){const sh=new THREE.Shape(poly[0].map(([x,z])=>new THREE.Vector2(x,-z)));for(const h of poly.slice(1))sh.holes.push(new THREE.Path(h.map(([x,z])=>new THREE.Vector2(x,-z))));const g=new THREE.ExtrudeGeometry(sh,{depth:.6,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,y-.3,0);b.put(g,'metal');}
  const yy=y+1.1;box('hull',17.2,yy+1,z,width-.8,.35,depth-.8);
  // Separate panes and thin mullions, no continuous black bands.
  for(let k=0;k<5;k++)for(const sg of [-1,1]){
   const zz=z-depth*.35+k*depth*.175,xx=17.2+sg*(width/2-.25);
   box('glass',xx,yy,zz,.15,1.3,depth*.12);
   box('hull',xx,yy,zz+depth*.08,.25,1.65,.16);
  }
  for(let k=0;k<5;k++)box('glass',17.2+(k-2)*(width-1)/5,yy,z-depth/2+.1,(width-1)/6,1.3,.15);
 }
 prism('hull',[[13,-9],[21,-9],[22,4],[14,6]],34,39.2);
 prism('dark',[[14,-8],[20,-8],[21,3],[15,4]],39.2,39.7);
 // Slender pole mast and supported yardarms / radar frames; no text, hull number or insignia.
 tube('metal',[17.5,37,-8],[17.5,58,-8],near?.27:.34);
 for(const y of [43,48.5,54]){
  tube('metal',[12.5,y,-8],[22.5,y,-8],.14);
  tube('metal',[17.5,y-2.5,-8],[12.5,y,-8],.10);tube('metal',[17.5,y-2.5,-8],[22.5,y,-8],.10);
 }
 for(const [x,y] of [[20.7,54],[14.4,48.5]]){box('dark',x,y+.55,-8,2.8,1.1,.3);}
 // Angled landing corridor and catapult tracks are narrow paint faces, never numerals or lettering.
 const paint=(a,c,w)=>{const dx=c[0]-a[0],dz=c[1]-a[1],l=Math.hypot(dx,dz),nx=-dz/l*w/2,nz=dx/l*w/2;
  faces('paint',[[a[0]+nx,17.04,a[1]+nz],[c[0]+nx,17.04,c[1]+nz],[c[0]-nx,17.04,c[1]-nz],[a[0]-nx,17.04,a[1]-nz]],[0,1,2,0,2,3]);};
 for(const dx of [-7,7])paint([-7+dx,120],[-21+dx,-22],.24);
 for(let z=-18;z<118;z+=near?10:20){const t=(z+22)/142,x=-21+14*t;paint([x,z],[x+.4,z+4],.30);}
 for(const x of [-6,10])paint([x,-122],[x,-42],.18);
 // Generic unmarked static aircraft silhouettes: original geometry, resting on small landing wheels.
 const planes=[[-7,-96],[-6,-68],[10,56],[10,85],[-4,108],[-14,40],[-17,12]];
 for(const [x,z] of planes){
  for(const dx of [-1,1]){box('dark',x+dx,17.35,z+1,.30,.7,.55);tube('dark',[x+dx,17.6,z+1],[x+dx*.5,18.2,z+.8],.10,near?6:4);}
  const body=new THREE.SphereGeometry(1,near?12:8,near?8:5);body.scale(.65,.65,3.7);body.translate(x,18.2,z);b.put(body,'aircraft');
  prism('aircraft',[[x-.25,z-2],[x-5.6,z+1.6],[x-5.6,z+2.4],[x,z+1.4],[x+5.6,z+2.4],[x+5.6,z+1.6],[x+.25,z-2]],18.1,18.35);
  box('aircraft',x,19.0,z+2.7,.18,2.2,1.5);
 }
 const root=b.finish();root.traverse(o=>{if(o.isMesh){o.geometry.rotateY(ROTATION);o.geometry.deleteAttribute('bridgeLift');}});return root;
}
