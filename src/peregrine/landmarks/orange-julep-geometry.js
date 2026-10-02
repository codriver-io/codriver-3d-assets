import * as THREE from 'three';
import { assetBuilder } from './asset-geometry.js';
import { ORANGE_JULEP as spec, ORANGE_JULEP_PALETTES } from './orange-julep-config.js';

// Original outline lettering: no font, texture, decal, or captured mesh dependency.
const glyphs = {
  A: [[[0,0],[.5,1],[1,0]],[[.23,.42],[.77,.42]]],
  B: [[[0,0],[0,1],[.7,1],[1,.8],[.7,.55],[0,.55]],[[.7,.55],[1,.3],[.75,0],[0,0]]],
  E: [[[1,1],[0,1],[0,0],[1,0]],[[0,.52],[.8,.52]]],
  G: [[[1,.8],[.8,1],[.2,1],[0,.8],[0,.2],[.2,0],[1,0],[1,.45],[.55,.45]]],
  I: [[[.5,0],[.5,1]],[[.1,0],[.9,0]],[[.1,1],[.9,1]]],
  J: [[[1,1],[1,.2],[.8,0],[.2,0],[0,.2]]],
  L: [[[0,1],[0,0],[1,0]]],
  N: [[[0,0],[0,1],[1,0],[1,1]]],
  O: [[[.2,0],[.8,0],[1,.2],[1,.8],[.8,1],[.2,1],[0,.8],[0,.2],[.2,0]]],
  P: [[[0,0],[0,1],[.8,1],[1,.8],[1,.6],[.8,.5],[0,.5]]],
  R: [[[0,0],[0,1],[.8,1],[1,.8],[1,.6],[.8,.5],[0,.5]],[[.5,.5],[1,0]]],
  S: [[[1,.85],[.8,1],[.2,1],[0,.8],[.15,.6],[.85,.4],[1,.2],[.8,0],[.2,0],[0,.15]]],
  T: [[[0,1],[1,1]],[[.5,1],[.5,0]]],
  U: [[[0,1],[0,.2],[.2,0],[.8,0],[1,.2],[1,1]]],
};

