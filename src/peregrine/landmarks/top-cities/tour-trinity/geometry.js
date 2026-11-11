import{assetBuilder}from'../../asset-geometry.js';import{SPEC,PALETTES}from'./config.js';import{FOOTPRINTS}from'./footprint.js';import{local,simplify,surfaces}from'./tour-trinity-parts.js';
const plan=simplify(local(FOOTPRINTS[0],SPEC.origin),.25);
function clip(p,axis,k,above){const out=[];for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length],da=(a[axis]-k)*(above?1:-1),dc=(c[axis]-k)*(above?1:-1);if(da>=-1e-8)out.push(a);if((da>=0)!==(dc>=0)){const t=da/(da-dc);out.push(a.map((v,j)=>v+t*(c[j]-v)));}}return out;}
function area(x0,x1,z0,z1){let p=plan;for(const[axis,k,above]of[[0,x0,true],[0,x1,false],[1,z0,true],[1,z1,false]])p=clip(p,axis,k,above);return p;}
export const VOLUMES=[{name:'north wing',height:134,ring:area(-100,100,-100,-27)},{name:'main wing',height:134,ring:area(-7,100,-27,8)},{name:'external core',height:140,ring:area(-100,-7,-27,8),core:true},{name:'lower south wing',height:106,ring:area(-100,100,8,100)}];
function sharedHeight(shaft,a,c){const m=[(a[0]+c[0])/2,(a[1]+c[1])/2];let h=0;for(const o of VOLUMES){if(o===shaft)continue;for(let i=0;i<o.ring.length;i++){const p=o.ring[i],q=o.ring[(i+1)%o.ring.length],dx=q[0]-p[0],dz=q[1]-p[1],d=dx*dx+dz*dz;if(d<1e-8)continue;const t=((m[0]-p[0])*dx+(m[1]-p[1])*dz)/d;if(t>=0&&t<=1&&Math.hypot(m[0]-p[0]-t*dx,m[1]-p[1]-t*dz)<.01)h=Math.max(h,o.height);}}return h;}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b);
 for(const v of VOLUMES)s.shell(v.ring,v.height,{edgeBottom:(a,c)=>sharedHeight(v,a,c),pitch:v.core?(near?7.8:15.6):(near?3.9:7.8),bay:near?2.4:4.8,band:v.core?1.0:(near?.18:.3),mullion:v.core?.28:.1,glass:v.core?((side,col,y)=>col===0&&y>12?'gold':'coreglass'):'glass'});
 const model=s.finish();model.userData.identity='unequal glass wings and taller pale external lift core';return model;
}
