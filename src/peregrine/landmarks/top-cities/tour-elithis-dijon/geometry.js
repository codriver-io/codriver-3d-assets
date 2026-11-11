import*as THREE from'three';import{SPEC,PALETTES}from'./config.js';import{PLAN}from'./footprint.js';import{kit}from'./tour-elithis-dijon-parts.js';
export const roofY=x=>32.7+.8*x/(15.5144*1.065);
export function create({detail='near'}={}){const{near,prism,wall,quad,poly,box,put,finish}=kit(SPEC,PALETTES,detail),ring=PLAN[0],n=ring.length;const point=(p,y)=>[p[0],y,p[1]];
// Ground-floor skin is an actual pierced perimeter; no duplicate solid shell behind glazing.
prism('stone',ring,0,.18);
for(let i=0;i<n;i++){const a=ring[i],b=ring[(i+1)%n],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),angle=Math.atan2(-dz,dx),nx=-dz/len,nz=dx/len;
 const openings=len>1.5?[{u:0,y:.2,w:len-.40,h:2.45,mat:'glassDark'}]:[];
 if(near)wall('stone',len,0,3.65,.20,(a[0]+b[0])/2-nx*.20,(a[1]+b[1])/2-nz*.20,angle,openings);else{const tile=(m,u,v,lo,hi)=>{const p=t=>[a[0]+dx*t,a[1]+dz*t];quad(m,point(p(u),lo),point(p(v),lo),point(p(v),hi),point(p(u),hi));};if(openings.length){const edge=.2/len;tile('stone',0,1,0,.2);tile('stone',0,1,2.65,3.65);tile('stone',0,edge,.2,2.65);tile('stone',1-edge,1,.2,2.65);tile('glassDark',edge,1-edge,.2,2.65);}else tile('stone',0,1,0,3.65);}
 // Separate short glazing panes between horizontal frame bands; matte spandrels remain distinct.
 const cols=near?Math.max(1,Math.ceil(len/2.4)):Math.max(1,Math.ceil(len/5)),rows=near?27:14,y0=3.8,y1=31.25;
 // Horizontal spans are emitted once per row; vertical mullions span the whole facade once.
 for(let row=0;row<rows;row++){const lo=y0+(y1-y0)*row/rows,hi=y0+(y1-y0)*(row+1)/rows,band=near?.09:.12;quad('frame',point(a,lo),point(b,lo),point(b,lo+band),point(a,lo+band));for(let col=0;col<cols;col++){const t0=col/cols,t1=(col+1)/cols,ta=t0+.05/len,p=[a[0]+dx*ta,a[1]+dz*ta],q=[a[0]+dx*t1,a[1]+dz*t1];quad(row%3===2?'glassDark':'glass',point(p,lo+band),point(q,lo+band),point(q,hi),point(p,hi));}}
 for(let col=0;col<cols;col++){const t=col/cols,p=[a[0]+dx*t,a[1]+dz*t],q=[a[0]+dx*(t+.05/len),a[1]+dz*(t+.05/len)];quad('frame',point(p,y0),point(q,y0),point(q,y1),point(p,y1));}
 quad('frame',point(a,3.65),point(b,3.65),point(b,3.8),point(a,3.8));
 quad('frame',point(a,31.25),point(b,31.25),point(b,roofY(b[0])-.32),point(a,roofY(a[0])-.32));
}
// Overhanging photovoltaic visor: top panels and rim occupy adjacent, rather than layered, faces.
const roof=ring.map(p=>p.map(v=>v*1.065)),inner=ring.map(p=>p.map(v=>v*1.025));for(let i=0;i<n;i++){const j=(i+1)%n,a=roof[i],b=roof[j],c=inner[j],e=inner[i];quad('frame',point(a,roofY(a[0])-.26),point(b,roofY(b[0])-.26),point(b,roofY(b[0])),point(a,roofY(a[0])));quad('frame',point(a,roofY(a[0])),point(b,roofY(b[0])),point(c,roofY(c[0])),point(e,roofY(e[0])));poly('solar',[[0,roofY(0),0],point(e,roofY(e[0])),point(c,roofY(c[0]))],[0,1,2]);poly('frame',[[0,roofY(0)-.26,0],point(b,roofY(b[0])-.26),point(a,roofY(a[0])-.26)],[0,1,2]);}
// Copper perforated sun screen, southwest half: genuine openings and a clear facade gap.
for(let i=0;i<=11;i++){const a=ring[i].map(v=>v*1.055),b=ring[(i+1)%n].map(v=>v*1.055),dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),nx=-dz/len,nz=dx/len,x=(a[0]+b[0])/2,z=(a[1]+b[1])/2,low=8.5+.7*Math.abs(x/15),top=30.8,cols=Math.max(1,Math.round(len/(near?1.15:2.0))),rows=near?3:2,pitch=len/cols,bar=pitch*(near?.64:.62);
 // Continuous closed blades retain their exposed side edges; hidden rail end caps and repeated hole walls are removed.
 const strip=(u,v,lo,hi,vertical=false)=>{const p=(t,y,depth)=>[a[0]+dx*t/len+nx*depth,y,a[1]+dz*t/len+nz*depth];quad('copper',p(u,lo,.08),p(v,lo,.08),p(v,hi,.08),p(u,hi,.08));quad('copper',p(v,lo,0),p(u,lo,0),p(u,hi,0),p(v,hi,0));quad('copper',p(u,hi,0),p(u,hi,.08),p(v,hi,.08),p(v,hi,0));quad('copper',p(v,lo,0),p(v,lo,.08),p(u,lo,.08),p(u,lo,0));if(vertical){quad('copper',p(u,lo,0),p(u,lo,.08),p(u,hi,.08),p(u,hi,0));quad('copper',p(v,hi,0),p(v,hi,.08),p(v,lo,.08),p(v,lo,0));}};
 for(let col=0;col<=cols;col++)strip(Math.max(0,col*pitch-bar/2),Math.min(len,col*pitch+bar/2),low,top,true);
 // Short rail pieces only bridge open louver gaps; no coplanar rail/blade overlap.
 for(let j=0;j<=rows;j++){const y=low+(top-low)*j/rows,lo=Math.max(low,y-.08),hi=Math.min(top,y+.08);for(let col=0;col<cols;col++)strip(col*pitch+bar/2,(col+1)*pitch-bar/2,lo,hi);}
 for(const y of[10,28]){const inner=[x/1.055,z/1.055],cx=(x+inner[0])/2,cz=(z+inner[1])/2;box('copper',cx,y,cz,Math.abs(x-inner[0])+.18,.14,Math.abs(z-inner[1])+.18);}
}
// Two crossing silver ties follow the curved screen facets, with every end seated on a solid edge strip.
for(const {a,b}of tieSegments()){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),g=new THREE.CylinderGeometry(.045,.045,av.distanceTo(bv),near?4:3);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),bv.clone().sub(av).normalize()));g.translate(...av.clone().add(bv).multiplyScalar(.5).toArray());put(g,'ties');}
return finish();}
export function tieSegments(){const out=[],ring=PLAN[0];for(let i=0;i<=11;i++){const a=ring[i].map(v=>v*1.055),b=ring[i+1].map(v=>v*1.055),dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),nx=-dz/len,nz=dx/len;for(const sign of[-1,1]){const y=t=>sign===1?10.8+18*t:28.8-18*t;out.push({a:[a[0]+dx*.04/len+nx*.105,y((i+.04/len)/12),a[1]+dz*.04/len+nz*.105],b:[b[0]-dx*.04/len+nx*.105,y((i+1-.04/len)/12),b[1]-dz*.04/len+nz*.105],normal:[nx,0,nz]});}}return out;}

