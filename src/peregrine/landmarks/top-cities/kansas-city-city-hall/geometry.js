import {SPEC,PALETTES} from './config.js';
import {LOCAL_RINGS} from './footprint.js';
import {tools} from './kansas-city-city-hall-parts.js';
export function create({detail='near'}={}){
const {near,face,cap,solid,loft,rect,gable,box,bar,finish}=tools(SPEC,PALETTES,detail);
const raw=LOCAL_RINGS[0],theta=Math.atan2(raw[3][1]-raw[2][1],raw[3][0]-raw[2][0])-Math.PI/2,R=raw.map(([x,z])=>[x*Math.cos(theta)+z*Math.sin(theta),-x*Math.sin(theta)+z*Math.cos(theta)]),cx=(Math.min(...R.map(p=>p[0]))+Math.max(...R.map(p=>p[0])))/2,cz=(R[3][1]+R[12][1])/2;
function bands(r,lo,hi,bottom,top,rows,pitch){const sg=Math.sign(r.reduce((s,p,i)=>s+p[0]*r[(i+1)%r.length][1]-r[(i+1)%r.length][0]*p[1],0));for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length],L=Math.hypot(c[0]-a[0],c[1]-a[1]);if(L<.001)continue;const n=[sg*(c[1]-a[1]),0,sg*(a[0]-c[0])],P=(s,y)=>[a[0]+(c[0]-a[0])*s/L,y,a[1]+(c[1]-a[1])*s/L],patch=(m,s,t,y,z)=>{if(t>s&&z>y)face(m,[P(s,y),P(t,y),P(t,z),P(s,z)],n)},N=L<3?0:Math.max(1,Math.round(L/pitch)),p=N?L/N:L;patch('stone',0,L,lo,bottom);if(!N){patch('stone',0,L,bottom,hi);continue;}const dy=(top-bottom)/rows;for(let j=0;j<N;j++){const mid=(j+.5)*p,a=mid-p*.18,c=mid+p*.18;patch('stone',j*p,a,bottom,top);patch('stone',c,(j+1)*p,bottom,top);for(let k=0;k<rows;k++){const y=bottom+k*dy;patch('glass',a,c,y,y+dy*.72);patch('bronze',a,c,y+dy*.72,y+dy);}}patch('stone',0,L,top,hi);}cap('roof',r,hi);cap('stone',r,lo,-1);}
// Exact mapped base, with five glazed office rows below the abstracted plain frieze.
bands(R,0,26.8,1.2,23.4,5,near?4.0:5.1);
// Published tower plan, then successive mapped-axis crown setbacks.
bands(rect(cx,cz,37.6428,29.5656),26.8,113.5,27.8,112.0,20,5.3);bands(rect(cx,cz,33.8,26),113.5,122.4,114.1,121.7,2,5.0);bands(rect(cx,cz,30,23.4),122.4,133,124.4,131.2,1,4.7);solid(rect(cx,cz,27.5,21),133,135.0264,'stone','roof');
// The roof flagstaff is retained as a thin plain mast, with noflag or emblem.
loft([{x:cx,z:cz,y:135.0264,r:.16},{x:cx,z:cz,y:140.4,r:.10},{x:cx,z:cz,y:144.0264,r:.045}],'steel',8);return finish(-theta);

}
