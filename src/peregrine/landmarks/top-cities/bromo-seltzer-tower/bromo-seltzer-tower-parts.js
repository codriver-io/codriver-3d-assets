import * as THREE from 'three';
// South-edge OSM control points [-76.6206939,39.2876061] -> [-76.6205450,39.2876112].
export const THETA = 2.5339 * Math.PI / 180;
export function world([x,y,z]) {return [x*Math.cos(THETA)+z*Math.sin(THETA),y,-x*Math.sin(THETA)+z*Math.cos(THETA)];}
export function makeKit(b, near) {
  function face(g,mat,a=0,d=0) {g.translate(0,0,d);g.rotateY(a);b.put(g,mat);}
  function rect(mat,u,y,w,h,d,a=0) {const g=new THREE.PlaneGeometry(w,h);g.translate(u,y,0);face(g,mat,a,d);}
  function wall(mat,w,bottom,top,d,a=0,holes=[]) {
    const s=new THREE.Shape();s.moveTo(-w/2,bottom);s.lineTo(w/2,bottom);s.lineTo(w/2,top);s.lineTo(-w/2,top);s.closePath();
    for(const hole of holes)s.holes.push(hole);
    face(new THREE.ExtrudeGeometry(s,{depth:.55,bevelEnabled:false,curveSegments:near?12:6}),mat,a,d-.55);
  }
  function arch(u,bottom,w,spring) {
    const p=new THREE.Path(),r=w/2;p.moveTo(u-r,bottom);p.lineTo(u-r,spring);p.absarc(u,spring,r,Math.PI,0,true);p.lineTo(u+r,bottom);p.closePath();return p;
  }
  function ring(mat,inner,outer,y,d,a=0) {const g=new THREE.RingGeometry(inner,outer,near?64:32);g.translate(0,y,0);face(g,mat,a,d);}
  function disk(mat,r,y,d,a=0) {const g=new THREE.CircleGeometry(r,near?64:32);g.translate(0,y,0);face(g,mat,a,d);}
  function line(mat,pts,w,d,a=0) {
    for(let i=1;i<pts.length;i++) {
      const [x,y]=pts[i-1],[xx,yy]=pts[i],dx=xx-x,dy=yy-y,len=Math.hypot(dx,dy);if(len<1e-6)continue;
      const g=new THREE.PlaneGeometry(w,len);g.rotateZ(-Math.atan2(dx,dy));g.translate((x+xx)/2,(y+yy)/2,0);face(g,mat,a,d);
    }
  }
  const glyphs={
    B:[[-.24,-.38],[-.24,.38],[.02,.38],[.20,.31],[.24,.19],[.17,.05],[-.24,0],[.03,0],[.24,-.10],[.24,-.26],[.08,-.38],[-.24,-.38]],
    R:[[-.24,-.38],[-.24,.38],[.03,.38],[.22,.27],[.22,.11],[.04,0],[-.24,0],[.04,0],[.26,-.38]],
    O:Array.from({length:near?21:13},(_,i)=>{const a=i/(near?20:12)*Math.PI*2;return [.24*Math.cos(a),.38*Math.sin(a)];}),
    M:[[-.28,-.38],[-.28,.38],[0,-.06],[.28,.38],[.28,-.38]],
    S:[[.23,.30],[.12,.38],[-.10,.38],[-.24,.25],[-.23,.10],[-.10,.02],[.12,-.04],[.24,-.17],[.22,-.28],[.10,-.38],[-.12,-.38],[-.24,-.28]],
    E:[[.24,.38],[-.24,.38],[-.24,-.38],[.24,-.38]], L:[[-.24,.38],[-.24,-.38],[.24,-.38]], T:[[-.27,.38],[.27,.38]],
    Z:[[-.24,.38],[.24,.38],[-.24,-.38],[.24,-.38]], I:[[0,-.38],[0,.38]], V:[[-.24,.38],[0,-.38],[.24,.38]], X:[[-.24,.38],[.24,-.38]],
  };
  function letter(ch,x,y,rot,d,a=0,scale=1,mat='metal') {
    const transform=pts=>pts.map(([u,v])=>[x+scale*(u*Math.cos(rot)-v*Math.sin(rot)),y+scale*(u*Math.sin(rot)+v*Math.cos(rot))]);
    line(mat,transform(glyphs[ch]),near?.055:.065,d,a);
    if(ch==='E')line(mat,transform([[-.24,0],[.16,0]]),.055,d,a);
    if(ch==='T')line(mat,transform([[0,.38],[0,-.38]]),.055,d,a);
    if(ch==='X')line(mat,transform([[-.24,-.38],[.24,.38]]),.055,d,a);
  }
  return {face,rect,wall,arch,ring,disk,line,letter};
}
