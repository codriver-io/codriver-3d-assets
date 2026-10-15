import {Shape,ExtrudeGeometry,BoxGeometry,BufferGeometry,Float32BufferAttribute,SphereGeometry,CylinderGeometry,TorusGeometry,Vector3,Quaternion} from 'three';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {bridgeBuilder} from '../../asset-geometry.js';
import {PROFILE as p,MAIN_START as A,MAIN_END as Z,SPANS,PIERS,archY,roadEdgesAt,outerAt} from './pont-mirabeau-profile.js';

// Optional contact inventory is used by tests, outside the runtime/export payload.
export function createWithContacts({detail='near'}={}){
 const near=detail==='near',b=bridgeBuilder(p,detail),hosts=new Map(),members=[];
 const xyz=(s,d,y)=>b.xyz(s,d,y);
 function put(g,mat,name,lift=1){g.deleteAttribute('uv');g.computeVertexNormals();if(name)hosts.set(name,g);b.put(g,mat,0,lift);}
 function box(mat,s,d,y,len,width,height,name,lift=1){const q=p.bridgePoint(s,d,y),g=new BoxGeometry(len,height,width);g.rotateY(-Math.atan2(q.tz,q.tx));g.translate(q.x,q.y,q.z);put(g,mat,name,lift);}
 function beam(mat,a,z,width,name,supports,depth=width){
  const av=new Vector3(...xyz(...a)),zv=new Vector3(...xyz(...z)),dir=zv.clone().sub(av),g=new BoxGeometry(width,dir.length(),depth);
  g.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0,1,0),dir.normalize()));g.translate(...av.clone().add(zv).multiplyScalar(.5).toArray());put(g,mat,name);
  if(supports)members.push({name,points:[av.toArray(),zv.toArray()],supports});
 }
 function prism(pts,d,width,mat,name,lift=1){
  const sh=new Shape();sh.moveTo(...pts[0]);for(const pt of pts.slice(1))sh.lineTo(...pt);sh.closePath();
  const g=new ExtrudeGeometry(sh,{depth:width,bevelEnabled:false,steps:1}),pos=g.attributes.position;
  for(let i=0;i<pos.count;i++)pos.setXYZ(i,...xyz(pos.getX(i),d-width/2+pos.getZ(i),pos.getY(i)));
  g.deleteAttribute('uv');g.computeVertexNormals();const ix=mergeVertices(g,0.0001);g.dispose();put(ix,mat,name,lift);
 }
 function ribbon(mat,a,z,edges,offset,thickness,name){
  const n=Math.ceil((z-a)/(near?2:3)),pos=[],ix=[],stride=thickness?4:2;
  for(let i=0;i<=n;i++){
   const s=a+(z-a)*i/n,[l,r]=edges(s),h=p.deckHeight(s)+offset;
   for(const [d,y] of thickness?[[l,h],[r,h],[l,h-thickness],[r,h-thickness]]:[[l,h],[r,h]])pos.push(...xyz(s,d,y));
   if(i){const u=(i-1)*stride,v=i*stride;ix.push(u,u+1,v,u+1,v+1,v);if(thickness)ix.push(u+2,v+2,u+3,u+3,v+2,v+3,u,v,u+2,u+2,v,v+2,u+1,u+3,v+1,u+3,v+3,v+1);}
  }
  if(thickness){let v=n*stride;ix.push(0,2,1,1,2,3,v,v+1,v+2,v+1,v+3,v+2);}
  const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setIndex(ix);put(g,mat,name);
 }
 // Closed deck slab and road sheet. Walkways and rails taper only on land.
 ribbon('steel',A,Z,()=>[-10,10],-.2,.45,'deck-slab');
 ribbon('asphalt',0,p.BRIDGE_LENGTH,s=>roadEdgesAt(s)[0],0,0,'pavement');
 for(const side of [-1,1]){
  const walk=s=>{const e=roadEdgesAt(s)[0][side<0?0:1],o=side*outerAt(s);return [Math.min(e,o),Math.max(e,o)];};
  ribbon('walkway',0,p.BRIDGE_LENGTH,walk,.13,.23,`walk-${side}`);
 }
 // Abutments stop at the river edges; ramps remain fitted pavement, not stone boxes.
 box('stone',A-1.2,0,3.7,2.4,20,7.4,'abutment-north',y=>Math.max(0,Math.min(1,y/7.4)));
 box('stone',Z+1.2,0,3.7,2.4,20,7.4,'abutment-south',y=>Math.max(0,Math.min(1,y/7.4)));
 for(const [i,s] of PIERS.entries()){
  box('stone',s,0,.75,7.6,20,1.5,`pier-${i}`,y=>Math.max(0,Math.min(1,y/1.5)));
  // Only the foundation stretches down to the river. Rounded stone courses
  // above it stay rigid with the arch heels and bronze groups in world mode.
  for(const side of [-1,1]){
   const g=new CylinderGeometry(1,1,.175,near?16:10);g.scale(3.7,1,2.7);g.rotateY(-Math.atan2(p.bridgePoint(s).tz,p.bridgePoint(s).tx));
   g.translate(...xyz(s,side*10.9,.0875));put(g,'stone',`boat-foundation-${i}-${side}`,y=>Math.max(0,Math.min(1,y/.175)));
  }
  // Rounded, boat-shaped river ends, with stacked oval courses.
  for(const side of [-1,1])for(let tier=0;tier<3;tier++){
   const g=new CylinderGeometry(1,1,0.35,near?16:10);g.scale(3.7-tier*.35,1,2.7-tier*.2);g.rotateY(-Math.atan2(p.bridgePoint(s).tz,p.bridgePoint(s).tx));
   g.translate(...xyz(s,side*10.9,.35+tier*.35));put(g,'stone',`boat-${i}-${side}-${tier}`);
  }
 }
 // Seven arch ribs, transverse ties and exposed triangular spandrels.
 for(let si=0;si<3;si++){
  const [a,z]=SPANS[si],count=near?40:20,ds=near?[-9.4,-6.2,-3.1,0,3.1,6.2,9.4]:[-9.4,-3.1,3.1,9.4];
  const supports=si===0?['abutment-north','pier-0']:si===1?['pier-0','pier-1']:['pier-1','abutment-south'];
  for(const d of ds){
   const top=[],bottom=[];for(let i=0;i<=count;i++){const s=a+(z-a)*i/count,h=archY(si,s);top.push([s,h+.55]);bottom.unshift([s,h]);}
   const name=`arch-${si}-${d}`;prism([...top,...bottom],d,.45,'steel',name);
   members.push({name,points:[xyz(a,d,archY(si,a)+.2),xyz(z,d,archY(si,z)+.2)],supports});
  }
  for(const side of [-1,1]){
   const d=side*9.4,chord=`chord-${si}-${side}`;
   box('steel',(a+z)/2,d,7.5,z-a,.5,.35,chord);
   members.push({name:chord,points:[xyz(a,d,7.6),xyz(z,d,7.6)],supports:['deck-slab','deck-slab']});
   const bays=Math.ceil((z-a)/(near?3.9:6));
   for(let i=0;i<=bays;i++){
    const s=a+(z-a)*i/bays,low=archY(si,s)+.4;
    beam('steel',[s,d,low],[s,d,7.5],near?.18:.24,`vertical-${si}-${side}-${i}`,[`arch-${si}-${d}`,chord],.28);
    if(i<bays){const e=a+(z-a)*(i+1)/bays;beam('steel',[s,d,low],[e,d,7.5],near?.17:.22,`diagonal-${si}-${side}-${i}`,[`arch-${si}-${d}`,chord],.27);}
   }
  }
  for(let i=1;i<(near?12:6);i++){
   const s=a+(z-a)*i/(near?12:6),h=archY(si,s)+.25;
   beam('steel',[s,-9.4,h],[s,9.4,h],.2,`transverse-${si}-${i}`,[`arch-${si}--9.4`,`arch-${si}-9.4`],.25);
  }
 }
 // Ornate circular cast-iron parapets, retained as open rings in far too.
 for(const side of [-1,1]){
  const d=side*9.7;
  box('steel',(A+Z)/2,d,8.5,Z-A,.2,.18,`rail-lower-${side}`);
  box('steel',(A+Z)/2,d,9.43,Z-A,.22,.16,`rail-upper-${side}`);
  for(const s of [A,Z])box('steel',s,d,8.87,.65,.6,1.5,`rail-end-${side}-${s}`);
  for(const which of ['lower','upper'])members.push({name:`rail-${which}-${side}`,points:[xyz(A,d,which==='lower'?8.5:9.43),xyz(Z,d,which==='lower'?8.5:9.43)],supports:[`rail-end-${side}-${A}`,`rail-end-${side}-${Z}`]});
  const bays=Math.round((Z-A)/(near?1.9:3.8));
  for(let i=0;i<=bays;i++){
   const s=A+(Z-A)*i/bays;
   box('steel',s,d,8.73,.14,.18,1.26,`rail-post-${side}-${i}`);
   members.push({name:`rail-post-${side}-${i}`,points:[xyz(s,d,8.13),xyz(s,d,9.4)],supports:[`walk-${side}`,`rail-upper-${side}`]});
   if(i<bays){
    const center=s+(Z-A)/bays/2,g=new TorusGeometry(.42,.065,3,near?12:8);
    // Torus XY plane -> station/up plane, both side faces visible.
    g.rotateY(-Math.atan2(p.bridgePoint(center).tz,p.bridgePoint(center).tx));g.translate(...xyz(center,d,8.96));put(g,'steel');
    if(near){for(const sign of [-1,1]){const g2=new TorusGeometry(.20,.045,3,8,Math.PI*1.7);g2.rotateY(-Math.atan2(p.bridgePoint(center).tz,p.bridgePoint(center).tx));g2.translate(...xyz(center+sign*.6,d,8.96));put(g2,'steel');}}
   }
  }
  // Land rails follow the tapered walk and end in terminal stone posts.
  for(const [a,z] of [[0,A],[Z,p.BRIDGE_LENGTH]]){
   const n=Math.ceil((z-a)/5),endNames=[`landing-${side}-${a}`,`landing-${side}-${z}`];
   for(let i=0;i<=n;i++){
    const s=a+(z-a)*i/n,h=p.deckHeight(s),d2=side*(outerAt(s)-.15),name=i===0?endNames[0]:i===n?endNames[1]:`landingpost-${side}-${a}-${i}`;
    box('steel',s,d2,h+.72,.28,.28,1.18,name);
    if(i){const prev=a+(z-a)*(i-1)/n,prevName=i===1?endNames[0]:`landingpost-${side}-${a}-${i-1}`;
     beam('steel',[prev,side*(outerAt(prev)-.15),p.deckHeight(prev)+1.22],[s,d2,h+1.22],.12,`landingrail-${side}-${a}-${i}`,[prevName,name]);}
   }
  }
  for(let i=0;i<6;i++){
   const s=A+9+i*31,d2=side*8.9;box('steel',s,d2,10.25,.14,.14,4.24,`lamp-pole-${side}-${i}`);
   box('steel',s,d2,12.4,.42,.42,.15,`lamp-cap-${side}-${i}`);box('lamp',s,d2,12.63,.32,.32,.32);box('steel',s,d2,12.86,.44,.44,.14);
   members.push({name:`lamp-pole-${side}-${i}`,points:[xyz(s,d2,8.13),xyz(s,d2,12.37)],supports:[`walk-${side}`,`lamp-cap-${side}-${i}`]});
  }
 }
 // Four separately posed seated bronze allegories on the boat ends.
 function ellipsoid(s,d,y,scale,mat='bronze'){
  const g=new SphereGeometry(1,near?12:7,near?8:5);g.scale(...scale);g.rotateY(-Math.atan2(p.bridgePoint(s).tz,p.bridgePoint(s).tx));g.translate(...xyz(s,d,y));put(g,mat);
 }
 for(const [i,s] of PIERS.entries())for(const side of [-1,1]){
  const d=side*11.9,pose=i*2+(side>0?1:0),seat=2.7;
  box('bronze',s,d,1.65,4.0,1.7,1.1,`statue-plinth-${pose}`);
  ellipsoid(s,d,2.5,[2.45,.65,1.0]); // boat hull / draped seat
  // Swept gown and reclining legs; a seated anatomical silhouette, no texture.
  ellipsoid(s-.15,d,seat+1.0,[.83,1.45,.66]);
  ellipsoid(s-.4,d,seat+2.15,[.68,.75,.50]);
  ellipsoid(s-.4,d,seat+3.17,[.40,.53,.41]);
  ellipsoid(s-.5,d-side*.13,seat+3.33,[.43,.43,.39]);
  for(const along of [-.55,.55]){
   beam('bronze',[s+along,d,seat+.65],[s+1.7+along*.45,d+side*.8,seat-.1],.6);
   beam('bronze',[s+1.7+along*.45,d+side*.8,seat-.1],[s+1.2+along*.55,d+side*1.6,1.4],.42);
   ellipsoid(s+1.3+along*.55,d+side*1.5,1.45,[.40,.24,.34]);
  }
  const shoulder=[s-.3,d+side*.12,seat+2.45];
  const elbow=pose===0?[s+.75,d+side*.6,seat+1.35]:[s+.3,d+side*.35,seat+3.35];
  const hand=pose===0?[s+1.5,d+side*.7,seat+1.0]:[s+1.1,d+side*.55,seat+4.2];
  beam('bronze',shoulder,elbow,.33);beam('bronze',elbow,hand,.26);ellipsoid(...hand,[.19,.25,.18]);
  beam('bronze',[s-1.0,d,seat+2.25],[s-1.5,d+side*.3,seat+1.25],.34);
  beam('bronze',[s-1.5,d+side*.3,seat+1.25],[s-.65,d+side*.9,seat+.6],.27);
  // Bronze curls and gold prow mask, directly attached to the boat front.
  for(const sign of [-1,1]){
   const g=new TorusGeometry(.55,.14,near?6:4,near?16:10,Math.PI*1.8);g.rotateY(-Math.atan2(p.bridgePoint(s).tz,p.bridgePoint(s).tx));g.translate(...xyz(s+sign*1.65,d+side*.65,2.4));put(g,'bronze');
  }
  if(near){ellipsoid(s+1.85,d+side*.92,2.35,[.44,.58,.22],'gilt');
   // Shallow folds share bronze so they cannot cause intermaterial depth cycles.
   for(let j=0;j<5;j++)beam('bronze',[s-.65+j*.28,d+side*.54,3.1],[s+.2+j*.34,d+side*.8,2.4],.09);
  }
  // City arms above each statue, attached to the upper parapet.
  box('steel',s,side*9.7,9.0,1.8,.28,.9);
 }
 const model=b.finish();model.userData.features={clearSpans:[32.4,93,32.4],statues:4,archRibs:near?7:4};
 return {model,hosts,members};
}
export function create(options){return createWithContacts(options).model;}
