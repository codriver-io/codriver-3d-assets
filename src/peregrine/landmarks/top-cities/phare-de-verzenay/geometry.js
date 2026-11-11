import * as THREE from 'three';import{SPEC,PALETTES}from'./config.js';import{PLAN}from'./footprint.js';import{kit}from'./phare-de-verzenay-parts.js';
export function create({detail='near'}={}){
 const k=kit(SPEC,PALETTES,detail),{near,box,wall,cyl}=k,ring=PLAN[0],area=ring.reduce((s,p,i)=>s+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0),sign=Math.sign(area);
 // Low connected museum follows the complete mapped outline, including its rounded end.
 k.prism('stone',ring,0,.2);
 for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),nx=sign*dz/len,nz=-sign*dx/len;if(len<.1)continue;wall('stone',len,.2,4.15,.35,(a[0]+c[0])/2-nx*.35,(a[1]+c[1])/2-nz*.35,Math.atan2(nx,nz),len>6?[{u:0,y:.25,w:1.35,h:2.6,mat:'shadow'}]:len>3?[{u:0,y:1.7,w:.65,h:1.3,mat:'glass'}]:[]);}
 k.prism('roof',ring,4.15,4.35);
 // The octagonal tapered shaft starts on the actual connected museum/tower base.
 const R=1.8,w=2*R*Math.tan(Math.PI/8);
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,open=i%2===0?[{u:0,y:12,w:.26,h:.85},{u:0,y:18,w:.26,h:.85}]:[];
  wall('shaft',w,4.35,23.4,.18,(R-.18)*Math.sin(a),(R-.18)*Math.cos(a),a,open);
  for(const o of open){const y=o.y+.425,r=1.8-(y-4.35)/19.05*.4;const g=new THREE.BoxGeometry(.23,.78,.08);g.rotateY(a);g.translate((r-.10)*Math.sin(a),y,(r-.10)*Math.cos(a));k.put(g,'shadow');}
 }
 cyl('trim',0,0,1.42,2.3,23.4,24.4,8);cyl('trim',0,0,2.8,2.8,24.4,25,8);
 // Open outside balustrade: repeated holes preserve the gallery silhouette in far.
 const r=2.52,bw=2*r*Math.tan(Math.PI/8);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;wall('metal',bw,25,25.78,.12,(r-.12)*Math.sin(a),(r-.12)*Math.cos(a),a,[-.55,0,.55].map(u=>({u,y:25.13,w:.34,h:.49})));}
 // Glass lantern has separate panes and metal jambs in both LODs.
 const lr=2.0,lw=2*lr*Math.tan(Math.PI/8);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;wall('metal',lw,25.0,27.45,.12,(lr-.12)*Math.sin(a),(lr-.12)*Math.cos(a),a,[{u:0,y:25.14,w:lw-.22,h:2.1,mat:'glass'}]);}
 cyl('roof',0,0,2.25,.14,27.45,29.15,8);cyl('metal',0,0,.05,.05,29.1,29.7,near?6:4);
 const root=k.finish();
 // Radius taper is baked in metric space after the mapped rigid rotation; only shaft masonry is affected.
 root.traverse(o=>{if(o.isMesh&&o.material.name==='shaft'){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){const scale=(1.8-(p.getY(i)-4.35)/19.05*.4)/1.8;p.setX(i,p.getX(i)*scale);p.setZ(i,p.getZ(i)*scale);}o.geometry.computeVertexNormals();o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
 return root;
}
