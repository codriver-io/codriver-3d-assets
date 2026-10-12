import * as THREE from 'three';
// Independent original shape kit: walls have real holes, glazing lies behind them.
export function parts(b, near) {
  const put = (g,m) => { g.computeVertexNormals(); b.put(g,m,0,0); };
  const n = near ? 6 : 3;
  const arch = (w,h) => {
    const pts=[[-w/2,0],[w/2,0],[w/2,h-w*0.6]];
    for(let i=1;i<=n;i++)pts.push([w/2*(1-i/n),h-w*0.6+w*0.6*Math.sin(i/n*Math.PI/2)]);
    for(let i=n-1;i>=0;i--)pts.push([-w/2*(1-i/n),h-w*0.6+w*0.6*Math.sin(i/n*Math.PI/2)]);
    return pts;
  };
  const shape = pts => new THREE.Shape(pts.map(p=>new THREE.Vector2(...p)));
  function wall(a,c,y0,y1,holes=[],mat='brick') {
    const dx=c[0]-a[0], dz=c[1]-a[1], len=Math.hypot(dx,dz);
    const ux=dx/len, uz=dz/len, nx=uz, nz=-ux;
    const transform=(g, inset=0) => {
      const p=g.attributes.position;
      for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setXYZ(i,a[0]+ux*x-nx*inset,y,a[1]+uz*x-nz*inset);}
      const idx=g.index; for(let i=0;i<idx.count;i+=3){const t=idx.getX(i+1);idx.setX(i+1,idx.getX(i+2));idx.setX(i+2,t);}
      return g;
    };
    const s=shape([[0,y0],[len,y0],[len,y1],[0,y1]]);
    for(const h of holes){
      const pts=(h.round ? Array.from({length:near?24:12},(_,i)=>[Math.cos(i/(near?24:12)*Math.PI*2)*h.w/2,Math.sin(i/(near?24:12)*Math.PI*2)*h.w/2]) : arch(h.w,h.h)).map(([x,y])=>[x+h.x,y+h.y]);
      s.holes.push(new THREE.Path(pts.map(p=>new THREE.Vector2(...p)).reverse()));
      const panel=transform(new THREE.ShapeGeometry(shape(pts)),0.22);
      put(panel,h.mat||'glass');
      if(near&&!h.round){for(let k=1;k<(h.div||3);k++){
        const xx=h.x-h.w/2+h.w*k/(h.div||3);
        b.bar('trim',[a[0]+ux*xx-nx*0.08,h.y,a[1]+uz*xx-nz*0.08],[a[0]+ux*xx-nx*0.08,h.y+h.h-h.w*0.65,a[1]+uz*xx-nz*0.08],0.12);
      }}
    }
    put(transform(new THREE.ShapeGeometry(s)) ,mat);
    return {ux,uz,nx,nz,len,transform};
  }
  function shell(ring,y0,y1,windows) {
    for(let i=0;i<ring.length;i++) wall(ring[i],ring[(i+1)%ring.length],y0,y1,windows?.(i,ring[i],ring[(i+1)%ring.length])||[]);
  }
  function polygon(points,mat) {
    if(mat==='roof'){const a=new THREE.Vector3(...points[0]),c=new THREE.Vector3(...points[1]).sub(a),d=new THREE.Vector3(...points[2]).sub(a);if(c.cross(d).y<0)points=[...points].reverse();}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));
    g.setIndex(Array.from({length:points.length-2},(_,i)=>[0,i+1,i+2]).flat());put(g,mat);
  }
  function dome(x,z,dy) {
    const profile=[[0,90.7],[6.5,90.7],[7.5,91.1],[7.8,92.0],[7.5,93.8],[6.4,95.5],[4.6,96.9],[2.2,97.85],[0.35,98.15],[0,98.2]];
    const g=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y+dy)),near?32:16);
    g.translate(x,0,z);put(g,'copper');
    if(near)for(let j=0;j<24;j++){
      const t=j/24*Math.PI*2;
      for(let k=2;k<profile.length-2;k++){
        const [r0,y0]=profile[k], [r1,y1]=profile[k+1];
        b.bar('copper',[x+Math.cos(t)*(r0+.04),y0+dy,z+Math.sin(t)*(r0+.04)],[x+Math.cos(t)*(r1+.04),y1+dy,z+Math.sin(t)*(r1+.04)],.09);
      }
    }
    b.box('trim',[x,98.385+dy,z],[.18,.37,.18]);
  }
  return {put,wall,shell,polygon,dome};
}
