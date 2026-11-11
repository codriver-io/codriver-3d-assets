import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './red-brick-courthouse-rockville-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
const raw=LOCAL_RINGS[0],theta=Math.atan2(raw[3][1]-raw[1][1],raw[3][0]-raw[1][0]),R=raw.map(([x,z])=>[x*Math.cos(theta)+z*Math.sin(theta),-x*Math.sin(theta)+z*Math.cos(theta)]),u0=Math.min(...R.map(p=>p[0])),u1=Math.max(...R.map(p=>p[0])),v0=Math.min(...R.map(p=>p[1])),v1=Math.max(...R.map(p=>p[1])),uc=(u0+u1)/2,tc=v0+3.6;
function clip(r,b){let q=[];for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length],ia=a[1]>=b,ic=c[1]>=b;if(ia)q.push(a);if(ia!==ic){const t=(b-a[1])/(c[1]-a[1]);q.push([a[0]+t*(c[0]-a[0]),b]);}}return q;}
const body=clip(R,v0+1.7);solid(body,0,1.8,'stone');solid(body,1.8,11.7,'brick','slate',{bottom:2.3,top:11.1,dy:4.4,h:3.2,pitch:near?3.5:5.2,ratio:.43});
// The main roof is genuinely hipped, with a narrow ridge below the tower.
const B=rect(uc,(v0+1.7+v1)/2,u1-u0,v1-v0-1.7),Q=rect(uc,(v0+1.7+v1)/2,.2,v1-v0-11.7);for(let i=0;i<4;i++){const k=(i+1)%4;face('slate',[[B[i][0],11.7,B[i][1]],[B[k][0],11.7,B[k][1]],[Q[k][0],16.4,Q[k][1]],[Q[i][0],16.4,Q[i][1]]],[0,1,0]);}cap('slate',Q,16.4);
const tower=rect(uc,tc,7.2,7.2);solid(tower,0,1.8,'stone');
// Facade tiles include the grand round-headed entrance light, triplet windows and recessed clock discs.
for(let e=0;e<4;e++){const a=tower[e],b=tower[(e+1)%4],n=[b[1]-a[1],0,a[0]-b[0]],P=(s,y)=>[a[0]+(b[0]-a[0])*s/7.2,y,a[1]+(b[1]-a[1])*s/7.2],patch=(m,s,t,lo,hi)=>face(m,[P(s,lo),P(t,lo),P(t,hi),P(s,hi)],n);
 function row(lo,hi,centres,w,arch){const sorted=centres.map(x=>[x-w/2,x+w/2]);let last=0;for(const[s,t]of sorted){patch('brick',last,s,lo,hi);const r=w/2,cy=arch?hi-r:hi;patch('glass',s,t,lo,cy);if(arch)for(let i=0;i<(near?10:6);i++){const N=near?10:6,x=s+w*i/N,z=s+w*(i+1)/N,Y=x=>cy+Math.sqrt(Math.max(0,r*r-(x-(s+t)/2)**2));face('glass',[P(x,cy),P(z,cy),P(z,Y(z)),P(x,Y(x))],n);face('brick',[P(x,Y(x)),P(z,Y(z)),P(z,hi),P(x,hi)],n);}last=t;}patch('brick',last,7.2,lo,hi);}
 patch('brick',0,7.2,1.8,2.1);row(2.1,5.2,[3.6],2.1,false);patch('stone',0,7.2,5.2,5.55);row(5.55,13.2,[3.6],3.5,true);patch('brick',0,7.2,13.2,14.7);row(14.7,18.4,[2.1,3.6,5.1],1.05,true);patch('stone',0,7.2,18.4,18.65);patch('brick',0,7.2,18.65,20.2);row(20.2,21.3,[2.1,3.6,5.1],1.05,false);patch('brick',0,7.2,21.3,22.1);
 // White clock face replaces brick in the actual wall plane; dark cross hands are simple geometric tiles.
 const r=.58,cy=23.05,N=near?20:12;patch('brick',0,3.6-r,22.1,24.3);patch('brick',3.6+r,7.2,22.1,24.3);for(let j=0;j<N;j++){const x=3.6-r+2*r*j/N,z=3.6-r+2*r*(j+1)/N,Y=x=>Math.sqrt(Math.max(0,r*r-(x-3.6)**2));face('clock',[P(x,cy-Y(x)),P(z,cy-Y(z)),P(z,cy+Y(z)),P(x,cy+Y(x))],n);face('brick',[P(x,22.1),P(z,22.1),P(z,cy-Y(z)),P(x,cy-Y(x))],n);face('brick',[P(x,cy+Y(x)),P(z,cy+Y(z)),P(z,24.3),P(x,24.3)],n);}patch('stone',0,7.2,24.3,24.8);const L=Math.hypot(n[0],n[2]),hand=(s,t,lo,hi)=>face('glass',[P(s,lo),P(t,lo),P(t,hi),P(s,hi)].map(p=>[p[0]+n[0]/L*.015,p[1],p[2]+n[2]/L*.015]),n);hand(3.57,3.63,23.02,23.48);hand(3.6,3.94,23.02,23.08);
}cap('stone',tower,24.8);
// Twelve separate belfry piers leave three genuine bays on each side.
const posts=[];for(const u of[-3.35,-1.12,1.12,3.35])for(const v of[-3.35,3.35])posts.push([uc+u,tc+v]);for(const u of[-3.35,3.35])for(const v of[-1.12,1.12])posts.push([uc+u,tc+v]);for(const[u,v]of posts)box('column',[u,25.925,v],[.5,2.25,.5]);
for(const[u,v,w,d]of[[uc,tc-3.35,7.2,.5],[uc,tc+3.35,7.2,.5],[uc-3.35,tc,.5,6.2],[uc+3.35,tc,.5,6.2]])solid(rect(u,v,w,d),27.05,27.3,'stone');
const roof=rect(uc,tc,6.65,6.65);for(let i=0;i<4;i++){const k=(i+1)%4;face('slate',[[roof[i][0],27.3,roof[i][1]],[roof[k][0],27.3,roof[k][1]],[uc,32.6,tc]],[0,1,0]);}cap('slate',roof,27.3,-1);loft([{x:uc,z:tc,y:32.6,r:.2},{x:uc,z:tc,y:33.1,r:.04}],'slate',8);for(const u of[-3.35,3.35])for(const v of[-3.35,3.35])solid(rect(uc+u,tc+v,.5,.5),27.3,27.9,'brick');
// Seven compact physical entry steps supplement the mapped facade footprint.
for(let i=0;i<7;i++){const front=v0-2.4+i*2.4/7,back=front+2.4/7;solid(rect(uc,(front+back)/2,4.2,back-front),0,(i+1)*.3,'stone');}return finish(-theta);

}
