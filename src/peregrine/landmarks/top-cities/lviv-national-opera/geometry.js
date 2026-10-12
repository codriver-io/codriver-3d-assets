import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { BODY } from './lviv-national-opera-plan.js';

const R = SPEC.rotation * Math.PI / 180;
export const plan = (x,y,z) => [x*Math.cos(R)+z*Math.sin(R),y,-x*Math.sin(R)+z*Math.cos(R)];
export const unplan = (x,z) => [x*Math.cos(R)-z*Math.sin(R),x*Math.sin(R)+z*Math.cos(R)];
export const COLUMN_X = [-10.75,-9.45,-4.05,-2.75,2.75,4.05,9.45,10.75];
export const ACROTERIONS = [[-11.5,27.7,39.7],[0,30.15,39.7],[11.5,27.7,39.7]];

export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  function put(g,mat,x=0,y=0,z=0,a=0) {g.rotateY(a);g.translate(x,y,z);g.rotateY(R);g.deleteAttribute('uv');
    // Weld identical position/normal pairs in unindexed extrusions before batching.
    if(g.type==='ExtrudeGeometry'||g.type==='ShapeGeometry'){const welded=mergeVertices(g,1e-5);g.dispose();g=welded;}b.put(g,mat);}
  function box(mat,x,y,z,w,h,d,a=0) {put(new THREE.BoxGeometry(w,h,d),mat,x,y,z,a);}
  function bar(mat,a,c,w,d=w) {b.bar(mat,plan(...a),plan(...c),w,d);}
  function cyl(mat,x,y,z,h,r0,r1=r0,n=near?12:6) {put(new THREE.CylinderGeometry(r1,r0,h,n),mat,x,y,z);}
  function profile(mat,x,z,points,n=near?32:16,sx=1,sz=1) {
    const g=new THREE.LatheGeometry(points.map(([r,y])=>new THREE.Vector2(r,y)),n);g.scale(sx,1,sz);put(g,mat,x,0,z);
  }
  function extrude(mat,points,z,depth,x=0,y=0) {
    const s=new THREE.Shape(points.map(([xx,yy])=>new THREE.Vector2(xx,yy)));
    put(new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false}),mat,x,y,z);
  }
  function prism(points,y,h,mat='stone') {
    const s=new THREE.Shape(points.map(([x,z])=>new THREE.Vector2(x,-z)));
    const g=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);put(g,mat,0,y,0);
  }
  function ellipsoid(mat,x,y,z,sx,sy,sz) {
    const g=new THREE.SphereGeometry(1,near?6:4,near?4:3);g.scale(sx,sy,sz);put(g,mat,x,y,z);
  }
  function archPath(x,bottom,spring,r) {
    const p=new THREE.Path();p.moveTo(x-r,bottom);p.lineTo(x+r,bottom);p.lineTo(x+r,spring);
    p.absarc(x,spring,r,0,Math.PI,false);p.lineTo(x-r,bottom);return p;
  }
  // True cut-through windows, with glazing set into the apertures. No wall plane behind a pane.
  function wall(width,h,x,z,angle,holes=[],base=0,depth=.8) {
    const s=new THREE.Shape([new THREE.Vector2(-width/2,base),new THREE.Vector2(width/2,base),new THREE.Vector2(width/2,base+h),new THREE.Vector2(-width/2,base+h)]);
    for(const v of holes) {
      const [cx,y,w,hh,arched=false,lit=false]=v;
      const p=arched?archPath(cx,y,y+hh-w/2,w/2):new THREE.Path([new THREE.Vector2(cx-w/2,y),new THREE.Vector2(cx+w/2,y),new THREE.Vector2(cx+w/2,y+hh),new THREE.Vector2(cx-w/2,y+hh)]);
      s.holes.push(p);
      if(arched) {
        const shape=new THREE.Shape(p.getPoints(near?4:2));
        const g=near?new THREE.ExtrudeGeometry(shape,{depth:.18,bevelEnabled:false}):new THREE.ShapeGeometry(shape);
        if(!near){const back=g.clone();const index=back.index.array;for(let i=0;i<index.length;i+=3){const t=index[i];index[i]=index[i+2];index[i+2]=t;}back.computeVertexNormals();back.translate(0,0,.24);put(back,lit?'glow':'glass',x,0,z,angle);}
        g.translate(0,0,.25);put(g,lit?'glow':'glass',x,0,z,angle);
      } else {
        const g=near?new THREE.BoxGeometry(w,hh,.18):new THREE.PlaneGeometry(w,hh);g.translate(cx,y+hh/2,.34);put(g,lit?'glow':'glass',x,0,z,angle);
        if(!near){const back=new THREE.PlaneGeometry(w,hh);back.rotateY(Math.PI);back.translate(cx,y+hh/2,.33);put(back,lit?'glow':'glass',x,0,z,angle);}
      }
      if(near) {
        // All trim uses the stone batch; no alternating depth relationships.
        for(const dx of [-w/2-.13,w/2+.13]){const g=new THREE.BoxGeometry(.24,hh,.3);g.translate(cx+dx,y+hh/2,depth+.10);put(g,'stone',x,0,z,angle);}
        const g=new THREE.BoxGeometry(w+.5,.28,.5);g.translate(cx,y-.13,depth+.08);put(g,'stone',x,0,z,angle);
      }
    }
    const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false,curveSegments:near?8:3});put(g,'stone',x,0,z,angle);
  }
  function statue(mat,x,y,z,h,winged=false,palm=false) {
    const s=h/6;
    const pt=(dx,dy,dz=0)=>[x+dx*s,y+dy*s,z+dz*s];
    cyl(mat,...pt(0,.15),.3*s,.72*s,.78*s);
    // Feet, flowing skirt, two legs, waist, torso, neck and head read as a human group.
    for(const dx of [-.34,.34]){ellipsoid(mat,...pt(dx,.40,.12),.25*s,.18*s,.48*s);bar(mat,pt(dx,.5),pt(dx*.5,2.35),.29*s);}
    cyl(mat,...pt(0,1.6),2.4*s,.72*s,.35*s);
    ellipsoid(mat,...pt(0,3.0),.62*s,.98*s,.35*s);
    cyl(mat,...pt(0,3.95),.42*s,.19*s);
    ellipsoid(mat,...pt(.05,4.43),.34*s,.45*s,.34*s);
    // Outstretched left arm and raised right arm meet shoulders at both ends.
    bar(mat,pt(-.48,3.6),pt(-1.2,3.5,.06),.24*s);bar(mat,pt(-1.2,3.5,.06),pt(-1.7,4.05,.08),.19*s);
    bar(mat,pt(.48,3.6),pt(.9,4.35,.08),.24*s);bar(mat,pt(.9,4.35,.08),pt(.75,5.35,.13),.19*s);
    if(winged) for(const sign of [-1,1]) {
      const pts=[[sign*.34,3.15],[sign*1.15,3.6],[sign*1.9,5.9],[sign*1.35,5.45],[sign*.65,4.3]].map(([xx,yy])=>[xx*s,yy*s]);
      extrude(mat,pts,z-.35*s,.24*s,x,y);
      if(near)for(let i=0;i<4;i++)bar(mat,pt(sign*.6,3.8,-.3),pt(sign*(1.20+i*.15),4.8+i*.25,-.3),.13*s);
    }
    if(palm) {
      // Gilded palm follows the raised hand, including broad leaflets at the crown.
      const pts=[[-1.70,4.05],[-1.5,4.85],[-.8,5.5],[.1,5.8],[.75,5.35]];
      for(let i=1;i<pts.length;i++)bar('gold',pt(...pts[i-1],.16),pt(...pts[i],.16),.09*s);
      for(let i=0;i<9;i++) {
        const a=Math.PI*.2+i*Math.PI*.095,cx=-.4+1.1*Math.cos(a),cy=4.8+1.0*Math.sin(a);
        bar('gold',pt(cx,cy,.17),pt(cx-.15,cy+.6,.17),.10*s);
      }
    }
  }

  // Seated allegory plus an attendant: the flanks are groups, unlike standing Glory.
  function allegory(x,y,z,sign) {
    const p=(dx,dy,dz=0)=>[x+sign*dx,y+dy,z+dz];
    cyl('bronze',x,y+.15,z,.3,.85,.9);
    ellipsoid('bronze',...p(.1,1.15),.8,1.0,.52);
    for(const dx of [-.55,.50]) {
      bar('bronze',p(dx,.25,.3),p(dx,.9,.2),.32);
      bar('bronze',p(dx,.9,.2),p(dx*.45,2.0),.40);
      ellipsoid('bronze',...p(dx,.22,.35),.28,.22,.44);
    }
    ellipsoid('bronze',...p(0,2.9),.65,1.1,.40);
    bar('bronze',p(0,3.6),p(.15,4.0),.30);
    ellipsoid('bronze',...p(.15,4.25),.35,.43,.34);
    // Distinct gestures: one reaches outward; the other cradles a lyre.
    bar('bronze',p(-.45,3.45),p(-1.15,3.2,.2),.26);
    bar('bronze',p(-1.15,3.2,.2),p(-1.6,sign<0?4.0:2.8,.25),.23);
    bar('bronze',p(.45,3.4),p(1.15,3.8,.2),.25);
    bar('bronze',p(1.15,3.8,.2),p(1.35,4.45,.2),.22);
    for(const s of [-1,1])extrude('bronze',[[0,2.8],[s*.65,3.6],[s*1.4,5.9],[s*.95,5.6],[s*.25,4.0]],z-.4,.30,x,y);
    // A lower human silhouette shares the plinth, with bent knees and turned head.
    ellipsoid('bronze',...p(1.05,1.7,.3),.45,.68,.32);
    ellipsoid('bronze',...p(1.0,2.65,.3),.27,.32,.28);
    bar('bronze',p(1.0,2.25,.3),p(1.0,2.5,.3),.22);
    bar('bronze',p(1.0,1.25,.3),p(1.6,.8,.4),.3);
    bar('bronze',p(1.6,.8,.4),p(1.35,.17,.5),.25);
    ellipsoid('bronze',...p(1.35,.16,.5),.25,.16,.35);
    bar('bronze',p(.8,2.1,.4),p(.2,2.4,.45),.20);
    if(sign>0) {
      for(const dx of [-1.7,-.95])bar('bronze',p(dx,2.3,.35),p(dx,3.45,.35),.17);
      bar('bronze',p(-1.7,2.3,.35),p(-.95,2.3,.35),.22);
      bar('bronze',p(-1.7,3.45,.35),p(-.95,3.45,.35),.22);
    }
  }

  function pedimentRelief() {
    // Nine joined, varied human masses fill the triangle: upright centre, reclining edges.
    for(let i=-4;i<=4;i++) {
      const x=i*2.10,edge=Math.abs(i),y=26.55,z=40.42;
      const h=2.65-edge*.49,sg=i<0?-1:1;
      if(edge<2) {
        ellipsoid('stone',x,y+h*.43,z,.50,h*.40,.34);
        ellipsoid('stone',x+sg*.12,y+h*.86,z+.02,.26,.30,.28);
        bar('stone',[x-.35,y+.15,z],[x-.15,y+.8,z],.30);
        bar('stone',[x+.40,y+.15,z],[x+.15,y+.8,z],.30);
        bar('stone',[x-.35,y+h*.62,z],[x-.85,y+h*.70,z],.24);
        bar('stone',[x+.35,y+h*.62,z],[x+.85,y+h*.75,z],.24);
      } else {
        ellipsoid('stone',x,y+h*.38,z,.86,h*.33,.32);
        ellipsoid('stone',x-sg*.58,y+h*.80,z+.03,.25,.25,.26);
        bar('stone',[x+sg*.35,y+.25,z],[x+sg*.95,y+.1,z],.28);
        bar('stone',[x-sg*.1,y+h*.48,z],[x-sg*.95,y+.13,z],.23);
      }
    }
  }

  // Exact provider footprint forms one rigid grounded plinth. Central front portals are cut.
  prism(BODY,0,.75);
  // Ground storey follows the real width changes and has separate window bays.
  const ranges=[[-42.0,-30.0,17.0],[-30.0,-8.9,19.0],[-8.9,11.8,20.35],[11.8,28.3,21.0],[28.3,35.0,19.55]];
  for(const [za,zb,half] of ranges)for(const sg of [-1,1]) {
    const L=zb-za,count=Math.max(1,Math.floor(L/(near?4.2:7.8))),holes=[];
    for(let i=0;i<count;i++)for(const [yy,hh,ww,arc] of [[1.4,3.7,1.8,false],[8.1,7.5,2.1,true],[17.5,2.35,1.5,false]]){if(!near&&yy===17.5&&i%2===1)continue;holes.push([(i+.5)*L/count-L/2,yy,ww,hh,arc,false]);}
    wall(L,20.9,sg*(half-.8),(za+zb)/2,sg*Math.PI/2,holes,.75);
    // Ground rustication joints, cornices, giant pilasters and upper balcony rhythm.
    for(const yy of [6.6,7.0,16.6,21.5])box('stone',sg*half,yy,(za+zb)/2,.95,yy===21.5?.55:.28,L);
    for(let i=0;i<=count;i++) {
      const zz=za+i*L/count;
      box('stone',sg*(half+.05),12.4,zz,.35,10.2,.65);
      box('stone',sg*(half+.16),17.1,zz,.65,.7,1.0);
      if(near) {
        for(let j=0;j<3;j++)box('stone',sg*(half+.28),20.98,zz+(j-1)*.4,.24,.22,.17);
      }
    }
    if(near)for(let y=1.2;y<6.6;y+=.60)for(let j=0;j<=count;j++){
      const a=j===0?za:za+(j-.5)*L/count+.96,c=j===count?zb:za+(j+.5)*L/count-.96;
      if(c>a)box('stone',sg*(half+.08),y,(a+c)/2,.16,.10,c-a);
    }
    // Solid roof decks close all walls. The roof is inset from the architectural cornice.
    box('roof',sg*(half-2.65),22.0,(za+zb)/2,4.5,.38,L-.08);
  }
  // Width-change returns close the orthogonal shell.
  for(let i=1;i<ranges.length;i++)for(const sg of [-1,1]){
    const halfA=ranges[i-1][2],halfB=ranges[i][2],w=Math.abs(halfA-halfB);
    if(w>.01)wall(w+.80,20.9,sg*(halfA+halfB)/2,ranges[i][0],0,[],.75);
  }
  const backHoles=[];
  for(const x of [-12,-6,0,6,12])for(const [y,h,w,a] of [[1.4,3.7,2.0,false],[8.1,7.5,2.2,true],[17.5,2.35,1.8,false]])backHoles.push([x,y,w,h,a,false]);
  wall(34,20.9,0,-41.5,Math.PI,backHoles,.75);
  box('stone',0,21.5,-42.05,34.5,.55,1.0);
  box('roof',0,22,-36,30.6,.38,11.8);
  // Low longitudinal foyer roof behind the ceremonial facade.
  extrude('roof',[[-16.5,21.85],[16.5,21.85],[13.0,24.1],[-13.0,24.1]],-7.8,41.7);

  // Front facade: three entrances, three genuinely deep open arched loggias.
  wall(28.0,5.85,0,39.9,0,[-6.7,0,6.7].map(x=>[x,.86,3.6,5.09,false,true]),.75,1.0);
  if(near)for(let y=1.15;y<6.4;y+=.62)for(const [x,w] of [[-11.7,4.45],[-3.35,2.85],[3.35,2.85],[11.7,4.45]])box('stone',x,y,41.02,w,.10,.20);
  for(const sg of [-1,1]) {
    wall(10.5,20.6,sg*14.1,34.3,0,[[sg*1.1,1.5,2.1,3.3,false,false],[sg*1.1,8.0,3.2,9.6,true,false],[sg*1.1,18.7,2,1.35,false,false]],.75,1.2);
    box('stone',sg*18.75,13.8,35.6,.75,14.5,1.1);
    statue('stone',sg*15.25,8.05,35.6,4.9,false,false);
    if(near)for(let y=1.15;y<6.6;y+=.62)box('stone',sg*15.5,y,35.64,7.0,.10,.2);
  }
  // Back wall of the loggia is 4.8 m behind the columns.
  wall(23.6,14.0,0,34.2,0,[-6.7,0,6.7].map(x=>[x,8.0,4.1,10.2,true,false]),7.2,1.0);
  box('stone',0,7.0,37.65,28.1,.55,6.7);
  const frontShape=new THREE.Shape([new THREE.Vector2(-12.1,7.4),new THREE.Vector2(12.1,7.4),new THREE.Vector2(12.1,22.2),new THREE.Vector2(-12.1,22.2)]);
  for(const x of [-6.7,0,6.7])frontShape.holes.push(archPath(x,7.4,17.4,2.55));
  put(new THREE.ExtrudeGeometry(frontShape,{depth:.85,bevelEnabled:false,curveSegments:near?16:5}),'stone',0,0,38.45);
  for(const x of [-6.7,0,6.7]) {
    const g=new THREE.TorusGeometry(2.85,.28,near?6:3,near?20:10,Math.PI);put(g,'stone',x,17.4,39.58);
    for(const dx of [-2.82,2.82])box('stone',x+dx,12.4,39.58,.48,10.0,.56);
    box('stone',x,20.30,39.78,.85,.80,.70);
  }
  for(const x of COLUMN_X) {
    box('stone',x,7.55,40.25,1.20,.65,1.28);
    profile('stone',x,40.25,[[0,7.45],[.66,7.45],[.66,7.8],[.50,8.1],[.46,8.35],[.39,20.4],[.68,20.65],[.78,21.25],[0,21.25]],near?12:4);
    box('stone',x,21.28,40.25,1.65,.28,1.65);
    for(let i=0;i<(near?8:4);i++){const a=i*Math.PI*2/(near?8:4);ellipsoid('stone',x+.60*Math.sin(a),20.87,40.25+.60*Math.cos(a),.25,.40,.25);}
    if(near) {
      for(let k=0;k<8;k++){const a=k*Math.PI/4;bar('stone',[x+.465*Math.sin(a),8.4,40.25+.465*Math.cos(a)],[x+.395*Math.sin(a),20.5,40.25+.395*Math.cos(a)],.052);}
    }
  }
  // Balustrade remains a perforated line even at far detail.
  for(const x of [-6.7,0,6.7]) {
    box('stone',x,8.1,40.10,4.8,.27,.4);
    for(let j=0;j<(near?10:4);j++)cyl('stone',x-2.15+j*4.3/((near?10:4)-1),7.65,40.1,.7,.11,.16,near?7:4);
  }
  for(const [x,z,w,d] of [[0,37.8,28.2,6.3],[-16.45,34.1,6.5,3.0],[16.45,34.1,6.5,3.0]]) {
    box('stone',x,22.0,z,w,1.15,d);box('stone',x,22.7,z,w+.3,.4,d+.15);box('stone',x,23.15,z,w+.5,.35,d+.25);
    if(near)for(let dx=-w/2+.3;dx<w/2;dx+=.62)box('stone',x+dx,22.45,z+d/2,.26,.32,.38);
  }

  // Sculptural attic, triangular tympanum and flanking acroterion pedestals.
  box('stone',0,24.8,38,27.8,3.0,4.8);
  for(const x of [-11.5,11.5]){box('stone',x,26.9,39.5,3.9,1.6,3.0);box('stone',x,27.7,39.5,4.25,.35,3.2);}
  extrude('stone',[[-11.4,26.25],[11.4,26.25],[0,30.15]],35.6,4.6);
  for(const sg of [-1,1]) {
    // Thick sloped cornice is attached to the triangle along its complete edge.
    extrude('stone',[[sg*11.7,26.1],[0,30.15],[0,30.45],[sg*11.8,26.45]],39.9,.42);
  }
  box('stone',0,26.25,40.25,23.5,.34,.65);
  for(const x of [-17.6,-14.9,14.9,17.6]) {
    box('stone',x,23.65,35.5,.9,.6,1.0);
    statue('stone',x,23.9,35.5,2.6,false,false);
  }
  pedimentRelief();
  if(near) {
    for(const x of [-8,-4,0,4,8]) {
      const g=new THREE.TorusGeometry(.75,.15,5,12);put(g,'stone',x,24.8,40.50);
      ellipsoid('stone',x,24.75,40.50,.42,.55,.24);
    }
  } else for(const x of [-8,-4,0,4,8])ellipsoid('stone',x,24.75,40.50,.50,.62,.30);
  for(let i=0;i<ACROTERIONS.length;i++){const [x,y,z]=ACROTERIONS[i];if(i===1)statue('bronze',x,y,z,6,true,true);else allegory(x,y,z,i===0?-1:1);}

  // Rear stage/dome block and pedimented drum faces. It is not a second generic tower.
  wall(28.8,7.3,0,-8.9,0,[-8,-4,0,4,8].map(x=>[x,23.2,1.7,4.7,false,false]),22.0,.9);
  wall(28.8,7.3,0,-31.1,Math.PI,[-8,-4,0,4,8].map(x=>[x,23.2,1.7,4.7,false,false]),22.0,.9);
  for(const sg of [-1,1]) {
    wall(22.2,7.3,sg*13.5,-20,sg*Math.PI/2,[-6,0,6].map(x=>[x,23.2,1.6,4.7,false,false]),22.0,.9);
    box('stone',sg*14.1,29.4,-20,1.3,.45,23.2);
    // Side drum gables meet the raised dome shoulder.
    const g=new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(-10.4,29.5),new THREE.Vector2(10.4,29.5),new THREE.Vector2(0,32.0)]),{depth:.75,bevelEnabled:false});
    put(g,'stone',sg*13.55,0,-20,sg*Math.PI/2);
  }
  box('stone',0,29.45,-20,29.1,.40,22.6);
  // Slightly elongated, tall copper cupola with lantern; twenty-four rib lines near.
  const dome=[[0,29.65],[14.55,29.65],[14.55,30.1],[14.2,32.3],[12.7,34.8],[10.2,36.9],[6.8,38.4],[2.0,39.0],[0,39.0]];
  profile('roof',0,-20,dome,near?40:16,1,.79);
  if(near)for(let k=0;k<24;k++) {
    const a=k*Math.PI/12;
    for(let i=3;i<dome.length-1;i++){const [r0,y0]=dome[i-1],[r1,y1]=dome[i];bar('roof',[r0*Math.sin(a),y0+.07,-20+r0*.79*Math.cos(a)],[r1*Math.sin(a),y1+.07,-20+r1*.79*Math.cos(a)],.12);}
  }
  cyl('roof',0,39.2,-20,.65,2.1,1.75);
  cyl('glass',0,40.05,-20,1.25,1.45);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;box('roof',1.5*Math.sin(a),40.05,-20+1.5*Math.cos(a),.30,1.6,.40,a);}
  profile('roof',0,-20,[[1.7,40.65],[1.95,40.85],[1.55,41.15],[.9,41.7],[.18,41.95],[0,41.95]],near?20:10);
  cyl('bronze',0,42.40,-20,1.2,.075,.055,near?8:5);
  // Four ornamental ventilation lanterns have grounded plinths on the drum corners.
  for(const x of [-12.5,12.5])for(const z of [-29,-11]) {
    box('stone',x,29.85,z,1.1,.55,1.1);
    cyl('roof',x,30.55,z,.90,.53,.48,near?8:5);
    profile('roof',x,z,[[.6,30.9],[.55,31.3],[.2,31.7],[0,31.85]],near?12:6);
  }
  return b.finish();
}
