import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { ALIGNMENT, LENGTH, PIERS, ARCHES, WIDTH, DECK_Y, point, TOWERS, towerPoint } from './charles-bridge-site.js';

// No runtime dependencies: all vertices are authored in geographic east/up/south metres.
export function create({detail='near'}={}) {
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail), n=near?24:10;
 function prism(shape,mat,depth,transform,reflected=false){
  const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:n,steps:1});g.translate(0,0,-depth/2);
  const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setXYZ(i,...transform(p.getX(i),p.getY(i),p.getZ(i)));
  if(reflected){for(let i=0;i<p.count;i+=3){const a=new THREE.Vector3().fromBufferAttribute(p,i+1),c=new THREE.Vector3().fromBufferAttribute(p,i+2);p.setXYZ(i+1,...c.toArray());p.setXYZ(i+2,...a.toArray());}}
  g.computeVertexNormals();b.put(g,mat);
 }
 function polygon(points){const s=new THREE.Shape();s.moveTo(...points[0]);points.slice(1).forEach(p=>s.lineTo(...p));s.closePath();return s;}
 function box(mat,s,d,y,length,width,height){const q=point(s,d,y),a=point(s+1),c=point(s-1);b.box(mat,q,[length,height,width],-Math.atan2(a[2]-c[2],a[0]-c[0]));}
 function atTower(g,mat,t){const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setXYZ(i,...towerPoint(t,p.getX(i),p.getY(i)+DECK_Y,p.getZ(i)));g.computeVertexNormals();b.put(g,mat);}
 function tbox(mat,t,x,y,z,w,h,d){const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);atTower(g,mat,t);}
 function cylinder(mat,s,d,y,rt,rb,h,sides=near?8:5){const g=new THREE.CylinderGeometry(rt,rb,h,sides);g.translate(...point(s,d,y));b.put(g,mat);}
 // Each span has genuine empty space across the complete deck width.
 for(const a of ARCHES){
  const pts=[[a.a,DECK_Y-.45],[a.c,DECK_Y-.45],[a.c,a.spring]];
  for(let k=1;k<=n;k++){const t=k/n*Math.PI;pts.push([a.mid+a.width/2*Math.cos(t),a.spring+a.rise*Math.sin(t)]);}
  prism(polygon(pts),'stone',WIDTH,(s,y,d)=>point(s,d,y));
  // Radial voussoirs are embedded masonry bands, never dark discs covering the aperture.
  for(const side of [-1,1]) for(let k=0;k<n;k++){
   const gap=near?.007:0,t0=k/n*Math.PI+gap,t1=(k+1)/n*Math.PI-gap;
   const p=(t,outer)=>[a.mid+(a.width/2+(outer?.85:0))*Math.cos(t),a.spring+(a.rise+(outer?.65:0))*Math.sin(t)];
   prism(polygon([p(t0,false),p(t1,false),p(t1,true),p(t0,true)]),'stone',near?.35:.55,(s,y,d)=>point(s,side*(WIDTH/2-.1)+d,y));
  }
 }
 // Piers close the gaps between arch springings. Their pointed cutwaters share the pier's mass.
 for(let i=0;i<PIERS.length;i++){
  const s=PIERS[i],a=ARCHES[i].c,c=ARCHES[i+1].a;
  prism(polygon([[a,0],[c,0],[c,DECK_Y-.45],[a,DECK_Y-.45]]),'stone',WIDTH,(s,y,d)=>point(s,d,y));
  for(const side of [-1,1]){
   const half=(c-a)/2-.05,base=WIDTH/2-.25,nose=side<0?3.7:5.7;
   const sh=polygon([[-half,side*base],[half,side*base],[0,side*(base+nose)]]);
   const g=new THREE.ExtrudeGeometry(sh,{depth:6.1,bevelEnabled:false,steps:1});
   // Shape XY is station/lateral; extrusion Z becomes vertical. Correct winding after reflection.
   const p=g.attributes.position;for(let j=0;j<p.count;j++){const x=p.getX(j),d=p.getY(j),y=p.getZ(j);p.setXYZ(j,...point(s+x,d,y));}
   // Swap winding because this basis has determinant -1.
   for(let j=0;j<p.count;j+=3){const a=new THREE.Vector3().fromBufferAttribute(p,j+1),c=new THREE.Vector3().fromBufferAttribute(p,j+2);p.setXYZ(j+1,...c.toArray());p.setXYZ(j+2,...a.toArray());}
   g.computeVertexNormals();b.put(g,'stone');
   // Sloping chaperon: solid triangular wedge from the cutwater tip to the parapet-side pier.
   const positions=[...point(s-half,side*base,6.05),...point(s+half,side*base,6.05),...point(s,side*(base+nose),6.05),...point(s,side*base,8.1)];
   const roof=new THREE.BufferGeometry();roof.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));roof.setIndex(side<0?[0,1,3,1,2,3,2,0,3,0,2,1]:[0,3,1,1,3,2,2,3,0,0,1,2]);roof.computeVertexNormals();b.put(roof,'stone');
  }
 }
 // End abutments reach grade. Deck and parapet strips follow every mapped bend.
 for(const [a,c] of [[0,ARCHES[0].a],[ARCHES.at(-1).c,LENGTH]])prism(polygon([[a,0],[c,0],[c,DECK_Y-.45],[a,DECK_Y-.45]]),'stone',WIDTH,(s,y,d)=>point(s,d,y));
 for(let i=0;i<ALIGNMENT.length-1;i++){
  const a=ALIGNMENT[i].s,c=ALIGNMENT[i+1].s;
  prism(polygon([[a,DECK_Y-.5],[c,DECK_Y-.5],[c,DECK_Y],[a,DECK_Y]]),'paving',WIDTH,(s,y,d)=>point(s,d,y));
  for(const side of [-1,1]){
   prism(polygon([[a,DECK_Y],[c,DECK_Y],[c,DECK_Y+1.02],[a,DECK_Y+1.02]]),'stone',.64,(s,y,d)=>point(s,side*(WIDTH/2-.32)+d,y));
   prism(polygon([[a,DECK_Y+1.02],[c,DECK_Y+1.02],[c,DECK_Y+1.19],[a,DECK_Y+1.19]]),'edge',.78,(s,y,d)=>point(s,side*(WIDTH/2-.32)+d,y));
  }
 }
 // Thirty independently readable Baroque groups. Deliberately original, not individual sculpture replicas.
 function figure(s,d,y,h,variant,mat='statue'){
  const seg=near?7:4;
  cylinder(mat,s,d,y+h*.40,.20*h,.32*h,.8*h,seg);
  const head=new THREE.SphereGeometry(h*.13,seg,near?5:3);head.scale(.86,1,1);head.translate(...point(s,d,y+h*.91));b.put(head,mat);
  if(near||variant%3===0){const a=point(s,d,y+h*.70),c=point(s+(variant%2?.7:-.65)*h,d+.08,y+h*.45);b.bar(mat,a,c,h*.11,h*.12);}
  if(variant%4===0){b.bar(mat,point(s+.8,d,y+.25),point(s+.8,d,y+h*1.5),near?.085:.14);b.bar(mat,point(s+.38,d,y+h*1.18),point(s+1.22,d,y+h*1.18),near?.08:.13);}
 }
 const statues=[];
 for(let i=0;i<15;i++)for(const side of [-1,1]){
  const s=PIERS[i],d=side*(WIDTH/2-.28);
  box('stone',s,d,DECK_Y+.55,2.3,1.8,1.1);box('edge',s,d,DECK_Y+1.21,2.5,1.95,.22);
  cylinder('statue',s,d,DECK_Y+1.65,.65,.78,.66);
  const y=DECK_Y+1.98,h=2.35+(i%4)*.18;
  figure(s,d,y,h,i+(side>0?2:0));
  if(i%4===1)figure(s+.85,d,y,1.72,i+1);
  statues.push({s,d,baseY:y});
 }
 // Sparse gas lamps stay beside the walking surface; no road markings on this pedestrian crossing.
 for(let i=1;i<15;i+=near?1:2)for(const side of [-1,1]){
  const s=(PIERS[i-1]+PIERS[i])/2,d=side*(WIDTH/2-.75);
  cylinder('iron',s,d,DECK_Y+2.0,.07,.12,4);box('iron',s,d,DECK_Y+4.10,.50,.48,.25);
  box('lamp',s,d,DECK_Y+4.42,.35,.35,.42);
  const cap=new THREE.ConeGeometry(.35,.35,4);cap.translate(...point(s,d,DECK_Y+4.79));b.put(cap,'iron');
 }
 // Continuous west landing connects the main span to the mapped double gateway, without fitting a road.
 const start=point(0),gate=towerPoint(TOWERS.gate,4.8,DECK_Y,0),len=Math.hypot(start[0]-gate[0],start[2]-gate[2]);
 const angle=-Math.atan2(start[2]-gate[2],start[0]-gate[0]),mid=[(start[0]+gate[0])/2,DECK_Y-.4,(start[2]+gate[2])/2];
 b.box('paving',mid,[len+.5,.8,6.3],angle);
 b.box('stone',[mid[0],(DECK_Y-.8)/2,mid[2]],[len+.5,DECK_Y-.8,6.3],angle);
 // Tower wall shell: a pointed passage is cut through the east tower and the west gateway.
 function tower(t,kind){
  const w=t.along,d=t.across,H=t.wall,passage=kind==='old'||kind==='gate',mat='tower';
  let pts;
  if(passage){
   const half=kind==='old'?2.85:2.75,spring=kind==='old'?5:4.4,apex=kind==='old'?9.5:8.5;
   pts=[[-d/2,0],[-d/2,H],[d/2,H],[d/2,0],[half,0],[half,spring]];
   for(let i=1;i<=n;i++){const z=half*(1-i/n),y=spring+(apex-spring)*Math.sin(i/n*Math.PI/2);pts.push([z,y]);}
   for(let i=1;i<=n;i++){const z=-half*i/n,y=spring+(apex-spring)*Math.cos(i/n*Math.PI/2);pts.push([z,y]);}
   pts.push([-half,0]);
  }else pts=[[-d/2,0],[-d/2,H],[d/2,H],[d/2,0]];
  const wall=polygon(pts);
  if(kind!=='gate')for(const y of [H*.40,H*.67])for(const z of [-d*.22,d*.22]){
   const hole=new THREE.Path();hole.moveTo(z-.52,y);hole.lineTo(z+.52,y);hole.lineTo(z+.52,y+1.4);hole.lineTo(z,y+2);hole.lineTo(z-.52,y+1.4);hole.closePath();wall.holes.push(hole);
   tbox('roof',t,0,y+1,z,.15,2.4,1.3);
  }
  prism(wall,mat,w,(z,y,x)=>towerPoint(t,x,y+DECK_Y,z),true);
  // Tower foundations continue to local support datum, with the passage above the bank.
  tbox(mat,t,0,-DECK_Y/2,0,w,DECK_Y,d);
  if(kind==='gate'){
   for(let z=-d/2+.4;z<d/2;z+=1.8)tbox(mat,t,0,H+.55,z,w,1.1,.85);
   tbox(mat,t,0,H-.3,0,w+.2,.5,d+.1);return;
  }
  // Layered cornices use the same stone material to avoid conflicting depth ranks.
  for(const y of [H-2.2,H-.9,H-.3])tbox(mat,t,0,y,0,w+.35,.32,d+.35);
  if(kind!=='judith'){
   for(const x of [-w/2+.6,w/2-.6])for(const z of [-d/2+.6,d/2-.6]){
    const g=new THREE.CylinderGeometry(.88,.85,3,near?10:5);g.translate(x,H-.7,z);atTower(g,mat,t);
    const cap=new THREE.ConeGeometry(.98,7,near?10:5);cap.translate(x,H+4.15,z);atTower(cap,'roof',t);
    const pin=new THREE.CylinderGeometry(.06,.06,1.3,4);pin.translate(x,H+8.1,z);atTower(pin,'iron',t);
   }
  }
  // Steep hipped saddle roof, not a generic pyramid: long narrow ridge with two finials.
  const bottom=H-.12,top=t.top-.85,bw=w*.76,bd=d*.76,tw=.65,td=d*.48;
  const p=[[-bw/2,bottom,-bd/2],[bw/2,bottom,-bd/2],[bw/2,bottom,bd/2],[-bw/2,bottom,bd/2],[-tw/2,top,-td/2],[tw/2,top,-td/2],[tw/2,top,td/2],[-tw/2,top,td/2]];
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p.flat(),3));g.setIndex([0,4,1,1,4,5,1,5,2,2,5,6,2,6,3,3,6,7,3,7,0,0,7,4,4,7,5,5,7,6,0,1,3,1,2,3]);g.computeVertexNormals();atTower(g,'roof',t);
  for(const z of [-td/2,td/2]){const p=new THREE.CylinderGeometry(.07,.08,.95,4);p.translate(0,t.top-.43,z);atTower(p,'iron',t);}
  // Near adds figurative Gothic relief. Window holes remain in both LODs.
  if(near){
   for(const side of [-1,1]){
    if(kind==='old'||kind==='lesser')for(const z of [-d*.28,0,d*.28]){
     tbox(mat,t,side*(w/2+.30),H*.55,z,.64,.32,1.25);
     // Small seated relief in a Gothic niche, human head and torso rather than blobs.
     const torso=new THREE.CylinderGeometry(.25,.39,1.3,6);torso.translate(side*(w/2+.36),H*.55+.80,z);atTower(torso,'edge',t);
     const head=new THREE.SphereGeometry(.25,6,4);head.translate(side*(w/2+.36),H*.55+1.62,z);atTower(head,'edge',t);
    }
   }
   // Narrow ashlar joints on tower corners, same material as tower avoids material cycles.
   for(let y=1;y<H-2;y+=.9)for(const side of [-1,1])for(const z of [-d/2+.3,d/2-.3])tbox(mat,t,side*(w/2+.055),y,z,.11,.08,.6);
  }
 }
 tower(TOWERS.old,'old');tower(TOWERS.lesser,'lesser');tower(TOWERS.judith,'judith');tower(TOWERS.gate,'gate');
 const model=b.finish();
 model.userData.statueGroups=statues;model.userData.archCount=ARCHES.length;
 return model;
}
