import * as THREE from 'three';
import { PARTS } from './tower-of-london-plan.js';
import { frame } from './tower-of-london-masonry.js';

export function stairParts(detail='near') {
  const F=frame(PARTS.find(p=>p.id===369135775).ring),count=detail==='near'?19:10;
  const len=F.u1-F.u0,vm=(F.v0+F.v1)/2,angle=-Math.atan2(F.t[1],F.t[0]),parts=[];
  const box=(name,u,v,y,w,h,d)=>{
    const geometry=new THREE.BoxGeometry(w,h,d);geometry.rotateY(angle);geometry.translate(...F.at(u,v,y));parts.push({name,geometry});
  };
  for(let i=0;i<count;i++) {
    const top=.2+5.25*i/(count-1),u=F.u0+(i+.5)*len/count;
    box('tread-'+i,u,vm,top-.1,len/count,.2,2.2);
  }
  // Two continuous deep stringers: their sloping upper edges meet every
  // tread underside. The feet terminate at grade; heads embed in the landing.
  for(const side of [-1,1]) {
    const sections=[[F.u0,0],[F.u0+len/(2*count),0],[F.u1-len/(2*count),5.25],[F.u1,5.45]],pos=[];
    const v=vm+side*.83,w=.16;
    const tri=(a,b,c)=>pos.push(...a,...b,...c),quad=(a,b,c,d)=>{tri(a,b,c);tri(a,c,d);};
    for(let i=0;i<sections.length-1;i++) {
      const [u0,y0]=sections[i],[u1,y1]=sections[i+1],b0=Math.max(0,y0-.38),b1=Math.max(0,y1-.38);
      const a=F.at(u0,v-w,y0),b=F.at(u1,v-w,y1),c=F.at(u1,v+w,y1),d=F.at(u0,v+w,y0);
      const e=F.at(u0,v-w,b0),f=F.at(u1,v-w,b1),g=F.at(u1,v+w,b1),h=F.at(u0,v+w,b0);
      quad(a,d,c,b);quad(e,f,g,h);quad(e,a,b,f);quad(h,g,c,d);
      if(i===0)quad(e,h,d,a);if(i===sections.length-2)quad(f,b,c,g);
    }
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geometry.computeVertexNormals();parts.push({name:'stringer-'+side,geometry});
  }
  // Extend the landing across the full stringer heads and into the door.
  const landing=new THREE.BoxGeometry(2.3,.2,4.4);landing.rotateY(-.108);landing.translate(-11,5.55,15.9);parts.push({name:'landing',geometry:landing});
  for(const x of [-11.8,-10.2]) {
    const geometry=new THREE.BoxGeometry(.2,5.45,.2);geometry.translate(x,2.725,16.2);parts.push({name:'landing-post-'+x,geometry});
  }
  return parts;
}
