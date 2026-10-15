import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { THETA, OCT, kit } from './munttoren-parts.js';

export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,near);
  const {face,surround,pane,loft,disk,sphere}=k;
  // Hollow octagonal masonry shell; the medieval cylindrical stump is read as chamfered brick.
  for(let i=0;i<8;i++){
    const a=OCT+(i+.5)*Math.PI/4,r=2.73*Math.cos(Math.PI/8),w=2*2.73*Math.sin(Math.PI/8);
    const holes=[3.2,7.1,10.9].map(y=>[0,y,.58,1.38]);
    face('brick',a,r,0,w,13.85,holes);
    for(const hole of holes){surround('stone',a,r+.015,...hole,.12);pane('glass',a,r-.24,...hole);}
    // Base stone plinth and broad masonry cornices are independent silhouette courses.
    if(near) for(const y of [1.0,5.6,9.5]) k.arcbar('stone',a,r+.025,[[-w/2,y],[w/2,y]],.065);
  }
  loft('stone',[[2.73,0],[2.83,.20],[2.83,.55],[2.73,.68]]);
  loft('stone',[[2.73,13.6],[2.98,13.84],[3.03,14.13],[2.85,14.38]]);
  // Projecting stone gallery: balusters embed in continuous lower and upper rails.
  loft('stone',[[2.96,14.10],[3.10,14.25],[3.10,14.40]]);
  loft('stone',[[3.10,15.06],[3.13,15.20],[2.78,15.24]]);
  for(let i=0;i<8;i++)for(let j=0;j<4;j++){
    const a=OCT+i*Math.PI/4,aa=OCT+(i+1)*Math.PI/4,t=j/4;
    const x=3.03*((1-t)*Math.cos(a)+t*Math.cos(aa)),z=3.03*((1-t)*Math.sin(a)+t*Math.sin(aa));
    b.bar('stone',[x,14.34,z],[x,15.13,z],j===0?.18:.12);
  }
  // Sandstone-clad upper masonry stage: eight arched shutters, corner pilasters, broken pediments.
  for(let i=0;i<8;i++){
    const a=OCT+(i+.5)*Math.PI/4,r=2.78*Math.cos(Math.PI/8),w=2*2.78*Math.sin(Math.PI/8),hole=[0,16.0,1.07,3.86];
    face('stone',a,r,14.2,w,7.25,[hole]);pane('roof',a,r-.28,...hole);
    surround('stone',a,r+.02,...hole,.21);
    const x=Math.cos(OCT+i*Math.PI/4)*2.76,z=Math.sin(OCT+i*Math.PI/4)*2.76;
    b.bar('stone',[x,14.2,z],[x,21.25,z],.24);
    k.arcbar('metal',a,r+.15,[[-.68,19.78],[0,20.18],[.68,19.78]],.12);
    if(near)for(let y=16.35;y<19.25;y+=.23)k.arcbar('metal',a,r-.25,[[-.44,y],[.44,y]],.034);
  }
  loft('metal',[[2.77,21.25],[3.03,21.48],[3.07,21.78],[2.86,21.95],[2.02,22.28]]);
  loft('metal',[[1.98,22.15],[1.98,26.25],[2.04,26.40]]);
  // Four projecting clock faces with Roman-numeral bars and actual hands, retained in far.
  for(let i=0;i<4;i++){
    const a=OCT+Math.PI/8+i*Math.PI/2;
    disk('recess',a,2.18,24.15,1.74);
    const ring=new THREE.RingGeometry(1.70,1.77,near?48:24);ring.translate(0,24.15,0);b.put(k.plane(ring,a,2.20),'gold');
    for(let h=0;h<12;h++){
      const t=h*Math.PI/6,radial=[Math.sin(t),Math.cos(t)],tangent=[Math.cos(t),-Math.sin(t)];
      // I/V/X groups; small enough to remain geometry without fonts or textures.
      const romans=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'][h];
      for(let j=0;j<romans.length;j++){
        const o=(j-(romans.length-1)/2)*.095,c=[radial[0]*1.40+tangent[0]*o,24.15+radial[1]*1.40+tangent[1]*o];
        const line=(u,v)=>k.arcbar('gold',a,2.32,[[c[0]+u[0],c[1]+u[1]],[c[0]+v[0],c[1]+v[1]]],near?.035:.045);
        const r=[radial[0]*.15,radial[1]*.15],q=[tangent[0]*.045,tangent[1]*.045];
        if(romans[j]==='I')line([-r[0],-r[1]],r);
        else if(romans[j]==='X'){line([-r[0]-q[0],-r[1]-q[1]],[r[0]+q[0],r[1]+q[1]]);line([-r[0]+q[0],-r[1]+q[1]],[r[0]-q[0],r[1]-q[1]]);}
        else {line([-r[0],-r[1]],[r[0]-q[0]*1.5,r[1]-q[1]*1.5]);line([-r[0],-r[1]],[r[0]+q[0]*1.5,r[1]+q[1]*1.5]);}
      }
    }
    if(near)for(let j=0;j<60;j++){
      const a0=j*Math.PI/30;k.arcbar('gold',a,2.32,[[1.59*Math.sin(a0),24.15+1.59*Math.cos(a0)],[1.65*Math.sin(a0),24.15+1.65*Math.cos(a0)]],.026);
    }
    k.arcbar('gold',a,2.35,[[-.73,23.48],[0,24.15],[.46,25.36]],near?.075:.09);
    disk('gold',a,2.39,24.15,.15);
  }
  // Open carillon: corner posts and arch heads rather than a solid tinted cylinder.
  const br=1.67,flat=br*Math.cos(Math.PI/8),bw=2*br*Math.sin(Math.PI/8);
  for(let i=0;i<8;i++){
    const a=OCT+(i+.5)*Math.PI/4;
    face('metal',a,flat,26.30,bw,4.50,[[0,26.39,.92,4.04]]);
    const x=br*Math.cos(OCT+i*Math.PI/4),z=br*Math.sin(OCT+i*Math.PI/4);
    b.bar('metal',[x,26.30,z],[x,30.95,z],.21);
    // Paired scroll/brackets have real contacts with post and cornice at both ends.
    const nx=Math.cos(a),nz=Math.sin(a);
    for(const side of [-1,1]){
      const tx=Math.sin(a)*side,tz=-Math.cos(a)*side;
      const pts=[[nx*flat+tx*.49,26.825,nz*flat+tz*.49],[nx*(flat+.4)+tx*.49,27.125,nz*(flat+.4)+tz*.49],[nx*(flat+.15)+tx*.49,27.80,nz*(flat+.15)+tz*.49],[nx*flat+tx*.49,28.025,nz*flat+tz*.49]];
      if(near)for(let j=1;j<pts.length;j++)b.bar('metal',pts[j-1],pts[j],.075);
    }
  }
  loft('metal',[[1.72,26.22],[1.86,26.4],[1.72,26.6]]);
  loft('metal',[[1.67,30.70],[1.86,31.0],[1.88,31.27],[1.71,31.43]]);
  // Actual hanging bells: their stems meet beams spanning named opposite corner posts.
  for(const y of [27.725,28.85,29.825]){
    const rr=y<28? .44:y<29?.32:.22;
    for(let i=0;i<4;i++){
      const a=OCT+(i*2+.5)*Math.PI/4;
      const p0=[br*Math.cos(a-Math.PI/8),y+.92,br*Math.sin(a-Math.PI/8)];
      const p1=[br*Math.cos(a+Math.PI/8),y+.92,br*Math.sin(a+Math.PI/8)];
      const c=[(p0[0]+p1[0])/2,(p0[2]+p1[2])/2];
      loft('metal',[[rr,y],[rr*.8,y+.13],[rr*.48,y+.65],[rr*.20,y+.72]],near?10:6,0,c);
      b.bar('metal',[c[0],y+.70,c[1]],[c[0],y+.94,c[1]],.09);
      b.bar('metal',p0,p1,.07);
    }
  }
  // Supported ogee cap and squat openwork imperial crown. Eight broad gilt
  // ribs and two tying bands retain negative space without a black cage at range.
  loft('roof',[[1.70,31.38],[1.43,31.66],[1.15,32.15],[.92,32.80],[.90,33.60]],near?16:8);
  const crown=[[.94,33.57],[1.42,33.95],[1.68,34.45],[1.68,34.95],[1.30,35.55],[.60,36.08],[.12,36.48]];
  for(let i=0;i<8;i++){
    const a=OCT+i*Math.PI/4,pts=crown.map(([r,y])=>[r*Math.cos(a),y,r*Math.sin(a)]);
    for(let j=1;j<pts.length;j++)b.bar('gold',pts[j-1],pts[j],near?.23:.26);
  }
  b.bar('roof',[0,33.50,0],[0,36.60,0],.18);
  for(const [r,y,w] of [[.96,33.60,.09],[1.68,34.72,.065]]){
    const torus=new THREE.TorusGeometry(r,w,4,near?32:16);torus.rotateX(Math.PI/2);torus.translate(0,y,0);b.put(torus,'gold');
  }
  for(let i=0;i<8;i++)sphere('gold',[1.69*Math.cos(OCT+i*Math.PI/4),31.50,1.69*Math.sin(OCT+i*Math.PI/4)],.14);
  sphere('gold',[0,36.82,0],.38);
  b.bar('metal',[0,37.15,0],[0,41,0],near?.055:.07);
  b.bar('gold',[-.75,39.95,0],[.86,39.95,0],.055);
  const vane=new THREE.Shape();vane.moveTo(0,39.95);vane.lineTo(.8,40.45);vane.lineTo(1.0,40.72);vane.lineTo(.67,40.61);vane.lineTo(.43,40.22);vane.lineTo(0,39.95);
  const vg=new THREE.ExtrudeGeometry(vane,{depth:.045,bevelEnabled:false});b.put(vg,'gold');
  buildGuardhouse(b,k);
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){const old=o.geometry;o.geometry=mergeVertices(old,1e-4);old.dispose();o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(THETA);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  root.userData.elevationDatum=MANIFEST.elevationDatum;return root;
}

