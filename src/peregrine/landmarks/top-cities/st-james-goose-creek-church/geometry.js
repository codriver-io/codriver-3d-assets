import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Original geometry. u follows the mapped east axis; v points south.
// The whole church is rigid, with the outside foundation toe at y=0.
export function create({ detail='near' }={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const turn=SPEC.rotationDeg*Math.PI/180;
  const put=(g,m)=>{g.rotateY(turn);b.put(g,m);};
  const box=(m,p,d)=>{const g=new THREE.BoxGeometry(...d);g.translate(...p);put(g,m);};
  function face(m,pts,n){
    const p=pts.map(v=>new THREE.Vector3(...v)),rev=p[1].clone().sub(p[0]).cross(p[2].clone().sub(p[0])).dot(new THREE.Vector3(...n))<0,idx=[];
    for(let i=1;i<p.length-1;i++)idx.push(...(rev?[0,i+1,i]:[0,i,i+1]));
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));g.setIndex(idx);g.computeVertexNormals();put(g,m);
  }
  const rect=(x,y,w,h)=>new THREE.Shape([new THREE.Vector2(x-w/2,y),new THREE.Vector2(x+w/2,y),new THREE.Vector2(x+w/2,y+h),new THREE.Vector2(x-w/2,y+h)]);
  function arch(w,h){const r=w/2,s=rect(0,0,w,h-r);s.curves=[];s.moveTo(-r,0);s.lineTo(r,0);s.lineTo(r,h-r);s.absarc(0,h-r,r,0,Math.PI,false);s.lineTo(-r,0);return s;}
  function wall(A,B,openings,west=false,east=false){
    const dx=B[0]-A[0],dz=B[1]-A[1],len=Math.hypot(dx,dz),ang=-Math.atan2(dz,dx),E=6.05;
    const local=(g,m)=>{g.rotateY(ang);g.translate(A[0],0,A[1]);put(g,m);};
    const shape=(s,m,x,y,d,thick)=>{const g=new THREE.ExtrudeGeometry(s,{depth:thick,bevelEnabled:false,curveSegments:near?12:6});g.translate(x,y,d);local(g,m);};
    const panel=(m,x0,x1,y0,y1,d=.63)=>{const g=new THREE.PlaneGeometry(x1-x0,y1-y0);g.rotateY(Math.PI);g.translate((x0+x1)/2,(y0+y1)/2,d);local(g,m);};
    const main=rect(len/2,0,len,E);
    for(const o of openings){const s=o.door?rect(0,0,o.w,o.h):arch(o.w,o.h);const pts=s.getPoints(near?24:12).map(p=>p.add(new THREE.Vector2(o.x,o.y)));main.holes.push(new THREE.Path(pts));}
    shape(main,'stucco',0,0,0,.72);
    for(const o of openings){
      if(o.door){panel('door',o.x-o.w/2,o.x+o.w/2,o.y,o.y+o.h);if(near)for(const x of [-.42,.42])for(const y of [.55,1.3,2.1]){const g=new THREE.BoxGeometry(.57,.55,.10);g.translate(o.x+x,y,.55);local(g,'door');}}
      else {
        // Window lights and white muntins tile one recessed plane, with no backing wall.
        const r=o.w/2, spring=o.y+o.h-r,cols=near?3:2,rows=near?7:4,gap=near?.032:.055;
        for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
          const x0=o.x-r+col*o.w/cols,x1=o.x-r+(col+1)*o.w/cols,y0=o.y+row*(o.h-r)/rows,y1=o.y+(row+1)*(o.h-r)/rows;
          panel('glass',x0+gap,x1-gap,y0+gap,y1-gap);panel('stucco',x0,x0+gap,y0,y1);panel('stucco',x1-gap,x1,y0,y1);panel('stucco',x0+gap,x1-gap,y0,y0+gap);panel('stucco',x0+gap,x1-gap,y1-gap,y1);
        }
        const cap=arch(o.w,o.h); // round-headed fanlight, radial frames replace glass sectors
        const N=near?8:6;
        for(let i=0;i<N;i++){
          const a=i*Math.PI/N,c=(i+1)*Math.PI/N,p0=[o.x,spring,.63];
          const tri=(m,a,c)=>{const pts=[p0,[o.x+r*Math.cos(a),spring+r*Math.sin(a),.63],[o.x+r*Math.cos(c),spring+r*Math.sin(c),.63]];let g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));g.setIndex([0,2,1]);g.computeVertexNormals();local(g,m);};
          tri('glass',a+.025,c-.025);tri('stucco',a,a+.025);tri('stucco',c-.025,c);
        }
      }
      if(!o.door){const outer=arch(o.w+.30,o.h+.19);outer.holes.push(new THREE.Path(arch(o.w,o.h).getPoints(near?24:12)));shape(outer,'stucco',o.x,o.y,-.13,.25);const sill=rect(o.x,o.y-.12,o.w+.52,.15);shape(sill,'stucco',0,0,-.22,.38);
        // Original small cherub-like keystone relief (no copied carving).
        const g=new THREE.SphereGeometry(.11,near?8:5,near?6:4);g.scale(1,1.1,.65);g.translate(o.x,o.y+o.h+.19,-.12);local(g,'stucco');
      }
    }
    // Door surrounds, attached pilasters, continuous entablature, triangular west pediment.
    const d=openings.find(o=>o.door);if(d){
      const pedW=west?4.0:2.55,pedY=west?4.84:3.46,pedH=west?1.18:.68;
      for(const x of [d.x-pedW/2+.22,d.x+pedW/2-.22]){shape(rect(x,0,.38,pedY-.25),'stucco',0,0,-.22,.38);shape(rect(x,pedY-.34,.58,.19),'stucco',0,0,-.33,.43);}
      for(const [y,h,w] of [[pedY-.46,.20,pedW],[pedY-.15,.15,pedW+.2],[pedY+.04,.12,pedW+.38]])shape(rect(d.x,y,w,h),'stucco',0,0,-.32,.42);
      const ped=new THREE.Shape([new THREE.Vector2(d.x-pedW/2,pedY+.16),new THREE.Vector2(d.x+pedW/2,pedY+.16),new THREE.Vector2(d.x,pedY+pedH)]);shape(ped,'stucco',0,0,-.26,.32);
      if(west){
        // Pelican and young: original small rounded relief grouping, not a flat plaque.
        const ell=(x,y,sx,sy)=>{const g=new THREE.SphereGeometry(1,near?10:6,near?8:4);g.scale(sx,sy,.09);g.translate(d.x+x,y,-.39);local(g,'stucco');};
        ell(0,pedY+.55,.17,.25);ell(.11,pedY+.82,.12,.12);ell(-.25,pedY+.53,.25,.10);ell(.26,pedY+.50,.21,.10);
        for(const x of [-.25,0,.25])ell(x,pedY+.30,.09,.08);
      }
    }
    if(west||east){const gable=new THREE.Shape([new THREE.Vector2(0,E),new THREE.Vector2(len,E),new THREE.Vector2(len/2+2.55,7.62),new THREE.Vector2(len/2-2.55,7.62)]);shape(gable,'stucco',0,0,0,.60);}
  }
  const L=SPEC.lengthM/2,W=SPEC.widthM/2;
  const sides=[ [[-L,-W],[L,-W]],[[L,-W],[L,W]],[[L,W],[-L,W]],[[-L,W],[-L,-W]] ];
  for(let i=0;i<4;i++){
    const len=i%2?2*W:2*L,ops=[];
    if(i===0||i===2){for(const q of [.14,.34,.66,.86])ops.push({x:len*q,y:1.12,w:1.26,h:4.15});ops.push({x:len/2,y:0,w:1.35,h:2.85,door:true});}
    else {for(const q of [.24,.76])ops.push({x:len*q,y:1.12,w:1.26,h:4.15});if(i===3)ops.push({x:len/2,y:0,w:1.8,h:3.55,door:true});}
    wall(...sides[i],ops,i===3,i===1);
  }
  // Foundation and continuous cornice: same white masonry material as the walls.
  for(const [A,B] of sides){const dx=B[0]-A[0],dz=B[1]-A[1],d=Math.hypot(dx,dz),g=new THREE.BoxGeometry(d,.20,.27);g.rotateY(-Math.atan2(dz,dx));g.translate((A[0]+B[0])/2,.85,(A[1]+B[1])/2);put(g,'stucco');}
  for(const x of [-L,L])for(const z of [-W,W])for(let i=0;i<10;i++){
    const h=.47,y=.25+i*.58;box('stucco',[x,y,z],[i%2?.64:.82,h,i%2?.82:.64]);
  }
  // Half-hip/jerkinhead: ridge is shorter than the plan; clipped end slopes meet the gables.
  const e=6.18,r=8.85,top=7.73,le=L+.25,we=W+.25,ridge=L-1.7,clipW=W*(r-top)/(r-e);
  face('roof',[[-le,e,-we],[le,e,-we],[le,top,-clipW],[ridge,r,0],[-ridge,r,0],[-le,top,-clipW]],[0,1,-1]);
  face('roof',[[le,e,we],[-le,e,we],[-le,top,clipW],[-ridge,r,0],[ridge,r,0],[le,top,clipW]],[0,1,1]);
  // End hips occupy only the upper end, leaving a broad vertical clipped gable below.
  for(const s of [-1,1])face('roof',[[s*le,top,-clipW],[s*ridge,r,0],[s*le,top,clipW]],[s,1,0]);
  // Eave fascia hides the wall/roof seam and gives the quiet white outline.
  for(const z of [-W,W])box('stucco',[0,6.05,z],[2*L+.38,.25,.36]);
  box('stucco',[0,.04,0],[2*L,.08,2*W]);
  const root=b.finish();return root;
}