export function createOrangeJulep({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({...spec,palette:ORANGE_JULEP_PALETTES.light}, detail);
  const rotation = (180 - spec.frontageBearing) * Math.PI / 180;
  const point = (x,y,z) => [x*Math.cos(rotation)+z*Math.sin(rotation), y, -x*Math.sin(rotation)+z*Math.cos(rotation)];
  const polar = (r,a,y) => point(r*Math.sin(a),y,r*Math.cos(a));
  const box = (mat,x,y,z,w,h,d,a=0) => b.box(mat,point(x,y,z),[w,h,d],rotation+a,0,0);
  const put = (g,mat) => {g.rotateY(rotation);b.put(g,mat,0,0);};
  const radius = spec.diameter/2, cy = spec.sphereCenterY;
  const radiusAt = y => Math.sqrt(Math.max(0,radius*radius-(y-cy)**2));
  const arc = (mat,r1,r2,y1,y2,a1,a2,n=near?36:16) => {
    const vertices=[],faces=[];
    for(let i=0;i<=n;i++){
      const a=a1+(a2-a1)*i/n;
      for(const [r,y] of [[r1,y1],[r2,y1],[r1,y2],[r2,y2]])vertices.push(r*Math.sin(a),y,r*Math.cos(a));
      if(!i)continue;const p=(i-1)*4,q=i*4;
      faces.push(p+1,q+1,p+3,q+1,q+3,p+3,p,p+2,q,q,p+2,q+2,p+2,p+3,q+2,p+3,q+3,q+2,p,q,p+1,p+1,q,q+1);
    }
    faces.push(0,1,2,1,3,2,n*4,n*4+2,n*4+1,n*4+1,n*4+2,n*4+3);
    const g=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    g.setIndex(faces);const flat=g.toNonIndexed();flat.computeVertexNormals();g.dispose();put(flat,mat);
  };
  // Spherical shell truncated at the ground, with actual gaps for service and rear doors.
  const count=near?96:40, levels=[0,2.75,3.25];
  const start=Math.acos((3.25-cy)/radius);
  for(let i=1;i<=(near?22:10);i++)levels.push(cy+radius*Math.cos(start*(1-i/(near?22:10))));
  const positions=[],normals=[],indices=[];
  for(const y of levels)for(let i=0;i<=count;i++){
    const a=i/count*Math.PI*2,r=radiusAt(y),x=r*Math.sin(a),z=r*Math.cos(a);
    positions.push(x,y,z);normals.push(x/radius,(y-cy)/radius,z/radius);
  }
  // The rear service notch is bounded by two vertical planes: the shell columns on its edge are moved onto them (still on
  // the sphere), so the return walls are exact planar quads and the notch edge is clean instead of twisted.
  const step=Math.PI*2/count,backEdge=Math.ceil(.36/step-.5)*step,notchX=radiusAt(2.75)*Math.sin(backEdge);
  for(let j=0;j<levels.length;j++){
    if(levels[j]>2.75)break;
    const r=radiusAt(levels[j]);
    for(const [i,side] of [[count/2-Math.round(backEdge/step),1],[count/2+Math.round(backEdge/step),-1]]){
      const k=(j*(count+1)+i)*3,x=side*notchX,z=-Math.sqrt(r*r-notchX*notchX);
      positions[k]=x;positions[k+2]=z;normals[k]=x/radius;normals[k+2]=z/radius;
    }
  }
  for(let j=0;j<levels.length-1;j++)for(let i=0;i<count;i++){
    const a=(i+.5)/count*Math.PI*2,front=Math.min(a,2*Math.PI-a)<1.14,back=Math.abs(a-Math.PI)<.36;
    if((front&&levels[j]<3.25)||(back&&levels[j]<2.75))continue;
    const v=j*(count+1)+i,w=v+count+1;
    indices.push(v,v+1,w,v+1,w+1,w);
  }
  const shell=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(positions,3)).setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
  shell.setIndex(indices);put(shell,'orange');
  // Service frontage: faceted recessed glazing, masonry knee wall, projecting counter,
  // aluminium frames and thin orange canopy.
  arc('stone',7.7,8.0,0,.95,-1.14,.89);
  arc('orange',7.7,8.03,.95,1.13,-1.14,.89);
  arc('trim',7.75,8.4,1.1,1.18,-1.16,.89);
  arc('metal',7.8,8.72,2.88,3.0,-1.17,1.17);
  arc('orange',7.8,8.68,3.0,3.25,-1.17,1.17);
  arc('trim',8.66,8.73,2.94,3.01,-1.17,1.17);
  const bays=near?10:6,pitch=2.24/bays,span=-1.12+(bays-1)*pitch;
  // Solid orange wall between knee wall and canopy, with discrete framed windows: no continuous glass drum.
  arc('orange',7.7,7.84,1.13,2.88,-1.14,span+.02);
  const ww=near?1.0:1.5;
  for(let i=0;i<bays-1;i++){ // The last bay is the full-height entrance: no wall, counter or glazing across it.
    const a=-1.12+(i+.5)*pitch,w=2*7.85*Math.sin(pitch/2);
    b.box('glass',polar(7.85,a,1.95),[ww,1.0,.09],rotation+a,0,0);
    if(near){
      for(const y of [1.42,2.48])b.box('trim',polar(7.88,a,y),[ww+.14,.07,.1],rotation+a,0,0);
      for(const side of [-1,1])b.box('trim',polar(7.88,a+side*(ww/2+.035)/7.85,1.95),[.07,1.0,.1],rotation+a,0,0);
      b.box('trim',polar(7.9,a,2.65),[ww*.82,.24,.04],rotation+a,0,0);
      for(let k=0;k<3;k++)b.box('ink',polar(7.93,a+(k-1)*.03,2.65),[.12,.035,.02],rotation+a,0,0);
    }else{
      b.box('trim',polar(7.88,a,1.42),[w*.5,.07,.1],rotation+a,0,0);
    }
  }
  // End entrance is an inset doorway with jambs, lintel, glazing and a pull handle.
  const doorAngle=1.03;
  b.box('glass',polar(7.35,doorAngle,1.25),[1.03,2.5,.09],rotation+doorAngle,0,0);
  for(const side of [-1,1])b.box('trim',polar(7.4,doorAngle+side*.073,1.3),[.085,2.6,.12],rotation+doorAngle,0,0);
  b.box('trim',polar(7.4,doorAngle,2.6),[1.22,.08,.12],rotation+doorAngle,0,0);
  b.box('trim',polar(7.47,doorAngle+.038,1.16),[.045,.4,.08],rotation+doorAngle,0,0);
  // Recessed rear service opening, white doors, black exterior stair.
  box('orange',0,1.35,-5.0,6.7,2.7,.2);
  box('trim',-1.35,1.13,-5.14,.88,2.26,.1);
  box('glass',1.42,1.15,-5.14,.88,2.3,.1);
  box('trim',1.42,2.34,-5.18,1.04,.1,.15);
  box('metal',0,2.69,-6.8,6.4,.12,2.1);
  // Return walls: two vertical planar quads from the notch edge on the shell back to the rear wall plane (z=-5.1).
  for(const side of [-1,1]){
    const x=side*notchX,z0=-Math.sqrt(radiusAt(0)**2-notchX**2),z1=-Math.sqrt(radiusAt(2.75)**2-notchX**2);
    const v=[x,0,z0,x,0,-5.1,x,2.75,z1,x,2.75,-5.1];
    const g=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(v,3));
    g.setIndex([0,1,2,1,3,2,0,2,1,1,2,3]);
    const walls=g.toNonIndexed();walls.computeVertexNormals();g.dispose();put(walls,'orange');
  }
  if(near){
    for(let i=0;i<10;i++)box('metal',-.6+i*.12,.16+i*.265,-5.6-i*.1,.85,.06,.24);
    b.bar('metal',point(-1.1,.9,-5.6),point(.12,3.1,-6.6),.035,.035,0,false,0);
    for(const y of [5.5,6.7]){
      const z=-radiusAt(y)-.015;box('trim',1.6,y,z,.65,.62,.035);
      for(let i=0;i<6;i++)box('metal',1.6,y-.22+i*.085,z-.025,.54,.027,.025);
    }
    // Subtle panel joints, kept off the service and access openings.
    for(let i=0;i<16;i++){
      const a=i*Math.PI/8;
      const pts=[];for(let j=0;j<=24;j++){const y=3.3+(spec.height-3.33)*j/24;pts.push(new THREE.Vector3(...polar(radiusAt(y)+.012,a,y)));}
      b.put(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,.008,3,false),'seam',0,0);
    }
    const equator=new THREE.TorusGeometry(radius+.012,.008,3,96);equator.rotateX(Math.PI/2);equator.translate(0,cy,0);put(equator,'seam');
  }
  const vent=new THREE.CylinderGeometry(.13,.18,.19,near?10:6);vent.translate(0,15.85,0);put(vent,'metal');

  // Detached roadside sign, original geometric lettering and orange-slice emblem.
  // Its small base is independently clearance-tested against OSM service lanes.
  const [sx,sz]=spec.sign,sa=-.68;
  const signPoint=(x,y,z)=>[sx+x*Math.cos(sa)+z*Math.sin(sa),y,sz-x*Math.sin(sa)+z*Math.cos(sa)];
  const signBox=(mat,x,y,z,w,h,d)=>b.box(mat,signPoint(x,y,z),[w,h,d],sa,0,0);
  signBox('stone',0,.12,0,1.15,.24,.85);
  signBox('trim',0,1.95,0,.68,3.9,.32);
  signBox('metal',0,4.55,0,2.7,2.75,.48);
  for(const side of [-1,1])signBox('sign',0,4.55,side*.251,2.47,2.51,.025);
  function textLine(word,y,side){
    const h=.47,w=.26,gap=.11,total=word.length*(w+gap)-gap;
    for(let i=0;i<word.length;i++)for(const path of glyphs[word[i]]||[])for(let j=1;j<path.length;j++){
      const xyz=([x,v])=>signPoint(side*(-total/2+i*(w+gap)+x*w),y+v*h,side*.28);
      if(near)b.bar('ink',xyz(path[j-1]),xyz(path[j]),.055,.023,0,false,0);
      else {
        const [a,c]=[path[j-1],path[j]],dx=(c[0]-a[0])*w,dy=(c[1]-a[1])*h,len=Math.hypot(dx,dy),nx=-dy/len*.028/w,ny=dx/len*.028/h;
        const vertices=[[a[0]+nx,a[1]+ny],[a[0]-nx,a[1]-ny],[c[0]+nx,c[1]+ny],[c[0]-nx,c[1]-ny]].flatMap(xyz);
        // Mirroring x already reverses the back face winding.
        const g=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(vertices,3)).setIndex([0,1,2,1,3,2]);
        g.computeVertexNormals();b.put(g,'ink',0,0);
      }
    }
  }
  for(const side of [-1,1]){textLine('GIBEAU',5.24,side);textLine('ORANGE',4.5,side);textLine('JULEP',3.76,side);}
  const disc=new THREE.CylinderGeometry(1.18,1.18,.24,near?40:20);disc.rotateX(Math.PI/2);disc.rotateY(sa);disc.translate(sx,7.04,sz);b.put(disc,'orange',0,0);
  for(const side of [-1,1]){
    const rim=new THREE.TorusGeometry(1.07,.025,3,near?40:20);rim.rotateY(sa);rim.translate(...signPoint(0,7.04,side*.14));b.put(rim,'sign',0,0);
    for(let i=0;i<10;i++){const a=i*Math.PI/5;b.bar('sign',signPoint(Math.cos(a)*.13,7.04+Math.sin(a)*.13,side*.15),signPoint(Math.cos(a)*.98,7.04+Math.sin(a)*.98,side*.15),.025,.025,0,false,0);}
  }
  const root=b.finish();
  root.traverse(o=>{if(!o.isMesh)return;o.geometry.deleteAttribute('bridgeLift');o.material.color.set(ORANGE_JULEP_PALETTES.light[o.material.name]);});
  return root;
}
