import * as THREE from 'three';
import { SPEC } from './config.js';

// Work in a church frame: u along the eastward nave, v across it to the south.
const A = SPEC.axisDegrees * Math.PI / 180;
export const point = (u, y, v) => [u * Math.cos(A) + v * Math.sin(A), y, -u * Math.sin(A) + v * Math.cos(A)];
export function parts(b, detail) {
  const near = detail === 'near';
  const put = (g, m) => { g.rotateY(A); b.put(g, m); };
  const box = (m, u, y, v, l, h, w) => {
    const g = new THREE.BoxGeometry(l, h, w); g.translate(u, y, v); put(g, m);
  };
  const bar = (m, a, c, w, d = w) => b.bar(m, point(...a), point(...c), w, d);
  function faces(m, vertices, indices) {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(vertices.flat(), 3));
    const good=[]; for(let i=0;i<indices.length;i+=3){const [a,c,d]=indices.slice(i,i+3).map(j=>new THREE.Vector3(...vertices[j]));if(c.sub(a).cross(d.sub(a)).lengthSq()>1e-12)good.push(...indices.slice(i,i+3));}
    g.setIndex(good); g.computeVertexNormals(); put(g, m);
  }
  // A closed thin roof panel. Orient upper normals toward the sky, also for tapered hips.
  function panel(a, c, d, e, tiles = true) {
    const top = [a,c,d,e], low = top.map(p => [p[0],p[1]-.10,p[2]]);
    let idx = [0,1,2,0,2,3];
    const n = new THREE.Vector3().subVectors(new THREE.Vector3(...c),new THREE.Vector3(...a)).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...d),new THREE.Vector3(...a)));
    if(n.lengthSq()<1e-12)n.subVectors(new THREE.Vector3(...d),new THREE.Vector3(...a)).cross(new THREE.Vector3().subVectors(new THREE.Vector3(...e),new THREE.Vector3(...a)));
    if (n.y < 0) idx = [0,2,1,0,3,2];
    const bottom = idx.map((v,i) => idx[Math.floor(i/3)*3 + (2-i%3)] + 4);
    const sides = [];
    for(let i=0;i<4;i++){const j=(i+1)%4; sides.push(i,j,j+4,i,j+4,i+4);}
    // Side winding follows the top perimeter.
    if(n.y>=0) for(let i=0;i<sides.length;i+=3) [sides[i+1],sides[i+2]]=[sides[i+2],sides[i+1]];
    faces('roof',[...top,...low],[...idx,...bottom,...sides]);
    if(!tiles) return;
    // Scale-shaped wooden shingles, staggered in courses, each a face plus an exposed toe.
    const lerp = (p,q,t) => p.map((x,i)=>x+(q[i]-x)*t);
    const outward=n.clone().normalize();if(outward.y<0)outward.negate(); const at = (s,t,lift=.065) => {const p=lerp(lerp(a,e,t),lerp(c,d,t),s);p[0]+=outward.x*lift;p[1]+=outward.y*lift;p[2]+=outward.z*lift;return p;};
    const fall = Math.max(new THREE.Vector3(...a).distanceTo(new THREE.Vector3(...e)),new THREE.Vector3(...c).distanceTo(new THREE.Vector3(...d)));
    const rows=Math.max(1,Math.ceil(fall/(near?.50:1.8)));
    for(let r=0;r<rows;r++) {
      const t=r/rows, t1=Math.min(1,(r+1)/rows), tm=t+(t1-t)*.77;
      const l=lerp(a,e,t),right=lerp(c,d,t);
      const cols=Math.max(1,Math.ceil(new THREE.Vector3(...l).distanceTo(new THREE.Vector3(...right))/(near?.46:1.8)));
      for(let k=0;k<cols;k++) {
        const offset=(r%2)*.5; const s0=Math.max(0,(k-offset+.035)/cols),s1=Math.min(1,(k-offset+.965)/cols),sm=(s0+s1)/2;
        const poly=[at(s0,t,-.025),at(s1,t,-.025),at(s1,tm),at(sm,t1),at(s0,tm)];
        let ind=[0,1,2,0,2,3,0,3,4];
        if(n.y<0) for(let i=0;i<ind.length;i+=3) [ind[i+1],ind[i+2]]=[ind[i+2],ind[i+1]];
        const m=(r+k)%5===0?'roof':'shingle';
        faces(m,poly,ind);
        // Closed exposed toe and sides, rooted inside the backing roof (no floating tiles).
        const foot=[at(s0,t,-.025),at(s1,t,-.025),at(s1,tm,-.025),at(sm,t1,-.025),at(s0,tm,-.025)];
        const cap=[];for(let j=0;j<5;j++){const k=(j+1)%5;cap.push(j,k,k+5,j,k+5,j+5);}
        if(n.y>=0)for(let j=0;j<cap.length;j+=3)[cap[j+1],cap[j+2]]=[cap[j+2],cap[j+1]];
        faces(m,[...poly,...foot],cap);
      }
    }
  }
  function gable(u0,u1,v,w,eave,ridge) {
    panel([u0,ridge,v],[u1,ridge,v],[u1,eave,v+w/2],[u0,eave,v+w/2]);
    panel([u1,ridge,v],[u0,ridge,v],[u0,eave,v-w/2],[u1,eave,v-w/2]);
    for(const u of [u0+.12,u1-.12]) {
      faces('timber',[[u,eave-.1,v-w/2+.10],[u,eave-.1,v+w/2-.10],[u,ridge-.15,v]],u===u0+.12?[0,1,2]:[2,1,0]);
      bar('trim',[u,eave-.02,v-w/2],[u,ridge+.02,v],.16);
      bar('trim',[u,ridge+.02,v],[u,eave-.02,v+w/2],.16);
    }
    bar('trim',[u0-.04,ridge+.08,v],[u1+.04,ridge+.08,v],.18,.21);
  }
  function hip(u0,u1,vi,uo0,uo1,vo,high,low) {
    panel([u0,high,-vi],[u1,high,-vi],[uo1,low,-vo],[uo0,low,-vo]);
    panel([u1,high,vi],[u0,high,vi],[uo0,low,vo],[uo1,low,vo]);
    panel([u0,high,vi],[u0,high,-vi],[uo0,low,-vo],[uo0,low,vo]);
    panel([u1,high,-vi],[u1,high,vi],[uo1,low,vo],[uo1,low,-vo]);
    for(const s of [-1,1])bar('trim',[uo0,low-.04,s*vo],[uo1,low-.04,s*vo],.13);
  }
  function wall(a,c,y0,y1,planks=true) {
    const du=c[0]-a[0],dv=c[1]-a[1],len=Math.hypot(du,dv),ang=-Math.atan2(dv,du);
    const g=new THREE.BoxGeometry(len,y1-y0,.14);g.rotateY(ang);g.translate((a[0]+c[0])/2,(y0+y1)/2,(a[1]+c[1])/2);put(g,'timber');
    if(planks && near) {
      const count=Math.ceil(len/(near?.22:.7));
      for(let i=0;i<=count;i++){
        const t=i/count,u=a[0]+du*t,v=a[1]+dv*t;
        bar('worn',[u,y0+.035,v],[u,y1-.035,v],.045,.32);
      }
    }
    bar('trim',[...a.slice(0,1),y0,a[1]],[c[0],y0,c[1]],.16);
    bar('trim',[a[0],y1,a[1]],[c[0],y1,c[1]],.16);
  }
  function gallery(a,c,entrance=false) {
    const len=Math.hypot(c[0]-a[0],c[1]-a[1]),n=Math.max(1,Math.round(len/1.0));
    wall(a,c,.24,1.82);
    for(let i=0;i<=n;i++){
      const t=i/n,u=a[0]+(c[0]-a[0])*t,v=a[1]+(c[1]-a[1])*t;
      bar('trim',[u,.24,v],[u,2.45,v],.16,.18);
      if(near && i<n) {
        const t2=(i+.28)/n,u2=a[0]+(c[0]-a[0])*t2,v2=a[1]+(c[1]-a[1])*t2;
        bar('worn',[u,2.05,v],[u2,2.42,v2],.09);
      }
    }
    bar('trim',[a[0],2.44,a[1]],[c[0],2.44,c[1]],.2);
  }
  function dragon(u,y,v,sign=1,scale=1) {
    // Original stylized pierced carving: rising neck, crest, snout, open jaw and eye.
    const shape=new THREE.Shape();
    const outline=[[-.25,0],[.20,.06],[.42,.63],[.28,1.15],[.40,1.38],[.76,1.46],[1.39,1.85],[1.48,2.10],[1.30,2.12],[1.18,1.90],[.67,1.73],[.38,1.70],[.26,1.91],[.13,2.15],[-.02,2.19],[.00,1.63],[-.30,1.15],[-.36,.52]];
    outline.forEach(([x,z],i)=>i?shape.lineTo(x*scale,z*scale):shape.moveTo(x*scale,z*scale));shape.closePath();
    if(near){const eye=new THREE.Path();eye.absellipse(.36*scale,1.55*scale,.08*scale,.08*scale,0,Math.PI*2,true);shape.holes.push(eye);}
    const g=new THREE.ExtrudeGeometry(shape,{depth:.14*scale,bevelEnabled:false,curveSegments:near?6:3});
    g.translate(0,0,-.07*scale);g.scale(sign,1,1);if(sign<0){const idx=g.index; if(idx)for(let i=0;i<idx.count;i+=3){const a=idx.getX(i+1);idx.setX(i+1,idx.getX(i+2));idx.setX(i+2,a);}else{const p=g.attributes.position;for(let i=0;i<p.count;i+=3){const q=new THREE.Vector3().fromBufferAttribute(p,i+1);p.setXYZ(i+1,p.getX(i+2),p.getY(i+2),p.getZ(i+2));p.setXYZ(i+2,q.x,q.y,q.z);}g.computeVertexNormals();}}
    g.translate(u,y,v);put(g,'trim');
    if(near)for(let j=0;j<4;j++)bar('worn',[u+sign*(-.23+j*.13)*scale,y+(.35+j*.21)*scale,v+.09*scale],[u+sign*(.20+j*.035)*scale,y+(.40+j*.21)*scale,v+.09*scale],.045);
  }
  return { put,box,bar,faces,panel,gable,hip,wall,gallery,dragon };
}
