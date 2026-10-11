import * as THREE from 'three';

export function kit(b, near) {
  const segments=near?10:6;
  const box=(mat,x0,x1,y0,y1,z0,z1)=>b.box(mat,[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],[x1-x0,y1-y0,z1-z0]);
  function cylinder(mat,x,z,y0,y1,r0,r1=r0,n=segments) {
    const g=new THREE.CylinderGeometry(r1,r0,y1-y0,n,1,true);g.translate(x,(y0+y1)/2,z);b.put(g,mat);
    // No buried ground cap or plinth cap where the shaft begins below y=5.
    if(r1>0 && Math.abs(y1-5)>.01) {const cap=new THREE.CircleGeometry(r1,n);cap.rotateX(-Math.PI/2);cap.translate(x,y1,z);b.put(cap,mat);}
  }
  function loft(mat,ring0,ring1,y0,y1,cap=true) {
    // Ring is CCW in x/z. Independent face vertices keep brick corners crisp.
    const positions=[],indices=[];
    const tri=(a,c,d)=>{let i=positions.length/3;positions.push(...a,...c,...d);indices.push(i,i+1,i+2);};
    for(let i=0;i<ring0.length;i++) {
      const j=(i+1)%ring0.length,a=[ring0[i][0],y0,ring0[i][1]],c=[ring0[j][0],y0,ring0[j][1]],d=[ring1[i][0],y1,ring1[i][1]],e=[ring1[j][0],y1,ring1[j][1]];
      tri(a,d,c);tri(c,d,e);
    }
    if(cap) {
      const shape=ring1.map(q=>new THREE.Vector2(...q));
      for(const [a,c,d] of THREE.ShapeUtils.triangulateShape(shape,[]))tri([ring1[a][0],y1,ring1[a][1]],[ring1[d][0],y1,ring1[d][1]],[ring1[c][0],y1,ring1[c][1]]);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();b.put(g,mat);
  }
  function archPoints(w,h,pointed=true) {
    const spring=pointed?h-w*.65:h-w/2,p=[[-w/2,0],[-w/2,spring]],n=near?5:3;
    for(let i=1;i<=n;i++) { const t=i/n,x=-w/2+w*t;const y=pointed?spring+(h-spring)*Math.sin(Math.PI*t):spring+Math.sqrt(Math.max(0,w*w/4-x*x));p.push([x,y]); }
    p.push([w/2,0]);return p;
  }
  function panel(mat,x,y,z,w,h,angle=0,pointed=true) {
    const s=new THREE.Shape(archPoints(w,h,pointed).map(p=>new THREE.Vector2(...p)));
    const g=new THREE.ExtrudeGeometry(s,{depth:.12,bevelEnabled:false,curveSegments:near?8:4});g.rotateY(angle);g.translate(x,y,z);b.put(g,mat);
  }
  function arch(mat,x,y,z,w,h,width=.2,angle=0,pointed=true) {
    const pp=archPoints(w,h,pointed), positions=[],indices=[];
    const xy=([u,v],d)=>[x+u*Math.cos(angle)+d*Math.sin(angle),y+v,z-u*Math.sin(angle)+d*Math.cos(angle)];
    // Continuous rectangular ribbon, indexed once: no buried caps at every curve sample.
    for(let i=0;i<pp.length;i++) {
      const prev=pp[Math.max(0,i-1)],next=pp[Math.min(pp.length-1,i+1)],dx=next[0]-prev[0],dy=next[1]-prev[1],len=Math.hypot(dx,dy),nx=-dy/len*width/2,ny=dx/len*width/2;
      for(const d of [-width/2,width/2])for(const side of [-1,1])positions.push(...xy([pp[i][0]+nx*side,pp[i][1]+ny*side],d));
      if(i) {const a=(i-1)*4,c=i*4;indices.push(a,c,a+1,a+1,c,c+1,a+2,a+3,c+2,a+3,c+3,c+2,a,a+2,c,a+2,c+2,c,a+1,c+1,a+3,a+3,c+1,c+3);}
    }
    const j=(pp.length-1)*4;indices.push(0,1,2,1,3,2,j,j+2,j+1,j+1,j+2,j+3);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices.flatMap((_,i)=>i%3===0?[indices[i],indices[i+2],indices[i+1]]:[]));g.computeVertexNormals();b.put(g,mat);
  }
  function ring(mat,x,y,z,r,thickness=.07,n=near?8:5) {
    const g=new THREE.CylinderGeometry(r,r,thickness,n,1,true);g.translate(x,y,z);b.put(g,mat);
  }
  function gable(mat,x,z,w,y0,eave,peak,depth) {
    const shape=new THREE.Shape([new THREE.Vector2(-w/2,y0),new THREE.Vector2(w/2,y0),new THREE.Vector2(w/2,eave),new THREE.Vector2(0,peak),new THREE.Vector2(-w/2,eave)]);
    const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false});g.translate(x,0,z);b.put(g,mat);
  }
  function pin(x,z,y0,y1,r,mat='stone') {
    cylinder(mat,x,z,y0,y1-2,r,r*.65,near?8:5);cylinder(mat,x,z,y1-2,y1,r*.9,0,near?8:5);
    if(near)for(let y=y0+1;y<y1-1;y+=1.1)for(let a=0;a<4;a++) {
      const t=a*Math.PI/2;b.bar(mat,[x+Math.cos(t)*r*.7,y,z+Math.sin(t)*r*.7],[x+Math.cos(t)*r*1.6,y+.3,z+Math.sin(t)*r*1.6],.16);
    }
  }
  return {b,near,segments,box,cylinder,loft,panel,arch,ring,pin,gable};
}
