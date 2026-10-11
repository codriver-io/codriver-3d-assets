import * as THREE from 'three';

// The city-facing chevet is a tall stone crown with recessed lights, not a low domed pavilion.
// Intermediate elevations are photographic estimates; the mapped plan radius is retained.
export function chevet(k) {
  const {near,lathe,radialPut,column,box,bar}=k;
  const u=37.4,v=8.3,r=10.6,n=14,half=Math.PI/n,ap=r*Math.cos(half),w=2*r*Math.sin(half);
  const arch=(width,y0,spring)=>{
    const rad=width/2,pts=[[-rad,y0],[rad,y0],[rad,spring]],steps=near?10:5;
    for(let i=1;i<=steps;i++){const a=i*Math.PI/steps;pts.push([rad*Math.cos(a),spring+rad*Math.sin(a)]);}
    return pts.map(p=>new THREE.Vector2(...p));
  };
  lathe('stone',[[0,0],[r,0],[r,12.6],[0,12.6]],u,v,n);
  // Closed panel extrusions cut away the actual opening; a glass back is 0.85 m recessed.
  for(let i=-7;i<7;i++) {
    const a=Math.PI/2+i*2*half;
    const shape=new THREE.Shape([new THREE.Vector2(-w/2,12.45),new THREE.Vector2(w/2,12.45),new THREE.Vector2(w/2,33.5),new THREE.Vector2(-w/2,33.5)]);
    const hasWindow=Math.abs(i)<=3;
    if(hasWindow)shape.holes.push(new THREE.Path(arch(2.45,14.6,29.55)));
    const wall=new THREE.ExtrudeGeometry(shape,{depth:.9,bevelEnabled:false});wall.translate(0,0,-.45);
    radialPut(wall,'stone',u,v,ap-.45,a);
    if(hasWindow) {
      const glass=new THREE.ShapeGeometry(new THREE.Shape(arch(2.45,14.6,29.55)));
      radialPut(glass,'glass',u,v,ap-.85,a);
      k.radialArc(u,v,ap+.1,a,14.6,2.45,29.55,.28,near?.28:.18);
      if(near) {
        const mullion=new THREE.BoxGeometry(.1,15.05,.13);mullion.translate(0,22.13,0);
        radialPut(mullion,'trim',u,v,ap-.72,a);
        const transom=new THREE.BoxGeometry(2.45,.13,.13);transom.translate(0,21.5,0);
        radialPut(transom,'trim',u,v,ap-.72,a);
      }
      // Small lower openings sit under the pronounced belt, not in the tall upper lights.
      k.radialWindow(u,v,ap,a,4.3,1.25,4.2);
    }
  }
  lathe('trim',[[10.3,12.05],[10.9,12.05],[11.05,12.45],[10.9,12.9],[10.3,12.9],[10.3,12.05]],u,v,n);
  for(let i=-4;i<=3;i++) {
    const a=Math.PI/2+(i+.5)*2*half,rr=10.62;
    column(u+Math.sin(a)*rr,v+Math.cos(a)*rr,12.7,32.8,.42);
  }
  // Broad copper cap is kept BELOW the stone parapet rather than exposed as a blue dome.
  lathe('roof',[[0,33.3],[10.35,33.3],[3,34.15],[0,34.15]],u,v,n);
  lathe('trim',[[10.15,32.95],[10.85,32.95],[11.1,33.4],[11.1,34],[10.8,34.45],[10.3,34.45],[10.15,32.95]],u,v,n);
  lathe('stone',[[10.25,34.25],[10.8,34.25],[10.8,35.15],[10.25,35.15],[10.25,34.25]],u,v,n);
  if(near)for(let i=0;i<42;i++) {
    const a=i*Math.PI/21;
    box('trim',[u+Math.sin(a)*10.98,33.15,v+Math.cos(a)*10.98],[.2,.55,.3],-a);
  }
  // Small green roof figure visible between the eastern towers in the review photograph.
  lathe('trim',[[0,34.05],[.6,34.05],[.6,35.1],[0,35.1]],u,v,8);
  k.figure(u,v,35,2.55,'roof');
  bar('metal',[u,36.7,v],[u+.5,38.3,v],.07,.08);
}
