import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './place-bell-laval-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
// Use two control vertices of the mapped long northern facade for the baked rotation.
const theta=Math.atan2(LOCAL_RINGS[0][57][1]-LOCAL_RINGS[0][56][1],LOCAL_RINGS[0][57][0]-LOCAL_RINGS[0][56][0]);
const ring=LOCAL_RINGS[0].map(([x,z])=>[x*Math.cos(theta)+z*Math.sin(theta),-x*Math.sin(theta)+z*Math.cos(theta)]);
solid(ring,0,6.8,'base','roof',{bottom:.5,top:6.2,dy:5.4,h:4.8,pitch:near?3.3:6,ratio:.76});
// Upper bowl is a rounded superellipse with a nearly unbroken pale metal skin.
const n=near?64:32,R=Array.from({length:n},(_,i)=>{const a=2*Math.PI*i/n,c=Math.cos(a),s=Math.sin(a);return [-48+55*Math.sign(c)*Math.abs(c)**.75,-2+54*Math.sign(s)*Math.abs(s)**.75]});
const bottom=i=>6.8+4.2*Math.max(0,Math.sin(2*Math.PI*i/n+.5));
for(let i=0;i<n;i++){const j=(i+1)%n,a=R[i],c=R[j],lo=bottom(i),hi=bottom(j),out=[c[1]-a[1],0,a[0]-c[0]];
face('cladding',[[a[0],lo,a[1]],[c[0],hi,c[1]],[c[0],23.7,c[1]],[a[0],23.7,a[1]]],out);
face('frame',[[a[0],6.8,a[1]],[c[0],6.8,c[1]],[c[0],hi,c[1]],[a[0],lo,a[1]]],out);
}cap('cladding',R,23.7);
// Shallow faceted crown keeps the real arena's low roof; it is not a spherical dome.
const inner=R.map(([x,z])=>[-48+(x+48)*.65,-2+(z+2)*.65]);for(let i=0;i<n;i++){const j=(i+1)%n;face('roof',[[R[i][0],23.7,R[i][1]],[R[j][0],23.7,R[j][1]],[inner[j][0],26,inner[j][1]],[inner[i][0],26,inner[i][1]]],[0,1,0]);}cap('roof',inner,26);
// Low community ice halls and angular entrance cover; all sit on the common ground-floor shell.
solid(rect(39,-12,59,91),6.8,10.5,'cladding','roof');
const canopy=[[-5,-63],[67,-62],[67,-52],[-5,-52]];solid(canopy,6.8,7.8,'frame','frame');
// Entry glazing is cut into lower walls; separate modest panes survive in far LOD.
return finish(-theta);

}
