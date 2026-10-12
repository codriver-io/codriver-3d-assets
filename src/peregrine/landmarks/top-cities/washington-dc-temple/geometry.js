import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS, WAY_RINGS, OSM_WAYS, LINK_RING } from './footprint.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
const stretch=mercStretch(SPEC.origin[1]),ox=lngToMercX(SPEC.origin[0]),oz=latToMercY(SPEC.origin[1]);
export const metric=([lng,lat])=>[(lngToMercX(lng)-ox)/stretch,(oz-latToMercY(lat))/stretch];
export const PLAN=FOOTPRINTS[0].map(metric);
const mapped=id=>WAY_RINGS[OSM_WAYS.indexOf(id)].map(metric);
const center=ring=>ring.reduce((c,p)=>[c[0]+p[0]/ring.length,c[1]+p[1]/ring.length],[0,0]);
const signed=ring=>ring.reduce((a,p,i)=>{const q=ring[(i+1)%ring.length];return a+p[0]*q[1]-p[1]*q[0];},0);
export const TOWERS=[
  {id:845436203,shaft:845436204,cap:57,top:77.5}, // NE
  {id:845436192,shaft:845436193,cap:57,top:77.5}, // SE
  {id:845436200,shaft:845436201,cap:55.5,top:75.5}, // NW
  {id:845436194,shaft:845436195,cap:55.5,top:75.5}, // SW
  {id:845436197,shaft:845436198,cap:59,top:81}, // W
  {id:845436189,shaft:845436191,cap:61,top:SPEC.height-SPEC.statueHeight,moroni:true}, // E
].map(t=>({...t,center:center(mapped(t.id))}));

