import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';

const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = latToMercY(SPEC.origin[1]);
const metric = ([lng, lat]) => [(lngToMercX(lng) - ox) / k, (oz - latToMercY(lat)) / k];
// Actual mapped controls: pointed tips alternating with concave roof valleys.
export const PLAN = [0, 5, 10, 14, 17, 20, 24, 28].map(i => metric(FOOTPRINTS[0][i]));
export const TOWER = metric([-117.8992412, 33.787738]);
const lerp = (a,c,t) => a.map((v,i) => v+(c[i]-v)*t);
class SurfaceBatch {
  constructor() { this.p=[]; }
  triangle(a,b,c,out) {
    const n=new THREE.Vector3().crossVectors(new THREE.Vector3(...b).sub(new THREE.Vector3(...a)),new THREE.Vector3(...c).sub(new THREE.Vector3(...a)));
    if(n.dot(new THREE.Vector3(...out))<0) [b,c]=[c,b];
    if(n.lengthSq()>1e-10)this.p.push(...a,...b,...c);
  }
  quad(a,b,c,d,out) {this.triangle(a,b,c,out);this.triangle(a,c,d,out);}
  geometry() {const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));g.computeVertexNormals();return g;}
}
export function create({ detail='near' }={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),surfaces=new Map();
  const mat=n=>near?n:n==='glassDeep'?'glass':n==='bronze'?'shadow':n;
  const batch=n=>{n=mat(n);if(!surfaces.has(n))surfaces.set(n,new SurfaceBatch());return surfaces.get(n);};
  const heights=PLAN.map((_,i)=>i%2?24.3:SPEC.cathedralHeight-.17),center=[3.1,SPEC.cathedralHeight-.17,-.2];
  const bar=(m,a,c,w,d=w)=>b.bar(mat(m),a,c,w,d);
  // Outward glass skin, alternating muted blue panels and silver joints.
  for(let i=0;i<8;i++) {
    const j=(i+1)%8,a=PLAN[i],c=PLAN[j],dx=c[0]-a[0],dz=c[1]-a[1],length=Math.hypot(dx,dz);
    const out=[dz/length,0,-dx/length],h0=heights[i],h1=heights[j];
    const cols=Math.ceil(length/(near?1.75:5.25)),rows=Math.ceil(SPEC.cathedralHeight/(near?1.25:3.75));
    const at=(t,y,offset=0)=>[a[0]+dx*t+out[0]*offset,y,a[1]+dz*t+out[2]*offset];
    for(let u=0;u<cols;u++)for(let r=0;r<rows;r++) {
      const t0=u/cols,t1=(u+1)/cols,y0=r*SPEC.cathedralHeight/rows,y1=(r+1)*SPEC.cathedralHeight/rows;
      // Clip the full rectangle against the sloping eave. A four-corner clamp
      // leaves a triangular crack whenever the eave crosses a panel row.
      const rectangle=[[t0,y0],[t1,y0],[t1,y1],[t0,y1]],p=[];
      for(let q=0;q<4;q++){
        const a=rectangle[q],c=rectangle[(q+1)%4],fa=h0+(h1-h0)*a[0]-a[1],fc=h0+(h1-h0)*c[0]-c[1];
        if(fa>=0)p.push(a);if((fa>=0)!==(fc>=0))p.push(lerp(a,c,fa/(fa-fc)));
      }
      const tint=(u*7+r*3+i*5)%17,m=tint===0?'glassDeep':tint===1&&y0>4&&y1<27?'glow':tint<5?'glassPale':'glass';
      for(let q=1;q<p.length-1;q++)batch(m).triangle(at(...p[0]),at(...p[q]),at(...p[q+1]),out);
    }
    for(let u=0;u<=cols;u++){const t=u/cols,w=(near?.065:.10)/length,top=h0+(h1-h0)*t;
      batch('lattice').quad(at(t-w,.18,.08),at(t+w,.18,.08),at(t+w,top,.08),at(t-w,top,.08),out);
    }
    for(let r=1;r<rows;r++){const y=r*SPEC.cathedralHeight/rows,w=near?.055:.09;let t0=0,t1=1;
      if(y>Math.min(h0,h1)){if(y>=Math.max(h0,h1))continue;const t=(y-h0)/(h1-h0);if(h0<h1)t0=t;else t1=t;}
      batch('lattice').quad(at(t0,y-w,.09),at(t1,y-w,.09),at(t1,y+w,.09),at(t0,y+w,.09),out);
    }
    const A=[a[0],h0,a[1]],C=[c[0],h1,c[1]];
    bar('steel',A,C,.25);bar('stone',at(0,.31),at(1,.31),.5,.28);
    // Regular rectangular glazing clipped to each triangular roof plane.
    // This avoids a fan of radial mullions: the photograph shows parallel roof joints.
    const ac=new THREE.Vector3(...C).sub(new THREE.Vector3(...A)),acLength=ac.length(),U=ac.clone().normalize();
    const ca=new THREE.Vector3(...center).sub(new THREE.Vector3(...A)),uc=ca.dot(U),V=ca.clone().addScaledVector(U,-uc),H=V.length();V.normalize();
    const normal=new THREE.Vector3().crossVectors(U,V);if(normal.y<0)normal.negate();
    const xyz=(u,v,offset=0)=>new THREE.Vector3(...A).addScaledVector(U,u).addScaledVector(V,v).addScaledVector(normal,offset).toArray();
    const clip=(poly,axis,value,greater)=>{
      const result=[];for(let z=0;z<poly.length;z++){const a=poly[z],c=poly[(z+1)%poly.length],ia=greater?a[axis]>=value:a[axis]<=value,ic=greater?c[axis]>=value:c[axis]<=value;
        if(ia)result.push(a);if(ia!==ic){const t=(value-a[axis])/(c[axis]-a[axis]);result.push(lerp(a,c,t));}}
      return result;
    };
    const pitch=near?1.85:5.6,roofPoly=[[0,0],[acLength,0],[uc,H]],umin=Math.min(0,uc),umax=Math.max(acLength,uc);
    for(let u=Math.floor(umin/pitch)*pitch,col=0;u<umax;u+=pitch,col++)for(let v=0,row=0;v<H;v+=pitch,row++){
      let p=roofPoly;for(const [axis,value,greater]of [[0,u,true],[0,u+pitch,false],[1,v,true],[1,v+pitch,false]])p=clip(p,axis,value,greater);
      if(p.length>2)for(let q=1;q<p.length-1;q++)batch((col+row+i)%11===0?'glassPale':'glass').triangle(xyz(...p[0]),xyz(...p[q]),xyz(...p[q+1]),normal.toArray());
    }
    for(let v=pitch;v<H;v+=pitch){const t=v/H;bar('lattice',xyz(uc*t,v,.08),xyz(acLength+(uc-acLength)*t,v,.08),near?.075:.11);}
    for(let u=Math.ceil(umin/pitch)*pitch;u<umax;u+=pitch){const vs=[];for(let z=0;z<3;z++){const a=roofPoly[z],c=roofPoly[(z+1)%3];if(a[0]!==c[0]&&u>=Math.min(a[0],c[0])&&u<=Math.max(a[0],c[0]))vs.push(a[1]+(c[1]-a[1])*(u-a[0])/(c[0]-a[0]));}if(vs.length>1)bar('lattice',xyz(u,Math.min(...vs),.08),xyz(u,Math.max(...vs),.08),near?.075:.11);}
    bar('steel',center,A,.25);
  }
  // Tall historic glass door bays on the short axis, with current bronze pedestrian leaves.
  for(const index of [4,0]){
    const tip=PLAN[index];
    for(const edge of [index,(index+7)%8]){
      const other=PLAN[edge===index?(index+1)%8:(index+7)%8],v=[other[0]-tip[0],other[1]-tip[1]],l=Math.hypot(...v),t=[v[0]/l,v[1]/l];
      const normal=edge===index?[t[1],-t[0]]:[-t[1],t[0]],out=[normal[0],0,normal[1]];
      const at=(r,y,offset=.15)=>[tip[0]+t[0]*r+normal[0]*offset,y,tip[1]+t[1]*r+normal[1]*offset];
      batch('shadow').quad(at(.3,.65),at(4.5,.65),at(4.5,27.45),at(.3,27.45),out);
      bar('steel',at(4.6,.6),at(4.6,27.6),.2);
      if(near)for(let y=2;y<27;y+=1.35)bar('lattice',at(.35,y,.23),at(4.45,y,.23),.065);
      batch('bronze').quad(at(.45,.7,.30),at(4.3,.7,.30),at(4.3,3.3,.30),at(.45,3.3,.30),out);
    }
  }
  // NE vestibule within the mapped door projection.
  const ne=metric([-117.898710,33.787575]);
  b.box('glass',[ne[0],1.9,ne[1]],[4.6,3.8,3]);b.box('stone',[ne[0],3.96,ne[1]],[4.7,.32,3.1]);
  // Circular prayer chapel contained in the mapped 9.2 × 9.7 m tower base.
  const [tx,tz]=TOWER,cylinder=(m,r0,r1,h,y,n)=>{const g=new THREE.CylinderGeometry(r0,r1,h,n,1,m==='shadow');g.translate(tx,y,tz);b.put(g,mat(m));};
  cylinder('stone',4.35,4.35,.32,.16,near?48:24);
  cylinder('shadow',3.72,3.72,3.1,1.87,near?48:24);
  cylinder('stone',4.35,4.35,.4,3.62,near?48:24);
  for(let i=0;i<33;i++){const a=i*2*Math.PI/33,g=new THREE.CylinderGeometry(.14,.14,3.1,near?6:4);g.translate(tx+4*Math.cos(a),1.87,tz+4*Math.sin(a));b.put(g,'stone');}
  // Open stainless-steel prism cluster; all reeds retain their staggered sharp tips in far.
  for(let i=0;i<24;i++){
    const a=i*2*Math.PI/24,x=tx+3.7*Math.cos(a),z=tz+3.7*Math.sin(a),top=SPEC.height-(i===0?0:1.2+((i*7)%9)*.75),base=3.82,point=top-2.1;
    const g=new THREE.CylinderGeometry(.30,.30,point-base,3,1,false);g.rotateY(a);g.translate(x,(point+base)/2,z);b.put(g,'steel');
    const tip=new THREE.ConeGeometry(.30,2.1,3);tip.rotateY(a);tip.translate(x,top-1.05,z);b.put(tip,'steel');
    if(near){const inner=[tx+3.35*Math.cos(a),base,tz+3.35*Math.sin(a)];bar('shadow',inner,[inner[0],point,inner[2]],.11);}
  }
  // Open carillon cage with seven bell ranks; warm metal confined to the upper interior.
  for(let y=43;y<=61;y+=3)for(let i=0;i<8;i++){const a=i*Math.PI/4,c=(i+1)*Math.PI/4;bar('steel',[tx+3.7*Math.cos(a),y,tz+3.7*Math.sin(a)],[tx+3.7*Math.cos(c),y,tz+3.7*Math.sin(c)],near?.15:.20);}
  if(near)for(let row=0;row<7;row++)for(let col=0;col<(row===0?10:7);col++){
    const r=.36-row*.035,a=col*2*Math.PI/(row===0?10:7),y=45+row*2.1,g=new THREE.CylinderGeometry(r*.55,r,.65-row*.035,6,1,false);
    g.translate(tx+2.15*Math.cos(a),y,tz+2.15*Math.sin(a));b.put(g,'bronze');
    const ai=Math.round(a/(Math.PI/12))*Math.PI/12;
    bar('steel',[tx+2.15*Math.cos(a),y+.28,tz+2.15*Math.sin(a)],[tx+2.15*Math.cos(a),y+.6,tz+2.15*Math.sin(a)],.09);
    bar('steel',[tx+2.15*Math.cos(a),y+.6,tz+2.15*Math.sin(a)],[tx+3.7*Math.cos(ai),y+.6,tz+3.7*Math.sin(ai)],.11);
  }
  const beacon=new THREE.SphereGeometry(.14,6,4);beacon.translate(tx+3.7,SPEC.height-.13,tz);b.put(beacon,'glow');
  for(const [m,q]of surfaces)if(q.p.length)b.put(q.geometry(),m);
  const model=b.finish();
  model.traverse(o=>{if(!o.isMesh)return;const n=o.material.name;if(n.startsWith('glass')){o.material.roughness=.28;o.material.metalness=.35;}else if(n==='steel'||n==='lattice'){o.material.roughness=.30;o.material.metalness=.65;}});
  return model;
}
