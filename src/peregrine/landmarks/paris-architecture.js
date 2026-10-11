// Original architectural detailing primitives, metres. MIT / Codriver 2026.
// Every part goes through the caller's material batch; no draw per opening.
import * as THREE from 'three';

export function architecture(put, near = true) {
  const place = (geometry, material, x=0, y=0, z=0, yaw=0) => {
    geometry.rotateY(yaw); geometry.translate(x,y,z); put(geometry,material);
  };
  const box = (m,x,y,z,w,h,d,yaw=0) => place(new THREE.BoxGeometry(w,h,d),m,x,y,z,yaw);
  const bar = (m,a,b,r=.15) => {
    const p=new THREE.Vector3(...a),q=new THREE.Vector3(...b),v=q.clone().sub(p);
    if(v.length()<1e-5)return;
    // Open ends: every joint hides them, and closed caps doubled the cost of each bar.
    const g=new THREE.CylinderGeometry(r,r,v.length(),near?6:4,1,true);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));
    place(g,m,...p.add(q).multiplyScalar(.5).toArray());
  };
  // Front is +Z; yaw makes the same opening usable on all four elevations.
  function opening(m,x,y,z,w,h,{yaw=0,pointed=false,depth=.12}={}) {
    const r=w/2,spring=pointed?h-w*.8:h-r,shape=new THREE.Shape();
    shape.moveTo(-r,0);shape.lineTo(r,0);shape.lineTo(r,spring);
    if(pointed){shape.quadraticCurveTo(r*.75,h*.86,0,h);shape.quadraticCurveTo(-r*.75,h*.86,-r,spring);}
    else shape.absarc(0,spring,r,0,Math.PI,false);
    shape.lineTo(-r,0);shape.closePath();
    // Glazing is a recessed face. Giving each pane an invisible extruded back
    // multiplies a long palace's export without improving its street silhouette.
    place(new THREE.ShapeGeometry(shape,near?8:4),m,x,y,z,yaw);
  }
  function arch(m,x,y,z,w,rise,thickness=.3,depth=.4,yaw=0) {
    const s=new THREE.Shape(),n=near?12:6;
    for(let i=0;i<=n;i++){const a=Math.PI*i/n;const px=(w/2+thickness)*Math.cos(a),py=(rise+thickness)*Math.sin(a);if(!i)s.moveTo(px,py);else s.lineTo(px,py);}
    for(let i=n;i>=0;i--){const a=Math.PI*i/n;s.lineTo(w/2*Math.cos(a),rise*Math.sin(a));}
    s.closePath();place(new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false}),m,x,y,z,yaw);
  }
  function window(x,y,z,w,h,{yaw=0,stone='stone',glass='glass',arched=true,pointed=false,mullions=true}={}) {
    const local=(u,v,d)=>[x+u*Math.cos(yaw)+d*Math.sin(yaw),y+v,z-u*Math.sin(yaw)+d*Math.cos(yaw)];
    if(arched)opening(glass,x,y,z,w,h,{yaw,pointed});else box(glass,...local(0,h/2,0),w,h,.16,yaw);
    const t=near?.20:.24;
    for(const side of [-1,1])box(stone,...local(side*(w/2+t/2),h*.43,.14),t,h*.86,.32,yaw);
    box(stone,...local(0,-.15,.18),w+.7,.3,.6,yaw);
    if(arched&&!pointed)arch(stone,...local(0,h-w/2,.14),w,w/2,t,.25,yaw);
    else if(!arched)box(stone,...local(0,h+.14,.12),w+.5,.28,.35,yaw);
    if(near&&mullions){box(stone,...local(0,h*.45,.2),.10,h*.9,.14,yaw);box(stone,...local(0,h*.4,.2),w,.12,.14,yaw);}
  }
  function column(m,x,y,z,r,h,segments=near?12:8) {
    // Entasis and stacked base/capital read clearly without sculpted leaves.
    const points=[[1.25,0],[1.25,.035],[1.05,.065],[.94,.09],[.9,.25],[.83,.82],[.8,.9],[1.05,.93],[1.25,.97],[1.25,1]].map(([a,b])=>new THREE.Vector2(a*r,b*h));
    place(new THREE.LatheGeometry(points,segments),m,x,y,z);
    box(m,x,y+h,z,r*2.7,h*.025,r*2.7);
  }
  function dome(m,x,y,z,r,h,{ribs=0,ribMaterial=m,profile}={}) {
    const p=profile||[[1,0],[1,.06],[.98,.20],[.90,.42],[.73,.64],[.48,.84],[.18,.97],[0,1]];
    place(new THREE.LatheGeometry(p.map(([u,v])=>new THREE.Vector2(u*r,v*h)),near?40:20),m,x,y,z);
    if(ribs)for(let k=0;k<ribs;k++){
      const a=k*2*Math.PI/ribs;
      for(let i=1;i<p.length;i++)bar(ribMaterial,[x+(p[i-1][0]*r+.06)*Math.cos(a),y+p[i-1][1]*h,z+(p[i-1][0]*r+.06)*Math.sin(a)],[x+(p[i][0]*r+.06)*Math.cos(a),y+p[i][1]*h,z+(p[i][0]*r+.06)*Math.sin(a)],near?.14:.2);
    }
  }
  function mansard(m,x,y,z,w,d,h) {
    const shape=new THREE.BufferGeometry(),p=[],idx=[];
    for(const [yy,ww,dd] of [[0,w,d],[h*.72,w*.77,d*.67],[h,w*.62,d*.15]])
      for(const [u,v] of [[-1,-1],[1,-1],[1,1],[-1,1]])p.push(x+u*ww/2,y+yy,z+v*dd/2);
    for(let l=0;l<2;l++)for(let j=0;j<4;j++){const a=l*4+j,b=l*4+(j+1)%4;idx.push(a,a+4,b,b,a+4,b+4);}
    idx.push(8,11,9,9,11,10);shape.setAttribute('position',new THREE.Float32BufferAttribute(p,3));shape.setIndex(idx);shape.computeVertexNormals();put(shape,m);
  }
  function balustrade(m,x,y,z,w,yaw=0) {
    box(m,x,y+1.2,z,w,.25,.65,yaw);box(m,x,y,z,w,.23,.6,yaw);
    const profile=[[.12,0],[.19,.2],[.12,.58],[.18,.87],[.12,1.1]].map(p=>new THREE.Vector2(...p));
    for(let u=-w/2;u<=w/2;u+=near?1.1:2.8)
      place(new THREE.LatheGeometry(profile,near?6:4),m,x+u*Math.cos(yaw),y,z-u*Math.sin(yaw));
  }
  function clock(x,y,z,r,{yaw=0,face='clock',rim='stoneDark',hands='iron'}={}) {
    // Small dials do not need a 40-gon: segment count follows the radius.
    const seg=near?(r>2?40:r>1?24:12):(r>2?20:10);
    for(const [rr,depth,mat,offset] of [[r+.35,.3,rim,0],[r,.12,face,.18]]){
      const g=new THREE.CylinderGeometry(rr,rr,depth,seg);g.rotateX(Math.PI/2);place(g,mat,x+offset*Math.sin(yaw),y,z+offset*Math.cos(yaw),yaw);
    }
    const p=(u,v)=>[x+u*Math.cos(yaw)+.3*Math.sin(yaw),y+v,z-u*Math.sin(yaw)+.3*Math.cos(yaw)];
    for(let i=0;i<12;i++){const a=i*Math.PI/6;bar(hands,p(Math.sin(a)*r*.76,Math.cos(a)*r*.76),p(Math.sin(a)*r*.88,Math.cos(a)*r*.88),r*.018);}
    bar(hands,p(0,0),p(r*.48,r*.2),r*.027);bar(hands,p(0,0),p(-r*.15,r*.7),r*.023);
  }
  return {place,box,bar,opening,arch,window,column,dome,mansard,balustrade,clock};
}
