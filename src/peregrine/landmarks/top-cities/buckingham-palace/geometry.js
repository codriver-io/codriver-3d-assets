import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PARTS, ANGLE, FRONT_ID, FRONT_CENTER as C } from './buckingham-palace-plan.js';

// Authoring u runs along the east facade toward its southeast end; +v is into the palace.
// Every mapped range is an independent solid: the principal court is empty in both LODs.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const box = (mat,x,y,z,w,h,d) => b.box(mat,[x,y,z],[w,h,d]);
  const poly = (mat,points) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));
    g.setIndex(points.slice(2).flatMap((_,i)=>[0,i+1,i+2]));g.computeVertexNormals();b.put(g,mat);
  };
  const cylinder = (mat,x,z,y0,y1,r,sides=near?8:5) => {
    const g = new THREE.CylinderGeometry(r,r,y1-y0,sides);g.translate(x,(y0+y1)/2,z);b.put(g,mat);
  };
  const frontV = u => {
    // Three projecting pedimented bays and the two recessed screens.
    if(u < -83.5) return -41.60;
    if(u < -53.05) return -40.20;
    if(u < -34.25) return -42.75;
    if(u < -2.75) return -40.55;
    return -42.08;
  };
  function inside([x,z],ring) {
    let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],c=ring[j];if((a[1]>z)!==(c[1]>z) && x<(c[0]-a[0])*(z-a[1])/(c[1]-a[1])+a[0])hit=!hit;}return hit;
  }
  function window(u,v,y,w,h,du=1,dv=0,mat='glass',dress=true) {
    // Outward normal on a clockwise wall edge is (dv,-du).
    const face=(mat,pts)=>poly(mat,pts.reverse());
    const push=0.35, nx=dv,nz=-du;
    if (PARTS.some(part=>part.height-1.5>y && [-w/2,0,w/2].some(t=>inside([u+du*t+nx*(push+.08),v+dv*t+nz*(push+.08)],part.ring)))) return;
    const p=(t,yy,offset)=>[u+du*t+nx*offset,yy,v+dv*t+nz*offset];
    face(mat,[p(-w/2,y,push),p(w/2,y,push),p(w/2,y+h,push),p(-w/2,y+h,push)]);
    if(dress && near) {
      const out=0.5,t=0.19;
      for(const side of [-1,1])face('trim',[p(side*w/2-t/2,y,out),p(side*w/2+t/2,y,out),p(side*w/2+t/2,y+h,out),p(side*w/2-t/2,y+h,out)]);
      for(const yy of [y,y+h])face('trim',[p(-w/2-t/2,yy-t/2,out),p(w/2+t/2,yy-t/2,out),p(w/2+t/2,yy+t/2,out),p(-w/2-t/2,yy+t/2,out)]);
      face('trim',[p(-.065,y,push+.22),p(.065,y,push+.22),p(.065,y+h,push+.22),p(-.065,y+h,push+.22)]);
      face('trim',[p(-w/2,y+h*.55-.06,push+.22),p(w/2,y+h*.55-.06,push+.22),p(w/2,y+h*.55+.06,push+.22),p(-w/2,y+h*.55+.06,push+.22)]);
    }
  }
  function solid(part) {
    let ring=part.ring;
    const area=ring.reduce((s,p,i)=>{const q=ring[(i+1)%ring.length];return s+p[0]*q[1]-q[0]*p[1]},0);
    if(area<0)ring=[...ring].reverse();
    const front=part.id===FRONT_ID;
    const top=front?20.8:part.height-1.5;
    const mat=front?'stone':'oldstone';
    const faces=THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),[]);
    // Triangulation is CCW in u/v. Reverse roof winding to point +Y.
    for(const tri of faces)poly(front?'stone':'roof',tri.slice().reverse().map(i=>[ring[i][0],top,ring[i][1]]));
    for(let i=0;i<ring.length;i++) {
      const [u,v]=ring[i],[u1,v1]=ring[(i+1)%ring.length];
      poly(mat,[[u,0,v],[u,top,v],[u1,top,v1],[u1,0,v1]]);
      const len=Math.hypot(u1-u,v1-v),du=(u1-u)/len,dv=(v1-v)/len;
      if(len<(part.id===1226905189?1.5:4))continue;
      // Hand-authored east-front rhythm below replaces this side only.
      const outerFront=front && (v+v1)/2<-35;
      if(!outerFront) {
        const count=Math.max(1,Math.floor(len/(near?3.8:5.0)));
        const rows=top>15?[[2.2,2.1],[8.2,3.4],[14.5,2.6]]:top>8?[[2.2,2.5],[7.8,2.0]]:[[1.4,2.2]];
        for(let n=0;n<count;n++)for(const [yy,h] of rows)if(yy+h<top-.5) {
          const t=(n+.5)/count;window(u+(u1-u)*t,v+(v1-v)*t,yy,part.id===1226905189?1.1:1.55,h,du,dv,'glass',near && part.height>=18);
        }
      }
      // Roof cap raised off walls; slim inset flat lead roof behind a continuous stone parapet.
      if(!front) {
        const normal=[dv,-du];
        poly('oldstone',[[u,top,v],[u1,top,v1],[u1,top+1.3,v1],[u,top+1.3,v]].reverse());
        // Parapet return has its own inward face and top, so no open shell at low rear views.
        const iu=u-normal[0]*.35,iv=v-normal[1]*.35,ju=u1-normal[0]*.35,jv=v1-normal[1]*.35;
        poly('oldstone',[[ju,top,jv],[iu,top,iv],[iu,top+1.3,iv],[ju,top+1.3,jv]].reverse());
        poly('oldstone',[[u,top+1.3,v],[u1,top+1.3,v1],[ju,top+1.3,jv],[iu,top+1.3,iv]].reverse());
      }
    }
  }
  for(const p of PARTS)solid(p);

  // The long Aston Webb east front: three rows, thirty-nine bays, giant paired order.
  const bays=39;
  for(let i=0;i<bays;i++) {
    const u=-95.4+i*2.73,v=frontV(u);
    for(const [y,h,w] of [[1.3,3.2,1.35],[8.0,4.0,1.55],[15.1,3.0,1.5]]) {
      window(u,v,y,w,h,1,0,(i%9===4 && y===8)?'glow':'glass');
      if(near && y===8 && Math.abs(u-C)>10) {
        // Alternating triangular and segmental first-floor crowns, carried
        // by solid jamb/sill surrounds. All project at least 0.15 m beyond glass.
        box('trim',u,y-.12,v-.47,w+.62,.32,.40);
        for(const side of [-1,1])box('trim',u+side*(w/2+.14),y+h/2,v-.47,.28,h+.3,.40);
        box('trim',u,y+h+.28,v-.52,w+.70,.28,.46);
        const crown=new THREE.Shape();crown.moveTo(-1.08,0);crown.lineTo(1.08,0);
        if(i%2===0)crown.lineTo(0,.68);
        else for(let j=1;j<8;j++){const a=j*Math.PI/8;crown.lineTo(1.08*Math.cos(a),.57*Math.sin(a));}
        crown.closePath();
        const g=new THREE.ExtrudeGeometry(crown,{depth:.35,steps:1,bevelEnabled:false,curveSegments:8});
        g.translate(u,y+h+.42,v-.74);b.put(g,'trim');
      }
    }
  }
  for(const [u0,u1,v] of [[-96.7,-83.6,-41.6],[-83.5,-53.1,-40.2],[-53.05,-34.25,-42.75],[-34.2,-2.8,-40.55],[-2.75,10.8,-42.08]]) {
    const w=u1-u0,mid=(u0+u1)/2;
    for(const [y,h,d] of [[.55,.6,.52],[5.65,.45,.65],[19.5,.65,.75],[20.75,.65,.95],[22.8,.32,.6]])box('trim',mid,y,v-.25,w,h,d);
    // Balustrade retains individual daylight gaps in the far LOD.
    const n=Math.floor(w/(near?.85:1.45));
    for(let i=0;i<n;i++)box('trim',u0+(i+.5)*w/n,21.9,v-.32,near?.22:.3,1.65,.36);
    for(const end of [u0+.15,u1-.15])box('trim',end,21.9,v-.32,.45,1.65,.48);
    for(let i=0;i<=Math.round(w/3.3);i++)box('trim',u0+i*w/Math.round(w/3.3),12.5,v-.35,.65,13.5,.62);
    if(near)for(let y=1.1;y<5.4;y+=.65)poly('oldstone',[[u0,y,v-.3],[u1,y,v-.3],[u1,y+.025,v-.3],[u0,y+.025,v-.3]].reverse());
  }
  // Pediments (including the central tympanum and a geometric heraldic relief).
  function pediment(u,width,v,base=21.35,tip=24) {
    const shape=new THREE.Shape();shape.moveTo(u-width/2,base);shape.lineTo(u+width/2,base);shape.lineTo(u,tip);shape.closePath();
    const g=new THREE.ExtrudeGeometry(shape,{depth:1.35,bevelEnabled:false,steps:1,curveSegments:1});g.translate(0,0,v-1.35);b.put(g,'stone');
    b.bar('trim',[u-width/2,base,v-1.52],[u,tip,v-1.52],.32,.36);
    b.bar('trim',[u,tip,v-1.52],[u+width/2,base,v-1.52],.32,.36);
    box('trim',u,base-.12,v-.7,width+.55,.42,1.55);
    if(near) {
      const shield=new THREE.SphereGeometry(.75,8,5);shield.scale(1,1.15,.25);shield.translate(u,base+.85,v-1.65);b.put(shield,'trim');
      // Small paired reclining heraldic supporters attached to the tympanum.
      for(const side of [-1,1]) {
        b.bar('trim',[u+side*.9,base+.55,v-1.57],[u+side*2.5,base+.7,v-1.57],.35,.35);
        const head=new THREE.SphereGeometry(.28,6,4);head.translate(u+side*1.2,base+1.1,v-1.58);b.put(head,'trim');
      }
    }
  }
  pediment(C,19.0,-42.75);pediment(-90.2,12.8,-41.6,21.1,23.6);pediment(4.0,12.8,-42.08,21.1,23.6);

  // Central portico: columns spring from the rusticated lower storey and carry the balcony slab.
  // Balcony is anchored to the wall; all columns contact base and entablature.
  for(const u of [C-8.4,C-5.6,C-2.8,C+2.8,C+5.6,C+8.4]) {
    box('trim',u,6.1,-43.55,1.05,.55,1.15);
    cylinder('trim',u,-43.55,6.35,19.0,.35);
    box('trim',u,19.1,-43.55,1.1,.45,1.2);
  }
  box('trim',C,6.45,-43.7,13.9,.55,2.25);
  box('trim',C,7.45,-44.62,13.9,.25,.3);
  for(let i=0;i<26;i++)box('trim',C-6.65+i*.532,7.0,-44.62,.19,.7,.22);
  box('trim',C,19.65,-43.5,19.4,.7,1.5);
  // Dark entrance arch is a surface inset in the rusticated gate bay; the three doors stay discrete.
  for(const du of [-5,0,5]) {
    const u=C+du,w=du===0?2.1:1.6,y=1.1,h=3.7,pts=[[u-w/2,y,-43.0],[u+w/2,y,-43.0]];
    const n=near?12:6;
    for(let i=0;i<=n;i++){const a=i*Math.PI/n;pts.push([u+Math.cos(a)*w/2,y+h+Math.sin(a)*w/2,-43.0]);}
    poly('metal',pts.reverse());
  }
  // Rooftop plinth and flagpole rise above the central pediment. Flag is deliberately neutral royal red.
  box('stone',C,23.65,-37.8,6.0,1.2,4.6);
  cylinder('metal',C,-37.8,24.25,33,.13,near?8:5);
  const flag=new THREE.BoxGeometry(3.8,1.7,.06);flag.translate(C+1.9,31.7,-37.8);b.put(flag,'flag');

  // Garden front's curved Music Room bay: its mapped circular part is retained as a polygonal solid.
  const dome=new THREE.SphereGeometry(7.0,near?20:12,near?6:3,0,Math.PI*2,0,Math.PI/2);dome.scale(1,.32,1);dome.translate(-42.75,19.5,78.1);b.put(dome,'roof');
  // Rear projecting pilasters and rooftop chimney groups articulate the older Nash wings.
  for(const u of [-64,-60,-54,-32,-26,-21])box('oldstone',u,12.0,79.2,.7,12,1.1);
  for(const [u,v,h] of [[-83,49,24],[-65,63,24],[-18,63,24],[31,58,24],[-83,-10,18],[-7,46,18]]) {
    box('oldstone',u,h-.5,v,3.1,1.0,2.2);
    box('oldstone',u,h+.5,v,2.5,1.0,1.65);
    if(near)for(const dx of [-.8,0,.8])cylinder('roof',u+dx,v,h+1,h+1.5,.18,6);
  }

  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){const old=o.geometry;o.geometry=mergeVertices(old,1e-4);old.dispose();o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(ANGLE);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  return root;
}
