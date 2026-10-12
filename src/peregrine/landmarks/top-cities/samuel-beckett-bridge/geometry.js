import * as THREE from 'three';
import { bridgeBuilder } from '../../asset-geometry.js';
import { PROFILE as p, SOUTH, NORTH, PYLON, DECK_H } from './samuel-beckett-bridge-profile.js';

// Northern face of the single inclined spar, in station/height; identical structural curve in both LODs.
export function sparPoint(t){const u=1-t;return[PYLON+u*u*u*4+3*u*u*t*7+3*u*t*t*12+t*t*t*32,
 u*u*u*DECK_H+3*u*u*t*19+3*u*t*t*35+t*t*t*47.5];}
export function create({detail='near'}={}) {
 const near=detail==='near',b=bridgeBuilder({...p,meshStep:near?1:2},detail),xyz=b.xyz,contacts=[];
 const v=(a)=>new THREE.Vector3(...xyz(...a));
 function rod(mat,a,c,r,sides=near?6:4){const av=v(a),cv=v(c),delta=cv.clone().sub(av);
  const g=new THREE.CylinderGeometry(r,r,delta.length(),sides,1,false);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize()));
  g.translate(...av.add(cv).multiplyScalar(.5).toArray());b.put(g,mat);}
 function member(id,mat,a,c,r,supportA,supportC){rod(mat,a,c,r);contacts.push({id,material:mat,a:xyz(...a),c:xyz(...c),supportA,supportC});}
 const L=p.BRIDGE_LENGTH;
 // Only the river structure has a slab/girder. Approach fallback pavement follows the road ramps.
 b.strip('deck',SOUTH,NORTH,-13.5,13.5,-.13,.8);
 // Variable pavement widths on the merging quay/Guild Street approaches; dense smooth plan curve.
 {const positions=[],indices=[],stations=[...new Set([0,L,...p.ALIGNMENT.map(q=>q.s),...Array.from({length:Math.floor(L)},(_,i)=>i+1)])].sort((a,c)=>a-c);
  for(let i=0;i<stations.length;i++){const s=stations[i],edges=p.roadEdges(s);positions.push(...xyz(s,edges[0][0],p.deckHeight(s)),...xyz(s,edges[1][1],p.deckHeight(s)));if(i){const a=(i-1)*2,c=i*2;indices.push(a,a+1,c,a+1,c+1,c);}}
  const pavement=new THREE.BufferGeometry();pavement.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));pavement.setIndex(indices);pavement.computeVertexNormals();b.put(pavement,'asphalt');
 }
 for(const side of [-1,1]) {
  const a=side>0?8.75:-13.5,c=side>0?13.5:-8.75;
  b.strip('steel',SOUTH,NORTH,a,c,.16,.29);
  // Box-edge support under the rounded steel deck; cross beams are merged.
  b.strip('deck',SOUTH,NORTH,side*12.5-.4,side*12.5+.4,-.75,.6);
  b.strip('steel',SOUTH,NORTH,side*12.7-.12,side*12.7+.12,1.12,.22);
  contacts.push({id:`upper-rail-${side}`,material:'steel',a:xyz(SOUTH,side*12.7,DECK_H+1.01),c:xyz(NORTH,side*12.7,DECK_H+1.01),supportA:'rail',supportC:'rail'});
  // Vertical rail standards end on the raised footway and the upper rail.
  const n=near?56:28;
  for(let i=0;i<=n;i++){const s=SOUTH+.05+(NORTH-SOUTH-.1)*i/n;
   member(`rail-post-${side}-${i}`,'rail',[s,side*12.7,DECK_H+.16],[s,side*12.7,DECK_H+1.02],.045,'steel','steel');}
  if(near)for(const off of [.48,.74]){b.strip('steel',SOUTH,NORTH,side*12.7-.035,side*12.7+.035,off,.07);
   contacts.push({id:`lower-rail-${side}-${off}`,material:'steel',a:xyz(SOUTH,side*12.7,DECK_H+off-.035),c:xyz(NORTH,side*12.7,DECK_H+off-.035),supportA:'rail',supportC:'rail'});}
 }
 // Median separated from traffic; pylon and its backstay fin sit on this structural spine.
 b.strip('steel',SOUTH,NORTH,-.72,.72,.16,.29);
 for(const d of [-8.55,-.9,.9,8.55])b.strip('paint',SOUTH,NORTH,d-.045,d+.045,.025);
 if(near)for(let s=SOUTH+3;s<NORTH-3;s+=9)for(const d of [-4.6,4.6])b.strip('paint',s,Math.min(s+3,NORTH),d-.05,d+.05,.025);
 for(let s=SOUTH+4;s<NORTH-4;s+=near?3:9){if(Math.abs(s-PYLON)<7)continue;
  b.beam('rib',[s,-12.5,DECK_H-.94],[s,12.5,DECK_H-.94],.25,.35);
  contacts.push({id:`cross-rib-${s}`,material:'rib',a:xyz(s,-12.5,DECK_H-.94),c:xyz(s,12.5,DECK_H-.94),supportA:'deck',supportC:'deck'});
 }
 // Fixed circular swing pier and end bearings, all planted at local grade.
 const g=new THREE.CylinderGeometry(5.8,6.7,DECK_H-.93,near?32:16);g.translate(...xyz(PYLON,0,(DECK_H-.93)/2));b.put(g,'concrete',0,y=>Math.max(0,Math.min(1,y/(DECK_H-.93))));
 for(const s of [SOUTH,NORTH])b.box('concrete',s,0,(DECK_H-.93)/2,1.8,26.8,DECK_H-.93,0,y=>Math.max(0,Math.min(1,y/(DECK_H-.93))));
 // One solid, closed, original curved plate extrusion with the photographed circular lower opening.
 const shape=new THREE.Shape();shape.moveTo(-28,DECK_H);
 shape.bezierCurveTo(-26,3,-25,8,-21,10.2);shape.bezierCurveTo(-17,9.7,-11,7.2,-7,8.2);
 shape.bezierCurveTo(-2,10,3,18,8,27);shape.bezierCurveTo(13,36,24,43.8,31,48);
 shape.lineTo(32,47.5);shape.bezierCurveTo(12,35,7,19,4,DECK_H);shape.closePath();
 const hole=new THREE.Path();hole.absarc(-3.8,6.1,1.6,0,Math.PI*2,true);shape.holes.push(hole);
 const spar=new THREE.ExtrudeGeometry(shape,{depth:1.4,bevelEnabled:false,curveSegments:near?40:20});
 const pos=spar.attributes.position;
 for(let i=0;i<pos.count;i++){const q=p.bridgePoint(PYLON+pos.getX(i),pos.getZ(i)-.7,pos.getY(i));pos.setXYZ(i,q.x,q.y,q.z);}
 spar.computeVertexNormals();b.put(spar,'tower');
 // 25 forestays and six rear strands (two groups of three). Far retains all terminal extents.
 for(let i=0;i<25;i++){if(!near&&i%2&&i!==24)continue;const t=.18+.82*i/24,q=sparPoint(t);
  const side=i%2?1:-1,s=PYLON+11+(NORTH-3-PYLON-11)*i/24;
  member(`forestay-${i}`,'cable',[q[0]-.15,0,q[1]],[s,side*12.7,DECK_H+1.12],near?.055:.075,'tower','steel');}
 for(const side of [-1,1])for(let i=0;i<3;i++) {
  const q=sparPoint(.91+.04*i);
  member(`backstay-${side}-${i}`,'cable',[q[0]-.3,side*.5,q[1]],[PYLON-21+i*.7,side*.5,9.9-i*.25],.09,'tower','tower');
 }
 // Low walkway lights retain the uncluttered harp silhouette.
 if(near)for(let s=SOUTH+5;s<NORTH;s+=12)for(const side of [-1,1])b.box('lamp',s,side*12.7,DECK_H+.28,.45,.3,.13);
 const model=b.finish();model.userData.contacts=contacts;return model;
}