function buildGuardhouse(b,k){
  const {face,surround,pane}=k;
  // Guardhouse and lower east connector, from mapped 751683820 / 818.
  const cx=-16.78,cz=.28,L=14.1,W=7.65,eave=7.8,ridge=12.65;
  for(const side of [-1,1]){
    const a=side>0?Math.PI/2:-Math.PI/2,r=side*cz+W/2;
    const xs=[-22.2,-19.5,-16.8,-14.1,-11.4].map(x=>side*x);
    const holes=xs.flatMap(x=>[[x,.65,1.07,2.25],[x,4.25,.96,1.94]]);
    face('brick',a,r,0,L,eave,holes,side*cx);
    for(const v of holes){surround('stone',a,r+.01,...v,.13);pane('glass',a,r-.24,...v);}
    for(const y of [.45,3.5,7.65])b.box('stone',[cx,y,cz+side*(W/2+.03)],[L,.16,.12]);
    if(k.near)for(const x of [-23.65,-10.0])for(let y=.8;y<7.5;y+=.54)b.box('stone',[x,y,cz+side*(W/2+.06)],[.45,.20,.16]);
  }
  // Gabled roof along east-west, closed with brick stepped end gables.
  const roofShape=new THREE.Shape();roofShape.moveTo(-W/2,eave);roofShape.lineTo(0,ridge);roofShape.lineTo(W/2,eave);roofShape.closePath();
  const rg=new THREE.ExtrudeGeometry(roofShape,{depth:L,bevelEnabled:false});rg.rotateY(Math.PI/2);rg.translate(cx-L/2,0,cz);b.put(rg,'tile');
  for(const side of [-1,1]){
    const x=cx+side*L/2,a=side>0?0:Math.PI,r=side*x;
    const holes=[[-side*cz,1.0,1.25,2.2],[-side*cz,4.6,.95,1.75],[-side*cz,8.4,.73,1.5]];
    face('brick',a,r,0,W,eave,holes.slice(0,2),-side*cz);
    for(const h of holes.slice(0,2)){surround('stone',a,r+.01,...h,.14);pane('glass',a,r-.24,...h);}
    for(let j=0;j<6;j++){
      const width=W*(1-j/6),bottom=eave+j*.79;
      // Each stepped gable is a genuine solid silhouette, not a graphic roof overlay.
      b.box('brick',[x, bottom+.395,cz],[.24,.79,width]);
      b.box('stone',[x,bottom+.79,cz],[.37,.13,width+.12]);
    }
    b.box('stone',[x,12.8,cz],[.42,.35,.50]);
  }
  // Pedimented street dormers with individual panes, both roof slopes and both LODs.
  for(const side of [-1,1])for(const x of [-20.5,-16.8,-13.1]){
    b.box('brick',[x,8.25,cz+side*2.8],[1.12,1.6,.70]);
    const a=side>0?Math.PI/2:-Math.PI/2,r=side*cz+3.17;
    const h=[side*x,7.8,.63,1.05];pane('glass',a,r,...h);surround('stone',a,r+.01,...h,.13);
    k.arcbar('stone',a,r+.04,[[side*x-.70,9.05],[side*x,9.65],[side*x+.70,9.05]],.16);
  }
  // Connector is an open pedestrian arcade, three bays below its lower gabled roof.
  const ax=-6.15,az=-1.40,al=7.45,aw=4.3;
  for(const side of [-1,1]){
    const a=side>0?Math.PI/2:-Math.PI/2,r=side*az+aw/2;
    const holes=[-8.55,-6.15,-3.75].map(x=>[side*x,.20,1.5,3.05]);
    face('brick',a,r,0,al,6.0,holes,side*ax);
    for(const h of holes)surround('stone',a,r+.015,...h,.16);
    b.box('stone',[ax,5.95,az+side*aw/2],[al,.20,.20]);
    for(const x of [-8.55,-6.15,-3.75]){const h=[side*x,4.2,.72,1.1];pane('glass',a,r-.01,...h);}
  }
  const sh=new THREE.Shape();sh.moveTo(-aw/2,6);sh.lineTo(0,8.8);sh.lineTo(aw/2,6);sh.closePath();
  const g=new THREE.ExtrudeGeometry(sh,{depth:al,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(ax-al/2,0,az);b.put(g,'tile');
  // Two mapped stair/entrance projections at the tower; no unrelated street furniture.
  for(const [x,z,h] of [[3.23,1.9,6.0],[-2.45,-2.6,8.7]]){
    b.box('brick',[x,h/2,z],[1.10,h,1.12],-.96);
    b.box('roof',[x,h+.13,z],[1.25,.27,1.27],-.96);
  }
}
