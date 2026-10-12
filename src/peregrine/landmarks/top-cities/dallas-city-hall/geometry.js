import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { Surface, THETA, L, ROOF, FRONT } from './dallas-city-hall-parts.js';

/** Original texture-free authoring. u is the 75-degree long axis; v faces south.
 * The north plane leans towards the plaza. The two end walls are triangular
 * wedges, while the south end bays expand in discrete cantilevered storeys.
 * Glass replaces facade surfaces rather than sitting over a backing wall.
 */
export function create({ detail='near' }={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const soups=new Map();
  const S=m=>{ if(!soups.has(m))soups.set(m,new Surface());return soups.get(m); };
  const put=(g,m)=>{g.rotateY(THETA);b.put(g,m);};
  const box=(m,p,size)=>{const g=new THREE.BoxGeometry(...size);g.translate(...p);put(g,m);};
  const face=(m,u0,u1,y0,y1,v0,v1,n)=>S(m).quad([u0,y0,v0],[u1,y0,v0],[u1,y1,v1],[u0,y1,v1],n);
  const horizontal=(m,u0,u1,v0,v1,y,up=1)=>S(m).quad([u0,y,v0],[u1,y,v0],[u1,y,v1],[u0,y,v1],[0,up,0]);
  const cylinder=(m,u,v,r,y0,y1,seg)=>{const g=new THREE.CylinderGeometry(r,r,y1-y0,seg,1,false);g.translate(u,(y0+y1)/2,v);put(g,m);};
  // Eight height breaks keep seven glazed office rows and the roof fascia.
  const rows=[[0.18,4.65],[6.15,9.05],[10.55,13.45],[14.95,17.85],[19.35,22.25],[23.75,26.65],[28.15,31.05]];
  const inner=L-12.8, bays=6, bw=inner*2/bays;
  let prev=0;
  const band=(a,c)=>{
    face('concrete',-inner,inner,a,c,FRONT(a),FRONT(c),[0,-0.56,-0.83]);
  };
  for(let row=0;row<rows.length;row++) {
    const [a,c]=rows[row];band(prev,a);prev=c;
    for(let bay=0;bay<bays;bay++) {
      const left=-inner+bay*bw, right=left+bw, frame=0.66;
      face('concrete',left,left+frame,a,c,FRONT(a),FRONT(c),[0,-0.56,-0.83]);
      face('concrete',right-frame,right,a,c,FRONT(a),FRONT(c),[0,-0.56,-0.83]);
      const x0=left+frame, x1=right-frame, panes=near?16:5, step=(x1-x0)/panes;
      for(let i=0;i<panes;i++) {
        const u0=x0+i*step,u1=u0+step,gap=near?0.07:0.14;
        const m=row===0 && bay===2 && i%3===0?'glow':'glass';
        face(m,u0+gap,u1-gap,a,c,FRONT(a)+0.7,FRONT(c)+0.7,[0,-0.56,-0.83]);
        face('joint',u0,u0+gap,a,c,FRONT(a)+0.7,FRONT(c)+0.7,[0,-0.56,-0.83]);
        face('joint',u1-gap,u1,a,c,FRONT(a)+0.7,FRONT(c)+0.7,[0,-0.56,-0.83]);
      }
      // Genuine window pockets: soffit/sill/returns span the 0.7-m recession.
      horizontal('concrete',x0,x1,FRONT(c),FRONT(c)+0.7,c,-1);
      horizontal('concrete',x0,x1,FRONT(a),FRONT(a)+0.7,a,1);
      for(const [u,dir] of [[x0,1],[x1,-1]]) S('concrete').quad([u,a,FRONT(a)],[u,a,FRONT(a)+0.7],[u,c,FRONT(c)+0.7],[u,c,FRONT(c)],[dir,0,0]);
    }
  }
  band(prev,ROOF);
  // Solid bookends, narrow in elevation, forming the decisive wedge in section.
  for(const side of [-1,1]) {
    const a=side<0?-L:inner, c=side<0?-inner:L;
    face('concrete',a,c,0,ROOF,FRONT(0),FRONT(ROOF),[0,-0.56,-0.83]);
    S('concrete').tri([side*L,0,FRONT(0)],[side*L,ROOF,FRONT(ROOF)],[side*L,ROOF,24],[side,0,0]);
    S('concrete').tri([side*L,0,FRONT(0)],[side*L,ROOF,24],[side*L,30,24],[side,0,0]);
    // Close the ascending triangular underside; no floating boundary face.
    S('concrete').quad([side*L,0,FRONT(0)],[side*L,30,24],[side*62,30,24],[side*62,0,FRONT(0)],[0,-1,1]);
  }
  horizontal('concrete',-L,L,FRONT(ROOF),24,ROOF);
  horizontal('concrete',-62,62,FRONT(0),24,0,-1);
  // South face: each successive end wing grows about 2.9 m; clear recessed rows.
  const levels=[0,5,9.27,13.54,17.81,22.08,26.35,30.62,ROOF];
  let oldW=62;
  for(let k=0;k<levels.length-1;k++) {
    const y0=levels[k],y1=levels[k+1],w=k===7?L:62+k*3.88;
    if(k>0) for(const side of [-1,1]) horizontal('concrete',side<0?-w:oldW,side<0?-oldW:w,-2,24,y0,-1);
    const sill=y0+0.8, head=y1-0.9, cols=near?Math.round(2*w/1.6):Math.round(2*w/5);
    face('concrete',-w,w,y0,sill,24,24,[0,0,1]);
    face('concrete',-w,w,head,y1,24,24,[0,0,1]);
    for(let i=0;i<cols;i++) {
      const x0=-w+2*w*i/cols,x1=-w+2*w*(i+1)/cols,gap=near?0.08:0.16;
      face('glass',x0+gap,x1-gap,sill,head,23.1,23.1,[0,0,1]);
      face('concrete',x0,x0+gap,sill,head,24,24,[0,0,1]);
      face('concrete',x1-gap,x1,sill,head,24,24,[0,0,1]);
      for(const [u,dir] of [[x0+gap,1],[x1-gap,-1]])S('concrete').quad([u,sill,23.1],[u,sill,24],[u,head,24],[u,head,23.1],[dir,0,0]);
    }
    horizontal('concrete',-w,w,23.1,24,sill,1);
    horizontal('concrete',-w,w,23.1,24,head,-1);
    for(const side of [-1,1]) S('concrete').quad([side*w,y0,-2],[side*w,y0,24],[side*w,y1,24],[side*w,y1,-2],[side,0,0]);
    oldW=w;
  }
  // Three round stair/elevator pylons stand on grade and run into the roof.
  for(const u of [-53,0,53]) cylinder('concrete',u,-23,3.1,0,ROOF,near?24:12);
  // End mechanical bulkheads establish the published overall 122-foot height.
  for(const u of [-L+8,L-8]) box('concrete',[u,(ROOF+SPEC.height)/2,-13],[16,SPEC.height-ROOF,31]);
  // Three barrel-vaulted skylights over the great court. Closed shell, roof contact.
  for(const u of [-19.5,0,19.5]) {
    const segments=near?16:8, length=27, radius=3.65;
    for(let i=0;i<segments;i++) {
      const a=i*Math.PI/segments,c=(i+1)*Math.PI/segments;
      const p=[u+radius*Math.cos(a),ROOF+radius*Math.sin(a),-18];
      const q=[u+radius*Math.cos(c),ROOF+radius*Math.sin(c),-18];
      S('glass').quad(p,q,[q[0],q[1],-18+length],[p[0],p[1],-18+length],[Math.cos((a+c)/2),Math.sin((a+c)/2),0]);
      for(const v of [-18,-18+length]) S('concrete').tri([u,ROOF,v],[p[0],p[1],v],[q[0],q[1],v],[0,0,v<0?-1:1]);
    }
  }
  // Level forecourt; separate from the building replacement polygon.
  const plaza=new THREE.Shape();plaza.moveTo(-85,-116);plaza.lineTo(85,-116);plaza.lineTo(85,-30);plaza.lineTo(-85,-30);plaza.closePath();
  const poolHole=new THREE.Path();poolHole.absellipse(-30,-82,28.082,28.082,0,2*Math.PI,true);plaza.holes.push(poolHole);
  const pg=new THREE.ShapeGeometry(plaza,near?96:48);pg.rotateX(Math.PI/2); const idx=pg.index.array;for(let i=0;i<idx.length;i+=3)[idx[i+1],idx[i+2]]=[idx[i+2],idx[i+1]];pg.computeVertexNormals();pg.translate(0,0.14,0);put(pg,'paving');
  // 180-foot circular reflecting pool: annular rim, with water replacing its lid.
  const pc=[-30,-82], r=27.432, seg=near?96:48;
  for(let i=0;i<seg;i++) {
    const a=2*Math.PI*i/seg,c=2*Math.PI*(i+1)/seg;
    const p=(ang,rad,y)=>[pc[0]+Math.cos(ang)*rad,y,pc[1]+Math.sin(ang)*rad];
    S('paving').quad(p(a,r+0.65,0.34),p(c,r+0.65,0.34),p(c,r,0.34),p(a,r,0.34),[0,1,0]);
    S('paving').quad(p(a,r+0.65,0.14),p(c,r+0.65,0.14),p(c,r+0.65,0.34),p(a,r+0.65,0.34),[Math.cos(a),0,Math.sin(a)]);
    S('paving').quad(p(a,r,0.14),p(a,r,0.34),p(c,r,0.34),p(c,r,0.14),[-Math.cos(a),0,-Math.sin(a)]);
    S('water').tri([pc[0],0.25,pc[1]],p(a,r,0.25),p(c,r,0.25),[0,1,0]);
  }
  // A broad, continuous low plinth supports three original abstract vertebra forms.
  box('paving',[29,0.3,-49],[11,0.32,7]);
  // Three separate vertebral cues, studied against the conservator's photo:
  // an upright fin with a cupped side, a low sweeping hook and a broad open C.
  // These are original approximations, not three punched copies or a tracing.
  const profiles=[
    [[-0.9,0],[-1.6,0.4,-1.3,1.4,-0.9,2.1],[-0.4,3.2,0.1,4.6,0.65,4.6],[0.9,4.6,0.95,4.2,0.9,3.7],[0.75,2.8,0.85,2.1,1.15,1.65],[0.4,1.8,0.05,2.15,-0.1,2.4],[-0.35,1.4,0.05,1.05,0.95,0.45],[1.3,0.1,0.6,0,0.15,0]],
    [[-1.05,0],[-1.7,0.3,-1.6,0.9,-1.1,1.55],[-0.4,2.5,0.15,2.65,0.05,3.3],[0.7,3.7,1.45,3.35,1.5,2.8],[1.8,1.8,1.25,1.2,0.5,0.9],[-0.2,0.65,-0.6,1.0,-0.7,1.2],[-0.9,0.65,-0.4,0.3,0.1,0.15],[-0.25,0,-0.8,0,-1.05,0]],
    [[-1.15,0],[-0.3,0,0.7,0,1.05,0.3],[1.6,0.95,1.45,1.65,1.1,2.3],[0.75,2.95,1.2,3.65,0.9,4.15],[0.15,4.25,-0.85,4.45,-1.3,4.0],[-1.8,3.55,-1.65,3.1,-1.1,3.05],[-0.15,3.25,0.2,2.8,0.18,2.25],[0.1,1.65,-0.55,1.2,-1.45,0.6],[-1.7,0.35,-1.5,0,-1.15,0]],
  ];
  for(let i=0;i<3;i++) {
    const sh=new THREE.Shape();sh.moveTo(...profiles[i][0]);
    for(const curve of profiles[i].slice(1))sh.bezierCurveTo(...curve);sh.closePath();
    let g=new THREE.ExtrudeGeometry(sh,{depth:1.45,bevelEnabled:true,bevelThickness:0.28,bevelSize:0.23,bevelSegments:near?3:2,curveSegments:near?5:3});
    // Weld bevel/side normals so the small road-distance forms read as rounded
    // bronze volumes instead of sharply faceted extruded slabs.
    g.deleteAttribute('normal');g.deleteAttribute('uv');g=mergeVertices(g);g.computeVertexNormals();
    g.rotateY([-0.2,0.28,-0.16][i]);g.computeBoundingBox();
    g.translate(25.45+i*3.55,0.46-g.boundingBox.min.y,-49.8+[0,0.8,-0.25][i]);put(g,'bronze');
  }
  if(near) {
    // Sparse shallow formwork courses are cut into the surface tone, not overlays.
    // Entrance handles are omitted: the model reads from road distance.
    for(const u of [-8,8]) box('concrete',[u,2.3,FRONT(2.3)+0.2],[0.18,4.2,0.25]);
  }
  for(const [m,s] of soups)if(s.p.length)put(s.geometry(),m);
  return b.finish();
}
