import * as THREE from 'three';

// The mapped cross-shaped plan: long legislative wings and unequal west/east porches.
export function buildBody(k) {
  const {box,frame,cylinder,near,put}=k;
  function facade(x,z,phi,width,bays,{tall=false}={}) {
    const f=frame(x,z,phi), windows=[];
    for(let i=0;i<bays;i++) {
      const s=(i-(bays-1)/2)*width/bays;
      windows.push({s,y:.9,w:1.65,h:1.9,arch:true},{s,y:4.6,w:2.05,h:3.6});
      if(tall) windows.push({s,y:12,w:2.65,h:12.8,arch:true});
      else windows.push({s,y:12,w:2.2,h:5.1},{s,y:19.3,w:2.2,h:5.3});
    }
    f.wall(width,0,27.3,windows);
    for(const [y,h,d] of [[3.5,.4,.23],[9.3,.6,.38],[10.3,.3,.24],[26.3,.4,.25],[27.3,.7,.5],[28,.5,.65]])f.box('stone',-width/2,width/2,y,y+h,-.2,d);
    if(near) {
      for(let y=.5;y<9;y+=.7)f.box('stone',-width/2,width/2,y,y+.08,0,.08);
      for(let i=0;i<=bays;i++){
        const s=(i-bays/2)*width/bays;
        if(tall){f.box('stone',s-.42,s+.42,11,26.3,-.1,.45);f.box('stone',s-.6,s+.6,25.3,26.3,-.1,.7);}
        else if(i===0||i===bays)f.box('stone',s-.28,s+.28,10.7,26,-.15,.28);
      }
      for(const v of windows.filter(v=>v.y===12&&!v.arch)) f.pediment(v.w+1,17.9,.8,-.05,.3);
      for(let s=-width/2+.7;s<width/2;s+=1)f.box('stone',s-.14,s+.14,26.9,27.3,.17,.48);
    }
  }
  function roof(x0,x1,z0,z1) {
    // Closed hipped roof, pitched to a short longitudinal ridge. No photo textures.
    const p=[x0,28.5,z0,x1,28.5,z0,x1,28.5,z1,x0,28.5,z1,(x0+x1)/2,30.1,z0+3,(x0+x1)/2,30.1,z1-3];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));
    g.setIndex([0,4,1,1,4,5,1,5,2,2,5,3,3,5,4,3,4,0,0,1,2,0,2,3]);g.computeVertexNormals();put(g,'roof');
  }
  // Solid interior stops behind the recessed window panes; facade walls have real holes.
  box('stone',-20.3,18.9,0,27.3,-33.9,34.1);
  box('stone',-25,23.6,0,27.3,-48.2,-35);
  box('stone',-24.9,23.4,0,27.3,35.6,48.4);
  box('stone',-29.7,-20.3,0,27.3,-16.1,16.1);
  box('stone',18.9,24.9,0,27.3,-11.1,11.1);
  // Long west/east wings beside the crossing, with independent window rows in far.
  for(const z of [-25.5,25.6]){
    facade(-21.5,z,Math.PI,17,3);
    facade(20.1,z,0,17,3);
  }
  facade(-31,0,Math.PI,34.2,6);
  facade(26.1,0,0,24.2,4);
  for(const z of [-42.3,42.3]){
    facade(-26.2,z,Math.PI,14.5,3,{tall:true});
    facade(24.8,z,0,14.5,3,{tall:true});
  }
  facade(-.7,-49.4,-Math.PI/2,51,9);
  facade(-.7,49.5,Math.PI/2,50.8,9);
  // Short wing returns close every street-visible corner.
  for(const z of [-34.7,34.9]){
    const phi=z<0?Math.PI/2:-Math.PI/2;
    frame(-23.85,z,phi).wall(4.7,0,28.5,[]);
    frame(22.4,z,phi).wall(4.7,0,28.5,[]);
  }
  for(const z of [-17.1,17.1])frame(-26.25,z,z<0?-Math.PI/2:Math.PI/2).wall(9.5,0,28.5,[]);
  for(const z of [-12.1,12.1])frame(23.1,z,z<0?-Math.PI/2:Math.PI/2).wall(6,0,28.5,[]);
  roof(-21.3,19.9,-34.5,34.7);roof(-26,24.6,-49.2,-34.9);roof(-26,24.6,35.1,49.3);
  roof(-30.8,-21.3,-16.9,16.9);roof(19.9,25.9,-11.9,11.9);

  // West portico: six square rusticated piers, six free Corinthian shafts and a pediment.
  box('stone',-42.2,-31,9.3,10.5,-12.1,12.1);
  const zs=[-10,-6,-2,2,6,10];
  for(const z of zs) {
    box('stone',-41.9,-39.2,0,9.3,z-1.15,z+1.15);
    cylinder('stone',-40.55,z,1.15,1.02,10.5,11.1,near?12:6);
    cylinder('stone',-40.55,z,.87,.75,11.1,25.5,near?12:6);
    cylinder('stone',-40.55,z,.86,1.25,25.5,26.3,near?12:6);
    box('stone',-41.9,-39.2,26.3,26.9,z-1.35,z+1.35);
    if(near){
      for(let y=.5;y<9;y+=.65)box('stone',-42.05,-41.9,y,y+.1,z-1.15,z+1.15);
      // Grouped capital leaf/volute masses, connected to the shaft.
      for(const dx of [-.7,.7])for(const dz of [-.7,.7])cylinder('stone',-40.55+dx,z+dz,.29,.42,25.4,26.25,6);
    }
  }
  box('stone',-42.25,-31,26.9,29.3,-12.25,12.25);
  const west=frame(-42.25,0,Math.PI);west.pediment(24.5,29.3,5.1,-10.8,.15);
  // Original seal and seated agriculture/commerce silhouettes are abbreviated relief.
  if(near){
    const seal=new THREE.CylinderGeometry(1.2,1.2,.28,16);seal.rotateX(Math.PI/2);seal.translate(0,31.3,.4);put(seal,'stone',west.M);
    for(const s of [-3.2,3.2]){
      west.box('stone',s-.9,s+.9,29.8,30.3,.16,.7);
      west.box('stone',s-.3,s+.3,30.25,31.1,.2,.6);
      const head=new THREE.SphereGeometry(.26,8,5).translate(s,31.32,.5);put(head,'stone',west.M);
    }
  }
  // Approach has a grounded, continuous flight; basement arcade remains open under porch.
  const n=near?22:8;
  for(let i=0;i<n;i++)box('stone',-47.4+i*5.2/n,-42.2,0,9.3*(i+1)/n,-8.4,8.4);

  // Smaller two-column porches on the other three entrances, retained in far.
  function smallPorch(x,z,phi,width,depth) {
    const f=frame(x,z,phi);
    f.box('stone',-width/2,width/2,0,3,-depth,0);
    f.box('stone',-width/2,width/2,10,11,-depth,0);
    for(const s of [-width/2+1,width/2-1]){
      f.box('stone',s-.7,s+.7,3,9.7,-1.8,-.4);
      f.box('stone',s-.9,s+.9,9.7,10,-1.9,-.3);
    }
    f.pediment(width,11,2.2,-depth,0);
  }
  smallPorch(35.1,0,0,16,9);
  smallPorch(-.6,-50.5,-Math.PI/2,24,1.1);
  smallPorch(-.6,51,Math.PI/2,16,1.5);
  for(let i=0;i<(near?9:4);i++){
    const n=near?9:4;
    box('stone',26.1,36.1-i/n,0,3*(i+1)/n,-7.3,7.3);
    box('stone',-7,6.2,0,3*(i+1)/n,51,55.9-i*4.8/n);
  }
}
