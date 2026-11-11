import * as THREE from 'three';import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{PLAN,OSM_WAYS}from'./footprint.js';import{kit}from'./cathedrale-notre-dame-strasbourg-parts.js';
export const SPIRE_CENTER=[-39.5,-14.2];
export function spireMembers(detail='near'){
 const levels=detail==='near'?[102,108,114,120,126,132,137,141.8]:[102,112,122,132,141.8],radius=y=>5.3*(142-y)/40,point=(i,y)=>{const a=i*Math.PI/4;return[SPIRE_CENTER[0]+radius(y)*Math.sin(a),y,SPIRE_CENTER[1]+radius(y)*Math.cos(a)];},members=[];
 for(let j=0;j<levels.length-1;j++)for(let i=0;i<8;i++){members.push([point(i,levels[j]),point(i,levels[j+1])]);members.push([point(i,levels[j]),point((i+1)%8,levels[j+1])]);if(detail==='near')members.push([point((i+1)%8,levels[j]),point(i,levels[j+1])]);}
 return{levels,radius,point,members};
}
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,put,box,wall,cyl,gable}=k;
 k.prism('stone',PLAN[0],0,.16);
 // Mapped short nave and copper roof. Lower aisles and clerestory keep separate window rhythms.
 const bays=near?[-23,-16,-9,-2,5,12,19,26]:[-20,-6,8,22];
 for(const s of [-1,1]){
  wall('stone',56.8,10,30,.8,.1,s*7.7,s>0?0:Math.PI,bays.map(u=>({u,y:20.2,w:near?4.3:6.0,h:8.9,pointed:true,mat:'glass'})));
  for(const x of [-26.5,-19.5,-12.5,-5.5,1.5,8.5,15.5,22.5,28]){box('stone',x,15,s*16,1.05,30,1.6);cyl('stone',x,s*16,.8,0,30,34,near?6:4);}
 }
 gable('roof',-28.7,28.8,30,40,17.05);
 // Broad west screen, with three portals, large rose and tall lancets rather than an opaque slab.
 const front=-51.5;
 const upper=[-18,-12,-6,0,6,12,18].map(u=>({u,y:48.5,w:3.0,h:14.8,pointed:true,mat:'glass'}));
 wall('stone',51.8,.16,66,1.1,front+1.1,0,-Math.PI/2,[...[-17,17].map(u=>({u,y:.2,w:7.2,h:15.6,pointed:true,mat:'shadow'})),{u:0,y:.2,w:10.5,h:20,pointed:true,mat:'shadow'},{u:0,y:25.3,w:13.6,h:13.6,circle:true,mat:'glass'},...[-17,17].map(u=>({u,y:24,w:5.6,h:20.7,pointed:true,mat:'glass'})),...upper]);
 for(const s of [-1,1])wall('stone',24.4,.16,66,1.0,-39.2,s*24.9,s>0?0:Math.PI,[-7,0,7].map(u=>({u,y:30,w:4,h:27,pointed:true,mat:'glass'})));
 wall('stone',51.8,.16,66,1.0,-28.2,0,Math.PI/2,[-17,0,17].map(u=>({u,y:44,w:5.4,h:17,pointed:true,mat:'glass'})));
 box('stone',-39.4,65.75,0,24.5,.5,51.8);
 for(const z of [-25.0,-9.5,9.5,25.0]){box('stone',front-.65,33,z,1.8,66,1.1);cyl('stone',front-.65,z,.65,.65,66,67.2,near?6:4);cyl('stone',front-.65,z,.85,0,67.2,69.5,near?6:4);}
 // Projecting Gothic portal hoods and rose tracery occupy actual wall openings.
 const pointed=(w,h,y)=>[[-w/2,y],[w/2,y],[w/2,y+h-w*.65],[w*.35,y+h-w*.30],[0,y+h],[-w*.35,y+h-w*.30],[-w/2,y+h-w*.65]];
 for(const z of [-17,0,17]){const w=z===0?10.5:7.2,h=z===0?20:15.6,sh=new THREE.Shape(pointed(w+2.1,h+2.4,.16).map(p=>new THREE.Vector2(...p)));sh.holes.push(new THREE.Path(pointed(w,h,.22).map(p=>new THREE.Vector2(...p))));const g=new THREE.ExtrudeGeometry(sh,{depth:1.9,bevelEnabled:false});g.rotateY(-Math.PI/2);g.translate(front+.1,0,z);put(g,'stone');}
 for(let i=0;i<(near?24:12);i++){const a=i*2*Math.PI/(near?24:12);k.b.bar('stone',[front+.15,32.1,0],[front+.15,32.1+6.86*Math.sin(a),6.86*Math.cos(a)],near?.16:.24);}
 const rim=new THREE.TorusGeometry(6.8,.32,near?6:4,near?32:16);rim.rotateY(Math.PI/2);rim.translate(front-.15,32.1,0);put(rim,'stone');
 // Grouped rose petals and pointed lancet hoods add Gothic relief without changing the west-screen silhouette.
 for(let i=0;i<12;i++){const a=i*Math.PI/6,g=new THREE.TorusGeometry(1.2,.15,3,near?12:8);g.rotateY(Math.PI/2);g.translate(front+.1,32.1+4.5*Math.sin(a),4.5*Math.cos(a));put(g,'stone');}
 for(const z of[-18,-12,-6,0,6,12,18]){const sh=new THREE.Shape(pointed(3.8,16,48.3).map(p=>new THREE.Vector2(...p)));sh.holes.push(new THREE.Path(pointed(3.1,15,48.5).map(p=>new THREE.Vector2(...p))));const g=new THREE.ExtrudeGeometry(sh,{depth:.5,bevelEnabled:false});g.rotateY(-Math.PI/2);g.translate(front+.1,0,z);put(g,'stone');}
 // Narrow exterior colonnettes strengthen the stone screen without adding flat texture detail.
 for(const z of [-21.1,-13,-5,5,13,21.1])box('stone',front-.30,44.6,z,.9,3.1,.32);
 // Southern guardians' house on the low tower; no second spire is invented.
 box('stone',-38.6,68,13.9,16.3,4,13.8);{const r=new THREE.Shape([new THREE.Vector2(-7.25,70),new THREE.Vector2(7.25,70),new THREE.Vector2(0,72)]),g=new THREE.ExtrudeGeometry(r,{depth:17,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(-47.1,0,13.9);put(g,'roof');}
 // North octagonal open belfry and its four exterior stair turrets.
 const [cx,cz]=SPIRE_CENTER,R=7.5,W=2*R*Math.tan(Math.PI/8);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;wall('stone',W,66,102,1.0,cx+(R-1)*Math.sin(a),cz+(R-1)*Math.cos(a),a,[{u:0,y:73.0,w:4.25,h:25.8,pointed:true}]);}
 for(const dx of [-7.2,7.2])for(const dz of [-7.2,7.2]){cyl('stone',cx+dx,cz+dz,.92,.92,66,100,near?8:6);cyl('stone',cx+dx,cz+dz,1.1,0,100,104,near?8:6);}
 // The stone transition cap seats the complete needle base on the belfry masonry.
 cyl('stone',cx,cz,8.1,5.6,100.8,102.2,8);
 // Needle ribs and diagonals remain genuinely open in both variants.
 const lattice=spireMembers(detail);for(const [a,b]of lattice.members)k.b.bar('spireFrame',a,b,near?.27:.34);
 // Separate same-colour support mesh allows tests to exclude all the lattice members.
 const collars=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 for(const y of lattice.levels)for(let i=0;i<8;i++)collars.bar('spireFrame',lattice.point(i,y),lattice.point((i+1)%8,y),near?.40:.48);
 const top=new THREE.SphereGeometry(.18,near?8:6,near?6:4);top.translate(cx,141.93,cz);collars.put(top,'spireFrame');
 // Transept and eastern crossing tower follow the separate mapped 25/30/40/51 m stages.
 for(const s of [-1,1])wall('stone',17.8,.16,25,.9,37.1,s*28.2,s>0?0:Math.PI,[-4.2,4.2].map(u=>({u,y:3,w:4,h:16.5,pointed:true,mat:'glass'})));
 const ts=new THREE.Shape([new THREE.Vector2(-8.9,25),new THREE.Vector2(8.9,25),new THREE.Vector2(0,30)]),tr=new THREE.ExtrudeGeometry(ts,{depth:58.9,bevelEnabled:false});tr.translate(37.1,0,-30.1);put(tr,'roof');
 for(let i=0;i<8;i++){const a=i*Math.PI/4,r=8.0,w=2*r*Math.tan(Math.PI/8);wall('stone',w,25,40,.8,37.2+(r-.8)*Math.sin(a),(r-.8)*Math.cos(a),a,[{u:0,y:30,w:2.5,h:7.8,arch:true,mat:'glass'}]);}
 cyl('roof',37.2,0,8.8,5.1,40,48,8);cyl('roof',37.2,0,5.1,0,48,51,8);
 // East apse and low chapels: the wings keep the complete owned outer envelope.
 const apse=[[45.2,-9.2],[49.5,-9.2],[55.8,-6],[59,0],[55.8,6],[49.5,9.2],[45.2,9.2]];
 for(let i=0;i<apse.length;i++){const a=apse[i],b=apse[(i+1)%apse.length],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),nx=dz/len,nz=-dx/len;wall('stone',len,.16,25,.8,(a[0]+b[0])/2-nx*.8,(a[1]+b[1])/2-nz*.8,Math.atan2(nx,nz),i<6?[{u:0,y:9,w:Math.min(2.7,len-.8),h:12,arch:true,mat:'glass'}]:[]);k.poly('roof',[[49.5,34,0],[b[0],25,b[1]],[a[0],25,a[1]]],[0,1,2]);}
 // Exact mapped aisles and north chapel: facade panes partition their outer skin.
 // Interior contacts between adjacent wings are omitted rather than doubled.
 const wings=[[263644282,10,15],[263644286,10,15],[263644280,15,20]].map(([id,eave,ridge])=>({p:PLAN[OSM_WAYS.indexOf(id)],eave,ridge}));
 const inside=([x,z],p)=>{let hit=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>z)!=(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;};
 for(const wing of wings){const {p,eave,ridge}=wing,sign=Math.sign(p.reduce((s,a,i)=>s+a[0]*p[(i+1)%p.length][1]-p[(i+1)%p.length][0]*a[1],0));
  for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);if(len<.01)continue;const nx=sign*dz/len,nz=-sign*dx/len,n=Math.max(1,Math.ceil(len/(near?5:9))),point=(u,y)=>[a[0]+dx*u,y,a[1]+dz*u],face=(m,u,v,y,t)=>{let q=[point(u,y),point(v,y),point(v,t),point(u,t)];const n=new THREE.Vector3(...q[1]).sub(new THREE.Vector3(...q[0])).cross(new THREE.Vector3(...q[2]).sub(new THREE.Vector3(...q[0])));if(n.dot(new THREE.Vector3(nx,0,nz))<0)q=[q[0],q[3],q[2],q[1]];k.quad(m,...q);};
   for(let j=0;j<n;j++){const u=j/n,v=(j+1)/n,mid=(u+v)/2,probe=[a[0]+dx*mid+nx*.3,a[1]+dz*mid+nz*.3];if(wings.some(other=>other!==wing&&inside(probe,other.p)))continue;const exposed=wing===wings[2]||Math.sign(nz)===Math.sign((a[1]+c[1])/2)&&Math.abs(nz)>.6;const pane=exposed&&len/n>2.5;if(!pane){face('stone',u,v,.16,eave);continue;}const l=u+(v-u)*.25,r=v-(v-u)*.25,bottom=2.0,top=eave-1.3;face('stone',u,v,.16,bottom);face('stone',u,v,top,eave);face('stone',u,l,bottom,top);face('stone',r,v,bottom,top);face('glass',l,r,bottom,top);}
  }
  if(wing!==wings[2]){const q=p.map(([x,z])=>[x,Math.min(ridge,Math.max(eave,ridge-(Math.abs(z)-8.5)/(19.5-8.5)*(ridge-eave))),z]),triangles=THREE.ShapeUtils.triangulateShape(p.map(v=>new THREE.Vector2(...v)),[]);for(const tri of triangles){let points=tri.map(i=>q[i]);const n=new THREE.Vector3(...points[1]).sub(new THREE.Vector3(...points[0])).cross(new THREE.Vector3(...points[2]).sub(new THREE.Vector3(...points[0])));if(n.y<0)points=[points[0],points[2],points[1]];k.poly('roof',points,[0,1,2]);}}else{const cx=p.reduce((s,a)=>s+a[0],0)/p.length,cz=p.reduce((s,a)=>s+a[1],0)/p.length;for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];let q=[[cx,ridge,cz],[a[0],eave,a[1]],[b[0],eave,b[1]]];const n=new THREE.Vector3(...q[1]).sub(new THREE.Vector3(...q[0])).cross(new THREE.Vector3(...q[2]).sub(new THREE.Vector3(...q[0])));if(n.y<0)q=[q[0],q[2],q[1]];k.poly('roof',q,[0,1,2]);}}
 }
 const root=k.finish(),support=collars.finish();support.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(SPEC.rotation);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();o.userData.namedSupport='spire-collars';root.add(o);}});root.userData.triangles+=support.userData.triangles;root.userData.drawCalls+=support.userData.drawCalls;return root;
}