class Skin {
  constructor(){this.p=[];}
  tri(a,b,c,out){
    const n=new THREE.Vector3().crossVectors(new THREE.Vector3(...b).sub(new THREE.Vector3(...a)),new THREE.Vector3(...c).sub(new THREE.Vector3(...a)));
    if(n.dot(new THREE.Vector3(...out))<0)[b,c]=[c,b];
    if(n.lengthSq()>1e-12)this.p.push(...a,...b,...c);
  }
  quad(a,b,c,d,out){this.tri(a,b,c,out);this.tri(a,c,d,out);}
  geometry(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));g.computeVertexNormals();return g;}
}
export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),skins=new Map();
  const skin=m=>{if(!skins.has(m))skins.set(m,new Skin());return skins.get(m);};
  const quad=(m,a,c,d,e,out)=>skin(m).quad(a,c,d,e,out);
  const cap=(ring,holes,y,material,up)=>{
    const all=[...ring,...holes.flat()];
    const triangles=THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),holes.map(h=>h.map(p=>new THREE.Vector2(...p))));
    for(const t of triangles)skin(material).tri(...t.map(i=>[all[i][0],y,all[i][1]]),[0,up?1:-1,0]);
  };
  // A closed polygon shell with actual apertures: there is no opaque backing behind glazing.
  const prism=(ring,y0,y1,{top='stone',holes=[],windows=false,ribs=false,entry=false}={})=>{
    cap(ring,holes,y0,'stone',false);cap(ring,holes,y1,top,true);
    for(const [h,loop] of [ring,...holes].entries()){
      const sign=Math.sign(signed(loop))*(h?-1:1);
      for(let i=0;i<loop.length;i++){
        const a=loop[i],c=loop[(i+1)%loop.length],dx=c[0]-a[0],dz=c[1]-a[1],l=Math.hypot(dx,dz),nx=sign*dz/l,nz=-sign*dx/l;
        const at=(t,y,off=0)=>[a[0]+dx*t+nx*off,y,a[1]+dz*t+nz*off],out=[nx,0,nz];
        // Fold the wall skin itself into marble flutes: no backing plane or
        // stacked trim. Window centres fall in the valleys of the profile.
        const windowCount=Math.max(3,Math.round(l/(entry?1.45:2.8)));
        const fluteCount=ribs&&h===0&&l>8?windowCount*(near?4:2):0;
        const depth=.50;
        const knots=[[0,0],[.16,0],[.32,depth],[.68,depth],[.84,0],[1,0]];
        const offset=t=>{
          if(!fluteCount)return 0;
          const phase=(t*fluteCount)%1;
          const k=knots.findIndex(q=>q[0]>=phase);
          const left=knots[Math.max(0,k-1)],right=knots[k];
          return (left[1]+(right[1]-left[1])*(phase-left[0])/(right[0]-left[0]||1))*Math.min(1,t*l/.30,(1-t)*l/.30);
        };
        const panel=(mat,t0,t1,bottom,top)=>{
          if(top<=bottom||t1<=t0)return;
          if(mat!=='stone'||!fluteCount){quad(mat,at(t0,bottom),at(t1,bottom),at(t1,top),at(t0,top),out);return;}
          const cuts=[t0,t1];
          for(let j=0;j<fluteCount;j++)for(const [f]of knots){const t=(j+f)/fluteCount;if(t>t0&&t<t1)cuts.push(t);}
          for(const t of [.30/l,1-.30/l])if(t>t0&&t<t1)cuts.push(t);
          cuts.sort((a,b)=>a-b);
          for(let k=0;k<cuts.length-1;k++){
            const t=cuts[k],u=cuts[k+1],a=offset(t+1e-8),c=offset(u-1e-8);
            const mat=Math.abs(a-c)>.02?'flute':'stone';
            quad(mat,at(t,bottom,a),at(u,bottom,c),at(u,top,c),at(t,top,a),out);
            // Exposed flute ends at window lintels and the roof are closed.
            if(a||c){
              quad('stone',at(t,top,0),at(t,top,a),at(u,top,c),at(u,top,0),[0,1,0]);
              quad('stone',at(t,bottom,0),at(u,bottom,0),at(u,bottom,c),at(t,bottom,a),[0,-1,0]);
            }
          }
        };
        if(windows && h===0 && l>8){
          const count=windowCount,w=(entry?.92:.20)/l;
          for(let j=0;j<count;j++){
            const t0=j/count,t1=(j+1)/count,mid=(t0+t1)/2,left=mid-w/2,right=mid+w/2;
            const bottom=entry?y0+.28:y0+6,top=entry?y1-.55:y1-3;
            panel('stone',t0,left,y0,y1);panel('stone',right,t1,y0,y1);
            panel('stone',left,right,y0,bottom);panel('stone',left,right,top,y1);
            const rows=entry?1:4;
            for(let r=0;r<rows;r++){
              const low=bottom+(top-bottom)*r/rows,high=bottom+(top-bottom)*(r+1)/rows;
              const stop=high-(r<rows-1?.50:0);
              if(near&&entry){const midY=(low+stop)/2;panel('glow',left,right,low,midY-.045);panel('bronze',left,right,midY-.045,midY+.045);panel('glow',left,right,midY+.045,stop);}
              else panel(entry?'glow':'glass',left,right,low,stop);
              if(r<rows-1)panel('stone',left,right,high-.50,high);
            }
          }
        }else panel('stone',0,1,y0,y1);
        if(ribs && h===0 && l>8){
          // Small parapet teeth continue the raised flute crests.
          const angle=-Math.atan2(dz,dx);
          for(let j=0;j<fluteCount;j++){
            const mid=(j+.50)/fluteCount;
            if(mid*l<.30||(1-mid)*l<.30)continue;
            b.box('stone',at(mid,y1+.30,depth/2),[l/fluteCount*.34,.90,depth],angle);
          }
        }
      }
    }
  };
  prism(PLAN,0,SPEC.wallHeight,{top:'roof',windows:true,ribs:true});
  // All six square/octagonal tower shafts are anchored in the mapped temple corners.
  for(const t of TOWERS){
    const base=mapped(t.id),shaft=mapped(t.shaft),[x,z]=t.center,shoulder=t.moroni?46:44;
    prism(base,40,shoulder);
    prism(shaft,shoulder,t.cap-2);
    const angle=Math.PI/4;
    // Slender marble reeds form the crenellated shoulder around each gold tip.
    for(let j=0;j<8;j++){
      const a=j*Math.PI/4,rr=t.moroni?1.55:1.28,h=2+(j%2?.0:.65);
      b.box('stone',[x+rr*Math.cos(a),(t.cap-2)+h/2,z+rr*Math.sin(a)],[.34,h,.34],angle);
    }
    const plinth=new THREE.CylinderGeometry(t.moroni?1.3:1.1,t.moroni?1.5:1.28,2,8);
    plinth.rotateY(Math.PI/8);plinth.translate(x,t.cap-1,z);b.put(plinth,'stone');
    // Square gold-leaf spires: narrow flared foot, long taper, a pointed terminal.
    const height=t.top-t.cap;
    const points=[new THREE.Vector2(0,0),new THREE.Vector2(.74,0),new THREE.Vector2(.57,1.15),new THREE.Vector2(.36,height*.70),new THREE.Vector2(.025,height),new THREE.Vector2(0,height)];
    const spire=new THREE.LatheGeometry(points,near?8:4);spire.rotateY(Math.PI/8);spire.translate(x,t.cap,z);b.put(spire,'lamp');
    if(near){
      // Restrained cladding joints on the tower faces; sculptural white ribs stay in both LODs.
      for(const [i,a] of shaft.entries()){
        const c=shaft[(i+1)%shaft.length],dx=c[0]-a[0],dz=c[1]-a[1],l=Math.hypot(dx,dz),sign=Math.sign(signed(shaft)),nx=sign*dz/l,nz=-sign*dx/l;
        if(l<1)continue;
        b.box('stone',[(a[0]+c[0])/2+nx*.06,(shoulder+t.cap-2)/2,(a[1]+c[1])/2+nz*.06],[.12,t.cap-2-shoulder,.20],-Math.atan2(dz,dx));
      }
    }
    if(t.moroni){
      // Grouped robe, shoulders, head, bent arm and trumpet; a human silhouette, no traced mesh.
      const y=t.top;
      const robe=new THREE.CylinderGeometry(.44,.72,3.9,near?10:6);robe.translate(x,y+1.95,z);b.put(robe,'lamp');
      const chest=new THREE.SphereGeometry(.58,near?10:6,near?8:4);chest.scale(1,1.18,.73);chest.translate(x,y+3.95,z);b.put(chest,'lamp');
      const neck=new THREE.CylinderGeometry(.20,.23,.50,6);neck.translate(x,y+4.62,z);b.put(neck,'lamp');
      const head=new THREE.SphereGeometry(.37,near?10:6,near?8:4);head.scale(.86,1.12,1);head.translate(x,y+SPEC.statueHeight-.37*1.12,z);b.put(head,'lamp');
      b.bar('lamp',[x+.35,y+4.22,z],[x+.95,y+4.18,z],.25);
      b.bar('lamp',[x+.95,y+4.18,z],[x+1.03,y+4.90,z],.23);
      b.bar('lamp',[x+.15,y+4.93,z],[x+2.60,y+5.24,z],.16,.14);
      const horn=new THREE.ConeGeometry(.35,.42,near?8:4);horn.rotateZ(-Math.PI/2+.278);horn.translate(x+2.70,y+5.20,z);b.put(horn,'lamp');
      b.bar('lamp',[x-.43,y+4.10,z],[x-.64,y+3.00,z],.24);
      b.box('lamp',[x-.65,y+2.96,z-.12],[.40,.68,.33]);

    }
  }
  // The low north entrance pavilion: mapped polygon, upper ring and recessed courtyard.
  const lower=mapped(795280375),upper=mapped(844023409);
  prism(lower,0,4.5,{top:'roof',windows:true,entry:true});
  const court=[[-4.2,-46.0],[4.2,-46.0],[6.2,-50.0],[3.8,-54.4],[-3.8,-54.4],[-6.2,-50.0]];
  prism(upper,4.5,8.2,{top:'roof',holes:[court]});
  // Seven tall portico fins standing from grade through the front canopy.
  for(let j=0;j<7;j++)b.box('stone',[-4.65+j*1.55,4.1,-69.85],[.34,8.2,.64]);
  const link=LINK_RING.map(metric);prism(link,0,4.4,{top:'roof'});
  for(const [m,s]of skins)if(s.p.length)b.put(s.geometry(),m);
  const model=b.finish();
  model.traverse(o=>{if(!o.isMesh)return;if(o.material.name==='lamp'){o.material.roughness=.42;o.material.metalness=.40;}if(o.material.name==='glass')o.material.roughness=.45;});
  return model;
}
