import*as THREE from'three';import{SPEC,PALETTES}from'./config.js';import{PLAN}from'./footprint.js';import{kit}from'./tour-de-leurope-mulhouse-parts.js';
export const CORNERS=[[12,13,14,15,16,17,18],[28,29,30,31,32,33,34],[44,45,46,47,48,49,50]];
const area=r=>r.reduce((s,a,i)=>{const b=r[(i+1)%r.length];return s+a[0]*b[1]-b[0]*a[1]},0);
export function create({detail='near'}={}){const{near,prism,quad,poly,cyl,put,finish}=kit(SPEC,PALETTES,detail),raw=PLAN[0],ring=area(raw)<0?raw:[...raw].reverse(),p=(a,y)=>[a[0],y,a[1]],n=ring.length;
// Rigid ground level: a central lift core and three mapped corner service blades, leaving the undercroft genuinely open.
prism('concrete',PLAN[4],0,92);for(const indices of CORNERS){const pts=indices.map(i=>raw[i]),root=[0,1].map(k=>pts.reduce((s,p)=>s+p[k],0)/pts.length*.82);prism('concrete',[...pts,root],0,98.8);}
prism('concrete',ring,9.3,9.6);
const blank=new Set(CORNERS.flatMap(a=>a.slice(0,-1).map(i=>i+':'+((i+1)%raw.length))));
for(let i=0;i<n;i++){const a=ring[i],b=ring[(i+1)%n],ai=raw.indexOf(a),bi=raw.indexOf(b);if(blank.has(ai+':'+bi)||blank.has(bi+':'+ai))continue;const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),cols=near?Math.max(1,Math.ceil(len/2.2)):1;
 for(let row=0;row<27;row++){const y=9.6+(92-9.6)*row/27,h=(92-9.6)/27,band=.58;quad('concrete',p(a,y),p(b,y),p(b,y+band),p(a,y+band));for(let col=0;col<cols;col++){const t0=col/cols,t1=(col+1)/cols,tb=t0+Math.min(.16/len,(t1-t0)*.18),u=[a[0]+dx*t0,a[1]+dz*t0],v=[a[0]+dx*tb,a[1]+dz*tb],w=[a[0]+dx*t1,a[1]+dz*t1];quad('concrete',p(u,y+band),p(v,y+band),p(v,y+h),p(u,y+h));quad((col+row+Math.floor(i/4))%4===0?'glassDark':'glass',p(v,y+band),p(w,y+band),p(w,y+h),p(v,y+h));}}
}
// Roof of the residential body excludes the raised circular restaurant support to avoid hidden overlapping caps.
const sh=ring; // Top is triangulated with a real hole for the neck using adjacent planar surface rings.
// Visible body roof only; central lift-core top is hidden beneath the neck.
const roofOuter=ring.map(a=>p(a,92)),neck=PLAN[2];
// THREE Shape triangulation is used through a horizontal perforated plate.
const shape=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)));shape.holes.push(new THREE.Path(neck.map(([x,z])=>new THREE.Vector2(x,-z))));const g=new THREE.ShapeGeometry(shape);g.rotateX(-Math.PI/2);g.translate(0,92,0);put(g,'concrete');
prism('concrete',neck,92,95);
const restaurant=PLAN[3],r=area(restaurant)<0?restaurant:[...restaurant].reverse();prism('concrete',r,94.8,95);for(let i=0;i<r.length;i++){const a=r[i],b=r[(i+1)%r.length],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),t=Math.min(.16/len,.3),c=[a[0]+dx*t,a[1]+dz*t];quad('concrete',p(a,95),p(c,95),p(c,97.8),p(a,97.8));quad('glassDark',p(c,95),p(b,95),p(b,97.8),p(c,97.8));}prism('concrete',r,97.8,98);prism('concrete',PLAN[4],98,100);
const cx=.55,cz=1.35;cyl('metal',cx,cz,.14,.09,100,109,near?10:6);cyl('metal',cx,cz,.07,.02,109,112,near?8:5);return finish();}
