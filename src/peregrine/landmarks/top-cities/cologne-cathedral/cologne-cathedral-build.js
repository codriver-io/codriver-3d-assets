import * as THREE from 'three';
import { VC, TOWERS, BAYS, CROSSING } from './cologne-cathedral-plan.js';
import { pointed } from './cologne-cathedral-parts.js';

// Flying arches terminate in these named, solid pier/clerestory supports.
export const BUTTRESSES = BAYS.flatMap(u => [-1,1].map(side => ({
  name: `flying-${u}-${side}`, u, side,
  outer: VC + side * 21.8, inner: VC + side * 7.7,
  terminals: [[u,29,VC+side*21.8],[u,42.6,VC+side*7.7]],
})));
function buildFlying(k, p) {
  const {u,outer,inner}=p;
  k.box('stone',[u,15.5,outer],[1.75,31,2.2]);
  k.box('stone',[u,35,inner],[1.65,24,1.7]);
  k.pinnacle(u,outer,31,40,0.65);
  const n=k.near?6:3;
  // The arched lower edge rises to the high wall; both ends penetrate masonry.
  for (const base of (k.near?[29,22]:[29])) {
    const pts=[];
    for(let i=0;i<=n;i++) {
      const t=i/n;
      pts.push([u,base+13.6*Math.sin(t*Math.PI/2),outer+(inner-outer)*t]);
    }
    for(let i=0;i<n;i++) k.bar('stone',pts[i],pts[i+1],k.near?0.85:1.1,1.4);
  }
}
function tower(k,{u,v,tip}) {
  const half=8.7, west=u-half, east=u+half;
  for(const side of [-1,1]) {
    const x=v<VC?-84.9:-84.2,depth=v<VC?(side<0?4.8:2.6):4.1;
    if ((v<VC&&side<0)||(v>VC&&side>0)) k.box('stone',[x,11,v+side*7.4],[depth,22,1.6]);
    k.box('stone',[west-0.25,34.5,v+side*7.4],[1.5,25,1.2]);
  }
  const tiers=[{y:21,h:23,w:6.1},{y:48,h:19.8,w:5.7}];
  for(const face of ['W','E','N','S']) {
    const plane=face==='W'?west:face==='E'?east:face==='N'?v-half:v+half;
    const a=face==='W'||face==='E'?v:u;
    const holes=tiers.flatMap(t=>[-1,1].map(side=>({...t,x:side*4.1,mullions:true})));
    // Window widths fit within the paired bays; pointed openings are not painted rectangles.
    if(face==='W') holes.push({x:0,y:1.5,h:14,w:6.3,mat:'recess',mullions:false});
    k.wall(face,a,plane,17.4,71,holes);
    for(const t of tiers) for(const side of [-1,1]) k.arch(face,a+side*4.1,t.y,plane,t.w+0.85,t.h+0.6,0.38);
    if(face==='W') {
      k.arch(face,a,1.5,plane-0.5,9,19,0.55);
      for(const [w,h,depth] of (k.near?[[7.8,17.9,0.75],[10.5,20.1,0.3]]:[[10.5,20.1,0.3]])) k.arch(face,a,1.5,plane-depth,w,h,0.3);
      // Narrow paired shafts and blind pointed tracery break the spandrels.
      for(const offset of (k.near?[-6.9,-1.0,1.0,6.9]:[-6.9,6.9])) {
        k.box('stone',[plane-0.3,36,a+offset],[0.6,70,0.38]);
      }
      for(const y of [17.5,45.5]) for(const side of [-1,1]) {
        k.arch(face,a+side*4.1,y,plane-0.26,5.4,3.9,0.22);
      }
      k.gableFrame(face,a,14,plane-0.85,11,12.5);
      for(const side of [-1,1]) {
        k.gableFrame(face,a+side*4.1,43.9,plane-0.22,7.0,6.8);
        k.gableFrame(face,a+side*4.1,67.8,plane-0.22,7.0,7.2);
      }
      // West-front shafts, tiny figure groups and canopies are attached to the wall.
      for(const offset of [-7.9,0,7.9]) {
        k.box('stone',[plane-0.24,36.5,a+offset],[0.8,70,0.65]);
        k.pinnacle(plane-0.15,a+offset,69,81,0.45);
        for(const y of (k.near?[8,16,29,37,53,61]:[16,53])) {
          k.box('stone',[plane-0.5,y,a+offset],[1.0,0.45,1.1]);
          k.cylinder(plane-0.65,a+offset,y+0.1,y+(k.near?1.6:1.95),0.23,0.29,'stone',4);
          if(k.near)k.cylinder(plane-0.65,a+offset,y+1.45,y+1.95,0.24,0.24,'stone',4);
          k.gableFrame(face,a+offset,y+2.2,plane-0.38,1.65,1.3);
        }
      }
    } else {
      for(const offset of [-7.9,0,7.9]) {
        const p=k.fp(face,a+offset,36,plane+(face==='N'?-0.2:0.2));
        k.bar('stone',[p[0],0,p[2]],[p[0],71,p[2]],0.65);
      }
    }
  }
  k.box('stone',[u,70.8,v],[17.5,0.8,17.5]);
  // Stepped corner buttresses and repeated vertical ribs support galleries/pinnacles.
  for(const dx of [-1,1]) for(const dz of [-1,1]) {
    const x=u+dx*8.3,z=v+dz*8.3;
    for(const [y0,y1,w] of [[0,22,2.7],[22,47,2.2],[47,72,1.6]]) k.box('stone',[x,(y0+y1)/2,z],[w,y1-y0,w]);
    k.pinnacle(x,z,72,91,0.75);
  }
  for(const y of [20.5,47,70.5]) k.box('stone',[u,y,v],[18.3,0.75,18.3]);
  // Octagonal masonry belfry: pointed openings occupy tall recessed bays,
  // with real spandrels, parapets and piers instead of a skeletal cage.
  const r=8.6, apothem=r*Math.cos(Math.PI/8), width=2*r*Math.sin(Math.PI/8);
  for(let i=0;i<8;i++) {
    const angle=(i+0.5)*Math.PI/4;
    const shape=new THREE.Shape([
      new THREE.Vector2(-width/2,0),new THREE.Vector2(width/2,0),
      new THREE.Vector2(width/2,26),new THREE.Vector2(-width/2,26),
    ]);
    shape.holes.push(new THREE.Path(pointed(width*0.63,20,k.near?4:2).map(([x,y])=>new THREE.Vector2(x,y+2)).reverse()));
    const panel=k.near?new THREE.ExtrudeGeometry(shape,{depth:0.3,bevelEnabled:false,curveSegments:1}):new THREE.ShapeGeometry(shape);
    if(k.near)panel.translate(0,0,-0.3);
    // Both sides of the pierced stone are visible through the opposing opening.
    const reverse=panel.clone();
    for(let j=0;j<(reverse.index?.count||0);j+=3) {
      const t=reverse.index.getX(j+1);reverse.index.setX(j+1,reverse.index.getX(j+2));reverse.index.setX(j+2,t);
    }
    for(const g of (k.near?[panel]:[panel,reverse])) {
      g.rotateY(Math.PI/2-angle);g.translate(u+apothem*Math.cos(angle),71,v+apothem*Math.sin(angle));k.put(g);
    }
    const p=[u+r*Math.cos(i*Math.PI/4),71,v+r*Math.sin(i*Math.PI/4)];
    k.bar('stone',p,[p[0],97,p[2]],1.05,1.05);
    k.pinnacle(p[0],p[2],94,108,0.5);
    // Two lancet mullions share the sill and meet the pointed head.
    for(const offset of [-1,1]) {
      const x=offset*width*0.105;
      const pos=(y)=>[u+apothem*Math.cos(angle)+x*Math.sin(angle),y,v+apothem*Math.sin(angle)-x*Math.cos(angle)];
      k.bar('stone',pos(72.9),pos(93.25),k.near?0.3:0.4);
    }
  }
  // Repeated pierced Gothic panels taper continuously to the tips. Each
  // course has a pointed opening; no crossed transmission-mast diagonals.
  const y0=97,y1=tip-1.6,rows=k.near?14:9;
  const radius=y=>8.25*Math.pow(Math.max(0,(y1-y)/(y1-y0)),1.15)+0.12;
  for(let j=0;j<rows;j++) {
    const ya=y0+(y1-y0)*j/rows,yb=y0+(y1-y0)*(j+1)/rows;
    const ra=radius(ya),rb=radius(yb),wa=2*ra*Math.sin(Math.PI/8),wb=2*rb*Math.sin(Math.PI/8),h=yb-ya;
    const shape=new THREE.Shape([
      new THREE.Vector2(-wa/2,0),new THREE.Vector2(wa/2,0),
      new THREE.Vector2(wb/2,h),new THREE.Vector2(-wb/2,h),
    ]);
    if(j<rows-1) {
      // Map a pointed lancet to the tapered face, leaving continuous masonry
      // around the base, shoulders and crest; far retains the same rhythm.
      const pts=pointed(0.64,h*0.78,k.near?3:1).map(([x,y])=>{
        const yy=y+h*0.1;return new THREE.Vector2(x*(wa+(wb-wa)*yy/h),yy);
      });
      shape.holes.push(new THREE.Path(pts.reverse()));
    }
    const template=k.near?new THREE.ExtrudeGeometry(shape,{depth:0.14,bevelEnabled:false,curveSegments:1}):new THREE.ShapeGeometry(shape);
    if(k.near)template.translate(0,0,-0.14);
    for(let i=0;i<8;i++) {
      const angle=(i+0.5)*Math.PI/4,g=template.clone(),p=g.attributes.position;
      for(let vtx=0;vtx<p.count;vtx++) {
        const x=p.getX(vtx),dy=p.getY(vtx),rr=(ra+(rb-ra)*dy/h)*Math.cos(Math.PI/8)+p.getZ(vtx);
        p.setXYZ(vtx,u+rr*Math.cos(angle)+x*Math.sin(angle),ya+dy,v+rr*Math.sin(angle)-x*Math.cos(angle));
      }
      const back=g.clone();
      for(let n=0;n<(back.index?.count||0);n+=3) {
        const t=back.index.getX(n+1);back.index.setX(n+1,back.index.getX(n+2));back.index.setX(n+2,t);
      }
      k.put(g);if(k.near)back.dispose();else k.put(back);
      if(k.near&&j<11) {
        const a=i*Math.PI/4;
        k.box('stone',[u+ra*Math.cos(a),ya+0.12,v+ra*Math.sin(a)],[0.75,0.5,0.75]);
      }
    }
    template.dispose();
  }
  k.cone(u,v,y1-0.3,tip,0.35);
}
function westScreen(k) {
  const u=-83.3,a=VC;
  k.wall('W',a,u,16.4,45,[{y:2,w:8.3,h:18,mat:'recess',mullions:false},{y:24,w:10.2,h:18.8}]);
  k.arch('W',a,2,u-0.38,11.2,21,0.65);
  k.arch('W',a,24,u-0.25,11.3,20,0.48);
  k.gableFrame('W',a,17,u-0.8,13.6,15);
  const tri=new THREE.Shape([new THREE.Vector2(-8.2,0),new THREE.Vector2(8.2,0),new THREE.Vector2(0,18)]);
  k.put(k.place(new THREE.ExtrudeGeometry(tri,{depth:1.3,bevelEnabled:false}),'W',a,45,u,1.3));
  k.gableFrame('W',a,45,u-0.35,16.4,18);
  k.pinnacle(u,a,62,68,0.48);
  // Pointed canopy rows and grouped stone human silhouettes, not portrait sculpture.
  const rows=k.near?[21.3,44.8]:[21.3];
  for(const y of rows) for(let j=-2;j<=2;j++) {
    const v=a+j*2.7;
    k.box('stone',[u-0.45,y,v],[1.0,0.5,1.25]);
    k.cylinder(u-0.6,v,y+0.15,y+(k.near?1.8:2.25),0.25,0.35,'stone',4);
    if(k.near)k.cylinder(u-0.6,v,y+1.7,y+2.25,0.27,0.27,'stone',6);
    k.gableFrame('W',v,y+2.3,u-0.35,2.25,1.8);
  }
}
function transept(k) {
  const u0=-24.3,u1=6.9,mid=-8.8;
  for(const [side,plane] of [[-1,-29.8],[1,46.8]]) {
    const face=side<0?'N':'S';
    const holes=[{x:0,y:2,w:7.5,h:15,mat:'recess',mullions:false},{x:0,y:25,w:13.6,h:20.3},...[-1,1].map(s=>({x:s*13.1,y:6,w:6,h:13}))];
    k.wall(face,mid,plane,32.4,46,holes.map(h=>h.x?{...h,x:Math.sign(h.x)*12.3,w:5.3}:h));
    k.arch(face,mid,25,plane+side*0.25,15,21,0.5);
    k.gableFrame(face,mid,46,plane+side*0.3,16.4,23.2);
    k.arch(face,mid,2,plane+side*0.45,10.2,19,0.55);
    for(const [w,h,d] of (k.near?[[8.9,18,0.75],[11.8,20.3,0.25]]:[[11.8,20.3,0.25]])) k.arch(face,mid,2,plane+side*d,w,h,0.3);
    for(const offset of [-8.5,8.5]) {
      k.box('stone',[mid+offset,23,plane+side*0.4],[1.25,46,1.3]);
      k.pinnacle(mid+offset,plane+side*0.4,45.5,58,0.42);
    }
    for(const offset of (k.near?[-5.8,-2.9,0,2.9,5.8]:[-4.5,0,4.5])) {
      const height=18-Math.abs(offset)*1.8;
      k.bar('stone',k.fp(face,mid+offset,46,plane+side*0.32),k.fp(face,mid+offset,46+height,plane+side*0.32),k.near?0.28:0.38);
    }
    k.gableFrame(face,mid,16,plane+side*0.6,13,14);
    const tri=new THREE.Shape([new THREE.Vector2(-8.2,0),new THREE.Vector2(8.2,0),new THREE.Vector2(0,23.2)]);
    k.put(k.place(new THREE.ExtrudeGeometry(tri,{depth:1,bevelEnabled:false}),face,mid,46,plane,1));
    for(const dx of [-1,1]) {
      k.box('stone',[mid+dx*14.2,23.5,plane-side*0.7],[2.2,47,2.2]);
      k.pinnacle(mid+dx*14.2,plane-side*0.7,47,64,0.65);
      k.pinnacle(mid+dx*8.0,plane-side*0.1,46,59,0.5);
    }
    k.pinnacle(mid,plane-side*0.3,68.5,69.95,0.2);
    k.gable(side<0?-29.2:16.4,side<0?1.0:46.2,-16.1,-1.3,46,61.1,true);
    for(const face2 of ['W','E']) {
      const p=face2==='W'?u0:u1;
      const centers=side<0?[-24,-16,-7]:[24,33,42];
      for(const v of centers) {
        k.wall(face2,v,p,8.8,20,[{y:5,w:5.6,h:13}]);
        const inner=face2==='W'?-16.1:-1.3;
        k.wall(face2,v,inner,8.8,26,[{y:9,w:5.5,h:15}],20);
        k.box('stone',[p+(face2==='W'?-0.2:0.2),15.5,v-4.4],[1.4,31,1.4]);
        k.pinnacle(p,v-4.4,31,42,0.5);
        k.bar('stone',[p,29,v-4.4],[inner,43,v-4.4],0.9,1.1);
      }
    }
    k.gable(side<0?-29.2:16.4,side<0?1.0:46.2,u0,u0+11.3,20,26,true);
    k.gable(side<0?-29.2:16.4,side<0?1.0:46.2,u1-11.3,u1,20,26,true);
  }
  const c=CROSSING;
  k.cylinder(c.u,c.v,60,75,3.8,3.5,'roof');
  for(let i=0;i<8;i++) {
    const a=i*Math.PI/4; const x=c.u+3.2*Math.cos(a),z=c.v+3.2*Math.sin(a);
    k.bar('roof',[x,74,z],[x,82,z],0.45);
    k.bar('roof',[x,82,z],[c.u,c.tip-1,c.v],0.38);
  }
  k.cone(c.u,c.v,81,c.tip-0.8,2.5,'roof',8);
  k.cone(c.u,c.v,c.tip-1,c.tip,0.2,'roof');
}
function nave(k) {
  const u0=-65.3,u1=29;
  for(const [face,v] of [['N',VC-7.4],['S',VC+7.4]]) {
    const centers=[-60,-52,-44,-36,-28,-20,-12,-4,4,12,20,27];
    const west=-83.3,center=(west+u1)/2;
    k.wall(face,center,v,u1-west,46,[-77,-69,...centers].map(u=>({x:u-center,y:28,w:u===27?3.3:5.8,h:15.8})));
  }
  // Roof end sits behind the raised west screen, avoiding its coplanar face.
  k.gable(-82.7,u1,VC-7.4,VC+7.4,46,61.1);
  // Double side aisles retain separate bay windows in the far model.
  for(const [face,v] of [['N',-12.8],['S',29.5]]) {
    const centers=[-60,-52,-44,-36,-28,-20,-12,-4,4,12,20,26];
    k.wall(face,(u0+u1)/2,v,u1-u0,20,centers.map(u=>({x:u-(u0+u1)/2,y:3,w:u===26?3.6:5.7,h:14.5})));
    for(const u of centers) k.arch(face,u,3,v,6.3,15,0.3);
    const va=face==='N'?v:VC+7.4,vb=face==='N'?VC-7.4:v;
    k.gable(u0,u1,va,vb,20,26);
  }
  k.wall('W',VC,-65.3,42.3,20);
  k.wall('E',VC,29,42.3,20,[{y:3,w:6,h:14}]);
  for(const p of BUTTRESSES) buildFlying(k,p);
}
function choir(k) {
  // Polygonal ambulatory and a seven-sector chapel crown around the eastern half-apse.
  const u=29.0,v=VC,n=7;
  for(let i=0;i<n;i++) {
    const a=-Math.PI/2+i*Math.PI/n,aa=a+Math.PI/n,mid=(a+aa)/2;
    const r=22.9,x=u+r*Math.cos(mid),z=v+r*Math.sin(mid),width=2*r*Math.sin(Math.PI/n/2);
    const wall=new THREE.Shape([new THREE.Vector2(-width/2,0),new THREE.Vector2(width/2,0),new THREE.Vector2(width/2,20),new THREE.Vector2(-width/2,20)]);
    const hp=new THREE.Path();const pts=[[-2.6,3],[2.6,3],[2.6,14],[0,18],[-2.6,14]];hp.setFromPoints(pts.map(p=>new THREE.Vector2(...p)));wall.holes.push(hp);
    const g=new THREE.ExtrudeGeometry(wall,{depth:1.2,bevelEnabled:false});g.translate(0,0,-1.2);g.rotateY(Math.PI/2-mid);g.translate(x,0,z);k.put(g);
    const glass=new THREE.ShapeGeometry(new THREE.Shape(pts.map(p=>new THREE.Vector2(...p))));glass.translate(0,0,-0.7);glass.rotateY(Math.PI/2-mid);glass.translate(x,0,z);k.put(glass,'glass');
    const cx=u+22.5*Math.cos(a),cz=v+22.5*Math.sin(a);
    k.box('stone',[cx,15,cz],[1.6,30,1.6]);k.pinnacle(cx,cz,30,41,0.6);
    k.bar('stone',[cx,29,cz],[u+7.6*Math.cos(a),42.6,v+7.6*Math.sin(a)],1.0,1.4);
    k.cone(x,z,19.8,26,2.3,'roof',4);
    const rp=(angle,radius,y)=>[u+radius*Math.cos(angle),y,v+radius*Math.sin(angle)];
    const roof=new THREE.BufferGeometry();
    roof.setAttribute('position',new THREE.Float32BufferAttribute([rp(a,22.9,20),rp(a,7.5,26),rp(aa,7.5,26),rp(aa,22.9,20)].flat(),3));
    roof.setIndex([0,1,2,0,2,3]);k.put(roof,'roof');
  }
  // High polygonal choir walls and hip roof meeting the nave ridge.
  for(let i=0;i<n;i++) {
    const a=-Math.PI/2+i*Math.PI/n,aa=a+Math.PI/n,mid=(a+aa)/2,r=7.5;
    const x=u+r*Math.cos(mid),z=v+r*Math.sin(mid),w=2*r*Math.sin(Math.PI/n/2)+0.1;
    const outer=new THREE.Shape([new THREE.Vector2(-w/2,0),new THREE.Vector2(w/2,0),new THREE.Vector2(w/2,46),new THREE.Vector2(-w/2,46)]);
    const opening=pointed(2.0,16,k.seg).map(([px,py])=>new THREE.Vector2(px,py+28));
    outer.holes.push(new THREE.Path(opening.slice().reverse()));
    const g=k.near?new THREE.ExtrudeGeometry(outer,{depth:0.9,bevelEnabled:false}):new THREE.ShapeGeometry(outer);
    if(k.near)g.translate(0,0,-0.9);
    g.rotateY(Math.PI/2-mid);g.translate(x,0,z);k.put(g);
    const gl=new THREE.ShapeGeometry(new THREE.Shape(opening));
    gl.translate(0,0,-0.68);gl.rotateY(Math.PI/2-mid);gl.translate(x,0,z);k.put(gl,'glass');
    k.bar('stone',[u+7.6*Math.cos(a),26,v+7.6*Math.sin(a)],[u+7.6*Math.cos(a),46.4,v+7.6*Math.sin(a)],0.65);
  }
  k.cone(u,v,46,61.1,7.8,'roof',14);
  // East axial buttress reaches the mapped outer tip; its flying arch is seated in the choir wall.
  k.box('stone',[53.3,14,VC],[6.7,28,2.2]);
  k.pinnacle(55.5,VC,28,41,0.65);
  k.bar('stone',[55.5,27,VC],[36.6,42.6,VC],1.0,1.4);
  // Compact north sacristy, inside its separate mapped provider ring.
  k.box('stone',[22,6,-24.8],[24,12,10.8]);
  k.gable(10,34,-30.2,-19.4,12,19);
  k.box('stone',[29.8,5,-33],[10,10,9.0]);k.gable(24.8,34.8,-37.5,-28.5,10,17);
}
export function build(k) {
  nave(k);choir(k);transept(k);westScreen(k);
  for(const p of TOWERS) tower(k,p);
}
