import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';

export const ROTATION=41*Math.PI/180;
export const TOWER=[0,-59.8];
export const PAVILION={back:-44.5,front:-57.5,eaves:18.6,crown:20};
/** Original self-contained construction in metres: u across, v southeast along hall. */
export function create({detail='near'}={}){
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const named=new Map(),members=[];
  const box=(m,u0,u1,y0,y1,v0,v1)=>b.box(m,[(u0+u1)/2,(y0+y1)/2,(v0+v1)/2],[u1-u0,y1-y0,v1-v0]);
  function support(name,m,u0,u1,y0,y1,v0,v1){
    const g=new THREE.BoxGeometry(u1-u0,y1-y0,v1-v0);g.translate((u0+u1)/2,(y0+y1)/2,(v0+v1)/2);
    named.set(name,g.clone());b.put(g,m);
  }
  function member(name,a,c,w,supportA,supportB){
    const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),d=cv.clone().sub(av);
    const g=new THREE.BoxGeometry(w,d.length(),w);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());
    named.set(name,g.clone());b.put(g,'canopy');members.push({name,a,c,supportA,supportB});
  }
  const rect=(x0,x1,y0,y1)=>{const p=new THREE.Path();p.moveTo(x0,y0);p.lineTo(x0,y1);p.lineTo(x1,y1);p.lineTo(x1,y0);p.closePath();return p;};
  // Punched masonry slabs: glazing has no parallel backing face to flicker against.
  function facade(width,height,holes,angle,u,v,mat='brick',depth=.45,profile=null,bottom=0){
    const s=new THREE.Shape();s.moveTo(-width/2,bottom);s.lineTo(width/2,bottom);
    for(const [x,y] of (profile??[[-width/2,height],[width/2,height]]).toReversed())s.lineTo(x,y);s.closePath();
    for(const h of holes)s.holes.push(rect(...h));
    const place=g=>{g.rotateY(angle);g.translate(u,0,v);return g;};
    const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false});g.translate(0,0,-depth);place(g);if(width===115)named.set(`wall-${u>0?1:-1}`,g.clone());b.put(g,mat);
    for(const [x0,x1,y0,y1] of holes){
      const pane=new THREE.PlaneGeometry(x1-x0,y1-y0);pane.translate((x0+x1)/2,(y0+y1)/2,-depth*.55);b.put(place(pane),'glass');
      if(near&&width>10){
        const h=y1-y0;
        // Sashes sit inside real apertures, proud of the glazing but behind the brick face.
        const sash=(x,y,w,h)=>{const g=new THREE.BoxGeometry(w,h,.1);g.translate(x,y,-.13);b.put(place(g),'metal');};
        if(h>2){sash((x0+x1)/2,(y0+y1)/2,.085,h);for(let yy=y0+1.2;yy<y1-.3;yy+=1.2)sash((x0+x1)/2,yy,x1-x0,.085);}
      }
    }
  }
  // Long two-storey hall, NOT the canopy's wider OSM outline.
  box('brick',-9,9,0,.25,-57.5,57.5);
  const bays=near?28:14,pitch=115/bays,holes=[];
  for(let i=0;i<bays;i++){
    const c=-57.5+pitch*(i+.5),w=near?2.15:3.5;
    holes.push([c-w/2,c+w/2,6.3,11.15],[c-.65,c+.65,4.65,5.35]);
    if(i%2===0)holes.push([c-1.25,c+1.25,.35,3.55]);
  }
  for(const side of [-1,1]){
    // NW end pavilion has taller glazing and a raised, stepped roofline.
    const sideHoles=holes.flatMap(h=>{
      const v=-(h[0]+h[1])/2*side;
      return v<PAVILION.back?(h[2]>12?[]:h[2]===6.3?[[h[0],h[1],6.3,16.9]]:h[2]===4.65?[]:[h]):[h];
    });
    const profile=side>0?[[-57.5,13],[44.5,13],[44.5,18.6],[57.5,18.6]]:[[-57.5,18.6],[-44.5,18.6],[-44.5,13],[57.5,13]];
    facade(115,18.6,sideHoles,side*Math.PI/2,side*9,0,'brick',.45,profile);
    for(let i=0;i<=bays;i++){
      const v=-57.5+pitch*i;
      box('brick',side>0?8.9:-9.5,side>0?9.5:-8.9,4,v<PAVILION.back?19.4:13.7,v-.21,v+.21);
    }
    // Parapet brick panels and inset rectangular ventilation slots.
    if(near)for(let i=0;i<bays;i++)if(-57.5+pitch*(i+.5)>PAVILION.back)box('metal',side>0?9.01:-9.09,side>0?9.09:-9.01,12.2,12.7,-57.5+pitch*(i+.5)-.27,-57.5+pitch*(i+.5)+.27);
  }
  // The NW four-window end pavilion rises above the long low market hall.
  const frontHoles=[];
  for(const c of [-6.8,-3.65,3.65,6.8])frontHoles.push([c-1,c+1,7,16.9],[c-1.1,c+1.1,.35,3.55]);
  facade(18,18.6,frontHoles,Math.PI,0,-57.5);
  const crown=[[-9,18.6],[-9,19],[-6.6,19],[-6.6,19.5],[-3.3,19.5],[-3.3,20],[3.3,20],[3.3,19.5],[6.6,19.5],[6.6,19],[9,19],[9,18.6]];
  const endCrown=new THREE.Shape();endCrown.moveTo(...crown[0]);for(const q of crown.slice(1))endCrown.lineTo(...q);endCrown.closePath();
  const cg=new THREE.ExtrudeGeometry(endCrown,{depth:.55,bevelEnabled:false});cg.translate(0,0,-57.5);b.put(cg,'brick');
  for(const u of [-8.8,-5.2,-2.3,2.3,5.2,8.8])box('brick',u-.24,u+.24,4,Math.abs(u)<3?20:Math.abs(u)<6?19.5:19,-57.85,-57.25);
  // Single roof skin terminates at the inner wall faces; no coplanar box end caps.
  const pavilionRoof=new THREE.PlaneGeometry(17.1,12.1);pavilionRoof.rotateX(-Math.PI/2);pavilionRoof.translate(0,18.3,-51);b.put(pavilionRoof,'roof');
  facade(18,18.6,[],0,0,-44.5,'brick',.45,null,13);
  // The southeast end retains the lower gently crowned barrel end.
  const endHoles=[];
  for(const c of [-6.7,-3.35,0,3.35,6.7])endHoles.push([c-1,c+1,6.1,11.7],[c-1.1,c+1.1,.35,3.55]);
  facade(18,13,endHoles,0,0,57.5);
  const shape=new THREE.Shape();shape.moveTo(-9,12.9);shape.lineTo(9,12.9);shape.lineTo(9,13.5);shape.quadraticCurveTo(0,15.6,-9,13.5);shape.closePath();
  const g=new THREE.ExtrudeGeometry(shape,{depth:.5,bevelEnabled:false,curveSegments:near?12:6});g.translate(0,0,57);b.put(g,'brick');
  for(const u of [-8.7,-5.05,-1.68,1.68,5.05,8.7])box('brick',u-.21,u+.21,4,14.2-Math.abs(u)*.08,57.3,57.9);
  // Shallow barrel roof: real auditorium roof profile, closed at both ends by masonry.
  const p=[],idx=[],segments=near?12:6;
  const roofY=u=>13+1.45*Math.sqrt(Math.max(0,1-(u/9)**2));
  for(let i=0;i<=segments;i++){const u=-9+18*i/segments;p.push(u,roofY(u),-44.5,u,roofY(u),57.1);if(i){const k=(i-1)*2;idx.push(k,k+1,k+2,k+1,k+3,k+2);}}
  const roof=new THREE.BufferGeometry();roof.setAttribute('position',new THREE.Float32BufferAttribute(p,3));roof.setIndex(idx);roof.computeVertexNormals();b.put(roof,'roof');
  // Continuous open market canopies, not a solid podium. All outer beams end on posts.
  const postV=[-64.5,-56.44,-48.38,-40.31,-32.25,-24.19,-16.13,-8.06,0,8.06,16.13,24.19,32.25,40.31,48.38,56.44,64.5];
  for(const side of [-1,1]){
    const u=side*17;
    postV.forEach((v,i)=>support(`post-${side}-${i}`,'canopy',u-.12,u+.12,0,3.85,v-.12,v+.12));
    for(let i=0;i<postV.length-1;i++)member(`edge-${side}-${i}`,[u,3.73,postV[i]],[u,3.73,postV[i+1]],.22,`post-${side}-${i}`,`post-${side}-${i+1}`);
    box('canopy',side>0?9:-17.7,side>0?17.7:-9,3.85,4.12,-65,65);
    if(near)for(let i=1;i<postV.length-1;i++){
      const v=postV[i];member(`cross-${side}-${i}`,[side*17,3.77,v],[side*9,3.77,v],.15,`post-${side}-${i}`,`wall-${side}`);
    }
  }
  for(const side of [-1,1]){
    const v=side*64.5,i=side<0?0:postV.length-1;
    member(`end-${side}`,[-17,3.73,v],[17,3.73,v],.22,`post--1-${i}`,`post-1-${i}`);
    if(side>0)box('canopy',-9,9,3.85,4.12,57.5,65);
    else {
      // The grounded tower interrupts the front awning rather than passing through it.
      box('canopy',-9,-3.1,3.85,4.12,-65,-57.5);
      box('canopy',3.1,9,3.85,4.12,-65,-57.5);
      box('canopy',-3.1,3.1,3.85,4.12,-65,-63);
    }
  }
  // Modest fixed stall counters under the awnings; the surrounding covered aisles stay open.
  for(const side of [-1,1])for(const v of [-36,-12,12,36])box('brick',side>0?11:-13.2,side>0?13.2:-11,0,1.05,v-2.3,v+2.3);
  // Clock tower projects ahead of the NW end facade, with its shaft visible from grade.
  const tv=TOWER[1];
  // Hollow four-wall stem, including an actual inset name-panel aperture.
  for(const angle of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
    const u=Math.sin(angle)*2.65,v=tv+Math.cos(angle)*2.65;
    facade(5.3,31,angle===Math.PI?[[-.9,.9,16.1,29.6]]:[],angle,u,v,'brick',.5);
  }
  // Projecting stepped corner pilasters, broad flutes and pale masonry ties share wall material.
  for(const su of [-1,1])for(const sv of [-1,1]){
    box('brick',su<0?-2.95:2.05,su<0?-2.05:2.95,0,30.6,tv+(sv<0?-2.95:2.05),tv+(sv<0?-2.05:2.95));
    box('brick',su<0?-2.8:2.25,su<0?-2.25:2.8,30.6,36.5,tv+(sv<0?-2.8:2.25),tv+(sv<0?-2.25:2.8));
  }
  for(const angle of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
    const place=g=>{g.rotateY(angle);g.translate(0,0,tv);return g;};
    const localBox=(m,x,y,z,w,h,d)=>{const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);b.put(place(g),m);};
    // The tower's belfry panels are real apertures, with inset dark louvres.
    const wall=new THREE.Shape();wall.moveTo(-2.65,30.9);wall.lineTo(2.65,30.9);wall.lineTo(2.65,36.5);wall.lineTo(-2.65,36.5);wall.closePath();
    const clockSide=angle===Math.PI/2||angle===Math.PI*1.5;
    if(!clockSide)wall.holes.push(rect(-1.45,1.45,31.55,35.45));
    const wg=new THREE.ExtrudeGeometry(wall,{depth:.5,bevelEnabled:false});wg.translate(0,0,2.15);b.put(place(wg),'brick');
    if(!clockSide){
      localBox('clock',0,33.5,2.22,2.8,3.8,.12);
      if(near)for(let y=31.7;y<35.4;y+=.32)localBox('metal',0,y,2.38,2.8,.09,.12);
    }
    for(const x of [-1.3,0,1.3]){
      if(angle===Math.PI&&x===0)continue;
      // Flutes have deep enough reveals to remain visible in the far model.
      localBox('mark',x,17,2.88,.24,28,.46);
      if(near)for(const y of [17.4,21.6,25.8,29.8])localBox('mark',x,y,3.13,.52,.24,.24);
    }
    if(clockSide){
      const dial=new THREE.CircleGeometry(1.77,near?48:24);dial.translate(0,33.7,2.95);b.put(place(dial),'clock');
      const ring=new THREE.RingGeometry(1.77,1.94,near?48:24);ring.translate(0,33.7,2.99);b.put(place(ring),'metal');
      for(let i=0;i<12;i++){
        const a=i*Math.PI/6,g=new THREE.BoxGeometry(.085,i%3===0?.4:.23,.08);g.rotateZ(-a);g.translate(Math.sin(a)*1.43,33.7+Math.cos(a)*1.43,3.12);b.put(place(g),'mark');
      }
      for(const [a,l] of [[Math.PI/3,1.2],[-Math.PI/2,.9]]){
        const g=new THREE.BoxGeometry(.11,l,.09);g.translate(0,l/2,0);g.rotateZ(-a);g.translate(0,33.7,3.25);b.put(place(g),'mark');
      }
    }
    if(near)for(const x of [-1.6,-.8,0,.8,1.6])localBox('brick',x,36.15,2.83,.2,.7,.22);
  }
  box('brick',-2.65,2.65,36.25,36.5,tv-2.65,tv+2.65);
  // Dark recessed vertical name panel on the northwest face: original simple geometric lettering.

  const glyphs={A:['01110','10001','10001','11111','10001','10001','10001'],T:['11111','00100','00100','00100','00100','00100','00100'],W:['10001','10001','10001','10101','10101','11011','10001'],E:['11111','10000','10000','11110','10000','10000','11111'],R:['11110','10001','10001','11110','10100','10010','10001']};
  for(const [j,ch] of [...'ATWATER'].entries())for(let row=0;row<7;row++){
    const line=glyphs[ch][row];let col=0;
    while(col<5){if(line[col]!=='1'){col++;continue;}let end=col+1;while(end<5&&line[end]==='1')end++;box('sign',(2.5-end)*.24,(2.5-col)*.24,28.3-j*1.58-row*.18,28.3-j*1.58-row*.18+.17,tv-2.56,tv-2.46);col=end;}
  }
  const root=b.finish();
  root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(ROTATION);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});
  root.structuralQA={named,members};return root;
}
