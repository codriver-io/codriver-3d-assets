import * as THREE from 'three';
import { PLAN } from './texas-state-capitol-plan.js';
export function buildBody(k) {
  const {near,put,box,bar,polygon,window,column,hip,pediment,cylinder}=k;
  const gap=near?.25:.4;
  function facade(ring,levels) {
    const area=ring.reduce((a,p,i)=>{const q=ring[(i+1)%ring.length];return a+p[0]*q[1]-q[0]*p[1];},0);
    for(let i=0;i<ring.length;i++) {
      const [ax,az]=ring[i], [bx,bz]=ring[(i+1)%ring.length];
      const dx=bx-ax,dz=bz-az,len=Math.hypot(dx,dz);
      if(len<3.1)continue;
      const nx=dz/len*Math.sign(area),nz=-dx/len*Math.sign(area),a=Math.atan2(nx,nz);
      const n=Math.max(1,Math.floor(len/3.7));
      for(let j=0;j<n;j++) {
        const t=(j+.5)/n,x=ax+dx*t+nx*gap,z=az+dz*t+nz*gap;
        for(const [y,h,arch] of levels) {
          const w=Math.min(1.9,len/n*.53);
          if(near&&!arch) {
            // Two glazing quads leave a real stone-coloured mullion gap.
            const tx=Math.cos(a),tz=-Math.sin(a);
            window('light',x-tx*w*.27,y,z-tz*w*.27,w*.44,h,a);
            window('light',x+tx*w*.27,y,z+tz*w*.27,w*.44,h,a);
          } else window('light',x,y,z,w,h,a,arch);
          if(near&&y>=22.5) {
            const tx=Math.cos(a),tz=-Math.sin(a),off=-.15;
            bar('stone',[x-tx*w*.65+nx*off,y-.22,z-tz*w*.65+nz*off],[x+tx*w*.65+nx*off,y-.22,z+tz*w*.65+nz*off],.22,.4);
            if(!arch)bar('stone',[x-tx*w*.65+nx*off,y+h+.2,z-tz*w*.65+nz*off],[x+tx*w*.65+nx*off,y+h+.2,z+tz*w*.65+nz*off],.24,.45);
          }
        }
      }
      // Continuous courses survive far; the cornice has a projecting upper lip.
      for(const y of (near?[6.6,21.2,25.7]:[25.7]))bar('stone',[ax+nx*.16,y,az+nz*.16],[bx+nx*.16,y,bz+nz*.16],.8,.8);
      if(near)bar('stone',[ax+nx*.1,26.15,az+nz*.1],[bx+nx*.1,26.15,bz+nz*.1],.7,.7);
      // Giant pilasters sit BETWEEN bays, with separate broad capitals.
      if(len>12)for(const j of (near?[0,n]:[0])) {
        const t=j/n,x=ax+dx*t,z=az+dz*t;
        for(const [y,w,h,d] of [[16.2,.9,18,.8],[7.6,1.05,.6,.9],[25.15,1.05,.7,.9]]) {
          const g=near?new THREE.BoxGeometry(w,h,d):new THREE.PlaneGeometry(w,h);if(!near)g.translate(0,0,d/2);g.rotateY(a);g.translate(x,y,z);put(g,'stone');
        }
      }
    }
  }
  // Stepped Senate/House wing outlines with grounded rusticated basements.
  for(const id of ['1364720759','1364720760']) {
    const ring=PLAN[id].map(([x,z])=>[x*.995,z*.995]);
    polygon('stone',ring,0,26.2);
    facade(ring,[[1.3,3.8,true],[8.1,4.7,false],[15.0,4.7,false],[22.5,2.0,false]]);
  }
  // Closed hipped chamber/link roofs stay inboard of the measured outline.
  for(const s of [-1,1]) {
    hip('roof',s*39.6,-1.3,31.8,30.2,26.4,28.2,27,25);
    hip('roof',s*67.5,-1.3,21.8,52.5,26.4,28.8,18,44);
    hip('roof',s*80.2,-1.0,5.4,23.0,26.4,27.7,3.8,19);
    for(const z of [-18.5,16.0]) {
      box('stone',s*67.4,27.65,z,23.0,2.9,16.8);
      box('stone',s*67.4,29.4,z,23.6,.6,17.4);
      hip('roof',s*67.4,z,22.5,16.5,29.75,32,15.5,10.7);
      box('stone',s*67.4,32.25,z,16.1,.5,11.3);
      cylinder('stone',s*67.4,z,.45,32.4,34.4,.08,near?8:5);
      for(const side of [-1,1])for(const xx of [-7.7,0,7.7])
        window('light',s*67.4+xx,27,z+side*(8.4+gap),1.65,1.3,side===1?0:Math.PI);
      // Giant-order pilasters at the corners of the pavilion, not box clutter at grade.
      for(const side of [-1,1])for(const xx of [-10.4,-7.7,7.7,10.4])
        {box('stone',s*67.4+xx,16.4,z+side*8.7,1.1,16.2,1.1);
        box('stone',s*67.4+xx,25.15,z+side*8.7,1.75,.6,1.3);}
    }
  }
  // Rotunda block, rear wing and tall south-front entrance block.
  const core=[[-23,-16.8],[23,-16.8],[23,16],[-23,16]];
  polygon('stone',core,0,33.7);
  facade(core,[[1.3,3.8,true],[8.1,4.7,false],[15,4.7,false],[23,3.2,false],[30.2,2.2,false]]);
  const north=[[-20.6,-46.9],[20.6,-46.9],[20.6,-20.5],[-20.6,-20.5]];
  polygon('stone',north,0,33.7);
  facade(north,[[1.3,3.8,true],[8.1,4.7,false],[15,4.7,false],[23,3.2,false],[30.2,2.2,false]]);
  box('stone',0,16.8,-18,26,33.6,4.5);
  hip('roof',0,-34,39.5,25.5,34.1,35.8,32,24);
  box('stone',0,17.5,22.4,35.6,35,14.2);
  // South arch recess: two side piers plus a curved spandrel leave an actual 11m opening.
  box('stone',-11.9,13,33.1,12.8,26,6.4);
  box('stone',11.9,13,33.1,12.8,26,6.4);
  const sp=new THREE.Shape();sp.moveTo(-18.3,26);sp.lineTo(-18.3,35);sp.lineTo(18.3,35);sp.lineTo(18.3,26);sp.lineTo(5.5,26);sp.lineTo(5.5,19.8);
  for(let j=0;j<= (near?20:10);j++){const t=j*Math.PI/(near?20:10);sp.lineTo(5.5*Math.cos(t),19.8+5.5*Math.sin(t));}
  sp.lineTo(-5.5,26);sp.closePath();
  const arch=new THREE.ExtrudeGeometry(sp,{depth:6.4,bevelEnabled:false});arch.translate(0,0,29.9);put(arch,'stone');
  const surround=new THREE.Shape();
  for(let j=0;j<=(near?20:10);j++){const t=j*Math.PI/(near?20:10),r=6.25;const x=r*Math.cos(t),y=19.8+r*Math.sin(t);j?surround.lineTo(x,y):surround.moveTo(x,y);}
  for(let j=(near?20:10);j>=0;j--){const t=j*Math.PI/(near?20:10);surround.lineTo(5.5*Math.cos(t),19.8+5.5*Math.sin(t));}surround.closePath();
  const rim=new THREE.ExtrudeGeometry(surround,{depth:1.0,bevelEnabled:false});rim.translate(0,0,36);put(rim,'stone');
  for(const sign of [-1,1])box('stone',sign*5.87,13.6,36.5,.75,12.4,1.0);
  window('light',0,.8,30.15,7.2,6.5,0,true);
  window('light',0,10.0,30.15,7.2,5.2);
  window('light',0,18.4,30.15,7.2,5.4,0,true);
  box('stone',0,8.0,32.5,10.8,.65,4.9);
  box('stone',0,16.8,32.5,10.8,.65,4.9);
  // Windows flank the south arch and continue over the recess.
  for(const x of [-15,-11.2,11.2,15])for(const [y,h] of [[1.3,3.8],[8.3,4.5],[15.2,4.8],[23.2,3.2],[30.1,2.0]])window('light',x,y,36.3+gap,1.8,h,0,y<5);
  for(const x of [-3.7,0,3.7])for(const [y,h] of [[30.1,2]])window('light',x,y,36.3+gap,1.8,h);
  for(const x of [-16.8,-8.1,8.1,16.8])column(x,36.3,7.4,26.6,.84);
  for(const y of [6.8,27.2,29.2,35.1])box('stone',0,y,33.0,37.1,1,8.0);
  // Six historic-state seal roundels, kept blue-grey and small.
  for(let i=0;i<6;i++) {
    const g=new THREE.CircleGeometry(.63,near?16:8);g.translate(-8.75+i*3.5,32.6,36.6+gap);put(g,'seal');
  }
  pediment(0,36.2,31.6,35.7,42.2,3);
  // Recessed pediment oculus.
  {const g=new THREE.CircleGeometry(.8,near?16:8);g.translate(0,38.5,36.4+gap);put(g,'light');}
  // Grounded entrance steps, fully within the south outline.
  const n=near?8:4;
  for(let i=0;i<n;i++)box('stone',0,(i+1)*.12,36.0-i*.34,10.8,(i+1)*.24,.75);
  // North six-column porch, with open intercolumn bays and roof support.
  box('stone',0,2.8,-49.05,17.8,5.6,4.2);
  box('stone',0,5.7,-49.05,18.1,.4,4.4);
  for(let i=0;i<6;i++)column(-7.6+i*3.04,-50.65,5.9,26.5,.6);
  box('stone',0,27.4,-48.9,18.3,1.8,5.1);
  box('stone',0,30.8,-48.9,18.3,5,5.1);
  for(let i=0;i<5;i++)window('light',-6.1+i*3.05,29.9,-51.45-gap,1.45,2.1,Math.PI);
  box('stone',0,33.9,-48.9,18.5,1.2,5.3);
  // North pediment faces north; constructing in the local north-facing frame.
  const shape=new THREE.Shape([new THREE.Vector2(-12,35),new THREE.Vector2(12,35),new THREE.Vector2(0,40.5)]);
  const g=new THREE.ExtrudeGeometry(shape,{depth:2.5,bevelEnabled:false});g.rotateY(Math.PI);g.translate(0,0,-44.6);put(g,'stone');
  box('stone',0,34.2,-34,42,1,26);
  box('stone',0,34.2,0,46.5,1,32.8);
}
