import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './braselton-brothers-store-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const{rect,prism,wall,cap,face,flush}=t,ring=[[-27.03836113821061,28.503557088412837],[-5.083164949013634,28.511094889735975],[-4.554265986811519,10.752767326348861],[38.91124000043993,10.51853304228635],[33.67977621360203,-19.75869542098318],[-25.69297168474187,-19.202066946403747]];
 // Exact mapped perimeter, with facade skin supplied once on the southwest side.
 for(let i=0;i<ring.length-1;i++){const a=ring[i],c=ring[i+1],h=i===0||i===1?7.6:5.8;wall(a,c,0,.6,'stone',{},-1);wall(a,c,.6,h,'brick',{floors:i===2||i===3?1:0,bays:i===2?12:0,margin:.18,trim:'trim'},-1);}
 cap(ring,5.65,'roof');
 // Southwest storefront lies on its mapped slightly skew edge.
 const A=ring[5],C=ring[0],at=(z,xoff=0,y=0)=>{const f=(z-A[1])/(C[1]-A[1]);return[A[0]+(C[0]-A[0])*f+xoff,y,z];};
 function patch(mat,z0,z1,y0,y1,xoff=0){face(mat,[at(z0,xoff,y0),at(z1,xoff,y0),at(z1,xoff,y1),at(z0,xoff,y1)],[-1,0,0]);}
 const start=8.3,end=28.5,bays=8,pitch=(end-start)/bays;
 for(let j=0;j<bays;j++){const z0=start+j*pitch,z1=z0+pitch,door=j===1||j===5,back=door?1.1:0;
 patch('stone',z0,z1,0,.65);patch('trim',z0,z1,.65,1.1);patch('trim',z0,z1,4.05,4.23);patch('trim',z0,z1,5.35,5.55);for(const z of[z0,z1-.18])patch('trim',z,z+.18,1.1,5.35);
 patch('glass',z0+.18,z1-.18,1.1,4.05,back);patch('glass',z0+.18,z1-.18,4.23,5.35,back);
 if(door){for(const z of[z0+.18,z1-.18])face('trim',[at(z,0,.65),at(z,back,.65),at(z,back,5.35),at(z,0,5.35)],[0,0,z===z0+.18?1:-1]);face('trim',[at(z0+.18,0,5.35),at(z1-.18,0,5.35),at(z1-.18,back,5.35),at(z0+.18,back,5.35)],[0,-1,0]);const m=(z0+z1)/2;b.bar('metal',at(m,back,1.1),at(m,back,4.05),.11);}
 patch('dark',z0,z1,5.55,7.0);patch('trim',z0,z1,7,7.13);patch('brick',z0,z1,7.13,7.65);patch('roof',z0,z1,7.65,7.9);
 const mid=(z0+z1)/2;for(const[y,depth]of[[7.20,.36],[7.55,.50]])b.box('brick',at(mid,-depth/2,y),[depth,.14,pitch]);
 const p=at(z0,-.08,3.1);b.box('metal',p,[.18,4.9,.17]);for(let z=z0+.15;z<z1;z+=.45)b.box('brick',at(z,-.1,7.48),[.2,.22,.27]);
 }
 // Lower market display windows and a thin sloping canopy. Fascia is deliberately unlettered.
 const m0=A[1],m1=start;
 patch('brick',m0,m1,0,.6);wall([A[0],m0],[at(m1)[0],m1],.6,4.3,'brick',{floors:1,bays:10,margin:.17,trim:'trim'},-1);patch('trim',m0,m1,4.3,4.55);patch('dark',m0,m1,4.55,5.52);patch('trim',m0,m1,5.52,5.8);patch('roof',m0,m1,5.8,6.2);
 const p0=at(m0,-1,4.3),p1=at(m1,-1,4.3),q0=at(m0,0,4.8),q1=at(m1,0,4.8);face('roof',[p0,p1,q1,q0],[0,1,0]);face('roof',[[p0[0],4.12,p0[2]],[q0[0],4.62,q0[2]],[q1[0],4.62,q1[2]],[p1[0],4.12,p1[2]]],[0,-1,0]);
 // Raised connected entry terrace and low stair, limited to the storefront frontage.
 prism(rect(3.5,20.2,-28.2,18.4),0,.65,'stone');for(let i=0;i<4;i++)prism(rect(.5,5,-30.2-i*.5,18.4),0,.65-i*.125,'stone');
 // Higher retail roof only, behind the parapet.
 cap([ring[0],ring[1],ring[2],[-26.1,10.8]],7.6,'roof');
 return flush(0.40142572795869574);
}
